'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Crown, Info, Lock, LockOpen } from 'lucide-react';
import NeedHelp from '@/components/ui/NeedHelp';
import { member, rewards, rewardsHero, rewardsNote } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/** How each state announces itself, and in what colour. */
const STATES = {
  unlocked: { label: 'Unlocked', tone: 'bg-[#e8f6ec] text-green-700', icon: LockOpen },
  locked: { label: 'Locked', tone: 'bg-[#fdecea] text-red-600', icon: Lock },
  progress: { label: 'In progress', tone: 'bg-[#fdf3dd] text-[#a97810]', icon: null },
  new: { label: 'Not started', tone: 'bg-[#eef1f5] text-ink-600', icon: null },
};

/**
 * Claim Your Gifts.
 *
 * `state` drives the whole card — the chip, what it says under the
 * requirement and which button appears — so a gift is described in one place
 * rather than four branches scattered through the markup.
 *
 * Claiming is local for now: there is no rewards API, so the card marks
 * itself claimed and says the desk will be in touch, which is true.
 */
export default function RewardsScreen({ hero, art = {} }) {
  const [claimed, setClaimed] = useState([]);

  return (
    <div className="pb-10">
      {/* -- The nudge --------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#5c7b93]">
        <div className="absolute inset-y-0 right-0 w-[55%]">
          <Image
            src={toSrc(hero || rewardsHero.image)}
            alt=""
            fill
            sizes="55vw"
            className="object-cover"
          />
        </div>
        <div className="relative shell py-8 lg:py-12">
          <div className="max-w-[13rem] sm:max-w-xs lg:max-w-md">
            <h1 className="text-[21px] font-extrabold uppercase leading-snug text-white lg:text-3xl">
              {rewardsHero.title}
            </h1>
            <p className="mt-3 text-[14px] leading-snug text-white/90 lg:text-base">
              {rewardsHero.body}
            </p>
          </div>
        </div>
      </section>

      {/* -- Who is claiming --------------------------------------- */}
      <section className="bg-[#231a4d]">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15">
              <Crown size={21} className="text-gold" fill="currentColor" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-bold uppercase tracking-wide text-white">
                {member.tier}
              </p>
              <p className="text-[14px] text-white/75">Member ID: {member.memberId}</p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-white/15 px-4 py-2 text-[14px] font-medium text-white">
            Valid Till {member.validTill}
          </span>
        </div>
      </section>

      {/* -- The gifts --------------------------------------------- */}
      <div className="shell space-y-5 py-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {rewards.map((gift) => {
          const state = STATES[gift.state];
          const Glyph = state.icon;
          const isClaimed = claimed.includes(gift.key);
          const pct = gift.progress
            ? Math.round((gift.progress.done / gift.progress.of) * 100)
            : 0;

          return (
            <article key={gift.key} className="card relative mt-3 p-4 pt-7 sm:p-5 sm:pt-8">
              <span
                className={`absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide sm:left-5 ${state.tone}`}
              >
                {Glyph && <Glyph size={14} strokeWidth={2.5} />}
                {state.label}
              </span>

              <div className="flex gap-4">
                <span className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={toSrc(art[gift.key] || gift.image)}
                    alt=""
                    fill
                    sizes="104px"
                    className="object-cover"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold leading-tight text-ink-900">{gift.label}</h2>
                  <p className="mt-1 text-[15px] text-ink-600">{gift.requirement}</p>

                  {gift.state === 'unlocked' && (
                    <p className="mt-3 flex items-center gap-2 text-[15px] text-ink-900">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-600 text-white">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      Requirement Completed
                    </p>
                  )}

                  {gift.state === 'progress' && (
                    <div className="mt-3">
                      <p className="text-[16px] font-bold text-ink-900">
                        {gift.progress.done}/{gift.progress.of} {gift.progress.noun} Completed
                      </p>
                      <p className="mt-2 flex items-center gap-3">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-line">
                          <span
                            className="block h-full rounded-full bg-action-500"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="shrink-0 text-[15px] font-bold text-action-500">
                          {pct}%
                        </span>
                      </p>
                      <p className="mt-2 text-[15px] text-ink-700">
                        {gift.progress.of - gift.progress.done} more left to claim
                      </p>
                    </div>
                  )}

                  {(gift.state === 'locked' || gift.state === 'new') && (
                    <p className="mt-3 flex gap-2 text-[15px] leading-snug text-ink-600">
                      <Info size={17} className="mt-0.5 shrink-0 text-ink-400" />
                      Complete the Requirement to unlock this gift.
                    </p>
                  )}
                </div>
              </div>

              {/* The way on, whatever that is for this gift. */}
              {isClaimed ? (
                <p className="mt-5 rounded-xl bg-[#e8f6ec] px-4 py-3.5 text-center text-[15px] font-semibold text-green-700">
                  Claimed — the desk will be in touch about delivery.
                </p>
              ) : gift.cta.href ? (
                <Link
                  href={gift.cta.href}
                  className="btn-primary mt-5 w-full rounded-xl py-3.5 text-[15px] uppercase tracking-wide"
                >
                  {gift.cta.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setClaimed((list) => [...list, gift.key])}
                  className="btn-primary mt-5 w-full rounded-xl py-3.5 text-[15px] uppercase tracking-wide"
                >
                  {gift.cta.label}
                </button>
              )}
            </article>
          );
        })}

        <p className="flex gap-2.5 pt-2 text-[15px] leading-snug text-ink-500">
          <Info size={18} className="mt-0.5 shrink-0 text-ink-400" />
          {rewardsNote}
        </p>

        <NeedHelp className="mt-6" />
      </div>
    </div>
  );
}
