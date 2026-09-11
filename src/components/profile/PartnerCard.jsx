import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { image } from '@/lib/images';

/** The one outbound pitch on the screen: list your own property. */
export default function PartnerCard() {
  return (
    <Link
      href="/more/partners"
      className="card flex items-center gap-4 p-4 transition hover:shadow-lift sm:p-5"
    >
      <span className="relative h-[72px] w-[92px] shrink-0 overflow-hidden rounded-xl">
        <Image src={image('partner-property')} alt="" fill sizes="92px" className="object-cover" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-ink-900">Become a Partner</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-ink-500">
          List your property &amp; earn extra income
        </span>
      </span>

      <ChevronRight size={20} className="shrink-0 text-ink-400" />
    </Link>
  );
}
