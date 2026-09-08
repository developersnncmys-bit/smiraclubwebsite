import Image from 'next/image';
import Link from 'next/link';
import AiSearchBar from '@/components/search/AiSearchBar';
import { aiPrompts, aiRecommendations, aiSearchPlaceholder } from '@/lib/content';
import { image } from '@/lib/images';
import { inr } from '@/lib/format';

export const metadata = {
  title: 'AI Search',
  description: 'Describe the trip you want and Smira Club will find it.',
};

/**
 * AI Search.
 *
 * Two bands, as the design draws it: the ask sits on the tinted one at the
 * top, and what we would suggest anyway sits on white below it. The tint is
 * doing work — it marks off the part of the screen you type into from the
 * part you browse, which is the difference between the two halves of the page.
 *
 * The images resolve on the server, so the screen stays a static render and
 * only the search box itself ships as script.
 */
export default function Page() {
  const prompts = aiPrompts.map((p) => ({ ...p, src: image(p.image) }));

  return (
    <>
      {/* -- The ask -------------------------------------------------------- */}
      <section className="bg-brand-50">
        <div className="shell py-5 sm:py-8 lg:py-12">
          <AiSearchBar placeholder={aiSearchPlaceholder} prompts={prompts} />
        </div>
      </section>

      {/* -- What we would suggest anyway ----------------------------------- */}
      <section className="shell py-7 lg:py-12">
        <div className="mx-auto w-full max-w-2xl lg:max-w-none">
          <h2 className="text-[21px] font-bold text-ink-900 lg:text-2xl">
            AI Recommendations For You
          </h2>
          <p className="mt-1 text-[15px] text-ink-500">Based on your Interest</p>

          <ul className="mt-5 grid grid-cols-2 gap-4 lg:mt-7 lg:grid-cols-4 lg:gap-6">
            {aiRecommendations.map((r) => (
              <li key={r.key} className="card flex flex-col overflow-hidden">
                <span className="relative block aspect-[4/3] w-full">
                  <Image
                    src={image(r.image)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                </span>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[16px] font-bold leading-tight text-ink-900">{r.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-snug text-ink-500">{r.blurb}</p>

                  <p className="mt-4 text-[14px] text-ink-700">
                    From{' '}
                    <span className="text-[17px] font-extrabold text-ink-900">{inr(r.price)}</span>{' '}
                    {r.was > r.price && (
                      <span className="font-semibold text-rose-500 line-through">{inr(r.was)}</span>
                    )}
                    <span className="mt-0.5 block text-ink-700">{r.unit}</span>
                  </p>

                  <Link
                    href={r.href}
                    className="mt-4 block rounded-xl border border-brand-200 py-3 text-center text-[13px] font-bold uppercase tracking-[0.06em] text-action-500 transition hover:bg-brand-50"
                  >
                    View Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
