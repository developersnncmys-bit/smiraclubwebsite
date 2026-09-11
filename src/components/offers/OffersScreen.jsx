'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import {
  couponOffers, offerCategories, packageOffers, promoOffers,
} from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/** The slanted edge the design cuts between the panel and the photograph. */
const SLANT = { clipPath: 'polygon(0 0, 100% 0, calc(100% - 46px) 100%, 0 100%)' };

/** The little flag the category sits in, notched on its right edge. */
function Flag({ children }) {
  return (
    <span
      className="inline-block bg-white px-3 py-1.5 pr-5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-900"
      style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 9px) 50%, 100% 100%, 0 100%)' }}
    >
      {children}
    </span>
  );
}

/** A package or a promo: coloured panel on the left, photograph behind. */
function PanelCard({ offer, children }) {
  return (
    <Link
      href={offer.href}
      className="relative block h-[164px] overflow-hidden rounded-2xl sm:h-[180px]"
    >
      <Image
        src={toSrc(offer.image)}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover"
      />

      <div
        className={`absolute inset-y-0 left-0 w-[64%] bg-gradient-to-br ${offer.tone} p-4 sm:w-[58%] sm:p-5`}
        style={SLANT}
      >
        <div className="-ml-4 sm:-ml-5">
          <Flag>{offer.badge}</Flag>
        </div>
        {children}
      </div>
    </Link>
  );
}

/**
 * Offers.
 *
 * Two quite different things live under one set of tabs: the packages, which
 * are priced and photographed, and the partner coupons, which are a brand and
 * a discount. They keep their own card rather than being forced into one
 * shape, and the tabs decide which you see.
 */
export default function OffersScreen({ art = {} }) {
  const [tab, setTab] = useState('All');

  /**
   * The tab is addressable — /offers?kind=water-park opens that one. The
   * services tiles already link here by category, so they land on the right
   * tab instead of on All.
   */
  useEffect(() => {
    const kind = new URLSearchParams(window.location.search).get('kind');
    const match = offerCategories.find(
      (c) => c.toLowerCase().replace(/[^a-z]+/g, '-') === kind,
    );
    if (match) setTab(match);
  }, []);

  const goTo = (c) => {
    setTab(c);
    const kind = c.toLowerCase().replace(/[^a-z]+/g, '-');
    window.history.replaceState(null, '', c === 'All' ? '/offers' : `/offers?kind=${kind}`);
  };

  const { packages, promos, coupons } = useMemo(() => {
    const showPackages = tab === 'All' || tab === 'Packages';
    return {
      packages: showPackages ? packageOffers : [],
      promos: showPackages ? promoOffers : [],
      coupons: tab === 'All' ? [] : couponOffers.filter((c) => c.category === tab),
    };
  }, [tab]);

  const count = packages.length + promos.length + coupons.length;

  return (
    <div className="pb-10">
      {/* -- Which kind --------------------------------------------- */}
      <div className="border-b border-surface-line bg-white">
        <div className="shell">
          <div className="rail gap-2">
            {offerCategories.map((c) => {
              const on = c === tab;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => goTo(c)}
                  aria-pressed={on}
                  className={`shrink-0 rounded-lg px-4 py-2.5 text-[15px] font-medium transition ${
                    on
                      ? 'bg-brand-50 text-action-500 ring-1 ring-action-500'
                      : 'text-ink-700 hover:bg-surface-soft'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="shell py-5">
        <h1 className="text-[17px] font-bold text-ink-900 lg:text-2xl">
          Active Offers ({count})
        </h1>

        {count === 0 ? (
          <p className="card mt-5 p-10 text-center text-[14px] text-ink-500">
            No offers in this category right now.
          </p>
        ) : (
          <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0 2xl:grid-cols-3">
            {packages.map((offer) => (
              <PanelCard key={offer.id} offer={{ ...offer, image: art[offer.id] || offer.image }}>
                <p className="mt-4 text-[14px] text-white/90">Starting from</p>
                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">{offer.from}</span>
                  {offer.duration && (
                    <span className="text-[13px] font-semibold text-white/90">
                      {offer.duration}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[13px] leading-tight text-white/80">
                  Per Person/Per Day
                  <br />
                  (Inclusive all services)
                </p>
              </PanelCard>
            ))}

            {promos.map((offer) => (
              <PanelCard key={offer.id} offer={{ ...offer, image: art[offer.id] || offer.image }}>
                <p className="mt-4 max-w-[9rem] text-xl font-bold leading-tight text-white">
                  {offer.title}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-white underline">
                  Explore Offers
                  <ArrowRight size={16} />
                </span>
              </PanelCard>
            ))}

            {coupons.map((c) => (
              <article key={c.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
                <div
                  className={`flex items-center justify-between gap-4 bg-gradient-to-r ${c.tone} p-5`}
                >
                  <h2
                    className="text-[15px] font-bold uppercase leading-snug"
                    style={{ color: c.ink }}
                  >
                    {c.brand}
                  </h2>
                  <p className="shrink-0 whitespace-nowrap" style={{ color: c.ink }}>
                    <span className="text-3xl font-extrabold">{c.deal}</span>
                    <span className="ml-1 text-[14px] font-bold uppercase">Off</span>
                  </p>
                </div>

                {/* The torn edge between the deal and its terms. */}
                <div
                  className="h-3 bg-white"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 8px -2px, transparent 8px, white 8px)',
                    backgroundSize: '16px 12px',
                    backgroundRepeat: 'repeat-x',
                  }}
                />

                <ul className="space-y-2 px-5 pb-5 pt-1">
                  {c.lines.map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.03em] text-ink-700"
                    >
                      <Info size={15} className="shrink-0 text-ink-400" />
                      {line}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
