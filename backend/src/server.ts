import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import aiRoutes from "./routes/ai";

import "./db";

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* ===== ROOT ===== */
app.get("/", (_, res) => {
  res.send("CyberSafe backend running");
});

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/ai", aiRoutes);   // 🤖 AI ENDPOINT

/* ===== START SERVER ===== */
app.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
