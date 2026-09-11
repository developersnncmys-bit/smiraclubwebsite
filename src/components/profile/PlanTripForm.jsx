'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Cake, Check, Luggage, MapPin, Users, Utensils } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { planTrip as opts, planTripDone, planTripHero } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';
import { nightsBetween } from '@/lib/format';

const FIELD =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

/** The heading each block of the form opens with. */
function Ask({ icon: Glyph, title, note }) {
  return (
    <div className="flex items-start gap-3">
      <Glyph size={22} className="mt-0.5 shrink-0 text-ink-500" strokeWidth={1.8} />
      <div>
        <h2 className="text-[17px] font-bold leading-snug text-ink-900">{title}</h2>
        {note && <p className="text-[14px] text-ink-500">{note}</p>}
      </div>
    </div>
  );
}

/** A square-checkbox chip, the way the design draws its multi-selects. */
function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[15px] transition ${
        on ? 'border-action-500 bg-brand-50 text-ink-900' : 'border-surface-line bg-white text-ink-900 hover:bg-surface-soft'
      }`}
    >
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[3px] border-2 ${
          on ? 'border-action-500 bg-action-500 text-white' : 'border-ink-900 bg-white'
        }`}
      >
        {on && <Check size={12} strokeWidth={3.5} />}
      </span>
      {children}
    </button>
  );
}

/** A plain pill, for the single-choice rows that carry no checkbox. */
function Pill({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-xl border px-4 py-3 text-[15px] transition ${
        on
          ? 'border-action-500 bg-brand-50 font-semibold text-action-500'
          : 'border-surface-line bg-white text-ink-900 hover:bg-surface-soft'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Plan My Trip, and what it says once saved.
 *
 * The success screen is this component in another state rather than a second
 * route, because it reads the trip straight back — a separate page would have
 * to be handed the whole form again through the URL or a store.
 */
export default function PlanTripForm({ hero, doneImage }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    from: '',
    to: '',
    start: '',
    end: '',
    party: opts.partySizes[0],
    occasion: '',
    note: '',
    pickupFrom: opts.pickupFrom[0],
    pickupTo: opts.pickupTo[0],
    sightseeing: 'Yes',
    mealPlan: opts.mealPlans[0],
    mealType: 'veg',
    needs: '',
  });
  const [companions, setCompanions] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [transport, setTransport] = useState([]);
  const [extras, setExtras] = useState([]);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const submit = (e) => {
    e.preventDefault();
    const found = {};
    if (!form.name.trim()) found.name = 'Give the trip a name.';
    if (!form.from.trim()) found.from = 'Where are you starting from?';
    if (!form.to.trim()) found.to = 'Where are you going?';
    if (!form.start) found.start = 'Pick a start date.';
    if (!form.end) found.end = 'Pick an end date.';
    else if (form.start && new Date(form.end) <= new Date(form.start)) {
      found.end = 'The end date has to be after the start.';
    }

    setErrors(found);
    if (Object.keys(found).length) return;

    setSaved({ ...form, companions, tripTypes, transport, extras });
    window.scrollTo({ top: 0 });
  };

  /* -- Saved ------------------------------------------------------ */
  if (saved) {
    const nights = nightsBetween(saved.start, saved.end);
    const day = (d) =>
      new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const year = new Date(saved.end).getFullYear();

    return (
      <div className="shell flex min-h-[70vh] flex-col py-8">
        <div className="text-center">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-full border-[6px] border-brand-700">
            <Check size={44} className="text-brand-700" strokeWidth={3} />
          </span>

          <h1 className="mt-6 text-2xl font-extrabold text-ink-900">{planTripDone.title}</h1>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-500">
            {saved.to.split(',')[0]} is now part of your {year} Travel Plan.
          </p>
        </div>

        <article className="card mt-8 flex gap-4 p-3.5">
          <span className="relative h-[104px] w-[110px] shrink-0 overflow-hidden rounded-xl">
            <Image
              src={toSrc(doneImage || 'villa-beach')}
              alt=""
              fill
              sizes="110px"
              className="object-cover"
            />
          </span>

          <div className="min-w-0 flex-1 self-center">
            <h2 className="text-[17px] font-bold text-ink-900">{saved.name}</h2>
            <p className="mt-1.5 flex items-center gap-2 text-[15px] text-ink-700">
              {saved.from.split(',')[0]}
              <ArrowRight size={15} className="shrink-0 text-ink-500" />
              {saved.to.split(',')[0]}
            </p>
            <p className="mt-1 flex items-center gap-2 text-[15px] text-ink-700">
              {day(saved.start)}
              <ArrowRight size={15} className="shrink-0 text-ink-500" />
              {day(saved.end)} {year}
            </p>
            <p className="mt-1 text-[15px] text-ink-700">
              {nights + 1} Days/{nights} Night{nights === 1 ? '' : 's'}
            </p>
          </div>
        </article>

        <p className="mt-6 text-center text-[15px] leading-relaxed text-ink-500">
          {planTripDone.note}
        </p>

        <div className="mt-auto space-y-3 pt-10">
          <Link
            href="/profile/travel-year"
            className="btn-primary w-full rounded-xl py-4 text-[17px]"
          >
            {planTripDone.primary}
          </Link>

          <button
            type="button"
            onClick={() => {
              setSaved(null);
              router.refresh();
            }}
            className="w-full rounded-xl border-2 border-action-500 bg-white py-4 text-[17px] font-bold text-action-500 transition hover:bg-brand-50"
          >
            {planTripDone.secondary}
          </button>
        </div>
      </div>
    );
  }

  /* -- The form --------------------------------------------------- */
  return (
    <form onSubmit={submit} className="pb-10">
      <div className="relative h-[190px] w-full overflow-hidden sm:h-[240px] lg:h-[300px]">
        <Image
          src={toSrc(hero || planTripHero.image)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="shell lg:grid lg:grid-cols-2 lg:gap-x-10">
        <div className="py-7 text-center lg:col-span-2">
          <h1 className="text-xl font-extrabold uppercase leading-snug text-brand-700 lg:text-2xl">
            {planTripHero.title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-600">
            {planTripHero.body}
          </p>
        </div>

        {/* -- Where and when -------------------------------------- */}
        <section className="border-t border-surface-line py-6">
          <Ask icon={MapPin} title="Tell us when & where you are planning to travel." />

          <div className="mt-5 space-y-4">
            {[
              { key: 'name', label: 'Plan Name', placeholder: 'Goa Getaway' },
              { key: 'from', label: 'Travelling From', placeholder: 'Mumbai, India' },
              { key: 'to', label: 'Travelling To', placeholder: 'Goa, India' },
            ].map((f) => (
              <label key={f.key} className="block">
                <span className="text-[15px] text-ink-700">{f.label}</span>
                <input
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={`${FIELD} mt-2`}
                />
                {errors[f.key] && (
                  <span className="mt-1.5 block text-[13px] text-red-600">{errors[f.key]}</span>
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="border-t border-surface-line py-6">
          <Ask icon={Calendar} title="Travel Window" note="When are you planning to Travel" />

          <div className="mt-5 space-y-4">
            {[
              { key: 'start', label: 'From Date' },
              { key: 'end', label: 'To Date' },
            ].map((f) => (
              <label key={f.key} className="block">
                <span className="text-[15px] text-ink-700">{f.label}</span>
                <input
                  type="date"
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={`${FIELD} mt-2`}
                />
                {errors[f.key] && (
                  <span className="mt-1.5 block text-[13px] text-red-600">{errors[f.key]}</span>
                )}
              </label>
            ))}
          </div>
        </section>

        {/* -- About the trip -------------------------------------- */}
        <section className="border-t border-surface-line py-6">
          <Ask icon={Users} title="Tell us more about your trip" note="(Optional)" />

          <h3 className="mt-5 text-[16px] font-semibold text-ink-900">
            Who do you usually travel with?
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {opts.companions.map((c) => (
              <Chip
                key={c}
                on={companions.includes(c)}
                onClick={() => toggle(companions, setCompanions, c)}
              >
                {c}
              </Chip>
            ))}
          </div>

          <h3 className="mt-6 text-[16px] font-semibold text-ink-900">
            What type of trip do you prefer?
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {opts.tripTypes.map((t) => (
              <Chip
                key={t}
                on={tripTypes.includes(t)}
                onClick={() => toggle(tripTypes, setTripTypes, t)}
              >
                {t}
              </Chip>
            ))}
          </div>

          <h3 className="mt-6 text-[16px] font-semibold text-ink-900">
            How many people usually travel?
          </h3>
          <select
            value={form.party}
            onChange={(e) => set('party', e.target.value)}
            aria-label="How many people usually travel"
            className={`${FIELD} mt-3 cursor-pointer`}
          >
            {opts.partySizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </section>

        {/* -- The occasion ---------------------------------------- */}
        <section className="border-t border-surface-line py-6">
          <Ask icon={Cake} title="Special Occasion" note="What are you celebrating?" />

          <div className="mt-5 flex flex-wrap gap-3">
            {opts.occasions.map((o) => (
              <Pill
                key={o}
                on={form.occasion === o}
                onClick={() => set('occasion', form.occasion === o ? '' : o)}
              >
                {o}
              </Pill>
            ))}
          </div>

          <h3 className="mt-6 text-[16px] font-bold text-ink-900">
            Special Note <span className="font-normal text-ink-500">(Optional)</span>
          </h3>
          <p className="text-[14px] text-ink-500">Any special requests or requirements</p>

          <div className="relative mt-3">
            <textarea
              rows={3}
              maxLength={120}
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              placeholder="E.g. Birthday decor in room"
              className={`${FIELD} resize-none pb-8`}
            />
            <span className="pointer-events-none absolute bottom-3 right-4 text-[13px] text-ink-400">
              {form.note.length}/120
            </span>
          </div>
        </section>

        {/* -- Getting there --------------------------------------- */}
        <section className="border-t border-surface-line py-6">
          <Ask icon={Luggage} title="Transport Preference" note="Select all that apply" />

          <div className="mt-5 grid grid-cols-4 gap-3">
            {opts.transport.map((t) => {
              const on = transport.includes(t.key);
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => toggle(transport, setTransport, t.key)}
                  aria-pressed={on}
                  className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[14px] font-medium transition ${
                    on
                      ? 'border-action-500 bg-brand-50 text-action-500'
                      : 'border-surface-line bg-white text-ink-700 hover:bg-surface-soft'
                  }`}
                >
                  <Icon name={t.icon} size={22} strokeWidth={1.8} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <h3 className="mt-6 text-[16px] font-bold text-ink-900">
            Pick-up &amp; Drop <span className="font-normal text-ink-500">(Optional)</span>
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[15px] text-ink-700">From</span>
              <select
                value={form.pickupFrom}
                onChange={(e) => set('pickupFrom', e.target.value)}
                className={`${FIELD} mt-2 cursor-pointer`}
              >
                {opts.pickupFrom.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[15px] text-ink-700">To</span>
              <select
                value={form.pickupTo}
                onChange={(e) => set('pickupTo', e.target.value)}
                className={`${FIELD} mt-2 cursor-pointer`}
              >
                {opts.pickupTo.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>

          <h3 className="mt-6 text-[16px] font-bold text-ink-900">Sightseeing</h3>
          <p className="text-[14px] text-ink-500">Do you want sightseeing?</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {['Yes', 'No'].map((v) => (
              <Pill key={v} on={form.sightseeing === v} onClick={() => set('sightseeing', v)}>
                {v}
              </Pill>
            ))}
          </div>
        </section>

        {/* -- Eating ---------------------------------------------- */}
        <section className="border-t border-surface-line py-6">
          <Ask icon={Utensils} title="Meal Preference" note="Select your preferred meal plan" />

          <select
            value={form.mealPlan}
            onChange={(e) => set('mealPlan', e.target.value)}
            aria-label="Meal plan"
            className={`${FIELD} mt-5 cursor-pointer`}
          >
            {opts.mealPlans.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <h3 className="mt-6 text-[16px] font-bold text-ink-900">Meal Details</h3>
          <p className="text-[14px] text-ink-500">Select your meal preference type</p>

          <div className="mt-3 flex flex-wrap gap-3">
            {opts.mealTypes.map((m) => {
              const on = form.mealType === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => set('mealType', m.key)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[15px] transition ${
                    on ? 'border-action-500 bg-brand-50' : 'border-surface-line bg-white hover:bg-surface-soft'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {m.dots.map((colour) => (
                      <span
                        key={colour}
                        aria-hidden="true"
                        className="grid h-[18px] w-[18px] place-items-center rounded-[3px] border-2"
                        style={{ borderColor: colour }}
                      >
                        <span
                          className="block h-2 w-2 rounded-full"
                          style={{ backgroundColor: colour }}
                        />
                      </span>
                    ))}
                  </span>
                  {m.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* -- Anything else --------------------------------------- */}
        <section className="border-t border-surface-line py-6">
          <h3 className="text-[16px] font-bold text-ink-900">
            Additional Preferences <span className="font-normal text-ink-500">(Optional)</span>
          </h3>

          <div className="mt-4 space-y-3.5">
            {opts.extras.map((x) => {
              const on = extras.includes(x);
              return (
                <label key={x} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(extras, setExtras, x)}
                    className="sr-only"
                  />
                  <span
                    className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[3px] border-2 ${
                      on ? 'border-action-500 bg-action-500 text-white' : 'border-ink-900 bg-white'
                    }`}
                  >
                    {on && <Check size={12} strokeWidth={3.5} />}
                  </span>
                  <span className="text-[16px] text-ink-900">{x}</span>
                </label>
              );
            })}
          </div>

          <h3 className="mt-7 flex items-center gap-2.5 text-[16px] font-bold text-ink-900">
            <Icon name="FileText" size={20} className="text-ink-500" strokeWidth={1.8} />
            Any specific travel needs?
          </h3>

          <div className="relative mt-3">
            <textarea
              rows={3}
              maxLength={120}
              value={form.needs}
              onChange={(e) => set('needs', e.target.value)}
              placeholder="Tell us anything else about your travel preferences.."
              className={`${FIELD} resize-none pb-8`}
            />
            <span className="pointer-events-none absolute bottom-3 right-4 text-[13px] text-ink-400">
              {form.needs.length}/120
            </span>
          </div>
        </section>

        <button
          type="submit"
          className="btn-primary mt-4 w-full gap-3 rounded-xl py-4 text-[17px] normal-case tracking-normal lg:col-span-2"
        >
          Save My Trip
          <ArrowRight size={19} />
        </button>
      </div>
    </form>
  );
}
