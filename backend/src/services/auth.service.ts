import bcryptjs from "bcryptjs";
import { db } from "../db";
import { generateToken } from "../utils/jwt";
import {
  User,
  UserPublic,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ChangePasswordRequest,
  ChangeEmailRequest,
} from "../types";

export class AuthService {
  static async register(req: RegisterRequest): Promise<AuthResponse> {
    const { email, password } = req;

    // Check if user exists
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email) as any;

    if (existing) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert user
    const result = db
      .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
      .run(email, hashedPassword) as any;

    // Generate token
    const token = generateToken(
      result.lastInsertRowid as number,
      email,
      "user"
    );

    return {
      token,
      user: {
        id: result.lastInsertRowid as number,
        email,
      },
    };
  }

  static async login(req: LoginRequest): Promise<AuthResponse> {
    const { email, password } = req;

    // Find user
    const user = db
      .prepare("SELECT id, email, password, role FROM users WHERE email = ?")
      .get(email) as User | undefined;

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken(
      user.id,
      user.email,
      (user as any).role
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  static getUser(userId: number): UserPublic {
    const user = db
      .prepare("SELECT id, email FROM users WHERE id = ?")
      .get(userId) as UserPublic | undefined;

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async changeEmail(userId: number, req: ChangeEmailRequest): Promise<void> {
    const { email } = req;

    // Check if email is already in use
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .get(email, userId) as any;

    if (existing) {
      throw new Error("Email already in use");
    }

    // Update email
    db.prepare("UPDATE users SET email = ? WHERE id = ?").run(email, userId);
  }

  static async changePassword(
    userId: number,
    req: ChangePasswordRequest
  ): Promise<void> {
    const { currentPassword, newPassword } = req;

    // Get user
    const user = db
      .prepare("SELECT password FROM users WHERE id = ?")
      .get(userId) as Pick<User, "password"> | undefined;

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(
      hashedPassword,
      userId
    );
  }
}
