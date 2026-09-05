import { site } from '@/lib/content';

/** The sign-off the design ends the scroll on. */
export default function ClosingLine() {
  return (
    <section className="py-12 lg:py-20">
      <div className="shell">
        <p className="text-[15px] text-ink-500 lg:text-lg">Your next adventure starts with</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-900 lg:text-5xl">{site.name}</p>
      </div>
    </section>
  );
}
