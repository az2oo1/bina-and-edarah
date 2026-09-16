import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44 text-foreground/85 dark:text-foreground/80" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, High-Fidelity 2D Line Art)   */}
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
            <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" strokeWidth="0.5" opacity="0.16" />
          </pattern>
        </defs>

        {/* Baseline Horizon & Sidewalk */}
        <line x1="0" y1="110" x2="600" y2="110" stroke="currentColor" strokeWidth="1.6" />
        <line x1="0" y1="112.5" x2="600" y2="112.5" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
        <line x1="0" y1="116" x2="600" y2="116" stroke="currentColor" strokeWidth="0.5" opacity="0.25" strokeDasharray="10 5" />

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
          <rect x="25" y="99" width="16" height="11" fill="var(--background)" strokeWidth="0.9" />
          <line x1="33" y1="99" x2="33" y2="110" strokeWidth="0.6" />
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
          <rect x="68" y="80" width="12" height="9" fill="var(--background)" strokeWidth="0.75" />
          <rect x="85" y="80" width="24" height="9" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="0.6" />
          <line x1="83" y1="86" x2="111" y2="86" strokeWidth="0.9" />
          <rect x="70" y="98" width="12" height="12" fill="var(--background)" strokeWidth="0.9" />
        </g>

        {/* Left Tree & Street Lamp */}
        <g stroke="currentColor">
          <line x1="120" y1="110" x2="120" y2="102" strokeWidth="1" />
          <circle cx="120" cy="96" r="6" fill="var(--background)" strokeWidth="1" />
          <line x1="128" y1="110" x2="128" y2="94" strokeWidth="0.9" />
          <path d="M 128 94 Q 128 91 131 91 L 133 91" fill="none" strokeWidth="0.9" />
          <circle cx="133" cy="92" r="1" fill="currentColor" />
        </g>

        {/* Left Angled Skyscraper */}
        <g stroke="currentColor" strokeLinejoin="round">
          <polygon points="134,110 134,22 180,38 180,110" fill="var(--background)" strokeWidth="1.25" />
          <line x1="144" y1="22" x2="144" y2="6" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="144" cy="6" r="1.2" fill="currentColor" />
          <line x1="148" y1="28" x2="148" y2="110" strokeWidth="0.75" opacity="0.8" />
          <line x1="166" y1="34" x2="166" y2="110" strokeWidth="0.75" opacity="0.8" />
          {[48, 62, 76, 90].map((y) => (
            <React.Fragment key={y}>
              <line x1="134" y1={y} x2="180" y2={y} strokeWidth="0.6" opacity="0.65" />
              <rect x="137" y={y - 6} width="7" height="4" fill="var(--background)" strokeWidth="0.55" />
              <rect x="151" y={y - 6} width="12" height="4" fill="var(--background)" strokeWidth="0.55" />
              <rect x="169" y={y - 6} width="7" height="4" fill="var(--background)" strokeWidth="0.55" />
            </React.Fragment>
          ))}
          <rect x="149" y="98" width="16" height="12" fill="var(--background)" strokeWidth="0.95" />
        </g>

        {/* Left Car */}
        <g stroke="currentColor" strokeWidth="0.7" strokeLinejoin="round">
          <path d="M 184 108 L 184 106 L 188 103 L 196 103 L 199 106 L 204 106 L 204 108 Z" fill="var(--background)" />
          <circle cx="188" cy="108" r="1.8" fill="currentColor" />
          <circle cx="200" cy="108" r="1.8" fill="currentColor" />
        </g>

        {/* Central Heritage Oasis: Left Palm Tree */}
        <g stroke="currentColor">
          <path d="M 210 110 Q 212 88 214 70 L 217 70 Q 215 88 214 110 Z" fill="var(--background)" strokeWidth="0.95" />
          <path d="M 215 70 Q 198 56 186 72" fill="none" strokeWidth="1" />
          <path d="M 215 70 Q 206 48 198 50" fill="none" strokeWidth="1" />
          <path d="M 215 70 Q 215 45 220 47" fill="none" strokeWidth="1" />
          <path d="M 215 70 Q 228 54 232 72" fill="none" strokeWidth="1" />
        </g>

        {/* Heritage Royal Tent */}
        <g stroke="currentColor" strokeLinejoin="round">
          {/* Guy Ropes */}
          <line x1="228" y1="88" x2="214" y2="110" strokeWidth="0.8" strokeDasharray="3 2" />
          <line x1="336" y1="88" x2="350" y2="110" strokeWidth="0.8" strokeDasharray="3 2" />
          {/* Poles */}
          <line x1="250" y1="64" x2="250" y2="88" strokeWidth="1.2" />
          <circle cx="250" cy="64" r="1.8" fill="currentColor" />
          <line x1="282" y1="60" x2="282" y2="88" strokeWidth="1.3" />
          <circle cx="282" cy="60" r="2" fill="currentColor" />
          <line x1="314" y1="64" x2="314" y2="88" strokeWidth="1.2" />
          <circle cx="314" cy="64" r="1.8" fill="currentColor" />
          {/* Canopy Roof */}
          <path d="M 228 88 Q 238 68 250 66 Q 266 64 282 62 Q 298 64 314 66 Q 326 68 336 88 L 336 110 L 228 110 Z" fill="var(--background)" strokeWidth="1.3" />
          {/* Sadu Woven Stripes */}
          <path d="M 230 78 Q 282 76 334 78" fill="none" strokeWidth="0.9" strokeDasharray="5 2 1 2" opacity="0.8" />
          <path d="M 230 84 Q 282 82 334 84" fill="none" strokeWidth="0.9" strokeDasharray="5 2 1 2" opacity="0.8" />
          <path d="M 230 94 Q 282 92 334 94" fill="none" strokeWidth="0.9" strokeDasharray="5 2 1 2" opacity="0.8" />
          <path d="M 230 100 Q 282 98 334 100" fill="none" strokeWidth="0.8" strokeDasharray="5 2 1 2" opacity="0.7" />
          {/* Majlis Entrance & Lantern */}
          <path d="M 270 110 L 270 92 Q 282 87 294 92 L 294 110 Z" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="1" />
          <line x1="282" y1="62" x2="282" y2="90" strokeWidth="0.6" />
          <polygon points="280,90 284,90 285,95 279,95" fill="currentColor" />
          <rect x="272" y="105" width="9" height="4.5" rx="1" fill="var(--background)" strokeWidth="0.7" />
          <rect x="283" y="105" width="9" height="4.5" rx="1" fill="var(--background)" strokeWidth="0.7" />
        </g>

        {/* Central Heritage Oasis: Right Palm Tree */}
        <g stroke="currentColor">
          <path d="M 350 110 Q 352 86 355 68 L 358 68 Q 355 86 353 110 Z" fill="var(--background)" strokeWidth="0.95" />
          <path d="M 356 68 Q 372 54 384 70" fill="none" strokeWidth="1" />
          <path d="M 356 68 Q 365 46 373 48" fill="none" strokeWidth="1" />
          <path d="M 356 68 Q 352 43 346 45" fill="none" strokeWidth="1" />
          <path d="M 356 68 Q 340 52 336 70" fill="none" strokeWidth="1" />
        </g>

        {/* Right Grand Spire Skyscraper */}
        <g stroke="currentColor" strokeLinejoin="round">
          <rect x="382" y="36" width="46" height="74" fill="var(--background)" strokeWidth="1.25" />
          <rect x="386" y="20" width="38" height="16" fill="var(--background)" strokeWidth="1.1" />
          <polygon points="392,20 405,8 418,20" fill="var(--background)" strokeWidth="1.15" />
          <line x1="405" y1="8" x2="405" y2="-6" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="405" cy="-6" r="1.2" fill="currentColor" />
          <line x1="392" y1="20" x2="392" y2="110" strokeWidth="0.75" opacity="0.8" />
          <line x1="405" y1="16" x2="405" y2="110" strokeWidth="0.9" />
          <line x1="418" y1="20" x2="418" y2="110" strokeWidth="0.75" opacity="0.8" />
          {[46, 60, 74, 88].map((y) => (
            <React.Fragment key={y}>
              <line x1="382" y1={y} x2="428" y2={y} strokeWidth="0.6" opacity="0.65" />
              <rect x="395" y={y - 6} width="5" height="4" fill="var(--background)" strokeWidth="0.5" />
              <rect x="410" y={y - 6} width="5" height="4" fill="var(--background)" strokeWidth="0.5" />
            </React.Fragment>
          ))}
          <rect x="397" y="97" width="16" height="13" fill="var(--background)" strokeWidth="0.95" />
        </g>

        {/* Right Lamp & Tree */}
        <g stroke="currentColor">
          <line x1="436" y1="110" x2="436" y2="94" strokeWidth="0.9" />
          <path d="M 436 94 Q 436 91 439 91 L 441 91" fill="none" strokeWidth="0.9" />
          <circle cx="441" cy="92" r="1" fill="currentColor" />
          <line x1="446" y1="110" x2="446" y2="102" strokeWidth="1" />
          <circle cx="446" cy="96" r="6" fill="var(--background)" strokeWidth="1" />
        </g>

        {/* Right Corporate Fins Building */}
        <g stroke="currentColor" strokeLinejoin="round">
          <rect x="454" y="44" width="48" height="66" fill="var(--background)" strokeWidth="1.2" />
          <rect x="462" y="38" width="32" height="6" fill="var(--background)" strokeWidth="0.8" />
          {[52, 66, 80].map((y) => (
            <React.Fragment key={y}>
              <rect x="458" y={y} width="40" height="8" fill="url(#archHatchMob)" stroke="currentColor" strokeWidth="0.6" />
              <line x1="466" y1={y} x2="466" y2={y + 8} strokeWidth="0.6" />
              <line x1="474" y1={y} x2="474" y2={y + 8} strokeWidth="0.6" />
              <line x1="482" y1={y} x2="482" y2={y + 8} strokeWidth="0.6" />
              <line x1="490" y1={y} x2="490" y2={y + 8} strokeWidth="0.6" />
            </React.Fragment>
          ))}
          <rect x="470" y="97" width="16" height="13" fill="var(--background)" strokeWidth="0.9" />
        </g>

        {/* Right Spiral Pavilion */}
        <g stroke="currentColor" strokeLinejoin="round">
          <ellipse cx="536" cy="59" rx="24" ry="5" fill="var(--background)" strokeWidth="1.1" />
          <path d="M 512 59 L 512 110 L 560 110 L 560 59 Z" fill="var(--background)" strokeWidth="1.2" />
          <path d="M 512 72 Q 536 78 560 72" fill="none" strokeWidth="0.9" />
          <path d="M 512 84 Q 536 90 560 84" fill="none" strokeWidth="0.9" />
          <path d="M 512 96 Q 536 102 560 96" fill="none" strokeWidth="0.9" />
          <rect x="528" y="99" width="16" height="11" fill="var(--background)" strokeWidth="0.9" />
          <line x1="536" y1="99" x2="536" y2="110" strokeWidth="0.6" />
        </g>

        {/* Right Car */}
        <g stroke="currentColor" strokeWidth="0.7" strokeLinejoin="round">
          <path d="M 570 108 L 570 106 L 574 103 L 582 103 L 585 106 L 590 106 L 590 108 Z" fill="var(--background)" />
          <circle cx="574" cy="108" r="1.8" fill="currentColor" />
          <circle cx="586" cy="108" r="1.8" fill="currentColor" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP SKYLINE (Screens >= 640px, Grand Architectural Panorama)          */}
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
        </defs>

        {/* Baseline Ground Plane & Sidewalk */}
        <line x1="0" y1="168" x2="2000" y2="168" stroke="currentColor" strokeWidth="1.8" />
        <line x1="0" y1="170" x2="2000" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <line x1="0" y1="174" x2="2000" y2="174" stroke="currentColor" strokeWidth="0.6" opacity="0.3" strokeDasharray="16 8" />

        {/* Background Silhouettes (Atmospheric Depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.16" fill="currentColor" fillOpacity="0.04">
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
            {[98, 112, 126, 140, 152].map((ty) => (
              <React.Fragment key={ty}>
                <path d={`M 20 ${ty} Q 57 ${ty + 10} 94 ${ty}`} fill="none" strokeWidth="1.1" />
                <path d={`M 20 ${ty + 3} Q 57 ${ty + 13} 94 ${ty + 3}`} fill="none" strokeWidth="0.6" opacity="0.6" />
              </React.Fragment>
            ))}
            {[28, 35, 42, 49, 57, 65, 72, 79, 86].map((mx) => (
              <line key={mx} x1={mx} y1="92" x2={mx} y2="152" strokeWidth="0.55" opacity="0.6" />
            ))}
            <rect x="46" y="154" width="22" height="14" fill="var(--background)" strokeWidth="1.1" />
            <line x1="57" y1="154" x2="57" y2="168" strokeWidth="0.75" />
          </g>

          {/* 2. Curved Corner Modern Office (x=102) */}
          <g>
            <path d="M 102 88 Q 112 76 124 76 L 168 76 L 168 168 L 102 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[90, 103, 116, 129, 142].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 106 ${fy + 4} Q 112 ${fy} 122 ${fy} L 164 ${fy}`} fill="none" strokeWidth="1.05" />
                <path d={`M 106 ${fy + 9} Q 112 ${fy + 6} 122 ${fy + 6} L 164 ${fy + 6}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="150" y="154" width="14" height="14" fill="var(--background)" strokeWidth="1" />
            <line x1="157" y1="154" x2="157" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree & Sedan Car (x=176) */}
          <g stroke="currentColor">
            <line x1="176" y1="168" x2="176" y2="157" strokeWidth="1.15" />
            <circle cx="176" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
            {/* Sedan facing left */}
            <g strokeWidth="0.75" strokeLinejoin="round">
              <path d="M 181 166 L 181 163 Q 183 161 188 161 L 192 158 L 201 158 L 204 161 L 207 161 L 207 166 Z" fill="var(--background)" />
              <circle cx="186" cy="166" r="2.2" fill="currentColor" />
              <circle cx="202" cy="166" r="2.2" fill="currentColor" />
            </g>
          </g>

          {/* 3. Stepped Pergola Residence (x=214) */}
          <g>
            <rect x="214" y="86" width="66" height="82" fill="var(--background)" strokeWidth="1.3" />
            <rect x="234" y="68" width="46" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="238" y1="61" x2="276" y2="61" strokeWidth="1.3" strokeLinecap="round" />
            {[240, 246, 252, 258, 264, 270, 274].map((px) => (
              <line key={px} x1={px} y1="61" x2={px} y2="68" strokeWidth="0.7" />
            ))}
            <line x1="216" y1="79" x2="232" y2="79" strokeWidth="1" />
            <line x1="216" y1="86" x2="232" y2="86" strokeWidth="1.2" />
            {[96, 115, 134].map((by) => (
              <React.Fragment key={by}>
                <rect x="220" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <line x1="228" y1={by} x2="228" y2={by + 12} strokeWidth="0.6" opacity="0.6" />
                <rect x="242" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="240" y1={by + 7} x2="276" y2={by + 7} strokeWidth="1" />
                <line x1="240" y1={by + 12} x2="276" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="222" y="153" width="15" height="15" fill="var(--background)" strokeWidth="1.05" />
            <line x1="229.5" y1="153" x2="229.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Lamp (x=288) */}
          <g>
            <line x1="288" y1="168" x2="288" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 288 148 Q 288 144 292 144 L 294 144" fill="none" strokeWidth="1" />
            <circle cx="294" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 4. Corporate Fins Office (x=298) */}
          <g>
            <rect x="298" y="58" width="62" height="110" fill="var(--background)" strokeWidth="1.3" />
            <rect x="308" y="50" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[70, 84, 98, 112, 126, 140].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="302" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[305, 310.5, 316, 321.5, 327, 332.5, 338, 343.5, 349].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="317" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="329" y1="152" x2="329" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Tree (x=368) */}
          <g>
            <line x1="368" y1="168" x2="368" y2="157" strokeWidth="1.15" />
            <circle cx="368" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 5. Framed Window Block & SUV Car (x=378) */}
          <g>
            <rect x="378" y="66" width="60" height="102" fill="var(--background)" strokeWidth="1.3" />
            <line x1="377" y1="69" x2="439" y2="69" strokeWidth="1" />
            {[78, 94, 110, 126, 142].map((ry) => (
              <React.Fragment key={ry}>
                {[383, 399, 415].map((cx) => (
                  <React.Fragment key={cx}>
                    <rect x={cx} y={ry} width="13" height="11" fill="var(--background)" strokeWidth="0.9" />
                    <rect x={cx + 2} y={ry + 2} width="9" height="7" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
                    <line x1={cx + 6.5} y1={ry + 2} x2={cx + 6.5} y2={ry + 9} strokeWidth="0.5" />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <rect x="398" y="153" width="20" height="15" fill="var(--background)" strokeWidth="1.1" />
            <line x1="408" y1="153" x2="408" y2="168" strokeWidth="0.7" />
            {/* SUV Car */}
            <g strokeWidth="0.75" strokeLinejoin="round">
              <path d="M 444 166 L 444 162 L 450 161 L 454 156 L 469 156 L 471 162 L 472 166 Z" fill="var(--background)" />
              <circle cx="450" cy="166" r="2.5" fill="currentColor" />
              <circle cx="467" cy="166" r="2.5" fill="currentColor" />
            </g>
          </g>

          {/* Street Lamp (x=468) */}
          <g>
            <line x1="468" y1="168" x2="468" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 468 148 Q 468 144 472 144 L 474 144" fill="none" strokeWidth="1" />
            <circle cx="474" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 6. Curved Corner Right (x=478) */}
          <g>
            <path d="M 478 74 L 522 74 Q 534 74 544 86 L 544 168 L 478 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[88, 101, 114, 127, 140].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 482 ${fy} L 524 ${fy} Q 534 ${fy} 540 ${fy + 4}`} fill="none" strokeWidth="1.05" />
                <path d={`M 482 ${fy + 6} L 524 ${fy + 6} Q 534 ${fy + 6} 540 ${fy + 9}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="484" y="154" width="14" height="14" fill="var(--background)" strokeWidth="1" />
            <line x1="491" y1="154" x2="491" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=552) */}
          <g>
            <line x1="552" y1="168" x2="552" y2="157" strokeWidth="1.15" />
            <circle cx="552" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 7. Stepped Pergola (x=564) */}
          <g>
            <rect x="564" y="80" width="68" height="88" fill="var(--background)" strokeWidth="1.3" />
            <rect x="584" y="62" width="48" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="588" y1="55" x2="628" y2="55" strokeWidth="1.3" strokeLinecap="round" />
            {[590, 596, 602, 608, 614, 620, 626].map((px) => (
              <line key={px} x1={px} y1="55" x2={px} y2="62" strokeWidth="0.7" />
            ))}
            {[90, 109, 128, 147].map((by) => (
              <React.Fragment key={by}>
                <rect x="570" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <rect x="592" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="590" y1={by + 7} x2="626" y2={by + 7} strokeWidth="1" />
                <line x1="590" y1={by + 12} x2="626" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="572" y="153" width="15" height="15" fill="var(--background)" strokeWidth="1.05" />
            <line x1="579.5" y1="153" x2="579.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Lamp (x=640) */}
          <g>
            <line x1="640" y1="168" x2="640" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 640 148 Q 640 144 644 144 L 646 144" fill="none" strokeWidth="1" />
            <circle cx="646" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 8. Corporate Fins (x=650) */}
          <g>
            <rect x="650" y="54" width="62" height="114" fill="var(--background)" strokeWidth="1.3" />
            <rect x="660" y="46" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[66, 80, 94, 108, 122, 136].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="654" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[657, 662.5, 668, 673.5, 679, 684.5, 690, 695.5, 701].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="669" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="681" y1="152" x2="681" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Tree & Sedan Car (x=720) */}
          <g stroke="currentColor">
            <line x1="720" y1="168" x2="720" y2="157" strokeWidth="1.15" />
            <circle cx="720" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
            <g strokeWidth="0.75" strokeLinejoin="round">
              <path d="M 723 166 L 723 163 Q 725 161 730 161 L 734 158 L 743 158 L 746 161 L 749 161 L 749 166 Z" fill="var(--background)" />
              <circle cx="728" cy="166" r="2.2" fill="currentColor" />
              <circle cx="744" cy="166" r="2.2" fill="currentColor" />
            </g>
          </g>

          {/* 9. LEFT SOARING LANDMARK: Grand Angled Crown Skyscraper (x=750) */}
          <g>
            <polygon points="750,168 750,10 806,36 806,168" fill="var(--background)" strokeWidth="1.35" />
            {/* Twin Communications Masts */}
            <line x1="762" y1="10" x2="762" y2="-16" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="762" cy="-16" r="1.4" fill="currentColor" />
            <line x1="758.5" y1="-4" x2="765.5" y2="-4" strokeWidth="0.8" />
            <line x1="772" y1="16" x2="772" y2="-6" strokeWidth="1.2" strokeLinecap="round" />
            {/* Structural Columns */}
            <line x1="766" y1="16" x2="766" y2="168" strokeWidth="0.85" opacity="0.8" />
            <line x1="790" y1="28" x2="790" y2="168" strokeWidth="0.85" opacity="0.8" />
            {/* Louvers */}
            {[16, 19.5, 23, 26.5, 30, 33.5].map((sy) => (
              <line key={sy} x1="756" y1={sy} x2="800" y2={sy} strokeWidth="0.6" opacity="0.65" />
            ))}
            {/* Window Floors */}
            {[48, 57, 66, 75, 84, 93, 102, 111, 120, 129, 138, 147].map((wy) => (
              <React.Fragment key={wy}>
                <line x1="750" y1={wy} x2="806" y2={wy} strokeWidth="0.65" opacity="0.65" />
                <rect x="754" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <rect x="770" y={wy - 6} width="16" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <line x1="778" y1={wy - 6} x2="778" y2={wy - 1.5} strokeWidth="0.5" opacity="0.6" />
                <rect x="794" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
              </React.Fragment>
            ))}
            <rect x="768" y="153" width="20" height="15" fill="var(--background)" strokeWidth="1.1" />
            <line x1="778" y1="153" x2="778" y2="168" strokeWidth="0.75" />
          </g>

          {/* 10. Framed Window Block (x=814) */}
          <g>
            <rect x="814" y="56" width="58" height="112" fill="var(--background)" strokeWidth="1.3" />
            <line x1="813" y1="59" x2="873" y2="59" strokeWidth="1" />
            {[68, 84, 100, 116, 132, 148].map((ry) => (
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
            <rect x="833" y="153" width="20" height="15" fill="var(--background)" strokeWidth="1.1" />
            <line x1="843" y1="153" x2="843" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Lamp (x=880) */}
          <g>
            <line x1="880" y1="168" x2="880" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 880 148 Q 880 144 884 144 L 886 144" fill="none" strokeWidth="1" />
            <circle cx="886" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* ================================================================= */}
          {/* THE CENTRAL HERITAGE OASIS: Royal Bedouin Tent & Date Palms       */}
          {/* ================================================================= */}
          
          {/* Left Date Palms */}
          <g>
            {/* Tall Palm 1 (x=898) */}
            <path d="M 895 168 Q 897 134 897 101 L 901 101 Q 899 134 897 168 Z" fill="var(--background)" strokeWidth="1.1" />
            {[156, 146, 136, 126, 116, 106].map((ty) => (
              <path key={ty} d={`M 895 ${ty + 1.5} Q 898 ${ty - 1.2} 901 ${ty + 1.5}`} fill="none" strokeWidth="0.8" opacity="0.85" />
            ))}
            <ellipse cx="895" cy="107" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            <ellipse cx="903" cy="107" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            {/* Fronds */}
            <path d="M 899 101 Q 875 79 857 117" fill="none" strokeWidth="1.15" />
            <path d="M 899 101 Q 879 73 864 93" fill="none" strokeWidth="1.15" />
            <path d="M 899 101 Q 888 67 879 75" fill="none" strokeWidth="1.15" />
            <path d="M 899 101 Q 899 63 899 69" fill="none" strokeWidth="1.15" />
            <path d="M 899 101 Q 910 67 919 75" fill="none" strokeWidth="1.15" />
            <path d="M 899 101 Q 919 73 934 93" fill="none" strokeWidth="1.15" />
            <path d="M 899 101 Q 923 79 941 117" fill="none" strokeWidth="1.15" />
            
            {/* Flanking Palm 2 (x=918) */}
            <path d="M 916 168 Q 917 142 917 116 L 920 116 Q 919 142 918 168 Z" fill="var(--background)" strokeWidth="0.95" />
            <path d="M 918 116 Q 902 96 888 126" fill="none" strokeWidth="1" />
            <path d="M 918 116 Q 910 88 900 102" fill="none" strokeWidth="1" />
            <path d="M 918 116 Q 926 88 936 102" fill="none" strokeWidth="1" />
            <path d="M 918 116 Q 934 96 948 126" fill="none" strokeWidth="1" />
          </g>

          {/* Royal Heritage Tent (بيت شعر ملكي - w=126, h=50) */}
          <g>
            {/* Tension Guy Ropes anchored to ground */}
            <line x1="934" y1="142" x2="908" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />
            <line x1="948" y1="142" x2="922" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />
            <line x1="1060" y1="142" x2="1086" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />
            <line x1="1046" y1="142" x2="1072" y2="168" strokeWidth="0.9" strokeDasharray="4 2" />

            {/* Vertical Ridge Poles with Brass Finials */}
            <line x1="962" y1="108" x2="962" y2="142" strokeWidth="1.4" />
            <circle cx="962" cy="108" r="2" fill="currentColor" />
            <line x1="997" y1="104" x2="997" y2="142" strokeWidth="1.4" />
            <circle cx="997" cy="104" r="2.4" fill="currentColor" />
            <line x1="1032" y1="108" x2="1032" y2="142" strokeWidth="1.4" />
            <circle cx="1032" cy="108" r="2" fill="currentColor" />

            {/* Canopy Roof Drapery */}
            <path d="M 934 142 Q 948 124 962 118 Q 978 121 997 116 Q 1016 121 1032 118 Q 1046 124 1060 142 L 1060 168 L 934 168 Z" fill="var(--background)" strokeWidth="1.4" />

            {/* Authentic Sadu Woven Horizontal Stripes */}
            {[128, 134, 140, 148, 154, 160].map((sy) => (
              <path key={sy} d={`M 938 ${sy} Q 997 ${sy - 2} 1056 ${sy}`} fill="none" strokeWidth="1.1" strokeDasharray="7 3 2 3" opacity="0.8" />
            ))}

            {/* Interior Majlis Shading & Traditional Floor Cushions */}
            <path d="M 979 168 L 979 146 Q 997 138 1015 146 L 1015 168 Z" fill="url(#archHatchDesk)" stroke="none" />
            <path d="M 979 168 L 979 146 Q 997 138 1015 146 L 1015 168 Z" fill="none" strokeWidth="1.2" />
            <path d="M 979 146 Q 971 157 979 168" fill="none" strokeWidth="1" />
            <path d="M 1015 146 Q 1023 157 1015 168" fill="none" strokeWidth="1" />
            {/* Brass Hanging Lantern */}
            <line x1="997" y1="116" x2="997" y2="147" strokeWidth="0.7" />
            <polygon points="994.5,147 999.5,147 1000.5,153 993.5,153" fill="currentColor" opacity="0.85" />
            {/* Traditional Cushions (مراكي) */}
            <rect x="983" y="162" width="12" height="5.5" rx="1.5" fill="var(--background)" strokeWidth="0.85" />
            <rect x="999" y="162" width="12" height="5.5" rx="1.5" fill="var(--background)" strokeWidth="0.85" />

            {/* Courtyard low stone border wall */}
            <line x1="916" y1="163" x2="928" y2="163" strokeWidth="1.2" />
            <line x1="916" y1="168" x2="916" y2="163" strokeWidth="1.2" />
            <line x1="928" y1="168" x2="928" y2="163" strokeWidth="1.2" />
            <line x1="1066" y1="163" x2="1078" y2="163" strokeWidth="1.2" />
            <line x1="1066" y1="168" x2="1066" y2="163" strokeWidth="1.2" />
            <line x1="1078" y1="168" x2="1078" y2="163" strokeWidth="1.2" />
          </g>

          {/* Right Date Palms */}
          <g>
            {/* Flanking Palm 3 (x=1072) */}
            <path d="M 1070 168 Q 1072 142 1073 116 L 1076 116 Q 1074 142 1072 168 Z" fill="var(--background)" strokeWidth="0.95" />
            <path d="M 1074 116 Q 1058 96 1044 126" fill="none" strokeWidth="1" />
            <path d="M 1074 116 Q 1066 88 1056 102" fill="none" strokeWidth="1" />
            <path d="M 1074 116 Q 1082 88 1092 102" fill="none" strokeWidth="1" />
            <path d="M 1074 116 Q 1090 96 1104 126" fill="none" strokeWidth="1" />

            {/* Tall Palm 4 (x=1094) */}
            <path d="M 1091 168 Q 1094 134 1097 99 L 1101 99 Q 1098 134 1095 168 Z" fill="var(--background)" strokeWidth="1.1" />
            {[156, 146, 136, 126, 116, 106].map((ty) => (
              <path key={ty} d={`M 1093 ${ty + 1.5} Q 1096 ${ty - 1.2} 1099 ${ty + 1.5}`} fill="none" strokeWidth="0.8" opacity="0.85" />
            ))}
            <ellipse cx="1095" cy="105" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            <ellipse cx="1103" cy="105" rx="2" ry="3.5" fill="currentColor" opacity="0.75" />
            {/* Fronds */}
            <path d="M 1099 99 Q 1075 77 1057 115" fill="none" strokeWidth="1.15" />
            <path d="M 1099 99 Q 1079 71 1064 91" fill="none" strokeWidth="1.15" />
            <path d="M 1099 99 Q 1088 65 1079 73" fill="none" strokeWidth="1.15" />
            <path d="M 1099 99 Q 1099 61 1099 67" fill="none" strokeWidth="1.15" />
            <path d="M 1099 99 Q 1110 65 1119 73" fill="none" strokeWidth="1.15" />
            <path d="M 1099 99 Q 1119 71 1134 91" fill="none" strokeWidth="1.15" />
            <path d="M 1099 99 Q 1123 77 1141 115" fill="none" strokeWidth="1.15" />
          </g>

          {/* Street Lamp (x=1124) */}
          <g>
            <line x1="1124" y1="168" x2="1124" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1124 148 Q 1124 144 1128 144 L 1130 144" fill="none" strokeWidth="1" />
            <circle cx="1130" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 11. RIGHT SOARING LANDMARK: The Grand Needle Spire Skyscraper (x=1136) */}
          <g>
            <rect x="1136" y="46" width="54" height="122" fill="var(--background)" strokeWidth="1.35" />
            <rect x="1141" y="24" width="44" height="22" fill="var(--background)" strokeWidth="1.2" />
            <polygon points="1146,24 1163,2 1180,24" fill="var(--background)" strokeWidth="1.3" />
            {/* High Needle Spire Antenna */}
            <line x1="1163" y1="2" x2="1163" y2="-28" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="1163" cy="-28" r="1.6" fill="currentColor" />
            <line x1="1159" y1="-10" x2="1167" y2="-10" strokeWidth="0.8" />
            <line x1="1160" y1="-18" x2="1166" y2="-18" strokeWidth="0.8" />
            {/* Structural Fluted Ribs */}
            {[1143, 1152, 1161, 1165, 1174, 1183].map((rx) => (
              <line key={rx} x1={rx} y1="24" x2={rx} y2="168" strokeWidth="0.8" opacity="0.8" />
            ))}
            {/* Dense Windows */}
            {[56, 65, 74, 83, 92, 101, 110, 119, 128, 137, 146, 155].map((fy) => (
              <React.Fragment key={fy}>
                <line x1="1136" y1={fy} x2="1190" y2={fy} strokeWidth="0.65" opacity="0.65" />
                {[1145, 1154, 1167, 1176].map((wx) => (
                  <rect key={wx} x={wx} y={fy - 6.5} width="5" height="4.5" fill="var(--background)" strokeWidth="0.55" />
                ))}
              </React.Fragment>
            ))}
            {/* Crown Mechanical Louvers */}
            {[28, 31.5, 35, 38.5, 42].map((ly) => (
              <line key={ly} x1="1146" y1={ly} x2="1180" y2={ly} strokeWidth="0.6" opacity="0.65" />
            ))}
            <rect x="1152" y="152" width="22" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1163" y1="152" x2="1163" y2="168" strokeWidth="0.75" />
          </g>

          {/* 12. Corporate Fins Building & SUV (x=1198) */}
          <g>
            <rect x="1198" y="52" width="62" height="116" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1208" y="44" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[64, 78, 92, 106, 120, 134, 148].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="1202" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[1205, 1210.5, 1216, 1221.5, 1227, 1232.5, 1238, 1243.5, 1249].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="1217" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1229" y1="152" x2="1229" y2="168" strokeWidth="0.8" />
            {/* Street Tree */}
            <line x1="1268" y1="168" x2="1268" y2="157" strokeWidth="1.15" />
            <circle cx="1268" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
            {/* SUV facing right */}
            <g strokeWidth="0.75" strokeLinejoin="round">
              <path d="M 1276 166 L 1276 162 L 1282 161 L 1286 156 L 1301 156 L 1303 162 L 1304 166 Z" fill="var(--background)" />
              <circle cx="1282" cy="166" r="2.5" fill="currentColor" />
              <circle cx="1299" cy="166" r="2.5" fill="currentColor" />
            </g>
          </g>

          {/* 13. Angled Skyscraper Mirror (x=1304) */}
          <g>
            <polygon points="1304,168 1304,36 1360,10 1360,168" fill="var(--background)" strokeWidth="1.35" />
            <line x1="1348" y1="10" x2="1348" y2="-16" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="1348" cy="-16" r="1.4" fill="currentColor" />
            <line x1="1344.5" y1="-4" x2="1351.5" y2="-4" strokeWidth="0.8" />
            <line x1="1338" y1="16" x2="1338" y2="-6" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1320" y1="28" x2="1320" y2="168" strokeWidth="0.85" opacity="0.8" />
            <line x1="1344" y1="16" x2="1344" y2="168" strokeWidth="0.85" opacity="0.8" />
            {[48, 57, 66, 75, 84, 93, 102, 111, 120, 129, 138, 147].map((wy) => (
              <React.Fragment key={wy}>
                <line x1="1304" y1={wy} x2="1360" y2={wy} strokeWidth="0.65" opacity="0.65" />
                <rect x="1308" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <rect x="1324" y={wy - 6} width="16" height="4.5" fill="var(--background)" strokeWidth="0.6" />
                <line x1="1332" y1={wy - 6} x2="1332" y2={wy - 1.5} strokeWidth="0.5" opacity="0.6" />
                <rect x="1348" y={wy - 6} width="8" height="4.5" fill="var(--background)" strokeWidth="0.6" />
              </React.Fragment>
            ))}
            <rect x="1322" y="153" width="20" height="15" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1332" y1="153" x2="1332" y2="168" strokeWidth="0.75" />
          </g>

          {/* Street Lamp (x=1370) */}
          <g>
            <line x1="1370" y1="168" x2="1370" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1370 148 Q 1370 144 1374 144 L 1376 144" fill="none" strokeWidth="1" />
            <circle cx="1376" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 14. Stepped Pergola (x=1380) */}
          <g>
            <rect x="1380" y="82" width="68" height="86" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1400" y="64" width="48" height="18" fill="var(--background)" strokeWidth="1.2" />
            <line x1="1404" y1="57" x2="1444" y2="57" strokeWidth="1.3" strokeLinecap="round" />
            {[1406, 1412, 1418, 1424, 1430, 1436, 1442].map((px) => (
              <line key={px} x1={px} y1="57" x2={px} y2="64" strokeWidth="0.7" />
            ))}
            {[92, 111, 130, 149].map((by) => (
              <React.Fragment key={by}>
                <rect x="1386" y={by} width="16" height="12" fill="var(--background)" strokeWidth="0.85" />
                <rect x="1408" y={by} width="32" height="12" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                <line x1="1406" y1={by + 7} x2="1442" y2={by + 7} strokeWidth="1" />
                <line x1="1406" y1={by + 12} x2="1442" y2={by + 12} strokeWidth="1.4" />
              </React.Fragment>
            ))}
            <rect x="1388" y="153" width="15" height="15" fill="var(--background)" strokeWidth="1.05" />
            <line x1="1395.5" y1="153" x2="1395.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=1456) */}
          <g>
            <line x1="1456" y1="168" x2="1456" y2="157" strokeWidth="1.15" />
            <circle cx="1456" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 15. Framed Window Block (x=1468) */}
          <g>
            <rect x="1468" y="66" width="60" height="102" fill="var(--background)" strokeWidth="1.3" />
            <line x1="1467" y1="69" x2="1529" y2="69" strokeWidth="1" />
            {[78, 94, 110, 126, 142].map((ry) => (
              <React.Fragment key={ry}>
                {[1473, 1489, 1505].map((cx) => (
                  <React.Fragment key={cx}>
                    <rect x={cx} y={ry} width="13" height="11" fill="var(--background)" strokeWidth="0.9" />
                    <rect x={cx + 2} y={ry + 2} width="9" height="7" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.55" />
                    <line x1={cx + 6.5} y1={ry + 2} x2={cx + 6.5} y2={ry + 9} strokeWidth="0.5" />
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <rect x="1488" y="153" width="20" height="15" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1498" y1="153" x2="1498" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Lamp (x=1536) */}
          <g>
            <line x1="1536" y1="168" x2="1536" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1536 148 Q 1536 144 1540 144 L 1542 144" fill="none" strokeWidth="1" />
            <circle cx="1542" cy="145" r="1.3" fill="currentColor" />
          </g>

          {/* 16. Curved Corner Left (x=1546) */}
          <g>
            <path d="M 1546 88 Q 1556 76 1568 76 L 1612 76 L 1612 168 L 1546 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[90, 103, 116, 129, 142].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 1550 ${fy + 4} Q 1556 ${fy} 1566 ${fy} L 1608 ${fy}`} fill="none" strokeWidth="1.05" />
                <path d={`M 1550 ${fy + 9} Q 1556 ${fy + 6} 1566 ${fy + 6} L 1608 ${fy + 6}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="1594" y="154" width="14" height="14" fill="var(--background)" strokeWidth="1" />
            <line x1="1601" y1="154" x2="1601" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree & Sedan Car (x=1620) */}
          <g stroke="currentColor">
            <line x1="1620" y1="168" x2="1620" y2="157" strokeWidth="1.15" />
            <circle cx="1620" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
            <g strokeWidth="0.75" strokeLinejoin="round">
              <path d="M 1630 166 L 1630 163 Q 1632 161 1637 161 L 1641 158 L 1650 158 L 1653 161 L 1656 161 L 1656 166 Z" fill="var(--background)" />
              <circle cx="1635" cy="166" r="2.2" fill="currentColor" />
              <circle cx="1651" cy="166" r="2.2" fill="currentColor" />
            </g>
          </g>

          {/* 17. Corporate Fins (x=1656) */}
          <g>
            <rect x="1656" y="58" width="62" height="110" fill="var(--background)" strokeWidth="1.3" />
            <rect x="1666" y="50" width="42" height="8" fill="var(--background)" strokeWidth="0.95" />
            {[70, 84, 98, 112, 126, 140].map((fy) => (
              <React.Fragment key={fy}>
                <rect x="1660" y={fy} width="54" height="10" fill="url(#archHatchDesk)" stroke="currentColor" strokeWidth="0.7" />
                {[1663, 1668.5, 1674, 1679.5, 1685, 1690.5, 1696, 1701.5, 1707].map((fx) => (
                  <line key={fx} x1={fx} y1={fy} x2={fx} y2={fy + 10} strokeWidth="0.6" opacity="0.75" />
                ))}
              </React.Fragment>
            ))}
            <rect x="1675" y="152" width="24" height="16" fill="var(--background)" strokeWidth="1.15" />
            <line x1="1687" y1="152" x2="1687" y2="168" strokeWidth="0.8" />
          </g>

          {/* Street Lamp (x=1726) */}
          <g>
            <line x1="1726" y1="168" x2="1726" y2="148" strokeWidth="1.05" strokeLinecap="round" />
            <path d="M 1726 148 Q 1726 144 1730 144 L 1732 144" fill="none" strokeWidth="1" />
            <circle cx="1732" cy="145" r="1.3" fill="currentColor" />
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
            <rect x="1744" y="153" width="15" height="15" fill="var(--background)" strokeWidth="1.05" />
            <line x1="1751.5" y1="153" x2="1751.5" y2="168" strokeWidth="0.7" />
          </g>

          {/* Street Tree (x=1810) */}
          <g>
            <line x1="1810" y1="168" x2="1810" y2="157" strokeWidth="1.15" />
            <circle cx="1810" cy="150" r="8" fill="var(--background)" strokeWidth="1.15" />
          </g>

          {/* 19. Curved Corner Right (x=1822) */}
          <g>
            <path d="M 1822 76 L 1866 76 Q 1878 76 1888 88 L 1888 168 L 1822 168 Z" fill="var(--background)" strokeWidth="1.3" />
            {[90, 103, 116, 129, 142].map((fy) => (
              <React.Fragment key={fy}>
                <path d={`M 1826 ${fy} L 1868 ${fy} Q 1878 ${fy} 1884 ${fy + 4}`} fill="none" strokeWidth="1.05" />
                <path d={`M 1826 ${fy + 6} L 1868 ${fy + 6} Q 1878 ${fy + 6} 1884 ${fy + 9}`} fill="none" strokeWidth="0.65" opacity="0.6" />
              </React.Fragment>
            ))}
            <rect x="1828" y="154" width="14" height="14" fill="var(--background)" strokeWidth="1" />
            <line x1="1835" y1="154" x2="1835" y2="168" strokeWidth="0.7" />
          </g>

          {/* 20. Rightmost Spiral Drum Pavilion (x=1898) */}
          <g>
            <ellipse cx="1936" cy="84" rx="34" ry="8" fill="var(--background)" strokeWidth="1.2" />
            <ellipse cx="1936" cy="81" rx="32" ry="8" fill="none" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.7" />
            <path d="M 1898 84 L 1898 168 L 1974 168 L 1974 84 Z" fill="var(--background)" strokeWidth="1.3" />
            {[98, 112, 126, 140, 152].map((ty) => (
              <React.Fragment key={ty}>
                <path d={`M 1898 ${ty} Q 1936 ${ty + 10} 1974 ${ty}`} fill="none" strokeWidth="1.1" />
                <path d={`M 1898 ${ty + 3} Q 1936 ${ty + 13} 1974 ${ty + 3}`} fill="none" strokeWidth="0.6" opacity="0.6" />
              </React.Fragment>
            ))}
            {[1906, 1913, 1920, 1928, 1936, 1944, 1952, 1959, 1966].map((mx) => (
              <line key={mx} x1={mx} y1="92" x2={mx} y2="152" strokeWidth="0.55" opacity="0.6" />
            ))}
            <rect x="1925" y="154" width="22" height="14" fill="var(--background)" strokeWidth="1.1" />
            <line x1="1936" y1="154" x2="1936" y2="168" strokeWidth="0.75" />
          </g>

        </g>
      </svg>
    </div>
  );
}
