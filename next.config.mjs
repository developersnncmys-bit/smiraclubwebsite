import { SERVICE_ART_VERSION } from './src/lib/assetVersion.mjs';

/**
 * The API's own host, plus the one a developer runs locally, as patterns
 * next/image will accept. Uploaded documents and property photographs are
 * served from /api/uploads, so that path is all that is opened up.
 */
function apiPatterns() {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://smiraclubbackend.vercel.app/api';
  const hosts = [];
  try {
    const u = new URL(base);
    hosts.push({ protocol: u.protocol.replace(':', ''), hostname: u.hostname, pathname: '/api/uploads/**' });
  } catch {
    // A malformed value should not stop the site building.
  }
  // Whatever the environment says, the deployed API is always allowed, and
  // so is a backend running on this machine.
  hosts.push({ protocol: 'https', hostname: 'smiraclubbackend.vercel.app', pathname: '/api/uploads/**' });
  hosts.push({ protocol: 'http', hostname: 'localhost', pathname: '/api/uploads/**' });
  hosts.push({ protocol: 'http', hostname: '127.0.0.1', pathname: '/api/uploads/**' });

  // Two entries for the same host would be harmless but untidy.
  const seen = new Set();
  return hosts.filter((h) => {
    const key = `${h.protocol}//${h.hostname}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /**
     * Where a photograph is allowed to come from.
     *
     * next/image refuses any host it has not been told about, which is
     * what it is for — but it meant every photograph a partner uploaded
     * was rejected, because those are served by our own API and nobody
     * had listed it. The API's host is read from the same variable the
     * rest of the site uses, so a different deployment needs no edit here.
     */
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Seeded partners point at this site's own photographs by their full
      // address, because the admin panel shows the same listing from a
      // different origin and a site-relative path would break there.
      { protocol: 'https', hostname: 'smiraclubwebsite.vercel.app', pathname: '/img/**' },
      ...apiPatterns(),
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
