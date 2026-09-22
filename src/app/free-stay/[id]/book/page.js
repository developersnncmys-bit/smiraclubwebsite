import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import BookingForm from '@/components/villas/BookingForm';
import { RulesCard } from '@/components/hotels/DetailSections';
import { freeStayFood, hotels, mealPreferences } from '@/lib/content';
import { image } from '@/lib/images';
import { defaultStay, inr, nightsBetween, shortDate } from '@/lib/format';

export function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hotels.find((h) => h.id === id);
  return { title: hotel ? `Review Booking — ${hotel.name}` : 'Review Booking' };
}

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const valid = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '');
const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

/**
 * Review Booking, for a free stay.
 *
 * The shared booking form, where the thing being paid for is the food: the
 * room reads back as free, and Base price is breakfast and dinner for the
 * guests and nights chosen on the hotel page.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) notFound();

  const fallback = defaultStay();
  const from = valid(query.from) ? query.from : isoDay(fallback.from);
  const to = valid(query.to) && query.to > from ? query.to : isoDay(fallback.to);
  const nights = nightsBetween(from, to);
  const eatingAdults = Math.max(1, Number(query.fa) || Number(query.adults) || 2);
  const eatingKids = Math.max(0, Number(query.fc) || 0);
  const group = hotel.roomGroups.find((g) => g.id === query.room) ?? hotel.roomGroups[0];
  const meal = mealPreferences.find((m) => m.key === query.meal) ?? mealPreferences[0];

  const food = (eatingAdults * freeStayFood.adult.price + eatingKids * freeStayFood.child.price) * nights;
  const taxes = Math.round(food * freeStayFood.taxRate);

  const stay = `${plural(nights, 'Night')}/ ${nights + 1} days`;
  const slot = `${shortDate(from)} - ${shortDate(to)} ${new Date(to).getFullYear()}`;
  const eaters = [plural(eatingAdults, 'Adult'), eatingKids ? plural(eatingKids, 'Child', 'Children') : null]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/free-stay/${hotel.id}?${new URLSearchParams(query)}`} />

      <div className="shell py-4">
        <BookingForm
          price={food}
          taxes={taxes}
          discount={0}
          showEmptyDiscount
          baseNote={`Breakfast & dinner · ${eaters} · ${plural(nights, 'night')}`}
          bar={{ mode: 'total', notes: [stay, '(Taxes Included)'] }}
          confirm={{ kind: 'free-stay', name: hotel.name, slot, nights: stay, checkIn: from, checkOut: to }}
        >
          {/* -- What is being booked ----------------------------------- */}
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <span className="inline-block rounded-full border border-green-600 px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-green-700">
                Free Stay
              </span>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight text-ink-900">{hotel.name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-700">
                    <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-ink-900">{hotel.rating}</span>
                    <span className="text-ink-500">({hotel.reviews} reviews)</span>
                  </p>
                  <p className="mt-2 text-[14px] leading-snug text-ink-600">{hotel.locality}</p>
                </div>
                <span className="relative h-[92px] w-[120px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={image(hotel.image)} alt="" fill sizes="120px" className="object-cover" />
                </span>
              </div>
            </div>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[14px] text-ink-500">Preferred Slot</p>
              <p className="mt-1 text-[15px] font-bold text-ink-900">{slot}</p>
              <p className="text-[14px] text-ink-600">{stay}</p>
            </div>

            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[14px] text-ink-500">Guests</p>
              <p className="text-[15px] font-bold text-ink-900">{eaters}</p>
            </div>
          </section>

          {/* -- Room and food ------------------------------------------ */}
          <section className="card overflow-hidden">
            <h2 className="p-4 text-lg font-bold leading-snug text-ink-900 sm:p-5">{hotel.name}</h2>
            <div className="border-t border-surface-line p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-900">
                {group.room.name} <span className="font-normal text-ink-500">· {group.label}</span>
              </p>
              <ul className="mt-2 space-y-1.5 text-[14px] text-ink-600">
                <li className="flex gap-2.5"><span aria-hidden="true" className="text-ink-400">&bull;</span>Room: <span className="font-semibold text-green-700">Free Stay</span></li>
                <li className="flex gap-2.5"><span aria-hidden="true" className="text-ink-400">&bull;</span>Breakfast &amp; dinner for {eaters}</li>
                <li className="flex gap-2.5"><span aria-hidden="true" className="text-ink-400">&bull;</span>Meal preference: {meal.label}</li>
                <li className="flex gap-2.5"><span aria-hidden="true" className="text-ink-400">&bull;</span>Food {inr(food)} + {inr(taxes)} taxes</li>
              </ul>
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
