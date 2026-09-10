import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck, Calendar, Check, Crown, Expand, Info, MapPin, Navigation, ShieldCheck, User,
} from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import RoomPicker from '@/components/hotels/RoomPicker';
import PackageCard from '@/components/hotels/PackageCard';
import {
  hotelAmenities, hotelMemberBenefits, hotelReviews, hotels, recommendedPackages,
  villaGuidelines as stayGuidelines, villaGuidelinesNote as stayGuidelinesNote,
  villaStay as stayTimes,
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

function Card({ title, children, id, className = '' }) {
  return (
    <section id={id} className={`card scroll-mt-24 p-4 sm:p-5 ${className}`}>
      {title && <h2 className="text-lg font-bold text-ink-900">{title}</h2>}
      {children}
    </section>
  );
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
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`;

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

          <p className="mt-2 flex items-center gap-1.5 text-[15px] text-ink-600">
            <MapPin size={16} className="shrink-0 text-ink-500" />
            {hotel.place}
          </p>

          <p className="mt-3 flex flex-wrap items-baseline gap-2">
            <span className="text-[15px] text-ink-700">From</span>
            <span className="text-xl font-extrabold text-ink-900">
              &#8377;{hotel.from.toLocaleString('en-IN')}
            </span>
            <span className="text-[15px] font-semibold text-red-500 line-through">
              &#8377;{hotel.was.toLocaleString('en-IN')}
            </span>
            <span className="text-[15px] text-ink-700">Per night</span>
          </p>
          <p className="mt-0.5 text-[15px] text-ink-500">(Taxes Included)</p>
        </section>

        {/* -- What membership is worth here -------------------------- */}
        <section className="rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-600">
              <Crown size={20} className="text-gold" fill="currentColor" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-tight text-ink-900">
                {hotelMemberBenefits.title}
              </p>
              <p className="text-[14px] text-ink-600">{hotelMemberBenefits.note}</p>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
            {hotelMemberBenefits.points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-[15px] text-ink-800">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-600 text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {/* -- The stay ----------------------------------------------- */}
        <Card>
          <p className="text-center text-[16px] font-bold text-ink-900">
            Check in: {stayTimes.checkIn} / Check out: {stayTimes.checkOut}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <p className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[14px] font-semibold text-action-500">
              <Calendar size={17} className="shrink-0" />
              {when}
            </p>
            <p className="flex items-center justify-center gap-2 rounded-xl border border-action-500 px-3 py-3 text-[14px] font-semibold text-action-500">
              <User size={17} className="shrink-0" />
              {adults} Adults/ {rooms} Room
            </p>
          </div>
        </Card>

        <RoomPicker
          groups={groups}
          defaultPlan={hotel.defaultPlan}
          bookHref={`/hotels/${hotel.id}/book${carry ? `?${carry}` : ''}`}
        />
      </div>

      <DetailTabs />

      <div className="shell space-y-4 py-4">
        {/* -- Overview ----------------------------------------------- */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">About the Property</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{hotel.about}</p>
          <button type="button" className="mt-2 text-[15px] font-semibold text-action-500">
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
            className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-action-500 px-5 py-3.5 text-[16px] font-bold text-action-500 transition hover:bg-brand-50"
          >
            View More Packages
          </Link>
        </section>

        {/* -- Amenities ---------------------------------------------- */}
        <Card id="amenities" title="Amenities For Couple">
          <div className="mt-5 grid grid-cols-3 gap-y-7 sm:grid-cols-6">
            {hotelAmenities.map((a) => (
              <div key={a.key} className="flex flex-col items-center gap-2 px-1 text-center">
                <Icon name={a.icon} size={26} className="text-action-500" strokeWidth={1.7} />
                <span className="text-[13px] font-semibold leading-tight text-action-500">
                  {a.label}
                </span>
              </div>
            ))}
          </div>
          <button type="button" className="mt-6 text-[15px] font-bold text-ink-900 underline">
            See all Amenities
          </button>
        </Card>

        {/* -- Reviews ------------------------------------------------ */}
        <Card id="reviews" title="Review &amp; Ratings">
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2">
              <span className="rounded-md bg-action-500 px-2.5 py-1 text-[15px] font-bold text-white">
                {hotel.rating}
              </span>
              <span className="text-[15px] text-ink-600">({hotel.reviews} reviews)</span>
            </p>
            <p className="flex items-center gap-1.5 text-[14px] font-semibold text-ink-700">
              <ShieldCheck size={17} className="text-action-500" />
              Verified Reviews
            </p>
          </div>

          <div className="rail mt-4 lg:grid lg:grid-cols-2 lg:gap-5">
            {hotelReviews.map((r) => (
              <article
                key={r.id}
                className="flex w-[85%] flex-col rounded-xl border border-action-500/40 p-4 sm:w-[20rem] lg:w-auto"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-action-500 px-2.5 py-1 text-[14px] font-bold text-action-500">
                    {r.score.toFixed(1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-bold text-ink-900">
                      {r.name}
                    </span>
                    <span className="block text-[13px] text-ink-500">{r.kind}</span>
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">{r.body}</p>
                <p className="mt-4 text-[13px] text-ink-500">{r.date}</p>
              </article>
            ))}
          </div>

          <Link
            href={`/hotels/${hotel.id}/reviews`}
            className="mt-4 inline-block text-[15px] font-bold text-ink-900 underline"
          >
            See all reviews
          </Link>
        </Card>

        {/* -- Location ----------------------------------------------- */}
        <Card id="location" title="Location">
          <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
            <span className="font-semibold text-ink-900">Address:</span> {hotel.address}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="flex h-24 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#dfeae2] to-[#c9dcd2] text-[14px] font-semibold text-ink-800 transition hover:brightness-95"
            >
              <Expand size={17} />
              Expand Map
            </a>
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="flex h-24 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#e3e7ee] to-[#cfd7e4] text-[14px] font-semibold text-ink-800 transition hover:brightness-95"
            >
              <Navigation size={17} />
              Street View
            </a>
          </div>

          <h3 className="mt-5 text-[16px] font-bold text-ink-900">What&rsquo;s Nearby</h3>
          <ul className="mt-2 divide-y divide-surface-line">
            {hotel.nearby.map((n) => (
              <li key={n.place} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-[15px] text-ink-700">{n.place}</span>
                <span className="shrink-0 text-[15px] text-ink-500">{n.km}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* -- Guidelines --------------------------------------------- */}
        <section id="guidelines" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">Stay Guide Lines</h2>
          <div className="card mt-3 space-y-5 p-4 sm:p-5">
            {stayGuidelines.map((g) => (
              <div key={g.title}>
                <h3 className="font-bold text-ink-900 underline">{g.title}</h3>
                {g.lines.map((line) => (
                  <p key={line} className="mt-2 text-[15px] leading-relaxed text-ink-700">
                    {line}
                  </p>
                ))}
              </div>
            ))}

            <p className="flex gap-2.5 rounded-xl bg-[#e8f2fe] p-3.5 text-[14px] leading-snug text-brand-700">
              <Info size={18} className="mt-0.5 shrink-0 text-action-500" />
              {stayGuidelinesNote}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
