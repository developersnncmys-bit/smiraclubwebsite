import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import BookingForm from '@/components/villas/BookingForm';
import { spaDates, spaTaxRate, spas } from '@/lib/content';
import { image } from '@/lib/images';
import { clock, fullDate, inr } from '@/lib/format';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = spas.find((x) => x.id === id);
  return { title: s ? `Review Booking — ${s.name}` : 'Review Booking' };
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/**
 * Review Booking for a saloon or spa.
 *
 * The service is charged per guest, children included, and the price summary
 * is worked from that one number so its rows always add up.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const q = (await searchParams) || {};
  const s = spas.find((x) => x.id === id);
  if (!s) notFound();

  const service = s.tickets.find((t) => t.id === q.service) ?? s.tickets[0];
  const branch = s.locations.find((l) => l.id === q.location) ?? s.locations[0];
  const dates = spaDates(14);
  const date = dates.includes(q.date) ? q.date : dates[0];
  const time = s.slots.includes(q.time) ? q.time : s.slots[0];
  const adults = Math.max(1, Math.min(10, Number(q.adults) || 2));
  const children = Math.max(0, Math.min(10, Number(q.children) || 0));
  const guests = adults + children;

  const base = guests * service.was;
  const paid = guests * service.price;
  const taxes = Math.round(paid * spaTaxRate);
  const who = [plural(adults, 'Adult', 'Adults'), children ? plural(children, 'Child', 'Children') : null].filter(Boolean).join(', ');
  const where = branch.title.replace(' - ', ', ');

  return (
    <div className="pb-36 lg:pb-12">
      <ScreenBar title="Review Booking" backHref={`/spa/${s.id}`} />

      <div className="shell py-4">
        <BookingForm
          price={base}
          taxes={taxes}
          discount={base - paid}
          discountLabel="Member Discount"
          baseNote={`${guests} X ${inr(service.was)} · ${service.label}`}
          afterNote={`${guests} X ${inr(service.price)}`}
          cta="Confirm Booking"
          bar={{ mode: 'total', notes: ['Inclusive of taxes & fees'] }}
          confirm={{ kind: 'spa', name: s.name, slot: fullDate(date), checkIn: date, nights: clock(time), location: where }}
        >
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <span className="inline-block rounded-full border border-action-500 bg-brand-50 px-4 py-1 text-[14px] font-medium text-brand-700">
                Saloon &amp; Spa
              </span>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold leading-tight text-ink-900">Booking at {s.name}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-700">
                    <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-ink-900">{s.rating}</span>
                    <span>({s.reviews} reviews)</span>
                  </p>
                  <p className="mt-1 text-[15px] text-ink-900">{where}</p>
                  <p className="text-[12px] text-ink-700">{branch.address}</p>
                </div>
                <span className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl">
                  <Image src={image(s.image)} alt="" fill sizes="100px" className="object-cover" />
                </span>
              </div>
            </div>
            <div className="border-t-4 border-surface-soft p-4 sm:p-5">
              <p className="text-[14px] text-ink-700">Guests</p>
              <p className="text-[16px] font-bold text-ink-900">{who}</p>
            </div>
            <div className="border-t-4 border-surface-soft p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-900">Service</p>
              <p className="text-[14px] text-ink-900">{service.label}</p>
            </div>
            <div className="border-t-4 border-surface-soft p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-900">Slot</p>
              <p className="text-[14px] text-ink-900">{fullDate(date)}, {clock(time)}</p>
            </div>
          </section>
        </BookingForm>
      </div>
    </div>
  );
}
