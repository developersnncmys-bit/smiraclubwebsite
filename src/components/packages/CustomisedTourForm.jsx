'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Building2, Cake, Calendar, Check, FileText, Headset, Info, Loader2, Luggage, MapPin,
  Phone, Users, Utensils, Zap,
} from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { api } from '@/lib/api';
import { intlForm, planTrip as opts } from '@/lib/content';

const FIELD =
  'w-full rounded-xl border border-surface-line bg-white px-4 py-3.5 text-[14px] text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-action-500';

/** The heading each block opens with. */
function Ask({ icon: Glyph, title, note }) {
  return (
    <div className="flex items-start gap-3">
      <Glyph size={21} className="mt-0.5 shrink-0 text-action-500" strokeWidth={1.8} />
      <div>
        <h2 className="text-[15px] font-bold leading-snug text-ink-900">{title}</h2>
        {note && <p className="text-[13px] text-ink-500">{note}</p>}
      </div>
    </div>
  );
}

/** A selectable pill. */
function Pill({ on, onClick, children, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[14px] transition ${
        on
          ? 'border-action-500 bg-brand-50 font-semibold text-action-500'
          : 'border-surface-line bg-white text-ink-900 hover:bg-surface-soft'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/** A square checkbox with its label. */
function Tick({ on, onClick, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" checked={on} onChange={onClick} className="sr-only" />
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[3px] border-2 ${
          on ? 'border-action-500 bg-action-500 text-white' : 'border-ink-900 bg-white'
        }`}
      >
        {on && <Check size={12} strokeWidth={3.5} />}
      </span>
      <span className="text-[15px] text-ink-900">{children}</span>
    </label>
  );
}

/** The − value + row the guest counts use. */
function Stepper({ label, value, onChange, min = 0, max = 20 }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[15px] text-ink-900">{label}</span>

      <span className="flex items-center gap-1 rounded-lg border border-action-500 px-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`One fewer ${label}`}
          className="grid h-9 w-9 place-items-center text-[17px] font-bold text-action-500 disabled:opacity-30"
        >
          &minus;
        </button>
        <span className="w-7 text-center text-[15px] font-bold text-ink-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`One more ${label}`}
          className="grid h-9 w-9 place-items-center text-[17px] font-bold text-action-500 disabled:opacity-30"
        >
          +
        </button>
      </span>
    </div>
  );
}

/** The pill switch. */
function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        on ? 'bg-action-500' : 'bg-surface-line'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          on ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

/**
 * Customised Tours.
 *
 * The desk builds the trip from these answers, so nothing here is required
 * beyond where you want to go and how to reach you — an enquiry that refuses
 * to send because the meal plan is blank is an enquiry that never arrives, and
 * one with no number on it is one nobody can answer.
 *
 * Sending it creates a lead in the admin panel's Sales & Leads, with every
 * answer written onto it for whoever calls back.
 *
 * It shares the option lists with Plan My Trip rather than repeating them, so
 * adding a transport mode or a meal plan reaches both screens at once.
 */
export default function CustomisedTourForm() {
  const router = useRouter();

  const [where, setWhere] = useState('');
  const [hotel, setHotel] = useState(intlForm.hotelPreferences[0]);
  const [dateMode, setDateMode] = useState('Exact Date');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [duration, setDuration] = useState(intlForm.durations[0]);

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [childAges, setChildAges] = useState([]);
  const [pets, setPets] = useState(true);

  const [occasion, setOccasion] = useState(opts.occasions[0]);
  const [note, setNote] = useState('');

  const [transport, setTransport] = useState(['flight']);
  const [pickupFrom, setPickupFrom] = useState(opts.pickupFrom[0]);
  const [pickupTo, setPickupTo] = useState(opts.pickupTo[0]);
  const [dropFrom, setDropFrom] = useState(intlForm.dropFrom[0]);
  const [dropTo, setDropTo] = useState(intlForm.dropTo[0]);
  const [returnTransfer, setReturnTransfer] = useState(true);
  const [sightseeing, setSightseeing] = useState('Yes');

  const [mealPlan, setMealPlan] = useState(opts.mealPlans[0]);
  const [mealType, setMealType] = useState('veg');
  const [extras, setExtras] = useState([]);
  const [support, setSupport] = useState([]);
  const [needs, setNeeds] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  /** Children and their ages are one number — the list length is the count. */
  const setChildren = (n) =>
    setChildAges((ages) =>
      n > ages.length
        ? [...ages, ...Array(n - ages.length).fill(intlForm.childAges[3])]
        : ages.slice(0, n),
    );

  const submit = async (e) => {
    e.preventDefault();

    // Only what the desk cannot do without.
    const found = {};
    if (!where.trim()) found.where = 'Tell us where you would like to go.';
    if (name.trim().length < 2) found.name = 'Tell us your name.';
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) found.phone = 'Enter a 10-digit mobile number.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) found.email = 'That email does not look right.';
    if (checkIn && checkOut && checkOut < checkIn) found.dates = 'Check-out has to be after check-in.';
    setErrors(found);
    setFailed('');
    if (Object.keys(found).length) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setBusy(true);
    try {
      const res = await api.tripEnquiry({
        name: name.trim(),
        phone,
        email: email.trim(),
        destination: where.trim(),
        hotel,
        dateMode,
        checkIn,
        checkOut,
        duration,
        rooms,
        adults,
        childAges,
        pets,
        occasion,
        note,
        transport: opts.transport.filter((t) => transport.includes(t.key)).map((t) => t.label),
        pickupFrom,
        pickupTo,
        dropFrom,
        dropTo,
        returnTransfer,
        sightseeing,
        mealPlan,
        mealType: opts.mealTypes.find((m) => m.key === mealType)?.label || mealType,
        extras,
        support,
        needs,
      });
      setSent({ reference: res.data?.reference });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFailed(
        err.status
          ? err.message
          : 'We could not reach our travel desk just now. Please try again in a moment.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="shell py-10 text-center lg:mx-auto lg:max-w-lg">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-[6px] border-brand-700">
          <Check size={38} className="text-brand-700" strokeWidth={3} />
        </span>
        <h2 className="mt-6 text-2xl font-extrabold text-ink-900">Enquiry sent</h2>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink-600">
          Our travel desk will call you on{' '}
          <span className="font-semibold text-ink-900">+91 {phone.replace(/\D/g, '').slice(-10)}</span> with
          options for <span className="font-semibold text-ink-900">{where}</span>.
        </p>
        {sent.reference && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-surface-soft px-4 py-2.5 text-[14px] text-ink-700">
            Your reference
            <span className="font-extrabold tracking-wider text-brand-700">{sent.reference}</span>
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push('/packages/international')}
          className="btn-primary mt-7 w-full rounded-xl py-4 text-[15px] lg:w-auto lg:px-10 lg:py-3.5"
        >
          Back to International Trips
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="shell space-y-4 pb-10 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-4 lg:space-y-0">
      {/* -- Where ------------------------------------------------- */}
      <section className="card p-4 sm:p-5 lg:col-span-2">
        <Ask icon={MapPin} title="Where would you like to go?" />
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Enter City, destination, hotel name.."
          aria-invalid={errors.where ? 'true' : undefined}
          className={`${FIELD} mt-4`}
        />
        {errors.where && <p className="mt-2 text-[13px] text-red-600">{errors.where}</p>}
      </section>

      {/* -- Who to call ------------------------------------------- */}
      <section className="card p-4 sm:p-5 lg:col-span-2">
        <Ask icon={Phone} title="Your Details" note="So our travel desk can call you back" />

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-[14px] text-ink-700">Full Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={errors.name ? 'true' : undefined}
              className={`${FIELD} mt-2`}
            />
            {errors.name && <span className="mt-1.5 block text-[13px] text-red-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="text-[14px] text-ink-700">Mobile Number</span>
            <span className="mt-2 flex">
              <span className="grid place-items-center rounded-l-xl border border-r-0 border-surface-line bg-surface-soft px-3 text-[14px] font-semibold text-ink-700">
                +91
              </span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile"
                aria-invalid={errors.phone ? 'true' : undefined}
                className={`${FIELD} rounded-l-none`}
              />
            </span>
            {errors.phone && <span className="mt-1.5 block text-[13px] text-red-600">{errors.phone}</span>}
          </label>

          <label className="block">
            <span className="text-[14px] text-ink-700">
              Email <span className="text-ink-400">(Optional)</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? 'true' : undefined}
              className={`${FIELD} mt-2`}
            />
            {errors.email && <span className="mt-1.5 block text-[13px] text-red-600">{errors.email}</span>}
          </label>
        </div>
      </section>

      {/* -- What kind of stay ------------------------------------ */}
      <section className="card p-4 sm:p-5">
        <Ask icon={Building2} title="Hotel Preference" note="Select your preferred hotel type" />

        <div className="mt-4 flex flex-wrap gap-3">
          {intlForm.hotelPreferences.map((h) => (
            <Pill key={h} on={hotel === h} onClick={() => setHotel(h)}>
              {h}
            </Pill>
          ))}
        </div>

        {hotel === 'Free Stay' && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#eaf1fe] px-3.5 py-2.5 text-[14px] font-semibold text-action-500">
            <Zap size={16} fill="currentColor" strokeWidth={0} />
            Pay for food
          </p>
        )}
      </section>

      {/* -- When -------------------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <Ask icon={Calendar} title="Travel Dates" />

        <div className="mt-4 grid grid-cols-2 gap-3">
          {['Exact Date', 'Flexible Window'].map((m) => (
            <Pill key={m} on={dateMode === m} onClick={() => setDateMode(m)}>
              <span className="mx-auto">{m}</span>
            </Pill>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-[14px] text-ink-700">Check In</span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className={`${FIELD} mt-2`}
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[14px] text-ink-700">Check Out</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || undefined}
            className={`${FIELD} mt-2`}
          />
        </label>
        {errors.dates && <p className="mt-2 text-[13px] text-red-600">{errors.dates}</p>}

        <label className="mt-4 block">
          <span className="text-[14px] text-ink-700">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={`${FIELD} mt-2 cursor-pointer`}
          >
            {intlForm.durations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </section>

      {/* -- Who --------------------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <Ask icon={Users} title="Guests & Rooms" note="Select Number of Guests" />

        <div className="mt-3 divide-y divide-surface-line">
          <Stepper label="Rooms" value={rooms} onChange={setRooms} min={1} />
          <Stepper label="Adults" value={adults} onChange={setAdults} min={1} />
          <Stepper label="Children" value={childAges.length} onChange={setChildren} max={10} />
        </div>

        {childAges.length > 0 && (
          <>
            <h3 className="mt-5 text-[15px] font-bold text-ink-900">Age of Children</h3>
            <div className="mt-3 space-y-3">
              {childAges.map((age, i) => (
                <label key={i} className="block">
                  <span className="text-[14px] text-ink-700">Child {i + 1} Age</span>
                  <select
                    value={age}
                    onChange={(e) =>
                      setChildAges((list) =>
                        list.map((a, n) => (n === i ? e.target.value : a)),
                      )
                    }
                    className={`${FIELD} mt-2 cursor-pointer`}
                  >
                    {intlForm.childAges.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </>
        )}

        <h3 className="mt-5 text-[15px] font-bold text-ink-900">Pets</h3>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-[15px] text-ink-700">Travelling with pets?</span>
          <Toggle on={pets} onChange={setPets} label="Travelling with pets" />
        </div>
      </section>

      {/* -- What for ---------------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <Ask icon={Cake} title="Occasion" note="What are you celebrating?" />

        <div className="mt-4 flex flex-wrap gap-3">
          {opts.occasions.map((o) => (
            <Pill key={o} on={occasion === o} onClick={() => setOccasion(occasion === o ? '' : o)}>
              {o}
            </Pill>
          ))}
        </div>

        <h3 className="mt-5 text-[15px] font-bold text-ink-900">
          Special Note <span className="font-normal text-ink-500">(Optional)</span>
        </h3>
        <p className="text-[13px] text-ink-500">Any special requests or requirements</p>

        <div className="relative mt-3">
          <textarea
            rows={3}
            maxLength={120}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="E.g. Birthday decor in room"
            className={`${FIELD} resize-none pb-8`}
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-[13px] text-ink-400">
            {note.length}/120
          </span>
        </div>
      </section>

      {/* -- Getting around ---------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <Ask icon={Luggage} title="Transport Preference" note="Select all that apply" />

        <div className="mt-4 grid grid-cols-4 gap-3">
          {opts.transport.map((t) => {
            const on = transport.includes(t.key);
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => toggle(transport, setTransport, t.key)}
                aria-pressed={on}
                className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[13px] font-medium transition ${
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

        <h3 className="mt-5 text-[15px] font-bold text-ink-900">
          Pick-up &amp; Drop <span className="font-normal text-ink-500">(Optional)</span>
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: 'From', value: pickupFrom, set: setPickupFrom, list: opts.pickupFrom },
            { label: 'To', value: pickupTo, set: setPickupTo, list: opts.pickupTo },
            { label: 'Drop From', value: dropFrom, set: setDropFrom, list: intlForm.dropFrom },
            { label: 'Drop To', value: dropTo, set: setDropTo, list: intlForm.dropTo },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="text-[14px] text-ink-700">{f.label}</span>
              <select
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className={`${FIELD} mt-2 cursor-pointer`}
              >
                {f.list.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <Tick on={returnTransfer} onClick={() => setReturnTransfer((v) => !v)}>
            Return Transfer Pick-up &amp; Drop
          </Tick>

          {returnTransfer && (
            <p className="mt-3 flex gap-2.5 rounded-lg bg-[#eaf1fe] px-3.5 py-3 text-[13px] leading-snug text-brand-700">
              <Info size={17} className="mt-0.5 shrink-0 text-action-500" />
              We will arrange your return pick-up &amp; Drop based on your Travel dates.
            </p>
          )}
        </div>

        <h3 className="mt-5 text-[15px] font-bold text-ink-900">Sightseeing</h3>
        <p className="text-[13px] text-ink-500">Do you want sightseeing?</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {['Yes', 'No'].map((v) => (
            <Pill key={v} on={sightseeing === v} onClick={() => setSightseeing(v)}>
              <span className="mx-auto">{v}</span>
            </Pill>
          ))}
        </div>
      </section>

      {/* -- Eating ------------------------------------------------ */}
      <section className="card p-4 sm:p-5">
        <Ask icon={Utensils} title="Meal Preference" note="Select your preferred meal plan" />

        <select
          value={mealPlan}
          onChange={(e) => setMealPlan(e.target.value)}
          aria-label="Meal plan"
          className={`${FIELD} mt-4 cursor-pointer`}
        >
          {opts.mealPlans.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <h3 className="mt-5 text-[15px] font-bold text-ink-900">Meal Details</h3>
        <p className="text-[13px] text-ink-500">Select your meal preference type</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {opts.mealTypes.map((m) => {
            const on = mealType === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMealType(m.key)}
                aria-pressed={on}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[14px] transition ${
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

      {/* -- Anything else ----------------------------------------- */}
      <section className="card p-4 sm:p-5">
        <h3 className="text-[15px] font-bold text-ink-900">
          Additional Preferences <span className="font-normal text-ink-500">(Optional)</span>
        </h3>

        <div className="mt-4 space-y-3.5">
          {opts.extras.map((x) => (
            <Tick key={x} on={extras.includes(x)} onClick={() => toggle(extras, setExtras, x)}>
              {x}
            </Tick>
          ))}
        </div>
      </section>

      {/* -- What the desk should arrange -------------------------- */}
      <section className="card p-4 sm:p-5">
        <Ask
          icon={Headset}
          title="Travel Support"
          note="Select the support services you need"
        />

        <div className="mt-4 space-y-3.5">
          {intlForm.support.map((sName) => (
            <Tick
              key={sName}
              on={support.includes(sName)}
              onClick={() => toggle(support, setSupport, sName)}
            >
              {sName}
            </Tick>
          ))}
        </div>
      </section>

      <section className="card p-4 sm:p-5 lg:col-span-2">
        <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-ink-900">
          <FileText size={19} className="text-ink-500" strokeWidth={1.8} />
          Any specific travel needs?
        </h3>

        <div className="relative mt-3">
          <textarea
            rows={3}
            maxLength={120}
            value={needs}
            onChange={(e) => setNeeds(e.target.value)}
            placeholder="Tell us anything else about your travel preferences.."
            className={`${FIELD} resize-none pb-8`}
          />
          <span className="pointer-events-none absolute bottom-3 right-4 text-[13px] text-ink-400">
            {needs.length}/120
          </span>
        </div>
      </section>

      {failed && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700 lg:col-span-2">
          {failed}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary w-full gap-3 rounded-xl py-4 text-[15px] normal-case tracking-normal lg:col-span-2 lg:w-auto lg:justify-self-start lg:px-10 lg:py-3.5"
      >
        {busy ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            Check Availability
            <ArrowRight size={19} />
          </>
        )}
      </button>
    </form>
  );
}
