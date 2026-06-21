import type { D1Database } from '@cloudflare/workers-types';
import { readSection } from '../../lib/db';

// Service buckets. The current site lists 27 granular services as a flat list;
// these 5 buckets group them for a marketing grid (PROJECT_BRIEF §2, grouping
// approved in SCRAPE_NOTES §5 — commercial capability folded into copy).

export type Service = {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
};

const services: Service[] = [
  {
    id: 'hardscape-masonry',
    name: 'Hardscape & Masonry',
    description:
      'Retaining walls, paver patios, stone walkways, driveways, outdoor steps and limestone tree rings — built to handle Central Texas soil and weather.',
    image: '/images/portfolio/flagstone-steppers-black-gravel.jpg',
    order: 1,
  },
  {
    id: 'landscape-design-build',
    name: 'Landscape Design & Build',
    description:
      'Full design-build for new homes and remodels: bed layout, foundation planting, trees and finishing details — for residential and commercial properties alike.',
    image: '/images/portfolio/front-yard-mulch-bed-stone-edging.jpg',
    order: 2,
  },
  {
    id: 'drainage-grading',
    name: 'Drainage & Grading',
    description:
      'French drains, yard drainage, grading and resloping to fix builder defects, clear standing water and keep your yard dry and usable year-round.',
    image: '/images/portfolio/river-rock-drainage-side-yard.jpg',
    order: 3,
  },
  {
    id: 'lawn-sod',
    name: 'Lawn & Sod',
    description:
      'Fresh sod installation, grass seeding and tree planting that establishes a healthy, even lawn — including zoysia and other Central-Texas-ready grasses.',
    image: '/images/portfolio/fresh-sod-lawn-walkway.jpg',
    order: 4,
  },
  {
    id: 'rock-specialty',
    name: 'Rock & Specialty Landscaping',
    description:
      'River-rock beds, decorative gravel, xeriscape and artificial turf — low-water, low-maintenance finishes that still look sharp.',
    image: '/images/portfolio/black-rock-bed-shrubs-edging.jpg',
    order: 5,
  },
];

export async function getServices(
  db?: D1Database,
  opts?: { preview?: boolean }
): Promise<Service[]> {
  if (db) {
    const fromDb = await readSection<Service[]>(db, 'services', opts?.preview);
    if (fromDb) return [...fromDb].sort((a, b) => a.order - b.order);
  }
  return [...services].sort((a, b) => a.order - b.order);
}
