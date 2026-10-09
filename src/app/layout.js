import { Montserrat } from 'next/font/google';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import UpgradeGate from '@/components/membership/UpgradeGate';
import Attribution from '@/components/layout/Attribution';
import AuthPopup from '@/components/auth/AuthPopup';
import { site } from '@/lib/content';
import './globals.css';

const montserrat = Montserrat({
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
    <html lang="en" className={montserrat.variable}>
      {/* Extensions (ColorZilla, Grammarly and friends) add attributes to the
          body before React hydrates; that mismatch is theirs, not ours. */}
      <body suppressHydrationWarning>
        <Header />
        <Attribution />
        <AuthPopup />
        {/* No room is set aside for the tab bar here any more. It was set
            aside on every page, including the ones that hide the tab bar to
            pin their own price bar — so those ended with the height of a bar
            that was not there, under the padding they had already added for
            the one that was. The bar now carries its own space. */}
        <main>{children}</main>
        {/* Says so where a member has opened a service their plan does not cover. */}
        <UpgradeGate />
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
