import express from "express";
import { chatWithAI } from "../controllers/ai.controller";
import { promptFirewall } from "../middleware/promptFirewall";

const router = express.Router();

router.post(
  "/chat",
  promptFirewall,
  chatWithAI
);

export default router;