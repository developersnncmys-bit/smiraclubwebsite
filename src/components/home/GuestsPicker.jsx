'use client';

import { useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';

/**
 * Select rooms & Guests, built to the prototype frame.
 *
 * The design is a phone screen, so the panel keeps the phone's width at every
 * size rather than stretching into a bar across a desktop — it sits against
 * the bottom on a phone and centred on a larger screen, which is the same
 * panel either way. Trying to be a popover on the desktop was the mistake:
 * a list of child ages is taller than a popover has room for, and it stopped
 * looking like the drawing.
 *
 * The child ages are the point of the screen. A hotel prices a nine-year-old
 * differently from a two-year-old, so the count alone cannot be quoted
 * against — hence one dropdown per child, and the line at the bottom saying
 * why it is being asked.
 */

/** 0 through 17, the range the design states under Children. */
const AGES = Array.from({ length: 18 }, (_, i) => i);

const ageLabel = (n) => (n === 0 ? 'Under 1' : n === 1 ? '1 Year' : `${n} Years`);

/** The outlined − value + pill, used for all three counts. */
function Stepper({ label, note, value, min = 0, max = 30, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <span className="min-w-0">
        <span className="block text-[17px] font-bold leading-tight text-ink-900">{label}</span>
        {note && <span className="mt-1 block text-[13px] text-ink-500">{note}</span>}
      </span>

      <span className="flex shrink-0 items-center rounded-xl border border-brand-200">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`One fewer ${label.toLowerCase()}`}
          className="grid h-11 w-11 place-items-center rounded-l-xl text-[17px] font-semibold text-action-500 transition hover:bg-brand-50 disabled:pointer-events-none disabled:text-ink-400/40"
        >
          -
        </button>
        <span aria-live="polite" className="w-8 text-center text-[15px] font-bold text-ink-900">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`One more ${label.toLowerCase()}`}
          className="grid h-11 w-11 place-items-center rounded-r-xl text-[17px] font-semibold text-action-500 transition hover:bg-brand-50 disabled:pointer-events-none disabled:text-ink-400/40"
        >
          +
        </button>
      </span>
    </div>
  );
}

export default function GuestsPicker({
  open,
  onClose,
  rooms,
  setRooms,
  adults,
  setAdults,
  childAges,
  setChildAges,
}) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    // Hold the page still behind the panel.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const children = childAges.length;

  /** Growing keeps the ages already chosen; shrinking drops from the end. */
  const setChildren = (next) =>
    setChildAges(
      next > children ? [...childAges, ...Array(next - children).fill(3)] : childAges.slice(0, next)
    );

  const setAge = (index, age) => setChildAges(childAges.map((a, i) => (i === index ? age : a)));

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
        aria-label="Select rooms and guests"
        className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:max-h-[85vh] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-center gap-5 border-b border-surface-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-900 transition hover:bg-surface-soft"
          >
            <X size={22} strokeWidth={2.2} />
          </button>
          <h2 className="text-[17px] font-bold text-ink-900">Select rooms &amp; Guests</h2>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <Stepper label="Rooms" value={rooms} min={1} max={10} onChange={setRooms} />
          <Stepper label="Adults" value={adults} min={1} max={30} onChange={setAdults} />
          <Stepper
            label="Children"
            note="0-17 Years Old"
            value={children}
            min={0}
            max={10}
            onChange={setChildren}
          />

          {children > 0 && (
            <div className="pt-3">
              <h3 className="text-[17px] font-bold text-ink-900">Age of Children</h3>

              <div className="mt-5 space-y-5">
                {childAges.map((age, i) => (
                  // The index is the identity: children have no other one, and
                  // adding one never reorders the ages already set.
                  // eslint-disable-next-line react/no-array-index-key
                  <label key={i} className="block">
                    <span className="mb-2 block text-[14px] font-bold text-ink-900">
                      Child {i + 1} Age
                    </span>
                    <span className="relative block">
                      <select
                        value={age}
                        onChange={(e) => setAge(i, Number(e.target.value))}
                        className="w-full appearance-none rounded-xl border border-surface-line bg-white px-4 py-4 pr-11 text-[15px] font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      >
                        {AGES.map((a) => (
                          <option key={a} value={a}>
                            {ageLabel(a)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={20}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-500"
                      />
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-6 text-[14px] leading-relaxed text-ink-400">
                Please provide right number of children along with their right age for best options
                and prices.
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-surface-line p-5">
          <button type="button" onClick={onClose} className="btn-action w-full py-4 text-[15px]">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
