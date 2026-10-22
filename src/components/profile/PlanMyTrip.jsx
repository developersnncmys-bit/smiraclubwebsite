import Link from 'next/link';
import { CalendarDays, ChevronRight } from 'lucide-react';

/** The nudge to put a trip on the calendar before the reminders can help. */
export default function PlanMyTrip() {
  return (
    <section className="card flex h-full flex-col p-3 lg:p-4">
      <span className="flex items-center gap-2">
        <CalendarDays size={16} className="shrink-0 text-brand-700" />
        <h2 className="text-[13px] font-bold leading-tight text-brand-700 lg:text-[14px]">
          Plan my trip
        </h2>
      </span>

      <p className="mt-1.5 text-[11.5px] leading-snug text-ink-600 lg:text-[12.5px]">
        Get reminders for special days and offers.
      </p>

      <Link
        href="/profile/trips/new"
        className="mt-auto inline-flex items-center gap-0.5 pt-2.5 text-[12px] font-bold text-action-500 transition hover:text-action-600 lg:text-[12.5px]"
      >
        Add a trip
        <ChevronRight size={16} />
      </Link>
    </section>
  );
}
