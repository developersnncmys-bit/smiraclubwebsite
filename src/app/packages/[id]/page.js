import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BadgeCheck, Calendar, ChevronRight, CircleCheck, Clock, Compass, Crown, MapPin, Users,
} from 'lucide-react';
import DetailGallery from '@/components/villas/DetailGallery';
import DetailTabs from '@/components/villas/DetailTabs';
import {
  packageMemberBenefit, packagePolicies, packageTabs, packages,
} from '@/lib/content';
import { image } from '@/lib/images';
import { inr } from '@/lib/format';

export function generateStaticParams() {
  return packages.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pkg = packages.find((p) => p.id === id);
  return pkg ? { title: pkg.name, description: pkg.about } : { title: 'Package not found' };
}

/**
 * One package.
 *
 * Same bones as the hotel and villa pages — gallery, tabs, sticky price bar —
 * so a member moving between them does not have to relearn the page. What is
 * particular here is the itinerary: a package is bought on the strength of
 * what happens on which day, so that gets the most room.
 */
export default async function Page({ params }) {
  const { id } = await params;

  const pkg = packages.find((p) => p.id === id);
  if (!pkg) notFound();

  const photos = [image(pkg.image), image('villa-hero-luxury'), image('villa-beach')];

  return (
    <div className="pb-28 lg:pb-12">
      <DetailGallery
        photos={photos}
        name={pkg.name}
        rating={pkg.rating}
        reviews={pkg.reviews}
      />

      <div className="shell lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="lg:col-span-8">
          {/* -- What it is and what it costs ------------------- */}
          <section className="py-4">
            <h1 className="flex items-start gap-2 text-2xl font-bold leading-tight text-ink-900">
              {pkg.name}
              {pkg.verified && (
                <BadgeCheck size={22} className="mt-1 shrink-0 text-action-500" aria-label="Verified" />
              )}
            </h1>

            <p className="mt-1 flex items-center gap-1.5 text-[16px] text-ink-600">
              {pkg.place}
              <ChevronRight size={16} className="text-ink-400" />
            </p>

            <p className="mt-3 flex items-center gap-2 text-[15px] text-ink-700">
              <Calendar size={16} className="shrink-0 text-ink-500" />
              {pkg.nights + 1} days/{pkg.nights} Nights
            </p>

            <p className="mt-3 flex flex-wrap items-baseline gap-2">
              <span className="text-[15px] text-ink-700">From</span>
              <span className="text-2xl font-extrabold text-ink-900">{inr(pkg.price)}</span>
              {pkg.was && (
                <span className="text-[15px] font-semibold text-red-500 line-through">
                  {inr(pkg.was)}
                </span>
              )}
            </p>
            <p className="text-[14px] text-ink-500">Per Person before taxes &amp; fees</p>
          </section>

          {/* -- What membership is worth here ------------------ */}
          <section className="rounded-2xl border border-green-600/25 bg-gradient-to-br from-[#f0f9ef] to-[#dff0e4] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-600">
                <Crown size={19} className="text-gold" fill="currentColor" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-bold leading-tight text-ink-900">
                  {packageMemberBenefit.title}
                </p>
                <p className="mt-0.5 text-[15px] text-ink-700">{packageMemberBenefit.body}</p>
                <p className="text-[14px] text-ink-600">{packageMemberBenefit.note}</p>
              </div>
            </div>

            <Link
              href="/membership"
              className="mt-4 flex items-center justify-end gap-2 text-[15px] font-bold text-green-700"
            >
              {packageMemberBenefit.cta}
              <span className="grid h-6 w-6 place-items-center rounded-full bg-green-600 text-white">
                <ChevronRight size={15} />
              </span>
            </Link>
          </section>
        </div>

        {/* -- The price, pinned on a desktop ------------------ */}
        <aside className="hidden lg:col-span-4 lg:mt-4 lg:block lg:sticky lg:top-24">
          <div className="card p-5">
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-extrabold text-ink-900">{inr(pkg.price)}</span>
              {pkg.was && (
                <span className="text-[15px] font-semibold text-red-500 line-through">
                  {inr(pkg.was)}
                </span>
              )}
            </p>
            <p className="text-[13px] text-ink-500">Per Person before taxes &amp; fees</p>

            <Link
              href={`/packages/${pkg.id}/book`}
              className="btn-primary mt-4 w-full rounded-lg py-4 text-[15px] uppercase tracking-wide"
            >
              Book now
            </Link>
          </div>
        </aside>
      </div>

      <DetailTabs tabs={packageTabs} />

      <div className="shell space-y-4 py-4 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:space-y-0">
        <div className="space-y-4 lg:col-span-7">
          {/* -- Overview -------------------------------------- */}
          <section id="overview" className="scroll-mt-24">
            <h2 className="text-lg font-bold text-ink-900">About This Package</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{pkg.about}</p>
            <button type="button" className="mt-2 text-[15px] font-semibold text-action-500">
              Read more
            </button>

            <h3 className="mt-6 text-lg font-bold text-ink-900">Highlights</h3>
            <ul className="mt-3 space-y-2.5">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-[16px] text-ink-800">
                  <CircleCheck size={18} className="shrink-0 text-ink-700" />
                  {h}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-lg font-bold text-ink-900">Package Information</h3>
            <dl className="mt-3 space-y-3">
              {[
                { icon: MapPin, label: 'Destination', value: pkg.place },
                { icon: Calendar, label: 'Duration', value: `${pkg.nights} Nights / ${pkg.nights + 1} Days` },
                { icon: Compass, label: 'Package', value: pkg.info.kind },
                { icon: Clock, label: 'Best Time To Visit', value: pkg.info.bestTime },
                { icon: Users, label: 'Group Size', value: pkg.info.groupSize },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-2.5 text-[15px] text-ink-600">
                    <row.icon size={17} className="shrink-0 text-ink-500" />
                    {row.label}
                  </dt>
                  <dd className="shrink-0 text-[15px] font-semibold text-ink-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* -- Itinerary ------------------------------------- */}
          <section id="itinerary" className="scroll-mt-24 pt-6">
            <h2 className="text-lg font-bold text-ink-900">Itinerary</h2>

            <p className="mt-3 rounded-xl border border-surface-line bg-white px-4 py-3 text-[15px] text-ink-600">
              All time are local time
            </p>

            <ol className="relative mt-4 space-y-4 pl-7">
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-[7px] top-4 w-[2px] bg-action-500/30"
              />

              {pkg.itinerary.map((d) => (
                <li key={d.day} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-7 top-4 grid h-4 w-4 place-items-center rounded-full border-[3px] border-action-500 bg-white"
                  />

                  <article className="card p-4">
                    <p className="text-[16px] font-bold text-action-500">Day {d.day}</p>
                    <h3 className="text-[17px] font-bold text-ink-900">{d.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-600">{d.body}</p>
                    {d.meals && (
                      <p className="mt-3 flex items-center gap-2 text-[14px] text-ink-600">
                        <Calendar size={15} className="shrink-0 text-ink-400" />
                        {d.meals}
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-4 lg:col-span-5">
          {/* -- Inclusions ------------------------------------ */}
          <section id="inclusions" className="scroll-mt-24">
            <h2 className="text-lg font-bold text-ink-900">Inclusions</h2>
            <ul className="mt-3 space-y-2.5">
              {pkg.inclusions.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-[16px] text-ink-800">
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-action-500" />
                  {i}
                </li>
              ))}
            </ul>
          </section>

          {/* -- Policies -------------------------------------- */}
          <section id="policies" className="scroll-mt-24 pt-6">
            <h2 className="text-lg font-bold text-ink-900">Policies</h2>

            <div className="mt-3 space-y-5">
              {packagePolicies.map((p) => (
                <div key={p.title}>
                  <h3 className="text-[16px] font-bold text-ink-900 underline">{p.title}</h3>
                  {p.lines.map((line) => (
                    <p key={line} className="mt-1.5 text-[15px] leading-relaxed text-ink-600">
                      {line}
                    </p>
                  ))}
                </div>
              ))}

              <div>
                <h3 className="text-[16px] font-bold text-ink-900">Terms &amp; Conditions</h3>
                <Link
                  href="/more/terms"
                  className="mt-1.5 inline-block text-[15px] font-semibold text-action-500 underline"
                >
                  Read Terms &amp; Conditions
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* -- What it costs, pinned on a phone ------------------ */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="border-t border-surface-line bg-white shadow-[0_-4px_16px_-8px_rgba(17,24,32,0.18)]">
          <div
            className="flex items-center gap-4 px-4 py-3.5 sm:px-6"
            style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
          >
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl font-extrabold text-ink-900">{inr(pkg.price)}</span>
                {pkg.was && (
                  <span className="text-[15px] font-semibold text-red-500 line-through">
                    {inr(pkg.was)}
                  </span>
                )}
              </p>
              <p className="text-[13px] leading-tight text-ink-500">
                Per Person before taxes &amp; fees
              </p>
            </div>

            <Link
              href={`/packages/${pkg.id}/book`}
              className="btn-primary min-w-[10.5rem] shrink-0 rounded-lg px-8 py-4 text-[15px] uppercase tracking-wide"
            >
              Book now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
