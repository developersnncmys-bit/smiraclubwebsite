import Link from 'next/link';
import { Headset, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import { membershipHelp, site } from '@/lib/content';

export const metadata = {
  title: 'Contact us',
  description: 'Reach the Smira Club desk by phone, WhatsApp or email.',
};

/**
 * Contact us.
 *
 * The footer has linked here from the start and the page did not exist, so
 * anybody who followed it got the 404. There is nothing invented on it:
 * the number and the WhatsApp thread are the desk's own, the same ones
 * every Need Help card on the site already dials.
 */
const WAYS = [
  {
    icon: Phone,
    label: 'Call the desk',
    value: '+91 98337 33477',
    href: `tel:${membershipHelp.phone}`,
    note: 'Quickest for anything about a booking in progress.',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91 98337 33477',
    href: membershipHelp.whatsapp,
    note: 'Send a message and the desk picks it up in order.',
  },
];

export default function Page() {
  return (
    <>
      <ScreenBar title="Contact us" backHref="/more" />

      <div className="shell py-6 lg:py-10">
        <h1 className="text-2xl font-bold text-ink-900 lg:text-3xl">Talk to {site.name}</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-600">
          A real desk, not a queue. Call or message and somebody who can
          actually change your booking will answer.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {WAYS.map(({ icon: Glyph, label, value, href, note }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              className="card flex items-start gap-3.5 p-5 transition hover:border-action-500/40"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Glyph size={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-ink-900">{label}</span>
                <span className="num mt-0.5 block text-[15px] text-action-500">{value}</span>
                <span className="mt-1 block text-[13px] leading-snug text-ink-500">{note}</span>
              </span>
            </a>
          ))}
        </div>

        {/*
          A complaint is not a phone call — it needs a record, an owner and
          a clock. Get Help opens one, so it is pointed at rather than
          repeated here.
        */}
        <section className="card mt-4 flex items-start gap-3.5 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Headset size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-ink-900">Something gone wrong?</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
              Raise it in Get Help and it opens a ticket with our support desk,
              with a reference you can quote. That is faster than ringing, and
              it does not get lost.
            </p>
            <Link href="/more/support" className="mt-3 inline-block text-[14px] font-bold text-action-500">
              Go to Get Help
            </Link>
          </div>
        </section>

        <section className="card mt-4 flex items-start gap-3.5 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <MapPin size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-ink-900">Where we are</p>
            <p className="mt-1 text-[14px] text-ink-600">{site.city}, India</p>
          </div>
        </section>

        <section className="card mt-4 flex items-start gap-3.5 p-5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Mail size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-ink-900">Partnerships</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
              A hotel, villa, restaurant or experience you would like on Smira?
              Apply and the partnerships desk calls you back.
            </p>
            <Link href="/more/partners" className="mt-3 inline-block text-[14px] font-bold text-action-500">
              Partner with us
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
