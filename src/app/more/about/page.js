import Link from 'next/link';
import ScreenBar from '@/components/ui/ScreenBar';
import { services, site } from '@/lib/content';

export const metadata = {
  title: 'About Smira Club',
  description:
    'What Smira Club is: a membership that puts the desk’s own rates in front of members, across stays, trips and the things to do when you get there.',
};

/**
 * About Smira Club.
 *
 * The footer has linked here from the start and the page did not exist.
 * What it says is drawn from what the site actually does — the services
 * list is the site's own, so this page cannot drift from the menu.
 */
export default function Page() {
  return (
    <>
      <ScreenBar title="About us" backHref="/more" />

      <div className="shell py-6 lg:py-10">
        <h1 className="text-2xl font-bold text-ink-900 lg:text-3xl">About {site.name}</h1>
        <p className="mt-1 text-[14px] font-semibold text-action-500">{site.tagline}</p>

        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-700">
          <p>
            Smira Club is a membership. Members get the rates our travel desk
            holds with the hotels, villas, resorts and operators it works
            with — the prices an agency negotiates and does not usually pass
            on.
          </p>
          <p>
            It covers the whole trip rather than one part of it: somewhere to
            stay, a way to get there, and the things worth doing once you
            arrive. A member books through the desk, and a person at that desk
            is answerable for the booking from the moment it is made.
          </p>
          <p>
            Our partners are properties and operators the desk has signed and
            checked. A listing on this site is a place we have a relationship
            with, not a feed somebody bought.
          </p>
        </div>

        <h2 className="mt-8 text-lg font-bold text-ink-900">What a membership covers</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.key}>
              <Link
                href={s.href}
                className="card flex items-center gap-3 p-3.5 text-[14px] font-semibold text-ink-800 transition hover:border-action-500/40"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/membership" className="btn-primary">
            See the plans
          </Link>
          <Link href="/more/contact" className="btn-quiet">
            Talk to the desk
          </Link>
        </div>
      </div>
    </>
  );
}
