import Link from 'next/link';
import Countdown from '@/components/ui/Countdown';
import { flashOffers } from '@/lib/content';

/**
 * Flash Offers.
 *
 * Each card carries its own clock, because the whole point of the section is
 * that these expire — a deal with no deadline on it is just an offer, and the
 * design puts the timer above the brand for that reason.
 */
export default function FlashOffers() {
  return (
    <section className="bg-white py-7 lg:bg-transparent lg:py-10">
      <div className="shell">
        {/* The rule runs out to both margins and breaks for the title. */}
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-surface-line" />
          <h2 className="text-[15px] font-extrabold uppercase tracking-[0.14em] text-ink-900 lg:text-xl">
            Flash Offers
          </h2>
          <span className="h-px flex-1 bg-surface-line" />
        </div>

        <div className="rail mt-5 lg:grid lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {flashOffers.map((offer) => (
            <article
              key={offer.id}
              className={`w-[91%] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br sm:w-[24rem] lg:w-auto ${offer.tone}`}
            >
              {/*
                The clock sits in a white panel notched into the corner rather
                than on the gradient, which is what the frame draws and what
                keeps four small numbers readable against a dark photo-blue.
              */}
              <div className="flex items-start justify-between gap-3">
                <div className="shrink-0 rounded-br-2xl bg-white py-2.5 pl-4 pr-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-ink-900">
                    Offer ends in:
                  </p>
                  <Countdown hours={offer.endsInHours} tone="plain" className="mt-1.5" />
                </div>

                <span className="m-2.5 min-w-0 rounded-full bg-white px-3 py-1.5 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.04em] text-ink-900">
                  {offer.badge}
                </span>
              </div>

              <div className="p-4 pt-5 sm:p-5 sm:pt-6">
                <h3 className="text-xl font-bold leading-snug text-white">{offer.brand}</h3>
                <p className="mt-1 text-[14px] text-white/85">{offer.place}</p>

                <p className="mt-3 text-lg font-bold text-white">{offer.deal}</p>

                <Link
                  href={offer.href}
                  className="mt-4 flex w-full items-center justify-center rounded-lg border border-white/45 px-5 py-3 text-[14px] font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
                >
                  Avail now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
