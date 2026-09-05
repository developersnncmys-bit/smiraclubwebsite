import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * A titled block. The optional link on the right is the "View All →" the
 * design puts beside a few of them.
 */
export default function Section({ title, action, actionHref, children, className = '', id }) {
  return (
    <section id={id} className={`py-6 lg:py-10 ${className}`}>
      {title && (
        <div className="mb-4 flex items-end justify-between gap-4 lg:mb-6">
          <h2 className="section-title">{title}</h2>
          {action && actionHref && (
            <Link
              href={actionHref}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              {action}
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
