import { api } from '@/lib/api';
import { image } from '@/lib/images';

/**
 * What the desk is selling, for the screens that show it.
 *
 * The site ships with its own copy of every list — hotels, villas, spas and
 * the rest — because it has to render with no API at all. This is the other
 * half: whatever the desk has put into Travel Inventory on the panel, fetched
 * at render and shown alongside. Nothing the desk adds needs a deploy.
 *
 * The desk never gets to break a page. A backend that is down, slow or empty
 * gives back an empty list, the bundled content stands on its own, and the
 * member sees a full screen either way.
 */

/** Which Travel Inventory category feeds which screen. */
export const DESK_CATEGORY = {
  hotels: 'Hotels',
  villas: 'Villas',
  restaurants: 'Restaurants',
  spa: 'Spa and salon',
  activities: 'Activities',
  attractions: 'Attractions',
  experiences: 'Experiences',
  packages: 'Packages',
  transport: 'Transport',
  flights: 'Flights',
};

/** A picture for a desk item: its own if it has one, else the slot we keep. */
const FALLBACK_SLOT = {
  Hotels: 'hotel-la-calypso',
  Villas: 'villa-hero-beach',
  Restaurants: 'rest-courtyard-tree',
  'Spa and salon': 'spa-serenity',
  Activities: 'act-beach-camping',
  Attractions: 'park-wet-joy',
  Experiences: 'lux-helicopter',
  Packages: 'pkg-goa-escape',
  Transport: 'hero-benefits',
  Flights: 'hero-benefits',
};

/** The first usable photo on a desk item, as a src the page can render. */
export function deskPhoto(item) {
  const own = (item.images || []).find((src) => /^https?:\/\//i.test(src) || src.startsWith('/'));
  return own || image(FALLBACK_SLOT[item.category] || 'hero-benefits');
}

/**
 * Everything the desk has on offer in one category, already shaped the way
 * a card wants it. `[]` when there is nothing, the API is unset, or it fails.
 */
export async function deskItems(category, { destination, q, limit = 24 } = {}) {
  if (!api.isConfigured) return [];
  const query = new URLSearchParams({ category });
  if (destination) query.set('destination', destination);
  if (q) query.set('q', q);

  try {
    const res = await api.catalog(`?${query.toString()}`);
    return (res.data || []).slice(0, limit).map((item) => ({
      ...item,
      href: `/listing/${item.id}`,
      photo: deskPhoto(item),
    }));
  } catch {
    // The desk being unreachable is not the member's problem.
    return [];
  }
}

/** One thing the desk sells, or null if it is not theirs to sell. */
export async function deskItem(id) {
  if (!api.isConfigured) return null;
  try {
    const res = await api.catalogItem(id);
    const item = res.data;
    return item ? { ...item, photo: deskPhoto(item), photos: (item.images || []).filter(Boolean) } : null;
  } catch {
    return null;
  }
}

/** The offers the desk has live, for the Offers screen. `[]` if none. */
export async function deskOffers() {
  if (!api.isConfigured) return [];
  try {
    const res = await api.deskOffers();
    return res.data || [];
  } catch {
    return [];
  }
}
