import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MoreVertical, Star } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';

/** The promo strip's two colourways, as the design uses them. */
const TONES = {
  blue: 'bg-[#eef4fe] text-action-500',
  violet: 'bg-[#f1eefe] text-[#6d4bd8]',
};

/**
 * One result, whatever kind it is.
 *
 * A hotel, a package and a villa all read the same way here — photo, name,
 * where or how long, rating, a couple of amenities — and only the promo
 * strip and the price note change. That is what lets one search return all
 * four kinds without the list turning into four different lists.
 */
export default function ResultCard({ item }) {
  return (
    <article className="card overflow-hidden">
      <div className="flex gap-3.5 p-3.5 sm:p-4">
        <span className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl sm:h-[124px] sm:w-[124px]">
          <Image
            src={toSrc(item.image)}
            alt=""
            fill
            sizes="124px"
            className="object-cover"
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold leading-tight text-ink-900">
              {item.name}
              {item.verified && (
                <span
                  aria-label="Verified property"
                  className="ml-1.5 inline-block h-3.5 w-3.5 translate-y-0.5 rounded-[3px] border-2 border-green-600 bg-green-600/20"
                />
              )}
            </h3>

            <button
              type="button"
              aria-label={`More about ${item.name}`}
              className="-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-surface-soft"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <p className="mt-1 text-[14px] text-ink-600">{item.place}</p>

          <p className="mt-1.5 flex items-center gap-1.5 text-[13px]">
            <Star size={15} className="text-gold" fill="currentColor" strokeWidth={0} />
            <span className="font-bold text-ink-900">{item.rating}</span>
            <span className="text-ink-500">({item.reviews} reviews)</span>
          </p>

          <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {item.amenities.map((a) => (
              <li key={a.label} className="flex items-center gap-1.5 text-[13px] text-ink-700">
                <Icon name={a.icon} size={16} className="text-ink-600" strokeWidth={1.8} />
                {a.label}
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
            <span className="block text-[14px] font-bold leading-tight">{item.promo.title}</span>
            <span className="block text-[13px] text-ink-600">{item.promo.note}</span>
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3 p-3.5 sm:p-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="text-[14px] text-ink-700">{item.priceLabel}</span>
            <span className="text-xl font-extrabold text-ink-900">{inr(item.price)}</span>
            {item.was && (
              <span className="text-[14px] font-semibold text-red-500 line-through">
                {inr(item.was)}
              </span>
            )}
          </p>
          <p className="mt-0.5 text-[13px] text-ink-500">{item.priceNote}</p>
        </div>

        <Link href={item.href} className="btn-primary shrink-0 px-5 py-3">
          View Details
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
