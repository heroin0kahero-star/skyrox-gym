// Adapted from Codrops "Infinite Scroll Gallery and Flip Transitions in GSAP" by Surya Aditya, MIT.
// https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition

export interface StrengthSlideStat {
  label: string;
  value: string;
}

export interface StrengthSlide {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  imageAlt: string;
  stats: StrengthSlideStat[];
  ctaLabel: string;
  ctaTarget: string;
  stagger: string;
  imageWidth: string;
}

export const strengthSlides: StrengthSlide[] = [
  {
    id: 'strength-conditioning',
    title: 'Strength & Conditioning',
    tag: 'Foundation',
    description:
      'Build total-body power with progressive compound lifts, structured conditioning blocks, and coached intensity that carries into everyday performance.',
    image: '/src/assets/images/training_strength_session_1795426420994.jpg',
    imageAlt: 'Athlete setting up a heavy barbell lift in a dark private studio',
    stats: [
      { label: 'Level', value: 'All Levels' },
      { label: 'Duration', value: '60 Min' },
      { label: 'Schedule', value: 'Mon / Wed / Fri' },
    ],
    ctaLabel: 'Book a free trial',
    ctaTarget: 'Strength & Conditioning',
    stagger: '-18vw',
    imageWidth: 'clamp(220px, 24vw, 360px)',
  },
  {
    id: 'powerlifting',
    title: 'Powerlifting',
    tag: 'Strength',
    description:
      'Dial in squat, bench, and deadlift mechanics with focused programming, measurable progression, and technical coaching built for serious strength.',
    image: '/src/assets/images/studio_equipment_detail_1795426440144.jpg',
    imageAlt: 'Calibrated weight plates and knurled dumbbells on a studio rack',
    stats: [
      { label: 'Level', value: 'Intermediate+' },
      { label: 'Duration', value: '75 Min' },
      { label: 'Schedule', value: 'Tue / Thu' },
    ],
    ctaLabel: 'Book a free trial',
    ctaTarget: 'Powerlifting',
    stagger: '14vw',
    imageWidth: 'clamp(200px, 20vw, 320px)',
  },
  {
    id: 'hiit',
    title: 'HIIT',
    tag: 'Conditioning',
    description:
      'High-intensity intervals designed to raise capacity, burn fast, and sharpen athletic output without losing movement quality.',
    image: '/src/assets/images/training_kettlebell_clean_1795426440064.jpg',
    imageAlt: 'Athlete performing kettlebell conditioning in a dark studio',
    stats: [
      { label: 'Level', value: 'All Levels' },
      { label: 'Duration', value: '45 Min' },
      { label: 'Schedule', value: 'Tue / Sat' },
    ],
    ctaLabel: 'Book a free trial',
    ctaTarget: 'HIIT',
    stagger: '-10vw',
    imageWidth: 'clamp(230px, 26vw, 390px)',
  },
  {
    id: 'boxing',
    title: 'Boxing',
    tag: 'Combat Conditioning',
    description:
      'Develop speed, footwork, and striking endurance through pad work, combinations, and conditioning rounds that build confidence and grit.',
    // TODO: Replace with a verified SKYROX boxing/pad-work image.
    image: '/src/assets/images/training_personal_coaching_1795426421630.jpg',
    imageAlt: 'Coach guiding an athlete through focused training in a private studio',
    stats: [
      { label: 'Level', value: 'Beginner+' },
      { label: 'Duration', value: '50 Min' },
      { label: 'Schedule', value: 'Wed / Sat' },
    ],
    ctaLabel: 'Book a free trial',
    ctaTarget: 'Boxing',
    stagger: '20vw',
    imageWidth: 'clamp(210px, 22vw, 340px)',
  },
  {
    id: 'mobility-yoga',
    title: 'Mobility & Yoga',
    tag: 'Recovery',
    description:
      'Restore range, control breathing, and move better with mobility flows and yoga-inspired sessions that support strength and longevity.',
    // TODO: Replace with a verified SKYROX mobility/yoga image.
    image: '/src/assets/images/studio_architecture_wide_1795426420207.jpg',
    imageAlt: 'Calm private studio interior with warm lighting and open training space',
    stats: [
      { label: 'Level', value: 'All Levels' },
      { label: 'Duration', value: '45 Min' },
      { label: 'Schedule', value: 'Thu / Sun' },
    ],
    ctaLabel: 'Book a free trial',
    ctaTarget: 'Mobility & Yoga',
    stagger: '-22vw',
    imageWidth: 'clamp(240px, 27vw, 400px)',
  },
  {
    id: 'personal-training',
    title: 'Personal Training',
    tag: '1-on-1 Coaching',
    description:
      'Get a fully tailored plan, real-time coaching, and accountability in a private setting built around your goals, schedule, and pace.',
    image: '/src/assets/images/training_personal_coaching_1795426421630.jpg',
    imageAlt: 'Personal coach guiding an athlete during a one-on-one training session',
    stats: [
      { label: 'Level', value: 'Personalized' },
      { label: 'Duration', value: 'By Appointment' },
      { label: 'Schedule', value: 'Flexible' },
    ],
    ctaLabel: 'Book a free trial',
    ctaTarget: 'Personal Training',
    stagger: '12vw',
    imageWidth: 'clamp(220px, 24vw, 360px)',
  },
];

export const SCROLL_SPEED_PX = 100; // Shared by verticalLoop speed and slider wheel/touch delta.