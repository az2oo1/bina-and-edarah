import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, Generous Off-Frame Layout)   */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 650 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="96" x2="650" y2="96" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />

        {/* Soft Background Silhouette Layer */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.25" fill="currentColor" fillOpacity="0.06">
          <rect x="20" y="24" width="40" height="72" />
          <rect x="90" y="16" width="44" height="80" />
          <line x1="112" y1="6" x2="112" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="170" y="38" width="48" height="58" />
          <rect x="430" y="38" width="48" height="58" />
          <rect x="515" y="16" width="44" height="80" />
          <line x1="537" y1="6" x2="537" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="590" y="24" width="40" height="72" />
        </g>

        {/* Crisp Architectural Sketch Foreground Layer */}
        <g stroke="currentColor" strokeWidth="1.15" fill="var(--background)" strokeLinejoin="round">
          
          {/* 1. Left Curved Cultural Pavilion (Off-frame bleeding) */}
          <ellipse cx="32" cy="46" rx="28" ry="7" />
          <path d="M 4 46 L 4 96 L 60 96 L 60 46 Z" />
          <path d="M 4 56 Q 32 63 60 56" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 66 Q 32 73 60 66" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 76 Q 32 83 60 76" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 86 Q 32 93 60 86" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <line x1="18" y1="58" x2="18" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="32" y1="60" x2="32" y2="95" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="46" y1="58" x2="46" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />

          {/* 2. Left Soaring High-Rise Spire Skyscraper */}
          <rect x="68" y="20" width="56" height="76" />
          <rect x="80" y="10" width="32" height="10" />
          <line x1="96" y1="-4" x2="96" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="88" y1="2" x2="104" y2="2" stroke="currentColor" strokeWidth="1" />
          {/* Facade Window Grids */}
          <line x1="68" y1="35" x2="124" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="68" y1="50" x2="124" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="68" y1="65" x2="124" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="68" y1="80" x2="124" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="82" y1="20" x2="82" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="96" y1="20" x2="96" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="110" y1="20" x2="110" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          {/* Entrance */}
          <rect x="88" y="86" width="16" height="10" stroke="currentColor" strokeWidth="0.9" />

          {/* 3. Left Contemporary Luxury Villa with Cantilever & Pergola */}
          <rect x="134" y="52" width="70" height="44" />
          <rect x="128" y="44" width="50" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          {/* Pergola rafters */}
          <line x1="132" y1="36" x2="174" y2="36" stroke="currentColor" strokeWidth="1.4" />
          <line x1="138" y1="36" x2="138" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="150" y1="36" x2="150" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="162" y1="36" x2="162" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="136" y1="55" x2="168" y2="55" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          {/* Picture windows & door */}
          <rect x="142" y="70" width="18" height="26" stroke="currentColor" strokeWidth="0.9" />
          <rect x="170" y="70" width="22" height="16" stroke="currentColor" strokeWidth="0.9" />

          {/* 4. Left Architectural Date Palm Trees (Spacious garden) */}
          <g>
            <line x1="224" y1="96" x2="224" y2="58" stroke="currentColor" strokeWidth="2" />
            <line x1="221" y1="68" x2="227" y2="68" stroke="currentColor" strokeWidth="0.8" />
            <line x1="221" y1="78" x2="227" y2="78" stroke="currentColor" strokeWidth="0.8" />
            <line x1="221" y1="88" x2="227" y2="88" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 224 58 Q 208 48 194 54" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 224 58 Q 212 38 202 42" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 224 58 Q 224 34 224 32" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 224 58 Q 236 38 246 42" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 224 58 Q 240 48 254 54" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* 5. Centerpiece: Traditional Royal Marquee / Luxury Pavilion (بيت شعر ملكي فخم وعريض) */}
          <g>
            {/* Generous Faceted Tent Canopy */}
            <polygon points="260,96 260,68 295,50 355,50 390,68 390,96" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" />
            {/* King Poles & Finials */}
            <line x1="295" y1="50" x2="355" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <line x1="295" y1="40" x2="295" y2="50" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="295" cy="38" r="2" fill="currentColor" />
            <line x1="355" y1="40" x2="355" y2="50" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="355" cy="38" r="2" fill="currentColor" />
            {/* Hip ridges */}
            <line x1="260" y1="68" x2="295" y2="50" stroke="currentColor" strokeWidth="1.2" />
            <line x1="390" y1="68" x2="355" y2="50" stroke="currentColor" strokeWidth="1.2" />
            {/* Authentic Heritage Stripe Bands */}
            <line x1="260" y1="74" x2="390" y2="74" stroke="currentColor" strokeWidth="1.1" strokeDasharray="6 3" />
            <line x1="260" y1="80" x2="390" y2="80" stroke="currentColor" strokeWidth="1.1" strokeDasharray="6 3" />
            <line x1="260" y1="86" x2="390" y2="86" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            {/* Grand Central Drape Entrance */}
            <path d="M 314 96 L 325 72 L 336 96" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <line x1="325" y1="50" x2="325" y2="72" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            {/* Traditional Lantern */}
            <circle cx="325" cy="64" r="2.5" fill="currentColor" opacity="0.85" />
            {/* Tension Guy-Ropes to Ground Stakes */}
            <line x1="260" y1="68" x2="248" y2="96" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
            <line x1="390" y1="68" x2="402" y2="96" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
          </g>

          {/* 6. Right Architectural Date Palm Trees */}
          <g>
            <line x1="426" y1="96" x2="426" y2="58" stroke="currentColor" strokeWidth="2" />
            <line x1="423" y1="68" x2="429" y2="68" stroke="currentColor" strokeWidth="0.8" />
            <line x1="423" y1="78" x2="429" y2="78" stroke="currentColor" strokeWidth="0.8" />
            <line x1="423" y1="88" x2="429" y2="88" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 426 58 Q 410 48 396 54" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 426 58 Q 414 38 404 42" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 426 58 Q 426 34 426 32" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 426 58 Q 438 38 448 42" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 426 58 Q 442 48 456 54" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </g>

          {/* 7. Right Contemporary Luxury Villa */}
          <rect x="446" y="52" width="70" height="44" />
          <rect x="472" y="44" width="50" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.15" />
          {/* Pergola */}
          <line x1="476" y1="36" x2="518" y2="36" stroke="currentColor" strokeWidth="1.4" />
          <line x1="482" y1="36" x2="482" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="494" y1="36" x2="494" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="506" y1="36" x2="506" y2="44" stroke="currentColor" strokeWidth="0.8" />
          <line x1="482" y1="55" x2="514" y2="55" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="490" y="70" width="18" height="26" stroke="currentColor" strokeWidth="0.9" />
          <rect x="458" y="70" width="22" height="16" stroke="currentColor" strokeWidth="0.9" />

          {/* 8. Right Soaring High-Rise Spire Skyscraper */}
          <rect x="526" y="20" width="56" height="76" />
          <rect x="538" y="10" width="32" height="10" />
          <line x1="554" y1="-4" x2="554" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="546" y1="2" x2="562" y2="2" stroke="currentColor" strokeWidth="1" />
          <line x1="526" y1="35" x2="582" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="526" y1="50" x2="582" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="526" y1="65" x2="582" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="526" y1="80" x2="582" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="540" y1="20" x2="540" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="554" y1="20" x2="554" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="568" y1="20" x2="568" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="546" y="86" width="16" height="10" stroke="currentColor" strokeWidth="0.9" />

          {/* 9. Right Curved Cultural Pavilion (Off-frame bleeding) */}
          <ellipse cx="618" cy="46" rx="28" ry="7" />
          <path d="M 590 46 L 590 96 L 646 96 L 646 46 Z" />
          <path d="M 590 56 Q 618 63 646 56" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 590 66 Q 618 73 646 66" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 590 76 Q 618 83 646 76" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 590 86 Q 618 93 646 86" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <line x1="604" y1="58" x2="604" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="618" y1="60" x2="618" y2="95" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="632" y1="58" x2="632" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP / PC SKYLINE (2400x150 Vector, Generous Off-Frame Panoramic View) */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 2400 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="145" x2="2400" y2="145" stroke="currentColor" strokeWidth="1.8" opacity="0.85" />

        {/* Desktop Background Silhouette Layer */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.25" fill="currentColor" fillOpacity="0.06">
          <rect x="30" y="32" width="60" height="113" />
          <rect x="150" y="20" width="55" height="125" />
          <line x1="177" y1="6" x2="177" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="270" y="40" width="55" height="105" />
          <rect x="390" y="24" width="60" height="121" />
          <line x1="420" y1="8" x2="420" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="510" y="52" width="65" height="93" />
          <rect x="630" y="38" width="60" height="107" />
          <rect x="750" y="60" width="65" height="85" />
          <rect x="880" y="50" width="70" height="95" />
          <rect x="1010" y="68" width="70" height="77" />
          
          {/* Center backdrop behind royal pavilion */}
          <rect x="1140" y="80" width="60" height="65" />
          <rect x="1200" y="80" width="60" height="65" />

          <rect x="1320" y="68" width="70" height="77" />
          <rect x="1450" y="50" width="70" height="95" />
          <rect x="1585" y="60" width="65" height="85" />
          <rect x="1710" y="38" width="60" height="107" />
          <rect x="1825" y="52" width="65" height="93" />
          <rect x="1950" y="24" width="60" height="121" />
          <line x1="1980" y1="8" x2="1980" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="2075" y="40" width="55" height="105" />
          <rect x="2195" y="20" width="55" height="125" />
          <line x1="2222" y1="6" x2="2222" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="2310" y="32" width="60" height="113" />
        </g>

        {/* Foreground Layer (Generously Proportioned Architectural Ink Drawings) */}
        <g stroke="currentColor" strokeWidth="1.15" fill="var(--background)" strokeLinejoin="round">
          
          {/* 1. Far Left Iconic Curved Cultural Center (Bleeds off-frame on standard monitors) */}
          <ellipse cx="60" cy="74" rx="55" ry="11" />
          <path d="M 5 74 L 5 145 L 115 145 L 115 74 Z" />
          <path d="M 5 88 Q 60 98 115 88" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 5 102 Q 60 112 115 102" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 5 116 Q 60 126 115 116" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 5 130 Q 60 140 115 130" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="32" y1="91" x2="32" y2="143" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="60" y1="94" x2="60" y2="144" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="88" y1="91" x2="88" y2="143" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="45" y="130" width="30" height="15" stroke="currentColor" strokeWidth="0.9" />

          {/* 2. Left Angled Crown Skyscraper */}
          <path d="M 115 145 L 115 34 L 195 18 L 195 145 Z" />
          <line x1="142" y1="28" x2="142" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="168" y1="23" x2="168" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="115" y1="50" x2="195" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="115" y1="76" x2="195" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="115" y1="102" x2="195" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="115" y1="126" x2="195" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 3. Left Stepped High-Rise Tower with Dual Spires */}
          <rect x="195" y="32" width="85" height="113" />
          <line x1="218" y1="16" x2="218" y2="32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="257" y1="16" x2="257" y2="32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="223" y1="48" x2="223" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="252" y1="48" x2="252" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="195" y1="62" x2="280" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="195" y1="90" x2="280" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="195" y1="118" x2="280" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 4. Left Grand Needle Spire Skyscraper (Towering Anchor) */}
          <rect x="280" y="24" width="90" height="121" />
          <rect x="305" y="10" width="40" height="14" />
          <line x1="325" y1="-6" x2="325" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="316" y1="0" x2="334" y2="0" stroke="currentColor" strokeWidth="1.2" />
          {/* Rich vertical mullions */}
          <line x1="280" y1="42" x2="370" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="280" y1="62" x2="370" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="280" y1="82" x2="370" y2="82" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="280" y1="102" x2="370" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="280" y1="122" x2="370" y2="122" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="302" y1="24" x2="302" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="317" y1="24" x2="317" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="333" y1="24" x2="333" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="348" y1="24" x2="348" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="312" y="128" width="26" height="17" stroke="currentColor" strokeWidth="0.9" />

          {/* 5. Left Commercial Office Block with Sunshades */}
          <rect x="370" y="48" width="85" height="97" />
          <line x1="370" y1="66" x2="455" y2="66" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="370" y1="84" x2="455" y2="84" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="370" y1="102" x2="455" y2="102" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="370" y1="120" x2="455" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="398" y1="48" x2="398" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="427" y1="48" x2="427" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 6. Left Curved Corner Plaza Building */}
          <rect x="455" y="66" width="85" height="79" />
          <path d="M 455 66 Q 497 56 540 66" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="455" y1="84" x2="540" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="455" y1="102" x2="540" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="455" y1="120" x2="540" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="483" y1="66" x2="483" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="512" y1="66" x2="512" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 7. Left Commercial Gallery with Window Arrays */}
          <rect x="540" y="60" width="85" height="85" />
          <rect x="555" y="52" width="55" height="8" />
          <line x1="540" y1="76" x2="625" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="540" y1="94" x2="625" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="540" y1="112" x2="625" y2="112" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="540" y1="130" x2="625" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="568" y1="60" x2="568" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="597" y1="60" x2="597" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 8. Left Stepped Townhouses with Balcony Railings */}
          <rect x="625" y="68" width="90" height="77" />
          <rect x="625" y="60" width="55" height="8" />
          {/* Balconies */}
          <line x1="635" y1="84" x2="675" y2="84" stroke="currentColor" strokeWidth="1.2" />
          <line x1="635" y1="90" x2="675" y2="90" stroke="currentColor" strokeWidth="0.7" />
          <rect x="642" y="72" width="26" height="12" stroke="currentColor" strokeWidth="0.8" />
          <line x1="635" y1="110" x2="675" y2="110" stroke="currentColor" strokeWidth="1.2" />
          <line x1="635" y1="116" x2="675" y2="116" stroke="currentColor" strokeWidth="0.7" />
          <rect x="642" y="98" width="26" height="12" stroke="currentColor" strokeWidth="0.8" />
          <line x1="680" y1="68" x2="680" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="690" y="80" width="18" height="25" stroke="currentColor" strokeWidth="0.9" />

          {/* 9. Left Modern Townhouses with Pergola Roof */}
          <rect x="715" y="74" width="95" height="71" />
          <line x1="725" y1="64" x2="785" y2="64" stroke="currentColor" strokeWidth="1.5" />
          <line x1="735" y1="64" x2="735" y2="74" stroke="currentColor" strokeWidth="0.8" />
          <line x1="755" y1="64" x2="755" y2="74" stroke="currentColor" strokeWidth="0.8" />
          <line x1="775" y1="64" x2="775" y2="74" stroke="currentColor" strokeWidth="0.8" />
          <rect x="730" y="88" width="28" height="20" stroke="currentColor" strokeWidth="0.9" />
          <rect x="768" y="88" width="28" height="20" stroke="currentColor" strokeWidth="0.9" />
          <rect x="748" y="118" width="22" height="27" stroke="currentColor" strokeWidth="0.9" />

          {/* 10. Left Modern Luxury Villa with Cantilever & Arabesque Accents */}
          <rect x="810" y="78" width="105" height="67" />
          <rect x="802" y="68" width="75" height="30" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
          <line x1="812" y1="82" x2="865" y2="82" stroke="currentColor" strokeWidth="1.4" opacity="0.8" />
          <rect x="822" y="110" width="28" height="35" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="865" y="110" width="35" height="22" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 11. Left Architectural Date Palm Garden (نخيل معماري بتفاصيل فاخرة) */}
          <g>
            <line x1="945" y1="145" x2="945" y2="92" stroke="currentColor" strokeWidth="2.2" />
            <line x1="941" y1="104" x2="949" y2="104" stroke="currentColor" strokeWidth="0.9" />
            <line x1="941" y1="116" x2="949" y2="116" stroke="currentColor" strokeWidth="0.9" />
            <line x1="941" y1="128" x2="949" y2="128" stroke="currentColor" strokeWidth="0.9" />
            <path d="M 945 92 Q 922 78 902 86" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 945 92 Q 928 66 914 72" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 945 92 Q 945 58 945 55" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 945 92 Q 962 66 976 72" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 945 92 Q 968 78 988 86" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* Companion smaller palm */}
            <line x1="995" y1="145" x2="995" y2="104" stroke="currentColor" strokeWidth="1.8" />
            <line x1="992" y1="114" x2="998" y2="114" stroke="currentColor" strokeWidth="0.8" />
            <line x1="992" y1="126" x2="998" y2="126" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 995 104 Q 978 94 964 100" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 995 104 Q 982 84 972 88" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 995 104 Q 995 78 995 76" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 995 104 Q 1008 84 1018 88" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 995 104 Q 1012 94 1026 100" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* ============================================================== */}
          {/* ZONE 3: CENTERPIECE - Grand Traditional Royal Marquee / Pavilion */}
          {/* (Spacious, majestic, exactly in the center of the horizon)     */}
          {/* ============================================================== */}
          <g>
            {/* Grand Pavilion Canopy Structure (Generous width 240 units!) */}
            <polygon points="1040,145 1040,104 1100,74 1300,74 1360,104 1360,145" fill="var(--background)" stroke="currentColor" strokeWidth="1.6" />
            {/* King Poles & Ornate Finials */}
            <line x1="1100" y1="74" x2="1300" y2="74" stroke="currentColor" strokeWidth="1.6" />
            <line x1="1100" y1="58" x2="1100" y2="74" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="1100" cy="56" r="2.5" fill="currentColor" />
            <line x1="1300" y1="58" x2="1300" y2="74" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="1300" cy="56" r="2.5" fill="currentColor" />
            {/* Intermediate center pole */}
            <line x1="1200" y1="64" x2="1200" y2="74" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="1200" cy="62" r="2" fill="currentColor" />
            {/* Faceted canopy hips */}
            <line x1="1040" y1="104" x2="1100" y2="74" stroke="currentColor" strokeWidth="1.3" />
            <line x1="1360" y1="104" x2="1300" y2="74" stroke="currentColor" strokeWidth="1.3" />
            {/* Authentic Heritage Stripe Bands */}
            <line x1="1040" y1="112" x2="1360" y2="112" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 4" />
            <line x1="1040" y1="120" x2="1360" y2="120" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 4" />
            <line x1="1040" y1="128" x2="1360" y2="128" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            <line x1="1040" y1="136" x2="1360" y2="136" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
            {/* Grand Central Drape Entrance */}
            <path d="M 1180 145 L 1200 108 L 1220 145" stroke="currentColor" strokeWidth="1.4" fill="none" />
            <line x1="1200" y1="74" x2="1200" y2="108" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            {/* Hanging Traditional Brass Lantern */}
            <circle cx="1200" cy="98" r="3.2" fill="currentColor" opacity="0.85" />
            {/* Tension Guy-Ropes to Ground Stakes */}
            <line x1="1040" y1="104" x2="1022" y2="145" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="1050" y1="104" x2="1036" y2="145" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" />
            <line x1="1360" y1="104" x2="1378" y2="145" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="1350" y1="104" x2="1364" y2="145" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" />
          </g>

          {/* 12. Right Architectural Date Palm Garden (نخيل معماري بتفاصيل فاخرة) */}
          <g>
            <line x1="1405" y1="145" x2="1405" y2="104" stroke="currentColor" strokeWidth="1.8" />
            <line x1="1402" y1="114" x2="1408" y2="114" stroke="currentColor" strokeWidth="0.8" />
            <line x1="1402" y1="126" x2="1408" y2="126" stroke="currentColor" strokeWidth="0.8" />
            <path d="M 1405 104 Q 1388 94 1374 100" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 1405 104 Q 1392 84 1382 88" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 1405 104 Q 1405 78 1405 76" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M 1405 104 Q 1418 84 1428 88" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 1405 104 Q 1422 94 1436 100" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            <line x1="1455" y1="145" x2="1455" y2="92" stroke="currentColor" strokeWidth="2.2" />
            <line x1="1451" y1="104" x2="1459" y2="104" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1451" y1="116" x2="1459" y2="116" stroke="currentColor" strokeWidth="0.9" />
            <line x1="1451" y1="128" x2="1459" y2="128" stroke="currentColor" strokeWidth="0.9" />
            <path d="M 1455 92 Q 1432 78 1412 86" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1455 92 Q 1438 66 1424 72" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1455 92 Q 1455 58 1455 55" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 1455 92 Q 1472 66 1486 72" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M 1455 92 Q 1478 78 1498 86" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>

          {/* 13. Right Modern Luxury Villa with Cantilever */}
          <rect x="1485" y="78" width="105" height="67" />
          <rect x="1523" y="68" width="75" height="30" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1535" y1="82" x2="1588" y2="82" stroke="currentColor" strokeWidth="1.4" opacity="0.8" />
          <rect x="1550" y="110" width="28" height="35" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <rect x="1500" y="110" width="35" height="22" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 14. Right Modern Townhouses with Pergola */}
          <rect x="1590" y="74" width="95" height="71" />
          <line x1="1600" y1="64" x2="1660" y2="64" stroke="currentColor" strokeWidth="1.5" />
          <line x1="1610" y1="64" x2="1610" y2="74" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1630" y1="64" x2="1630" y2="74" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1650" y1="64" x2="1650" y2="74" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1604" y="88" width="28" height="20" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1642" y="88" width="28" height="20" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1630" y="118" width="22" height="27" stroke="currentColor" strokeWidth="0.9" />

          {/* 15. Right Stepped Townhouses with Balconies */}
          <rect x="1685" y="68" width="90" height="77" />
          <rect x="1720" y="60" width="55" height="8" />
          <line x1="1725" y1="84" x2="1765" y2="84" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1725" y1="90" x2="1765" y2="90" stroke="currentColor" strokeWidth="0.7" />
          <rect x="1732" y="72" width="26" height="12" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1725" y1="110" x2="1765" y2="110" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1725" y1="116" x2="1765" y2="116" stroke="currentColor" strokeWidth="0.7" />
          <rect x="1732" y="98" width="26" height="12" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1720" y1="68" x2="1720" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="1692" y="80" width="18" height="25" stroke="currentColor" strokeWidth="0.9" />

          {/* 16. Right Commercial Gallery with Windows Grid */}
          <rect x="1775" y="60" width="85" height="85" />
          <rect x="1790" y="52" width="55" height="8" />
          <line x1="1775" y1="76" x2="1860" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1775" y1="94" x2="1860" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1775" y1="112" x2="1860" y2="112" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1775" y1="130" x2="1860" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1803" y1="60" x2="1803" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1832" y1="60" x2="1832" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 17. Right Curved Corner Plaza Building */}
          <rect x="1860" y="66" width="85" height="79" />
          <path d="M 1860 66 Q 1902 56 1945 66" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="1860" y1="84" x2="1945" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1860" y1="102" x2="1945" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1860" y1="120" x2="1945" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1888" y1="66" x2="1888" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1917" y1="66" x2="1917" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 18. Right Commercial Office Block with Sunshades */}
          <rect x="1945" y="48" width="85" height="97" />
          <line x1="1945" y1="66" x2="2030" y2="66" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1945" y1="84" x2="2030" y2="84" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1945" y1="102" x2="2030" y2="102" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1945" y1="120" x2="2030" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.75" />
          <line x1="1973" y1="48" x2="1973" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="2002" y1="48" x2="2002" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 19. Right Grand Needle Spire Skyscraper (Twin Anchor) */}
          <rect x="2030" y="24" width="90" height="121" />
          <rect x="2055" y="10" width="40" height="14" />
          <line x1="2075" y1="-6" x2="2075" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="2066" y1="0" x2="2084" y2="0" stroke="currentColor" strokeWidth="1.2" />
          <line x1="2030" y1="42" x2="2120" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2030" y1="62" x2="2120" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2030" y1="82" x2="2120" y2="82" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2030" y1="102" x2="2120" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2030" y1="122" x2="2120" y2="122" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2052" y1="24" x2="2052" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2067" y1="24" x2="2067" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2083" y1="24" x2="2083" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2098" y1="24" x2="2098" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="2062" y="128" width="26" height="17" stroke="currentColor" strokeWidth="0.9" />

          {/* 20. Right Stepped High-Rise Tower with Dual Spires */}
          <rect x="2120" y="32" width="85" height="113" />
          <line x1="2143" y1="16" x2="2143" y2="32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="2182" y1="16" x2="2182" y2="32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="2148" y1="48" x2="2148" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="2177" y1="48" x2="2177" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="2120" y1="62" x2="2205" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2120" y1="90" x2="2205" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2120" y1="118" x2="2205" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 21. Right Angled Crown Skyscraper */}
          <path d="M 2205 145 L 2205 18 L 2285 34 L 2285 145 Z" />
          <line x1="2232" y1="23" x2="2232" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2258" y1="28" x2="2258" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2205" y1="50" x2="2285" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2205" y1="76" x2="2285" y2="76" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2205" y1="102" x2="2285" y2="102" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2205" y1="126" x2="2285" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 22. Far Right Iconic Curved Cultural Center (Bleeds off-frame on standard monitors) */}
          <ellipse cx="2340" cy="74" rx="55" ry="11" />
          <path d="M 2285 74 L 2285 145 L 2395 145 L 2395 74 Z" />
          <path d="M 2285 88 Q 2340 98 2395 88" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 2285 102 Q 2340 112 2395 102" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 2285 116 Q 2340 126 2395 116" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 2285 130 Q 2340 140 2395 130" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="2312" y1="91" x2="2312" y2="143" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2340" y1="94" x2="2340" y2="144" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="2368" y1="91" x2="2368" y2="143" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <rect x="2325" y="130" width="30" height="15" stroke="currentColor" strokeWidth="0.9" />
        </g>
      </svg>
    </div>
  );
}
