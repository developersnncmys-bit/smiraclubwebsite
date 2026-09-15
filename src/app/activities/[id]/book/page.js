import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import BookingForm from '@/components/villas/BookingForm';
import { activities, activityDates, activityTaxRate } from '@/lib/content';
import { image } from '@/lib/images';
import { clock, fullDate, inr } from '@/lib/format';

export function generateStaticParams() {
  return activities.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const a = activities.find((x) => x.id === id);
  return { title: a ? `Review Booking — ${a.name}` : 'Review Booking' };
}

/**
 * Review Booking for a camp or an adventure.
 *
 * Base price is the tickets at their listed price, Member Discount is the
 * difference to what members pay, and the rows are worked from the same
 * ticket counts so they always add up.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};
  const a = activities.find((x) => x.id === id);
  if (!a) notFound();

  const dates = activityDates(a);
  const date = dates.includes(query.date) ? query.date : dates[0];
  const time = a.sessions.slots.includes(query.time) ? query.time : a.sessions.slots[0];

  const lines = a.tickets
    .map((t) => ({ ...t, n: Math.max(0, Math.min(20, Number(query[t.id]) || 0)) }))
    .filter((t) => t.n > 0);
  if (!lines.length) lines.push({ ...a.tickets[0], n: 2 });

  const base = lines.reduce((s, t) => s + t.n * t.was, 0);
  const paid = lines.reduce((s, t) => s + t.n * t.price, 0);
  const taxes = Math.round(paid * activityTaxRate);
  const times = (key) => lines.map((t) => `${t.n} X ${inr(t[key])}`).join(' + ');

  const guests = lines.map((t) => `${t.n} ${t.n === 1 ? t.label.replace(/ren$|s$/, '') : t.label}`).join(', ');
  const when = `${fullDate(date)}, ${clock(time)}`;

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/activities/${a.id}`} />

      <div className="shell py-4">
        <BookingForm
          price={base}
          taxes={taxes}
          discount={base - paid}
          discountLabel="Member Discount"
          baseNote={times('was')}
          afterNote={times('price')}
          cta="Confirm Booking"
          bar={{ mode: 'total', notes: ['Inclusive of taxes & fees'] }}
          confirm={{ kind: a.kind, name: a.name, slot: fullDate(date), nights: clock(time), location: a.place.split(',')[0] }}
        >
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <span className="inline-block rounded-full border border-action-500 bg-brand-50 px-4 py-1 text-[14px] font-medium text-brand-700">
                {a.tag}
              </span>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-bold leading-tight text-ink-900">{a.name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-700">
                    <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-ink-900">{a.rating}</span>
                    <span>({a.reviews} reviews)</span>
                  </p>
                  <p className="mt-1 text-[15px] text-ink-900">{a.place.split(',')[0]}</p>
                </div>
                <span className="relative h-[100px] w-[110px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={image(a.image)} alt="" fill sizes="110px" className="object-cover" />
                </span>
              </div>
            </div>
            <div className="border-t-4 border-surface-soft p-4 sm:p-5">
              <p className="text-[14px] text-ink-700">Guests</p>
              <p className="text-[16px] font-bold text-ink-900">{guests}</p>
            </div>
            <div className="border-t-4 border-surface-soft p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-900">Slot</p>
              <p className="text-[14px] text-ink-900">{when}</p>
            </div>
          </section>
        </BookingForm>
      </div>
    </div>
  );
}
