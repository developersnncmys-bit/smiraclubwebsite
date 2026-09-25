'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

/**
 * Becoming a partner, in the client's five steps.
 *
 * The same five the desk and the partner portal use — account and property,
 * rooms, amenities, pricing and inventory, ownership and legal — so a hotel
 * that applies here arrives as the same record as one the desk types in, and
 * nothing has to be asked twice.
 *
 * Only the property name and a phone number are required to send it. Every
 * other field is the desk's to chase during verification, which is what that
 * stage is for: a form that demands a GST number before anyone has decided to
 * apply is a form that gets abandoned halfway.
 */

const STEPS = [
  'Account and property',
  'Rooms',
  'Amenities',
  'Pricing and inventory',
  'Ownership and legal',
];

const PROPERTY_TYPES = ['Hotel', 'Resort', 'Homestay', 'Villa', 'Camp', 'Lifestyle'];
const ACCOUNT_TYPES = ['Hotel / Property', 'Channel manager'];
const OWNERSHIP = ['Self owned', 'Company owned', 'Family owned', 'Lease', 'Other'];
const MEAL_PLANS = ['EP — Room only', 'CP — Breakfast', 'MAP — Breakfast + Dinner', 'AP — All meals'];

const POPULAR = [
  'Wi-Fi', 'Swimming Pool', 'Parking', 'Restaurant', 'Breakfast', 'Room Service', 'AC', 'TV',
  'Gym', 'Spa', 'Kids Play Area', 'Conference Room', 'Pet Friendly',
];
const FACILITIES = [
  'Garden', 'Beach Access', 'Bar', 'Indoor Games', 'Outdoor Games', 'Bonfire',
  'Airport Transfer', 'Laundry', 'Elevator', 'Power Backup',
];
const RULES = [
  'Valid ID Required', 'Couple Friendly', 'Pets Allowed', 'Smoking', 'Alcohol', 'Visitors',
];

const EMPTY_ROOM = {
  name: '', type: '', count: '', size: '', bedType: '',
  adults: '', children: '', maxOccupancy: '', extraBed: false, amenities: '', description: '',
};

/** A labelled input, since the form is mostly made of them. */
function Field({ label, required, optional, error, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline gap-2 text-[13px] font-semibold text-ink-700">
        {label}
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-[12px] font-medium text-ink-400">optional</span>}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-[12px] font-semibold text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-[12px] text-ink-400">{hint}</span>
      )}
    </label>
  );
}

/** One block of the step, the way the sheet groups them. */
function Group({ title, note, children, cols = 'sm:grid-cols-2' }) {
  return (
    <section className="rounded-2xl border border-surface-line p-4 sm:p-5">
      <h3 className="text-[15px] font-bold text-ink-900">{title}</h3>
      {note && <p className="mt-0.5 text-[13px] text-ink-500">{note}</p>}
      <div className={`mt-4 grid gap-4 ${cols}`}>{children}</div>
    </section>
  );
}

/** A tick-chip, for the lists that are pick-as-many. */
function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${
        on
          ? 'border-action-500 bg-brand-50 text-action-500'
          : 'border-surface-line text-ink-600 hover:border-action-500'
      }`}
    >
      {on && <Check size={13} strokeWidth={3} />}
      {children}
    </button>
  );
}

export default function PartnerWizard() {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');
  const [done, setDone] = useState(null);
  const [errors, setErrors] = useState({});

  const [account, setAccount] = useState({ fullName: '', email: '', phone: '', alternatePhone: '', accountType: '' });
  const [property, setProperty] = useState({
    type: '', name: '', starCategory: '', contactName: '', contactPhone: '', contactEmail: '',
    bookingStartDate: '', description: '',
  });
  const [location, setLocation] = useState({
    line1: '', line2: '', landmark: '', city: '', state: '', country: 'India', pin: '',
    latitude: '', longitude: '', mapsUrl: '',
  });
  const [rooms, setRooms] = useState([{ ...EMPTY_ROOM }]);
  const [amenities, setAmenities] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [rules, setRules] = useState([]);
  const [pricing, setPricing] = useState({
    standardTariff: '', partnerRate: '', weekdayRate: '', weekendRate: '',
    extraAdultRate: '', childRate: '', mealPlans: [],
  });
  const [inventory, setInventory] = useState({ totalRooms: '', availableRooms: '', closedDates: '', blackoutDates: '' });
  const [policies, setPolicies] = useState({
    checkIn: '', checkOut: '', freeCancellationUntil: '', cancellationCharge: '', noShowPolicy: '',
  });
  const [ownership, setOwnership] = useState({
    type: '', pan: '', gst: '', tan: '',
    documentLinks: { ownershipProof: '', leaseAgreement: '', authorisation: '' },
  });
  const [bank, setBank] = useState({ holder: '', bankName: '', accountNumber: '', ifsc: '', branch: '', proofLink: '' });
  const [agreed, setAgreed] = useState(false);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const setRoom = (i, key, value) =>
    setRooms((all) => all.map((r, n) => (n === i ? { ...r, [key]: value } : r)));

  const input = 'field';

  /** Only what we genuinely cannot file without, and only on the last step. */
  const check = () => {
    const found = {};
    if (!property.name.trim()) found.name = 'Tell us the property name.';
    const digits = String(account.phone || property.contactPhone || '').replace(/\D/g, '');
    if (!/^\d{10}$/.test(digits.slice(-10))) found.phone = 'A 10-digit mobile number, please.';
    if (!agreed) found.agreed = 'Please accept the partner agreement.';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async () => {
    if (busy) return;
    if (!check()) {
      setStep(errors.agreed && property.name.trim() ? 5 : 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setBusy(true);
    setFailed('');
    const phone = String(account.phone || property.contactPhone).replace(/\D/g, '').slice(-10);
    const num = (v) => (v === '' || v === null ? undefined : Number(v));

    try {
      const res = await api.applyAsPartner({
        // What the desk's own partner list reads at a glance…
        name: property.name.trim(),
        category: property.type || 'Hotel',
        location: [location.city, location.state].filter(Boolean).join(', '),
        contact: property.contactName || account.fullName,
        phone: `+91 ${phone}`,
        whatsapp: `+91 ${phone}`,
        email: property.contactEmail || account.email,
        gst: ownership.gst,
        pan: ownership.pan,
        rooms: num(inventory.totalRooms) || rooms.length,
        // …and the whole five steps behind it.
        listing: {
          account: { ...account, phone: undefined },
          property,
          location,
          rooms: rooms
            .filter((r) => r.name.trim() || r.type.trim())
            .map((r) => ({
              ...r,
              count: num(r.count), adults: num(r.adults),
              children: num(r.children), maxOccupancy: num(r.maxOccupancy),
            })),
          amenities,
          facilities,
          rules,
          pricing: {
            ...pricing,
            standardTariff: num(pricing.standardTariff),
            partnerRate: num(pricing.partnerRate),
            weekdayRate: num(pricing.weekdayRate),
            weekendRate: num(pricing.weekendRate),
            extraAdultRate: num(pricing.extraAdultRate),
            childRate: num(pricing.childRate),
          },
          inventory: {
            ...inventory,
            totalRooms: num(inventory.totalRooms),
            availableRooms: num(inventory.availableRooms),
          },
          policies,
          ownership,
          bank,
          agreementAccepted: true,
          step: 5,
        },
      });
      setDone(res.data || {});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setFailed(err?.status ? err.message : 'We could not reach Smira just now. Please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="card p-6 text-center sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50">
          <Check size={26} className="text-green-600" strokeWidth={3} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-ink-900">
          {done.name || property.name} is with our partnerships desk
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-600">
          {done.reference && (
            <>
              Your reference is <span className="font-bold text-ink-900">{done.reference}</span>.{' '}
            </>
          )}
          We will call you within one working day to verify the papers and agree your rates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* -- Which step ------------------------------------------------- */}
      <ol className="card grid grid-cols-5 gap-1.5 p-3">
        {STEPS.map((title, i) => {
          const n = i + 1;
          const on = step === n;
          return (
            <li key={title}>
              <button
                type="button"
                onClick={() => setStep(n)}
                className={`w-full rounded-xl px-2 py-2 text-left transition ${
                  on ? 'bg-brand-50 ring-1 ring-action-500/30' : 'hover:bg-surface-soft'
                }`}
              >
                <span className={`block text-[11px] font-extrabold ${on ? 'text-action-500' : 'text-ink-400'}`}>
                  STEP {n}
                </span>
                <span className="hidden text-[12px] font-bold leading-tight text-ink-800 sm:block">{title}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="card space-y-4 p-4 sm:p-6">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-action-500">Step {step} of 5</p>
          <h2 className="text-xl font-bold text-ink-900">{STEPS[step - 1]}</h2>
        </div>

        {/* -- Step 1 --------------------------------------------------- */}
        {step === 1 && (
          <>
            <Group title="Account registration" note="Who runs the account with us.">
              <Field label="Full name">
                <input className={input} value={account.fullName} onChange={(e) => setAccount({ ...account, fullName: e.target.value })} autoComplete="name" />
              </Field>
              <Field label="Email address" optional>
                <input className={input} type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
              </Field>
              <Field label="Mobile number" required error={errors.phone} hint="We send your sign-in code here.">
                <input className={input} inputMode="numeric" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
              </Field>
              <Field label="Alternate number" optional>
                <input className={input} inputMode="numeric" value={account.alternatePhone} onChange={(e) => setAccount({ ...account, alternatePhone: e.target.value })} />
              </Field>
              <Field label="Account type" optional>
                <select className={input} value={account.accountType} onChange={(e) => setAccount({ ...account, accountType: e.target.value })}>
                  <option value="">Select</option>
                  {ACCOUNT_TYPES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </Group>

            <Group title="Basic property information" note="What you are listing.">
              <Field label="Property type" optional>
                <select className={input} value={property.type} onChange={(e) => setProperty({ ...property, type: e.target.value })}>
                  <option value="">Select</option>
                  {PROPERTY_TYPES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Property name" required error={errors.name}>
                <input className={input} value={property.name} onChange={(e) => setProperty({ ...property, name: e.target.value })} placeholder="Sunrise Beach Resort" />
              </Field>
              <Field label="Star category" optional>
                <input className={input} value={property.starCategory} onChange={(e) => setProperty({ ...property, starCategory: e.target.value })} placeholder="3 star" />
              </Field>
              <Field label="Property contact name" optional>
                <input className={input} value={property.contactName} onChange={(e) => setProperty({ ...property, contactName: e.target.value })} />
              </Field>
              <Field label="Property mobile" optional>
                <input className={input} inputMode="numeric" value={property.contactPhone} onChange={(e) => setProperty({ ...property, contactPhone: e.target.value })} />
              </Field>
              <Field label="Property email" optional>
                <input className={input} type="email" value={property.contactEmail} onChange={(e) => setProperty({ ...property, contactEmail: e.target.value })} />
              </Field>
              <Field label="Booking start date" optional>
                <input className={input} type="date" value={property.bookingStartDate} onChange={(e) => setProperty({ ...property, bookingStartDate: e.target.value })} />
              </Field>
              <Field label="Description and stay guideline" optional className="sm:col-span-2">
                <textarea className={`${input} min-h-[96px] resize-y`} value={property.description} onChange={(e) => setProperty({ ...property, description: e.target.value })} placeholder="What makes the property worth a stay, and anything a guest should know." />
              </Field>
            </Group>

            <Group title="Property location" note="Where a guest is actually going.">
              <Field label="Address line 1" optional>
                <input className={input} value={location.line1} onChange={(e) => setLocation({ ...location, line1: e.target.value })} />
              </Field>
              <Field label="Address line 2" optional>
                <input className={input} value={location.line2} onChange={(e) => setLocation({ ...location, line2: e.target.value })} />
              </Field>
              <Field label="Landmark" optional>
                <input className={input} value={location.landmark} onChange={(e) => setLocation({ ...location, landmark: e.target.value })} />
              </Field>
              <Field label="City" optional>
                <input className={input} value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} />
              </Field>
              <Field label="State" optional>
                <input className={input} value={location.state} onChange={(e) => setLocation({ ...location, state: e.target.value })} />
              </Field>
              <Field label="Country" optional>
                <input className={input} value={location.country} onChange={(e) => setLocation({ ...location, country: e.target.value })} />
              </Field>
              <Field label="PIN code" optional>
                <input className={input} value={location.pin} onChange={(e) => setLocation({ ...location, pin: e.target.value })} />
              </Field>
              <Field label="Google Maps link" optional className="sm:col-span-2">
                <input className={input} value={location.mapsUrl} onChange={(e) => setLocation({ ...location, mapsUrl: e.target.value })} placeholder="https://maps.google.com/…" />
              </Field>
            </Group>
          </>
        )}

        {/* -- Step 2 --------------------------------------------------- */}
        {step === 2 && (
          <>
            {rooms.map((room, i) => (
              <Group key={`room-${i}`} title={`Room category ${i + 1}`} note="A room type and what it sleeps.">
                <Field label="Room name" optional>
                  <input className={input} value={room.name} onChange={(e) => setRoom(i, 'name', e.target.value)} placeholder="Deluxe Room" />
                </Field>
                <Field label="Room type" optional>
                  <input className={input} value={room.type} onChange={(e) => setRoom(i, 'type', e.target.value)} placeholder="Deluxe" />
                </Field>
                <Field label="Number of rooms" optional>
                  <input className={input} inputMode="numeric" value={room.count} onChange={(e) => setRoom(i, 'count', e.target.value)} placeholder="10" />
                </Field>
                <Field label="Room size" optional>
                  <input className={input} value={room.size} onChange={(e) => setRoom(i, 'size', e.target.value)} placeholder="320 sq ft" />
                </Field>
                <Field label="Bed type" optional>
                  <input className={input} value={room.bedType} onChange={(e) => setRoom(i, 'bedType', e.target.value)} placeholder="1 King Bed" />
                </Field>
                <Field label="Maximum occupancy" optional>
                  <input className={input} inputMode="numeric" value={room.maxOccupancy} onChange={(e) => setRoom(i, 'maxOccupancy', e.target.value)} placeholder="3" />
                </Field>
                <Field label="Adults" optional>
                  <input className={input} inputMode="numeric" value={room.adults} onChange={(e) => setRoom(i, 'adults', e.target.value)} placeholder="2" />
                </Field>
                <Field label="Children" optional>
                  <input className={input} inputMode="numeric" value={room.children} onChange={(e) => setRoom(i, 'children', e.target.value)} placeholder="1" />
                </Field>
                <Field label="Room amenities" optional className="sm:col-span-2">
                  <input className={input} value={room.amenities} onChange={(e) => setRoom(i, 'amenities', e.target.value)} placeholder="AC, TV, balcony…" />
                </Field>
                <Field label="Room description" optional className="sm:col-span-2">
                  <textarea className={`${input} min-h-[80px] resize-y`} value={room.description} onChange={(e) => setRoom(i, 'description', e.target.value)} />
                </Field>

                <label className="flex items-center gap-2 text-[13px] font-medium text-ink-700">
                  <input type="checkbox" checked={room.extraBed} onChange={(e) => setRoom(i, 'extraBed', e.target.checked)} className="h-4 w-4 rounded border-surface-line" />
                  Extra bed available
                </label>

                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRooms((all) => all.filter((_, n) => n !== i))}
                    className="inline-flex items-center gap-1.5 justify-self-start text-[13px] font-semibold text-red-600"
                  >
                    <Trash2 size={14} /> Remove this room
                  </button>
                )}
              </Group>
            ))}

            <button
              type="button"
              onClick={() => setRooms((all) => [...all, { ...EMPTY_ROOM }])}
              className="inline-flex items-center gap-2 rounded-xl border border-action-500 px-4 py-2.5 text-[14px] font-bold text-action-500"
            >
              <Plus size={16} /> Add another room category
            </button>
          </>
        )}

        {/* -- Step 3 --------------------------------------------------- */}
        {step === 3 && (
          <>
            <Group title="Popular amenities" note="Tick whatever the property has." cols="grid-cols-1">
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((a) => (
                  <Chip key={a} on={amenities.includes(a)} onClick={() => toggle(amenities, setAmenities, a)}>{a}</Chip>
                ))}
              </div>
            </Group>

            <Group title="Property facilities" cols="grid-cols-1">
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map((a) => (
                  <Chip key={a} on={facilities.includes(a)} onClick={() => toggle(facilities, setFacilities, a)}>{a}</Chip>
                ))}
              </div>
            </Group>

            <Group title="Property rules" note="What a guest may and may not do." cols="grid-cols-1">
              <div className="flex flex-wrap gap-2">
                {RULES.map((a) => (
                  <Chip key={a} on={rules.includes(a)} onClick={() => toggle(rules, setRules, a)}>{a}</Chip>
                ))}
              </div>
            </Group>
          </>
        )}

        {/* -- Step 4 --------------------------------------------------- */}
        {step === 4 && (
          <>
            <Group title="Rates" note="What a room costs, and what Smira pays.">
              <Field label="Standard tariff (₹)" optional>
                <input className={input} inputMode="numeric" value={pricing.standardTariff} onChange={(e) => setPricing({ ...pricing, standardTariff: e.target.value })} />
              </Field>
              <Field label="Smira partner rate (₹)" optional>
                <input className={input} inputMode="numeric" value={pricing.partnerRate} onChange={(e) => setPricing({ ...pricing, partnerRate: e.target.value })} />
              </Field>
              <Field label="Weekday rate (₹)" optional>
                <input className={input} inputMode="numeric" value={pricing.weekdayRate} onChange={(e) => setPricing({ ...pricing, weekdayRate: e.target.value })} />
              </Field>
              <Field label="Weekend rate (₹)" optional>
                <input className={input} inputMode="numeric" value={pricing.weekendRate} onChange={(e) => setPricing({ ...pricing, weekendRate: e.target.value })} />
              </Field>
              <Field label="Extra adult rate (₹)" optional>
                <input className={input} inputMode="numeric" value={pricing.extraAdultRate} onChange={(e) => setPricing({ ...pricing, extraAdultRate: e.target.value })} />
              </Field>
              <Field label="Child rate (₹)" optional>
                <input className={input} inputMode="numeric" value={pricing.childRate} onChange={(e) => setPricing({ ...pricing, childRate: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <span className="mb-2 block text-[13px] font-semibold text-ink-700">Meal plans</span>
                <div className="flex flex-wrap gap-2">
                  {MEAL_PLANS.map((m) => (
                    <Chip
                      key={m}
                      on={pricing.mealPlans.includes(m)}
                      onClick={() => setPricing({
                        ...pricing,
                        mealPlans: pricing.mealPlans.includes(m)
                          ? pricing.mealPlans.filter((x) => x !== m)
                          : [...pricing.mealPlans, m],
                      })}
                    >
                      {m}
                    </Chip>
                  ))}
                </div>
              </div>
            </Group>

            <Group title="Inventory" note="How many rooms Smira may sell.">
              <Field label="Total rooms" optional>
                <input className={input} inputMode="numeric" value={inventory.totalRooms} onChange={(e) => setInventory({ ...inventory, totalRooms: e.target.value })} />
              </Field>
              <Field label="Available rooms" optional>
                <input className={input} inputMode="numeric" value={inventory.availableRooms} onChange={(e) => setInventory({ ...inventory, availableRooms: e.target.value })} />
              </Field>
              <Field label="Closed dates" optional>
                <input className={input} value={inventory.closedDates} onChange={(e) => setInventory({ ...inventory, closedDates: e.target.value })} placeholder="15–20 Dec" />
              </Field>
              <Field label="Blackout dates" optional>
                <input className={input} value={inventory.blackoutDates} onChange={(e) => setInventory({ ...inventory, blackoutDates: e.target.value })} placeholder="31 Dec" />
              </Field>
            </Group>

            <Group title="Policies" note="Check-in, check-out and cancellation.">
              <Field label="Check-in time" optional>
                <input className={input} value={policies.checkIn} onChange={(e) => setPolicies({ ...policies, checkIn: e.target.value })} placeholder="2 PM" />
              </Field>
              <Field label="Check-out time" optional>
                <input className={input} value={policies.checkOut} onChange={(e) => setPolicies({ ...policies, checkOut: e.target.value })} placeholder="11 AM" />
              </Field>
              <Field label="Free cancellation until" optional>
                <input className={input} value={policies.freeCancellationUntil} onChange={(e) => setPolicies({ ...policies, freeCancellationUntil: e.target.value })} placeholder="48 hours before" />
              </Field>
              <Field label="Cancellation charge" optional>
                <input className={input} value={policies.cancellationCharge} onChange={(e) => setPolicies({ ...policies, cancellationCharge: e.target.value })} placeholder="One night" />
              </Field>
              <Field label="No-show policy" optional className="sm:col-span-2">
                <input className={input} value={policies.noShowPolicy} onChange={(e) => setPolicies({ ...policies, noShowPolicy: e.target.value })} />
              </Field>
            </Group>
          </>
        )}

        {/* -- Step 5 --------------------------------------------------- */}
        {step === 5 && (
          <>
            <Group title="Ownership" note="Who owns the property, and the papers that say so.">
              <Field label="Ownership type" optional>
                <select className={input} value={ownership.type} onChange={(e) => setOwnership({ ...ownership, type: e.target.value })}>
                  <option value="">Select</option>
                  {OWNERSHIP.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="PAN" optional>
                <input className={input} value={ownership.pan} onChange={(e) => setOwnership({ ...ownership, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" />
              </Field>
              <Field label="GST number" optional>
                <input className={input} value={ownership.gst} onChange={(e) => setOwnership({ ...ownership, gst: e.target.value.toUpperCase() })} placeholder="29ABCDE1234F1Z5" />
              </Field>
              <Field label="TAN" optional>
                <input className={input} value={ownership.tan} onChange={(e) => setOwnership({ ...ownership, tan: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Ownership proof (link)" optional>
                <input className={input} value={ownership.documentLinks.ownershipProof} onChange={(e) => setOwnership({ ...ownership, documentLinks: { ...ownership.documentLinks, ownershipProof: e.target.value } })} placeholder="https://…" />
              </Field>
              <Field label="Lease agreement (link)" optional>
                <input className={input} value={ownership.documentLinks.leaseAgreement} onChange={(e) => setOwnership({ ...ownership, documentLinks: { ...ownership.documentLinks, leaseAgreement: e.target.value } })} placeholder="https://…" />
              </Field>
            </Group>

            <Group title="Bank details" note="Where Smira settles your payouts.">
              <Field label="Account holder name" optional>
                <input className={input} value={bank.holder} onChange={(e) => setBank({ ...bank, holder: e.target.value })} />
              </Field>
              <Field label="Bank name" optional>
                <input className={input} value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} />
              </Field>
              <Field label="Account number" optional>
                <input className={input} value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} />
              </Field>
              <Field label="IFSC" optional>
                <input className={input} value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Branch" optional>
                <input className={input} value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} />
              </Field>
              <Field label="Cancelled cheque or bank proof (link)" optional>
                <input className={input} value={bank.proofLink} onChange={(e) => setBank({ ...bank, proofLink: e.target.value })} placeholder="https://…" />
              </Field>
            </Group>

            <label className="flex items-start gap-3 rounded-2xl border border-surface-line p-4 sm:p-5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((x) => ({ ...x, agreed: '' })); }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-line"
              />
              <span className="text-[14px] leading-snug text-ink-700">
                I accept the Smira Club partner agreement, and confirm the details above are correct.
                {errors.agreed && (
                  <span className="mt-1 block text-[12px] font-semibold text-red-600">{errors.agreed}</span>
                )}
              </span>
            </label>
          </>
        )}

        {failed && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            {failed}
          </p>
        )}

        {(errors.name || errors.phone) && step === 5 && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            The property name and a mobile number are needed — both are on step 1.
          </p>
        )}

        {/* -- Onwards ---------------------------------------------------- */}
        <div className="flex items-center justify-between gap-3 border-t border-surface-line pt-4">
          <button
            type="button"
            onClick={() => { setStep(Math.max(1, step - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-line px-4 py-2.5 text-[14px] font-bold text-ink-700 disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="btn-primary gap-2 rounded-xl px-6 py-3 text-[14px] normal-case tracking-normal"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="btn-primary gap-2 rounded-xl px-6 py-3 text-[14px] normal-case tracking-normal disabled:opacity-60"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {busy ? 'Sending…' : 'Submit application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
