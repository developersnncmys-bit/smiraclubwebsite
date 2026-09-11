'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, Images } from 'lucide-react';
import ReviewItem from '@/components/ui/ReviewItem';
import { hotelRatingSummary, reviewFilters, reviewSortOptions } from '@/lib/content';

/** "16 Aug, 2025" back into something sortable. */
const asDate = (s) => new Date(s.replace(',', '')).getTime() || 0;

/**
 * Ratings & Review, in full.
 *
 * The four tabs read the party a review was left by, so a couple can see
 * what other couples said rather than an average across everyone. Sorting
 * and the images filter sit over whatever the tab has narrowed to.
 */
export default function ReviewsScreen({ title, subtitle, backHref, rating, reviewCount, reviews }) {
  const router = useRouter();
  const [who, setWho] = useState('everyone');
  const [sort, setSort] = useState('relevant');
  const [withImages, setWithImages] = useState(false);

  const shown = useMemo(() => {
    let list = who === 'everyone' ? reviews : reviews.filter((r) => r.kind === who);
    if (withImages) list = list.filter((r) => r.photos?.length);

    list = [...list];
    if (sort === 'recent') return list.sort((a, b) => asDate(b.date) - asDate(a.date));
    if (sort === 'high') return list.sort((a, b) => b.score - a.score);
    if (sort === 'low') return list.sort((a, b) => a.score - b.score);
    return list;
  }, [reviews, who, sort, withImages]);

  return (
    <>
      {/* -- The screen's own bar, two lines as drawn ---------------- */}
      <div className="border-b border-surface-line bg-white">
        <div className="shell flex items-center gap-3 py-3.5">
          <button
            type="button"
            onClick={() => router.push(backHref)}
            aria-label="Back to the property"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold leading-tight text-ink-900">{title}</h1>
            <p className="truncate text-[14px] text-ink-600">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* -- Who left it ---------------------------------------------- */}
      <div className="border-b border-surface-line bg-white">
        <div className="shell">
          <div className="rail gap-7 sm:gap-9">
            {reviewFilters.map((f) => {
              const on = f.key === who;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setWho(f.key)}
                  aria-pressed={on}
                  className={`shrink-0 border-b-2 py-3.5 text-[14px] font-bold uppercase tracking-[0.04em] transition ${
                    on
                      ? 'border-action-500 text-action-500'
                      : 'border-transparent text-ink-500 hover:text-ink-700'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell space-y-4 py-4 pb-10">
        {/* -- How it breaks down ------------------------------------ */}
        <section className="card p-4 sm:p-5">
          <p className="flex items-center gap-3">
            <span className="rounded-md bg-action-500 px-3 py-1.5 text-lg font-bold text-white">
              {rating}
            </span>
            <span className="text-xl font-bold text-action-500">{hotelRatingSummary.word}</span>
          </p>
          <p className="mt-2 text-[14px] text-ink-600">({reviewCount} reviews)</p>

          <dl className="mt-5 space-y-3">
            {hotelRatingSummary.breakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-4">
                <dt className="w-[92px] shrink-0 text-[13px] font-semibold uppercase tracking-[0.03em] text-ink-800 underline sm:w-[110px]">
                  {b.label}
                </dt>
                <dd className="flex flex-1 items-center gap-3">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-line">
                    <span
                      className="block h-full rounded-full bg-action-500"
                      style={{ width: `${b.pct}%` }}
                    />
                  </span>
                  <span className="w-10 shrink-0 text-right text-[13px] text-ink-600">
                    {b.pct}%
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -- The reviews themselves -------------------------------- */}
        <section className="card p-4 sm:p-5">
          <h2 className="text-lg font-bold text-ink-900">All Reviews</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line px-4 py-3 text-[14px] font-medium text-ink-900">
              <span className="sr-only">Sort reviews by</span>
              Sort By:
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer appearance-none border-0 bg-transparent pr-4 font-medium text-ink-900 outline-none"
              >
                {reviewSortOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="-ml-4 shrink-0 text-ink-600" />
            </label>

            <button
              type="button"
              onClick={() => setWithImages((v) => !v)}
              aria-pressed={withImages}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[14px] font-medium transition ${
                withImages
                  ? 'border-action-500 bg-action-500 text-white'
                  : 'border-surface-line text-ink-900 hover:bg-surface-soft'
              }`}
            >
              <Images size={17} />
              Review with Images
            </button>
          </div>

          {shown.length === 0 ? (
            <p className="mt-8 text-center text-[14px] text-ink-500">
              {withImages
                ? 'No reviews with photos yet in this group.'
                : 'No reviews from this group yet.'}
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-surface-line">
              {shown.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
