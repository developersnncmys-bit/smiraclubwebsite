import Image from 'next/image';
import { site } from '@/lib/content';
import { image } from '@/lib/images';

/** The sign-off the design ends the scroll on. */
export default function ClosingLine() {
  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      <div className="shell relative">
        <p className="text-[15px] text-ink-500 lg:text-lg">Your next adventure starts with</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900 lg:text-5xl">
          {site.name}
        </p>
      </div>

      {/*
        Decoration, so it carries no alt text and sits behind the words — on a
        phone the line wraps into the space this would otherwise take.
      */}
      <Image
        src={image('closing-reader')}
        alt=""
        width={420}
        height={320}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-auto w-[42%] max-w-[420px] opacity-90 lg:w-[30%]"
      />
    </section>
  );
}
