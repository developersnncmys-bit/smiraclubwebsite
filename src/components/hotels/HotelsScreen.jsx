'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BedDouble, Calendar, Clock, MapPin, Search, User } from 'lucide-react';
import DatesPicker from '@/components/home/DatesPicker';
import GuestsPicker from '@/components/home/GuestsPicker';
import {
  freeStayIntro, freeStayRecentSearches, hotelModes, hotelRecentSearches, hourlyCheckIns, hourlyIntro,
} from '@/lib/content';
import { clockLong, defaultStay, shortDate } from '@/lib/format';

/** A date as the local calendar day, not the UTC one toISOString gives. */
const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** The white field with a tinted icon tile, as every search field is drawn. */
function Field({ icon: Glyph, className = '', children }) {
  return (
    <div
      className={`relative flex min-w-0 items-center gap-2.5 rounded-xl border border-surface-line bg-white p-2.5 text-left ${className}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50">
        <Glyph size={17} className="text-action-500" />
      </span>
      {children}
    </div>
  );
}

/**
 * Hotels & Resorts.
 *
 * By Night searches a stay of nights. Hourly Stays searches one day and a
 * check-in time; how many hours is chosen on the results, where each length
 * has its own price, so it is not asked for here.
 *
 * The date and time controls are the browser's own, laid invisibly over the
 * field so it reads exactly as drawn while the phone's picker still opens.
 *
 * Free Stay is this same screen without the By Night / Hourly switch — its
 * own banner, its own recent searches, and a search that lands on the free
 * stay results. That is `variant="free-stay"`.
 */
export default function HotelsScreen({ variant = 'hotel' }) {
  const free = variant === 'free-stay';
  const router = useRouter();
  const stay = defaultStay();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [mode, setMode] = useState('night');
  const [destination, setDestination] = useState('');
  const [from, setFrom] = useState(isoDay(stay.from));
  const [to, setTo] = useState(isoDay(stay.to));
  const [day, setDay] = useState(isoDay(today));
  const [checkIn, setCheckIn] = useState('14:00');
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [childAges, setChildAges] = useState([]);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const hourly = !free && mode === 'hourly';
  const intro = free ? freeStayIntro : hourlyIntro;
  const recent = free ? freeStayRecentSearches : hotelRecentSearches;

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
    const shared = {
      destination,
      adults: String(adults),
      rooms: String(rooms),
      children: String(childAges.length),
    };
    const params = hourly
      ? new URLSearchParams({ ...shared, date: day, time: checkIn })
      : new URLSearchParams(free ? { ...shared, from, to } : { kind: 'hotel', mode, ...shared, from, to });
    if (childAges.length) params.set('ages', childAges.join(','));
    const target = hourly ? '/hotels/hourly' : free ? '/free-stay/results' : '/results';
    router.push(`${target}?${params}`);
  };

  const quickDays = [
    { label: 'Today', value: isoDay(today) },
    { label: 'Tomorrow', value: isoDay(tomorrow) },
  ];

  const guestsField = (
    <div className="relative min-w-0">
      <Field icon={User} className="h-full">
        <button
          type="button"
          onClick={() => setGuestsOpen(true)}
          aria-expanded={guestsOpen}
          className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-ink-900 after:absolute after:inset-0"
        >
          {summary}
        </button>
      </Field>
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

  return (
    <div className="pb-10 lg:pb-16">
      <div className="bg-white">
        <div className="shell pt-4 lg:pt-8">
          <h1 className="hidden text-2xl font-bold text-ink-900 lg:block">{free ? 'Free Stay' : 'Hotels & Resorts'}</h1>

          {/* -- By Night / Hourly Stays ------------------------------- */}
          {!free && (
          <div
            role="tablist"
            aria-label="How to book"
            className="grid grid-cols-2 rounded-xl border border-surface-line lg:mt-5 lg:inline-grid lg:w-[26rem]"
          >
            {hotelModes.map((m) => {
              const on = m.key === mode;
              return (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setMode(m.key)}
                  className={`rounded-xl py-3 text-[14px] font-semibold transition ${
                    on
                      ? 'border border-brand-700 bg-brand-50 text-brand-700'
                      : 'border border-transparent text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          )}
        </div>

        {/* -- The hourly introduction, full bleed as drawn ------------- */}
        <div className={`${free ? 'mt-2 lg:mt-5' : 'mt-5'} bg-gradient-to-r from-white via-[#eef3fc] to-[#c9d8f3]`}>
          <div className="shell flex items-center gap-4 py-5">
            <span className="relative shrink-0 text-action-500" aria-hidden="true">
              <BedDouble size={44} strokeWidth={1.6} />
              {!free && (
                <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-white">
                  <Clock size={18} strokeWidth={2} />
                </span>
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[16px] font-bold text-brand-800 lg:text-lg">{intro.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-900 lg:text-[14px]">
                {intro.body}
              </p>
            </div>
          </div>
        </div>

        {/* -- The search ------------------------------------------------ */}
        <form
          onSubmit={submit}
          className="shell space-y-3 py-6 lg:grid lg:grid-cols-12 lg:gap-3 lg:space-y-0 lg:py-8"
        >
          <Field icon={MapPin} className={hourly ? 'lg:col-span-3' : 'lg:col-span-6'}>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search Destination"
              aria-label="Destination"
              className="w-full min-w-0 border-0 p-0 text-[14px] font-medium text-ink-900 outline-none placeholder:text-ink-900"
            />
          </Field>

          {hourly ? (
            <>
              {/* One day, with the two nearest a tap away. */}
              <Field icon={Calendar} className="lg:col-span-3">
                <label className="relative min-w-0 flex-1 cursor-pointer">
                  <span className="block truncate text-[13px] font-medium text-ink-900">
                    {shortDate(day)}
                  </span>
                  <input
                    type="date"
                    value={day}
                    min={isoDay(today)}
                    onChange={(e) => e.target.value && setDay(e.target.value)}
                    aria-label="Date"
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>
                <span className="flex shrink-0 gap-1.5">
                  {quickDays.map((q) => {
                    const on = day === q.value;
                    return (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => setDay(q.value)}
                        aria-pressed={on}
                        className={`rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold transition ${
                          on
                            ? 'border-brand-700 bg-brand-50 text-brand-700'
                            : 'border-surface-line text-ink-500 hover:text-ink-900'
                        }`}
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </span>
              </Field>

              <div className="grid grid-cols-2 gap-3 lg:col-span-4">
                <Field icon={Clock}>
                  <label className="relative min-w-0 flex-1 cursor-pointer">
                    <span className="block truncate text-[13px] font-bold text-ink-900">
                      {clockLong(checkIn)}
                    </span>
                    <select
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      aria-label="Check-in time"
                      className="absolute inset-0 cursor-pointer opacity-0"
                    >
                      {hourlyCheckIns.map((t) => (
                        <option key={t} value={t}>
                          {clockLong(t)}
                        </option>
                      ))}
                    </select>
                  </label>
                </Field>
                {guestsField}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:col-span-4">
              <Field icon={Calendar}>
                <button
                  type="button"
                  onClick={() => setDatesOpen(true)}
                  aria-expanded={datesOpen}
                  className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-ink-900 after:absolute after:inset-0"
                >
                  {shortDate(from)} - {shortDate(to)}
                </button>
              </Field>
              {guestsField}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full gap-2 py-3.5 text-[15px] lg:col-span-2 lg:py-0"
          >
            <Search size={18} />
            Search
          </button>

          <DatesPicker
            open={datesOpen}
            onClose={() => setDatesOpen(false)}
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
          />
        </form>
      </div>

      {/* -- Recent Searches ---------------------------------------------- */}
      <section className="shell pt-7 lg:pt-10">
        <h2 className="section-title">Recent Searches</h2>
        <div className="rail mt-4 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
          {recent.map((s) => (
            <Link
              key={s.id}
              href={`${free ? '/free-stay/results' : '/hotels/hourly'}?destination=${encodeURIComponent(s.place)}`}
              className="w-[10rem] rounded-2xl border border-surface-line bg-white p-3.5 transition hover:border-brand-300 hover:shadow-card lg:w-auto"
            >
              <p className="text-[13px] font-medium text-action-500">{s.kind}</p>
              <p className="mt-0.5 text-[17px] font-bold text-ink-900">{s.place}</p>
              <p className="mt-1.5 text-[12px] font-medium text-ink-500">{s.guests}</p>
              <p className="mt-1 text-[12px] font-medium text-ink-500">{s.dates}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
