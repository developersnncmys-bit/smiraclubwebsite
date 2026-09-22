'use client';

import { useEffect } from 'react';

const KEY = 'smira:attribution';

/**
 * Remembers the campaign a visitor arrived on.
 *
 * An ad, a WhatsApp broadcast or any campaign link carries utm_source and
 * utm_campaign. They are only on the first page, so they are kept for the
 * visit and sent with an enquiry — which is how Sales & Leads can say a lead
 * came from that campaign rather than from the website in general.
 */
export default function Attribution() {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const source = q.get('utm_source');
    const campaign = q.get('utm_campaign');
    if (!source && !campaign) return;
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify({ source: source || '', campaign: campaign || '' }));
    } catch {
      /* storage blocked — the enquiry goes in as a website one */
    }
  }, []);
  return null;
}

/** The campaign this visit came from, if any. */
export function readAttribution() {
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY)) || undefined;
  } catch {
    return undefined;
  }
}
