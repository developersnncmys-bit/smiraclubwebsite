'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar, ChevronDown, ChevronRight, MapPin, Search, SlidersHorizontal, User,
} from 'lucide-react';
import Icon from '@/components/ui/Icon';
import PackageCard from '@/components/packages/PackageCard';
import CustomisedTourForm from '@/components/packages/CustomisedTourForm';
import {
  intlTabs, intlTrust, packages, popularDestinations,
} from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { defaultStay } from '@/lib/format';

const FIELD =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

/** The three reassurances, under the tabs and again under Search. */
function Trust() {
  return (
    <ul className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      {intlTrust.map((t) => (
        <li key={t.key} className="flex items-center gap-2 text-[13px] font-semibold text-ink-700">
          <Icon name={t.icon} size={17} className="shrink-0 text-action-500" strokeWidth={2} />
          {t.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * International Trips.
 *
 * Two ways in, and they are genuinely different questions: a customised tour
 * asks what you want and the desk builds it, a fixed departure asks where and
 * when and shows what already exists. So the tabs swap the whole screen
 * rather than filtering one list.
 */
export default function IntlTripsScreen({ art = {} }) {
  const router = useRouter();
  const [tab, setTab] = useState(intlTabs[0]);

  const stay = defaultStay();
  const [from, setFrom] = useState('New Delhi, India');
  const [to, setTo] = useState('Bali, Indonesia');
  const [date, setDate] = useState(stay.from.toISOString().slice(0, 10));

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ from, to, date, adults: '2', rooms: '1' });
    router.push(`/packages/international/results?${params.toString()}`);
  };

  const popular = packages.filter((p) => p.promo || p.rating >= 4.1).slice(0, 3);

  return (
    <div className="pb-10">
      <div className="shell py-4">
        {/* -- Which kind of trip ---------------------------------- */}
        <div className="grid grid-cols-2 gap-3 lg:mx-auto lg:max-w-lg">
          {intlTabs.map((t) => {
            const on = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                aria-pressed={on}
                className={`rounded-xl border px-4 py-3.5 text-[14px] font-semibold transition ${
                  on
                    ? 'border-action-500 bg-brand-50 text-action-500'
                    : 'border-surface-line bg-white text-ink-700 hover:bg-surface-soft'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <Trust />
        </div>
      </div>

      {tab === intlTabs[0] ? (
        <CustomisedTourForm />
      ) : (
        /* -- Fixed departure: what already exists --------------- */
        <>
          <form onSubmit={search} className="shell space-y-3">
            <label className="flex items-center gap-3 rounded-xl border border-surface-line bg-white p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50">
                <MapPin size={18} className="text-action-500" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Starting from
                </span>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full border-0 p-0 text-[15px] font-semibold text-ink-900 outline-none"
                />
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-surface-line bg-white p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50">
                <MapPin size={18} className="text-action-500" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Travelling to
                </span>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full border-0 p-0 text-[15px] font-semibold text-ink-900 outline-none"
                />
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3.5">
                <Calendar size={18} className="shrink-0 text-action-500" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                    Starting date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-w-0 border-0 bg-transparent p-0 text-[13px] font-semibold text-ink-900 outline-none"
                  />
                </span>
              </label>

              <div className="flex items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3.5">
                <User size={18} className="shrink-0 text-action-500" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-ink-400">
                    Rooms &amp; Guests
                  </span>
                  <span className="block text-[13px] font-semibold text-ink-900">
                    2 Adults/ 1 Room
                  </span>
                </span>
              </div>
            </div>

            <div>
              <p className="text-[14px] font-semibold text-ink-900">
                Choose Filter <span className="font-normal text-ink-500">(Optional)</span>
              </p>
              <div className="rail mt-2 gap-3">
                {['All Filters', 'Duration', 'Budget (Per Person)', 'Flight'].map((f) => (
                  <span
                    key={f}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[13px] font-medium text-ink-700"
                  >
                    {f}
                    {f === 'All Filters' ? (
                      <SlidersHorizontal size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full gap-2.5 py-4 text-base lg:w-auto lg:px-10 lg:py-3.5">
              <Search size={19} />
              Search
            </button>

            <div className="pt-2">
              <Trust />
            </div>
          </form>

          {/* -- Where people go ------------------------------- */}
          <section className="mt-8 bg-white py-6">
            <div className="shell">
              <h2 className="text-xl font-bold text-ink-900">Popular Destinations</h2>

              <div className="rail mt-4 gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
                {popularDestinations.map((d) => (
                  <Link
                    key={d.key}
                    href={`/packages/international/results?to=${encodeURIComponent(d.label)}`}
                    className="w-[8.5rem] shrink-0 text-center lg:w-auto"
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-2xl">
                      <Image
                        src={toSrc(art[d.key] || d.image)}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 40vw, 20vw"
                        className="object-cover"
                      />
                    </span>
                    <span className="mt-2 block text-[14px] font-semibold text-ink-900">
                      {d.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* -- What already exists --------------------------- */}
          <section className="shell pt-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-ink-900">Popular Packages</h2>
              <Link
                href="/packages/international/results"
                className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-ink-900"
              >
                View All
                <span className="grid h-6 w-6 place-items-center rounded-full bg-action-500 text-white">
                  <ChevronRight size={15} />
                </span>
              </Link>
            </div>

            <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0 2xl:grid-cols-3">
              {popular.map((p) => (
                <PackageCard key={p.id} item={{ ...p, image: art[p.id] || p.image }} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
