import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { studioContent } from '../config/studioContent';

/**
 * Testimonials Carousel:
 * Remains hidden automatically until verified member reviews are populated
 * in src/config/studioContent.ts (no fabricated reviews or transformations).
 */
export const TestimonialsSection: React.FC = () => {
  const reviews = studioContent.testimonials.items;
  const [activeIndex, setActiveIndex] = useState(0);

  if (reviews.length === 0) {
    return null;
  }

  const current = reviews[activeIndex];

  return (
    <section className="relative border-t border-white/10 bg-[#050505] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
              {studioContent.testimonials.eyebrow}
            </p>
            <h2
              className="mt-3 font-display font-bold uppercase leading-[0.94] tracking-tight text-white"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4rem)' }}
            >
              <span>{studioContent.testimonials.headlineLine1} </span>
              <span className="text-[#F5D400]">
                {studioContent.testimonials.headlineLine2}
              </span>
            </h2>
          </div>

          {reviews.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
                }
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-[#101010] text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex((prev) => (prev + 1) % reviews.length)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-[#101010] text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <blockquote className="mt-10 max-w-4xl">
          <p className="font-display text-2xl leading-snug font-medium text-white sm:text-3xl lg:text-4xl">
            “{current.quote}”
          </p>
          <footer className="mt-6 flex items-center gap-4">
            {current.image && (
              <img
                src={current.image}
                alt={current.memberName}
                referrerPolicy="no-referrer"
                className="h-12 w-12 object-cover border border-white/15"
              />
            )}
            <div>
              <cite className="not-italic font-bold tracking-wide text-white uppercase">
                {current.memberName}
              </cite>
              <p className="text-xs tracking-[0.16em] text-[#A1A1A1] uppercase">
                {current.memberRole}
              </p>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};
