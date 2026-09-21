import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Armchair } from 'lucide-react';
import { CardHead, MemberStrip } from '@/components/offers/OfferBits';

/** One restaurant offer, on the listing and under "similar restaurants". */
export default function RestaurantCard({ restaurant: r }) {
  const href = `/restaurants/${r.id}`;
  return (
    <article className="card p-3 sm:p-4">
      <div className="flex gap-3.5">
        <Link href={href} className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-xl sm:h-[128px] sm:w-[128px]">
          <Image src={r.image} alt={r.name} fill sizes="128px" className="object-cover" />
        </Link>
        <CardHead
          name={r.name}
          place={r.place}
          rating={r.rating}
          reviews={r.reviews}
          menu={{
            item: { href, name: r.name, place: r.place, image: r.image },
            similar: { href: '/restaurants', label: 'Similar restaurants' },
          }}
        >
          <MemberStrip percent={r.offer} className="mt-2" />
        </CardHead>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="flex min-w-0 items-start gap-2 text-[14px] font-medium leading-snug text-ink-900">
          <Armchair size={17} className="mt-0.5 shrink-0 text-ink-600" />
          <span>Bookings available from {r.opensAt}, Today</span>
        </p>
        <Link href={href} className="btn-primary shrink-0 gap-1.5 rounded-lg px-4 py-2.5 text-[14px] normal-case tracking-normal">
          View Offers
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
