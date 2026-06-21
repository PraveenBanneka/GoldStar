import type { D1Database } from '@cloudflare/workers-types';
import { readSection } from '../../lib/db';

// About copy. Grounded in real, verifiable facts (owner name, 10+ years, service
// area, the work the reviews describe). Kept honest — no invented awards or claims.
// Swap for Goldstar's own story when they provide it. (SCRAPE_NOTES §4, §6)

export type About = {
  heading: string;
  lead: string;
  paragraphs: string[];
  highlights: { label: string; value: string }[];
};

const about: About = {
  heading: 'Central Texas landscaping, done right the first time',
  lead:
    'Goldstar Landscaping is a Georgetown-based design-build and hardscaping crew led by Yefri Flores, serving the greater Austin metro for over a decade.',
  paragraphs: [
    'We focus on the work that genuinely transforms a property — retaining walls, paver and flagstone hardscape, stone masonry, drainage and grading, and full landscape design and installation. Whether it’s fixing a builder’s drainage defect, laying fresh sod, or building out a new yard from bare dirt, we treat every project like it’s our own.',
    'Homeowners, builders and commercial clients keep coming back for the same reasons our reviews mention again and again: responsiveness, fair and competitive pricing, finishing on schedule, and an obsessive attention to detail. We’d rather earn a neighbor’s referral than chase the next quick job.',
  ],
  highlights: [
    { label: 'Years serving Central Texas', value: '10+' },
    { label: 'Average customer rating', value: '4.9★' },
    { label: 'Verified five-star reviews', value: '190+' },
  ],
};

export async function getAbout(
  db?: D1Database,
  opts?: { preview?: boolean }
): Promise<About> {
  if (db) {
    const fromDb = await readSection<About>(db, 'about', opts?.preview);
    if (fromDb) return fromDb;
  }
  return about;
}
