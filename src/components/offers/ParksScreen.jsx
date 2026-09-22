'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Segmented } from '@/components/forms/RequestFields';
import { CardHead, MemberStrip, SearchBox } from '@/components/offers/OfferBits';
import { parkKinds } from '@/lib/content';
import { inr } from '@/lib/format';

/**
 * Water park & Theme park.
 *
 * The switch picks the kind; the search box narrows the list by name or
 * place as you type, because a handful of parks does not need a separate
 * results screen.
 */
export default function ParksScreen({
  parks,
  kinds = parkKinds,
  basePath = '/parks',
  title = 'Water park & Theme park',
  /** The search box's prompt for each kind, by key. */
  searchLabels = { theme: 'Search Theme Parks or location', water: 'Search Water Parks or location' },
  similarLabel = 'Similar parks',
  empty = 'No parks match that yet.',
}) {
  const [kind, setKind] = useState(kinds[0].key);
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return parks.filter(
      (p) => p.kind === kind && (!term || `${p.name} ${p.place}`.toLowerCase().includes(term)),
    );
  }, [parks, kind, q]);

  return (
    <div className="pb-10 lg:pb-16">
      <div className="bg-white">
        <div className="shell space-y-5 py-5 lg:py-8">
          <h1 className="hidden text-2xl font-bold text-ink-900 lg:block">{title}</h1>
          <Segmented options={kinds} value={kind} onChange={setKind} label="Kind" className="lg:max-w-md" />
          <SearchBox
            value={q}
            onChange={setQ}
            placeholder={searchLabels[kind] || 'Search by name or location'}
            label="Search parks"
          />
        </div>
      </div>

      <div className="shell pt-6 lg:pt-8">
        <h2 className="text-[17px] font-semibold text-ink-900 lg:text-xl">Showing Top Results</h2>

        {shown.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">
            {empty}
          </p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {shown.map((park) => {
              const href = `${basePath}/${park.id}`;
              return (
                <article key={park.id} className="card p-3 sm:p-4">
                  <div className="flex gap-3.5">
                    <Link href={href} className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:h-[130px] sm:w-[130px]">
                      <Image src={park.images[0]} alt={park.name} fill sizes="130px" className="object-cover" />
                    </Link>
                    <CardHead
                      name={park.name}
                      place={park.place}
                      rating={park.rating}
                      reviews={park.reviews}
                      menu={{
                        item: { href, name: park.name, place: park.place, image: park.images[0] },
                        similar: { href: basePath, label: similarLabel },
                      }}
                    >
                      <p className="mt-1.5 text-[13px] text-ink-700">
                        Activity &middot; <span className="font-medium">{park.schedule}</span>
                      </p>
                    </CardHead>
                  </div>

                  <MemberStrip percent={park.offer} className="mt-3" />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[14px] text-ink-900">
                        <span className="text-[18px] font-bold">From {inr(park.from)}</span> Onwards
                      </p>
                      <p className="text-[12px] text-ink-700">Per Person before taxes &amp; fees</p>
                    </div>
                    <Link href={href} className="btn-primary shrink-0 gap-1.5 rounded-lg px-4 py-2.5 text-[14px] normal-case tracking-normal">
                      View Offers
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
