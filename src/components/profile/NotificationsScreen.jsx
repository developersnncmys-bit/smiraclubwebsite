'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { notificationTones, notifications } from '@/lib/content';

/**
 * Notifications.
 *
 * The link at the top flips between marking everything read and unread,
 * rather than being a one-way control that goes dead the moment you use it —
 * which is what "Mark as Unread" alone would be once nothing is read.
 */
export default function NotificationsScreen() {
  const [read, setRead] = useState(() =>
    Object.fromEntries(notifications.map((n) => [n.id, !n.unread])),
  );

  const allRead = notifications.every((n) => read[n.id]);

  const markAll = () =>
    setRead(Object.fromEntries(notifications.map((n) => [n.id, !allRead])));

  return (
    <div className="shell py-4 pb-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={markAll}
          className="text-[16px] font-semibold text-action-500"
        >
          {allRead ? 'Mark as Unread' : 'Mark as Read'}
        </button>
      </div>

      <ul className="mt-3 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {notifications.map((n) => {
          const tone = notificationTones[n.tone];
          const unread = !read[n.id];

          const body = (
            <>
              <span className="flex items-start gap-3.5">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${tone.dot}`}
                >
                  <Icon name={n.icon} size={17} strokeWidth={2} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span
                      className={`text-[13px] font-bold uppercase tracking-[0.06em] ${tone.label}`}
                    >
                      {n.kind}
                    </span>
                    <span className="flex shrink-0 items-center gap-2.5">
                      <span className="text-[14px] text-ink-500">{n.when}</span>
                    </span>
                  </span>

                  <span className="mt-1 flex items-start justify-between gap-3">
                    <span className="text-[19px] font-bold leading-snug text-ink-900">
                      {n.title}
                    </span>
                    {unread && (
                      <span
                        aria-label="Unread"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-action-500"
                      />
                    )}
                  </span>

                  <span className="mt-1 block text-[16px] leading-snug text-ink-600">
                    {n.body}
                  </span>
                </span>
              </span>

              {n.cta && (
                <span className="mt-4 flex items-center justify-end gap-2 text-[16px] font-semibold text-action-500">
                  {n.cta.label}
                  <ArrowRight size={17} />
                </span>
              )}
            </>
          );

          const shell = `card block p-4 text-left transition sm:p-5 ${
            unread ? '' : 'opacity-75'
          }`;

          return (
            <li key={n.id}>
              {n.cta ? (
                <Link
                  href={n.cta.href}
                  onClick={() => setRead((r) => ({ ...r, [n.id]: true }))}
                  className={`${shell} hover:shadow-lift`}
                >
                  {body}
                </Link>
              ) : n.href ? (
                <Link
                  href={n.href}
                  onClick={() => setRead((r) => ({ ...r, [n.id]: true }))}
                  className={`${shell} hover:shadow-lift`}
                >
                  {body}
                </Link>
              ) : (
                <div className={shell}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
