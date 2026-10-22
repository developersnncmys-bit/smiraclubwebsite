import Link from 'next/link';
import { ChevronRight, Building2 } from 'lucide-react';

/**
 * The one outbound pitch on the screen: list your own property.
 *
 * It carried a photograph of somebody else's villa, which at half the
 * width of the screen left room for three words of the offer. The
 * photograph was decoration; the sentence is the pitch.
 */
export default function PartnerCard() {
  return (
    <Link
      href="/more/partners"
      className="card flex h-full flex-col p-3 transition hover:shadow-lift lg:p-4"
    >
      <span className="flex items-center gap-2">
        <Building2 size={16} className="shrink-0 text-brand-700" />
        <span className="text-[13px] font-bold leading-tight text-brand-700 lg:text-[14px]">
          Become a Partner
        </span>
      </span>

      <span className="mt-1.5 block text-[11.5px] leading-snug text-ink-600 lg:text-[12.5px]">
        List your property and earn extra income.
      </span>

      <span className="mt-auto inline-flex items-center gap-0.5 pt-2.5 text-[12px] font-bold text-action-500 lg:text-[12.5px]">
        List property
        <ChevronRight size={16} />
      </span>
    </Link>
  );
}
