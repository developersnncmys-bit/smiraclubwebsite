import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BadgeCheck, ChevronRight, Images, Sparkles, UtensilsCrossed } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import HourlySlotPicker from '@/components/hotels/HourlySlotPicker';
import {
  DetailCard, GuidelinesSection, LocationCard, ReviewsCard, RulesCard,
} from '@/components/hotels/DetailSections';
import { hourlyHotels } from '@/lib/content';
import { image } from '@/lib/images';

export function generateStaticParams() {
  return hourlyHotels.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const hotel = hourlyHotels.find((h) => h.id === id);
  return { title: hotel ? `${hotel.name} — Hourly Stay` : 'Hotel not found' };
}

const isoDay = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * One hotel, sold by the hour.
 *
 * Built from the same blocks as the nightly hotel page — reviews, location,
 * rules, guidelines — with the slot choice in place of the rate plans. On a
 * desktop the slot card rides a sticky rail beside the page; on a phone it
 * sits in the flow with the booking bar pinned below, as drawn.
 */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  const query = (await searchParams) || {};

  const hotel = hourlyHotels.find((h) => h.id === id);
  if (!hotel) notFound();

  const initial = {
    date: /^\d{4}-\d{2}-\d{2}$/.test(query.date || '') ? query.date : isoDay(new Date()),
    time: /^\d{2}:\d{2}$/.test(query.time || '') ? query.time : '14:00',
    hours: Number(query.hours) || 3,
    adults: Number(query.adults) || 2,
    rooms: Number(query.rooms) || 1,
    children: Number(query.children) || 0,
  };

  const photos = hotel.images.map((slot) => image(slot));

  return (
    <div className="pb-32 lg:pb-16">
      <DetailGallery photos={photos} name={hotel.name} rating={hotel.rating} reviews={hotel.reviews} />

      {/*
        grid-cols-1 is minmax(0, 1fr): without it the one implicit column
        sizes to its widest content, and the swipeable reviews rail pushed
        the whole page wider than the phone.
      */}
      <div className="shell grid grid-cols-1 gap-4 py-4 lg:grid-cols-12 lg:gap-x-8 lg:py-8">
        {/* -- Who and where ---------------------------------------------- */}
        <section className="lg:col-span-8">
          <h1 className="flex items-center gap-2 text-2xl font-bold leading-tight text-ink-900">
            {hotel.name}
            {hotel.verified && (
              <BadgeCheck size={22} className="shrink-0 text-action-500" aria-label="Verified property" />
            )}
          </h1>
          <a href="#location" className="mt-1.5 inline-flex items-center gap-1 text-[14px] text-ink-700 hover:underline">
            {hotel.place} | {hotel.reach}
            <ChevronRight size={16} className="shrink-0" />
          </a>

          <p className="mt-4 flex gap-2.5 rounded-xl bg-[#e8f2fe] p-3.5 text-[13px] font-medium leading-snug text-brand-700">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-action-500" />
            {hotel.highlight}
          </p>
        </section>

        {/* -- The slot: in the flow on a phone, a sticky rail on a desktop -- */}
        <aside className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:self-start lg:sticky lg:top-24">
          <HourlySlotPicker hotel={hotel} initial={initial} />
        </aside>

        <div className="space-y-4 lg:col-span-8">
          {/* -- Select Room ---------------------------------------------- */}
          <section>
            <h2 className="text-lg font-bold text-ink-900">Select Room</h2>
            <div className="card mt-3 p-4 sm:p-5">
              <p className="text-[15px] font-semibold text-ink-700">{hotel.room.category}</p>
              <div className="mt-3 flex gap-4">
                <span className="relative h-[104px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:h-[120px] sm:w-[150px]">
                  <Image src={image(hotel.room.image)} alt="" fill sizes="150px" className="object-cover" />
                  <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    <Images size={12} />
                    {hotel.room.photos}
                  </span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-[16px] font-bold text-ink-900">{hotel.room.name}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {hotel.room.facts.map((f) => (
                      <li key={f.text} className="flex items-center gap-2 text-[13px] text-ink-700">
                        <Icon name={f.icon} size={15} className="shrink-0 text-ink-500" />
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button type="button" className="mt-4 text-[14px] font-semibold text-action-500 underline">
                Room &amp; Cancellation Policy Details
              </button>
            </div>
          </section>

          <ReviewsCard rating={hotel.rating} reviews={hotel.reviews} />

          <DetailCard title="Restaurant">
            <p className="mt-3 flex items-center gap-2.5 text-[14px] text-ink-700">
              <UtensilsCrossed size={16} className="shrink-0 text-ink-500" />
              {hotel.restaurant}
            </p>
            <button type="button" className="mt-4 text-[14px] font-bold text-ink-900 underline">
              View Details
            </button>
          </DetailCard>

          <LocationCard address={hotel.address} nearby={hotel.nearby} />
          <RulesCard />
          <GuidelinesSection />
        </div>
      </div>
    </div>
  );
}
