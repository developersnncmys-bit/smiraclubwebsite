'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, Crown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import {
  membershipPlans, membershipQuiz, membershipQuizIntro, membershipQuizOutro, membershipReasons,
} from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/** An outlined square, the way the design draws its checkboxes. */
function Box({ on }) {
  return (
    <span
      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[3px] border-2 transition ${
        on ? 'border-action-500 bg-action-500 text-white' : 'border-ink-900 bg-white'
      }`}
    >
      {on && <Check size={12} strokeWidth={3.5} />}
    </span>
  );
}

/** The heading over each question. */
function Ask({ icon, label }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-soft">
        <Icon name={icon} size={19} className="text-ink-700" strokeWidth={1.8} />
      </span>
      <h3 className="text-[17px] font-bold leading-snug text-ink-900">{label}</h3>
    </div>
  );
}

const SELECT =
  'w-full cursor-pointer rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[16px] text-ink-900 outline-none focus:border-action-500';

/**
 * Find Your Perfect Membership.
 *
 * The recommendation is worked out from the four answers that actually say
 * something about how much travel a member does — how often, how many
 * people, how many rooms and what budget. The rest are asked because the
 * desk wants to know them, not because they move the answer, which is why
 * only some questions carry a weight.
 */
export default function MembershipQuiz({ helper, onPick }) {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const set = (key, value) => setAnswers((a) => ({ ...a, [key]: value }));

  const toggle = (key, option) =>
    setAnswers((a) => {
      const list = a[key] || [];
      return {
        ...a,
        [key]: list.includes(option) ? list.filter((o) => o !== option) : [...list, option],
      };
    });

  /** Higher answers mean more travel, so the index is the score. */
  const recommend = () => {
    let score = 0;
    let asked = 0;

    for (const q of membershipQuiz) {
      if (!q.weight) continue;
      const given = answers[q.key];
      const value = Array.isArray(given) ? given[given.length - 1] : given;
      if (!value) continue;
      const i = q.options.indexOf(value);
      if (i < 0) continue;
      // Normalised to 0–1 so a five-option question does not outvote a three.
      score += i / (q.options.length - 1);
      asked += 1;
    }

    const share = asked ? score / asked : 0.35;
    const key =
      share >= 0.75 ? 'diamond' : share >= 0.5 ? 'platinum' : share >= 0.25 ? 'gold' : 'silver';

    setResult(membershipPlans.find((p) => p.key === key));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="shell space-y-4 py-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
      <section className="card p-4 sm:p-5">
        <h2 className="text-xl font-bold text-action-500">{membershipQuizIntro.title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{membershipQuizIntro.body}</p>
      </section>

      {membershipQuiz.map((q) => (
        <section key={q.key} className="card p-4 sm:p-5">
          <Ask icon={q.icon} label={q.label} />

          <div className="mt-4">
            {q.type === 'chips' && (
              <div className="flex flex-wrap gap-3">
                {q.options.map((o) => {
                  const on = (answers[q.key] || []).includes(o);
                  return (
                    <label
                      key={o}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3.5 text-[15px] transition ${
                        on ? 'border-action-500 bg-brand-50' : 'border-surface-line hover:bg-surface-soft'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(q.key, o)}
                        className="sr-only"
                      />
                      <Box on={on} />
                      {o}
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === 'select' && (
              <select
                value={answers[q.key] || q.options[0]}
                onChange={(e) => set(q.key, e.target.value)}
                aria-label={q.label}
                className={SELECT}
              >
                {q.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            )}

            {q.type === 'pills' && (
              <div className="flex flex-wrap gap-3">
                {q.options.map((o) => {
                  const on = (answers[q.key] || []).includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => toggle(q.key, o)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-3 text-[15px] transition ${
                        on
                          ? 'border-action-500 text-action-500'
                          : 'border-surface-line text-ink-900 hover:bg-surface-soft'
                      }`}
                    >
                      {o}
                      <span aria-hidden="true" className={on ? 'text-action-500' : 'text-ink-500'}>
                        {on ? '×' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'text' && (
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={q.max}
                  value={answers[q.key] || ''}
                  onChange={(e) => set(q.key, e.target.value)}
                  placeholder={q.placeholder}
                  aria-label={q.label}
                  className="w-full resize-none rounded-xl border border-surface-line bg-white px-4 py-3.5 pb-8 text-[15px] text-ink-900 outline-none placeholder:text-ink-400 focus:border-action-500"
                />
                <span className="pointer-events-none absolute bottom-3 right-4 text-[13px] text-ink-400">
                  {(answers[q.key] || '').length}/{q.max}
                </span>
              </div>
            )}
          </div>

          {/* The button belongs to the last question's card in the design. */}
          {q.key === 'needs' && (
            <button
              type="button"
              onClick={recommend}
              className="btn-primary mt-6 w-full gap-3 rounded-xl py-4 text-[16px] normal-case tracking-normal"
            >
              Find My Best Membership
              <ArrowRight size={19} />
            </button>
          )}
        </section>
      ))}

      {result && (
        <>
          <section className={`rounded-2xl bg-gradient-to-br p-5 text-white ${result.tone}`}>
            <p className="text-[16px]">Your Perfect Plan is</p>
            <p className="mt-2 flex items-center gap-3 text-2xl font-bold">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/25">
                <Crown size={22} className="text-gold" fill="currentColor" strokeWidth={1.5} />
              </span>
              {result.label} Membership
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">
              Based on your preferences we recommend you {result.label} Plan for the best travel
              experience.
            </p>
          </section>

          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Why this is right fit for you?</h2>

            <ul className="mt-4 space-y-3.5">
              {membershipReasons[result.key].map((reason) => (
                <li key={reason} className="flex items-center gap-3 text-[16px] text-ink-900">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-action-500 text-white">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => onPick(result.key)}
              className="btn-primary mt-6 w-full gap-3 rounded-xl py-4 text-[16px] normal-case tracking-normal"
            >
              Continue with {result.label} Membership
              <ArrowRight size={19} />
            </button>
          </section>

          <section className="py-8 text-center">
            <Image
              src={toSrc(helper || 'plan-helper')}
              alt=""
              width={140}
              height={140}
              className="mx-auto h-auto w-[120px]"
            />
            <h2 className="mt-4 text-xl font-bold text-ink-900">{membershipQuizOutro.title}</h2>
            <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-ink-600">
              {membershipQuizOutro.body}
            </p>

            <button
              type="button"
              onClick={() => onPick(null)}
              className="mt-6 w-full rounded-xl border-2 border-action-500 px-5 py-4 text-[16px] font-bold text-action-500 transition hover:bg-brand-50"
            >
              {membershipQuizOutro.cta}
            </button>
          </section>
        </>
      )}
    </div>
  );
}
