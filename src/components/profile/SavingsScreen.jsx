'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, TicketPercent, Crown } from 'lucide-react';
import { inr, fullDate } from '@/lib/format';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

/**
 * Where the savings came from, booking by booking.
 *
 * "View Savings Details" pointed at this address and nothing was here,
 * so the one link that backs up the headline figure went nowhere. Each
 * row is a booking with what the membership took off it and what an
 * offer took off it, which together are the number on the card.
 */
export default function SavingsScreen() {
  const [saved, setSaved] = useState(null);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setSignedIn(false);
      return undefined;
    }
    let live = true;
    api
      .memberSavings(token)
      .then((res) => live && setSaved(res.data || { total: 0, across: 0, bookings: [] }))
      .catch(() => live && setSaved({ total: 0, across: 0, bookings: [] }));
    return () => {
      live = false;
    };
  }, []);

  if (!signedIn) {
    return (
      <div className="shell py-10">
        <p className="card p-6 text-center text-[15px] text-ink-600">
          Sign in to see what your membership has saved you.
        </p>
      </div>
    );
  }

  if (saved === null) {
    return (
      <div className="shell flex items-center justify-center gap-2 py-16 text-[15px] text-ink-500">
        <Loader2 size={17} className="animate-spin" /> Loading…
      </div>
    );
  }

  const bookings = saved.bookings || [];

  if (!bookings.length) {
    return (
      <div className="shell py-10">
        <p className="card p-6 text-center text-[15px] text-ink-600">
          Nothing saved yet. Book as a member and the difference shows up here.
        </p>
        <p className="mt-4 text-center">
          <Link href="/membership" className="btn-primary rounded-xl px-6 py-3 text-[14px]">
            See the plans
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="shell py-4 pb-10">
      {/* -- The headline, and the two things it is made of ------------- */}
      <section className="rounded-2xl bg-gradient-to-br from-[#eaf1fe] via-[#dde9fc] to-[#c6dbfa] p-5 sm:p-6">
        <p className="text-[15px] font-bold text-ink-900">Saved so far</p>
        <p className="mt-1 text-3xl font-extrabold text-action-500">{inr(saved.total)}</p>
        <p className="mt-1 text-[14px] text-ink-700">
          across {saved.across} {saved.across === 1 ? 'booking' : 'bookings'}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <p className="flex items-center gap-2.5 rounded-xl bg-white/70 px-3.5 py-3 text-[14px] text-ink-700">
            <Crown size={17} className="shrink-0 text-action-500" />
            <span className="font-bold text-ink-900">{inr(saved.onMembership)}</span> from your membership
          </p>
          <p className="flex items-center gap-2.5 rounded-xl bg-white/70 px-3.5 py-3 text-[14px] text-ink-700">
            <TicketPercent size={17} className="shrink-0 text-action-500" />
            <span className="font-bold text-ink-900">{inr(saved.onOffers)}</span> from offers
          </p>
        </div>
      </section>

      {/* -- Every booking that saved something ------------------------- */}
      <ul className="mt-5 space-y-3">
        {bookings.map((b) => (
          <li key={b.reference} className="card p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[16px] font-bold leading-snug text-ink-900">{b.name}</p>
                <p className="mt-0.5 text-[13px] text-ink-500">
                  {[b.destination, b.kind, b.on ? fullDate(b.on) : ''].filter(Boolean).join(' · ')}
                </p>
                <p className="num mt-0.5 text-[12px] text-ink-400">{b.reference}</p>
              </div>
              <p className="shrink-0 text-right">
                <span className="block text-[17px] font-extrabold text-green-700">
                  −{inr(b.saved)}
                </span>
                <span className="block text-[12px] text-ink-500">you saved</span>
              </p>
            </div>

            <dl className="mt-3 grid gap-x-6 gap-y-1 border-t border-surface-line pt-3 text-[13px] sm:grid-cols-2">
              {b.listed > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-600">Before the discount</dt>
                  <dd className="text-ink-700 line-through">{inr(b.listed)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-ink-600">You paid</dt>
                <dd className="font-semibold text-ink-900">{inr(b.paid)}</dd>
              </div>
              {b.membership > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-600">Member discount</dt>
                  <dd className="font-semibold text-green-700">−{inr(b.membership)}</dd>
                </div>
              )}
              {b.offer > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-600">Offer</dt>
                  <dd className="font-semibold text-green-700">−{inr(b.offer)}</dd>
                </div>
              )}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
