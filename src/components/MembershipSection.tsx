import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check } from 'lucide-react';
import { studioContent } from '../config/studioContent';

gsap.registerPlugin(ScrollTrigger);

interface MembershipSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  onSelectPlan,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.membership-card',
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.membership-grid',
            start: 'top 78%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="membership"
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#101010] py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
              {studioContent.membership.eyebrow}
            </p>
            <h2
              className="mt-3 font-display font-bold uppercase leading-[0.94] tracking-tight text-white"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                textWrap: 'balance',
              }}
            >
              <span className="block">{studioContent.membership.headlineLine1}</span>
              <span className="block text-[#F5D400]">
                {studioContent.membership.headlineLine2}
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#A1A1A1]">
            {studioContent.membership.pricingNotice}
          </p>
        </div>

        <div className="membership-grid mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {studioContent.membership.plans.map((plan) => {
            const isFeatured = Boolean(plan.featured);

            return (
              <article
                key={plan.id}
                className={`membership-card flex flex-col justify-between border p-8 transition-colors duration-300 ${
                  isFeatured
                    ? 'border-[#F5D400] bg-[#F5D400] text-[#050505]'
                    : 'border-white/10 bg-[#050505] text-white hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 border-b pb-5 border-current/15">
                    <span
                      className={`text-xs font-bold tracking-[0.2em] uppercase ${
                        isFeatured ? 'text-[#050505]' : 'text-[#F5D400]'
                      }`}
                    >
                      {plan.duration}
                    </span>
                    {isFeatured && (
                      <span className="text-[11px] font-bold tracking-[0.2em] text-[#050505] uppercase">
                        Featured Track
                      </span>
                    )}
                  </div>

                  <h3 className="mt-6 font-display text-3xl font-bold tracking-wide uppercase">
                    {plan.name}
                  </h3>

                  <div className="mt-5">
                    <p
                      className={`font-display text-2xl font-bold tracking-tight uppercase tabular-nums ${
                        isFeatured ? 'text-[#050505]' : 'text-[#F5D400]'
                      }`}
                    >
                      {plan.priceLabel}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        isFeatured ? 'text-[#050505]/75' : 'text-[#A1A1A1]'
                      }`}
                    >
                      {plan.priceNote}
                    </p>
                  </div>

                  <p
                    className={`mt-5 text-sm leading-relaxed ${
                      isFeatured ? 'text-[#050505]/85' : 'text-[#D4D4D4]'
                    }`}
                  >
                    {plan.summary}
                  </p>

                  <ul className="mt-7 space-y-3 border-t pt-6 border-current/15">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            isFeatured ? 'text-[#050505]' : 'text-[#F5D400]'
                          }`}
                          strokeWidth={2.5}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.name)}
                  className={`group mt-9 inline-flex min-h-[48px] w-full items-center justify-center gap-3 px-6 py-3.5 text-xs font-bold tracking-[0.16em] uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 ${
                    isFeatured
                      ? 'bg-[#050505] text-white hover:bg-[#1a1a1a] focus-visible:outline-[#050505]'
                      : 'border border-white/20 bg-[#101010] text-white hover:border-[#F5D400] hover:bg-[#F5D400] hover:text-[#050505] focus-visible:outline-[#F5D400]'
                  }`}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
