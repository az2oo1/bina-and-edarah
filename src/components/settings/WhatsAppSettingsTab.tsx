import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { Mail, Info } from 'lucide-react';
import { 
  IgIcon, XIcon, FbIcon, LiIcon, YtIcon, TkIcon, SnapIcon 
} from '../SocialIcons';

interface WhatsAppSettingsTabProps {
  t: (key: string) => string;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  callingNumber: string;
  setCallingNumber: (val: string) => void;
  whatsappMessage: string;
  setWhatsappMessage: (val: string) => void;
  socialEmail: string;
  setSocialEmail: (val: string) => void;
  instagramUrl: string;
  setInstagramUrl: (val: string) => void;
  twitterUrl: string;
  setTwitterUrl: (val: string) => void;
  facebookUrl: string;
  setFacebookUrl: (val: string) => void;
  linkedinUrl: string;
  setLinkedinUrl: (val: string) => void;
  youtubeUrl: string;
  setYoutubeUrl: (val: string) => void;
  tiktokUrl: string;
  setTiktokUrl: (val: string) => void;
  snapchatUrl: string;
  setSnapchatUrl: (val: string) => void;
  addressAr: string;
  setAddressAr: (val: string) => void;
  addressEn: string;
  setAddressEn: (val: string) => void;
  addressMapLink: string;
  setAddressMapLink: (val: string) => void;
}

export const WhatsAppSettingsTab: React.FC<WhatsAppSettingsTabProps> = ({
  t,
  whatsappNumber,
  setWhatsappNumber,
  callingNumber,
  setCallingNumber,
  whatsappMessage,
  setWhatsappMessage,
  socialEmail,
  setSocialEmail,
  instagramUrl,
  setInstagramUrl,
  twitterUrl,
  setTwitterUrl,
  facebookUrl,
  setFacebookUrl,
  linkedinUrl,
  setLinkedinUrl,
  youtubeUrl,
  setYoutubeUrl,
  tiktokUrl,
  setTiktokUrl,
  snapchatUrl,
  setSnapchatUrl,
  addressAr,
  setAddressAr,
  addressEn,
  setAddressEn,
  addressMapLink,
  setAddressMapLink,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
        {language === 'ar' ? 'إعدادات الواتساب والتواصل والموقع' : 'WhatsApp, Social & Location Settings'}
      </h3>
      
      {/* WhatsApp Fields Group */}
      <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          {language === 'ar' ? 'أرقام التواصل والرسائل' : 'Contact Numbers & Templates'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="cn-label">{t('admin.placeholder.whatsapp')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <input
                required
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="cn-input font-mono pl-12 pr-4 h-11 bg-background transition-all"
                placeholder="966500000000"
                dir="ltr"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="cn-label">{language === 'ar' ? 'رقم الاتصال المباشر' : 'Direct Calling Number'}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <input
                required
                type="text"
                value={callingNumber}
                onChange={(e) => setCallingNumber(e.target.value)}
                className="cn-input font-mono pl-12 pr-4 h-11 bg-background transition-all"
                placeholder="966500000000"
                dir="ltr"
              />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="cn-label">{language === 'ar' ? 'نص رسالة الواتساب الافتراضي' : 'Default WhatsApp Message'}</label>
          <textarea
            required
            rows={3}
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            className="cn-input resize-none min-h-[90px] font-medium"
            placeholder={language === 'ar' ? 'مرحباً، أنا مهتم بهذا العقار: {title} - {link}' : 'Hello, I am interested in this property: {title} - {link}'}
          />
          <div className="mt-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/50">
            <p className="font-bold flex items-center gap-1.5 mb-1.5 text-foreground">
              <Info className="w-3.5 h-3.5 text-primary" />
              {language === 'ar' ? 'المتغيرات المدعومة:' : 'Supported Variables:'}
            </p>
            <div className="flex gap-2 font-mono text-[10px]">
              <span className="text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{'{title}'}</span>
              <span className="text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{'{link}'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Networks Group */}
      <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
        <div>
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            {language === 'ar' ? 'وسائل التواصل الاجتماعي والبريد الإلكتروني' : 'Social Media & Email'}
          </h4>
          <p className="text-[11px] text-muted-foreground mt-1">
            {language === 'ar' ? 'ستظهر الخانات المعبأة فقط على الصفحة الرئيسية.' : 'Only filled fields will appear on the home page.'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: language === 'ar' ? 'البريد الإلكتروني' : 'Email Address', value: socialEmail, setter: setSocialEmail, placeholder: 'info@benaa-edara.com', type: 'email', icon: <Mail className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'Instagram', value: instagramUrl, setter: setInstagramUrl, placeholder: 'https://instagram.com/benaandedara', type: 'url', icon: <IgIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'Twitter / X', value: twitterUrl, setter: setTwitterUrl, placeholder: 'https://x.com/benaandedara', type: 'url', icon: <XIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'Facebook', value: facebookUrl, setter: setFacebookUrl, placeholder: 'https://facebook.com/benaandedara', type: 'url', icon: <FbIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'LinkedIn', value: linkedinUrl, setter: setLinkedinUrl, placeholder: 'https://linkedin.com/company/benaandedara', type: 'url', icon: <LiIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'YouTube', value: youtubeUrl, setter: setYoutubeUrl, placeholder: 'https://youtube.com/@benaandedara', type: 'url', icon: <YtIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'TikTok', value: tiktokUrl, setter: setTiktokUrl, placeholder: 'https://tiktok.com/@benaandedara', type: 'url', icon: <TkIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
            { label: 'Snapchat', value: snapchatUrl, setter: setSnapchatUrl, placeholder: 'https://snapchat.com/add/benaandedara', type: 'url', icon: <SnapIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
          ].map(field => (
            <div key={field.label} className="space-y-1.5">
              <label className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                {field.icon} <span>{field.label}</span>
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={e => field.setter(e.target.value)}
                className="cn-input text-xs h-10 bg-background"
                placeholder={field.placeholder}
                dir="ltr"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Headquarters Location Group */}
      <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          {language === 'ar' ? 'مقر الشركة وعنوانها' : 'Company HQ & Address'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-muted-foreground">
              {language === 'ar' ? 'العنوان (بالعربية)' : 'Address (Arabic)'}
            </label>
            <input
              type="text"
              value={addressAr}
              onChange={e => setAddressAr(e.target.value)}
              className="cn-input text-xs h-10 bg-background"
              placeholder={language === 'ar' ? 'المملكة العربية السعودية، الرياض، طريق الملك عبد العزيز...' : 'Saudi Arabia, Riyadh, King Abdul Aziz Road...'}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-muted-foreground">
              {language === 'ar' ? 'العنوان (بالإنجليزي)' : 'Address (English)'}
            </label>
            <input
              type="text"
              value={addressEn}
              onChange={e => setAddressEn(e.target.value)}
              className="cn-input text-xs h-10 bg-background"
              placeholder="King Abdul Aziz Road, Al Yasmin district, Riyadh..."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-muted-foreground">
            {language === 'ar' ? 'رابط خريطة جوجل' : 'Google Maps Location Link'}
          </label>
          <input
            type="text"
            value={addressMapLink}
            onChange={e => setAddressMapLink(e.target.value)}
            className="cn-input text-xs h-10 bg-background"
            placeholder="https://maps.google.com/?q=..."
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
};
