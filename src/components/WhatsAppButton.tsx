import React from 'react';
import { MessageCircle } from 'lucide-react';
import { studioContent } from '../config/studioContent';

export const WhatsAppButton: React.FC = () => {
  const cleanPhone = studioContent.contact.whatsappNumber.replace(/\D/g, '');
  const href = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        'Hi SKYROX, I would like to enquire about a trial session.'
      )}`
    : '#contact';

  const isExternal = Boolean(cleanPhone);

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={(e) => {
        if (!isExternal) {
          e.preventDefault();
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      aria-label="Chat on WhatsApp with SKYROX"
      className="fixed right-5 bottom-5 z-40 inline-flex h-12 w-12 items-center justify-center border border-[#F5D400] bg-[#050505]/95 text-[#F5D400] shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-[#F5D400] hover:text-[#050505] focus-visible:outline-2 focus-visible:outline-white sm:h-13 sm:w-auto sm:gap-2.5 sm:px-4"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span className="hidden text-xs font-bold tracking-[0.14em] uppercase sm:inline whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
};
