/**
 * Everything the home screen says, straight off the Figma.
 *
 * `image` is a slot name, not a path — lib/images.js turns it into a real
 * photo the moment one is dropped into public/img/ under that name, and falls
 * back to the committed placeholder until then. See public/img/MANIFEST.md.
 *
 * The artwork in /public/img is placeholder scenery drawn as SVG, so a page
 * never renders as broken alt text when the network is unhappy. Swap these
 * paths for the real photography when it lands.
 *
 * It lives here so
 * the components stay about layout, and so swapping any of it for the API
 * later is a one-file job.
 */

export const site = {
  name: 'Smira Club',
  tagline: 'Sweet memories is really affordable',
  city: 'Bengaluru',
};

/** The hero carousel — three slides, as the 1/3 counter in the design says. */
export const heroSlides = [
  {
    id: 'benefits',
    eyebrow: 'Membership benefits',
    headline: 'Up to',
    figure: '40',
    unit: '%',
    suffix: 'off',
    copy: 'Hotels, Packages, Villas & more at exclusive member prices.',
    cta: { label: 'Book now', href: '/membership' },
    image: 'hero-benefits',
    alt: 'A lit hotel and pool at dusk',
  },
  {
    id: 'freestay',
    eyebrow: 'Complimentary stays',
    headline: 'Up to',
    figure: '4',
    unit: '',
    suffix: 'free nights',
    copy: 'Members only pay for food. The room is on us.',
    cta: { label: 'See free stays', href: '/free-stay' },
    image: 'hero-freestay',
    alt: 'A hotel room with a city view',
  },
  {
    id: 'villas',
    eyebrow: 'Villas and homestays',
    headline: 'From',
    figure: '₹4,200',
    unit: '',
    suffix: 'a night',
    copy: 'Whole villas in Goa, Alibaug, Lonavala and Coorg.',
    cta: { label: 'Browse villas', href: '/villas' },
    image: 'hero-villas',
    alt: 'A villa with a private pool',
  },
];

/**
 * The four tabs above the search panel. Each is a way through to that
 * category's own screen, which is how the prototype moves between them.
 */
export const searchTabs = [
  { key: 'free-stay', label: 'Free Stay', icon: 'BedDouble', href: '/free-stay' },
  { key: 'hotel', label: 'Hotel', icon: 'Building2', href: '/hotels' },
  { key: 'package', label: 'Package', icon: 'Palmtree', href: '/packages' },
  { key: 'villa', label: 'Villa', icon: 'Home', href: '/villas' },
];

/**
 * All Services — the twelve tiles, in the order the Figma lays them out.
 *
 * Free Stay, Hotel, Package and Villa are not here: they are the four tabs
 * above the search panel, which is where the design puts them.
 */
export const services = [
  { key: 'international', label: 'International Trip', icon: 'Plane', href: '/packages/international' },
  { key: 'group', label: 'Group Departure', icon: 'Users', href: '/packages?kind=group' },
  { key: 'support', label: 'Travel Support', icon: 'LifeBuoy', href: '/more/support' },
  { key: 'homestay', label: 'Home Stay', icon: 'Home', href: '/villas?collection=homestay' },
  { key: 'restaurant', label: 'Restuarant Offers', icon: 'UtensilsCrossed', href: '/offers?kind=dining' },
  { key: 'waterpark', label: 'Waterpark & Themepark', icon: 'Waves', href: '/offers?kind=parks' },
  { key: 'games', label: 'Games Zone', icon: 'Gamepad2', href: '/offers?kind=games' },
  { key: 'salon', label: 'Saloon & Spa', icon: 'Sparkles', href: '/offers?kind=salon' },
  { key: 'luxury', label: 'Luxury Experiences', icon: 'Palmtree', href: '/offers?kind=luxury' },
  { key: 'camping', label: 'Camping & Adventure', icon: 'Tent', href: '/packages?kind=camping' },
  { key: 'flight', label: 'Flight Booking', icon: 'Plane', href: '/more/support' },
  { key: 'train', label: 'Train & Bus', icon: 'Ticket', href: '/more/support' },
];

/** What the member looked at last. */
export const recentSearches = [
  { id: 'r1', kind: 'Free Stay', place: 'Lonavala', guests: '1 Room/2 Guests', dates: '24 - 25 Aug 2026' },
  { id: 'r2', kind: 'Hourly Stay', place: 'Goa', guests: '1 Room/2 Guests', dates: '21 - 22 Aug 2026' },
  { id: 'r3', kind: 'Villa', place: 'Alibaug', guests: '1 Room/4 Guests', dates: '16 - 17 Aug 2026' },
  { id: 'r4', kind: 'Hotel', place: 'Coorg', guests: '2 Rooms/4 Guests', dates: '30 - 31 Aug 2026' },
];

/** The four member benefit cards. */
export const memberBenefits = [
  {
    id: 'stay',
    kicker: 'Complimentary',
    title: 'Hotel Stay',
    note: 'Only Pay For Food',
    image: 'benefit-stay',
  },
  {
    id: 'off',
    kicker: 'Up To',
    title: '40% OFF',
    note: 'On Luxury Hotels',
    image: 'benefit-off',
  },
  {
    id: 'experiences',
    kicker: 'Best Travel',
    title: 'Experiences',
    note: 'Curated For Members',
    image: 'benefit-experiences',
  },
  {
    id: 'special',
    kicker: 'Offers For',
    title: 'Specials Days',
    note: 'Curated For Members',
    image: 'benefit-special',
  },
];

/** The gold-crowned banner carousel under the benefits. */
export const clubBanners = [
  {
    id: 'gift',
    badge: 'Smira Club Benefits',
    title: 'Claim your gift',
    copy: 'Your Smira Club Benefits — make the most of your membership',
    cta: { label: 'Claim now', href: '/profile/rewards' },
  },
  {
    id: 'refer',
    badge: 'Refer & Earn',
    title: 'Send a friend, both gain',
    copy: 'They get a welcome offer. You get travel credit on their first trip.',
    cta: { label: 'Share your code', href: '/profile/referrals' },
  },
  {
    id: 'renew',
    badge: 'Membership',
    title: 'Renew and keep every benefit',
    copy: 'Free nights carry over when you renew before your plan ends.',
    cta: { label: 'See plans', href: '/membership' },
  },
];

/** Grab Offers, with the tabs the design puts above them. */
export const offerTabs = ['All', 'Weekend', 'Seasonal', 'Salon & Spa'];

export const offers = [
  {
    id: 'weekend',
    tab: 'Weekend',
    badge: 'Weekend getaway',
    title: 'Perfect Escapes for your weekend',
    tone: 'from-[#2b1e63] to-[#3d2a86]',
    image: 'offer-weekend',
  },
  {
    id: 'seasonal',
    tab: 'Seasonal',
    badge: 'Seasonal',
    title: 'Amazing Deals this season',
    tone: 'from-[#0f3f77] to-[#1c62b0]',
    image: 'offer-seasonal',
  },
  {
    id: 'salon',
    tab: 'Salon & Spa',
    badge: 'Salon & Spa',
    title: 'Unwind at member rates',
    tone: 'from-[#5b2333] to-[#8c3b52]',
    image: 'offer-salon',
  },
  {
    id: 'dining',
    tab: 'Weekend',
    badge: 'Dining',
    title: 'Table for two, on the house',
    tone: 'from-[#14532d] to-[#1f7a43]',
    image: 'offer-dining',
  },
];

/** Watch & Explore — stories and clips from members and the desk. */
export const stories = [
  {
    id: 'bali',
    title: 'Uncover the hidden gems of the Bali',
    author: '@Siya Sharma',
    video: false,
    image: 'story-bali',
  },
  {
    id: 'dandeli',
    title: 'Dandeli Adventures Trip',
    author: '@Smira Club',
    video: true,
    image: 'story-dandeli',
  },
  {
    id: 'srilanka',
    title: 'Must see wonders of Sri Lanka',
    author: '@Smira Club',
    video: true,
    image: 'story-srilanka',
  },
  {
    id: 'kerala',
    title: 'A Charming Port City in Kerala',
    author: '@Kushal Gowda',
    video: false,
    image: 'story-kerala',
  },
];

/** The plans, for the membership page. */
export const plans = [
  {
    id: 'silver',
    name: 'Silver Explorer',
    price: 4999,
    billing: 'a year',
    persons: 2,
    freeNights: 1,
    discount: 5,
    features: ['1 complimentary night', '5% off every booking', 'Dedicated travel expert', 'Birthday offer'],
  },
  {
    id: 'gold',
    name: 'Gold Voyager',
    price: 9999,
    billing: 'a year',
    persons: 2,
    freeNights: 2,
    discount: 10,
    popular: true,
    features: [
      '2 complimentary nights',
      '10% off every booking',
      'Dedicated travel expert',
      '24×7 on-trip helpline',
      'Birthday and anniversary gifts',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum Elite',
    price: 24999,
    billing: 'two years',
    persons: 4,
    freeNights: 4,
    discount: 15,
    features: [
      '4 complimentary nights',
      '15% off every booking',
      'Priority booking and upgrades',
      'Airport transfers included',
      'Curated experiences for members',
    ],
  },
];

/** The bottom bar on a phone, and the account menu on a desktop. */
export const primaryNav = [
  { key: 'home', label: 'Home', href: '/', icon: 'Home' },
  { key: 'wishlist', label: 'Wishlist', href: '/wishlist', icon: 'Heart' },
  { key: 'search', label: 'AI Search', href: '/search', icon: 'Search' },
  { key: 'profile', label: 'Profile', href: '/profile', icon: 'CircleUser' },
  { key: 'more', label: 'More', href: '/more', icon: 'MoreHorizontal' },
];

/** The desktop header's links — a phone gets these under More. */
export const desktopNav = [
  { label: 'Free Stay', href: '/free-stay' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Packages', href: '/packages' },
  { label: 'Villas', href: '/villas' },
  { label: 'Offers', href: '/offers' },
  { label: 'Membership', href: '/membership' },
];

export const cities = [
  'Bengaluru',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Delhi NCR',
  'Kochi',
  'Goa',
];

export const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'Free stays', href: '/free-stay' },
      { label: 'Hotels', href: '/hotels' },
      { label: 'Packages', href: '/packages' },
      { label: 'Villas and homestays', href: '/villas' },
      { label: 'Offers', href: '/offers' },
    ],
  },
  {
    title: 'Membership',
    links: [
      { label: 'Plans and pricing', href: '/membership' },
      { label: 'Member benefits', href: '/membership#benefits' },
      { label: 'Refer and earn', href: '/profile/referrals' },
      { label: 'Claim your gift', href: '/profile/rewards' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Smira Club', href: '/more/about' },
      { label: 'Travel support', href: '/more/support' },
      { label: 'Contact us', href: '/more/contact' },
      { label: 'Partner with us', href: '/more/partners' },
    ],
  },
];

/* -- Profile ------------------------------------------------------------ */

/**
 * The signed-in member. These are the design's own values; nothing here is
 * wired to an account yet, so swapping this object for what `api.me()`
 * returns is all /profile needs to go live.
 */
export const member = {
  name: 'Ananya',
  phone: '9899999989',
  active: true,
  tier: 'Platinum Member',
  memberId: 'SM123456789',
  validTill: '31 Dec 2028',
  /** Percent complete — the ring and the bar both read this one number. */
  completion: 40,
  savings: 12999,
  savedAcross: 6,
};

/** Your Information — the two grouped lists, in the order the design runs. */
export const profileMenu = [
  {
    id: 'account',
    items: [
      { label: 'Change Password', icon: 'Pencil', href: '/profile/password' },
      { label: 'My Bookings', icon: 'Briefcase', href: '/profile/bookings' },
      { label: 'My Membership', icon: 'Ticket', href: '/membership' },
      { label: 'My Travel Year', icon: 'PlaneTakeoff', href: '/profile/travel-year' },
      { label: 'Refer & Earn', icon: 'Wallet', href: '/profile/referrals' },
      { label: 'Claim Your Gifts', icon: 'Gift', href: '/profile/rewards' },
      { label: 'My Reviews', icon: 'Star', href: '/profile/reviews' },
      { label: 'Saved Address', icon: 'MapPin', href: '/profile/addresses' },
      { label: 'Saved Payments', icon: 'CreditCard', href: '/profile/payments' },
    ],
  },
  {
    id: 'support',
    items: [
      { label: 'Get Help', icon: 'Headset', href: '/more/support' },
      { label: 'Account Settings', icon: 'Settings', href: '/profile/settings' },
      { label: 'Language Settings', icon: 'Languages', href: '/profile/language' },
      { label: 'Privacy Policy', icon: 'FileText', href: '/more/privacy' },
      { label: 'Terms & Conditions', icon: 'ScrollText', href: '/more/terms' },
      { label: 'Refund Policy', icon: 'HandCoins', href: '/more/refunds' },
      { label: 'Cancellation Policy', icon: 'FileX2', href: '/more/cancellation' },
      { label: 'Delete Account', icon: 'Trash2', href: '/profile/delete' },
    ],
  },
];

/** The starter prompts on the AI Search screen. */
export const aiPrompts = [
  { key: 'goa-resorts', text: 'Find best resorts in Goa for a weekend', image: 'ai-goa-resorts' },
  { key: 'lonavala-family', text: 'Suggest Family Activities in Lonavala', image: 'ai-lonavala-family' },
];

/** What the screen suggests before anybody has asked it anything. */
export const aiRecommendations = [
  {
    key: 'parasailing',
    title: 'Parasailing Adventure',
    blurb: 'Stay Close To Beach With Fun Activities',
    price: 1499,
    was: 1999,
    unit: 'Per Adult',
    image: 'ai-parasailing',
    href: '/packages',
  },
  {
    key: 'spa',
    title: 'Spa & Saloon Experience',
    blurb: 'Pamper Yourself With Relaxing Experiences.',
    price: 2999,
    was: 3499,
    unit: 'Per Adult',
    image: 'ai-spa',
    href: '/offers',
  },
];

/** What the search box suggests you might type. */
export const aiSearchPlaceholder = 'Plan a 3 day trip to Goa';

/* -- Villas & Home Stays ------------------------------------------------ */

/** The banner at the top of the villas screen — four slides, four dots. */
export const villaHero = [
  {
    id: 'luxury',
    title: 'Luxury villas for your perfect stay',
    copy: 'Your perfect getaway starts with Smira Club.',
    image: 'villa-hero-luxury',
    alt: 'A villa above a lit pool, framed by palms',
  },
  {
    id: 'beach',
    title: 'Wake up to the sea',
    copy: 'Beachfront homes with the water a few steps away.',
    image: 'villa-hero-beach',
    alt: 'A beach villa at sunset',
  },
  {
    id: 'hilltop',
    title: 'Above the clouds, all to yourself',
    copy: 'Hilltop homes with the valley for a view.',
    image: 'villa-hero-hilltop',
    alt: 'A hilltop villa among pines',
  },
  {
    id: 'private',
    title: 'The whole place, no one else',
    copy: 'Private villas booked end to end for your group.',
    image: 'villa-hero-private',
    alt: 'A private villa lit after dark',
  },
];

/** What the member banner inside the villa search says. */
export const villaMemberOffer = {
  kicker: 'Smira Club Member Get',
  headline: 'Up to 40% OFF on Villa Bookings',
  note: 'Exclusive discounts for members',
};

/** Explore Villa Collections — the six tiles, in the design's order. */
export const villaCollections = [
  { key: 'luxury', label: 'Luxury Villa', image: 'villa-luxury' },
  { key: 'family', label: 'Family Villa', image: 'villa-family' },
  { key: 'beach', label: 'Beach Escapes', image: 'villa-beach' },
  { key: 'hilltop', label: 'Hilltop Villas', image: 'villa-hilltop' },
  { key: 'private', label: 'Private Villa', image: 'villa-private' },
  { key: 'pet', label: 'Pet Friendly Villas', image: 'villa-pet' },
];

/**
 * Recommended Villas.
 *
 * `price` is the member rate and `was` the public one, which is the whole
 * point of the strike-through. `taxes` is per night on top, as the design
 * spells out under the price.
 */
export const villas = [
  {
    id: 'ocean-pearl',
    name: 'Ocean Pearl Villa',
    place: 'Maldives',
    verified: true,
    badge: 'Most Popular',
    rating: 4.4,
    reviews: 412,
    layout: 'Entire 3-Bedroom Villa',
    notes: ['Breakfast available at extra charges'],
    freeCancellation: false,
    price: 14999,
    was: 17999,
    taxes: 2499,
    highlight:
      'Enjoy premium amenities including a private pool, game room, sea view, and private kitchen.',
    image: 'villa-ocean-pearl',
    alt: 'An overwater villa on a turquoise lagoon',
  },
  {
    id: 'hilltop-lonavala',
    name: 'Hilltop Villa',
    place: 'Lonavala',
    verified: true,
    badge: null,
    rating: 4.4,
    reviews: 412,
    layout: 'Entire 2-Bedroom Villa',
    notes: ['Breakfast available at extra charges'],
    freeCancellation: true,
    price: 10999,
    was: 14999,
    taxes: 1999,
    highlight:
      'Enjoy a peaceful hilltop stay with panoramic views, a private pool, spacious outdoor areas, and a fully equipped kitchen.',
    image: 'villa-hilltop-lonavala',
    alt: 'A glass villa on a forested hillside',
  },
];

/**
 * The villa search results, as the design shows them for Goa.
 *
 * There is no inventory API yet, so a search returns this set whatever is
 * typed — the destination in the summary bar is the one the member asked
 * for. Swap this array for what `api.inventory()` gives back and the screen
 * is live.
 */
export const villaResults = [
  {
    id: 'palm-grove',
    name: 'Palm Grove Pool Villa',
    place: 'Anjuna, Goa',
    verified: true,
    badge: 'Most Popular',
    rating: 4.2,
    reviews: 212,
    layout: 'Entire 3-Bedroom Villa',
    notes: ['Breakfast available at extra charges'],
    freeCancellation: false,
    price: 12999,
    was: 14999,
    taxes: 2499,
    highlight:
      'Enjoy a private pool, sun deck, fully equipped kitchen and air-conditioned bedrooms.',
    image: 'villa-palm-grove',
    alt: 'A pool villa under palms in Anjuna',
  },
  {
    id: 'casa-de-goa',
    name: 'Casa De Goa Villa',
    place: 'Candolim, Goa',
    verified: true,
    badge: null,
    rating: 4.4,
    reviews: 142,
    layout: 'Entire 3-Bedroom Villa',
    notes: ['Breakfast available at extra charges'],
    freeCancellation: true,
    price: 16999,
    was: 17999,
    taxes: 1999,
    highlight:
      'Relax with a private pool, peaceful garden, spacious living area and private kitchen.',
    image: 'villa-casa-de-goa',
    alt: 'A beachfront villa with a deck in Candolim',
  },
  {
    id: 'coconut-groove',
    name: 'Coconut Groove Villa',
    place: 'Colva, Goa',
    verified: true,
    badge: null,
    rating: 4.4,
    reviews: 412,
    layout: 'Entire 2-Bedroom Villa',
    notes: ['Breakfast available at extra charges'],
    freeCancellation: true,
    price: 10999,
    was: 14999,
    taxes: 1999,
    highlight:
      'Experience a relaxing family stay with a private pool, tropical garden, spacious lounge and kitchen.',
    image: 'villa-coconut-groove',
    alt: 'A villa among coconut palms in Colva',
  },
];

/** The blurb under EXPLORE VILLA COLLECTIONS on the results screen. */
export const villaCollectionsBlurb =
  'Find the perfect stay for every mood from Poolside Villas and Peaceful Escapes to Beachfront Retreats and Luxury Getaways';

/** The controls above the results. Sort is wired; the other two are not yet. */
export const villaSortOptions = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-low', label: 'Price: low to high' },
  { key: 'price-high', label: 'Price: high to low' },
  { key: 'rating', label: 'Rating' },
];

/* -- A villa's own page ------------------------------------------------- */

export const villaHost = {
  title: 'Hosted By Smira Stays',
  speaks: 'Speaks Hindi, English, Marati',
  blurb:
    'Whether you are travelling for relaxation or family getaways what matters the most, is your privacy. Enjoy your holidays with your loved ones.',
};

export const villaStay = { checkIn: '2 PM', checkOut: '12 PM' };

/** The amenity grid. The unit-size tile is added per villa, so it leads. */
export const villaAmenities = [
  { key: 'pool', label: 'Private Pool', icon: 'Waves' },
  { key: 'wifi', label: 'Wifi', icon: 'Wifi' },
  { key: 'games', label: 'Game Room', icon: 'Gamepad2' },
  { key: 'dining', label: 'Multiple Dining', icon: 'UtensilsCrossed' },
  { key: 'bar', label: 'Bar & Lounge', icon: 'Martini' },
];

export const villaDetailTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'amenities', label: 'Amenities' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'location', label: 'Location' },
  { key: 'guidelines', label: 'Stay Guidelines' },
];

export const villaReviews = [
  {
    id: 'r1',
    score: 4.0,
    name: 'Ananya Sharma',
    kind: 'Family',
    body: 'Amazing Stay! The rooms were stunning and the service was top notch. Highly Recommended.',
    date: '18 Aug, 2025',
  },
  {
    id: 'r2',
    score: 4.0,
    name: 'Rohit Menon',
    kind: 'Family',
    body: 'Amazing Stay! The rooms were stunning and the service was top notch. Highly Recommended.',
    date: '16 July, 2025',
  },
];

export const villaWhatsIncluded = ['No Meals Included'];

export const villaRules = [
  { title: 'Couple/ Bachelor Rules', body: 'Unmarried couples allowed.' },
  { body: 'Primary guest should be atleast 18 years of age.' },
  { body: 'Passport, Aadhar and Govt. ID are accepted as ID proof(s).' },
];

export const villaGuidelines = [
  {
    title: 'Check-in & Check-out',
    lines: ['Early check-in / late check-out is subject to availability.'],
  },
  {
    title: 'Guest Policy',
    lines: [
      'Valid ID is required at check-in.',
      'Maximum occupancy depends on the selected room.',
      'Children must be accompanied by an adult.',
    ],
  },
  {
    title: 'Cancellation & Booking',
    lines: [
      'Cancellation and refund policies vary by room and rate plan.',
      'Non-refundable bookings cannot be cancelled or modified.',
      'Changes are subject to availability and applicable charges.',
    ],
  },
  {
    title: 'Property Guidelines',
    lines: [
      'Outside food may be restricted in certain areas.',
      'Pets are allowed only in designated rooms/areas, if applicable.',
      'Guests are expected to follow the safety and conduct guidelines of the property.',
    ],
  },
];

export const villaGuidelinesNote =
  'Please check the cancellation, occupancy and meal policies of the selected room before booking.';

/** The two unit cards under Property Layout. */
const ROOMS = [
  {
    id: 'b1',
    name: 'Bedroom 1',
    floor: 'Ground Floor',
    tag: 'Private',
    photos: 4,
    image: 'villa-room-1',
    lines: ['1 double Bed, Extra 1 Mattress available', 'Pool View, Attached Bathroom'],
  },
  {
    id: 'b2',
    name: 'Bedroom 2',
    floor: 'Ground Floor',
    tag: 'Private',
    photos: 4,
    image: 'villa-room-2',
    lines: ['1 double Bed, Extra 1 Mattress available', 'Pool View, Attached Bathroom'],
  },
];

/**
 * Per-property detail, keyed by villa id.
 *
 * Only one property is specified in the design, so the rest carry the same
 * shape with their own numbers and address. All of it is placeholder copy
 * until the inventory API supplies it per property.
 */
export const villaDetails = {
  'palm-grove': {
    bedrooms: 3, beds: '3 Double beds', baths: 4, sleeps: 6, extra: 4, unit: 'Single Unit',
    about:
      'Experience the perfect blend of luxury and comfort at our Palm Grove Pool villa, with spacious rooms and a private pool. The villa is ideal for family getaways and group holidays.',
    address: 'Ashvem Beach, Pernem North Goa, Goa 403527',
    nearby: [
      { place: 'Anjuna Beach', km: '1.2 km' },
      { place: 'Vagator Beach', km: '3.5 Km' },
      { place: 'Chapora Fort', km: '4 km' },
      { place: 'Anjuna Flea market', km: '2 Km' },
      { place: 'Thalassa Restaurant', km: '3 Km' },
    ],
    rooms: ROOMS,
  },
  'casa-de-goa': {
    bedrooms: 3, beds: '3 Double beds', baths: 3, sleeps: 6, extra: 2, unit: 'Single Unit',
    about:
      'A calm three-bedroom house a short walk from Candolim beach, with a private pool, a garden to sit out in and a kitchen you are welcome to use.',
    address: 'Candolim, Bardez North Goa, Goa 403515',
    nearby: [
      { place: 'Candolim Beach', km: '0.8 km' },
      { place: 'Fort Aguada', km: '3 Km' },
      { place: 'Calangute Beach', km: '4 Km' },
      { place: 'Sinquerim Beach', km: '2 Km' },
    ],
    rooms: ROOMS,
  },
  'coconut-groove': {
    bedrooms: 2, beds: '2 Double beds', baths: 2, sleeps: 4, extra: 2, unit: 'Single Unit',
    about:
      'A two-bedroom family villa set among coconut palms in Colva, with a private pool, a tropical garden and a lounge big enough for everyone.',
    address: 'Colva, Salcete South Goa, Goa 403708',
    nearby: [
      { place: 'Colva Beach', km: '1 km' },
      { place: 'Benaulim Beach', km: '3 Km' },
      { place: 'Margao Market', km: '6 Km' },
    ],
    rooms: ROOMS,
  },
  'ocean-pearl': {
    bedrooms: 3, beds: '3 Double beds', baths: 3, sleeps: 6, extra: 2, unit: 'Single Unit',
    about:
      'An overwater villa with the lagoon underfoot, a private pool, a game room and a kitchen of your own.',
    address: 'North Male Atoll, Maldives',
    nearby: [
      { place: 'House Reef', km: '0.1 km' },
      { place: 'Dive Centre', km: '0.4 Km' },
      { place: 'Velana International Airport', km: '32 Km' },
    ],
    rooms: ROOMS,
  },
  'hilltop-lonavala': {
    bedrooms: 2, beds: '2 Double beds', baths: 2, sleeps: 4, extra: 2, unit: 'Single Unit',
    about:
      'A quiet hilltop house above Lonavala with the valley for a view, a private pool and a fully equipped kitchen.',
    address: 'Tungarli, Lonavala, Maharashtra 410401',
    nearby: [
      { place: 'Tungarli Lake', km: '1.5 km' },
      { place: 'Bhushi Dam', km: '4 Km' },
      { place: 'Rajmachi Point', km: '6 Km' },
    ],
    rooms: ROOMS,
  },
};

/**
 * Review Booking.
 *
 * The discount is the flat one the design shows against the base price;
 * everything about it is placeholder until the rate plans are real.
 */
export const villaBooking = {
  discount: 500,
  meals: ['Stay Only', 'Meals available at extra charges'],
  refund: {
    title: 'Non-Refundable',
    body: 'Refund is not applicable for this booking',
  },
};

/* -- Search results, across every category ------------------------------ */

/**
 * The chips over the results. Villa sits beside Package because a search
 * from the home screen can turn up any of the four.
 */
export const resultFilters = [
  { key: 'hotel', label: 'Hotels', icon: 'Building2' },
  { key: 'free-stay', label: 'Free Stay', icon: 'Gift' },
  { key: 'package', label: 'Package', icon: 'Landmark' },
  { key: 'villa', label: 'Villa', icon: 'Home' },
];

export const resultSortOptions = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-low', label: 'Price: low to high' },
  { key: 'price-high', label: 'Price: high to low' },
  { key: 'rating', label: 'Rating' },
];

/**
 * What a search turns up.
 *
 * One shape covers all four kinds; `kind` decides which chip it answers to,
 * and `priceNote` carries the difference between a per-night rate and a
 * per-person package. Swap this for `api.inventory()` and the screen is live.
 */
export const searchResults = [
  {
    id: 'la-calypso',
    kind: 'hotel',
    freeStay: true,
    name: 'La Calypso Beach Resort & Casino',
    place: 'Baga, Goa',
    verified: true,
    rating: 4.4,
    reviews: 412,
    amenities: [
      { label: 'Pool', icon: 'Waves' },
      { label: 'Wifi', icon: 'Wifi' },
    ],
    more: 2,
    promo: {
      tone: 'blue',
      icon: 'Gift',
      title: 'Complimentary stay for members',
      note: 'Pay for food · Breakfast & Dinner included',
    },
    priceLabel: 'From',
    price: 3999,
    was: 4999,
    priceNote: 'Per Night before taxes & fees',
    image: 'villa-hero-beach',
    href: '/hotels/la-calypso',
  },
  {
    id: 'phoenix-park-inn',
    kind: 'hotel',
    name: 'Phoenix park inn by radisson',
    place: 'Candolim, Goa',
    rating: 4.2,
    reviews: 319,
    amenities: [
      { label: 'Pool', icon: 'Waves' },
      { label: 'Wifi', icon: 'Wifi' },
    ],
    more: 2,
    promo: {
      tone: 'blue',
      icon: 'Percent',
      title: 'Up to 40% Off for members',
      note: 'Limited time offer',
    },
    priceLabel: 'From',
    price: 4999,
    was: 7999,
    priceNote: 'Per Night before taxes & fees',
    image: 'villa-hero-private',
    href: '/hotels/phoenix-park-inn',
  },
  {
    id: 'goa-escape',
    kind: 'package',
    name: 'Goa Escape Package',
    place: '4 Nights/ 5 Days',
    rating: 4.6,
    reviews: 412,
    amenities: [
      { label: 'Free Stay', icon: 'Building2' },
      { label: 'Meals', icon: 'Coffee' },
    ],
    more: 2,
    promo: null,
    priceLabel: 'Starting From',
    price: 24999,
    was: 28999,
    priceNote: 'Per Person before taxes & fees',
    image: 'villa-beach',
    href: '/packages',
  },
  {
    id: 'postcard-cuelim',
    kind: 'villa',
    name: 'The Postcard Cuelim',
    place: 'Cansaulim, South Goa',
    rating: 4.8,
    reviews: 99,
    amenities: [
      { label: 'Pool', icon: 'Waves' },
      { label: 'Dining', icon: 'Utensils' },
    ],
    more: 2,
    promo: {
      tone: 'violet',
      icon: 'Tag',
      title: 'Up to 20% Off for members',
      note: 'Book your perfect villa',
    },
    priceLabel: 'From',
    price: 9999,
    was: 10999,
    priceNote: 'Per Night before taxes & fees',
    image: 'villa-hero-luxury',
    href: '/villas/postcard-cuelim',
  },
];

/* -- A hotel's own page -------------------------------------------------- */

/** The green card under the price. */
export const hotelMemberBenefits = {
  title: 'Smira Club Member Benefits',
  note: 'More Value, More Experiences',
  points: [
    'Luxury Hotel Discounts',
    'Long-Term Validity',
    'Multiple Room Options',
    'Discounts Up to 40%',
  ],
};

/** Amenities For Couple — the six the design shows before See all. */
export const hotelAmenities = [
  { key: 'room', label: 'Luxury Room', icon: 'BedDouble' },
  { key: 'pool', label: 'Private Pool', icon: 'Waves' },
  { key: 'wifi', label: 'Wifi', icon: 'Wifi' },
  { key: 'beach', label: 'Private Beach', icon: 'Palmtree' },
  { key: 'dining', label: 'Multiple Dining', icon: 'Utensils' },
  { key: 'bar', label: 'Bar & Lounge', icon: 'Martini' },
];

export const hotelReviews = [
  {
    id: 'r1',
    score: 4.0,
    name: 'Siya Sharma',
    kind: 'Couple',
    body: 'Amazing Stay! The sea view from the room was stunning and the service was top notch. Highly Recommended.',
    date: '16 Aug, 2025',
    room: 'Deluxe Room Sea View',
  },
  {
    id: 'r2',
    score: 4.2,
    name: 'Anajali Prasad',
    kind: 'Family',
    body: 'Loved the Stay! The sea view from the room was amazing and the service was top notch.',
    date: '08 July, 2025',
    room: 'Deluxe Room Sea View',
  },
  {
    id: 'r3',
    score: 4.6,
    name: 'Rahul Nair',
    kind: 'Group',
    body: 'Booked four rooms for a reunion. The staff moved things around for us without being asked and the pool was ours most evenings.',
    date: '22 June, 2025',
    room: 'Garden View Room',
  },
  {
    id: 'r4',
    score: 3.8,
    name: 'Meera Iyer',
    kind: 'Couple',
    body: 'Beautiful property and a lovely breakfast. Check-in took a while on a busy evening, which is the only reason this is not a five.',
    date: '02 June, 2025',
    room: 'Premium Ocean View',
  },
];

/** The bars on the Ratings & Review screen. */
export const hotelRatingSummary = {
  word: 'Excellent',
  breakdown: [
    { label: 'Excellent', pct: 71 },
    { label: 'Very Good', pct: 21 },
    { label: 'Average', pct: 6 },
    { label: 'Poor', pct: 2 },
    { label: 'Bad', pct: 1 },
  ],
};

/** Who the review was left by — the four tabs over All Reviews. */
export const reviewFilters = [
  { key: 'everyone', label: 'Everyone' },
  { key: 'Group', label: 'Group' },
  { key: 'Couple', label: 'Couple' },
  { key: 'Family', label: 'Family' },
];

export const reviewSortOptions = [
  { key: 'relevant', label: 'Most relevant' },
  { key: 'recent', label: 'Most recent' },
  { key: 'high', label: 'Highest rated' },
  { key: 'low', label: 'Lowest rated' },
];

/** Recommended Packages, at the foot of a hotel's page. */
export const recommendedPackages = [
  {
    id: 'goa-escape',
    name: 'Goa Escape Package',
    duration: '4 Nights/ 5 Days',
    rating: 4.6,
    reviews: 412,
    chips: [
      { label: 'Hotel Stay', icon: 'Building2' },
      { label: 'Meals', icon: 'Coffee' },
    ],
    more: 2,
    price: 24999,
    unit: 'Per Person',
    image: 'villa-beach',
  },
  {
    id: 'goa-premium',
    name: 'Goa Premium Escape',
    duration: '4 Nights/ 5 Days',
    rating: 4.6,
    reviews: 412,
    chips: [
      { label: 'Luxury Stay', icon: 'Building2' },
      { label: 'Bar', icon: 'Martini' },
    ],
    more: 4,
    price: 36999,
    unit: 'Per Person',
    image: 'villa-hero-private',
  },
];

/**
 * The hotels, with their rooms and rate plans.
 *
 * A room is what you sleep in; a plan is what it costs and what it includes,
 * and a room can carry several. The plan is what gets selected, which is why
 * the price in the bottom bar moves when you pick one.
 */
export const hotels = [
  {
    id: 'la-calypso',
    name: 'La Calypso Beach Resort & Casino',
    place: 'Baga, Goa',
    locality: 'Calangute | 80 m walk to Baga Beach',
    taxes: 999,
    verified: true,
    rating: 4.4,
    reviews: 412,
    from: 3999,
    was: 4999,
    image: 'villa-hero-beach',
    about:
      'Overlooking the Arabian Sea, La Calypso Beach Resort & Casino offers luxurious rooms, world-class dining, relaxing spa experiences and endless water activities.',
    address: '614, Calangute - Baga Rd, Baga, Calangute, Goa 403516',
    nearby: [
      { place: 'Baga Beach', km: '80 m' },
      { place: 'Calangute Beach', km: '1 Km' },
      { place: 'Casino Palms', km: '230 m' },
      { place: "Tito's Lane", km: '560 m' },
      { place: 'Candolim Beach', km: '3 Km' },
    ],
    defaultPlan: 'exec-breakfast',
    roomGroups: [
      {
        id: 'premium',
        label: 'Premium Rooms',
        room: {
          name: 'Garden View Room',
          guests: '2 Adults',
          size: '180 sq.ft (17 sq.mt)',
          bed: '1 Double Bed',
          view: 'Garden View',
          photos: 9,
          image: 'villa-room-1',
        },
        plans: [
          {
            id: 'premium-breakfast',
            name: 'Room with Breakfast',
            lines: ['Breakfast Included', 'Non-Refundable'],
            price: 3999,
            was: 4499,
          },
        ],
      },
      {
        id: 'executive',
        label: 'Executive',
        room: {
          name: 'Sea View Room',
          guests: '2 Adults',
          size: '200 sq.ft (19 sq.mt)',
          bed: '1 Double Bed',
          view: 'Sea View',
          photos: 9,
          image: 'villa-room-2',
        },
        plans: [
          {
            id: 'exec-only',
            name: 'Room Only',
            lines: ['Non-Refundable'],
            price: 3099,
            was: 3999,
          },
          {
            id: 'exec-breakfast',
            name: 'Room with Breakfast',
            lines: ['Breakfast Included', 'Non-Refundable'],
            price: 4999,
            was: 5999,
          },
          {
            id: 'exec-breakfast-plus',
            name: 'Room with Breakfast',
            lines: [
              'Enjoy 30% Off on Drinks',
              'Complimentary session of 30 mins Spa',
              'Non-Refundable',
            ],
            price: 5999,
            was: 6999,
          },
        ],
      },
      {
        id: 'suite',
        label: 'Suite',
        room: {
          name: 'Premium Ocean View',
          guests: '2 Adults',
          size: '460 sq.ft (43 sq.mt)',
          bed: '1 Double Bed',
          view: 'Ocean View',
          photos: 9,
          image: 'villa-hero-luxury',
        },
        plans: [
          {
            id: 'suite-only',
            name: 'Room Only',
            lines: ['Non-Refundable'],
            price: 3999,
            was: 4999,
          },
          {
            id: 'suite-breakfast',
            name: 'Room with Breakfast',
            lines: ['Breakfast Included', 'Non-Refundable'],
            price: 5999,
            was: 6999,
          },
          {
            id: 'suite-breakfast-plus',
            name: 'Room with Breakfast',
            lines: [
              'Enjoy 30% Off on Drinks',
              'Complimentary session of 30 mins Spa',
              'Non-Refundable',
            ],
            price: 6999,
            was: 7999,
          },
        ],
      },
    ],
  },
  {
    id: 'phoenix-park-inn',
    name: 'Phoenix park inn by radisson',
    place: 'Candolim, Goa',
    locality: 'Candolim | 400 m walk to Candolim Beach',
    taxes: 899,
    verified: true,
    rating: 4.2,
    reviews: 319,
    from: 4999,
    was: 7999,
    image: 'villa-hero-private',
    about:
      'A short walk from Candolim beach, Phoenix Park Inn pairs a large pool and gardens with easy access to the north Goa strip.',
    address: 'Candolim Beach Rd, Candolim, Bardez, Goa 403515',
    nearby: [
      { place: 'Candolim Beach', km: '400 m' },
      { place: 'Fort Aguada', km: '3 Km' },
      { place: 'Calangute Beach', km: '4 Km' },
      { place: 'Sinquerim Beach', km: '2 Km' },
    ],
    defaultPlan: 'phoenix-breakfast',
    roomGroups: [
      {
        id: 'deluxe',
        label: 'Deluxe Rooms',
        room: {
          name: 'Garden Facing Room',
          guests: '2 Adults',
          size: '190 sq.ft (18 sq.mt)',
          bed: '1 Double Bed',
          view: 'Garden View',
          photos: 9,
          image: 'villa-room-1',
        },
        plans: [
          {
            id: 'phoenix-only',
            name: 'Room Only',
            lines: ['Non-Refundable'],
            price: 4999,
            was: 7999,
          },
          {
            id: 'phoenix-breakfast',
            name: 'Room with Breakfast',
            lines: ['Breakfast Included', 'Non-Refundable'],
            price: 5799,
            was: 8499,
          },
        ],
      },
      {
        id: 'phoenix-suite',
        label: 'Suite',
        room: {
          name: 'Pool View Suite',
          guests: '2 Adults',
          size: '420 sq.ft (39 sq.mt)',
          bed: '1 Double Bed',
          view: 'Pool View',
          photos: 9,
          image: 'villa-room-2',
        },
        plans: [
          {
            id: 'phoenix-suite-breakfast',
            name: 'Room with Breakfast',
            lines: ['Breakfast Included', 'Non-Refundable'],
            price: 7499,
            was: 9999,
          },
        ],
      },
    ],
  },
];

/** The five steps of Complete Your Profile, in order. */
export const profileSteps = [
  { key: 'details', label: 'Your Details' },
  { key: 'special', label: 'Special Days' },
  { key: 'address', label: 'Gift Address' },
  { key: 'updates', label: 'Updates' },
  { key: 'submit', label: 'Submit' },
];

/** For the State dropdown on the gift address. */
export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu', 'Delhi',
  'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

/* -- Smira Club Membership ---------------------------------------------- */

/** The three tabs over the plans. */
export const membershipTabs = [
  { key: 'plans', label: 'Explore Membership Plans' },
  { key: 'match', label: 'Find Your Perfect Membership' },
  { key: 'versus', label: 'Smira Vs Other' },
];

/**
 * The four tiers.
 *
 * Only Gold's numbers come from the Figma; the other three are set to sit
 * either side of it so the screen reads sensibly while you are choosing.
 * Replace them with the real rate card when it lands.
 */
export const membershipPlans = [
  {
    key: 'silver',
    label: 'Silver',
    audience: 'Beginner',
    title: 'Easy Starter',
    blurb: 'For travellers taking their first trips with us',
    fee: 9999,
    tone: 'from-[#c3c9cf] to-[#98a1a9]',
    stats: [
      { figure: '30 Days', note: 'Free Hotel Stay' },
      { figure: '2 Years', note: 'Membership Validity' },
      { figure: '2 - 4 People', note: 'Covered per stay' },
      { figure: '1 Room', note: 'Allowed Per Booking' },
    ],
    privileges: 1,
  },
  {
    key: 'gold',
    label: 'Gold',
    audience: 'Smart Traveller',
    title: 'Smart Traveller',
    blurb: 'For Families who travel few times a year',
    fee: 19999,
    tone: 'from-[#d8a41f] to-[#b8860b]',
    stats: [
      { figure: '75 Days', note: 'Free Hotel Stay' },
      { figure: '3 Years', note: 'Membership Validity' },
      { figure: '4 - 8 People', note: 'Covered per stay' },
      { figure: '2 Rooms', note: 'Allowed Per Booking' },
    ],
    privileges: 3,
  },
  {
    key: 'platinum',
    label: 'Platinum',
    audience: 'Frequent Travellers',
    title: 'Frequent Explorer',
    blurb: 'For families on the road several times a year',
    fee: 34999,
    popular: true,
    tone: 'from-[#8fa8b8] to-[#5d7d90]',
    stats: [
      { figure: '120 Days', note: 'Free Hotel Stay' },
      { figure: '5 Years', note: 'Membership Validity' },
      { figure: '6 - 10 People', note: 'Covered per stay' },
      { figure: '3 Rooms', note: 'Allowed Per Booking' },
    ],
    privileges: 5,
  },
  {
    key: 'diamond',
    label: 'Diamond',
    audience: 'Luxury Travellers',
    title: 'Luxury Collector',
    blurb: 'For members who travel first class, every time',
    fee: 59999,
    tone: 'from-[#4fbfc4] to-[#25868f]',
    stats: [
      { figure: '180 Days', note: 'Free Hotel Stay' },
      { figure: '7 Years', note: 'Membership Validity' },
      { figure: '8 - 12 People', note: 'Covered per stay' },
      { figure: '4 Rooms', note: 'Allowed Per Booking' },
    ],
    privileges: 10,
  },
];

/** What's Included — the same for every tier. */
export const membershipIncluded = [
  {
    title: 'No Utility or Maintenance fee',
    body: 'Stay without paying extra hotel charges',
  },
  {
    title: 'Member Connect Services',
    body: 'Booking reminders and Updates from your concierge.',
  },
  {
    title: 'Exclusive Lifestyle Discount',
    body: 'Up To 40% Off On Lifestyle Experiences Such As Saloon & Spa, Games Zone, Restaurant Offers, Waterpark & Theme Park & Many More.',
  },
];

/** Smira Privilege Rate — ten to pick from, how many depends on the tier. */
export const membershipPrivileges = [
  { key: 'villa', label: 'Villa Booking', body: 'Enjoy special member benefits on premium villa stays.' },
  { key: 'homestay', label: 'Home Stay', body: 'Access comfortable homestays for your travel needs.' },
  { key: 'hotel', label: 'Hotel Booking', body: 'Get exclusive member rates on eligible hotel bookings' },
  { key: 'tour', label: 'Tour Package', body: 'Explore curated travel packages at member benefits.' },
  { key: 'international', label: 'International Trip', body: 'Plan International journeys with exclusive member support.' },
  { key: 'group', label: 'Group Departure', body: 'Join specially planned group trips and departures.' },
  { key: 'support', label: 'Travel Support', body: 'Join specially planned group trips and departures.' },
  { key: 'luxury', label: 'Luxury Experiences', body: 'Enjoy access to Yacht rides, helicopter & other exclusive premium experiences.' },
  { key: 'flight', label: 'Flight Booking', body: 'Access flight booking support and applicable member benefits.' },
  { key: 'train', label: 'Train & Bus', body: 'Get convenient support for train and bus bookings.' },
];

/** The purple countdown card. `endsInHours` is measured from page load. */
export const membershipOffer = {
  title: 'Limited Time Offer',
  body: 'Get Diamond Jewellery worth ₹10,000',
  note: 'Offers Ends In',
  endsInHours: 34,
};

export const membershipGifts = [
  { key: 'jewellery', label: 'Diamond Jewellery', note: 'Exclusive Offer', image: 'gift-jewellery' },
  { key: 'bag', label: 'Travel Bag', note: 'Premium Quality', image: 'gift-bag' },
  { key: 'kit', label: 'Travel Accessories Kit', note: 'Neck Pillow, Pouch & more', image: 'gift-kit' },
  { key: 'voucher', label: 'Smira Club Travel Voucher worth ₹1,000', note: '', image: 'gift-voucher' },
];

export const membershipGiftConditions = [
  'Valid for Gold membership only',
  'Gifts will be delivered after successful member activation & first booking',
];

/** Sharing your benefits is a paid add-on, and the coupon the design shows. */
export const membershipSharing = { price: 4999, label: 'To share your member benefits' };
export const membershipCoupon = { code: 'SMIRA500', off: 500 };

/* -- Find Your Perfect Membership --------------------------------------- */

export const membershipQuizIntro = {
  title: 'Tell us about your travel',
  body: 'Help us understand your travel preferences so we can find the membership and benefits that suit you best.',
};

/**
 * The questionnaire.
 *
 * `weight` is what an answer is worth when working out which tier fits — the
 * further down an option sits, the more travel it implies. Questions with no
 * weight are asked because the desk wants to know, not because they change
 * the recommendation.
 */
export const membershipQuiz = [
  {
    key: 'frequency',
    icon: 'Globe',
    label: 'How Often do you travel?',
    type: 'chips',
    weight: true,
    options: ['1-2 times a year', '3-5 times a year', '6+ times a year'],
  },
  {
    key: 'rooms',
    icon: 'BedDouble',
    label: 'How many rooms do you usually book?',
    type: 'select',
    weight: true,
    options: ['1 Room', '2 Rooms', '3 Rooms', '4+ Rooms'],
  },
  {
    key: 'people',
    icon: 'Users',
    label: 'How many people usually travel?',
    type: 'select',
    weight: true,
    options: ['1-2 people', '3-4 people', '5-8 people', '9+ people'],
  },
  {
    key: 'with',
    icon: 'Users',
    label: 'Who do you usually travel with?',
    type: 'chips',
    options: ['Solo', 'Couple', 'Family', 'Friends', 'Group'],
  },
  {
    key: 'trip',
    icon: 'Briefcase',
    label: 'What type of trip do you prefer?',
    type: 'chips',
    options: ['Family', 'Weekend', 'Business', 'Adventure'],
  },
  {
    key: 'where',
    icon: 'Plane',
    label: 'Where do you usually travel?',
    type: 'chips',
    options: ['Domestic', 'International', 'Both'],
  },
  {
    key: 'hotel',
    icon: 'Building2',
    label: 'What hotel experience do you prefer?',
    type: 'chips',
    weight: true,
    options: ['3 Star', '4 Star', '5 Star', 'Other'],
  },
  {
    key: 'services',
    icon: 'Ticket',
    label: 'Which travel services do you use most?',
    type: 'pills',
    options: [
      'Villa Booking', 'Hotel Privilege Rate', 'Tour Package', 'International Trip',
      'Group Departure', 'Flight booking', 'Train & Bus Booking', 'Travel Support',
      'Luxury Experiences', 'Home Stay',
    ],
  },
  {
    key: 'budget',
    icon: 'Wallet',
    label: 'What is your average travel budget?',
    type: 'select',
    weight: true,
    options: ['Below 10K', '10K - 25K', '25K - 50K', '50K - 1L', 'Above 1L'],
  },
  {
    key: 'needs',
    icon: 'FileText',
    label: 'Any specific travel needs?',
    type: 'text',
    placeholder: 'Tell us anything else about your travel preferences..',
    max: 120,
  },
];

/** Why the recommended tier is the right one, in its own words. */
export const membershipReasons = {
  silver: [
    '2 Years Validity',
    'Stay for 4 persons allowed',
    '1 Room per booking',
    'Ideal for solo travellers and couples',
    'A gentle way into member rates',
    'The lowest fee of the four',
  ],
  gold: [
    '3 Years Validity',
    'Stay for 8 persons allowed',
    '2 Rooms per booking',
    'Ideal for couples & small families',
    'Access to premium hotels & experiences',
    'Great value for your budget',
  ],
  platinum: [
    '5 Years Validity',
    'Stay for 10 persons allowed',
    '3 Rooms per booking',
    'Ideal for families on the road often',
    'Five privileges instead of three',
    'Priority booking and upgrades',
  ],
  diamond: [
    '7 Years Validity',
    'Stay for 12 persons allowed',
    '4 Rooms per booking',
    'Ideal for large families and groups',
    'Every one of the ten privileges',
    'Yacht, helicopter and concierge access',
  ],
};

export const membershipQuizOutro = {
  title: 'Need a different Plan?',
  body: 'You can explore and compare all plans to find the best fit for your travel goals',
  cta: 'Explore All Plans',
};

/* -- Smira Vs Other ------------------------------------------------------ */

/** The versus tab swaps the banner; the other two share one. */
export const membershipCompareHero = {
  title: 'See What Makes Smira Different',
  body: 'Compare choice, booking flexibility, travel benefits, member services side by side.',
  image: 'compare-landmarks',
};

/**
 * The comparison, row by row.
 *
 * Every row is a tick for Smira and a cross for everyone else, which is what
 * the design shows. `other` is a field rather than assumed so an honest row —
 * one where the competition does the same thing — can be added later without
 * touching the table.
 */
export const membershipCompare = [
  { key: 'choice', label: 'Choice of Hotel', body: 'Access to a wide range of hotel options', smira: true, other: false },
  { key: 'express', label: 'Express Booking', body: 'Instant & seamless booking', smira: true, other: false },
  { key: 'package', label: 'Travel Package', body: 'Complete travel package support', smira: true, other: false },
  { key: 'transfer', label: 'Booking Transferable', body: 'Transfer you booking easily', smira: true, other: false },
  { key: 'seasonal', label: 'Seasonal Booking', body: 'Book during peak seasons', smira: true, other: false },
  { key: 'connect', label: 'Membership Connect', body: 'Stay Connected with members & Updates', smira: true, other: false },
  { key: 'lifestyle', label: 'Lifestyle Offers', body: 'Exclusive lifestyle discounts & benefits', smira: true, other: false },
  { key: 'utility', label: 'No Utility Fee', body: 'No Hidden Charges', smira: true, other: false },
  { key: 'maintenance', label: 'No Maintenance', body: 'No Maintenance charges', smira: true, other: false },
  { key: 'villa', label: 'Villa', body: 'Access to premium villa stays', smira: true, other: false },
];

/** The help card at the foot of the comparison. */
export const membershipHelp = {
  title: 'Need Help?',
  body: 'We’re here to assist you',
  whatsapp: 'https://wa.me/919820011223',
  phone: '+919820011223',
};

/* -- Claim Your Gifts ---------------------------------------------------- */

export const rewardsHero = {
  title: 'Complete the requirement to claim the gift',
  body: 'Keep going, great rewards are waiting for you.',
  image: 'rewards-hero',
};

/**
 * The gifts and what stands between a member and each one.
 *
 * `state` is the whole screen: it picks the chip, what the card says under
 * the requirement, and which button appears. A gift with `progress` shows
 * how far along it is instead of a flat "not yet".
 */
export const rewards = [
  {
    key: 'travel-bag',
    label: 'Travel Bag',
    requirement: 'Buy Platinum Membership',
    state: 'unlocked',
    image: 'gift-bag',
    cta: { label: 'Claim now', href: null },
  },
  {
    key: 'glasses',
    label: 'Glasses',
    requirement: 'Buy Diamond Membership',
    state: 'locked',
    image: 'gift-glasses',
    cta: { label: 'Upgrade now', href: '/membership' },
  },
  {
    key: 'solitaire',
    label: '₹10,000 Solitaire Voucher',
    requirement: 'Complete 5 Hotel Bookings',
    state: 'progress',
    progress: { done: 3, of: 5, noun: 'Booking' },
    image: 'gift-voucher',
    cta: { label: 'View my bookings', href: '/profile/bookings' },
  },
  {
    key: 'couple-dinner',
    label: 'Couple Dinner',
    requirement: 'Complete 1 Travel Booking',
    state: 'new',
    image: 'gift-dinner',
    cta: { label: 'Book now', href: '/hotels' },
  },
];

export const rewardsNote = 'Gifts are non-transferable and valid for a limited. T&C Apply.';

/* -- My Reviews and Saved Address ---------------------------------------- */

/** The member's own reviews, newest first. */
export const myReviews = [
  {
    id: 'own-1',
    score: 4.0,
    name: member.name === 'Ananya' ? 'Ananya Sharma' : member.name,
    kind: 'Couple',
    body: 'Amazing Stay! The sea view from the room was stunning and the service was top notch. Highly Recommended.',
    date: '16 Aug, 2025',
    room: 'Deluxe Room Sea View',
    helpful: 2,
  },
  {
    id: 'own-2',
    score: 4.2,
    name: member.name === 'Ananya' ? 'Ananya Sharma' : member.name,
    kind: 'Family',
    body: 'Loved the Stay! The sea view from the room was amazing and the service was top notch.',
    date: '08 July, 2025',
    room: 'Deluxe Room Sea View',
    helpful: 2,
  },
];

/**
 * Saved addresses.
 *
 * `label` is what the member calls it and `icon` follows from that, so Home
 * and Work read differently at a glance in a long list.
 */
export const savedAddresses = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    lines: ['D-Block JP Nagar, Mysuru,', 'Karnataka 570031'],
    phone: '9890900089',
  },
];

/** What the two buttons over the list do. */
export const addressActions = {
  add: 'Add New Address',
  request: 'Request Address',
};

/* -- My Bookings --------------------------------------------------------- */

export const bookingTabs = ['All Bookings', 'Confirmed', 'Completed', 'Cancelled'];

/** The five stages every booking moves through, in order. */
export const bookingStages = [
  'Check Availability',
  'Payment Received',
  'Booking Confirmed',
  'Check In',
  'Check Out',
];

/**
 * What the member has booked.
 *
 * `stage` is how far along the five stages it has reached, and `status` is
 * what to call it — the two together decide the chip, the stepper and the
 * footer, so a booking is described once rather than in three places.
 */
export const myBookings = [
  {
    id: 'CHK-12',
    kind: 'Hotel booking',
    status: 'confirmed',
    stage: 5,
    name: 'La Calypso Beach Resort & Casino',
    place: 'Baga, Goa',
    image: 'villa-hero-beach',
    from: '2026-08-28T10:00',
    to: '2026-08-30T12:00',
    href: '/hotels/la-calypso',
  },
  {
    id: 'CHK-11',
    kind: 'Villa booking',
    status: 'pending',
    stage: 2,
    name: 'The Postcard Cuelim',
    place: 'cansaulim, South Goa',
    image: 'villa-hero-luxury',
    from: '2026-08-22T10:00',
    to: '2026-08-24T12:00',
    href: '/villas/postcard-cuelim',
  },
  {
    id: 'CHK-09',
    kind: 'Villa booking',
    status: 'cancelled',
    stage: 1,
    name: 'Hilltop Villa',
    place: 'Lonavala',
    image: 'villa-hilltop-lonavala',
    from: '2026-07-11T14:00',
    to: '2026-07-13T12:00',
    href: '/villas/hilltop-lonavala',
  },
];

/* -- My Travel Year ------------------------------------------------------ */

/**
 * The year's trips, keyed by year so the pager has something to page.
 * Nights come from the dates rather than being stored, so a changed date
 * cannot leave the duration saying something else.
 */
export const travelYears = {
  2026: [
    {
      id: 'goa',
      title: 'Goa Getaway',
      origin: 'Mumbai',
      destination: 'Goa',
      start: '2026-09-29',
      end: '2026-10-01',
      image: 'villa-beach',
      guests: 2,
      specialDays: [
        {
          id: 'anniversary',
          label: 'Anniversary',
          date: '30 Sep 2026',
          note: 'Celebrate your anniversary with a memorable getaway in Goa. 💕🏖',
          image: 'gift-dinner',
        },
      ],
      activities: [
        {
          id: 'parasailing',
          title: 'Parasailing Adventure',
          note: 'Stay Close To Beach With Fun Activities',
          price: 1499,
          was: 1999,
          unit: 'Per Adult',
          image: 'ai-parasailing',
        },
        {
          id: 'spa',
          title: 'Spa & Saloon Experience',
          note: 'Pamper Yourself With Relaxing Experiences.',
          price: 2999,
          was: 3499,
          unit: 'Per Adult',
          image: 'ai-spa',
        },
      ],
    },
    {
      id: 'maldives',
      title: 'Madives Escape',
      origin: 'Banglore',
      destination: 'Maldives',
      start: '2026-11-04',
      end: '2026-11-12',
      image: 'villa-ocean-pearl',
      guests: 2,
      specialDays: [],
      activities: [
        {
          id: 'reef',
          title: 'Reef Snorkelling',
          note: 'See the house reef with a guide.',
          price: 3499,
          was: 4499,
          unit: 'Per Adult',
          image: 'villa-ocean-pearl',
        },
      ],
    },
  ],
  2025: [
    {
      id: 'coorg',
      title: 'Coorg Long Weekend',
      origin: 'Bengaluru',
      destination: 'Coorg',
      start: '2025-12-19',
      end: '2025-12-22',
      image: 'villa-hilltop',
    },
  ],
};

/* -- Refer & Earn -------------------------------------------------------- */

/**
 * The referral offer.
 *
 * Amounts live here rather than in the copy, so the headline total is worked
 * out from them and cannot drift when the offer changes.
 */
export const referral = {
  title: 'Refer & Earn',
  cap: 1000,
  steps: [
    {
      key: 'signup',
      label: 'Step 1',
      headline: 'Your Friend signs up on Smira Club',
      split: [
        { who: 'You get', amount: 50, image: 'refer-you' },
        { who: 'Your Friend Gets', amount: 100, image: 'refer-friend' },
      ],
    },
    {
      key: 'booking',
      label: 'Step 2',
      headline: 'Your Friend completes her first booking',
      single: {
        who: 'You get an additional amount of',
        amount: 250,
        image: 'refer-you',
        note: 'Credited once their first stay is completed.',
      },
    },
  ],
  note: 'You can earn cash only from 10 referrals',
  code: 'smi23039s',
};

/* -- Get Help ------------------------------------------------------------ */

export const helpDesk = {
  greeting: 'Hi,',
  body: 'We are here to assist you at every step. Please Browse through the option below and tap on what you’re looking for.',
  image: 'help-desk',
  trip: {
    title: 'Need help with your trip?',
    body: 'View and manage booking by entering the booking ID here. For verifying the details, an OTP will be sent to your registered number used during the booking.',
    hint: 'The ID on your confirmation, like CHK-12.',
  },
};

/* -- Language Settings --------------------------------------------------- */

/** No design for this one yet — built to the same shape as the other lists. */
export const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
];

/* -- More ---------------------------------------------------------------- */

export const moreIntro = {
  title: 'Smira Club',
  tagline: 'Travel more. Save more. Enjoy more with your Smira Club membership.',
  image: 'more-hero',
  heading: 'Why Smira Club?',
  body: 'Smira Club is a premier membership-based travel and lifestyle organization that offers complimentary hotel stays, exclusive trip packages, and top-tier recreational benefits. We provide access to 14+ international destinations, 8 islands, 225 hotels, and 300+ top brands.',
};

/**
 * Browse Topics — everything reachable from More, in the design's order.
 *
 * A topic with no `href` has no screen yet; the list says so rather than
 * sending anyone to a dead route.
 */
export const moreTopics = [
  {
    key: 'guidelines',
    icon: 'Crown',
    label: 'Membership Guidelines',
    body: 'Membership Benefits, Usage rules, Important terms & conditions.',
    href: '/more/guidelines',
  },
  {
    key: 'how-it-works',
    icon: 'Users',
    label: 'How Smira Club Works',
    body: 'Step-by-Step guide to understand everything.',
    href: '/more/how-it-works',
  },
  {
    key: 'privacy',
    icon: 'FileText',
    label: 'Privacy Policy',
    body: 'Know how we protect your data and privacy.',
    href: '/more/privacy',
  },
  {
    key: 'blogs',
    icon: 'BookOpen',
    label: 'Blogs',
    body: 'Travel Blogs & Destination Inspirations.',
    href: '/blogs',
  },
  {
    key: 'faqs',
    icon: 'CircleHelp',
    label: 'FAQs',
    body: 'Find answers to frequently asked questions.',
    href: '/more/faqs',
  },
  {
    key: 'cancellation',
    icon: 'FileX2',
    label: 'Cancellation Policy',
    body: 'Cancellation Rules & Applicable charges.',
    href: '/more/cancellation',
  },
  {
    key: 'refund',
    icon: 'HandCoins',
    label: 'Refund Policy',
    body: 'Refund eligibility, process and timeline.',
    href: '/more/refunds',
  },
  {
    key: 'wishlist',
    icon: 'Heart',
    label: 'Wishlist',
    body: 'View your saved hotels, destinations & experiences.',
    href: '/wishlist',
  },
  {
    key: 'refer',
    icon: 'Wallet',
    label: 'Refer & Earn',
    body: 'Share refer & earn exciting rewards.',
    href: '/profile/referrals',
  },
  {
    key: 'reviews',
    icon: 'Star',
    label: 'Membership Reviews',
    body: 'Read member reviews, ratings & testimonials.',
    href: '/more/reviews',
  },
  {
    key: 'sla',
    icon: 'ScrollText',
    label: 'SLA- Service Legal Agreement',
    body: 'Read our service legal agreements and your rights.',
    href: '/more/sla',
  },
];

/* -- Blogs --------------------------------------------------------------- */

export const blogHero = {
  title: 'Travel Stories, Tips & Inspirations',
  body: 'Explore travel guides, hidden destinations & expert tips for your next trip.',
  image: 'blog-hero',
};

export const blogCategories = [
  { key: 'all', label: 'All', icon: 'LayoutGrid' },
  { key: 'guide', label: 'Travel Guide', icon: 'BookOpen' },
  { key: 'hotel', label: 'Hotel Stays', icon: 'Building2' },
  { key: 'destination', label: 'Destinations', icon: 'Globe' },
];

/**
 * The blogs. `popular` is an editor's pick rather than a computed view count
 * — that is what the design implies and what the desk can actually control
 * today, and a fake counter would be worse than an honest choice.
 */
export const blogs = [
  {
    id: 'beach-destinations',
    category: 'guide',
    tag: 'Travel Guides',
    title: 'Top 10 Beach Destinations In India for a Perfect Getaway',
    excerpt:
      'From the serene beaches to vibrant coastlines, explore the ten stretches of Indian coast worth planning a whole trip around.',
    date: 'May 2026',
    image: 'villa-beach',
    latest: true,
    popular: true,
  },
  {
    id: 'hotel-stay-tips',
    category: 'hotel',
    tag: 'Hotel Stay',
    title: 'How to make most of your Smira Club Hotel Stay',
    excerpt:
      'Tips to enhance your stay experience and enjoy maximum value from the benefits your membership already includes.',
    date: 'May 2026',
    image: 'villa-room-1',
    latest: true,
  },
  {
    id: 'first-international-trip',
    category: 'guide',
    tag: 'Travel Guides',
    title: 'A complete guide to your first International trip',
    excerpt:
      'Everything you need to know before planning your first International trip, from documents to what to book first.',
    date: 'May 2026',
    image: 'villa-hero-private',
    popular: true,
  },
  {
    id: 'hidden-goa',
    category: 'destination',
    tag: 'Destinations',
    title: 'The quieter side of Goa, beyond the beach shacks',
    excerpt:
      'South Goa, the spice farms and the backroads most visitors drive straight past on the way to Baga.',
    date: 'Apr 2026',
    image: 'villa-hero-luxury',
    popular: true,
  },
];

/* -- FAQs ---------------------------------------------------------------- */

/**
 * Three groups, as the design splits them.
 *
 * The answers follow the policies rather than restating them, so a change to
 * the Cancellation Policy cannot leave an FAQ quietly contradicting it.
 */
export const faqGroups = [
  {
    id: 'membership',
    title: 'Membership FAQ’s',
    items: [
      {
        q: 'What is Smira Club membership?',
        a: 'Smira Club membership gives you access to eligible travel, hotel, package and other membership benefits based on your selected membership plan.',
      },
      {
        q: 'What membership plans are available?',
        a: 'Silver, Gold, Platinum and Diamond. Each states its own fee, validity period, complimentary nights, how many people a stay covers and how many rooms you may book at a time.',
      },
      {
        q: 'How do I use my membership benefits?',
        a: 'Sign in and book through the website. Member rates, privilege rates and complimentary nights are applied automatically while your membership is active.',
      },
      {
        q: 'How do I use membership benefits for a hotel stay?',
        a: 'Search for the property and dates, pick a room and rate plan, and your member rate is shown on the Review Booking screen before you pay. Complimentary nights are drawn from your allowance at that point.',
      },
      {
        q: 'How do Smira Club offers and discounts work?',
        a: 'Offers vary by location, date, service provider, membership eligibility and availability. Some premium hotel bookings depend on real-time availability.',
      },
      {
        q: 'Can I use my membership benefits multiple times?',
        a: 'Yes, within the limits of your plan — its validity period, its complimentary nights, and the number of rooms and guests it covers.',
      },
      {
        q: 'Can I share my membership with someone else?',
        a: 'Yes, with the membership sharing add-on. Named relatives or friends may then use your benefits, drawing on the same allowance as your own membership.',
      },
      {
        q: 'How can I renew my membership?',
        a: 'Renew from My Membership on your profile before the validity period ends. Renewing before expiry keeps benefits that would otherwise lapse.',
      },
    ],
  },
  {
    id: 'booking',
    title: 'Booking FAQ’s',
    items: [
      {
        q: 'How do I make a booking?',
        a: 'Select your preferred experience or service, choose the date and time, enter the required details, and confirm your booking.',
      },
      {
        q: 'Where can I view my upcoming bookings?',
        a: 'In My Bookings on your profile. Each booking shows its status, dates, booking ID and how far along it is.',
      },
      {
        q: 'Can I modify my booking?',
        a: 'Where the property allows it, we will move a booking rather than cancel it. A date change depends on availability and any difference in rate. On a Non-Refundable rate, changes are at the property’s discretion.',
      },
      {
        q: 'Will I receive a booking confirmation?',
        a: 'Yes. A booking is confirmed once payment is received and a booking ID is issued, and the confirmation goes to the email and number on the booking.',
      },
      {
        q: 'Can I book for someone else?',
        a: 'Yes. Choose Someone Else on the Review Booking screen and enter their details. You can add more than one guest to the same booking.',
      },
      {
        q: 'What happens if my preferred time slot is unavailable?',
        a: 'We will offer the nearest available dates, or an alternative property of a comparable standard. Nothing is charged until you accept one.',
      },
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation & refund FAQ’s',
    items: [
      {
        q: 'Can I cancel my booking?',
        a: 'Yes, you can cancel eligible bookings from the My Bookings section, subject to the cancellation policy.',
      },
      {
        q: 'Will I receive a refund after cancelling?',
        a: 'It depends on your rate plan. Free Cancellation Available bookings are refunded in full within their window; Non-Refundable bookings are not refunded other than government taxes where the law requires it.',
      },
      {
        q: 'Can I modify my booking?',
        a: 'Often, yes — see the booking questions above. Moving a booking is usually better than cancelling one.',
      },
      {
        q: 'How long will it take to receive my refund?',
        a: 'We process an approved refund within 3 working days. Your bank or card issuer then takes a further 5 to 7 working days to show it.',
      },
      {
        q: 'Can I get a refund for a missed booking?',
        a: 'No. A booking you do not arrive for and have not cancelled is treated as a no-show, and the full amount is retained. Cancelling, even at short notice, is always better than not arriving.',
      },
      {
        q: 'Where can I check the cancellation policy?',
        a: 'The rate plan is shown against every room before you pay, and the full Cancellation Policy is under More.',
      },
    ],
  },
];

/* -- Membership Reviews -------------------------------------------------- */

export const memberTestimonials = [
  {
    id: 't1',
    score: 5,
    body: 'We enjoyed our family time at Sunkissed Plaza with hassle free booking by Smira Club. Excellent service and great support from the team',
    name: 'Sayeeli Worlikar',
    image: 'villa-hero-beach',
  },
  {
    id: 't2',
    score: 4.5,
    body: 'We enjoyed our family time at Sunkissed RoofTop with hassle free booking by Smira Club. Excellent service and great support from the team',
    name: 'Ajith Prasad',
    image: 'villa-luxury',
  },
  {
    id: 't3',
    score: 5,
    body: 'The desk moved our dates twice without a fuss when work got in the way. That alone paid for the membership.',
    name: 'Rahul Nair',
    image: null,
  },
];

/* -- Deactivate Account -------------------------------------------------- */

/**
 * Deactivate Account.
 *
 * The profile list calls this Delete Account, but the screen deactivates: the
 * account and its data are held for a recovery window and only then deleted.
 * The copy here is the honest version, and the two names want reconciling.
 */
export const deactivateAccount = {
  title: 'Deactivate Account',
  lead: 'We’re sorry to see you go! Before proceeding, please note that deactivating your Smira Club account will temporarily disable your access to:',

  /** What goes away, each with the icon the design puts beside it. */
  losing: [
    { key: 'membership', icon: 'CalendarHeart', label: 'Your membership details & benefits' },
    { key: 'bookings', icon: 'Home', label: 'All upcoming and past bookings' },
    { key: 'trips', icon: 'Briefcase', label: 'Your saved trips & travel plans' },
    { key: 'year', icon: 'CalendarCheck', label: 'Plan My Year events and reminders' },
    { key: 'offers', icon: 'BadgePercent', label: 'Your saved offers & wishlists' },
    { key: 'profile', icon: 'UserRound', label: 'Your profile & account information' },
  ],

  /** How long you have to change your mind — one number, used everywhere. */
  recoveryDays: 60,

  note: 'Your account will be deactivated. You can reactivate and resume your account within {days} days by simply logging in.',

  warning: {
    title: 'Resume within {days} days',
    body: 'Your data, membership and benefits will be safely stored for {days} days. If you don’t login within this period, your account and data will be permanently deleted.',
  },

  confirm: 'Deactivate Account',
  cancel: 'No, I don’t want to deactivate',
};

/* -- Plan My Trip -------------------------------------------------------- */

export const planTripHero = {
  title: 'Where would you like to go next?',
  body: 'Start planning your year with your upcoming trips.',
  image: 'plan-trip-hero',
};

/**
 * Everything the trip form asks.
 *
 * The option lists live here so the desk can add a transport mode or a meal
 * plan without touching the form, and so the success screen and My Travel
 * Year read the same vocabulary back.
 */
export const planTrip = {
  companions: ['Solo', 'Couple', 'Family', 'Friends', 'Group'],
  tripTypes: ['Family', 'Weekend', 'Business', 'Adventure'],
  partySizes: ['1-2 people', '3-4 people', '5-8 people', '9+ people'],
  occasions: ['Birthday', 'Anniversary', 'Honeymoon', 'Family Vacation', 'Other'],

  transport: [
    { key: 'flight', label: 'Flight', icon: 'Plane' },
    { key: 'train', label: 'Train', icon: 'Train' },
    { key: 'bus', label: 'Bus', icon: 'Bus' },
    { key: 'cab', label: 'Cab', icon: 'Car' },
  ],

  pickupFrom: ['Airport', 'Railway Station', 'Bus Stand', 'Home'],
  pickupTo: ['Hotel/Resort', 'Villa', 'Homestay', 'Other'],

  mealPlans: [
    'Breakfast & Dinner',
    'Breakfast only',
    'All meals',
    'No meals',
  ],

  /** The coloured markers the design puts against each diet. */
  mealTypes: [
    { key: 'veg', label: 'Veg', dots: ['#16a34a'] },
    { key: 'non-veg', label: 'Non-Veg', dots: ['#dc2626'] },
    { key: 'jain', label: 'Jain', dots: ['#65a30d'], leaf: true },
    { key: 'both', label: 'Veg & Non-Veg', dots: ['#16a34a', '#dc2626'] },
  ],

  extras: [
    'Room on higher floor',
    'Near Beach/Sea View',
    'Early Check-In',
    'Late Check-Out',
  ],
};

/** What the screen says once a trip is saved. */
export const planTripDone = {
  title: 'Your Trip is Planned!',
  note: 'We’ll remind you before your trip and notify you regarding your special days, relevant offers & experiences.',
  primary: 'View My Travel Plan',
  secondary: 'Add Another Trip',
};

/* -- The Offers screen --------------------------------------------------- */

export const offerCategories = ['All', 'Packages', 'Restaurant Offers', 'Water Park'];

/**
 * The package offers — a coloured panel with the price, and a photograph
 * behind it. `tone` is the gradient the design gives each one.
 */
export const packageOffers = [
  {
    id: 'free-stay',
    badge: 'Free Hotel Stay',
    from: '₹999/₹1249',
    tone: 'from-[#1b1560] to-[#2e2794]',
    image: 'villa-room-1',
    href: '/free-stay',
  },
  {
    id: 'india',
    badge: 'India Package',
    from: '₹1,999',
    tone: 'from-[#0f3f8f] to-[#1b5bc4]',
    image: 'more-hero',
    href: '/packages?region=india',
  },
  {
    id: 'group',
    badge: 'Group Departure',
    from: '₹4,999',
    duration: '5N/6D',
    tone: 'from-[#14532d] to-[#1f7a43]',
    image: 'plan-trip-hero',
    href: '/packages?kind=group',
  },
  {
    id: 'international',
    badge: 'International Trip',
    from: '₹17,999',
    duration: '3N/4D',
    tone: 'from-[#0d4f8b] to-[#1a74c4]',
    image: 'compare-landmarks',
    href: '/packages?region=international',
  },
  {
    id: 'island',
    badge: 'Island Trip',
    from: '₹22,999',
    duration: '3N/4D',
    tone: 'from-[#43248c] to-[#6d4bd8]',
    image: 'villa-beach',
    href: '/packages?kind=island',
  },
];

/** The two wide banners under the packages. */
export const promoOffers = [
  {
    id: 'weekend',
    badge: 'Weekend Getaway',
    title: 'Amazing Deals for this season',
    tone: 'from-[#1b1560] to-[#2e2794]',
    image: 'offer-weekend',
    href: '/offers?kind=weekend',
  },
  {
    id: 'seasonal',
    badge: 'Seasonal Getaway',
    title: 'Perfect Escapes for your weekend',
    tone: 'from-[#0f3f8f] to-[#1b5bc4]',
    image: 'offer-seasonal',
    href: '/offers?kind=seasonal',
  },
];

/**
 * The torn-ticket offers. `ink` is the colour the brand and the discount are
 * set in, which changes per card in the design rather than following one
 * accent.
 */
export const couponOffers = [
  {
    id: 'barbeque-nation',
    category: 'Restaurant Offers',
    brand: 'Barbeque Nation',
    deal: '20%',
    tone: 'from-[#fcdfc8] to-[#f7c39b]',
    ink: '#9a4a12',
    lines: ['Save on bill of ₹1000', 'Valid for dine-in • All over India'],
  },
  {
    id: 'pizza-hut',
    category: 'Restaurant Offers',
    brand: 'Pizza Hut',
    deal: '20%',
    tone: 'from-[#fbd2d2] to-[#f5abab]',
    ink: '#b3261e',
    lines: ['Save on bill of ₹1000', 'Valid for dine-in • All over India'],
  },
  {
    id: 'maharaja-bhog',
    category: 'Restaurant Offers',
    brand: 'Maharaja Bhog',
    deal: '₹150',
    tone: 'from-[#f8e2ac] to-[#e6be62]',
    ink: '#8a5a0a',
    lines: ['Save ₹150 off per person', 'Valid for dine-in • In multiple locations'],
  },
  {
    id: 'imagicaa',
    category: 'Water Park',
    brand: 'Imagicaa Water Park',
    deal: '₹300',
    tone: 'from-[#d2e2fb] to-[#b2c9f0]',
    ink: '#1d4ed8',
    lines: ['Save ₹300 on all tickets', 'Valid till 30 Sep 2026'],
  },
  {
    id: 'water-kingdom',
    category: 'Water Park',
    brand: 'Water Kingdom',
    deal: '₹150',
    tone: 'from-[#dcdcdc] to-[#b4b4b4]',
    ink: '#374151',
    lines: [
      'Asia’s largest theme water park',
      'Save ₹150 on all tickets',
      'Valid till 04 Oct 2026',
    ],
  },
  {
    id: 'great-escape',
    category: 'Water Park',
    brand: 'The Great Escape Water Park',
    deal: '₹150',
    tone: 'from-[#f6f279] to-[#e7e03f]',
    ink: '#166534',
    lines: ['Save ₹150 on every ticket', 'Valid till 30 Sep 2026'],
  },
];

/* -- Notifications ------------------------------------------------------- */

/** The colourways the design gives each kind of notification. */
export const notificationTones = {
  reminder: { dot: 'bg-[#c2456b]', label: 'text-ink-500' },
  offer: { dot: 'bg-[#5b3ec4]', label: 'text-[#5b3ec4]' },
};

export const notifications = [
  {
    id: 'n1',
    kind: 'Trip Reminder',
    tone: 'reminder',
    icon: 'PlaneTakeoff',
    title: 'Goa Getaway',
    body: 'Your trip to Goa is in 30 Days!',
    when: '30m ago',
    unread: true,
    href: '/profile/travel-year/goa',
  },
  {
    id: 'n2',
    kind: 'Exclusive Offer',
    tone: 'offer',
    icon: 'Percent',
    title: 'Goa Trip Special Offer',
    body: 'Get up to 25% OFF on top experiences, hotels & more!',
    when: '40m ago',
    unread: true,
    cta: { label: 'View Offers', href: '/offers' },
  },
  {
    id: 'n3',
    kind: 'Booking Update',
    tone: 'reminder',
    icon: 'CircleCheck',
    title: 'La Calypso Beach Resort & Casino',
    body: 'Your booking CHK-12 is confirmed. The property has your arrival time.',
    when: '2d ago',
    unread: false,
    href: '/profile/bookings',
  },
];

/* -- Flash Offers -------------------------------------------------------- */

/**
 * The offers on a clock.
 *
 * `endsInHours` is measured from when the page opens rather than a fixed
 * date, so the section never shows an expired deal while there is no backend
 * feeding it real deadlines. Swap it for an end timestamp when there is.
 */
export const flashOffers = [
  {
    id: 'phoenix-dining',
    badge: 'Restaurant Offer',
    brand: 'Phoenix Park Inn By Radison',
    place: 'Candolim, Goa',
    deal: 'Get Up To 40% OFF',
    endsInHours: 34,
    tone: 'from-[#10284a] to-[#1b4b7e]',
    href: '/offers?kind=restaurant-offers',
  },
  {
    id: 'imagicaa-flash',
    badge: 'Water Park',
    brand: 'Imagicaa Water Park',
    place: 'Khopoli, Maharashtra',
    deal: 'Flat ₹300 OFF on tickets',
    endsInHours: 20,
    tone: 'from-[#1b1560] to-[#3b2f9c]',
    href: '/offers?kind=water-park',
  },
  {
    id: 'salon-flash',
    badge: 'Saloon & Spa',
    brand: 'Tattva Spa',
    place: 'Across 14 cities',
    deal: 'Up To 35% OFF on spa days',
    endsInHours: 52,
    tone: 'from-[#3d1f4a] to-[#6d3b6f]',
    href: '/offers?kind=restaurant-offers',
  },
];

/** The badge the header wears once a membership is active. */
export const memberBadge = { label: 'Gold Member', href: '/membership' };

/* -- International Trips ------------------------------------------------- */

export const intlTabs = ['Customised Tours', 'Fixed departure'];

/** The three reassurances the design puts under the tabs. */
export const intlTrust = [
  { key: 'price', icon: 'Award', label: 'Best Price Guaranteed' },
  { key: 'help', icon: 'Sparkles', label: 'Personalized Assistance' },
  { key: 'safe', icon: 'ShieldCheck', label: '100% Safe & Secure' },
];

/** What the customised-tour form asks on top of the usual trip questions. */
export const intlForm = {
  hotelPreferences: ['Free Stay', '3 Star', '4 Star', '5 Star', 'Villa', 'Any'],
  durations: [
    '3 Nights / 4 Days',
    '4 Nights / 5 Days',
    '5 Nights / 6 Days',
    '7 Nights / 8 Days',
    '10 Nights / 11 Days',
  ],
  childAges: Array.from({ length: 18 }, (_, i) => `${i} Year${i === 1 ? '' : 's'}`),
  dropFrom: ['Hotel/Resort', 'Villa', 'Homestay'],
  dropTo: ['Airport', 'Railway Station', 'Bus Stand'],
  support: [
    'Visa Assistance',
    'Currency Exchange',
    'Travel Sim (International)',
    'Travel Insurance',
  ],
};

/** Where the fixed-departure tab suggests going. */
export const popularDestinations = [
  { key: 'bali', label: 'Bali, Indonesia', image: 'story-bali' },
  { key: 'sri-lanka', label: 'Sri Lanka', image: 'story-srilanka' },
  { key: 'mauritius', label: 'Mauritius', image: 'villa-ocean-pearl' },
];

/** How the results screen slices the packages. */
export const packageFilters = [
  { key: 'all', label: 'All packages' },
  { key: 'honeymoon', label: 'Honeymoon' },
  { key: 'premium', label: 'Premium' },
];

/**
 * The packages.
 *
 * One shape serves the listing and the detail screen: the cards read the top
 * of it, the detail page reads the rest. A package described once cannot end
 * up priced differently in two places.
 */
export const packages = [
  {
    id: 'bali-bliss',
    name: 'Bali Bliss Getaway',
    place: 'Bali, Indonesia',
    destination: 'bali',
    kinds: ['honeymoon', 'premium'],
    verified: true,
    rating: 4.4,
    reviews: 412,
    nights: 4,
    chips: [
      { label: 'Flight', icon: 'Plane' },
      { label: 'Hotel', icon: 'Building2' },
    ],
    more: 2,
    promo: {
      tone: 'blue',
      icon: 'Gift',
      title: 'Complimentary stay for members',
      note: 'Pay for food · Breakfast & Dinner included',
    },
    price: 64999,
    was: 67999,
    image: 'story-bali',
    about:
      'Experience the best of Bali with our exclusive package including luxurious stays, exciting sightseeing and unforgettable memories.',
    highlights: [
      'Return Flights',
      '4 Nights Accommodation',
      'Daily Breakfast & Dinner',
      'Travel Insurance',
      'Airport Transfers',
      'Sightseeing & City Tours',
    ],
    info: {
      bestTime: 'Apr - Oct',
      groupSize: '15 - 20',
      kind: 'International Trip',
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival In Bali',
        body: 'Arrival at Ngurah Rai International Airport. Meet & Greet and transfer to hotel. Check-in and relax.',
        meals: 'Hotel Stay',
      },
      {
        day: 2,
        title: 'Ubud & Kintamani Tour',
        body: 'Visit Tegenungan waterfall, Ubud Art market, and Kintamani volcano view point.',
        meals: 'Breakfast, Lunch, Hotel Stay',
      },
      {
        day: 3,
        title: 'Nusa Penida Island Tour',
        body: 'Full day Island Tour with scenic views and natural attractions.',
        meals: 'Breakfast, Lunch, Hotel Stay',
      },
      {
        day: 4,
        title: 'Leisure Day',
        body: 'Free day at leisure. Optional water sports and activities.',
        meals: 'Breakfast, Lunch, Hotel Stay',
      },
      {
        day: 5,
        title: 'Departure',
        body: 'Check-out and transfer to Airport for you return flight',
        meals: null,
      },
    ],
    inclusions: [
      'Return Economy Class Flights',
      '4 Nights Accommodation (3 star Hotel)',
      'Daily Breakfast & Dinner',
      'Travel Insurance',
      'Airport Transfers (Pick-up & Drop)',
      'All Sightseeing & City Tours as per Itinerary',
      '24/7 Travel Assistance',
    ],
  },
  {
    id: 'mauritius-paradise',
    name: 'Mauritius Paradise',
    place: 'Mauritius',
    destination: 'mauritius',
    kinds: ['premium'],
    rating: 4.2,
    reviews: 214,
    nights: 5,
    chips: [
      { label: 'Flight', icon: 'Plane' },
      { label: 'Hotel', icon: 'Building2' },
    ],
    more: 2,
    promo: {
      tone: 'blue',
      icon: 'Percent',
      title: 'Up to 40% Off for members',
      note: 'Limited time offer',
    },
    price: 54999,
    was: 57999,
    image: 'villa-ocean-pearl',
    about:
      'Lagoons, reefs and a whole island to slow down on. Five nights with transfers, breakfast and the snorkelling included.',
    highlights: [
      'Return Flights',
      '5 Nights Accommodation',
      'Daily Breakfast',
      'Airport Transfers',
      'Catamaran Cruise',
    ],
    info: { bestTime: 'May - Dec', groupSize: '12 - 18', kind: 'International Trip' },
    itinerary: [
      { day: 1, title: 'Arrival in Mauritius', body: 'Meet & Greet and transfer to your resort.', meals: 'Hotel Stay' },
      { day: 2, title: 'North Island Tour', body: 'Port Louis, Caudan Waterfront and the botanical gardens.', meals: 'Breakfast, Hotel Stay' },
      { day: 3, title: 'Catamaran Cruise', body: 'A day on the water with lunch aboard and snorkelling stops.', meals: 'Breakfast, Lunch, Hotel Stay' },
      { day: 4, title: 'South Island Tour', body: 'Chamarel, the seven-coloured earths and Black River Gorges.', meals: 'Breakfast, Hotel Stay' },
      { day: 5, title: 'Leisure Day', body: 'Free day at the resort or optional excursions.', meals: 'Breakfast, Hotel Stay' },
      { day: 6, title: 'Departure', body: 'Check-out and transfer to the airport.', meals: null },
    ],
    inclusions: [
      'Return Economy Class Flights',
      '5 Nights Accommodation (4 star Resort)',
      'Daily Breakfast',
      'Airport Transfers (Pick-up & Drop)',
      'Catamaran Cruise with lunch',
      '24/7 Travel Assistance',
    ],
  },
  {
    id: 'vietnam-explorer',
    name: 'Vietnam Explorer',
    place: 'Vietnam',
    destination: 'vietnam',
    kinds: ['premium'],
    rating: 4.1,
    reviews: 91,
    nights: 5,
    chips: [
      { label: 'Flight', icon: 'Plane' },
      { label: 'Hotel', icon: 'Building2' },
    ],
    more: 2,
    promo: null,
    price: 44999,
    was: 47999,
    image: 'villa-hero-hilltop',
    about:
      'Hanoi, Ha Long Bay and Da Nang across five nights, with the flights, transfers and the bay cruise arranged.',
    highlights: [
      'Return Flights',
      '5 Nights Accommodation',
      'Daily Breakfast',
      'Ha Long Bay Cruise',
      'Airport Transfers',
    ],
    info: { bestTime: 'Feb - Apr', groupSize: '15 - 20', kind: 'International Trip' },
    itinerary: [
      { day: 1, title: 'Arrival in Hanoi', body: 'Transfer to the hotel and an evening walk of the Old Quarter.', meals: 'Hotel Stay' },
      { day: 2, title: 'Ha Long Bay', body: 'Overnight cruise through the limestone karsts.', meals: 'Breakfast, Lunch, Dinner' },
      { day: 3, title: 'Back to Hanoi', body: 'Morning on the bay, then the drive back and a free evening.', meals: 'Breakfast, Hotel Stay' },
      { day: 4, title: 'Da Nang & Golden Bridge', body: 'Fly to Da Nang and visit the Ba Na Hills and Golden Bridge.', meals: 'Breakfast, Hotel Stay' },
      { day: 5, title: 'Hoi An', body: 'The lantern-lit old town and the tailoring street.', meals: 'Breakfast, Hotel Stay' },
      { day: 6, title: 'Departure', body: 'Check-out and transfer to the airport.', meals: null },
    ],
    inclusions: [
      'Return Economy Class Flights',
      '5 Nights Accommodation (3 star Hotel)',
      'Daily Breakfast',
      'Ha Long Bay overnight cruise',
      'Airport Transfers (Pick-up & Drop)',
      '24/7 Travel Assistance',
    ],
  },
  {
    id: 'bali-adventure',
    name: 'Bali Adventure',
    place: 'Bali, Indonesia',
    destination: 'bali',
    kinds: ['honeymoon'],
    rating: 4.2,
    reviews: 214,
    nights: 4,
    chips: [
      { label: 'Flight', icon: 'Plane' },
      { label: '3 Star Hotel', icon: 'Building2' },
    ],
    more: 2,
    promo: {
      tone: 'blue',
      icon: 'Percent',
      title: 'Up to 40% Off for members',
      note: 'Limited time offer',
    },
    price: 54999,
    was: 57999,
    image: 'villa-beach',
    about: 'The same island at a quicker pace — rafting, volcano sunrise and the reef.',
    highlights: ['Return Flights', '4 Nights Accommodation', 'Daily Breakfast', 'Airport Transfers'],
    info: { bestTime: 'Apr - Oct', groupSize: '15 - 20', kind: 'International Trip' },
    itinerary: [
      { day: 1, title: 'Arrival In Bali', body: 'Transfer to hotel and check in.', meals: 'Hotel Stay' },
      { day: 2, title: 'Ayung River Rafting', body: 'White water rafting through the gorge.', meals: 'Breakfast, Lunch' },
      { day: 3, title: 'Mount Batur Sunrise', body: 'Early trek for the sunrise over the caldera.', meals: 'Breakfast' },
      { day: 4, title: 'Reef Day', body: 'Snorkelling and a free afternoon.', meals: 'Breakfast' },
      { day: 5, title: 'Departure', body: 'Check-out and airport transfer.', meals: null },
    ],
    inclusions: [
      'Return Economy Class Flights',
      '4 Nights Accommodation (3 star Hotel)',
      'Daily Breakfast',
      'Airport Transfers (Pick-up & Drop)',
      '24/7 Travel Assistance',
    ],
  },
  {
    id: 'bali-escape',
    name: 'Bali Escape',
    place: 'Bali, Indonesia',
    destination: 'bali',
    kinds: ['premium'],
    rating: 4.1,
    reviews: 91,
    nights: 4,
    chips: [
      { label: 'Flight', icon: 'Plane' },
      { label: '4 Star Hotel', icon: 'Building2' },
    ],
    more: 2,
    promo: null,
    price: 44999,
    was: 47999,
    image: 'villa-hero-luxury',
    about: 'Four nights in Seminyak with the beach clubs and the sunsets, and very little else on the schedule.',
    highlights: ['Return Flights', '4 Nights Accommodation', 'Daily Breakfast', 'Airport Transfers'],
    info: { bestTime: 'Apr - Oct', groupSize: '10 - 15', kind: 'International Trip' },
    itinerary: [
      { day: 1, title: 'Arrival In Bali', body: 'Transfer to Seminyak and check in.', meals: 'Hotel Stay' },
      { day: 2, title: 'Beach Day', body: 'Free day on the beach and at the clubs.', meals: 'Breakfast' },
      { day: 3, title: 'Uluwatu & Kecak', body: 'The clifftop temple and the fire dance at sunset.', meals: 'Breakfast' },
      { day: 4, title: 'Leisure Day', body: 'Spa, shopping or simply nothing at all.', meals: 'Breakfast' },
      { day: 5, title: 'Departure', body: 'Check-out and airport transfer.', meals: null },
    ],
    inclusions: [
      'Return Economy Class Flights',
      '4 Nights Accommodation (4 star Hotel)',
      'Daily Breakfast',
      'Airport Transfers (Pick-up & Drop)',
      '24/7 Travel Assistance',
    ],
  },
];

/** The tabs on a package's own page. */
export const packageTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'inclusions', label: 'Inclusions' },
  { key: 'policies', label: 'Policies' },
];

/** The member banner on a package page. */
export const packageMemberBenefit = {
  title: 'Smira Club Member Benefits',
  body: 'Up to 40% on this Package',
  note: 'Exclusive discounts for members',
  cta: 'View Benefits',
};

/**
 * Package policies. These follow the Cancellation and Refund policies rather
 * than inventing their own numbers — a package that promised something
 * different from the policy pages would be the one people quote back.
 */
export const packagePolicies = [
  {
    title: 'Cancellation Policy',
    lines: [
      'More than 30 days before departure: Full refund',
      '15 - 30 days before departure: 50% refund',
      'Less than 15 days before departure: No refund',
    ],
  },
  {
    title: 'Reschedule Policy',
    lines: ['Reschedule allowed 15 days before departure with applicable charges.'],
  },
  {
    title: 'Payment Policy',
    lines: [
      '50% advance at the time of booking. Balance should be paid before 15 days of departure.',
    ],
  },
  {
    title: 'Travel Policy',
    lines: ['Passport should be valid for atleast 6 months from travel date.'],
  },
];
