'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import GuidelinesSheet from '@/components/offers/GuidelinesSheet';
import { INPUT } from '@/components/forms/RequestFields';
import { fullDate, inr, weekday } from '@/lib/format';
import { api } from '@/lib/api';

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Group tickets are sold to ten or more, so their counter starts there. */
const minFor = (t) => (t.id.includes('group') ? 10 : 1);
const offOf = (t) => Math.round(((t.was - t.price) / t.was) * 100);

function Stepper({ value, onDec, onInc, label }) {
  return (
    <span className="flex shrink-0 items-center rounded-lg border border-brand-700">
      <button type="button" onClick={onDec} aria-label={`One fewer ${label}`} className="grid h-9 w-9 place-items-center text-[18px] font-semibold text-brand-700">-</button>
      <span aria-live="polite" className="w-7 text-center text-[15px] font-bold text-ink-900">{value}</span>
      <button type="button" onClick={onInc} aria-label={`One more ${label}`} className="grid h-9 w-9 place-items-center text-[18px] font-semibold text-brand-700">+</button>
    </span>
  );
}

/**
 * Everything on a park page a member acts on: the day, the tickets, the
 * price, and who is going — with the page's reading matter (`children`)
 * between the tickets and the price, as drawn.
 *
 * The summary is worked from the ticket prices shown, so it cannot disagree
 * with them: Sub Total at the listed price, the member discount as the
 * difference, and the total as what the tickets actually cost.
 *
 * No payment step exists yet, so Book Ticket validates and goes straight to
 * the confirmation screen.
 */
export default function ParkBooking({ park, tickets, children }) {
  const router = useRouter();
  const formRef = useRef(null);
  const ticketsRef = useRef(null);

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return isoDay(d);
  });
  const [qty, setQty] = useState({});
  const [guide, setGuide] = useState(false);
  const [who, setWho] = useState('myself');
  const [guests, setGuests] = useState([{ name: '', email: '', phone: '' }]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');

  const chosen = tickets.filter((t) => qty[t.id]);
  const sub = chosen.reduce((s, t) => s + qty[t.id] * t.was, 0);
  const total = chosen.reduce((s, t) => s + qty[t.id] * t.price, 0);
  const discount = sub - total;

  const change = (t, dir) =>
    setQty((q) => {
      const now = q[t.id] || 0;
      const next = dir > 0 ? (now ? now + 1 : minFor(t)) : now - 1 < minFor(t) ? 0 : now - 1;
      return { ...q, [t.id]: Math.min(next, 50) };
    });

  const setGuest = (i, key, value) => setGuests((all) => all.map((g, n) => (n === i ? { ...g, [key]: value } : g)));

  const book = async () => {
    if (busy) return;
    const found = {};
    if (!chosen.length) found.tickets = 'Select at least one ticket.';
    const lead = guests[0];
    if (!lead.name.trim()) found.name = 'Tell us who is going.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email.trim())) found.email = 'That email does not look right.';
    if (!/^\d{10}$/.test(lead.phone.replace(/\D/g, ''))) found.phone = 'A 10-digit mobile number, please.';
    setErrors(found);

    if (found.tickets) return ticketsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (Object.keys(found).length) return formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const slot = `${weekday(date)}, ${fullDate(date)}`;
    const nights = chosen.map((t) => `${qty[t.id]} × ${t.summary}`).join(', ');
    const pax = chosen.reduce((s, t) => s + qty[t.id], 0);

    // The desk has to have it before we say it is booked.
    setBusy(true);
    setFailed('');
    let ref;
    try {
      const res = await api.websiteBooking({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        guests: guests.filter((g) => g.name.trim() || g.email.trim() || g.phone.trim()),
        total,
        kind: 'park',
        itemName: park.name,
        slot,
        nights,
        pax,
      });
      ref = res.data?.reference;
    } catch (err) {
      setBusy(false);
      setFailed(err?.status ? err.message : 'We could not reach our travel desk just now. Please try again in a moment.');
      return;
    }

    router.push(`/booking/confirmed?${new URLSearchParams({
      ref,
      status: 'requested',
      kind: 'park',
      name: park.name,
      slot: `${weekday(date)}, ${fullDate(date)}`,
      nights: chosen.map((t) => `${qty[t.id]} × ${t.summary}`).join(', '),
      total: String(total),
    })}`);
  };

  const [open, close] = park.hours.split(' - ');
  const short = (t) => t.replace(':00', '');

  const summaryRows = (
    <>
      {chosen.map((t) => (
        <div key={t.id} className="flex justify-between gap-4 py-1.5 text-[14px]">
          <dt className="text-ink-700">{t.summary}</dt>
          <dd className="shrink-0 font-medium text-ink-900">{qty[t.id]} X {inr(t.price)}</dd>
        </div>
      ))}
    </>
  );

  return (
    <>
      <div className="shell grid grid-cols-1 gap-4 py-4 lg:grid-cols-12 lg:gap-x-8 lg:py-8">
        <div className="min-w-0 space-y-4 lg:col-span-8">
          {/* -- Visit day -------------------------------------------------- */}
          <section id="tickets" className="scroll-mt-32">
            <h2 className="text-[16px] font-bold text-ink-900">Select Your Visit Day</h2>
            <div className="card mt-3 flex items-center gap-3 p-3.5">
              <Calendar size={20} className="shrink-0 text-ink-900" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-ink-900">{weekday(date)}, {fullDate(date)}</p>
                <p className="text-[13px] text-ink-600">{short(open)} - {short(close)}</p>
              </div>
              <label className="relative shrink-0 cursor-pointer rounded-lg border border-action-500 px-4 py-1.5 text-[13px] font-semibold text-action-500">
                Change
                <input
                  type="date"
                  value={date}
                  min={isoDay(new Date())}
                  onChange={(e) => e.target.value && setDate(e.target.value)}
                  aria-label="Visit day"
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
            </div>
          </section>

          {/* -- Tickets ---------------------------------------------------- */}
          <section ref={ticketsRef} className="scroll-mt-32">
            <h2 className="text-[16px] font-bold text-ink-900">Select Ticket Type</h2>
            {errors.tickets && <p role="alert" className="mt-2 text-[13px] font-medium text-red-600">{errors.tickets}</p>}
            <ul className="mt-3 divide-y divide-surface-line rounded-2xl bg-white shadow-card">
              {tickets.map((t) => (
                <li key={t.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold leading-snug text-ink-900">{t.name}</h3>
                      <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[15px] font-bold text-ink-900">{inr(t.price)}</span>
                        <span className="text-[13px] text-ink-500 line-through">{inr(t.was)}</span>
                        <span className="text-[13px] font-bold text-green-600">FLAT {offOf(t)}% OFF</span>
                      </p>
                    </div>
                    {qty[t.id] ? (
                      <Stepper value={qty[t.id]} onDec={() => change(t, -1)} onInc={() => change(t, 1)} label={t.summary} />
                    ) : (
                      <button type="button" onClick={() => change(t, 1)} className="shrink-0 rounded-lg bg-action-500 px-5 py-2 text-[13px] font-semibold text-white hover:bg-action-600">
                        Select
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-[13px] leading-snug text-ink-700">{t.note}</p>
                  {t.extra && <p className="mt-1.5 text-[13px] leading-snug text-ink-700">{t.extra}</p>}
                  <button type="button" onClick={() => setGuide(true)} className="mt-2 text-[13px] font-semibold text-action-500 underline">
                    View Guidelines
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {children}

          {/* -- Price Summary ---------------------------------------------- */}
          <section className="card p-4 sm:p-5">
            <h2 className="text-[16px] font-bold text-ink-900">Price Summary</h2>
            {chosen.length === 0 ? (
              <p className="mt-3 text-[14px] text-ink-500">Select a ticket above to see the price.</p>
            ) : (
              <dl className="mt-3">
                {summaryRows}
                <div className="mt-2 flex justify-between border-t border-dashed border-surface-line pt-3 text-[14px]">
                  <dt className="font-semibold text-ink-900">Sub Total</dt>
                  <dd className="font-semibold text-ink-900">{inr(sub)}</dd>
                </div>
                <div className="flex justify-between py-2 text-[14px]">
                  <dt className="text-green-600">Discount By Smira Club</dt>
                  <dd className="font-semibold text-green-600">-{inr(discount)}</dd>
                </div>
                <div className="flex justify-between border-t border-dashed border-surface-line pt-3">
                  <dt>
                    <span className="block text-[15px] font-bold text-ink-900">Total Amount to be paid</span>
                    <span className="block text-[12px] text-ink-500">Inclusive of all taxes</span>
                  </dt>
                  <dd className="text-[16px] font-bold text-ink-900">{inr(total)}</dd>
                </div>
              </dl>
            )}
          </section>

          {/* -- Who is going ----------------------------------------------- */}
          <section ref={formRef} className="card scroll-mt-32 p-4 sm:p-5">
            <h2 className="text-[16px] font-bold text-ink-900">I am booking for</h2>
            <div role="radiogroup" className="mt-3 flex gap-6">
              {[['myself', 'Myself'], ['else', 'Someone Else']].map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 text-[14px] text-ink-900">
                  <input type="radio" name="who" checked={who === key} onChange={() => setWho(key)} className="h-4 w-4 accent-action-500" />
                  {label}
                </label>
              ))}
            </div>

            <div className="mt-4 space-y-6">
              {guests.map((g, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="grid gap-4 lg:grid-cols-3">
                  {i > 0 && <p className="text-[13px] font-bold uppercase tracking-wide text-ink-500 lg:col-span-3">Guest {i + 1}</p>}
                  <label className="block">
                    <span className="text-[14px] font-semibold text-ink-900">Full Name {i === 0 && <span className="text-red-500">*</span>}</span>
                    <span className="relative mt-2 block">
                      <User size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                      <input value={g.name} onChange={(e) => setGuest(i, 'name', e.target.value)} placeholder="Enter your full name" className={`${INPUT} pl-11`} />
                    </span>
                    {i === 0 && errors.name && <span className="mt-1.5 block text-[13px] text-red-600">{errors.name}</span>}
                  </label>
                  <label className="block">
                    <span className="text-[14px] font-semibold text-ink-900">Email ID {i === 0 && <span className="text-red-500">*</span>}</span>
                    <span className="relative mt-2 block">
                      <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
                      <input type="email" value={g.email} onChange={(e) => setGuest(i, 'email', e.target.value)} placeholder="Enter your Email ID" className={`${INPUT} pl-11`} />
                    </span>
                    {i === 0 && errors.email && <span className="mt-1.5 block text-[13px] text-red-600">{errors.email}</span>}
                  </label>
                  <label className="block">
                    <span className="text-[14px] font-semibold text-ink-900">Contact Number {i === 0 && <span className="text-red-500">*</span>}</span>
                    <span className="relative mt-2 flex">
                      <span className="flex items-center rounded-l-xl border border-r-0 border-surface-line bg-white px-3 text-[14px] text-ink-900">
                        <Phone size={15} className="mr-1.5 text-ink-500" />+91
                      </span>
                      <input type="tel" inputMode="numeric" value={g.phone} onChange={(e) => setGuest(i, 'phone', e.target.value)} placeholder="Enter your  Mobile Number" className={`${INPUT} rounded-l-none`} />
                    </span>
                    {i === 0 && errors.phone && <span className="mt-1.5 block text-[13px] text-red-600">{errors.phone}</span>}
                  </label>
                </div>
              ))}
            </div>

            {guests.length < 10 && (
              <button type="button" onClick={() => setGuests((all) => [...all, { name: '', email: '', phone: '' }])} className="mt-4 text-[14px] font-semibold text-action-500">
                + Add Another Guest
              </button>
            )}
          </section>

        </div>

        {/* -- Desktop rail --------------------------------------------------- */}
        <aside className="hidden lg:col-span-4 lg:block lg:self-start lg:sticky lg:top-32">
          <div className="card p-5">
            <p className="text-[16px] font-bold text-ink-900">{park.name}</p>
            <p className="text-[13px] text-ink-600">{weekday(date)}, {fullDate(date)}</p>
            <dl className="mt-4 border-t border-surface-line pt-3">
              {chosen.length ? summaryRows : <p className="py-1.5 text-[14px] text-ink-500">No tickets selected yet.</p>}
            </dl>
            <div className="mt-3 flex items-end justify-between border-t border-surface-line pt-3">
              <div>
                <p className="text-xl font-extrabold text-ink-900">{inr(total)}</p>
                <p className="text-[12px] text-ink-500">Inclusive of all taxes</p>
              </div>
            </div>
            {failed && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-medium text-red-600">{failed}</p>}
            <button type="button" onClick={book} disabled={busy} className="btn-primary mt-4 w-full rounded-lg py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60">
              {busy ? 'Sending…' : 'Book Ticket'}
            </button>
          </div>
        </aside>
      </div>

      {/* -- Phone bar -------------------------------------------------------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:hidden">
        {failed && <p role="alert" className="px-4 pt-2 text-[13px] font-medium text-red-600">{failed}</p>}
        <div className="flex items-center gap-4 px-4 py-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-extrabold text-ink-900">{inr(total)}</p>
            <p className="text-[12px] text-ink-600">Inclusive of all taxes</p>
          </div>
          <button type="button" onClick={book} disabled={busy} className="btn-primary shrink-0 rounded-lg px-10 py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60">
            {busy ? 'Sending…' : 'Book Ticket'}
          </button>
        </div>
      </div>

      <GuidelinesSheet open={guide} onClose={() => setGuide(false)} />
    </>
  );
}
