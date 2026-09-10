import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Star } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { toSrc } from '@/lib/imageSlot';
import { inr } from '@/lib/format';

/** One of the packages suggested at the foot of a hotel's page. */
export default function PackageCard({ item }) {
  return (
    <article className="card overflow-hidden">
      <div className="flex gap-3.5 p-3.5 sm:p-4">
        <span className="relative h-[124px] w-[110px] shrink-0 overflow-hidden rounded-xl">
          <Image src={toSrc(item.image)} alt="" fill sizes="110px" className="object-cover" />
          <span className="absolute left-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-700 backdrop-blur">
            <Heart size={16} />
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-md bg-[#fdeee4] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#d1541b]">
            Package
          </span>

          <h3 className="mt-2 text-[17px] font-bold leading-tight text-ink-900">{item.name}</h3>
          <p className="mt-1 text-[15px] text-ink-600">{item.duration}</p>

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

      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fdf7f3] p-3.5 sm:p-4">
        <div className="min-w-0">
          <p className="text-[15px] text-ink-700">Starting From</p>
          <p className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-[#d1541b]">{inr(item.price)}</span>
            <span className="text-[14px] text-ink-600">{item.unit}</span>
          </p>
        </div>

        <Link href={`/packages/${item.id}`} className="btn-primary shrink-0 px-5 py-3">
          View Details
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
