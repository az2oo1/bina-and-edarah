import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 text-foreground/85 dark:text-foreground/80" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, High-Density 2D Line Art)    */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 620 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Baseline Horizon */}
        <line x1="0" y1="115" x2="620" y2="115" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />

        {/* Soft Silhouette Background Layer */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.22" fill="currentColor" fillOpacity="0.05">
          <rect x="20" y="32" width="34" height="83" />
          <rect x="75" y="18" width="36" height="97" />
          <line x1="93" y1="6" x2="93" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="150" y="44" width="38" height="71" />
          <rect x="432" y="44" width="38" height="71" />
          <rect x="509" y="18" width="36" height="97" />
          <line x1="527" y1="6" x2="527" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="566" y="32" width="34" height="83" />
        </g>

        {/* Masterpiece Foreground 2D Architectural Drawing */}
        <g stroke="currentColor" strokeWidth="1.1" fill="var(--background)" strokeLinejoin="round">
          
          {/* 1. Left Iconic Curved Pavilion (Spiral Ribbon Drum) */}
          <ellipse cx="32" cy="56" rx="26" ry="6.5" />
          <path d="M 6 56 L 6 115 L 58 115 L 58 56 Z" />
          <path d="M 6 68 Q 32 75 58 68" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 6 80 Q 32 87 58 80" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 6 92 Q 32 99 58 92" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 6 104 Q 32 111 58 104" stroke="currentColor" strokeWidth="0.9" fill="none" />
          {/* Vertical mullions in each ribbon */}
          {[14, 23, 32, 41, 50].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="58" x2={x} y2="114" stroke="currentColor" strokeWidth="0.7" opacity="0.65" />
            </React.Fragment>
          ))}
          {/* Entrance */}
          <rect x="24" y="103" width="16" height="12" stroke="currentColor" strokeWidth="0.9" />
          <line x1="32" y1="103" x2="32" y2="115" stroke="currentColor" strokeWidth="0.7" />

          {/* 2. Left Landmark Skyscraper (Angled Crown & Antennas - 44w x 95h) */}
          <path d="M 62 115 L 62 32 L 106 20 L 106 115 Z" />
          {/* Rooftop Antenna Masts */}
          <line x1="72" y1="8" x2="72" y2="29" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="96" y1="4" x2="96" y2="23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          {/* Structural Vertical Piers */}
          <line x1="76" y1="28" x2="76" y2="115" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="92" y1="24" x2="92" y2="115" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          {/* Dense Window Floors */}
          {[42, 54, 66, 78, 90, 102].map((y) => (
            <React.Fragment key={y}>
              <line x1="62" y1={y} x2="106" y2={y} stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
              <rect x="65" y={y - 8} width="8" height="6" stroke="currentColor" strokeWidth="0.7" />
              <rect x="80" y={y - 8} width="8" height="6" stroke="currentColor" strokeWidth="0.7" />
              <rect x="95" y={y - 8} width="8" height="6" stroke="currentColor" strokeWidth="0.7" />
            </React.Fragment>
          ))}
          <rect x="78" y="103" width="12" height="12" stroke="currentColor" strokeWidth="0.9" />

          {/* 3. Mid-Rise Grid Building (38w x 67h) */}
          <rect x="110" y="48" width="38" height="67" />
          <rect x="120" y="42" width="18" height="6" />
          <line x1="129" y1="36" x2="129" y2="42" stroke="currentColor" strokeWidth="1" />
          {/* Array of 12 Individual Framed Windows */}
          {[56, 68, 80, 92].map((y) => (
            <React.Fragment key={y}>
              <rect x="114" y={y} width="7" height="8" stroke="currentColor" strokeWidth="0.8" />
              <line x1="117.5" y1={y} x2="117.5" y2={y + 8} stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
              <rect x="125.5" y={y} width="7" height="8" stroke="currentColor" strokeWidth="0.8" />
              <line x1="129" y1={y} x2="129" y2={y + 8} stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
              <rect x="137" y={y} width="7" height="8" stroke="currentColor" strokeWidth="0.8" />
              <line x1="140.5" y1={y} x2="140.5" y2={y + 8} stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
            </React.Fragment>
          ))}
          <rect x="122" y="103" width="14" height="12" stroke="currentColor" strokeWidth="0.9" />

          {/* 4. Stepped Townhouse with Balcony Railings (42w x 55h) */}
          <rect x="152" y="60" width="42" height="55" />
          <rect x="152" y="54" width="26" height="6" />
          {/* Balconies */}
          <line x1="156" y1="74" x2="178" y2="74" stroke="currentColor" strokeWidth="1.1" />
          <line x1="156" y1="78" x2="178" y2="78" stroke="currentColor" strokeWidth="0.6" />
          <rect x="160" y="66" width="14" height="8" stroke="currentColor" strokeWidth="0.8" />
          <line x1="156" y1="94" x2="178" y2="94" stroke="currentColor" strokeWidth="1.1" />
          <line x1="156" y1="98" x2="178" y2="98" stroke="currentColor" strokeWidth="0.6" />
          <rect x="160" y="86" width="14" height="8" stroke="currentColor" strokeWidth="0.8" />
          <line x1="180" y1="60" x2="180" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="184" y="70" width="8" height="15" stroke="currentColor" strokeWidth="0.8" />
          <rect x="184" y="94" width="8" height="21" stroke="currentColor" strokeWidth="0.8" />

          {/* 5. Modern Luxury Villa with Cantilever & Pergola (46w x 48h) */}
          <rect x="198" y="67" width="46" height="48" />
          <rect x="194" y="58" width="34" height="20" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          {/* Pergola */}
          <line x1="196" y1="50" x2="226" y2="50" stroke="currentColor" strokeWidth="1.3" />
          <line x1="202" y1="50" x2="202" y2="58" stroke="currentColor" strokeWidth="0.8" />
          <line x1="212" y1="50" x2="212" y2="58" stroke="currentColor" strokeWidth="0.8" />
          <line x1="222" y1="50" x2="222" y2="58" stroke="currentColor" strokeWidth="0.8" />
          <line x1="198" y1="68" x2="224" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
          <rect x="202" y="86" width="14" height="29" stroke="currentColor" strokeWidth="0.9" />
          <rect x="224" y="86" width="14" height="16" stroke="currentColor" strokeWidth="0.8" />

          {/* 6. Left Detailed Date Palms (2 Layered Palm Trees) */}
          <g>
            <line x1="254" y1="115" x2="254" y2="64" stroke="currentColor" strokeWidth="2" />
            <line x1="251" y1="74" x2="257" y2="74" stroke="currentColor" strokeWidth="0.8" />
            <line x1="251" y1="84" x2="257" y2="84" stroke="currentColor" strokeWidth="0.8" />
            <line x1="251" y1="94" x2="257" y2="94" stroke="currentColor" strokeWidth="0.8" />
            <line x1="251" y1="104" x2="257" y2="104" stroke="currentColor" strokeWidth="0.8" />
            {/* Feathery arching fronds */}
            <path d="M 254 64 Q 238 52 222 58" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 254 64 Q 242 42 232 46" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 254 64 Q 254 36 254 34" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 254 64 Q 266 42 276 46" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 254 64 Q 270 52 286 58" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* 7. Centerpiece: Traditional Royal Marquee / Luxury Pavilion (بيت شعر ملكي فخم ومتقن) */}
          <g>
            {/* Main Tent Canopy (Proportions: 76w x 44h) */}
            <polygon points="272,115 272,88 296,68 324,68 348,88 348,115" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" />
            {/* King Poles & Finials */}
            <line x1="296" y1="68" x2="324" y2="68" stroke="currentColor" strokeWidth="1.4" />
            <line x1="296" y1="56" x2="296" y2="68" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="296" cy="54" r="2" fill="currentColor" />
            <line x1="324" y1="56" x2="324" y2="68" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="324" cy="54" r="2" fill="currentColor" />
            {/* Hip ridges */}
            <line x1="272" y1="88" x2="296" y2="68" stroke="currentColor" strokeWidth="1.2" />
            <line x1="348" y1="88" x2="324" y2="68" stroke="currentColor" strokeWidth="1.2" />
            {/* Authentic Woven Stripes */}
            <line x1="272" y1="94" x2="348" y2="94" stroke="currentColor" strokeWidth="1.1" strokeDasharray="5 2.5" />
            <line x1="272" y1="100" x2="348" y2="100" stroke="currentColor" strokeWidth="1.1" strokeDasharray="5 2.5" />
            <line x1="272" y1="106" x2="348" y2="106" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
            {/* Entrance drape & hanging brass lantern */}
            <path d="M 304 115 L 310 92 L 316 115" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <line x1="310" y1="68" x2="310" y2="92" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            <circle cx="310" cy="85" r="2.2" fill="currentColor" opacity="0.85" />
            {/* Guy-Ropes to Stakes */}
            <line x1="272" y1="88" x2="260" y2="115" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
            <line x1="348" y1="88" x2="360" y2="115" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
          </g>

          {/* 8. Right Detailed Date Palms */}
          <g>
            <line x1="366" y1="115" x2="366" y2="64" stroke="currentColor" strokeWidth="2" />
            <line x1="363" y1="74" x2="369" y2="74" stroke="currentColor" strokeWidth="0.8" />
            <line x1="363" y1="84" x2="369" y2="84" stroke="currentColor" strokeWidth="0.8" />
            <line x1="363" y1="94" x2="369" y2="94" stroke="currentColor" strokeWidth="0.8" />
            <line x1="363" y1="104" x2="369" y2="104" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 366 64 Q 350 52 334 58" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 366 64 Q 354 42 344 46" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 366 64 Q 366 36 366 34" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 366 64 Q 378 42 388 46" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 366 64 Q 382 52 398 58" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* 9. Right Modern Luxury Villa (46w x 48h) */}
          <rect x="376" y="67" width="46" height="48" />
          <rect x="392" y="58" width="34" height="20" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="394" y1="50" x2="424" y2="50" stroke="currentColor" strokeWidth="1.3" />
          <line x1="400" y1="50" x2="400" y2="58" stroke="currentColor" strokeWidth="0.8" />
          <line x1="410" y1="50" x2="410" y2="58" stroke="currentColor" strokeWidth="0.8" />
          <line x1="420" y1="50" x2="420" y2="58" stroke="currentColor" strokeWidth="0.8" />
          <line x1="396" y1="68" x2="422" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
          <rect x="382" y="86" width="14" height="16" stroke="currentColor" strokeWidth="0.8" />
          <rect x="404" y="86" width="14" height="29" stroke="currentColor" strokeWidth="0.9" />

          {/* 10. Right Curved Corner Drum Building (42w x 55h) */}
          <rect x="426" y="60" width="42" height="55" />
          <path d="M 426 60 Q 447 52 468 60" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <line x1="426" y1="74" x2="468" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
          <line x1="426" y1="88" x2="468" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
          <line x1="426" y1="102" x2="468" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
          <line x1="440" y1="60" x2="440" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="454" y1="60" x2="454" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 11. Right Mid-Rise Grid Building (38w x 67h) */}
          <rect x="472" y="48" width="38" height="67" />
          <rect x="482" y="42" width="18" height="6" />
          {[56, 68, 80, 92].map((y) => (
            <React.Fragment key={y}>
              <rect x="476" y={y} width="7" height="8" stroke="currentColor" strokeWidth="0.8" />
              <rect x="487.5" y={y} width="7" height="8" stroke="currentColor" strokeWidth="0.8" />
              <rect x="499" y={y} width="7" height="8" stroke="currentColor" strokeWidth="0.8" />
            </React.Fragment>
          ))}
          <rect x="484" y="103" width="14" height="12" stroke="currentColor" strokeWidth="0.9" />

          {/* 12. Right Grand Needle Spire Skyscraper (44w x 105h) */}
          <rect x="514" y="24" width="44" height="91" />
          <rect x="524" y="12" width="24" height="12" />
          <line x1="536" y1="-8" x2="536" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="530" y1="0" x2="542" y2="0" stroke="currentColor" strokeWidth="1.1" />
          {/* Vertical Louver Ribs */}
          <line x1="525" y1="24" x2="525" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <line x1="536" y1="24" x2="536" y2="115" stroke="currentColor" strokeWidth="0.9" opacity="0.8" />
          <line x1="547" y1="24" x2="547" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          {[38, 52, 66, 80, 94].map((y) => (
            <React.Fragment key={y}>
              <line x1="514" y1={y} x2="558" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="526" y="101" width="20" height="14" stroke="currentColor" strokeWidth="0.9" />

          {/* 13. Right Curved Cultural Pavilion (Spiral Ribbon Drum) */}
          <ellipse cx="588" cy="56" rx="26" ry="6.5" />
          <path d="M 562 56 L 562 115 L 614 115 L 614 56 Z" />
          <path d="M 562 68 Q 588 75 614 68" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 562 80 Q 588 87 614 80" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 562 92 Q 588 99 614 92" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 562 104 Q 588 111 614 104" stroke="currentColor" strokeWidth="0.9" fill="none" />
          {[570, 579, 588, 597, 606].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="58" x2={x} y2="114" stroke="currentColor" strokeWidth="0.7" opacity="0.65" />
            </React.Fragment>
          ))}
          <rect x="580" y="103" width="16" height="12" stroke="currentColor" strokeWidth="0.9" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP SKYLINE (2000x160 Vector, Unrivaled 2D Architectural Detail)      */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 2000 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="150" x2="2000" y2="150" stroke="currentColor" strokeWidth="1.8" opacity="0.9" />

        {/* Depth Silhouette Background Layer */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.2" fill="currentColor" fillOpacity="0.05">
          <rect x="30" y="34" width="45" height="116" />
          <rect x="120" y="20" width="48" height="130" />
          <line x1="144" y1="6" x2="144" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="220" y="42" width="46" height="108" />
          <rect x="320" y="24" width="50" height="126" />
          <line x1="345" y1="8" x2="345" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="430" y="52" width="52" height="98" />
          <rect x="540" y="38" width="50" height="112" />
          <rect x="650" y="60" width="54" height="90" />
          <rect x="760" y="50" width="52" height="100" />
          <rect x="870" y="68" width="56" height="82" />
          
          {/* Backdrop behind center pavilion */}
          <rect x="970" y="80" width="60" height="70" />

          <rect x="1074" y="68" width="56" height="82" />
          <rect x="1188" y="50" width="52" height="100" />
          <rect x="1296" y="60" width="54" height="90" />
          <rect x="1410" y="38" width="50" height="112" />
          <rect x="1518" y="52" width="52" height="98" />
          <rect x="1630" y="24" width="50" height="126" />
          <line x1="1655" y1="8" x2="1655" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1734" y="42" width="46" height="108" />
          <rect x="1832" y="20" width="48" height="130" />
          <line x1="1856" y1="6" x2="1856" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1925" y="34" width="45" height="116" />
        </g>

        {/* Foreground Layer: Pristine Hand-Drawn Architectural 2D Linework */}
        <g stroke="currentColor" strokeWidth="1.15" fill="var(--background)" strokeLinejoin="round">
          
          {/* ============================================================== */}
          {/* ZONE 1: FAR LEFT - Iconic Curved Center & Landmark Skyscrapers  */}
          {/* ============================================================== */}
          
          {/* 1. Iconic Curved Modern Cultural Center (Exact photo match: 72w x 80h) */}
          <ellipse cx="40" cy="74" rx="36" ry="9" />
          <path d="M 4 74 L 4 150 L 76 150 L 76 74 Z" />
          <path d="M 4 88 Q 40 96 76 88" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 102 Q 40 110 76 102" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 116 Q 40 124 76 116" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 130 Q 40 138 76 130" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 142 Q 40 148 76 142" stroke="currentColor" strokeWidth="0.9" fill="none" />
          {/* Dense vertical mullions */}
          {[12, 20, 28, 36, 44, 52, 60, 68].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="76" x2={x} y2="149" stroke="currentColor" strokeWidth="0.65" opacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="28" y="132" width="24" height="18" stroke="currentColor" strokeWidth="1" />
          <line x1="40" y1="132" x2="40" y2="150" stroke="currentColor" strokeWidth="0.7" />

          {/* 2. Transition High-Rise with Corner Drum (58w x 100h) */}
          <rect x="76" y="50" width="58" height="100" />
          <rect x="86" y="42" width="38" height="8" />
          <line x1="105" y1="32" x2="105" y2="42" stroke="currentColor" strokeWidth="1.3" />
          {[62, 76, 90, 104, 118, 132].map((y) => (
            <React.Fragment key={y}>
              <line x1="76" y1={y} x2="134" y2={y} stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
              <rect x="82" y={y - 8} width="9" height="7" stroke="currentColor" strokeWidth="0.7" />
              <rect x="95" y={y - 8} width="9" height="7" stroke="currentColor" strokeWidth="0.7" />
              <rect x="108" y={y - 8} width="9" height="7" stroke="currentColor" strokeWidth="0.7" />
              <rect x="121" y={y - 8} width="9" height="7" stroke="currentColor" strokeWidth="0.7" />
            </React.Fragment>
          ))}
          <rect x="96" y="134" width="18" height="16" stroke="currentColor" strokeWidth="0.9" />

          {/* 3. Stepped High-Rise Tower with Dual Spires (60w x 120h) */}
          <rect x="134" y="30" width="60" height="120" />
          <line x1="148" y1="12" x2="148" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="180" y1="12" x2="180" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="152" y1="46" x2="152" y2="142" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="176" y1="46" x2="176" y2="142" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          {[48, 66, 84, 102, 120, 136].map((y) => (
            <React.Fragment key={y}>
              <line x1="134" y1={y} x2="194" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="154" y="132" width="20" height="18" stroke="currentColor" strokeWidth="1" />

          {/* 4. Left Landmark Skyscraper (Angled Crown & Antennas - 62w x 135h) */}
          <path d="M 194 150 L 194 32 L 256 16 L 256 150 Z" />
          <line x1="208" y1="4" x2="208" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="242" y1="-2" x2="242" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="214" y1="26" x2="214" y2="150" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
          <line x1="236" y1="20" x2="236" y2="150" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
          {[44, 58, 72, 86, 100, 114, 128, 140].map((y) => (
            <React.Fragment key={y}>
              <line x1="194" y1={y} x2="256" y2={y} stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
              <rect x="198" y={y - 9} width="11" height="8" stroke="currentColor" strokeWidth="0.7" />
              <rect x="219" y={y - 9} width="12" height="8" stroke="currentColor" strokeWidth="0.7" />
              <rect x="241" y={y - 9} width="11" height="8" stroke="currentColor" strokeWidth="0.7" />
            </React.Fragment>
          ))}
          <rect x="215" y="132" width="20" height="18" stroke="currentColor" strokeWidth="1" />

          {/* 5. Modern Commercial Office Block with Sunshades (56w x 102h) */}
          <rect x="256" y="48" width="56" height="102" />
          {[66, 84, 102, 120, 136].map((y) => (
            <React.Fragment key={y}>
              <line x1="256" y1={y} x2="312" y2={y} stroke="currentColor" strokeWidth="1" opacity="0.8" />
              <line x1="256" y1={y + 3} x2="312" y2={y + 3} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </React.Fragment>
          ))}
          <line x1="274" y1="48" x2="274" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="294" y1="48" x2="294" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 6. Curved Corner Plaza Building (56w x 86h) */}
          <rect x="312" y="64" width="56" height="86" />
          <path d="M 312 64 Q 340 54 368 64" stroke="currentColor" strokeWidth="1.3" fill="none" />
          {[80, 96, 112, 128, 142].map((y) => (
            <React.Fragment key={y}>
              <line x1="312" y1={y} x2="368" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <line x1="330" y1="64" x2="330" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="350" y1="64" x2="350" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 7. Commercial Gallery with Window Arrays (56w x 92h) */}
          <rect x="368" y="58" width="56" height="92" />
          <rect x="378" y="50" width="36" height="8" />
          {[72, 88, 104, 120, 134].map((y) => (
            <React.Fragment key={y}>
              <rect x="374" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="387" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="400" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="412" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
            </React.Fragment>
          ))}
          <rect x="388" y="132" width="16" height="18" stroke="currentColor" strokeWidth="0.9" />

          {/* 8. Modern Curved S-Facade Building (Photo Match: 60w x 88h) */}
          <rect x="424" y="62" width="60" height="88" />
          <path d="M 424 62 Q 454 54 484 62" stroke="currentColor" strokeWidth="1.3" fill="none" />
          {[76, 92, 108, 124, 138].map((y) => (
            <React.Fragment key={y}>
              <path d={`M 424 ${y} Q 454 ${y - 6} 484 ${y}`} stroke="currentColor" strokeWidth="0.85" fill="none" />
            </React.Fragment>
          ))}
          {[436, 448, 460, 472].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="62" x2={x} y2="150" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
            </React.Fragment>
          ))}

          {/* 9. Stepped Townhouses with Balconies (58w x 84h) */}
          <rect x="484" y="66" width="58" height="84" />
          <rect x="484" y="58" width="36" height="8" />
          <line x1="492" y1="80" x2="520" y2="80" stroke="currentColor" strokeWidth="1.2" />
          <line x1="492" y1="85" x2="520" y2="85" stroke="currentColor" strokeWidth="0.65" />
          <rect x="496" y="70" width="20" height="9" stroke="currentColor" strokeWidth="0.8" />
          <line x1="492" y1="106" x2="520" y2="106" stroke="currentColor" strokeWidth="1.2" />
          <line x1="492" y1="111" x2="520" y2="111" stroke="currentColor" strokeWidth="0.65" />
          <rect x="496" y="96" width="20" height="9" stroke="currentColor" strokeWidth="0.8" />
          <line x1="524" y1="66" x2="524" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="528" y="78" width="10" height="20" stroke="currentColor" strokeWidth="0.8" />
          <rect x="528" y="106" width="10" height="24" stroke="currentColor" strokeWidth="0.8" />

          {/* 10. Modern Townhouses with Pergola Roof (58w x 78h) */}
          <rect x="542" y="72" width="58" height="78" />
          <line x1="548" y1="62" x2="594" y2="62" stroke="currentColor" strokeWidth="1.5" />
          <line x1="554" y1="62" x2="554" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="568" y1="62" x2="568" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="582" y1="62" x2="582" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <rect x="550" y="86" width="18" height="16" stroke="currentColor" strokeWidth="0.9" />
          <rect x="576" y="86" width="18" height="16" stroke="currentColor" strokeWidth="0.9" />
          <rect x="562" y="118" width="18" height="32" stroke="currentColor" strokeWidth="0.9" />

          {/* 11. Mid-Rise Office Block (54w x 90h) */}
          <rect x="600" y="60" width="54" height="90" />
          {[74, 90, 106, 122, 138].map((y) => (
            <React.Fragment key={y}>
              <line x1="600" y1={y} x2="654" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <rect x="606" y={y - 9} width="10" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="622" y={y - 9} width="10" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="638" y={y - 9} width="10" height="8" stroke="currentColor" strokeWidth="0.75" />
            </React.Fragment>
          ))}

          {/* 12. Modern Commercial Block (56w x 84h) */}
          <rect x="654" y="66" width="56" height="84" />
          {[82, 98, 114, 130, 144].map((y) => (
            <React.Fragment key={y}>
              <line x1="654" y1={y} x2="710" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <line x1="672" y1="66" x2="672" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="692" y1="66" x2="692" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 13. Stepped Townhouses (54w x 78h) */}
          <rect x="710" y="72" width="54" height="78" />
          <rect x="710" y="66" width="32" height="6" />
          <rect x="718" y="82" width="16" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="742" y="82" width="16" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="728" y="112" width="18" height="25" stroke="currentColor" strokeWidth="0.9" />

          {/* 14. Modern Townhouses (56w x 74h) */}
          <rect x="764" y="76" width="56" height="74" />
          <line x1="764" y1="96" x2="820" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="764" y1="118" x2="820" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="792" y1="76" x2="792" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 15. Contemporary Villa with Cantilever (58w x 72h) */}
          <rect x="820" y="78" width="58" height="72" />
          <rect x="816" y="70" width="42" height="24" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="822" y1="82" x2="854" y2="82" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="830" y="110" width="18" height="26" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="856" y="110" width="18" height="18" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 16. Luxury Villa with Cantilever (60w x 72h) */}
          <rect x="878" y="78" width="60" height="72" />
          <rect x="874" y="70" width="44" height="24" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="880" y1="82" x2="914" y2="82" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="888" y="110" width="20" height="28" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="916" y="110" width="18" height="18" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 17. Left Architectural Date Palms (2 Detailed Date Palm Trees) */}
          <g>
            <line x1="952" y1="150" x2="952" y2="82" stroke="currentColor" strokeWidth="2.2" />
            <line x1="948" y1="96" x2="956" y2="96" stroke="currentColor" strokeWidth="0.9" />
            <line x1="948" y1="110" x2="956" y2="110" stroke="currentColor" strokeWidth="0.9" />
            <line x1="948" y1="124" x2="956" y2="124" stroke="currentColor" strokeWidth="0.9" />
            <line x1="948" y1="138" x2="956" y2="138" stroke="currentColor" strokeWidth="0.9" />
            {/* Feathery fronds */}
            <path d="M 952 82 Q 930 68 910 76" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 952 82 Q 936 56 924 62" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 952 82 Q 952 48 952 45" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 952 82 Q 968 56 980 62" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 952 82 Q 974 68 994 76" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>

          {/* ============================================================== */}
          {/* ZONE 2: CENTERPIECE - Traditional Royal Marquee / Luxury Tent    */}
          {/* (Proportion: 96w x 56h - Authentic, beautiful, perfectly scaled)*/}
          {/* ============================================================== */}
          <g>
            {/* Main Tent Canopy (x = 952 to 1048, centered at x = 1000) */}
            <polygon points="952,150 952,112 978,92 1022,92 1048,112 1048,150" fill="var(--background)" stroke="currentColor" strokeWidth="1.6" />
            {/* Ridge & Ornate Finials */}
            <line x1="978" y1="92" x2="1022" y2="92" stroke="currentColor" strokeWidth="1.6" />
            <line x1="978" y1="78" x2="978" y2="92" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="978" cy="76" r="2.2" fill="currentColor" />
            <line x1="1022" y1="78" x2="1022" y2="92" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="1022" cy="76" r="2.2" fill="currentColor" />
            {/* Center crown pole */}
            <line x1="1000" y1="84" x2="1000" y2="92" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="1000" cy="82" r="1.8" fill="currentColor" />
            {/* Hip ridges */}
            <line x1="952" y1="112" x2="978" y2="92" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1048" y1="112" x2="1022" y2="92" stroke="currentColor" strokeWidth="1.2" />
            {/* Authentic Woven Stripes */}
            <line x1="952" y1="119" x2="1048" y2="119" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 3" />
            <line x1="952" y1="126" x2="1048" y2="126" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 3" />
            <line x1="952" y1="133" x2="1048" y2="133" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
            <line x1="952" y1="140" x2="1048" y2="140" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
            {/* Drape Entrance & Hanging Brass Lantern */}
            <path d="M 992 150 L 1000 120 L 1008 150" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <line x1="1000" y1="92" x2="1000" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <circle cx="1000" cy="112" r="2.6" fill="currentColor" opacity="0.85" />
            {/* Guy-Ropes to Stakes */}
            <line x1="952" y1="112" x2="938" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="1048" y1="112" x2="1062" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* 18. Right Architectural Date Palms */}
          <g>
            <line x1="1076" y1="150" x2="1076" y2="82" stroke="currentColor" strokeWidth="2.2" />
            <line x1="1072" y1="96" x2="1080" y2="96" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1072" y1="110" x2="1080" y2="110" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1072" y1="124" x2="1080" y2="124" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1072" y1="138" x2="1080" y2="138" stroke="currentColor" strokeWidth="0.9" />
            <path d="M 1076 82 Q 1054 68 1034 76" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1076 82 Q 1060 56 1048 62" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1076 82 Q 1076 48 1076 45" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 1076 82 Q 1092 56 1104 62" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1076 82 Q 1098 68 1118 76" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>

          {/* ============================================================== */}
          {/* ZONE 3: MID-RIGHT TO FAR RIGHT - Towering Spires & City Horizon */}
          {/* ============================================================== */}

          {/* 19. Luxury Villa with Cantilever (60w x 72h) */}
          <rect x="1090" y="78" width="60" height="72" />
          <rect x="1102" y="70" width="44" height="24" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="1108" y1="82" x2="1142" y2="82" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="1100" y="110" width="20" height="28" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="1128" y="110" width="18" height="18" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 20. Contemporary Villa with Cantilever (58w x 72h) */}
          <rect x="1150" y="78" width="58" height="72" />
          <rect x="1162" y="70" width="42" height="24" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="1168" y1="82" x2="1200" y2="82" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="1160" y="110" width="18" height="26" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="1184" y="110" width="18" height="18" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 21. Modern Townhouses (56w x 74h) */}
          <rect x="1208" y="76" width="56" height="74" />
          <line x1="1208" y1="96" x2="1264" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1208" y1="118" x2="1264" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1236" y1="76" x2="1236" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 22. Stepped Townhouses (54w x 78h) */}
          <rect x="1264" y="72" width="54" height="78" />
          <rect x="1286" y="66" width="32" height="6" />
          <rect x="1272" y="82" width="16" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1296" y="82" width="16" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1282" y="112" width="18" height="25" stroke="currentColor" strokeWidth="0.9" />

          {/* 23. Modern Commercial Block (56w x 84h) */}
          <rect x="1318" y="66" width="56" height="84" />
          {[82, 98, 114, 130, 144].map((y) => (
            <React.Fragment key={y}>
              <line x1="1318" y1={y} x2="1374" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <line x1="1336" y1="66" x2="1336" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1356" y1="66" x2="1356" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 24. Mid-Rise Office Block (54w x 90h) */}
          <rect x="1374" y="60" width="54" height="90" />
          {[74, 90, 106, 122, 138].map((y) => (
            <React.Fragment key={y}>
              <line x1="1374" y1={y} x2="1428" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <rect x="1380" y={y - 9} width="10" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="1396" y={y - 9} width="10" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="1412" y={y - 9} width="10" height="8" stroke="currentColor" strokeWidth="0.75" />
            </React.Fragment>
          ))}

          {/* 25. Modern Townhouses with Pergola Roof (58w x 78h) */}
          <rect x="1428" y="72" width="58" height="78" />
          <line x1="1434" y1="62" x2="1480" y2="62" stroke="currentColor" strokeWidth="1.5" />
          <line x1="1440" y1="62" x2="1440" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1454" y1="62" x2="1454" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1468" y1="62" x2="1468" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1436" y="86" width="18" height="16" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1462" y="86" width="18" height="16" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1448" y="118" width="18" height="32" stroke="currentColor" strokeWidth="0.9" />

          {/* 26. Stepped Townhouses with Balconies (58w x 84h) */}
          <rect x="1486" y="66" width="58" height="84" />
          <rect x="1508" y="58" width="36" height="8" />
          <line x1="1514" y1="80" x2="1542" y2="80" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1514" y1="85" x2="1542" y2="85" stroke="currentColor" strokeWidth="0.65" />
          <rect x="1518" y="70" width="20" height="9" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1514" y1="106" x2="1542" y2="106" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1514" y1="111" x2="1542" y2="111" stroke="currentColor" strokeWidth="0.65" />
          <rect x="1518" y="96" width="20" height="9" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1510" y1="66" x2="1510" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="1492" y="78" width="10" height="20" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1492" y="106" width="10" height="24" stroke="currentColor" strokeWidth="0.8" />

          {/* 27. Modern Curved S-Facade Building (Photo Match: 60w x 88h) */}
          <rect x="1544" y="62" width="60" height="88" />
          <path d="M 1544 62 Q 1574 54 1604 62" stroke="currentColor" strokeWidth="1.3" fill="none" />
          {[76, 92, 108, 124, 138].map((y) => (
            <React.Fragment key={y}>
              <path d={`M 1544 ${y} Q 1574 ${y - 6} 1604 ${y}`} stroke="currentColor" strokeWidth="0.85" fill="none" />
            </React.Fragment>
          ))}
          {[1556, 1568, 1580, 1592].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="62" x2="150" y2="150" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
            </React.Fragment>
          ))}

          {/* 28. Commercial Gallery with Window Arrays (56w x 92h) */}
          <rect x="1604" y="58" width="56" height="92" />
          <rect x="1614" y="50" width="36" height="8" />
          {[72, 88, 104, 120, 134].map((y) => (
            <React.Fragment key={y}>
              <rect x="1610" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="1623" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="1636" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
              <rect x="1648" y={y - 9} width="9" height="8" stroke="currentColor" strokeWidth="0.75" />
            </React.Fragment>
          ))}
          <rect x="1624" y="132" width="16" height="18" stroke="currentColor" strokeWidth="0.9" />

          {/* 29. Curved Corner Plaza Building (56w x 86h) */}
          <rect x="1660" y="64" width="56" height="86" />
          <path d="M 1660 64 Q 1688 54 1716 64" stroke="currentColor" strokeWidth="1.3" fill="none" />
          {[80, 96, 112, 128, 142].map((y) => (
            <React.Fragment key={y}>
              <line x1="1660" y1={y} x2="1716" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <line x1="1678" y1="64" x2="1678" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1698" y1="64" x2="1698" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 30. Modern Commercial Office Block with Sunshades (56w x 102h) */}
          <rect x="1716" y="48" width="56" height="102" />
          {[66, 84, 102, 120, 136].map((y) => (
            <React.Fragment key={y}>
              <line x1="1716" y1={y} x2="1772" y2={y} stroke="currentColor" strokeWidth="1" opacity="0.8" />
              <line x1="1716" y1={y + 3} x2="1772" y2={y + 3} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </React.Fragment>
          ))}
          <line x1="1734" y1="48" x2="1734" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1754" y1="48" x2="1754" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 31. Right Grand Needle Spire Skyscraper (The Majestic Tower in Photo: 64w x 140h) */}
          <rect x="1772" y="22" width="64" height="128" />
          <rect x="1788" y="10" width="32" height="12" />
          <line x1="1804" y1="-10" x2="1804" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="1796" y1="-1" x2="1812" y2="-1" stroke="currentColor" strokeWidth="1.3" />
          {/* Vertical Rib Mullions */}
          <line x1="1786" y1="22" x2="1786" y2="150" stroke="currentColor" strokeWidth="0.9" opacity="0.8" />
          <line x1="1804" y1="22" x2="1804" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.9" />
          <line x1="1822" y1="22" x2="1822" y2="150" stroke="currentColor" strokeWidth="0.9" opacity="0.8" />
          {[36, 50, 64, 78, 92, 106, 120, 134].map((y) => (
            <React.Fragment key={y}>
              <line x1="1772" y1={y} x2="1836" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="1792" y="130" width="24" height="20" stroke="currentColor" strokeWidth="1" />

          {/* 32. Stepped High-Rise Tower with Dual Spires (60w x 120h) */}
          <rect x="1836" y="30" width="60" height="120" />
          <line x1="1850" y1="12" x2="1850" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1882" y1="12" x2="1882" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1854" y1="46" x2="1854" y2="142" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="1878" y1="46" x2="1878" y2="142" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          {[48, 66, 84, 102, 120, 136].map((y) => (
            <React.Fragment key={y}>
              <line x1="1836" y1={y} x2="1896" y2={y} stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="1856" y="132" width="20" height="18" stroke="currentColor" strokeWidth="1" />

          {/* 33. Right Landmark Skyscraper (Angled Crown & Antennas - 62w x 135h) */}
          <path d="M 1896 150 L 1896 16 L 1958 32 L 1958 150 Z" />
          <line x1="1910" y1="-2" x2="1910" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1944" y1="4" x2="1944" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1916" y1="20" x2="1916" y2="150" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
          <line x1="1938" y1="26" x2="1938" y2="150" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />
          {[44, 58, 72, 86, 100, 114, 128, 140].map((y) => (
            <React.Fragment key={y}>
              <line x1="1896" y1={y} x2="1958" y2={y} stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
              <rect x="1900" y={y - 9} width="11" height="8" stroke="currentColor" strokeWidth="0.7" />
              <rect x="1921" y={y - 9} width="12" height="8" stroke="currentColor" strokeWidth="0.7" />
              <rect x="1943" y={y - 9} width="11" height="8" stroke="currentColor" strokeWidth="0.7" />
            </React.Fragment>
          ))}
          <rect x="1917" y="132" width="20" height="18" stroke="currentColor" strokeWidth="1" />

          {/* 34. Far Right Iconic Curved Cultural Center (Exact photo match: 72w x 80h) */}
          <ellipse cx="1960" cy="74" rx="36" ry="9" />
          <path d="M 1924 74 L 1924 150 L 1996 150 L 1996 74 Z" />
          <path d="M 1924 88 Q 1960 96 1996 88" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 1924 102 Q 1960 110 1996 102" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 1924 116 Q 1960 124 1996 116" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 1924 130 Q 1960 138 1996 130" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 1924 142 Q 1960 148 1996 142" stroke="currentColor" strokeWidth="0.9" fill="none" />
          {[1932, 1940, 1948, 1956, 1964, 1972, 1980, 1988].map((x) => (
            <React.Fragment key={x}>
              <line x1={x} y1="76" x2={x} y2="149" stroke="currentColor" strokeWidth="0.65" opacity="0.6" />
            </React.Fragment>
          ))}
          <rect x="1948" y="132" width="24" height="18" stroke="currentColor" strokeWidth="1" />
          <line x1="1960" y1="132" x2="1960" y2="150" stroke="currentColor" strokeWidth="0.7" />
        </g>
      </svg>
    </div>
  );
}
