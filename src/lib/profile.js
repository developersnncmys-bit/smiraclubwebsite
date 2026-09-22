'use client';

import { useEffect, useState } from 'react';

/**
 * The member's profile, kept in this browser.
 *
 * The site has no sign-in yet, so Complete Your Profile saves here and every
 * booking screen reads it back: it is what fills in the guest, and a booking
 * cannot go ahead until the required first step — name, email and a mobile
 * number — is filled in. The same details go to the Smira desk with each
 * booking, so the customer record there carries them too.
 */

const KEY = 'smira:profile';

export function loadProfile() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    /* storage blocked — the profile lasts until the tab closes */
  }
}

/** Step one of the profile, the part a booking needs. */
export function isComplete(p) {
  const d = p?.details;
  return Boolean(
    d &&
      d.name?.trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email?.trim() || '') &&
      /^\d{10}$/.test((d.phone || '').replace(/\D/g, '').slice(-10)),
  );
}

/** Where to send someone to finish their profile, coming back here after. */
export function completeProfileHref() {
  const here = `${window.location.pathname}${window.location.search}`;
  return `/profile/edit?next=${encodeURIComponent(here)}`;
}

/**
 * The saved profile, read after mount so the server and the browser agree on
 * the first paint. `ready` is false until it has been read.
 */
export function useProfile() {
  const [state, setState] = useState({ ready: false, profile: null });
  useEffect(() => setState({ ready: true, profile: loadProfile() }), []);
  return state;
}

/** What a booking sends about the member, from the saved profile. */
export function profileForBooking(p) {
  if (!p) return undefined;
  const self = (p.birthdays || []).find((b) => /self|me/i.test(b.relationship || '')) || (p.birthdays || [])[0];
  return {
    dob: self?.dob || undefined,
    anniversary: p.anniversary?.date || undefined,
    address: [p.address?.line1, p.address?.line2].filter(Boolean).join(', ') || undefined,
    city: p.address?.city || undefined,
    state: p.address?.state || undefined,
    pincode: p.address?.pincode || undefined,
    whatsapp: p.whatsapp,
  };
}
