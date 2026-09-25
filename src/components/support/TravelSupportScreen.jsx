'use client';

import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { CountedText, FormField, INPUT, RequestSent } from '@/components/forms/RequestFields';
import { travelSupportCommon, travelSupportHero, travelSupportTabs } from '@/lib/content';
import { api } from '@/lib/api';
import { readAttribution } from '@/components/layout/Attribution';

const DATE_ICON = 'Calendar';

/**
 * Travel Support: visa, insurance, currency and SIM requests.
 *
 * Each tab is a short form described in content, so the four share one
 * renderer. What a member types is kept per tab — switching to Insurance and
 * back does not wipe a half-finished visa request — and Send Request checks
 * the required fields, a ten-digit number, and that a return date is not
 * before the date it returns from.
 *
 * Send Request reaches the desk: it lands in the admin panel's Sales & Leads
 * as a new lead, tagged with the service asked for and carrying every answer
 * on the tab. Nobody has to be signed in — the number is the way back.
 */
export default function TravelSupportScreen() {
  const [tab, setTab] = useState(travelSupportTabs[0].key);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');

  const current = travelSupportTabs.find((t) => t.key === tab);
  const form = values[tab] || {};
  const fields = [...travelSupportCommon, ...current.fields];

  const set = (key, value) => {
    setValues((all) => ({ ...all, [tab]: { ...(all[tab] || {}), [key]: value } }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const valueOf = (f) => form[f.key] ?? (f.type === 'select' ? f.options[0] : '');

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    for (const f of fields) {
      const v = String(valueOf(f)).trim();
      if (f.required && !v) found[f.key] = `${f.label} is required.`;
    }
    if (form.phone && !/^\d{10}$/.test(String(form.phone).replace(/\D/g, ''))) {
      found.phone = 'A 10-digit mobile number, please.';
    }
    for (const f of fields) {
      if (f.after && form[f.key] && form[f.after] && form[f.key] < form[f.after]) {
        found[f.key] = `${f.label} cannot be before ${fields.find((x) => x.key === f.after).label.toLowerCase()}.`;
      }
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    // Every answer on this tab, labelled, so the desk reads the form itself.
    setBusy(true);
    setFailed('');
    api
      .enquiry({
        service: current.label,
        name: form.name,
        phone: form.phone,
        email: form.email,
        destination: form.destination,
        travelDate: form.travelDate,
        pax: form.travellers,
        tags: ['Travel support'],
        answers: fields.map((f) => ({ label: f.label, value: String(valueOf(f)) })),
        attribution: readAttribution(),
      })
      .then((res) => setSent({ label: current.label, phone: form.phone, reference: res.data?.reference }))
      .catch((err) =>
        setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.'),
      )
      .finally(() => setBusy(false));
  };

  const control = (f) => {
    const value = valueOf(f);
    const icon = f.type === 'date' ? DATE_ICON : f.icon;
    const pad = icon ? 'pl-11' : '';
    const placeholder = f.key === 'name' && current.namePlaceholder ? current.namePlaceholder : f.placeholder;

    if (f.type === 'select') {
      return (
        <>
          <select value={value} onChange={(e) => set(f.key, e.target.value)} className={`${INPUT} appearance-none pr-10`}>
            {f.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-700" />
        </>
      );
    }

    return (
      <input
        type={f.type}
        inputMode={f.type === 'tel' ? 'numeric' : undefined}
        min={f.type === 'date' ? new Date().toISOString().slice(0, 10) : f.min}
        value={value}
        onChange={(e) => set(f.key, e.target.value)}
        placeholder={placeholder}
        className={`${INPUT} ${pad}`}
      />
    );
  };

  return (
    <div className="pb-10 lg:pb-16">
      {/* -- Hero ---------------------------------------------------------- */}
      <section className="bg-gradient-to-br from-[#1f64c8] via-[#3b82e0] to-[#a9d2fb]">
        <div className="shell py-10 lg:py-16">
          <h1 className="max-w-[16rem] text-[26px] font-extrabold leading-tight text-white [font-variant:small-caps] lg:max-w-none lg:text-4xl">
            {travelSupportHero.title}
          </h1>
          <p className="mt-2 max-w-[17rem] text-[12px] font-medium leading-snug text-white sm:max-w-md lg:text-base">
            {travelSupportHero.body}
          </p>
        </div>
      </section>

      {/* -- Tabs ---------------------------------------------------------- */}
      <div className="bg-surface-soft">
        <div role="tablist" aria-label="Travel support" className="shell flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {travelSupportTabs.map((t) => {
            const on = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(t.key);
                  setErrors({});
                  setSent(null);
                }}
                className={`w-[7.5rem] shrink-0 px-4 py-3.5 text-left text-[14px] font-medium leading-tight transition lg:w-auto lg:px-6 ${
                  on ? 'rounded-t-2xl bg-white text-ink-900' : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white">
        <div className="shell py-7 lg:py-10">
          {sent ? (
            <RequestSent
              body={`Your ${sent.label} request is with our travel desk${sent.reference ? ` — reference ${sent.reference}` : ''}. We will call you on ${sent.phone} within one working day.`}
              onReset={() => {
                setValues((all) => ({ ...all, [tab]: {} }));
                setSent(null);
              }}
            />
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="text-[18px] font-semibold leading-snug text-ink-900 lg:text-2xl">{current.title}</h2>

              <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-5 lg:gap-x-6">
                {fields.map((f) =>
                  f.type === 'textarea' ? (
                    <div key={f.key} className="col-span-2">
                      <CountedText
                        label={f.label}
                        value={form[f.key] || ''}
                        onChange={(v) => set(f.key, v)}
                        placeholder={f.placeholder}
                      />
                    </div>
                  ) : (
                    <FormField
                      key={f.key}
                      label={f.label}
                      required={f.required}
                      icon={f.type === 'date' ? DATE_ICON : f.icon}
                      error={errors[f.key]}
                      className={f.half ? 'col-span-1' : 'col-span-2 lg:col-span-1'}
                    >
                      {control(f)}
                    </FormField>
                  ),
                )}

                <div className="col-span-2">
                  <CountedText
                    heading
                    label="Additional Notes"
                    value={form.notes || ''}
                    onChange={(v) => set('notes', v)}
                    placeholder="Anything our team should know..."
                  />
                </div>
              </div>

              {failed && (
                <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                  {failed}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary mt-8 w-full justify-between rounded-xl px-6 py-3.5 text-[15px] normal-case tracking-normal disabled:opacity-60 lg:w-auto lg:min-w-[18rem] lg:gap-10"
              >
                <span className="flex-1 text-center">{busy ? 'Sending…' : 'Send Request'}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
