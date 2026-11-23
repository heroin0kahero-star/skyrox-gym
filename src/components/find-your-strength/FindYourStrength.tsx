// Adapted from Codrops "Infinite Scroll Gallery and Flip Transitions in GSAP" by Surya Aditya, MIT.
// https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { strengthSlides } from './data';
import { Reveal } from './reveal';
import { Slider } from './slider';
import { Transition } from './transition';
import './find-your-strength.css';

gsap.registerPlugin(ScrollTrigger);

interface FindYourStrengthProps {
  onBookTrial: (interest: string) => void;
}

export const FindYourStrength: React.FC<FindYourStrengthProps> = ({ onBookTrial }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<Transition | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const scrollToNext = useCallback(() => {
    const next = document.querySelector('#experience');
    if (next) next.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    if (!section || !gallery || reducedMotion) return;

    let destroyed = false;
    let slider: Slider | null = null;
    let reveal: Reveal | null = null;
    let transition: Transition | null = null;
    let onKeyDown: ((e: KeyboardEvent) => void) | null = null;
    let removeListeners: (() => void) | null = null;
    let onIntroDone: (() => void) | null = null;

    const introReady =
      (window as Window & { __skyroxIntroDone?: boolean }).__skyroxIntroDone === true
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            onIntroDone = () => resolve();
            window.addEventListener('skyrox-intro-complete', onIntroDone, { once: true });
          });

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.strength-gallery__slide', gallery);
      gsap.set(slides, { x: (i) => strengthSlides[i]?.stagger ?? 0 });

      // Lazy-loaded images are intentionally not awaited here; the gallery layout
      // is CSS-sized and the detail view decodes its own image when opened.
      introReady.then(() => {
        if (destroyed) return;

        // Record the async init in the GSAP context so StrictMode cleanup reverts it.
        ctx.add(() => {
          try {
            transition = new Transition({
              root: section,
              slides,
              reducedMotion,
              onClose: () => slider?.start(),
            });
            transitionRef.current = transition;

            reveal = new Reveal(slides);

            slider = new Slider({
              section,
              gallery,
              slides,
              header: headerRef.current,
              enabled: () => transition?.state === 'closed',
              onToggle: (changes, immediate) => reveal?.toggle(changes, immediate),
            });
            // Refresh after the intro overlay has released the scroll lock.
            requestAnimationFrame(() => ScrollTrigger.refresh());
            window.setTimeout(() => ScrollTrigger.refresh(), 100);
          } catch (err) {
            console.error('[FindYourStrength] init failed', err);
          }

          const listeners: Array<{ el: HTMLElement; type: string; handler: EventListener }> = [];

          slides.forEach((slide, index) => {
            slide.setAttribute('tabindex', '0');
            slide.setAttribute('role', 'button');
            slide.setAttribute('aria-label', `Open ${strengthSlides[index]?.title || 'program'} details`);

            const open = () => {
              if (!transition || transition.state !== 'closed') return;
              slider?.stop();
              transition.open(slide, index);
            };

            const onClick: EventListener = () => open();
            const onKey: EventListener = (event) => {
              const e = event as KeyboardEvent;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
              }
            };

            slide.addEventListener('click', onClick);
            slide.addEventListener('keydown', onKey);
            listeners.push({ el: slide, type: 'click', handler: onClick });
            listeners.push({ el: slide, type: 'keydown', handler: onKey });
          });

          const back = section.querySelector<HTMLElement>('.strength-content__back');
          const onBack: EventListener = () => transition?.close();
          if (back) {
            back.addEventListener('click', onBack);
            listeners.push({ el: back, type: 'click', handler: onBack });
          }

          onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') transition?.close();
          };
          document.addEventListener('keydown', onKeyDown);

          removeListeners = () => {
            listeners.forEach(({ el, type, handler }) => el.removeEventListener(type, handler));
            if (onKeyDown) document.removeEventListener('keydown', onKeyDown);
          };
        });
      });
    }, sectionRef);

    return () => {
      destroyed = true;
      if (onIntroDone) window.removeEventListener('skyrox-intro-complete', onIntroDone);
      removeListeners?.();
      slider?.destroy();
      reveal?.destroy();
      transition?.destroy();
      transitionRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion]);

  const staticGrid = useMemo(() => {
    if (!reducedMotion) return null;
    return (
      <div className="strength-static">
        <div className="strength-static__grid">
          {strengthSlides.map((slide) => (
            <article key={slide.id} className="strength-static__card">
              <div className="strength-static__media">
                <img src={slide.image} alt={slide.imageAlt} loading="lazy" />
              </div>
              <div className="strength-static__body">
                <p className="strength-static__tag">{slide.tag}</p>
                <h3 className="strength-static__title">{slide.title}</h3>
                <p className="strength-static__desc">{slide.description}</p>
                <button
                  type="button"
                  className="strength-static__cta"
                  onClick={() => onBookTrial(slide.ctaTarget)}
                >
                  {slide.ctaLabel}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }, [reducedMotion, onBookTrial]);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="strength-section"
      aria-label="Find your strength programs"
    >
      <div ref={headerRef} className="strength-header" aria-hidden="false">
        <div>
          <p className="strength-header__eyebrow">Disciplines</p>
          <h2 className="strength-header__title">
            Find your <span>strength.</span>
          </h2>
        </div>
        <p className="strength-header__hint">{reducedMotion ? 'Program overview' : 'Scroll to Explore'}</p>
      </div>

      {reducedMotion ? (
        staticGrid
      ) : (
        <>
          <div ref={galleryRef} className="strength-gallery" aria-label="Training programs gallery">
            {strengthSlides.map((slide, index) => (
              <figure
                key={slide.id}
                className="strength-gallery__slide"
                style={{
                  ['--stagger' as string]: slide.stagger,
                  ['--img-w' as string]: slide.imageWidth,
                }}
              >
                <div className="strength-gallery__img-wrapper">
                  <img
                    className="strength-gallery__img"
                    src={slide.image}
                    alt={slide.imageAlt}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <figcaption className="strength-gallery__caption">
                  <span className="strength-gallery__caption-tag">{slide.tag}</span>
                  {slide.title}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="strength-content" aria-hidden="true">
            <figure className="strength-content__preview-img">
              <img alt="" />
            </figure>
            <div className="strength-content__group-list">
              <button className="strength-content__back" type="button">
                &larr; Back [ESC]
              </button>
              {strengthSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="strength-content__group"
                  data-index={index}
                >
                  <p className="strength-content__tag">{slide.tag}</p>
                  <h3 className="strength-content__title">{slide.title}</h3>
                  <p className="strength-content__description">{slide.description}</p>
                  <ul className="strength-content__stats" aria-label={`${slide.title} stats`}>
                    {slide.stats.map((stat) => (
                      <li key={stat.label}>
                        <span className="strength-content__stat-label">{stat.label}</span>
                        <span className="strength-content__stat-value">{stat.value}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="strength-content__cta"
                    onClick={() => {
                      transitionRef.current?.close();
                      onBookTrial(slide.ctaTarget);
                    }}
                  >
                    {slide.ctaLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <button type="button" className="strength-keep-exploring" onClick={scrollToNext}>
        <span>Keep exploring</span>
        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </section>
  );
};