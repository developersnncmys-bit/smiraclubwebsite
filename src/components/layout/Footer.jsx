import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { footerColumns, site } from '@/lib/content';

/**
 * The footer, on every screen.
 *
 * It used to be hidden below a desktop, on the grounds that a phone has
 * the same links under More. But the foot of a page is where people look
 * for a telephone number, the terms and the year — and More is a tab
 * most of them never open. It is the same footer on a phone, two
 * columns wide instead of four, with the desk's number first because
 * that is what it is asked for most.
 */
export default function Footer() {
  return (
    <footer className="mt-10 border-t border-surface-line bg-white lg:mt-16">
      <div className="shell py-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-4 lg:gap-10">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-500 lg:mt-4 lg:text-sm">
              {site.tagline}. Memberships, stays and trips at prices the desk keeps for members.
            </p>

            {/* The two ways to reach a person, said plainly. They are
                why most people scroll this far. */}
            <div className="mt-4 flex flex-wrap gap-2 lg:mt-5">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-3.5 py-2 text-[13px] font-bold text-[#128C4B] transition hover:bg-[#25D366]/20"
              >
                <MessageCircle size={15} />
                WhatsApp us
              </a>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-2 text-[13px] font-bold text-brand-700 transition hover:bg-brand-100"
              >
                <Phone size={15} />
                {site.phoneLabel}
              </a>
            </div>
          </div>

          {/* Two columns on a phone, so three lists do not become one
              long ladder of links. */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 lg:col-span-3 lg:grid-cols-3 lg:gap-10">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-bold text-ink-900 lg:text-sm">{column.title}</h3>
                <ul className="mt-3 space-y-2 lg:mt-4 lg:space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ink-500 transition hover:text-brand-700 lg:text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-surface-line pt-5 lg:mt-12 lg:flex-row lg:items-center lg:justify-between lg:pt-6">
          <p className="order-2 text-[11px] text-ink-400 lg:order-1 lg:text-xs">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="order-1 flex gap-5 text-[11px] text-ink-400 lg:order-2 lg:text-xs">
            <Link href="/more/terms" className="hover:text-ink-700">Terms</Link>
            <Link href="/more/privacy" className="hover:text-ink-700">Privacy</Link>
            <Link href="/more/contact" className="hover:text-ink-700">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
