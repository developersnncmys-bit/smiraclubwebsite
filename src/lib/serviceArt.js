import fs from 'node:fs';
import path from 'node:path';

/**
 * Which of the All Services tiles have their own illustration.
 *
 * The design draws each service as custom artwork rather than a line icon.
 * Drop a file into public/img/services/ named after the service key —
 * `camping.png`, `hotel.png`, `india.png` — and that tile switches from the
 * Lucide icon to the artwork, with no edit anywhere else. Any key without a
 * file keeps its icon, so the grid is never half-broken while the set is
 * still being exported.
 *
 * This reads the filesystem, so it runs on the server at build time and the
 * home screen stays a static render.
 */

const DIR = path.join(process.cwd(), 'public', 'img', 'services');

/** Transparent formats first — these sit on a tinted tile. */
const PREFERRED = ['.svg', '.webp', '.png', '.avif', '.jpg', '.jpeg'];

export function serviceArt(keys) {
  const found = {};

  for (const key of keys) {
    for (const ext of PREFERRED) {
      try {
        if (fs.existsSync(path.join(DIR, key + ext))) {
          found[key] = `/img/services/${key}${ext}`;
          break;
        }
      } catch {
        // On any filesystem trouble the Lucide icon is still a good answer.
      }
    }
  }

  return found;
}
