import { getMedia } from './cf';
import { slugify } from './editor';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

/**
 * Store an uploaded image in R2 and return its public `/media/<key>` path.
 * Returns ok:false with a reason for empty/oversized/unsupported files.
 */
export async function uploadImage(
  file: FormDataEntryValue | null,
  prefix = 'uploads'
): Promise<UploadResult> {
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'empty' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'too large (max 8 MB)' };
  const ext = EXT[file.type];
  if (!ext) return { ok: false, error: 'unsupported type' };

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'img';
  const key = `${prefix}/${Date.now().toString(36)}-${base}.${ext}`;
  await getMedia().put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  return { ok: true, path: `/media/${key}` };
}
