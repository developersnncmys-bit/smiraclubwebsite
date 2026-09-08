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
 * The onboarding stages, in the desk's own words. These are the same six the
 * admin panel moves an application through, so what an owner is told here and
 * what our team sees on their screen are one thing, not two.
 */
const STAGES = [
  { title: 'Registration', body: 'You send this form. We give you a reference straight away.' },
  { title: 'Documents', body: 'Our desk calls to collect your GST, PAN and registration papers.' },
  { title: 'Review', body: 'We read the property, the rate plan and the photographs.' },
  { title: 'Verification', body: 'Papers and bank details are checked against the register.' },
  { title: 'Approved', body: 'The rate plan is signed by both sides.' },
  { title: 'Live', body: 'You appear to members and your first bookings start arriving.' },
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

              <h1 className="mt-4 text-[28px] font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl lg:text-[44px]">
                List your property and earn from members who travel all year.
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-500 lg:text-lg">
                Hotels, villas, homestays, transport and experiences. Tell us about yours and our
                partnerships desk will call you within two working days.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#apply" className="btn-action px-7 py-3.5">
                  Apply to partner
                  <ArrowRight size={18} />
                </a>
                <a href="tel:+919820011223" className="btn-quiet px-6 py-3.5">
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
                <h3 className="mt-4 text-[16px] font-bold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* -- How it works -------------------------------------------------- */}
        <section className="py-8 lg:py-12">
          <h2 className="section-title">From this form to your first booking</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink-500">
            Six steps, and you can ask our desk where you are at any point using the reference we
            give you.
          </p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {STAGES.map((s, i) => (
              <li key={s.title} className="card relative p-5">
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-[16px] font-bold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -- The form ------------------------------------------------------ */}
        <section id="apply" className="scroll-mt-24 py-8 lg:py-12">
          <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <h2 className="section-title">Apply to partner</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                It takes about three minutes. Only the property name, city and a phone number are
                required — our desk collects the rest when they call.
              </p>

              <div className="card mt-5 p-5">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-400">
                  Handy to have ready
                </h3>
                <ul className="mt-3 space-y-3">
                  {PAPERS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-start gap-3 text-[14px] text-ink-700">
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
                <h3 className="text-[16px] font-bold text-ink-900">{q}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">{a}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 text-[15px] text-ink-500">
            Still unsure?{' '}
            <a href="tel:+919820011223" className="font-semibold text-brand-700 hover:text-brand-800">
              Call our partnerships desk on +91 98200 11223
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
