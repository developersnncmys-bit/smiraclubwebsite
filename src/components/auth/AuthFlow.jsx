'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarHeart, Check, Gift, Phone, ShieldCheck, User } from 'lucide-react';
import { api } from '@/lib/api';
import { loadProfile, saveProfile } from '@/lib/profile';
import { saveMembership } from '@/lib/membership';
import { setSessionToken } from '@/lib/session';

/**
 * The way in, wherever it is shown.
 *
 * One form, as the design draws it: a name and a number, then the code sent
 * to that number. There is nothing to choose between — the number is the
 * account, so the same form signs an old member in and opens a new one. A
 * number the desk has not seen is asked for its special days here as well, so
 * nobody is ever sent off to a half-empty profile screen to finish signing up.
 *
 * The popup and the /login page both render this; each says in `onDone` what
 * should happen once somebody is in.
 */

const tenDigits = (v) => String(v || '').replace(/\D/g, '').slice(-10);
const dayOf = (v) => (v ? String(v).slice(0, 10) : '');

/** The desk's fields laid onto the shape Complete Your Profile saves. */
function profileFrom(member, existing, typedName) {
  const [line1 = '', ...rest] = String(member.address || '').split(',').map((s) => s.trim());
  const name = member.name || typedName || existing?.details?.name || '';
  return {
    ...(existing || {}),
    details: {
      name,
      email: member.email || existing?.details?.email || '',
      phone: member.phone || existing?.details?.phone || '',
    },
    birthdays: member.dob
      ? [{ name, dob: dayOf(member.dob), relationship: 'Self' }]
      : existing?.birthdays || [{ name: '', dob: '', relationship: '' }],
    anniversary: member.anniversary
      ? { date: dayOf(member.anniversary), years: '' }
      : existing?.anniversary || { date: '', years: '' },
    address: {
      ...(existing?.address || { line1: '', line2: '', city: '', state: 'Karnataka', pincode: '', useForAll: true }),
      ...(line1 ? { line1, line2: rest.join(', ') } : {}),
      ...(member.city ? { city: member.city } : {}),
    },
  };
}

/** A field the way the design draws it: label above, icon inside. */
function Field({ label, required, icon: Glyph, children }) {
  return (
    <label className="block">
      <span className="text-[14px] font-semibold text-ink-900">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <span className="relative mt-2 block">
        {Glyph && <Glyph size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />}
        {children}
      </span>
    </label>
  );
}

/** A square tick, as the design has it. */
function Tick({ on, onChange, children }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex w-full items-start gap-3 text-left">
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition ${
          on ? 'border-action-500 bg-action-500 text-white' : 'border-surface-line bg-white'
        }`}
      >
        {on && <Check size={13} strokeWidth={3.5} />}
      </span>
      <span className="text-[13px] leading-snug text-ink-700">{children}</span>
    </button>
  );
}

const INPUT =
  'w-full rounded-xl border border-surface-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

export default function AuthFlow({ onDone, footer, autoFocus = false }) {
  const [step, setStep] = useState('who');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [wants, setWants] = useState({ whatsapp: true, gift: true });
  const [days, setDays] = useState({ dob: '', anniversary: '', years: '' });
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const codeBox = useRef(null);
  const nameBox = useRef(null);

  useEffect(() => {
    if (step === 'code') codeBox.current?.focus();
    else if (step === 'who' && autoFocus) nameBox.current?.focus();
  }, [step, autoFocus]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setDay = (key) => (e) => setDays((d) => ({ ...d, [key]: e.target.value }));

  const askForCode = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (form.name.trim().length < 2) return setFailed('Tell us your name.');
    if (!/^[6-9]\d{9}$/.test(tenDigits(form.phone))) return setFailed('Enter your 10-digit mobile number.');
    setBusy(true);
    setFailed('');
    try {
      const res = await api.memberOtpRequest(form.phone);
      setDemoCode(res.data?.devCode || '');
      setStep('code');
    } catch (err) {
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
    setBusy(false);
  };

  /** The code proves the number, and brings back whatever the desk holds. */
  const verify = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (code.replace(/\D/g, '').length !== 6) return setFailed('Enter the 6-digit code.');
    setBusy(true);
    setFailed('');
    try {
      const res = await api.memberVerify(form.phone, code);
      const { member, membership, token, isNew } = res.data || {};
      setSessionToken(token || '');
      const digits = tenDigits(form.phone);
      const saved = profileFrom(
        { ...(member || {}), phone: member?.phone || `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` },
        loadProfile(),
        form.name.trim(),
      );
      saveProfile({ ...saved, whatsapp: wants.whatsapp });
      if (membership) {
        saveMembership({
          plan: membership.plan,
          reference: membership.reference,
          since: new Date().toISOString(),
          expiresOn: membership.expiresOn,
          status: membership.status,
        });
      }
      setBusy(false);
      // Somebody new finishes right here; somebody we know is already in.
      if (isNew || !member?.name) setStep('days');
      else onDone();
    } catch (err) {
      setBusy(false);
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
  };

  /** The special days, and then they are in. */
  const finish = (e) => {
    e?.preventDefault();
    const existing = loadProfile() || {};
    const name = existing.details?.name || form.name.trim() || 'Me';
    saveProfile({
      ...existing,
      ...(days.dob ? { birthdays: [{ name, dob: days.dob, relationship: 'Self' }] } : {}),
      ...(days.anniversary ? { anniversary: { date: days.anniversary, years: days.years } } : {}),
    });
    onDone();
  };

  const heading =
    step === 'code' ? 'Enter the code' : step === 'days' ? 'A little about you' : 'Welcome to Smira Club';
  const under =
    step === 'code'
      ? `We sent a 6-digit code to ${form.phone}.`
      : step === 'days'
        ? 'We will help you celebrate your beautiful journey together'
        : 'Login or create account to continue';

  return (
    <>
      <h2 className="text-center text-[22px] font-bold text-ink-900">{heading}</h2>
      <p className="mt-1.5 text-center text-[15px] text-ink-500">{under}</p>

      <form onSubmit={step === 'who' ? askForCode : step === 'code' ? verify : finish} className="mt-5 space-y-4">
        {step === 'who' && (
          <>
            <Field label="Your Name" required icon={User}>
              <input
                ref={nameBox}
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                placeholder="Enter your full name"
                className={INPUT}
              />
            </Field>

            <Field label="Contact Number" required icon={Phone}>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="Enter your Mobile Number"
                className={INPUT}
              />
            </Field>

            <div className="space-y-3 pt-1">
              <Tick on={wants.whatsapp} onChange={(v) => setWants((w) => ({ ...w, whatsapp: v }))}>
                Receive Whatsapp updates about exclusive offers, new destinations &amp; more
              </Tick>
              <Tick on={wants.gift} onChange={(v) => setWants((w) => ({ ...w, gift: v }))}>
                Claim Your Gift
              </Tick>
            </div>
          </>
        )}

        {step === 'code' && (
          <>
            <input
              ref={codeBox}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit code"
              aria-label="Verification code"
              className="w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-center text-[20px] font-bold tracking-[0.4em] text-ink-900 outline-none transition focus:border-action-500"
            />
            {demoCode && (
              <p className="rounded-xl bg-brand-50 px-4 py-2.5 text-center text-[13px] font-semibold text-brand-700">
                Demo code: {demoCode} — texting is not wired up yet
              </p>
            )}
            <div className="flex items-center justify-between text-[13px]">
              <button
                type="button"
                onClick={() => { setStep('who'); setCode(''); setFailed(''); }}
                className="font-semibold text-ink-500"
              >
                Change number
              </button>
              <button type="button" onClick={askForCode} disabled={busy} className="font-semibold text-action-500 disabled:opacity-50">
                Send again
              </button>
            </div>
          </>
        )}

        {step === 'days' && (
          <>
            <Field label="Date of Birth" icon={Gift}>
              <input type="date" value={days.dob} onChange={setDay('dob')} className={INPUT} />
            </Field>
            <Field label="Anniversary Date" icon={CalendarHeart}>
              <input type="date" value={days.anniversary} onChange={setDay('anniversary')} className={INPUT} />
            </Field>
            <Field label="Years of Anniversary (Optional)" icon={CalendarHeart}>
              <input value={days.years} onChange={setDay('years')} placeholder="Enter Years of togetherness" className={INPUT} />
            </Field>
          </>
        )}

        {failed && <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600">{failed}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full gap-2 rounded-xl py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60"
        >
          {busy ? 'Please wait…' : step === 'who' ? 'Send OTP' : step === 'code' ? 'Verify' : 'Continue'}
          {!busy && step !== 'who' && <ArrowRight size={17} />}
        </button>

        {step === 'days' && (
          <button type="button" onClick={finish} className="w-full text-center text-[13px] font-semibold text-ink-500">
            Skip for now
          </button>
        )}
      </form>

      <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-ink-500">
        <ShieldCheck size={14} className="text-green-600" />
        We only use your number to find your bookings and membership.
      </p>

      {step === 'who' && footer}
    </>
  );
}
