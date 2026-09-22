'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Calendar, User } from 'lucide-react';
import DatesPicker from '@/components/home/DatesPicker';
import GuestsPicker from '@/components/home/GuestsPicker';
import { shortDate } from '@/lib/format';

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * The dates and guests on a stay's page — the two buttons under Check in /
 * Check out, which open the same pickers as the home search.
 *
 * What is chosen goes into the page's address, so the page redraws with it:
 * the bottom bar quotes the new dates, the guests line under Overview reads
 * the new party, and Book Room carries both on to Review Booking.
 */
export default function StayChooser({ from: initialFrom, to: initialTo, adults: initialAdults, rooms: initialRooms, childAges: initialAges = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [adults, setAdults] = useState(initialAdults);
  const [rooms, setRooms] = useState(initialRooms);
  const [childAges, setChildAges] = useState(initialAges);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  /** Write the choice into the address; the page reads it from there. */
  const commit = (next) => {
    const q = new URLSearchParams(search.toString());
    const v = { from, to, adults, rooms, childAges, ...next };
    q.set('from', v.from);
    q.set('to', v.to);
    q.set('adults', String(v.adults));
    q.set('rooms', String(v.rooms));
    q.set('children', String(v.childAges.length));
    if (v.childAges.length) q.set('ages', v.childAges.join(','));
    else q.delete('ages');
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  const who = [
    plural(adults, 'Adult'),
    childAges.length ? plural(childAges.length, 'Child', 'Children') : null,
  ].filter(Boolean).join(', ');

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setDatesOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500 transition hover:bg-brand-50"
        >
          <Calendar size={17} className="shrink-0" />
          {shortDate(from)} - {shortDate(to)}
        </button>
        <button
          type="button"
          onClick={() => setGuestsOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500 transition hover:bg-brand-50"
        >
          <User size={17} className="shrink-0" />
          {who}/ {plural(rooms, 'Room')}
        </button>
      </div>

      <DatesPicker
        open={datesOpen}
        onClose={() => {
          setDatesOpen(false);
          commit({});
        }}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />
      <GuestsPicker
        open={guestsOpen}
        onClose={() => {
          setGuestsOpen(false);
          commit({});
        }}
        rooms={rooms}
        setRooms={setRooms}
        adults={adults}
        setAdults={setAdults}
        childAges={childAges}
        setChildAges={setChildAges}
      />
    </>
  );
}
