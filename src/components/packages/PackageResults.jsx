'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Pencil, SlidersHorizontal } from 'lucide-react';
import PackageCard from '@/components/packages/PackageCard';
import { packageFilters } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/**
 * Package results.
 *
 * The filter chips carry their own count, so the design's "4 Packages" under
 * each one is read off the list rather than written down — a chip that says
 * four and shows three is the kind of thing people notice.
 */
export default function PackageResults({ hero, from, to, when, guests, items }) {
  const [kind, setKind] = useState('all');

  const counts = useMemo(
    () =>
      Object.fromEntries(
        packageFilters.map((f) => [
          f.key,
          f.key === 'all' ? items.length : items.filter((p) => p.kinds?.includes(f.key)).length,
        ]),
      ),
    [items],
  );

  const shown = kind === 'all' ? items : items.filter((p) => p.kinds?.includes(kind));

  return (
    <div className="pb-10">
      {/* -- What was asked for ------------------------------------ */}
      <section className="relative h-[230px] w-full overflow-hidden sm:h-[280px] lg:h-[340px]">
        <Image
          src={toSrc(hero)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="shell pb-5">
            <p className="text-[15px] text-white/85">{from} to</p>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">{to}</h1>
            <p className="mt-1 flex items-center gap-2 text-[15px] text-white/90">
              {when}, {guests}
              <Link
                href="/packages/international"
                aria-label="Change search"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-action-500 text-white"
              >
                <Pencil size={13} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* -- Narrow it -------------------------------------------- */}
      <div className="border-b border-surface-line bg-white">
        <div className="shell">
          <div className="rail gap-3 py-3">
            {['All Filters', 'Duration', 'Budget (Per Person)', 'Flight'].map((f) => (
              <span
                key={f}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line px-3.5 py-2.5 text-[14px] font-medium text-ink-700"
              >
                {f}
                {f === 'All Filters' ? <SlidersHorizontal size={15} /> : <ChevronDown size={15} />}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="shell py-4">
        <div className="rail gap-3">
          {packageFilters.map((f) => {
            const on = f.key === kind;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setKind(f.key)}
                aria-pressed={on}
                className={`w-[9rem] shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                  on
                    ? 'border-action-500 bg-brand-50'
                    : 'border-surface-line bg-white hover:bg-surface-soft'
                }`}
              >
                <span
                  className={`block text-[16px] font-bold ${
                    on ? 'text-action-500' : 'text-ink-900'
                  }`}
                >
                  {f.label}
                </span>
                <span className="block text-[14px] text-ink-500">
                  {counts[f.key]} Package{counts[f.key] === 1 ? '' : 's'}
                </span>
              </button>
            );
          })}
        </div>

        <h2 className="pt-6 text-[19px] font-bold text-ink-900 lg:text-2xl">
          Showing Top Results
        </h2>

        {shown.length === 0 ? (
          <p className="card mt-4 p-10 text-center text-[15px] text-ink-500">
            No packages of that kind on this route yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0 2xl:grid-cols-3">
            {shown.map((p) => (
              <PackageCard key={p.id} item={p} heart />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
