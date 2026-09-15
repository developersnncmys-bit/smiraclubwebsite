import ScreenBar from '@/components/ui/ScreenBar';
import ActivitiesScreen from '@/components/offers/ActivitiesScreen';
import { spaKinds, spas } from '@/lib/content';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Saloon & Spa',
  description: 'Member discounts at saloons and spas.',
};

export default function Page() {
  const list = spas.map((s) => ({ ...s, image: image(s.image) }));
  return (
    <>
      <ScreenBar title="Saloon & Spa" backHref="/" />
      <ActivitiesScreen
        activities={list}
        kinds={spaKinds}
        initialKind="spa"
        title="Saloon & Spa"
        placeholder="Search by Saloon & Spa name, location"
        hrefBase="/spa"
      />
    </>
  );
}
