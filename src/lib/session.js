'use client';

/**
 * The member's session token, given out when the code on their number was
 * proved. It is what the API reads to answer "my bookings" and "my
 * membership" — the website never asks for those by phone number.
 */

const KEY = 'smira:token';

export function getSessionToken() {
  try {
    return window.localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

export function setSessionToken(token) {
  try {
    if (token) window.localStorage.setItem(KEY, token);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage blocked — the session lasts until the tab closes */
  }
}
