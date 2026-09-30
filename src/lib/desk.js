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

/**
 * The membership plans the desk has published, or `[]` if the API cannot
 * be reached — the screen falls back to its own copy in that case, so the
 * pricing page is never blank.
 */
export async function deskPlans() {
  if (!api.isConfigured) return [];
  try {
    const res = await api.websitePlans();
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

/* -- Desk stock, wearing the site's own shapes --------------------------- */

/**
 * A partner's listing has to look like everything else on the site.
 *
 * The site was built around its own hand-written content, and a partner
 * added on the panel arrives as a Travel Inventory row with different
 * field names. Rather than give partner listings a second, plainer set of
 * screens — which is what a generic /listing page amounts to — these turn
 * a desk item into exactly the shape the existing screens already read, so
 * a partner hotel draws the hotel page and a partner villa the villa page.
 *
 * Anything the partner did not fill in is left out rather than faked, and
 * the screens already cope with a missing field.
 */

const ICON_FOR = {
  'swimming pool': 'Waves', pool: 'Waves',
  'wi-fi': 'Wifi', wifi: 'Wifi',
  parking: 'Car', restaurant: 'UtensilsCrossed', breakfast: 'Coffee',
  gym: 'Dumbbell', spa: 'Flower2', bar: 'Martini', ac: 'Snowflake',
  tv: 'Tv', 'room service': 'ConciergeBell', 'pet friendly': 'PawPrint',
  'beach access': 'Waves', garden: 'Trees', laundry: 'Shirt',
};
export const iconForAmenity = (label) => ICON_FOR[String(label).toLowerCase()] || 'Check';

/** What a card in the results list needs. */
export function asResult(item, kind = 'hotel') {
  const amenities = (item.amenities || []).slice(0, 2).map((a) => ({ label: a, icon: iconForAmenity(a) }));
  return {
    id: item.id,
    kind,
    desk: true,
    name: item.name,
    place: item.place || '',
    verified: true,
    rating: item.rating || null,
    reviews: item.reviews || 0,
    amenities,
    more: Math.max(0, (item.amenities || []).length - 2),
    image: item.photo || (item.images || [])[0] || '',
    priceLabel: 'Per night',
    highlight: item.details?.highlight || '',
    layout: item.details?.layout || '',
    notes: item.details?.notes || [],
    freeCancellation: Boolean(item.details?.freeCancellation),
    taxes: item.details?.taxes || 0,
    price: item.price,
    was: item.was || 0,
    off: item.off || 0,
    href: `/${kind === 'villa' ? 'villas' : 'hotels'}/${item.id}`,
  };
}

/**
 * What a hotel or villa detail page needs.
 *
 * The room groups are built from the room types the partner listed: one
 * group each, with the rate they gave. A page with no rooms at all still
 * renders — it simply has nothing to pick.
 */
export function asProperty(item) {
  const rooms = item.rooms || [];
  const photos = item.photos?.length ? item.photos : [item.photo].filter(Boolean);
  const d = item.details || {};

  return {
    // Everything the detail pages print beyond the basics, as the partner
    // gave it. A section left empty is simply not drawn.
    layout: d.layout || '',
    bedrooms: d.bedrooms ?? null,
    beds: d.beds || '',
    baths: d.baths ?? null,
    sleeps: d.sleeps ?? null,
    extra: d.extraGuests ?? null,
    unit: d.unitType || '',
    highlight: d.highlight || '',
    notes: d.notes || [],
    freeCancellation: Boolean(d.freeCancellation),
    taxes: d.taxes ?? 0,
    host: d.host || null,
    spaces: d.spaces || [],
    included: d.included || [],
    ruleNotes: d.ruleNotes || [],
    guidelines: d.guidelines || [],
    id: item.id,
    desk: true,
    name: item.name,
    place: item.place || '',
    locality: item.address || '',
    verified: true,
    rating: item.rating || null,
    reviews: item.reviews || 0,
    from: item.price,
    was: item.was || 0,
    image: photos[0] || '',
    photos,
    about: item.description || '',
    address: item.address || '',
    nearby: d.nearby || [],
    amenities: item.amenities || [],
    checkIn: item.checkIn || '',
    checkOut: item.checkOut || '',
    defaultPlan: rooms.length ? `${item.id}-room-0` : '',
    roomGroups: rooms.map((r, i) => ({
      id: `${item.id}-group-${i}`,
      label: r.type || `Room ${i + 1}`,
      room: {
        name: r.type || `Room ${i + 1}`,
        guests: r.occupancy ? `${r.occupancy} Adults` : '',
        size: '',
        bed: '',
        view: '',
        photos: photos.length,
        image: photos[i % Math.max(1, photos.length)] || '',
      },
      plans: [
        {
          id: `${item.id}-room-${i}`,
          name: r.mealPlan || 'Room only',
          lines: [r.mealPlan, r.extraBed ? 'Extra bed available' : null, r.childPolicy].filter(Boolean),
          price: r.price || item.price,
          was: r.was || item.was || 0,
        },
      ],
    })),
  };
}
