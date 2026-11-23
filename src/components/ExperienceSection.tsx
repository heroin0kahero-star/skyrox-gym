import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Dumbbell, ShieldCheck, SlidersHorizontal, Target } from 'lucide-react';
import { studioContent, ExperiencePillar } from '../config/studioContent';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<ExperiencePillar['iconKey'], React.ReactNode> = {
  trainers: <Target className="h-6 w-6 text-[#F5D400]" strokeWidth={1.5} />,
  equipment: <Dumbbell className="h-6 w-6 text-[#F5D400]" strokeWidth={1.5} />,
  personalized: (
    <SlidersHorizontal className="h-6 w-6 text-[#F5D400]" strokeWidth={1.5} />
  ),
  environment: (
    <ShieldCheck className="h-6 w-6 text-[#F5D400]" strokeWidth={1.5} />
  ),
};

export const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.experience-block',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.experience-grid',
            start: 'top 78%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#101010] py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Heading */}
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
            {studioContent.experience.eyebrow}
          </p>
          <h2
            className="mt-3 font-display font-bold uppercase leading-[0.94] tracking-tight text-white"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              textWrap: 'balance',
            }}
          >
            <span className="block">{studioContent.experience.headlineLine1}</span>
            <span className="block text-[#F5D400]">
              {studioContent.experience.headlineLine2}
            </span>
          </h2>
        </div>

        {/* Four Architectural Pillar Blocks */}
        <div className="experience-grid mt-14 grid grid-cols-1 border-t border-l border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {studioContent.experience.pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="experience-block group flex flex-col justify-between border-r border-b border-white/10 bg-[#0A0A0A] p-8 transition-colors duration-300 hover:bg-[#141414]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-[#050505] transition-colors group-hover:border-[#F5D400]/50">
                    {iconMap[pillar.iconKey]}
                  </div>
                  <span className="font-mono text-xs tracking-widest text-[#A1A1A1] tabular-nums group-hover:text-[#F5D400]">
                    {pillar.index}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-2xl font-bold tracking-wide text-white uppercase">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A1A1A1]">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 h-px w-8 bg-white/15 transition-all duration-300 group-hover:w-16 group-hover:bg-[#F5D400]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
