'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Search, User, X } from 'lucide-react';
import DatesPicker from '@/components/home/DatesPicker';
import GuestsPicker from '@/components/home/GuestsPicker';
import { useHeaderSearch, useSearchOpen, setSearchOpen } from '@/lib/headerSearch';
import { searchHref } from '@/lib/searchRoute';
import { shortDate } from '@/lib/format';

/**
 * The search, where the member already is.
 *
 * Tapping the icon used to scroll the page back to the panel, which
 * means the answer to "I want to search" was "go back up there" — on a
 * phone, half a screen of travel before you can type. The box opens
 * under the header instead, at the top, where the tap happened.
 *
 * Everything is in the one box: where, when and how many, with the
 * search itself on the end of the first line. A full-width button
 * underneath made the box taller than the thing it was asking for.
 */

/** The icon in the header rows. Both tap the same box open. */
export default function HeaderSearch({ desktop = false }) {
  const search = useHeaderSearch();
  const open = useSearchOpen();

  if (!search) return null;

  return (
    <button
      type="button"
      onClick={() => setSearchOpen(!open)}
      aria-label="Search"
      aria-expanded={open}
      className={
        desktop
          ? 'grid h-10 w-10 place-items-center rounded-full border border-surface-line text-ink-600 transition hover:bg-surface-soft'
          : 'p-2 text-ink-700'
      }
    >
      {open ? <X size={desktop ? 18 : 21} /> : <Search size={desktop ? 18 : 21} />}
    </button>
  );
}

/**
 * The box itself, drawn once under the header.
 *
 * It starts on whatever the page's panel holds, so opening it after
 * setting dates downstairs does not quietly throw them away.
 */
export function HeaderSearchBox() {
  const router = useRouter();
  const search = useHeaderSearch();
  const open = useSearchOpen();
  const box = useRef(null);

  const [destination, setDestination] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [childAges, setChildAges] = useState([]);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  /** Opening takes a copy of the panel's values; closing leaves them be. */
  useEffect(() => {
    if (!open || !search) return;
    setDestination(search.destination || '');
    setFrom(search.from);
    setTo(search.to);
    setAdults(search.adults ?? 2);
    setRooms(search.rooms ?? 1);
    setChildAges(search.childAges || []);
    // Only when it opens: re-copying on every keystroke would fight the typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** Escape, and a tap anywhere else, put it away. */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setSearchOpen(false);
    const onDown = (e) => {
      // Not when the tap was the icon itself, or inside a picker sheet.
      if (box.current?.contains(e.target)) return;
      if (e.target.closest?.('header') || e.target.closest?.('[role="dialog"]')) return;
      setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  if (!search || !open) return null;

  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const guests = [
    plural(adults, 'Adult'),
    childAges.length ? plural(childAges.length, 'Child').replace('Childs', 'Children') : null,
  ]
    .filter(Boolean)
    .join(', ')
    .concat(`/ ${plural(rooms, 'Room')}`);

  const go = () => {
    const href = searchHref({ kind: search.kind, destination, from, to, adults, rooms, childAges });
    // Nothing typed is not a search; the cursor stays where the typing goes.
    if (!href) {
      box.current?.querySelector('input')?.focus();
      return;
    }
    setSearchOpen(false);
    router.push(href);
  };

  return (
    <div className="absolute inset-x-0 top-full border-b border-surface-line bg-white shadow-lift">
      <div ref={box} className="shell px-3 py-3 lg:px-5 lg:py-4">
        <div className="overflow-hidden rounded-xl border border-surface-line bg-white">
          {/* -- Where to, and the search itself ----------------------- */}
          <div className="flex items-center gap-2 border-b border-surface-line p-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50">
              <MapPin size={17} className="text-action-500" />
            </span>
            <input
              /* eslint-disable-next-line jsx-a11y/no-autofocus */
              autoFocus
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && go()}
              placeholder="Where are you going?"
              aria-label="Destination"
              className="min-w-0 flex-1 border-0 p-0 text-[15px] font-bold text-ink-900 outline-none placeholder:text-ink-500"
            />
            <button
              type="button"
              onClick={go}
              aria-label="Search"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-action-500 text-white transition hover:bg-action-600 active:scale-95"
            >
              <Search size={17} />
            </button>
          </div>

          {/* -- When, and how many ------------------------------------ */}
          <div className="grid grid-cols-[1fr_1.2fr] divide-x divide-surface-line">
            <button
              type="button"
              onClick={() => setDatesOpen(true)}
              aria-expanded={datesOpen}
              className="flex items-center gap-1.5 p-2.5 text-left"
            >
              <Calendar size={15} className="shrink-0 text-action-500" />
              <span className="min-w-0 truncate text-[12px] font-semibold text-ink-900 lg:text-[13px]">
                {shortDate(from)} - {shortDate(to)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGuestsOpen(true)}
              aria-expanded={guestsOpen}
              className="flex items-center gap-1.5 p-2.5 text-left"
            >
              <User size={15} className="shrink-0 text-action-500" />
              <span className="min-w-0 truncate text-[12px] font-semibold text-ink-900 lg:text-[13px]">
                {guests}
              </span>
            </button>
          </div>
        </div>
      </div>

      <DatesPicker
        open={datesOpen}
        onClose={() => setDatesOpen(false)}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
      />
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
    </div>
  );
}
