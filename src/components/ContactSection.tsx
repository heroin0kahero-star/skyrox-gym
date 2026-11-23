import React, { useEffect, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import {
  CheckCircle2,
  Instagram,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { studioContent } from '../config/studioContent';

interface ContactSectionProps {
  preselectedInterest: string;
}

const MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

const StudioMapMarker: React.FC = () => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={studioContent.contact.coordinates}
        onClick={() => setInfoOpen((prev) => !prev)}
        title={studioContent.brand.fullName}
      >
        <Pin
          background="#F5D400"
          borderColor="#050505"
          glyphColor="#050505"
          scale={1.2}
        />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={240}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="p-1 text-[#050505]">
            <p className="font-bold text-sm uppercase tracking-wide">
              {studioContent.brand.fullName}
            </p>
            <p className="mt-1 text-xs text-neutral-700">
              {studioContent.contact.hoursLabel}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedInterest,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(
    preselectedInterest || 'Trial Session Booking'
  );
  const [preferredTime, setPreferredTime] = useState('Morning (6 AM – 11 AM)');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedInterest) {
      setInterest(preselectedInterest);
      setSubmitted(false);
    }
  }, [preselectedInterest]);

  const buildWhatsAppUrl = (customText?: string) => {
    const cleanPhone = studioContent.contact.whatsappNumber.replace(/\D/g, '');
    const text = encodeURIComponent(
      customText ||
        `Hi SKYROX team, I would like to enquire about ${interest}.`
    );
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${text}`
      : `https://wa.me/?text=${text}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (name.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (phone.trim().length < 7) {
      setFormError('Please enter a valid phone or WhatsApp number.');
      return;
    }

    setSubmitted(true);
  };

  const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${studioContent.contact.coordinates.lat},${studioContent.contact.coordinates.lng}`;

  return (
    <section
      id="contact"
      className="relative border-t border-white/10 bg-[#050505] py-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="border-b border-white/10 pb-10">
          <p className="text-xs font-medium tracking-[0.26em] text-[#F5D400] uppercase">
            {studioContent.contact.eyebrow}
          </p>
          <h2
            className="mt-3 font-display font-bold uppercase leading-[0.94] tracking-tight text-white"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              textWrap: 'balance',
            }}
          >
            <span>{studioContent.contact.headlineLine1} </span>
            <span className="text-[#F5D400]">
              {studioContent.contact.headlineLine2}
            </span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Google Maps Studio Location & Direct Channels */}
          <div className="flex flex-col justify-between gap-8 lg:col-span-6">
            {/* Explicit height container for Google Maps (CF2) */}
            <div className="relative h-[340px] w-full overflow-hidden border border-white/10 bg-[#101010] sm:h-[380px]">
              {MAPS_API_KEY ? (
                <APIProvider
                  apiKey={MAPS_API_KEY}
                  libraries={['marker']}
                  language="en"
                >
                  <GoogleMap
                    mapId="DEMO_MAP_ID"
                    defaultCenter={studioContent.contact.coordinates}
                    defaultZoom={14}
                    gestureHandling="cooperative"
                    disableDefaultUI={false}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <StudioMapMarker />
                  </GoogleMap>
                </APIProvider>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <MapPin className="h-8 w-8 text-[#F5D400]" />
                  <p className="mt-3 font-display text-xl font-bold text-white uppercase">
                    {studioContent.contact.studioAddressLabel}
                  </p>
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#A1A1A1]">
                    {studioContent.contact.studioAddressDetail}
                  </p>
                  <a
                    href={mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-[40px] items-center gap-2 border border-[#F5D400] px-4 py-2 text-xs font-bold tracking-[0.14em] text-[#F5D400] uppercase hover:bg-[#F5D400] hover:text-[#050505] transition-colors"
                  >
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>

            {/* Studio Contact Metadata Grid */}
            <div className="grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
              <div className="border border-white/10 bg-[#101010] p-5">
                <p className="text-[11px] font-medium tracking-[0.2em] text-[#F5D400] uppercase">
                  Studio Location
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {studioContent.contact.studioAddressLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#A1A1A1]">
                  {studioContent.contact.studioAddressDetail}
                </p>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-[#F5D400] uppercase hover:text-white transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>

              <div className="flex flex-col justify-between border border-white/10 bg-[#101010] p-5">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.2em] text-[#F5D400] uppercase">
                    Direct Channels
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {studioContent.contact.hoursLabel}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 bg-[#F5D400] px-4 py-2 text-xs font-bold tracking-[0.14em] text-[#050505] uppercase hover:bg-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                  <a
                    href={studioContent.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center justify-center gap-2 border border-white/15 px-4 py-2 text-xs font-bold tracking-[0.14em] text-white uppercase hover:border-[#F5D400] hover:text-[#F5D400] transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>{studioContent.contact.instagramHandle}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Trial Booking & Enquiry Form */}
          <div className="border border-white/10 bg-[#101010] p-6 sm:p-8 lg:col-span-6 lg:p-10">
            {submitted ? (
              <div className="flex h-full flex-col items-start justify-center py-8">
                <CheckCircle2 className="h-10 w-10 text-[#F5D400]" />
                <h3 className="mt-5 font-display text-3xl font-bold text-white uppercase">
                  Enquiry Prepared
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#D4D4D4]">
                  Thank you, <span className="text-white font-medium">{name}</span>. Your trial
                  request for <span className="text-[#F5D400]">{interest}</span> ({preferredTime})
                  is ready. Continue directly on WhatsApp for the fastest studio response.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={buildWhatsAppUrl(
                      `Hi SKYROX! Name: ${name}, Phone: ${phone}, Email: ${email}, Interest: ${interest}, Preferred Time: ${preferredTime}. ${message}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-2.5 bg-[#F5D400] px-6 py-3 text-xs font-bold tracking-[0.16em] text-[#050505] uppercase hover:bg-white transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Send via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="inline-flex min-h-[48px] items-center border border-white/20 px-5 py-3 text-xs font-bold tracking-[0.16em] text-white uppercase hover:border-[#F5D400] hover:text-[#F5D400] transition-colors cursor-pointer"
                  >
                    New Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-display text-2xl font-bold tracking-wide text-white uppercase">
                    Book a Trial Session
                  </h3>
                  <p className="mt-1 text-xs text-[#A1A1A1]">
                    Complete your details below and select your training focus.
                  </p>
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs text-red-200"
                  >
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="skyrox-name"
                      className="block text-xs font-medium tracking-[0.14em] text-[#A1A1A1] uppercase"
                    >
                      Full Name
                    </label>
                    <input
                      id="skyrox-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F5D400] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skyrox-phone"
                      className="block text-xs font-medium tracking-[0.14em] text-[#A1A1A1] uppercase"
                    >
                      Phone / WhatsApp
                    </label>
                    <input
                      id="skyrox-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F5D400] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="skyrox-email"
                      className="block text-xs font-medium tracking-[0.14em] text-[#A1A1A1] uppercase"
                    >
                      Email Address
                    </label>
                    <input
                      id="skyrox-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F5D400] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skyrox-time"
                      className="block text-xs font-medium tracking-[0.14em] text-[#A1A1A1] uppercase"
                    >
                      Preferred Session Time
                    </label>
                    <select
                      id="skyrox-time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white focus:border-[#F5D400] focus:outline-none"
                    >
                      <option value="Morning (6 AM – 11 AM)">Morning (6 AM – 11 AM)</option>
                      <option value="Midday (11 AM – 4 PM)">Midday (11 AM – 4 PM)</option>
                      <option value="Evening (4 PM – 9 PM)">Evening (4 PM – 9 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="skyrox-interest"
                    className="block text-xs font-medium tracking-[0.14em] text-[#A1A1A1] uppercase"
                  >
                    Program or Membership Interest
                  </label>
                  <select
                    id="skyrox-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="mt-2 w-full border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white focus:border-[#F5D400] focus:outline-none"
                  >
                    <option value="Trial Session Booking">Trial Session Booking</option>
                    {studioContent.programsSection.items.map((p) => (
                      <option key={p.id} value={p.title}>
                        Program: {p.title}
                      </option>
                    ))}
                    {studioContent.membership.plans.map((m) => (
                      <option key={m.id} value={m.name}>
                        Membership: {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="skyrox-message"
                    className="block text-xs font-medium tracking-[0.14em] text-[#A1A1A1] uppercase"
                  >
                    Training Goals (Optional)
                  </label>
                  <textarea
                    id="skyrox-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your experience level, schedule, or specific training goals..."
                    className="mt-2 w-full resize-none border border-white/15 bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F5D400] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-3 bg-[#F5D400] px-6 py-3.5 text-xs font-bold tracking-[0.18em] text-[#050505] uppercase hover:bg-white transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Send className="h-4 w-4" />
                  <span>SUBMIT TRIAL ENQUIRY</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
