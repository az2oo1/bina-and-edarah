import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-24 sm:h-26 md:h-28 lg:h-32 xl:h-36 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, Crisp Architectural Sketch)  */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 500 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="none"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="96" x2="500" y2="96" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />

        {/* Soft Background Layer (Architectural Silhouettes in Depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.32" fill="currentColor" fillOpacity="0.08">
          <rect x="10" y="24" width="28" height="72" />
          <rect x="42" y="16" width="30" height="80" />
          <line x1="57" y1="6" x2="57" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="105" y="32" width="34" height="64" />
          <rect x="180" y="44" width="36" height="52" />
          <rect x="280" y="44" width="36" height="52" />
          <rect x="365" y="30" width="34" height="66" />
          <rect x="425" y="14" width="30" height="82" />
          <line x1="440" y1="4" x2="440" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="462" y="24" width="28" height="72" />
        </g>

        {/* Crisp Architectural Sketch Foreground Layer */}
        <g stroke="currentColor" strokeWidth="1.2" fill="var(--background)" strokeLinejoin="round">
          
          {/* 1. Left Curved Modern Architectural Center (Iconic cylindrical building) */}
          <ellipse cx="24" cy="46" rx="20" ry="6" />
          <path d="M 4 46 L 4 96 L 44 96 L 44 46 Z" />
          {/* Curved ribbon rings */}
          <path d="M 4 56 Q 24 62 44 56" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 66 Q 24 72 44 66" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 76 Q 24 82 44 76" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <path d="M 4 86 Q 24 92 44 86" stroke="currentColor" strokeWidth="0.9" fill="none" />
          <line x1="14" y1="58" x2="14" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="24" y1="60" x2="24" y2="95" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
          <line x1="34" y1="58" x2="34" y2="94" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />

          {/* 2. Left High-Rise Office Tower with Spire */}
          <rect x="40" y="22" width="36" height="74" />
          <rect x="48" y="14" width="20" height="8" />
          <line x1="58" y1="2" x2="58" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          {/* Louvered facade */}
          <line x1="49" y1="28" x2="49" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="58" y1="28" x2="58" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="67" y1="28" x2="67" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 3. Mid-Rise Grid Building */}
          <rect x="74" y="38" width="36" height="58" />
          {/* Architectural window grid */}
          <line x1="74" y1="50" x2="110" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="74" y1="62" x2="110" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="74" y1="74" x2="110" y2="74" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="74" y1="86" x2="110" y2="86" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="86" y1="38" x2="86" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="98" y1="38" x2="98" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 4. Contemporary Stepped Townhouse */}
          <rect x="108" y="48" width="36" height="48" />
          <rect x="114" y="42" width="24" height="6" />
          <rect x="116" y="56" width="10" height="12" stroke="currentColor" strokeWidth="0.9" />
          <rect x="130" y="56" width="10" height="12" stroke="currentColor" strokeWidth="0.9" />
          <rect x="122" y="74" width="10" height="22" stroke="currentColor" strokeWidth="0.9" />

          {/* 5. Modern Villa with Cantilever & Pergola */}
          <rect x="142" y="56" width="46" height="40" />
          <rect x="138" y="50" width="32" height="16" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          {/* Pergola */}
          <line x1="140" y1="44" x2="168" y2="44" stroke="currentColor" strokeWidth="1.3" />
          <line x1="146" y1="44" x2="146" y2="50" stroke="currentColor" strokeWidth="0.8" />
          <line x1="154" y1="44" x2="154" y2="50" stroke="currentColor" strokeWidth="0.8" />
          <line x1="162" y1="44" x2="162" y2="50" stroke="currentColor" strokeWidth="0.8" />
          <rect x="146" y="72" width="14" height="24" stroke="currentColor" strokeWidth="0.9" />

          {/* 6. Left Palm Tree (نخلة معمارية) */}
          <line x1="194" y1="96" x2="194" y2="66" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 194 66 Q 182 58 172 64 M 194 66 Q 186 52 178 56 M 194 66 Q 194 48 194 46 M 194 66 Q 202 52 210 56 M 194 66 Q 206 58 216 64" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* 7. Center Traditional Royal Marquee / Luxury Heritage Pavilion (بيت شعر ملكي أنيق) */}
          <polygon points="212,96 212,74 235,60 265,60 288,74 288,96" fill="var(--background)" stroke="currentColor" strokeWidth="1.3" />
          {/* Pavilion architectural stripe bands */}
          <line x1="212" y1="80" x2="288" y2="80" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 2" />
          <line x1="212" y1="88" x2="288" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          {/* Central tent drape opening */}
          <path d="M 245 96 L 250 82 L 255 96" stroke="currentColor" strokeWidth="1.1" fill="none" />
          <line x1="250" y1="60" x2="250" y2="82" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          {/* Tent poles / peak ornaments */}
          <line x1="235" y1="54" x2="235" y2="60" stroke="currentColor" strokeWidth="1.2" />
          <line x1="265" y1="54" x2="265" y2="60" stroke="currentColor" strokeWidth="1.2" />

          {/* 8. Right Palm Tree (نخلة معمارية) */}
          <line x1="304" y1="96" x2="304" y2="66" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 304 66 Q 292 58 282 64 M 304 66 Q 296 52 288 56 M 304 66 Q 304 48 304 46 M 304 66 Q 312 52 320 56 M 304 66 Q 316 58 326 64" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* 9. Modern Curved Corner Boutique */}
          <rect x="318" y="52" width="40" height="44" />
          <path d="M 318 52 Q 338 46 358 52" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="318" y1="68" x2="358" y2="68" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="318" y1="82" x2="358" y2="82" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="330" y1="52" x2="330" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="346" y1="52" x2="346" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 10. Mid-Rise Architectural Block */}
          <rect x="354" y="38" width="38" height="58" />
          <line x1="354" y1="52" x2="392" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="354" y1="66" x2="392" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="354" y1="80" x2="392" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="367" y1="38" x2="367" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="380" y1="38" x2="380" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 11. Right Angled Crown Tower */}
          <path d="M 390 96 L 390 34 L 424 24 L 424 96 Z" />
          <line x1="402" y1="34" x2="402" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="414" y1="30" x2="414" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 12. Right Soaring Needle Spire Skyscraper */}
          <rect x="420" y="20" width="38" height="76" />
          <rect x="428" y="10" width="22" height="10" />
          <line x1="439" y1="-2" x2="439" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Facade details */}
          <line x1="420" y1="36" x2="458" y2="36" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="420" y1="52" x2="458" y2="52" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="420" y1="68" x2="458" y2="68" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="420" y1="84" x2="458" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="432" y1="20" x2="432" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="446" y1="20" x2="446" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 13. Right Edge Commercial Building */}
          <rect x="456" y="32" width="44" height="64" />
          <line x1="470" y1="42" x2="470" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
          <line x1="486" y1="42" x2="486" y2="90" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP / PC SKYLINE (1920x150 Vector, Rich Hand-Drawn Architectural Variety) */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 1920 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="none"
      >
        {/* Continuous Baseline Horizon */}
        <line x1="0" y1="145" x2="1920" y2="145" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />

        {/* Desktop Background Layer (Slender silhouettes for architectural atmospheric depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.32" fill="currentColor" fillOpacity="0.08">
          {/* Far left high-rises */}
          <rect x="15" y="34" width="38" height="111" />
          <rect x="55" y="20" width="36" height="125" />
          <line x1="73" y1="6" x2="73" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="94" y="42" width="36" height="103" />
          <rect x="134" y="26" width="38" height="119" />
          <rect x="174" y="48" width="36" height="97" />
          <rect x="214" y="30" width="38" height="115" />
          <line x1="233" y1="16" x2="233" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="256" y="52" width="36" height="93" />
          <rect x="296" y="36" width="38" height="109" />
          <rect x="340" y="58" width="36" height="87" />
          <rect x="382" y="44" width="38" height="101" />

          {/* Left-center mid-rises */}
          <rect x="430" y="62" width="40" height="83" />
          <rect x="475" y="50" width="38" height="95" />
          <rect x="520" y="68" width="42" height="77" />
          <rect x="570" y="56" width="40" height="89" />
          <rect x="620" y="74" width="44" height="71" />
          <rect x="675" y="64" width="42" height="81" />
          <rect x="730" y="78" width="44" height="67" />
          <rect x="785" y="68" width="46" height="77" />
          <rect x="845" y="80" width="44" height="65" />

          {/* Center background (urban backdrop behind royal pavilion) */}
          <rect x="900" y="82" width="40" height="63" />
          <rect x="975" y="82" width="40" height="63" />

          {/* Right-center mid-rises */}
          <rect x="1030" y="80" width="44" height="65" />
          <rect x="1090" y="68" width="46" height="77" />
          <rect x="1145" y="78" width="44" height="67" />
          <rect x="1200" y="64" width="42" height="81" />
          <rect x="1255" y="74" width="44" height="71" />
          <rect x="1305" y="56" width="40" height="89" />
          <rect x="1355" y="68" width="42" height="77" />
          <rect x="1405" y="50" width="38" height="95" />
          <rect x="1450" y="62" width="40" height="83" />

          {/* Far right skyscrapers */}
          <rect x="1500" y="44" width="38" height="101" />
          <rect x="1542" y="36" width="38" height="109" />
          <rect x="1586" y="52" width="36" height="93" />
          <rect x="1628" y="30" width="38" height="115" />
          <line x1="1647" y1="16" x2="1647" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1670" y="48" width="36" height="97" />
          <rect x="1710" y="26" width="38" height="119" />
          <rect x="1750" y="42" width="36" height="103" />
          <rect x="1790" y="20" width="36" height="125" />
          <line x1="1808" y1="6" x2="1808" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1830" y="34" width="38" height="111" />
        </g>

        {/* Desktop Foreground Layer (Crisp, richly varied architectural drawing with clear ink strokes) */}
        <g stroke="currentColor" strokeWidth="1.2" fill="var(--background)" strokeLinejoin="round">
          
          {/* ============================================================== */}
          {/* ZONE 1: FAR LEFT - Modern High-Rises & Curved Architecture      */}
          {/* ============================================================== */}
          
          {/* 1. Iconic Curved Modern Cultural / Corporate Center */}
          <ellipse cx="32" cy="74" rx="30" ry="8" />
          <path d="M 2 74 L 2 145 L 62 145 L 62 74 Z" />
          {/* Curved ribbon floor bands */}
          <path d="M 2 88 Q 32 96 62 88" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 2 102 Q 32 110 62 102" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 2 116 Q 32 124 62 116" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 2 130 Q 32 138 62 130" stroke="currentColor" strokeWidth="1" fill="none" />
          {/* Vertical facade mullions */}
          <line x1="16" y1="89" x2="16" y2="142" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="32" y1="92" x2="32" y2="144" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="48" y1="89" x2="48" y2="142" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 2. Stepped High-Rise Office Tower */}
          <rect x="58" y="38" width="46" height="107" />
          <rect x="68" y="28" width="26" height="10" />
          <line x1="81" y1="16" x2="81" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          {/* Grid windows */}
          <line x1="58" y1="54" x2="104" y2="54" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="58" y1="72" x2="104" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="58" y1="90" x2="104" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="58" y1="108" x2="104" y2="108" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="58" y1="126" x2="104" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="73" y1="38" x2="73" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="89" y1="38" x2="89" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 3. Slender Angled Crown Skyscraper */}
          <path d="M 100 145 L 100 32 L 144 20 L 144 145 Z" />
          <line x1="114" y1="34" x2="114" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="130" y1="30" x2="130" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 4. Grand Spire Skyscraper (Inspired by the majestic main tower in the photo) */}
          <rect x="140" y="24" width="48" height="121" />
          <rect x="150" y="12" width="28" height="12" />
          <line x1="164" y1="-2" x2="164" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Vertical Louver/Fin Texture */}
          <line x1="140" y1="44" x2="188" y2="44" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="140" y1="66" x2="188" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="140" y1="88" x2="188" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="140" y1="110" x2="188" y2="110" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="140" y1="130" x2="188" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="152" y1="24" x2="152" y2="145" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="164" y1="24" x2="164" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="176" y1="24" x2="176" y2="145" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />

          {/* 5. Corporate Mid-Rise with Recessed Balconies */}
          <rect x="184" y="44" width="44" height="101" />
          <line x1="198" y1="56" x2="198" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="214" y1="56" x2="214" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 6. Stepped High-Rise with Dual Spires */}
          <rect x="224" y="32" width="48" height="113" />
          <line x1="236" y1="18" x2="236" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="260" y1="18" x2="260" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="238" y1="46" x2="238" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="258" y1="46" x2="258" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 7. Commercial Block with Horizontal Sunshades */}
          <rect x="268" y="52" width="44" height="93" />
          <line x1="268" y1="68" x2="312" y2="68" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="268" y1="84" x2="312" y2="84" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="268" y1="100" x2="312" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="268" y1="116" x2="312" y2="116" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="268" y1="132" x2="312" y2="132" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* 8. Slender Spire Tower */}
          <rect x="308" y="36" width="42" height="109" />
          <line x1="329" y1="22" x2="329" y2="36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="322" y1="48" x2="322" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="336" y1="48" x2="336" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 9. Angled Facade High-Rise */}
          <path d="M 346 145 L 346 48 L 388 38 L 388 145 Z" />
          <line x1="360" y1="52" x2="360" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="374" y1="48" x2="374" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 10. Transition Mid-Rise */}
          <rect x="384" y="60" width="46" height="85" />
          <line x1="384" y1="78" x2="430" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="384" y1="98" x2="430" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="384" y1="118" x2="430" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* ============================================================== */}
          {/* ZONE 2: MID-LEFT - Varied Urban & Residential Architecture      */}
          {/* ============================================================== */}

          {/* 11. Stepped Boutique Residence */}
          <rect x="426" y="72" width="48" height="73" />
          <rect x="426" y="66" width="28" height="6" />
          <line x1="442" y1="84" x2="442" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
          <line x1="458" y1="84" x2="458" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

          {/* 12. Modern Commercial Gallery with Windows Grid */}
          <rect x="470" y="64" width="52" height="81" />
          <line x1="470" y1="80" x2="522" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="470" y1="98" x2="522" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="470" y1="116" x2="522" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="487" y1="64" x2="487" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="505" y1="64" x2="505" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 13. Contemporary Curved Corner Plaza Building */}
          <rect x="518" y="70" width="54" height="75" />
          <path d="M 518 70 Q 545 62 572 70" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <line x1="518" y1="88" x2="572" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="518" y1="106" x2="572" y2="106" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="518" y1="124" x2="572" y2="124" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="536" y1="70" x2="536" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="554" y1="70" x2="554" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 14. Luxury Villa with Cantilever & Arabesque Elements */}
          <rect x="568" y="80" width="56" height="65" />
          <rect x="564" y="72" width="40" height="20" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <line x1="570" y1="82" x2="598" y2="82" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="578" y="104" width="16" height="22" stroke="currentColor" strokeWidth="1" opacity="0.8" />
          <rect x="604" y="104" width="14" height="16" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          {/* 15. Modern Townhouses with Pergola */}
          <rect x="620" y="76" width="58" height="69" />
          {/* Pergola on roof */}
          <line x1="626" y1="68" x2="666" y2="68" stroke="currentColor" strokeWidth="1.4" />
          <line x1="632" y1="68" x2="632" y2="76" stroke="currentColor" strokeWidth="0.8" />
          <line x1="644" y1="68" x2="644" y2="76" stroke="currentColor" strokeWidth="0.8" />
          <line x1="656" y1="68" x2="656" y2="76" stroke="currentColor" strokeWidth="0.8" />
          <rect x="632" y="90" width="18" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="654" y="90" width="18" height="14" stroke="currentColor" strokeWidth="0.9" />

          {/* 16. Contemporary Residence with Balconies */}
          <rect x="674" y="82" width="54" height="63" />
          <rect x="694" y="76" width="28" height="6" />
          <line x1="688" y1="94" x2="688" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="714" y1="94" x2="714" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 17. Modern Duplex */}
          <rect x="724" y="78" width="56" height="67" />
          <line x1="724" y1="96" x2="780" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="724" y1="116" x2="780" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 18. Boutique Residential Block */}
          <rect x="776" y="84" width="52" height="61" />
          <rect x="772" y="78" width="36" height="18" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <rect x="784" y="106" width="14" height="20" stroke="currentColor" strokeWidth="0.9" />

          {/* 19. Left Architectural Palm Tree Group (نخيل معماري أنيق) */}
          <line x1="840" y1="145" x2="840" y2="102" stroke="currentColor" strokeWidth="1.8" />
          <path d="M 840 102 Q 825 92 812 98 M 840 102 Q 830 84 820 88 M 840 102 Q 840 76 840 74 M 840 102 Q 850 84 860 88 M 840 102 Q 855 92 868 98" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          
          <line x1="870" y1="145" x2="870" y2="110" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 870 110 Q 858 102 848 107 M 870 110 Q 862 94 854 98 M 870 110 Q 870 88 870 86 M 870 110 Q 878 94 886 98 M 870 110 Q 882 102 892 107" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* ============================================================== */}
          {/* ZONE 3: CENTERPIECE - Traditional Royal Marquee / Luxury Tent    */}
          {/* (Inspired directly by the centerpiece in the reference drawing!) */}
          {/* ============================================================== */}
          
          {/* Main Heritage Pavilion (بيت شعر ملكي أنيق مع أروقة ورواشن) */}
          <polygon points="898,145 898,110 932,88 988,88 1022,110 1022,145" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" />
          {/* Roof Ridge & Tent Poles */}
          <line x1="932" y1="88" x2="988" y2="88" stroke="currentColor" strokeWidth="1.5" />
          <line x1="932" y1="78" x2="932" y2="88" stroke="currentColor" strokeWidth="1.4" />
          <line x1="988" y1="78" x2="988" y2="88" stroke="currentColor" strokeWidth="1.4" />
          {/* Faceted canopy hips */}
          <line x1="898" y1="110" x2="932" y2="88" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1022" y1="110" x2="988" y2="88" stroke="currentColor" strokeWidth="1.2" />
          {/* Authentic Heritage Stripe Bands */}
          <line x1="898" y1="118" x2="1022" y2="118" stroke="currentColor" strokeWidth="1.1" strokeDasharray="6 3" />
          <line x1="898" y1="126" x2="1022" y2="126" stroke="currentColor" strokeWidth="1" strokeDasharray="6 3" />
          <line x1="898" y1="134" x2="1022" y2="134" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          {/* Grand Central Drape Entrance */}
          <path d="M 948 145 L 960 120 L 972 145" stroke="currentColor" strokeWidth="1.3" fill="none" />
          <line x1="960" y1="88" x2="960" y2="120" stroke="currentColor" strokeWidth="0.9" opacity="0.6" />
          {/* Entrance Lantern & finial */}
          <circle cx="960" cy="84" r="2.5" fill="currentColor" />

          {/* 20. Right Architectural Palm Tree Group (نخيل معماري أنيق) */}
          <line x1="1050" y1="145" x2="1050" y2="110" stroke="currentColor" strokeWidth="1.6" />
          <path d="M 1050 110 Q 1038 102 1028 107 M 1050 110 Q 1042 94 1034 98 M 1050 110 Q 1050 88 1050 86 M 1050 110 Q 1058 94 1066 98 M 1050 110 Q 1062 102 1072 107" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          <line x1="1080" y1="145" x2="1080" y2="102" stroke="currentColor" strokeWidth="1.8" />
          <path d="M 1080 102 Q 1065 92 1052 98 M 1080 102 Q 1070 84 1060 88 M 1080 102 Q 1080 76 1080 74 M 1080 102 Q 1090 84 1100 88 M 1080 102 Q 1095 92 1108 98" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />

          {/* ============================================================== */}
          {/* ZONE 4: MID-RIGHT - Varied Architecture                         */}
          {/* ============================================================== */}

          {/* 21. Boutique Residential Block */}
          <rect x="1092" y="84" width="52" height="61" />
          <rect x="1112" y="78" width="36" height="18" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <rect x="1122" y="106" width="14" height="20" stroke="currentColor" strokeWidth="0.9" />

          {/* 22. Modern Duplex */}
          <rect x="1140" y="78" width="56" height="67" />
          <line x1="1140" y1="96" x2="1196" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1140" y1="116" x2="1196" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 23. Contemporary Residence */}
          <rect x="1192" y="82" width="54" height="63" />
          <rect x="1198" y="76" width="28" height="6" />
          <line x1="1206" y1="94" x2="1206" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1232" y1="94" x2="1232" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 24. Modern Townhouses with Pergola */}
          <rect x="1242" y="76" width="58" height="69" />
          {/* Pergola on roof */}
          <line x1="1248" y1="68" x2="1288" y2="68" stroke="currentColor" strokeWidth="1.4" />
          <line x1="1254" y1="68" x2="1254" y2="76" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1266" y1="68" x2="1266" y2="76" stroke="currentColor" strokeWidth="0.8" />
          <line x1="1278" y1="68" x2="1278" y2="76" stroke="currentColor" strokeWidth="0.8" />
          <rect x="1248" y="90" width="18" height="14" stroke="currentColor" strokeWidth="0.9" />
          <rect x="1270" y="90" width="18" height="14" stroke="currentColor" strokeWidth="0.9" />

          {/* 25. Luxury Villa with Cantilever */}
          <rect x="1296" y="80" width="56" height="65" />
          <rect x="1316" y="72" width="40" height="20" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <line x1="1322" y1="82" x2="1350" y2="82" stroke="currentColor" strokeWidth="1.3" opacity="0.8" />
          <rect x="1306" y="104" width="16" height="22" stroke="currentColor" strokeWidth="1" opacity="0.8" />

          {/* 26. Curved Corner Plaza Building */}
          <rect x="1348" y="70" width="54" height="75" />
          <path d="M 1348 70 Q 1375 62 1402 70" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <line x1="1348" y1="88" x2="1402" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1348" y1="106" x2="1402" y2="106" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1348" y1="124" x2="1402" y2="124" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1366" y1="70" x2="1366" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1384" y1="70" x2="1384" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 27. Commercial Gallery with Window Grids */}
          <rect x="1398" y="64" width="52" height="81" />
          <line x1="1398" y1="80" x2="1450" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1398" y1="98" x2="1450" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1398" y1="116" x2="1450" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1415" y1="64" x2="1415" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1433" y1="64" x2="1433" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 28. Stepped Boutique Residence */}
          <rect x="1446" y="72" width="48" height="73" />
          <rect x="1466" y="66" width="28" height="6" />
          <line x1="1462" y1="84" x2="1462" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
          <line x1="1478" y1="84" x2="1478" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

          {/* ============================================================== */}
          {/* ZONE 5: FAR RIGHT - Soaring Skyscraper Towers                   */}
          {/* ============================================================== */}

          {/* 29. Transition Mid-Rise */}
          <rect x="1490" y="60" width="46" height="85" />
          <line x1="1490" y1="78" x2="1536" y2="78" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1490" y1="98" x2="1536" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1490" y1="118" x2="1536" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />

          {/* 30. Angled Facade High-Rise */}
          <path d="M 1532 145 L 1532 38 L 1574 48 L 1574 145 Z" />
          <line x1="1546" y1="48" x2="1546" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1560" y1="52" x2="1560" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 31. Slender Spire Tower */}
          <rect x="1570" y="36" width="42" height="109" />
          <line x1="1591" y1="22" x2="1591" y2="36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1584" y1="48" x2="1584" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1598" y1="48" x2="1598" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 32. Commercial Block with Sunshades */}
          <rect x="1608" y="52" width="44" height="93" />
          <line x1="1608" y1="68" x2="1652" y2="68" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="1608" y1="84" x2="1652" y2="84" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="1608" y1="100" x2="1652" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="1608" y1="116" x2="1652" y2="116" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="1608" y1="132" x2="1652" y2="132" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* 33. Stepped High-Rise with Dual Spires */}
          <rect x="1648" y="32" width="48" height="113" />
          <line x1="1660" y1="18" x2="1660" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1684" y1="18" x2="1684" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1662" y1="46" x2="1662" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1682" y1="46" x2="1682" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 34. Corporate Mid-Rise */}
          <rect x="1692" y="44" width="44" height="101" />
          <line x1="1706" y1="56" x2="1706" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1722" y1="56" x2="1722" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 35. Grand Needle Spire Skyscraper (Matching the iconic tower in the photo) */}
          <rect x="1732" y="24" width="48" height="121" />
          <rect x="1742" y="12" width="28" height="12" />
          <line x1="1756" y1="-2" x2="1756" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          {/* Vertical Louver/Fin Texture */}
          <line x1="1732" y1="44" x2="1780" y2="44" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1732" y1="66" x2="1780" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1732" y1="88" x2="1780" y2="88" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1732" y1="110" x2="1780" y2="110" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1732" y1="130" x2="1780" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1744" y1="24" x2="1744" y2="145" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />
          <line x1="1756" y1="24" x2="1756" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1768" y1="24" x2="1768" y2="145" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.7" />

          {/* 36. Slender Angled Crown Skyscraper */}
          <path d="M 1776 145 L 1776 20 L 1820 32 L 1820 145 Z" />
          <line x1="1790" y1="30" x2="1790" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1806" y1="34" x2="1806" y2="138" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

          {/* 37. Stepped High-Rise Office Tower */}
          <rect x="1816" y="38" width="46" height="107" />
          <rect x="1826" y="28" width="26" height="10" />
          <line x1="1839" y1="16" x2="1839" y2="28" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1816" y1="54" x2="1862" y2="54" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1816" y1="72" x2="1862" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1816" y1="90" x2="1862" y2="90" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1816" y1="108" x2="1862" y2="108" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1816" y1="126" x2="1862" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1831" y1="38" x2="1831" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1847" y1="38" x2="1847" y2="145" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 38. Right Anchor Curved / Modern Center */}
          <ellipse cx="1888" cy="74" rx="30" ry="8" />
          <path d="M 1858 74 L 1858 145 L 1918 145 L 1918 74 Z" />
          <path d="M 1858 88 Q 1888 96 1918 88" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 1858 102 Q 1888 110 1918 102" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 1858 116 Q 1888 124 1918 116" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M 1858 130 Q 1888 138 1918 130" stroke="currentColor" strokeWidth="1" fill="none" />
          <line x1="1872" y1="89" x2="1872" y2="142" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1888" y1="92" x2="1888" y2="144" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
          <line x1="1904" y1="89" x2="1904" y2="142" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
