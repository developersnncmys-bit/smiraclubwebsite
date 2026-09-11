'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { inr } from '@/lib/format';

/**
 * The bar pinned to the bottom of a villa's page: what it costs, and the way
 * on to Review Booking. It owns the bottom edge outright — the tab bar is
 * hidden on this route, so there is nothing underneath it to clear.
 */
export default function BookingBar({ name, layout, price, was, taxes, bookHref }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:bottom-6">
      <div className="border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:mx-auto lg:max-w-3xl lg:rounded-2xl lg:border lg:shadow-lift">
        <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-6">
        {/*
          A phone has no room for this, but a desktop has plenty — and an
          empty half of the bar with the price marooned at the far edge is
          what it looks like otherwise. So the space names the villa.
        */}
        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="truncate text-[14px] font-bold text-ink-900">{name}</p>
          <p className="truncate text-[13px] text-ink-500">{layout}</p>
        </div>

        <div className="min-w-0 flex-1 lg:flex-none lg:text-right">
          <p className="flex flex-wrap items-baseline gap-2 lg:justify-end">
            <span className="text-xl font-extrabold text-ink-900">{inr(price)}</span>
            {was && (
              <span className="text-[14px] font-semibold text-red-500 line-through">{inr(was)}</span>
            )}
          </p>
          <p className="text-[13px] leading-tight text-ink-500">
            +{taxes.toLocaleString('en-IN')} taxes &amp; fees per night
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSaved((s) => !s)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-surface-line transition hover:bg-surface-soft"
        >
          <Heart
            size={20}
            className={saved ? 'text-red-500' : 'text-ink-700'}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>

        <Link href={bookHref} className="btn-primary min-w-[10.5rem] shrink-0 rounded-lg px-8 py-4 text-[14px] uppercase tracking-wide lg:min-w-[13rem]">
          Book now
        </Link>
        </div>
      </div>
    </div>
  );
}
