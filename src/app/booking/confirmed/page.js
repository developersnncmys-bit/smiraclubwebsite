import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { image } from '@/lib/images';
import { inr } from '@/lib/format';

export const metadata = { title: 'Booking Confirmed' };

/** One line of the summary: label left, value right, value can wrap. */
function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3.5">
      <dt className="shrink-0 text-[15px] text-ink-600">{label}</dt>
      <dd className="min-w-0 text-right text-[15px] font-bold leading-snug text-ink-900">
        {children}
      </dd>
    </div>
  );
}

/**
 * Booking Confirmed.
 *
 * One screen for every kind of booking — a hotel and a villa confirm exactly
 * the same way — so the details arrive in the query rather than the screen
 * knowing anything about what was booked.
 *
 * Nothing is persisted yet: there is no payment and no bookings API, so this
 * reads back what the form sent it. When bookings are real, look the
 * reference up here instead and the screen does not otherwise change.
 */
export default async function Page({ searchParams }) {
  const params = (await searchParams) || {};

  const ref = params.ref || 'SM-00000000';
  const name = params.name || 'Your stay';
  const slot = params.slot || '';
  const nights = params.nights || '';
  const total = Number(params.total) || 0;
  const kind = params.kind === 'villa' ? 'villa' : 'stay';

  return (
    <div className="shell py-4 lg:mx-auto lg:max-w-xl lg:py-10">
      <Link
        href="/"
        aria-label="Back to home"
        className="grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
      >
        <ChevronLeft size={24} />
      </Link>

      <div className="mt-4 text-center">
        <Image
          src={image('booking-confirmed')}
          alt=""
          width={200}
          height={162}
          className="mx-auto h-auto w-[160px] lg:w-[200px]"
        />

        <h1 className="mt-6 text-[26px] font-extrabold text-ink-900 lg:text-3xl">
          Booking Confirmed!
        </h1>
        <p className="mt-2 text-[15px] text-ink-500 lg:text-base">
          Your {kind} is booked successfully.
        </p>
      </div>

      <dl className="mt-8 divide-y divide-white rounded-2xl bg-surface-soft px-5 py-2">
        <Row label="Booking ID">{ref}</Row>
        <Row label={kind === 'villa' ? 'Villa Name' : 'Hotel Name'}>{name}</Row>

        {slot && (
          <Row label="Preferred Slot">
            {slot}
            {nights && <span className="block font-bold">{nights}</span>}
          </Row>
        )}

        <Row label="Total Amount Paid">
          {inr(total)}
          <span className="block text-[14px] font-normal text-ink-500">(Incl. taxes &amp; fees)</span>
        </Row>
      </dl>

      <div className="mt-8 space-y-3">
        <Link
          href="/profile/bookings"
          className="btn-primary w-full rounded-xl py-4 text-[16px] normal-case tracking-normal"
        >
          View Booking Details
        </Link>

        <Link
          href="/"
          className="flex w-full items-center justify-center rounded-xl border-2 border-action-500 px-5 py-4 text-[16px] font-bold text-action-500 transition hover:bg-brand-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
