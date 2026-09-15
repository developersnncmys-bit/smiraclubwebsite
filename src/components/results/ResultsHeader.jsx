'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpDown, ChevronDown, Search, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { ratingFloors } from '@/lib/content';

export const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-low', label: 'Price: low to high' },
  { key: 'price-high', label: 'Price: high to low' },
  { key: 'rating', label: 'Rating' },
];

const chip =
  'inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold transition';

/**
 * The bar over a hotel list: what was searched for, then Sort By, All
 * filters, Star Rating and Popularity.
 *
 * The hourly and the free stay results draw it identically, so it is one
 * component; the list below it is the part that differs. `sorts` lets a list
 * that has no prices leave the price sorts out.
 */
export default function ResultsHeader({
  where,
  summary,
  backHref,
  sort,
  onSort,
  floor,
  onFloor,
  popular,
  onPopular,
  sorts = SORTS,
}) {
  const router = useRouter();

  return (
    <div className="border-b border-surface-line bg-white">
      <div className="shell py-3 lg:py-5">
        <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-brand-700 px-3 py-2.5 lg:max-w-2xl lg:px-4 lg:py-3">
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
            <p className="truncate text-[13px] text-ink-600">{summary}</p>
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

        <div className="rail mt-3 lg:mt-4">
          <label className={`relative cursor-pointer border-surface-line bg-white text-ink-900 ${chip}`}>
            Sort By
            <ArrowUpDown size={15} className="text-ink-700" />
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              aria-label="Sort results"
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {sorts.map((o) => (
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
            className={`border-surface-line bg-white text-ink-900 disabled:cursor-default ${chip}`}
          >
            All filters
            <SlidersHorizontal size={15} />
          </button>

          <label
            className={`relative cursor-pointer ${chip} ${
              floor !== 'any' ? 'border-action-500 bg-action-500 text-white' : 'border-surface-line bg-white text-ink-900'
            }`}
          >
            {ratingFloors.find((f) => f.key === floor).label}
            <ChevronDown size={15} />
            <select
              value={floor}
              onChange={(e) => onFloor(e.target.value)}
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
            onClick={() => onPopular(!popular)}
            aria-pressed={popular}
            className={`${chip} ${
              popular ? 'border-action-500 bg-action-500 text-white' : 'border-surface-line bg-white text-ink-900 hover:bg-surface-soft'
            }`}
          >
            Popularity
            <TrendingUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
