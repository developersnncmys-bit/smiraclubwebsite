import { notFound } from 'next/navigation';
import { ChevronRight, Crown, Sparkle } from 'lucide-react';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import OpenHours from '@/components/offers/OpenHours';
import SpaBooking from '@/components/offers/SpaBooking';
import { DetailCard, ReviewsCard } from '@/components/hotels/DetailSections';
import { spaDates, spas } from '@/lib/content';
import { image } from '@/lib/images';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = spas.find((x) => x.id === id);
  return { title: s ? s.name : 'Not found' };
}

const TABS = [
  { key: 'offers', label: 'Offers' },
  { key: 'overview', label: 'Overview' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'reviews', label: 'Reviews' },
];

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** A saloon or spa: choose a service, then book it. */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  // Read so the page renders per request: the booking days start today.
  await searchParams;
  const s = spas.find((x) => x.id === id);
  if (!s) notFound();

  const photos = s.photos.map((p) => image(p));

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={photos} name={s.name} rating={s.rating} reviews={s.reviews} />

      <div className="shell py-4 lg:py-8">
        <section className="lg:max-w-3xl">
          <p className="flex items-center gap-1.5 text-[14px] font-medium text-[#6d4bd8]">
            <Sparkle size={15} fill="currentColor" strokeWidth={0} />
            {s.tag}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-ink-900">{s.name}</h1>
          <p className="mt-1 inline-flex items-center gap-1 text-[14px] text-ink-900">
            {s.place}
            <ChevronRight size={15} />
          </p>
          <OpenHours hours={WEEK.map((day) => ({ day, hours: s.hours }))} />

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-600">
              <Crown size={17} className="text-gold" fill="currentColor" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-ink-900">Smira Club Member Benefits</p>
              <p className="text-[12px] text-ink-700">Enjoy special member pricing &amp; exciting offers.</p>
            </div>
          </div>
        </section>
      </div>

      <DetailTabs tabs={TABS} />

      <div className="shell space-y-4 py-4 lg:max-w-4xl lg:py-8 xl:mx-0">
        <SpaBooking spa={s} dates={spaDates()} />

        <DetailCard id="overview" title={`About ${s.name}`}>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{s.about}</p>
        </DetailCard>

        <DetailCard id="facilities" title="Facilities">
          <ul className="mt-3 space-y-1">
            {s.facilities.map((f) => (
              <li key={f} className="flex gap-2 text-[14px] text-ink-600">
                <span aria-hidden="true">&bull;</span>
                {f}
              </li>
            ))}
          </ul>
        </DetailCard>

        <ReviewsCard rating={s.rating} reviews={s.reviews} />
      </div>
    </div>
  );
}
