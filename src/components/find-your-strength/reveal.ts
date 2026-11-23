// Adapted from Codrops "Infinite Scroll Gallery and Flip Transitions in GSAP" by Surya Aditya, MIT.
// https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type { SliderChange } from './slider';

gsap.registerPlugin(SplitText);

interface RevealItem {
  wrapper: HTMLElement;
  caption: HTMLElement;
  chars: Element[];
  split: SplitText;
}

/** Reveal each slide (image + caption) as it enters the viewport */
export class Reveal {
  private items = new Map<HTMLElement, RevealItem>();

  constructor(slides: HTMLElement[]) {
    slides.forEach((slide) => {
      const wrapper = slide.querySelector<HTMLElement>('.strength-gallery__img-wrapper');
      const caption = slide.querySelector<HTMLElement>('.strength-gallery__caption');
      if (!wrapper || !caption) return;

      const split = new SplitText(caption, { type: 'chars' });
      const chars = split.chars;

      gsap.set(wrapper, { autoAlpha: 0 });
      gsap.set(chars, { autoAlpha: 0 });

      this.items.set(slide, { wrapper, caption, chars, split });
    });
  }

  /** Show slides that entered, top to bottom, reset the ones that left */
  toggle(changes: SliderChange[], immediate = false) {
    changes
      .filter((change) => change.visible)
      .sort((a, b) => a.top - b.top)
      .forEach((change, i) => this.show(change.el, i * 0.12, immediate));

    changes
      .filter((change) => !change.visible)
      .forEach((change) => this.hide(change.el));
  }

  /** Fade the image in, then fade the caption in character by character */
  private show(slide: HTMLElement, delay: number, immediate = false) {
    const item = this.items.get(slide);
    if (!item) return;
    const { wrapper, chars } = item;

    if (immediate) {
      gsap.set([wrapper, ...chars], { autoAlpha: 1, overwrite: true });
      return;
    }

    gsap.to(wrapper, {
      autoAlpha: 1,
      duration: 1,
      ease: 'power2.out',
      delay,
      overwrite: true,
    });

    gsap.to(chars, {
      autoAlpha: 1,
      duration: 0.4,
      ease: 'none',
      stagger: 0.025,
      delay: delay + 0.2,
      overwrite: true,
    });
  }

  /** Reset instantly so the reveal replays on the next entry */
  private hide(slide: HTMLElement) {
    const item = this.items.get(slide);
    if (!item) return;
    const { wrapper, chars } = item;
    gsap.set(wrapper, { autoAlpha: 0, overwrite: true });
    gsap.set(chars, { autoAlpha: 0, overwrite: true });
  }

  destroy() {
    this.items.forEach(({ split }) => split.revert());
    this.items.clear();
  }
}