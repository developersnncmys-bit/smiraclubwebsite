'use client';

import { useEffect, useState } from 'react';

/**
 * Whether this visitor is a Smira Club member, kept in this browser.
 *
 * Anyone can search, but the details of a stay or experience are for members:
 * a visitor who is not one is sent to the membership page, and back to where
 * they were once they have joined. Joining sends the membership to the Smira
 * desk (it lands on the Members page, payment pending) and records it here.
 */

const KEY = 'smira:membership';

export function loadMembership() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveMembership(m) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* storage blocked — membership lasts until the tab closes */
  }
}

/**
 * The statuses that mean somebody actually holds a membership.
 *
 * The desk's own list runs Quoted, New, Active, Pending activation,
 * Expiring soon, Expired, Suspended, Cancelled. Only two of those are a
 * membership you can use.
 */
const LIVE = ['Active', 'Expiring soon'];

/**
 * Whether this visitor holds a membership.
 *
 * It used to ask only whether one had been saved here, and one is saved
 * the moment somebody presses Pay Now — on Payment pending, before any
 * money has moved. So the header called them a Platinum Member for
 * having opened the payment sheet, and members-only pages let them
 * straight through. The desk had the same bug on its side and now
 * counts a membership once it is paid; this is the browser's half.
 */
export const isMember = (m) => Boolean(m?.plan && m?.reference && LIVE.includes(m.status));

/** A membership that is over rather than on its way. */
const DEAD = ['Cancelled', 'Expired', 'Suspended'];

/**
 * Asked for, not yet paid for. Worth saying out loud rather than
 * showing "Become a Member" to somebody who is halfway through doing
 * exactly that — but a membership that was cancelled or has run out is
 * not pending anything, and they are back to being a visitor.
 */
export const membershipPending = (m) =>
  Boolean(m?.plan && m?.reference && !isMember(m) && !DEAD.includes(m.status));

/** Where to send a visitor to join, coming back here after. */
export function joinHref() {
  const here = `${window.location.pathname}${window.location.search}`;
  return `/membership?next=${encodeURIComponent(here)}`;
}

/** The saved membership, read after mount. `ready` is false until then. */
export function useMembership() {
  const [state, setState] = useState({ ready: false, membership: null });
  useEffect(() => setState({ ready: true, membership: loadMembership() }), []);
  return state;
}
