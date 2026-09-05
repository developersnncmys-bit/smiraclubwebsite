import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * An honest placeholder. These routes exist so every link in the design goes
 * somewhere; the screens themselves are still to be designed.
 */
export default function ComingSoon({ what, backHref = '/', backLabel = 'Back to home' }) {
  return (
    <div className="shell py-16 text-center lg:py-24">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-600">Next up</p>
      <h2 className="mt-3 text-2xl font-extrabold text-ink-900 lg:text-3xl">{what}</h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-500">
        The route is wired and the shell is here. This screen gets built once its design lands.
      </p>
      <Link href={backHref} className="btn-primary mt-6">
        {backLabel}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
