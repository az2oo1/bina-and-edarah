import React from "react";

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full h-32 sm:h-36 md:h-44 lg:h-52 xl:h-60" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative w-full flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      <style>{`
        :root {
          --sky-bg: #cbd5e1;
          --sky-mid: #64748b;
          --sky-mid-line: #94a3b8;
          --sky-fore: #1e293b;
          --sky-window: #ffffff;
          --sky-fore-line: rgba(255, 255, 255, 0.4);
          --sky-ground: #1e293b;
        }
        .dark {
          --sky-bg: rgba(148, 163, 184, 0.16);
          --sky-mid: rgba(148, 163, 184, 0.32);
          --sky-mid-line: rgba(255, 255, 255, 0.20);
          --sky-fore: #0f172a;
          --sky-window: #fef08a;
          --sky-fore-line: rgba(255, 255, 255, 0.25);
          --sky-ground: #0f172a;
        }
        .sky-bg-layer { fill: var(--sky-bg); }
        .sky-mid-layer { fill: var(--sky-mid); }
        .sky-mid-lines { stroke: var(--sky-mid-line); stroke-width: 1.2px; stroke-linecap: round; }
        .sky-fore-layer { fill: var(--sky-fore); }
        .sky-fore-window { fill: var(--sky-window); }
        .sky-fore-lines { stroke: var(--sky-fore-line); stroke-width: 1.2px; }
        .sky-ground-line { fill: var(--sky-ground); }
      `}</style>
      <svg viewBox="0 0 2400 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">

  

  
  <g className="sky-bg-layer">
    <rect x="15" y="95" width="80" height="255" /><rect x="54" y="70" width="2" height="25" /><circle cx="55" cy="70" r="2" />
    <rect x="85" y="135" width="65" height="215" />
    <rect x="155" y="75" width="95" height="275" /><rect x="201" y="35" width="2" height="40" /><circle cx="202" cy="35" r="2" />
    <rect x="265" y="120" width="75" height="230" />
    <rect x="355" y="85" width="90" height="265" /><rect x="399" y="55" width="2" height="30" /><circle cx="400" cy="55" r="2" />
    <rect x="460" y="115" width="80" height="235" />
    <rect x="530" y="60" width="110" height="290" /><rect x="584" y="15" width="2" height="45" /><circle cx="585" cy="15" r="2" />
    <rect x="660" y="95" width="75" height="255" /><rect x="696" y="70" width="2" height="25" /><circle cx="697" cy="70" r="2" />
    <rect x="755" y="75" width="95" height="275" /><rect x="801" y="40" width="2" height="35" /><circle cx="802" cy="40" r="2" />
    <rect x="865" y="110" width="80" height="240" />
    <rect x="960" y="85" width="100" height="265" /><rect x="1009" y="55" width="2" height="30" /><circle cx="1010" cy="55" r="2" />
    <rect x="1085" y="55" width="115" height="295" /><rect x="1141" y="15" width="2" height="40" /><circle cx="1142" cy="15" r="2" />
    <rect x="1215" y="70" width="105" height="280" /><rect x="1266" y="40" width="2" height="30" /><circle cx="1267" cy="40" r="2" />
    <rect x="1335" y="95" width="90" height="255" />
    <rect x="1445" y="50" width="120" height="300" /><rect x="1504" y="0" width="2" height="50" /><circle cx="1505" cy="0" r="2" />
    <rect x="1585" y="80" width="85" height="270" /><rect x="1626" y="55" width="2" height="25" /><circle cx="1627" cy="55" r="2" />
    <rect x="1685" y="105" width="95" height="245" />
    <rect x="1795" y="65" width="110" height="285" /><rect x="1849" y="30" width="2" height="35" /><circle cx="1850" cy="30" r="2" />
    <rect x="1925" y="90" width="85" height="260" /><rect x="1966" y="65" width="2" height="25" /><circle cx="1967" cy="65" r="2" />
    <rect x="2025" y="55" width="105" height="295" /><rect x="2076" y="10" width="2" height="45" /><circle cx="2077" cy="10" r="2" />
    <rect x="2145" y="100" width="90" height="250" />
    <rect x="2255" y="75" width="100" height="275" /><rect x="2304" y="45" width="2" height="30" /><circle cx="2305" cy="45" r="2" />
    <rect x="2335" y="115" width="65" height="235" /><rect x="2366" y="95" width="2" height="20" /><circle cx="2367" cy="95" r="2" />
    <polygon points="545,60 585,25 625,60" />
    <rect x="584" y="5" width="2" height="20" />
    <polygon points="1465,50 1505,15 1545,50" />
    <rect x="1504" y="0" width="2" height="15" />
    <polygon points="2045,55 2077,20 2110,55" />
    <rect x="2076" y="5" width="2" height="15" />
  </g>

  
  <g className="sky-mid-layer">
    
    <rect x="45" y="130" width="105" height="220" />
    <rect x="60" y="95" width="75" height="35" />
    <rect x="75" y="70" width="45" height="25" />
    <rect x="96" y="45" width="3" height="25" />
    
    <rect x="170" y="80" width="115" height="270" />
    <rect x="195" y="55" width="65" height="25" />
    <rect x="226" y="30" width="3" height="25" />
    
    <rect x="315" y="120" width="120" height="230" />
    <rect x="330" y="80" width="90" height="40" />
    <path d="M 345 80 C 345 55, 360 35, 375 25 C 390 35, 405 55, 405 80 Z" />
    <rect x="373" y="5" width="4" height="20" />
    <circle cx="375" cy="4" r="2.5" />
    
    <polygon points="480,50 570,50 585,350 465,350" />
    <rect x="500" y="30" width="50" height="20" />
    <rect x="512" y="5" width="3" height="25" />
    <rect x="535" y="5" width="3" height="25" />
    
    <rect x="625" y="150" width="150" height="200" />
    <rect x="645" y="105" width="110" height="45" />
    <rect x="665" y="65" width="70" height="40" />
    <rect x="682" y="38" width="36" height="27" />
    <rect x="693" y="22" width="14" height="16" />
    <rect x="698" y="2" width="4" height="20" />
    <circle cx="700" cy="2" r="2.5" />
    
    <rect x="815" y="110" width="120" height="240" />
    <polygon points="815,110 875,60 935,110" />
    <rect x="873" y="30" width="4" height="30" />
    <polygon points="815,110 825,90 835,110" />
    <polygon points="915,110 925,90 935,110" />
    
    <rect x="965" y="95" width="125" height="255" />
    <rect x="990" y="70" width="75" height="25" />
    
    <rect x="1275" y="115" width="115" height="235" />
    <polygon points="1275,115 1332,55 1390,115" />
    <rect x="1330" y="20" width="4" height="35" />
    <circle cx="1332" cy="18" r="3" />
    
    <rect x="1425" y="45" width="150" height="305" />
    <rect x="1445" y="30" width="110" height="15" />
    <rect x="1465" y="15" width="70" height="15" />
    <rect x="1480" y="0" width="3" height="15" />
    <rect x="1517" y="0" width="3" height="15" />
    
    <rect x="1615" y="115" width="120" height="235" />
    <rect x="1635" y="75" width="80" height="40" />
    <rect x="1655" y="45" width="40" height="30" />
    <rect x="1673" y="20" width="4" height="25" />
    
    <rect x="1765" y="90" width="135" height="260" />
    <rect x="1790" y="60" width="85" height="30" />
    <rect x="1831" y="35" width="3" height="25" />
    
    <polygon points="1935,110 2055,70 2055,350 1935,350" />
    <rect x="2045" y="40" width="3" height="30" />
    
    <rect x="2090" y="120" width="125" height="230" />
    <rect x="2110" y="80" width="85" height="40" />
    <polygon points="2110,80 2152,40 2195,80" />
    <rect x="2150" y="15" width="4" height="25" />
    
    <rect x="2250" y="105" width="120" height="245" />
    <rect x="2275" y="75" width="70" height="30" />
    <rect x="2308" y="50" width="4" height="25" />
  </g>

  <g className="sky-mid-lines">
    <line x1="185" y1="90" x2="185" y2="345" />
    <line x1="197" y1="90" x2="197" y2="345" />
    <line x1="209" y1="90" x2="209" y2="345" />
    <line x1="221" y1="90" x2="221" y2="345" />
    <line x1="233" y1="90" x2="233" y2="345" />
    <line x1="245" y1="90" x2="245" y2="345" />
    <line x1="257" y1="90" x2="257" y2="345" />
    <line x1="269" y1="90" x2="269" y2="345" />
    <line x1="477.5" y1="100" x2="572.5" y2="100" />
    <line x1="474.5" y1="160" x2="575.5" y2="160" />
    <line x1="471.5" y1="220" x2="578.5" y2="220" />
    <line x1="468.5" y1="280" x2="581.5" y2="280" />
    <line x1="480" y1="50" x2="572" y2="100" />
    <line x1="570" y1="50" x2="478" y2="100" />
    <line x1="478" y1="100" x2="575" y2="160" />
    <line x1="572" y1="100" x2="475" y2="160" />
    <line x1="475" y1="160" x2="579" y2="220" />
    <line x1="575" y1="160" x2="471" y2="220" />
    <line x1="672" y1="70" x2="672" y2="145" />
    <line x1="680" y1="70" x2="680" y2="145" />
    <line x1="688" y1="70" x2="688" y2="145" />
    <line x1="696" y1="70" x2="696" y2="145" />
    <line x1="704" y1="70" x2="704" y2="145" />
    <line x1="712" y1="70" x2="712" y2="145" />
    <line x1="720" y1="70" x2="720" y2="145" />
    <line x1="728" y1="70" x2="728" y2="145" />
    <line x1="652" y1="110" x2="652" y2="345" />
    <line x1="662" y1="110" x2="662" y2="345" />
    <line x1="672" y1="110" x2="672" y2="345" />
    <line x1="682" y1="110" x2="682" y2="345" />
    <line x1="692" y1="110" x2="692" y2="345" />
    <line x1="702" y1="110" x2="702" y2="345" />
    <line x1="712" y1="110" x2="712" y2="345" />
    <line x1="722" y1="110" x2="722" y2="345" />
    <line x1="732" y1="110" x2="732" y2="345" />
    <line x1="742" y1="110" x2="742" y2="345" />
    <line x1="1435" y1="50" x2="1435" y2="345" />
    <line x1="1444" y1="50" x2="1444" y2="345" />
    <line x1="1453" y1="50" x2="1453" y2="345" />
    <line x1="1462" y1="50" x2="1462" y2="345" />
    <line x1="1471" y1="50" x2="1471" y2="345" />
    <line x1="1480" y1="50" x2="1480" y2="345" />
    <line x1="1489" y1="50" x2="1489" y2="345" />
    <line x1="1498" y1="50" x2="1498" y2="345" />
    <line x1="1507" y1="50" x2="1507" y2="345" />
    <line x1="1516" y1="50" x2="1516" y2="345" />
    <line x1="1525" y1="50" x2="1525" y2="345" />
    <line x1="1534" y1="50" x2="1534" y2="345" />
    <line x1="1543" y1="50" x2="1543" y2="345" />
    <line x1="1552" y1="50" x2="1552" y2="345" />
    <line x1="1561" y1="50" x2="1561" y2="345" />
    <line x1="980" y1="105" x2="980" y2="345" />
    <line x1="992" y1="105" x2="992" y2="345" />
    <line x1="1004" y1="105" x2="1004" y2="345" />
    <line x1="1016" y1="105" x2="1016" y2="345" />
    <line x1="1028" y1="105" x2="1028" y2="345" />
    <line x1="1040" y1="105" x2="1040" y2="345" />
    <line x1="1052" y1="105" x2="1052" y2="345" />
    <line x1="1064" y1="105" x2="1064" y2="345" />
    <line x1="1780" y1="100" x2="1780" y2="345" />
    <line x1="1791" y1="100" x2="1791" y2="345" />
    <line x1="1802" y1="100" x2="1802" y2="345" />
    <line x1="1813" y1="100" x2="1813" y2="345" />
    <line x1="1824" y1="100" x2="1824" y2="345" />
    <line x1="1835" y1="100" x2="1835" y2="345" />
    <line x1="1846" y1="100" x2="1846" y2="345" />
    <line x1="1857" y1="100" x2="1857" y2="345" />
    <line x1="1868" y1="100" x2="1868" y2="345" />
    <line x1="1879" y1="100" x2="1879" y2="345" />
  </g>

  
  <g className="sky-fore-layer">
    
    <rect x="0" y="225" width="135" height="125" />
    <polygon points="0,225 15,190 120,190 135,225" />
    <polygon points="22,195 30,180 38,195" />
    <rect x="22" y="195" width="16" height="15" />
    <polygon points="57,195 65,180 73,195" />
    <rect x="57" y="195" width="16" height="15" />
    <polygon points="92,195 100,180 108,195" />
    <rect x="92" y="195" width="16" height="15" />
    
    <rect x="150" y="210" width="85" height="140" />
    <rect x="165" y="170" width="55" height="40" />
    <polygon points="165,170 192,120 220,170" />
    <rect x="191" y="105" width="3" height="15" />
    <circle cx="192" cy="103" r="2" />
    
    <rect x="260" y="215" width="165" height="135" />
    <polygon points="260,215 342,175 425,215" />
    <rect x="250" y="212" width="185" height="6" />
    <rect x="265" y="206" width="3" height="6" />
    <rect x="273" y="206" width="3" height="6" />
    <rect x="281" y="206" width="3" height="6" />
    <rect x="289" y="206" width="3" height="6" />
    <rect x="297" y="206" width="3" height="6" />
    <rect x="305" y="206" width="3" height="6" />
    <rect x="313" y="206" width="3" height="6" />
    <rect x="321" y="206" width="3" height="6" />
    <rect x="329" y="206" width="3" height="6" />
    <rect x="337" y="206" width="3" height="6" />
    <rect x="345" y="206" width="3" height="6" />
    <rect x="353" y="206" width="3" height="6" />
    <rect x="361" y="206" width="3" height="6" />
    <rect x="369" y="206" width="3" height="6" />
    <rect x="377" y="206" width="3" height="6" />
    <rect x="385" y="206" width="3" height="6" />
    <rect x="393" y="206" width="3" height="6" />
    <rect x="401" y="206" width="3" height="6" />
    <rect x="409" y="206" width="3" height="6" />
    <rect x="417" y="206" width="3" height="6" />
    
    <rect x="450" y="205" width="140" height="145" />
    <rect x="445" y="200" width="150" height="6" />
    <rect x="495" y="185" width="50" height="15" />
    <rect x="555" y="180" width="22" height="20" rx="2" />
    <line x1="558" y1="200" x2="558" y2="205" stroke="currentColor" strokeWidth="2" />
    <line x1="574" y1="200" x2="574" y2="205" stroke="currentColor" strokeWidth="2" />
    
    <rect x="610" y="220" width="125" height="130" />
    <rect x="635" y="175" width="45" height="45" />
    <polygon points="635,175 657,125 680,175" />
    <rect x="656" y="108" width="3" height="17" />
    <polygon points="630,220 635,200 640,220" />
    <polygon points="720,220 725,200 730,220" />
    
    <rect x="760" y="210" width="175" height="140" />
    <rect x="755" y="205" width="185" height="6" />
    <rect x="815" y="190" width="65" height="15" />
    <polygon points="815,190 847,170 880,190" />
    
    <rect x="960" y="225" width="95" height="125" />
    <rect x="955" y="220" width="105" height="6" />
    <polygon points="985,220 1007,198 1030,220" />
    
    <rect x="1065" y="235" width="270" height="115" />
    <rect x="1055" y="230" width="290" height="6" />
    <rect x="1115" y="185" width="170" height="45" />
    <rect x="1105" y="180" width="190" height="6" />
    <path d="M 1115 180 C 1115 125, 1155 100, 1200 100 C 1245 100, 1285 125, 1285 180 Z" />
    <rect x="1185" y="80" width="30" height="20" />
    <polygon points="1180,80 1200,55 1220,80" />
    <rect x="1198" y="32" width="4" height="23" />
    <circle cx="1200" cy="30" r="3" />
    <rect x="1080" y="215" width="24" height="15" />
    <polygon points="1080,215 1092,202 1104,215" />
    <rect x="1296" y="215" width="24" height="15" />
    <polygon points="1296,215 1308,202 1320,215" />
    
    
    <rect x="1345" y="225" width="95" height="125" />
    <rect x="1340" y="220" width="105" height="6" />
    <polygon points="1370,220 1392,198 1415,220" />
    
    <rect x="1465" y="200" width="80" height="150" />
    <rect x="1475" y="160" width="60" height="40" />
    <polygon points="1475,160 1505,110 1535,160" />
    <rect x="1503" y="90" width="4" height="20" />
    <circle cx="1505" cy="88" r="2.5" />
    
    <rect x="1575" y="210" width="160" height="140" />
    <rect x="1568" y="205" width="174" height="6" />
    <polygon points="1610,205 1655,172 1700,205" />
    <rect x="1580" y="199" width="3" height="6" />
    <rect x="1588" y="199" width="3" height="6" />
    <rect x="1596" y="199" width="3" height="6" />
    <rect x="1604" y="199" width="3" height="6" />
    <rect x="1612" y="199" width="3" height="6" />
    <rect x="1620" y="199" width="3" height="6" />
    <rect x="1628" y="199" width="3" height="6" />
    <rect x="1636" y="199" width="3" height="6" />
    <rect x="1644" y="199" width="3" height="6" />
    <rect x="1652" y="199" width="3" height="6" />
    <rect x="1660" y="199" width="3" height="6" />
    <rect x="1668" y="199" width="3" height="6" />
    <rect x="1676" y="199" width="3" height="6" />
    <rect x="1684" y="199" width="3" height="6" />
    <rect x="1692" y="199" width="3" height="6" />
    <rect x="1700" y="199" width="3" height="6" />
    <rect x="1708" y="199" width="3" height="6" />
    <rect x="1716" y="199" width="3" height="6" />
    <rect x="1724" y="199" width="3" height="6" />
    
    <rect x="1760" y="215" width="130" height="135" />
    <rect x="1755" y="210" width="140" height="6" />
    <rect x="1800" y="180" width="50" height="30" />
    <path d="M 1800 180 C 1800 155, 1815 140, 1825 140 C 1835 140, 1850 155, 1850 180 Z" />
    <rect x="1823" y="125" width="4" height="15" />
    
    <rect x="1915" y="220" width="160" height="130" />
    <rect x="1910" y="215" width="170" height="6" />
    <polygon points="1940,215 1970,185 2000,215" />
    <rect x="2020" y="195" width="8" height="20" />
    <rect x="2045" y="190" width="10" height="25" />
    
    <rect x="2100" y="210" width="145" height="140" />
    <polygon points="2100,210 2172,175 2245,210" />
    <rect x="2095" y="207" width="155" height="4" />
    
    <rect x="2265" y="220" width="135" height="130" />
    <polygon points="2265,220 2285,190 2380,190 2400,220" />
    <polygon points="2297,195 2305,180 2313,195" />
    <rect x="2297" y="195" width="16" height="15" />
    <polygon points="2337,195 2345,180 2353,195" />
    <rect x="2337" y="195" width="16" height="15" />
  </g>

  
  <g className="sky-fore-window">
    <rect x="20" y="240" width="14" height="20" rx="1" /><rect x="49" y="240" width="14" height="20" rx="1" /><rect x="78" y="240" width="14" height="20" rx="1" /><rect x="107" y="240" width="14" height="20" rx="1" /><rect x="20" y="272" width="14" height="20" rx="1" /><rect x="49" y="272" width="14" height="20" rx="1" /><rect x="78" y="272" width="14" height="20" rx="1" /><rect x="107" y="272" width="14" height="20" rx="1" /><rect x="20" y="304" width="14" height="20" rx="1" /><rect x="49" y="304" width="14" height="20" rx="1" /><rect x="78" y="304" width="14" height="20" rx="1" /><rect x="107" y="304" width="14" height="20" rx="1" />
    <circle cx="192" cy="190" r="10" />
    <path d="M 175 257 L 175 243.8 C 175 235, 187 235, 187 243.8 L 187 257 Z" /><path d="M 205 257 L 205 243.8 C 205 235, 217 235, 217 243.8 L 217 257 Z" /><path d="M 175 293 L 175 279.8 C 175 271, 187 271, 187 279.8 L 187 293 Z" /><path d="M 205 293 L 205 279.8 C 205 271, 217 271, 217 279.8 L 217 293 Z" /><path d="M 175 329 L 175 315.8 C 175 307, 187 307, 187 315.8 L 187 329 Z" /><path d="M 205 329 L 205 315.8 C 205 307, 217 307, 217 315.8 L 217 329 Z" />
    <path d="M 285 257 L 285 243.8 C 285 235, 299 235, 299 243.8 L 299 257 Z" /><path d="M 313 257 L 313 243.8 C 313 235, 327 235, 327 243.8 L 327 257 Z" /><path d="M 341 257 L 341 243.8 C 341 235, 355 235, 355 243.8 L 355 257 Z" /><path d="M 369 257 L 369 243.8 C 369 235, 383 235, 383 243.8 L 383 257 Z" /><path d="M 397 257 L 397 243.8 C 397 235, 411 235, 411 243.8 L 411 257 Z" /><path d="M 285 293 L 285 279.8 C 285 271, 299 271, 299 279.8 L 299 293 Z" /><path d="M 313 293 L 313 279.8 C 313 271, 327 271, 327 279.8 L 327 293 Z" /><path d="M 341 293 L 341 279.8 C 341 271, 355 271, 355 279.8 L 355 293 Z" /><path d="M 369 293 L 369 279.8 C 369 271, 383 271, 383 279.8 L 383 293 Z" /><path d="M 397 293 L 397 279.8 C 397 271, 411 271, 411 279.8 L 411 293 Z" /><path d="M 285 329 L 285 315.8 C 285 307, 299 307, 299 315.8 L 299 329 Z" /><path d="M 313 329 L 313 315.8 C 313 307, 327 307, 327 315.8 L 327 329 Z" /><path d="M 341 329 L 341 315.8 C 341 307, 355 307, 355 315.8 L 355 329 Z" /><path d="M 369 329 L 369 315.8 C 369 307, 383 307, 383 315.8 L 383 329 Z" /><path d="M 397 329 L 397 315.8 C 397 307, 411 307, 411 315.8 L 411 329 Z" />
    <path d="M 330 350 L 330 305 C 330 290, 355 290, 355 305 L 355 350 Z" />
    <rect x="470" y="225" width="13" height="18" rx="1" /><rect x="495" y="225" width="13" height="18" rx="1" /><rect x="520" y="225" width="13" height="18" rx="1" /><rect x="545" y="225" width="13" height="18" rx="1" /><rect x="570" y="225" width="13" height="18" rx="1" /><rect x="470" y="255" width="13" height="18" rx="1" /><rect x="495" y="255" width="13" height="18" rx="1" /><rect x="520" y="255" width="13" height="18" rx="1" /><rect x="545" y="255" width="13" height="18" rx="1" /><rect x="570" y="255" width="13" height="18" rx="1" /><rect x="470" y="285" width="13" height="18" rx="1" /><rect x="495" y="285" width="13" height="18" rx="1" /><rect x="520" y="285" width="13" height="18" rx="1" /><rect x="545" y="285" width="13" height="18" rx="1" /><rect x="570" y="285" width="13" height="18" rx="1" /><rect x="470" y="315" width="13" height="18" rx="1" /><rect x="495" y="315" width="13" height="18" rx="1" /><rect x="520" y="315" width="13" height="18" rx="1" /><rect x="545" y="315" width="13" height="18" rx="1" /><rect x="570" y="315" width="13" height="18" rx="1" />
    <path d="M 640 262 L 640 248.8 C 640 240, 652 240, 652 248.8 L 652 262 Z" /><path d="M 667 262 L 667 248.8 C 667 240, 679 240, 679 248.8 L 679 262 Z" /><path d="M 694 262 L 694 248.8 C 694 240, 706 240, 706 248.8 L 706 262 Z" /><path d="M 640 296 L 640 282.8 C 640 274, 652 274, 652 282.8 L 652 296 Z" /><path d="M 667 296 L 667 282.8 C 667 274, 679 274, 679 282.8 L 679 296 Z" /><path d="M 694 296 L 694 282.8 C 694 274, 706 274, 706 282.8 L 706 296 Z" /><path d="M 640 330 L 640 316.8 C 640 308, 652 308, 652 316.8 L 652 330 Z" /><path d="M 667 330 L 667 316.8 C 667 308, 679 308, 679 316.8 L 679 330 Z" /><path d="M 694 330 L 694 316.8 C 694 308, 706 308, 706 316.8 L 706 330 Z" />
    <rect x="780" y="230" width="13" height="18" rx="1" /><rect x="806" y="230" width="13" height="18" rx="1" /><rect x="832" y="230" width="13" height="18" rx="1" /><rect x="858" y="230" width="13" height="18" rx="1" /><rect x="884" y="230" width="13" height="18" rx="1" /><rect x="910" y="230" width="13" height="18" rx="1" /><rect x="780" y="259" width="13" height="18" rx="1" /><rect x="806" y="259" width="13" height="18" rx="1" /><rect x="832" y="259" width="13" height="18" rx="1" /><rect x="858" y="259" width="13" height="18" rx="1" /><rect x="884" y="259" width="13" height="18" rx="1" /><rect x="910" y="259" width="13" height="18" rx="1" /><rect x="780" y="288" width="13" height="18" rx="1" /><rect x="806" y="288" width="13" height="18" rx="1" /><rect x="832" y="288" width="13" height="18" rx="1" /><rect x="858" y="288" width="13" height="18" rx="1" /><rect x="884" y="288" width="13" height="18" rx="1" /><rect x="910" y="288" width="13" height="18" rx="1" /><rect x="780" y="317" width="13" height="18" rx="1" /><rect x="806" y="317" width="13" height="18" rx="1" /><rect x="832" y="317" width="13" height="18" rx="1" /><rect x="858" y="317" width="13" height="18" rx="1" /><rect x="884" y="317" width="13" height="18" rx="1" /><rect x="910" y="317" width="13" height="18" rx="1" />
    <path d="M 975 265 L 975 253.0 C 975 245, 988 245, 988 253.0 L 988 265 Z" /><path d="M 1002 265 L 1002 253.0 C 1002 245, 1015 245, 1015 253.0 L 1015 265 Z" /><path d="M 1029 265 L 1029 253.0 C 1029 245, 1042 245, 1042 253.0 L 1042 265 Z" /><path d="M 975 297 L 975 285.0 C 975 277, 988 277, 988 285.0 L 988 297 Z" /><path d="M 1002 297 L 1002 285.0 C 1002 277, 1015 277, 1015 285.0 L 1015 297 Z" /><path d="M 1029 297 L 1029 285.0 C 1029 277, 1042 277, 1042 285.0 L 1042 297 Z" /><path d="M 975 329 L 975 317.0 C 975 309, 988 309, 988 317.0 L 988 329 Z" /><path d="M 1002 329 L 1002 317.0 C 1002 309, 1015 309, 1015 317.0 L 1015 329 Z" /><path d="M 1029 329 L 1029 317.0 C 1029 309, 1042 309, 1042 317.0 L 1042 329 Z" />
<path d="M 1130 222 L 1130 202 C 1130 195, 1139 195, 1139 202 L 1139 222 Z" />
<path d="M 1148 222 L 1148 202 C 1148 195, 1157 195, 1157 202 L 1157 222 Z" />
<path d="M 1166 222 L 1166 202 C 1166 195, 1175 195, 1175 202 L 1175 222 Z" />
<path d="M 1184 222 L 1184 202 C 1184 195, 1193 195, 1193 202 L 1193 222 Z" />
<path d="M 1202 222 L 1202 202 C 1202 195, 1211 195, 1211 202 L 1211 222 Z" />
<path d="M 1220 222 L 1220 202 C 1220 195, 1229 195, 1229 202 L 1229 222 Z" />
<path d="M 1238 222 L 1238 202 C 1238 195, 1247 195, 1247 202 L 1247 222 Z" />
<path d="M 1256 222 L 1256 202 C 1256 195, 1265 195, 1265 202 L 1265 222 Z" />
<path d="M 1274 222 L 1274 202 C 1274 195, 1283 195, 1283 202 L 1283 222 Z" />
<rect x="1192" y="85" width="5" height="11" rx="1" />
<rect x="1203" y="85" width="5" height="11" rx="1" />
    <path d="M 1090 280 L 1090 265.0 C 1090 255, 1106 255, 1106 265.0 L 1106 280 Z" /><path d="M 1122 280 L 1122 265.0 C 1122 255, 1138 255, 1138 265.0 L 1138 280 Z" /><path d="M 1154 280 L 1154 265.0 C 1154 255, 1170 255, 1170 265.0 L 1170 280 Z" /><path d="M 1090 320 L 1090 305.0 C 1090 295, 1106 295, 1106 305.0 L 1106 320 Z" /><path d="M 1122 320 L 1122 305.0 C 1122 295, 1138 295, 1138 305.0 L 1138 320 Z" /><path d="M 1154 320 L 1154 305.0 C 1154 295, 1170 295, 1170 305.0 L 1170 320 Z" />
    <path d="M 1245 280 L 1245 265.0 C 1245 255, 1261 255, 1261 265.0 L 1261 280 Z" /><path d="M 1277 280 L 1277 265.0 C 1277 255, 1293 255, 1293 265.0 L 1293 280 Z" /><path d="M 1309 280 L 1309 265.0 C 1309 255, 1325 255, 1325 265.0 L 1325 280 Z" /><path d="M 1245 320 L 1245 305.0 C 1245 295, 1261 295, 1261 305.0 L 1261 320 Z" /><path d="M 1277 320 L 1277 305.0 C 1277 295, 1293 295, 1293 305.0 L 1293 320 Z" /><path d="M 1309 320 L 1309 305.0 C 1309 295, 1325 295, 1325 305.0 L 1325 320 Z" />
    <path d="M 1180 350 L 1180 280 C 1180 260, 1220 260, 1220 280 L 1220 350 Z" />
    <path d="M 1360 265 L 1360 253.0 C 1360 245, 1373 245, 1373 253.0 L 1373 265 Z" /><path d="M 1387 265 L 1387 253.0 C 1387 245, 1400 245, 1400 253.0 L 1400 265 Z" /><path d="M 1414 265 L 1414 253.0 C 1414 245, 1427 245, 1427 253.0 L 1427 265 Z" /><path d="M 1360 297 L 1360 285.0 C 1360 277, 1373 277, 1373 285.0 L 1373 297 Z" /><path d="M 1387 297 L 1387 285.0 C 1387 277, 1400 277, 1400 285.0 L 1400 297 Z" /><path d="M 1414 297 L 1414 285.0 C 1414 277, 1427 277, 1427 285.0 L 1427 297 Z" /><path d="M 1360 329 L 1360 317.0 C 1360 309, 1373 309, 1373 317.0 L 1373 329 Z" /><path d="M 1387 329 L 1387 317.0 C 1387 309, 1400 309, 1400 317.0 L 1400 329 Z" /><path d="M 1414 329 L 1414 317.0 C 1414 309, 1427 309, 1427 317.0 L 1427 329 Z" />
    <path d="M 1485 251 L 1485 235.4 C 1485 225, 1499 225, 1499 235.4 L 1499 251 Z" /><path d="M 1517 251 L 1517 235.4 C 1517 225, 1531 225, 1531 235.4 L 1531 251 Z" /><path d="M 1485 291 L 1485 275.4 C 1485 265, 1499 265, 1499 275.4 L 1499 291 Z" /><path d="M 1517 291 L 1517 275.4 C 1517 265, 1531 265, 1531 275.4 L 1531 291 Z" /><path d="M 1485 331 L 1485 315.4 C 1485 305, 1499 305, 1499 315.4 L 1499 331 Z" /><path d="M 1517 331 L 1517 315.4 C 1517 305, 1531 305, 1531 315.4 L 1531 331 Z" />
    <rect x="1595" y="225" width="14" height="18" rx="1" /><rect x="1623" y="225" width="14" height="18" rx="1" /><rect x="1651" y="225" width="14" height="18" rx="1" /><rect x="1679" y="225" width="14" height="18" rx="1" /><rect x="1707" y="225" width="14" height="18" rx="1" /><rect x="1595" y="255" width="14" height="18" rx="1" /><rect x="1623" y="255" width="14" height="18" rx="1" /><rect x="1651" y="255" width="14" height="18" rx="1" /><rect x="1679" y="255" width="14" height="18" rx="1" /><rect x="1707" y="255" width="14" height="18" rx="1" /><rect x="1595" y="285" width="14" height="18" rx="1" /><rect x="1623" y="285" width="14" height="18" rx="1" /><rect x="1651" y="285" width="14" height="18" rx="1" /><rect x="1679" y="285" width="14" height="18" rx="1" /><rect x="1707" y="285" width="14" height="18" rx="1" /><rect x="1595" y="315" width="14" height="18" rx="1" /><rect x="1623" y="315" width="14" height="18" rx="1" /><rect x="1651" y="315" width="14" height="18" rx="1" /><rect x="1679" y="315" width="14" height="18" rx="1" /><rect x="1707" y="315" width="14" height="18" rx="1" />
    <path d="M 1780 255 L 1780 243.0 C 1780 235, 1794 235, 1794 243.0 L 1794 255 Z" /><path d="M 1809 255 L 1809 243.0 C 1809 235, 1823 235, 1823 243.0 L 1823 255 Z" /><path d="M 1838 255 L 1838 243.0 C 1838 235, 1852 235, 1852 243.0 L 1852 255 Z" /><path d="M 1867 255 L 1867 243.0 C 1867 235, 1881 235, 1881 243.0 L 1881 255 Z" /><path d="M 1780 289 L 1780 277.0 C 1780 269, 1794 269, 1794 277.0 L 1794 289 Z" /><path d="M 1809 289 L 1809 277.0 C 1809 269, 1823 269, 1823 277.0 L 1823 289 Z" /><path d="M 1838 289 L 1838 277.0 C 1838 269, 1852 269, 1852 277.0 L 1852 289 Z" /><path d="M 1867 289 L 1867 277.0 C 1867 269, 1881 269, 1881 277.0 L 1881 289 Z" /><path d="M 1780 323 L 1780 311.0 C 1780 303, 1794 303, 1794 311.0 L 1794 323 Z" /><path d="M 1809 323 L 1809 311.0 C 1809 303, 1823 303, 1823 311.0 L 1823 323 Z" /><path d="M 1838 323 L 1838 311.0 C 1838 303, 1852 303, 1852 311.0 L 1852 323 Z" /><path d="M 1867 323 L 1867 311.0 C 1867 303, 1881 303, 1881 311.0 L 1881 323 Z" />
    <rect x="1935" y="235" width="13" height="20" rx="1" /><rect x="1963" y="235" width="13" height="20" rx="1" /><rect x="1991" y="235" width="13" height="20" rx="1" /><rect x="2019" y="235" width="13" height="20" rx="1" /><rect x="2047" y="235" width="13" height="20" rx="1" /><rect x="1935" y="269" width="13" height="20" rx="1" /><rect x="1963" y="269" width="13" height="20" rx="1" /><rect x="1991" y="269" width="13" height="20" rx="1" /><rect x="2019" y="269" width="13" height="20" rx="1" /><rect x="2047" y="269" width="13" height="20" rx="1" /><rect x="1935" y="303" width="13" height="20" rx="1" /><rect x="1963" y="303" width="13" height="20" rx="1" /><rect x="1991" y="303" width="13" height="20" rx="1" /><rect x="2019" y="303" width="13" height="20" rx="1" /><rect x="2047" y="303" width="13" height="20" rx="1" />
    <path d="M 2120 252 L 2120 238.8 C 2120 230, 2135 230, 2135 238.8 L 2135 252 Z" /><path d="M 2151 252 L 2151 238.8 C 2151 230, 2166 230, 2166 238.8 L 2166 252 Z" /><path d="M 2182 252 L 2182 238.8 C 2182 230, 2197 230, 2197 238.8 L 2197 252 Z" /><path d="M 2213 252 L 2213 238.8 C 2213 230, 2228 230, 2228 238.8 L 2228 252 Z" /><path d="M 2120 288 L 2120 274.8 C 2120 266, 2135 266, 2135 274.8 L 2135 288 Z" /><path d="M 2151 288 L 2151 274.8 C 2151 266, 2166 266, 2166 274.8 L 2166 288 Z" /><path d="M 2182 288 L 2182 274.8 C 2182 266, 2197 266, 2197 274.8 L 2197 288 Z" /><path d="M 2213 288 L 2213 274.8 C 2213 266, 2228 266, 2228 274.8 L 2228 288 Z" /><path d="M 2120 324 L 2120 310.8 C 2120 302, 2135 302, 2135 310.8 L 2135 324 Z" /><path d="M 2151 324 L 2151 310.8 C 2151 302, 2166 302, 2166 310.8 L 2166 324 Z" /><path d="M 2182 324 L 2182 310.8 C 2182 302, 2197 302, 2197 310.8 L 2197 324 Z" /><path d="M 2213 324 L 2213 310.8 C 2213 302, 2228 302, 2228 310.8 L 2228 324 Z" />
    <rect x="2290" y="240" width="14" height="20" rx="1" /><rect x="2318" y="240" width="14" height="20" rx="1" /><rect x="2346" y="240" width="14" height="20" rx="1" /><rect x="2374" y="240" width="14" height="20" rx="1" /><rect x="2290" y="272" width="14" height="20" rx="1" /><rect x="2318" y="272" width="14" height="20" rx="1" /><rect x="2346" y="272" width="14" height="20" rx="1" /><rect x="2374" y="272" width="14" height="20" rx="1" /><rect x="2290" y="304" width="14" height="20" rx="1" /><rect x="2318" y="304" width="14" height="20" rx="1" /><rect x="2346" y="304" width="14" height="20" rx="1" /><rect x="2374" y="304" width="14" height="20" rx="1" />
  </g>

  <g className="sky-fore-lines">
    <path d="M 1200 100 L 1200 180" />
    <path d="M 1200 100 C 1180 115, 1155 140, 1145 180" />
    <path d="M 1200 100 C 1220 115, 1245 140, 1255 180" />
    <path d="M 1200 100 C 1190 115, 1178 140, 1172 180" />
    <path d="M 1200 100 C 1210 115, 1222 140, 1228 180" />
  </g>

  
  <rect x="0" y="348" width="2400" height="12" className="sky-ground-line" />
</svg>
    </div>
  );
}
