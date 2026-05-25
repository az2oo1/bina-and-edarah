import React from 'react';

export function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path d="M 1,93 Q 50,78 99,93 Q 50,86 1,93 Z" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="5" strokeLinejoin="miter" strokeLinecap="butt" fill="none">
        {/* Left Building */}
        <path d="M 20,86.5 V 33 L 34,23 V 84" />
        
        {/* Middle Building */}
        <path d="M 41,83 V 19 L 57,7 L 66,23 V 80" />
        
        {/* Right Building */}
        <path d="M 73,79 V 36 L 86,48 V 82" />
      </g>
    </svg>
  );
}

