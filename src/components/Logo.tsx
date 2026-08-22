import React from 'react';
import { LOGO_SVG } from '../lib/logo';

interface LogoProps {
  className?: string;
  logoUrl?: string | null;
  theme?: 'light' | 'dark';
  variant?: 'icon' | 'full';
}

export function Logo({ className = "w-12 h-12", logoUrl, theme = 'light', variant = 'full' }: LogoProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="بناء وإدارة | Benaa & Edara"
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  if (variant === 'full') {
    const imgSrc = theme === 'dark' ? '/logo-full-white.png' : '/logo-full-brand.png';
    return (
      <img
        src={imgSrc}
        alt="بناء وإدارة | Bina & Edara"
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // Brand SVG (currentColor) — fills container and follows text color
  return (
    <span
      className={`${className} [&>svg]:w-full [&>svg]:h-full`}
      dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
    />
  );
}
