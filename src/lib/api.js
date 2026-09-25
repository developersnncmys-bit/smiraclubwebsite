/**
 * A thin client for the Smira API.
 *
 * The deployed API is the default so a build with nothing configured still
 * reaches it; NEXT_PUBLIC_API_URL points it somewhere else. Most of the site
 * runs on its own content — the one thing that genuinely has to reach the
 * desk is a partner application.
 */

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://smiraclubbackend.vercel.app/api').replace(/\/$/, '');

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, token, next } = {}) {
  if (!BASE) throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not set');

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    // Only a GET is worth caching; a submission has to go every time.
    ...(method === 'GET' ? { next: next || { revalidate: 60 } } : { cache: 'no-store' }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.message || 'That request did not work', json.details);
  return json;
}

export const api = {
  /** Whether the site has somewhere to ask. */
  get isConfigured() {
    return Boolean(BASE);
  },

  /**
   * What the desk is selling, from Travel Inventory on the admin panel —
   * hotels, villas, restaurants, spas, activities, packages and the rest.
   * Anything the desk adds there reaches the site without a deploy.
   */
  catalog: (query = '') => request(`/website/catalog${query}`, { next: { revalidate: 60 } }),
  catalogItem: (id) => request(`/website/catalog/${encodeURIComponent(id)}`, { next: { revalidate: 60 } }),

  /** The offers the desk has put live on the panel's Offers page. */
  deskOffers: () => request('/website/offers', { next: { revalidate: 60 } }),

  /**
   * Any other service asked for on the site — a trip planned, a visa,
   * insurance, forex. It lands in the admin panel's Sales & Leads as a new
   * lead, tagged by service, with every answer on the form written onto it.
   */
  enquiry: (form) =>
    request('/website/enquiry', { method: 'POST', body: form, next: { revalidate: 0 } }),

  /**
   * A property owner applying from the Become a Partner page. It lands in the
   * admin panel's partner onboarding as a registration waiting on papers.
   */
  applyAsPartner: (form) =>
    request('/partners/apply', { method: 'POST', body: form, next: { revalidate: 0 } }),

  /**
   * A customised international tour asked for from International Trips. It
   * lands in the admin panel's Sales & Leads as a new lead, with every answer
   * on the form written onto it.
   */
  tripEnquiry: (form) =>
    request('/website/trip-enquiry', { method: 'POST', body: form, next: { revalidate: 0 } }),

  /**
   * A fixed-departure package booked from its page. It lands on the admin
   * panel's Booking page as a pending booking for the desk to confirm.
   */
  packageBooking: (form) =>
    request('/website/package-booking', { method: 'POST', body: form, next: { revalidate: 0 } }),

  /**
   * Any other booking made on the website — hotel, villa, free stay, table,
   * park, spa and the rest. It lands on the Booking page as pending and in
   * Sales & Leads as a new lead.
   */
  websiteBooking: (form) =>
    request('/website/booking', { method: 'POST', body: form, next: { revalidate: 0 } }),

  /**
   * A membership bought on the membership page. It lands on the admin
   * panel's Members page as new, payment pending, for the desk to activate.
   */
  /**
   * Signing in with a mobile number: ask for the code, then prove it. What
   * comes back is the member's own details and membership, so they can pick
   * up on any device.
   */
  memberOtpRequest: (phone) =>
    request('/website/member/otp', { method: 'POST', body: { phone }, next: { revalidate: 0 } }),
  memberVerify: (phone, code) =>
    request('/website/member/verify', { method: 'POST', body: { phone, code }, next: { revalidate: 0 } }),

  /** The signed-in member's own details, membership and bookings. */
  memberMe: (token) => request('/website/member/me', { token, next: { revalidate: 0 } }),

  /** The membership plans as set up on the admin panel's Plans page. */
  websitePlans: () => request('/website/plans', { next: { revalidate: 60 } }),

  joinMembership: (form) =>
    request('/website/membership', { method: 'POST', body: form, next: { revalidate: 0 } }),

  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/auth/me', { token }),
};

export { ApiError };
