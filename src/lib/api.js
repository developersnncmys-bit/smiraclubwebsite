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

  plans: () => request('/membership-plans'),
  inventory: (query = '') => request(`/inventory${query}`),
  offers: () => request('/offers'),

  /**
   * A property owner applying from the Become a Partner page. The only write
   * the public site makes, and it lands in the admin panel's partner
   * onboarding as a registration waiting on papers.
   */
  applyAsPartner: (form) =>
    request('/partners/apply', { method: 'POST', body: form, next: { revalidate: 0 } }),

  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/auth/me', { token }),
};

export { ApiError };
