import type { D1Database } from '@cloudflare/workers-types';
import { getDB } from './cf';

// Resolves the per-request content context for the public site:
//  - db: the Cloudflare D1 binding (getters fall back to built-in defaults if absent)
//  - opts.preview: true only when a logged-in admin appends ?preview=1, so drafts
//        render for them but never for the public.
export function siteContext(astro: { locals: App.Locals; url: URL }): {
  db: D1Database | undefined;
  opts: { preview: boolean };
} {
  const db = getDB();
  const preview =
    astro.url.searchParams.get('preview') === '1' && !!astro.locals.user;
  return { db, opts: { preview } };
}
