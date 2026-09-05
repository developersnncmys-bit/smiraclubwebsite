import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { footerColumns, site } from '@/lib/content';

/**
 * The desktop footer. A phone gets the same links under More, so this stays
 * out of its way entirely.
 */
export default function Footer() {
  return (
    <footer className="mt-16 hidden border-t border-surface-line bg-white lg:block">
      <div className="shell py-14">
        <div className="grid grid-cols-4 gap-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {site.tagline}. Memberships, stays and trips at prices the desk keeps for members.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold text-ink-900">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-500 transition hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-surface-line pt-6">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-ink-400">
            <Link href="/more/terms" className="hover:text-ink-700">Terms</Link>
            <Link href="/more/privacy" className="hover:text-ink-700">Privacy</Link>
            <Link href="/more/contact" className="hover:text-ink-700">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
