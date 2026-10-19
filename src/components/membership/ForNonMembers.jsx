'use client';

import { isMember, useMembership } from '@/lib/membership';

/**
 * Hides a section from somebody who has already joined.
 *
 * A page selling membership to a member is a page telling them to buy
 * what they are already paying for. The sections it wraps are built on
 * the server — they read artwork off the filesystem — so this sits
 * around them rather than inside them.
 *
 * Until the browser has said who is reading, the section stays. Most
 * readers are not members, and showing it and then taking it away is
 * better than a hole that fills in a moment later.
 */
export default function ForNonMembers({ children }) {
  const { ready, membership } = useMembership();

  if (ready && isMember(membership)) return null;
  return children;
}
