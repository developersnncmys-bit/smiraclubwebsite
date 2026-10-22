'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

/**
 * What this member's bookings have actually saved them.
 *
 * It was written into the site once — twelve thousand nine hundred and
 * ninety-nine across six bookings — so every member read the same
 * figure whether they had booked six times or never. Every booking
 * records what came off it; this is the sum of that.
 *
 * `{ total: 0, across: 0 }` for a visitor, which is the truth rather
 * than a blank.
 */
export function useSavings() {
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) return undefined;
    let live = true;
    api
      .memberSavings(token)
      .then((res) => live && setSaved(res.data || null))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return { total: Number(saved?.total || 0), across: Number(saved?.across || 0) };
}
