import {
  activities, gameZones, hotels, luxuries, parks, restaurants, spas, villas,
} from '@/lib/content';
import { image } from '@/lib/images';

/**
 * Every service's photographs, for the gallery that opens over a page.
 *
 * Opening the gallery on a hotel used to show that hotel's three pictures
 * and nothing else, which is a reasonable thing for it to do and a dead end
 * for somebody who is looking rather than deciding. The strip across the
 * top turns it into a way round the site: the place you are on first, then
 * every other kind of thing Smira sells.
 *
 * Each service keeps its photos in a slightly different field — one has
 * `photos`, another `images`, another a `gallery` beside its card picture —
 * so each is read on its own terms here rather than the arrays being made
 * to match.
 *
 * `image()` reads the filesystem, so this runs on the server and the
 * finished list is handed to the viewer as plain sources.
 */

const SERVICES = [
  { key: 'hotels', label: 'Hotels', from: () => hotels, pick: (h) => [h.image, ...(h.photos || [])] },
  { key: 'villas', label: 'Villas', from: () => villas, pick: (v) => [v.image, ...(v.photos || [])] },
  { key: 'restaurants', label: 'Restaurants', from: () => restaurants, pick: (r) => [r.image] },
  { key: 'spa', label: 'Spa & Salon', from: () => spas, pick: (s) => s.photos || [s.image] },
  { key: 'games', label: 'Games', from: () => gameZones, pick: (g) => g.images || [] },
  { key: 'parks', label: 'Parks', from: () => parks, pick: (p) => p.images || [] },
  { key: 'activities', label: 'Activities', from: () => activities, pick: (a) => [a.image, ...(a.gallery || [])] },
  { key: 'luxury', label: 'Luxury', from: () => luxuries, pick: (l) => l.photos || [l.image] },
];

/** As many as a strip of thumbnails is worth scrolling through. */
const PER_SERVICE = 16;

let cached = null;

export function serviceGalleries() {
  if (cached) return cached;

  cached = SERVICES.map(({ key, label, from, pick }) => {
    const slots = [];
    for (const item of from()) {
      for (const slot of pick(item)) {
        // One photograph can belong to two places; showing it twice in one
        // strip only makes the strip longer.
        if (slot && !slots.includes(slot)) slots.push(slot);
      }
    }
    return { key, label, photos: slots.slice(0, PER_SERVICE).map((slot) => image(slot)) };
  }).filter((g) => g.photos.length > 0);

  return cached;
}
