import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MessagesSquare, Phone } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { membershipHelp, moreIntro, moreTopics } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'More',
  description:
    'What Smira Club is, how it works, and every policy, benefit and support option in one place.',
};

/** The blue disc each topic sits behind. */
function Disc({ icon }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-700 text-white">
      <Icon name={icon} size={20} strokeWidth={1.9} />
    </span>
  );
}

/** What a topic looks like, whether or not it goes anywhere yet. */
function Topic({ topic }) {
  const inner = (
    <>
      <Disc icon={topic.icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-snug text-ink-900">{topic.label}</span>
        <span className="mt-0.5 block text-[14px] leading-snug text-ink-600">{topic.body}</span>
      </span>
      {topic.href ? (
        <ChevronRight size={20} className="shrink-0 text-ink-500" />
      ) : (
        <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-1 text-[12px] font-semibold text-ink-500">
          Soon
        </span>
      )}
    </>
  );

  const shell = 'card flex items-center gap-4 p-4 sm:p-5';

  return topic.href ? (
    <Link href={topic.href} className={`${shell} transition hover:shadow-lift`}>
      {inner}
    </Link>
  ) : (
    <div className={`${shell} opacity-70`}>{inner}</div>
  );
}

/**
 * More.
 *
 * The catch-all the tab bar points at: what the club is, then every policy,
 * benefit and support route in one list. A topic with no screen yet says
 * "Soon" and is not a link, rather than being left out or leading nowhere.
 */
export default function Page() {
  return (
    <div className="pb-10">
      {/* -- What this is ------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#2f9ee0]">
        <div className="absolute inset-y-0 right-0 w-[58%]">
          <Image
            src={image(moreIntro.image)}
            alt=""
            fill
            sizes="58vw"
            className="object-cover object-left"
          />
        </div>
        <div className="relative shell py-9 lg:py-16">
          <div className="max-w-[13rem] sm:max-w-sm lg:max-w-md">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white lg:text-5xl">
              {moreIntro.title}
            </h1>
            <p className="mt-3 text-[14px] font-semibold leading-snug text-white lg:text-lg">
              {moreIntro.tagline}
            </p>
          </div>
        </div>
      </section>

      <div className="shell">
        <section className="border-b border-surface-line py-6">
          <h2 className="text-xl font-bold text-ink-900">{moreIntro.heading}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{moreIntro.body}</p>
        </section>

        {/* -- Everything else ------------------------------------- */}
        <section className="py-6">
          <h2 className="text-xl font-bold text-ink-900">Browse Topics</h2>

          <div className="mt-4 space-y-3">
            {moreTopics.map((topic) => (
              <Topic key={topic.key} topic={topic} />
            ))}
          </div>
        </section>

        {/* -- Or ask a person ------------------------------------- */}
        <section className="pb-4">
          <h2 className="text-xl font-bold text-ink-900">Need More Help?</h2>

          <div className="mt-4 space-y-3">
            <a
              href={membershipHelp.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="card flex items-center gap-4 p-4 transition hover:shadow-lift sm:p-5"
            >
              <MessagesSquare size={26} className="shrink-0 text-brand-700" />
              <span className="min-w-0">
                <span className="block text-[15px] font-bold text-ink-900">Chat with Us</span>
                <span className="mt-0.5 block text-[14px] text-ink-600">
                  Get instant query assistance.
                </span>
              </span>
            </a>

            <a
              href={`tel:${membershipHelp.phone.replace(/\s/g, '')}`}
              className="card flex items-center gap-4 p-4 transition hover:shadow-lift sm:p-5"
            >
              <Phone size={26} className="shrink-0 text-brand-700" />
              <span className="text-[15px] font-bold text-ink-900">Contact Support</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
