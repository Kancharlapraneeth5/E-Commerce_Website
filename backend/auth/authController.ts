import express from "express";
import { getUserById, getUserByUsername } from "../models/peopleModel";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "./authUtils";
import jwt, { Secret } from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// 🟢 Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = await getUserByUsername(username);
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const tokenPayload = { id: user.id };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // ✅ Save refresh token
  await prisma.people.update({ where: { id: user.id }, data: { refreshToken } });

  res.json({ accessToken, refreshToken });
});

// 🟢 Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  const user = await prisma.people.findFirst({ where: { refreshToken } });
  if (!user) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  const tokenPayload = { id: user.id };
  const accessToken = generateAccessToken(tokenPayload);

  res.json({ accessToken });
});

// 🟢 Logout
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  const user = await prisma.people.findFirst({ where: { refreshToken } });
  if (user) {
    await prisma.people.update({ where: { id: user.id }, data: { refreshToken: null } });
  }

  res.json({ message: "User logged out" });
});

// 🟢 Request password reset (TBD with RabbitMQ - mail sending)
router.post("/request-passwordreset", async (req, res) => {
  const { email } = req.body;
  res.json({ message: `Password link sent to ${email}` });
});

// 🟢 Reset password
router.post("/passwordreset", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is mandatory to reset password" });
  }
  if (!newPassword) {
    return res.status(400).json({ error: "newPassword is mandatory" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
    const user = await getUserById((decoded as { id: number }).id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await prisma.people.update({ where: { id: user.id }, data: { password: await hashPassword(newPassword) } });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});

export const authRouter = router;
