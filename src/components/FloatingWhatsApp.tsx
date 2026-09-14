import React from 'react';
import { motion } from 'motion/react';
import { WaIcon } from './SocialIcons';
import { useLanguage } from '../LanguageContext';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export function FloatingWhatsApp({ phoneNumber = '966556467063' }: FloatingWhatsAppProps) {
  const { language } = useLanguage();
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const isArabic = language === 'ar';

  return (
    <motion.aside
      aria-label={isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-40 flex items-center"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <a
        href={`https://wa.me/${cleanNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isArabic ? 'تواصل معنا عبر واتساب' : 'Contact us on WhatsApp'}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 select-none"
      >
        {/* Soft pulse effect */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none -z-10 group-hover:opacity-0"
          aria-hidden="true"
        />

        {/* Official WhatsApp SVG Icon */}
        <span className="flex-shrink-0 flex items-center justify-center">
          <WaIcon className="w-6 h-6 fill-current" />
        </span>

        {/* Text */}
        <span className="text-sm font-bold tracking-wide leading-none whitespace-nowrap drop-shadow-sm">
          {isArabic ? 'تواصل معنا' : 'Chat with us'}
        </span>
      </a>
    </motion.aside>
  );
}
