import type { D1Database } from '@cloudflare/workers-types';
import { readSection } from '../../lib/db';

// Hero section content. Video sources are placeholders — Goldstar has no footage
// yet, so the poster (a real Goldstar project photo) carries the hero until
// license-clean stock is dropped into /public/video/. (PROJECT_BRIEF §10)

export type HeroCta = { label: string; href: string };

export type Hero = {
  headline: string;
  subhead: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  poster: string;
  videoSources: { src: string; type: string }[];
};

const hero: Hero = {
  headline: 'Premium landscapes, built to last in Central Texas.',
  subhead:
    'Retaining walls, paver patios, stone work, drainage and design-build — crafted by a crew known for detail and follow-through across the Austin metro.',
  primaryCta: { label: 'Get a free design consult', href: '#contact' },
  secondaryCta: { label: 'Call (512) 400-8451', href: 'tel:+15124008451' },
  poster: '/images/hero-poster.jpg',
  // TODO: add /public/video/hero.webm + hero.mp4 (1080p, <5MB, ~10s loop, no audio).
  videoSources: [
    { src: '/video/hero.webm', type: 'video/webm' },
    { src: '/video/hero.mp4', type: 'video/mp4' },
  ],
};

export async function getHero(
  db?: D1Database,
  opts?: { preview?: boolean }
): Promise<Hero> {
  if (db) {
    const fromDb = await readSection<Hero>(db, 'hero', opts?.preview);
    if (fromDb) return fromDb;
  }
  return hero;
}
