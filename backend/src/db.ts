import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "..", "..", "database.sqlite");
export const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("✅ SQLite connected");