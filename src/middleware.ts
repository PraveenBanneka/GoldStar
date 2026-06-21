import { defineMiddleware } from 'astro:middleware';
import { getSessionUser, SESSION_COOKIE } from './lib/auth';
import { getDB } from './lib/cf';

// Resolves the logged-in admin (if any) for every request and guards /admin/**.
// Public admin routes (login, first-run setup) are reachable without a session.
export const onRequest = defineMiddleware(async (context, next) => {
  const db = getDB();
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  context.locals.user = db ? await getSessionUser(db, token) : null;

  const path = context.url.pathname;
  if (path === '/admin' || path.startsWith('/admin/')) {
    const isPublicAdmin = path === '/admin/login' || path === '/admin/setup';
    if (!isPublicAdmin && !context.locals.user) {
      return context.redirect('/admin/login');
    }
  }

  return next();
});
