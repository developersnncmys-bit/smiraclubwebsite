import fs from 'node:fs';
import path from 'node:path';

/**
 * Which file actually backs an image slot.
 *
 * Every slot has a placeholder SVG committed against it. The moment a real
 * photo lands in public/img/ under the same name — hero-benefits.jpg, say —
 * this picks the photo instead, with no edit anywhere else. That means the
 * design's own photography can be dropped in a folder rather than threaded
 * through the code.
 *
 * This runs at build time on the server, which is why the whole home screen
 * stays a static render.
 */

const DIR = path.join(process.cwd(), 'public', 'img');

/** Photographs first, in the order we would rather have them. */
const PREFERRED = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

/** Cached, because a static build asks for the same slots on every page. */
const resolved = new Map();

export function image(slot) {
  if (resolved.has(slot)) return resolved.get(slot);

  let found = `/img/${slot}.svg`;

  try {
    for (const ext of PREFERRED) {
      if (fs.existsSync(path.join(DIR, slot + ext))) {
        found = `/img/${slot}${ext}`;
        break;
      }
    }
  } catch {
    // On any filesystem trouble the placeholder is still a good answer.
  }

  resolved.set(slot, found);
  return found;
}

/** True when a slot is still showing its placeholder. */
export function isPlaceholder(slot) {
  return image(slot).endsWith('.svg');
}
