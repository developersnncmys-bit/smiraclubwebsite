import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import { memberBenefits } from '@/lib/content';

/** The four image cards, then the way through to the plans. */
export default function MemberBenefits() {
  return (
    <div className="bg-white lg:bg-transparent">
      <div className="shell">
        <Section title="Member Benefits">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {memberBenefits.map((benefit) => (
              <Link
                key={benefit.id}
                href="/membership"
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-[3/4]"
              >
                <Image
                  src={benefit.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 lg:p-5">
                  <p className="text-[13px] font-medium text-white/90 lg:text-sm">{benefit.kicker}</p>
                  <p className="text-lg font-extrabold leading-tight text-white lg:text-xl">{benefit.title}</p>
                  <p className="mt-0.5 text-[11px] text-white/80 lg:text-xs">{benefit.note}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 text-lg font-bold text-ink-900 transition hover:text-brand-700 lg:text-xl"
            >
              Explore Membership Plans
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-white">
                <ChevronRight size={16} />
              </span>
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
