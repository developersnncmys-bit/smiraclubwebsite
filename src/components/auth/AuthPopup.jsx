'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Crown, Mail, Phone, ShieldCheck, User, X } from 'lucide-react';
import Portal from '@/components/ui/Portal';
import { api } from '@/lib/api';
import { isComplete, loadProfile, saveProfile } from '@/lib/profile';
import { isMember, loadMembership, saveMembership } from '@/lib/membership';
import { setSessionToken } from '@/lib/session';

/**
 * Log in or register, in a sheet over whatever the visitor was reading.
 *
 * Both are the same two steps — a mobile number, then the code sent to it —
 * because the number is the account. Registering asks for a name and email
 * first, so a new member arrives with a profile rather than an empty one, and
 * logging in brings back what the desk already holds for that number.
 *
 * It opens on its own once on the home page for anybody signed out, and from
 * Log in in the header or the tab bar — `window.dispatchEvent(new Event(OPEN))`
 * from anywhere else.
 */

export const OPEN_AUTH = 'smira:auth';
const DISMISSED = 'smira:auth-dismissed';

const tenDigits = (v) => String(v || '').replace(/\D/g, '').slice(-10);

export default function AuthPopup() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState('who');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
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
      /* storage blocked — it may ask again next page */
    }
  }, []);

  // Asked for from the header, the tab bar, or anywhere else.
  useEffect(() => {
    const show = (e) => {
      // A caller may ask for a tab: dispatch with { detail: 'register' }.
      if (e?.detail === 'register' || e?.detail === 'login') setMode(e.detail);
      setStep('who');
      setFailed('');
      setOpen(true);
    };
    window.addEventListener(OPEN_AUTH, show);
    return () => window.removeEventListener(OPEN_AUTH, show);
  }, []);

  /**
   * On the home page, once a visit: somebody already signed in, or who has
   * closed it, is not asked again.
   */
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

  const askForCode = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (mode === 'register' && form.name.trim().length < 2) return setFailed('Tell us your name.');
    if (!/^[6-9]\d{9}$/.test(tenDigits(form.phone))) return setFailed('Enter your 10-digit mobile number.');
    if (mode === 'register' && form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
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

  const finish = async (e) => {
    e?.preventDefault();
    if (busy) return;
    if (code.replace(/\D/g, '').length !== 6) return setFailed('Enter the 6-digit code.');
    setBusy(true);
    setFailed('');
    try {
      const res = await api.memberVerify(form.phone, code);
      const { member, membership, token } = res.data || {};
      setSessionToken(token || '');

      // What the desk holds wins; what they just typed fills the gaps.
      const existing = loadProfile() || {};
      const digits = tenDigits(form.phone);
      saveProfile({
        ...existing,
        details: {
          name: member?.name || form.name.trim() || existing.details?.name || '',
          email: member?.email || form.email.trim() || existing.details?.email || '',
          phone: member?.phone || `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
        },
      });
      if (membership) {
        saveMembership({
          plan: membership.plan,
          reference: membership.reference,
          since: new Date().toISOString(),
          expiresOn: membership.expiresOn,
          status: membership.status,
        });
      }
      // Registering ends on the profile, where the rest of it is filled in;
      // logging in stays where they were, with the session now in hand.
      window.location.assign(mode === 'register' || !member?.name ? '/profile/edit' : window.location.pathname + window.location.search);
    } catch (err) {
      setBusy(false);
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    }
  };

  if (!open) return null;

  const registering = mode === 'register';

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
          aria-label={registering ? 'Register' : 'Log in'}
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

          <div className="px-5 pb-5 pt-2">
            <h2 className="text-[19px] font-bold text-ink-900">
              {step === 'code' ? 'Enter the code' : registering ? 'Join Smira Club' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-[14px] text-ink-500">
              {step === 'code'
                ? `We sent a 6-digit code to ${form.phone}.`
                : registering
                  ? 'Your mobile number is your account — no password to remember.'
                  : 'Log in with your mobile number to see your bookings and membership.'}
            </p>

            {/* The same switch the hotels screen uses, for the two ways in. */}
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

            <form onSubmit={step === 'who' ? askForCode : finish} className="mt-4 space-y-3">
              {step === 'who' ? (
                <>
                  {registering && (
                    <label className="relative block">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                      <input
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Your name"
                        aria-label="Your name"
                        className="w-full rounded-xl border border-surface-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink-900 outline-none transition focus:border-action-500"
                      />
                    </label>
                  )}

                  <label className="relative block">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="Mobile number"
                      aria-label="Mobile number"
                      className="w-full rounded-xl border border-surface-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink-900 outline-none transition focus:border-action-500"
                    />
                  </label>

                  {registering && (
                    <label className="relative block">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                      <input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="Email (optional)"
                        aria-label="Email"
                        className="w-full rounded-xl border border-surface-line bg-white py-3.5 pl-11 pr-4 text-[15px] text-ink-900 outline-none transition focus:border-action-500"
                      />
                    </label>
                  )}
                </>
              ) : (
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

              {failed && <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600">{failed}</p>}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary w-full gap-2 rounded-xl py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60"
              >
                {busy ? 'Please wait…' : step === 'code' ? (registering ? 'Create my account' : 'Log in') : 'Send code'}
                {!busy && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-ink-500">
              <ShieldCheck size={14} className="text-green-600" />
              We only use your number to find your bookings and membership.
            </p>

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
          </div>
        </div>
      </div>
    </Portal>
  );
}
