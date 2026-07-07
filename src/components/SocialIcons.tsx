import React from 'react';
import { Mail } from 'lucide-react';

// Inline SVG icons for platforms not in lucide-react
export const IgIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export const XIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const FbIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const LiIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const YtIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const TkIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
  </svg>
);

export const WaIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const SnapIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.123 15.932c-.082-.047-.367-.179-.588-.282a5.556 5.556 0 0 1-.734-.41c-.426-.296-.704-.775-.704-1.282 0-.063.004-.124.013-.184l.035-.224a.5.5 0 0 0-.06-.395.498.498 0 0 0-.319-.228 11.238 11.238 0 0 1-1.365-.487c-.8-.352-1.285-.86-1.503-1.464-.176-.49-.126-1.05.138-1.58.269-.538.74-1.02 1.328-1.36.082-.047.21-.115.371-.2.162-.086.29-.153.37-.197.309-.176.525-.364.66-.582.135-.218.203-.49.203-.807a1.698 1.698 0 0 0-.372-1.077c-.504-.632-1.423-1.016-2.505-1.016s-2.001.384-2.505 1.016a1.698 1.698 0 0 0-.372 1.077c0 .317.068.589.203.807.135.218.351.406.66.582.08.044.208.111.37.197.161.085.289.153.371.2.588.34 1.059.822 1.328 1.36.264.53.314 1.09.138 1.58-.218.604-.703 1.112-1.503 1.464a11.238 11.238 0 0 1-1.365.487.498 0 0 0-.319.228.5.5 0 0 0-.06.395l.035.224c.009.06.013.121.013.184 0 .507-.278.986-.704 1.282-.26.18-.544.331-.734.41-.221.103-.506.235-.588.282-.361.206-.48.513-.342.868.14.364.444.606.842.673.19.032.392.052.597.059.183.007.366.007.55-.007.41-.031.782-.051.842-.673.138-.355.019-.662-.342-.868z" />
  </svg>
);

export const MailIcon = ({ className = 'w-5 h-5' }) => (
  <Mail className={className} />
);

// ---- Social icon row used in Footer and Home ----
export interface SocialLinks {
  whatsappNumber?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  snapchatUrl?: string;
  email?: string;
}

interface SocialIconsRowProps {
  links: SocialLinks;
  size?: 'sm' | 'md';
}

export function SocialIconsRow({ links, size = 'md' }: SocialIconsRowProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnBase = size === 'sm'
    ? 'w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5'
    : 'w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 shadow-md';

  const items = [
    links.whatsappNumber && {
      href: `https://wa.me/${links.whatsappNumber.replace(/\+/g, '')}`,
      icon: <WaIcon className={iconSize} />,
      style: { backgroundColor: '#25D366' },
      label: 'WhatsApp',
    },
    links.instagramUrl && {
      href: links.instagramUrl,
      icon: <IgIcon className={iconSize} />,
      style: { background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
      label: 'Instagram',
    },
    links.twitterUrl && {
      href: links.twitterUrl,
      icon: <XIcon className={iconSize} />,
      style: { backgroundColor: '#000' },
      label: 'X',
    },
    links.facebookUrl && {
      href: links.facebookUrl,
      icon: <FbIcon className={iconSize} />,
      style: { backgroundColor: '#1877F2' },
      label: 'Facebook',
    },
    links.linkedinUrl && {
      href: links.linkedinUrl,
      icon: <LiIcon className={iconSize} />,
      style: { backgroundColor: '#0A66C2' },
      label: 'LinkedIn',
    },
    links.youtubeUrl && {
      href: links.youtubeUrl,
      icon: <YtIcon className={iconSize} />,
      style: { backgroundColor: '#FF0000' },
      label: 'YouTube',
    },
    links.tiktokUrl && {
      href: links.tiktokUrl,
      icon: <TkIcon className={iconSize} />,
      style: { backgroundColor: '#010101' },
      label: 'TikTok',
    },
    links.snapchatUrl && {
      href: links.snapchatUrl,
      icon: <SnapIcon className={iconSize} />,
      style: { backgroundColor: '#FFFC00', color: '#000' },
      label: 'Snapchat',
    },
    links.email && {
      href: `mailto:${links.email}`,
      icon: <MailIcon className={iconSize} />,
      style: { backgroundColor: '#2C4A5E' },
      label: 'Email',
    },
  ].filter(Boolean) as { href: string; icon: React.ReactNode; style: React.CSSProperties; label: string }[];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map(item => (
        <a
          key={item.label}
          href={item.href}
          target={item.href.startsWith('mailto') ? undefined : '_blank'}
          rel="noopener noreferrer"
          title={item.label}
          className={`${btnBase} text-white`}
          style={item.style}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
