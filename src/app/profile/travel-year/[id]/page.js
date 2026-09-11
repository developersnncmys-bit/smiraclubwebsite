import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { travelYears } from '@/lib/content';
import { image } from '@/lib/images';
import { inr, nightsBetween } from '@/lib/format';

/** Every trip across every year, since the id alone identifies one. */
const ALL = Object.values(travelYears).flat();

export function generateStaticParams() {
  return ALL.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const trip = ALL.find((t) => t.id === id);
  return { title: trip ? trip.title : 'Trip' };
}

const day = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

/**
 * One planned trip.
 *
 * The design draws this over the year as a sheet with a close button. It is a
 * route rather than a modal so it can be linked to — the trip reminder in
 * Notifications points straight at it — and the close button simply goes back
 * to the year, which is what the ✕ does anyway.
 */
export default async function Page({ params }) {
  const { id } = await params;

  const trip = ALL.find((t) => t.id === id);
  if (!trip) notFound();

  const nights = nightsBetween(trip.start, trip.end);
  const upcoming = new Date(trip.start) > new Date();

  return (
    <div className="pb-10">
      {/* -- The way out, as the design floats it ------------------- */}
      <div className="flex justify-center bg-ink-900/5 py-5">
        <Link
          href="/profile/travel-year"
          aria-label="Close"
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink-900 shadow-lift transition hover:bg-surface-soft"
        >
          <X size={22} />
        </Link>
      </div>

      <div className="shell lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
        {/* -- What the trip is --------------------------------- */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
            <Image
              src={image(trip.image)}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
            <h1 className="text-2xl font-bold text-ink-900">{trip.title}</h1>
            <span
              className={`shrink-0 rounded-full px-4 py-1.5 text-[14px] font-semibold ${
                upcoming ? 'bg-[#e8f6ec] text-green-700' : 'bg-surface-soft text-ink-600'
              }`}
            >
              {upcoming ? 'Upcoming' : 'Completed'}
            </span>
          </div>

          <p className="mt-2 flex items-center gap-2 text-[15px] text-ink-600">
            {trip.origin}
            <ArrowRight size={16} className="shrink-0 text-ink-500" />
            {trip.destination}
          </p>

          <p className="mt-2 text-[15px] text-ink-700">
            {day(trip.start)} - {day(trip.end)} {new Date(trip.end).getFullYear()}
            <span className="px-2 text-ink-400">&bull;</span>
            {nights + 1} Days/{nights} Night{nights === 1 ? '' : 's'}
          </p>

          <p className="mt-2 text-[15px] text-ink-700">No of Guests: {trip.guests ?? 2}</p>
        </div>

        {/* -- What is worth knowing about it ------------------- */}
        <div className="lg:col-span-7">
          {trip.specialDays?.length > 0 && (
            <section className="pt-8 lg:pt-0">
              <h2 className="text-xl font-bold text-ink-900">Special Days During Your Trip</h2>

              <div className="mt-4 space-y-4">
                {trip.specialDays.map((d) => (
                  <article
                    key={d.id}
                    className="flex gap-4 rounded-2xl bg-[#f4f7fe] p-3.5 ring-1 ring-brand-100"
                  >
                    <span className="relative h-[92px] w-[104px] shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={image(d.image)}
                        alt=""
                        fill
                        sizes="104px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-ink-900">{d.label}</h3>
                      <p className="text-[14px] text-ink-600">{d.date}</p>
                      <p className="mt-1.5 text-[14px] leading-snug text-ink-700">{d.note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {trip.activities?.length > 0 && (
            <section className="pt-8">
              <h2 className="text-xl font-bold text-ink-900">
                Things You Can Do In {trip.destination}
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-4 lg:gap-6">
                {trip.activities.map((a) => (
                  <article key={a.id} className="card overflow-hidden">
                    <span className="relative block aspect-[4/3] w-full">
                      <Image
                        src={image(a.image)}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </span>

                    <div className="p-3.5">
                      <h3 className="text-[15px] font-bold leading-snug text-ink-900">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-snug text-ink-500">{a.note}</p>

                      <p className="mt-3 flex flex-wrap items-baseline gap-2">
                        <span className="text-[13px] text-ink-700">From</span>
                        <span className="text-[15px] font-extrabold text-ink-900">
                          {inr(a.price)}
                        </span>
                        <span className="text-[13px] font-semibold text-red-500 line-through">
                          {inr(a.was)}
                        </span>
                      </p>
                      <p className="text-[13px] text-ink-500">{a.unit}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
