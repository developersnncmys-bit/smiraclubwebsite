'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * What the page's search panel currently holds, so the header can show it.
 *
 * The panel scrolls away after the first screenful and the search goes
 * with it, which is the one thing a member on the home page is most
 * likely to want next. The header keeps a compact copy of it.
 *
 * The panel owns the values; this only carries them upward. Two forms
 * each holding their own idea of the dates would drift apart within a
 * tap, and the member would have no way of knowing which one the Search
 * button was about to use.
 *
 * It is a subscription rather than a context on purpose. A context above
 * the whole tree would re-render every client component on the page for
 * each letter typed into the destination box; here only the header bar
 * listens, so only the header bar redraws.
 */

const store = { value: null, listeners: new Set() };

/** The panel calls this as it changes, and with null as it unmounts. */
export function publishSearch(value) {
  store.value = value;
  store.listeners.forEach((listen) => listen());
}

function subscribe(listen) {
  store.listeners.add(listen);
  return () => store.listeners.delete(listen);
}

/** Null on every page that has no panel — the header then shows nothing. */
export function useHeaderSearch() {
  const read = useCallback(() => store.value, []);
  const onServer = useCallback(() => null, []);
  return useSyncExternalStore(subscribe, read, onServer);
}
