import React from 'react';

interface CitySkylineGraphicProps {
  className?: string;
}

export function CitySkylineGraphic({ className = "w-full max-w-2xl mx-auto h-20 text-muted-foreground/35 dark:text-muted-foreground/25" }: CitySkylineGraphicProps) {
  return (
    <div className={`relative flex items-end justify-center select-none pointer-events-none overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 800 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Subtle ground baseline */}
        <line x1="10" y1="118" x2="790" y2="118" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.6" />

        {/* Far Background silhouette layer */}
        <g opacity="0.45" fill="currentColor">
          {/* Back building left */}
          <rect x="140" y="55" width="48" height="63" rx="2" />
          <rect x="235" y="40" width="42" height="78" rx="2" />
          {/* Back center high tower */}
          <rect x="365" y="25" width="70" height="93" rx="3" />
          <line x1="400" y1="8" x2="400" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Back right buildings */}
          <rect x="520" y="48" width="45" height="70" rx="2" />
          <rect x="615" y="58" width="40" height="60" rx="2" />
        </g>

        {/* Foreground detailed clean architectural buildings */}
        <g stroke="currentColor" strokeWidth="1.6" fill="var(--color-card, #ffffff)" opacity="0.85" className="dark:fill-slate-900">
          {/* Left building group */}
          <rect x="90" y="72" width="38" height="46" rx="2" />
          <line x1="90" y1="85" x2="128" y2="85" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="90" y1="98" x2="128" y2="98" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* Stepped mid-left tower */}
          <rect x="175" y="46" width="46" height="72" rx="2" />
          {/* Windows */}
          <line x1="184" y1="56" x2="184" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <line x1="198" y1="56" x2="198" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <line x1="212" y1="56" x2="212" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

          {/* Slanted/Angled Modern Tower */}
          <path d="M 270 118 L 270 38 L 316 26 L 316 118 Z" />
          <line x1="285" y1="46" x2="285" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <line x1="301" y1="43" x2="301" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

          {/* Centerpiece High-Rise Modern Building */}
          <rect x="340" y="32" width="56" height="86" rx="3" />
          <rect x="352" y="16" width="32" height="16" rx="1" />
          <line x1="368" y1="2" x2="368" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Glass Grid */}
          <line x1="340" y1="50" x2="396" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="340" y1="68" x2="396" y2="68" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="340" y1="86" x2="396" y2="86" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="340" y1="104" x2="396" y2="104" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="368" y1="32" x2="368" y2="118" stroke="currentColor" strokeWidth="1" opacity="0.6" />

          {/* Twin Spire Tower */}
          <rect x="420" y="36" width="50" height="82" rx="2" />
          <line x1="435" y1="18" x2="435" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="455" y1="18" x2="455" y2="36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="432" y1="48" x2="432" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <line x1="445" y1="48" x2="445" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <line x1="458" y1="48" x2="458" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

          {/* Geometric Right Tower */}
          <path d="M 495 118 L 495 28 L 542 42 L 542 118 Z" />
          <line x1="510" y1="44" x2="510" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <line x1="527" y1="48" x2="527" y2="108" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

          {/* Mid-right townhouse block */}
          <rect x="568" y="52" width="42" height="66" rx="2" />
          <line x1="568" y1="72" x2="610" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <line x1="568" y1="92" x2="610" y2="92" stroke="currentColor" strokeWidth="1" opacity="0.7" />

          {/* Far right residential block */}
          <rect x="635" y="68" width="44" height="50" rx="2" />
          <line x1="646" y1="78" x2="646" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          <line x1="660" y1="78" x2="660" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          <line x1="672" y1="78" x2="672" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        </g>

        {/* Small subtle landscaping accents */}
        <circle cx="134" cy="116" r="3.5" fill="currentColor" opacity="0.5" />
        <circle cx="230" cy="116" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="488" cy="116" r="3.5" fill="currentColor" opacity="0.5" />
        <circle cx="628" cy="116" r="4" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}
