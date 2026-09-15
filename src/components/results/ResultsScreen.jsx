'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpDown, ChevronDown, Search, SlidersHorizontal, TrendingUp } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import ResultCard from '@/components/results/ResultCard';
import { ratingFloors, resultFilters, resultSortOptions } from '@/lib/content';

/**
 * Search results across every category.
 *
 * A search from the home screen is not tied to one kind, so the chips are a
 * filter over one list rather than four separate screens. Picking a chip
 * narrows it; picking it again clears it.
 *
 * A search from Hotels & Resorts is drawn with different chips — All filters,
 * Star Rating and Popularity — because the kind is already chosen. That is
 * `variant="hotel"`, and its back arrow returns to the hotel screen.
 */
export default function ResultsScreen({ where, when, guests, results, variant = 'all', backHref = '/' }) {
  const router = useRouter();
  const [sort, setSort] = useState('recommended');
  const [kind, setKind] = useState(null);
  const [floor, setFloor] = useState('any');
  const [popular, setPopular] = useState(false);

  const hotel = variant === 'hotel';
  const minRating = ratingFloors.find((f) => f.key === floor).min;

  const shown = useMemo(() => {
    let list = results;

    if (kind === 'free-stay') list = list.filter((r) => r.freeStay);
    else if (kind) list = list.filter((r) => r.kind === kind);
    if (minRating) list = list.filter((r) => r.rating >= minRating);

    list = [...list];
    if (popular) return list.sort((a, b) => b.reviews - a.reviews);
    if (sort === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [results, kind, sort, minRating, popular]);

  return (
    <>
      <div className="border-b border-surface-line bg-white">
        <div className="shell py-3 lg:py-5">
          {/*
            This bar is the screen's own title: it says what was searched for
            and is the way back into the search, so there is no separate
            heading above it repeating the word.
          */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-brand-700 px-3 py-2.5 lg:max-w-2xl lg:px-4 lg:py-3">
            <button
              type="button"
              onClick={() => router.push(backHref)}
              aria-label="Back"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold leading-tight text-brand-700">{where}</p>
              <p className="truncate text-[13px] text-ink-600">
                {when}, {guests}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(backHref)}
              aria-label="Change search"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-action-500 transition hover:bg-surface-soft"
            >
              <Search size={20} />
            </button>
          </div>

          {/* -- Sort, then the four kinds -------------------------- */}
          <div className="rail mt-3 lg:mt-4">
            {/* Drawn as just "Sort By"; the select sits invisibly over the chip. */}
            <label className="relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink-900">
              Sort By
              <ArrowUpDown size={15} className="shrink-0 text-ink-700" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort results"
                className="absolute inset-0 cursor-pointer opacity-0"
              >
                {resultSortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            {hotel && (
              <>
                <button
                  type="button"
                  disabled
                  title="Filters arrive with the live inventory"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[13px] font-semibold text-ink-900 disabled:cursor-default"
                >
                  All filters
                  <SlidersHorizontal size={15} />
                </button>

                <label
                  className={`relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold transition ${
                    floor !== 'any'
                      ? 'border-action-500 bg-action-500 text-white'
                      : 'border-surface-line bg-white text-ink-900'
                  }`}
                >
                  {ratingFloors.find((f) => f.key === floor).label}
                  <ChevronDown size={15} />
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    aria-label="Star rating"
                    className="absolute inset-0 cursor-pointer opacity-0"
                  >
                    {ratingFloors.map((f) => (
                      <option key={f.key} value={f.key}>
                        {f.key === 'any' ? 'Any rating' : f.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => setPopular((p) => !p)}
                  aria-pressed={popular}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold transition ${
                    popular
                      ? 'border-action-500 bg-action-500 text-white'
                      : 'border-surface-line bg-white text-ink-900 hover:bg-surface-soft'
                  }`}
                >
                  Popularity
                  <TrendingUp size={15} />
                </button>
              </>
            )}

            {!hotel && resultFilters.map((f) => {
              const on = kind === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setKind(on ? null : f.key)}
                  aria-pressed={on}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold transition ${
                    on
                      ? 'border-action-500 bg-action-500 text-white'
                      : 'border-surface-line bg-white text-ink-900 hover:bg-surface-soft'
                  }`}
                >
                  <Icon name={f.icon} size={16} strokeWidth={1.9} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell pb-10 lg:pb-16">
        <h1 className="pt-5 text-[17px] font-bold text-ink-900 lg:pt-8 lg:text-2xl">
          {shown.length} Result{shown.length === 1 ? '' : 's'} for{' '}
          <span className="text-action-500">{where}</span>
        </h1>
        <p className="mt-1 text-[14px] text-ink-600">
          {kind ? `Filtered by ${resultFilters.find((f) => f.key === kind).label}` : 'Showing Top Results'}
        </p>

        {shown.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">
            Nothing in that category for this search yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {shown.map((item) => (
              <ResultCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
