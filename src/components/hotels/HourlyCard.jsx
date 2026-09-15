'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Sparkles, Star } from 'lucide-react';
import WishlistButton from '@/components/villas/WishlistButton';
import { hourlyDurations } from '@/lib/content';
import { inr } from '@/lib/format';

/**
 * One hotel on the hourly results.
 *
 * The photos swipe, with dots for where you are. The whole card opens the
 * hotel; each price tile opens it with that length already chosen, so a tap
 * on "For 6 Hours" is not thrown away on the next screen.
 */
export default function HourlyCard({ hotel, chosen, carry }) {
  const [shot, setShot] = useState(0);
  const href = `/hotels/hourly/${hotel.id}?${carry(chosen)}`;

  const onScroll = (e) => {
    const el = e.currentTarget;
    setShot(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <article className="card relative flex flex-col overflow-hidden">
      {/* -- Photos ------------------------------------------------------ */}
      <div className="relative aspect-[16/10] w-full shrink-0">
        <div
          onScroll={onScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {hotel.images.map((src, i) => (
            <Link key={src + i} href={href} className="relative h-full w-full shrink-0 snap-start" tabIndex={i ? -1 : 0}>
              <Image
                src={src}
                alt={i === 0 ? hotel.name : ''}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </Link>
          ))}
        </div>

        <WishlistButton label={hotel.name} />

        <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-t-lg bg-white px-3 pb-1 pt-1.5">
          {hotel.images.map((src, i) => (
            <span
              key={src + i}
              className={`h-1 rounded-full transition-all ${i === shot ? 'w-5 bg-action-500' : 'w-1 bg-ink-400'}`}
            />
          ))}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[13px] text-ink-700">
          <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
          <span className="font-bold text-ink-900">{hotel.rating}</span>
          <span>({hotel.reviews} reviews)</span>
        </p>

        <h2 className="mt-2 text-xl font-bold text-ink-900">
          <Link href={href} className="hover:underline">
            {hotel.name}
          </Link>
        </h2>
        <p className="mt-0.5 text-[14px] text-ink-600">
          {hotel.place} | {hotel.reach}
        </p>

        <p className="mt-3 border-l-[3px] border-action-500 pl-3 text-[14px] font-semibold text-ink-900">
          {hotel.tag}
        </p>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-[14px] text-ink-700">From</span>
              <span className="text-xl font-extrabold text-ink-900">{inr(hotel.night)}</span>
              <span className="text-[13px] font-semibold text-red-500 line-through">{inr(hotel.nightWas)}</span>
            </p>
            <p className="text-[13px] text-ink-600">1 Night Price</p>
          </div>
          {hotel.offer && (
            <span className="shrink-0 rounded-full border-[1.5px] border-action-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.04em] text-action-500">
              {hotel.offer}
            </span>
          )}
        </div>

        <p className="mt-3 flex items-center gap-2 text-[13px] font-medium text-green-600">
          <Check size={16} strokeWidth={2.6} className="shrink-0" />
          {hotel.cancellation}
        </p>

        <p className="mt-4 flex gap-2.5 rounded-xl bg-[#e8f2fe] p-3.5 text-[13px] font-medium leading-snug text-brand-700">
          <Sparkles size={18} className="mt-0.5 shrink-0 text-action-500" />
          {hotel.highlight}
        </p>

        {/* -- A price for each length ------------------------------------ */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {hourlyDurations.map((h) => {
            const slot = hotel.slots[h];
            if (!slot) {
              return (
                <p key={h} className="rounded-xl px-1 py-2.5 text-center shadow-card">
                  <span className="block text-[13px] font-bold text-ink-400">Not Available</span>
                  <span className="block text-[12px] text-ink-400">For {h} Hours</span>
                </p>
              );
            }
            const on = chosen === h;
            return (
              <Link
                key={h}
                href={`/hotels/hourly/${hotel.id}?${carry(h)}`}
                className={`rounded-xl border px-1 py-2.5 text-center shadow-card transition ${
                  on ? 'border-brand-700 bg-brand-50' : 'border-transparent bg-white hover:border-brand-300'
                }`}
              >
                <span className="block text-[15px] font-bold text-ink-900">{inr(slot.price)}</span>
                <span className="block text-[12px] text-ink-700">For {h} Hours</span>
              </Link>
            );
          })}
        </div>

        {/*
          The frame says "inclusive", but its own Review Booking adds ₹175
          taxes to the ₹1,299 shown here. Saying inclusive would promise a
          price the checkout then raises, so the line says what is true.
        */}
        <p className="mt-3 text-center text-[13px] font-medium text-ink-900">
          Prices are exclusive of taxes and fees
        </p>
      </div>
    </article>
  );
}
