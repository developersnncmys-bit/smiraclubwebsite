import ScreenBar from '@/components/ui/ScreenBar';
import ReferEarn from '@/components/profile/ReferEarn';
import { image } from '@/lib/images';

export const metadata = {
  title: 'Refer & Earn',
  description: 'Bring a friend to Smira Club and you both earn SmiraCash.',
};

/** Refer & Earn, from the profile screen's Your Information list. */
export default function Page() {
  const art = {
    'refer-you': image('refer-you'),
    'refer-friend': image('refer-friend'),
  };

  return (
    <>
      <ScreenBar title="Refer & Earn" backHref="/profile" />
      <ReferEarn art={art} />
    </>
  );
}
