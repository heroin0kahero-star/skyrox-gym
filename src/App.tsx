import { useEffect, useState } from 'react';
import { BrandIntroSection } from './components/BrandIntroSection';
import { ContactSection } from './components/ContactSection';
import { ExperienceSection } from './components/ExperienceSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { HeroSection } from './components/HeroSection';
import { MembershipSection } from './components/MembershipSection';
import { Navbar } from './components/Navbar';
import { ProgramsSection } from './components/ProgramsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhatsAppButton } from './components/WhatsAppButton';

export default function App() {
  const [introReady] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState('Trial Session Booking');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('skyrox_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    try {
      localStorage.setItem('skyrox_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const scrollToContactWithInterest = (interestName: string) => {
    setSelectedInterest(interestName);
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPrograms = () => {
    const target = document.querySelector('#programs');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onBookTrial={() => scrollToContactWithInterest('Trial Session Booking')}
      />

      <main>
        <HeroSection
          theme={theme}
          introReady={introReady}
          onStartJourney={() =>
            scrollToContactWithInterest('Trial Session Booking')
          }
          onExplorePrograms={scrollToPrograms}
        />

        <BrandIntroSection />

        <ProgramsSection
          onSelectProgram={(programTitle) =>
            scrollToContactWithInterest(programTitle)
          }
        />

        <ExperienceSection />

        <GallerySection />

        <MembershipSection
          onSelectPlan={(planName) => scrollToContactWithInterest(planName)}
        />

        <TestimonialsSection />

        <FinalCtaSection
          onBookTrial={() =>
            scrollToContactWithInterest('Trial Session Booking')
          }
        />

        <ContactSection preselectedInterest={selectedInterest} />
      </main>

      <Footer />

      <WhatsAppButton />
    </div>
  );
}
