import { MessageCircle, Phone } from 'lucide-react';
import { membershipHelp } from '@/lib/content';

/**
 * The way to reach a person. It sits at the foot of the screens where a
 * member is deciding something — the comparison and the gifts — so it lives
 * here rather than being written out twice with the number in both.
 */
export default function NeedHelp({ className = '' }) {
  return (
    <section className={`rounded-2xl bg-[#eaf1fe] p-5 sm:p-6 ${className}`}>
      <h2 className="text-xl font-bold text-ink-900">{membershipHelp.title}</h2>
      <p className="mt-1 text-[15px] text-ink-600">{membershipHelp.body}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={membershipHelp.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3.5 text-[15px] font-bold uppercase tracking-wide text-ink-900 shadow-card transition hover:bg-surface-soft"
        >
          <MessageCircle size={19} className="text-[#25d366]" fill="currentColor" strokeWidth={0} />
          Chat now
        </a>

        <a
          href={`tel:${membershipHelp.phone}`}
          className="inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3.5 text-[15px] font-bold uppercase tracking-wide text-ink-900 shadow-card transition hover:bg-surface-soft"
        >
          <Phone size={19} className="text-brand-700" />
          Call now
        </a>
      </div>
    </section>
  );
}
