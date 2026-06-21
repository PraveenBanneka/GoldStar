import type { D1Database } from '@cloudflare/workers-types';
import { readSection } from '../../lib/db';

// REAL customer reviews, transcribed verbatim from the verified review screenshots
// on Goldstar's current site (SCRAPE_NOTES §3). All are five-star. Dates were not
// available in the source, so `date` is intentionally omitted. Do NOT invent reviews.

export type Review = {
  author: string;
  rating: number;
  text: string;
  verified: boolean;
};

const reviews: Review[] = [
  {
    author: 'Andres T.',
    rating: 5,
    verified: true,
    text:
      'I had flooding issues in my backyard due to a poorly graded yard — a defect that was never resolved from the builder. Yefri and his team came in, properly regraded our backyard and installed beautiful zoysia sod. It came out wonderful. Very professional and very responsive. I would definitely hire them again on future projects.',
  },
  {
    author: 'Brittany H.',
    rating: 5,
    verified: true,
    text:
      'Yefri is the most amazing landscaper we have ever met. He and his crew went above and beyond and completely exceeded our expectations. They worked so hard on the hottest day in Texas history. He was so kind and has amazing attention to detail. The entire process was phenomenal. You are truly an expert in your craft!',
  },
  {
    author: 'David M.',
    rating: 5,
    verified: true,
    text:
      'Yefri was on time for both appointments and did excellent work. He is very much into the details to get the job done and make it look great. I anticipate hiring him in the spring for some more landscaping work.',
  },
  {
    author: 'James C.',
    rating: 5,
    verified: true,
    text: 'Very helpful and punctual. Good quality work and materials.',
  },
  {
    author: 'Jessica C.',
    rating: 5,
    verified: true,
    text:
      'Yefri did a great job helping us replace a couple of shrubs in front of our house! He was responsive and listened to our needs. You can’t go wrong with him!',
  },
  {
    author: 'Julia T.',
    rating: 5,
    verified: false,
    text:
      'Working with Yefri was a good experience. He was able to answer all our questions honestly, and he and his crew were always on time and provided a quality installation.',
  },
  {
    author: 'Kristina H.',
    rating: 5,
    verified: true,
    text:
      'Yefri was great to work with! We are very happy with his work and how our plant beds turned out. Highly recommend.',
  },
  {
    author: 'Lakeisha R.',
    rating: 5,
    verified: false,
    text:
      'Everything about their service has been excellent! I really appreciate how this team personalizes every experience. Sometimes I forget they are an actual company and not just good ole neighbors. :)',
  },
  {
    author: 'Michelle M.',
    rating: 5,
    verified: true,
    text:
      'Excellent experience working with Jeffrey on redoing some existing landscaping and potting some large pots on my front and back porch. Highly recommended.',
  },
  {
    author: 'Olga L.',
    rating: 5,
    verified: false,
    text:
      'Jeffrey was very professional and made sure at each step that we were happy with the work. The project included removing sod and replacing it with river stones. Very happy with the result!',
  },
  {
    author: 'Paul W.',
    rating: 5,
    verified: true,
    text:
      'Super job with my back yard. Excellent quality and price, done quickly and when he said it would be done! A real find. Many thanks.',
  },
  {
    author: 'Sonny R.',
    rating: 5,
    verified: false,
    text:
      'Over several significant projects to trim trees, spread mulch, and selectively clear wooded land, their attention to my requirements and commitment to my satisfaction have been excellent.',
  },
  {
    author: 'Travis U.',
    rating: 5,
    verified: true,
    text:
      'Yefri was a pleasure to work with. He responded almost immediately to our inquiry about installing a French drain and was out the next day for a quote, which ended up being very fair and competitive. We are extremely satisfied with the finished product and workmanship!',
  },
  {
    author: 'Vickie S.',
    rating: 5,
    verified: false,
    text:
      'My home was new with no landscaping in the back yard. Jeffrey gave me ideas on types of plants, location and design, and was very knowledgeable about what would work. He was friendly and the project was completed on time. I would recommend him for your landscaping project.',
  },
];

export async function getReviews(
  db?: D1Database,
  opts?: { preview?: boolean }
): Promise<Review[]> {
  if (db) {
    const fromDb = await readSection<Review[]>(db, 'reviews', opts?.preview);
    if (fromDb) return fromDb;
  }
  return reviews;
}
