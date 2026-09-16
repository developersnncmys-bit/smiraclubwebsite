'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Plus } from 'lucide-react';
import { shortDate } from '@/lib/format';

/**
 * Plan My Trip, above Recent Searches.
 *
 * When a planned trip starts within the next 30 days it is shown here with a
 * countdown, so the member sees it the moment they open the app. Otherwise
 * the card invites them to plan one.
 *
 * "Today" is read after mount: the home screen is prerendered, and a date
 * baked in at build time would be wrong by the next morning.
 */
export default function PlanTripReminder({ trips }) {
  const [soon, setSoon] = useState(undefined);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next = trips
      .map((t) => ({ ...t, days: Math.round((new Date(`${t.start}T00:00:00`) - today) / 86400000) }))
      .filter((t) => t.days >= 0 && t.days <= 30)
      .sort((a, b) => a.days - b.days)[0];
    setSoon(next || null);
  }, [trips]);

  // Nothing until the date is known, so the card never flashes the wrong state.
  if (soon === undefined) return null;

  return (
    <div className="shell pt-6 lg:pt-8">
      <h2 className="section-title">Plan My Trip</h2>

      {soon ? (
        <Link
          href={`/profile/travel-year/${soon.id}`}
          className="mt-4 flex items-center gap-3.5 rounded-2xl border border-surface-line bg-white p-3 transition hover:shadow-card lg:max-w-2xl"
        >
          <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
            <Image src={soon.image} alt="" fill sizes="96px" className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold text-action-500">
              {soon.days === 0 ? 'Starts today' : `Starts in ${soon.days} day${soon.days === 1 ? '' : 's'}`}
            </span>
            <span className="block truncate text-[16px] font-bold text-ink-900">{soon.title}</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-ink-600">
              <CalendarDays size={14} className="shrink-0" />
              {shortDate(soon.start)} - {shortDate(soon.end)} · {soon.guests} Guests
            </span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-ink-700" />
        </Link>
      ) : (
        <Link
          href="/profile/trips/new"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-action-500 bg-white p-4 text-action-500 transition hover:bg-brand-50 lg:max-w-2xl"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50">
            <Plus size={20} />
          </span>
          <span>
            <span className="block text-[15px] font-bold">Plan a trip</span>
            <span className="block text-[12px] text-ink-600">We will remind you 30 days before you go</span>
          </span>
        </Link>
      )}
    </div>
  );
}
