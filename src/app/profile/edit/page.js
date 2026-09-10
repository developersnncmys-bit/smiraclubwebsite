import CompleteProfile from '@/components/profile/CompleteProfile';

export const metadata = {
  title: 'Complete Your profile',
  description: 'Tell Smira Club about your special days so we can make them count.',
};

/**
 * Complete Your Profile.
 *
 * Both ways in from the profile screen — "Edit Profile" on the identity card
 * and "Complete Profile" under the progress ring — land here, because they
 * are the same five steps either way.
 */
export default function Page() {
  return <CompleteProfile />;
}
