import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import aiRoutes from "./routes/ai";
import chatRoutes from "./routes/chat.routes";
import feedbackRoutes from "./routes/feedback.routes";
import threatRoutes from "./routes/threat.routes";

import "./db";
import { db } from "./db";

const app = express();

/* CHECK ADMIN */
app.get("/check-admin", (_req, res) => {
  const user = db
    .prepare(`
      SELECT id, email, role
      FROM users
      WHERE email = ?
    `)
    .get("admin69645@cybersafe.local");

  res.json(user);
});

/* MIDDLEWARE */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://cybersafe-frontend-v1-etg0fdcrf7abgng3.spaincentral-01.azurewebsites.net"],
    credentials: true,
  })
);

app.use(express.json());

/* ROOT */
app.get("/", (_req, res) => {
  res.send("CyberSafe backend running");
});

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/threats", threatRoutes);

/* ERROR HANDLER */
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something broke!",
  });
});

/* START SERVER */
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});