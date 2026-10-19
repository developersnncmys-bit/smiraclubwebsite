'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * What the page's search panel currently holds, so the header can show it.
 *
 * The panel scrolls away after the first screenful and the search goes
 * with it, which is the one thing a member on the home page is most
 * likely to want next. The header keeps the search within reach.
 *
 * The panel owns the values and this carries them upward, so the box the
 * header opens starts on the dates and guests already chosen rather than
 * on a fresh set of defaults the member never asked for.
 *
 * It is a subscription rather than a context on purpose. A context above
 * the whole tree would re-render every client component on the page for
 * each letter typed into the destination box; here only the header
 * listens, so only the header redraws.
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

/*
 * Whether the header's own search box is open.
 *
 * The icon is drawn twice — once in the phone row, once in the desktop
 * one — and the box is drawn once, under both. They cannot each keep
 * their own idea of open, so it is kept here.
 */
const opened = { value: false, listeners: new Set() };

export function setSearchOpen(value) {
  opened.value = Boolean(value);
  opened.listeners.forEach((listen) => listen());
}

function subscribeOpen(listen) {
  opened.listeners.add(listen);
  return () => opened.listeners.delete(listen);
}

export function useSearchOpen() {
  const read = useCallback(() => opened.value, []);
  const onServer = useCallback(() => false, []);
  return useSyncExternalStore(subscribeOpen, read, onServer);
}
