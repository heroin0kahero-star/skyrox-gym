// Adapted from Codrops "Infinite Scroll Gallery and Flip Transitions in GSAP" by Surya Aditya, MIT.
// https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL_SPEED_PX } from './data';
import { verticalLoop } from './verticalLoop';

gsap.registerPlugin(ScrollTrigger);

export interface SliderChange {
  el: HTMLElement;
  visible: boolean;
  top: number;
}

interface SliderOptions {
  section: HTMLElement;
  gallery: HTMLElement;
  slides: HTMLElement[];
  header?: HTMLElement | null;
  enabled?: () => boolean;
  onToggle?: (changes: SliderChange[], immediate?: boolean) => void;
}

/** Scroll-driven gallery (single pass, no infinite loop). */
export class Slider {
  private section: HTMLElement;
  private gallery: HTMLElement;
  private slides: HTMLElement[];
  private header?: HTMLElement | null;
  private enabled: () => boolean;
  private onToggle?: (changes: SliderChange[], immediate?: boolean) => void;
  private loop!: gsap.core.Timeline;
  private parallax: Array<{ el: HTMLElement; factor: number; offset: number; visible: boolean }> = [];
  private scrollTrigger!: ScrollTrigger;
  private resizeTimer?: number;
  private onResizeBound: () => void;
  private destroyed = false;

  constructor({ section, gallery, slides, header, enabled = () => true, onToggle }: SliderOptions) {
    this.section = section;
    this.gallery = gallery;
    this.slides = slides;
    this.header = header;
    this.enabled = enabled;
    this.onToggle = onToggle;
    this.onResizeBound = this.onResize.bind(this);

    this.createLoop();
    this.createParallax();
    this.createScrollTrigger();

    window.addEventListener('resize', this.onResizeBound);
  }

  /** Build a single-pass vertical timeline */
  private createLoop() {
    const gap = parseFloat(getComputedStyle(this.gallery).rowGap) || 0;
    this.loop = verticalLoop(this.slides, {
      repeat: 0,
      paused: true,
      paddingBottom: gap,
      speed: 1,
    });
  }

  /** Give each slide its own travel speed for a sense of depth */
  private createParallax() {
    const speeds = [1.3, 0.8, 1.15, 0.7, 1.25, 0.85];
    this.parallax = this.slides.map((slide, i) => ({
      el: slide,
      factor: speeds[i % speeds.length] - 1,
      offset: 0,
      visible: false,
    }));
    this.applyParallax(true);
  }

  /** Offset each slide by its speed factor, report viewport enters/leaves */
  private applyParallax(immediate = false) {
    if (this.destroyed) return;
    const changes: SliderChange[] = [];
    const bounds = this.section.getBoundingClientRect();

    this.parallax.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      const loopTop = rect.top - item.offset;
      item.offset = item.factor * (loopTop - bounds.top + rect.height);
      gsap.set(item.el, { y: item.offset });

      const top = loopTop + item.offset;
      const visible = top < bounds.bottom && top + rect.height > bounds.top;

      if (visible !== item.visible) {
        item.visible = visible;
        changes.push({ el: item.el, visible, top: top - bounds.top });
      }
    });

    if (changes.length) this.onToggle?.(changes, immediate);
  }

  private createScrollTrigger() {
    const duration = this.loop.duration() || 1;
    // Scroll distance proportional to timeline duration (px/s constant shared with verticalLoop).
    const getScrollDistance = () =>
      Math.max(window.innerHeight * 1.5, duration * SCROLL_SPEED_PX);

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.section,
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!this.enabled()) return;
        this.loop.time(self.progress * duration);
        this.applyParallax();
        if (this.header) {
          const fade = Math.min(self.progress / 0.25, 1);
          gsap.set(this.header, { autoAlpha: 1 - fade, yPercent: -20 * fade });
        }
      },
      onRefresh: (self) => {
        const duration = this.loop.duration() || 1;
        this.loop.time(self.progress * duration);
        this.applyParallax(true);
        if (this.header) {
          const fade = Math.min(self.progress / 0.25, 1);
          gsap.set(this.header, { autoAlpha: 1 - fade, yPercent: -20 * fade });
        }
      },
    });
  }

  private onResize() {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => {
      this.rebuild();
    }, 200);
  }

  /** Freeze - no-op for scroll-driven mode, kept for Transition API compatibility */
  stop() {
    // ScrollTrigger scrub is driven by page; transition overlay sits above.
  }

  /** Resume - sync to current scroll progress after transition closes */
  start() {
    if (this.destroyed) return;
    if (this.scrollTrigger) {
      const duration = this.loop.duration() || 1;
      this.loop.time(this.scrollTrigger.progress * duration);
    }
    this.applyParallax(true);
  }

  setEngaged(_engaged: boolean) {
    // No-op: scroll-driven mode uses page scroll.
  }

  rebuild() {
    if (this.destroyed) return;
    const progress = this.scrollTrigger?.progress || 0;
    const staggers = this.slides.map(
      (slide) => parseFloat(String(gsap.getProperty(slide, 'x'))) || 0
    );
    this.loop.kill();
    this.scrollTrigger?.kill();
    gsap.set(this.slides, { clearProps: 'transform' });
    this.slides.forEach((slide, i) => {
      gsap.set(slide, { x: staggers[i] || 0 });
    });

    this.createLoop();
    this.createParallax();
    this.createScrollTrigger();
    this.scrollTrigger.scroll(this.scrollTrigger.start + (this.scrollTrigger.end - this.scrollTrigger.start) * progress);
    this.applyParallax(true);
  }

  destroy() {
    this.destroyed = true;
    window.clearTimeout(this.resizeTimer);
    window.removeEventListener('resize', this.onResizeBound);
    this.scrollTrigger?.kill();
    this.loop?.kill();
  }
}