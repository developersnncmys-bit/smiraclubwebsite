'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * The member's wishlist, kept in the browser until there are accounts to
 * keep it against. Every card's ⋮ menu, the heart on a property's photos and
 * the Wishlist screen all read and write this one list, and a change in one
 * place is announced so the others update without a reload.
 *
 * An item is { href, name, place, image } — enough to draw it on the Wishlist
 * screen and take the member back to it. `href` is its identity.
 */
const KEY = 'smira.wishlist';
const EVENT = 'smira:wishlist';

function read() {
  try {
    const list = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage blocked (private mode, full): the change still shows this visit.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
}

export function useWishlist() {
  // Empty on the server and the first paint, so the two always agree.
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(read());
    const sync = (e) => setItems(e.detail || read());
    const fromOtherTab = (e) => e.key === KEY && setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', fromOtherTab);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', fromOtherTab);
    };
  }, []);

  const has = useCallback((href) => items.some((i) => i.href === href), [items]);

  const toggle = useCallback((item) => {
    const list = read();
    const next = list.some((i) => i.href === item.href)
      ? list.filter((i) => i.href !== item.href)
      : [{ ...item, savedAt: Date.now() }, ...list];
    write(next);
  }, []);

  const remove = useCallback((href) => write(read().filter((i) => i.href !== href)), []);

  return { items, has, toggle, remove };
}

/** Share a page: the phone's share sheet where there is one, else copy the link. */
export async function sharePage({ title, href }) {
  const url = new URL(href, window.location.origin).toString();
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch {
      // Dismissed — fall through to copying.
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    // Clipboard API refused (older browser, insecure origin, blocked
    // permission) — the old copy command still works in most of those.
  }
  try {
    const box = document.createElement('textarea');
    box.value = url;
    box.setAttribute('readonly', '');
    box.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(box);
    box.select();
    const ok = document.execCommand('copy');
    box.remove();
    return ok ? 'copied' : 'failed';
  } catch {
    return 'failed';
  }
}
