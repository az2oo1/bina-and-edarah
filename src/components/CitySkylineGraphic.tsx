import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-20 sm:h-28 md:h-36 lg:h-44 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, Slender & Crisp)             */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 400 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="none"
      >
        {/* Baseline */}
        <line x1="0" y1="98" x2="400" y2="98" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />

        {/* Mobile Background Layer (soft silhouette) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.38" fill="currentColor" fillOpacity="0.12">
          <rect x="0" y="22" width="26" height="76" />
          <rect x="22" y="14" width="24" height="84" />
          <line x1="34" y1="6" x2="34" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="50" y="28" width="26" height="70" />
          <rect x="80" y="38" width="28" height="60" />
          
          {/* Center soft mid-rises */}
          <rect x="145" y="52" width="34" height="46" />
          <rect x="215" y="52" width="34" height="46" />
          
          <rect x="290" y="38" width="28" height="60" />
          <rect x="324" y="28" width="26" height="70" />
          <rect x="352" y="14" width="24" height="84" />
          <line x1="364" y1="6" x2="364" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="374" y="22" width="26" height="76" />
        </g>

        {/* Mobile Foreground Layer (Crisp, slender, vertical architecture) */}
        <g stroke="currentColor" strokeWidth="1.2" fill="var(--background)" strokeLinejoin="round">
          {/* 1. Left Edge Skyscraper */}
          <rect x="0" y="24" width="30" height="74" />
          <line x1="10" y1="34" x2="10" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="20" y1="34" x2="20" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 2. Left Mega Spire Tower */}
          <rect x="26" y="16" width="32" height="82" />
          <rect x="33" y="8" width="18" height="8" />
          <line x1="42" y1="0" x2="42" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="26" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="26" y1="48" x2="58" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="26" y1="64" x2="58" y2="64" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="26" y1="80" x2="58" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 3. Left Angled Glass High-Rise */}
          <path d="M 54 98 L 54 32 L 84 40 L 84 98 Z" />
          <line x1="68" y1="42" x2="68" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 4. Left Transition Townhouse */}
          <rect x="80" y="48" width="34" height="50" />
          <line x1="92" y1="58" x2="92" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
          <line x1="102" y1="58" x2="102" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

          {/* 5. Center Modern Villa - Cantilever */}
          <rect x="110" y="60" width="46" height="38" />
          <rect x="106" y="54" width="34" height="16" fill="var(--background)" stroke="currentColor" strokeWidth="1" />
          <line x1="112" y1="62" x2="134" y2="62" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <rect x="116" y="78" width="12" height="20" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          {/* 6. Center Luxury Villa with Pergola */}
          <rect x="152" y="56" width="54" height="42" />
          {/* Pergola */}
          <line x1="156" y1="48" x2="186" y2="48" stroke="currentColor" strokeWidth="1.3" />
          <line x1="162" y1="48" x2="162" y2="56" stroke="currentColor" strokeWidth="0.8" />
          <line x1="172" y1="48" x2="172" y2="56" stroke="currentColor" strokeWidth="0.8" />
          <line x1="182" y1="48" x2="182" y2="56" stroke="currentColor" strokeWidth="0.8" />
          <rect x="160" y="66" width="18" height="12" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <rect x="184" y="66" width="16" height="12" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <rect x="172" y="82" width="14" height="16" stroke="currentColor" strokeWidth="0.9" opacity="0.75" />

          {/* 7. Center Modern Residence */}
          <rect x="202" y="60" width="48" height="38" />
          <rect x="220" y="54" width="28" height="6" />
          <line x1="214" y1="70" x2="214" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
          <line x1="236" y1="70" x2="236" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

          {/* 8. Right Transition Townhouse */}
          <rect x="246" y="48" width="34" height="50" />
          <line x1="246" y1="64" x2="280" y2="64" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="246" y1="80" x2="280" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 9. Right Angled Glass High-Rise */}
          <path d="M 276 98 L 276 40 L 306 32 L 306 98 Z" />
          <line x1="292" y1="42" x2="292" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 10. Right Mega Spire Tower */}
          <rect x="302" y="16" width="34" height="82" />
          <rect x="310" y="8" width="18" height="8" />
          <line x1="319" y1="0" x2="319" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="302" y1="32" x2="336" y2="32" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="302" y1="48" x2="336" y2="48" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="302" y1="64" x2="336" y2="64" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="302" y1="80" x2="336" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 11. Right Corporate High-Rise */}
          <rect x="332" y="24" width="34" height="74" />
          <line x1="344" y1="34" x2="344" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="356" y1="34" x2="356" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 12. Right Edge Skyscraper */}
          <rect x="362" y="18" width="38" height="80" />
          <line x1="376" y1="28" x2="376" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="388" y1="28" x2="388" y2="92" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP / PC SKYLINE (Slender 1920x180 Vector, NEVER Stretched or Fat)   */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 1920 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="none"
      >
        {/* Baseline */}
        <line x1="0" y1="178" x2="1920" y2="178" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />

        {/* Desktop Background Layer (Slender silhouettes for real architectural depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="currentColor" fillOpacity="0.12">
          {/* Left background skyline */}
          <rect x="0" y="40" width="38" height="138" />
          <rect x="34" y="22" width="36" height="156" />
          <line x1="52" y1="8" x2="52" y2="22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="66" y="46" width="38" height="132" />
          <rect x="100" y="32" width="36" height="146" />
          <line x1="118" y1="18" x2="118" y2="32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="132" y="52" width="38" height="126" />
          <rect x="166" y="36" width="36" height="142" />
          <rect x="198" y="58" width="38" height="120" />
          <rect x="232" y="44" width="36" height="134" />
          <line x1="250" y1="30" x2="250" y2="44" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="264" y="62" width="40" height="116" />
          <rect x="300" y="48" width="36" height="130" />
          <rect x="332" y="66" width="38" height="112" />
          <rect x="366" y="52" width="38" height="126" />
          <line x1="385" y1="38" x2="385" y2="52" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="400" y="70" width="40" height="108" />
          <rect x="436" y="58" width="38" height="120" />
          <rect x="470" y="76" width="40" height="102" />
          <rect x="506" y="64" width="38" height="114" />
          <rect x="540" y="80" width="42" height="98" />
          <rect x="578" y="72" width="40" height="106" />
          <rect x="614" y="88" width="42" height="90" />

          {/* Center background (urban backdrop behind villas) */}
          <rect x="652" y="96" width="44" height="82" />
          <rect x="692" y="90" width="42" height="88" />
          <rect x="730" y="98" width="44" height="80" />
          <rect x="770" y="88" width="44" height="90" />
          <line x1="792" y1="74" x2="792" y2="88" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="810" y="96" width="44" height="82" />
          <rect x="850" y="92" width="44" height="86" />
          <rect x="890" y="86" width="46" height="92" />
          <line x1="913" y1="72" x2="913" y2="86" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="932" y="94" width="44" height="84" />
          <rect x="972" y="88" width="46" height="90" />
          <rect x="1014" y="96" width="44" height="82" />
          <rect x="1054" y="90" width="44" height="88" />
          <rect x="1094" y="98" width="44" height="80" />
          <rect x="1134" y="88" width="44" height="90" />
          <line x1="1156" y1="74" x2="1156" y2="88" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="1174" y="94" width="44" height="84" />
          <rect x="1214" y="90" width="44" height="88" />

          {/* Right background skyline */}
          <rect x="1254" y="80" width="42" height="98" />
          <rect x="1292" y="70" width="40" height="108" />
          <rect x="1328" y="78" width="42" height="100" />
          <rect x="1366" y="62" width="40" height="116" />
          <rect x="1402" y="72" width="40" height="106" />
          <rect x="1438" y="54" width="38" height="124" />
          <line x1="1457" y1="40" x2="1457" y2="54" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1472" y="68" width="40" height="110" />
          <rect x="1508" y="48" width="38" height="130" />
          <rect x="1542" y="62" width="40" height="116" />
          <rect x="1578" y="42" width="38" height="136" />
          <rect x="1612" y="56" width="40" height="122" />
          <rect x="1648" y="34" width="38" height="144" />
          <line x1="1667" y1="20" x2="1667" y2="34" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1682" y="48" width="40" height="130" />
          <rect x="1718" y="30" width="38" height="148" />
          <rect x="1752" y="44" width="40" height="134" />
          <rect x="1788" y="20" width="38" height="158" />
          <line x1="1807" y1="6" x2="1807" y2="20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="1822" y="38" width="40" height="140" />
          <rect x="1858" y="24" width="40" height="154" />
          <rect x="1894" y="40" width="30" height="138" />
        </g>

        {/* Desktop Foreground Layer (Slender, tall, elegant architectural skyscrapers & villas) */}
        <g stroke="currentColor" strokeWidth="1.2" fill="var(--background)" strokeLinejoin="round">
          
          {/* --- LEFT SKYSCRAPERS (Tall, slender 3.5:1 ratio) --- */}
          {/* 1 */}
          <rect x="0" y="36" width="42" height="142" />
          <line x1="14" y1="48" x2="14" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="28" y1="48" x2="28" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 2 Mega Spire */}
          <rect x="38" y="24" width="46" height="154" />
          <rect x="47" y="12" width="28" height="12" />
          <line x1="61" y1="0" x2="61" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="38" y1="46" x2="84" y2="46" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="38" y1="72" x2="84" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="38" y1="98" x2="84" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="38" y1="124" x2="84" y2="124" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="38" y1="150" x2="84" y2="150" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 3 */}
          <rect x="80" y="44" width="40" height="134" />
          <line x1="93" y1="56" x2="93" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="107" y1="56" x2="107" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 4 Angled Crown */}
          <path d="M 116 178 L 116 32 L 160 44 L 160 178 Z" />
          <line x1="130" y1="44" x2="130" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />
          <line x1="146" y1="48" x2="146" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />

          {/* 5 */}
          <rect x="156" y="38" width="42" height="140" />
          <line x1="156" y1="58" x2="198" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="156" y1="84" x2="198" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="156" y1="110" x2="198" y2="110" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="156" y1="136" x2="198" y2="136" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 6 Twin Spires */}
          <rect x="194" y="28" width="48" height="150" />
          <line x1="206" y1="14" x2="206" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="230" y1="14" x2="230" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="208" y1="40" x2="208" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="228" y1="40" x2="228" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 7 */}
          <rect x="238" y="48" width="40" height="130" />
          <line x1="251" y1="58" x2="251" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="265" y1="58" x2="265" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 8 Stepped */}
          <rect x="274" y="38" width="44" height="140" />
          <rect x="284" y="28" width="24" height="10" />
          <line x1="288" y1="50" x2="288" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="304" y1="50" x2="304" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 9 */}
          <rect x="314" y="52" width="42" height="126" />
          <line x1="314" y1="72" x2="356" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="314" y1="98" x2="356" y2="98" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="314" y1="124" x2="356" y2="124" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 10 Spire High-Rise */}
          <rect x="352" y="30" width="46" height="148" />
          <line x1="375" y1="16" x2="375" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="366" y1="44" x2="366" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="384" y1="44" x2="384" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 11 */}
          <rect x="394" y="58" width="40" height="120" />
          <line x1="407" y1="68" x2="407" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="421" y1="68" x2="421" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 12 Angled */}
          <path d="M 430 178 L 430 42 L 474 52 L 474 178 Z" />
          <line x1="444" y1="52" x2="444" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="460" y1="56" x2="460" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 13 */}
          <rect x="470" y="64" width="42" height="114" />
          <line x1="470" y1="84" x2="512" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="470" y1="108" x2="512" y2="108" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="470" y1="132" x2="512" y2="132" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 14 Corporate Tower */}
          <rect x="508" y="48" width="46" height="130" />
          <rect x="518" y="38" width="26" height="10" />
          <line x1="522" y1="60" x2="522" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="540" y1="60" x2="540" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 15 */}
          <rect x="550" y="72" width="44" height="106" />
          <line x1="564" y1="84" x2="564" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="580" y1="84" x2="580" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 16 Transition Mid-Rise */}
          <rect x="590" y="82" width="46" height="96" />
          <line x1="590" y1="100" x2="636" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="590" y1="120" x2="636" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 17 Transition Townhouse */}
          <rect x="632" y="92" width="48" height="86" />
          <line x1="648" y1="104" x2="648" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="664" y1="104" x2="664" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* --- CENTER MODERN RESIDENTIAL VILLAS & TOWNHOUSES --- */}
          {/* 18 Stepped Townhouse */}
          <rect x="676" y="104" width="52" height="74" />
          <rect x="676" y="98" width="30" height="6" />
          <line x1="694" y1="114" x2="694" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="712" y1="114" x2="712" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 19 Modern Luxury Villa - Cantilever */}
          <rect x="724" y="114" width="58" height="64" />
          <rect x="720" y="108" width="42" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <line x1="726" y1="118" x2="756" y2="118" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
          <rect x="734" y="142" width="16" height="22" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* 20 Contemporary Villa with Pergola */}
          <rect x="778" y="110" width="62" height="68" />
          {/* Pergola */}
          <line x1="784" y1="100" x2="824" y2="100" stroke="currentColor" strokeWidth="1.5" />
          <line x1="792" y1="100" x2="792" y2="110" stroke="currentColor" strokeWidth="1" />
          <line x1="804" y1="100" x2="804" y2="110" stroke="currentColor" strokeWidth="1" />
          <line x1="816" y1="100" x2="816" y2="110" stroke="currentColor" strokeWidth="1" />
          <rect x="790" y="122" width="22" height="14" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <rect x="818" y="122" width="18" height="14" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* 21 Modern Residence */}
          <rect x="836" y="116" width="56" height="62" />
          <rect x="856" y="110" width="30" height="6" />
          <line x1="850" y1="128" x2="850" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="876" y1="128" x2="876" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 22 Townhouses */}
          <rect x="888" y="108" width="58" height="70" />
          <line x1="888" y1="126" x2="946" y2="126" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="888" y1="146" x2="946" y2="146" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 23 Flagship Centerpiece Villa */}
          <rect x="942" y="106" width="68" height="72" />
          {/* Pergola */}
          <line x1="950" y1="96" x2="996" y2="96" stroke="currentColor" strokeWidth="1.5" />
          <line x1="958" y1="96" x2="958" y2="106" stroke="currentColor" strokeWidth="1" />
          <line x1="972" y1="96" x2="972" y2="106" stroke="currentColor" strokeWidth="1" />
          <line x1="986" y1="96" x2="986" y2="106" stroke="currentColor" strokeWidth="1" />
          <rect x="952" y="118" width="24" height="15" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <rect x="982" y="118" width="22" height="15" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <rect x="968" y="144" width="18" height="20" stroke="currentColor" strokeWidth="1" opacity="0.75" />

          {/* 24 Modern Duplex */}
          <rect x="1006" y="112" width="58" height="66" />
          <rect x="1030" y="106" width="30" height="6" />
          <line x1="1022" y1="126" x2="1022" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1048" y1="126" x2="1048" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 25 Contemporary Villa */}
          <rect x="1060" y="110" width="60" height="68" />
          <rect x="1056" y="104" width="44" height="22" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <line x1="1064" y1="114" x2="1094" y2="114" stroke="currentColor" strokeWidth="1.4" opacity="0.75" />
          <rect x="1072" y="138" width="16" height="24" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* 26 Modern Residence */}
          <rect x="1116" y="116" width="56" height="62" />
          <line x1="1130" y1="128" x2="1130" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1156" y1="128" x2="1156" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 27 Townhouses */}
          <rect x="1168" y="106" width="54" height="72" />
          <rect x="1190" y="100" width="30" height="6" />
          <line x1="1182" y1="120" x2="1182" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1206" y1="120" x2="1206" y2="170" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 28 Transition Townhouse */}
          <rect x="1218" y="96" width="50" height="82" />
          <line x1="1218" y1="116" x2="1268" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1218" y1="138" x2="1268" y2="138" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* --- RIGHT SKYSCRAPERS (Tall, slender 3.5:1 ratio) --- */}
          {/* 29 Transition Commercial */}
          <rect x="1264" y="86" width="46" height="92" />
          <line x1="1280" y1="98" x2="1280" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1296" y1="98" x2="1296" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 30 Mid-Rise */}
          <rect x="1306" y="74" width="44" height="104" />
          <line x1="1306" y1="94" x2="1350" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1306" y1="116" x2="1350" y2="116" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1306" y1="138" x2="1350" y2="138" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 31 High-Rise */}
          <rect x="1346" y="58" width="44" height="120" />
          <line x1="1360" y1="70" x2="1360" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1376" y1="70" x2="1376" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 32 Angled Crown */}
          <path d="M 1386 178 L 1386 48 L 1432 38 L 1432 178 Z" />
          <line x1="1402" y1="52" x2="1402" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1418" y1="48" x2="1418" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 33 */}
          <rect x="1428" y="64" width="42" height="114" />
          <line x1="1428" y1="84" x2="1470" y2="84" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1428" y1="108" x2="1470" y2="108" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1428" y1="132" x2="1470" y2="132" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 34 Spire Glass Tower */}
          <rect x="1466" y="30" width="46" height="148" />
          <line x1="1489" y1="16" x2="1489" y2="30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="1480" y1="44" x2="1480" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1498" y1="44" x2="1498" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 35 */}
          <rect x="1508" y="50" width="42" height="128" />
          <line x1="1522" y1="62" x2="1522" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1536" y1="62" x2="1536" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 36 Stepped Tower */}
          <rect x="1546" y="36" width="46" height="142" />
          <rect x="1556" y="26" width="26" height="10" />
          <line x1="1560" y1="48" x2="1560" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1578" y1="48" x2="1578" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 37 */}
          <rect x="1588" y="48" width="40" height="130" />
          <line x1="1588" y1="70" x2="1628" y2="70" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1588" y1="96" x2="1628" y2="96" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1588" y1="122" x2="1628" y2="122" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 38 Twin Spires Headquarters */}
          <rect x="1624" y="26" width="48" height="152" />
          <line x1="1636" y1="12" x2="1636" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1660" y1="12" x2="1660" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1638" y1="40" x2="1638" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1658" y1="40" x2="1658" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 39 */}
          <rect x="1668" y="38" width="42" height="140" />
          <line x1="1682" y1="50" x2="1682" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1696" y1="50" x2="1696" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 40 Angled Crown */}
          <path d="M 1706 178 L 1706 44 L 1752 30 L 1752 178 Z" />
          <line x1="1722" y1="46" x2="1722" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />
          <line x1="1738" y1="42" x2="1738" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />

          {/* 41 */}
          <rect x="1748" y="44" width="40" height="134" />
          <line x1="1748" y1="66" x2="1788" y2="66" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1748" y1="92" x2="1788" y2="92" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1748" y1="118" x2="1788" y2="118" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 42 Mega Flagship Spire */}
          <rect x="1784" y="20" width="48" height="158" />
          <rect x="1793" y="8" width="30" height="12" />
          <line x1="1808" y1="-4" x2="1808" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="1784" y1="42" x2="1832" y2="42" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1784" y1="68" x2="1832" y2="68" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1784" y1="94" x2="1832" y2="94" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1784" y1="120" x2="1832" y2="120" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
          <line x1="1784" y1="146" x2="1832" y2="146" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

          {/* 43 */}
          <rect x="1828" y="34" width="44" height="144" />
          <line x1="1842" y1="46" x2="1842" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1858" y1="46" x2="1858" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

          {/* 44 Right Anchor */}
          <rect x="1868" y="26" width="52" height="152" />
          <line x1="1884" y1="38" x2="1884" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1904" y1="38" x2="1904" y2="170" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

