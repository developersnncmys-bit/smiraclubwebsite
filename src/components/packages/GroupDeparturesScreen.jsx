'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock, MapPin, Star, Users } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import CardMenu from '@/components/ui/CardMenu';
import { Segmented } from '@/components/forms/RequestFields';
import { SearchBox } from '@/components/offers/OfferBits';
import { groupHowItWorks, groupRegions } from '@/lib/content';
import { inr, shortDate } from '@/lib/format';

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** One trip: photo, where, how long, the next dates with seats, the price. */
function TripCard({ trip }) {
  const href = `/group-departures/${trip.id}`;
  const open = trip.dates.filter((d) => d.seats > 0);
  const next = open.slice(0, 3);

  return (
    <article className="card overflow-hidden">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden">
        <Image src={trip.image} alt={trip.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold text-brand-700">
          {trip.region === 'international' ? 'International' : 'India'}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur">
          <Clock size={13} />
          {trip.nights + 1}D / {plural(trip.nights, 'Night', 'Nights')}
        </span>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold leading-tight text-ink-900">
              <Link href={href} className="hover:underline">{trip.name}</Link>
            </h3>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-600">
              <MapPin size={14} className="shrink-0" />
              {trip.place}
            </p>
          </div>
          <CardMenu
            item={{ href, name: trip.name, place: trip.place, image: trip.image }}
            similar={{ href: `/group-departures?region=${trip.region}`, label: 'Similar trips' }}
          />
        </div>

        <p className="mt-2 flex items-center gap-3 text-[13px]">
          <span className="flex items-center gap-1">
            <Star size={14} className="text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-bold text-ink-900">{trip.rating}</span>
            <span className="text-ink-500">({trip.reviews})</span>
          </span>
          <span className="flex items-center gap-1 text-ink-600">
            <Users size={14} />
            Group of {trip.groupSize}
          </span>
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-ink-500">
          <CalendarDays size={13} />
          Next departures
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {next.map((d) => (
            <li
              key={d.date}
              className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold ${
                d.seats <= 5 ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-surface-line bg-surface-soft text-ink-700'
              }`}
            >
              {shortDate(d.date)} · {d.seats <= 5 ? `Only ${d.seats} left` : `${d.seats} seats`}
            </li>
          ))}
          {next.length === 0 && <li className="text-[12px] font-semibold text-red-600">All departures sold out</li>}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-surface-line pt-3">
          <div>
            <p className="text-[12px] text-ink-600">Per person from</p>
            <p className="flex items-baseline gap-2">
              <span className="text-[20px] font-extrabold text-ink-900">{inr(trip.price)}</span>
              <span className="text-[13px] text-red-500 line-through">{inr(trip.was)}</span>
            </p>
          </div>
          <Link href={href} className="btn-primary shrink-0 gap-1.5 rounded-lg px-4 py-2.5 text-[14px] normal-case tracking-normal">
            View Trip
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Group Departures: how it works, then the trips, by region and by search.
 * A region can arrive in the address (?region=international) so "Similar
 * trips" on a card lands already filtered.
 */
export default function GroupDeparturesScreen({ trips, initialRegion = 'all' }) {
  const [region, setRegion] = useState(groupRegions.some((r) => r.key === initialRegion) ? initialRegion : 'all');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return trips.filter(
      (t) => (region === 'all' || t.region === region) && (!term || `${t.name} ${t.place}`.toLowerCase().includes(term)),
    );
  }, [trips, region, q]);

  return (
    <div className="pb-10 lg:pb-16">
      {/* -- What it is ---------------------------------------------- */}
      <section className="bg-gradient-to-br from-[#0f3f77] to-[#1c62b0] text-white">
        <div className="shell py-7 lg:py-12">
          <h1 className="text-[22px] font-extrabold leading-tight lg:text-4xl">Group Departures</h1>
          <p className="mt-2 max-w-xl text-[14px] text-white/90 lg:text-lg">
            Travel together on fixed dates — planned itineraries, a tour manager with the group, and member prices.
          </p>
        </div>
      </section>

      {/* -- How it works -------------------------------------------- */}
      <section className="shell -mt-4 lg:-mt-6">
        <div className="card p-4 sm:p-5">
          <h2 className="text-[16px] font-bold text-ink-900 lg:text-lg">How it works</h2>
          <ol className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {groupHowItWorks.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-action-500">
                  <Icon name={s.icon} size={20} />
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-action-500 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-ink-900">{s.title}</span>
                  <span className="block text-[12px] leading-snug text-ink-600">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -- The trips ----------------------------------------------- */}
      <div className="shell space-y-4 pt-6 lg:pt-8">
        <div className="space-y-3 lg:flex lg:items-center lg:gap-4 lg:space-y-0">
          <Segmented options={groupRegions} value={region} onChange={setRegion} label="Region" className="lg:w-[28rem]" />
          <div className="lg:flex-1">
            <SearchBox value={q} onChange={setQ} placeholder="Search trips or destination" label="Search group trips" />
          </div>
        </div>

        <h2 className="pt-2 text-[17px] font-semibold text-ink-900 lg:text-xl">
          {shown.length} {shown.length === 1 ? 'trip' : 'trips'} with upcoming departures
        </h2>

        {shown.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-[14px] text-ink-500">No trips match that yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {shown.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
