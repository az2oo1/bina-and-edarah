import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';

interface CustomDialogProps {
  isOpen: boolean;
  type: 'alert' | 'confirm';
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  language: 'ar' | 'en';
}

export function CustomDialog({
  isOpen,
  type,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  language
}: CustomDialogProps) {
  if (!isOpen) return null;

  const defaultTitle = title || (
    type === 'confirm' 
      ? (language === 'ar' ? 'تأكيد الإجراء' : 'Confirm Action')
      : (language === 'ar' ? 'تنبيه' : 'Notification')
  );

  const defaultConfirm = confirmText || (language === 'ar' ? 'موافق' : 'OK');
  const defaultCancel = cancelText || (language === 'ar' ? 'إلغاء' : 'Cancel');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl flex-shrink-0 ${
              type === 'confirm' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
            }`}>
              {type === 'confirm' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-foreground leading-6">
                {defaultTitle}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-2 mt-6">
            {type === 'confirm' && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {defaultCancel}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {defaultConfirm}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
