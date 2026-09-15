'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Images, Leaf, Utensils } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { freeStayFood, mealPreferences } from '@/lib/content';
import { inr } from '@/lib/format';

/** The square food mark: a dot in a box, green for veg and red for non-veg. */
function FoodMark({ kind }) {
  if (kind === 'jain') return <Leaf size={16} className="text-green-600" />;
  const tone = kind === 'veg' ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600';
  return (
    <span className={`grid h-4 w-4 place-items-center rounded-[3px] border-2 ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

function Stepper({ value, min, onChange, label }) {
  return (
    <span className="flex shrink-0 items-center rounded-lg border border-brand-200">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`One fewer ${label}`}
        className="grid h-9 w-9 place-items-center text-[17px] font-semibold text-action-500 disabled:text-ink-400/50"
      >
        -
      </button>
      <span aria-live="polite" className="w-6 text-center text-[15px] font-bold text-ink-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        aria-label={`One more ${label}`}
        className="grid h-9 w-9 place-items-center text-[17px] font-semibold text-action-500"
      >
        +
      </button>
    </span>
  );
}

/**
 * The part of a free stay that is actually a choice: which room, who is
 * eating, and what they eat.
 *
 * The room costs nothing, so the only number on the screen is the food, and
 * it moves as the counts do. `head` is the server-rendered top of the page —
 * name, benefits, dates — passed in so it shares the left column with these
 * cards while the booking sits in a sticky rail beside them on a desktop.
 */
export default function FreeStayPicker({ head, groups, nights, adults: startAdults, children: startChildren, bookBase, carry }) {
  const [room, setRoom] = useState(groups[0].id);
  const [adults, setAdults] = useState(startAdults);
  const [kids, setKids] = useState(startChildren);
  const [meal, setMeal] = useState(mealPreferences[0].key);

  const food = (adults * freeStayFood.adult.price + kids * freeStayFood.child.price) * nights;
  const chosen = groups.find((g) => g.id === room);
  const book = `${bookBase}?${carry}&${new URLSearchParams({
    room, fa: String(adults), fc: String(kids), meal,
  })}`;
  const nightsLabel = `${nights} Night${nights === 1 ? '' : 's'}`;

  const foodRows = [
    { ...freeStayFood.adult, value: adults, set: setAdults, min: 1, name: 'adult' },
    { ...freeStayFood.child, value: kids, set: setKids, min: 0, name: 'child' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 space-y-4 lg:col-span-8">
          {head}

          {/* -- Select Room ---------------------------------------------- */}
          <section>
            <h2 className="text-lg font-bold text-ink-900">Select Room</h2>
            <div className="mt-3 space-y-4">
              {groups.map((g) => {
                const on = g.id === room;
                return (
                  <div
                    key={g.id}
                    className={`card overflow-hidden border-2 ${on ? 'border-action-500' : 'border-transparent'}`}
                  >
                    <p className="px-4 pt-4 text-[15px] font-semibold text-ink-700 sm:px-5">{g.label}</p>
                    <div className="flex gap-4 p-4 sm:p-5">
                      <span className="relative h-[104px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:h-[120px] sm:w-[150px]">
                        <Image src={g.room.image} alt="" fill sizes="150px" className="object-cover" />
                        <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                          <Images size={12} />
                          {g.room.photos}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[16px] font-bold text-ink-900">{g.room.name}</h3>
                        <ul className="mt-2 space-y-1.5">
                          {[
                            ['Users', g.room.guests],
                            ['Scan', g.room.size],
                            ['BedDouble', g.room.bed],
                            ['Trees', g.room.view],
                          ].map(([icon, text]) => (
                            <li key={text} className="flex items-center gap-2 text-[13px] text-ink-700">
                              <Icon name={icon} size={15} className="shrink-0 text-ink-500" />
                              {text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-surface-line px-4 py-3 sm:px-5">
                      <p className="text-[14px] font-bold text-ink-900">Free Stay Pay For Food</p>
                      <button
                        type="button"
                        onClick={() => setRoom(g.id)}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-5 py-2 text-[13px] font-bold uppercase tracking-wide transition ${
                          on ? 'border-action-500 bg-action-500 text-white' : 'border-action-500 text-action-500 hover:bg-brand-50'
                        }`}
                      >
                        {on && <Check size={14} strokeWidth={3} />}
                        {on ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* -- Food ---------------------------------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-ink-900">
              <Utensils size={17} className="text-ink-700" />
              Food Charges For Breakfast &amp; Dinner
            </h2>
            <ul className="mt-4 space-y-4">
              {foodRows.map((row) => (
                <li key={row.name} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-ink-900">
                      {row.label} <span className="font-medium text-ink-700">{row.note}</span>
                    </p>
                    <p className="mt-0.5 flex items-baseline gap-2">
                      <span className="text-[16px] font-extrabold text-ink-900">{inr(row.price)}</span>
                      <span className="text-[13px] font-semibold text-red-500 line-through">{inr(row.was)}</span>
                    </p>
                  </div>
                  <Stepper value={row.value} min={row.min} onChange={row.set} label={row.name} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] text-ink-500">Per person, per night, before taxes.</p>
          </section>

          {/* -- Meal preference ----------------------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="text-[15px] font-bold text-ink-900">Meal Details</h2>
            <p className="mt-0.5 text-[13px] text-ink-600">Select your meal preference type</p>
            <div role="radiogroup" aria-label="Meal preference" className="mt-4 flex flex-wrap gap-2.5">
              {mealPreferences.map((m) => {
                const on = m.key === meal;
                return (
                  <button
                    key={m.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setMeal(m.key)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold transition ${
                      on ? 'border-green-600 bg-green-50 text-green-700' : 'border-surface-line text-ink-700 hover:border-ink-400'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {m.dots.map((d, i) => (
                        <span key={d} className="flex items-center gap-1">
                          {i > 0 && <span className="text-ink-400">+</span>}
                          <FoodMark kind={d} />
                        </span>
                      ))}
                    </span>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* -- Desktop: the booking beside the choices ------------------- */}
        <aside className="hidden lg:col-span-4 lg:block lg:self-start lg:sticky lg:top-24">
          <div className="card p-5">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-green-700">Free Stay</p>
            <p className="mt-1 text-[16px] font-bold text-ink-900">{chosen.room.name}</p>
            <p className="text-[13px] text-ink-600">{chosen.label} · {nightsLabel}</p>
            <div className="mt-4 space-y-1.5 border-t border-surface-line pt-4 text-[14px]">
              <p className="flex justify-between"><span className="text-ink-600">Room</span><span className="font-semibold text-green-700">Free</span></p>
              <p className="flex justify-between"><span className="text-ink-600">Food · {adults + kids} guests</span><span className="font-semibold text-ink-900">{inr(food)}</span></p>
            </div>
            <Link href={book} className="btn-primary mt-5 w-full rounded-lg py-3.5 text-[14px] uppercase tracking-wide">
              Book Room
            </Link>
          </div>
        </aside>
      </div>

      {/* -- Phone: pinned bar ------------------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:hidden">
        <div className="flex items-center gap-4 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-tight text-ink-900">Free Stay Pay for Food</p>
            <p className="text-[12px] text-ink-600">Food {inr(food)} · {nightsLabel}</p>
          </div>
          <Link href={book} className="btn-primary shrink-0 rounded-lg px-7 py-3.5 text-[14px] uppercase tracking-wide">
            Book Room
          </Link>
        </div>
      </div>
    </>
  );
}
