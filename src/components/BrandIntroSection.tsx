import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { studioContent } from '../config/studioContent';

gsap.registerPlugin(ScrollTrigger);

export const BrandIntroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.intro-stagger',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );

      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: 'inset(8% 0% 8% 0%)', opacity: 0.7 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.to(imageRef.current, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: imageWrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#050505] py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Editorial Column */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="intro-stagger text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
                {studioContent.brandIntro.eyebrow}
              </p>

              <h2
                className="intro-stagger mt-4 font-display font-bold uppercase leading-[0.95] tracking-tight text-white"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
                  textWrap: 'balance',
                }}
              >
                <span className="block">{studioContent.brandIntro.headlineLine1}</span>
                <span className="block text-[#F5D400]">
                  {studioContent.brandIntro.headlineLine2}
                </span>
              </h2>

              <div ref={lineRef} className="my-7 h-[2px] w-14 bg-[#F5D400]" />

              <div className="intro-stagger space-y-4 text-base leading-relaxed text-[#D4D4D4] sm:text-lg">
                {studioContent.brandIntro.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="intro-stagger mt-10 border-t border-white/10 pt-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium tracking-[0.16em] text-[#A1A1A1] uppercase">
                {studioContent.brandIntro.highlights.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-[#F5D400]">
                        ·
                      </span>
                    )}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-5">
                <img
                  src={studioContent.brand.officialLogoImage}
                  alt="SKYROX Private Fitness Studio official emblem and wordmark"
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Right Architectural Studio Photo */}
          <div className="lg:col-span-7">
            <div
              ref={imageWrapRef}
              className="relative h-[380px] overflow-hidden border border-white/10 bg-[#101010] sm:h-[480px] lg:h-full lg:min-h-[540px]"
            >
              <img
                ref={imageRef}
                src={studioContent.brandIntro.studioImage}
                alt={studioContent.brandIntro.studioImageAlt}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-[112%] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-transparent" />

              <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-4 backdrop-blur-xs">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.22em] text-[#F5D400] uppercase">
                    Studio Environment
                  </p>
                  <p className="mt-1 text-xs text-[#D4D4D4]">
                    {studioContent.brandIntro.editorialNote}
                  </p>
                </div>
                <span className="font-mono text-xs tracking-wider text-white/80 uppercase tabular-nums">
                  01 / PHILOSOPHY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
