import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-28 sm:h-36 text-foreground/85 dark:text-foreground/85" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1600 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover sm:object-fill"
        preserveAspectRatio="none"
      >
        {/* Continuous Ground Baseline */}
        <line x1="0" y1="158" x2="1600" y2="158" stroke="currentColor" strokeWidth="2.5" opacity="0.95" />

        {/* ======================================================== */}
        {/* LAYER 1: DEEP BACKGROUND SILHOUETTE (Dense Skyline Backdrop) */}
        {/* ======================================================== */}
        <g opacity="0.6" fill="currentColor">
          {/* Deep Left Skylines */}
          <rect x="0" y="20" width="35" height="138" rx="1.5" />
          <line x1="17" y1="5" x2="17" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="38" y="10" width="34" height="148" rx="1.5" />
          <line x1="55" y1="-4" x2="55" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="75" y="28" width="40" height="130" rx="1.5" />
          <rect x="118" y="18" width="32" height="140" rx="1.5" />
          <line x1="134" y1="4" x2="134" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="153" y="32" width="38" height="126" rx="1.5" />
          <rect x="194" y="14" width="46" height="144" rx="1.5" />
          <line x1="217" y1="0" x2="217" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="244" y="36" width="36" height="122" rx="1.5" />
          <rect x="283" y="44" width="42" height="114" rx="1.5" />
          <rect x="328" y="30" width="38" height="128" rx="1.5" />
          <line x1="347" y1="16" x2="347" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="370" y="52" width="44" height="106" rx="1.5" />
          <rect x="418" y="65" width="38" height="93" rx="1.5" />

          {/* Deep Center Backdrop (Towers & City Skyline behind the houses) */}
          <rect x="458" y="68" width="32" height="90" rx="1.5" />
          <rect x="494" y="58" width="38" height="100" rx="1.5" />
          <line x1="513" y1="44" x2="513" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="536" y="74" width="34" height="84" rx="1.5" />
          <rect x="574" y="62" width="40" height="96" rx="1.5" />
          <rect x="618" y="70" width="36" height="88" rx="1.5" />
          <rect x="658" y="56" width="42" height="102" rx="1.5" />
          <line x1="679" y1="42" x2="679" y2="56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="704" y="68" width="38" height="90" rx="1.5" />
          <rect x="746" y="60" width="40" height="98" rx="1.5" />
          <rect x="790" y="72" width="34" height="86" rx="1.5" />
          <rect x="828" y="54" width="42" height="104" rx="1.5" />
          <line x1="849" y1="38" x2="849" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="874" y="64" width="36" height="94" rx="1.5" />
          <rect x="914" y="70" width="40" height="88" rx="1.5" />
          <rect x="958" y="58" width="38" height="100" rx="1.5" />
          <rect x="1000" y="66" width="42" height="92" rx="1.5" />
          <rect x="1046" y="54" width="36" height="104" rx="1.5" />
          <line x1="1064" y1="40" x2="1064" y2="54" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="1086" y="62" width="44" height="96" rx="1.5" />
          <rect x="1134" y="50" width="40" height="108" rx="1.5" />

          {/* Deep Right Skylines */}
          <rect x="1178" y="38" width="42" height="120" rx="1.5" />
          <rect x="1224" y="26" width="46" height="132" rx="1.5" />
          <line x1="1247" y1="12" x2="1247" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="1274" y="34" width="36" height="124" rx="1.5" />
          <rect x="1314" y="16" width="42" height="142" rx="1.5" />
          <line x1="1335" y1="0" x2="1335" y2="16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="1360" y="28" width="48" height="130" rx="1.5" />
          <rect x="1412" y="12" width="44" height="146" rx="1.5" />
          <line x1="1434" y1="-4" x2="1434" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="1460" y="24" width="38" height="134" rx="1.5" />
          <rect x="1502" y="10" width="46" height="148" rx="1.5" />
          <line x1="1525" y1="-6" x2="1525" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="1552" y="22" width="48" height="136" rx="1.5" />
        </g>

        {/* ======================================================== */}
        {/* LAYER 2: MID-GROUND ARCHITECTURE (Dense Mid-Height Layer) */}
        {/* ======================================================== */}
        <g stroke="currentColor" strokeWidth="1.3" fill="var(--background)" opacity="0.88">
          {/* Mid-ground Left High-rises */}
          <rect x="18" y="34" width="44" height="124" rx="2" />
          <line x1="30" y1="46" x2="30" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="50" y1="46" x2="50" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="66" y="44" width="46" height="114" rx="2" />
          <line x1="66" y1="65" x2="112" y2="65" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="66" y1="90" x2="112" y2="90" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="66" y1="115" x2="112" y2="115" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="66" y1="140" x2="112" y2="140" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <path d="M 120 158 L 120 52 L 160 40 L 160 158 Z" />
          <line x1="133" y1="58" x2="133" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="147" y1="54" x2="147" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="172" y="58" width="50" height="100" rx="2" />
          <line x1="185" y1="70" x2="185" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="209" y1="70" x2="209" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="230" y="66" width="44" height="92" rx="2" />
          <rect x="282" y="76" width="46" height="82" rx="2" />
          <line x1="282" y1="96" x2="328" y2="96" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="282" y1="120" x2="328" y2="120" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="336" y="84" width="44" height="74" rx="2" />
          <rect x="388" y="92" width="46" height="66" rx="2" />

          {/* Mid-ground Center (Stepped modern apartments behind villas) */}
          <rect x="440" y="98" width="42" height="60" rx="1.5" />
          <path d="M 438 98 L 461 84 L 484 98 Z" fill="var(--background)" />
          <line x1="440" y1="116" x2="482" y2="116" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="490" y="92" width="48" height="66" rx="2" />
          <line x1="502" y1="104" x2="502" y2="152" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="526" y1="104" x2="526" y2="152" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="546" y="94" width="44" height="64" rx="1.5" />
          <path d="M 544 94 L 568 80 L 592 94 Z" fill="var(--background)" />
          <line x1="546" y1="112" x2="590" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="546" y1="132" x2="590" y2="132" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="598" y="98" width="50" height="60" rx="2" />
          <line x1="598" y1="114" x2="648" y2="114" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="598" y1="134" x2="648" y2="134" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="656" y="92" width="46" height="66" rx="1.5" />
          <path d="M 654 92 L 677 78 L 700 92 Z" fill="var(--background)" />
          <line x1="656" y1="110" x2="702" y2="110" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="656" y1="130" x2="702" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="710" y="88" width="54" height="70" rx="2" />
          <line x1="724" y1="100" x2="724" y2="152" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="750" y1="100" x2="750" y2="152" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="772" y="94" width="46" height="64" rx="1.5" />
          <path d="M 770 94 L 793 80 L 816 94 Z" fill="var(--background)" />
          <line x1="772" y1="112" x2="818" y2="112" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="772" y1="132" x2="818" y2="132" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="826" y="92" width="50" height="66" rx="2" />
          <line x1="826" y1="110" x2="876" y2="110" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="826" y1="130" x2="876" y2="130" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="884" y="90" width="46" height="68" rx="1.5" />
          <path d="M 882 90 L 905 76 L 928 90 Z" fill="var(--background)" />
          <line x1="884" y1="108" x2="930" y2="108" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="884" y1="128" x2="930" y2="128" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="938" y="94" width="50" height="64" rx="2" />
          <line x1="952" y1="106" x2="952" y2="152" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="976" y1="106" x2="976" y2="152" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="996" y="96" width="44" height="62" rx="1.5" />
          <path d="M 994 96 L 1016 82 L 1038 96 Z" fill="var(--background)" />

          <rect x="1048" y="88" width="48" height="70" rx="2" />
          <line x1="1048" y1="106" x2="1096" y2="106" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="1048" y1="126" x2="1096" y2="126" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="1104" y="82" width="48" height="76" rx="2" />
          <rect x="1158" y="72" width="46" height="86" rx="2" />

          {/* Mid-ground Right High-rises */}
          <rect x="1212" y="60" width="50" height="98" rx="2" />
          <line x1="1225" y1="74" x2="1225" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1249" y1="74" x2="1249" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="1268" y="46" width="52" height="112" rx="2" />
          <line x1="1268" y1="68" x2="1320" y2="68" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="1268" y1="94" x2="1320" y2="94" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="1268" y1="120" x2="1320" y2="120" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <path d="M 1328 158 L 1328 42 L 1368 54 L 1368 158 Z" />
          <line x1="1341" y1="56" x2="1341" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1355" y1="60" x2="1355" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="1378" y="32" width="52" height="126" rx="2" />
          <line x1="1392" y1="46" x2="1392" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />
          <line x1="1416" y1="46" x2="1416" y2="150" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.7" />

          <rect x="1438" y="24" width="48" height="134" rx="2" />
          <line x1="1438" y1="48" x2="1486" y2="48" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="1438" y1="74" x2="1486" y2="74" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />
          <line x1="1438" y1="100" x2="1486" y2="100" stroke="currentColor" strokeWidth="0.9" opacity="0.7" />

          <rect x="1494" y="20" width="50" height="138" rx="2" />
          <line x1="1519" y1="6" x2="1519" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* ======================================================== */}
        {/* LAYER 3: FOREGROUND PROMINENT BUILDINGS (Crisp, High Contrast) */}
        {/* ======================================================== */}
        <g stroke="currentColor" strokeWidth="1.8" fill="var(--background)" opacity="1">
          
          {/* --- FAR LEFT: MEGA SKYSCRAPERS --- */}
          <rect x="36" y="16" width="54" height="142" rx="2.5" />
          <line x1="63" y1="0" x2="63" y2="16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="50" y1="28" x2="50" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />
          <line x1="63" y1="28" x2="63" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />
          <line x1="76" y1="28" x2="76" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />

          <path d="M 98 158 L 98 36 L 148 48 L 148 158 Z" />
          <line x1="114" y1="46" x2="114" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="134" y1="52" x2="134" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />

          <rect x="160" y="44" width="62" height="114" rx="2" />
          <line x1="179" y1="26" x2="179" y2="44" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="203" y1="26" x2="203" y2="44" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="160" y1="68" x2="222" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="160" y1="92" x2="222" y2="92" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="160" y1="116" x2="222" y2="116" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="160" y1="140" x2="222" y2="140" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          <rect x="232" y="58" width="56" height="100" rx="2" />
          <rect x="242" y="46" width="36" height="12" rx="1.5" />
          <line x1="250" y1="70" x2="250" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="270" y1="70" x2="270" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />

          <rect x="298" y="76" width="52" height="82" rx="2" />
          <line x1="298" y1="96" x2="350" y2="96" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="298" y1="118" x2="350" y2="118" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="298" y1="138" x2="350" y2="138" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          <rect x="360" y="90" width="48" height="68" rx="2" />
          <line x1="375" y1="102" x2="375" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
          <line x1="393" y1="102" x2="393" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />

          {/* --- CENTER: LOW-RISE HOUSES, VILLAS, DUPLEXES --- */}
          <rect x="418" y="104" width="46" height="54" rx="2" />
          <path d="M 415 104 L 441 90 L 467 104 Z" fill="var(--background)" />
          <rect x="435" y="128" width="12" height="30" rx="1" strokeWidth="1.2" />
          <rect x="426" y="112" width="10" height="10" rx="0.5" strokeWidth="1.2" />
          <rect x="446" y="112" width="10" height="10" rx="0.5" strokeWidth="1.2" />

          <rect x="474" y="112" width="56" height="46" rx="2" />
          <line x1="474" y1="126" x2="530" y2="126" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="474" y1="140" x2="530" y2="140" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="502" y1="112" x2="502" y2="158" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          <rect x="540" y="108" width="50" height="50" rx="2" />
          <path d="M 537 108 L 565 94 L 593 108 Z" fill="var(--background)" />
          <line x1="550" y1="126" x2="580" y2="126" stroke="currentColor" strokeWidth="1.4" />
          <line x1="550" y1="126" x2="550" y2="136" stroke="currentColor" strokeWidth="1" />
          <line x1="565" y1="126" x2="565" y2="136" stroke="currentColor" strokeWidth="1" />
          <line x1="580" y1="126" x2="580" y2="136" stroke="currentColor" strokeWidth="1" />

          <rect x="600" y="118" width="52" height="40" rx="1.5" />
          <line x1="600" y1="132" x2="652" y2="132" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="600" y1="144" x2="652" y2="144" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          {/* Core Central Estate */}
          <rect x="662" y="120" width="64" height="38" rx="2" />
          <path d="M 658 120 L 694 104 L 730 120 Z" fill="var(--background)" />
          <rect x="686" y="134" width="16" height="24" rx="1" strokeWidth="1.2" />
          <rect x="671" y="126" width="9" height="9" rx="0.5" strokeWidth="1.2" />
          <rect x="709" y="126" width="9" height="9" rx="0.5" strokeWidth="1.2" />

          {/* Minimalist Central-Right Pavilion */}
          <rect x="736" y="118" width="50" height="40" rx="1.5" />
          <line x1="750" y1="124" x2="750" y2="152" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
          <line x1="772" y1="124" x2="772" y2="152" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />

          <rect x="796" y="112" width="56" height="46" rx="2" />
          <path d="M 793 112 L 824 98 L 855 112 Z" fill="var(--background)" />
          <rect x="808" y="120" width="12" height="12" rx="0.5" strokeWidth="1.2" />
          <rect x="832" y="120" width="12" height="12" rx="0.5" strokeWidth="1.2" />
          <rect x="818" y="136" width="14" height="22" rx="1" strokeWidth="1.2" />

          <rect x="862" y="108" width="52" height="50" rx="2" />
          <line x1="862" y1="123" x2="914" y2="123" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="862" y1="138" x2="914" y2="138" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="888" y1="108" x2="888" y2="158" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          <rect x="924" y="104" width="46" height="54" rx="2" />
          <path d="M 921 104 L 947 90 L 973 104 Z" fill="var(--background)" />
          <rect x="941" y="128" width="12" height="30" rx="1" strokeWidth="1.2" />
          <rect x="932" y="112" width="10" height="10" rx="0.5" strokeWidth="1.2" />
          <rect x="952" y="112" width="10" height="10" rx="0.5" strokeWidth="1.2" />

          <rect x="980" y="92" width="52" height="66" rx="2" />
          <line x1="994" y1="104" x2="994" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
          <line x1="1018" y1="104" x2="1018" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />

          <rect x="1042" y="78" width="54" height="80" rx="2" />
          <line x1="1042" y1="98" x2="1096" y2="98" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="1042" y1="118" x2="1096" y2="118" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="1042" y1="138" x2="1096" y2="138" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          {/* --- FAR RIGHT: MEGA SKYSCRAPERS --- */}
          <rect x="1108" y="58" width="58" height="100" rx="2" />
          <rect x="1119" y="46" width="36" height="12" rx="1.5" />
          <line x1="1127" y1="70" x2="1127" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="1147" y1="70" x2="1147" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />

          <rect x="1178" y="42" width="64" height="116" rx="2" />
          <line x1="1198" y1="24" x2="1198" y2="42" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="1222" y1="24" x2="1222" y2="42" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="1178" y1="66" x2="1242" y2="66" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="1178" y1="90" x2="1242" y2="90" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="1178" y1="114" x2="1242" y2="114" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
          <line x1="1178" y1="138" x2="1242" y2="138" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />

          <path d="M 1254 158 L 1254 46 L 1304 32 L 1304 158 Z" />
          <line x1="1270" y1="50" x2="1270" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="1290" y1="44" x2="1290" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />

          <rect x="1318" y="14" width="52" height="144" rx="2.5" />
          <line x1="1344" y1="-2" x2="1344" y2="14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="1331" y1="26" x2="1331" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />
          <line x1="1344" y1="26" x2="1344" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />
          <line x1="1357" y1="26" x2="1357" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.85" />

          <path d="M 1382 158 L 1382 24 L 1416 8 L 1450 24 L 1450 158 Z" />
          <line x1="1416" y1="-6" x2="1416" y2="8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="1399" y1="36" x2="1399" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="1416" y1="36" x2="1416" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="1433" y1="36" x2="1433" y2="148" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />

          <rect x="1464" y="30" width="60" height="128" rx="2.5" />
          <line x1="1480" y1="42" x2="1480" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
          <line x1="1508" y1="42" x2="1508" y2="150" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.85" />
        </g>

        {/* Landscaping trees along the baseline */}
        <circle cx="92" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="226" cy="155" r="5" fill="currentColor" opacity="0.85" />
        <circle cx="410" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="468" cy="155" r="4" fill="currentColor" opacity="0.85" />
        <circle cx="534" cy="155" r="4" fill="currentColor" opacity="0.85" />
        <circle cx="594" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="656" cy="155" r="5" fill="currentColor" opacity="0.85" />
        <circle cx="730" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="790" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="856" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="918" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="974" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="1036" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="1102" cy="155" r="4.5" fill="currentColor" opacity="0.85" />
        <circle cx="1170" cy="155" r="5" fill="currentColor" opacity="0.85" />
        <circle cx="1310" cy="155" r="5" fill="currentColor" opacity="0.85" />
        <circle cx="1458" cy="155" r="5" fill="currentColor" opacity="0.85" />
      </svg>
    </div>
  );
}
