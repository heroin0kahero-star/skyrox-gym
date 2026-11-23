// Adapted from Codrops "Infinite Scroll Gallery and Flip Transitions in GSAP" by Surya Aditya, MIT.
// https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition

import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(Flip, SplitText);

interface TransitionOptions {
  root: HTMLElement;
  slides: HTMLElement[];
  onClose?: () => void;
  reducedMotion?: boolean;
}

type TransitionState = 'closed' | 'opening' | 'open' | 'closing';

/** Image-to-content transition */
export class Transition {
  private root: HTMLElement;
  private onClose?: () => void;
  private reducedMotion: boolean;
  private content: HTMLElement;
  private preview: HTMLElement;
  private previewImg: HTMLImageElement;
  private groups: HTMLElement[];
  private slides: HTMLElement[];
  private activeSlide: HTMLElement | null = null;
  private lastFocusedSlide: HTMLElement | null = null;
  private tl: gsap.core.Timeline | null = null;
  private split: SplitText | null = null;
  state: TransitionState = 'closed';

  constructor({ root, slides, onClose, reducedMotion = false }: TransitionOptions) {
    this.root = root;
    this.slides = slides;
    this.onClose = onClose;
    this.reducedMotion = reducedMotion;

    this.content = this.root.querySelector<HTMLElement>('.strength-content')!;
    this.preview = this.root.querySelector<HTMLElement>('.strength-content__preview-img')!;
    this.previewImg = this.preview.querySelector<HTMLImageElement>('img')!;
    this.groups = gsap.utils.toArray<HTMLElement>('.strength-content__group', this.root);

    // The preview's Flip identity
    this.preview.dataset.flipId = 'strength-preview';
  }

  /** Animate to preview */
  async open(slide: HTMLElement, index: number) {
    if (this.state !== 'closed') return;
    this.state = 'opening';
    this.activeSlide = slide;
    this.lastFocusedSlide = slide;

    await this.fillContent(slide, index);

    // A close() landing while the preview decoded has already reset us
    if (this.state !== 'opening') return;

    const { wrapper, caption, others } = this.parts();
    if (!wrapper) {
      this.reset();
      return;
    }
    wrapper.dataset.flipId = 'strength-preview';

    // Capture the thumbnail's bounds before the layout changes
    const state = Flip.getState(wrapper);

    // Show the detail layout and hide the thumbnail, killing its reveal tween
    gsap.set(this.content, { display: 'block', autoAlpha: 1 });
    this.content.setAttribute('aria-hidden', 'false');
    this.content.setAttribute('aria-modal', 'true');
    this.content.setAttribute('role', 'dialog');
    gsap.killTweensOf(wrapper);
    gsap.set(wrapper, { autoAlpha: 0 });

    // Split the text into lines and characters for the active content
    this.split = new SplitText(
      this.root.querySelectorAll('.strength-content__back, .strength-content__group.active > *'),
      { type: 'lines,chars', charsClass: 'strength-char' }
    );

    if (this.reducedMotion) {
      this.tl = gsap
        .timeline({
          onComplete: () => {
            this.state = 'open';
            this.focusBackButton();
          },
          onReverseComplete: () => this.reset(),
        })
        .to(others, { autoAlpha: 0, duration: 0.25, ease: 'power1.out' }, 0)
        .to(caption, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, 0)
        .set(this.preview, { opacity: 0 }, 0)
        .set(this.previewImg, { scale: 1 }, 0)
        .to(this.preview, { opacity: 1, duration: 0.3, ease: 'power1.out' }, 0.05)
        .set(this.split.chars, { autoAlpha: 1 }, 0.1);
      return;
    }

    this.tl = gsap
      .timeline({
        onComplete: () => {
          this.state = 'open';
          this.focusBackButton();
        },
        onReverseComplete: () => this.reset(),
      })
      // Fade out the other slides and the caption
      .to(others, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 0)
      .to(caption, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0)
      // Morph the selected image
      .add(
        Flip.from(state, {
          targets: this.preview,
          duration: 1.2,
          ease: 'power4.inOut',
          absolute: true,
        }),
        0
      )
      .to(this.previewImg, { scale: 1, duration: 1.2, ease: 'power4.inOut' }, 0);

    // Fade the text in character by character, one line after another
    this.split.lines.forEach((line, i) => {
      this.tl?.fromTo(
        line.querySelectorAll('.strength-char'),
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.01,
        },
        0.8 + i * 0.06
      );
    });
  }

  /** Animate the preview back into its slide */
  close() {
    // Close mid-animation
    if (this.state === 'opening') {
      this.state = 'closing';
      if (!this.tl) {
        this.reset();
        return;
      }
      this.tl.reverse();
      return;
    }

    if (this.state !== 'open') return;
    this.state = 'closing';

    const { wrapper, caption, others } = this.parts();
    if (!wrapper) {
      this.reset();
      return;
    }

    if (this.reducedMotion) {
      this.tl = gsap
        .timeline({ onComplete: () => this.reset() })
        .to(this.content, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, 0)
        .to(others, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, 0.05)
        .to(caption, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, 0.05);
      return;
    }

    this.tl = gsap
      .timeline({ onComplete: () => this.reset() })
      // Fade the text out line by line
      .to(this.split?.lines || [], {
        autoAlpha: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power1.out',
      }, 0)
      // Morph the preview back into the thumbnail's bounds
      .add(
        Flip.fit(this.preview, wrapper, {
          duration: 1,
          ease: 'power3.inOut',
          absolute: true,
        }),
        0
      )
      .to(this.previewImg, { scale: 1.2, duration: 1, ease: 'power3.inOut' }, 0)
      // Fade the other slides and caption back in
      .to(others, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0.5)
      .to(caption, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.6);
  }

  /** Copy the clicked image into the preview and activate its content group */
  private async fillContent(slide: HTMLElement, index: number) {
    const img = slide.querySelector<HTMLImageElement>('.strength-gallery__img');
    if (!img) return;
    this.previewImg.src = img.currentSrc || img.src;
    this.previewImg.alt = img.alt;

    this.groups.forEach((group) =>
      group.classList.toggle('active', Number(group.dataset.index) === index)
    );

    try {
      await this.previewImg.decode();
    } catch {
      // Decode can reject if src swaps mid-flight.
    }
  }

  /** Collect the pieces of the active slide the animations need */
  private parts() {
    const slide = this.activeSlide;
    if (!slide) {
      return { wrapper: null, caption: null, others: this.slides };
    }
    return {
      wrapper: slide.querySelector<HTMLElement>('.strength-gallery__img-wrapper'),
      caption: slide.querySelector<HTMLElement>('.strength-gallery__caption'),
      others: this.slides.filter((s) => s !== slide),
    };
  }

  private focusBackButton() {
    const back = this.root.querySelector<HTMLElement>('.strength-content__back');
    back?.focus({ preventScroll: true });
  }

  /** Restore the DOM */
  private reset() {
    const { wrapper } = this.parts();

    if (wrapper) {
      delete wrapper.dataset.flipId;
      gsap.set(wrapper, { clearProps: 'all' });
    }

    this.split?.revert();
    this.split = null;

    gsap.set(this.content, { display: 'none' });
    gsap.set(this.content, { clearProps: 'opacity,visibility' });
    this.content.setAttribute('aria-hidden', 'true');
    this.content.removeAttribute('aria-modal');
    this.content.removeAttribute('role');
    gsap.set(this.preview, { clearProps: 'all' });
    gsap.set(this.previewImg, { clearProps: 'all' });

    const slideToFocus = this.lastFocusedSlide;
    this.activeSlide = null;
    this.tl = null;
    this.state = 'closed';

    if (slideToFocus) {
      slideToFocus.focus({ preventScroll: true });
    }
    this.onClose?.();
  }

  destroy() {
    this.tl?.kill();
    this.split?.revert();
    this.split = null;
    this.state = 'closed';
  }
}