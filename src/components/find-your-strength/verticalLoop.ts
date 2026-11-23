// Adapted from Codrops "Infinite Scroll Gallery and Flip Transitions in GSAP" by Surya Aditya, MIT.
// https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition

import { gsap } from 'gsap';
import { SCROLL_SPEED_PX } from './data';

export interface VerticalLoopConfig {
  repeat?: number;
  paused?: boolean;
  speed?: number;
  paddingBottom?: number;
  snap?: number | false;
}

/** Animate items along the y-axis in a loop */
export function verticalLoop(
  items: Element[] | NodeListOf<Element> | string,
  config: VerticalLoopConfig = {}
) {
  const elements = gsap.utils.toArray<HTMLElement>(items);
  const cfg = config;

  // Endless timeline
  const tl = gsap.timeline({
    repeat: cfg.repeat,
    paused: cfg.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => {
      // Keep the playhead in range when playing backwards past zero
      tl.totalTime(tl.rawTime() + tl.duration() * 100);
    },
  });

  const length = elements.length;
  if (!length) return tl;

  // Measure from the top so any top padding is travelled before a wrap
  const startY = 0;

  // Height of each item, in px
  const heights: number[] = [];

  // Starting y of each item, relative to its height
  const yPercents: number[] = [];

  // Travel speed: speed 1 = SCROLL_SPEED_PX per second
  const pixelsPerSecond = (cfg.speed || 1) * SCROLL_SPEED_PX;

  // Round yPercent values so items land on whole pixels
  const snap =
    cfg.snap === false ? (v: number) => v : gsap.utils.snap((cfg.snap as number) || 1);

  // Measure each item and convert its y into a height-relative yPercent
  gsap.set(elements, {
    yPercent: (i: number, el: HTMLElement) => {
      const h = (heights[i] = parseFloat(gsap.getProperty(el, 'height', 'px') as string));
      yPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'y', 'px') as string) / h) * 100 +
          (gsap.getProperty(el, 'yPercent') as number)
      );
      return yPercents[i];
    },
  });
  gsap.set(elements, { y: 0 });

  // Full container length, including the spacing at the wrap seam
  const totalHeight =
    elements[length - 1].offsetTop +
    (yPercents[length - 1] / 100) * heights[length - 1] -
    startY +
    elements[length - 1].offsetHeight *
      (gsap.getProperty(elements[length - 1], 'scaleY') as number) +
    (parseFloat(String(cfg.paddingBottom)) || 0);

  const isInfinite = cfg.repeat === -1;

  if (isInfinite) {
    // Two tweens per item: exit top, then re-enter from the bottom
    for (let i = 0; i < length; i++) {
      const item = elements[i];

      // Current y offset in px
      const curY = (yPercents[i] / 100) * heights[i];

      // Distance to the container's top edge
      const distanceToStart = item.offsetTop + curY - startY;

      // Distance until fully off-screen top
      const distanceToLoop =
        distanceToStart + heights[i] * (gsap.getProperty(item, 'scaleY') as number);

      // Travel up until fully off-screen
      tl.to(
        item,
        {
          yPercent: snap(((curY - distanceToLoop) / heights[i]) * 100),
          duration: distanceToLoop / pixelsPerSecond,
        },
        0
      ).fromTo(
        // Then re-enter from the bottom end of the container
        item,
        {
          yPercent: snap(((curY - distanceToLoop + totalHeight) / heights[i]) * 100),
        },
        {
          yPercent: yPercents[i],
          duration: (totalHeight - distanceToLoop) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      );
    }
  } else {
    // Single pass: travel only far enough for the last slide to finish in view,
    // then let ScrollTrigger unpin into the next section.
    const section = elements[0].closest('.strength-section');
    const viewportHeight = section?.clientHeight || window.innerHeight;
    const travel = Math.max(0, totalHeight - viewportHeight);
    const duration = travel / pixelsPerSecond;
    for (let i = 0; i < length; i++) {
      const item = elements[i];
      const curY = (yPercents[i] / 100) * heights[i];
      tl.to(
        item,
        {
          yPercent: snap(((curY - travel) / heights[i]) * 100),
          duration,
        },
        0
      );
    }
  }

  // Pre-render every tween to avoid a first-frame jump
  tl.progress(1, true).progress(0, true);

  return tl;
}