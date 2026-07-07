import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Phone, Mail, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useDialog } from '../context/DialogContext';

export default function Contact() {
  const { t, language } = useLanguage();
  const { showAlert } = useDialog();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/callback-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        await showAlert(language === 'ar' ? 'فشل إرسال الرسالة، يرجى المحاولة لاحقاً.' : 'Failed to send message, please try again.');
      }
    } catch(err) {
      await showAlert(language === 'ar' ? 'خطأ في الاتصال بالسيرفر.' : 'Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-foreground relative overflow-hidden font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 border border-amber-400/20 text-amber-400 mb-4 uppercase tracking-wider animate-pulse">
            📞 {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {language === 'ar' ? 'يسعدنا تواصلك الدائم معنا' : 'We are always glad to connect'}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            {language === 'ar' 
              ? 'لديك استفسار أو ترغب في زيارة أحد مشاريعنا؟ املأ النموذج وسيتصل بك أحد مستشارينا العقاريين فوراً.' 
              : 'Have a question or want to visit a project? Fill in the form and one of our consultants will contact you shortly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details & Info (5 columns) */}
          <div className="lg:col-span-5 space-y-8 pr-4 lg:pr-8 sm:rtl:pl-8 sm:rtl:pr-0">
            
            {/* Phone Info */}
            <div className="flex gap-4 pb-6 border-b border-border/40">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {language === 'ar' ? 'الاتصال المباشر' : 'Direct Call'}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {language === 'ar' ? 'تواصل معنا هاتفياً للاستفسارات السريعة:' : 'Call us directly for instant inquiries:'}
                </p>
                <a href={`tel:${(settings?.callingNumber || '920015314').replace(/\+/g, '').replace(/\s/g, '')}`} dir="ltr" className="text-sm font-semibold text-foreground hover:text-primary transition-colors inline-block">
                  {settings?.callingNumber ? (settings.callingNumber.startsWith('92') || settings.callingNumber.startsWith('+') ? settings.callingNumber : `+${settings.callingNumber}`) : '920015314'}
                </a>
              </div>
            </div>

            {/* Email Info */}
            <div className="flex gap-4 pb-6 border-b border-border/40">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {language === 'ar' ? 'أرسل لنا متطلباتك العقارية:' : 'Email your requirements to us:'}
                </p>
                <a href={`mailto:${settings?.email || 'rbmc@rbmc.sa'}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                  {settings?.email || 'rbmc@rbmc.sa'}
                </a>
              </div>
            </div>

            {/* WhatsApp Info */}
            <div className="flex gap-4 pb-6 border-b border-border/40">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {language === 'ar' ? 'الدردشة عبر الواتساب' : 'WhatsApp Support'}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {language === 'ar' ? 'متاحون على مدار الساعة لخدمتكم:' : 'Available 24/7 to assist you:'}
                </p>
                <a href={`https://wa.me/${(settings?.whatsappNumber || '966556467063').replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-sm font-semibold text-foreground hover:text-primary transition-colors inline-block">
                  +{settings?.whatsappNumber || '966556467063'}
                </a>
              </div>
            </div>

            {/* Address Info */}
            <div className="flex gap-4 pb-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {language === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}
                </h3>
                <a 
                  href={settings?.addressMapLink || 'https://www.google.com/maps/place/%D8%B4%D8%B1%D9%83%D8%A9+%D8%A8%D9%86%D8%A7%D8%A1+%D9%88%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A%D8%A9%E2%80%AD/@24.8712414,46.6578121,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2efd81973e3b15:0xd22a28ed75702190!8m2!3d24.8712414!4d46.660387!16s%2Fg%2F11llp6_lp0?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/addr block"
                >
                  <p className="text-xs text-muted-foreground leading-relaxed text-justify group-hover/addr:text-primary transition-colors cursor-pointer">
                    {language === 'ar' 
                      ? (settings?.addressAr || 'السعودية, الرياض, النرجس, عثمان بن عفان 13336') 
                      : (settings?.addressEn || 'Al Narjis, Othman Bin Affan, 13336, Riyadh, Saudi Arabia')}
                    <span className="text-[10px] text-primary/80 block mt-1 hover:underline">
                      {language === 'ar' ? 'عرض على الخريطة ↗' : 'View on map ↗'}
                    </span>
                  </p>
                </a>
              </div>
            </div>

          </div>
          {/* Contact Form (7 columns) */}
          <div className="lg:col-span-7">
            <div data-slot="card" data-size="default" className="cn-card group/card flex flex-col p-6 sm:p-8">
              
              {submitted ? (
                <div data-slot="empty" className="cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance p-6">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Message Sent Successfully!'}
                  </h2>
                  <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                    {language === 'ar' 
                      ? 'شكراً لتواصلك معنا. سيقوم أحد خبرائنا العقاريين بالتواصل معك خلال الساعات القادمة.' 
                      : 'Thank you for connecting. One of our property consultants will reach out to you shortly.'}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="cn-button cn-button-variant-default w-full max-w-xs"
                  >
                    {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ar' ? 'املأ النموذج وسيتصل بك أحد مستشارينا العقاريين فوراً.' : 'Fill in the form and one of our consultants will contact you shortly.'}
                    </p>
                  </div>

                  <div data-slot="field-group" className="cn-field-group">
                    
                    {/* Full Name */}
                    <div role="group" data-slot="field" className="cn-field">
                      <label data-slot="field-label" className="cn-label" htmlFor="name">
                        {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      </label>
                      <input 
                        id="name" 
                        data-slot="input" 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your name'}
                        className="cn-input" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Email */}
                      <div role="group" data-slot="field" className="cn-field">
                        <label data-slot="field-label" className="cn-label" htmlFor="email">
                          {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <input 
                          id="email" 
                          data-slot="input" 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="mail@example.com"
                          className="cn-input" 
                        />
                      </div>

                      {/* Phone */}
                      <div role="group" data-slot="field" className="cn-field">
                        <label data-slot="field-label" className="cn-label" htmlFor="phone">
                          {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                        </label>
                        <input 
                          id="phone" 
                          data-slot="input" 
                          type="tel" 
                          required 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9665xxxxxxxx"
                          className="cn-input" 
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div role="group" data-slot="field" className="cn-field">
                      <label data-slot="field-label" className="cn-label" htmlFor="message">
                        {language === 'ar' ? 'نص الرسالة' : 'Your Message'}
                      </label>
                      <textarea 
                        id="message" 
                        required 
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={language === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                        className="cn-input min-h-[100px] resize-none" 
                      ></textarea>
                    </div>

                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="cn-button cn-button-variant-default w-full flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (language === 'ar' ? 'إرسال الرسالة' : 'Send Message')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}