'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, BellRing, Cake, Calendar, Camera, Check, ContactRound, Heart,
  Info, Mail, MapPin, Phone, ShieldCheck, User, UserPen,
} from 'lucide-react';
import { indianStates, profileSteps } from '@/lib/content';

const FIELD =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

/** A labelled input with the icon the design puts inside it. */
function Field({ label, required, icon: Glyph, hint, error, children, ...props }) {
  return (
    <label className="block">
      <span className="text-[14px] font-semibold text-ink-900">
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="font-normal text-ink-500"> {hint}</span>}
      </span>

      <span className="relative mt-2 block">
        {Glyph && (
          <Glyph size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        )}
        {children || <input className={`${FIELD} ${Glyph ? 'pl-11' : ''}`} {...props} />}
      </span>

      {error && <span className="mt-1.5 block text-[13px] text-red-600">{error}</span>}
    </label>
  );
}

/** The heading each step's card opens with. */
function StepHead({ icon: Glyph, title, note }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50">
        <Glyph size={20} className="text-action-500" />
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-bold leading-tight text-ink-900">{title}</h2>
        {note && <p className="mt-0.5 text-[13px] leading-snug text-ink-500">{note}</p>}
      </div>
    </div>
  );
}

/** One reviewed block on the last step. */
function ReviewCard({ icon, title, onEdit, children }) {
  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <StepHead icon={icon} title={title} />
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[14px] font-semibold text-action-500"
        >
          Edit
        </button>
      </div>
      <dl className="mt-4 space-y-3 border-t border-surface-line pt-4">{children}</dl>
    </section>
  );
}

function Line({ label, children }) {
  return (
    <div>
      <dt className="text-[13px] text-ink-500">{label}</dt>
      <dd className="text-[15px] font-bold text-ink-900">{children || <span className="font-normal text-ink-400">Not added</span>}</dd>
    </div>
  );
}

const BLANK_BIRTHDAY = { name: '', dob: '', relationship: '' };

/**
 * Complete Your Profile, in five steps.
 *
 * One component holds all five because they are one form — the review step
 * has to read everything the earlier steps collected, and Edit has to send
 * you back to the step that owns a field. Splitting them into five routes
 * would mean lifting the same state somewhere else anyway.
 *
 * Only the first step is required to be complete; special days, the gift
 * address and the preferences are all things a member can skip and add
 * later, which is why Continue only blocks on step one.
 */
export default function CompleteProfile() {
  const router = useRouter();
  const [at, setAt] = useState(0);
  const [errors, setErrors] = useState({});

  const [details, setDetails] = useState({ name: '', email: '', phone: '' });
  const [birthdays, setBirthdays] = useState([{ ...BLANK_BIRTHDAY }]);
  const [anniversary, setAnniversary] = useState({ date: '', years: '' });
  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: 'Karnataka', pincode: '', useForAll: true,
  });
  const [whatsapp, setWhatsapp] = useState(true);

  const step = profileSteps[at];

  const setField = (setter) => (key, value) => setter((v) => ({ ...v, [key]: value }));
  const setDetail = setField(setDetails);
  const setAddr = setField(setAddress);

  const setBirthday = (i, key, value) =>
    setBirthdays((list) => list.map((b, n) => (n === i ? { ...b, [key]: value } : b)));

  /** Step one is the only one that has to be filled in. */
  const validate = () => {
    if (at !== 0) return {};
    const found = {};
    if (!details.name.trim()) found.name = 'Tell us your name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(details.email.trim())) found.email = 'That email does not look right.';
    if (!/^\d{10}$/.test(details.phone.replace(/\D/g, ''))) found.phone = 'A 10-digit mobile number, please.';
    return found;
  };

  const next = () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    if (at < profileSteps.length - 1) {
      setAt(at + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    router.push('/profile');
  };

  const back = () => {
    if (at === 0) router.push('/profile');
    else {
      setAt(at - 1);
      window.scrollTo({ top: 0 });
    }
  };

  const fullAddress = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(', '),
    address.pincode,
  ].filter(Boolean).join('\n');

  return (
    <div className="pb-28 lg:pb-12">
      <div className="shell py-4">
        {/* The title rides the arrow's line rather than sitting under it. */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={back}
            aria-label="Go back"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[17px] font-bold text-ink-900 lg:text-xl">Complete Your profile</h1>
        </div>

        <p className="mt-2 max-w-sm text-[13px] leading-snug text-ink-600">
          Help us know you better and enjoy personalized benefits
        </p>

        {/* -- Where you are in it --------------------------------- */}
        <ol className="mt-7 flex items-start justify-between">
          {profileSteps.map((s, i) => {
            const done = i < at;
            const now = i === at;
            return (
              <li key={s.key} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <span className={`h-[2px] flex-1 ${i === 0 ? 'bg-transparent' : done || now ? 'bg-action-500' : 'bg-surface-line'}`} />
                  <span
                    aria-current={now ? 'step' : undefined}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-[13px] font-bold transition ${
                      done || now
                        ? 'border-action-500 bg-action-500 text-white'
                        : 'border-surface-line bg-white text-ink-400'
                    }`}
                  >
                    {done ? <Check size={16} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`h-[2px] flex-1 ${i === profileSteps.length - 1 ? 'bg-transparent' : done ? 'bg-action-500' : 'bg-surface-line'}`} />
                </div>
                <span className={`mt-2 px-1 text-center text-[12px] font-semibold leading-tight ${now ? 'text-ink-900' : 'text-ink-500'}`}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* -- The step itself ------------------------------------- */}
        <div className="mt-7 space-y-4">
          {step.key === 'details' && (
            <section className="card p-4 sm:p-5">
              <StepHead icon={UserPen} title="Personal Details" />

              <div className="mt-6 flex justify-center">
                <span className="relative">
                  <span className="grid h-28 w-28 place-items-center rounded-full bg-surface-soft ring-1 ring-surface-line">
                    <User size={44} className="text-ink-400" />
                  </span>
                  <button
                    type="button"
                    aria-label="Add a profile photo"
                    title="Photo upload arrives with the accounts work"
                    className="absolute bottom-0 left-1/2 grid h-11 w-11 -translate-x-1/2 translate-y-1/3 place-items-center rounded-full bg-action-500 text-white ring-4 ring-white transition hover:bg-action-600"
                  >
                    <Camera size={19} />
                  </button>
                </span>
              </div>

              <div className="mt-12 space-y-5">
                <Field
                  label="Your Name" required icon={User} error={errors.name}
                  value={details.name} onChange={(e) => setDetail('name', e.target.value)}
                  placeholder="Enter your full name"
                />
                <Field
                  label="Email ID" required icon={Mail} error={errors.email} type="email"
                  value={details.email} onChange={(e) => setDetail('email', e.target.value)}
                  placeholder="Enter your Email ID"
                />
                <Field
                  label="Contact Number" required icon={Phone} error={errors.phone} inputMode="numeric"
                  value={details.phone} onChange={(e) => setDetail('phone', e.target.value)}
                  placeholder="Enter your  Mobile Number"
                />
              </div>
            </section>
          )}

          {step.key === 'special' && (
            <>
              <section className="card p-4 sm:p-5">
                <h2 className="text-lg font-bold text-ink-900">Special Days</h2>
                <p className="mt-1 text-[14px] leading-snug text-ink-600">
                  Let us remember your important days and make them special.
                </p>

                <div className="mt-6">
                  <StepHead icon={Cake} title="Birthdays" />
                </div>

                {birthdays.map((b, i) => (
                  <div key={i} className={i > 0 ? 'mt-6 space-y-5 border-t border-surface-line pt-5' : 'mt-5 space-y-5'}>
                    <Field
                      label="Person Name" required icon={User}
                      value={b.name} onChange={(e) => setBirthday(i, 'name', e.target.value)}
                      placeholder="Enter person name"
                    />
                    <Field
                      label="Date of Birth" required icon={Calendar} type="date"
                      value={b.dob} onChange={(e) => setBirthday(i, 'dob', e.target.value)}
                    />
                    <Field
                      label="Relationship" hint="(Optional)" icon={Heart}
                      value={b.relationship} onChange={(e) => setBirthday(i, 'relationship', e.target.value)}
                      placeholder="Enter Relationship"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setBirthdays((list) => [...list, { ...BLANK_BIRTHDAY }])}
                  className="mt-5 w-full rounded-xl border border-action-500 px-5 py-3.5 text-[14px] font-bold text-action-500 transition hover:bg-brand-50"
                >
                  +&nbsp; Add Birthday
                </button>
              </section>

              <section className="card p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#fdeaf1]">
                    <Heart size={18} className="text-[#e0518a]" fill="currentColor" strokeWidth={0} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold leading-tight text-ink-900">
                      Married? Add Your Anniversary Date
                    </h2>
                    <p className="mt-1 text-[14px] leading-snug text-ink-600">
                      We will help you celebrate your beautiful journey together
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-5">
                  <Field
                    label="Anniversary Date" required icon={Calendar} type="date"
                    value={anniversary.date}
                    onChange={(e) => setAnniversary((v) => ({ ...v, date: e.target.value }))}
                  />
                  <Field
                    label="Years of Anniversary" hint="(Optional)" icon={Calendar} inputMode="numeric"
                    value={anniversary.years}
                    onChange={(e) => setAnniversary((v) => ({ ...v, years: e.target.value }))}
                    placeholder="Enter Years of togetherness"
                  />
                </div>
              </section>
            </>
          )}

          {step.key === 'address' && (
            <section className="card p-4 sm:p-5">
              <StepHead
                icon={MapPin}
                title="Gift Address"
                note="Address for sending your gift and important communications."
              />

              <div className="mt-6 space-y-5">
                <Field
                  label="Address Line 1" required
                  value={address.line1} onChange={(e) => setAddr('line1', e.target.value)}
                  placeholder="House no / Building name / Street"
                />
                <Field
                  label="Address Line 2"
                  value={address.line2} onChange={(e) => setAddr('line2', e.target.value)}
                  placeholder="Area/ Landmark (Recommended)"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="City"
                    value={address.city} onChange={(e) => setAddr('city', e.target.value)}
                    placeholder="Enter City Name"
                  />
                  <Field label="State">
                    <select
                      value={address.state}
                      onChange={(e) => setAddr('state', e.target.value)}
                      className={`${FIELD} cursor-pointer`}
                    >
                      {indianStates.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Pincode" inputMode="numeric"
                    value={address.pincode} onChange={(e) => setAddr('pincode', e.target.value)}
                    placeholder="Enter Pincode"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={address.useForAll}
                    onChange={(e) => setAddr('useForAll', e.target.checked)}
                    className="h-5 w-5 shrink-0 accent-action-500"
                  />
                  <span className="text-[14px] text-ink-900">
                    Use this address for all communications
                  </span>
                </label>
              </div>
            </section>
          )}

          {step.key === 'updates' && (
            <>
              <section>
                <StepHead
                  icon={BellRing}
                  title="Your Preferences"
                  note="Choose how you want to stay updated"
                />
              </section>

              <section className="card p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e7f8ec]">
                      <Phone size={17} className="text-[#25d366]" fill="currentColor" strokeWidth={0} />
                    </span>
                    <span className="text-lg font-bold text-ink-900">Whatsapp Updates</span>
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={whatsapp}
                    aria-label="Whatsapp updates"
                    onClick={() => setWhatsapp((v) => !v)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      whatsapp ? 'bg-action-500' : 'bg-surface-line'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        whatsapp ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-ink-700">
                  Receive important updates, confirmation, offers and reminers on Whatsapp.
                </p>
              </section>

              <section className="card flex items-start gap-3 p-4 sm:p-5">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-action-500" />
                <p className="text-[14px] leading-relaxed text-ink-900">
                  We respect your, privacy your data is safe with us and will never be shared.
                </p>
              </section>

              <p className="flex items-start gap-2.5 rounded-xl bg-[#eef4fe] p-4 text-[14px] leading-snug text-action-500">
                <Info size={18} className="mt-0.5 shrink-0" />
                You can change these preferences anytime from your profile.
              </p>
            </>
          )}

          {step.key === 'submit' && (
            <>
              <StepHead
                icon={ContactRound}
                title="Review Your Details"
                note="Please review your details before we save it."
              />

              <ReviewCard icon={UserPen} title="Personal Details" onEdit={() => setAt(0)}>
                <Line label="Full name">{details.name}</Line>
                <Line label="Email ID">{details.email}</Line>
                <Line label="Mobile Number">{details.phone && `+91 ${details.phone}`}</Line>
              </ReviewCard>

              <ReviewCard icon={Cake} title="Special Days" onEdit={() => setAt(1)}>
                {birthdays.filter((b) => b.dob || b.name).map((b, i) => (
                  <Line key={i} label={b.name ? `Birthday — ${b.name}` : 'Birthday'}>{b.dob}</Line>
                ))}
                {!birthdays.some((b) => b.dob || b.name) && <Line label="Birthday" />}
                <Line label="Anniversary">{anniversary.date}</Line>
              </ReviewCard>

              <ReviewCard icon={MapPin} title="Gift Address" onEdit={() => setAt(2)}>
                <dd className="whitespace-pre-line text-[15px] font-medium leading-relaxed text-ink-900">
                  {fullAddress || <span className="text-ink-400">Not added</span>}
                </dd>
              </ReviewCard>

              <ReviewCard icon={BellRing} title="Preferences" onEdit={() => setAt(3)}>
                <dd className="text-[15px] font-medium text-ink-900">
                  Whatsapp Updates &middot; {whatsapp ? 'Yes' : 'No'}
                </dd>
              </ReviewCard>
            </>
          )}
        </div>
      </div>

      {/*
        Continue.

        A phone pins it, because the form is longer than the screen and the
        way on should not be something you have to scroll for. A desktop
        shows the whole step at once, so it simply follows the form — a bar
        stuck across the bottom of a roomy page is just in the way.
      */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)] lg:static lg:border-0 lg:bg-transparent lg:shadow-none">
        <div className="shell py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:pb-0 lg:pt-6">
          <button
            type="button"
            onClick={next}
            className="btn-primary w-full gap-3 rounded-xl py-4 text-[15px] normal-case tracking-normal lg:w-auto lg:px-10 lg:py-3.5"
          >
            {at === profileSteps.length - 1 ? 'Submit' : 'Continue'}
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
