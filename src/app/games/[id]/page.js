import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Crown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import ParkBooking from '@/components/offers/ParkBooking';
import { DetailCard, LocationCard, ReviewsCard } from '@/components/hotels/DetailSections';
import {
  gameAbout, gameFacilities, gameHighlights, gameIdealFor, gameSafety, gameTickets, gameZones, parkNearby,
} from '@/lib/content';
import { image } from '@/lib/images';

export function generateStaticParams() {
  return gameZones.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const zone = gameZones.find((g) => g.id === id);
  return { title: zone ? `${zone.name} — Games Zone` : 'Game zone not found' };
}

const TABS = [
  { key: 'tickets', label: 'Passes' },
  { key: 'overview', label: 'Overview' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'location', label: 'Location' },
];

/**
 * One game zone's page, laid out as a park's is: who and when, the member
 * offer, the passes, what the place is like, and the booking at the foot.
 * Booking a pass goes to the Smira desk like every other booking.
 */
export default async function Page({ params }) {
  const { id } = await params;
  const zone = gameZones.find((g) => g.id === id);
  if (!zone) notFound();

  const photos = zone.images.map((slot) => image(slot));
  const tickets = gameTickets(zone);

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={photos} name={zone.name} rating={zone.rating} reviews={zone.reviews} />

      <div className="shell space-y-4 py-4 lg:py-8">
        <section>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-action-500">{zone.label}</p>
          <h1 className="mt-1 text-2xl font-extrabold uppercase leading-tight text-ink-900">{zone.name.replace(' | ', ' ')}</h1>
          <a href="#location" className="mt-1.5 inline-flex items-center gap-1 text-[14px] text-ink-700 hover:underline">
            {zone.place}
            <ChevronRight size={15} />
          </a>
          <p className="mt-1 text-[14px]">
            <span className="font-semibold text-green-600">Open daily</span>
            <span className="text-ink-700"> &middot; {zone.hours}</span>
          </p>
          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-700">{zone.blurb}</p>
        </section>

        <section className="flex items-center gap-3 rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-4 lg:max-w-3xl">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-600">
            <Crown size={18} className="text-gold" fill="currentColor" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-green-700">Get UP TO {zone.offer}% OFF</p>
            <p className="text-[15px] font-bold leading-tight text-ink-900">Smira Club Member Benefits</p>
            <p className="text-[12px] text-ink-700">Member prices on every pass.</p>
          </div>
        </section>
      </div>

      <DetailTabs tabs={TABS} />

      <ParkBooking kind="games" park={{ id: zone.id, name: zone.name, hours: zone.hours }} tickets={tickets}>
        {/* -- About ------------------------------------------------------ */}
        <section id="overview" className="card scroll-mt-32 p-4 sm:p-5">
          <h2 className="text-[16px] font-bold text-ink-900">About This Place</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-700">{gameAbout}</p>

          <h3 className="mt-5 text-[15px] font-bold text-ink-900">Ideal For</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {gameIdealFor.map((t) => (
              <li key={t} className="rounded-full border border-action-500 px-3.5 py-1.5 text-[13px] font-medium text-action-500">{t}</li>
            ))}
          </ul>
        </section>

        {/* -- What there is to play ------------------------------------- */}
        <section>
          <h2 className="text-center text-[16px] font-extrabold uppercase text-ink-900 lg:text-left">What You Can Play</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {gameHighlights.map((r) => (
              <li key={r.key} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={image(r.image)} alt={r.label} fill sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-2 text-center text-[13px] font-extrabold uppercase text-white">{r.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* -- Facilities ------------------------------------------------- */}
        <DetailCard id="facilities" title="Facilities at the venue">
          <ul className="mt-5 grid grid-cols-3 gap-y-6 sm:grid-cols-6">
            {gameFacilities.map((f) => (
              <li key={f.label} className="flex flex-col items-center gap-2 px-1 text-center">
                <Icon name={f.icon} size={24} className="text-action-500" strokeWidth={1.7} />
                <span className="text-[12px] font-medium leading-tight text-action-500">{f.label}</span>
              </li>
            ))}
          </ul>
        </DetailCard>

        <ReviewsCard rating={zone.rating} reviews={zone.reviews} />

        <LocationCard address={zone.address} nearby={parkNearby} />

        {/* -- Before you play ------------------------------------------- */}
        <section className="card p-4 sm:p-5">
          <h2 className="text-[16px] font-bold text-ink-900">Good To Know</h2>
          <div className="mt-4 space-y-4">
            {gameSafety.map((s) => (
              <div key={s.title}>
                <h3 className="text-[15px] font-bold text-ink-900 underline">{s.title}</h3>
                {s.lines.map((line) => (
                  <p key={line} className="mt-1.5 text-[14px] leading-relaxed text-ink-700">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </ParkBooking>
    </div>
  );
}
