'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays } from 'lucide-react';
import { inr, shortDate, weekday } from '@/lib/format';

function Stepper({ label, note, value, onChange, min, max }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span>
        <span className="block text-[15px] font-medium text-ink-900">{label}</span>
        {note && <span className="block text-[12px] text-ink-500">{note}</span>}
      </span>
      <span className="flex items-center rounded-lg border border-action-500">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`One fewer ${label}`} className="grid h-9 w-9 place-items-center text-[18px] font-bold text-action-500 disabled:opacity-30">&minus;</button>
        <span aria-live="polite" className="w-7 text-center text-[15px] font-bold text-ink-900">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`One more ${label}`} className="grid h-9 w-9 place-items-center text-[18px] font-bold text-action-500 disabled:opacity-30">+</button>
      </span>
    </div>
  );
}

/**
 * Choose a departure and how many are going, then Reserve Seats.
 *
 * Sold-out dates stay in the list, greyed, so the member can see the trip
 * runs regularly. The traveller count can never pass the seats left on the
 * chosen date, and the price shown is for the whole party.
 */
export default function DepartureChooser({ trip, dates }) {
  const router = useRouter();
  const firstOpen = dates.find((d) => d.seats > 0);
  const [date, setDate] = useState(firstOpen?.date || null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const chosen = dates.find((d) => d.date === date);
  const left = chosen?.seats || 0;
  const travellers = adults + children;
  const total = travellers * trip.price;

  const pick = (d) => {
    setDate(d.date);
    if (travellers > d.seats) {
      setChildren(0);
      setAdults(Math.min(adults, d.seats));
    }
  };

  const reserve = () => {
    if (!chosen) return;
    router.push(`/group-departures/${trip.id}/book?${new URLSearchParams({
      date, adults: String(adults), children: String(children),
    })}`);
  };

  const summary = (
    <div className="min-w-0 flex-1">
      <p className="text-[12px] text-ink-600">
        {travellers} traveller{travellers === 1 ? '' : 's'}{chosen ? ` · ${shortDate(date)}` : ''}
      </p>
      <p className="text-[20px] font-extrabold text-ink-900">{inr(total)}</p>
    </div>
  );
  const button = (
    <button type="button" onClick={reserve} disabled={!chosen} className="btn-primary shrink-0 rounded-lg px-7 py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-50">
      Reserve Seats
    </button>
  );

  return (
    <>
      <section id="dates" className="card scroll-mt-32 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
          <CalendarDays size={20} className="text-action-500" />
          Select Departure Date
        </h2>

        <div role="radiogroup" aria-label="Departure date" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {dates.map((d) => {
            const on = d.date === date;
            const soldOut = d.seats === 0;
            return (
              <button
                key={d.date}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={soldOut}
                onClick={() => pick(d)}
                className={`rounded-xl border p-3 text-left transition disabled:cursor-not-allowed ${
                  on ? 'border-action-500 bg-brand-50 ring-2 ring-action-500/20' : soldOut ? 'border-surface-line bg-surface-soft opacity-60' : 'border-surface-line bg-white hover:border-action-500'
                }`}
              >
                <span className="block text-[15px] font-bold text-ink-900">{shortDate(d.date)}</span>
                <span className="block text-[12px] text-ink-500">{weekday(d.date)}</span>
                <span className={`mt-1.5 block text-[12px] font-semibold ${soldOut ? 'text-red-600' : d.seats <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                  {soldOut ? 'Sold out' : d.seats <= 5 ? `Only ${d.seats} left` : `${d.seats} seats left`}
                </span>
              </button>
            );
          })}
        </div>

        {chosen ? (
          <div className="mt-5 border-t border-surface-line pt-3">
            <p className="text-[15px] font-semibold text-ink-900">Travellers</p>
            <div className="divide-y divide-surface-line">
              <Stepper label="Adults" value={adults} onChange={setAdults} min={1} max={Math.min(10, left - children)} />
              <Stepper label="Children" note="5 - 11 years · priced as a traveller" value={children} onChange={setChildren} min={0} max={Math.min(10, left - adults)} />
            </div>
            <p className="mt-1 text-[12px] text-ink-500">{inr(trip.price)} per person · {left} seat{left === 1 ? '' : 's'} left on this date</p>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-[13px] font-medium text-red-700">
            Every departure is sold out. Call the desk to join the waiting list.
          </p>
        )}

        {/* Desktop: the price and the button sit under the choice. */}
        <div className="mt-4 hidden items-center gap-4 border-t border-surface-line pt-4 lg:flex">
          {summary}
          {button}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:hidden">
        <div className="flex items-center gap-4 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          {summary}
          {button}
        </div>
      </div>
    </>
  );
}
