'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';
import { searchTabs } from '@/lib/content';
import { publishSearch } from '@/lib/headerSearch';
import { defaultStay } from '@/lib/format';

/**
 * The four tabs, and nothing else.
 *
 * The form used to sit under them — destination, dates, guests and a
 * button — and it is in the header now, a tap away from anywhere on the
 * page rather than only from the top of it. Two of them would be the
 * same question asked twice, so this keeps the tabs and hands the
 * header the rest.
 *
 * The tabs are links, not a filter: each opens that category's own
 * screen, the way the prototype moves between them. `active` is which
 * of the four is lit, and the kind the header searches under.
 */
export default function SearchPanel({ active = searchTabs[0].key, art = {} }) {
  const stay = defaultStay();
  const kind = active;

  /*
   * Tell the header there is a search to be made here, and what it
   * starts from. Without this the header shows no icon at all — which
   * is right on a page with nothing to search, and wrong on this one.
   */
  const from = stay.from.toISOString().slice(0, 10);
  const to = stay.to.toISOString().slice(0, 10);
  useEffect(() => {
    publishSearch({
      kind,
      destination: '',
      from,
      to,
      adults: 2,
      rooms: 1,
      childAges: [],
      guests: '2 Adults/ 1 Room',
    });
    return () => publishSearch(null);
  }, [kind, from, to]);

  return (
    <div id="home-search" className="shell scroll-mt-20 pt-3 lg:pt-0">
      <div className="lg:card lg:relative lg:z-10 lg:-mt-20 lg:p-7">
        <nav
          aria-label="What are you looking for"
          className="grid grid-cols-4 overflow-hidden rounded-2xl bg-surface-soft lg:inline-flex lg:gap-1 lg:rounded-xl lg:bg-transparent lg:p-0"
        >
          {searchTabs.map((t) => {
            const on = t.key === kind;
            return (
              <Link
                key={t.key}
                href={t.href}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 px-2 py-2 text-[12px] font-semibold transition lg:flex-row lg:gap-2 lg:rounded-lg lg:px-4 lg:py-2.5 lg:text-sm ${
                  on
                    ? 'bg-white text-ink-900 shadow-card lg:bg-brand-50 lg:text-brand-700 lg:shadow-none'
                    : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {art[t.key] ? (
                  <Image
                    src={art[t.key]}
                    alt=""
                    width={44}
                    height={44}
                    className="h-9 w-9 object-contain lg:h-11 lg:w-11"
                  />
                ) : (
                  <Icon
                    name={t.icon}
                    size={22}
                    className={on ? 'text-brand-600' : 'text-ink-500'}
                    strokeWidth={1.7}
                  />
                )}
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
