import { Router, Response, Request } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { db } from "../db";

const router = Router();

/* Отправить feedback */
router.post("/", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5",
    });
  }

  db.prepare(`
    INSERT INTO feedback
    (user_id, rating, comment)
    VALUES (?, ?, ?)
  `).run(
    userId,
    rating,
    comment || ""
  );

  res.json({
    ok: true,
  });
});

/* Получить все feedback для админки */
router.get("/all", (_req: Request, res: Response) => {
  const feedbacks = db
    .prepare(`
      SELECT
        f.id,
        f.rating,
        f.comment,
        f.created_at,
        u.email
      FROM feedback f
      LEFT JOIN users u
        ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `)
    .all();

  res.json(feedbacks);
});

export default router;