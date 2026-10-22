import Link from 'next/link';
import Icon from '@/components/ui/Icon';

/**
 * A row of four things the member can open.
 *
 * These were eighteen full-width rows with a chevron on each, which is
 * a scroll of a page and a half to find Saved Payments. Four across
 * reads at a glance and fits the screen, and it is how the rest of the
 * site already draws a set of destinations.
 */
export default function Tiles({ items }) {
  return (
    <ul className="grid grid-cols-4 gap-2 lg:gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="flex h-full flex-col items-center gap-1.5 rounded-xl border border-surface-line bg-white px-1.5 py-3 text-center transition hover:border-brand-200 hover:bg-surface-soft active:scale-[0.98] lg:gap-2 lg:px-2 lg:py-3.5"
          >
            <Icon
              name={item.icon}
              size={20}
              strokeWidth={1.9}
              className="h-[19px] w-[19px] shrink-0 text-brand-700 lg:h-5 lg:w-5"
            />
            <span className="text-[10.5px] font-semibold leading-tight text-ink-700 lg:text-[11.5px]">
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
