import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { db } from "../db";

const router = Router();

// Получить все чаты юзера
router.get("/", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const chats = db
    .prepare("SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId);
  res.json(chats);
});

// Создать новый чат
router.post("/", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { title } = req.body;
  const result = db
    .prepare("INSERT INTO chats (user_id, title) VALUES (?, ?)")
    .run(userId, title || "New chat") as any;
  res.json({ id: result.lastInsertRowid, title: title || "New chat" });
});

// Переименовать чат
router.patch("/:chatId/title", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { chatId } = req.params;
  const { title } = req.body;
  db.prepare("UPDATE chats SET title = ? WHERE id = ? AND user_id = ?")
    .run(title, chatId, userId);
  res.json({ ok: true });
});

// Удалить чат
router.delete("/:chatId", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { chatId } = req.params;
  db.prepare("DELETE FROM messages WHERE chat_id = ? AND user_id = ?").run(chatId, userId);
  db.prepare("DELETE FROM chats WHERE id = ? AND user_id = ?").run(chatId, userId);
  res.json({ ok: true });
});

// Получить сообщения чата
router.get("/:chatId/messages", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { chatId } = req.params;
  const messages = db
    .prepare("SELECT role, content FROM messages WHERE chat_id = ? AND user_id = ? ORDER BY created_at ASC")
    .all(chatId, userId);
  res.json(messages);
});

// Сохранить сообщение
router.post("/:chatId/messages", authMiddleware, (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { chatId } = req.params;
  const { role, content } = req.body;
  db.prepare("INSERT INTO messages (chat_id, user_id, role, content) VALUES (?, ?, ?, ?)")
    .run(chatId, userId, role, content);
  res.json({ ok: true });
});

export default router;