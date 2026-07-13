import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function PrivacyConsent() {
  const { language } = useLanguage();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('benaa-privacy-consent-accepted');
    if (!consent) {
      // Small delay of 1 second for a smooth initial entry
      const timer = setTimeout(() => {
        setShow(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('benaa-privacy-consent-accepted', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 w-[calc(100%-2rem)] max-w-sm md:max-w-md z-50 bg-card/95 backdrop-blur-md border border-border rounded-2xl p-5 shadow-2xl flex flex-col gap-4"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header & Icon */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl flex-shrink-0">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 text-right rtl:text-right ltr:text-left">
              <h4 className="text-sm font-bold text-foreground leading-snug">
                {language === 'ar' 
                  ? 'خصوصية البيانات وحمايتها' 
                  : 'Data Privacy & Protection'}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/90 font-medium">
                {language === 'ar'
                  ? 'قد نقوم بمعالجة بياناتك الشخصية والبيانات المتعلقة بتصفحك للموقع وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية ولأغراض التواصل، التحليلات، وتحسين الخدمة. يرجى عدم إرسال بيانات حساسة إلا عند الضرورة.'
                  : 'We may process your personal data and browsing-related data in accordance with the Saudi Personal Data Protection Law for communication, analytics, and service improvement purposes. Please do not submit sensitive data unless necessary.'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAgree}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-md transition-colors text-center"
            >
              {language === 'ar' ? 'موافق وقبول' : 'Agree & Accept'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
