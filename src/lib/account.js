'use client';

import { getSessionToken } from '@/lib/session';
import { loadProfile, useProfile } from '@/lib/profile';
import { isMember, loadMembership, useMembership } from '@/lib/membership';

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

/**
 * The same question, asked safely from a component's render.
 *
 * `hasAccount` reads localStorage, which does not exist while the page is
 * being rendered on the server. Calling it straight from a render meant
 * the server decided "signed out", the browser's very first render decided
 * "signed in", and React threw the tree away and rebuilt it — a hydration
 * error, and a visible flicker on every page with a tab bar.
 *
 * This waits until the component has mounted, so the first render always
 * agrees with the server and the truth arrives a tick later.
 */
export function useAccount() {
  const { ready: profileReady, profile } = useProfile();
  const { ready: membershipReady, membership } = useMembership();
  const ready = profileReady && membershipReady;
  return { ready, signedIn: ready ? hasAccount(profile, membership) : false, profile, membership };
}
