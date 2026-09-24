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
 * The stay, as the line above Book Room: the dates on one side and who is
 * going on the other, each opening its own picker. Both halves are here
 * because the button underneath books both, and a bar that names only the
 * dates leaves the party to be taken on trust.
 */
export function StayDates({
  from: initialFrom,
  to: initialTo,
  adults: initialAdults,
  rooms: initialRooms,
  childAges: initialAges = [],
  stack = false,
}) {
  const commit = useCommit();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [adults, setAdults] = useState(initialAdults ?? 2);
  const [rooms, setRooms] = useState(initialRooms ?? 1);
  const [childAges, setChildAges] = useState(initialAges);
  const [open, setOpen] = useState('');
  const nights = Math.max(1, nightsBetween(from, to));
  const guests = initialAdults !== undefined;

  const who = [
    plural(adults, 'Adult'),
    childAges.length ? plural(childAges.length, 'Child', 'Children') : null,
  ].filter(Boolean).join(', ');

  // Two short lines rather than one long one: at a phone's width a single
  // line of either half is cut off halfway through, which tells nobody
  // anything.
  const half =
    'flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left transition hover:bg-brand-100 sm:px-5';

  return (
    <>
      {/* Side by side across a phone's bar; one above the other in the
          desktop card, which is too narrow to hold both across. */}
      <div className={`flex border-b border-surface-line bg-brand-50 ${stack ? 'flex-col' : 'items-stretch'}`}>
        <button type="button" onClick={() => setOpen('dates')} className={half}>
          <CalendarDays size={16} className="shrink-0 text-brand-700" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold leading-tight text-brand-700">
              {shortDate(from)} – {shortDate(to)}
            </span>
            <span className="block truncate text-[11px] leading-tight text-brand-700/70">
              {plural(nights, 'Night')}
            </span>
          </span>
          <ChevronRight size={15} className="shrink-0 text-action-500" />
        </button>

        {guests && (
          <>
            <span
              aria-hidden
              className={stack ? 'mx-3 h-px bg-brand-700/15' : 'my-2 w-px shrink-0 bg-brand-700/15'}
            />
            <button type="button" onClick={() => setOpen('guests')} className={half}>
              <User size={16} className="shrink-0 text-brand-700" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold leading-tight text-brand-700">
                  {who}
                </span>
                <span className="block truncate text-[11px] leading-tight text-brand-700/70">
                  {plural(rooms, 'Room')}
                </span>
              </span>
              <ChevronRight size={15} className="shrink-0 text-action-500" />
            </button>
          </>
        )}
      </div>

      <DatesPicker
        open={open === 'dates'}
        onClose={() => {
          setOpen('');
          commit({ from, to });
        }}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />

      {guests && (
        <GuestsPicker
          open={open === 'guests'}
          onClose={() => {
            setOpen('');
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
      )}
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
