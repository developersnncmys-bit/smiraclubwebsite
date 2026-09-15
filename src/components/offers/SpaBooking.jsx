'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { clock, inr, shortDate, weekday } from '@/lib/format';

const pct = (t) => Math.round(((t.was - t.price) / t.was) * 100);

/** A bottom sheet on a phone, a centred card on a desktop. */
function Sheet({ title, onClose, footer, children }) {
  const panel = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
        onMouseDown={(e) => {
          if (!panel.current?.contains(e.target)) onClose();
        }}
      >
        <div ref={panel} role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-surface-line px-4 py-4">
            <h2 className="truncate text-[17px] font-semibold text-ink-900">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-surface-soft">
              <X size={20} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
          <div className="shrink-0 border-t border-surface-line p-4">{footer}</div>
        </div>
      </div>
    </Portal>
  );
}

function Counter({ label, note, value, min, onChange }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[16px] font-medium text-ink-900">{label}</p>
        {note && <p className="text-[14px] text-ink-500">{note}</p>}
      </div>
      <span className="flex items-center rounded-md border border-brand-700">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`One fewer ${label}`} className="grid h-10 w-9 place-items-center text-[20px] font-semibold text-brand-700">-</button>
        <span aria-live="polite" className="w-7 text-center text-[17px] font-medium text-ink-900">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(10, value + 1))} aria-label={`One more ${label}`} className="grid h-10 w-9 place-items-center text-[20px] font-semibold text-brand-700">+</button>
      </span>
    </li>
  );
}

/**
 * Select a Service, and booking it.
 *
 * Book Service asks which branch first when there is more than one, then the
 * day, the time and who is coming, and goes to Review Booking. A place with
 * one branch skips straight to the day.
 *
 * Luxury Experiences uses the same flow with its own words — Select Package,
 * Book Tickets, a price quoted as "From … onwards" — and its own route.
 */
export default function SpaBooking({
  spa,
  dates,
  basePath = '/spa',
  heading = 'Select a Service',
  cta = 'Book Service',
  onwards = false,
}) {
  const router = useRouter();
  const groups = useMemo(() => [...new Set(spa.tickets.map((t) => t.group))], [spa]);
  const [group, setGroup] = useState(groups[0]);
  const [service, setService] = useState(spa.tickets[0].id);
  const [step, setStep] = useState(null);
  const [location, setLocation] = useState(spa.locations[0].id);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [now, setNow] = useState(null);
  useEffect(() => setNow(new Date()), [step]);

  const chosen = spa.tickets.find((t) => t.id === service);
  const start = () => setStep(spa.locations.length > 1 ? 'location' : 'time');

  const gone = (t) => {
    if (day !== 0 || !now) return false;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
  };

  const proceed = () => {
    if (!slot) return;
    router.push(`${basePath}/${spa.id}/book?${new URLSearchParams({
      service, location, date: dates[day], time: slot, adults: String(adults), children: String(children),
    })}`);
  };

  const bar = (
    <>
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2">
          {onwards && <span className="text-[13px] text-ink-900">From</span>}
          <span className="text-[20px] font-bold text-ink-900">{inr(chosen.price)}</span>
          {onwards ? <span className="text-[13px] text-ink-900">onwards</span> : <span className="text-[13px] text-ink-500 line-through">{inr(chosen.was)}</span>}
        </p>
        <p className="text-[12px] text-ink-700">Per Person before taxes &amp; fees</p>
      </div>
      <button type="button" onClick={start} className="btn-primary shrink-0 rounded-lg px-7 py-3.5 text-[15px] normal-case tracking-normal">
        {cta}
      </button>
    </>
  );

  return (
    <>
      <section id="offers" className="card scroll-mt-32 p-4 sm:p-5">
        <h2 className="text-[17px] font-semibold text-ink-900">{heading}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                // Switching group picks its first option, so the bar never
                // quotes a package from the group you just left.
                setGroup(g);
                setService(spa.tickets.find((t) => t.group === g).id);
              }}
              aria-pressed={group === g}
              className={`min-w-[8.5rem] rounded-md border px-5 py-1.5 text-[14px] font-medium transition ${group === g ? 'border-action-500 bg-brand-50 text-action-500' : 'border-ink-400 text-ink-700'}`}
            >
              {g}
            </button>
          ))}
        </div>

        <ul role="radiogroup" aria-label="Service" className="mt-4 divide-y divide-surface-line">
          {spa.tickets.filter((t) => t.group === group).map((t) => {
            const on = t.id === service;
            return (
              <li key={t.id}>
                <label className="flex cursor-pointer gap-4 py-4">
                  <input type="radio" name="service" checked={on} onChange={() => setService(t.id)} className="sr-only" />
                  <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-action-500 bg-action-500' : 'border-action-500'}`}>
                    {on && <Check size={12} strokeWidth={3.5} className="text-white" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium text-ink-900">{t.label}</span>
                    <span className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[15px] font-semibold text-ink-900">From {inr(t.price)}</span>
                      <span className="text-[13px] text-ink-500 line-through">{inr(t.was)}</span>
                      <span className="text-[13px] font-semibold text-action-500">FLAT {pct(t)}% OFF</span>
                    </span>
                    <span className="block text-[12px] text-ink-600">Per Person before taxes &amp; fees</span>
                    {t.desc && <span className="mt-1 block text-[12px] text-ink-600">{t.desc}</span>}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* Desktop: the booking sits under the choice. */}
        <div className="mt-2 hidden items-center gap-4 border-t border-surface-line pt-4 lg:flex">{bar}</div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:hidden">
        <div className="flex items-center gap-4 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          {bar}
        </div>
      </div>

      {step === 'location' && (
        <Sheet
          title="Select Location"
          onClose={() => setStep(null)}
          footer={<button type="button" onClick={() => setStep('time')} className="btn-primary w-full rounded-xl py-3.5 text-[16px] normal-case tracking-normal">Continue</button>}
        >
          <ul role="radiogroup" className="space-y-4 p-4 pt-6">
            {spa.locations.map((l) => {
              const on = l.id === location;
              return (
                <li key={l.id}>
                  <label className={`flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-3.5 ${on ? 'border-action-500' : 'border-surface-line'}`}>
                    <span>
                      <span className="block text-[16px] font-semibold text-ink-900">{l.title}</span>
                      <span className="block text-[12px] text-ink-600">{l.address}</span>
                    </span>
                    <input type="radio" name="location" checked={on} onChange={() => setLocation(l.id)} className="mt-1 h-5 w-5 shrink-0 accent-action-500" />
                  </label>
                </li>
              );
            })}
          </ul>
        </Sheet>
      )}

      {step === 'time' && (
        <Sheet
          title={`Booking at ${spa.name}`}
          onClose={() => setStep(null)}
          footer={
            <button type="button" onClick={proceed} disabled={!slot} className="btn-primary w-full rounded-xl py-3.5 text-[16px] normal-case tracking-normal disabled:opacity-50">
              {slot ? 'Continue' : 'Pick a slot to continue'}
            </button>
          }
        >
          <h3 className="px-4 pt-5 text-[17px] font-semibold text-ink-900">Choose date and time</h3>
          <div role="tablist" aria-label="Day" className="mt-4 flex overflow-x-auto border-b border-surface-line px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {dates.map((d, i) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={day === i}
                onClick={() => {
                  setDay(i);
                  setSlot(null);
                }}
                className={`shrink-0 border-b-[3px] px-3 pb-2 text-center transition ${day === i ? 'border-action-500' : 'border-transparent'}`}
              >
                <span className="block text-[15px] font-semibold text-ink-900">{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : shortDate(d)}</span>
                <span className="block text-[13px] text-ink-500">{weekday(d)}</span>
              </button>
            ))}
          </div>

          <div className="px-4 py-6">
            <h3 className="text-[17px] font-semibold text-ink-900">Available Slots</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {spa.slots.map((t) => (
                <button
                  key={t}
                  type="button"
                  disabled={gone(t)}
                  onClick={() => setSlot(t)}
                  aria-pressed={slot === t}
                  className={`rounded-md border py-3 text-[13px] font-semibold transition disabled:cursor-not-allowed disabled:border-surface-line disabled:text-ink-400/60 ${
                    slot === t ? 'border-brand-700 bg-brand-700 text-white' : 'border-ink-400 text-ink-900 enabled:hover:border-brand-700'
                  }`}
                >
                  {clock(t).replace(/^(\d+) /, '$1:00 ')}
                </button>
              ))}
            </div>

            <h3 className="mt-8 text-[17px] font-semibold text-ink-900">Guests</h3>
            <ul className="mt-4 space-y-5">
              <Counter label="Adults" value={adults} min={1} onChange={setAdults} />
              <Counter label="Children" note="5 - 17 Years Old" value={children} min={0} onChange={setChildren} />
            </ul>
          </div>
        </Sheet>
      )}
    </>
  );
}
