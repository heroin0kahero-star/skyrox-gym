import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { studioContent } from '../config/studioContent';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  theme?: 'dark' | 'light';
  introReady: boolean;
  onStartJourney: () => void;
  onExplorePrograms: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme = 'dark',
  introReady,
  onStartJourney,
  onExplorePrograms,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const athleteRef = useRef<HTMLDivElement>(null);
  const trackTopRef = useRef<HTMLDivElement>(null);
  const trackMidRef = useRef<HTMLDivElement>(null);
  const trackBotRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || !introReady) return;

    const ctx = gsap.context(() => {
      // Athlete reveal (transform & opacity only)
      gsap.fromTo(
        athleteRef.current,
        { scale: 1.07, opacity: 0.25 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
        }
      );

      // Headline clipping / entrance
      gsap.fromTo(
        '.hero-reveal-item',
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.12,
        }
      );

      // Yellow accent bar draw
      gsap.fromTo(
        accentLineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );

      // Slow horizontal background kinetic drift
      gsap.to(trackTopRef.current, {
        xPercent: -8,
        duration: 24,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(trackMidRef.current, {
        xPercent: 8,
        duration: 28,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(trackBotRef.current, {
        xPercent: -6,
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Scroll parallax for athlete & depth tracks
      gsap.to(athleteRef.current, {
        y: 42,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    // Desktop subtle mouse-based depth movement
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      gsap.to(athleteRef.current, {
        x: nx * -14,
        y: ny * -10,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to([trackTopRef.current, trackBotRef.current], {
        x: nx * 24,
        duration: 1.1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ctx.revert();
    };
  }, [introReady]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-[#050505] pt-24 pb-12 lg:justify-between lg:pt-28 lg:pb-14"
    >
      <div className="skyrox-grain absolute inset-0 z-30" />

      {/* Layer 1: Oversized Kinetic Campaign Typography BEHIND the Athlete */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center overflow-hidden select-none"
      >
        <div
          ref={trackTopRef}
          className="font-display text-[22vw] font-bold uppercase leading-[0.82] tracking-[-0.03em] whitespace-nowrap text-[#151515] sm:text-[18vw] lg:text-[15.5vw]"
        >
          TRAIN · TRAIN · TRAIN
        </div>
        <div
          ref={trackMidRef}
          className="font-display text-[22vw] font-bold uppercase leading-[0.82] tracking-[-0.03em] whitespace-nowrap text-stroke-yellow sm:text-[18vw] lg:text-[15.5vw] -ml-12"
        >
          TRANSFORM · TRANSFORM
        </div>
        <div
          ref={trackBotRef}
          className="font-display text-[22vw] font-bold uppercase leading-[0.82] tracking-[-0.03em] whitespace-nowrap text-stroke-dark sm:text-[18vw] lg:text-[15.5vw]"
        >
          RISE · BEYOND · RISE
        </div>
      </div>

      {/* Layer 2: Central Realistic Athlete Cutout Focal Anchor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[18%] top-16 z-20 flex items-center justify-center sm:bottom-0 lg:top-12 lg:items-end">
        <div
          ref={athleteRef}
          className="relative flex h-full w-full items-center justify-center lg:items-end"
        >
          <img
            src={
              theme === 'light' && studioContent.hero.athleteImageLight
                ? studioContent.hero.athleteImageLight
                : studioContent.hero.athleteImage
            }
            alt={studioContent.hero.athleteAlt}
            referrerPolicy="no-referrer"
            className="h-[88%] w-auto max-w-full object-contain object-top sm:h-[92%] sm:object-bottom lg:h-[106%]"
          />
          {/* Subtle bottom-edge blend only so legs melt cleanly into the obsidian floor */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#050505] via-[#050505]/45 to-transparent" />
        </div>
      </div>

      {/* Layer 3: Measured Lower Scrim for Foreground Copy Readability without obscuring upper depth typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-25 h-[62%] bg-gradient-to-t from-[#050505] via-[#050505]/55 to-transparent lg:h-[52%]"
      />

      {/* Layer 4: Foreground Editorial Copy & CTAs */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-6 lg:px-12">
        {/* Top-left studio identifier */}
        <div className="hero-reveal-item pt-4 lg:pt-6">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div ref={accentLineRef} className="h-[2px] w-10 bg-[#F5D400]" />
            <span className="text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
              {studioContent.hero.eyebrow}
            </span>
          </div>
        </div>

        {/* Lower-left main campaign headline & actions */}
        <div
          ref={copyRef}
          className="mx-auto mt-auto flex max-w-2xl flex-col items-center pt-44 text-center sm:pt-52 lg:mx-0 lg:block lg:items-start lg:pt-0 lg:text-left"
        >
          <h1
            className="hero-reveal-item relative w-full font-display font-bold uppercase leading-[0.94] tracking-tight text-white lg:w-auto"
            style={{
              fontSize: 'clamp(2.85rem, 6.2vw, 5.5rem)',
              textWrap: 'balance',
            }}
          >
            <span className="absolute inset-x-0 top-[-33.375rem] block text-center lg:static lg:top-auto lg:text-left">
              {studioContent.hero.headlineTop}
            </span>
            <span className="absolute inset-x-0 top-[-14.625rem] block text-center text-[#F5D400] lg:static lg:top-auto lg:text-left">
              {studioContent.hero.headlineBottom}
            </span>
          </h1>

          <p className="hero-reveal-item mx-auto mt-5 max-w-md text-base leading-relaxed text-[#D4D4D4] sm:text-lg lg:mx-0">
            {studioContent.hero.supportingText}
          </p>

          <div className="hero-reveal-item mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <button
              type="button"
              onClick={onStartJourney}
              className="group inline-flex min-h-[48px] items-center gap-3 bg-[#F5D400] px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-[#050505] uppercase hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <span>{studioContent.hero.primaryCta}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onExplorePrograms}
              className="inline-flex min-h-[48px] items-center justify-center border border-white/25 bg-[#050505]/70 px-7 py-3.5 text-xs font-bold tracking-[0.16em] text-white uppercase backdrop-blur-sm hover:border-[#F5D400] hover:text-[#F5D400] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F5D400]"
            >
              {studioContent.hero.secondaryCta}
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge Vertical Brand Signature (Desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex xl:right-10"
      >
        <div className="h-14 w-px bg-[#F5D400]/60" />
        <span className="writing-vertical font-display text-sm font-bold tracking-[0.35em] text-white/70 uppercase">
          SKY<span className="text-[#F5D400]">ROX</span>
        </span>
        <span className="writing-vertical text-[10px] tracking-[0.28em] text-[#A1A1A1] uppercase">
          {studioContent.hero.verticalEdgeLabel}
        </span>
        <div className="h-14 w-px bg-white/15" />
      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="relative z-30 mx-auto mt-6 hidden items-center gap-2 text-[11px] font-medium tracking-[0.25em] text-[#A1A1A1] uppercase hover:text-[#F5D400] transition-colors sm:inline-flex"
        aria-label="Scroll to Brand Philosophy"
      >
        <span>Scroll</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#F5D400]" />
      </a>
    </section>
  );
};
