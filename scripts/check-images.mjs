/**
 * Says which image slots are still showing placeholder scenery and which have
 * real photography behind them.
 *
 *   npm run img:check
 */

import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'public', 'img');
const PHOTO = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const GROUPS = {
  'Hero carousel': ['hero-benefits', 'hero-freestay', 'hero-villas'],
  'Member Benefits': ['benefit-stay', 'benefit-off', 'benefit-experiences', 'benefit-special'],
  'Grab Offers': ['offer-weekend', 'offer-seasonal', 'offer-salon', 'offer-dining'],
  'Watch & Explore': ['story-bali', 'story-dandeli', 'story-srilanka', 'story-kerala'],
};

let real = 0;
let total = 0;

for (const [group, slots] of Object.entries(GROUPS)) {
  console.log(`\n${group}`);
  for (const slot of slots) {
    total += 1;
    const photo = PHOTO.map((e) => slot + e).find((f) => fs.existsSync(path.join(DIR, f)));
    if (photo) {
      real += 1;
      const kb = Math.round(fs.statSync(path.join(DIR, photo)).size / 1024);
      console.log(`  photo        ${slot.padEnd(22)} ${photo} (${kb} KB)`);
    } else {
      console.log(`  placeholder  ${slot.padEnd(22)} ${slot}.svg`);
    }
  }
}

console.log(`
${real} of ${total} slots have real photography.`);

if (real < total) {
  console.log(`Drop the rest into public/img/ using those names — see public/img/MANIFEST.md.`);
}
