'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, User, Search } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import GuestsPicker from '@/components/home/GuestsPicker';
import { searchTabs } from '@/lib/content';
import { defaultStay, shortDate } from '@/lib/format';

/**
 * The four tabs and the search form. Stacked on a phone exactly as drawn; on
 * a desktop the three fields and the button sit on one line, which is what
 * anyone booking on a laptop expects.
 *
 * The tabs are links, not a filter: each opens that category's own screen,
 * the way the prototype moves between them. `active` is which of the four is
 * lit and the kind a search is submitted under, so a category page can render
 * this same panel with its own tab already chosen.
 */
export default function SearchPanel({ active = searchTabs[0].key, art = {} }) {
  const router = useRouter();
  const stay = defaultStay();

  const [destination, setDestination] = useState('');
  const [from, setFrom] = useState(stay.from.toISOString().slice(0, 10));
  const [to, setTo] = useState(stay.to.toISOString().slice(0, 10));
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  /** One entry per child, holding that child's age — the design asks for both. */
  const [childAges, setChildAges] = useState([]);
  const [guestsOpen, setGuestsOpen] = useState(false);

  /** 'Adults/ Room' when nobody brings a child, and says so when they do. */
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const summary = [
    plural(adults, 'Adult'),
    childAges.length ? plural(childAges.length, 'Child').replace('Childs', 'Children') : null,
  ]
    .filter(Boolean)
    .join(', ')
    .concat(`/ ${plural(rooms, 'Room')}`);

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      kind: active,
      destination,
      from,
      to,
      adults: String(adults),
      rooms: String(rooms),
      children: String(childAges.length),
    });
    // A hotel prices a nine-year-old differently from a two-year-old, so the
    // ages travel with the search rather than just the count.
    if (childAges.length) params.set('ages', childAges.join(','));
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="shell">
      <div className="lg:card lg:relative lg:z-10 lg:-mt-20 lg:p-7">
        {/* -- The four tabs -------------------------------------------- */}
        <nav
          aria-label="What are you looking for"
          className="grid grid-cols-4 overflow-hidden rounded-2xl bg-surface-soft lg:inline-flex lg:gap-1 lg:rounded-xl lg:bg-transparent lg:p-0"
        >
          {searchTabs.map((t) => {
            const on = t.key === active;
            return (
              <Link
                key={t.key}
                href={t.href}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 text-[12px] font-semibold transition lg:flex-row lg:gap-2 lg:rounded-lg lg:px-4 lg:py-2.5 lg:text-sm ${
                  on
                    ? 'bg-white text-ink-900 shadow-card lg:bg-brand-50 lg:text-brand-700 lg:shadow-none'
                    : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                {art[t.key] ? (
                  <Image
                    src={art[t.key]}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 object-contain"
                  />
                ) : (
                  <Icon
                    name={t.icon}
                    size={22}
                    className={on ? 'text-brand-600' : 'text-ink-500'}
                    strokeWidth={1.7}
                  />
                )}
                {t.label}
              </Link>
            );
          })}
        </nav>

        {/* -- The form -------------------------------------------------- */}
        <form onSubmit={submit} className="mt-4 space-y-3 lg:mt-5 lg:flex lg:items-end lg:gap-3 lg:space-y-0">
          <label className="block rounded-xl border border-surface-line bg-white p-3.5 lg:flex-1 lg:p-0 lg:border-0">
            <span className="flex items-center gap-3 lg:rounded-xl lg:border lg:border-surface-line lg:p-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-soft">
                <MapPin size={18} className="text-brand-600" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Destination
                </span>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where are you going?"
                  className="w-full border-0 p-0 text-[15px] font-medium text-ink-900 outline-none placeholder:text-ink-400"
                />
              </span>
            </span>
          </label>

          <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-3">
            <label className="flex items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3.5 lg:w-[15rem]">
              <Calendar size={18} className="shrink-0 text-brand-600" />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-400">
                  Dates
                </span>
                <span className="flex items-center gap-1 text-[13px] font-semibold text-ink-900 lg:text-sm">
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full border-0 bg-transparent p-0 text-[13px] font-semibold outline-none lg:text-sm"
                    aria-label="Check in"
                  />
                </span>
              </span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setGuestsOpen((o) => !o)}
                className="flex w-full items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3.5 text-left lg:w-[13rem]"
                aria-expanded={guestsOpen}
              >
                <User size={18} className="shrink-0 text-brand-600" />
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-ink-400">
                    Guests
                  </span>
                  <span className="block truncate text-[13px] font-semibold text-ink-900 lg:text-sm">
                    {summary}
                  </span>
                </span>
              </button>

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
          </div>

          <button type="submit" className="btn-primary w-full gap-2.5 py-4 text-base lg:w-auto lg:px-8 lg:py-[1.15rem]">
            <Search size={18} />
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
