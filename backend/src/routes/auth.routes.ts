import { Router, Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { AuthService } from "../services/auth.service";
import {
  LoginRequest,
  RegisterRequest,
  ChangeEmailRequest,
  ChangePasswordRequest,
} from "../types";

const router = Router();

/* REGISTER */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const registerReq: RegisterRequest = req.body;
    const result = await AuthService.register(registerReq);
    res.status(201).json({
      message: "User created",
      ...result,
    });
  } catch (err: any) {
    if (err.message === "User already exists") {
      res.status(409).json({ message: err.message });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
});

/* LOGIN */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const loginReq: LoginRequest = req.body;
    const result = await AuthService.login(loginReq);
    res.json(result);
  } catch (err: any) {
    if (err.message === "Invalid credentials") {
      res.status(401).json({ message: err.message });
    } else {
      res.status(500).json({ error: "Login failed" });
    }
  }
});

/* ME */
router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId as number;
    const user = AuthService.getUser(userId);
    res.json(user);
  } catch (err: any) {
    if (err.message === "User not found") {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
});

/* CHANGE EMAIL */
router.post(
  "/change-email",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId as number;
      const changeEmailReq: ChangeEmailRequest = req.body;
      await AuthService.changeEmail(userId, changeEmailReq);
      res.json({ message: "Email updated successfully" });
    } catch (err: any) {
      if (err.message === "Email already in use") {
        res.status(409).json({ message: err.message });
      } else {
        res.status(500).json({ error: "Failed to update email" });
      }
    }
  }
);

/* CHANGE PASSWORD */
router.post(
  "/change-password",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId as number;
      const changePasswordReq: ChangePasswordRequest = req.body;
      await AuthService.changePassword(userId, changePasswordReq);
      res.json({ message: "Password updated successfully" });
    } catch (err: any) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Current password is incorrect") {
        res.status(401).json({ message: err.message });
      } else {
        res.status(500).json({ error: "Failed to change password" });
      }
    }
  }
);

export default router;
