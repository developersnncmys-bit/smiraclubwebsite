'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist';

/** Wishlist: everything saved from a card's ⋮ menu or a property's heart. */
export default function WishlistScreen() {
  const { items, remove } = useWishlist();

  if (!items.length) {
    return (
      <div className="shell py-12 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-action-500">
          <Heart size={28} />
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink-900">Nothing saved yet</h2>
        <p className="mx-auto mt-1 max-w-xs text-[14px] text-ink-600">
          Tap the ⋮ on any stay, offer or experience and choose Add to Wishlist.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex rounded-xl px-8 py-3 text-[15px] normal-case tracking-normal">
          Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-5 lg:py-8">
      <p className="text-[14px] text-ink-600">
        {items.length} saved {items.length === 1 ? 'item' : 'items'}
      </p>
      <ul className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
        {items.map((item) => (
          <li key={item.href} className="card flex gap-3.5 p-3">
            <Link href={item.href} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-soft">
              {item.image && <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={item.href} className="line-clamp-2 text-[15px] font-bold leading-tight text-ink-900 hover:underline">
                {item.name}
              </Link>
              {item.place && (
                <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-600">
                  <MapPin size={14} className="shrink-0" />
                  {item.place}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4">
                <Link href={item.href} className="text-[13px] font-bold text-action-500">
                  View Details
                </Link>
                <button
                  type="button"
                  onClick={() => remove(item.href)}
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-500 hover:text-red-600"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
