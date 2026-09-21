'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Armchair, ArrowRight, ArrowUpDown, ChevronDown, Search, Sparkle } from 'lucide-react';
import { Segmented } from '@/components/forms/RequestFields';
import { CardHead, MemberStrip, SearchBox } from '@/components/offers/OfferBits';
import { activityFrom, activityKinds } from '@/lib/content';
import { inr } from '@/lib/format';

const chip = 'relative inline-flex shrink-0 items-center gap-2 rounded-md border px-4 py-2 text-[14px] transition';
const on = 'border-action-500 bg-[#e8f0fe] font-semibold text-brand-700';
const off = 'border-ink-400/60 bg-white text-ink-900 hover:border-ink-500';

const SORTS = [
  { key: 'recommended', label: 'Recommended' },
  { key: 'price-low', label: 'Price: low to high' },
  { key: 'price-high', label: 'Price: high to low' },
  { key: 'rating', label: 'Rating' },
];

/**
 * Camping & Adventure.
 *
 * The switch picks the kind and the search box narrows by name or place as
 * you type. The chips below are real: All clears them, Popular orders by
 * reviews, Location and Discount filter.
 *
 * Saloon & Spa is drawn the same way, so it renders this with its own kinds,
 * title, placeholder and links. Luxury Experiences puts its kinds in a row of
 * chips that can all be off (`kindStyle="chips"`), hides the search behind
 * an icon, and quotes when bookings open rather than a price (`foot`).
 */
export default function ActivitiesScreen({
  activities,
  kinds = activityKinds,
  initialKind,
  title = 'Camping & Adventure',
  placeholder = 'Search activities or destination',
  hrefBase = '/activities',
  kindStyle = 'segmented',
  foot = 'price',
}) {
  const chipKinds = kindStyle === 'chips';
  const [kind, setKind] = useState(initialKind ?? (chipKinds ? null : kinds[0].key));
  const [searching, setSearching] = useState(!chipKinds);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recommended');
  const [popular, setPopular] = useState(false);
  const [place, setPlace] = useState('');
  const [minOff, setMinOff] = useState(0);

  const places = useMemo(
    () => [...new Set(activities.filter((a) => !kind || a.kind === kind).map((a) => a.place.split(',')[0]))],
    [activities, kind],
  );

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = activities.filter(
      (a) =>
        (!kind || a.kind === kind) &&
        (!term || `${a.name} ${a.cardName} ${a.place} ${a.tag}`.toLowerCase().includes(term)) &&
        (!place || a.place.startsWith(place)) &&
        a.offer >= minOff,
    );
    if (popular) return [...list].sort((a, b) => b.reviews - a.reviews);
    if (sort === 'price-low') return [...list].sort((a, b) => activityFrom(a).price - activityFrom(b).price);
    if (sort === 'price-high') return [...list].sort((a, b) => activityFrom(b).price - activityFrom(a).price);
    if (sort === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [activities, kind, q, place, minOff, popular, sort]);

  const all = !popular && !place && !minOff && sort === 'recommended' && (!chipKinds || !kind);
  const reset = () => {
    setPopular(false);
    setPlace('');
    setMinOff(0);
    setSort('recommended');
    if (chipKinds) setKind(null);
  };

  return (
    <div className="pb-10 lg:pb-16">
      <div className="bg-white">
        <div className="shell space-y-4 py-5 lg:py-8">
          <h1 className="hidden text-2xl font-bold text-ink-900 lg:block">{title}</h1>
          {!chipKinds && (
          <Segmented
            options={kinds}
            value={kind}
            onChange={(k) => {
              setKind(k);
              setPlace('');
            }}
            label={title}
            className="lg:max-w-md"
          />
          )}
          {searching && <SearchBox value={q} onChange={setQ} placeholder={placeholder} label={placeholder} />}

          {/* In chips mode the search icon rides the end of this row, as the
              frame puts it top right, rather than taking a row of its own. */}
          <div className="flex items-center gap-2">
          <div className={`rail min-w-0 flex-1 gap-2 ${chipKinds ? '!mr-0 !pr-1' : ''}`}>
            <button type="button" onClick={reset} aria-pressed={all} className={`${chip} ${all ? on : off}`}>All</button>

            <label className={`cursor-pointer ${chip} ${sort !== 'recommended' ? on : off}`}>
              Sort By
              <ArrowUpDown size={14} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by" className="absolute inset-0 cursor-pointer opacity-0">
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </label>

            <button type="button" onClick={() => setPopular((p) => !p)} aria-pressed={popular} className={`${chip} ${popular ? on : off}`}>Popular</button>

            <label className={`cursor-pointer ${chip} ${place ? on : off}`}>
              {place || 'Location'}
              <ChevronDown size={14} />
              <select value={place} onChange={(e) => setPlace(e.target.value)} aria-label="Location" className="absolute inset-0 cursor-pointer opacity-0">
                <option value="">Any location</option>
                {places.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>

            <label className={`cursor-pointer ${chip} ${minOff ? on : off}`}>
              {minOff ? `${minOff}%+ OFF` : 'Discount'}
              <ChevronDown size={14} />
              <select value={minOff} onChange={(e) => setMinOff(Number(e.target.value))} aria-label="Discount" className="absolute inset-0 cursor-pointer opacity-0">
                <option value={0}>Any discount</option>
                <option value={20}>20% OFF & above</option>
                <option value={30}>30% OFF & above</option>
                <option value={40}>40% OFF & above</option>
              </select>
            </label>
          </div>
            {chipKinds && (
              <button
                type="button"
                onClick={() => setSearching((v) => !v)}
                aria-expanded={searching}
                aria-label="Search"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-surface-line bg-white text-ink-900 hover:bg-surface-soft"
              >
                <Search size={22} />
              </button>
            )}
          </div>

          {chipKinds && (
            <div className="rail gap-2.5">
              {kinds.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => {
                    setKind(kind === k.key ? null : k.key);
                    setPlace('');
                  }}
                  aria-pressed={kind === k.key}
                  className={`shrink-0 rounded-md border px-4 py-2.5 text-[16px] transition ${kind === k.key ? on : off}`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="shell pt-6 lg:pt-8">
        <h2 className="text-[17px] font-semibold text-ink-900 lg:text-xl">Showing Top Results</h2>

        {shown.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">Nothing matches that yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
            {shown.map((a) => {
              const href = `${hrefBase}/${a.id}`;
              const from = activityFrom(a);
              return (
                <article key={a.id} className="card p-3 sm:p-4">
                  <div className="flex gap-3.5">
                    <Link href={href} className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:h-[128px] sm:w-[128px]">
                      <Image src={a.image} alt={a.name} fill sizes="128px" className="object-cover" />
                    </Link>
                    <CardHead
                      name={a.cardName}
                      place={a.place}
                      rating={a.listRating ?? a.rating}
                      reviews={a.listReviews ?? a.reviews}
                      menu={{
                        item: { href, name: a.name, place: a.place, image: a.image },
                        similar: { href: hrefBase, label: 'Similar offers' },
                      }}
                    >
                      {foot === 'price' && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-[14px] font-medium text-[#6d4bd8]">
                          <Sparkle size={16} fill="currentColor" strokeWidth={0} />
                          {a.tag}
                        </p>
                      )}
                    </CardHead>
                  </div>

                  <MemberStrip percent={a.offer} className="mt-3" />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    {foot === 'availability' ? (
                      <p className="flex min-w-0 items-start gap-2 text-[14px] font-medium leading-snug text-ink-900">
                        <Armchair size={17} className="mt-0.5 shrink-0 text-ink-600" />
                        <span>Bookings available from {a.availableFrom}</span>
                      </p>
                    ) : (
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[18px] font-bold text-ink-900">From {inr(from.price)}</span>
                        <span className="text-[13px] text-red-500 line-through">{inr(from.was)}</span>
                      </p>
                      <p className="text-[12px] text-ink-700">Per Person before taxes &amp; fees</p>
                    </div>
                    )}
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
