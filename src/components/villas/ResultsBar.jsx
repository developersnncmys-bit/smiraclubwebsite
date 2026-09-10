'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpDown, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { villaSortOptions } from '@/lib/content';

/**
 * The bar over the results: what was searched for, and the three controls.
 *
 * Sort is real. Filters and flexible dates are drawn as the design has them
 * but have nothing behind them yet — there is no inventory to filter — so
 * they say so rather than looking live and doing nothing.
 */
export default function ResultsBar({ where, when, guests, sort, onSort }) {
  const router = useRouter();

  return (
    <div className="border-b border-surface-line bg-white">
      <div className="shell py-3 lg:py-5">
        {/* -- What was asked for --------------------------------------- */}
        <div className="flex items-center gap-3 rounded-xl border border-surface-line px-3 py-2.5 lg:max-w-2xl lg:px-4 lg:py-3">
          <button
            type="button"
            onClick={() => router.push('/villas')}
            aria-label="Back to villas"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-bold leading-tight text-ink-900">{where}</p>
            <p className="truncate text-[14px] text-ink-500">
              {when}, {guests}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/villas')}
            aria-label="Change search"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-action-500 transition hover:bg-surface-soft"
          >
            <Search size={20} />
          </button>
        </div>

        {/* -- Sort, filters, flexible dates ---------------------------- */}
        <div className="rail mt-3 lg:mt-4">
          <label className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[14px] font-semibold text-ink-900">
            <ArrowUpDown size={16} className="shrink-0 text-ink-600" />
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="cursor-pointer border-0 bg-transparent pr-1 text-[14px] font-semibold text-ink-900 outline-none"
            >
              {villaSortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled
            title="Filters arrive with the live inventory"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[14px] font-semibold text-ink-400"
          >
            All Filters
            <SlidersHorizontal size={16} />
          </button>

          <button
            type="button"
            disabled
            title="Flexible dates arrive with the live inventory"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-surface-line bg-white px-3.5 py-2.5 text-[14px] font-semibold text-ink-400"
          >
            Flexible Check-in/out
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
