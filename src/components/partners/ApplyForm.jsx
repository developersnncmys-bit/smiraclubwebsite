'use client';

import { useState } from 'react';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

/**
 * The application itself.
 *
 * Grouped the way the desk reads it rather than the way the database stores
 * it: what you own, who we ring, then the paperwork. The paperwork group is
 * last and openly optional — asking a hotelier for a GST number before they
 * have decided to apply is how a form gets abandoned. The desk chases the rest
 * during verification, which is what that stage is for.
 */

const CATEGORIES = ['Hotel', 'Villa', 'Package', 'Lifestyle', 'Transport', 'Restaurant', 'Activity', 'Spa'];

const BUSINESS_TYPES = [
  'Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited',
  'Individual owner',
];

const EMPTY = {
  name: '',
  category: 'Hotel',
  businessType: '',
  location: '',
  rooms: '',
  contact: '',
  phone: '',
  whatsapp: '',
  email: '',
  gst: '',
  pan: '',
  registration: '',
  upi: '',
  bank: '',
};

/** A labelled input, since the page is mostly made of them. */
function Field({ label, name, value, onChange, error, hint, optional, ...rest }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-[13px] font-semibold text-ink-700">
        {label}
        {optional && <span className="text-[12px] font-medium text-ink-400">optional</span>}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        className={`field ${error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : ''}`}
        {...rest}
      />
      {error ? (
        <span className="mt-1.5 block text-[12px] font-semibold text-rose-600">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-[12px] text-ink-400">{hint}</span>
      )}
    </label>
  );
}

function Select({ label, name, value, onChange, options, placeholder, optional }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-[13px] font-semibold text-ink-700">
        {label}
        {optional && <span className="text-[12px] font-medium text-ink-400">optional</span>}
      </span>
      <select name={name} value={value} onChange={onChange} className="field appearance-none pr-10">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/** One of the three groups the form is built from. */
function Group({ step, title, note, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[13px] font-bold text-brand-700">
          {step}
        </span>
        <div>
          <h2 className="text-[15px] font-bold text-ink-900">{title}</h2>
          {note && <p className="mt-0.5 text-[13px] leading-snug text-ink-500">{note}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default function ApplyForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);
  const [failed, setFailed] = useState('');

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((x) => (x[name] ? { ...x, [name]: '' } : x));
  };

  /** Only what we genuinely cannot proceed without. */
  const check = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'We need the property name';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
      next.phone = 'Enter a 10-digit mobile number';
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'That email does not look right';
    if (!form.location.trim()) next.location = 'Which city is it in?';
    return next;
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = check();
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setFailed('');
    setBusy(true);
    try {
      const res = await api.applyAsPartner(form);
      setSent(res.data || { name: form.name });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFailed(
        err.status === 0
          ? 'We could not reach our desk just now. Call +91 98200 11223 and we will take it down for you.'
          : err.message || 'That did not go through. Try again in a moment.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="card p-6 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <Check size={28} strokeWidth={2.5} />
        </span>
        <h2 className="mt-4 text-xl font-extrabold text-ink-900 sm:text-2xl">
          Thank you — we have your application
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-500">
          {sent.name} is now with our partnerships desk. Someone will call you within two working
          days to collect your documents and walk you through the rate plan.
        </p>

        {sent.reference && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-surface-soft px-4 py-2.5 text-[13px] font-semibold text-ink-700">
            Your reference
            <span className="font-extrabold tracking-wider text-brand-700">{sent.reference}</span>
          </p>
        )}

        <p className="mt-5 text-[13px] text-ink-400">
          Quote that reference if you call us on +91 98200 11223.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4 sm:space-y-5">
      <Group step="1" title="About your property" note="What you are listing, and where it is.">
        <Field
          label="Property or business name"
          name="name"
          value={form.name}
          onChange={set}
          error={errors.name}
          placeholder="Sunrise Beach Resort"
          autoComplete="organization"
        />
        <Select label="What is it" name="category" value={form.category} onChange={set} options={CATEGORIES} />
        <Field
          label="City"
          name="location"
          value={form.location}
          onChange={set}
          error={errors.location}
          placeholder="Goa"
          autoComplete="address-level2"
        />
        <Field
          label="Rooms or units"
          name="rooms"
          value={form.rooms}
          onChange={set}
          type="number"
          min="0"
          placeholder="24"
          optional
          hint="Leave it blank if it does not apply."
        />
        <Select
          label="Business type"
          name="businessType"
          value={form.businessType}
          onChange={set}
          options={BUSINESS_TYPES}
          placeholder="Select"
          optional
        />
      </Group>

      <Group step="2" title="Who we speak to" note="The person our partnerships desk should call.">
        <Field
          label="Contact person"
          name="contact"
          value={form.contact}
          onChange={set}
          placeholder="Ravi Kamath"
          autoComplete="name"
          optional
        />
        <Field
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={set}
          error={errors.phone}
          type="tel"
          inputMode="numeric"
          placeholder="98765 43210"
          autoComplete="tel"
        />
        <Field
          label="WhatsApp"
          name="whatsapp"
          value={form.whatsapp}
          onChange={set}
          type="tel"
          inputMode="numeric"
          placeholder="Same as phone, if that is easiest"
          optional
        />
        <Field
          label="Email"
          name="email"
          value={form.email}
          onChange={set}
          error={errors.email}
          type="email"
          placeholder="stay@sunriseresort.in"
          autoComplete="email"
          optional
        />
      </Group>

      <Group
        step="3"
        title="Papers and payout"
        note="All optional here — our desk collects whatever is missing during verification."
      >
        <Field label="GST number" name="gst" value={form.gst} onChange={set} placeholder="29ABCDE1234F1Z5" optional />
        <Field label="PAN" name="pan" value={form.pan} onChange={set} placeholder="ABCDE1234F" optional />
        <Field
          label="Registration number"
          name="registration"
          value={form.registration}
          onChange={set}
          placeholder="Trade licence or registration"
          optional
        />
        <Field label="UPI ID" name="upi" value={form.upi} onChange={set} placeholder="name@bank" optional />
        <div className="sm:col-span-2">
          <Field
            label="Bank account"
            name="bank"
            value={form.bank}
            onChange={set}
            placeholder="Account number and IFSC"
            optional
          />
        </div>
      </Group>

      {failed && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] font-semibold text-rose-700">
          {failed}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-start gap-2 text-[13px] leading-snug text-ink-500 sm:max-w-sm">
          <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
          Your details go straight to our partnerships desk. We never list a property until you have
          signed the rate plan.
        </p>

        <button type="submit" disabled={busy} className="btn-action w-full px-8 py-3.5 sm:w-auto">
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending
            </>
          ) : (
            'Submit application'
          )}
        </button>
      </div>
    </form>
  );
}
