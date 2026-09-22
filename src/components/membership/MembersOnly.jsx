'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';
import { isMember, joinHref, useMembership } from '@/lib/membership';

/**
 * The door on everything past the search results.
 *
 * Wraps a details page (and its booking screen): a member sees it, anyone
 * else is sent to take a membership and brought back here afterwards.
 */
export default function MembersOnly({ children }) {
  const router = useRouter();
  const { ready, membership } = useMembership();
  const member = isMember(membership);

  useEffect(() => {
    if (ready && !member) router.replace(joinHref());
  }, [ready, member, router]);

  if (ready && member) return children;

  return (
    <div className="shell grid min-h-[50vh] place-items-center py-16 text-center">
      <div>
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50">
          <Crown size={26} className="text-action-500" />
        </span>
        <p className="mt-4 text-[16px] font-bold text-ink-900">
          {ready ? 'Details are for Smira Club members' : 'Checking your membership…'}
        </p>
        {ready && <p className="mt-1 text-[14px] text-ink-500">Taking you to the membership plans…</p>}
      </div>
    </div>
  );
}
