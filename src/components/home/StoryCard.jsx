'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

/**
 * One Watch & Explore card.
 *
 * Pressing play plays the film here, on the card. It used to be inside
 * the link to the story, so the one thing the button looks like it does
 * was the one thing it did not do — it navigated away instead.
 *
 * The rest of the card still opens the story. The photograph is
 * resolved by whoever renders this, because `image()` reads the
 * filesystem and cannot run in the browser.
 */
export default function StoryCard({ story, photo, sizes = '(max-width: 1024px) 50vw, 25vw', aspect = 'aspect-[4/5] lg:aspect-[3/4]' }) {
  const [playing, setPlaying] = useState(false);
  const canPlay = Boolean(story.video && story.videoUrl);

  const art = (
    <div className={`relative ${aspect}`}>
      {playing ? (
        <video
          src={story.videoUrl}
          poster={photo}
          autoPlay
          controls
          playsInline
          onEnded={() => setPlaying(false)}
          className="h-full w-full bg-black object-cover"
        />
      ) : (
        <>
          <Image
            src={photo}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          {story.video && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <button
                type="button"
                aria-label={canPlay ? `Play ${story.title}` : `${story.title} — film coming soon`}
                onClick={(e) => {
                  // Inside a link: without these, play opens the story.
                  e.preventDefault();
                  e.stopPropagation();
                  if (canPlay) setPlaying(true);
                }}
                className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 transition hover:scale-110"
              >
                <Play size={18} className="ml-0.5 fill-current" />
              </button>
              <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-[13px] font-bold leading-tight text-white lg:text-sm">
                {story.title}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );

  const caption = !story.video && (
    <div className="p-3">
      <p className="text-[13px] font-bold leading-tight text-ink-900 lg:text-sm">{story.title}</p>
      <p className="mt-1.5 text-[11px] text-ink-400">{story.author}</p>
    </div>
  );

  // While it is playing, the card stops being a link: a click on the
  // scrubber should not take somebody to another page.
  if (playing) {
    return <div className="overflow-hidden rounded-2xl bg-white shadow-card">{art}</div>;
  }

  return (
    <Link
      href={`/stories/${story.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-card"
    >
      {art}
      {caption}
    </Link>
  );
}
