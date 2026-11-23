export interface NavLinkItem {
  label: string;
  href: string;
}

export interface ProgramItem {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  focusAreas: string[];
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface ExperiencePillar {
  index: string;
  title: string;
  description: string;
  iconKey: 'trainers' | 'equipment' | 'personalized' | 'environment';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Space' | 'Training' | 'Equipment';
  aspect: 'tall' | 'wide' | 'standard';
  image: string;
  alt: string;
  caption: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  priceLabel: string;
  priceNote: string;
  summary: string;
  benefits: string[];
  featured?: boolean;
  ctaLabel: string;
}

export interface Testimonial {
  id: string;
  memberName: string;
  memberRole: string;
  quote: string;
  image?: string;
}

export const studioContent = {
  brand: {
    name: 'SKYROX',
    fullName: 'SKYROX Private Fitness Studio',
    tagline: 'PRIVATE FITNESS STUDIO',
    officialLogoImage: '/assets/aistudio/image_3e7728a4.png',
  },

  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Membership', href: '#membership' },
    { label: 'Contact', href: '#contact' },
  ] as NavLinkItem[],

  hero: {
    eyebrow: 'SKYROX PRIVATE FITNESS STUDIO',
    headlineTop: 'BUILT DIFFERENT.',
    headlineBottom: 'TRAIN BEYOND.',
    supportingText:
      'Your fitness journey deserves more than ordinary. Train with purpose. Transform with SKYROX.',
    primaryCta: 'START YOUR JOURNEY',
    secondaryCta: 'EXPLORE PROGRAMS',
    verticalEdgeLabel: 'PRIVATE FITNESS STUDIO / SKYROX',
    backgroundWords: ['TRAIN', 'TRANSFORM', 'RISE'],
    athleteImage: '/assets/aistudio/Sculpted_Strength_in_Monochrome_65266025.png',
    athleteImageLight: '/assets/aistudio/Monochrome_Back_Pose_Fitness_Portrait_56cc1c74.png',
    athleteAlt: 'Muscular male strength athlete in matte black training apparel in a focused stance',
  },

  brandIntro: {
    eyebrow: 'THE PHILOSOPHY',
    headlineLine1: 'MORE THAN',
    headlineLine2: 'JUST A GYM.',
    paragraphs: [
      'At SKYROX, fitness is more than lifting weights.',
      "It's about building strength, developing discipline and becoming a stronger version of yourself.",
    ],
    studioImage: '/src/assets/images/studio_architecture_wide_1795426420207.jpg',
    studioImageAlt: 'Dark architectural private fitness studio interior with power racks and warm linear lighting',
    editorialNote: 'Editorial Studio Atmosphere · Customizable with Verified Studio Photography',
    highlights: ['Private Training Floor', 'Structured Coaching', 'Focused Environment'],
  },

  programsSection: {
    eyebrow: 'DISCIPLINES',
    headlineLine1: 'FIND YOUR',
    headlineLine2: 'STRENGTH.',
    note: 'Program offerings are structured for private studio coaching and can be tailored in studio configuration.',
    items: [
      {
        id: 'strength-training',
        index: '01',
        title: 'Strength Training',
        category: 'Foundation',
        description:
          'Progressive barbell, dumbbell, and compound movement programming built around clean mechanics and measurable progression.',
        focusAreas: ['Barbell Mechanics', 'Progressive Overload', 'Core Stability'],
        image: '/src/assets/images/training_strength_session_1795426420994.jpg',
        imageAlt: 'Athlete preparing a heavy barbell deadlift in a dark private studio',
        featured: true,
      },
      {
        id: 'personal-training',
        index: '02',
        title: 'Personal Training',
        category: '1-on-1 Coaching',
        description:
          'Dedicated coach attention in a private setting—tailored programming, real-time form feedback, and consistent accountability.',
        focusAreas: ['Individual Programming', 'Form Precision', 'Accountability'],
        image: '/src/assets/images/training_personal_coaching_1795426421630.jpg',
        imageAlt: 'Personal coach guiding an athlete through an overhead alignment drill',
        featured: true,
      },
      {
        id: 'weight-management',
        index: '03',
        title: 'Weight Management',
        category: 'Body Composition',
        description:
          'Sustainable training volume and metabolic conditioning designed to support healthy body composition without burnout.',
        focusAreas: ['Metabolic Conditioning', 'Habit Structure', 'Consistent Pacing'],
        image: '/src/assets/images/training_kettlebell_clean_1795426440064.jpg',
        imageAlt: 'Athlete executing controlled kettlebell conditioning swings',
      },
      {
        id: 'functional-fitness',
        index: '04',
        title: 'Functional Fitness',
        category: 'Athletic Movement',
        description:
          'Multi-planar strength, kettlebell work, and athletic conditioning that translate directly to everyday resilience and performance.',
        focusAreas: ['Work Capacity', 'Kettlebell Flow', 'Rotational Power'],
        image: '/src/assets/images/training_kettlebell_clean_1795426440064.jpg',
        imageAlt: 'Functional kettlebell conditioning in dark concrete studio',
      },
      {
        id: 'muscle-building',
        index: '05',
        title: 'Muscle Building',
        category: 'Hypertrophy',
        description:
          'Targeted hypertrophy blocks balancing mechanical tension, controlled tempo, and structured recovery across every muscle group.',
        focusAreas: ['Hypertrophy Blocks', 'Tempo Control', 'Balanced Volume'],
        image: '/src/assets/images/studio_equipment_detail_1795426440144.jpg',
        imageAlt: 'Matte black knurled dumbbells and calibrated weight plates on studio rack',
      },
      {
        id: 'mobility-flexibility',
        index: '06',
        title: 'Mobility & Flexibility',
        category: 'Longevity',
        description:
          'Joint-specific range of motion work, thoracic opening, and active recovery sessions to keep your body moving pain-free.',
        focusAreas: ['Joint Range', 'Postural Alignment', 'Active Recovery'],
        image: '/src/assets/images/training_personal_coaching_1795426421630.jpg',
        imageAlt: 'Guided shoulder and thoracic mobility training session',
      },
    ] as ProgramItem[],
  },

  experience: {
    eyebrow: 'THE SKYROX STANDARD',
    headlineLine1: 'YOUR GOALS.',
    headlineLine2: 'OUR MISSION.',
    pillars: [
      {
        index: '01',
        title: 'Expert Trainers',
        description:
          'Attentive coaching focused on proper technique, clear progression, and safe execution in every single session.',
        iconKey: 'trainers',
      },
      {
        index: '02',
        title: 'Modern Equipment',
        description:
          'Curated strength racks, calibrated free weights, and conditioning tools maintained for serious, distraction-free work.',
        iconKey: 'equipment',
      },
      {
        index: '03',
        title: 'Personalized Training',
        description:
          'Training blocks shaped around your starting baseline, schedule, and long-term physical priorities rather than generic templates.',
        iconKey: 'personalized',
      },
      {
        index: '04',
        title: 'Supportive Environment',
        description:
          'A calm, private studio atmosphere free from overcrowded floors—built so you can focus fully on the work in front of you.',
        iconKey: 'environment',
      },
    ] as ExperiencePillar[],
  },

  gallery: {
    eyebrow: 'INSIDE THE STUDIO',
    headlineLine1: 'THE SPACE.',
    headlineLine2: 'THE CRAFT.',
    disclaimer:
      'Editorial campaign visuals shown below — swap directly with verified studio photography in src/config/studioContent.ts.',
    items: [
      {
        id: 'gal-1',
        title: 'Main Strength Bay',
        category: 'Space',
        aspect: 'wide',
        image: '/src/assets/images/studio_architecture_wide_1795426420207.jpg',
        alt: 'Private studio interior with matte black power racks and warm linear lighting',
        caption: 'Editorial Space Study · Power Rack & Platform Zone',
      },
      {
        id: 'gal-2',
        title: 'Calibrated Iron & Steel',
        category: 'Equipment',
        aspect: 'tall',
        image: '/src/assets/images/studio_equipment_detail_1795426440144.jpg',
        alt: 'Knurled steel dumbbells and calibrated weight plates on matte black racks',
        caption: 'Editorial Equipment Detail · Free Weight Lineup',
      },
      {
        id: 'gal-3',
        title: 'Barbell Focus',
        category: 'Training',
        aspect: 'standard',
        image: '/src/assets/images/training_strength_session_1795426420994.jpg',
        alt: 'Strength athlete setting up a heavy barbell pull with chalk',
        caption: 'Editorial Training Visual · Compound Lift Setup',
      },
      {
        id: 'gal-4',
        title: '1-on-1 Alignment',
        category: 'Training',
        aspect: 'standard',
        image: '/src/assets/images/training_personal_coaching_1795426421630.jpg',
        alt: 'Coach guiding an overhead mobility drill',
        caption: 'Editorial Coaching Visual · Guided Mobility Work',
      },
      {
        id: 'gal-5',
        title: 'Dynamic Conditioning',
        category: 'Training',
        aspect: 'wide',
        image: '/src/assets/images/training_kettlebell_clean_1795426440064.jpg',
        alt: 'Athlete performing kettlebell conditioning swings',
        caption: 'Editorial Conditioning Visual · Kettlebell Power',
      },
    ] as GalleryItem[],
  },

  membership: {
    eyebrow: 'MEMBERSHIP OPTIONS',
    headlineLine1: 'YOUR NEXT LEVEL',
    headlineLine2: 'STARTS HERE.',
    pricingNotice:
      'Membership rates below are editable placeholders. Contact SKYROX directly for confirmed studio fee schedules and current availability.',
    plans: [
      {
        id: 'studio-access',
        name: 'Private Studio Access',
        duration: 'Monthly / Quarterly Options',
        priceLabel: 'Rate Pending Confirmation',
        priceNote: 'Editable placeholder — confirm direct with studio',
        summary: 'Controlled-capacity studio training access designed for independent lifters.',
        benefits: [
          'Scheduled private floor training slots',
          'Full access to free weights & racks',
          'Initial studio movement orientation',
          'Quiet, distraction-free environment',
        ],
        ctaLabel: 'ENQUIRE ABOUT PLAN',
      },
      {
        id: 'private-coaching',
        name: '1-on-1 Personal Coaching',
        duration: 'Tailored Coaching Cycle',
        priceLabel: 'Custom Rate · On Enquiry',
        priceNote: 'Editable placeholder — tailored to session frequency',
        summary: 'Dedicated private coach programming, hands-on technique cues, and accountability.',
        benefits: [
          'Dedicated 1-on-1 coaching sessions',
          'Custom strength & conditioning roadmap',
          'Mobility & movement screening',
          'Direct WhatsApp coach check-ins',
          'Flexible private appointment scheduling',
        ],
        featured: true,
        ctaLabel: 'BOOK TRIAL & RATE',
      },
      {
        id: 'hybrid-transformation',
        name: 'Hybrid Performance Track',
        duration: '8–12 Week Structured Block',
        priceLabel: 'Rate Pending Confirmation',
        priceNote: 'Editable placeholder — confirm direct with studio',
        summary: 'Combines weekly coached sessions with structured independent studio workouts.',
        benefits: [
          'Scheduled personal coaching check-ins',
          'Structured multi-week training plan',
          'Body composition & habit guidance',
          'Progress review at each phase',
        ],
        ctaLabel: 'ENQUIRE ABOUT PLAN',
      },
    ] as MembershipPlan[],
  },

  // Per brand integrity guidelines: keep Testimonials hidden until genuine verified reviews are supplied.
  testimonials: {
    eyebrow: 'MEMBER STORIES',
    headlineLine1: 'REAL PEOPLE.',
    headlineLine2: 'REAL PROGRESS.',
    items: [] as Testimonial[],
  },

  finalCta: {
    headlineLines: ['THE ONLY LIMIT', 'IS THE ONE', 'YOU SET.'],
    supportingText: 'Your fitness journey starts at SKYROX.',
    ctaLabel: 'BOOK YOUR TRIAL SESSION',
    backgroundImage: '/src/assets/images/studio_architecture_wide_1795426420207.jpg',
  },

  contact: {
    eyebrow: 'VISIT & CONNECT',
    headlineLine1: 'START YOUR',
    headlineLine2: 'TRIAL SESSION.',
    studioAddressLabel: 'SKYROX Private Fitness Studio',
    studioAddressDetail:
      'Studio street address pending verification — update exact street address & coordinates in src/config/studioContent.ts.',
    // Default map viewport center (editable to exact studio lat/lng)
    coordinates: {
      lat: 12.9716,
      lng: 77.5946,
    },
    whatsappNumber: '', // e.g. '919876543210' (country code + number without +)
    whatsappDisplay: 'Direct WhatsApp Enquiry',
    instagramHandle: '@skyrox',
    instagramUrl: 'https://instagram.com',
    emailDisplay: 'Enquire via Studio Form',
    hoursLabel: 'By Appointment & Scheduled Sessions',
  },
};
