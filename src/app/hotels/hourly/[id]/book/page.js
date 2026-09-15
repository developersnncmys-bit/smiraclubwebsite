import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import BookingForm from '@/components/villas/BookingForm';
import { RulesCard } from '@/components/hotels/DetailSections';
import { hourlyDurations, hourlyHotels } from '@/lib/content';
import { image } from '@/lib/images';
import { fullDate, slotRange, weekday } from '@/lib/format';

export function generateStaticParams() {
  return hourlyHotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hourlyHotels.find((h) => h.id === id);
  return { title: hotel ? `Review Booking — ${hotel.name}` : 'Review Booking' };
}

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Review Booking, for an hourly stay.
 *
 * The form is the shared one the nightly hotel and the villa use. What
 * differs is the read-back: one day and a time window rather than nights,
 * and a price for the chosen length.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const hotel = hourlyHotels.find((h) => h.id === id);
  if (!hotel) notFound();

  const date = /^\d{4}-\d{2}-\d{2}$/.test(query.date || '') ? query.date : isoDay(new Date());
  const time = /^\d{2}:\d{2}$/.test(query.time || '') ? query.time : '14:00';
  // A length the hotel does not sell falls back to the first one it does.
  const asked = Number(query.hours);
  const hours = hotel.slots[asked] ? asked : hourlyDurations.find((h) => hotel.slots[h]);
  const slot = hotel.slots[hours];
  const adults = Number(query.adults) || 2;

  const span = `${slotRange(time, hours)} (${hours} Hours)`;

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/hotels/hourly/${hotel.id}?${new URLSearchParams(query)}`} />

      <div className="shell py-4">
        <BookingForm
          price={slot.price}
          was={slot.was}
          taxes={slot.taxes}
          discount={0}
          showEmptyDiscount
          bar={{ mode: 'total', notes: [span, '(Taxes Included)'] }}
          confirm={{
            kind: 'hourly',
            name: hotel.name,
            slot: fullDate(date),
            nights: span,
          }}
        >
          {/* -- What is being booked ----------------------------------- */}
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <span className="inline-block rounded-full border border-action-500 px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-action-500">
                Hourly Stay
              </span>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight text-ink-900">{hotel.name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-700">
                    <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-ink-900">{hotel.rating}</span>
                    <span className="text-ink-500">({hotel.reviews} reviews)</span>
                  </p>
                  <p className="mt-2 text-[14px] leading-snug text-ink-600">
                    {hotel.place} | {hotel.reach}
                  </p>
                </div>
                <span className="relative h-[92px] w-[120px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={image(hotel.images[0])} alt="" fill sizes="120px" className="object-cover" />
                </span>
              </div>
            </div>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[14px] text-ink-500">Preferred Slot</p>
              <p className="mt-1 text-[15px] font-bold text-ink-900">{fullDate(date)}</p>
              <p className="text-[14px] text-ink-600">
                {weekday(date)}, {span}
              </p>
            </div>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[14px] text-ink-500">Guests</p>
              <p className="text-[15px] font-bold text-ink-900">
                {adults} Adult{adults === 1 ? '' : 's'}
              </p>
            </div>
          </section>

          {/* -- On what terms ------------------------------------------ */}
          <section className="card overflow-hidden">
            <h2 className="p-4 text-lg font-bold leading-snug text-ink-900 sm:p-5">{hotel.name} by Smira Club</h2>
            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-900">Non-Refundable</p>
              <p className="mt-2 text-[14px] text-ink-600">Refund is not applicable for this booking</p>
              <button type="button" className="mt-4 text-[14px] font-bold text-ink-900 underline">
                Cancellation Policy
              </button>
            </div>
          </section>

          <RulesCard />
        </BookingForm>
      </div>
    </div>
  );
}
