import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-16 sm:h-24 md:h-28 lg:h-32 text-foreground/80 dark:text-foreground/75" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE SKYLINE (Tailored for screens < 640px, perfectly proportioned)    */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 420 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block sm:hidden"
        preserveAspectRatio="none"
      >
        {/* Ground Baseline */}
        <line x1="0" y1="78" x2="420" y2="78" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />

        {/* Mobile Background Layer (soft silhouette) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="currentColor" fillOpacity="0.12">
          <rect x="6" y="16" width="34" height="62" />
          <line x1="23" y1="8" x2="23" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="42" y="24" width="36" height="54" />
          <rect x="80" y="32" width="34" height="46" />
          
          <rect x="156" y="40" width="38" height="38" />
          <rect x="226" y="40" width="38" height="38" />
          
          <rect x="306" y="32" width="34" height="46" />
          <rect x="342" y="24" width="36" height="54" />
          <rect x="380" y="16" width="34" height="62" />
          <line x1="397" y1="8" x2="397" y2="16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Mobile Foreground Layer (Crisp, normal, cohesive architecture) */}
        <g stroke="currentColor" strokeWidth="1.3" fill="var(--background)" strokeLinejoin="round">
          {/* 1. Left Mega Tower */}
          <rect x="10" y="18" width="44" height="60" rx="1.5" />
          <rect x="18" y="10" width="28" height="8" rx="1" />
          <line x1="32" y1="2" x2="32" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="22" y1="26" x2="22" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="32" y1="26" x2="32" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="42" y1="26" x2="42" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 2. Left Commercial High-Rise */}
          <rect x="50" y="26" width="42" height="52" rx="1.5" />
          <line x1="50" y1="38" x2="92" y2="38" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="50" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="50" y1="62" x2="92" y2="62" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 3. Left Transition Townhouse */}
          <rect x="88" y="42" width="38" height="36" rx="1.5" />
          <line x1="100" y1="50" x2="100" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.6" />
          <line x1="114" y1="50" x2="114" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.6" />

          {/* 4. Center Villa - Cantilevered Modern Architecture */}
          <rect x="122" y="48" width="52" height="30" rx="1.5" />
          <rect x="118" y="44" width="36" height="14" rx="1" fill="var(--background)" stroke="currentColor" strokeWidth="1.1" />
          <line x1="124" y1="51" x2="150" y2="51" stroke="currentColor" strokeWidth="1.3" opacity="0.75" />
          <rect x="130" y="64" width="12" height="14" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* 5. Center Villa - Luxury Architectural Estate with Pergola */}
          <rect x="170" y="46" width="60" height="32" rx="1.5" />
          {/* Pergola */}
          <line x1="176" y1="40" x2="204" y2="40" stroke="currentColor" strokeWidth="1.4" />
          <line x1="180" y1="40" x2="180" y2="46" stroke="currentColor" strokeWidth="0.9" />
          <line x1="190" y1="40" x2="190" y2="46" stroke="currentColor" strokeWidth="0.9" />
          <line x1="200" y1="40" x2="200" y2="46" stroke="currentColor" strokeWidth="0.9" />
          <rect x="178" y="52" width="20" height="10" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <rect x="204" y="52" width="18" height="10" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <rect x="192" y="64" width="14" height="14" stroke="currentColor" strokeWidth="1" opacity="0.75" />

          {/* 6. Center-Right Modern Residence */}
          <rect x="226" y="48" width="52" height="30" rx="1.5" />
          <rect x="246" y="44" width="30" height="4" rx="0.5" />
          <line x1="238" y1="56" x2="238" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.6" />
          <line x1="256" y1="56" x2="256" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.6" />

          {/* 7. Right Transition Townhouse */}
          <rect x="274" y="42" width="38" height="36" rx="1.5" />
          <line x1="274" y1="54" x2="312" y2="54" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="274" y1="66" x2="312" y2="66" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 8. Right Commercial High-Rise */}
          <rect x="308" y="26" width="42" height="52" rx="1.5" />
          <line x1="322" y1="36" x2="322" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="336" y1="36" x2="336" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 9. Right Mega Tower */}
          <rect x="346" y="18" width="44" height="60" rx="1.5" />
          <rect x="354" y="10" width="28" height="8" rx="1" />
          <line x1="368" y1="2" x2="368" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="358" y1="26" x2="358" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="368" y1="26" x2="368" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="378" y1="26" x2="378" y2="72" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* DESKTOP / TABLET SKYLINE (Wide 1920px Panoramic Horizon, NEVER Stretched) */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 1920 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full hidden sm:block"
        preserveAspectRatio="none"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="138" x2="1920" y2="138" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />

        {/* Desktop Background Layer (Atmospheric depth) */}
        <g stroke="currentColor" strokeWidth="0.8" opacity="0.42" fill="currentColor" fillOpacity="0.12">
          {/* Left background skyline */}
          <rect x="0" y="30" width="70" height="108" />
          <rect x="65" y="16" width="60" height="122" />
          <line x1="95" y1="4" x2="95" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="120" y="36" width="65" height="102" />
          <rect x="180" y="22" width="60" height="116" />
          <line x1="210" y1="10" x2="210" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="235" y="42" width="65" height="96" />
          <rect x="295" y="28" width="65" height="110" />
          <rect x="355" y="48" width="65" height="90" />
          <rect x="415" y="36" width="60" height="102" />
          <line x1="445" y1="24" x2="445" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="470" y="52" width="70" height="86" />
          <rect x="535" y="62" width="65" height="76" />
          <rect x="595" y="70" width="65" height="68" />

          {/* Center background (urban backdrop behind villas) */}
          <rect x="655" y="76" width="70" height="62" />
          <rect x="720" y="68" width="65" height="70" />
          <rect x="780" y="74" width="70" height="64" />
          <rect x="845" y="62" width="75" height="76" />
          <line x1="882" y1="50" x2="882" y2="62" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="915" y="70" width="70" height="68" />
          <rect x="980" y="64" width="75" height="74" />
          <line x1="1017" y1="52" x2="1017" y2="64" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="1050" y="72" width="70" height="66" />
          <rect x="1115" y="66" width="70" height="72" />
          <rect x="1180" y="74" width="70" height="64" />
          <rect x="1245" y="68" width="70" height="70" />

          {/* Right background skyline */}
          <rect x="1310" y="58" width="65" height="80" />
          <rect x="1370" y="48" width="70" height="90" />
          <rect x="1435" y="32" width="65" height="106" />
          <line x1="1467" y1="20" x2="1467" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="1495" y="44" width="65" height="94" />
          <rect x="1555" y="26" width="60" height="112" />
          <rect x="1610" y="40" width="65" height="98" />
          <rect x="1670" y="20" width="60" height="118" />
          <line x1="1700" y1="8" x2="1700" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="1725" y="34" width="65" height="104" />
          <rect x="1785" y="16" width="65" height="122" />
          <line x1="1817" y1="4" x2="1817" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="1845" y="28" width="75" height="110" />
        </g>

        {/* Desktop Foreground Layer (Crisp, modern, overlapping skyline) */}
        <g stroke="currentColor" strokeWidth="1.3" fill="var(--background)" strokeLinejoin="round">
          
          {/* --- LEFT SKYSCRAPERS --- */}
          {/* 1. Left Edge High-Rise */}
          <rect x="0" y="32" width="85" height="106" />
          <line x1="22" y1="44" x2="22" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="44" y1="44" x2="44" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="66" y1="44" x2="66" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 2. Left Mega Tower with Setback Crown */}
          <rect x="75" y="28" width="90" height="110" />
          <rect x="93" y="16" width="54" height="12" />
          <line x1="120" y1="4" x2="120" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="75" y1="48" x2="165" y2="48" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="75" y1="70" x2="165" y2="70" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="75" y1="92" x2="165" y2="92" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="75" y1="114" x2="165" y2="114" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 3. Left Slanted Glass Tower */}
          <path d="M 155 138 L 155 38 L 240 50 L 240 138 Z" />
          <line x1="182" y1="50" x2="182" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />
          <line x1="212" y1="54" x2="212" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />

          {/* 4. Left Corporate Tower with Twin Spires */}
          <rect x="230" y="30" width="90" height="108" />
          <line x1="255" y1="18" x2="255" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="295" y1="18" x2="295" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="230" y1="52" x2="320" y2="52" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="230" y1="74" x2="320" y2="74" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="230" y1="96" x2="320" y2="96" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="230" y1="118" x2="320" y2="118" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 5. Left Stepped Tower */}
          <rect x="310" y="46" width="85" height="92" />
          <rect x="325" y="36" width="45" height="10" />
          <line x1="338" y1="58" x2="338" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="368" y1="58" x2="368" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 6. Modern Commercial High-Rise */}
          <rect x="385" y="36" width="85" height="102" />
          <line x1="385" y1="56" x2="470" y2="56" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="385" y1="76" x2="470" y2="76" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="385" y1="96" x2="470" y2="96" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="385" y1="116" x2="470" y2="116" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 7. Stepped Commercial Building */}
          <rect x="460" y="56" width="85" height="82" />
          <rect x="475" y="46" width="45" height="10" />
          <line x1="488" y1="68" x2="488" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="518" y1="68" x2="518" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 8. Transition Mid-Rise Commercial */}
          <rect x="535" y="66" width="90" height="72" />
          <line x1="535" y1="84" x2="625" y2="84" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="535" y1="102" x2="625" y2="102" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="535" y1="120" x2="625" y2="120" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* --- CENTER MODERN RESIDENTIAL VILLAS & TOWNHOUSES --- */}
          {/* 9. Stepped Townhouse Complex */}
          <rect x="615" y="78" width="100" height="60" />
          <rect x="615" y="70" width="55" height="8" />
          <line x1="645" y1="88" x2="645" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="685" y1="88" x2="685" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 10. Luxury Modern Villa - Cantilever & Panoramic Glass */}
          <rect x="705" y="88" width="105" height="50" />
          <rect x="700" y="82" width="75" height="24" fill="var(--background)" stroke="currentColor" strokeWidth="1.2" />
          <line x1="710" y1="94" x2="765" y2="94" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
          <rect x="725" y="116" width="20" height="22" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <line x1="760" y1="122" x2="795" y2="122" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />

          {/* 11. Contemporary Residence with Pergola */}
          <rect x="800" y="84" width="110" height="54" />
          {/* Pergola structure */}
          <line x1="810" y1="76" x2="860" y2="76" stroke="currentColor" strokeWidth="1.5" />
          <line x1="818" y1="76" x2="818" y2="84" stroke="currentColor" strokeWidth="1" />
          <line x1="834" y1="76" x2="834" y2="84" stroke="currentColor" strokeWidth="1" />
          <line x1="850" y1="76" x2="850" y2="84" stroke="currentColor" strokeWidth="1" />
          <rect x="815" y="94" width="38" height="16" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <rect x="862" y="94" width="34" height="16" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <rect x="840" y="118" width="22" height="20" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />

          {/* 12. Central Flagship Villa Estate */}
          <rect x="900" y="82" width="120" height="56" />
          <rect x="935" y="74" width="50" height="8" />
          <rect x="918" y="92" width="40" height="18" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <rect x="968" y="92" width="38" height="18" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
          <rect x="945" y="116" width="26" height="22" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />

          {/* 13. Modern Two-Story Residence */}
          <rect x="1010" y="86" width="110" height="52" />
          <rect x="1045" y="78" width="55" height="8" />
          <line x1="1025" y1="98" x2="1025" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1065" y1="98" x2="1065" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1095" y1="98" x2="1095" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* 14. Contemporary Townhouses with Balconies */}
          <rect x="1110" y="88" width="105" height="50" />
          <line x1="1135" y1="98" x2="1135" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1175" y1="98" x2="1175" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 15. Modern Residential Block with Stepped Parapet */}
          <rect x="1205" y="78" width="100" height="60" />
          <rect x="1245" y="70" width="55" height="8" />
          <line x1="1230" y1="90" x2="1230" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1270" y1="90" x2="1270" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* --- RIGHT SKYSCRAPERS --- */}
          {/* 16. Transition Mid-Rise Commercial */}
          <rect x="1295" y="66" width="90" height="72" />
          <line x1="1295" y1="84" x2="1385" y2="84" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1295" y1="102" x2="1385" y2="102" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1295" y1="120" x2="1385" y2="120" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 17. Stepped Commercial Building */}
          <rect x="1375" y="54" width="85" height="84" />
          <rect x="1395" y="44" width="45" height="10" />
          <line x1="1405" y1="66" x2="1405" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1435" y1="66" x2="1435" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 18. Modern Corporate High-Rise */}
          <rect x="1450" y="38" width="85" height="100" />
          <line x1="1450" y1="58" x2="1535" y2="58" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1450" y1="78" x2="1535" y2="78" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1450" y1="98" x2="1535" y2="98" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1450" y1="118" x2="1535" y2="118" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 19. Stepped Modern Tower */}
          <rect x="1525" y="44" width="90" height="94" />
          <rect x="1545" y="34" width="45" height="10" />
          <line x1="1555" y1="56" x2="1555" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1585" y1="56" x2="1585" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />

          {/* 20. Commercial Headquarters with Twin Spires */}
          <rect x="1605" y="28" width="90" height="110" />
          <line x1="1630" y1="16" x2="1630" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1670" y1="16" x2="1670" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1605" y1="50" x2="1695" y2="50" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1605" y1="72" x2="1695" y2="72" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1605" y1="94" x2="1695" y2="94" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1605" y1="116" x2="1695" y2="116" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 21. Slanted Modern Glass Tower */}
          <path d="M 1685 138 L 1685 50 L 1770 38 L 1770 138 Z" />
          <line x1="1712" y1="54" x2="1712" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />
          <line x1="1742" y1="50" x2="1742" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.6" />

          {/* 22. Mega Flagship Tower with Spire Crown */}
          <rect x="1760" y="26" width="95" height="112" />
          <rect x="1780" y="14" width="56" height="12" />
          <line x1="1808" y1="2" x2="1808" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="1760" y1="46" x2="1855" y2="46" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1760" y1="68" x2="1855" y2="68" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1760" y1="90" x2="1855" y2="90" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />
          <line x1="1760" y1="112" x2="1855" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.5" />

          {/* 23. Right Edge Anchor Tower */}
          <rect x="1845" y="30" width="75" height="108" />
          <line x1="1865" y1="42" x2="1865" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1885" y1="42" x2="1885" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
          <line x1="1905" y1="42" x2="1905" y2="130" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
