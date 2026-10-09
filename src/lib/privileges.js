import { membershipPrivileges } from '@/lib/content';

/**
 * Which privilege covers which part of the site.
 *
 * A plan sells a number — Silver is one privilege — and the member picks
 * which. Until now nothing checked: somebody who took Free Stay could open
 * a villa and be quoted a member rate the membership does not cover.
 *
 * Keyed by the first segment of the address, because that is the one thing
 * every service page already agrees on.
 */
export const PRIVILEGE_BY_SECTION = {
  villas: 'villa',
  'free-stay': 'homestay',
  hotels: 'hotel',
  packages: 'tour',
  'group-departures': 'group',
  luxury: 'luxury',
  flights: 'flight',
  'train-bus': 'train',
  'travel-support': 'support',
};

/**
 * An international trip lives under /packages but is its own privilege,
 * so it is checked before the section it sits in.
 */
const DEEPER = [[['packages', 'international'], 'international']];

/** The privilege a path needs, or null where none is required. */
export function privilegeFor(path) {
  const parts = String(path || '').split('?')[0].split('/').filter(Boolean);

  const deeper = DEEPER.find(([segments]) => segments.every((seg, i) => parts[i] === seg));
  if (deeper) return deeper[1];

  return PRIVILEGE_BY_SECTION[parts[0]] || null;
}

/** The privilege as the member reads it: its name, its blurb, its icon. */
export function privilegeInfo(key) {
  return membershipPrivileges.find((p) => p.key === key) || null;
}

/**
 * Whether this membership covers this part of the site.
 *
 * No membership at all is not "not covered" — it is somebody who has not
 * joined, and the pages already ask those people to. Only a member who
 * holds privileges and did not take this one is turned away.
 */
export function covers(membership, key) {
  if (!key) return true;
  if (!membership) return true;
  const held = membership.privileges || [];
  if (!held.length) return true;
  return held.includes(key);
}
