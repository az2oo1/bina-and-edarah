import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

interface EmailSettingsTabProps {
  smtpHost: string;
  setSmtpHost: (val: string) => void;
  smtpPort: string;
  setSmtpPort: (val: string) => void;
  smtpFrom: string;
  setSmtpFrom: (val: string) => void;
  smtpUser: string;
  setSmtpUser: (val: string) => void;
  smtpPass: string;
  setSmtpPass: (val: string) => void;
  showSmtpPass: boolean;
  setShowSmtpPass: (val: boolean) => void;
  imapHost: string;
  setImapHost: (val: string) => void;
  imapPort: string;
  setImapPort: (val: string) => void;
}

export const EmailSettingsTab: React.FC<EmailSettingsTabProps> = ({
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  smtpFrom,
  setSmtpFrom,
  smtpUser,
  setSmtpUser,
  smtpPass,
  setSmtpPass,
  showSmtpPass,
  setShowSmtpPass,
  imapHost,
  setImapHost,
  imapPort,
  setImapPort,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
        {language === 'ar' ? 'إعدادات البريد الإلكتروني للطلبات' : 'Callback Notification Email Settings'}
      </h3>
      
      {/* SMTP Config Group */}
      <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
        <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
          {language === 'ar' ? 'إعدادات خادم SMTP' : 'SMTP Server Settings'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'خادم SMTP (Host)' : 'SMTP Host'}</label>
            <input
              type="text"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              className="cn-input font-mono text-xs bg-background"
              placeholder="smtp.gmail.com"
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'منفذ SMTP (Port)' : 'SMTP Port'}</label>
            <input
              type="number"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
              className="cn-input font-mono text-xs bg-background"
              placeholder="587"
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'بريد المرسل (From)' : 'Sender Email (From)'}</label>
            <input
              type="email"
              value={smtpFrom}
              onChange={(e) => setSmtpFrom(e.target.value)}
              className="cn-input font-mono text-xs bg-background"
              placeholder="no-reply@yourdomain.com"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'اسم المستخدم (User)' : 'SMTP Username'}</label>
            <input
              type="text"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              className="cn-input font-mono text-xs bg-background"
              placeholder="user@example.com"
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'كلمة المرور (Password)' : 'SMTP Password'}</label>
            <div className="relative">
              <input
                type={showSmtpPass ? 'text' : 'password'}
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="cn-input font-mono text-xs bg-background pe-10"
                placeholder="••••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowSmtpPass(!showSmtpPass)}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMAP Config Group */}
      <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
        <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
          {language === 'ar' ? 'إعدادات خادم البريد الوارد IMAP (لاستلام الردود)' : 'IMAP Inbound Mail Settings (For replies)'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'خادم IMAP (Host)' : 'IMAP Host'}</label>
            <input
              type="text"
              value={imapHost}
              onChange={(e) => setImapHost(e.target.value)}
              className="cn-input font-mono text-xs bg-background"
              placeholder="imap.gmail.com"
              dir="ltr"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'منفذ IMAP (Port)' : 'IMAP Port'}</label>
            <input
              type="number"
              value={imapPort}
              onChange={(e) => setImapPort(e.target.value)}
              className="cn-input font-mono text-xs bg-background"
              placeholder="993"
              dir="ltr"
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/55 leading-relaxed">
          {language === 'ar' 
            ? 'سيتم استخدام اسم المستخدم وكلمة المرور الخاصة بخادم SMTP تلقائياً لتسجيل الدخول إلى خادم IMAP.' 
            : 'The SMTP Username and Password will be automatically used to authenticate with the IMAP server.'}
        </p>
      </div>
    </div>
  );
};
