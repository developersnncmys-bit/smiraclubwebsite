import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import BookingForm from '@/components/villas/BookingForm';
import { hotels, villaRules } from '@/lib/content';
import { image } from '@/lib/images';
import { defaultStay, nightsBetween } from '@/lib/format';

export function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hotels.find((h) => h.id === id);
  return { title: hotel ? `Review Booking — ${hotel.name}` : 'Review Booking' };
}

/** "29 Aug - 31 Aug 2026", the way the slot card writes a stay. */
const slotLabel = (from, to) => {
  const day = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  return `${day(from)} - ${day(to)} ${to.getFullYear()}`;
};

/**
 * Review Booking, for a hotel.
 *
 * Everything above the form is a read-back of what was chosen, so it is all
 * server-rendered from the search and the rate plan that led here; only the
 * parts a member can change live in the client form below.
 *
 * The form itself is the villa one. A hotel and a villa ask for exactly the
 * same things at this point — coupon, who is staying, GST, terms — so the
 * two screens share it rather than drifting apart, and the props say where
 * they genuinely differ: a villa quotes a nightly rate in the bar, a hotel
 * quotes the total for the stay.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) notFound();

  /** Which rate plan the detail page sent us here with. */
  const plans = hotel.roomGroups.flatMap((g) => g.plans.map((p) => ({ plan: p, room: g.room })));
  const chosen = plans.find((p) => p.plan.id === query.plan)
    ?? plans.find((p) => p.plan.id === hotel.defaultPlan)
    ?? plans[0];

  const fallback = defaultStay();
  const from = query.from ? new Date(query.from) : fallback.from;
  const to = query.to ? new Date(query.to) : fallback.to;
  const nights = nightsBetween(from, to);
  const adults = Number(query.adults) || 2;

  const stay = `${nights} Night${nights === 1 ? '' : 's'}/ ${nights + 1} days`;

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/hotels/${hotel.id}`} />

      <div className="shell py-4">
        <BookingForm
          price={chosen.plan.price}
          taxes={hotel.taxes}
          discount={0}
          showEmptyDiscount
          bar={{ mode: 'total', notes: [stay, '(Taxes Included)'] }}
          confirm={{
            kind: 'hotel',
            name: hotel.name,
            slot: slotLabel(from, to),
            nights: stay,
          }}
        >
          {/* -- What is being booked ----------------------------------- */}
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <span className="inline-block rounded-full border border-action-500 px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-action-500">
                Hotel Booking
              </span>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight text-ink-900">{hotel.name}</h1>

                  <p className="mt-2 flex items-center gap-1.5 text-[15px] text-ink-700">
                    <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-ink-900">{hotel.rating}</span>
                    <span className="text-ink-500">({hotel.reviews} reviews)</span>
                  </p>

                  <p className="mt-2 text-[15px] leading-snug text-ink-600">{hotel.locality}</p>
                </div>

                <span className="relative h-[92px] w-[120px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={image(hotel.image)} alt="" fill sizes="120px" className="object-cover" />
                </span>
              </div>
            </div>

            {/* -- When -------------------------------------------------- */}
            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[15px] text-ink-500">Preferred Slot</p>
              <p className="mt-1 text-[16px] font-bold text-ink-900">{slotLabel(from, to)}</p>
              <p className="text-[15px] text-ink-600">{stay}</p>
            </div>

            {/* -- Who --------------------------------------------------- */}
            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[15px] text-ink-500">Guests</p>
              <p className="text-[16px] font-bold text-ink-900">
                {adults} Adult{adults === 1 ? '' : 's'}
              </p>
            </div>
          </section>

          {/* -- On what terms ------------------------------------------ */}
          <section className="card overflow-hidden">
            <h2 className="p-4 text-lg font-bold leading-snug text-ink-900 sm:p-5">{hotel.name}</h2>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[16px] font-semibold text-ink-900">{chosen.plan.name}</p>
              <ul className="mt-2 space-y-1.5">
                {chosen.plan.lines.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[15px] text-ink-600">
                    <span aria-hidden="true" className="text-ink-400">&bull;</span>
                    {line}
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-4 text-[15px] font-bold text-ink-900 underline">
                Cancellation Policy
              </button>
            </div>
          </section>

          {/* -- Rules, read back before paying ------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Property Rules &amp; Information</h2>
            <ul className="mt-4 space-y-3">
              {villaRules.map((rule) => (
                <li key={rule.title || rule.body}>
                  {rule.title && (
                    <p className="font-semibold text-ink-900 underline">{rule.title}</p>
                  )}
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{rule.body}</p>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 text-[15px] font-bold text-ink-900 underline">
              View more
            </button>
          </section>
        </BookingForm>
      </div>
    </div>
  );
}
