import type { D1Database } from '@cloudflare/workers-types';
import { readSection } from '../../lib/db';

// Business-wide facts. Source of truth for name, contact, service area, socials,
// and the aggregate rating. Every other content module + component pulls from here.
//
// Phase 2: getBusiness() becomes a D1 query; the const below goes away. Components
// must only ever call getBusiness(), never read `business` directly. (PROJECT_BRIEF §9)

export type SocialLink = { label: string; href: string };

export type Rating = {
  value: number;
  count: number;
  source: string;
  sourceHref: string;
};

export type Business = {
  name: string;
  tagline: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  yearsInBusiness: string;
  baseCity: string;
  serviceArea: string[];
  hours: string;
  rating: Rating;
  socials: SocialLink[];
  logo: string;
};

const business: Business = {
  name: 'Goldstar Landscaping',
  tagline: 'Design & build landscaping and hardscaping for Central Texas.',
  phoneDisplay: '(512) 400-8451',
  phoneHref: 'tel:+15124008451',
  email: 'info@goldstarlandscaping.net',
  yearsInBusiness: '10+ years',
  baseCity: 'Georgetown, TX',
  serviceArea: [
    'Austin',
    'Round Rock',
    'Cedar Park',
    'Liberty Hill',
    'Leander',
    'Pflugerville',
    'Hutto',
    'Georgetown',
  ],
  // Not published on the current site — placeholder until Goldstar confirms.
  hours: 'Call for availability — Mon–Sat',
  rating: {
    value: 4.9,
    count: 194,
    source: 'Thumbtack',
    sourceHref:
      'https://www.thumbtack.com/tx/georgetown/lawn-care/gold-star-landscaping/service/447043822060593154',
  },
  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/goldstarlandscaping.net' },
    { label: 'Yelp', href: 'https://www.yelp.com/biz/goldstar-landscaping-service-georgetown' },
    {
      label: 'Thumbtack',
      href: 'https://www.thumbtack.com/tx/georgetown/lawn-care/gold-star-landscaping/service/447043822060593154',
    },
  ],
  logo: '/images/brand/GSL-Logo-v2.png',
};

export async function getBusiness(
  db?: D1Database,
  opts?: { preview?: boolean }
): Promise<Business> {
  if (db) {
    const fromDb = await readSection<Business>(db, 'business', opts?.preview);
    if (fromDb) return fromDb;
  }
  return business;
}
