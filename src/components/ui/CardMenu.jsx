'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Heart, LayoutGrid, MoreVertical, Share2 } from 'lucide-react';
import { sharePage, useWishlist } from '@/lib/wishlist';

/**
 * The ⋮ on every listing card: Wishlist, Share, and Similar.
 *
 * `item` is what gets saved — { href, name, place, image } — and `similar`
 * is { href, label } for the third line: more of the same kind, near the
 * same place. The menu opens under the dots on a phone and a desktop alike,
 * and closes on a pick, a click outside, or Escape.
 */
export default function CardMenu({ item, similar }) {
  const { has, toggle } = useWishlist();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const root = useRef(null);
  const saved = has(item.href);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => !root.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('touchstart', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('touchstart', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const flash = (text) => {
    setNote(text);
    setTimeout(() => setNote(''), 1800);
  };

  const row =
    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] font-medium text-ink-900 transition hover:bg-surface-soft';

  return (
    <div ref={root} className="relative -mr-1 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`More options for ${item.name}`}
        className="grid h-8 w-8 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-9 z-30 w-56 overflow-hidden rounded-xl border border-surface-line bg-white py-1.5 shadow-lift">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              toggle(item);
              setOpen(false);
              flash(saved ? 'Removed from Wishlist' : 'Saved to Wishlist');
            }}
            className={row}
          >
            <Heart size={18} className={saved ? 'text-red-500' : 'text-ink-700'} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              const how = await sharePage({ title: item.name, href: item.href });
              if (how === 'copied') flash('Link copied');
              if (how === 'failed') flash('Could not share');
            }}
            className={row}
          >
            <Share2 size={18} className="text-ink-700" />
            Share
          </button>
          {similar && (
            <Link href={similar.href} role="menuitem" onClick={() => setOpen(false)} className={row}>
              <LayoutGrid size={18} className="text-ink-700" />
              {similar.label}
            </Link>
          )}
        </div>
      )}

      {note && (
        <p role="status" className="absolute right-0 top-9 z-30 whitespace-nowrap rounded-lg bg-ink-900/90 px-3 py-1.5 text-[12px] font-semibold text-white">
          {note}
        </p>
      )}
    </div>
  );
}
