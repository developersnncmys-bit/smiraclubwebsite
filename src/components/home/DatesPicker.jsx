'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { nightsBetween, shortDate } from '@/lib/format';

/**
 * Check-in and check-out, in the same sheet the guests panel uses.
 *
 * The search bar in the design reads "17 Aug - 18 Aug" — one line, no native
 * date control — so the field itself is a button and the actual picking
 * happens in here. The two inputs stay native: the phone's own date wheel is
 * better than anything drawn over it, and it is already localised.
 *
 * Check-out can never land on or before check-in, so moving check-in pushes
 * check-out along rather than leaving a stay of zero nights behind.
 */
export default function DatesPicker({ open, onClose, from, setFrom, to, setTo }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const today = new Date().toISOString().slice(0, 10);

  /** The day after `date`, as the value an <input type="date"> wants. */
  const dayAfter = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const changeFrom = (value) => {
    setFrom(value);
    if (value >= to) setTo(dayAfter(value));
  };

  const nights = nightsBetween(from, to);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (!panel.current?.contains(e.target)) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Select dates"
        className="w-full max-w-phone overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl"
      >
        <header className="flex items-center gap-5 border-b border-surface-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-900 transition hover:bg-surface-soft"
          >
            <X size={22} strokeWidth={2.2} />
          </button>
          <h2 className="text-[17px] font-bold text-ink-900">Select Dates</h2>
        </header>

        <div className="space-y-5 px-5 py-5">
          <label className="block">
            <span className="mb-2 block text-[14px] font-bold text-ink-900">Check-in</span>
            <input
              type="date"
              value={from}
              min={today}
              onChange={(e) => changeFrom(e.target.value)}
              className="field"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-bold text-ink-900">Check-out</span>
            <input
              type="date"
              value={to}
              min={dayAfter(from)}
              onChange={(e) => setTo(e.target.value)}
              className="field"
            />
          </label>

          <p className="text-[14px] text-ink-500">
            {shortDate(from)} - {shortDate(to)} · {nights} {nights === 1 ? 'night' : 'nights'}
          </p>
        </div>

        <div className="border-t border-surface-line p-5">
          <button type="button" onClick={onClose} className="btn-action w-full py-4 text-[15px]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
