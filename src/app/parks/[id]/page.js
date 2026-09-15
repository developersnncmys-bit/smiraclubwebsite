import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Crown } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import ParkBooking from '@/components/offers/ParkBooking';
import { DetailCard, LocationCard, ReviewsCard } from '@/components/hotels/DetailSections';
import {
  parkAbout, parkFacilities, parkIdealFor, parkNearby, parkRides, parkSafety, parks, parkTickets,
} from '@/lib/content';
import { image } from '@/lib/images';

export function generateStaticParams() {
  return parks.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const park = parks.find((p) => p.id === id);
  return { title: park ? `${park.name} — Offer Details` : 'Park not found' };
}

const TABS = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'overview', label: 'Overview' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'location', label: 'Location' },
];

/**
 * Offer Details for a water park or theme park.
 *
 * One scroll, as drawn: who and when at the top, the tickets, what the park
 * is like, and the booking itself at the foot — Price Summary and the guest
 * form — with Book Ticket pinned under it all.
 */
export default async function Page({ params }) {
  const { id } = await params;
  const park = parks.find((p) => p.id === id);
  if (!park) notFound();

  const photos = park.images.map((slot) => image(slot));
  const tickets = parkTickets(park);

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={photos} name={park.name} rating={park.rating} reviews={park.reviews} />

      <div className="shell space-y-4 py-4 lg:py-8">
        <section>
          <h1 className="text-2xl font-extrabold uppercase leading-tight text-ink-900">{park.name.replace(' | ', ' ')}</h1>
          <a href="#location" className="mt-1.5 inline-flex items-center gap-1 text-[14px] text-ink-700 hover:underline">
            {park.place}
            <ChevronRight size={15} />
          </a>
          <p className="mt-1 text-[14px]">
            <span className="font-semibold text-green-600">Open daily</span>
            <span className="text-ink-700"> &middot; {park.hours}</span>
          </p>
          <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-700">{park.blurb}</p>
        </section>

        <section className="flex items-center gap-3 rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-4 lg:max-w-3xl">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-600">
            <Crown size={18} className="text-gold" fill="currentColor" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-green-700">Get UP TO {park.offer}% OFF</p>
            <p className="text-[15px] font-bold leading-tight text-ink-900">Smira Club Member Benefits</p>
            <p className="text-[12px] text-ink-700">Enjoy special member pricing &amp; exciting offers.</p>
          </div>
        </section>
      </div>

      <DetailTabs tabs={TABS} />

      <ParkBooking
        park={{ id: park.id, name: park.name, hours: park.hours }}
        tickets={tickets}
      >
        {/* -- About ------------------------------------------------------ */}
        <section id="overview" className="card scroll-mt-32 p-4 sm:p-5">
          <h2 className="text-[16px] font-bold text-ink-900">About This Place</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-700">{parkAbout}</p>
          <button type="button" className="mt-2 text-[14px] font-semibold text-action-500">Read More</button>

          <h3 className="mt-5 text-[15px] font-bold text-ink-900">Ideal For</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {parkIdealFor.map((t) => (
              <li key={t} className="rounded-full border border-action-500 px-3.5 py-1.5 text-[13px] font-medium text-action-500">{t}</li>
            ))}
          </ul>
        </section>

        {/* -- Rides ------------------------------------------------------ */}
        <section>
          <h2 className="text-center text-[16px] font-extrabold uppercase text-ink-900 lg:text-left">Explore the Iconic Rides</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {parkRides.map((r) => (
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
            {parkFacilities.map((f) => (
              <li key={f.label} className="flex flex-col items-center gap-2 px-1 text-center">
                <Icon name={f.icon} size={24} className="text-action-500" strokeWidth={1.7} />
                <span className="text-[12px] font-medium leading-tight text-action-500">{f.label}</span>
              </li>
            ))}
          </ul>
        </DetailCard>

        <ReviewsCard rating={park.rating} reviews={park.reviews} />

        <DetailCard title="Food &amp; Beverages Payable">
          <p className="mt-3 flex items-center gap-2 text-[14px] text-ink-700">
            <span aria-hidden="true" className="h-2 w-2 rounded-full border-2 border-ink-700" />
            Payable
          </p>
          <button type="button" className="mt-3 text-[14px] font-bold text-ink-900 underline">View Details</button>
        </DetailCard>

        <LocationCard address={park.address} nearby={parkNearby} />

        {/* -- Safety ----------------------------------------------------- */}
        <section className="card p-4 sm:p-5">
          <h2 className="text-[16px] font-bold text-ink-900">Safety Guide Lines</h2>
          <div className="mt-4 space-y-4">
            {parkSafety.map((s) => (
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
