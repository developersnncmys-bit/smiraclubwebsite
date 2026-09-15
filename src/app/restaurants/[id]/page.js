import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, CircleCheck, Crown, UtensilsCrossed } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import BookTable from '@/components/offers/BookTable';
import OpenHours from '@/components/offers/OpenHours';
import RestaurantCard from '@/components/offers/RestaurantCard';
import { MemberStrip } from '@/components/offers/OfferBits';
import { DetailCard, LocationCard, ReviewsCard } from '@/components/hotels/DetailSections';
import {
  parkNearby, restaurantFacilities, restaurantHours, restaurantMenu, restaurantPerks, restaurants,
} from '@/lib/content';
import { image } from '@/lib/images';

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const r = restaurants.find((x) => x.id === id);
  return { title: r ? `${r.name} — Offer Details` : 'Restaurant not found' };
}

const TABS = [
  { key: 'offers', label: 'Offers' },
  { key: 'overview', label: 'Overview' },
  { key: 'menu', label: 'Menu' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'location', label: 'Location' },
];

/**
 * Offer Details for a restaurant: the offer, the place, the menu, and Book a
 * Table — pinned at the foot on a phone, in a sticky rail on a desktop.
 */
export default async function Page({ params }) {
  const { id } = await params;
  const r = restaurants.find((x) => x.id === id);
  if (!r) notFound();

  const photos = [image(r.image), image('rest-garden-night'), image('menu-food')];
  const similar = restaurants
    .filter((x) => x.id !== r.id)
    .slice(0, 2)
    .map((x) => ({ ...x, image: image(x.image) }));

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={photos} name={r.name} rating={r.rating} reviews={r.reviews} />

      <div className="shell grid grid-cols-1 gap-4 py-4 lg:grid-cols-12 lg:gap-x-8 lg:py-8">
        <section className="min-w-0 lg:col-span-8">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#fdeee4] px-3 py-1.5 text-[14px] font-medium text-[#c2571a]">
            <UtensilsCrossed size={15} />
            Restaurant
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-ink-900">{r.name}</h1>
          <a href="#location" className="mt-1 inline-flex items-center gap-1 text-[14px] text-ink-700 hover:underline">
            {r.place}
            <ChevronRight size={15} />
          </a>
          <OpenHours hours={restaurantHours} />

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

        <aside className="hidden lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:block lg:self-start lg:sticky lg:top-32">
          <div className="card p-5">
            <p className="text-[16px] font-bold text-ink-900">{r.name}</p>
            <MemberStrip percent={r.offer} className="mt-3" />
            <p className="mt-3 text-[14px] text-ink-700">Bookings available from {r.opensAt}, Today</p>
            <div className="mt-4">
              <BookTable restaurant={{ id: r.id, name: r.name }} />
            </div>
          </div>
        </aside>
      </div>

      <DetailTabs tabs={TABS} />

      <div className="shell grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 space-y-4 py-4 lg:col-span-8 lg:py-8">
          <DetailCard id="offers" title="Offers">
            <MemberStrip percent={r.offer} className="mt-3" />
            <p className="mt-3 text-[14px] text-ink-700">On the total bill for Smira Club members. Show your membership when you arrive.</p>
          </DetailCard>

          <DetailCard id="overview" title="About This Place">
            <p className="mt-2 text-[14px] leading-relaxed text-ink-700">
              Overlooking the Arabian Sea, <span className="font-semibold text-ink-900">{r.name}</span> offers relaxed
              seating and world-class dining.
            </p>
            <ul className="mt-4 space-y-2">
              {restaurantPerks.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[14px] text-ink-700">
                  <CircleCheck size={17} className="shrink-0 text-ink-500" />
                  {p}
                </li>
              ))}
            </ul>
          </DetailCard>

          <DetailCard id="menu">
            <h2 className="text-lg font-bold text-ink-900">
              Menu <span className="text-[13px] font-medium text-ink-500">&middot; {restaurantMenu.updated}</span>
            </h2>
            <p className="mt-2 text-[14px] text-ink-700">{restaurantMenu.cuisines}</p>
            <ul className="mt-4 flex gap-3">
              {restaurantMenu.books.map((b) => (
                <li key={b.key} className="w-[9.5rem] text-center">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-xl">
                    <Image src={image(b.image)} alt={`${b.label} menu`} fill sizes="160px" className="object-cover" />
                  </span>
                  <span className="mt-2 block text-[15px] font-semibold text-ink-900">{b.label}</span>
                  <span className="block text-[13px] text-ink-500">{b.pages} pages</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          <DetailCard id="facilities" title="Facilities">
            <ul className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-brand-50/60 p-3">
              {restaurantFacilities.map((f) => (
                <li key={f.label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon name={f.icon} size={22} className="text-action-500" strokeWidth={1.7} />
                  <span className="text-[12px] font-medium leading-tight text-ink-900">{f.label}</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          <ReviewsCard rating={r.rating} reviews={r.reviews} />
          <LocationCard address={r.address} nearby={parkNearby} />

          {similar.length > 0 && (
            <section className="pt-2">
              <h2 className="text-lg font-bold text-ink-900">Showing similar restaurants</h2>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {similar.map((x) => (
                  <RestaurantCard key={x.id} restaurant={x} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* The phone bar and the sheet; the desktop button lives in the rail above. */}
      <div className="lg:hidden">
        <BookTable restaurant={{ id: r.id, name: r.name }} />
      </div>
    </div>
  );
}
