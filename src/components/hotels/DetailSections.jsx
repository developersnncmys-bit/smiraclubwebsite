import Link from 'next/link';
import { Check, Crown, Expand, Info, Navigation, ShieldCheck } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import {
  hotelAmenities,
  hotelMemberBenefits,
  hotelReviews,
  villaGuidelines as stayGuidelines,
  villaGuidelinesNote as stayGuidelinesNote,
  villaRules,
} from '@/lib/content';

/**
 * The blocks a hotel page is built from below the fold.
 *
 * The nightly and the hourly hotel pages both carry reviews, location, rules
 * and guidelines drawn identically, so they are defined once here rather than
 * copied into each page and left to drift apart.
 */

export function DetailCard({ title, children, id, className = '' }) {
  return (
    <section id={id} className={`card scroll-mt-24 p-4 sm:p-5 ${className}`}>
      {title && <h2 className="text-lg font-bold text-ink-900">{title}</h2>}
      {children}
    </section>
  );
}

/** Smira Club Member Benefits, the green card under a hotel's name. */
export function MemberBenefitsCard() {
  return (
    <section className="rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green-600">
          <Crown size={20} className="text-gold" fill="currentColor" strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight text-ink-900">{hotelMemberBenefits.title}</p>
          <p className="text-[13px] text-ink-600">{hotelMemberBenefits.note}</p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
        {hotelMemberBenefits.points.map((point) => (
          <li key={point} className="flex items-center gap-2 text-[14px] text-ink-800">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-600 text-white">
              <Check size={13} strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AmenitiesCard({ id = 'amenities' }) {
  return (
    <DetailCard id={id} title="Amenities For Couple">
      <div className="mt-5 grid grid-cols-3 gap-y-7 sm:grid-cols-6">
        {hotelAmenities.map((a) => (
          <div key={a.key} className="flex flex-col items-center gap-2 px-1 text-center">
            <Icon name={a.icon} size={26} className="text-action-500" strokeWidth={1.7} />
            <span className="text-[13px] font-semibold leading-tight text-action-500">{a.label}</span>
          </div>
        ))}
      </div>
      <button type="button" className="mt-6 text-[14px] font-bold text-ink-900 underline">
        See all Amenities
      </button>
    </DetailCard>
  );
}

export function ReviewsCard({ rating, reviews, href, id = 'reviews' }) {
  return (
    <DetailCard id={id} title="Review &amp; Ratings">
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2">
          <span className="rounded-md bg-action-500 px-2.5 py-1 text-[14px] font-bold text-white">
            {rating}
          </span>
          <span className="text-[14px] text-ink-600">({reviews} reviews)</span>
        </p>
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-700">
          <ShieldCheck size={17} className="text-action-500" />
          Verified Reviews
        </p>
      </div>

      <div className="rail mt-4 lg:grid lg:grid-cols-2 lg:gap-5">
        {hotelReviews.map((r) => (
          <article
            key={r.id}
            className="flex w-[85%] flex-col rounded-xl border border-action-500/40 p-4 sm:w-[20rem] lg:w-auto"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-action-500 px-2.5 py-1 text-[13px] font-bold text-action-500">
                {r.score.toFixed(1)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-bold text-ink-900">{r.name}</span>
                <span className="block text-[13px] text-ink-500">{r.kind}</span>
              </span>
            </div>
            <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-700">{r.body}</p>
            <p className="mt-4 text-[13px] text-ink-500">{r.date}</p>
          </article>
        ))}
      </div>

      {href && (
        <Link href={href} className="mt-4 inline-block text-[14px] font-bold text-ink-900 underline">
          See all reviews
        </Link>
      )}
    </DetailCard>
  );
}

export function LocationCard({ address, nearby, id = 'location' }) {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <DetailCard id={id} title="Location">
      <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
        <span className="font-semibold text-ink-900">Address:</span> {address}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <a
          href={mapHref}
          target="_blank"
          rel="noreferrer"
          className="flex h-24 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#dfeae2] to-[#c9dcd2] text-[13px] font-semibold text-ink-800 transition hover:brightness-95"
        >
          <Expand size={17} />
          Expand Map
        </a>
        <a
          href={mapHref}
          target="_blank"
          rel="noreferrer"
          className="flex h-24 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#e3e7ee] to-[#cfd7e4] text-[13px] font-semibold text-ink-800 transition hover:brightness-95"
        >
          <Navigation size={17} />
          Street View
        </a>
      </div>

      <h3 className="mt-5 text-[15px] font-bold text-ink-900">What&rsquo;s Nearby</h3>
      <ul className="mt-2 divide-y divide-surface-line">
        {nearby.map((n) => (
          <li key={n.place} className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-[14px] text-ink-700">{n.place}</span>
            <span className="shrink-0 text-[14px] text-ink-500">{n.km}</span>
          </li>
        ))}
      </ul>
    </DetailCard>
  );
}

/** Property Rules & Information, as a list with hollow bullets. */
export function RulesCard({ id }) {
  return (
    <DetailCard id={id} title="Property Rules &amp; Information">
      <ul className="mt-4 space-y-3">
        {villaRules.map((rule) => (
          <li key={rule.title || rule.body} className="flex gap-3">
            <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink-700" />
            <span className="min-w-0">
              {rule.title && <span className="block font-semibold text-ink-900 underline">{rule.title}</span>}
              <span className="block text-[14px] leading-relaxed text-ink-600">{rule.body}</span>
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-4 text-[14px] font-bold text-ink-900 underline">
        View more
      </button>
    </DetailCard>
  );
}

/**
 * Stay Guide Lines. `extra` is one more titled section slotted in after
 * Guest Policy — a free stay uses it for what the benefit does and does not
 * cover.
 */
export function GuidelinesSection({ id = 'guidelines', extra }) {
  const sections = extra
    ? [...stayGuidelines.slice(0, 2), extra, ...stayGuidelines.slice(2)]
    : stayGuidelines;

  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-bold text-ink-900">Stay Guide Lines</h2>
      <div className="card mt-3 space-y-5 p-4 sm:p-5">
        {sections.map((g) => (
          <div key={g.title}>
            <h3 className="font-bold text-ink-900 underline">{g.title}</h3>
            {g.lines.map((line) => (
              <p key={line} className="mt-2 text-[14px] leading-relaxed text-ink-700">
                {line}
              </p>
            ))}
          </div>
        ))}

        <p className="flex gap-2.5 rounded-xl bg-[#e8f2fe] p-3.5 text-[13px] leading-snug text-brand-700">
          <Info size={18} className="mt-0.5 shrink-0 text-action-500" />
          {stayGuidelinesNote}
        </p>
      </div>
    </section>
  );
}
