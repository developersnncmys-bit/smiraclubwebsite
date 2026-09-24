import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BedDouble, Check, Clock, MapPin, Tag } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import DeskBooking from '@/components/desk/DeskBooking';
import NeedHelp from '@/components/ui/NeedHelp';
import { deskItem } from '@/lib/desk';
import { inr } from '@/lib/format';

/**
 * One thing the desk sells, whatever kind of thing it is.
 *
 * A hotel, a villa, a spa and a package all come off the same sheet in the
 * panel, and none of them has the hand-written detail the bundled screens
 * have. So rather than nine near-identical templates this is one page that
 * shows whatever the desk filled in and leaves out whatever it did not.
 */

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await deskItem(id);
  return item
    ? { title: item.name, description: item.description || `${item.name} at member prices.` }
    : { title: 'Not found' };
}

export default async function Page({ params }) {
  const { id } = await params;
  const item = await deskItem(id);
  if (!item) notFound();

  const photos = item.photos?.length ? item.photos : [item.photo];

  return (
    <div className="pb-10">
      <ScreenBar title={item.name} backHref="/" />

      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <Image src={photos[0]} alt={item.name} fill sizes="100vw" priority className="object-cover" />
      </div>

      <div className="shell space-y-4 py-4">
        <section>
          <p className="text-[13px] font-semibold uppercase tracking-wide text-action-500">{item.category}</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight text-ink-900">{item.name}</h1>
          {item.place && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-ink-600">
              <MapPin size={16} className="shrink-0 text-ink-500" />
              {item.place}
            </p>
          )}

          {item.price > 0 && (
            <p className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-[14px] text-ink-700">From</span>
              <span className="text-xl font-extrabold text-ink-900">{inr(item.price)}</span>
              {item.was > 0 && (
                <span className="text-[14px] font-semibold text-red-500 line-through">{inr(item.was)}</span>
              )}
              <span className="text-[14px] text-ink-700">for members</span>
            </p>
          )}

          {item.off > 0 && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-green-600/25 bg-[#f0f9ef] px-3.5 py-2 text-[13px] font-bold text-green-700">
              <Tag size={15} /> {item.off}% off the regular rate, for Smira Club members
            </p>
          )}

          {item.description && (
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink-700">{item.description}</p>
          )}
        </section>

        {(item.checkIn || item.checkOut) && (
          <section className="card flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-[14px] sm:p-5">
            <Clock size={17} className="shrink-0 text-action-500" />
            {item.checkIn && (
              <span className="text-ink-700">
                Check in <span className="font-semibold text-ink-900">{item.checkIn}</span>
              </span>
            )}
            {item.checkOut && (
              <span className="text-ink-700">
                Check out <span className="font-semibold text-ink-900">{item.checkOut}</span>
              </span>
            )}
          </section>
        )}

        {item.amenities?.length > 0 && (
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">What you get</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {item.amenities.map((a) => (
                <li key={a} className="flex items-start gap-2 text-[14px] text-ink-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {item.rooms?.length > 0 && (
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Rooms</h2>
            <ul className="mt-3 divide-y divide-surface-line">
              {item.rooms.map((room, i) => (
                <li key={`${room.type}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-[15px] font-bold text-ink-900">
                      <BedDouble size={16} className="shrink-0 text-ink-500" />
                      {room.type || 'Room'}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-ink-500">
                      {[room.mealPlan, room.occupancy ? `Sleeps ${room.occupancy}` : null, room.extraBed ? 'Extra bed available' : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                  {room.price > 0 && (
                    <span className="flex items-baseline gap-2">
                      <span className="text-[15px] font-extrabold text-ink-900">{inr(room.price)}</span>
                      {room.was > room.price && (
                        <span className="text-[13px] font-semibold text-red-500 line-through">{inr(room.was)}</span>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {photos.length > 1 && (
          <section>
            <h2 className="text-lg font-bold text-ink-900">Photos</h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {photos.slice(1).map((src) => (
                <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={src} alt={item.name} fill sizes="(min-width: 1024px) 30vw, 45vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {item.address && (
          <section className="card p-4 sm:p-5">
            <h2 className="text-lg font-bold text-ink-900">Where it is</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-700">{item.address}</p>
          </section>
        )}

        <DeskBooking item={item} />

        <NeedHelp />
      </div>
    </div>
  );
}
