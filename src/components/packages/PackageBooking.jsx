'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Star } from 'lucide-react';
import BookingForm from '@/components/villas/BookingForm';
import { api } from '@/lib/api';
import { fullDate, inr, weekday } from '@/lib/format';

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** The − value + row the traveller counts use. */
function Stepper({ label, note, value, onChange, min, max }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span>
        <span className="block text-[15px] text-ink-900">{label}</span>
        {note && <span className="block text-[12px] text-ink-500">{note}</span>}
      </span>
      <span className="flex items-center gap-1 rounded-lg border border-action-500 px-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`One fewer ${label}`}
          className="grid h-9 w-9 place-items-center text-[17px] font-bold text-action-500 disabled:opacity-30"
        >
          &minus;
        </button>
        <span className="w-7 text-center text-[15px] font-bold text-ink-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`One more ${label}`}
          className="grid h-9 w-9 place-items-center text-[17px] font-bold text-action-500 disabled:opacity-30"
        >
          +
        </button>
      </span>
    </div>
  );
}

/**
 * Review Booking for a fixed-departure package.
 *
 * The same screen every other booking uses, with the two things a package
 * adds: which departure, and how many are travelling. The price is per
 * traveller, children included, and the summary is worked from that one count
 * so its rows always add up.
 *
 * Continue sends the booking to the Smira desk, where it waits on the Booking
 * page as pending until they call to confirm seats and take payment — which
 * is what the confirmation screen then says.
 *
 * A group departure uses the same screen: `kind` and `badge` name it,
 * `seats` maps each date to the seats left (so the counts can never ask for
 * more than there are), and `initial` carries the date and travellers
 * already chosen on the trip page.
 */
export default function PackageBooking({
  pkg,
  photo,
  departures,
  taxRate,
  kind = 'package',
  badge = 'Fixed Departure',
  seats = null,
  initial = {},
}) {
  const [departure, setDeparture] = useState(
    departures.includes(initial.departure) ? initial.departure : departures[0],
  );
  const [adults, setAdults] = useState(initial.adults || 2);
  const [children, setChildren] = useState(initial.children || 0);
  const left = seats ? seats[departure] ?? 0 : 20;

  const travellers = adults + children;
  const base = travellers * (pkg.was || pkg.price);
  const paid = travellers * pkg.price;
  const taxes = Math.round(paid * taxRate);
  const who = [plural(adults, 'Adult', 'Adults'), children ? plural(children, 'Child', 'Children') : null]
    .filter(Boolean)
    .join(', ');
  const stay = `${pkg.nights + 1} Days / ${plural(pkg.nights, 'Night', 'Nights')}`;

  const send = async ({ guests, gstin, coupon, total }) => {
    const lead = guests[0] || {};
    const res = await api.packageBooking({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      guests,
      gstin,
      coupon,
      packageName: pkg.name,
      destination: pkg.place,
      departure,
      nights: pkg.nights,
      adults,
      children,
      total,
    });
    return { reference: res.data?.reference };
  };

  return (
    <BookingForm
      price={base}
      taxes={taxes}
      discount={base - paid}
      discountLabel="Member Discount"
      baseNote={`${travellers} X ${inr(pkg.was || pkg.price)} · per person`}
      afterNote={`${travellers} X ${inr(pkg.price)}`}
      cta="Confirm Booking"
      bar={{ mode: 'total', notes: ['Inclusive of taxes & fees'] }}
      confirm={{ kind, name: pkg.name, slot: fullDate(departure), nights: stay, location: pkg.place }}
      send={send}
    >
      <section className="card overflow-hidden">
        <div className="p-4 sm:p-5">
          <span className="inline-block rounded-full border border-action-500 bg-brand-50 px-4 py-1 text-[14px] font-medium text-brand-700">
            {badge}
          </span>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold leading-tight text-ink-900">{pkg.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-700">
                <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
                <span className="font-bold text-ink-900">{pkg.rating}</span>
                <span>({pkg.reviews} reviews)</span>
              </p>
              <p className="mt-1 text-[15px] text-ink-900">{pkg.place}</p>
              <p className="text-[13px] text-ink-700">{stay}</p>
            </div>
            <span className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl">
              <Image src={photo} alt="" fill sizes="100px" className="object-cover" />
            </span>
          </div>
        </div>

        <div className="border-t-4 border-surface-soft p-4 sm:p-5">
          <label className="block">
            <span className="flex items-center gap-2 text-[15px] font-semibold text-ink-900">
              <CalendarDays size={18} className="text-action-500" />
              Departure
            </span>
            <select
              value={departure}
              onChange={(e) => {
                const next = e.target.value;
                setDeparture(next);
                // Never hold more travellers than the new date has seats.
                const cap = seats ? seats[next] ?? 0 : 20;
                if (adults + children > cap) {
                  setChildren(Math.max(0, Math.min(children, cap - 1)));
                  setAdults(Math.max(1, Math.min(adults, cap)));
                }
              }}
              className="mt-3 w-full cursor-pointer rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[14px] text-ink-900 outline-none focus:border-action-500"
            >
              {departures.map((d) => (
                <option key={d} value={d}>
                  {fullDate(d)} · {weekday(d)}{seats ? ` · ${seats[d]} seat${seats[d] === 1 ? '' : 's'} left` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="border-t-4 border-surface-soft p-4 sm:p-5">
          <p className="text-[15px] font-semibold text-ink-900">Travellers</p>
          <div className="mt-1 divide-y divide-surface-line">
            <Stepper label="Adults" value={adults} onChange={setAdults} min={1} max={Math.min(10, left - children)} />
            <Stepper label="Children" note="Priced as a traveller" value={children} onChange={setChildren} min={0} max={Math.min(10, left - adults)} />
          </div>
          <p className="mt-2 text-[13px] text-ink-500">{who}</p>
        </div>
      </section>
    </BookingForm>
  );
}
