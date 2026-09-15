'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import GuestsPicker from '@/components/home/GuestsPicker';
import { hourlyCheckIns, hourlyDurations } from '@/lib/content';
import { clock, inr, shortDate, slotRange, weekday } from '@/lib/format';

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Choose Preferred Slot, and the bar that books it.
 *
 * The length, the day, the time and the guests are one choice, so they live
 * together here and the Book Room link is built from all four. The length
 * arrives already set when a price tile on the results was tapped.
 *
 * On a phone the bar is pinned to the bottom as drawn. On a desktop this whole
 * card sits in a sticky rail beside the page, so the price and the button sit
 * under the choice they belong to instead of floating over the page.
 */
export default function HourlySlotPicker({ hotel, initial }) {
  const firstOpen = hourlyDurations.find((h) => hotel.slots[h]);
  const [hours, setHours] = useState(hotel.slots[initial.hours] ? initial.hours : firstOpen);
  const [date, setDate] = useState(initial.date);
  const [time, setTime] = useState(initial.time);
  const [adults, setAdults] = useState(initial.adults);
  const [rooms, setRooms] = useState(initial.rooms);
  const [childAges, setChildAges] = useState(Array(initial.children).fill(3));
  const [guestsOpen, setGuestsOpen] = useState(false);

  const slot = hotel.slots[hours];
  const range = `${slotRange(time, hours)} (${hours} Hours)`;

  const book = `/hotels/hourly/${hotel.id}/book?${new URLSearchParams({
    date,
    time,
    hours: String(hours),
    adults: String(adults),
    rooms: String(rooms),
    children: String(childAges.length),
  })}`;

  const pill =
    'relative flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500';

  return (
    <>
      <section className="card p-4 sm:p-5">
        <h2 className="text-[16px] font-bold text-ink-900">Choose Preferred Slot</h2>
        <p className="mt-0.5 text-[13px] text-ink-600">
          Per Night <span className="line-through">{inr(hotel.night)}</span>
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          {hourlyDurations.map((h) => {
            const s = hotel.slots[h];
            const on = h === hours;
            return (
              <button
                key={h}
                type="button"
                disabled={!s}
                onClick={() => setHours(h)}
                aria-pressed={on}
                className={`rounded-xl border px-1 py-2.5 text-center transition disabled:cursor-not-allowed ${
                  on ? 'border-brand-700 bg-brand-50' : 'border-surface-line bg-white enabled:hover:border-brand-300'
                }`}
              >
                <span className={`block text-[15px] font-bold ${s ? 'text-ink-900' : 'text-ink-400'}`}>
                  {s ? inr(s.price) : 'Not Available'}
                </span>
                <span className={`block text-[12px] ${s ? 'text-ink-700' : 'text-ink-400'}`}>For {h} Hours</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <label className={`${pill} cursor-pointer`}>
            <Calendar size={16} className="shrink-0" />
            {shortDate(date)}, {weekday(date)}
            <input
              type="date"
              value={date}
              min={isoDay(new Date())}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              aria-label="Date"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          <label className={`${pill} cursor-pointer`}>
            <Clock size={16} className="shrink-0" />
            {clock(time)}
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Check-in time"
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {hourlyCheckIns.map((t) => (
                <option key={t} value={t}>
                  {clock(t)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setGuestsOpen(true)} className={`${pill} col-span-2`}>
            <User size={16} className="shrink-0" />
            {adults} Adult{adults === 1 ? '' : 's'}/ {rooms} Room{rooms === 1 ? '' : 's'}
          </button>
        </div>

        <p className="mt-3 text-center text-[12px] font-medium text-ink-900">
          Guests can access all property facilities
        </p>

        {/* -- Desktop: the booking sits under the choice ------------------ */}
        <div className="mt-5 hidden border-t border-surface-line pt-5 lg:block">
          <p className="text-xl font-extrabold text-ink-900">{inr(slot.price)}</p>
          <p className="text-[13px] text-ink-600">{range}</p>
          <p className="text-[13px] text-ink-500">+{inr(slot.taxes)} taxes &amp; fees</p>
          <Link href={book} className="btn-primary mt-4 w-full rounded-lg py-3.5 text-[14px] uppercase tracking-wide">
            Book Room
          </Link>
        </div>
      </section>

      <GuestsPicker
        open={guestsOpen}
        onClose={() => setGuestsOpen(false)}
        rooms={rooms}
        setRooms={setRooms}
        adults={adults}
        setAdults={setAdults}
        childAges={childAges}
        setChildAges={setChildAges}
      />

      {/* -- Phone: pinned bar ------------------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:hidden">
        <div
          className="flex items-center gap-4 px-4 py-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xl font-extrabold text-ink-900">{inr(slot.price)}</p>
            <p className="truncate text-[12px] text-ink-600">{range}</p>
            <p className="text-[12px] text-ink-500">+{inr(slot.taxes)} taxes &amp; fees</p>
          </div>
          <Link
            href={book}
            className="btn-primary shrink-0 rounded-lg px-7 py-3.5 text-[14px] uppercase tracking-wide"
          >
            Book Room
          </Link>
        </div>
      </div>
    </>
  );
}
