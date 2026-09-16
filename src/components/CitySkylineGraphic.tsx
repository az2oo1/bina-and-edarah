import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex flex-col items-center justify-end select-none pointer-events-none overflow-hidden ${className}`}>
      {/* 
        Panoramic Architectural Line Art Skyline
        - Hand-drawn architectural pen & ink detailing (luxury towers, modern pavilions, villas, traditional marquee tent & palms)
        - 1:1 locked aspect ratio (never stretched horizontally or vertically)
        - Perfectly centered on the royal heritage tent and oasis
        - Mobile: outer high-rise towers bleed naturally off-frame so the central buildings remain spacious, clear, and uncrowded
        - Desktop: spans wide across the horizon with high fidelity
        - Translucent ink styling with top vignette fade for seamless integration into the hero section
      */}
      <div 
        className="relative w-full flex items-end justify-center overflow-hidden h-32 sm:h-40 md:h-52 lg:h-64 xl:h-72 2xl:h-80"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)'
        }}
      >
        {/* Light Theme Artwork (Slate Charcoal Ink) */}
        <img
          src="/architectural-skyline-light.png"
          alt="Architectural Skyline"
          className="dark:hidden block select-none pointer-events-none w-full min-w-[720px] max-w-[1700px] h-auto object-cover object-bottom shrink-0 opacity-80"
          loading="eager"
          decoding="async"
        />

        {/* Dark Theme Artwork (Luminous White Architectural Ink) */}
        <img
          src="/architectural-skyline-dark.png"
          alt="Architectural Skyline"
          className="hidden dark:block select-none pointer-events-none w-full min-w-[720px] max-w-[1700px] h-auto object-cover object-bottom shrink-0 opacity-70"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Continuous Horizon Ground Baseline Line across 100% of viewport width */}
      <div className="w-full h-[1px] bg-border/40 dark:bg-border/30" />
    </div>
  );
}
