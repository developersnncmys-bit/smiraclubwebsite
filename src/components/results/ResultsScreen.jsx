'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpDown, Search } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import ResultCard from '@/components/results/ResultCard';
import { resultFilters, resultSortOptions } from '@/lib/content';

/**
 * Search results across every category.
 *
 * A search from the home screen is not tied to one kind, so the chips are a
 * filter over one list rather than four separate screens. Picking a chip
 * narrows it; picking it again clears it.
 */
export default function ResultsScreen({ where, when, guests, results }) {
  const router = useRouter();
  const [sort, setSort] = useState('recommended');
  const [kind, setKind] = useState(null);

  const shown = useMemo(() => {
    let list = results;

    if (kind === 'free-stay') list = list.filter((r) => r.freeStay);
    else if (kind) list = list.filter((r) => r.kind === kind);

    list = [...list];
    if (sort === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [results, kind, sort]);

  return (
    <>
      <div className="border-b border-surface-line bg-white">
        <div className="shell py-3 lg:py-5">
          {/* -- What was asked for --------------------------------- */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-brand-700 px-3 py-2.5 lg:max-w-2xl lg:px-4 lg:py-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Back to home"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[17px] font-bold leading-tight text-brand-700">{where}</p>
              <p className="truncate text-[14px] text-ink-600">
                {when}, {guests}
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Change search"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-action-500 transition hover:bg-surface-soft"
            >
              <Search size={20} />
            </button>
          </div>

          {/* -- Sort, then the four kinds -------------------------- */}
          <div className="rail mt-3 lg:mt-4">
            <label className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[14px] font-semibold text-ink-900">
              <span className="sr-only">Sort by</span>
              Sort By
              <ArrowUpDown size={15} className="shrink-0 text-ink-600" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort results"
                className="cursor-pointer border-0 bg-transparent text-[14px] font-semibold text-ink-900 outline-none"
              >
                {resultSortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            {resultFilters.map((f) => {
              const on = kind === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setKind(on ? null : f.key)}
                  aria-pressed={on}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[14px] font-semibold transition ${
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
        <h1 className="pt-5 text-[19px] font-bold text-ink-900 lg:pt-8 lg:text-2xl">
          {shown.length} Result{shown.length === 1 ? '' : 's'} for{' '}
          <span className="text-action-500">{where}</span>
        </h1>
        <p className="mt-1 text-[15px] text-ink-600">
          {kind ? `Filtered by ${resultFilters.find((f) => f.key === kind).label}` : 'Showing Top Results'}
        </p>

        {shown.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-white p-6 text-center text-[15px] text-ink-500">
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
