import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { Info, Eye, EyeOff } from 'lucide-react';

interface OtpSettingsTabProps {
  otpWebhookUrl: string;
  setOtpWebhookUrl: (val: string) => void;
  otpMessageTemplate: string;
  setOtpMessageTemplate: (val: string) => void;
  otpWebhookPayload: string;
  setOtpWebhookPayload: (val: string) => void;
  verifyKitEnabled: boolean;
  setVerifyKitEnabled: (val: boolean) => void;
  verifyKitAppKey: string;
  setVerifyKitAppKey: (val: string) => void;
  verifyKitServerKey: string;
  setVerifyKitServerKey: (val: string) => void;
  showVerifyKitServerKey: boolean;
  setShowVerifyKitServerKey: (val: boolean) => void;
}

export const OtpSettingsTab: React.FC<OtpSettingsTabProps> = ({
  otpWebhookUrl,
  setOtpWebhookUrl,
  otpMessageTemplate,
  setOtpMessageTemplate,
  otpWebhookPayload,
  setOtpWebhookPayload,
  verifyKitEnabled,
  setVerifyKitEnabled,
  verifyKitAppKey,
  setVerifyKitAppKey,
  verifyKitServerKey,
  setVerifyKitServerKey,
  showVerifyKitServerKey,
  setShowVerifyKitServerKey,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
        {language === 'ar' ? 'إعدادات تسجيل المستأجرين ورمز التحقق (OTP)' : 'Renter Login & OTP Settings'}
      </h3>
      
      {/* VerifyKit Integration Block */}
      <div className="bg-muted/10 p-5 rounded-2xl space-y-4 border border-border/50">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <span>VerifyKit Integration (SMS/WhatsApp OTP)</span>
          </h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={verifyKitEnabled} 
              onChange={(e) => setVerifyKitEnabled(e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
        
        {verifyKitEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
            <div className="space-y-1.5">
              <label className="cn-label">App Key (X-VKit-App-Key)</label>
              <input
                type="text"
                value={verifyKitAppKey}
                onChange={(e) => setVerifyKitAppKey(e.target.value)}
                className="cn-input font-mono text-xs h-10 dir-ltr bg-background"
                placeholder="AxaVaO8JfW2OMj"
              />
            </div>

            <div className="space-y-1.5">
              <label className="cn-label">Server Key (X-VKit-Server-Key)</label>
              <div className="relative">
                <input
                  type={showVerifyKitServerKey ? "text" : "password"}
                  value={verifyKitServerKey}
                  onChange={(e) => setVerifyKitServerKey(e.target.value)}
                  className="cn-input font-mono text-xs h-10 dir-ltr bg-background pe-10"
                  placeholder="Krfa4d5b5ad23e4551a8c200f72433cf..."
                />
                <button
                  type="button"
                  onClick={() => setShowVerifyKitServerKey(!showVerifyKitServerKey)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  {showVerifyKitServerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Split: Webhook & template left, Code editor right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 bg-muted/10 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
              {language === 'ar' ? 'إعدادات الويب هوك والقالب' : 'Webhook & Template Settings'}
            </h4>
            
            <div className="space-y-1.5">
              <label className="cn-label">
                {language === 'ar' ? 'رابط الويب هوك (Whatomate URL)' : 'Webhook URL (Whatomate)'}
              </label>
              <input
                type="url"
                value={otpWebhookUrl}
                onChange={(e) => setOtpWebhookUrl(e.target.value)}
                className="cn-input font-medium h-11 dir-ltr bg-background"
                placeholder="https://hook.us2.make.com/..."
              />
              <p className="text-[10px] text-muted-foreground leading-none">
                {language === 'ar' ? 'اتركه فارغاً لتعطيل إرسال الرسائل عبر الويب هوك.' : 'Leave empty to disable sending webhooks.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="cn-label">
                {language === 'ar' ? 'قالب رسالة رمز التحقق' : 'OTP Message Template'}
              </label>
              <textarea
                required
                rows={3}
                value={otpMessageTemplate}
                onChange={(e) => setOtpMessageTemplate(e.target.value)}
                className="cn-input resize-none min-h-[90px] font-medium bg-background"
                placeholder={language === 'ar' ? 'رمز التحقق الخاص بك هو: {otp}' : 'Your verification code is: {otp}'}
              />
            </div>
          </div>
          
          <div className="mt-4 text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/55">
            <p className="font-bold flex items-center gap-1.5 mb-1 text-foreground">
              <Info className="w-3.5 h-3.5 text-primary" />
              {language === 'ar' ? 'المتغيرات المدعومة في القالب:' : 'Supported Variables in Template:'}
            </p>
            <span className="font-mono text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 inline-block">{'{otp}'}</span>
          </div>
        </div>

        <div className="space-y-1.5 bg-muted/10 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
              {language === 'ar' ? 'قالب حزمة البيانات (JSON Payload)' : 'JSON Webhook Payload'}
            </h4>
            <textarea
              required
              rows={6}
              value={otpWebhookPayload}
              onChange={(e) => setOtpWebhookPayload(e.target.value)}
              className="w-full border border-border/80 rounded-2xl p-4 transition-all font-mono text-xs dir-ltr bg-zinc-950 text-emerald-400 focus:ring-2 focus:ring-primary focus:border-primary shadow-inner min-h-[160px]"
              placeholder={'{\n  "phone": "{phone}",\n  "type": "template"\n}'}
            />
          </div>
          <div className="mt-4 text-xs text-muted-foreground bg-muted/30 p-3.5 rounded-2xl border border-border/60">
            <p className="font-bold flex items-center gap-1.5 mb-2 text-foreground">
              <Info className="w-4 h-4 text-primary" />
              {language === 'ar' ? 'المتغيرات المدعومة في قالب JSON:' : 'Supported Variables in JSON:'}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-lg select-all cursor-pointer" title={language === 'ar' ? 'انقر للنسخ' : 'Click to copy'}>{'{phone}'}</span>
              <span className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-lg select-all cursor-pointer" title={language === 'ar' ? 'انقر للنسخ' : 'Click to copy'}>{'{otp}'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {language === 'ar' 
                ? 'يمكنك وضع صيغة JSON المطلوبة من Whatomate (مثلاً الرسائل القالبية WhatsApp Templates)، وسيتم استبدال المتغيرات قبل الإرسال.' 
                : 'You can define the exact JSON payload expected by Whatomate (e.g. WhatsApp Templates) and variables will be replaced before sending.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
