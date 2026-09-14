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
        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white border border-transparent transition-all duration-150 ease-out cursor-pointer select-none shadow-none active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
      >
        {/* Official WhatsApp SVG Icon */}
        <span className="flex-shrink-0 flex items-center justify-center">
          <WaIcon className="w-5 h-5 fill-current" />
        </span>

        {/* Text */}
        <span className="font-semibold leading-none whitespace-nowrap">
          {isArabic ? 'تواصل معنا' : 'Chat with us'}
        </span>
      </a>
    </motion.aside>
  );
}
