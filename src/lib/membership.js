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

export const isMember = (m) => Boolean(m?.plan && m?.reference);

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
