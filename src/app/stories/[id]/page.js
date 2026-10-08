import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import ScreenBar from '@/components/ui/ScreenBar';
import Section from '@/components/ui/Section';
import { stories } from '@/lib/content';
import { image } from '@/lib/images';
import { deskItems } from '@/lib/desk';
import { inr } from '@/lib/format';

/** The four are known at build time, so each gets its own page. */
export function generateStaticParams() {
  return stories.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const story = stories.find((s) => s.id === id);
  if (!story) return { title: 'Watch and explore' };
  return { title: story.title, description: story.blurb };
}

/**
 * One story.
 *
 * Every card on the home page pointed here and there was no page, so
 * all four were a dead end. There is no journal behind these — what
 * exists is the film or the photograph, who made it, and a place. So
 * the page shows that, and then what the desk can actually sell in
 * that place, which is the reason the story is on the site at all.
 */
export default async function Page({ params }) {
  const { id } = await params;
  const story = stories.find((s) => s.id === id);
  if (!story) notFound();

  // What the desk has there. Empty is fine — the story still stands.
  const [stays, things] = await Promise.all([
    deskItems('Hotels', { destination: story.place, limit: 4 }),
    deskItems('Activities', { destination: story.place, limit: 4 }),
  ]);

  return (
    <>
      <ScreenBar title={story.title} backHref="/stories" />

      <article className="shell py-5 pb-12">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:aspect-[21/9]">
          {story.videoUrl ? (
            <video
              src={story.videoUrl}
              poster={image(story.image)}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <Image
                src={image(story.image)}
                alt=""
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
              {/*
                Marked as a clip, but nobody has supplied the film. The
                still is the truth of what we have; a play button over
                nothing would not be.
              */}
              {story.video && (
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 text-[13px] font-semibold text-white">
                  <Play size={14} className="fill-current" /> Film coming soon
                </span>
              )}
            </>
          )}
        </div>

        <h1 className="mt-5 text-2xl font-extrabold leading-tight text-ink-900 lg:text-3xl">
          {story.title}
        </h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-700">{story.blurb}</p>
        <p className="mt-2 text-[13px] text-ink-400">{story.author}</p>

        {stays.length > 0 && (
          <div className="mt-8">
            <Section title={`Where to stay in ${story.place}`}>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                {stays.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="group block overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lift">
                      <div className="relative aspect-[4/3]">
                        <Image src={item.photo} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <p className="truncate text-[13px] font-bold text-ink-900">{item.name}</p>
                        {item.price > 0 && (
                          <p className="mt-1 text-[13px] text-ink-600">from {inr(item.price)}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )}

        {things.length > 0 && (
          <div className="mt-8">
            <Section title={`Things to do in ${story.place}`}>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                {things.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="group block overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lift">
                      <div className="relative aspect-[4/3]">
                        <Image src={item.photo} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-3">
                        <p className="truncate text-[13px] font-bold text-ink-900">{item.name}</p>
                        {item.price > 0 && (
                          <p className="mt-1 text-[13px] text-ink-600">from {inr(item.price)}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        )}

        {/* Nothing of ours there yet: say so and offer the desk. */}
        {stays.length === 0 && things.length === 0 && (
          <p className="mt-8 rounded-2xl bg-surface-soft px-5 py-4 text-[15px] leading-snug text-ink-700">
            We do not have anything listed in {story.place} just yet. Our desk can still plan it —{' '}
            <Link href="/travel-support" className="font-semibold text-action-500 hover:underline">
              tell us what you have in mind
            </Link>
            .
          </p>
        )}

        <p className="mt-10">
          <Link href="/stories" className="inline-flex items-center gap-2 text-[15px] font-bold text-action-500">
            More to watch and explore <ArrowRight size={17} />
          </Link>
        </p>
      </article>
    </>
  );
}
