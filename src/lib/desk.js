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

/**
 * Where a desk item's card points.
 *
 * Every card used to link to /listing/<id> — one plain page for a partner
 * of any kind, sitting next to the bespoke page the site's own content
 * gets. A partner spa is a spa, so it goes to the spa page.
 */
export const DESK_ROUTE = {
  Hotels: '/hotels',
  Villas: '/villas',
  Restaurants: '/restaurants',
  'Spa and salon': '/spa',
  Activities: '/activities',
  Attractions: '/parks',
  Experiences: '/luxury',
  Games: '/games',
  Packages: '/packages',
};
export const deskHref = (item) => `${DESK_ROUTE[item.category] || '/listing'}/${item.id}`;

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
      href: deskHref(item),
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
    rating: item.details?.rating || null,
    reviews: item.details?.reviews || 0,
    tag: item.details?.tag || '',
    offer: item.off || 0,
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
    rating: d.rating || null,
    reviews: d.reviews || 0,
    tag: d.tag || '',
    hours: d.hours || '',
    offer: item.off || 0,
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

/* -- The services that are not a stay ------------------------------------ */

/** The times a venue takes bookings at, when the partner named none. */
const DEFAULT_SLOTS = ['10:00', '11:30', '12:45', '16:00', '17:45', '18:00'];

/**
 * What a spa, restaurant, games zone, park, activity or experience page needs.
 *
 * These pages were written around the site's own content, and each one has
 * its own shape — a spa has treatments and locations, a park has tickets, an
 * activity has sessions. What they share is a venue: a name, a place, a
 * rating, photos, what it costs and what you can book. This builds that core
 * from a Travel Inventory row and adds the per-page pieces on top, so a
 * partner draws the same page as the content it sits beside rather than a
 * plainer one of its own.
 *
 * The units a partner listed — treatments, passes, tables, departures —
 * become the things the page lets you pick. A listing with none still
 * renders: it gets one line at the listing's own rate.
 */
export function asService(item, kind = 'spa') {
  if (!item) return null;

  const d = item.details || {};
  const photos = item.photos?.length ? item.photos : [item.photo].filter(Boolean);
  const price = item.price || 0;

  const tickets = (item.rooms || []).map((r, i) => ({
    id: `${item.id}-t${i}`,
    label: r.type || `Option ${i + 1}`,
    name: r.type || `Option ${i + 1}`,
    group: r.mealPlan || d.tag || 'Bookings',
    summary: r.occupancy ? `Up to ${r.occupancy}` : '',
    note: r.childPolicy || r.mealPlan || '',
    price: r.price || price,
    was: r.was || item.was || 0,
  }));

  if (!tickets.length) {
    tickets.push({
      id: `${item.id}-t0`,
      label: 'Standard booking',
      name: 'Standard booking',
      group: d.tag || 'Bookings',
      summary: '',
      note: '',
      price,
      was: item.was || 0,
    });
  }

  const cheapest = tickets.reduce((m, t) => (t.price < m.price ? t : m), tickets[0]);

  return {
    id: item.id,
    kind,
    desk: true,

    // Who and where.
    name: item.name,
    cardName: item.name,
    place: item.place || '',
    subtitle: item.place || '',
    address: item.address || '',
    label: d.tag || '',
    tag: d.tag || '',

    // How it reads.
    rating: d.rating || null,
    reviews: d.reviews || 0,
    listRating: d.rating || null,
    listReviews: d.reviews || 0,
    offer: item.off || 0,
    hours: d.hours || '',
    schedule: d.hours ? `Daily ${d.hours}` : 'Daily',
    opensAt: (d.hours || '').split('-')[0]?.trim() || '',

    // Pictures. These are already full URLs, not the site's own image slots,
    // so a page that draws a desk item must not put them through image().
    image: photos[0] || '',
    photos,
    images: photos,
    gallery: photos.slice(1),
    moreGallery: Math.max(0, photos.length - 3),

    // What it is.
    about: item.description || '',
    blurb: item.description || '',
    facilities: item.amenities || [],
    amenities: item.amenities || [],
    things: d.notes || [],
    highlight: d.highlight || '',

    // What you can book, and for how much.
    tickets,
    from: cheapest.price,
    price: cheapest.price,
    was: item.was || 0,
    slots: DEFAULT_SLOTS,
    startsAt: DEFAULT_SLOTS[0],
    sessions: { day: null, slots: DEFAULT_SLOTS.slice(0, 3) },
    modes: ['walk-in', 'dining'],
    locations: [
      {
        id: `${item.id}-loc`,
        title: item.place || item.name,
        address: item.address || item.place || '',
      },
    ],
    nearby: d.nearby || [],
    guidelines: d.guidelines || [],
    ruleNotes: d.ruleNotes || [],
    included: d.included || [],
    // Every page that draws an "Organized By" block expects one, so a
    // partner who named no host is their own: it is their venue.
    organizer: {
      name: d.host?.title || item.name,
      rating: d.rating || null,
      reviews: d.reviews || 0,
      hosted: d.host?.hosted ?? '—',
      years: d.host?.years ?? '—',
    },
  };
}

/** One desk item for a service page, already in that page's shape. */
export async function deskService(id, kind) {
  const item = await deskItem(id);
  return item ? asService(item, kind) : null;
}

/**
 * The flash offers the desk and its partners have running, as the home
 * page's own cards want them.
 *
 * A flash offer is only worth showing while it is running, so these are
 * never cached for long and one that has ended simply is not returned. The
 * gradient is not the partner's to choose — it cycles through the three the
 * design uses, so a row of them still reads as one row.
 */
const FLASH_TONES = [
  'from-[#10284a] to-[#1b4b7e]',
  'from-[#1b1560] to-[#3b2f9c]',
  'from-[#3d1f4a] to-[#6d3b6f]',
];

export async function deskFlashOffers() {
  if (!api.isConfigured) return [];
  try {
    const res = await api.deskFlashOffers();
    return (res.data || []).map((o, i) => {
      const l = o.listing || {};
      const saving = l.was && l.price ? l.was - l.price : 0;
      return {
        id: o.id,
        desk: true,
        // The partner's own line if they wrote one, because "Tonight only"
        // says more than "Hotels" does; the category otherwise.
        badge: o.description || l.category || 'Flash offer',
        brand: l.name || o.name,
        place: l.place || '',
        // What they save, in the words the card has room for.
        deal: saving > 0
          ? `${o.percent}% OFF — save ₹${saving.toLocaleString('en-IN')}`
          : `${o.percent}% OFF`,
        endsInHours: Math.max(0, (new Date(o.endsOn).getTime() - Date.now()) / 3600000),
        tone: FLASH_TONES[i % FLASH_TONES.length],
        href: `${DESK_ROUTE[l.category] || '/listing'}/${l.id}`,
      };
    });
  } catch {
    // The desk being unreachable is not the member's problem.
    return [];
  }
}

/**
 * The hotels a partner has put up as a free stay.
 *
 * A free stay is an ordinary hotel room with the price moved onto the
 * food, so these sit in the Hotels category like any other and are told
 * apart by the mark their property type sets. Filtering here rather than
 * asking the API for a category of its own keeps one hotel one listing,
 * whichever way it is sold.
 */
export async function deskFreeStays(limit = 12) {
  const all = await deskItems('Hotels', { limit: 48 });
  return all
    .filter((item) => item.details?.freeStay)
    .slice(0, limit)
    .map((item) => ({ ...item, href: `/free-stay/${item.id}` }));
}
