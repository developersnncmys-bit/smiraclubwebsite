'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { StayDates } from '@/components/hotels/StayChooser';
import { inr } from '@/lib/format';

/**
 * The bar pinned to the bottom of a villa's page: the stay, what it costs,
 * and the way on to Review Booking. It owns the bottom edge outright — the
 * tab bar is hidden on this route, so there is nothing underneath it.
 *
 * The stay sits above the price for the same reason it does on a hotel: the
 * button books those nights for those guests, so the bar had better say so.
 * Until the dates are chosen it says nothing of the sort, and Book Now asks
 * for them rather than carrying a guess through to Review Booking.
 */
export default function BookingBar({ name, layout, price, was, taxes, bookHref, stay }) {
  const [saved, setSaved] = useState(false);
  const [askDates, setAskDates] = useState(0);
  const needsDates = stay?.chosen === false;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:bottom-6">
      <div className="border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:mx-auto lg:max-w-3xl lg:overflow-hidden lg:rounded-2xl lg:border lg:shadow-lift">
        {stay && (
          <StayDates
            from={stay.from}
            to={stay.to}
            adults={stay.adults}
            rooms={stay.rooms}
            childAges={stay.childAges}
            chosen={stay.chosen}
            openSignal={askDates}
          />
        )}

        <div className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-6">
          {/*
            A phone has no room for this, but a desktop has plenty — and an
            empty half of the bar with the price marooned at the far edge is
            what it looks like otherwise. So the space names the villa.
          */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-[14px] font-bold text-ink-900">{name}</p>
            <p className="truncate text-[13px] text-ink-500">{layout}</p>
          </div>

          {/* Two tight lines, so the button sits beside the price rather than
              being crowded off the end of a third. */}
          <div className="min-w-0 flex-1 lg:flex-none lg:text-right">
            <p className="flex items-baseline gap-1.5 whitespace-nowrap lg:justify-end">
              <span className="text-xl font-extrabold text-ink-900">{inr(price)}</span>
              {was && (
                <span className="text-[13px] font-semibold text-red-500 line-through">{inr(was)}</span>
              )}
            </p>
            <p className="truncate text-[12px] leading-tight text-ink-500 sm:text-[13px]">
              Per night · +{taxes.toLocaleString('en-IN')} taxes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl border border-surface-line transition hover:bg-surface-soft sm:grid"
          >
            <Heart
              size={20}
              className={saved ? 'text-red-500' : 'text-ink-700'}
              fill={saved ? 'currentColor' : 'none'}
            />
          </button>

          {needsDates ? (
            <button
              type="button"
              onClick={() => setAskDates((n) => n + 1)}
              className="btn-primary shrink-0 whitespace-nowrap rounded-lg px-6 py-3.5 text-[14px] uppercase tracking-wide sm:px-8 sm:py-4 lg:min-w-[13rem]"
            >
              Book now
            </button>
          ) : (
            <Link
              href={bookHref}
              className="btn-primary shrink-0 whitespace-nowrap rounded-lg px-6 py-3.5 text-[14px] uppercase tracking-wide sm:px-8 sm:py-4 lg:min-w-[13rem]"
            >
              Book now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
