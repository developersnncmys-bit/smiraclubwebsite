import Link from 'next/link';
import Section from '@/components/ui/Section';
import { recentSearches } from '@/lib/content';

/** What they looked at last — a rail on a phone, a row on a desktop. */
export default function RecentSearches() {
  return (
    <div className="shell">
      <Section title="Recent Searches">
        <div className="rail lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
          {recentSearches.map((search) => (
            <Link
              key={search.id}
              href={`/search?destination=${encodeURIComponent(search.place)}`}
              className="w-[11.5rem] rounded-2xl border border-surface-line bg-white p-4 transition hover:border-brand-300 hover:shadow-card lg:w-auto"
            >
              <p className="text-sm font-bold text-brand-600">{search.kind}</p>
              <p className="mt-1 text-lg font-bold text-ink-900">{search.place}</p>
              <p className="mt-2 text-xs text-ink-500">{search.guests}</p>
              <p className="text-xs text-ink-500">{search.dates}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
