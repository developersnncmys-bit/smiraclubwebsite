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
        <h2 className="text-center text-[17px] font-extrabold uppercase tracking-[0.14em] text-ink-900 lg:text-xl">
          Flash Offers
        </h2>

        <div className="rail mt-5 lg:grid lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {flashOffers.map((offer) => (
            <article
              key={offer.id}
              className={`w-[86%] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br p-4 sm:w-[24rem] sm:p-5 lg:w-auto ${offer.tone}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-white/75">
                    Offer ends in:
                  </p>
                  <Countdown hours={offer.endsInHours} tone="dark" className="mt-1.5" />
                </div>

                <span className="shrink-0 rounded-md bg-white px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.05em] text-ink-900">
                  {offer.badge}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold leading-snug text-white">{offer.brand}</h3>
              <p className="text-[15px] text-white/80">{offer.place}</p>

              <p className="mt-3 text-lg font-bold text-white">{offer.deal}</p>

              <Link
                href={offer.href}
                className="mt-4 flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-[15px] font-bold uppercase tracking-wide text-ink-900 transition hover:bg-surface-soft"
              >
                Avail now
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
