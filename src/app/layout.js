import { Poppins } from 'next/font/google';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import { site } from '@/lib/content';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description:
    'Memberships, free stays, hotels, villas and packages at member prices. One membership, every trip.',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: site.name,
    description: 'Memberships, free stays, hotels, villas and packages at member prices.',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#175074',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      {/* Extensions (ColorZilla, Grammarly and friends) add attributes to the
          body before React hydrates; that mismatch is theirs, not ours. */}
      <body suppressHydrationWarning>
        <Header />
        {/* The bottom bar takes its room back on a phone only. */}
        <main className="pb-nav lg:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
