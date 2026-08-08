import React, { useState } from 'react';
import { useLanguage } from '../../LanguageContext';
import { Info, Eye, EyeOff, ShieldCheck, Send, CheckCircle2, AlertCircle, Loader2, Smartphone, MessageSquare, Zap } from 'lucide-react';
import { useDialog } from '../../context/DialogContext';

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
  // Authentica Settings
  authenticaEnabled?: boolean;
  setAuthenticaEnabled?: (val: boolean) => void;
  authenticaApiKey?: string;
  setAuthenticaApiKey?: (val: string) => void;
  showAuthenticaApiKey?: boolean;
  setShowAuthenticaApiKey?: (val: boolean) => void;
  authenticaMethod?: string;
  setAuthenticaMethod?: (val: string) => void;
  authenticaTemplateId?: string;
  setAuthenticaTemplateId?: (val: string) => void;
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
  authenticaEnabled = true,
  setAuthenticaEnabled,
  authenticaApiKey = "$2y$10$qtRuMVdslBE8aQDUvWoiJuPYCRYt/mw95knxkg5d9WfnfYcZrKrSG",
  setAuthenticaApiKey,
  showAuthenticaApiKey = false,
  setShowAuthenticaApiKey,
  authenticaMethod = "sms",
  setAuthenticaMethod,
  authenticaTemplateId = "",
  setAuthenticaTemplateId,
}) => {
  const { language } = useLanguage();
  const { showAlert } = useDialog();

  const [testPhone, setTestPhone] = useState('');
  const [testingAuthentica, setTestingAuthentica] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; otp?: string } | null>(null);

  const handleTestAuthentica = async () => {
    if (!testPhone.trim()) {
      await showAlert(language === 'ar' ? 'الرجاء إدخال رقم الجوال لتجربة الإرسال' : 'Please enter a test phone number');
      return;
    }

    setTestingAuthentica(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/authentica/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testPhone.trim(),
          method: authenticaMethod,
          apiKey: authenticaApiKey,
          templateId: authenticaTemplateId || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || (language === 'ar' ? 'تم إرسال رمز التحقق بنجاح!' : 'OTP sent successfully!'),
          otp: data.otp
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || (language === 'ar' ? 'فشل الإرسال عبر مزود Authentica' : 'Failed to send via Authentica')
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || (language === 'ar' ? 'حدث خطأ أثناء الاتصال' : 'Connection error')
      });
    } finally {
      setTestingAuthentica(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-black text-foreground flex items-center gap-2">
            <span>{language === 'ar' ? 'إعدادات تسجيل المستأجرين ورمز التحقق (OTP)' : 'Renter Login & OTP Settings'}</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {language === 'ar' 
              ? 'إدارة بوابات إرسال الرسائل النصية القصيرة ورموز الدخول والواتساب' 
              : 'Manage SMS, WhatsApp OTP gateways and webhook delivery'}
          </p>
        </div>
      </div>
      
      {/* 🇸🇦 Authentica Gateway Integration Block (Featured Primary Gateway) */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 rounded-3xl space-y-5 border-2 border-emerald-500/30 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 end-0 bg-emerald-500 text-white text-[10px] font-black px-4 py-1 rounded-es-2xl shadow-xs flex items-center gap-1.5 uppercase tracking-wider">
          <Zap className="w-3 h-3 fill-current" />
          <span>{language === 'ar' ? 'البوابة الرسمية المعتمدة' : 'Official Primary Gateway'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-sm">
                🇸🇦
              </div>
              <div>
                <h4 className="font-black text-sm text-foreground flex items-center gap-2">
                  <span>Authentica.sa Gateway (أوثنتيكا)</span>
                  <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {language === 'ar' ? 'بوابة سعودية مرخصة' : 'Licensed Saudi SMS/OTP'}
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' 
                    ? 'إرسال رموز التحقق OTP فورياً عبر الرسائل النصية القصيرة (SMS) أو الواتساب برقم معتمد وموثق' 
                    : 'Instant OTP delivery via SMS or WhatsApp with verified sender'}
                </p>
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              checked={authenticaEnabled} 
              onChange={(e) => setAuthenticaEnabled?.(e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-emerald-600"></div>
          </label>
        </div>
        
        {authenticaEnabled && (
          <div className="space-y-5 pt-3 border-t border-emerald-500/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* API Key */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Authentica API Key (مفتاح API الخاص بأوثنتيكا)</span>
                    <span className="text-emerald-600 font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      X-Authorization
                    </span>
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {authenticaApiKey ? '✓ مفتاح نشط ومتصل' : 'يرجى إدخال المفتاح'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showAuthenticaApiKey ? "text" : "password"}
                    value={authenticaApiKey}
                    onChange={(e) => setAuthenticaApiKey?.(e.target.value)}
                    className="w-full bg-background border border-emerald-500/40 rounded-xl px-3.5 py-2.5 font-mono text-xs text-foreground focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all pe-10"
                    placeholder="$2y$10$qtRuMVdslBE8aQDUvWoiJuPYCRYt/mw95knxkg5d9WfnfYcZrKrSG"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthenticaApiKey?.(!showAuthenticaApiKey)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    {showAuthenticaApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Delivery Channel Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {language === 'ar' ? 'قناة الإرسال الأساسية (Delivery Channel)' : 'Primary Delivery Channel'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthenticaMethod?.('sms')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authenticaMethod === 'sms'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-background hover:bg-muted text-foreground border-border'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{language === 'ar' ? 'رسائل SMS نصية' : 'SMS Message'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthenticaMethod?.('whatsapp')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authenticaMethod === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-background hover:bg-muted text-foreground border-border'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{language === 'ar' ? 'واتساب WhatsApp' : 'WhatsApp'}</span>
                  </button>
                </div>
              </div>

              {/* Optional Template ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  {language === 'ar' ? 'رقم القالب Template ID (اختياري)' : 'Template ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={authenticaTemplateId}
                  onChange={(e) => setAuthenticaTemplateId?.(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 font-mono text-xs text-foreground focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder={language === 'ar' ? 'اتركه فارغاً للاعتماد على القالب الافتراضي' : 'e.g. 31 or leave empty for default'}
                />
              </div>
            </div>

            {/* Interactive Live Testing Tool for Authentica */}
            <div className="bg-background/90 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-black text-foreground flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'ar' ? 'اختبار إرسال رمز OTP تجريبي عبر Authentica' : 'Test Authentica OTP Dispatch'}</span>
                </h5>
                <span className="text-[11px] text-muted-foreground">
                  {language === 'ar' ? 'إرسال رسالة حقيقية لرقم جوالك' : 'Real-time test delivery'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="flex-1 bg-muted/20 border border-border rounded-xl px-3.5 py-2 text-xs font-mono dir-ltr text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-emerald-500"
                  placeholder="05XXXXXXXX or +9665XXXXXXXX"
                />
                <button
                  type="button"
                  onClick={handleTestAuthentica}
                  disabled={testingAuthentica}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {testingAuthentica ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{language === 'ar' ? 'إرسال رمز تجريبي الآن' : 'Send Test OTP'}</span>
                </button>
              </div>

              {testResult && (
                <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                  testResult.success 
                    ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' 
                    : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-bold">{testResult.message}</p>
                    {testResult.otp && (
                      <p className="font-mono text-[11px]">
                        {language === 'ar' ? `رمز التحقق المولد: ` : `Generated Code: `}
                        <strong className="bg-background px-1.5 py-0.5 rounded border border-emerald-500/30 text-emerald-600">{testResult.otp}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* VerifyKit Integration Block */}
      <div className="bg-muted/10 p-5 rounded-3xl space-y-4 border border-border/50">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
            <span>VerifyKit Integration (بوابة بديلة - Fallback Gateway)</span>
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
          <div className="pt-2 border-t border-border/40">
            <div className="space-y-1.5 max-w-md">
              <label className="cn-label">App Key / API Key (X-VKit-App-Key)</label>
              <input
                type="text"
                value={verifyKitAppKey}
                onChange={(e) => setVerifyKitAppKey(e.target.value)}
                className="cn-input font-mono text-xs h-10 dir-ltr bg-background"
                placeholder="AxaVaO8JfW2OMj"
              />
            </div>
          </div>
        )}
      </div>

      {/* Webhook & Custom Payload Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 bg-muted/10 p-5 rounded-3xl flex flex-col justify-between border border-border/50">
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">
              {language === 'ar' ? 'إعدادات الويب هوك والقالب (Webhook & Whatomate)' : 'Webhook & Template Settings'}
            </h4>
            
            <div className="space-y-1.5">
              <label className="cn-label">
                {language === 'ar' ? 'رابط الويب هوك (Whatomate / Make URL)' : 'Webhook URL (Whatomate / Make)'}
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

        <div className="space-y-1.5 bg-muted/10 p-5 rounded-3xl flex flex-col justify-between border border-border/50">
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
