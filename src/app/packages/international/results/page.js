import PackageResults from '@/components/packages/PackageResults';
import { packages } from '@/lib/content';
import { image } from '@/lib/images';
import { shortDate } from '@/lib/format';

export const metadata = { title: 'Packages' };

/** Where the fixed-departure search lands. */
export default async function Page({ searchParams }) {
  const query = (await searchParams) || {};

  const to = (query.to || 'Bali, Indonesia').trim();
  const from = (query.from || 'New Delhi').split(',')[0];
  const when = query.date ? shortDate(new Date(query.date)) : '17 Aug 2026';
  const guests = `${Number(query.adults) || 2} Adults, ${Number(query.rooms) || 1} Room`;

  // Everything on the route, or everything we have if the route is unknown.
  const onRoute = packages.filter((p) => to.toLowerCase().includes(p.destination));
  const items = (onRoute.length ? onRoute : packages).map((p) => ({
    ...p,
    image: image(p.image),
  }));

  return (
    <PackageResults
      hero={image(items[0]?.image ? items[0].image : 'story-bali')}
      from={from}
      to={to}
      when={when}
      guests={guests}
      items={items}
    />
  );
}
