import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { studioContent, GalleryItem } from '../config/studioContent';

gsap.registerPlugin(ScrollTrigger);

type FilterCategory = 'All' | 'Space' | 'Training' | 'Equipment';

export const GallerySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = studioContent.gallery.items.filter(
    (item) => filter === 'All' || item.category === filter
  );

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-tile',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filter]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % items.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + items.length) % items.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, items.length]);

  const activeLightboxItem: GalleryItem | null =
    lightboxIndex !== null ? items[lightboxIndex] ?? null : null;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative border-t border-white/10 bg-[#050505] py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
              {studioContent.gallery.eyebrow}
            </p>
            <h2
              className="mt-3 font-display font-bold uppercase leading-[0.94] tracking-tight text-white"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                textWrap: 'balance',
              }}
            >
              <span>{studioContent.gallery.headlineLine1} </span>
              <span className="text-[#F5D400]">
                {studioContent.gallery.headlineLine2}
              </span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div
              role="group"
              aria-label="Filter studio gallery"
              className="inline-flex flex-wrap border border-white/10 bg-[#101010] p-1"
            >
              {(['All', 'Space', 'Training', 'Equipment'] as FilterCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFilter(cat);
                      setLightboxIndex(null);
                    }}
                    className={`min-h-[38px] px-4 py-1.5 text-xs font-medium tracking-[0.16em] uppercase transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      filter === cat
                        ? 'bg-[#F5D400] text-[#050505] font-bold'
                        : 'text-[#A1A1A1] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
            <p className="text-xs text-[#A1A1A1]">{studioContent.gallery.disclaimer}</p>
          </div>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="gallery-grid mt-10 grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[220px] lg:gap-5">
          {items.map((item, idx) => {
            const layoutClass =
              item.aspect === 'wide'
                ? 'md:col-span-7 md:row-span-2 h-72 md:h-auto'
                : item.aspect === 'tall'
                ? 'md:col-span-5 md:row-span-2 h-80 md:h-auto'
                : 'md:col-span-6 md:row-span-1 h-64 md:h-auto';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                className={`gallery-tile group relative overflow-hidden border border-white/10 bg-[#101010] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F5D400] ${layoutClass}`}
                aria-label={`View ${item.title} full screen`}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border border-white/20 bg-[#050505]/70 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Expand className="h-4 w-4 text-[#F5D400]" />
                </div>

                <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-medium tracking-[0.2em] text-[#F5D400] uppercase">
                      {item.category}
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold tracking-wide text-white uppercase sm:text-2xl">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl border border-white/15 bg-[#050505] p-3 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-[#F5D400] uppercase">
                  {activeLightboxItem.category}
                </p>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  {activeLightboxItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
                aria-label="Close gallery preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex max-h-[72vh] items-center justify-center overflow-hidden bg-[#101010]">
              <img
                src={activeLightboxItem.image}
                alt={activeLightboxItem.alt}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 pt-1">
              <p className="text-xs text-[#A1A1A1]">{activeLightboxItem.caption}</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex - 1 + items.length) % items.length)
                  }
                  className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-white/15 text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs text-[#A1A1A1] tabular-nums px-2">
                  {lightboxIndex + 1} / {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % items.length)}
                  className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-white/15 text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
