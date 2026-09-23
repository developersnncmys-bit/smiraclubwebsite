'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarHeart, Check, Crown, Gift, Mail, Phone, ShieldCheck, User, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { api } from '@/lib/api';
import { isComplete, loadProfile, saveProfile } from '@/lib/profile';
import { isMember, loadMembership, saveMembership } from '@/lib/membership';
import { setSessionToken } from '@/lib/session';

/**
 * Log in or create an account, without leaving the page.
 *
 * Both are the same two steps — a number, then the code sent to it — because
 * the number is the account. Registering adds a third step inside the sheet
 * for the special days the club runs on, so a new member never lands on a
 * half-empty profile screen; it all finishes here.
 *
 * Opens on its own once on the home page for anybody signed out, and from Log
 * in anywhere else:
 *   window.dispatchEvent(new CustomEvent(OPEN_AUTH, { detail: 'register' }))
 */

export const OPEN_AUTH = 'smira:auth';
const DISMISSED = 'smira:auth-dismissed';

const tenDigits = (v) => String(v || '').replace(/\D/g, '').slice(-10);

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

export default function AuthPopup() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('who');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [wants, setWants] = useState({ whatsapp: true, gift: true });
  const [days, setDays] = useState({ dob: '', anniversary: '', years: '' });
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const panel = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(DISMISSED, '1');
    } catch {
      /* storage blocked — it may ask again on the next page */
    }
  }, []);

  // Asked for from the header, the tab bar, or the account card.
  useEffect(() => {
    const show = (e) => {
      if (e?.detail === 'register' || e?.detail === 'login') setMode(e.detail);
      setStep('who');
      setFailed('');
      setOpen(true);
    };
    window.addEventListener(OPEN_AUTH, show);
    return () => window.removeEventListener(OPEN_AUTH, show);
  }, []);

  /** Once a visit, on the home page, and never to somebody already signed in. */
  useEffect(() => {
    if (window.location.pathname !== '/') return undefined;
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISSED) === '1';
    } catch {
      dismissed = false;
    }
    if (dismissed || isComplete(loadProfile()) || isMember(loadMembership())) return undefined;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Escape closes it, and the page behind it stays still.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setDay = (key) => (e) => setDays((d) => ({ ...d, [key]: e.target.value }));
  const registering = mode === 'register';

  /** Keeps what has been gathered so far against this browser. */
  const keep = (extra = {}) => {
    const existing = loadProfile() || {};
    const digits = tenDigits(form.phone);
    saveProfile({
      ...existing,
      details: {
        name: extra.name ?? form.name.trim() ?? existing.details?.name ?? '',
        email: extra.email ?? form.email.trim() ?? existing.details?.email ?? '',
        phone: extra.phone || `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
      },
      whatsapp: wants.whatsapp,
      ...(days.dob ? { birthdays: [{ name: extra.name || form.name.trim() || 'Me', dob: days.dob, relationship: 'Self' }] } : {}),
      ...(days.anniversary ? { anniversary: { date: days.anniversary, years: days.years } } : {}),
      ...(extra.rest || {}),
    });
  };

  const askForCode = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (registering && form.name.trim().length < 2) return setFailed('Tell us your name.');
    if (!/^[6-9]\d{9}$/.test(tenDigits(form.phone))) return setFailed('Enter your 10-digit mobile number.');
    if (registering && form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      return setFailed('That email does not look right.');
    }
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

  /** The code proves the number; registering then carries on inside the sheet. */
  const verify = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (code.replace(/\D/g, '').length !== 6) return setFailed('Enter the 6-digit code.');
    setBusy(true);
    setFailed('');
    try {
      const res = await api.memberVerify(form.phone, code);
      const { member, membership, token } = res.data || {};
      setSessionToken(token || '');
      keep({ name: member?.name || form.name.trim(), email: member?.email || form.email.trim(), phone: member?.phone });
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
      // A new member finishes here; somebody logging in is already done.
      if (registering) setStep('days');
      else window.location.reload();
    } catch (err) {
      setBusy(false);
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
  };

  /** The special days, and then they are in. */
  const finish = (e) => {
    e?.preventDefault();
    keep();
    window.location.reload();
  };

  if (!open) return null;

  const heading =
    step === 'code' ? 'Enter the code' : step === 'days' ? 'A little about you' : 'Welcome to Smira Club';
  const under =
    step === 'code'
      ? `We sent a 6-digit code to ${form.phone}.`
      : step === 'days'
        ? 'So we can make your special days count. You can skip this.'
        : 'Login or create account to continue';

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-900/50 sm:items-center sm:p-6"
        onMouseDown={(e) => {
          if (!panel.current?.contains(e.target)) close();
        }}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={registering ? 'Create your account' : 'Log in'}
          className="flex max-h-[92vh] w-full max-w-phone flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift sm:rounded-2xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-4 px-5 pt-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50">
              <Crown size={22} className="text-action-500" />
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-500 transition hover:bg-surface-soft"
            >
              <X size={20} />
            </button>
          </header>

          <div className="overflow-y-auto px-5 pb-5 pt-2">
            <h2 className="text-center text-[20px] font-bold text-ink-900">{heading}</h2>
            <p className="mt-1 text-center text-[14px] text-ink-500">{under}</p>

            {/* The two ways in, on the switch the rest of the site uses. */}
            {step === 'who' && (
              <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-surface-soft p-1">
                {[
                  { key: 'login', label: 'Login' },
                  { key: 'register', label: 'Register' },
                ].map((t) => {
                  const on = t.key === mode;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => { setMode(t.key); setFailed(''); }}
                      aria-pressed={on}
                      className={`rounded-lg py-2.5 text-[15px] font-bold transition ${
                        on ? 'bg-white text-action-500 shadow-card' : 'text-ink-600 hover:text-ink-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            )}

            <form
              onSubmit={step === 'who' ? askForCode : step === 'code' ? verify : finish}
              className="mt-5 space-y-4"
            >
              {step === 'who' && (
                <>
                  {registering && (
                    <Field label="Your Name" required icon={User}>
                      <input value={form.name} onChange={set('name')} placeholder="Enter your full name" className={INPUT} />
                    </Field>
                  )}

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

                  {registering && (
                    <>
                      <Field label="Email" icon={Mail}>
                        <input
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={set('email')}
                          placeholder="Enter your email (optional)"
                          className={INPUT}
                        />
                      </Field>

                      <div className="space-y-3">
                        <Tick on={wants.whatsapp} onChange={(v) => setWants((w) => ({ ...w, whatsapp: v }))}>
                          Receive WhatsApp updates about exclusive offers, new destinations &amp; more
                        </Tick>
                        <Tick on={wants.gift} onChange={(v) => setWants((w) => ({ ...w, gift: v }))}>
                          Claim your welcome gift
                        </Tick>
                      </div>
                    </>
                  )}
                </>
              )}

              {step === 'code' && (
                <>
                  <input
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
                    <button type="button" onClick={() => { setStep('who'); setCode(''); setFailed(''); }} className="font-semibold text-ink-500">
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
                    <input value={days.years} onChange={setDay('years')} placeholder="Enter years of togetherness" className={INPUT} />
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
                {!busy && <ArrowRight size={17} />}
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

            {step === 'who' && (
              <p className="mt-3 text-center text-[13px] text-ink-500">
                Browsing for now?{' '}
                <button type="button" onClick={close} className="font-semibold text-action-500">
                  Keep looking around
                </button>
                {' · '}
                <Link href="/membership" onClick={close} className="font-semibold text-action-500">
                  Membership plans
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
