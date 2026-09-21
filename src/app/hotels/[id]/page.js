import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BadgeCheck, Calendar, MapPin, User } from 'lucide-react';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import RoomPicker from '@/components/hotels/RoomPicker';
import PackageCard from '@/components/hotels/PackageCard';
import {
  AmenitiesCard, DetailCard, GuidelinesSection, LocationCard, MemberBenefitsCard, ReviewsCard,
} from '@/components/hotels/DetailSections';
import {
  hotels, recommendedPackages, villaStay as stayTimes,
} from '@/lib/content';
import { image } from '@/lib/images';
import { defaultStay, shortDate } from '@/lib/format';

export function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hotels.find((h) => h.id === id);
  return hotel
    ? { title: hotel.name, description: hotel.about }
    : { title: 'Hotel not found' };
}

/**
 * One hotel's page.
 *
 * The shape follows the villa screen deliberately — same gallery, same tabs,
 * same location and guidelines blocks — because a member moving between the
 * two should not have to relearn the page. What is genuinely different is
 * Select Room: a hotel sells rate plans, and the plan you pick is what the
 * bottom bar quotes.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) notFound();

  const photos = [image(hotel.image), image('villa-room-1'), image('villa-room-2')];
  const groups = hotel.roomGroups.map((g) => ({
    ...g,
    room: { ...g.room, image: image(g.room.image) },
  }));
  const packages = recommendedPackages.map((p) => ({ ...p, image: image(p.image) }));

  /**
   * Resolve the stay here rather than letting Review Booking fall back on
   * its own — otherwise a member who arrives without dates sees one stay on
   * this page and a different one on the next.
   */
  const fallback = defaultStay();
  const from = query.from ? new Date(query.from) : fallback.from;
  const to = query.to ? new Date(query.to) : fallback.to;
  const adults = Number(query.adults) || 2;
  const rooms = Number(query.rooms) || 1;

  const when = `${shortDate(from)} - ${shortDate(to)}`;
  const carry = new URLSearchParams({
    ...query,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    adults: String(adults),
    rooms: String(rooms),
  }).toString();

  return (
    <div className="pb-32 lg:pb-36">
      <DetailGallery
        photos={photos}
        name={hotel.name}
        rating={hotel.rating}
        reviews={hotel.reviews}
      />

      <div className="shell space-y-4 py-4">
        {/* -- Who and what it costs ---------------------------------- */}
        <section>
          <h1 className="flex items-start gap-2 text-2xl font-bold leading-tight text-ink-900">
            {hotel.name}
            {hotel.verified && (
              <BadgeCheck
                size={22}
                className="mt-1 shrink-0 text-action-500"
                aria-label="Verified property"
              />
            )}
          </h1>

          <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-600">
            <MapPin size={16} className="shrink-0 text-ink-500" />
            {hotel.place}
          </p>

          <p className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-[14px] text-ink-700">From</span>
            <span className="text-xl font-extrabold text-ink-900">
              &#8377;{hotel.from.toLocaleString('en-IN')}
            </span>
            <span className="text-[14px] font-semibold text-red-500 line-through">
              &#8377;{hotel.was.toLocaleString('en-IN')}
            </span>
            <span className="text-[14px] text-ink-700">Per night</span>
          </p>
          <p className="mt-0.5 text-[14px] text-ink-500">(Taxes Included)</p>
        </section>

        <MemberBenefitsCard />

        <RoomPicker
          groups={groups}
          defaultPlan={hotel.defaultPlan}
          bookHref={`/hotels/${hotel.id}/book${carry ? `?${carry}` : ''}`}
        />

        {/* -- The stay ----------------------------------------------- */}
        <DetailCard>
          <p className="text-center text-[15px] font-bold text-ink-900">
            Check in: {stayTimes.checkIn} / Check out: {stayTimes.checkOut}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <p className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500">
              <Calendar size={17} className="shrink-0" />
              {when}
            </p>
            <p className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500">
              <User size={17} className="shrink-0" />
              {adults} Adults/ {rooms} Room
            </p>
          </div>
        </DetailCard>
      </div>

      <DetailTabs />

      <div className="shell space-y-4 py-4">
        {/* -- Overview ----------------------------------------------- */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">About the Property</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{hotel.about}</p>
          <button type="button" className="mt-2 text-[14px] font-semibold text-action-500">
            Read More
          </button>
        </section>

        {/* -- Packages worth a look, still under Overview ------------- */}
        <section className="pt-2">
          <h2 className="text-lg font-bold text-ink-900 lg:text-xl">Recommended Packages</h2>

          <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
            {packages.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}
          </div>

          <Link
            href="/packages"
            className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-action-500 px-5 py-3.5 text-[15px] font-bold text-action-500 transition hover:bg-brand-50"
          >
            View More Packages
          </Link>
        </section>

        <AmenitiesCard />

        {/* -- Reviews, location, guidelines ------------------------- */}
        <ReviewsCard rating={hotel.rating} reviews={hotel.reviews} href={`/hotels/${hotel.id}/reviews`} />
        <LocationCard address={hotel.address} nearby={hotel.nearby} />
        <GuidelinesSection />
      </div>
    </div>
  );
}
