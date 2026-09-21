import { notFound } from 'next/navigation';
import { CircleCheck, CircleX, Clock, Crown, MapPin, PlaneTakeoff, Star, UserRound, Users } from 'lucide-react';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import DepartureChooser from '@/components/packages/DepartureChooser';
import {
  groupAlwaysIncluded, groupDepartureDates, groupDepartures, packagePolicies,
} from '@/lib/content';
import { image } from '@/lib/images';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const trip = groupDepartures.find((t) => t.id === id);
  return trip ? { title: `${trip.name} — Group Departure`, description: trip.about } : { title: 'Trip not found' };
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'inclusions', label: 'Inclusions' },
  { key: 'policies', label: 'Policies' },
];

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function Card({ id, title, children }) {
  return (
    <section id={id} className="card scroll-mt-32 p-4 sm:p-5">
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

/**
 * One group trip: what it is, the departures and seats, then the itinerary,
 * what is and is not included, and the policies. `searchParams` is read so
 * the dates — counted from today — are worked out per request.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  await searchParams;
  const trip = groupDepartures.find((t) => t.id === id);
  if (!trip) notFound();

  const dates = groupDepartureDates(trip);
  const international = trip.region === 'international';
  // The passport line only applies abroad.
  const policies = international ? packagePolicies : packagePolicies.filter((p) => p.title !== 'Travel Policy');

  const facts = [
    { icon: Clock, label: 'Duration', value: `${trip.nights + 1} Days / ${plural(trip.nights, 'Night', 'Nights')}` },
    { icon: Users, label: 'Group size', value: trip.groupSize },
    { icon: PlaneTakeoff, label: 'Starts from', value: trip.from },
    { icon: UserRound, label: 'Minimum age', value: trip.minAge },
  ];

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={trip.photos.map((p) => image(p))} name={trip.name} rating={trip.rating} reviews={trip.reviews} />

      <div className="shell space-y-4 py-4 lg:max-w-5xl lg:py-8 xl:mx-0">
        <section>
          <span className="inline-block rounded-full border border-action-500 bg-brand-50 px-3 py-1 text-[12px] font-bold text-brand-700">
            Group Departure · {international ? 'International' : 'India'}
          </span>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-ink-900 lg:text-3xl">{trip.name}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-ink-600">
            <MapPin size={16} className="shrink-0" />
            {trip.place}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px]">
            <Star size={15} className="text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-bold text-ink-900">{trip.rating}</span>
            <span className="text-ink-600">({trip.reviews} reviews)</span>
          </p>
        </section>

        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {facts.map(({ icon: Glyph, label, value }) => (
            <li key={label} className="card flex items-center gap-3 p-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-action-500">
                <Glyph size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-ink-500">{label}</span>
                <span className="block truncate text-[13px] font-bold text-ink-900">{value}</span>
              </span>
            </li>
          ))}
        </ul>

        <section className="flex items-center gap-3 rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-600">
            <Crown size={17} className="text-gold" fill="currentColor" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink-900">Smira Club Member Price</p>
            <p className="text-[12px] text-ink-700">
              Save {Math.round(((trip.was - trip.price) / trip.was) * 100)}% on this departure as a member.
            </p>
          </div>
        </section>

        <DepartureChooser trip={{ id: trip.id, price: trip.price }} dates={dates} />
      </div>

      <DetailTabs tabs={TABS} />

      <div className="shell space-y-4 py-4 lg:max-w-5xl lg:py-8 xl:mx-0">
        <Card id="overview" title="About the Trip">
          <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{trip.about}</p>
          <h3 className="mt-4 text-[15px] font-bold text-ink-900">Highlights</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {trip.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-[14px] text-ink-700">
                <CircleCheck size={17} className="shrink-0 text-green-600" />
                {h}
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-[15px] font-bold text-ink-900">On every group trip</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {groupAlwaysIncluded.map((h) => (
              <li key={h} className="rounded-full border border-action-500 px-3 py-1 text-[12px] font-medium text-action-500">{h}</li>
            ))}
          </ul>
        </Card>

        <Card id="itinerary" title="Itinerary">
          <ol className="mt-4">
            {trip.itinerary.map((d, i) => (
              <li key={d.day} className="relative flex gap-4 pb-5 last:pb-0">
                {i < trip.itinerary.length - 1 && <span aria-hidden="true" className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-brand-100" />}
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-action-500 text-[12px] font-bold text-white">
                  D{d.day}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-[15px] font-bold text-ink-900">{d.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{d.body}</p>
                  <p className="mt-1.5 text-[12px] font-semibold text-action-500">{d.meals}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card id="inclusions" title="Inclusions & Exclusions">
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-[14px] font-bold text-green-700">Included</h3>
              <ul className="mt-2 space-y-2">
                {trip.inclusions.map((x) => (
                  <li key={x} className="flex gap-2 text-[14px] text-ink-700">
                    <CircleCheck size={17} className="mt-0.5 shrink-0 text-green-600" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-red-700">Not included</h3>
              <ul className="mt-2 space-y-2">
                {trip.exclusions.map((x) => (
                  <li key={x} className="flex gap-2 text-[14px] text-ink-700">
                    <CircleX size={17} className="mt-0.5 shrink-0 text-red-500" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card id="policies" title="Policies">
          <div className="mt-3 space-y-4">
            {policies.map((p) => (
              <div key={p.title}>
                <h3 className="text-[15px] font-bold text-ink-900 underline">{p.title}</h3>
                {p.lines.map((line) => (
                  <p key={line} className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
