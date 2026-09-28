'use client';

import { getSessionToken } from '@/lib/session';
import { loadProfile } from '@/lib/profile';
import { isMember, loadMembership } from '@/lib/membership';

/**
 * Whether this browser already belongs to somebody.
 *
 * Three things can make that true and any one of them is enough: a session
 * token from proving a code, a membership, or a profile with a name and a
 * number in it.
 *
 * The popup used to ask whether the profile was *complete*, which is a
 * different question — somebody who had signed in but never filled in their
 * anniversary was shown the sign-in sheet again on every visit. Finished and
 * signed in are not the same thing, and only one of them is a reason to ask
 * somebody to sign in.
 */
export function hasAccount(profile = loadProfile(), membership = loadMembership()) {
  if (getSessionToken()) return true;
  if (isMember(membership)) return true;
  const d = profile?.details;
  return Boolean(d?.name?.trim() && String(d.phone || '').replace(/\D/g, '').length >= 10);
}
