import React from 'react';
import { LOGO_SVG } from '../lib/logo';

interface LogoProps {
  className?: string;
  logoUrl?: string | null;
}

export function Logo({ className = "w-12 h-12", logoUrl }: LogoProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Logo"
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // Brand SVG (currentColor) — fills its container and follows the text color,
  // so it can be tinted (e.g. white in dark mode) via a text-color utility class.
  return (
    <span
      className={`${className} [&>svg]:w-full [&>svg]:h-full`}
      dangerouslySetInnerHTML={{ __html: LOGO_SVG }}
    />
  );
}
