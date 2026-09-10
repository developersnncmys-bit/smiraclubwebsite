'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Check, Images, Ruler, User } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';

/**
 * Select Room, and the bar that follows it.
 *
 * A room is what you sleep in; a rate plan is what it costs and what it
 * includes, and one room can carry several. The plan is what gets selected,
 * which is why the bottom bar's price moves as you pick — the bar reads the
 * same selection, so the two can never disagree about what you are booking.
 */
export default function RoomPicker({ groups, defaultPlan, bookHref }) {
  const [picked, setPicked] = useState(defaultPlan);

  /** The chosen plan, and the room it belongs to. */
  const chosen = groups
    .flatMap((g) => g.plans.map((p) => ({ plan: p, room: g.room })))
    .find((x) => x.plan.id === picked);

  return (
    <>
      <section id="rooms" className="scroll-mt-24">
        <h2 className="text-lg font-bold text-ink-900 lg:text-xl">Select Room</h2>

        <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
          {groups.map((group) => (
            <article key={group.id} className="card overflow-hidden">
              <p className="px-4 pt-4 text-[15px] font-semibold text-ink-500 sm:px-5">
                {group.label}
              </p>

              {/* -- The room itself ------------------------------- */}
              <div className="flex gap-3.5 p-4 sm:p-5">
                <span className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={toSrc(group.room.image)}
                    alt=""
                    fill
                    sizes="104px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-md bg-ink-900/75 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                    <Images size={12} />
                    {group.room.photos}
                  </span>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[17px] font-bold leading-tight text-ink-900">
                    {group.room.name}
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[14px] text-ink-600">
                    <li className="flex items-center gap-2">
                      <User size={15} className="shrink-0 text-ink-500" />
                      {group.room.guests}
                    </li>
                    <li className="flex items-center gap-2">
                      <Ruler size={15} className="shrink-0 text-ink-500" />
                      {group.room.size}
                    </li>
                    <li className="flex items-center gap-2">
                      <BedDouble size={15} className="shrink-0 text-ink-500" />
                      {group.room.bed}
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="Waves" size={15} className="shrink-0 text-ink-500" />
                      {group.room.view}
                    </li>
                  </ul>
                </div>
              </div>

              {/* -- What it costs, and on what terms -------------- */}
              {group.plans.map((plan) => {
                const on = plan.id === picked;
                return (
                  <div key={plan.id} className="border-t border-surface-line p-4 sm:p-5">
                    <h4 className="text-[16px] font-bold text-ink-900">{plan.name}</h4>

                    <ul className="mt-2 space-y-1.5">
                      {plan.lines.map((line) => (
                        <li key={line} className="flex gap-2 text-[14px] text-ink-600">
                          <span aria-hidden="true" className="text-ink-400">
                            &bull;
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>

                    <button type="button" className="mt-3 text-[15px] font-semibold text-action-500">
                      View Details
                    </button>

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                      <p>
                        <span className="flex flex-wrap items-baseline gap-2">
                          <span className="text-xl font-extrabold text-ink-900">
                            {inr(plan.price)}
                          </span>
                          <span className="text-[15px] font-semibold text-red-500 line-through">
                            {inr(plan.was)}
                          </span>
                        </span>
                        <span className="block text-[13px] text-ink-500">(Taxes Included)</span>
                        <span className="block text-[13px] text-ink-500">Per night</span>
                      </p>

                      <button
                        type="button"
                        onClick={() => setPicked(plan.id)}
                        aria-pressed={on}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-lg border-2 px-6 py-2.5 text-[15px] font-bold uppercase tracking-wide transition ${
                          on
                            ? 'border-action-500 bg-brand-50 text-action-500'
                            : 'border-action-500 bg-white text-action-500 hover:bg-brand-50'
                        }`}
                      >
                        {on && <Check size={16} strokeWidth={3} />}
                        {on ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </article>
          ))}
        </div>
      </section>

      {/*
        What the selection costs, pinned.

        A phone gets the full-width strip it has room for. A desktop gets a
        floating card instead — edge to edge across 1600px, the price and the
        button end up at opposite ends of the screen with nothing between
        them, which reads as two stray controls rather than one bar.
      */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:bottom-6">
        <div className="border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:mx-auto lg:max-w-3xl lg:rounded-2xl lg:border lg:shadow-lift">
          <div
            className="flex items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-6"
            style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
          >
          {/*
            A phone has no room for this, but a desktop has plenty — and an
            empty half of the bar with the price marooned at the far edge is
            what it looks like otherwise. So the space says what you picked.
          */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-[15px] font-bold text-ink-900">{chosen?.room.name}</p>
            <p className="truncate text-[14px] text-ink-500">{chosen?.plan.name}</p>
          </div>

          <div className="min-w-0 flex-1 lg:flex-none lg:text-right">
            <p className="flex flex-wrap items-baseline gap-2 lg:justify-end">
              <span className="text-xl font-extrabold text-ink-900">
                {inr(chosen?.plan.price ?? 0)}
              </span>
              {chosen?.plan.was && (
                <span className="text-[15px] font-semibold text-red-500 line-through">
                  {inr(chosen.plan.was)}
                </span>
              )}
            </p>
            <p className="text-[13px] leading-tight text-ink-500">
              (Taxes Included) <span className="lg:hidden">
                <br />
              </span>
              Per night
            </p>
          </div>

          <Link
            href={`${bookHref}${bookHref.includes('?') ? '&' : '?'}plan=${picked}`}
            className="btn-primary min-w-[10.5rem] shrink-0 rounded-lg px-8 py-4 text-[15px] uppercase tracking-wide lg:min-w-[13rem]"
          >
            Book room
          </Link>
          </div>
        </div>
      </div>
    </>
  );
}
