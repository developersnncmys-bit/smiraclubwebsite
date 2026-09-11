'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpDown, Calendar, Check, CircleCheck, Clock, MapPin, Search, Send, XCircle,
} from 'lucide-react';
import NeedHelp from '@/components/ui/NeedHelp';
import { bookingStages, bookingTabs, myBookings } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { nightsBetween } from '@/lib/format';

/** How each status announces itself at the top of a card. */
const STATUS = {
  confirmed: { label: 'Confirmed', tone: 'text-green-600', icon: CircleCheck },
  pending: { label: 'Payment Pending', tone: 'text-red-600', icon: Clock },
  cancelled: { label: 'Cancelled', tone: 'text-ink-500', icon: XCircle },
};

const when = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(' am', ' AM').replace(' pm', ' PM');

/**
 * My Bookings.
 *
 * `stage` and `status` together describe a booking once — the chip, how far
 * the stepper is filled and what the footer offers all read from them, so a
 * cancelled booking cannot end up showing a Pay Now button.
 */
export default function MyBookings({ art = {} }) {
  const [tab, setTab] = useState('All Bookings');
  const [query, setQuery] = useState('');
  const [newestFirst, setNewestFirst] = useState(true);

  const shown = useMemo(() => {
    let list = myBookings;

    if (tab !== 'All Bookings') {
      const want = tab.toLowerCase().replace('ed', '');
      list = list.filter((b) => b.status.startsWith(want.slice(0, 6)));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.place.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) =>
      newestFirst
        ? new Date(b.from) - new Date(a.from)
        : new Date(a.from) - new Date(b.from),
    );
  }, [tab, query, newestFirst]);

  return (
    <div className="pb-8">
      {/* -- Find one --------------------------------------------- */}
      <div className="shell pt-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-card">
          <Search size={20} className="shrink-0 text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your bookings"
            aria-label="Search your bookings"
            className="w-full min-w-0 border-0 p-0 text-[16px] text-ink-900 outline-none placeholder:text-ink-500"
          />
          <button
            type="button"
            onClick={() => setNewestFirst((v) => !v)}
            aria-label={newestFirst ? 'Show oldest first' : 'Show newest first'}
            title={newestFirst ? 'Newest first' : 'Oldest first'}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-700 transition hover:bg-surface-soft"
          >
            <ArrowUpDown size={19} />
          </button>
        </div>
      </div>

      {/* -- Narrow them ------------------------------------------ */}
      <div className="shell mt-4">
        <div className="rail gap-2">
          {bookingTabs.map((t) => {
            const on = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={on}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-[15px] font-semibold transition ${
                  on
                    ? 'bg-brand-50 text-action-500 ring-1 ring-action-500'
                    : 'text-ink-600 hover:bg-surface-soft'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* -- What is booked --------------------------------------- */}
      <div className="shell mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {shown.length === 0 ? (
          <p className="card p-10 text-center text-[15px] text-ink-500">
            {query ? 'Nothing matches that search.' : `No ${tab.toLowerCase()} yet.`}
          </p>
        ) : (
          shown.map((booking) => {
            const status = STATUS[booking.status];
            const Glyph = status.icon;
            const nights = nightsBetween(booking.from, booking.to);
            const stages = bookingStages.map((s, i) =>
              i === 1 && booking.status === 'pending' ? 'Payment Pending' : s,
            );

            return (
              <article key={booking.id} className="card overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                  <h2 className="text-[17px] font-semibold text-ink-900">{booking.kind}</h2>
                  <p className={`flex shrink-0 items-center gap-1.5 text-[16px] font-bold ${status.tone}`}>
                    <Glyph size={18} />
                    {status.label}
                  </p>
                </div>

                {/* Which property */}
                <Link
                  href={booking.href}
                  className="mx-4 flex gap-3.5 rounded-xl bg-surface-soft p-3 transition hover:bg-[#eaeef2] sm:mx-5"
                >
                  <span className="relative h-[86px] w-[110px] shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={toSrc(art[booking.id] || booking.image)}
                      alt=""
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] font-bold leading-snug text-ink-900">
                      {booking.name}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-700">
                      <MapPin size={15} className="shrink-0 text-ink-500" />
                      {booking.place}
                      <Send size={14} className="shrink-0 text-action-500" fill="currentColor" strokeWidth={0} />
                    </span>
                    <span className="mt-1 block text-[15px] text-ink-500">
                      Booking ID: {booking.id}
                    </span>
                  </span>
                </Link>

                {/* When */}
                <ul className="space-y-2.5 p-4 sm:p-5">
                  <li className="flex items-center gap-2.5 text-[16px] text-ink-900">
                    <Clock size={18} className="shrink-0 text-ink-600" />
                    {nights} Night{nights === 1 ? '' : 's'} / {nights + 1} days
                  </li>
                  <li className="flex items-center gap-2.5 text-[16px] text-ink-900">
                    <Calendar size={18} className="shrink-0 text-ink-600" />
                    Check-In - {when(booking.from)}
                  </li>
                  <li className="flex items-center gap-2.5 text-[16px] text-ink-900">
                    <Calendar size={18} className="shrink-0 text-ink-600" />
                    Check-Out - {when(booking.to)}
                  </li>
                </ul>

                {/* How far along */}
                <ol className="flex items-start px-2 pb-5">
                  {stages.map((label, i) => {
                    const reached = i < booking.stage;
                    return (
                      <li key={label} className="flex flex-1 flex-col items-center">
                        <div className="flex w-full items-center">
                          <span className={`h-[3px] flex-1 ${i === 0 ? 'bg-transparent' : reached ? 'bg-action-500' : 'bg-surface-line'}`} />
                          <span
                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-white ${
                              reached ? 'bg-action-500' : 'bg-[#c7ccd3]'
                            }`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </span>
                          <span className={`h-[3px] flex-1 ${i === stages.length - 1 ? 'bg-transparent' : i + 1 < booking.stage ? 'bg-action-500' : 'bg-surface-line'}`} />
                        </div>
                        <span className="mt-2 px-0.5 text-center text-[12px] font-medium leading-tight text-ink-700">
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                {/* What is left to do about it */}
                {booking.status === 'pending' ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-line p-4 sm:p-5">
                    <p className="text-[16px] leading-snug text-ink-900">
                      Complete your payment
                      <br className="hidden sm:block" /> to confirm your booking
                    </p>
                    <Link href={booking.href} className="btn-primary shrink-0 rounded-lg px-7 py-3.5 uppercase tracking-wide">
                      Pay now
                    </Link>
                  </div>
                ) : booking.status === 'confirmed' && booking.stage >= bookingStages.length ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-line p-4 sm:p-5">
                    <p className="text-[17px] font-bold text-ink-900">Booking Is Completed</p>
                    <Link href="/profile/reviews" className="btn-primary shrink-0 rounded-lg px-7 py-3.5 uppercase tracking-wide">
                      Write review
                    </Link>
                  </div>
                ) : booking.status === 'cancelled' ? (
                  <p className="border-t border-surface-line p-4 text-[15px] text-ink-500 sm:p-5">
                    This booking was cancelled. Any refund follows the property&rsquo;s policy.
                  </p>
                ) : null}
              </article>
            );
          })
        )}

        <NeedHelp className="mt-6" />
      </div>
    </div>
  );
}
