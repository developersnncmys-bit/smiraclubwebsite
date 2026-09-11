import Link from 'next/link';
import { Pencil, Phone, User } from 'lucide-react';
import { member } from '@/lib/content';

/** The blue card the screen opens on — who you are, and the way to edit it. */
export default function IdentityCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2b8ce4] via-[#1a7ddd] to-[#1273e6] p-5 text-white shadow-card sm:p-6">
      {member.active && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-white" />
          Active
        </span>
      )}

      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/85 sm:h-[72px] sm:w-[72px]">
          <User size={34} className="text-brand-500" fill="currentColor" strokeWidth={0} />
        </span>

        <div className="min-w-0">
          <h1 className="truncate pr-16 text-[19px] font-bold leading-tight sm:pr-20 sm:text-2xl">
            Hey {member.name}!
          </h1>

          <p className="mt-2 flex items-center gap-2 text-[14px] font-medium text-white/95">
            <Phone size={15} fill="currentColor" strokeWidth={0} />
            {member.phone}
          </p>

          <Link
            href="/profile/edit"
            className="mt-1.5 inline-flex items-center gap-2 text-[14px] font-semibold transition hover:text-white/80"
          >
            <Pencil size={15} />
            Edit Profile
          </Link>
        </div>
      </div>
    </section>
  );
}
