-- Phase 2 CMS schema (Cloudflare D1 / SQLite)

-- Per-user admin accounts
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT NOT NULL UNIQUE,
  pw_hash    TEXT NOT NULL,
  pw_salt    TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Server-side sessions (cookie holds only the opaque token)
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

-- One JSON document per content section, with draft + published copies.
-- sections: business, hero, services, portfolio, reviews, about
CREATE TABLE IF NOT EXISTS content (
  section        TEXT PRIMARY KEY,
  published_json TEXT,
  draft_json     TEXT,
  updated_at     INTEGER NOT NULL
);
