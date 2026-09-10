import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Check, Sparkles, Star } from 'lucide-react';
import WishlistButton from '@/components/villas/WishlistButton';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';

/** One recommended villa, in the order the design reads it. */
export default function VillaCard({ villa, query }) {
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full shrink-0">
        <Image
          src={toSrc(villa.image)}
          alt={villa.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />

        <WishlistButton label={villa.name} />

        {villa.badge && (
          <span className="absolute bottom-3 left-0 rounded-r-md bg-[#3f8fd0] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
            {villa.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[14px] text-ink-500">
          <Star size={16} className="text-gold" fill="currentColor" strokeWidth={0} />
          <span className="font-bold text-ink-900">{villa.rating}</span>
          <span>({villa.reviews} reviews)</span>
        </p>

        <h3 className="mt-1 flex items-center gap-1.5 text-xl font-bold text-ink-900">
          {villa.name}
          {villa.verified && (
            <BadgeCheck
              size={19}
              className="shrink-0 text-action-500"
              aria-label="Verified property"
            />
          )}
        </h3>

        <p className="text-[15px] text-ink-500">{villa.place}</p>

        <p className="mt-3 border-l-[3px] border-action-500 pl-3 text-[15px] font-semibold text-ink-900">
          {villa.layout}
        </p>

        <ul className="mt-3 space-y-1.5">
          {villa.notes.map((note) => (
            <li key={note} className="flex gap-2 text-[14px] text-ink-600">
              <span aria-hidden="true" className="text-ink-400">
                &bull;
              </span>
              {note}
            </li>
          ))}
          {villa.freeCancellation && (
            <li className="flex items-center gap-2 text-[14px] font-medium text-green-600">
              <Check size={16} strokeWidth={2.6} />
              Free Cancellation Available
            </li>
          )}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-[15px] text-ink-700">From</span>
              <span className="text-xl font-extrabold text-ink-900">{inr(villa.price)}</span>
              <span className="text-[15px] font-semibold text-red-500 line-through">
                {inr(villa.was)}
              </span>
            </p>
            <p className="mt-0.5 text-[13px] text-ink-500">
              +{villa.taxes.toLocaleString('en-IN')} taxes &amp; fees per night
            </p>
          </div>

          <Link
            href={query ? `/villas/${villa.id}?${query}` : `/villas/${villa.id}`}
            className="btn-primary shrink-0 px-5 py-3"
          >
            Select Villa
            <ArrowRight size={17} />
          </Link>
        </div>

        {villa.highlight && (
          <p className="mt-4 flex gap-2.5 rounded-xl bg-[#e8f2fe] p-3.5 text-[14px] font-medium leading-snug text-brand-700">
            <Sparkles size={18} className="mt-0.5 shrink-0 text-action-500" />
            {villa.highlight}
          </p>
        )}
      </div>
    </article>
  );
}
