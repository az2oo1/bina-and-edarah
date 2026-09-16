import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 text-foreground/85 dark:text-foreground/80" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, Crisp 2D Elevation)         */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 600 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <pattern id="archHatchMob" width="3" height="3" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
          </pattern>
          <clipPath id="mobTentClip">
            <path d="M 228 88 Q 238 68 250 66 Q 266 64 282 62 Q 298 64 314 66 Q 326 68 336 88 L 336 110 L 228 110 Z" />
          </clipPath>
        </defs>

        {/* Clean Single Horizon Baseline */}
        <line x1="0" y1="110" x2="600" y2="110" stroke="currentColor" strokeWidth="1.6" />
        <line x1="0" y1="112" x2="600" y2="112" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />

        {/* Background Silhouettes */}
        <g stroke="currentColor" strokeWidth="0.7" opacity="0.14" fill="currentColor" fillOpacity="0.04">
          <rect x="50" y="45" width="30" height="65" />
          <rect x="120" y="30" width="32" height="80" />
          <line x1="136" y1="22" x2="136" y2="30" stroke="currentColor" strokeWidth="0.9" />
          <rect x="420" y="35" width="32" height="75" />
          <line x1="436" y1="27" x2="436" y2="35" stroke="currentColor" strokeWidth="0.9" />
          <rect x="490" y="50" width="28" height="60" />
        </g>

        {/* Foreground Buildings */}
        {/* Left Spiral Pavilion */}
        <g stroke="currentColor" strokeLinejoin="round">
          <ellipse cx="33" cy="59" rx="23" ry="5" fill="var(--background)" strokeWidth="1.1" />
          <path d="M 10 59 L 10 110 L 56 110 L 56 59 Z" fill="var(--background)" strokeWidth="1.2" />
          <path d="M 10 72 Q 33 78 56 72" fill="none" strokeWidth="0.9" />
          <path d="M 10 84 Q 33 90 56 84" fill="none" strokeWidth="0.9" />
          <path d="M 10 96 Q 33 102 56 96" fill="none" strokeWidth="0.9" />
          <rect x="25" y="96" width="16" height="14" fill="var(--background)" strokeWidth="0.9" />
          <line x1="33" y1="96" x2="33" y2="110" strokeWidth="0.6" />
        </g>

        {/* Left Stepped Balcony Residence */}
        <g stroke="currentColor" strokeLinejoin="round">
          <rect x="64" y="56" width="50" height="54" fill="var(--background)" strokeWidth="1.2" />
          <rect x="78" y="44" width="36" height="12" fill="var(--background)" strokeWidth="1.1" />
          <line x1="82" y1="39" x2="110" y2="39" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="86" y1="39" x2="86" y2="44" strokeWidth="0.6" />
          <line x1="94" y1="39" x2="94" y2="44" strokeWidth="0.6" />
          <line x1="102" y1="39" x2="102" y2="44" strokeWidth="0.6" />
          <rect x="68" y="64" width="12" height="9" fill="var(--background)" strokeWidth="0.75" />
          <rect x="85" y="64" width="24" height="9" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="0.6" />
          <line x1="83" y1="70" x2="111" y2="70" strokeWidth="0.9" />
          <rect x="68" y="79" width="12" height="9" fill="var(--background)" strokeWidth="0.75" />
          <rect x="85" y="79" width="24" height="9" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="0.6" />
          <line x1="83" y1="85" x2="111" y2="85" strokeWidth="0.9" />
          <rect x="70" y="96" width="12" height="14" fill="var(--background)" strokeWidth="0.9" />
          <line x1="76" y1="96" x2="76" y2="110" strokeWidth="0.6" />
        </g>

        {/* Left Tree & Street Lamp */}
        <g stroke="currentColor">
          <line x1="120" y1="110" x2="120" y2="102" strokeWidth="1" />
          <circle cx="120" cy="96" r="6" fill="var(--background)" strokeWidth="1" />
          <line x1="127" y1="110" x2="127" y2="94" strokeWidth="0.9" />
          <path d="M 127 94 Q 127 91 130 91 L 132 91" fill="none" strokeWidth="0.9" />
          <circle cx="132" cy="92" r="1" fill="currentColor" />
        </g>

        {/* Left Angled Skyscraper (Fixed Antennas & Louvers) */}
        <g stroke="currentColor" strokeLinejoin="round">
          <polygon points="134,110 134,18 180,36 180,110" fill="var(--background)" strokeWidth="1.25" />
          <line x1="136" y1="19" x2="136" y2="4" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="136" cy="4" r="1.2" fill="currentColor" />
          <line x1="148" y1="26" x2="148" y2="110" strokeWidth="0.75" opacity="0.8" />
          <line x1="166" y1="33" x2="166" y2="110" strokeWidth="0.75" opacity="0.8" />
          <line x1="136" y1="24" x2="147" y2="24" strokeWidth="0.55" opacity="0.65" />
          <line x1="136" y1="28" x2="157" y2="28" strokeWidth="0.55" opacity="0.65" />
          <line x1="136" y1="32" x2="167" y2="32" strokeWidth="0.55" opacity="0.65" />
          {[46, 60, 74, 88].map((y) => (
            <React.Fragment key={y}>
              <line x1="134" y1={y} x2="180" y2={y} strokeWidth="0.6" opacity="0.65" />
              <rect x="137" y={y - 6} width="7" height="4" fill="var(--background)" strokeWidth="0.55" />
              <rect x="151" y={y - 6} width="12" height="4" fill="var(--background)" strokeWidth="0.55" />
              <rect x="169" y={y - 6} width="7" height="4" fill="var(--background)" strokeWidth="0.55" />
            </React.Fragment>
          ))}
          <rect x="149" y="96" width="16" height="14" fill="var(--background)" strokeWidth="0.95" />
          <line x1="157" y1="96" x2="157" y2="110" strokeWidth="0.6" />
        </g>

        {/* Central Heritage Oasis: Left Palm Tree */}
        <g stroke="currentColor">
          <path d="M 200 110 Q 202 88 203 72 L 206 72 Q 204 88 203 110 Z" fill="var(--background)" strokeWidth="0.95" />
          <path d="M 204 72 Q 188 56 176 72" fill="none" strokeWidth="1" />
          <path d="M 204 72 Q 196 50 188 52" fill="none" strokeWidth="1" />
          <path d="M 204 72 Q 205 46 210 48" fill="none" strokeWidth="1" />
          <path d="M 204 72 Q 216 54 220 72" fill="none" strokeWidth="1" />
        </g>

        {/* Heritage Royal Tent (Strictly Clipped & Stripes Stop at Entrance) */}
        <g stroke="currentColor" strokeLinejoin="round">
          {/* Guy Ropes */}
          <line x1="228" y1="88" x2="214" y2="110" strokeWidth="0.8" strokeDasharray="3 2" />
          <line x1="336" y1="88" x2="350" y2="110" strokeWidth="0.8" strokeDasharray="3 2" />
          {/* Ridge Poles */}
          <line x1="250" y1="64" x2="250" y2="88" strokeWidth="1.2" />
          <circle cx="250" cy="64" r="1.8" fill="currentColor" />
          <line x1="282" y1="60" x2="282" y2="88" strokeWidth="1.3" />
          <circle cx="282" cy="60" r="2" fill="currentColor" />
          <line x1="314" y1="64" x2="314" y2="88" strokeWidth="1.2" />
          <circle cx="314" cy="64" r="1.8" fill="currentColor" />
          {/* Canopy Roof Outer Outline */}
          <path d="M 228 88 Q 238 68 250 66 Q 266 64 282 62 Q 298 64 314 66 Q 326 68 336 88 L 336 110 L 228 110 Z" fill="var(--background)" strokeWidth="1.3" />
          {/* Sadu Stripes strictly clipped inside the canopy */}
          <g clipPath="url(#mobTentClip)">
            <path d="M 224 74 Q 282 72 340 74" fill="none" strokeWidth="0.9" strokeDasharray="5 2 1 2" opacity="0.8" />
            <path d="M 224 80 Q 282 78 340 80" fill="none" strokeWidth="0.9" strokeDasharray="5 2 1 2" opacity="0.8" />
            <path d="M 224 86 Q 282 84 340 86" fill="none" strokeWidth="0.9" strokeDasharray="5 2 1 2" opacity="0.8" />
            {/* Lower stripes outside the entrance arch only */}
            <line x1="224" y1="94" x2="270" y2="94" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
            <line x1="294" y1="94" x2="340" y2="94" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
            <line x1="224" y1="102" x2="270" y2="102" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
            <line x1="294" y1="102" x2="340" y2="102" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          </g>
          {/* Clean Draped Arch Entrance */}
          <path d="M 270 110 L 270 92 Q 282 87 294 92 L 294 110 Z" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="1.1" />
          <line x1="282" y1="62" x2="282" y2="90" strokeWidth="0.6" />
          <polygon points="280,90 284,90 285,95 279,95" fill="currentColor" />
          <rect x="272" y="105" width="9" height="4.5" rx="1" fill="var(--background)" strokeWidth="0.7" />
          <rect x="283" y="105" width="9" height="4.5" rx="1" fill="var(--background)" strokeWidth="0.7" />
        </g>

        {/* Central Heritage Oasis: Right Palm Tree */}
        <g stroke="currentColor">
          <path d="M 358 110 Q 360 86 362 70 L 365 70 Q 362 86 360 110 Z" fill="var(--background)" strokeWidth="0.95" />
          <path d="M 363 70 Q 378 54 390 70" fill="none" strokeWidth="1" />
          <path d="M 363 70 Q 372 48 380 50" fill="none" strokeWidth="1" />
          <path d="M 363 70 Q 360 44 354 46" fill="none" strokeWidth="1" />
          <path d="M 363 70 Q 348 54 344 70" fill="none" strokeWidth="1" />
        </g>

        {/* Right Grand Spire Skyscraper */}
        <g stroke="currentColor" strokeLinejoin="round">
          <rect x="390" y="36" width="46" height="74" fill="var(--background)" strokeWidth="1.25" />
          <rect x="394" y="20" width="38" height="16" fill="var(--background)" strokeWidth="1.1" />
          <polygon points="400,20 413,8 426,20" fill="var(--background)" strokeWidth="1.15" />
          <line x1="413" y1="8" x2="413" y2="-6" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="413" cy="-6" r="1.2" fill="currentColor" />
          <line x1="400" y1="20" x2="400" y2="110" strokeWidth="0.75" opacity="0.8" />
          <line x1="413" y1="16" x2="413" y2="110" strokeWidth="0.9" />
          <line x1="426" y1="20" x2="426" y2="110" strokeWidth="0.75" opacity="0.8" />
          {[46, 60, 74, 88].map((y) => (
            <React.Fragment key={y}>
              <line x1="390" y1={y} x2="436" y2={y} strokeWidth="0.6" opacity="0.65" />
              <rect x="403" y={y - 6} width="5" height="4" fill="var(--background)" strokeWidth="0.5" />
              <rect x="418" y={y - 6} width="5" height="4" fill="var(--background)" strokeWidth="0.5" />
            </React.Fragment>
          ))}
          <rect x="405" y="96" width="16" height="14" fill="var(--background)" strokeWidth="0.95" />
          <line x1="413" y1="96" x2="413" y2="110" strokeWidth="0.6" />
        </g>

        {/* Right Lamp & Tree */}
        <g stroke="currentColor">
          <line x1="444" y1="110" x2="444" y2="94" strokeWidth="0.9" />
          <path d="M 444 94 Q 444 91 447 91 L 449 91" fill="none" strokeWidth="0.9" />
          <circle cx="449" cy="92" r="1" fill="currentColor" />
          <line x1="454" y1="110" x2="454" y2="102" strokeWidth="1" />
          <circle cx="454" cy="96" r="6" fill="var(--background)" strokeWidth="1" />
        </g>

        {/* Right Corporate Fins Building */}
        <g stroke="currentColor" strokeLinejoin="round">
          <rect x="462" y="44" width="48" height="66" fill="var(--background)" strokeWidth="1.2" />
          <rect x="470" y="38" width="32" height="6" fill="var(--background)" strokeWidth="0.8" />
          {[52, 66, 80].map((y) => (
            <React.Fragment key={y}>
              <rect x="466" y={y} width="40" height="8" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="0.6" />
              <line x1="474" y1={y} x2="474" y2={y + 8} strokeWidth="0.6" />
              <line x1="482" y1={y} x2="482" y2={y + 8} strokeWidth="0.6" />
              <line x1="490" y1={y} x2="490" y2={y + 8} strokeWidth="0.6" />
              <line x1="498" y1={y} x2="498" y2={y + 8} strokeWidth="0.6" />
            </React.Fragment>
          ))}
          <rect x="478" y="96" width="16" height="14" fill="var(--background)" strokeWidth="0.9" />
          <line x1="486" y1="96" x2="486" y2="110" strokeWidth="0.6" />
        </g>

        {/* Right Spiral Pavilion */}
        <g stroke="currentColor" strokeLinejoin="round">
          <ellipse cx="544" cy="59" rx="24" ry="5" fill="var(--background)" strokeWidth="1.1" />
          <path d="M 520 59 L 520 110 L 568 110 L 568 59 Z" fill="var(--background)" strokeWidth="1.2" />
          <path d="M 520 72 Q 544 78 568 72" fill="none" strokeWidth="0.9" />
          <path d="M 520 84 Q 544 90 568 84" fill="none" strokeWidth="0.9" />
          <path d="M 520 96 Q 544 102 568 96" fill="none" strokeWidth="0.9" />
          <rect x="536" y="96" width="16" height="14" fill="var(--background)" strokeWidth="0.9" />
          <line x1="544" y1="96" x2="544" y2="110" strokeWidth="0.6" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP SKYLINE (Screens >= 640px, Masterpiece Architectural Panorama)    */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 2000 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <pattern id="archHatchDesk" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.5" opacity="0.14" />
          </pattern>
          <clipPath id="deskTentClip">
            <path d="M 934 142 Q 948 124 962 118 Q 978 121 997 116 Q 1016 121 1032 118 Q 1046 124 1060 142 L 1060 168 L 934 168 Z" />
          </clipPath>
        </defs>

        {/* Crisp Single Baseline Ground Plane */}
        <line x1="0" y1="168" x2="2000" y2="168" stroke="currentColor" strokeWidth="1.8" />
        <line x1="0" y1="170" x2="2000" y2="170" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />

        {/* Background Silhouettes (Atmospheric Depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.15" fill="currentColor" fillOpacity="0.04">
          <rect x="95" y="73" width="46" height="95" />
          <rect x="215" y="56" width="50" height="112" />
          <rect x="345" y="80" width="42" height="88" />
          <rect x="485" y="48" width="54" height="120" />
          <rect x="645" y="73" width="44" height="95" />
          <rect x="795" y="36" width="56" height="132" />
          <line x1="823" y1="22" x2="823" y2="36" stroke="currentColor" strokeWidth="1" />
          <rect x="1165" y="32" width="58" height="136" />
          <line x1="1194" y1="18" x2="1194" y2="32" stroke="currentColor" strokeWidth="1" />
          <rect x="1335" y="72" width="48" height="96" />
          <rect x="1495" y="50" width="52" height="118" />
          <rect x="1650" y="80" width="44" height="88" />
          <rect x="1795" y="60" width="48" height="108" />
        </g>

        {/* Masterpiece Foreground Elevations */}
        <g stroke="currentColor" strokeLinejoin="round">
          
          {/* 1. Leftmost Spiral Drum Pavilion (x=20) */}
          <g>
            <ellipse cx="57" cy="84" rx="33" ry="8" fill="var(--background)" strokeWidth="1.2" />
            <ellipse cx="57" cy="81" rx="31" ry="8" fill="none" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.7" />
            <path d="M 20 84 L 20 168 L 94 168 L 94 84 Z" fill="var(--background)" strokeWidth="1.3" />
            {[98, 112, 126, 140].map((ty) => (
              <React.Fragment key={ty}>
                <path d={`M 20 ${ty} Q 57 ${ty + 10} 94 ${ty}`} fill="none" strokeWidth="1.1" />
                <path d={`M 20 ${ty + 3} Q 57 ${ty + 13} 94 ${ty + 3}`} fill="none" strokeWidth="0.6" opacity="0.6" />
              </React.Fragment>
            ))}
            {[28, 35, 42, 72, 79, 86].map((mx) => (
              <line key={mx} x1={mx} y1="92" x2={mx} y2="152" strokeWidth="0.55" opacity="0.6" />
            ))}
            <rect x="46" y="152" width="22" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="57" y1="152" x2="57" y2="168" strokeWidth="0.75" />
          </g>

          {/* 2. Curved Corner Modern Office (x=102) */}
          <g>
            <path d="M 102 88 Q 112 76 124 76 L 168 76 L 168 168 L 102 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[90, 103, 116, 129].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 106 ${fy + 4} Q 112 ${fy} 122 ${fy} L 164 ${fy}`} fill="none" strokeWidth="1.05" />
                <path d={`M 106 ${fy + 9} Q 112 ${fy + 6} 122 ${fy + 6} L 164 ${fy + 6}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="148" y="152" width="16" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="156" y1="152" x2="156" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=184) */}
          <g stroke="currentColor">
            <line x1="184" y1="168" x2="184" y2="157" strokeWidth="1.15" />
            <circle cx="184" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
            <path d="M 179.5 148 Q 184 145 188.5 148" fill="none" strokeWidth="0.75" opacity="0.75" />
            <path d="M 178.5 153 Q 184 150 189.5 153" fill="none" strokeWidth="0.75" opacity="0.75" />
          </g>

          {/* 3. Stepped Pergola Residence (x=206) */}
          <g>
            <rect x="206" y="86" width="66" height="82" fill="var(--background)" strokeWidth="1.3" />
            <rect x="226" y="68" width="46" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="230" y1="61" x2="268" y2="61" strokeWidth="1.3" strokeLinecap="round" />
            {[232, 238, 244, 250, 256, 262, 266].map((px) => (
              <line key={px} x1={px} y1="61" x2={px} y2="68" strokeWidth="0.7" />
            ))}
            <line x1="208" y1="79" x2="224" y2="79" strokeWidth="1" />
            <line x1="208" y1="86" x2="224" y2="86" strokeWidth="1.2" />
            {[96, 118].map((by) => (
              <React.Fragment key={by}>
                <rect x="212" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <line x1="220" y1={by} x2="220" y2={by + 12} strokeWidth="0.6" opacity="0.6" />
                <rect x="234" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="232" y1={by + 7} x2="268" y2={by + 7} strokeWidth="1" />
                <line x1="232" y1={by + 12} x2="268" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="214" y="152" width="15" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="221.5" y1="152" x2="221.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Lamp (x=284) */}
          <g>
            <line x1="284" y1="168" x2="284" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 284 148 Q 284 144 288 144 L 290 144" fill="none" strokeWidth="1" />
            <circle cx="290" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 4. Corporate Fins Office (x=298) */}
          <g>
            <rect x="298" y="58" width="62" height="110" fill="var(--background)" strokeWidth="1.3" />
            <rect x="308" y="50" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[68, 84, 100, 116, 132].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="302" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[305, 310.5, 316, 321.5, 327, 332.5, 338, 343.5, 349].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="317" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.2" />
            <line x1="329" y1="152" x2="329" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Tree (x=372) */}
          <g>
            <line x1="372" y1="168" x2="372" y2="157" strokeWidth="1.15" />
            <circle cx="372" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 5. Framed Window Block (x=386) */}
          <g>
            <rect x="386" y="66" width="60" height="102" fill="var(--background)" strokeWidth="1.3" />
            <line x1="385" y1="69" x2="447" y2="69" strokeWidth="1" />
            {[76, 92, 108, 124].map((ry) => (
              <React.Fragment key={ry}>
                {[391, 407, 423].map((cx) => (
                  <React.Fragment key={cx}>
                    <rect x={cx} y={ry} width="13" height="11" fill="var(--background)" strokeWidth="0.9" />
                    <rect x={cx + 2} y={ry + 2} width="9" height="7" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
                    <line x1={cx + 6.5} y1={ry + 2} x2={cx + 6.5} y2={ry + 9} strokeWidth="0.5" />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <rect x="391" y="139" width="13" height="10" fill="var(--background)" strokeWidth="0.9" />
            <rect x="393" y="141" width="9" height="6" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
            <rect x="423" y="139" width="13" height="10" fill="var(--background)" strokeWidth="0.9" />
            <rect x="425" y="141" width="9" height="6" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
            <rect x="406" y="152" width="20" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="416" y1="152" x2="416" y2="168" strokeWidth="0.75" />
          </g>

          {/* Street Lamp (x=460) */}
          <g>
            <line x1="460" y1="168" x2="460" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 460 148 Q 460 144 464 144 L 466 144" fill="none" strokeWidth="1" />
            <circle cx="466" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 6. Curved Corner Right (x=474) */}
          <g>
            <path d="M 474 74 L 518 74 Q 530 74 540 86 L 540 168 L 474 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[88, 101, 114, 127].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 478 ${fy} L 520 ${fy} Q 530 ${fy} 536 ${fy + 4}`} fill="none" strokeWidth="1.05" />
                <path d={`M 478 ${fy + 6} L 520 ${fy + 6} Q 530 ${fy + 6} 536 ${fy + 9}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="480" y="152" width="16" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="488" y1="152" x2="488" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=554) */}
          <g>
            <line x1="554" y1="168" x2="554" y2="157" strokeWidth="1.15" />
            <circle cx="554" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 7. Stepped Pergola (x=568) */}
          <g>
            <rect x="568" y="80" width="68" height="88" fill="var(--background)" strokeWidth="1.3" />
            <rect x="588" y="62" width="48" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="592" y1="55" x2="632" y2="55" strokeWidth="1.3" strokeLinecap="round" />
            {[594, 600, 606, 612, 618, 624, 630].map((px) => (
              <line key={px} x1={px} y1="55" x2={px} y2="62" strokeWidth="0.7" />
            ))}
            {[90, 109, 128].map((by) => (
              <React.Fragment key={by}>
                <rect x="574" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <rect x="596" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="594" y1={by + 7} x2="630" y2={by + 7} strokeWidth="1" />
                <line x1="594" y1={by + 12} x2="630" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="576" y="152" width="15" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="583.5" y1="152" x2="583.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Lamp (x=648) */}
          <g>
            <line x1="648" y1="168" x2="648" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 648 148 Q 648 144 652 144 L 654 144" fill="none" strokeWidth="1" />
            <circle cx="654" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 8. Corporate Fins (x=662) */}
          <g>
            <rect x="662" y="54" width="62" height="114" fill="var(--background)" strokeWidth="1.3" />
            <rect x="672" y="46" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[64, 78, 92, 106, 120, 134].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="666" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[669, 674.5, 680, 685.5, 691, 696.5, 702, 707.5, 713].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="681" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.2" />
            <line x1="693" y1="152" x2="693" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Tree (x=736) */}
          <g>
            <line x1="736" y1="168" x2="736" y2="157" strokeWidth="1.15" />
            <circle cx="736" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 9. LEFT SOARING LANDMARK: Grand Angled Skyscraper (x=750) - FIXED ANTENNAS & LOUVERS */}
          <g>
            <polygon points="750,168 750,10 806,36 806,168" fill="var(--background)" strokeWidth="1.35" />
            
            {/* Primary Peak Antenna planted firmly ON the roofline at x=752 */}
            <line x1="752" y1="11" x2="752" y2="-18" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="752" cy="-18" r="1.4" fill="currentColor" />
            <line x1="748.5" y1="-6" x2="755.5" y2="-6" strokeWidth="0.8" />
            
            {/* Secondary Antenna planted firmly ON the roofline at x=760 */}
            <line x1="760" y1="15" x2="760" y2="-6" strokeWidth="1.2" strokeLinecap="round" />

            {/* Structural Vertical Columns: start strictly below roofline! */}
            <line x1="766" y1="19" x2="766" y2="168" strokeWidth="0.85" opacity="0.8" />
            <line x1="790" y1="30" x2="790" y2="168" strokeWidth="0.85" opacity="0.8" />

            {/* Louvers: Truncated strictly inside the sloped roof! */}
            <line x1="754" y1="16" x2="761" y2="16" strokeWidth="0.6" opacity="0.65" />
            <line x1="754" y1="20" x2="770" y2="20" strokeWidth="0.6" opacity="0.65" />
            <line x1="754" y1="24" x2="778" y2="24" strokeWidth="0.6" opacity="0.65" />
            <line x1="754" y1="28" x2="787" y2="28" strokeWidth="0.6" opacity="0.65" />
            <line x1="754" y1="32" x2="795" y2="32" strokeWidth="0.6" opacity="0.65" />

            {/* Window Floors */}
            {[46, 56, 66, 76, 86, 96, 106, 116, 126, 136].map((wy) => (
              <React.Fragment key={wy}>
                <line x1="750" y1={wy} x2="806" y2={wy} strokeWidth="0.65" opacity="0.65" />
                <rect x="754" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <rect x="770" y={wy - 6} width="16" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <line x1="778" y1={wy - 6} x2="778" y2={wy - 1.5} strokeWidth="0.5" opacity="0.6" />
                <rect x="794" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
              </React.Fragment>
            ))}
            <rect x="768" y="152" width="20" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="778" y1="152" x2="778" y2="168" strokeWidth="0.75" />
          </g>

          {/* 10. Framed Window Block (x=814) */}
          <g>
            <rect x="814" y="56" width="58" height="112" fill="var(--background)" strokeWidth="1.3" />
            <line x1="813" y1="59" x2="873" y2="59" strokeWidth="1" />
            {[68, 84, 100, 116, 132].map((ry) => (
              <React.Fragment key={ry}>
                {[819, 835, 851].map((cx) => (
                  <React.Fragment key={cx}>
                    <rect x={cx} y={ry} width="13" height="11" fill="var(--background)" strokeWidth="0.9" />
                    <rect x={cx + 2} y={ry + 2} width="9" height="7" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
                    <line x1={cx + 6.5} y1={ry + 2} x2={cx + 6.5} y2={ry + 9} strokeWidth="0.5" />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <rect x="833" y="152" width="20" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="843" y1="152" x2="843" y2="168" strokeWidth="0.75" />
          </g>

          {/* Street Lamp (x=882) */}
          <g>
            <line x1="882" y1="168" x2="882" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 882 148 Q 882 144 886 144 L 888 144" fill="none" strokeWidth="1" />
            <circle cx="888" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* ================================================================= */}
          {/* THE CENTRAL HERITAGE OASIS: Royal Bedouin Tent & Date Palms       */}
          {/* ================================================================= */}
          
          {/* Left Date Palms */}
          <g>
            <path d="M 897 168 Q 899 134 899 101 L 903 101 Q 901 134 899 168 Z" fill="var(--background)" strokeWidth="1.1" />
            {[156, 146, 136, 126, 116, 106].map((ty) => (
              <path key={ty} d={`M 897 ${ty + 1.5} Q 900 ${ty - 1.2} 903 ${ty + 1.5}`} fill="none" strokeWidth="0.8" opacity="0.85" />
            ))}
            <ellipse cx="897" cy="107" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            <ellipse cx="905" cy="107" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            <path d="M 901 101 Q 877 79 859 117" fill="none" strokeWidth="1.15" />
            <path d="M 901 101 Q 881 73 866 93" fill="none" strokeWidth="1.15" />
            <path d="M 901 101 Q 890 67 881 75" fill="none" strokeWidth="1.15" />
            <path d="M 901 101 Q 901 63 901 69" fill="none" strokeWidth="1.15" />
            <path d="M 901 101 Q 912 67 921 75" fill="none" strokeWidth="1.15" />
            <path d="M 901 101 Q 921 73 936 93" fill="none" strokeWidth="1.15" />
            <path d="M 901 101 Q 925 79 943 117" fill="none" strokeWidth="1.15" />

            <path d="M 918 168 Q 919 142 919 116 L 922 116 Q 921 142 920 168 Z" fill="var(--background)" strokeWidth="0.95" />
            <path d="M 920 116 Q 904 96 890 126" fill="none" strokeWidth="1" />
            <path d="M 920 116 Q 912 88 902 102" fill="none" strokeWidth="1" />
            <path d="M 920 116 Q 928 88 938 102" fill="none" strokeWidth="1" />
            <path d="M 920 116 Q 936 96 950 126" fill="none" strokeWidth="1" />
          </g>

          {/* Royal Heritage Tent (Strictly Clipped & Stripes Stop at Entrance) */}
          <g>
            <line x1="934" y1="142" x2="910" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />
            <line x1="948" y1="142" x2="924" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />
            <line x1="1060" y1="142" x2="1084" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />
            <line x1="1046" y1="142" x2="1070" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />

            <line x1="962" y1="108" x2="962" y2="142" strokeWidth="1.4" />
            <circle cx="962" cy="108" r="2" fill="currentColor" />
            <line x1="997" y1="104" x2="997" y2="142" strokeWidth="1.4" />
            <circle cx="997" cy="104" r="2.4" fill="currentColor" />
            <line x1="1032" y1="108" x2="1032" y2="142" strokeWidth="1.4" />
            <circle cx="1032" cy="108" r="2" fill="currentColor" />

            <path d="M 934 142 Q 948 124 962 118 Q 978 121 997 116 Q 1016 121 1032 118 Q 1046 124 1060 142 L 1060 168 L 934 168 Z" fill="var(--background)" strokeWidth="1.4" />

            {/* Sadu Stripes inside canopy clipPath */}
            <g clipPath="url(#deskTentClip)">
              <path d="M 930 126 Q 997 124 1064 126" fill="none" strokeWidth="1.1" strokeDasharray="7 3 2 3" opacity="0.8" />
              <path d="M 930 132 Q 997 130 1064 132" fill="none" strokeWidth="1.1" strokeDasharray="7 3 2 3" opacity="0.8" />
              <path d="M 930 138 Q 997 136 1064 138" fill="none" strokeWidth="1.1" strokeDasharray="7 3 2 3" opacity="0.8" />

              <line x1="930" y1="146" x2="980" y2="146" strokeWidth="1" strokeDasharray="6 3" opacity="0.75" />
              <line x1="930" y1="153" x2="980" y2="153" strokeWidth="1" strokeDasharray="6 3" opacity="0.75" />
              <line x1="930" y1="160" x2="980" y2="160" strokeWidth="0.9" strokeDasharray="6 3" opacity="0.7" />

              <line x1="1014" y1="146" x2="1064" y2="146" strokeWidth="1" strokeDasharray="6 3" opacity="0.75" />
              <line x1="1014" y1="153" x2="1064" y2="153" strokeWidth="1" strokeDasharray="6 3" opacity="0.75" />
              <line x1="1014" y1="160" x2="1064" y2="160" strokeWidth="0.9" strokeDasharray="6 3" opacity="0.7" />
            </g>

            {/* Clean Draped Arch Entrance */}
            <path d="M 980 168 L 980 144 Q 997 137 1014 144 L 1014 168 Z" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="1.25" />
            <line x1="997" y1="116" x2="997" y2="144" strokeWidth="0.7" />
            <polygon points="994.5,144 999.5,144 1000.5,150 993.5,150" fill="currentColor" />
            <rect x="983" y="162" width="11" height="5.5" rx="1.5" fill="var(--background)" strokeWidth="0.85" />
            <rect x="1000" y="162" width="11" height="5.5" rx="1.5" fill="var(--background)" strokeWidth="0.85" />

            {/* Low stone border walls */}
            <line x1="916" y1="163" x2="928" y2="163" strokeWidth="1.2" />
            <line x1="916" y1="168" x2="916" y2="163" strokeWidth="1.2" />
            <line x1="928" y1="168" x2="928" y2="163" strokeWidth="1.2" />
            <line x1="1066" y1="163" x2="1078" y2="163" strokeWidth="1.2" />
            <line x1="1066" y1="168" x2="1066" y2="163" strokeWidth="1.2" />
            <line x1="1078" y1="168" x2="1078" y2="163" strokeWidth="1.2" />
          </g>

          {/* Right Date Palms */}
          <g>
            <path d="M 1070 168 Q 1072 142 1073 116 L 1076 116 Q 1074 142 1072 168 Z" fill="var(--background)" strokeWidth="0.95" />
            <path d="M 1074 116 Q 1058 96 1044 126" fill="none" strokeWidth="1" />
            <path d="M 1074 116 Q 1066 88 1056 102" fill="none" strokeWidth="1" />
            <path d="M 1074 116 Q 1082 88 1092 102" fill="none" strokeWidth="1" />
            <path d="M 1074 116 Q 1090 96 1104 126" fill="none" strokeWidth="1" />

            {/* Tall Palm 4 (x=1096) */}
            <path d="M 1093 168 Q 1096 134 1099 99 L 1103 99 Q 1100 134 1097 168 Z" fill="var(--background)" strokeWidth="1.1" />
            {[156, 146, 136, 126, 116, 106].map((ty) => (
              <path key={ty} d={`M 1095 ${ty + 1.5} Q 1098 ${ty - 1.2} 1101 ${ty + 1.5}`} fill="none" strokeWidth="0.8" opacity="0.85" />
            ))}
            <ellipse cx="1097" cy="105" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            <ellipse cx="1105" cy="105" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            <path d="M 1101 99 Q 1077 77 1059 115" fill="none" strokeWidth="1.15" />
            <path d="M 1101 99 Q 1081 71 1066 91" fill="none" strokeWidth="1.15" />
            <path d="M 1101 99 Q 1090 65 1081 73" fill="none" strokeWidth="1.15" />
            <path d="M 1101 99 Q 1101 61 1101 67" fill="none" strokeWidth="1.15" />
            <path d="M 1101 99 Q 1112 65 1121 73" fill="none" strokeWidth="1.15" />
            <path d="M 1101 99 Q 1121 71 1136 91" fill="none" strokeWidth="1.15" />
            <path d="M 1101 99 Q 1125 77 1143 115" fill="none" strokeWidth="1.15" />
          </g>

          {/* Street Lamp (x=1124) */}
          <g>
            <line x1="1124" y1="168" x2="1124" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1124 148 Q 1124 144 1128 144 L 1130 144" fill="none" strokeWidth="1" />
            <circle cx="1130" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 11. RIGHT SOARING LANDMARK: Grand Needle Spire Skyscraper (x=1136) */}
          <g>
            <rect x="1136" y="46" width="54" height="122" fill="var(--background)" strokeWidth="1.35" />
            <rect x="1141" y="24" width="44" height="22" fill="var(--background)" strokeWidth="1.2" />
            <polygon points="1146,24 1163,2 1180,24" fill="var(--background)" strokeWidth="1.3" />
            <line x1="1163" y1="2" x2="1163" y2="-28" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="1163" cy="-28" r="1.6" fill="currentColor" />
            <line x1="1159" y1="-10" x2="1167" y2="-10" strokeWidth="0.8" />
            <line x1="1160" y1="-18" x2="1166" y2="-18" strokeWidth="0.8" />
            {[1143, 1152, 1161, 1165, 1174, 1183].map((rx) => (
              <line key={rx} x1={rx} y1="24" x2={rx} y2="168" strokeWidth="0.8" opacity="0.8" />
            ))}
            {[56, 66, 76, 86, 96, 106, 116, 126, 136].map((fy) => (
              <React.Fragment key={fy}>
                <line x1="1136" y1={fy} x2="1190" y2={fy} strokeWidth="0.65" opacity="0.65" />
                {[1145, 1154, 1167, 1176].map((wx) => (
                  <rect key={wx} x={wx} y={fy - 6.5} width="5" height="4.5" fill="var(--background)" strokeWidth="0.55" />
                ))}
              </React.Fragment>
            ))}
            {[28, 31.5, 35, 38.5, 42].map((ly) => (
              <line key={ly} x1="1146" y1={ly} x2="1180" y2={ly} strokeWidth="0.6" opacity="0.65" />
            ))}
            <rect x="1152" y="152" width="22" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1163" y1="152" x2="1163" y2="168" strokeWidth="0.75" />
          </g>

          {/* 12. Corporate Fins Building (x=1198) - FIXED COLLISION */}
          <g>
            <rect x="1198" y="52" width="62" height="116" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1208" y="44" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[64, 78, 92, 106, 120, 134].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="1202" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[1205, 1210.5, 1216, 1221.5, 1227, 1232.5, 1238, 1243.5, 1249].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="1217" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.2" />
            <line x1="1229" y1="152" x2="1229" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Tree (x=1276) */}
          <g>
            <line x1="1276" y1="168" x2="1276" y2="157" strokeWidth="1.15" />
            <circle cx="1276" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 13. Angled Skyscraper Mirror (x=1298) - FIXED ANTENNAS & LOUVERS */}
          <g>
            <polygon points="1298,168 1298,36 1354,10 1354,168" fill="var(--background)" strokeWidth="1.35" />
            
            <line x1="1352" y1="11" x2="1352" y2="-18" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="1352" cy="-18" r="1.4" fill="currentColor" />
            <line x1="1348.5" y1="-6" x2="1355.5" y2="-6" strokeWidth="0.8" />
            
            <line x1="1344" y1="15" x2="1344" y2="-6" strokeWidth="1.2" strokeLinecap="round" />

            <line x1="1308" y1="33" x2="1308" y2="168" strokeWidth="0.85" opacity="0.8" />
            <line x1="1332" y1="22" x2="1332" y2="168" strokeWidth="0.85" opacity="0.8" />

            <line x1="1343" y1="16" x2="1350" y2="16" strokeWidth="0.6" opacity="0.65" />
            <line x1="1334" y1="20" x2="1350" y2="20" strokeWidth="0.6" opacity="0.65" />
            <line x1="1326" y1="24" x2="1350" y2="24" strokeWidth="0.6" opacity="0.65" />
            <line x1="1317" y1="28" x2="1350" y2="28" strokeWidth="0.6" opacity="0.65" />
            <line x1="1309" y1="32" x2="1350" y2="32" strokeWidth="0.6" opacity="0.65" />

            {[46, 56, 66, 76, 86, 96, 106, 116, 126, 136].map((wy) => (
              <React.Fragment key={wy}>
                <line x1="1298" y1={wy} x2="1354" y2={wy} strokeWidth="0.65" opacity="0.65" />
                <rect x="1302" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <rect x="1318" y={wy - 6} width="16" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <line x1="1326" y1={wy - 6} x2="1326" y2={wy - 1.5} strokeWidth="0.5" opacity="0.6" />
                <rect x="1342" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
              </React.Fragment>
            ))}
            <rect x="1316" y="152" width="20" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1326" y1="152" x2="1326" y2="168" strokeWidth="0.75" />
          </g>

          {/* Street Lamp (x=1368) */}
          <g>
            <line x1="1368" y1="168" x2="1368" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1368 148 Q 1368 144 1372 144 L 1374 144" fill="none" strokeWidth="1" />
            <circle cx="1374" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 14. Stepped Pergola (x=1380) */}
          <g>
            <rect x="1380" y="82" width="68" height="86" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1400" y="64" width="48" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="1404" y1="57" x2="1444" y2="57" strokeWidth="1.3" strokeLinecap="round" />
            {[1406, 1412, 1418, 1424, 1430, 1436, 1442].map((px) => (
              <line key={px} x1={px} y1="57" x2={px} y2="64" strokeWidth="0.7" />
            ))}
            {[92, 111, 130].map((by) => (
              <React.Fragment key={by}>
                <rect x="1386" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <rect x="1408" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="1406" y1={by + 7} x2="1442" y2={by + 7} strokeWidth="1" />
                <line x1="1406" y1={by + 12} x2="1442" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="1388" y="152" width="15" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1395.5" y1="152" x2="1395.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=1458) */}
          <g>
            <line x1="1458" y1="168" x2="1458" y2="157" strokeWidth="1.15" />
            <circle cx="1458" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 15. Framed Window Block (x=1472) */}
          <g>
            <rect x="1472" y="66" width="60" height="102" fill="var(--background)" strokeWidth="1.3" />
            <line x1="1471" y1="69" x2="1533" y2="69" strokeWidth="1" />
            {[76, 92, 108, 124].map((ry) => (
              <React.Fragment key={ry}>
                {[1477, 1493, 1509].map((cx) => (
                  <React.Fragment key={cx}>
                    <rect x={cx} y={ry} width="13" height="11" fill="var(--background)" strokeWidth="0.9" />
                    <rect x={cx + 2} y={ry + 2} width="9" height="7" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
                    <line x1={cx + 6.5} y1={ry + 2} x2={cx + 6.5} y2={ry + 9} strokeWidth="0.5" />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <rect x="1477" y="139" width="13" height="10" fill="var(--background)" strokeWidth="0.9" />
            <rect x="1479" y="141" width="9" height="6" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
            <rect x="1509" y="139" width="13" height="10" fill="var(--background)" strokeWidth="0.9" />
            <rect x="1511" y="141" width="9" height="6" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
            <rect x="1492" y="152" width="20" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1502" y1="152" x2="1502" y2="168" strokeWidth="0.75" />
          </g>

          {/* Street Lamp (x=1542) */}
          <g>
            <line x1="1542" y1="168" x2="1542" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1542 148 Q 1542 144 1546 144 L 1548 144" fill="none" strokeWidth="1" />
            <circle cx="1548" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 16. Curved Corner Left (x=1556) */}
          <g>
            <path d="M 1556 88 Q 1566 76 1578 76 L 1622 76 L 1622 168 L 1556 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[90, 103, 116, 129].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 1560 ${fy + 4} Q 1566 ${fy} 1576 ${fy} L 1618 ${fy}`} fill="none" strokeWidth="1.05" />
                <path d={`M 1560 ${fy + 6} Q 1566 ${fy + 6} 1576 ${fy + 6} L 1618 ${fy + 6}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="1602" y="152" width="16" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1610" y1="152" x2="1610" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=1636) */}
          <g>
            <line x1="1636" y1="168" x2="1636" y2="157" strokeWidth="1.15" />
            <circle cx="1636" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 17. Corporate Fins (x=1650) */}
          <g>
            <rect x="1650" y="58" width="62" height="110" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1660" y="50" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[70, 84, 98, 112, 126].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="1654" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[1657, 1662.5, 1668, 1673.5, 1679, 1684.5, 1690, 1695.5, 1701].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="1669" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.2" />
            <line x1="1681" y1="152" x2="1681" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Lamp (x=1722) */}
          <g>
            <line x1="1722" y1="168" x2="1722" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1722 148 Q 1722 144 1726 144 L 1728 144" fill="none" strokeWidth="1" />
            <circle cx="1728" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 18. Stepped Pergola (x=1736) */}
          <g>
            <rect x="1736" y="86" width="66" height="82" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1756" y="68" width="46" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="1760" y1="61" x2="1798" y2="61" strokeWidth="1.3" strokeLinecap="round" />
            {[1762, 1768, 1774, 1780, 1786, 1792, 1796].map((px) => (
              <line key={px} x1={px} y1="61" x2={px} y2="68" strokeWidth="0.7" />
            ))}
            {[96, 115, 134].map((by) => (
              <React.Fragment key={by}>
                <rect x="1742" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <rect x="1764" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="1762" y1={by + 7} x2="1798" y2={by + 7} strokeWidth="1" />
                <line x1="1762" y1={by + 12} x2="1798" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="1744" y="152" width="15" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1751.5" y1="152" x2="1751.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=1812) */}
          <g>
            <line x1="1812" y1="168" x2="1812" y2="157" strokeWidth="1.15" />
            <circle cx="1812" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 19. Curved Corner Right (x=1826) */}
          <g>
            <path d="M 1826 76 L 1870 76 Q 1882 76 1892 88 L 1892 168 L 1826 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[90, 103, 116, 129].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 1830 ${fy} L 1872 ${fy} Q 1882 ${fy} 1888 ${fy + 4}`} fill="none" strokeWidth="1.05" />
                <path d={`M 1830 ${fy + 6} L 1872 ${fy + 6} Q 1882 ${fy + 6} 1888 ${fy + 9}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="1832" y="152" width="16" height="16" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1840" y1="152" x2="1840" y2="168" strokeWidth="0.7" />
          </g>

          {/* 20. Rightmost Spiral Drum Pavilion (x=1902) */}
          <g>
            <ellipse cx="1940" cy="84" rx="34" ry="8" fill="var(--background)" strokeWidth="1.2" />
            <ellipse cx="1940" cy="81" rx="32" ry="8" fill="none" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.7" />
            <path d="M 1902 84 L 1902 168 L 1978 168 L 1978 84 Z" fill="var(--background)" strokeWidth="1.3" />
            {[98, 112, 126, 140].map((ty) => (
              <React.Fragment key={ty}>
                <path d={`M 1902 ${ty} Q 1940 ${ty + 10} 1978 ${ty}`} fill="none" strokeWidth="1.1" />
                <path d={`M 1902 ${ty + 3} Q 1940 ${ty + 13} 1978 ${ty + 3}`} fill="none" strokeWidth="0.6" opacity="0.6" />
              </React.Fragment>
            ))}
            {[1910, 1917, 1924, 1956, 1963, 1970].map((mx) => (
              <line key={mx} x1={mx} y1="92" x2={mx} y2="152" strokeWidth="0.55" opacity="0.6" />
            ))}
            <rect x="1929" y="152" width="22" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1940" y1="152" x2="1940" y2="168" strokeWidth="0.75" />
          </g>

        </g>
      </svg>
    </div>
  );
}
