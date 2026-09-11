'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Images } from 'lucide-react';
import ReviewItem from '@/components/ui/ReviewItem';
import { myReviews, reviewSortOptions } from '@/lib/content';

/** "16 Aug, 2025" back into something sortable. */
const asDate = (s) => new Date(s.replace(',', '')).getTime() || 0;

/** Everything the member has written, with the same controls a property has. */
export default function MyReviews() {
  const [sort, setSort] = useState('relevant');
  const [withImages, setWithImages] = useState(false);

  const shown = useMemo(() => {
    let list = withImages ? myReviews.filter((r) => r.photos?.length) : myReviews;

    list = [...list];
    if (sort === 'recent') return list.sort((a, b) => asDate(b.date) - asDate(a.date));
    if (sort === 'high') return list.sort((a, b) => b.score - a.score);
    if (sort === 'low') return list.sort((a, b) => a.score - b.score);
    return list;
  }, [sort, withImages]);

  return (
    <div className="shell py-5">
      <section className="card p-4 sm:p-5">
        <h1 className="text-lg font-bold text-ink-900">All Reviews</h1>

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
              ? 'None of your reviews have photos yet.'
              : 'You have not written a review yet.'}
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-surface-line">
            {shown.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
