import Link from 'next/link';
import Image from 'next/image';
import { CircleCheck, ChevronLeft, Flower2, Sparkles, Tent, Trees } from 'lucide-react';
import { image } from '@/lib/images';
import { inr } from '@/lib/format';

export const metadata = { title: 'Booking Confirmed' };

/** One line of the summary: label left, value right, value can wrap. */
function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3.5">
      <dt className="shrink-0 text-[14px] text-ink-600">{label}</dt>
      <dd className="min-w-0 text-right text-[14px] font-bold leading-snug text-ink-900">
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
  const location = params.location || '';

  /**
   * What each kind of booking is called on this screen. Anything not listed
   * reads as a hotel stay.
   */
  const KINDS = {
    villa: { noun: 'villa', label: 'Villa Name' },
    hourly: { noun: 'Hourly Stay', label: 'Hotel Name' },
    'free-stay': { noun: 'Free Stay', label: 'Hotel Name' },
    park: { noun: 'Ticket', label: 'Park Name', slot: 'Visit Date' },
    table: { noun: 'Table', label: 'Restaurant Name', slot: 'Date & Time' },
    camping: { noun: 'Camping', label: 'Camping Name', slot: 'Date & Time', extra: 'Get ready for an amazing Getaway.', art: 'tent' },
    spa: { noun: 'appointment', label: 'Saloon & Spa Name', slot: 'Date & Time', extra: 'Get ready for an amazing relaxation service.', art: 'spa' },
    luxury: { noun: 'Luxury Experience', label: 'Experience Name', slot: 'Date & Time', extra: 'Get ready for an unforgettable experience.', art: 'spa' },
    adventure: { noun: 'Adventure', label: 'Activity Name', slot: 'Date & Time', extra: 'Get ready for an amazing day out.', art: 'tent' },
    package: { noun: 'trip', label: 'Package', slot: 'Departure' },
    group: { noun: 'group trip', label: 'Trip', slot: 'Departure' },
    games: { noun: 'game pass', label: 'Game Zone', slot: 'Visit Date' },
  };
  const k = KINDS[params.kind] || { noun: 'stay', label: 'Hotel Name' };
  // Sent to the desk but not yet paid for: they call to confirm and take payment.
  const requested = params.status === 'requested';

  return (
    // White ground so the grey summary reads as a card, as drawn; on a desktop
    // the confirmation and the receipt sit side by side rather than one long
    // receipt stretched across the page.
    <div className="bg-white">
      <div className="shell py-4 lg:py-12">
        <Link
          href="/"
          aria-label="Back to home"
          className="grid h-10 w-10 place-items-center rounded-full text-ink-900 transition hover:bg-surface-soft"
        >
          <ChevronLeft size={24} />
        </Link>

        <div className="lg:mt-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mt-4 text-center lg:mt-0">
            {k.art === 'spa' ? (
              // Spa stones, a flower and a tick, in line icons as the frame has it.
              <span aria-hidden="true" className="relative mx-auto block h-[96px] w-[130px] text-brand-700 lg:h-[150px] lg:w-[200px]">
                <Sparkles className="absolute left-[6%] top-0 h-[40%] w-[28%]" strokeWidth={1.5} />
                <Flower2 className="absolute bottom-0 right-[4%] h-[48%] w-[34%]" strokeWidth={1.5} />
                <CircleCheck className="absolute left-[28%] top-[22%] h-[62%] w-[44%] bg-white" strokeWidth={1.6} />
              </span>
            ) : k.art === 'tent' ? (
              // Tent, trees and a tick, drawn in line icons as the frame has it.
              <span aria-hidden="true" className="relative mx-auto block h-[96px] w-[130px] text-brand-700 lg:h-[150px] lg:w-[200px]">
                <Trees className="absolute bottom-1 left-0 h-[45%] w-[30%]" strokeWidth={1.5} />
                <Tent className="absolute bottom-0 left-[22%] h-[70%] w-[55%]" strokeWidth={1.5} />
                <CircleCheck className="absolute right-[4%] top-[8%] h-[38%] w-[30%] bg-white" strokeWidth={1.8} />
              </span>
            ) : (
              <Image
                src={image('booking-confirmed')}
                alt=""
                width={200}
                height={162}
                className="mx-auto h-auto w-[130px] lg:w-[220px]"
              />
            )}

            <h1 className="mt-5 text-[21px] font-extrabold text-ink-900 lg:text-3xl">
              {requested ? 'Booking Requested!' : 'Booking Confirmed!'}
            </h1>
            {requested ? (
              <p className="mt-2 text-[14px] text-ink-500 lg:text-base">
                Your {k.noun} request has reached our travel desk.
                <span className="block">They will call you shortly to confirm it and take payment.</span>
              </p>
            ) : (
              <p className="mt-2 text-[14px] text-ink-500 lg:text-base">
                Your {k.noun} {k.art ? 'has been' : 'is'} booked successfully.
                {k.extra && <span className="block">{k.extra}</span>}
              </p>
            )}
          </div>

          <div>
            <dl className="mt-8 rounded-2xl bg-surface-soft px-4 py-2 lg:mt-0 lg:px-6 lg:py-3">
              <Row label="Booking ID">{ref}</Row>
              <Row label={k.label}>{name}</Row>

              {slot && (
                <Row label={k.slot || 'Preferred Slot'}>
                  {slot}
                  {nights && <span className="block font-bold">{nights}</span>}
                </Row>
              )}

              {location && <Row label="Location">{location}</Row>}

              {total > 0 && (
                <Row label={requested ? 'Total Amount' : 'Total Amount Paid'}>
                  {inr(total)}
                  <span className="block text-[13px] font-normal text-ink-500">(Incl. taxes &amp; fees)</span>
                </Row>
              )}
            </dl>

            <div className="mt-8 grid gap-3 lg:grid-cols-2">
              <Link
                href="/profile/bookings"
                className="btn-primary w-full rounded-xl py-3.5 text-[15px] normal-case tracking-normal"
              >
                View Booking Details
              </Link>

              <Link
                href="/"
                className="flex w-full items-center justify-center rounded-xl border border-brand-700 px-5 py-3.5 text-[15px] font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
