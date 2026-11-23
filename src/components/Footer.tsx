import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';
import { studioContent } from '../config/studioContent';

export const Footer: React.FC = () => {
  const cleanPhone = studioContent.contact.whatsappNumber.replace(/\D/g, '');
  const waHref = cleanPhone
    ? `https://wa.me/${cleanPhone}`
    : 'https://wa.me/?text=Hi%20SKYROX%20Private%20Fitness%20Studio';

  return (
    <footer className="border-t border-white/10 bg-[#050505] py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-center">
          <div>
            <img
              src={studioContent.brand.officialLogoImage}
              alt="SKYROX Private Fitness Studio"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain"
            />
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-[#A1A1A1]">
              Built different. Train beyond. Private strength, conditioning, and personal coaching.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-6"
          >
            {studioContent.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-medium tracking-[0.16em] text-[#A1A1A1] uppercase hover:text-[#F5D400] transition-colors whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={studioContent.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center border border-white/15 bg-[#101010] text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
              aria-label="SKYROX Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center border border-white/15 bg-[#101010] text-white hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
              aria-label="SKYROX WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 text-xs text-[#A1A1A1] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SKYROX Private Fitness Studio. All rights reserved.</p>
          <p className="tracking-wider uppercase">Built Different · Train Beyond</p>
        </div>
      </div>
    </footer>
  );
};
