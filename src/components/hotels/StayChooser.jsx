'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays, ChevronRight, Pencil, User } from 'lucide-react';
import DatesPicker from '@/components/home/DatesPicker';
import GuestsPicker from '@/components/home/GuestsPicker';
import { nightsBetween, shortDate } from '@/lib/format';

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * Writes a choice into the page's address and lets the page redraw with it,
 * so the bottom bar, the guests card and Book Room all read the same stay.
 * Only the fields passed are changed; the rest of the address is kept.
 */
function useCommit() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  return (fields) => {
    const q = new URLSearchParams(search.toString());
    Object.entries(fields).forEach(([k, v]) => {
      if (v === undefined || v === '') q.delete(k);
      else q.set(k, String(v));
    });
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };
}

/**
 * The stay's dates, as a line in the Book Room bar: tap it to change the
 * check-in and check-out.
 */
export function StayDates({ from: initialFrom, to: initialTo }) {
  const commit = useCommit();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [open, setOpen] = useState(false);
  const nights = Math.max(1, nightsBetween(from, to));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 border-b border-surface-line bg-brand-50 px-4 py-2.5 text-left text-[13px] font-semibold text-brand-700 transition hover:bg-brand-100 sm:px-6"
      >
        <CalendarDays size={16} className="shrink-0" />
        <span className="min-w-0 flex-1 truncate">
          Check-in {shortDate(from)} · Check-out {shortDate(to)} · {plural(nights, 'Night')}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-action-500">
          Change <ChevronRight size={15} />
        </span>
      </button>

      <DatesPicker
        open={open}
        onClose={() => {
          setOpen(false);
          commit({ from, to });
        }}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />
    </>
  );
}

/**
 * Who is staying, as the card under Overview: tap it to change the rooms,
 * adults and children (with their ages).
 */
export function StayGuests({ adults: initialAdults, rooms: initialRooms, childAges: initialAges = [], checkIn, checkOut }) {
  const commit = useCommit();
  const [adults, setAdults] = useState(initialAdults);
  const [rooms, setRooms] = useState(initialRooms);
  const [childAges, setChildAges] = useState(initialAges);
  const [open, setOpen] = useState(false);

  const who = [
    plural(adults, 'Adult'),
    childAges.length ? plural(childAges.length, 'Child', 'Children') : null,
  ].filter(Boolean).join(', ');

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-ink-900">Guests &amp; Rooms</h2>
        {checkIn && checkOut && (
          <span className="text-[12px] font-medium text-ink-500">Check in {checkIn} · Check out {checkOut}</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center gap-3 rounded-xl border border-action-500 px-4 py-3.5 text-left transition hover:bg-brand-50"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50">
          <User size={19} className="text-action-500" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-ink-900">{who}</span>
          <span className="block text-[13px] text-ink-500">{plural(rooms, 'Room')}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-action-500">
          <Pencil size={14} /> Change
        </span>
      </button>

      {childAges.length > 0 && (
        <p className="mt-2 text-[13px] text-ink-500">
          Children&rsquo;s ages: {childAges.map((a) => (a === 0 ? 'under 1' : `${a} yrs`)).join(', ')}
        </p>
      )}

      <GuestsPicker
        open={open}
        onClose={() => {
          setOpen(false);
          commit({
            adults,
            rooms,
            children: childAges.length,
            ages: childAges.length ? childAges.join(',') : '',
          });
        }}
        rooms={rooms}
        setRooms={setRooms}
        adults={adults}
        setAdults={setAdults}
        childAges={childAges}
        setChildAges={setChildAges}
      />
    </section>
  );
}
