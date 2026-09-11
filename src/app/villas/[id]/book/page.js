import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import BookingForm from '@/components/villas/BookingForm';
import {
  villaBooking, villaDetails, villaHost, villaResults, villaRules, villaStay, villas,
} from '@/lib/content';
import { image } from '@/lib/images';
import { defaultStay, nightsBetween } from '@/lib/format';

const ALL = [...villaResults, ...villas];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const villa = ALL.find((v) => v.id === id);
  return { title: villa ? `Review Booking — ${villa.name}` : 'Review Booking' };
}

const fullDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const weekday = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short' });

/**
 * Review Booking.
 *
 * Everything above the form is a read-back of what was chosen, so it is all
 * server-rendered from the search that led here; only the parts a member can
 * change live in the client form below.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const villa = ALL.find((v) => v.id === id);
  if (!villa) notFound();

  const detail = villaDetails[villa.id];
  const fallback = defaultStay();
  const from = query.from ? new Date(query.from) : fallback.from;
  const to = query.to ? new Date(query.to) : fallback.to;
  const nights = nightsBetween(from, to);
  const adults = Number(query.adults) || 2;

  return (
    <div className="pb-28 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/villas/${villa.id}`} />

      <div className="shell py-4">
        <BookingForm
          price={villa.price}
          was={villa.was}
          taxes={villa.taxes}
          discount={villaBooking.discount}
          baseNote={`${villa.layout}, ${nights} Night${nights === 1 ? '' : 's'}`}
          bar={{
            mode: 'per-night',
            notes: [`+${villa.taxes.toLocaleString('en-IN')} taxes & fees per night`],
          }}
          confirm={{
            kind: 'villa',
            name: villa.name,
            slot: `${fullDate(from)} - ${fullDate(to)}`,
            nights: `${nights} Night${nights === 1 ? '' : 's'}/${nights + 1} Days`,
          }}
        >
          {/* -- What is being booked ----------------------------------- */}
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <span className="inline-block rounded-full border border-action-500 px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-action-500">
                Villa
              </span>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight text-ink-900">{villa.name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-700">
                    <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-ink-900">{villa.rating}</span>
                    <span className="text-ink-500">({villa.reviews} reviews)</span>
                  </p>
                  <p className="mt-2 text-[14px] text-ink-600">{villa.place}</p>
                </div>

                <span className="relative h-[92px] w-[120px] shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={image(villa.image)}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </span>
              </div>
            </div>

            {/* -- The stay --------------------------------------------- */}
            <div className="flex items-center justify-between gap-3 border-t border-surface-line p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Check in
                </p>
                <p className="mt-1 text-[15px] font-bold text-ink-900">{fullDate(from)}</p>
                <p className="text-[13px] text-ink-500">
                  {weekday(from)}, {villaStay.checkIn}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-action-500 px-3.5 py-1.5 text-[13px] font-semibold text-action-500">
                {nights} Night{nights === 1 ? '' : 's'}
              </span>

              <div className="min-w-0 text-right">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Check out
                </p>
                <p className="mt-1 text-[15px] font-bold text-ink-900">{fullDate(to)}</p>
                <p className="text-[13px] text-ink-500">
                  {weekday(to)}, {villaStay.checkOut}
                </p>
              </div>
            </div>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[14px] text-ink-500">Guests</p>
              <p className="text-[15px] font-bold text-ink-900">
                {adults} Adult{adults === 1 ? '' : 's'}
              </p>
            </div>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[15px] font-bold text-ink-900">{villa.layout}</p>
              <p className="mt-1 text-[14px] text-ink-600">
                {detail.bedrooms} Bedrooms, {detail.baths} Bathrooms, {detail.beds}
              </p>
            </div>
          </section>

          {/* -- What the rate includes --------------------------------- */}
          <section className="card overflow-hidden">
            <h2 className="p-4 text-lg font-bold leading-snug text-ink-900 sm:p-5">
              {villa.name} - {villaHost.title.replace('Hosted By', 'Hosted by')}
            </h2>

            <ul className="space-y-3 border-t border-surface-line p-4 sm:p-5">
              {villaBooking.meals.map((line) => (
                <li key={line} className="flex gap-2.5 text-[14px] text-ink-700">
                  <span aria-hidden="true" className="text-ink-400">&bull;</span>
                  {line}
                </li>
              ))}
              <li>
                <button type="button" className="text-[14px] font-semibold text-ink-900 underline">
                  Meal Details
                </button>
              </li>
            </ul>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-900">{villaBooking.refund.title}</p>
              <p className="mt-1 text-[14px] text-ink-600">{villaBooking.refund.body}</p>
              <button type="button" className="mt-4 text-[14px] font-bold text-ink-900 underline">
                Inclusions &amp; Cancellation Policy
              </button>
            </div>
          </section>

          {/* -- Rules, read back before paying ------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Property Rules &amp; Information</h2>
            <ul className="mt-4 space-y-3">
              {villaRules.map((rule) => (
                <li key={rule.title || rule.body} className="flex gap-2">
                  <span aria-hidden="true" className="text-ink-400">&#9702;</span>
                  <span>
                    {rule.title && (
                      <span className="block font-semibold text-ink-900 underline">{rule.title}</span>
                    )}
                    <span className="block text-[14px] leading-relaxed text-ink-700">{rule.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-3 text-[14px] font-bold text-ink-900 underline">
              View more
            </button>
          </section>
        </BookingForm>
      </div>
    </div>
  );
}
