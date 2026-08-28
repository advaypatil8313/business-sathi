import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbDir = path.dirname(path.resolve(env.dbPath));
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

export const db = new Database(env.dbPath);
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

// Migration for databases created before Milestone 2 (new tables above are
// created automatically via CREATE TABLE IF NOT EXISTS; this column needs
// an explicit ALTER TABLE since it was added to an existing table).
const businessCols = db.prepare("PRAGMA table_info(businesses)").all();
if (!businessCols.some((c) => c.name === 'low_stock_threshold')) {
  db.exec('ALTER TABLE businesses ADD COLUMN low_stock_threshold INTEGER DEFAULT 5');
}

export default db;
