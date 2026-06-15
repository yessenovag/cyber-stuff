import { Request, Response, NextFunction } from "express";
import { db } from "../db";

const suspiciousPatterns = [
  /ignore.*previous.*instructions/i,
  /reveal.*system.*prompt/i,
  /show.*hidden.*prompt/i,
  /act.*as.*administrator/i,
  /forget.*your.*rules/i,
  /developer mode/i,
];

export const promptFirewall = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  console.log("🔥 FIREWALL HIT");
  console.log(req.body);

  if (!message) {
    return next();
  }

  const isAttack = suspiciousPatterns.some((pattern) =>
    pattern.test(message)
  );

  if (isAttack) {
    db.prepare(`
      INSERT INTO threat_logs
      (message, risk_score, status)
      VALUES (?, ?, ?)
    `).run(
      message,
      95,
      "BLOCKED"
    );

    return res.status(403).json({
      error: "Potential prompt injection detected",
      riskScore: 95,
    });
  }

  next();
};