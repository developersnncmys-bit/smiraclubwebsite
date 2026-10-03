'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, MessageSquareWarning } from 'lucide-react';
import { api } from '@/lib/api';
import { readAttribution } from '@/components/layout/Attribution';
import { loadProfile, profileForBooking, useProfile } from '@/lib/profile';

/**
 * Telling the desk something has gone wrong.
 *
 * Get Help could look a booking up and give you a phone number, which is
 * no use at eleven at night and leaves no record either way. This opens a
 * ticket on the desk's own Support / Complaints board, with the SLA clock
 * running from the moment it is sent — so a complaint raised at midnight
 * is already counting when they open.
 *
 * What a visitor sets is what a visitor knows: the kind of problem, what
 * happened, and which booking it is about. How urgent it is and who picks
 * it up are the desk's to decide.
 */

const CATEGORIES = [
  'Booking',
  'Membership',
  'Payment',
  'Hotel or partner',
  'Customer service',
  'Gift or reward',
];

const FIELD =
  'mt-2 w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

export default function RaiseComplaint() {
  const { profile } = useProfile();
  const [form, setForm] = useState({ category: 'Booking', reference: '', description: '' });
  const [who, setWho] = useState({ name: '', phone: '', email: '' });
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const [done, setDone] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setMe = (key) => (e) => setWho((w) => ({ ...w, [key]: e.target.value }));

  // Whatever the profile already knows, so a member types the problem and
  // nothing else; anyone else fills in the three boxes underneath.
  const saved = profile?.details || {};
  const name = who.name || saved.name || '';
  const phone = who.phone || saved.phone || '';
  const email = who.email || saved.email || '';

  const send = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (form.description.trim().length < 10) {
      return setFailed('Tell us a little more about what happened.');
    }
    setBusy(true);
    setFailed('');
    try {
      const current = profile || loadProfile();
      const res = await api.raiseComplaint({
        name,
        phone,
        email: email || undefined,
        category: form.category,
        reference: form.reference.trim() || undefined,
        description: form.description.trim(),
        profile: current ? profileForBooking(current) : undefined,
        attribution: readAttribution(),
      });
      setDone(res.data || {});
    } catch (err) {
      setFailed(err?.status ? err.message : 'We could not reach our desk just now. Please try again in a moment.');
    }
    setBusy(false);
  };

  if (done) {
    return (
      <section className="card mt-8 p-5">
        <p className="flex items-center gap-2 text-[16px] font-bold text-green-700">
          <CheckCircle2 size={19} /> Our desk has it
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-700">
          Your complaint is <span className="num font-bold text-ink-900">{done.reference}</span>.
          Quote that number if you call. Somebody will come back to you — the
          desk works to a clock on these, and it started when you pressed send.
        </p>
        <button
          type="button"
          onClick={() => { setDone(null); setForm({ category: 'Booking', reference: '', description: '' }); }}
          className="mt-4 text-[14px] font-bold text-action-500"
        >
          Raise another
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={send} className="card mt-8 p-5">
      <h2 className="flex items-center gap-2 text-xl font-bold text-ink-900">
        <MessageSquareWarning size={20} className="text-action-500" />
        Something gone wrong?
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
        Tell us and it goes straight to our support desk, not an inbox.
      </p>

      <label className="mt-5 block">
        <span className="text-[15px] font-bold text-ink-900">What is it about?</span>
        <select value={form.category} onChange={set('category')} className={FIELD}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-[15px] font-bold text-ink-900">
          Booking ID <span className="font-normal text-ink-500">(if it is about one)</span>
        </span>
        <input
          value={form.reference}
          onChange={set('reference')}
          placeholder="BKG-8889"
          className={FIELD}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-[15px] font-bold text-ink-900">What happened?</span>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={4}
          placeholder="Tell us as much as you can — dates, who you spoke to, what went wrong."
          className={`${FIELD} resize-y`}
        />
      </label>

      {/* Only asked for when the profile does not already hold it. */}
      {!saved.name && (
        <label className="mt-4 block">
          <span className="text-[15px] font-bold text-ink-900">Your name</span>
          <input value={who.name} onChange={setMe('name')} className={FIELD} />
        </label>
      )}
      {!saved.phone && (
        <label className="mt-4 block">
          <span className="text-[15px] font-bold text-ink-900">Mobile number</span>
          <input
            value={who.phone}
            onChange={setMe('phone')}
            inputMode="numeric"
            placeholder="10-digit number"
            className={FIELD}
          />
        </label>
      )}
      {!saved.email && (
        <label className="mt-4 block">
          <span className="text-[15px] font-bold text-ink-900">
            Email <span className="font-normal text-ink-500">(optional)</span>
          </span>
          <input value={who.email} onChange={setMe('email')} type="email" className={FIELD} />
        </label>
      )}

      {failed && <p className="mt-4 text-[14px] font-semibold text-rose-600">{failed}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-4 text-[15px] font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {busy && <Loader2 size={17} className="animate-spin" />}
        {busy ? 'Sending…' : 'Send to the desk'}
      </button>
    </form>
  );
}
