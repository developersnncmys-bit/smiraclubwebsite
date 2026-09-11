'use client';

import { useMemo, useState } from 'react';
import ResultsBar from '@/components/villas/ResultsBar';
import VillaCard from '@/components/villas/VillaCard';
import VillaCollections from '@/components/villas/VillaCollections';
import { villaCollectionsBlurb } from '@/lib/content';

/**
 * The results screen.
 *
 * The design breaks the list in two and drops the collections between them,
 * so a member who likes none of the first few has somewhere else to go
 * rather than an empty scroll. That split is what `head` and `rest` are.
 */
export default function VillaResults({ where, when, guests, villas, collections, query }) {
  const [sort, setSort] = useState('recommended');

  const sorted = useMemo(() => {
    const list = [...villas];
    if (sort === 'price-low') return list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [villas, sort]);

  const head = sorted.slice(0, 2);
  const rest = sorted.slice(2);

  return (
    <>
      <ResultsBar where={where} when={when} guests={guests} sort={sort} onSort={setSort} />

      <div className="shell pb-10 lg:pb-16">
        <h2 className="pt-5 text-[17px] font-bold text-ink-900 lg:pt-8 lg:text-2xl">
          Showing Results in {where}
        </h2>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
          {head.map((villa) => (
            <VillaCard key={villa.id} villa={villa} query={query} />
          ))}
        </div>

        <section className="pt-10 lg:pt-14">
          <h2 className="text-center text-lg font-extrabold uppercase tracking-[0.04em] text-ink-900 lg:text-2xl">
            Explore Villa Collections
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-[14px] leading-snug text-ink-600 lg:text-base">
            {villaCollectionsBlurb}
          </p>

          <div className="mt-5 lg:mt-7">
            <VillaCollections collections={collections} />
          </div>
        </section>

        {rest.length > 0 && (
          <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-6">
            {rest.map((villa) => (
              <VillaCard key={villa.id} villa={villa} query={query} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
