import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-16 sm:h-20 md:h-24 lg:h-28 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="118" x2="1200" y2="118" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />

        {/* ======================================================== */}
        {/* LAYER 1: CONTINUOUS BACKGROUND URBAN SILHOUETTE          */}
        {/* ======================================================== */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.45" fill="currentColor" fillOpacity="0.12">
          {/* Left background skyline */}
          <rect x="0" y="24" width="55" height="94" />
          <rect x="48" y="14" width="46" height="104" />
          <line x1="71" y1="4" x2="71" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="88" y="30" width="50" height="88" />
          <rect x="132" y="18" width="48" height="100" />
          <line x1="156" y1="8" x2="156" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="174" y="34" width="54" height="84" />
          <rect x="222" y="22" width="50" height="96" />
          <line x1="247" y1="12" x2="247" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="266" y="38" width="52" height="80" />
          <rect x="312" y="46" width="54" height="72" />
          <rect x="360" y="54" width="50" height="64" />

          {/* Center background mid-rises (urban backdrop behind villas) */}
          <rect x="404" y="58" width="54" height="60" />
          <rect x="452" y="52" width="50" height="66" />
          <line x1="477" y1="42" x2="477" y2="52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <rect x="496" y="56" width="54" height="62" />
          <rect x="544" y="48" width="56" height="70" />
          <line x1="572" y1="38" x2="572" y2="48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <rect x="594" y="54" width="52" height="64" />
          <rect x="640" y="50" width="54" height="68" />
          <line x1="667" y1="40" x2="667" y2="50" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <rect x="688" y="56" width="52" height="62" />
          <rect x="734" y="52" width="50" height="66" />
          <rect x="778" y="46" width="52" height="72" />

          {/* Right background skyline */}
          <rect x="824" y="38" width="50" height="80" />
          <rect x="868" y="24" width="52" height="94" />
          <line x1="894" y1="14" x2="894" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="914" y="32" width="52" height="86" />
          <rect x="960" y="16" width="48" height="102" />
          <line x1="984" y1="6" x2="984" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="1002" y="30" width="52" height="88" />
          <rect x="1048" y="18" width="48" height="100" />
          <line x1="1072" y1="8" x2="1072" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="1090" y="28" width="54" height="90" />
          <rect x="1138" y="20" width="62" height="98" />
        </g>

        {/* ======================================================== */}
        {/* LAYER 2: CONTINUOUS FOREGROUND CRISP ARCHITECTURAL BLOCKS */}
        {/* ======================================================== */}
        <g stroke="currentColor" strokeWidth="1.3" fill="var(--background)" strokeLinejoin="round">

          {/* 1. Left Edge Skyscraper (x: 0, w: 64, h: 92) */}
          <rect x="0" y="26" width="64" height="92" />
          <line x1="16" y1="36" x2="16" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="32" y1="36" x2="32" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="48" y1="36" x2="48" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 2. Left Mega Tower with Setback Crown (x: 58, w: 68, h: 104) */}
          <rect x="58" y="24" width="68" height="94" />
          <rect x="72" y="14" width="40" height="10" />
          <line x1="92" y1="2" x2="92" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="58" y1="42" x2="126" y2="42" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="58" y1="60" x2="126" y2="60" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="58" y1="78" x2="126" y2="78" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="58" y1="96" x2="126" y2="96" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 3. Left Angled Glass Tower (x: 120, w: 62, h: 84) */}
          <path d="M 120 118 L 120 34 L 182 44 L 182 118 Z" />
          <line x1="140" y1="44" x2="140" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />
          <line x1="162" y1="48" x2="162" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />

          {/* 4. Left Commercial Tower with Crown (x: 176, w: 66, h: 88) */}
          <rect x="176" y="30" width="66" height="88" />
          <line x1="198" y1="18" x2="198" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="220" y1="18" x2="220" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="176" y1="48" x2="242" y2="48" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="176" y1="66" x2="242" y2="66" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="176" y1="84" x2="242" y2="84" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="176" y1="102" x2="242" y2="102" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 5. Left Stepped Tower (x: 236, w: 64, h: 76) */}
          <rect x="236" y="42" width="64" height="76" />
          <rect x="246" y="34" width="36" height="8" />
          <line x1="256" y1="52" x2="256" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="280" y1="52" x2="280" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 6. Transition Commercial Mid-Rise (x: 294, w: 64, h: 66) */}
          <rect x="294" y="52" width="64" height="66" />
          <line x1="294" y1="68" x2="358" y2="68" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="294" y1="84" x2="358" y2="84" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="294" y1="100" x2="358" y2="100" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 7. Stepped Modern Townhouse / Flats (x: 352, w: 72, h: 54) */}
          <rect x="352" y="64" width="72" height="54" />
          <rect x="352" y="58" width="42" height="6" />
          <line x1="372" y1="74" x2="372" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="400" y1="74" x2="400" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 8. Modern Luxury Villa - Cantilever & Terrace (x: 418, w: 78, h: 44) */}
          <rect x="418" y="74" width="78" height="44" />
          {/* Cantilevered 2nd floor */}
          <rect x="414" y="70" width="56" height="20" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
          <line x1="422" y1="80" x2="462" y2="80" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
          <rect x="430" y="98" width="16" height="20" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <line x1="458" y1="102" x2="486" y2="102" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />

          {/* 9. Central Architectural Villa - Core Estate (x: 490, w: 86, h: 46) */}
          <rect x="490" y="72" width="86" height="46" />
          {/* Subtle pergola structure on roof */}
          <line x1="496" y1="65" x2="536" y2="65" stroke="currentColor" strokeWidth="1.5" />
          <line x1="502" y1="65" x2="502" y2="72" stroke="currentColor" strokeWidth="1" />
          <line x1="514" y1="65" x2="514" y2="72" stroke="currentColor" strokeWidth="1" />
          <line x1="526" y1="65" x2="526" y2="72" stroke="currentColor" strokeWidth="1" />
          {/* Contemporary geometric window blocks */}
          <rect x="500" y="80" width="30" height="15" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <rect x="540" y="80" width="26" height="15" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <rect x="522" y="100" width="18" height="18" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />

          {/* 10. Contemporary Two-Story Residence (x: 570, w: 80, h: 44) */}
          <rect x="570" y="74" width="80" height="44" />
          <rect x="602" y="68" width="44" height="6" />
          <line x1="582" y1="84" x2="582" y2="112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="610" y1="84" x2="610" y2="112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="634" y1="84" x2="634" y2="112" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* 11. Modern Townhouse / Apartment Block (x: 644, w: 74, h: 54) */}
          <rect x="644" y="64" width="74" height="54" />
          <rect x="674" y="58" width="44" height="6" />
          <line x1="666" y1="74" x2="666" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="694" y1="74" x2="694" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 12. Transition Commercial Mid-Rise (x: 712, w: 64, h: 66) */}
          <rect x="712" y="52" width="64" height="66" />
          <line x1="712" y1="68" x2="776" y2="68" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="712" y1="84" x2="776" y2="84" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="712" y1="100" x2="776" y2="100" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 13. Right Stepped Tower (x: 770, w: 66, h: 78) */}
          <rect x="770" y="40" width="66" height="78" />
          <rect x="786" y="32" width="36" height="8" />
          <line x1="790" y1="50" x2="790" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="816" y1="50" x2="816" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 14. Right Commercial Tower with Crown (x: 830, w: 68, h: 88) */}
          <rect x="830" y="30" width="68" height="88" />
          <line x1="852" y1="18" x2="852" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="876" y1="18" x2="876" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="830" y1="48" x2="898" y2="48" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="830" y1="66" x2="898" y2="66" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="830" y1="84" x2="898" y2="84" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="830" y1="102" x2="898" y2="102" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 15. Right Angled Glass Tower (x: 892, w: 64, h: 84) */}
          <path d="M 892 118 L 892 44 L 956 34 L 956 118 Z" />
          <line x1="914" y1="48" x2="914" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />
          <line x1="936" y1="44" x2="936" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />

          {/* 16. Right Mega Tower with Spire Crown (x: 950, w: 72, h: 106) */}
          <rect x="950" y="22" width="72" height="96" />
          <rect x="966" y="12" width="40" height="10" />
          <line x1="986" y1="0" x2="986" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="950" y1="40" x2="1022" y2="40" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="950" y1="58" x2="1022" y2="58" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="950" y1="76" x2="1022" y2="76" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="950" y1="94" x2="1022" y2="94" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 17. Right Corporate High-Rise (x: 1016, w: 68, h: 92) */}
          <rect x="1016" y="26" width="68" height="92" />
          <line x1="1036" y1="36" x2="1036" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1054" y1="36" x2="1054" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1072" y1="36" x2="1072" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 18. Right Edge Anchor Tower (x: 1078, w: 122, h: 88) */}
          <rect x="1078" y="30" width="122" height="88" />
          <rect x="1110" y="20" width="58" height="10" />
          <line x1="1139" y1="8" x2="1139" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1100" y1="44" x2="1100" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />
          <line x1="1138" y1="44" x2="1138" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />
          <line x1="1176" y1="44" x2="1176" y2="112" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
