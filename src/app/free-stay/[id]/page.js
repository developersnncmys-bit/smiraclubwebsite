import { notFound } from 'next/navigation';
import { BadgeCheck, Calendar, MapPin, User } from 'lucide-react';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import FreeStayCard from '@/components/hotels/FreeStayCard';
import FreeStayPicker from '@/components/hotels/FreeStayPicker';
import {
  AmenitiesCard, DetailCard, GuidelinesSection, LocationCard, MemberBenefitsCard, ReviewsCard,
} from '@/components/hotels/DetailSections';
import { freeStayGuideline, hotels, villaStay as stayTimes } from '@/lib/content';
import { image } from '@/lib/images';
import { defaultStay, nightsBetween, shortDate } from '@/lib/format';

export function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hotels.find((h) => h.id === id);
  return { title: hotel ? `${hotel.name} — Free Stay` : 'Hotel not found' };
}

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const valid = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v || '');

/**
 * One hotel, as a free stay.
 *
 * The same hotel and the same blocks as its nightly page, with the price
 * taken out of the room and put on the food: choose a room at no charge, say
 * who is eating, pick a meal preference, and the bar books it.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) notFound();

  const fallback = defaultStay();
  const from = valid(query.from) ? query.from : isoDay(fallback.from);
  const to = valid(query.to) && query.to > from ? query.to : isoDay(fallback.to);
  const adults = Number(query.adults) || 2;
  const children = Number(query.children) || 0;
  const rooms = Number(query.rooms) || 1;
  const nights = nightsBetween(from, to);

  const carry = new URLSearchParams({
    from, to, adults: String(adults), children: String(children), rooms: String(rooms),
  }).toString();

  const photos = [image(hotel.image), image('villa-room-1'), image('villa-room-2')];
  const groups = hotel.roomGroups.map((g) => ({ ...g, room: { ...g.room, image: image(g.room.image) } }));
  const others = hotels
    .filter((h) => h.id !== hotel.id)
    .map((h) => ({ ...h, image: image(h.image) }));

  const head = (
    <>
      <section>
        <h1 className="flex items-start gap-2 text-2xl font-bold leading-tight text-ink-900">
          {hotel.name}
          {hotel.verified && (
            <BadgeCheck size={22} className="mt-1 shrink-0 text-action-500" aria-label="Verified property" />
          )}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-600">
          <MapPin size={16} className="shrink-0 text-ink-500" />
          {hotel.place}
        </p>
        <p className="mt-3 text-xl font-extrabold text-green-600">Free Stay Pay For Food</p>
      </section>
      <MemberBenefitsCard />

    </>
  );

  return (
    <div className="pb-32 lg:pb-16">
      <DetailGallery photos={photos} name={hotel.name} rating={hotel.rating} reviews={hotel.reviews} />

      <div className="shell py-4 lg:py-8">
        <FreeStayPicker
          head={head}
          groups={groups}
          nights={nights}
          adults={adults}
          children={children}
          bookBase={`/free-stay/${hotel.id}/book`}
          carry={carry}
        />
      </div>

      {/* -- The stay, just above the tabs -------------------------- */}
      <div className="shell pb-4 lg:pb-8">
        <DetailCard>
          <p className="text-center text-[15px] font-bold text-ink-900">
            Check in: {stayTimes.checkIn} / Check out: {stayTimes.checkOut}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <p className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500">
              <Calendar size={17} className="shrink-0" />
              {shortDate(from)} - {shortDate(to)}
            </p>
            <p className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[13px] font-semibold text-action-500">
              <User size={17} className="shrink-0" />
              {adults} Adults/ {rooms} Room
            </p>
          </div>
        </DetailCard>
      </div>

      <DetailTabs />

      <div className="shell space-y-4 py-4 lg:py-8">
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">About the Property</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{hotel.about}</p>
          <button type="button" className="mt-2 text-[14px] font-semibold text-action-500">
            Read More
          </button>
        </section>

        <AmenitiesCard />
        <ReviewsCard rating={hotel.rating} reviews={hotel.reviews} href={`/hotels/${hotel.id}/reviews`} />
        <LocationCard address={hotel.address} nearby={hotel.nearby} />
        <GuidelinesSection extra={freeStayGuideline} />

        {others.length > 0 && (
          <section className="pt-2">
            <h2 className="text-lg font-bold text-ink-900 lg:text-xl">Recommended Free Stays</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:gap-6">
              {others.map((h) => (
                <FreeStayCard key={h.id} hotel={h} href={`/free-stay/${h.id}?${carry}`} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
