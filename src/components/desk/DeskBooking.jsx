'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, Mail, Phone, User } from 'lucide-react';
import { FormField, INPUT } from '@/components/forms/RequestFields';
import { api } from '@/lib/api';
import { readAttribution } from '@/components/layout/Attribution';
import { profileForBooking, useProfile } from '@/lib/profile';
import { inr } from '@/lib/format';

/**
 * Booking something the desk sells.
 *
 * The same road every other booking on the site takes: it lands on the
 * panel's Booking page, pending, with a lead beside it. A member's booking
 * comes back confirmed and everybody else's comes back as a request, which
 * is what the confirmation screen then says.
 */

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return isoDay(d);
};

/** A stay is booked over nights; everything else is booked for a day. */
const STAYS = ['Hotels', 'Villas', 'Packages'];

export default function DeskBooking({ item }) {
  const router = useRouter();
  const formRef = useRef(null);
  const overnight = STAYS.includes(item.category);

  const [from, setFrom] = useState(tomorrow);
  const [to, setTo] = useState('');
  const [pax, setPax] = useState(2);
  const [who, setWho] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');

  // The saved profile fills in who is going, so a member types nothing twice.
  const { ready, profile } = useProfile();
  useEffect(() => {
    if (!ready || !profile?.details) return;
    const d = profile.details;
    setWho((w) => (w.name || w.email || w.phone ? w : { name: d.name || '', email: d.email || '', phone: d.phone || '' }));
  }, [ready, profile]);

  const nights = (() => {
    if (!overnight || !to) return 0;
    const a = new Date(from);
    const b = new Date(to);
    return Math.max(0, Math.round((b - a) / 86400000));
  })();

  const total = item.price > 0 ? item.price * (overnight ? Math.max(1, nights) : Math.max(1, pax)) : 0;

  const book = async () => {
    if (busy) return;

    const found = {};
    if (!from) found.from = overnight ? 'Pick your check-in.' : 'Pick a date.';
    if (overnight && !to) found.to = 'Pick your check-out.';
    if (overnight && to && nights < 1) found.to = 'Check-out has to be after check-in.';
    if (!who.name.trim()) found.name = 'Tell us who this is for.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(who.email.trim())) found.email = 'That email does not look right.';
    if (!/^\d{10}$/.test(who.phone.replace(/\D/g, ''))) found.phone = 'A 10-digit mobile number, please.';
    setErrors(found);
    if (Object.keys(found).length) return formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setBusy(true);
    setFailed('');
    try {
      const res = await api.websiteBooking({
        name: who.name,
        phone: who.phone,
        email: who.email,
        total,
        kind: 'stay',
        itemName: item.name,
        destination: item.place,
        checkIn: from,
        checkOut: overnight ? to : undefined,
        nights: overnight ? `${Math.max(1, nights)} night${nights === 1 ? '' : 's'}` : undefined,
        pax,
        notes: `${item.category} · ${item.id}`,
        profile: profileForBooking(profile),
        attribution: readAttribution(),
      });
      const outcome = res.data?.status === 'Confirmed' ? 'confirmed' : 'requested';
      const ref = res.data?.reference || '';
      router.push(
        `/booking/confirmed?kind=stay&name=${encodeURIComponent(item.name)}&ref=${encodeURIComponent(ref)}&status=${outcome}`,
      );
    } catch (err) {
      setBusy(false);
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
  };

  return (
    <section ref={formRef} id="book" className="card scroll-mt-24 p-4 sm:p-5">
      <h2 className="text-lg font-bold text-ink-900">Book {item.name}</h2>
      <p className="mt-1 text-[13px] text-ink-500">
        Our travel desk confirms every booking before anything is charged.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FormField label={overnight ? 'Check-in' : 'Date'} required icon={CalendarDays} error={errors.from}>
          <input type="date" min={isoDay(new Date())} value={from} onChange={(e) => setFrom(e.target.value)} className={INPUT} />
        </FormField>

        {overnight ? (
          <FormField label="Check-out" required icon={CalendarDays} error={errors.to}>
            <input type="date" min={from} value={to} onChange={(e) => setTo(e.target.value)} className={INPUT} />
          </FormField>
        ) : (
          <FormField label="Guests" icon={User}>
            <input
              type="number"
              min="1"
              max="50"
              value={pax}
              onChange={(e) => setPax(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              className={INPUT}
            />
          </FormField>
        )}

        <FormField label="Full name" required icon={User} error={errors.name}>
          <input value={who.name} onChange={(e) => setWho((w) => ({ ...w, name: e.target.value }))} placeholder="Enter your full name" className={INPUT} />
        </FormField>

        <FormField label="Email" required icon={Mail} error={errors.email}>
          <input type="email" value={who.email} onChange={(e) => setWho((w) => ({ ...w, email: e.target.value }))} placeholder="Enter your email" className={INPUT} />
        </FormField>

        <FormField label="Mobile number" required icon={Phone} error={errors.phone} className="sm:col-span-2">
          <input type="tel" inputMode="numeric" value={who.phone} onChange={(e) => setWho((w) => ({ ...w, phone: e.target.value }))} placeholder="10-digit mobile number" className={INPUT} />
        </FormField>
      </div>

      {total > 0 && (
        <p className="mt-4 flex items-baseline justify-between border-t border-surface-line pt-4 text-[15px]">
          <span className="text-ink-600">
            {overnight ? `${Math.max(1, nights)} night${nights === 1 ? '' : 's'}` : `${pax} guest${pax === 1 ? '' : 's'}`} at the member price
          </span>
          <span className="text-xl font-extrabold text-ink-900">{inr(total)}</span>
        </p>
      )}

      {failed && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
          {failed}
        </p>
      )}

      <button
        type="button"
        onClick={book}
        disabled={busy}
        className="btn-primary mt-4 w-full rounded-xl py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60"
      >
        {busy ? 'Sending…' : 'Request this booking'}
      </button>
    </section>
  );
}
