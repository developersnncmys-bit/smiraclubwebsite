'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import FileField from '@/components/partners/FileField';
import ImagesField from '@/components/partners/ImagesField';
import { checkPartnerForm, flatten, firstBadStep } from '@/lib/partnerForm';

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

/*
 * One entry for every service this site sells, in the order it lists them.
 * Two of the site's own names cover two kinds of place each — "Waterpark &
 * Themepark" and "Camping & Adventure" — so those are two entries here,
 * because a partner runs one or the other and the form asks them
 * different things.
 */
const PROPERTY_TYPES = [
  'Hotel', 'Resort', 'Villa', 'Homestay', 'Free Stay',
  'International Trip', 'Group Departure', 'Package',
  'Restaurant', 'Water Park', 'Theme Park', 'Games Zone', 'Spa & Salon',
  'Luxury Experience', 'Camp', 'Activity',
  'Flight', 'Train & Bus', 'Transport',
];

/**
 * What the form asks, by what kind of place they run — the same profiles
 * the desk's own listing form uses, so a partner who applies here and a
 * partner the desk adds are asked the same questions.
 *
 * Every type used to get the hotel's form, so a restaurant was asked for
 * its star category and its bed types. The fields underneath are the same
 * — a thing you sell, how many there are, who it holds, what it costs —
 * so this renames them and hides the ones that mean nothing.
 */
const STAY = { star: true, bed: true, extraBed: true, meals: true, times: 'stay', nightly: true };
const VISIT = { star: false, bed: false, extraBed: false, meals: false, times: 'open', nightly: false };

const PROFILES = {
  Hotel: { ...STAY, unit: 'Room', units: 'Rooms', eg: 'Deluxe Room', egType: 'Deluxe' },
  Resort: { ...STAY, unit: 'Room', units: 'Rooms', eg: 'Garden Villa Room', egType: 'Premium' },
  Homestay: { ...STAY, star: false, unit: 'Room', units: 'Rooms', eg: 'Upstairs bedroom', egType: 'Double' },
  Villa: { ...STAY, star: false, unit: 'Villa', units: 'Villas', eg: '3-bedroom pool villa', egType: 'Pool villa' },
  Camp: { ...STAY, star: false, unit: 'Tent', units: 'Tents', eg: 'Riverside tent', egType: 'Deluxe tent' },
  Restaurant: { ...VISIT, unit: 'Table', units: 'Tables', eg: 'Window table for four', egType: 'Four-seater', occupancyLabel: 'Seats' },
  'Spa & Salon': { ...VISIT, unit: 'Treatment', units: 'Treatments', eg: 'Aroma full body massage', egType: '60 minutes', occupancyLabel: 'People at once' },
  'Games Zone': { ...VISIT, unit: 'Game', units: 'Games', eg: 'Bowling lane', egType: 'Lane', occupancyLabel: 'Players' },
  'Theme Park': { ...VISIT, unit: 'Ticket', units: 'Tickets', eg: 'Day pass', egType: 'Day pass', occupancyLabel: 'People covered' },
  Activity: { ...VISIT, unit: 'Activity', units: 'Activities', eg: 'Sunrise trek', egType: 'Half day', occupancyLabel: 'People per slot' },
  Transport: { ...VISIT, unit: 'Vehicle', units: 'Vehicles', eg: 'Innova Crysta', egType: 'SUV', occupancyLabel: 'Seats', times: 'none' },
  'Luxury Experience': { ...VISIT, unit: 'Experience', units: 'Experiences', eg: 'Private yacht evening', egType: 'Evening', occupancyLabel: 'Guests' },
  // What Luxury Experience used to be called; some partners still carry it.
  Lifestyle: { ...VISIT, unit: 'Experience', units: 'Experiences', eg: 'Private yacht evening', egType: 'Evening', occupancyLabel: 'Guests' },
  'Free Stay': { ...STAY, unit: 'Room', units: 'Rooms', eg: 'Deluxe Room', egType: 'Deluxe' },
  'International Trip': { ...VISIT, unit: 'Departure', units: 'Departures', eg: '5 nights Bali, twin sharing', egType: 'Twin sharing', occupancyLabel: 'Travellers', times: 'none' },
  'Water Park': { ...VISIT, unit: 'Ticket', units: 'Tickets', eg: 'Day pass with locker', egType: 'Day pass', occupancyLabel: 'People covered' },
  Package: { ...VISIT, unit: 'Departure', units: 'Departures', eg: '5 nights Kerala, twin sharing', egType: 'Twin sharing', occupancyLabel: 'Travellers', times: 'none' },
  'Group Departure': { ...VISIT, unit: 'Departure', units: 'Departures', eg: '12 Nov, 20 seats', egType: 'Fixed departure', occupancyLabel: 'Seats', times: 'none' },
  Flight: { ...VISIT, unit: 'Fare', units: 'Fares', eg: 'Mumbai - Goa, economy', egType: 'Economy', occupancyLabel: 'Seats', times: 'none' },
  'Train & Bus': { ...VISIT, unit: 'Service', units: 'Services', eg: 'Bengaluru - Goa sleeper', egType: 'Sleeper', occupancyLabel: 'Seats', times: 'none' },
};
const DEFAULT_PROFILE = { ...STAY, unit: 'Room', units: 'Rooms', eg: 'Deluxe Room', egType: 'Deluxe' };
const profileOf = (type) => PROFILES[type] || DEFAULT_PROFILE;
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
  /**
   * What this partner is, and so what the rest of the form asks them.
   * The fields below read this rather than naming rooms and beds outright.
   */
  const kind = profileOf(property.type);

  /** Papers go straight to Smira rather than living in somebody's Drive. */
  const sendFile = async (body) => (await api.uploadPartnerDocument(body)).data;

  const [location, setLocation] = useState({
    line1: '', line2: '', landmark: '', city: '', state: '', country: 'India', pin: '',
    latitude: '', longitude: '', mapsUrl: '',
  });
  const [rooms, setRooms] = useState([{ ...EMPTY_ROOM }]);
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [roomPhotos, setRoomPhotos] = useState([]);
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
  const [bank, setBank] = useState({
    holder: '', bankName: '', accountNumber: '', ifsc: '', branch: '', proofLink: '',
    upiId: '', upiName: '', preferred: '',
  });
  const [agreed, setAgreed] = useState(false);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const setRoom = (i, key, value) =>
    setRooms((all) => all.map((r, n) => (n === i ? { ...r, [key]: value } : r)));

  const input = 'field';

/**
   * Everything the form asks is something the desk needs.
   *
   * It used to insist on three answers — a name, a number and a ticked
   * box — so applications arrived with no address, no tariff and no
   * bank account, and somebody had to ring the partner for all of it.
   */
  const everything = () =>
    checkPartnerForm(
      {
        account, property, location, rooms, propertyPhotos, amenities, facilities,
        rules, pricing, inventory, policies, ownership, bank, agreed,
      },
      kind,
    );

  /** Can we leave this step? Shows what is missing on it, and nothing else. */
  const checkStep = (n) => {
    const found = everything()[n] || {};
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const check = () => {
    const steps = everything();
    setErrors(flatten(steps));
    return firstBadStep(steps) === null;
  };

  const submit = async () => {
    if (busy) return;
    if (!check()) {
      setStep(firstBadStep(everything()) || 1);
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
          photos: { property: propertyPhotos, rooms: roomPhotos },
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
              {/* What kind of account this is comes first. */}
              <Field label="Account type" required error={errors.accountType}>
                <select className={input} value={account.accountType} onChange={(e) => setAccount({ ...account, accountType: e.target.value })}>
                  <option value="">Select</option>
                  {ACCOUNT_TYPES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Full name" required error={errors.fullName}>
                <input className={input} value={account.fullName} onChange={(e) => setAccount({ ...account, fullName: e.target.value })} autoComplete="name" />
              </Field>
              <Field label="Email address" required error={errors.email}>
                <input className={input} type="email" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
              </Field>
              <Field label="Mobile number" required error={errors.phone} hint="We send your sign-in code here.">
                <input className={input} inputMode="numeric" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
              </Field>
              <Field label="Alternate number" required error={errors.alternatePhone}>
                <input className={input} inputMode="numeric" value={account.alternatePhone} onChange={(e) => setAccount({ ...account, alternatePhone: e.target.value })} />
              </Field>
            </Group>

            <Group title="Basic property information" note="What you are listing.">
              <Field label="Property type" required error={errors.type}>
                <select className={input} value={property.type} onChange={(e) => setProperty({ ...property, type: e.target.value })}>
                  <option value="">Select</option>
                  {PROPERTY_TYPES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Property name" required error={errors.name}>
                <input className={input} value={property.name} onChange={(e) => setProperty({ ...property, name: e.target.value })} placeholder="Sunrise Beach Resort" />
              </Field>
              {kind.star && (
                <Field label="Star category" required error={errors.starCategory}>
                  <input className={input} value={property.starCategory} onChange={(e) => setProperty({ ...property, starCategory: e.target.value })} placeholder="3 star" />
                </Field>
              )}
              <Field label="Property contact name" required error={errors.contactName}>
                <input className={input} value={property.contactName} onChange={(e) => setProperty({ ...property, contactName: e.target.value })} />
              </Field>
              <Field label="Property mobile" required error={errors.contactPhone}>
                <input className={input} inputMode="numeric" value={property.contactPhone} onChange={(e) => setProperty({ ...property, contactPhone: e.target.value })} />
              </Field>
              <Field label="Property email" required error={errors.contactEmail}>
                <input className={input} type="email" value={property.contactEmail} onChange={(e) => setProperty({ ...property, contactEmail: e.target.value })} />
              </Field>
              <Field label="Booking start date" required error={errors.bookingStartDate}>
                <input className={input} type="date" value={property.bookingStartDate} onChange={(e) => setProperty({ ...property, bookingStartDate: e.target.value })} />
              </Field>
              <Field label="Description and stay guideline" required error={errors.description} className="sm:col-span-2">
                <textarea className={`${input} min-h-[96px] resize-y`} value={property.description} onChange={(e) => setProperty({ ...property, description: e.target.value })} placeholder="What makes the property worth a stay, and anything a guest should know." />
              </Field>
            </Group>

            <Group title="Property location" note="Where a guest is actually going.">
              <Field label="Address line 1" required error={errors.line1}>
                <input className={input} value={location.line1} onChange={(e) => setLocation({ ...location, line1: e.target.value })} />
              </Field>
              <Field label="Address line 2" required error={errors.line2}>
                <input className={input} value={location.line2} onChange={(e) => setLocation({ ...location, line2: e.target.value })} />
              </Field>
              <Field label="Landmark" required error={errors.landmark}>
                <input className={input} value={location.landmark} onChange={(e) => setLocation({ ...location, landmark: e.target.value })} />
              </Field>
              <Field label="City" required error={errors.city}>
                <input className={input} value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} />
              </Field>
              <Field label="State" required error={errors.state}>
                <input className={input} value={location.state} onChange={(e) => setLocation({ ...location, state: e.target.value })} />
              </Field>
              <Field label="Country" required error={errors.country}>
                <input className={input} value={location.country} onChange={(e) => setLocation({ ...location, country: e.target.value })} />
              </Field>
              <Field label="PIN code" required error={errors.pin}>
                <input className={input} value={location.pin} onChange={(e) => setLocation({ ...location, pin: e.target.value })} />
              </Field>
              <Field label="Google Maps link" required error={errors.mapsUrl} className="sm:col-span-2">
                <input className={input} value={location.mapsUrl} onChange={(e) => setLocation({ ...location, mapsUrl: e.target.value })} placeholder="https://maps.google.com/…" />
              </Field>
            </Group>
          </>
        )}

        {/* -- Step 2 --------------------------------------------------- */}
        {step === 2 && (
          <>
            {rooms.map((room, i) => (
              <Group key={`room-${i}`} title={`${kind.unit} ${i + 1}`} note={kind.nightly ? 'A room type and what it sleeps.' : `One ${kind.unit.toLowerCase()} you take bookings for.`}>
                <Field label={`${kind.unit} name`} required error={errors[`room-${i}-name`]}>
                  <input className={input} value={room.name} onChange={(e) => setRoom(i, 'name', e.target.value)} placeholder={kind.eg} />
                </Field>
                <Field label={`${kind.unit} type`} required error={errors[`room-${i}-type`]}>
                  <input className={input} value={room.type} onChange={(e) => setRoom(i, 'type', e.target.value)} placeholder={kind.egType} />
                </Field>
                <Field label={`How many ${kind.units.toLowerCase()}`} required error={errors[`room-${i}-count`]}>
                  <input className={input} inputMode="numeric" value={room.count} onChange={(e) => setRoom(i, 'count', e.target.value)} placeholder="10" />
                </Field>
                <Field label={kind.nightly ? `${kind.unit} size` : 'Size or duration'} required error={errors[`room-${i}-size`]}>
                  <input className={input} value={room.size} onChange={(e) => setRoom(i, 'size', e.target.value)} placeholder={kind.nightly ? '320 sq ft' : '60 minutes'} />
                </Field>
                {kind.bed && (
                  <Field label="Bed type" required error={errors[`room-${i}-bedType`]}>
                    <input className={input} value={room.bedType} onChange={(e) => setRoom(i, 'bedType', e.target.value)} placeholder="1 King Bed" />
                  </Field>
                )}
                <Field label={kind.occupancyLabel || 'Maximum occupancy'} required error={errors[`room-${i}-maxOccupancy`]}>
                  <input className={input} inputMode="numeric" value={room.maxOccupancy} onChange={(e) => setRoom(i, 'maxOccupancy', e.target.value)} placeholder="3" />
                </Field>
                <Field label="Adults" required error={errors[`room-${i}-adults`]}>
                  <input className={input} inputMode="numeric" value={room.adults} onChange={(e) => setRoom(i, 'adults', e.target.value)} placeholder="2" />
                </Field>
                <Field label="Children" required error={errors[`room-${i}-children`]}>
                  <input className={input} inputMode="numeric" value={room.children} onChange={(e) => setRoom(i, 'children', e.target.value)} placeholder="1" />
                </Field>
                <Field label={`${kind.unit} amenities`} required error={errors[`room-${i}-amenities`]} className="sm:col-span-2">
                  <input className={input} value={room.amenities} onChange={(e) => setRoom(i, 'amenities', e.target.value)} placeholder="AC, TV, balcony…" />
                </Field>
                <Field label={`${kind.unit} description`} required error={errors[`room-${i}-description`]} className="sm:col-span-2">
                  <textarea className={`${input} min-h-[80px] resize-y`} value={room.description} onChange={(e) => setRoom(i, 'description', e.target.value)} />
                </Field>

                {kind.extraBed && (
                  <label className="flex items-center gap-2 text-[13px] font-medium text-ink-700">
                    <input type="checkbox" checked={room.extraBed} onChange={(e) => setRoom(i, 'extraBed', e.target.checked)} className="h-4 w-4 rounded border-surface-line" />
                    Extra bed available
                  </label>
                )}

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
              <Plus size={16} /> Add another {kind.unit.toLowerCase()}
            </button>

            {/*
              Photographs, chosen from the phone or the laptop. Without
              them a listing reaches the website with nothing to look at,
              which is the one thing a member decides on.
            */}
            <Group title="Photographs" note="These are what a member sees first. The first one leads the listing.">
              <Field label="Property photos" required error={errors.propertyPhotos} className="sm:col-span-2">
                <ImagesField
                  label="Property photo"
                  value={propertyPhotos}
                  onChange={setPropertyPhotos}
                  upload={sendFile}
                  hint="Exterior, lobby, reception, restaurant, pool, other areas"
                />
              </Field>
              <Field label={`${kind.unit} photos`} required error={errors.roomPhotos} className="sm:col-span-2">
                <ImagesField
                  label={`${kind.unit} photo`}
                  value={roomPhotos}
                  onChange={setRoomPhotos}
                  upload={sendFile}
                  hint={kind.nightly ? 'Room, bathroom, view, amenities' : 'Whatever a member would want to see before booking'}
                />
              </Field>
            </Group>
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
              <Field label="Standard tariff (₹)" required error={errors.standardTariff}>
                <input className={input} inputMode="numeric" value={pricing.standardTariff} onChange={(e) => setPricing({ ...pricing, standardTariff: e.target.value })} />
              </Field>
              <Field label="Smira partner rate (₹)" required error={errors.partnerRate}>
                <input className={input} inputMode="numeric" value={pricing.partnerRate} onChange={(e) => setPricing({ ...pricing, partnerRate: e.target.value })} />
              </Field>
              <Field label="Weekday rate (₹)" required error={errors.weekdayRate}>
                <input className={input} inputMode="numeric" value={pricing.weekdayRate} onChange={(e) => setPricing({ ...pricing, weekdayRate: e.target.value })} />
              </Field>
              <Field label="Weekend rate (₹)" required error={errors.weekendRate}>
                <input className={input} inputMode="numeric" value={pricing.weekendRate} onChange={(e) => setPricing({ ...pricing, weekendRate: e.target.value })} />
              </Field>
              <Field label="Extra adult rate (₹)" required error={errors.extraAdultRate}>
                <input className={input} inputMode="numeric" value={pricing.extraAdultRate} onChange={(e) => setPricing({ ...pricing, extraAdultRate: e.target.value })} />
              </Field>
              <Field label="Child rate (₹)" required error={errors.childRate}>
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
              <Field label={`Total ${kind.units.toLowerCase()}`} required error={errors.totalRooms}>
                <input className={input} inputMode="numeric" value={inventory.totalRooms} onChange={(e) => setInventory({ ...inventory, totalRooms: e.target.value })} />
              </Field>
              <Field label="Available rooms" required error={errors.availableRooms}>
                <input className={input} inputMode="numeric" value={inventory.availableRooms} onChange={(e) => setInventory({ ...inventory, availableRooms: e.target.value })} />
              </Field>
              <Field label="Closed dates" required error={errors.closedDates}>
                <input className={input} value={inventory.closedDates} onChange={(e) => setInventory({ ...inventory, closedDates: e.target.value })} placeholder="15–20 Dec" />
              </Field>
              <Field label="Blackout dates" required error={errors.blackoutDates}>
                <input className={input} value={inventory.blackoutDates} onChange={(e) => setInventory({ ...inventory, blackoutDates: e.target.value })} placeholder="31 Dec" />
              </Field>
            </Group>

            <Group title="Policies" note="Check-in, check-out and cancellation.">
              <Field label={kind.times === 'stay' ? 'Check-in time' : 'Opens at'} required error={errors.checkIn}>
                <input className={input} value={policies.checkIn} onChange={(e) => setPolicies({ ...policies, checkIn: e.target.value })} placeholder="2 PM" />
              </Field>
              <Field label="Check-out time" required error={errors.checkOut}>
                <input className={input} value={policies.checkOut} onChange={(e) => setPolicies({ ...policies, checkOut: e.target.value })} placeholder="11 AM" />
              </Field>
              <Field label="Free cancellation until" required error={errors.freeCancellationUntil}>
                <input className={input} value={policies.freeCancellationUntil} onChange={(e) => setPolicies({ ...policies, freeCancellationUntil: e.target.value })} placeholder="48 hours before" />
              </Field>
              <Field label="Cancellation charge" required error={errors.cancellationCharge}>
                <input className={input} value={policies.cancellationCharge} onChange={(e) => setPolicies({ ...policies, cancellationCharge: e.target.value })} placeholder="One night" />
              </Field>
              <Field label="No-show policy" required error={errors.noShowPolicy} className="sm:col-span-2">
                <input className={input} value={policies.noShowPolicy} onChange={(e) => setPolicies({ ...policies, noShowPolicy: e.target.value })} />
              </Field>
            </Group>
          </>
        )}

        {/* -- Step 5 --------------------------------------------------- */}
        {step === 5 && (
          <>
            <Group title="Ownership" note="Who owns the property, and the papers that say so.">
              <Field label="Ownership type" required error={errors.ownershipType}>
                <select className={input} value={ownership.type} onChange={(e) => setOwnership({ ...ownership, type: e.target.value })}>
                  <option value="">Select</option>
                  {OWNERSHIP.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="PAN" required error={errors.pan}>
                <input className={input} value={ownership.pan} onChange={(e) => setOwnership({ ...ownership, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" />
              </Field>
              <Field label="GST number" required error={errors.gst}>
                <input className={input} value={ownership.gst} onChange={(e) => setOwnership({ ...ownership, gst: e.target.value.toUpperCase() })} placeholder="29ABCDE1234F1Z5" />
              </Field>
              <Field label="TAN" required error={errors.tan}>
                <input className={input} value={ownership.tan} onChange={(e) => setOwnership({ ...ownership, tan: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Ownership proof" required error={errors.ownershipProof}>
                <FileField
                  label="Ownership proof"
                  value={ownership.documentLinks.ownershipProof}
                  upload={sendFile}
                  onChange={(url) => setOwnership({ ...ownership, documentLinks: { ...ownership.documentLinks, ownershipProof: url } })}
                />
              </Field>
              <Field label="Lease agreement" required error={errors.leaseAgreement}>
                <FileField
                  label="Lease agreement"
                  value={ownership.documentLinks.leaseAgreement}
                  upload={sendFile}
                  onChange={(url) => setOwnership({ ...ownership, documentLinks: { ...ownership.documentLinks, leaseAgreement: url } })}
                />
              </Field>
            </Group>

            {/* Two ways to be paid, asked as two things — see the desk's
                own listing form for why they were split. */}
            <Group title="Account information" note="Where Smira settles your payouts by bank transfer.">
              <Field label="Account holder name" required error={errors.holder}>
                <input className={input} value={bank.holder} onChange={(e) => setBank({ ...bank, holder: e.target.value })} />
              </Field>
              <Field label="Bank name" required error={errors.bankName}>
                <input className={input} value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} />
              </Field>
              <Field label="Account number" required error={errors.accountNumber}>
                <input className={input} value={bank.accountNumber} onChange={(e) => setBank({ ...bank, accountNumber: e.target.value })} />
              </Field>
              <Field label="IFSC" required error={errors.ifsc}>
                <input className={input} value={bank.ifsc} onChange={(e) => setBank({ ...bank, ifsc: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Branch" required error={errors.branch}>
                <input className={input} value={bank.branch} onChange={(e) => setBank({ ...bank, branch: e.target.value })} />
              </Field>
              <Field label="Cancelled cheque or bank proof" required error={errors.proofLink}>
                <FileField
                  label="Bank proof"
                  value={bank.proofLink}
                  upload={sendFile}
                  onChange={(url) => setBank({ ...bank, proofLink: url })}
                />
              </Field>
            </Group>

            <Group title="UPI" note="Quicker for small settlements. Either this or the account above, or both.">
              <Field label="UPI ID" required error={errors.upiId}>
                <input
                  className={input}
                  value={bank.upiId}
                  onChange={(e) => setBank({ ...bank, upiId: e.target.value })}
                  placeholder="yourname@okhdfcbank"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </Field>
              <Field label="Name on the UPI account" required error={errors.upiName}>
                <input className={input} value={bank.upiName} onChange={(e) => setBank({ ...bank, upiName: e.target.value })} />
              </Field>
              <Field label="How you would rather be paid" required error={errors.preferred}>
                <select className={input} value={bank.preferred} onChange={(e) => setBank({ ...bank, preferred: e.target.value })}>
                  <option value="">No preference</option>
                  <option>Bank transfer</option>
                  <option>UPI</option>
                </select>
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
              onClick={() => {
                // Stop here rather than at the end: a form that collects
                // five steps of answers and then objects to the first one
                // is a form nobody finishes.
                if (!checkStep(step)) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  return;
                }
                setErrors({});
                setStep(step + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
