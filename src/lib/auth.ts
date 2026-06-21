import type { D1Database } from '@cloudflare/workers-types';

// Session cookie name + a 30-day lifetime.
export const SESSION_COOKIE = 'gs_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
// Workers' free plan caps CPU time per request, so PBKDF2 iterations must stay modest.
// 100k is Cloudflare's own documented example value. (Raise on Workers Paid if desired.)
const PBKDF2_ITERATIONS = 100_000;

type UserRow = {
  id: number;
  username: string;
  pw_hash: string;
  pw_salt: string;
  created_at: number;
};

// ---- base64 helpers (Workers-compatible) ----
function bytesToB64(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function b64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const a = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
  return a;
}
function randomToken(byteLen = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLen));
  return bytesToB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---- password hashing (PBKDF2 / Web Crypto) ----
async function deriveHash(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return bytesToB64(new Uint8Array(bits));
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveHash(password, salt);
  return { hash, salt: bytesToB64(salt) };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const computed = await deriveHash(password, b64ToBytes(salt));
  return constantTimeEqual(computed, hash);
}

// ---- users ----
export async function countUsers(db: D1Database): Promise<number> {
  const row = await db.prepare('SELECT COUNT(*) AS n FROM users').first<{ n: number }>();
  return row?.n ?? 0;
}

export async function createUser(
  db: D1Database,
  username: string,
  password: string
): Promise<number> {
  const { hash, salt } = await hashPassword(password);
  const row = await db
    .prepare(
      'INSERT INTO users (username, pw_hash, pw_salt, created_at) VALUES (?, ?, ?, ?) RETURNING id'
    )
    .bind(username.trim(), hash, salt, Date.now())
    .first<{ id: number }>();
  return row!.id;
}

export async function verifyLogin(
  db: D1Database,
  username: string,
  password: string
): Promise<AdminUser | null> {
  const u = await db
    .prepare('SELECT * FROM users WHERE username = ?')
    .bind(username.trim())
    .first<UserRow>();
  if (!u) return null;
  const ok = await verifyPassword(password, u.pw_hash, u.pw_salt);
  return ok ? { id: u.id, username: u.username } : null;
}

export async function listUsers(db: D1Database): Promise<AdminUser[]> {
  const { results } = await db
    .prepare('SELECT id, username FROM users ORDER BY username')
    .all<AdminUser>();
  return results;
}

export async function deleteUser(db: D1Database, id: number): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id).run();
  await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
}

export async function setPassword(db: D1Database, id: number, password: string): Promise<void> {
  const { hash, salt } = await hashPassword(password);
  await db
    .prepare('UPDATE users SET pw_hash = ?, pw_salt = ? WHERE id = ?')
    .bind(hash, salt, id)
    .run();
  // Changing the password logs out any existing sessions for that user.
  await destroyUserSessions(db, id);
}

/** Revoke all sessions for a user (on password change / account delete). */
export async function destroyUserSessions(db: D1Database, userId: number): Promise<void> {
  await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(userId).run();
}

// ---- sessions ----
export async function createSession(db: D1Database, userId: number): Promise<string> {
  const token = randomToken();
  await db
    .prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(token, userId, Date.now() + SESSION_TTL_MS)
    .run();
  return token;
}

export async function getSessionUser(
  db: D1Database,
  token: string | undefined
): Promise<AdminUser | null> {
  if (!token) return null;
  const row = await db
    .prepare(
      `SELECT s.expires_at AS expires_at, u.id AS id, u.username AS username
       FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?`
    )
    .bind(token)
    .first<{ expires_at: number; id: number; username: string }>();
  if (!row) return null;
  if (row.expires_at < Date.now()) {
    await destroySession(db, token);
    return null;
  }
  return { id: row.id, username: row.username };
}

export async function destroySession(db: D1Database, token: string | undefined): Promise<void> {
  if (!token) return;
  await db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

// Cookie options — Secure only in production so http://localhost dev works.
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  };
}
