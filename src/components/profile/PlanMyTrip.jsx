import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/** The nudge to put a trip on the calendar before the reminders can help. */
export default function PlanMyTrip() {
  return (
    <section className="card flex h-full flex-col p-5 sm:p-6">
      <h2 className="text-xl font-bold text-brand-700">Plan My Trip</h2>

      <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
        Plan your trips in advance. We&rsquo;ll remind you about your special days, offers &amp;
        experience for every trip.
      </p>

      <Link
        href="/profile/trips/new"
        className="mt-auto inline-flex items-center gap-1 pt-4 text-[15px] font-bold text-action-500 transition hover:text-action-600"
      >
        Add a Trip
        <ChevronRight size={17} />
      </Link>
    </section>
  );
}
