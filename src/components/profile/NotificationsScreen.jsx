'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { notificationTones } from '@/lib/content';
import { api } from '@/lib/api';
import { getSessionToken } from '@/lib/session';
import { ago } from '@/lib/format';

/**
 * Notifications.
 *
 * There were three written into the site, so every member was told the
 * same thing: a trip to Goa in thirty days, an offer, and somebody
 * else's booking confirmation. These are the member's own — their
 * bookings, their membership, their gifts, and the offers running now —
 * worked out by the server each time rather than stored anywhere.
 */
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(null);
  const [read, setRead] = useState({});
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setSignedIn(false);
      setNotifications([]);
      return undefined;
    }
    let live = true;
    api
      .memberNotifications(token)
      .then((res) => {
        if (!live) return;
        const list = res.data || [];
        setNotifications(list);
        setRead(Object.fromEntries(list.map((n) => [n.id, !n.unread])));
      })
      .catch(() => live && setNotifications([]));
    return () => {
      live = false;
    };
  }, []);

  const list = notifications || [];
  const allRead = list.length > 0 && list.every((n) => read[n.id]);

  /**
   * Read is a line in time, not a flag on each one.
   *
   * The server keeps when this member last looked, and anything older
   * than that is read — so marking them read here has to tell it, or
   * the bell lights up again on the next page load.
   */
  const markAll = () => {
    const next = !allRead;
    setRead(Object.fromEntries(list.map((n) => [n.id, next])));
    const token = getSessionToken();
    if (next && token) api.readNotifications(token).catch(() => {});
  };

  if (notifications === null) {
    return (
      <div className="shell flex items-center justify-center gap-2 py-16 text-[15px] text-ink-500">
        <Loader2 size={17} className="animate-spin" /> Loading…
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="shell py-10">
        <p className="card p-6 text-center text-[15px] text-ink-600">
          Sign in to see what is happening on your bookings and membership.
        </p>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="shell py-10">
        <p className="card p-6 text-center text-[15px] text-ink-600">
          Nothing to tell you just now. Trip reminders, booking updates and offers appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="shell py-4 pb-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={markAll}
          className="text-[15px] font-semibold text-action-500"
        >
          {allRead ? 'Mark as Unread' : 'Mark as Read'}
        </button>
      </div>

      <ul className="mt-3 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
        {list.map((n) => {
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
                      <span className="text-[13px] text-ink-500">{ago(n.at)}</span>
                    </span>
                  </span>

                  <span className="mt-1 flex items-start justify-between gap-3">
                    <span className="text-[17px] font-bold leading-snug text-ink-900">
                      {n.title}
                    </span>
                    {unread && (
                      <span
                        aria-label="Unread"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-action-500"
                      />
                    )}
                  </span>

                  <span className="mt-1 block text-[15px] leading-snug text-ink-600">
                    {n.body}
                  </span>
                </span>
              </span>

              {n.cta && (
                <span className="mt-4 flex items-center justify-end gap-2 text-[15px] font-semibold text-action-500">
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
