import type { D1Database } from '@cloudflare/workers-types';

// Content is stored as one JSON document per section, with a draft + published copy.
export type ContentSection =
  | 'business'
  | 'hero'
  | 'services'
  | 'portfolio'
  | 'reviews'
  | 'about';

export const CONTENT_SECTIONS: ContentSection[] = [
  'business',
  'hero',
  'services',
  'portfolio',
  'reviews',
  'about',
];

type ContentRow = {
  published_json: string | null;
  draft_json: string | null;
};

/**
 * Returns the stored JSON string for a section, or null if the section has no row yet.
 * `preview` reads the draft (falling back to published); otherwise reads published.
 */
export async function readSectionJson(
  db: D1Database,
  section: ContentSection,
  preview = false
): Promise<string | null> {
  const row = await db
    .prepare('SELECT published_json, draft_json FROM content WHERE section = ?')
    .bind(section)
    .first<ContentRow>();
  if (!row) return null;
  if (preview) return row.draft_json ?? row.published_json ?? null;
  return row.published_json ?? null;
}

/** Parse a section's stored JSON into T, or return null if absent/unparseable. */
export async function readSection<T>(
  db: D1Database,
  section: ContentSection,
  preview = false
): Promise<T | null> {
  const json = await readSectionJson(db, section, preview);
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** For editors: the draft if present, else the published copy, else null. */
export async function readEditable<T>(
  db: D1Database,
  section: ContentSection
): Promise<T | null> {
  return readSection<T>(db, section, true);
}

/** Upsert the draft copy for a section. */
export async function saveDraft(
  db: D1Database,
  section: ContentSection,
  data: unknown
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO content (section, draft_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(section) DO UPDATE SET draft_json = excluded.draft_json, updated_at = excluded.updated_at`
    )
    .bind(section, JSON.stringify(data), Date.now())
    .run();
}

/** Promote the draft to published for a section. */
export async function publish(db: D1Database, section: ContentSection): Promise<void> {
  await db
    .prepare(
      `UPDATE content SET published_json = COALESCE(draft_json, published_json), updated_at = ?
       WHERE section = ?`
    )
    .bind(Date.now(), section)
    .run();
}

export async function publishAll(db: D1Database): Promise<void> {
  await db
    .prepare(
      `UPDATE content SET published_json = COALESCE(draft_json, published_json), updated_at = ?`
    )
    .bind(Date.now())
    .run();
}

export type SectionStatus = {
  section: ContentSection;
  exists: boolean;
  hasUnpublished: boolean;
};

/** Per-section status for the dashboard (does it exist, are there unpublished edits). */
export async function sectionStatuses(db: D1Database): Promise<SectionStatus[]> {
  const { results } = await db
    .prepare('SELECT section, published_json, draft_json FROM content')
    .all<{ section: ContentSection } & ContentRow>();
  const byName = new Map(results.map((r) => [r.section, r]));
  return CONTENT_SECTIONS.map((section) => {
    const row = byName.get(section);
    return {
      section,
      exists: !!row,
      hasUnpublished:
        !!row && row.draft_json !== null && row.draft_json !== row.published_json,
    };
  });
}
