import { env } from 'cloudflare:workers';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

// Astro v6 + @astrojs/cloudflare access bindings via the `cloudflare:workers`
// module (Astro.locals.runtime.env was removed). Read lazily inside functions so
// the binding is resolved at request time, not at import/build time.
export function getDB(): D1Database {
  return env.DB as unknown as D1Database;
}

export function getMedia(): R2Bucket {
  return env.MEDIA as unknown as R2Bucket;
}
