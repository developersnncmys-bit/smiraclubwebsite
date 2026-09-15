'use client';

import { useState } from 'react';
import { ChevronDown, Minus, Plus, User, X } from 'lucide-react';
import { CaptionField, RequestSent, Segmented } from '@/components/forms/RequestFields';
import { cabinClasses, flightOffers, flightTrips } from '@/lib/content';
import { fullDate, weekday } from '@/lib/format';

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => isoDay(new Date());
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return isoDay(d);
};

const TEXT = 'w-full min-w-0 border-0 bg-transparent p-0 text-[14px] font-medium text-ink-900 outline-none placeholder:text-ink-900 sm:text-[15px]';

/** "17 Aug 2026, Fri" over an invisible native date input. */
function DateValue({ value, min, onChange, label }) {
  return (
    <span className="relative block">
      <span className="block truncate text-[13px] font-medium text-ink-900 sm:text-[15px]">
        {fullDate(value)}, {weekday(value)}
      </span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        aria-label={label}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </span>
  );
}

/**
 * Flight Search.
 *
 * Online booking is not live, so this collects the trip and sends it to the
 * travel desk as a request — the note under the form says so plainly. One
 * Way, Round Trip and Multicity are real: Add Return Date turns a one-way into
 * a round trip, and Multicity adds legs.
 */
export default function FlightSearch() {
  const [trip, setTrip] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [depart, setDepart] = useState(inDays(7));
  const [back, setBack] = useState(inDays(10));
  const [legs, setLegs] = useState([{ from: '', to: '', date: inDays(7) }, { from: '', to: '', date: inDays(10) }]);
  const [travellers, setTravellers] = useState(1);
  const [cabin, setCabin] = useState(cabinClasses[0]);
  const [offer, setOffer] = useState('student');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const setLeg = (i, key, value) => setLegs((all) => all.map((l, n) => (n === i ? { ...l, [key]: value } : l)));

  const submit = (e) => {
    e.preventDefault();
    const route = trip === 'multi' ? legs : [{ from, to, date: depart }];
    if (route.some((l) => !l.from.trim() || !l.to.trim())) {
      setError('Tell us where you are flying from and to.');
      return;
    }
    if (route.some((l) => l.from.trim().toLowerCase() === l.to.trim().toLowerCase())) {
      setError('The two cities are the same.');
      return;
    }
    if (trip === 'round' && back < depart) {
      setError('The return date is before the departure.');
      return;
    }
    setError('');
    setSent(true);
  };

  if (sent) {
    return (
      <RequestSent
        body="Your flight request is with our travel desk. We will call you on your registered number with fares within one working day."
        onReset={() => setSent(false)}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <Segmented options={flightTrips} value={trip} onChange={setTrip} label="Trip type" className="lg:max-w-xl" />

      {trip === 'multi' ? (
        <div className="space-y-4">
          {legs.map((leg, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="space-y-3 rounded-2xl border border-surface-line p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold uppercase tracking-wide text-ink-500">Flight {i + 1}</p>
                {legs.length > 2 && (
                  <button type="button" onClick={() => setLegs((all) => all.filter((_, n) => n !== i))} aria-label={`Remove flight ${i + 1}`} className="text-ink-500">
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                <CaptionField icon="MapPin" caption="Travelling From">
                  <input value={leg.from} onChange={(e) => setLeg(i, 'from', e.target.value)} placeholder="City or airport" aria-label={`Flight ${i + 1} from`} className={TEXT} />
                </CaptionField>
                <CaptionField icon="MapPin" caption="Travelling To">
                  <input value={leg.to} onChange={(e) => setLeg(i, 'to', e.target.value)} placeholder="City or airport" aria-label={`Flight ${i + 1} to`} className={TEXT} />
                </CaptionField>
                <CaptionField icon="Calendar" caption="Departure Date">
                  <DateValue value={leg.date} min={i ? legs[i - 1].date : today()} onChange={(v) => setLeg(i, 'date', v)} label={`Flight ${i + 1} date`} />
                </CaptionField>
              </div>
            </div>
          ))}
          {legs.length < 5 && (
            <button
              type="button"
              onClick={() => setLegs((all) => [...all, { from: all[all.length - 1].to, to: '', date: all[all.length - 1].date }])}
              className="text-[15px] font-semibold text-action-500"
            >
              + Add Another Flight
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-4">
          <CaptionField icon="MapPin" caption="Travelling From" className="lg:col-span-2">
            <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="New Delhi, India" aria-label="Travelling from" className={TEXT} />
          </CaptionField>
          <CaptionField icon="MapPin" caption="Travelling To" className="lg:col-span-2">
            <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Bali, Indonesia" aria-label="Travelling to" className={TEXT} />
          </CaptionField>

          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <CaptionField icon="Calendar" caption="Departure Date">
              <DateValue value={depart} min={today()} onChange={(v) => { setDepart(v); if (back < v) setBack(v); }} label="Departure date" />
            </CaptionField>
            {trip === 'round' ? (
              <CaptionField caption="Return Date">
                <DateValue value={back} min={depart} onChange={setBack} label="Return date" />
              </CaptionField>
            ) : (
              <button type="button" onClick={() => setTrip('round')} className="rounded-xl border border-surface-line bg-white p-3 text-left">
                <span className="block text-[15px] font-semibold text-action-500">+ Add Return Date</span>
                <span className="block text-[12px] text-ink-900">Save more on round trips!</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <TravellersField value={travellers} onChange={setTravellers} />
            <CabinField value={cabin} onChange={setCabin} />
          </div>
        </div>
      )}

      {trip === 'multi' && (
        <div className="grid grid-cols-2 gap-3 lg:max-w-xl">
          <TravellersField value={travellers} onChange={setTravellers} />
          <CabinField value={cabin} onChange={setCabin} />
        </div>
      )}

      {/* -- Special offers ------------------------------------------------ */}
      <p className="pt-4 text-[15px] font-medium uppercase text-ink-900">Special Offers</p>
      <div className="rail gap-2.5">
        {flightOffers.map((o) => {
          const on = offer === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setOffer(on ? null : o.key)}
              aria-pressed={on}
              className={`w-[11.5rem] shrink-0 rounded-md border px-2.5 py-2 text-left transition ${
                on ? 'border-action-500 bg-[#e8f0fe]' : 'border-surface-line bg-white hover:border-ink-400'
              }`}
            >
              <span className={`block text-[15px] ${on ? 'font-semibold text-action-500' : 'text-ink-700'}`}>{o.label}</span>
              <span className={`block text-[12px] ${on ? 'text-ink-900' : 'text-action-500'}`}>{o.note}</span>
            </button>
          );
        })}
      </div>

      {error && <p role="alert" className="text-[14px] font-medium text-red-600">{error}</p>}

      <button type="submit" className="btn-primary mt-3 w-full rounded-xl py-3.5 text-[16px] normal-case tracking-normal lg:w-auto lg:px-16">
        Send Request
      </button>
    </form>
  );
}

function TravellersField({ value, onChange }) {
  return (
    <CaptionField icon="User" caption="Travellers">
      <span className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="One fewer traveller" className="grid h-6 w-6 place-items-center rounded-full border border-surface-line text-ink-700 disabled:opacity-40">
          <Minus size={12} />
        </button>
        <span className="flex items-center gap-1 text-[15px] font-medium text-ink-900" aria-live="polite">
          {value} <User size={14} fill="currentColor" />
        </span>
        <button type="button" onClick={() => onChange(Math.min(9, value + 1))} aria-label="One more traveller" className="grid h-6 w-6 place-items-center rounded-full border border-surface-line text-ink-700">
          <Plus size={12} />
        </button>
      </span>
    </CaptionField>
  );
}

function CabinField({ value, onChange }) {
  return (
    <CaptionField caption="Cabin Class">
      <span className="relative block">
        <span className="flex items-center gap-1 truncate text-[13px] font-medium text-ink-900 sm:text-[15px]">
          <span className="truncate">{value}</span>
          <ChevronDown size={14} className="shrink-0 text-ink-500" />
        </span>
        <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Cabin class" className="absolute inset-0 cursor-pointer opacity-0">
          {cabinClasses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </span>
    </CaptionField>
  );
}
