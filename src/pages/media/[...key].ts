import type { APIRoute } from 'astro';
import { getMedia } from '../../lib/cf';

// Streams uploaded images out of the R2 bucket at /media/<key>.
// Only the prefixes we upload into are served, so the bucket can't be enumerated
// for arbitrary objects through this public route.
const ALLOWED_PREFIX = /^(uploads|services|portfolio)\//;

export const GET: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key || !ALLOWED_PREFIX.test(key)) return new Response('Not found', { status: 404 });

  const object = await getMedia().get(key);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers as unknown as Headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=3600');
  return new Response(object.body as unknown as BodyInit, { headers });
};
