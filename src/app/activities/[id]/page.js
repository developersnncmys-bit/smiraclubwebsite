import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronDown, ChevronRight, Crown, Images, Sparkle, Star } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import BookTickets from '@/components/offers/BookTickets';
import { DetailCard, ReviewsCard } from '@/components/hotels/DetailSections';
import { activities, activityDates, activityFrom } from '@/lib/content';
import { image } from '@/lib/images';
import { clock, shortDate } from '@/lib/format';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const a = activities.find((x) => x.id === id);
  return { title: a ? a.name : 'Activity not found' };
}

const TABS = [
  { key: 'offers', label: 'Offers' },
  { key: 'overview', label: 'Overview' },
  { key: 'facilities', label: 'Facilities' },
  { key: 'reviews', label: 'Review' },
];

/** A camp or an adventure: the event page, with Book Tickets pinned below. */
export default async function Page({ params, searchParams }) {
  const { id } = await params;
  // Read so the page renders per request: its dates run from tomorrow.
  await searchParams;
  const a = activities.find((x) => x.id === id);
  if (!a) notFound();

  const photos = [image(a.image), ...a.gallery.slice(0, 2).map((g) => image(g))];
  const dates = activityDates(a);
  const first = dates[0];
  const firstSlot = a.sessions.slots[0];
  const from = activityFrom(a);

  return (
    <div className="pb-28 lg:pb-16">
      <DetailGallery photos={photos} name={a.name} rating={a.rating} reviews={a.reviews} />

      <div className="shell grid grid-cols-1 gap-4 py-4 lg:grid-cols-12 lg:gap-x-8 lg:py-8">
        <section className="min-w-0 lg:col-span-8">
          <p className="flex items-center gap-1.5 text-[14px] font-medium text-[#6d4bd8]">
            <Sparkle size={15} fill="currentColor" strokeWidth={0} />
            {a.tag}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-ink-900">{a.name}</h1>
          <p className="mt-1 inline-flex items-center gap-1 text-[14px] text-ink-700">
            {a.subtitle}
            <ChevronRight size={15} />
          </p>
          <p className="mt-2 flex items-center gap-1 text-[14px]">
            <span className="font-semibold text-action-500">Starts</span>
            <span className="text-ink-900">&middot; {shortDate(first)}, {clock(firstSlot).replace(/^(\d+) /, '$1:00 ')}</span>
            <ChevronDown size={15} className="text-ink-700" />
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

        <aside className="hidden lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:block lg:self-start lg:sticky lg:top-32">
          <div className="card p-5">
            <p className="text-[16px] font-bold text-ink-900">{a.name}</p>
            <p className="mt-1 text-[13px] text-ink-600">Booking Available from {shortDate(first)}, {clock(firstSlot)}</p>
            <div className="mt-4">
              <BookTickets activity={a} dates={dates} from={from} />
            </div>
          </div>
        </aside>
      </div>

      <DetailTabs tabs={TABS} />

      <div className="shell grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 space-y-4 py-4 lg:col-span-8 lg:py-8">
          <section id="offers" className="card flex scroll-mt-32 items-center justify-between gap-4 overflow-hidden pl-4">
            <p className="py-5 text-[15px] font-semibold text-ink-900">
              Booking Available
              <br />
              from {shortDate(first)}, {clock(firstSlot)}
            </p>
            <p className="self-start rounded-bl-2xl bg-brand-700 px-4 py-2 text-center text-white">
              <span className="block text-[13px] font-semibold">Get Up To</span>
              <span className="block text-[20px] font-extrabold italic leading-tight">{a.offer}% OFF</span>
            </p>
          </section>

          <DetailCard id="overview" title="About The Event">
            <p className="mt-2 line-clamp-4 text-[14px] leading-relaxed text-ink-600">{a.about}</p>
          </DetailCard>

          <DetailCard title="Things To Know">
            <ul className="mt-3 space-y-1">
              {a.things.map((t) => (
                <li key={t} className="flex gap-2 text-[14px] text-ink-600">
                  <span aria-hidden="true">&bull;</span>
                  {t}
                </li>
              ))}
            </ul>
          </DetailCard>

          <DetailCard id="facilities" title="Facilities">
            <ul className="mt-5 grid grid-cols-4 gap-y-6">
              {a.facilities.map((f) => (
                <li key={f.label} className="flex flex-col items-center gap-1.5 px-1 text-center">
                  <Icon name={f.icon} size={24} className="text-action-500" strokeWidth={1.7} />
                  <span className="text-[12px] font-medium leading-tight text-ink-900">{f.label}</span>
                </li>
              ))}
            </ul>
          </DetailCard>

          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Explore the Gallery</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {a.gallery.map((g, i) => (
                <li key={g} className="relative aspect-[5/4] overflow-hidden rounded-xl">
                  <Image src={image(g)} alt="" fill sizes="(min-width: 1024px) 18vw, 45vw" className="object-cover" />
                  {i === a.gallery.length - 1 && a.moreGallery > 0 && (
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[12px] font-semibold text-white">
                      <Images size={13} />+{a.moreGallery} More
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Organized By</h2>
            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#eef2fb] to-[#e4e8f7] p-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-[20px] font-bold text-brand-700">
                {a.organizer.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold text-action-500">{a.organizer.name}</p>
                <div className="mt-2 grid grid-cols-3 gap-4 text-[12px] text-ink-900">
                  <p>
                    <span className="flex items-center gap-1 font-semibold"><Star size={12} className="text-gold" fill="currentColor" strokeWidth={0} />{a.organizer.rating}</span>
                    ({a.organizer.reviews} reviews)
                  </p>
                  <p><span className="block font-semibold">{a.organizer.hosted}</span>Hosted Event</p>
                  <p><span className="block font-semibold">{a.organizer.years}</span>Years Hosting</p>
                </div>
              </div>
            </div>
          </section>

          <ReviewsCard rating={a.rating} reviews={a.reviews} />
        </div>
      </div>

      <div className="lg:hidden">
        <BookTickets activity={a} dates={dates} from={from} />
      </div>
    </div>
  );
}
