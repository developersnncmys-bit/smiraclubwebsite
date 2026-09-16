import Image from 'next/image';
import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarCheck,
  FileText,
  Headphones,
  IdCard,
  Landmark,
  Users,
} from 'lucide-react';
import ApplyForm from '@/components/partners/ApplyForm';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Become a Partner',
  description:
    'List your hotel, villa or experience with Smira Club and earn from a membership base that books ahead.',
};

/** Why an owner would bother. Four, because five is a wall of text. */
const REASONS = [
  {
    icon: Users,
    title: 'Members who book ahead',
    body: 'Smira members plan their year in advance, so your rooms fill on the dates that are usually hardest to sell.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Nothing to list',
    body: 'No joining fee and no monthly charge. We earn only when a booking is confirmed and you have been paid.',
  },
  {
    icon: CalendarCheck,
    title: 'One rate plan, agreed once',
    body: 'You set the rate and the release period with our desk. Nothing is sold below what you signed.',
  },
  {
    icon: Headphones,
    title: 'A desk, not a dashboard',
    body: 'A named partnerships manager handles your bookings, your questions and your settlement.',
  },
];

/**
 * The five steps of the listing form, then what happens to it.
 *
 * These are the client's own five — the same five the admin panel reviews and
 * the same order the form asks in — so an owner reading this page and a desk
 * reading the application are looking at one process, not two descriptions of
 * it. What each step actually asks for is summarised rather than listed: the
 * full field list belongs in the form, not in the pitch for it.
 */
const STEPS = [
  {
    title: 'Account and property',
    body: 'Your name, mobile and a password, then the property itself — type, star rating, description and the full address. We verify the address, so put it in carefully.',
  },
  {
    title: 'Rooms',
    body: 'A category per room type: name, size, bed, how many adults and children it sleeps, and the photographs — exterior, lobby, restaurant, pool, and each room with its bathroom and view.',
  },
  {
    title: 'Amenities and rules',
    body: 'What you offer — Wi-Fi, pool, parking, restaurant, spa, kids play area — and the house rules: ID, couples, pets, smoking, visitors, children and extra beds.',
  },
  {
    title: 'Pricing and inventory',
    body: 'Your standard tariff and the Smira partner rate, weekday and weekend, extra adult and child, meal plan, and how many rooms you are releasing. Closed and blackout dates go here too.',
  },
  {
    title: 'Ownership and legal',
    body: 'Who owns it and the proof — registration or lease, PAN, GST — plus the bank account we settle into and the partner agreement to sign.',
  },
];

/** What happens after you press submit. */
const AFTER = [
  { title: 'Submitted', body: 'You get a reference number straight away.' },
  { title: 'Admin review', body: 'Our team reads the property, the rates and the papers. If something needs changing we tell you what, and you edit rather than start again.' },
  { title: 'Contract', body: 'The agreement is signed by both sides.' },
  { title: 'Live', body: 'You appear to members, and your dashboard opens.' },
];

/** The dashboard an approved partner signs into. */
const DASHBOARD = {
  today: [
    'Total bookings',
    'Upcoming check-ins',
    "Today's check-ins",
    'Available rooms',
    'Revenue',
    'Pending payments',
    'Cancellations',
  ],
  sections: [
    'My property',
    'Rooms and inventory',
    'Rates and offers',
    'Availability calendar',
    'Bookings',
    'Customers',
    'Payments',
    'Reports',
    'Reviews',
    'Documents',
    'Support',
    'Profile',
  ],
};

/** One request, as the partner sees it. */
const BOOKING_CARD = [
  ['Property', 'Forest Resort'],
  ['Guest', 'Rahul Sharma'],
  ['Check-in', '20 Sept 2026'],
  ['Check-out', '22 Sept 2026'],
  ['Room', 'Deluxe'],
  ['Guests', '2 adults'],
  ['Meal plan', 'Breakfast + dinner'],
  ['Amount', '₹7,000'],
];

const BOOKING_ACTIONS = ['Accept', 'Reject', 'Edit', 'Contact support'];

/** The three ways a booking reaches a partner. */
const BOOKING_WAYS = [
  {
    title: 'A member asks if you are free',
    body: 'They pick your property and their dates, and our desk sends you an availability request. You answer available or not; we confirm back to the member, they pay, and the booking is made.',
  },
  {
    title: 'A member books you directly',
    body: 'They choose the room and dates and press book. The request lands with you to confirm, payment follows, and the voucher goes out.',
  },
  {
    title: 'Live availability',
    body: 'If your channel manager is connected, members see your live rates and rooms and book without waiting on anyone. Confirmation, voucher and settlement all follow automatically.',
  },
];

/** What to have to hand. Kept honest — none of it blocks the form. */
const PAPERS = [
  { icon: IdCard, label: 'GST number and PAN' },
  { icon: FileText, label: 'Trade licence or registration' },
  { icon: Landmark, label: 'Bank account or UPI for settlement' },
];

const FAQ = [
  {
    q: 'What does it cost to list?',
    a: 'Nothing. There is no joining fee and no monthly charge. We take an agreed commission on confirmed bookings only, and it is written into the rate plan before anything goes live.',
  },
  {
    q: 'How long does it take to go live?',
    a: 'Most properties are live within seven to ten working days. The part that takes longest is the paperwork, so having your GST and registration ready shortens it considerably.',
  },
  {
    q: 'When do I get paid?',
    a: 'Settlement runs on the cycle written into your rate plan, against the bank account or UPI you give us. Every booking, its commission and its payout is on your statement.',
  },
  {
    q: 'Can I block dates I want to keep?',
    a: 'Yes. You set the release period and can hold back dates. Nothing is sold on a date you have closed.',
  },
];

export default function Page() {
  return (
    <>
      {/* -- The pitch ------------------------------------------------------ */}
      <section className="border-b border-surface-line bg-white">
        <div className="shell py-8 lg:py-14">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-brand-700">
                Partner with us
              </span>

              <h1 className="mt-5 max-w-2xl text-[25px] font-extrabold leading-[1.28] tracking-tight text-ink-900 sm:text-4xl lg:text-[39px] lg:leading-[1.22]">
                List your property and earn from members who travel all year.
              </h1>

              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-ink-500 lg:text-lg">
                Hotels, villas, homestays, transport and experiences. Tell us about yours and our
                partnerships desk will call you within two working days.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#apply" className="btn-action px-7 py-3.5">
                  Apply to partner
                  <ArrowRight size={18} />
                </a>
                <a href="tel:+919833733477" className="btn-quiet px-6 py-3.5">
                  Talk to us first
                </a>
              </div>

              <p className="mt-4 text-[13px] text-ink-400">
                No joining fee · No monthly charge · Commission on confirmed bookings only
              </p>
            </div>

            <div className="mt-8 lg:col-span-5 lg:mt-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card">
                <Image
                  src={image('partner-property')}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shell pb-12 pt-2 lg:pb-20">
        {/* -- Why ---------------------------------------------------------- */}
        <section className="py-8 lg:py-12">
          <h2 className="section-title">Why owners list with Smira Club</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <article key={title} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* -- How it works -------------------------------------------------- */}
        <section className="py-8 lg:py-12">
          <h2 className="section-title">What listing actually involves</h2>
          <p className="mt-2 max-w-2xl text-[14px] text-ink-500">
            Five steps to describe the property, then it comes to us. You can stop and come back —
            nothing is lost between steps.
          </p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card relative p-5">
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-[15px] font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{s.body}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-9 text-[16px] font-bold text-ink-900 lg:text-[18px]">
            Then it comes to us
          </h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {AFTER.map((a, i) => (
              <li key={a.title} className="rounded-2xl border border-surface-line bg-white p-4">
                <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink-900">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[12px] text-brand-700">
                    {i + 1}
                  </span>
                  {a.title}
                </span>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-500">{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -- The dashboard they get ---------------------------------------- */}
        <section className="py-8 lg:py-12">
          <h2 className="section-title">Your dashboard, once you are live</h2>
          <p className="mt-2 max-w-2xl text-[14px] text-ink-500">
            You run the property yourself. Our desk is there when you want a person, not because you
            need one to change a rate.
          </p>

          <div className="mt-5 lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="card p-5 sm:p-6 lg:col-span-5">
              <h3 className="text-[15px] font-bold text-ink-900">Today&rsquo;s overview</h3>
              <p className="mt-1 text-[13px] text-ink-500">The first thing you see each morning.</p>
              <ul className="mt-4 grid grid-cols-2 gap-2.5">
                {DASHBOARD.today.map((t) => (
                  <li
                    key={t}
                    className="rounded-xl bg-surface-soft px-3 py-2.5 text-[13px] font-semibold text-ink-700"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card mt-4 p-5 sm:p-6 lg:col-span-7 lg:mt-0">
              <h3 className="text-[15px] font-bold text-ink-900">Everything you can manage</h3>
              <p className="mt-1 text-[13px] text-ink-500">
                Rates, rooms and closed dates are yours to change whenever you like.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {DASHBOARD.sections.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-surface-line px-3.5 py-2 text-[13px] font-semibold text-ink-700"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* -- How a booking reaches them ------------------------------------ */}
        <section className="py-8 lg:py-12">
          <h2 className="section-title">How a booking reaches you</h2>
          <p className="mt-2 max-w-2xl text-[14px] text-ink-500">
            Three ways, depending on how you would rather work. Every one of them ends the same way:
            a confirmed booking, a voucher to the guest, and a settlement to you.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-3 lg:gap-5">
            {BOOKING_WAYS.map((w, i) => (
              <article key={w.title} className="card p-5">
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
                  Way {i + 1}
                </span>
                <h3 className="mt-1 text-[15px] font-bold text-ink-900">{w.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{w.body}</p>
              </article>
            ))}
          </div>

          <div className="card mt-5 p-5 sm:p-6">
            <h3 className="text-[15px] font-bold text-ink-900">What a request looks like</h3>
            <div className="mt-4 rounded-2xl border border-surface-line p-4 sm:p-5">
              <p className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[15px] font-extrabold text-ink-900">Booking #SC12345</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-bold text-emerald-700">
                  Confirmed
                </span>
              </p>

              <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {BOOKING_CARD.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 text-[13px]">
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="font-semibold text-ink-900">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-surface-line pt-4">
                {BOOKING_ACTIONS.map((b, i) => (
                  <span
                    key={b}
                    className={
                      i === 0
                        ? 'rounded-xl bg-action-500 px-4 py-2 text-[13px] font-bold text-white'
                        : 'rounded-xl border border-surface-line px-4 py-2 text-[13px] font-bold text-ink-700'
                    }
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -- The form ------------------------------------------------------ */}
        <section id="apply" className="scroll-mt-24 py-8 lg:py-12">
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="section-title">Apply to partner</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
                It takes about three minutes. Only the property name, city and a phone number are
                required — our desk collects the rest when they call.
              </p>

              <div className="card mt-5 p-5">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-400">
                  Handy to have ready
                </h3>
                <ul className="mt-3 space-y-3">
                  {PAPERS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-start gap-3 text-[13px] text-ink-700">
                      <Icon size={18} className="mt-0.5 shrink-0 text-brand-600" />
                      {label}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] leading-snug text-ink-400">
                  None of it is needed to send the form.
                </p>
              </div>
            </div>

            <div className="mt-6 lg:col-span-8 lg:mt-0">
              <ApplyForm />
            </div>
          </div>
        </section>

        {/* -- Questions ------------------------------------------------------ */}
        <section className="py-8 lg:py-12">
          <h2 className="section-title">Questions owners usually ask</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:gap-5">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="card p-5">
                <h3 className="text-[15px] font-bold text-ink-900">{q}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{a}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-[14px] text-ink-500">
            Still unsure?{' '}
            <a href="tel:+919833733477" className="font-semibold text-brand-700 hover:text-brand-800">
              Call our partnerships desk on +91 98337 33477
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
