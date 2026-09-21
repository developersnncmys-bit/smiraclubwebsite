import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Gift, Star } from 'lucide-react';
import CardMenu from '@/components/ui/CardMenu';

/**
 * One free stay: the photo, the name, where, the rating, and the strip that
 * says the room is complimentary and food is not. There is no price on the
 * card because there is no room price to show — food is priced per guest on
 * the hotel page, once you have said who is coming.
 */
export default function FreeStayCard({ hotel, href }) {
  return (
    <article className="card">
      <div className="flex gap-3.5 p-3.5 sm:p-4">
        <Link href={href} className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl sm:h-[120px] sm:w-[120px]">
          <Image src={hotel.image} alt={hotel.name} fill sizes="120px" className="object-cover" />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold leading-tight text-ink-900">
              <Link href={href} className="hover:underline">
                {hotel.name}
              </Link>
              {hotel.verified && (
                <span
                  aria-label="Verified property"
                  className="ml-1.5 inline-grid h-3.5 w-3.5 translate-y-0.5 place-items-center rounded-[3px] border-2 border-green-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                </span>
              )}
            </h3>
            <CardMenu
              item={{ href, name: hotel.name, place: hotel.place, image: hotel.image }}
              similar={{ href: `/free-stay/results?destination=${encodeURIComponent(hotel.place.split(',').pop().trim())}`, label: 'Similar properties' }}
            />
          </div>

          <p className="mt-1 flex items-center gap-1 text-[14px] text-ink-700">
            {hotel.place}
            <ChevronRight size={15} className="shrink-0" />
          </p>

          <p className="mt-2 flex items-center gap-1.5 text-[13px]">
            <Star size={15} className="text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-bold text-ink-900">{hotel.rating}</span>
            <span className="text-ink-700">({hotel.reviews} reviews)</span>
          </p>
        </div>
      </div>

      <div className="mx-2.5 mb-2.5 flex items-center gap-3 rounded-xl bg-[#f3f6fd] p-3 sm:mx-3 sm:mb-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white">
          <Gift size={18} className="text-action-500" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold leading-tight text-action-500">
            Complimentary stay for members
          </span>
          <span className="mt-0.5 block text-[13px] text-ink-700">Pay for food</span>
        </span>
        <Link
          href={href}
          className="btn-primary shrink-0 gap-1.5 rounded-lg px-3.5 py-2.5 text-[13px] normal-case tracking-normal"
        >
          View Details
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
