'use client';

import { CheckCircle2, NotebookPen } from 'lucide-react';
import Icon from '@/components/ui/Icon';

/**
 * The pieces every request screen is built from — Travel Support's four
 * forms, Flight Search and Train/Bus. They are drawn the same way on all of
 * them, so they are defined once.
 */

export const INPUT =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500 focus:ring-4 focus:ring-brand-100';

/** A label above, an optional icon inside, an error below. */
export function FormField({ label, required, icon, error, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[14px] font-semibold text-ink-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <span className="relative mt-2 block">
        {icon && (
          <Icon name={icon} size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500" />
        )}
        {children}
      </span>
      {error && <span className="mt-1.5 block text-[13px] text-red-600">{error}</span>}
    </label>
  );
}

/** A textarea that counts down to its limit, as the design draws it. */
export function CountedText({ value, onChange, placeholder, max = 120, label, heading, error }) {
  const box = (
    <span className="relative mt-3 block">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        placeholder={placeholder}
        rows={4}
        aria-label={label}
        className={`${INPUT} resize-none pb-8`}
      />
      <span className="pointer-events-none absolute bottom-3 right-4 text-[13px] text-ink-400">
        {value.length}/{max}
      </span>
    </span>
  );

  return (
    <div>
      {heading ? (
        <p className="flex items-center gap-2.5 text-[16px] font-semibold text-ink-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-soft">
            <NotebookPen size={16} className="text-ink-700" />
          </span>
          {label}
        </p>
      ) : (
        <p className="text-[15px] font-semibold text-ink-900">{label}</p>
      )}
      {box}
      {error && <span className="mt-1.5 block text-[13px] text-red-600">{error}</span>}
    </div>
  );
}

/** The bordered two- or three-way switch at the top of a search. */
export function Segmented({ options, value, onChange, label, className = '' }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`grid rounded-xl border border-surface-line ${className}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.key)}
            className={`rounded-xl px-2 py-3 text-[13px] font-semibold leading-tight transition sm:text-[14px] ${
              on ? 'border border-brand-700 bg-brand-50 text-brand-700' : 'border border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** A tinted-icon field with a small caption over its value. */
export function CaptionField({ icon, caption, className = '', children }) {
  return (
    <div className={`relative flex min-w-0 items-center gap-2 rounded-xl border border-surface-line bg-white p-2.5 sm:gap-2.5 sm:p-3 ${className}`}>
      {icon && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 sm:h-9 sm:w-9">
          <Icon name={icon} size={17} className="text-action-500" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.03em] text-ink-400">{caption}</span>
        {children}
      </span>
    </div>
  );
}

/**
 * Who is asking: the name, number and email a request cannot be answered
 * without.
 *
 * A flight or a train has no membership behind it and no sign-in, so the
 * desk gets nothing but a route unless the screen asks here. A saved profile
 * fills it in, and someone who has one never types it twice.
 */
export function ContactFields({ value, onChange, note = 'So the desk can call you back with fares.' }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });
  return (
    <div className="space-y-2.5 pt-2">
      <p className="text-[15px] font-medium uppercase text-ink-900">Your Details</p>
      <div className="grid gap-3 lg:grid-cols-3">
        <CaptionField icon="User" caption="Full Name">
          <input
            value={value.name}
            onChange={set('name')}
            placeholder="Your name"
            aria-label="Your name"
            autoComplete="name"
            className={CONTACT_INPUT}
          />
        </CaptionField>
        <CaptionField icon="Phone" caption="Mobile Number">
          <input
            type="tel"
            inputMode="numeric"
            value={value.phone}
            onChange={set('phone')}
            placeholder="10-digit mobile"
            aria-label="Mobile number"
            autoComplete="tel"
            className={CONTACT_INPUT}
          />
        </CaptionField>
        <CaptionField icon="Mail" caption="Email">
          <input
            type="email"
            value={value.email}
            onChange={set('email')}
            placeholder="you@example.com"
            aria-label="Email address"
            autoComplete="email"
            className={CONTACT_INPUT}
          />
        </CaptionField>
      </div>
      <p className="text-[12px] text-ink-500">{note}</p>
    </div>
  );
}

const CONTACT_INPUT =
  'w-full min-w-0 border-0 bg-transparent p-0 text-[14px] font-medium text-ink-900 outline-none placeholder:text-ink-400 sm:text-[15px]';

/** What replaces a form once it has been sent. */
export function RequestSent({ title = 'Request sent', body, onReset, resetLabel = 'Send another request' }) {
  return (
    <div role="status" className="card flex flex-col items-center p-6 text-center sm:p-8">
      <CheckCircle2 size={48} className="text-green-600" strokeWidth={1.6} />
      <h2 className="mt-4 text-xl font-bold text-ink-900">{title}</h2>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-600">{body}</p>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-5 text-[14px] font-bold text-action-500 underline">
          {resetLabel}
        </button>
      )}
    </div>
  );
}
