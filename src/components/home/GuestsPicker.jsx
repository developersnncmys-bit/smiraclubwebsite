'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Select rooms & Guests, as the design draws it.
 *
 * One panel, two shapes. On a phone it is the sheet from the prototype —
 * anchored to the bottom of the screen over a dim, because a child-age list
 * can run longer than a popover has room for. From `lg` up it is a popover
 * under the Guests field, which is what someone booking on a laptop expects.
 *
 * The child ages are the point of the screen. A hotel prices a nine-year-old
 * differently from a two-year-old, so the count alone is not enough to quote
 * against — hence one dropdown per child, and the line at the bottom saying
 * why it is being asked.
 */

/** 0 through 17, the range the design states under Children. */
const AGES = Array.from({ length: 18 }, (_, i) => i);

const ageLabel = (n) => (n === 0 ? 'Under 1' : n === 1 ? '1 Year' : `${n} Years`);

/** A row of − value + , used for all three counts. */
function Stepper({ label, note, value, min = 0, max = 30, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span className="min-w-0">
        <span className="block text-[17px] font-bold text-ink-900">{label}</span>
        {note && <span className="mt-0.5 block text-[13px] text-ink-500">{note}</span>}
      </span>

      <span className="flex shrink-0 items-center rounded-xl border border-brand-200">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`One fewer ${label.toLowerCase()}`}
          className="grid h-11 w-11 place-items-center rounded-l-xl text-xl font-semibold text-brand-600 transition hover:bg-brand-50 disabled:pointer-events-none disabled:text-ink-400/50"
        >
          −
        </button>
        <span aria-live="polite" className="w-10 text-center text-[16px] font-bold text-ink-900">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`One more ${label.toLowerCase()}`}
          className="grid h-11 w-11 place-items-center rounded-r-xl text-xl font-semibold text-brand-600 transition hover:bg-brand-50 disabled:pointer-events-none disabled:text-ink-400/50"
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
  anchorRef,
  rooms,
  setRooms,
  adults,
  setAdults,
  childAges,
  setChildAges,
}) {
  const panel = useRef(null);

  // Escape closes it, and on a phone the sheet holds the page still behind it.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onDown = (e) => {
      // The trigger counts as inside, or clicking it while open would close on
      // the mousedown and reopen on the click — a button that does nothing.
      if (panel.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const children = childAges.length;

  /** Growing keeps the ages already chosen; shrinking drops from the end. */
  const setChildren = (next) =>
    setChildAges(
      next > children ? [...childAges, ...Array(next - children).fill(3)] : childAges.slice(0, next)
    );

  const setAge = (index, age) =>
    setChildAges(childAges.map((a, i) => (i === index ? age : a)));

  return (
    <>
      {/* The dim behind the sheet. A popover on a desktop needs no curtain. */}
      <div className="fixed inset-0 z-40 bg-ink-900/40 lg:hidden" aria-hidden />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Select rooms and guests"
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-lift
                   lg:absolute lg:inset-x-auto lg:bottom-auto lg:left-0 lg:top-full lg:mt-2 lg:max-h-[28rem]
                   lg:w-[22rem] lg:rounded-2xl lg:border lg:border-surface-line"
      >
        <header className="flex items-center gap-4 border-b border-surface-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-700 transition hover:bg-surface-soft"
          >
            <X size={20} />
          </button>
          <h2 className="text-[18px] font-bold text-ink-900 lg:text-[16px]">Select rooms &amp; Guests</h2>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          <div className="divide-y divide-surface-line">
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
          </div>

          {children > 0 && (
            <div className="pb-1 pt-5">
              <h3 className="text-[16px] font-bold text-ink-900">Age of Children</h3>

              <div className="mt-3 space-y-4">
                {childAges.map((age, i) => (
                  // The index is the identity here: children have no other one,
                  // and adding a child never reorders the ones already set.
                  // eslint-disable-next-line react/no-array-index-key
                  <label key={i} className="block">
                    <span className="mb-1.5 block text-[14px] font-semibold text-ink-700">
                      Child {i + 1} Age
                    </span>
                    <select
                      value={age}
                      onChange={(e) => setAge(i, Number(e.target.value))}
                      className="field appearance-none py-3.5 text-[15px]"
                    >
                      {AGES.map((a) => (
                        <option key={a} value={a}>
                          {ageLabel(a)}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-ink-400">
                Please provide right number of children along with their right age for best options
                and prices.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-surface-line px-5 py-4">
          <button type="button" onClick={onClose} className="btn-action w-full py-3.5">
            Done
          </button>
        </div>
      </div>
    </>
  );
}
