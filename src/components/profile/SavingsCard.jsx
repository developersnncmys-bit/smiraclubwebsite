'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Info } from 'lucide-react';
import { inr } from '@/lib/format';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';

/**
 * What the membership has actually saved, which is the whole argument.
 *
 * It read twelve thousand nine hundred and ninety-nine across six
 * bookings — written into the site, so every member saw the same figure
 * whether they had booked six times or never. Every booking records
 * what came off it; this is the sum of that.
 */
export default function SavingsCard() {
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) return undefined;
    let live = true;
    api
      .memberSavings(token)
      .then((res) => live && setSaved(res.data || null))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const total = Number(saved?.total || 0);
  const across = Number(saved?.across || 0);

  return (
    <section className="flex h-full flex-col rounded-2xl bg-gradient-to-br from-[#eaf1fe] via-[#dde9fc] to-[#c6dbfa] p-5 shadow-card sm:p-6">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-ink-900">
        Your Smira Club Savings
        <span
          title="The difference between what members pay and the public rate, added up across your bookings."
          className="grid h-[18px] w-[18px] place-items-center rounded-full text-ink-900"
        >
          <Info size={16} />
        </span>
      </h2>

      <p className="mt-2 text-2xl font-extrabold text-action-500">{inr(total)}</p>

      <p className="mt-1 text-[14px] leading-relaxed text-ink-700">
        {across > 0
          ? `Saved on your bookings across ${across} ${across === 1 ? 'booking' : 'bookings'}`
          : 'Book as a member and what you save will show here'}
      </p>

      {/* Nothing saved yet means nothing to break down. */}
      {across > 0 && (
        <Link
          href="/profile/savings"
          className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-bold text-action-500 transition hover:text-action-600"
        >
          View Savings Details
          <ChevronRight size={17} />
        </Link>
      )}
    </section>
  );
}
