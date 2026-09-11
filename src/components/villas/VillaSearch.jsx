'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Crown, MapPin, Search, User } from 'lucide-react';
import GuestsPicker from '@/components/home/GuestsPicker';
import { villaMemberOffer } from '@/lib/content';
import { defaultStay } from '@/lib/format';

/**
 * The villa search card, with the member offer sitting inside it as drawn.
 *
 * On a phone it lifts over the bottom of the banner exactly as the design
 * has it; on a desktop the three fields and the button share one line, which
 * is what anyone booking on a laptop expects.
 */
export default function VillaSearch() {
  const router = useRouter();
  const stay = defaultStay();

  const [destination, setDestination] = useState('');
  const [from, setFrom] = useState(stay.from.toISOString().slice(0, 10));
  const [to, setTo] = useState(stay.to.toISOString().slice(0, 10));
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [childAges, setChildAges] = useState([]);
  const [guestsOpen, setGuestsOpen] = useState(false);

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
      destination,
      from,
      to,
      adults: String(adults),
      rooms: String(rooms),
      children: String(childAges.length),
    });
    if (childAges.length) params.set('ages', childAges.join(','));
    router.push(`/villas/search?${params.toString()}`);
  };

  return (
    <div className="relative z-10 -mt-5 lg:-mt-16">
      <div className="shell">
        <div className="rounded-2xl bg-white p-4 shadow-card sm:p-5 lg:p-7">
          {/* -- What the membership is worth here ---------------------- */}
          <div className="flex items-center gap-3.5 rounded-xl bg-gradient-to-r from-[#eef1fe] to-[#dfe7fd] p-4 lg:p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1b2a5b]">
              <Crown size={20} className="text-gold" fill="currentColor" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-ink-700 lg:text-[14px]">{villaMemberOffer.kicker}</p>
              <p className="text-[14px] font-bold text-ink-900 lg:text-lg">
                {villaMemberOffer.headline}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-500 lg:text-sm">{villaMemberOffer.note}</p>
            </div>
          </div>

          {/* -- The search itself -------------------------------------- */}
          <form
            onSubmit={submit}
            className="mt-4 space-y-3 lg:mt-5 lg:flex lg:items-stretch lg:gap-3 lg:space-y-0"
          >
            <label className="flex items-center gap-3 rounded-xl border border-surface-line bg-white p-3.5 lg:min-w-0 lg:flex-1">
              <MapPin size={20} className="shrink-0 text-action-500" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search Destination or Villas"
                aria-label="Destination or villa"
                className="w-full min-w-0 border-0 p-0 text-[14px] font-medium text-ink-900 outline-none placeholder:text-ink-500"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 lg:flex lg:shrink-0 lg:gap-3">
              <label className="flex items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3.5 lg:w-[13.5rem]">
                <Calendar size={19} className="shrink-0 text-action-500" />
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  aria-label="Check in"
                  className="w-full min-w-0 border-0 bg-transparent p-0 text-[13px] font-semibold text-ink-900 outline-none lg:text-sm"
                />
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setGuestsOpen((o) => !o)}
                  aria-expanded={guestsOpen}
                  className="flex h-full w-full items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3.5 text-left lg:w-[13rem]"
                >
                  <User size={19} className="shrink-0 text-action-500" />
                  <span className="block truncate text-[13px] font-semibold text-ink-900 lg:text-sm">
                    {summary}
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

            <button
              type="submit"
              className="btn-primary w-full gap-2.5 py-4 text-base lg:w-auto lg:shrink-0 lg:px-8"
            >
              <Search size={19} />
              Search Villas
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
