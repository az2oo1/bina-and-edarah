import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-24 sm:h-26 md:h-28 lg:h-32 xl:h-36 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, Slender Upright Linework)   */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 520 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="96" x2="520" y2="96" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />

        {/* Soft Background Silhouette Layer */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.25" fill="currentColor" fillOpacity="0.06">
          <rect x="25" y="24" width="28" height="72" />
          <rect x="68" y="16" width="30" height="80" />
          <line x1="83" y1="6" x2="83" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="135" y="38" width="32" height="58" />
          <rect x="355" y="38" width="32" height="58" />
          <rect x="422" y="16" width="30" height="80" />
          <line x1="437" y1="6" x2="437" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="468" y="24" width="28" height="72" />
        </g>

        {/* Crisp Architectural Sketch Foreground Layer (Slender, upright proportions) */}
        <g stroke="currentColor" strokeWidth="1.15" fill="var(--background)" strokeLinejoin="round">
          
          {/* 1. Left Curved Cultural Pavilion (Off-frame bleeding) */}
          <ellipse cx="26" cy="46" rx="22" ry="6" />
          <path d="M 4 46 L 4 96 L 48 96 L 48 46 Z" />
          <path d="M 4 56 Q 26 62 48 56" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M 4 66 Q 26 72 48 66" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M 4 76 Q 26 82 48 76" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M 4 86 Q 26 92 48 86" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <line x1="16" y1="58" x2="16" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="26" y1="60" x2="26" y2="95" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="36" y1="58" x2="36" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />

          {/* 2. Left High-Rise Spire Skyscraper (Slender: 34w x 76h) */}
          <rect x="52" y="20" width="34" height="76" />
          <rect x="59" y="10" width="20" height="10" />
          <line x1="69" y1="-4" x2="69" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="63" y1="2" x2="75" y2="2" stroke="currentColor" strokeWidth="1" />
          <line x1="52" y1="35" x2="86" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="52" y1="50" x2="86" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="52" y1="65" x2="86" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="52" y1="80" x2="86" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="63" y1="20" x2="63" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="75" y1="20" x2="75" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 3. Mid-Rise Grid Building (32w x 60h) */}
          <rect x="90" y="36" width="32" height="60" />
          <rect x="98" y="30" width="16" height="6" />
          <rect x="95" y="42" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="105" y="42" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="115" y="42" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="95" y="55" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="105" y="55" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="115" y="55" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="95" y="68" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="105" y="68" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="115" y="68" width="6" height="8" stroke="currentColor" strokeWidth="0.8" />
          <rect x="101" y="84" width="10" height="12" stroke="currentColor" strokeWidth="0.9" />

          {/* 4. Left Contemporary Luxury Villa with Cantilever & Pergola (42w x 44h) */}
          <rect x="126" y="52" width="42" height="44" />
          <rect x="122" y="44" width="30" height="18" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="124" y1="38" x2="150" y2="38" stroke="currentColor" strokeWidth="1.4" />
          <line x1="128" y1="38" x2="128" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="137" y1="38" x2="137" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="146" y1="38" x2="146" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="126" y1="52" x2="148" y2="52" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
          <rect x="130" y="68" width="14" height="28" stroke="currentColor" strokeWidth="0.9" />
          <rect x="150" y="68" width="12" height="16" stroke="currentColor" strokeWidth="0.9" />

          {/* 5. Left Architectural Date Palm Tree (Slender & Elegant) */}
          <g>
            <line x1="184" y1="96" x2="184" y2="54" stroke="currentColor" strokeWidth="1.8" />
            <line x1="182" y1="64" x2="186" y2="64" stroke="currentColor" strokeWidth="0.8" />
            <line x1="182" y1="74" x2="186" y2="74" stroke="currentColor" strokeWidth="0.8" />
            <line x1="182" y1="84" x2="186" y2="84" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 184 54 Q 170 44 158 50" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 184 54 Q 174 36 166 40" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 184 54 Q 184 30 184 28" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 184 54 Q 194 36 202 40" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 184 54 Q 198 44 210 50" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* 6. Centerpiece: Traditional Royal Marquee / Luxury Pavilion (Proportional: 80w x 44h) */}
          <g>
            <polygon points="220,96 220,72 242,56 278,56 300,72 300,96" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" />
            <line x1="242" y1="56" x2="278" y2="56" stroke="currentColor" strokeWidth="1.4" />
            <line x1="242" y1="46" x2="242" y2="56" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="242" cy="45" r="1.8" fill="currentColor" />
            <line x1="278" y1="46" x2="278" y2="56" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="278" cy="45" r="1.8" fill="currentColor" />
            <line x1="220" y1="72" x2="242" y2="56" stroke="currentColor" strokeWidth="1.1" />
            <line x1="300" y1="72" x2="278" y2="56" stroke="currentColor" strokeWidth="1.1" />
            <line x1="220" y1="78" x2="300" y2="78" stroke="currentColor" strokeWidth="1" strokeDasharray="5 2.5" />
            <line x1="220" y1="84" x2="300" y2="84" stroke="currentColor" strokeWidth="1" strokeDasharray="5 2.5" />
            <line x1="220" y1="90" x2="300" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            {/* Drape Entrance */}
            <path d="M 254 96 L 260 76 L 266 96" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <line x1="260" y1="56" x2="260" y2="76" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            <circle cx="260" cy="70" r="2.2" fill="currentColor" opacity="0.85" />
            <line x1="220" y1="72" x2="210" y2="96" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
            <line x1="300" y1="72" x2="310" y2="96" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
          </g>

          {/* 7. Right Architectural Date Palm Tree */}
          <g>
            <line x1="336" y1="96" x2="336" y2="54" stroke="currentColor" strokeWidth="1.8" />
            <line x1="334" y1="64" x2="338" y2="64" stroke="currentColor" strokeWidth="0.8" />
            <line x1="334" y1="74" x2="338" y2="74" stroke="currentColor" strokeWidth="0.8" />
            <line x1="334" y1="84" x2="338" y2="84" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 336 54 Q 322 44 310 50" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 336 54 Q 326 36 318 40" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 336 54 Q 336 30 336 28" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 336 54 Q 346 36 354 40" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 336 54 Q 350 44 362 50" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* 8. Right Contemporary Luxury Villa (42w x 44h) */}
          <rect x="352" y="52" width="42" height="44" />
          <rect x="368" y="44" width="30" height="18" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="370" y1="38" x2="396" y2="38" stroke="currentColor" strokeWidth="1.4" />
          <line x1="374" y1="38" x2="374" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="383" y1="38" x2="383" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="392" y1="38" x2="392" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="372" y1="52" x2="394" y2="52" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
          <rect x="356" y="68" width="12" height="16" stroke="currentColor" strokeWidth="0.9" />
          <rect x="376" y="68" width="14" height="28" stroke="currentColor" strokeWidth="0.9" />

          {/* 9. Mid-Rise Grid Building (32w x 60h) */}
          <rect x="398" y="36" width="32" height="60" />
          <rect x="406" y="30" width="16" height="6" />
          <line x1="398" y1="48" x2="430" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="398" y1="60" x2="430" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="398" y1="72" x2="430" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="398" y1="84" x2="430" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="409" y1="36" x2="409" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="419" y1="36" x2="419" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 10. Right High-Rise Spire Skyscraper (Slender: 34w x 76h) */}
          <rect x="434" y="20" width="34" height="76" />
          <rect x="441" y="10" width="20" height="10" />
          <line x1="451" y1="-4" x2="451" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="445" y1="2" x2="457" y2="2" stroke="currentColor" strokeWidth="1" />
          <line x1="434" y1="35" x2="468" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="434" y1="50" x2="468" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="434" y1="65" x2="468" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="434" y1="80" x2="468" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="445" y1="20" x2="445" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="457" y1="20" x2="457" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 11. Right Curved Cultural Pavilion (Off-frame bleeding) */}
          <ellipse cx="494" cy="46" rx="22" ry="6" />
          <path d="M 472 46 L 472 96 L 516 96 L 516 46 Z" />
          <path d="M 472 56 Q 494 62 516 56" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M 472 66 Q 494 72 516 66" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M 472 76 Q 494 82 516 76" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <path d="M 472 86 Q 494 92 516 86" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <line x1="484" y1="58" x2="484" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="494" y1="60" x2="494" y2="95" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="504" y1="58" x2="504" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP / PC SKYLINE (2200x150 Vector, Slender & Natural Architectural Scale) */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 2200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="145" x2="2200" y2="145" stroke="currentColor" strokeWidth="1.8" opacity="0.85" />

        {/* Desktop Background Silhouette Layer (Atmospheric Depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.25" fill="currentColor" fillOpacity="0.06">
          <rect x="30" y="32" width="38" height="113" />
          <rect x="110" y="20" width="36" height="125" />
          <line x1="128" y1="6" x2="128" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="190" y="40" width="36" height="105" />
          <rect x="270" y="24" width="40" height="121" />
          <line x1="290" y1="8" x2="290" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="360" y="52" width="42" height="93" />
          <rect x="450" y="38" width="40" height="107" />
          <rect x="540" y="60" width="44" height="85" />
          <rect x="630" y="50" width="46" height="95" />
          <rect x="730" y="68" width="46" height="77" />
          <rect x="830" y="56" width="44" height="89" />
          <rect x="930" y="70" width="48" height="75" />
          
          {/* Backdrop behind center pavilion */}
          <rect x="1030" y="78" width="45" height="67" />
          <rect x="1125" y="78" width="45" height="67" />

          <rect x="1222" y="70" width="48" height="75" />
          <rect x="1326" y="56" width="44" height="89" />
          <rect x="1424" y="68" width="46" height="77" />
          <rect x="1524" y="50" width="46" height="95" />
          <rect x="1616" y="60" width="44" height="85" />
          <rect x="1710" y="38" width="40" height="107" />
          <rect x="1798" y="52" width="42" height="93" />
          <rect x="1890" y="24" width="40" height="121" />
          <line x1="1910" y1="8" x2="1910" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1974" y="40" width="36" height="105" />
          <rect x="2054" y="20" width="36" height="125" />
          <line x1="2072" y1="6" x2="2072" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="2132" y="32" width="38" height="113" />
        </g>

        {/* Foreground Layer (Slender, Tall, Beautifully Proportioned Architectural Drawings) */}
        <g stroke="currentColor" strokeWidth="1.15" fill="var(--background)" strokeLinejoin="round">
          
          {/* ============================================================== */}
          {/* ZONE 1: FAR LEFT - Modern High-Rise & Curved Architecture      */}
          {/* ============================================================== */}
          
          {/* 1. Curved Cultural Pavilion (50w x 75h) */}
          <ellipse cx="40" cy="72" rx="36" ry="8" />
          <path d="M 4 72 L 4 145 L 76 145 L 76 72 Z" />
          <path d="M 4 84 Q 40 92 76 84" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 96 Q 40 104 76 96" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 108 Q 40 116 76 108" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 120 Q 40 128 76 120" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 132 Q 40 140 76 132" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <line x1="22" y1="86" x2="22" y2="142" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="40" y1="88" x2="40" y2="144" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="58" y1="86" x2="58" y2="142" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <rect x="30" y="130" width="20" height="15" stroke="currentColor" strokeWidth="0.9" />

          {/* 2. Angled Crown Skyscraper (52w x 128h) */}
          <path d="M 76 145 L 76 34 L 128 18 L 128 145 Z" />
          <line x1="94" y1="28" x2="94" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="110" y1="23" x2="110" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="76" y1="50" x2="128" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="76" y1="76" x2="128" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="76" y1="102" x2="128" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="76" y1="126" x2="128" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 3. Stepped High-Rise Tower with Dual Spires (56w x 115h) */}
          <rect x="128" y="30" width="56" height="115" />
          <line x1="142" y1="14" x2="142" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="170" y1="14" x2="170" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="146" y1="46" x2="146" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="166" y1="46" x2="166" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="128" y1="60" x2="184" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="128" y1="88" x2="184" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="128" y1="116" x2="184" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 4. Grand Needle Spire Skyscraper (Towering Slender Tower: 54w x 125h) */}
          <rect x="184" y="20" width="54" height="125" />
          <rect x="198" y="8" width="26" height="12" />
          <line x1="211" y1="-8" x2="211" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="205" y1="-1" x2="217" y2="-1" stroke="currentColor" strokeWidth="1.2" />
          <line x1="184" y1="38" x2="238" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="184" y1="58" x2="238" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="184" y1="78" x2="238" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="184" y1="98" x2="238" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="184" y1="118" x2="238" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="197" y1="20" x2="197" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="211" y1="20" x2="211" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="225" y1="20" x2="225" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="202" y="128" width="18" height="17" stroke="currentColor" strokeWidth="0.9" />

          {/* 5. Office Block with Sunshades (52w x 98h) */}
          <rect x="238" y="47" width="52" height="98" />
          <line x1="238" y1="65" x2="290" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="238" y1="83" x2="290" y2="83" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="238" y1="101" x2="290" y2="101" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="238" y1="119" x2="290" y2="119" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="255" y1="47" x2="255" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="273" y1="47" x2="273" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 6. Curved Corner Plaza Building (52w x 82h) */}
          <rect x="290" y="63" width="52" height="82" />
          <path d="M 290 63 Q 316 54 342 63" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="290" y1="81" x2="342" y2="81" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="290" y1="99" x2="342" y2="99" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="290" y1="117" x2="342" y2="117" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="307" y1="63" x2="307" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="325" y1="63" x2="325" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 7. Commercial Gallery with Window Arrays (52w x 88h) */}
          <rect x="342" y="57" width="52" height="88" />
          <rect x="352" y="49" width="32" height="8" />
          <line x1="342" y1="73" x2="394" y2="73" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="342" y1="91" x2="394" y2="91" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="342" y1="109" x2="394" y2="109" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="342" y1="127" x2="394" y2="127" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="359" y1="57" x2="359" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="377" y1="57" x2="377" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 8. Stepped Townhouses with Balcony Railings (54w x 80h) */}
          <rect x="394" y="65" width="54" height="80" />
          <rect x="394" y="57" width="34" height="8" />
          <line x1="400" y1="79" x2="424" y2="79" stroke="currentColor" strokeWidth="1.1" />
          <line x1="400" y1="84" x2="424" y2="84" stroke="currentColor" strokeWidth="0.7" />
          <rect x="404" y="69" width="16" height="10" stroke="currentColor" strokeWidth="0.8" />
          <line x1="400" y1="105" x2="424" y2="105" stroke="currentColor" strokeWidth="1.1" />
          <line x1="400" y1="110" x2="424" y2="110" stroke="currentColor" strokeWidth="0.7" />
          <rect x="404" y="95" width="16" height="10" stroke="currentColor" strokeWidth="0.8" />
          <line x1="428" y1="65" x2="428" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="434" y="78" width="10" height="18" stroke="currentColor" strokeWidth="0.9" />

          {/* 9. Modern Townhouses with Pergola Roof (54w x 73h) */}
          <rect x="448" y="72" width="54" height="73" />
          <line x1="454" y1="62" x2="496" y2="62" stroke="currentColor" strokeWidth="1.4" />
          <line x1="460" y1="62" x2="460" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="474" y1="62" x2="474" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="488" y1="62" x2="488" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <rect x="456" y="86" width="16" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="480" y="86" width="16" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="468" y="116" width="14" height="29" stroke="currentColor" strokeWidth="0.9" />

          {/* 10. High-Rise Tower (52w x 110h) */}
          <rect x="502" y="35" width="52" height="110" />
          <rect x="514" y="27" width="28" height="8" />
          <line x1="502" y1="55" x2="554" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="502" y1="75" x2="554" y2="75" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="502" y1="95" x2="554" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="502" y1="115" x2="554" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="519" y1="35" x2="519" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="537" y1="35" x2="537" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 11. Mid-Rise Grid Building (50w x 86h) */}
          <rect x="554" y="59" width="50" height="86" />
          <line x1="554" y1="77" x2="604" y2="77" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="554" y1="95" x2="604" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="554" y1="113" x2="604" y2="113" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="571" y1="59" x2="571" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="587" y1="59" x2="587" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 12. Modern Commercial Block (52w x 80h) */}
          <rect x="604" y="65" width="52" height="80" />
          <line x1="604" y1="83" x2="656" y2="83" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="604" y1="101" x2="656" y2="101" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="604" y1="119" x2="656" y2="119" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="621" y1="65" x2="621" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="639" y1="65" x2="639" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 13. Stepped Townhouses (52w x 75h) */}
          <rect x="656" y="70" width="52" height="75" />
          <rect x="656" y="64" width="30" height="6" />
          <rect x="664" y="80" width="14" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="686" y="80" width="14" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="674" y="105" width="16" height="22" stroke="currentColor" strokeWidth="0.9" />

          {/* 14. Modern Townhouses (54w x 70h) */}
          <rect x="708" y="75" width="54" height="70" />
          <line x1="708" y1="95" x2="762" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="708" y1="115" x2="762" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="735" y1="75" x2="735" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 15. Contemporary Villa with Cantilever (56w x 68h) */}
          <rect x="762" y="77" width="56" height="68" />
          <rect x="758" y="69" width="40" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="764" y1="80" x2="794" y2="80" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="772" y="105" width="16" height="24" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="796" y="105" width="16" height="16" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 16. Stepped Residence (52w x 72h) */}
          <rect x="818" y="73" width="52" height="72" />
          <rect x="826" y="65" width="36" height="8" />
          <line x1="818" y1="91" x2="870" y2="91" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="818" y1="111" x2="870" y2="111" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="844" y1="73" x2="844" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 17. Luxury Villa with Cantilever (58w x 68h) */}
          <rect x="870" y="77" width="58" height="68" />
          <rect x="866" y="69" width="42" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="872" y1="80" x2="904" y2="80" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="880" y="105" width="18" height="25" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="906" y="105" width="16" height="16" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 18. Modern Residence (54w x 74h) */}
          <rect x="928" y="71" width="54" height="74" />
          <rect x="940" y="63" width="30" height="8" />
          <rect x="938" y="81" width="14" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="960" y="81" width="14" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="948" y="110" width="14" height="20" stroke="currentColor" strokeWidth="0.9" />

          {/* 19. Left Architectural Date Palm Garden (Slender & Natural) */}
          <g>
            <line x1="1006" y1="145" x2="1006" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="1003" y1="92" x2="1009" y2="92" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1003" y1="104" x2="1009" y2="104" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1003" y1="116" x2="1009" y2="116" stroke="currentColor" strokeWidth="0.9" />
            <path d="M 1006 80 Q 986 68 968 74" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1006 80 Q 992 56 980 62" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1006 80 Q 1006 50 1006 46" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1006 80 Q 1020 56 1032 62" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1006 80 Q 1026 68 1044 74" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* ============================================================== */}
          {/* ZONE 2: CENTERPIECE - Traditional Royal Marquee / Luxury Tent    */}
          {/* (Authentically Proportioned: 96w x 56h - NOT stretched!)       */}
          {/* ============================================================== */}
          <g>
            {/* Center is at x = 1100 */}
            <polygon points="1052,145 1052,108 1078,89 1122,89 1148,108 1148,145" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" />
            {/* Ridge & Finials */}
            <line x1="1078" y1="89" x2="1122" y2="89" stroke="currentColor" strokeWidth="1.5" />
            <line x1="1078" y1="76" x2="1078" y2="89" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="1078" cy="74" r="2" fill="currentColor" />
            <line x1="1122" y1="76" x2="1122" y2="89" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="1122" cy="74" r="2" fill="currentColor" />
            {/* Hip ridges */}
            <line x1="1052" y1="108" x2="1078" y2="89" stroke="currentColor" strokeWidth="1.2" />
            <line x1="1148" y1="108" x2="1122" y2="89" stroke="currentColor" strokeWidth="1.2" />
            {/* Authentic Heritage Stripe Bands */}
            <line x1="1052" y1="115" x2="1148" y2="115" stroke="currentColor" strokeWidth="1.1" strokeDasharray="5 2.5" />
            <line x1="1052" y1="122" x2="1148" y2="122" stroke="currentColor" strokeWidth="1.1" strokeDasharray="5 2.5" />
            <line x1="1052" y1="129" x2="1148" y2="129" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <line x1="1052" y1="136" x2="1148" y2="136" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            {/* Drape Entrance */}
            <path d="M 1092 145 L 1100 116 L 1108 145" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <line x1="1100" y1="89" x2="1100" y2="116" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            <circle cx="1100" cy="108" r="2.4" fill="currentColor" opacity="0.85" />
            {/* Guy-Ropes */}
            <line x1="1052" y1="108" x2="1038" y2="145" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
            <line x1="1148" y1="108" x2="1162" y2="145" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
          </g>

          {/* 20. Right Architectural Date Palm Garden */}
          <g>
            <line x1="1194" y1="145" x2="1194" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="1191" y1="92" x2="1197" y2="92" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1191" y1="104" x2="1197" y2="104" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1191" y1="116" x2="1197" y2="116" stroke="currentColor" strokeWidth="0.9" />
            <path d="M 1194 80 Q 1174 68 1156 74" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1194 80 Q 1180 56 1168 62" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1194 80 Q 1194 50 1194 46" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1194 80 Q 1208 56 1220 62" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1194 80 Q 1214 68 1232 74" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* ============================================================== */}
          {/* ZONE 3: MID-RIGHT - Varied Architecture                         */}
          {/* ============================================================== */}

          {/* 21. Modern Residence (54w x 74h) */}
          <rect x="1218" y="71" width="54" height="74" />
          <rect x="1230" y="63" width="30" height="8" />
          <rect x="1228" y="81" width="14" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1250" y="81" width="14" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1238" y="110" width="14" height="20" stroke="currentColor" strokeWidth="0.9" />

          {/* 22. Luxury Villa with Cantilever (58w x 68h) */}
          <rect x="1272" y="77" width="58" height="68" />
          <rect x="1284" y="69" width="42" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="1290" y1="80" x2="1322" y2="80" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="1282" y="105" width="18" height="25" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="1308" y="105" width="16" height="16" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 23. Stepped Residence (52w x 72h) */}
          <rect x="1330" y="73" width="52" height="72" />
          <rect x="1338" y="65" width="36" height="8" />
          <line x1="1330" y1="91" x2="1382" y2="91" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1330" y1="111" x2="1382" y2="111" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1356" y1="73" x2="1356" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 24. Contemporary Villa with Cantilever (56w x 68h) */}
          <rect x="1382" y="77" width="56" height="68" />
          <rect x="1394" y="69" width="40" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          <line x1="1400" y1="80" x2="1430" y2="80" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="1392" y="105" width="16" height="24" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="1416" y="105" width="16" height="16" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 25. Modern Townhouses (54w x 70h) */}
          <rect x="1438" y="75" width="54" height="70" />
          <line x1="1438" y1="95" x2="1492" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1438" y1="115" x2="1492" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1465" y1="75" x2="1465" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 26. Stepped Townhouses (52w x 75h) */}
          <rect x="1492" y="70" width="52" height="75" />
          <rect x="1514" y="64" width="30" height="6" />
          <rect x="1500" y="80" width="14" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1522" y="80" width="14" height="12" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1510" y="105" width="16" height="22" stroke="currentColor" strokeWidth="0.9" />

          {/* 27. Modern Commercial Block (52w x 80h) */}
          <rect x="1544" y="65" width="52" height="80" />
          <line x1="1544" y1="83" x2="1596" y2="83" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1544" y1="101" x2="1596" y2="101" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1544" y1="119" x2="1596" y2="119" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1561" y1="65" x2="1561" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1579" y1="65" x2="1579" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 28. Mid-Rise Grid Building (50w x 86h) */}
          <rect x="1596" y="59" width="50" height="86" />
          <line x1="1596" y1="77" x2="1646" y2="77" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1596" y1="95" x2="1646" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1596" y1="113" x2="1646" y2="113" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1613" y1="59" x2="1613" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1629" y1="59" x2="1629" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 29. High-Rise Tower (52w x 110h) */}
          <rect x="1646" y="35" width="52" height="110" />
          <rect x="1658" y="27" width="28" height="8" />
          <line x1="1646" y1="55" x2="1698" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1646" y1="75" x2="1698" y2="75" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1646" y1="95" x2="1698" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1646" y1="115" x2="1698" y2="115" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1663" y1="35" x2="1663" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1681" y1="35" x2="1681" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 30. Modern Townhouses with Pergola Roof (54w x 73h) */}
          <rect x="1698" y="72" width="54" height="73" />
          <line x1="1704" y1="62" x2="1746" y2="62" stroke="currentColor" strokeWidth="1.4" />
          <line x1="1710" y1="62" x2="1710" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1724" y1="62" x2="1724" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1738" y1="62" x2="1738" y2="72" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1704" y="86" width="16" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1728" y="86" width="16" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1718" y="116" width="14" height="29" stroke="currentColor" strokeWidth="0.9" />

          {/* 31. Stepped Townhouses with Balcony Railings (54w x 80h) */}
          <rect x="1752" y="65" width="54" height="80" />
          <rect x="1772" y="57" width="34" height="8" />
          <line x1="1776" y1="79" x2="1800" y2="79" stroke="currentColor" strokeWidth="1.1" />
          <line x1="1776" y1="84" x2="1800" y2="84" stroke="currentColor" strokeWidth="0.7" />
          <rect x="1780" y="69" width="16" height="10" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1776" y1="105" x2="1800" y2="105" stroke="currentColor" strokeWidth="1.1" />
          <line x1="1776" y1="110" x2="1800" y2="110" stroke="currentColor" strokeWidth="0.7" />
          <rect x="1780" y="95" width="16" height="10" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1772" y1="65" x2="1772" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="1756" y="78" width="10" height="18" stroke="currentColor" strokeWidth="0.9" />

          {/* 32. Commercial Gallery with Window Arrays (52w x 88h) */}
          <rect x="1806" y="57" width="52" height="88" />
          <rect x="1816" y="49" width="32" height="8" />
          <line x1="1806" y1="73" x2="1858" y2="73" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1806" y1="91" x2="1858" y2="91" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1806" y1="109" x2="1858" y2="109" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1806" y1="127" x2="1858" y2="127" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1823" y1="57" x2="1823" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1841" y1="57" x2="1841" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 33. Curved Corner Plaza Building (52w x 82h) */}
          <rect x="1858" y="63" width="52" height="82" />
          <path d="M 1858 63 Q 1884 54 1910 63" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="1858" y1="81" x2="1910" y2="81" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1858" y1="99" x2="1910" y2="99" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1858" y1="117" x2="1910" y2="117" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1875" y1="63" x2="1875" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1893" y1="63" x2="1893" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 34. Office Block with Sunshades (52w x 98h) */}
          <rect x="1910" y="47" width="52" height="98" />
          <line x1="1910" y1="65" x2="1962" y2="65" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1910" y1="83" x2="1962" y2="83" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1910" y1="101" x2="1962" y2="101" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1910" y1="119" x2="1962" y2="119" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1927" y1="47" x2="1927" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1945" y1="47" x2="1945" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 35. Grand Needle Spire Skyscraper (Towering Slender Tower: 54w x 125h) */}
          <rect x="1962" y="20" width="54" height="125" />
          <rect x="1976" y="8" width="26" height="12" />
          <line x1="1989" y1="-8" x2="1989" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="1983" y1="-1" x2="1995" y2="-1" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1962" y1="38" x2="2016" y2="38" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1962" y1="58" x2="2016" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1962" y1="78" x2="2016" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1962" y1="98" x2="2016" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1962" y1="118" x2="2016" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1975" y1="20" x2="1975" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1989" y1="20" x2="1989" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2003" y1="20" x2="2003" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="1980" y="128" width="18" height="17" stroke="currentColor" strokeWidth="0.9" />

          {/* 36. Stepped High-Rise Tower with Dual Spires (56w x 115h) */}
          <rect x="2016" y="30" width="56" height="115" />
          <line x1="2030" y1="14" x2="2030" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2058" y1="14" x2="2058" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2034" y1="46" x2="2034" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="2054" y1="46" x2="2054" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="2016" y1="60" x2="2072" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2016" y1="88" x2="2072" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2016" y1="116" x2="2072" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 37. Angled Crown Skyscraper (52w x 128h) */}
          <path d="M 2072 145 L 2072 18 L 2124 34 L 2124 145 Z" />
          <line x1="2090" y1="23" x2="2090" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2106" y1="28" x2="2106" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2072" y1="50" x2="2124" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2072" y1="76" x2="2124" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2072" y1="102" x2="2124" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2072" y1="126" x2="2124" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 38. Far Right Curved Cultural Center (50w x 75h) */}
          <ellipse cx="2160" cy="72" rx="36" ry="8" />
          <path d="M 2124 72 L 2124 145 L 2196 145 L 2196 72 Z" />
          <path d="M 2124 84 Q 2160 92 2196 84" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 2124 96 Q 2160 104 2196 96" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 2124 108 Q 2160 116 2196 108" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 2124 120 Q 2160 128 2196 120" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 2124 132 Q 2160 140 2196 132" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <line x1="2142" y1="86" x2="2142" y2="142" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="2160" y1="88" x2="2160" y2="144" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="2178" y1="86" x2="2178" y2="142" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <rect x="2150" y="130" width="20" height="15" stroke="currentColor" strokeWidth="0.9" />
        </g>
      </svg>
    </div>
  );
}
