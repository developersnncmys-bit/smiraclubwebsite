import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import WishlistButton from '@/components/villas/WishlistButton';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';

/** The promo strip's two colourways. */
const TONES = {
  blue: 'bg-[#eef4fe] text-action-500',
  violet: 'bg-[#f1eefe] text-[#6d4bd8]',
};

/**
 * One package, as both the listing and the results screen draw it.
 *
 * `heart` is off on the fixed-departure rail and on in results, which is the
 * only difference the design makes between the two.
 */
export default function PackageCard({ item, heart = false }) {
  return (
    <article className="card overflow-hidden">
      <div className="flex gap-3.5 p-3.5 sm:p-4">
        <span className="relative h-[132px] w-[110px] shrink-0 overflow-hidden rounded-xl sm:w-[124px]">
          <Image
            src={toSrc(item.image)}
            alt=""
            fill
            sizes="124px"
            className="object-cover"
          />
          {heart && <WishlistButton label={item.name} />}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="flex items-start gap-1.5 text-xl font-bold leading-tight text-ink-900">
            {item.name}
            {item.verified && (
              <BadgeCheck
                size={18}
                className="mt-1 shrink-0 text-action-500"
                aria-label="Verified package"
              />
            )}
          </h3>

          <p className="mt-1 text-[15px] text-ink-500">{item.place}</p>

          <p className="mt-1.5 flex items-center gap-1.5 text-[14px]">
            <Star size={15} className="text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-bold text-ink-900">{item.rating}</span>
            <span className="text-ink-500">({item.reviews} reviews)</span>
          </p>

          <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {item.chips.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5 text-[13px] text-ink-700">
                <Icon name={c.icon} size={15} className="text-ink-600" strokeWidth={1.8} />
                {c.label}
              </li>
            ))}
            {item.more > 0 && (
              <li className="rounded-full bg-surface-soft px-2.5 py-1 text-[12px] font-semibold text-ink-700">
                + {item.more}
              </li>
            )}
          </ul>
        </div>
      </div>

      {item.promo && (
        <div className={`flex items-center gap-3 px-3.5 py-3 sm:px-4 ${TONES[item.promo.tone]}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white">
            <Icon name={item.promo.icon} size={18} strokeWidth={1.9} />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-bold leading-tight">{item.promo.title}</span>
            <span className="block text-[13px] text-ink-600">{item.promo.note}</span>
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3 p-3.5 sm:p-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="text-[15px] text-ink-700">From</span>
            <span className="text-xl font-extrabold text-ink-900">{inr(item.price)}</span>
            {item.was && (
              <span className="text-[15px] font-semibold text-red-500 line-through">
                {inr(item.was)}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[13px] text-ink-500">Per Person before taxes &amp; fees</p>
        </div>

        <Link href={`/packages/${item.id}`} className="btn-primary shrink-0 px-5 py-3">
          See Itinerary
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
