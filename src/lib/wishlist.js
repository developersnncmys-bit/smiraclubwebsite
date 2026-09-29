'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

/**
 * The member's wishlist.
 *
 * Every card's ⋮ menu, the heart on a property's photos and the Wishlist
 * screen all read and write this one list, and a change in one place is
 * announced so the others update without a reload.
 *
 * It is kept in two places on purpose. The browser's copy is what draws
 * the screen — instantly, offline, and for somebody who has not signed in
 * at all. A signed-in member's copy also goes to Smira, so the six villas
 * they saved on a phone are there on a laptop, and so the desk can see
 * what a member has been looking at instead of guessing.
 *
 * Signing in merges rather than replaces: anything saved while signed out
 * is sent up and kept, because watching your list empty itself the moment
 * you log in is worse than having no list at all.
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

/**
 * Send a change up, and take the server's answer as the truth.
 *
 * A failure is swallowed on purpose: the heart has already filled in and
 * the browser has already kept it, so an unreachable API should cost the
 * member nothing. The next change, or the next sign-in, sends it again.
 */
async function pushUp(body) {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const res = await api.wishlistWrite(token, body);
    return Array.isArray(res.data) ? res.data : null;
  } catch {
    return null;
  }
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

  /**
   * Once, on arrival: hand the server whatever this browser was holding
   * and take back the merged list.
   */
  useEffect(() => {
    let live = true;
    if (!getSessionToken()) return undefined;
    (async () => {
      const merged = await pushUp({ merge: read() });
      if (live && merged) write(merged);
    })();
    return () => { live = false; };
  }, []);

  const has = useCallback((href) => items.some((i) => i.href === href), [items]);

  const toggle = useCallback((item) => {
    const list = read();
    const saved = list.some((i) => i.href === item.href);
    const savedAt = Date.now();
    // The screen moves now; the server catches up.
    write(saved ? list.filter((i) => i.href !== item.href) : [{ ...item, savedAt }, ...list]);
    pushUp(saved ? { remove: item.href } : { save: { ...item, savedAt } });
  }, []);

  const remove = useCallback((href) => {
    write(read().filter((i) => i.href !== href));
    pushUp({ remove: href });
  }, []);

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
