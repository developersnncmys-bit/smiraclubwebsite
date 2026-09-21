import { SERVICE_ART_VERSION } from './src/lib/assetVersion.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    // Setting localPatterns blocks every local image not listed, so the
    // first line keeps all of them working as before (no query string); the
    // second lets the service icons carry their version, which is what makes
    // a replaced icon show up instead of a saved copy of the old one.
    localPatterns: [
      { pathname: '/**', search: '' },
      { pathname: '/img/services/**', search: `?v=${SERVICE_ART_VERSION}` },
    ],
  },
};

export default nextConfig;
