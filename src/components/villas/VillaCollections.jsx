import Link from 'next/link';
import Image from 'next/image';
import { villaCollections as fallbackCollections } from '@/lib/content';
import { toSrc } from '@/lib/imageSlot';

/**
 * The six ways in. Three across on a phone, all six on one line at desktop.
 *
 * Slots are resolved by whichever server page renders this and handed down,
 * so the tiles work just as well inside the client results screen.
 */
export default function VillaCollections({ collections }) {
  const items = collections?.length ? collections : fallbackCollections;

  return (
    <div className="grid grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-5">
      {items.map((c) => (
        <Link
          key={c.key}
          href={`/villas?collection=${c.key}`}
          className="group relative aspect-square overflow-hidden rounded-2xl"
        >
          <Image
            src={toSrc(c.image)}
            alt=""
            fill
            sizes="(max-width: 1024px) 33vw, 16vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 p-2.5 text-[13px] font-bold leading-tight text-white lg:p-3 lg:text-[15px]">
            {c.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
