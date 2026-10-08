'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { offerTabs, offers as fallbackOffers } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/**
 * The colours a card can be.
 *
 * A card from the desk carries the name of one of these rather than a
 * gradient, because these classes have to be in the stylesheet when it
 * is built — a hex somebody typed in the panel last Tuesday is not, and
 * compiles to nothing at all.
 */
const TONES = {
  indigo: 'from-[#2b1e63] to-[#3d2a86]',
  blue: 'from-[#0f3f77] to-[#1c62b0]',
  plum: 'from-[#5b2333] to-[#8c3b52]',
  forest: 'from-[#14532d] to-[#1f7a43]',
  ember: 'from-[#7c2d12] to-[#b45309]',
  slate: 'from-[#1f2937] to-[#475569]',
};

/** Either a name from the set above, or a gradient a bundled card gave. */
const toneOf = (tone) => TONES[tone] || tone || TONES.indigo;

/** Grab Offers, with the four tabs the design puts above the cards. */
export default function GrabOffers({ offers }) {
  const [tab, setTab] = useState('All');

  // Same guard as the hero: never hand next/image a bare slot name.
  // The desk’s strip when it has arranged one, the bundled cards when
  // it has not. Never both: a half-curated strip reads as a mistake.
  const cards = (offers?.length ? offers : fallbackOffers).map((o) => ({
    ...o,
    image: toSrc(o.image),
    tone: toneOf(o.tone),
  }));
  const shown = tab === 'All' ? cards : cards.filter((o) => o.tab === tab);

  return (
    <div className="bg-white py-6 lg:bg-transparent lg:py-10">
      <div className="shell">
        <h2 className="section-title">Grab Offers</h2>

        <div role="tablist" className="mt-4 flex gap-1 overflow-x-auto border-b border-surface-line no-scrollbar">
          {offerTabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={t === tab}
              onClick={() => setTab(t)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                t === tab ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 rail lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible">
          {shown.map((offer) => (
            <Link
              key={offer.id}
              href={offer.href || `/offers#${offer.id}`}
              className={`relative flex h-[11.5rem] w-[19rem] overflow-hidden rounded-2xl bg-gradient-to-r ${offer.tone} lg:h-[13rem] lg:w-auto`}
            >
              <div className="relative z-10 flex w-[58%] flex-col justify-between p-4 lg:p-5">
                <span className="w-fit rounded bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur">
                  {offer.badge}
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-tight text-white lg:text-xl">{offer.title}</p>
                  {offer.points?.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {offer.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-1.5 text-[11px] font-medium text-white/90">
                          <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] bg-white text-green-600">
                            <Check size={10} strokeWidth={3.5} />
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white underline underline-offset-4">
                    Explore Offers
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 w-[46%]">
                <Image src={offer.image} alt="" fill sizes="320px" className="object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${offer.tone} opacity-60`} style={{ maskImage: 'linear-gradient(to right, black, transparent 55%)' }} />
              </div>
            </Link>
          ))}

          {shown.length === 0 && (
            <p className="py-8 text-sm text-ink-500">Nothing under {tab} just now — try another tab.</p>
          )}
        </div>

        <div className="mt-5 flex justify-center">
          <Link href="/offers" className="inline-flex items-center gap-2 text-base font-bold text-ink-900 hover:text-brand-700">
            View All
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white">
              <ChevronRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
