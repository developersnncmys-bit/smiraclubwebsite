'use client';

import { useMemo, useState } from 'react';
import HourlyCard from '@/components/hotels/HourlyCard';
import ResultsHeader from '@/components/results/ResultsHeader';
import { hourlyDurations, ratingFloors } from '@/lib/content';
import { clock, shortDate, slotRange } from '@/lib/format';

/** The cheapest length a hotel sells, for sorting by price. */
const cheapest = (h) =>
  Math.min(...Object.values(h.slots).filter(Boolean).map((s) => s.price));

/**
 * Hourly stay results.
 *
 * Select Duration is a filter: picking 6 Hours keeps the hotels that sell six
 * hours and lights that price on every card, so the list answers the
 * question actually being asked. Tapping it again shows every length.
 */
export default function HourlyResults({ search, hotels }) {
  const [sort, setSort] = useState('recommended');
  const [floor, setFloor] = useState('any');
  const [popular, setPopular] = useState(false);
  const [hours, setHours] = useState(null);

  const minRating = ratingFloors.find((f) => f.key === floor).min;

  const shown = useMemo(() => {
    let list = hotels.filter((h) => h.rating >= minRating);
    if (hours) list = list.filter((h) => h.slots[hours]);

    list = [...list];
    if (popular) return list.sort((a, b) => b.reviews - a.reviews);
    const price = (h) => (hours ? h.slots[hours].price : cheapest(h));
    if (sort === 'price-low') return list.sort((a, b) => price(a) - price(b));
    if (sort === 'price-high') return list.sort((a, b) => price(b) - price(a));
    if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [hotels, minRating, hours, popular, sort]);

  const guests = search.adults + search.children;
  const summary = `${shortDate(search.date)}, ${clock(search.time)}, ${search.rooms} Room${
    search.rooms === 1 ? '' : 's'
  }, ${guests} Guest${guests === 1 ? '' : 's'}`;

  /** What a card carries forward to the hotel page. */
  const carry = (length) =>
    new URLSearchParams({
      date: search.date,
      time: search.time,
      adults: String(search.adults),
      rooms: String(search.rooms),
      children: String(search.children),
      ...(length ? { hours: String(length) } : {}),
    }).toString();

  return (
    <>
      <ResultsHeader
        where={search.destination}
        summary={summary}
        backHref="/hotels"
        sort={sort}
        onSort={setSort}
        floor={floor}
        onFloor={setFloor}
        popular={popular}
        onPopular={setPopular}
      />

      <div className="shell pb-10 pt-4 lg:pb-16 lg:pt-6">
        {/* -- Select Duration ------------------------------------------- */}
        <div
          role="group"
          aria-label="Select duration"
          className="grid grid-cols-4 gap-1.5 rounded-xl bg-[#173a5e] p-1.5 lg:max-w-3xl"
        >
          <p className="flex items-center rounded-lg px-2 text-[13px] font-semibold leading-tight text-white lg:text-[14px]">
            Select Duration
          </p>
          {hourlyDurations.map((h) => {
            const on = hours === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHours(on ? null : h)}
                aria-pressed={on}
                className={`rounded-lg px-2 py-2 text-left transition ${
                  on ? 'bg-white text-brand-800' : 'bg-[#23578a] text-white hover:bg-[#2b659e]'
                }`}
              >
                <span className="block text-[13px] font-semibold lg:text-[14px]">{h} Hours</span>
                <span className="block text-[11px] opacity-90 lg:text-[12px]">{slotRange(search.time, h)}</span>
              </button>
            );
          })}
        </div>

        <h1 className="mt-6 text-[17px] font-bold text-ink-900 lg:text-2xl">
          Showing Results in <span className="text-action-500">{search.destination}</span>
        </h1>

        {shown.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">
            No hourly stays match that yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-5 lg:grid-cols-2 lg:gap-6">
            {shown.map((hotel) => (
              <HourlyCard key={hotel.id} hotel={hotel} chosen={hours} carry={carry} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
