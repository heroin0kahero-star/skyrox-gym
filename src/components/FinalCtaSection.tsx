import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { studioContent } from '../config/studioContent';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onBookTrial: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onBookTrial,
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.final-cta-reveal',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[78vh] w-full items-center justify-center overflow-hidden border-t border-white/10 bg-[#050505] py-24 lg:py-36"
    >
      {/* Background Cinematic Studio Image */}
      <img
        src={studioContent.finalCta.backgroundImage}
        alt="SKYROX private studio training floor"
        loading="lazy"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
      />
      {/* Measured Contrast Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/85" />
      <div className="skyrox-grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <p className="final-cta-reveal text-xs font-medium tracking-[0.3em] text-[#F5D400] uppercase">
          SKYROX PRIVATE FITNESS STUDIO
        </p>

        <h2
          className="final-cta-reveal mx-auto mt-5 max-w-4xl font-display font-bold uppercase leading-[0.92] tracking-tight text-white"
          style={{
            fontSize: 'clamp(2.85rem, 6.8vw, 6rem)',
            textWrap: 'balance',
          }}
        >
          {studioContent.finalCta.headlineLines.map((line, i) => (
            <span
              key={line}
              className={`block ${i === 2 ? 'text-[#F5D400]' : 'text-white'}`}
            >
              {line}
            </span>
          ))}
        </h2>

        <p className="final-cta-reveal mx-auto mt-6 max-w-md text-base text-[#D4D4D4] sm:text-lg">
          {studioContent.finalCta.supportingText}
        </p>

        <div className="final-cta-reveal mt-10 flex justify-center">
          <button
            type="button"
            onClick={onBookTrial}
            className="group inline-flex min-h-[52px] items-center gap-3 bg-[#F5D400] px-8 py-4 text-xs font-bold tracking-[0.18em] text-[#050505] uppercase hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <span>{studioContent.finalCta.ctaLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
