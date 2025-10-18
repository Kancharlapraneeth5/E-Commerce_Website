import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRY = "1hr";
const REFRESH_TOKEN_EXPIRY = "7d";

export async function hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<Boolean>{
    return await bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: object): string{
    return jwt.sign(payload, process.env.JWT_SECRET as Secret, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: object): string{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as Secret, { expiresIn: REFRESH_TOKEN_EXPIRY })
}

