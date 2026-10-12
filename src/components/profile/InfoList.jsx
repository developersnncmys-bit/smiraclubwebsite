import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';

/** One grouped list of account rows — icon, label, chevron. */
export default function InfoList({ items }) {
  return (
    <ul className="card divide-y divide-surface-line overflow-hidden">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="flex items-center gap-4 px-4 py-4 transition hover:bg-surface-soft sm:px-5 lg:gap-3 lg:px-4 lg:py-2.5"
          >
            <Icon
              name={item.icon}
              size={20}
              strokeWidth={1.9}
              className="shrink-0 text-ink-700 lg:h-[17px] lg:w-[17px]"
            />
            <span className="flex-1 text-[15px] font-semibold text-ink-900 lg:text-[13.5px]">{item.label}</span>
            <ChevronRight size={18} className="shrink-0 text-ink-400 lg:h-4 lg:w-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
