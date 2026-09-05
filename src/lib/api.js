/**
 * A thin client for the Smira API.
 *
 * The site ships running on its own content — set NEXT_PUBLIC_API_URL and the
 * pages that want live data can start asking for it. Nothing calls this yet,
 * which is deliberate: the backend and the site were built separately.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

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
    next: next || { revalidate: 60 },
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

  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/auth/me', { token }),
};

export { ApiError };
