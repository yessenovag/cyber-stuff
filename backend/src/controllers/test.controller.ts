import { Request, Response } from "express";
import { db } from "../db";

export const testDb = async (req: Request, res: Response) => {
  try {
    const result = db.prepare("SELECT * FROM users").all();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "DB error", details: error });
  }
};
