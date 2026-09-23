'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe2, Sparkles, UsersRound } from 'lucide-react';
import PackageCard from '@/components/packages/PackageCard';
import { SearchBox } from '@/components/offers/OfferBits';

/** Which list a package falls in; international unless it says domestic. */
const isDomestic = (p) => /domestic/i.test(p.info?.kind || '');

const TABS = [
  { key: 'all', label: 'All Packages', test: () => true },
  { key: 'domestic', label: 'Domestic', test: isDomestic },
  { key: 'international', label: 'International', test: (p) => !isDomestic(p) },
  { key: 'honeymoon', label: 'Honeymoon', test: (p) => p.kinds?.includes('honeymoon') },
  { key: 'premium', label: 'Premium', test: (p) => p.kinds?.includes('premium') },
];

/** The other ways into a trip, above the list. */
const WAYS = [
  { href: '/group-departures', icon: UsersRound, title: 'Group Departures', note: 'Fixed dates, travel with a group' },
  { href: '/packages/international?tab=fixed', icon: Globe2, title: 'International Trips', note: 'Fixed-departure trips abroad' },
  { href: '/packages/international', icon: Sparkles, title: 'Customised Tour', note: 'Tell us the trip, we plan it' },
];

/**
 * Packages — every fixed package on the site, domestic and international.
 *
 * Tabs split the list; the search narrows it by name or place as you type.
 * Each card's View Details goes to the package, and Book Now on that page to
 * Review Booking, which sends the booking to the desk.
 */
export default function PackagesScreen({ packages }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const test = TABS.find((t) => t.key === tab).test;
    const term = q.trim().toLowerCase();
    return packages.filter((p) => test(p) && (!term || `${p.name} ${p.place}`.toLowerCase().includes(term)));
  }, [packages, tab, q]);

  return (
    <div className="pb-10 lg:pb-16">
      <div className="bg-white">
        <div className="shell space-y-5 py-5 lg:py-8">
          <h1 className="hidden text-2xl font-bold text-ink-900 lg:block">Packages</h1>

          {/*
            Three across on a phone, stacked icon over label, because full-width
            rows here pushed the packages themselves off the screen. From `sm`
            up they have the room to read as rows again.
          */}
          <ul className="grid grid-cols-3 gap-2 sm:gap-3">
            {WAYS.map((w) => (
              <li key={w.title}>
                <Link
                  href={w.href}
                  className="flex h-full flex-col items-center gap-2 rounded-2xl border border-surface-line bg-white p-3 text-center transition hover:border-action-500 hover:bg-brand-50 sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 sm:h-11 sm:w-11">
                    <w.icon size={19} className="text-action-500" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-bold leading-tight text-ink-900 sm:text-[15px]">
                      {w.title}
                    </span>
                    <span className="mt-0.5 hidden text-[12px] text-ink-500 sm:block">{w.note}</span>
                  </span>
                  <ArrowRight size={16} className="hidden shrink-0 text-action-500 sm:block" />
                </Link>
              </li>
            ))}
          </ul>

          <SearchBox value={q} onChange={setQ} placeholder="Search packages or destination" label="Search packages" />

          <div role="tablist" aria-label="Kind of package" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => {
              const on = t.key === tab;
              const count = packages.filter(t.test).length;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(t.key)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[14px] font-semibold transition ${
                    on ? 'border-action-500 bg-action-500 text-white' : 'border-surface-line bg-white text-ink-700 hover:border-action-500'
                  }`}
                >
                  {t.label} <span className={on ? 'text-white/80' : 'text-ink-400'}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell pt-6 lg:pt-8">
        <h2 className="text-[17px] font-semibold text-ink-900 lg:text-xl">
          {shown.length} Package{shown.length === 1 ? '' : 's'}
        </h2>

        {shown.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">
            No packages match that yet — try another tab, or ask us for a customised tour.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {shown.map((p) => (
              <PackageCard key={p.id} item={p} heart />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
