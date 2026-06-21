import type { D1Database } from '@cloudflare/workers-types';
import { readSection } from '../../lib/db';

// Portfolio items. All photos are Goldstar's own completed projects, scraped from
// their gallery and renamed meaningfully (SCRAPE_NOTES §1). Categories mirror the
// service buckets so the gallery can be filtered later if desired.

export type PortfolioCategory =
  | 'Hardscape'
  | 'Design & Build'
  | 'Drainage'
  | 'Lawn & Sod'
  | 'Rock & Specialty';

export type PortfolioItem = {
  id: string;
  image: string;
  alt: string;
  category: PortfolioCategory;
  order: number;
};

const portfolio: PortfolioItem[] = [
  { id: 'new-build-sod-mulch-bed', image: '/images/portfolio/new-build-sod-mulch-bed.jpg', alt: 'New-build front yard with fresh sod, mulch beds and a crepe myrtle', category: 'Design & Build', order: 1 },
  { id: 'flagstone-steppers-black-gravel', image: '/images/portfolio/flagstone-steppers-black-gravel.jpg', alt: 'Flagstone stepping stones set in black gravel beside concrete steps', category: 'Hardscape', order: 2 },
  { id: 'river-rock-drainage-side-yard', image: '/images/portfolio/river-rock-drainage-side-yard.jpg', alt: 'River-rock drainage channel running along a fence line', category: 'Drainage', order: 3 },
  { id: 'pool-deck-cypress-landscape', image: '/images/portfolio/pool-deck-cypress-landscape.jpg', alt: 'Poolside landscape with Italian cypress and a flagstone deck', category: 'Design & Build', order: 4 },
  { id: 'stone-tree-ring-with-lighting', image: '/images/portfolio/stone-tree-ring-with-lighting.jpg', alt: 'Raised limestone tree ring with landscape lighting', category: 'Hardscape', order: 5 },
  { id: 'fresh-sod-lawn-walkway', image: '/images/portfolio/fresh-sod-lawn-walkway.jpg', alt: 'Freshly laid sod lawn with a stepping-stone walkway', category: 'Lawn & Sod', order: 6 },
  { id: 'black-rock-bed-shrubs-edging', image: '/images/portfolio/black-rock-bed-shrubs-edging.jpg', alt: 'Black-rock planting bed with shrubs and limestone curb edging', category: 'Rock & Specialty', order: 7 },
  { id: 'front-yard-mulch-bed-stone-edging', image: '/images/portfolio/front-yard-mulch-bed-stone-edging.jpg', alt: 'Front-yard mulch bed with limestone edging', category: 'Design & Build', order: 8 },
  { id: 'limestone-tree-ring-planters', image: '/images/portfolio/limestone-tree-ring-planters.jpg', alt: 'Raised limestone planter rings in a front yard', category: 'Hardscape', order: 9 },
  { id: 'artificial-turf-corten-planter', image: '/images/portfolio/artificial-turf-corten-planter.jpg', alt: 'Artificial turf with a Corten steel planter against a wood fence', category: 'Rock & Specialty', order: 10 },
  { id: 'established-lawn-oak-walkway', image: '/images/portfolio/established-lawn-oak-walkway.jpg', alt: 'Established lawn under a heritage oak with a curving walkway', category: 'Lawn & Sod', order: 11 },
  { id: 'limestone-bed-edging-mulch', image: '/images/portfolio/limestone-bed-edging-mulch.jpg', alt: 'Limestone bed edging with foundation planting and mulch', category: 'Hardscape', order: 12 },
  { id: 'flagstone-path-black-gravel', image: '/images/portfolio/flagstone-path-black-gravel.jpg', alt: 'Flagstone path winding through black gravel along a side yard', category: 'Hardscape', order: 13 },
  { id: 'black-mulch-foundation-planting', image: '/images/portfolio/black-mulch-foundation-planting.jpg', alt: 'Black-mulch foundation planting bed along a stone home', category: 'Design & Build', order: 14 },
  { id: 'front-lawn-mature-oaks', image: '/images/portfolio/front-lawn-mature-oaks.jpg', alt: 'Front lawn framed by mature oak trees', category: 'Lawn & Sod', order: 15 },
  { id: 'limestone-tree-ring-gravel-fill', image: '/images/portfolio/limestone-tree-ring-gravel-fill.jpg', alt: 'Limestone tree ring filled with decorative gravel', category: 'Hardscape', order: 16 },
  { id: 'front-yard-tree-ring-mulch', image: '/images/portfolio/front-yard-tree-ring-mulch.jpg', alt: 'Stone tree ring and fresh mulch beds in a front yard', category: 'Hardscape', order: 17 },
  { id: 'backyard-new-build-tree-ring', image: '/images/portfolio/backyard-new-build-tree-ring.jpg', alt: 'Backyard with a new lawn and a stone tree ring', category: 'Lawn & Sod', order: 18 },
  { id: 'commercial-shrub-planting', image: '/images/portfolio/commercial-shrub-planting.jpg', alt: 'Commercial foundation shrub planting beside a building', category: 'Design & Build', order: 19 },
  { id: 'backyard-lawn-concrete-steps', image: '/images/portfolio/backyard-lawn-concrete-steps.jpg', alt: 'Backyard lawn with poured concrete steps under oaks', category: 'Hardscape', order: 20 },
  { id: 'gravel-trash-bin-pad', image: '/images/portfolio/gravel-trash-bin-pad.jpg', alt: 'Tidy gravel utility pad between two homes', category: 'Rock & Specialty', order: 21 },
];

export async function getPortfolio(
  db?: D1Database,
  opts?: { preview?: boolean }
): Promise<PortfolioItem[]> {
  if (db) {
    const fromDb = await readSection<PortfolioItem[]>(db, 'portfolio', opts?.preview);
    if (fromDb) return [...fromDb].sort((a, b) => a.order - b.order);
  }
  return [...portfolio].sort((a, b) => a.order - b.order);
}
