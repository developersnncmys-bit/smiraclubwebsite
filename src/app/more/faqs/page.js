import ScreenBar from '@/components/ui/ScreenBar';
import Accordion from '@/components/ui/Accordion';
import NeedHelp from '@/components/ui/NeedHelp';
import { faqGroups } from '@/lib/content';

export const metadata = {
  title: 'FAQs',
  description:
    'Answers on membership, bookings, cancellations and refunds at Smira Club.',
};

/**
 * FAQs.
 *
 * Three groups, as the design splits them. The first question in each opens
 * by default so the page does not read as a wall of closed boxes.
 */
export default function Page() {
  return (
    <>
      <ScreenBar title="FAQs" backHref="/more" />

      <div className="shell space-y-10 py-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10 lg:space-y-0">
        {faqGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">{group.title}</h2>

            <div className="mt-4 space-y-3">
              {group.items.map((item, i) => (
                <Accordion
                  key={item.q}
                  question={item.q}
                  answer={item.a}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </section>
        ))}

        <NeedHelp />
      </div>
    </>
  );
}
