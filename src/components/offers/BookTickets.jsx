'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { clock, inr, weekday } from '@/lib/format';
import Portal from '@/components/ui/Portal';

/**
 * Book Tickets: the pinned bar, and the sheet it opens.
 *
 * The dates are the ones the event actually runs (every Saturday for a weekly
 * camp, every day for a daily activity), then a start time, then how many of
 * each ticket. Checkout carries all of it to Review Booking.
 */
export default function BookTickets({ activity, dates, from }) {
  const router = useRouter();
  const panel = useRef(null);
  const strip = useRef(null);
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(activity.sessions.slots[0]);
  const [qty, setQty] = useState(() => Object.fromEntries(activity.tickets.map((t, i) => [t.id, i === 0 ? 2 : 0])));

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

  const count = Object.values(qty).reduce((a, b) => a + b, 0);
  const set = (id, n) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(20, n)) }));
  const nudge = (dir) => strip.current?.scrollBy({ left: dir * 160, behavior: 'smooth' });

  const checkout = () => {
    if (!count) return;
    const params = new URLSearchParams({ date: dates[day], time: slot });
    activity.tickets.forEach((t) => params.set(t.id, String(qty[t.id] || 0)));
    router.push(`/activities/${activity.id}/book?${params}`);
  };

  const trigger = (
    <button type="button" onClick={() => setOpen(true)} className="btn-primary shrink-0 rounded-lg px-8 py-3.5 text-[15px] normal-case tracking-normal">
      Book Tickets
    </button>
  );

  return (
    <>
      <div className="hidden lg:block">
        <p className="text-[13px] text-ink-700">
          From <span className="text-xl font-extrabold text-ink-900">{inr(from.price)}</span>{' '}
          <span className="text-red-500 line-through">{inr(from.was)}</span>
        </p>
        <p className="text-[12px] text-ink-600">Per Person before taxes &amp; fees</p>
        <div className="mt-4 [&>button]:w-full">{trigger}</div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:hidden">
        <div className="flex items-center gap-4 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-ink-900">
              From <span className="text-[18px] font-bold">{inr(from.price)}</span>{' '}
              <span className="text-red-500 line-through">{inr(from.was)}</span>
            </p>
            <p className="text-[12px] text-ink-700">Per Person before taxes &amp; fees</p>
          </div>
          {trigger}
        </div>
      </div>

      {open && (
        <Portal>
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
          onMouseDown={(e) => {
            if (!panel.current?.contains(e.target)) setOpen(false);
          }}
        >
          <div ref={panel} role="dialog" aria-modal="true" aria-label={`Book ${activity.name}`} className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl">
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-surface-line px-4 py-4">
              <h2 className="truncate text-[17px] font-semibold text-ink-900">{activity.name}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface-soft">
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              <h3 className="px-4 pt-5 text-[17px] font-semibold text-ink-900">Choose date and time</h3>
              <div className="relative mt-3 border-b border-surface-line">
                <button type="button" onClick={() => nudge(-1)} aria-label="Earlier dates" className="absolute left-0 top-1/2 z-10 grid h-10 w-6 -translate-y-1/2 place-items-center rounded-r-lg bg-brand-700 text-white">
                  <ChevronLeft size={16} />
                </button>
                <div ref={strip} role="tablist" aria-label="Date" className="flex overflow-x-auto px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {dates.map((d, i) => (
                    <button
                      key={d}
                      type="button"
                      role="tab"
                      aria-selected={day === i}
                      onClick={() => setDay(i)}
                      className={`min-w-[4.25rem] shrink-0 border-b-[3px] px-2 pb-2 pt-1 text-center transition ${day === i ? 'border-action-500' : 'border-transparent'}`}
                    >
                      <span className="block text-[16px] font-semibold text-ink-900">{Number(d.slice(8))}</span>
                      <span className="block text-[13px] text-ink-500">{weekday(d)}</span>
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => nudge(1)} aria-label="Later dates" className="absolute right-0 top-1/2 z-10 grid h-10 w-6 -translate-y-1/2 place-items-center rounded-l-lg bg-brand-700 text-white">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="px-4 py-6">
                <h3 className="text-[17px] font-semibold text-ink-900">Available Slots</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {activity.sessions.slots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSlot(t)}
                      aria-pressed={slot === t}
                      className={`rounded-md border px-5 py-3 text-[14px] font-semibold transition ${slot === t ? 'border-brand-700 bg-brand-50 text-brand-700' : 'border-ink-400 text-ink-900 hover:border-brand-700'}`}
                    >
                      {clock(t).replace(/^(\d+) /, '$1:00 ')}
                    </button>
                  ))}
                </div>

                <h3 className="mt-8 text-[17px] font-semibold text-ink-900">Choose Ticket</h3>
                <ul className="mt-4 space-y-5">
                  {activity.tickets.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[16px] font-medium text-ink-900">{t.label}</p>
                        <p className="text-[14px] text-ink-500">{t.note}</p>
                        <p className="text-[14px]">
                          <span className="font-bold text-ink-900">{inr(t.price)}</span>{' '}
                          <span className="text-[12px] text-ink-500 line-through">{inr(t.was)}</span>
                        </p>
                      </div>
                      {qty[t.id] ? (
                        <span className="flex shrink-0 items-center rounded-md border border-brand-700">
                          <button type="button" onClick={() => set(t.id, qty[t.id] - 1)} aria-label={`One fewer ${t.label}`} className="grid h-10 w-9 place-items-center text-[20px] font-semibold text-brand-700">-</button>
                          <span aria-live="polite" className="w-7 text-center text-[17px] font-medium text-ink-900">{qty[t.id]}</span>
                          <button type="button" onClick={() => set(t.id, qty[t.id] + 1)} aria-label={`One more ${t.label}`} className="grid h-10 w-9 place-items-center text-[20px] font-semibold text-brand-700">+</button>
                        </span>
                      ) : (
                        <button type="button" onClick={() => set(t.id, 1)} className="shrink-0 rounded-md border border-brand-700 px-7 py-2 text-[16px] font-medium text-brand-700 hover:bg-brand-50">
                          Add
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="shrink-0 border-t border-surface-line p-4">
              <button type="button" onClick={checkout} disabled={!count} className="btn-primary w-full rounded-xl py-3.5 text-[16px] normal-case tracking-normal disabled:opacity-50">
                {count ? 'Checkout' : 'Add a ticket to continue'}
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
