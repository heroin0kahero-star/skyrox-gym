import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import { studioContent } from '../config/studioContent';
import { SkyroxEmblemSvg } from './SkyroxLogoSvg';

gsap.registerPlugin(ScrollTrigger);

import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onBookTrial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme = 'dark', onToggleTheme, onBookTrial }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLinkClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`relative z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/92 backdrop-blur-md py-3'
            : 'bg-gradient-to-b from-[#050505]/85 to-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 lg:px-12">
          {/* Zone 1: Single-line Brand Wordmark + Emblem */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#F5D400]"
            aria-label="SKYROX Private Fitness Studio Home"
          >
            <SkyroxEmblemSvg className="h-8 w-8 shrink-0" />
            <span className="font-display text-xl font-bold tracking-[0.08em] uppercase">
              <span className="text-[#F5D400]">SKY</span>
              <span className="text-white">ROX</span>
            </span>
          </a>

          {/* Zone 2: Clean single-line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7"
          >
            {studioContent.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className="relative py-1.5 text-xs font-medium tracking-[0.16em] text-[#A1A1A1] uppercase hover:text-white transition-colors whitespace-nowrap shrink-0 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#F5D400] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-[#F5D400]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBookTrial}
              className="hidden sm:inline-flex min-h-[42px] items-center justify-center bg-[#F5D400] px-5 py-2.5 text-xs font-bold tracking-[0.14em] text-[#050505] uppercase hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              BOOK A TRIAL
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center border border-white/15 bg-[#101010]/80 text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex lg:hidden min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-[#101010]/80 text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors focus-visible:outline-2 focus-visible:outline-[#F5D400]"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

      </header>

      {/* Full-screen Editorial Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050505] px-6 py-6 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="skyrox-grain absolute inset-0" />

          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
              <SkyroxEmblemSvg className="h-8 w-8" />
              <span className="font-display text-xl font-bold tracking-[0.08em] uppercase">
                <span className="text-[#F5D400]">SKY</span>
                <span className="text-white">ROX</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-[#101010] text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Mobile links" className="relative z-10 flex flex-col gap-2 my-auto">
            {studioContent.navigation.map((item, idx) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className="group flex items-baseline justify-between border-b border-white/10 py-3.5 text-white hover:text-[#F5D400] transition-colors"
              >
                <span className="font-display text-3xl font-bold tracking-wide uppercase">
                  {item.label}
                </span>
                <span className="font-mono text-xs text-[#A1A1A1] group-hover:text-[#F5D400] tabular-nums">
                  0{idx + 1}
                </span>
              </a>
            ))}
          </nav>

          <div className="relative z-10 flex flex-col gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onBookTrial();
              }}
              className="w-full min-h-[48px] bg-[#F5D400] px-6 py-3.5 text-sm font-bold tracking-[0.16em] text-[#050505] uppercase hover:bg-white transition-colors"
            >
              BOOK YOUR TRIAL SESSION
            </button>
            <p className="text-center text-xs tracking-[0.2em] text-[#A1A1A1] uppercase">
              SKYROX PRIVATE FITNESS STUDIO
            </p>
          </div>
        </div>
      )}
    </>
  );
};
