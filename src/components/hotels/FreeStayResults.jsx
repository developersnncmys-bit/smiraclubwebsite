'use client';

import { useMemo, useState } from 'react';
import FreeStayCard from '@/components/hotels/FreeStayCard';
import ResultsHeader from '@/components/results/ResultsHeader';
import { ratingFloors } from '@/lib/content';

/** A free stay has no room price, so sorting is by what it does have. */
const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'rating', label: 'Rating' },
];

/** Free Stay results. */
export default function FreeStayResults({ where, summary, hotels, carry }) {
  const [sort, setSort] = useState('recommended');
  const [floor, setFloor] = useState('any');
  const [popular, setPopular] = useState(false);

  const minRating = ratingFloors.find((f) => f.key === floor).min;

  const shown = useMemo(() => {
    const list = hotels.filter((h) => h.rating >= minRating);
    if (popular) return [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [hotels, minRating, popular, sort]);

  return (
    <>
      <ResultsHeader
        where={where}
        summary={summary}
        backHref="/free-stay"
        sort={sort}
        onSort={setSort}
        sorts={SORTS}
        floor={floor}
        onFloor={setFloor}
        popular={popular}
        onPopular={setPopular}
      />

      <div className="shell pb-10 lg:pb-16">
        <h1 className="pt-5 text-[17px] font-bold text-ink-900 lg:pt-8 lg:text-2xl">
          {shown.length} Result{shown.length === 1 ? '' : 's'} for{' '}
          <span className="text-brand-700">{where}</span>
        </h1>
        <p className="mt-1 text-[14px] text-ink-700">Showing Top Results</p>

        {shown.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">
            No free stays match that yet.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {shown.map((hotel) => (
              <FreeStayCard key={hotel.id} hotel={hotel} href={`/free-stay/${hotel.id}?${carry}`} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
