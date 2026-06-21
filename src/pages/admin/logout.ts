import type { APIRoute } from 'astro';
import { destroySession, SESSION_COOKIE } from '../../lib/auth';
import { getDB } from '../../lib/cf';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const db = getDB();
  const token = cookies.get(SESSION_COOKIE)?.value;
  if (db) await destroySession(db, token);
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return redirect('/admin/login');
};
// POST-only on purpose: a GET logout could be triggered cross-site (e.g. an <img>),
// forcibly logging the admin out. The admin UI submits logout via a POST form.
