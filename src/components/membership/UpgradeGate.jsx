'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Portal from '@/components/ui/Portal';
import Icon from '@/components/ui/Icon';
import { useMembership } from '@/lib/membership';
import { covers, privilegeFor, privilegeInfo } from '@/lib/privileges';

/**
 * The nudge a member gets on a service their plan does not cover.
 *
 * A plan sells a number of privileges and the member picks which. Silver
 * is one, so somebody who took Free Stay is still shown villas, hotels and
 * everything else — and nothing told them the member rate on those is not
 * theirs. They found out at the desk, which is the worst place to find out.
 *
 * It does not block the page. They can read about a villa, and the desk
 * will still take the booking at the ordinary rate; what they cannot do is
 * assume a member price that was never part of what they bought. Dismiss
 * it and it stays dismissed for that service for the rest of the visit.
 */
export default function UpgradeGate() {
  const path = usePathname();
  const { ready, membership } = useMembership();
  const [hidden, setHidden] = useState(true);

  const need = privilegeFor(path);
  const seen = need ? `smira:upgrade-seen:${need}` : '';

  /*
   * Whether it has already been dismissed this visit, read after mount:
   * sessionStorage does not exist while this renders on the server, and
   * reading it during render would give the two passes different answers.
   */
  useEffect(() => {
    if (!seen) return;
    try {
      setHidden(Boolean(window.sessionStorage.getItem(seen)));
    } catch {
      // Storage blocked. Showing it is the safe way round.
      setHidden(false);
    }
  }, [seen]);

  const short = ready && need && !covers(membership, need);
  if (!short || hidden) return null;

  const info = privilegeInfo(need);
  const held = membership.privileges || [];

  const dismiss = () => {
    setHidden(true);
    try {
      window.sessionStorage.setItem(seen, '1');
    } catch {
      /* nothing to remember it with; it will ask again next page */
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-900/55 sm:items-center sm:p-6"
        onMouseDown={(e) => e.target === e.currentTarget && dismiss()}
      >
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="upgrade-gate-title"
          className="w-full max-w-phone rounded-t-2xl bg-white p-5 shadow-lift sm:rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fdf3dd] text-action-500">
              <Icon name={info?.icon || 'Crown'} size={23} />
            </span>
            <div className="min-w-0">
              <p id="upgrade-gate-title" className="text-[16px] font-bold leading-snug text-ink-900">
                {info?.label || 'This service'} is not in your membership
              </p>
              <p className="mt-1 text-[14px] leading-snug text-ink-600">
                Your {membership.plan} membership covers{' '}
                {held.map((k) => privilegeInfo(k)?.label || k).join(', ')}. Upgrade to add{' '}
                {info?.label || 'this'} and book it at member rates.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
            <Link href="/membership?upgrade=1" className="btn-primary flex-1 justify-center py-3">
              Upgrade my membership
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 rounded-xl border border-surface-line px-4 py-3 text-[15px] font-semibold text-ink-700 transition hover:bg-surface-soft"
            >
              Keep looking
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
