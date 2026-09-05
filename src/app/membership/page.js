import Link from 'next/link';
import { Check, Crown } from 'lucide-react';
import PageHead from '@/components/ui/PageHead';
import { plans, memberBenefits } from '@/lib/content';
import { inr } from '@/lib/format';

export const metadata = { title: 'Membership plans' };

/** The plans, side by side on a desktop and stacked on a phone. */
export default function MembershipPage() {
  return (
    <>
      <PageHead
        title="One membership, every trip"
        subtitle="Free nights, member pricing and a travel expert who knows your name."
      />

      <div className="shell py-8 lg:py-14">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 lg:p-8 ${
                plan.popular ? 'border-brand-500 shadow-lift lg:-mt-4 lg:mb-4' : 'border-surface-line shadow-card'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <Crown size={12} className="text-gold" />
                  Most chosen
                </span>
              )}

              <h2 className="text-xl font-extrabold text-ink-900">{plan.name}</h2>
              <p className="mt-3 flex items-end gap-1.5">
                <span className="text-4xl font-extrabold text-ink-900">{inr(plan.price)}</span>
                <span className="pb-1 text-sm text-ink-500">for {plan.billing}</span>
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Covers {plan.persons} people · {plan.freeNights} free night{plan.freeNights > 1 ? 's' : ''} ·{' '}
                {plan.discount}% off
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[15px] text-ink-700">
                    <Check size={17} className="mt-0.5 shrink-0 text-brand-600" strokeWidth={2.6} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/membership/${plan.id}`}
                className={`mt-8 w-full ${plan.popular ? 'btn-primary' : 'btn-quiet'}`}
              >
                Choose {plan.name.split(' ')[0]}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div id="benefits" className="bg-white py-10 lg:py-16">
        <div className="shell">
          <h2 className="section-title">What every member gets</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {memberBenefits.map((b) => (
              <div key={b.id} className="rounded-2xl border border-surface-line p-5">
                <p className="text-sm text-ink-500">{b.kicker}</p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">{b.title}</p>
                <p className="mt-1 text-xs text-ink-400">{b.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
