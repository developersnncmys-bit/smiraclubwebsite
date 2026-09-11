import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  BadgeCheck, Bed, Calendar, Crown, Expand, Images, Info, MapPin, Navigation,
  ShieldCheck, User, Users,
} from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import BookingBar from '@/components/villas/BookingBar';
import {
  villaAmenities, villaDetails, villaGuidelines, villaGuidelinesNote, villaHost,
  villaMemberOffer, villaResults, villaReviews, villaRules, villaStay, villas,
  villaWhatsIncluded,
} from '@/lib/content';
import { image } from '@/lib/images';
import { shortDate } from '@/lib/format';

/** Every villa the site knows about, from both lists. */
const ALL = [...villaResults, ...villas];

export function generateStaticParams() {
  return ALL.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const villa = ALL.find((v) => v.id === id);
  return villa
    ? { title: villa.name, description: villaDetails[villa.id]?.about }
    : { title: 'Villa not found' };
}

function stayLabel(from, to) {
  if (!from || !to) return '29 Aug - 31 Aug';
  const a = new Date(from);
  const b = new Date(to);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return '29 Aug - 31 Aug';
  return `${shortDate(a)} - ${shortDate(b)}`;
}

/** A small labelled card, which most of this page is made of. */
function Card({ title, children, id, className = '' }) {
  return (
    <section id={id} className={`card scroll-mt-24 p-4 sm:p-5 ${className}`}>
      {title && <h2 className="text-lg font-bold text-ink-900">{title}</h2>}
      {children}
    </section>
  );
}

/**
 * One villa's page.
 *
 * `params` and `searchParams` are both promises in Next 16 — synchronous
 * access was removed — so both are awaited. The dates and guests come from
 * whatever search led here and fall back to the design's own values when
 * someone lands on the page cold.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const villa = ALL.find((v) => v.id === id);
  if (!villa) notFound();

  const detail = villaDetails[villa.id];
  const photos = [image(villa.image), image('villa-room-1'), image('villa-room-2')];
  const amenities = [
    { key: 'bhk', label: `${detail.bedrooms} BHK`, icon: 'BedDouble' },
    ...villaAmenities,
  ];

  const when = stayLabel(query.from, query.to);
  const adults = Number(query.adults) || 2;
  const rooms = Number(query.rooms) || 1;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.address)}`;
  /** The search that led here rides along, so Review Booking reads the same stay. */
  const carry = new URLSearchParams(query).toString();

  return (
    <div className="pb-28 lg:pb-36">
      <DetailGallery
        photos={photos}
        name={villa.name}
        rating={villa.rating}
        reviews={villa.reviews}
      />

      <div className="shell space-y-4 py-4">
        {/* -- What the membership is worth here ---------------------- */}
        <div className="flex items-center gap-3.5 rounded-xl bg-gradient-to-r from-[#eef1fe] to-[#dfe7fd] p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1b2a5b]">
            <Crown size={20} className="text-gold" fill="currentColor" strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] text-ink-700">{villaMemberOffer.kicker}</p>
            <p className="text-[14px] font-bold text-ink-900">{villaMemberOffer.headline}</p>
            <p className="mt-0.5 text-[13px] text-ink-500">{villaMemberOffer.note}</p>
          </div>
        </div>

        {/* -- Who and where ------------------------------------------ */}
        <section>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-ink-900">
            {villa.name}
            {villa.verified && (
              <BadgeCheck size={21} className="shrink-0 text-action-500" aria-label="Verified" />
            )}
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-[14px] text-ink-600">
            <MapPin size={16} className="shrink-0 text-ink-500" />
            {villa.place}
          </p>

          <p className="mt-4 flex items-center gap-2 border-l-[3px] border-action-500 pl-3 text-[15px] font-semibold text-ink-900">
            {villa.layout}
            <Info size={15} className="text-ink-400" />
          </p>

          <ul className="mt-3 space-y-2 text-[14px] text-ink-700">
            <li className="flex gap-2.5">
              <Bed size={19} className="mt-0.5 shrink-0 text-ink-600" />
              {detail.bedrooms} Bedrooms, {detail.beds}, {detail.baths} Bathrooms
            </li>
            <li className="flex gap-2.5">
              <Users size={19} className="mt-0.5 shrink-0 text-ink-600" />
              Sleeps {detail.sleeps} Guests, can accommodate {detail.extra} more guests at extra cost
            </li>
          </ul>

          <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.08em] text-action-500">
            {detail.unit}
          </p>
        </section>

        {/* -- The host ----------------------------------------------- */}
        <Card title={villaHost.title}>
          <p className="mt-3 flex gap-2 border-t border-surface-line pt-3 text-[14px] text-ink-700">
            <span aria-hidden="true" className="text-ink-400">&bull;</span>
            {villaHost.speaks}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-700">{villaHost.blurb}</p>
          <button type="button" className="mt-3 text-[14px] font-bold text-ink-900 underline">
            View Details
          </button>
        </Card>

        {/* -- The stay ----------------------------------------------- */}
        <Card>
          <p className="text-center text-[15px] font-bold text-ink-900">
            Check in: {villaStay.checkIn} / Check out: {villaStay.checkOut}
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
        </Card>
      </div>

      <DetailTabs />

      <div className="shell space-y-4 py-4">
        {/* -- Overview ----------------------------------------------- */}
        <section id="overview" className="scroll-mt-24">
          <h2 className="text-lg font-bold text-ink-900">About the Property</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{detail.about}</p>
          <button type="button" className="mt-2 text-[14px] font-semibold text-action-500">
            Read More
          </button>
        </section>

        {/* -- Amenities ---------------------------------------------- */}
        <Card id="amenities" title="Amenities">
          <div className="mt-4 grid grid-cols-3 gap-y-6 sm:grid-cols-6">
            {amenities.map((a) => (
              <div key={a.key} className="flex flex-col items-center gap-2 px-1 text-center">
                <Icon name={a.icon} size={26} className="text-action-500" strokeWidth={1.7} />
                <span className="text-[13px] font-semibold leading-tight text-action-500">
                  {a.label}
                </span>
              </div>
            ))}
          </div>
          <button type="button" className="mt-5 text-[14px] font-bold text-ink-900 underline">
            See all Amenities
          </button>
        </Card>

        {/* -- Property layout ---------------------------------------- */}
        <section className="pt-2">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
            Property Layout
            <Info size={15} className="text-ink-400" />
          </h2>
          <p className="mt-1 text-[14px] text-ink-600">Your villa unit contains the following:</p>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {detail.rooms.map((room) => (
              <article key={room.id} className="card overflow-hidden">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image(room.image)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md bg-ink-900/75 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
                    <Images size={14} />
                    {room.photos} Photos
                  </span>
                </div>

                <div className="p-3">
                  <span className="inline-block rounded-md border border-action-500 px-2.5 py-1 text-[12px] font-semibold text-action-500">
                    {room.tag}
                  </span>
                  <p className="mt-2 text-[14px] font-bold text-ink-900">{room.name}</p>
                  <p className="text-[13px] text-ink-500">{room.floor}</p>
                  <ul className="mt-2 space-y-1.5">
                    {room.lines.map((line) => (
                      <li key={line} className="flex gap-2 text-[13px] leading-snug text-ink-600">
                        <span aria-hidden="true" className="text-ink-400">&#9702;</span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* -- What is included --------------------------------------- */}
        <Card title="What&rsquo;s Included?">
          <ul className="mt-3 space-y-1.5">
            {villaWhatsIncluded.map((line) => (
              <li key={line} className="flex gap-2 text-[14px] text-ink-700">
                <span aria-hidden="true" className="text-ink-400">&#9702;</span>
                {line}
              </li>
            ))}
          </ul>
          <button type="button" className="mt-3 text-[14px] font-bold text-ink-900 underline">
            View Details
          </button>
        </Card>

        {/* -- Reviews ------------------------------------------------ */}
        <Card id="reviews" title="Review &amp; Ratings">
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2">
              <span className="rounded-md bg-action-500 px-2.5 py-1 text-[14px] font-bold text-white">
                {villa.rating}
              </span>
              <span className="text-[14px] text-ink-600">({villa.reviews} reviews)</span>
            </p>
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700">
              <ShieldCheck size={17} className="text-action-500" />
              Verified Reviews
            </p>
          </div>

          <div className="rail mt-4 lg:grid lg:grid-cols-2 lg:gap-5">
            {villaReviews.map((r) => (
              <article
                key={r.id}
                className="flex w-[85%] flex-col rounded-xl border border-action-500/40 p-4 sm:w-[20rem] lg:w-auto"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-action-500 px-2.5 py-1 text-[13px] font-bold text-action-500">
                    {r.score.toFixed(1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-bold text-ink-900">
                      {r.name}
                    </span>
                    <span className="block text-[13px] text-ink-500">{r.kind}</span>
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-700">{r.body}</p>
                <p className="mt-4 text-[13px] text-ink-500">{r.date}</p>
              </article>
            ))}
          </div>

          <button type="button" className="mt-4 text-[14px] font-bold text-action-500 underline">
            See all reviews
          </button>
        </Card>

        {/* -- Location ----------------------------------------------- */}
        <Card id="location" title="Location">
          <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
            <span className="font-semibold text-ink-900">Address:</span> {detail.address}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="flex h-24 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#dfeae2] to-[#c9dcd2] text-[13px] font-semibold text-ink-800 transition hover:brightness-95"
            >
              <Expand size={17} />
              Expand Map
            </a>
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="flex h-24 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#e3e7ee] to-[#cfd7e4] text-[13px] font-semibold text-ink-800 transition hover:brightness-95"
            >
              <Navigation size={17} />
              Street View
            </a>
          </div>

          <h3 className="mt-5 text-[15px] font-bold text-ink-900">What&rsquo;s Nearby</h3>
          <ul className="mt-2 divide-y divide-surface-line">
            {detail.nearby.map((n) => (
              <li key={n.place} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-[14px] text-ink-700">{n.place}</span>
                <span className="shrink-0 text-[14px] text-ink-500">{n.km}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* -- Rules -------------------------------------------------- */}
        <Card title="Property Rules &amp; Information">
          <ul className="mt-3 space-y-3">
            {villaRules.map((rule) => (
              <li key={rule.title || rule.body} className="flex gap-2">
                <span aria-hidden="true" className="text-ink-400">&#9702;</span>
                <span>
                  {rule.title && (
                    <span className="block font-semibold text-ink-900 underline">{rule.title}</span>
                  )}
                  <span className="block text-[14px] leading-relaxed text-ink-700">{rule.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-3 text-[14px] font-bold text-ink-900 underline">
            View more
          </button>
        </Card>

        {/* -- Guidelines --------------------------------------------- */}
        <Card id="guidelines" title="Stay Guide Lines">
          <div className="mt-3 space-y-5">
            {villaGuidelines.map((g) => (
              <div key={g.title}>
                <h3 className="font-bold text-ink-900 underline">{g.title}</h3>
                {g.lines.map((line) => (
                  <p key={line} className="mt-2 text-[14px] leading-relaxed text-ink-700">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-5 flex gap-2.5 rounded-xl bg-[#e8f2fe] p-3.5 text-[13px] leading-snug text-brand-700">
            <Info size={18} className="mt-0.5 shrink-0 text-action-500" />
            {villaGuidelinesNote}
          </p>
        </Card>
      </div>

      <BookingBar
        name={villa.name}
        layout={villa.layout}
        price={villa.price}
        was={villa.was}
        taxes={villa.taxes}
        bookHref={`/villas/${villa.id}/book${carry ? `?${carry}` : ''}`}
      />
    </div>
  );
}
