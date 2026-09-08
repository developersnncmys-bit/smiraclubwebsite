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

/** The four tabs above the search panel. */
export const searchTabs = [
  { key: 'free-stay', label: 'Free Stay', icon: 'BedDouble' },
  { key: 'hotel', label: 'Hotel', icon: 'Building2' },
  { key: 'package', label: 'Package', icon: 'Palmtree' },
  { key: 'villa', label: 'Villa', icon: 'Home' },
];

/** All Services — the sixteen tiles, in the order the design lists them. */
export const services = [
  { key: 'free-stay', label: 'Free Stay', icon: 'BedDouble', href: '/free-stay' },
  { key: 'hotel', label: 'Hotel Booking', icon: 'Building2', href: '/hotels' },
  { key: 'india', label: 'India package', icon: 'Landmark', href: '/packages?region=india' },
  { key: 'international', label: 'International Trip', icon: 'Plane', href: '/packages?region=international' },
  { key: 'group', label: 'Group Departure', icon: 'Users', href: '/packages?kind=group' },
  { key: 'island', label: 'Island Trip', icon: 'Palmtree', href: '/packages?kind=island' },
  { key: 'villa', label: 'Villa & Homestays', icon: 'Home', href: '/villas' },
  { key: 'camping', label: 'Camping Booking', icon: 'Tent', href: '/packages?kind=camping' },
  { key: 'support', label: 'Travel Support', icon: 'LifeBuoy', href: '/more/support' },
  { key: 'restaurant', label: 'Restaurant Offers', icon: 'UtensilsCrossed', href: '/offers?kind=dining' },
  { key: 'games', label: 'Games Zone', icon: 'Gamepad2', href: '/offers?kind=games' },
  { key: 'salon', label: 'Saloon & Spa', icon: 'Sparkles', href: '/offers?kind=salon' },
  { key: 'waterpark', label: 'Waterpark & Themepark', icon: 'Waves', href: '/offers?kind=parks' },
  { key: 'adventure', label: 'Adventure', icon: 'Mountain', href: '/packages?kind=adventure' },
  { key: 'entertainment', label: 'Entertainment', icon: 'Clapperboard', href: '/offers?kind=entertainment' },
  { key: 'health', label: 'Health', icon: 'HeartPulse', href: '/offers?kind=health' },
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
