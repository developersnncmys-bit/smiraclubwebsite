'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { tableSittings } from '@/lib/content';
import { clock, fullDate, shortDate, weekday } from '@/lib/format';
import Portal from '@/components/ui/Portal';

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** '13:30' to '17:00' in fifteen-minute steps. */
function slotsBetween(from, to) {
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const out = [];
  for (let m = toMin(from); m <= toMin(to); m += 15) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
}

/**
 * Book a Table: the button, and the sheet it opens.
 *
 * A week of days, Lunch or Dinner, a time, and how many are coming. Times
 * already gone today are shown but cannot be picked, so the grid keeps its
 * shape rather than jumping about through the day. A table needs no payment,
 * so Continue confirms it straight away.
 */
export default function BookTable({ restaurant }) {
  const router = useRouter();
  const panel = useRef(null);
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [sitting, setSitting] = useState(tableSittings[0].key);
  const [time, setTime] = useState(null);
  const [guests, setGuests] = useState(2);
  const [now, setNow] = useState(null);

  // The clock is read after mount, so the server and the browser agree on
  // the first paint and "already gone" is judged by the member's own time.
  useEffect(() => setNow(new Date()), [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const days = useMemo(() => {
    const base = now || new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return { iso: isoDay(d), top: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : shortDate(d), sub: weekday(d) };
    });
  }, [now]);

  const current = tableSittings.find((s) => s.key === sitting);
  const slots = slotsBetween(current.from, current.to);
  const gone = (t) => {
    if (day !== 0 || !now) return false;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
  };

  const confirm = () => {
    if (!time) return;
    const d = days[day].iso;
    const stamp = new Date();
    const ref = `SM-${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, '0')}${String(stamp.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`;
    router.push(`/booking/confirmed?${new URLSearchParams({
      ref,
      kind: 'table',
      name: restaurant.name,
      slot: `${weekday(d)}, ${fullDate(d)}`,
      nights: `${clock(time)} · ${current.label} · ${guests} Guest${guests === 1 ? '' : 's'}`,
    })}`);
  };

  const opener = (
    <>
      Book a Table
      <ArrowRight size={20} />
    </>
  );

  return (
    <>
      {/* Desktop: in the rail beside the page. */}
      <button type="button" onClick={() => setOpen(true)} className="btn-primary hidden w-full justify-between rounded-xl px-6 py-3.5 text-[16px] normal-case tracking-normal lg:flex">
        {opener}
      </button>

      {/* Phone: pinned to the foot, as drawn. */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 px-4 pt-3 backdrop-blur lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary flex w-full justify-between rounded-xl px-6 py-3.5 text-[16px] normal-case tracking-normal">
          <span className="flex-1 text-center">Book a Table</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {open && (
        <Portal>
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
          onMouseDown={(e) => {
            if (!panel.current?.contains(e.target)) setOpen(false);
          }}
        >
          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={`Booking at ${restaurant.name}`}
            className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-surface-line px-4 py-4">
              <h2 className="truncate text-[17px] font-semibold text-ink-900">Booking at {restaurant.name}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-surface-soft">
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              <h3 className="px-4 pt-5 text-[17px] font-semibold text-ink-900">Choose date and time</h3>

              <div role="tablist" aria-label="Day" className="mt-4 flex overflow-x-auto border-b border-surface-line px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {days.map((d, i) => (
                  <button
                    key={d.iso}
                    type="button"
                    role="tab"
                    aria-selected={day === i}
                    onClick={() => {
                      setDay(i);
                      setTime(null);
                    }}
                    className={`shrink-0 border-b-[3px] px-3 pb-2 text-center transition ${day === i ? 'border-action-500' : 'border-transparent'}`}
                  >
                    <span className="block text-[15px] font-semibold text-ink-900">{d.top}</span>
                    <span className="block text-[13px] text-ink-500">{d.sub}</span>
                  </button>
                ))}
              </div>

              <div className="px-6 py-6">
                <div role="tablist" aria-label="Sitting" className="grid grid-cols-2 rounded-full bg-surface-soft p-1">
                  {tableSittings.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      role="tab"
                      aria-selected={sitting === s.key}
                      onClick={() => {
                        setSitting(s.key);
                        setTime(null);
                      }}
                      className={`rounded-full py-2 text-[15px] transition ${sitting === s.key ? 'bg-brand-700 font-medium text-white' : 'text-ink-900'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {slots.map((t) => {
                    const past = gone(t);
                    const picked = time === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={past}
                        onClick={() => setTime(t)}
                        aria-pressed={picked}
                        className={`rounded-md border py-3 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:border-surface-line disabled:text-ink-400/60 ${
                          picked ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink-400 text-ink-900 enabled:hover:border-brand-700'
                        }`}
                      >
                        {clock(t).replace(/^(\d+) /, '$1:00 ')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="shrink-0 space-y-4 border-t border-surface-line p-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-[16px] font-semibold text-ink-900">No of Guests</p>
                <span className="flex items-center rounded-md border border-brand-700">
                  <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="One fewer guest" className="grid h-9 w-9 place-items-center text-[18px] font-semibold text-brand-700">-</button>
                  <span aria-live="polite" className="w-7 text-center text-[16px] font-medium text-ink-900">{guests}</span>
                  <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="One more guest" className="grid h-9 w-9 place-items-center text-[18px] font-semibold text-brand-700">+</button>
                </span>
              </div>
              <button type="button" onClick={confirm} disabled={!time} className="btn-primary w-full rounded-xl py-3.5 text-[16px] normal-case tracking-normal disabled:opacity-50">
                {time ? 'Continue' : 'Pick a time to continue'}
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
