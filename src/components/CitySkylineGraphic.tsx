import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-16 sm:h-20 md:h-24 lg:h-28 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1000 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Baseline Ground Line */}
        <line x1="0" y1="118" x2="1000" y2="118" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />

        {/* ======================================================== */}
        {/* BACKGROUND LAYER: Soft atmospheric silhouettes for depth */}
        {/* ======================================================== */}
        <g stroke="currentColor" strokeWidth="1" opacity="0.3" fill="currentColor" fillOpacity="0.08">
          {/* Far Left background towers */}
          <rect x="25" y="24" width="40" height="94" rx="1" />
          <line x1="45" y1="10" x2="45" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="115" y="32" width="38" height="86" rx="1" />
          <rect x="190" y="26" width="36" height="92" rx="1" />
          <line x1="208" y1="14" x2="208" y2="26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="268" y="44" width="34" height="74" rx="1" />

          {/* Center background soft mid-rises */}
          <rect x="385" y="62" width="36" height="56" rx="1" />
          <rect x="480" y="58" width="42" height="60" rx="1" />
          <line x1="501" y1="48" x2="501" y2="58" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <rect x="585" y="60" width="38" height="58" rx="1" />

          {/* Far Right background towers */}
          <rect x="702" y="42" width="35" height="76" rx="1" />
          <rect x="765" y="24" width="38" height="94" rx="1" />
          <line x1="784" y1="12" x2="784" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="855" y="30" width="40" height="88" rx="1" />
          <rect x="930" y="20" width="36" height="98" rx="1" />
          <line x1="948" y1="8" x2="948" y2="20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* ======================================================== */}
        {/* FOREGROUND LAYER: Clean, modern, crisp architectural forms */}
        {/* ======================================================== */}
        <g stroke="currentColor" strokeWidth="1.5" fill="var(--background)" strokeLinejoin="round">

          {/* 1. LEFT MEGA SKYSCRAPER (x: 52, w: 56, h: 98) */}
          <rect x="52" y="20" width="56" height="98" rx="2" />
          {/* Top spire */}
          <line x1="80" y1="6" x2="80" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Vertical glass facade lines */}
          <line x1="66" y1="30" x2="66" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="80" y1="30" x2="80" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="94" y1="30" x2="94" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

          {/* 2. LEFT ANGLED TOWER (x: 130, w: 52, h: 84) */}
          <path d="M 130 118 L 130 38 L 182 48 L 182 118 Z" />
          <line x1="148" y1="48" x2="148" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="164" y1="52" x2="164" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

          {/* 3. LEFT COMMERCIAL MID-RISE with setback (x: 204, w: 54, h: 68) */}
          <rect x="204" y="50" width="54" height="68" rx="2" />
          <rect x="214" y="40" width="34" height="10" rx="1" />
          <line x1="204" y1="66" x2="258" y2="66" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="204" y1="82" x2="258" y2="82" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="204" y1="98" x2="258" y2="98" stroke="currentColor" strokeWidth="1" opacity="0.5" />

          {/* 4. TRANSITION STEPPED RESIDENCE (x: 280, w: 48, h: 54) */}
          <rect x="280" y="64" width="48" height="54" rx="1.5" />
          <line x1="294" y1="74" x2="294" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="314" y1="74" x2="314" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* 5. MODERN LUXURY VILLA 1 - Cantilever & Panoramic Glass (x: 350, w: 72, h: 42) */}
          <rect x="350" y="76" width="72" height="42" rx="2" />
          {/* Upper cantilever volume */}
          <rect x="346" y="72" width="52" height="18" rx="1.5" fill="var(--background)" stroke="currentColor" strokeWidth="1.3" />
          {/* Panoramic window strip */}
          <line x1="352" y1="81" x2="390" y2="81" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          {/* Ground floor door / patio opening */}
          <rect x="362" y="98" width="16" height="20" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <line x1="392" y1="104" x2="414" y2="104" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />

          {/* 6. MODERN CONTEMPORARY VILLA 2 - Centerpiece (x: 446, w: 78, h: 44) */}
          <rect x="446" y="74" width="78" height="44" rx="2" />
          {/* Roof pergola accent */}
          <line x1="452" y1="68" x2="486" y2="68" stroke="currentColor" strokeWidth="1.5" />
          <line x1="456" y1="68" x2="456" y2="74" stroke="currentColor" strokeWidth="1" />
          <line x1="466" y1="68" x2="466" y2="74" stroke="currentColor" strokeWidth="1" />
          <line x1="476" y1="68" x2="476" y2="74" stroke="currentColor" strokeWidth="1" />
          <line x1="486" y1="68" x2="486" y2="74" stroke="currentColor" strokeWidth="1" />
          {/* Modern geometric architectural facade */}
          <rect x="456" y="82" width="28" height="14" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <rect x="492" y="82" width="22" height="14" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <rect x="472" y="100" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          {/* 7. MODERN RESIDENTIAL TOWNHOUSE 3 (x: 548, w: 68, h: 46) */}
          <rect x="548" y="72" width="68" height="46" rx="2" />
          {/* Stepped roof section */}
          <rect x="578" y="66" width="34" height="6" rx="1" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
          {/* Clean architectural window slits */}
          <line x1="560" y1="84" x2="560" y2="108" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
          <line x1="582" y1="84" x2="582" y2="108" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
          <line x1="602" y1="84" x2="602" y2="108" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />

          {/* 8. TRANSITION MID-RISE (x: 640, w: 50, h: 56) */}
          <rect x="640" y="62" width="50" height="56" rx="1.5" />
          <line x1="640" y1="78" x2="690" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="640" y1="96" x2="690" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.5" />

          {/* 9. RIGHT CORPORATE TOWER with setbacks (x: 714, w: 56, h: 72) */}
          <rect x="714" y="46" width="56" height="72" rx="2" />
          <rect x="726" y="36" width="32" height="10" rx="1" />
          <line x1="732" y1="56" x2="732" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="752" y1="56" x2="752" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

          {/* 10. RIGHT SLANTED MODERN SKYSCRAPER (x: 794, w: 54, h: 86) */}
          <path d="M 794 118 L 794 44 L 848 32 L 848 118 Z" />
          <line x1="812" y1="52" x2="812" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="830" y1="48" x2="830" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />

          {/* 11. RIGHT FLAGSHIP MEGA TOWER (x: 872, w: 60, h: 98) */}
          <rect x="872" y="20" width="60" height="98" rx="2" />
          {/* Spire */}
          <line x1="902" y1="6" x2="902" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Vertical glass facade lines */}
          <line x1="886" y1="30" x2="886" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="902" y1="30" x2="902" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="918" y1="30" x2="918" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
        </g>

        {/* ======================================================== */}
        {/* SUBTLE LANDSCAPING (Delicate minimalist trees along base) */}
        {/* ======================================================== */}
        <g fill="currentColor" opacity="0.75">
          <circle cx="118" cy="114" r="3.5" />
          <circle cx="270" cy="114" r="3" />
          <circle cx="338" cy="114" r="3.5" />
          <circle cx="434" cy="114" r="4" />
          <circle cx="536" cy="114" r="4" />
          <circle cx="628" cy="114" r="3.5" />
          <circle cx="704" cy="114" r="3" />
          <circle cx="860" cy="114" r="3.5" />
        </g>
      </svg>
    </div>
  );
}
