import express from "express";
import PeopleModel from "../models/peopleModelImpl";
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from "./authUtils";
import jwt, { Secret } from "jsonwebtoken";

const router = express.Router();

// 🟢 Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = await PeopleModel.findOne({ username });
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const tokenPayload = { id: user.id };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // ✅ Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
});

// 🟢 Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  const user = await PeopleModel.findOne({ refreshToken });
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
  const user = await PeopleModel.findOne({ refreshToken });

  if (user) {
    user.refreshToken = null;
    await user.save();
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
    const user = await PeopleModel.findById((decoded as { id: string }).id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});

export const authRouter = router;
