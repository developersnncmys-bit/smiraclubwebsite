'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Plane } from 'lucide-react';
import { travelYears } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { nightsBetween } from '@/lib/format';

const monthOf = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

const dayOf = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

/** The years we have anything for, oldest first. */
const YEARS = Object.keys(travelYears).map(Number).sort((a, b) => a - b);

/**
 * My Travel Year.
 *
 * Trips are grouped under the month they start in and hung off one line, so
 * a year reads as a sequence rather than a list. Nights come from the dates
 * rather than being stored, so the two can never say different things.
 */
export default function TravelYear({ art = {} }) {
  const [year, setYear] = useState(YEARS.includes(2026) ? 2026 : YEARS[YEARS.length - 1]);

  const trips = travelYears[year] || [];
  const at = YEARS.indexOf(year);

  /** Month heading → the trips that start in it, in order. */
  const months = trips.reduce((groups, trip) => {
    const key = monthOf(trip.start);
    (groups[key] ||= []).push(trip);
    return groups;
  }, {});

  return (
    <div className="pb-10">
      {/* -- Which year ------------------------------------------- */}
      <div className="border-b border-surface-line bg-white">
        <div className="shell flex items-center justify-center gap-6 py-3">
          <button
            type="button"
            onClick={() => setYear(YEARS[at - 1])}
            disabled={at <= 0}
            aria-label="Previous year"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-surface-soft disabled:opacity-30"
          >
            <ChevronLeft size={22} />
          </button>

          <p className="text-2xl font-bold text-ink-900">{year}</p>

          <button
            type="button"
            onClick={() => setYear(YEARS[at + 1])}
            disabled={at >= YEARS.length - 1}
            aria-label="Next year"
            className="grid h-9 w-9 place-items-center rounded-full text-ink-700 transition hover:bg-surface-soft disabled:opacity-30"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <div className="shell py-6 lg:mx-auto lg:max-w-2xl">
        {trips.length === 0 ? (
          <p className="card p-10 text-center text-[15px] text-ink-500">
            Nothing booked in {year} yet.
          </p>
        ) : (
          Object.entries(months).map(([month, list]) => (
            <section key={month} className="pb-2">
              <h2 className="text-xl font-bold text-ink-900">{month}</h2>

              <ol className="mt-4">
                {list.map((trip) => {
                  const nights = nightsBetween(trip.start, trip.end);
                  return (
                    <li key={trip.id} className="relative flex gap-4 pb-8 last:pb-2">
                      {/* The line the trips hang off */}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[9px] top-8 w-px bg-surface-line"
                      />
                      <Plane size={19} className="relative mt-1 shrink-0 text-ink-700" />

                      <article className="card flex min-w-0 flex-1 gap-4 p-3">
                        <span className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl sm:h-[118px] sm:w-[124px]">
                          <Image
                            src={toSrc(art[trip.id] || trip.image)}
                            alt=""
                            fill
                            sizes="124px"
                            className="object-cover"
                          />
                        </span>

                        <div className="min-w-0 flex-1 py-1">
                          <h3 className="text-xl font-bold leading-tight text-ink-900">
                            {trip.title}
                          </h3>

                          <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-ink-600">
                            {trip.origin}
                            <ArrowRight size={15} className="shrink-0 text-ink-400" />
                            {trip.destination}
                          </p>

                          <p className="mt-1 flex flex-wrap items-center gap-2 text-[15px] text-ink-600">
                            {dayOf(trip.start)}
                            <ArrowRight size={15} className="shrink-0 text-ink-400" />
                            {new Date(trip.end).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>

                          <p className="mt-1 text-[15px] text-ink-600">
                            {nights + 1} Days/{nights} Nights
                          </p>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
