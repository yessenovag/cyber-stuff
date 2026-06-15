import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "06271600000";

export function generateToken(
  userId: number,
  email: string,
  role: string
): string {
  return jwt.sign(
    {
      userId,
      email,
      role,
    } as JwtPayload,
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new Error("Invalid token");
  }
}

export function getJwtSecret(): string {
  return JWT_SECRET;
}