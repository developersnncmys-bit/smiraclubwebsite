import { Montserrat } from 'next/font/google';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import UpgradeGate from '@/components/membership/UpgradeGate';
import Attribution from '@/components/layout/Attribution';
import AuthPopup from '@/components/auth/AuthPopup';
import InstallPrompt from '@/components/layout/InstallPrompt';
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
  /*
    The Smira "S" as the tab icon, the Android install icon (through the
    manifest) and the iPhone home-screen icon. Without these the browser had
    nothing to install, so "Add to Home screen" was never offered properly.
  */
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  // Opened from an iPhone home screen, it runs full screen like an app.
  appleWebApp: {
    capable: true,
    title: 'Smira',
    statusBarStyle: 'default',
  },
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
        {/* Offer to install the site as an app, once, to anyone who visits. */}
        <InstallPrompt />
      </body>
    </html>
  );
}
