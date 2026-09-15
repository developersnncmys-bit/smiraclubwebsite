'use client';

import { useState } from 'react';
import { Calendar, Minus, Plus, User } from 'lucide-react';
import { CaptionField, RequestSent, Segmented } from '@/components/forms/RequestFields';
import { groundModes } from '@/lib/content';
import { fullDate, weekday } from '@/lib/format';

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const TEXT = 'w-full min-w-0 border-0 bg-transparent p-0 text-[13px] font-medium text-ink-900 outline-none placeholder:text-ink-900 sm:text-[15px]';

/**
 * Train / Bus.
 *
 * The same request as a flight, for the ground: where from, where to, which
 * day and how many. The placeholders change with the mode because a train is
 * found by station and a bus by city.
 */
export default function GroundSearch() {
  const now = new Date();
  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const todayIso = isoDay(now);
  const tomorrowIso = isoDay(tomorrowDate);

  const [mode, setMode] = useState('train');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(todayIso);
  const [travellers, setTravellers] = useState(1);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const current = groundModes.find((m) => m.key === mode);

  const submit = (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) return setError(`Tell us where you are travelling from and to.`);
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) return setError('The two places are the same.');
    setError('');
    return setSent(true);
  };

  if (sent) {
    return (
      <RequestSent
        body={`Your ${current.label.toLowerCase()} request is with our travel desk. We will call you on your registered number with options within one working day.`}
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <Segmented options={groundModes} value={mode} onChange={setMode} label="Train or bus" className="lg:max-w-md" />

      <div className="grid gap-3 lg:grid-cols-2">
        <CaptionField icon="MapPin" caption="Travelling From">
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder={current.placeholder} aria-label="Travelling from" className={TEXT} />
        </CaptionField>
        <CaptionField icon="MapPin" caption="Travelling To">
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder={current.placeholder} aria-label="Travelling to" className={TEXT} />
        </CaptionField>

        <div className="relative flex min-w-0 items-center gap-2.5 rounded-xl border border-surface-line bg-white p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50">
            <Calendar size={18} className="text-action-500" />
          </span>
          <label className="relative min-w-0 flex-1 cursor-pointer">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-400">Date</span>
            <span className="block truncate text-[13px] font-medium text-ink-900 sm:text-[15px]">
              {fullDate(date)}, {weekday(date)}
            </span>
            <input
              type="date"
              value={date}
              min={todayIso}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              aria-label="Date"
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
          <span className="flex shrink-0 gap-1.5">
            {[
              ['Today', todayIso],
              ['Tomorrow', tomorrowIso],
            ].map(([label, value]) => {
              const on = date === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setDate(value)}
                  aria-pressed={on}
                  className={`rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition sm:px-2.5 sm:text-[14px] ${
                    on ? 'border-brand-700 bg-brand-50 text-brand-700' : 'border-ink-400 text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </span>
        </div>

        <CaptionField icon="User" caption="Travellers">
          <span className="flex items-center gap-2">
            <button type="button" onClick={() => setTravellers((v) => Math.max(1, v - 1))} disabled={travellers <= 1} aria-label="One fewer traveller" className="grid h-6 w-6 place-items-center rounded-full border border-surface-line text-ink-700 disabled:opacity-40">
              <Minus size={12} />
            </button>
            <span className="flex items-center gap-1 text-[15px] font-medium text-ink-900" aria-live="polite">
              {travellers} <User size={14} fill="currentColor" />
            </span>
            <button type="button" onClick={() => setTravellers((v) => Math.min(9, v + 1))} aria-label="One more traveller" className="grid h-6 w-6 place-items-center rounded-full border border-surface-line text-ink-700">
              <Plus size={12} />
            </button>
          </span>
        </CaptionField>
      </div>

      {error && <p role="alert" className="text-[14px] font-medium text-red-600">{error}</p>}

      <button type="submit" className="btn-primary mt-3 w-full rounded-xl py-3.5 text-[16px] normal-case tracking-normal lg:w-auto lg:px-16">
        Send Request
      </button>
    </form>
  );
}

