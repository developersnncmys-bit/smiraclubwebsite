import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Tag } from 'lucide-react';
import { inr } from '@/lib/format';

/**
 * What the desk has added, on a screen that ships with its own list.
 *
 * It renders nothing at all when the desk has nothing in that category, so a
 * screen looks exactly as it did before until somebody puts stock into the
 * panel — and the moment they do, it is on the site.
 */
export default function DeskPicks({ items, title = 'New from Smira', note }) {
  if (!items?.length) return null;

  return (
    <section className="shell py-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-bold text-ink-900 lg:text-xl">{title}</h2>
        {note && <p className="text-[13px] text-ink-500">{note}</p>}
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="card flex h-full flex-col overflow-hidden transition hover:shadow-lift"
            >
              <span className="relative block aspect-[16/10] w-full">
                <Image
                  src={item.photo}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  className="object-cover"
                />
                {item.off > 0 && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-[12px] font-bold text-white">
                    <Tag size={12} /> {item.off}% off for members
                  </span>
                )}
              </span>

              <span className="flex min-w-0 flex-1 flex-col p-4">
                <span className="block truncate text-[15px] font-bold text-ink-900">{item.name}</span>
                {item.place && (
                  <span className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-500">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{item.place}</span>
                  </span>
                )}
                {item.description && (
                  <span className="mt-2 line-clamp-2 text-[13px] leading-snug text-ink-600">
                    {item.description}
                  </span>
                )}

                <span className="mt-auto flex items-end justify-between gap-3 pt-3">
                  <span className="min-w-0">
                    {item.price > 0 ? (
                      <>
                        <span className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-ink-900">{inr(item.price)}</span>
                          {item.was > 0 && (
                            <span className="text-[13px] font-semibold text-red-500 line-through">
                              {inr(item.was)}
                            </span>
                          )}
                        </span>
                        <span className="block text-[12px] text-ink-500">Member price</span>
                      </>
                    ) : (
                      <span className="text-[13px] font-semibold text-ink-700">Ask the desk</span>
                    )}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-action-500">
                    View <ArrowRight size={14} />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
