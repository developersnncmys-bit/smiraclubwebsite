'use client';

import { useEffect, useRef } from 'react';
import { api } from '@/lib/api';

/**
 * Tells the desk that somebody opened this listing.
 *
 * It has to happen in the browser. The page itself is cached and re-served
 * for a minute at a time, so counting where it is rendered would count one
 * view for every hundred people who read it.
 *
 * Nothing is sent but the listing's id, and a failed ping is ignored: a
 * tally is not worth an error in front of somebody reading a page.
 */
export default function CountView({ id }) {
  const counted = useRef(false);

  useEffect(() => {
    // Effects run twice in development; the listing was still opened once.
    if (!id || counted.current) return;
    counted.current = true;
    api.countListingView(id).catch(() => {});
  }, [id]);

  return null;
}
