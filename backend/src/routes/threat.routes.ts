import { Router } from "express";
import { db } from "../db";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/admin";

const router = Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  (_req, res) => {
  const logs = db
    .prepare(`
      SELECT *
      FROM threat_logs
      ORDER BY created_at DESC
      LIMIT 100
    `)
    .all();

  res.json(logs);
  });

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  (_req, res) => {
  const total = db
    .prepare("SELECT COUNT(*) as count FROM threat_logs")
    .get() as any;

  const avgRisk = db
    .prepare(`
      SELECT AVG(risk_score) as avgRisk
      FROM threat_logs
    `)
    .get() as any;

  res.json({
    totalAttacks: total.count,
    averageRisk: Math.round(avgRisk.avgRisk || 0),
  });
});

export default router;