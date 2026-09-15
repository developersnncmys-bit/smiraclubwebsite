import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Crown, Images, Star } from 'lucide-react';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import SpaBooking from '@/components/offers/SpaBooking';
import { DetailCard, ReviewsCard } from '@/components/hotels/DetailSections';
import { luxuries, luxuryAvailableFrom, spaDates } from '@/lib/content';
import { image } from '@/lib/images';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const l = luxuries.find((x) => x.id === id);
  return { title: l ? l.name : 'Not found' };
}

const TABS = [
  { key: 'offers', label: 'Offers' },
  { key: 'overview', label: 'Overview' },
  { key: 'things', label: 'Things To Know' },
  { key: 'reviews', label: 'Reviews' },
];

/** A luxury experience: the offer, Select Package, and the event details. */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  await searchParams;
  const l = luxuries.find((x) => x.id === id);
  if (!l) notFound();

  // Bookings open tomorrow, so the sheet's days start there too.
  const dates = spaDates(8).slice(1);

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={l.photos.map((p) => image(p))} name={l.name} rating={l.rating} reviews={l.reviews} />

      <div className="shell py-4 lg:py-8">
        <section className="lg:max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight text-ink-900">{l.name}</h1>
          <p className="mt-1 inline-flex items-center gap-1 text-[14px] text-ink-900">
            {l.place}
            <ChevronRight size={15} />
          </p>
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
        <section className="card flex items-center justify-between gap-4 overflow-hidden pl-4">
          <p className="py-5 text-[15px] font-semibold text-ink-900">
            Booking Available
            <br />
            from {luxuryAvailableFrom(l)}
          </p>
          <p className="self-start rounded-bl-2xl bg-brand-700 px-4 py-2 text-center text-white">
            <span className="block text-[13px] font-semibold">Get Up To</span>
            <span className="block text-[20px] font-extrabold italic leading-tight">{l.offer}% OFF</span>
          </p>
        </section>

        <SpaBooking spa={l} dates={dates} basePath="/luxury" heading="Select Package" cta="Book Tickets" onwards />

        <DetailCard id="overview" title="About The Event">
          <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{l.about}</p>
        </DetailCard>

        <DetailCard id="things" title="Things To Know">
          <div className="mt-3 space-y-3">
            {l.things.map((t) => (
              <p key={t} className="text-[14px] leading-relaxed text-ink-600">{t}</p>
            ))}
          </div>
        </DetailCard>

        <section className="card p-4 sm:p-5">
          <h2 className="text-lg font-bold text-ink-900">Explore the Gallery</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {l.gallery.map((g, i) => (
              <li key={`${g}-${i}`} className="relative aspect-[5/6] overflow-hidden rounded-xl">
                <Image src={image(g)} alt="" fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-cover" />
                {i === l.gallery.length - 1 && l.moreGallery > 0 && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[12px] font-semibold text-white">
                    <Images size={13} />+{l.moreGallery} More
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-4 sm:p-5">
          <h2 className="text-lg font-bold text-ink-900">Organized By</h2>
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#eef2fb] to-[#e4e8f7] p-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-[20px] font-bold text-brand-700">SC</span>
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-action-500">{l.organizer.name}</p>
              <div className="mt-2 grid grid-cols-3 gap-4 text-[12px] text-ink-900">
                <p>
                  <span className="flex items-center gap-1 font-semibold"><Star size={12} className="text-gold" fill="currentColor" strokeWidth={0} />{l.organizer.rating}</span>
                  ({l.organizer.reviews} reviews)
                </p>
                <p><span className="block font-semibold">{l.organizer.hosted}</span>Hosted Event</p>
                <p><span className="block font-semibold">{l.organizer.years}</span>Years Hosting</p>
              </div>
            </div>
          </div>
        </section>

        <ReviewsCard rating={l.rating} reviews={l.reviews} />
      </div>
    </div>
  );
}
