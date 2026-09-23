'use client';

import Link from 'next/link';
import { LogIn, Pencil, Phone, User } from 'lucide-react';
import { member } from '@/lib/content';
import { useProfile } from '@/lib/profile';
import { isMember, useMembership } from '@/lib/membership';

/** The blue card the screen opens on — who you are, and the way to edit it. */
export default function IdentityCard() {
  // What the member saved on Complete Your Profile, where there is something.
  const { profile } = useProfile();
  const { membership } = useMembership();
  // Nobody signed in on this device yet: the card offers the way in instead.
  const signedIn = Boolean(profile?.details?.name?.trim() || isMember(membership));
  const name = profile?.details?.name?.trim() || (signedIn ? member.name : 'there');
  const phone = profile?.details?.phone?.trim() || (signedIn ? member.phone : 'Not signed in');
  const photo = profile?.photo;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b8ce4] via-[#1a7ddd] to-[#1273e6] p-5 text-white shadow-card sm:p-6">
      {isMember(membership) && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-white" />
          Active
        </span>
      )}

      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white/85 sm:h-[72px] sm:w-[72px]">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <User size={34} className="text-brand-500" fill="currentColor" strokeWidth={0} />
          )}
        </span>

        <div className="min-w-0">
          <h1 className="truncate pr-16 text-[19px] font-bold leading-tight sm:pr-20 sm:text-2xl">
            Hey {name}!
          </h1>

          <p className="mt-2 flex items-center gap-2 text-[14px] font-medium text-white/95">
            <Phone size={15} fill="currentColor" strokeWidth={0} />
            {phone}
          </p>

          {signedIn ? (
            <Link
              href="/profile/edit"
              className="mt-1.5 inline-flex items-center gap-2 text-[14px] font-semibold transition hover:text-white/80"
            >
              <Pencil size={15} />
              Edit Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="mt-2.5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[14px] font-bold text-action-500 transition hover:bg-surface-soft"
            >
              <LogIn size={16} />
              Log in
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
