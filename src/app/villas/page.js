import ScreenBar from '@/components/ui/ScreenBar';
import VillaHero from '@/components/villas/VillaHero';
import VillaSearch from '@/components/villas/VillaSearch';
import VillaCollections from '@/components/villas/VillaCollections';
import VillaCard from '@/components/villas/VillaCard';
import Section from '@/components/ui/Section';
import { villaCollections, villaHero, villas } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Villas & Home Stays',
  description:
    'Whole villas and home stays at member prices — luxury, family, beach, hilltop, private and pet friendly.',
};

/**
 * Villas & Home Stays.
 *
 * The design is a phone screen, so the phone is the literal one: banner,
 * search, collections, then the recommended villas. A desktop keeps every
 * one of those in the same order and only widens them — six collection tiles
 * on one line, and the villas two across instead of stacked.
 *
 * The hero slots are resolved here rather than in the carousel because
 * `image()` reads the filesystem, which only the server can do.
 */
export default function Page() {
  const slides = villaHero.map((s) => ({ ...s, image: image(s.image) }));
  const recommended = villas.map((v) => ({ ...v, image: image(v.image) }));
  const collections = villaCollections.map((c) => ({ ...c, image: image(c.image) }));

  return (
    <>
      <ScreenBar title="Villas & Home Stays" backHref="/" />

      <VillaHero slides={slides} />
      <VillaSearch />

      <div className="shell">
        <Section title="Explore Villa Collections">
          <VillaCollections collections={collections} />
        </Section>

        <Section title="Recommended Villas" className="pb-10 lg:pb-16">
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            {recommended.map((villa) => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
