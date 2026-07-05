import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, MapPin, ArrowRight, ArrowLeft, BuildingIcon, KeySquare, Hammer, Headphones, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { SocialIconsRow } from '../components/SocialIcons';

const DEFAULT_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  service1: 'https://images.unsplash.com/photo-1541885088926-d68a98b04a8e?auto=format&fit=crop&w=800&q=80',
  service2: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  service3: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  service4: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80',
};

export type HomeImages = typeof DEFAULT_IMAGES;

interface SocialSettings {
  email?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  whatsappNumber?: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;
  const [images, setImages] = useState<HomeImages>(DEFAULT_IMAGES);
  const [social, setSocial] = useState<SocialSettings>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.homeImages) {
          try {
            const parsed = JSON.parse(data.homeImages);
            setImages(prev => ({ ...prev, ...parsed }));
          } catch (_) {}
        }
        setSocial({
          email: data.email,
          instagramUrl: data.instagramUrl,
          twitterUrl: data.twitterUrl,
          facebookUrl: data.facebookUrl,
          linkedinUrl: data.linkedinUrl,
          youtubeUrl: data.youtubeUrl,
          tiktokUrl: data.tiktokUrl,
          whatsappNumber: data.whatsappNumber,
        });
      })
      .catch(() => {});
  }, []);

  const services = [
    {
      id: 'development',
      icon: <Hammer className="w-8 h-8" />,
      titleAr: 'تطوير وتسويق عقاري',
      titleEn: 'Real Estate Development',
      descAr: 'نبتكر أساليب جديدة في التطوير و التسويق العقاري لنوفر لعملائنا مساحات استثنائية تجمع بين الفخامة والعملية، مع ضمان تحقيق أعلى معايير الجودة والاستدامة.',
      descEn: 'We innovate new methods in real estate development & marketing to provide exceptional spaces combining luxury and practicality, ensuring top quality and sustainability.',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      color: 'text-blue-600',
      image: images.service1,
    },
    {
      id: 'leasing',
      icon: <KeySquare className="w-8 h-8" />,
      titleAr: 'تأجير ومبيعات',
      titleEn: 'Leasing & Sales',
      descAr: 'نوفر باقة واسعة من العقارات المميزة في أرقى الأحياء السكنية والتجارية، مع فريق مبيعات محترف يضمن لك إتمام الصفقات بكل سلاسة وأمان.',
      descEn: 'We offer a wide range of premium properties in the best residential and commercial neighborhoods, with a professional sales team ensuring smooth and secure transactions.',
      bg: 'bg-yellow-50',
      border: 'border-yellow-100',
      color: 'text-yellow-600',
      image: images.service2,
    },
    {
      id: 'management',
      icon: <ShieldCheck className="w-8 h-8" />,
      titleAr: 'إدارة أملاك',
      titleEn: 'Property Management',
      descAr: 'خدمة إدارة متكاملة تهدف إلى تعظيم عوائد الاستثمار الخاص بك وحماية أصولك، عبر صيانة دورية، إدارة علاقات المستأجرين، وتحصيل الإيجارات.',
      descEn: 'An integrated management service aimed at maximizing your investment returns and protecting your assets through regular maintenance, tenant relations, and rent collection.',
      bg: 'bg-green-50',
      border: 'border-green-100',
      color: 'text-green-600',
      image: images.service3,
    },
    {
      id: 'consulting',
      icon: <BuildingIcon className="w-8 h-8" />,
      titleAr: 'استشارات عقارية',
      titleEn: 'Real Estate Consulting',
      descAr: 'نضع خبرتنا العميقة بين يديك لتقديم استشارات دقيقة وموثوقة مبنية على أحدث تحليلات السوق لمساعدتك في اتخاذ قرارات استثمارية مربحة.',
      descEn: 'We put our deep expertise in your hands to provide accurate and reliable consulting based on the latest market analysis to help you make profitable investment decisions.',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      color: 'text-indigo-600',
      image: images.service4,
    }
  ];

  return (
    <div className="flex flex-col w-full text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${images.hero}")` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
 
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl mb-4 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-2 max-w-xl mx-auto text-slate-200 text-sm sm:text-base leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/projects" className="btn-secondary h-10 px-5 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs">
              <span>{language === 'ar' ? 'مشاريع قمنا بتطويرها' : 'Projects We Developed'}</span>
              <Arrow className="w-4 h-4" />
            </Link>
            <Link to="/properties" className="btn-outline h-10 px-5 font-semibold text-xs border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-xs transition-all flex items-center justify-center">
              {language === 'ar' ? 'عقارات للبيع أو الإيجار' : 'Properties to Buy or Rent'}
            </Link>
          </div>
        </div>
      </section>

{/* Services Section */}
      <section className="py-20 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-2xl font-bold text-foreground sm:text-3xl tracking-tight">
               {language === 'ar' ? 'خدماتنا' : 'Our Services'}
             </h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} bg-white rounded-lg border border-border shadow-xs overflow-hidden group transition-all duration-300 hover:shadow-sm`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-2/5 h-48 lg:h-auto relative overflow-hidden hidden sm:block">
                  <img 
                    src={service.image} 
                    alt={language === 'ar' ? service.titleAr : service.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-3/5 p-6 md:p-10 flex flex-col justify-center">
                  <div className="w-10 h-10 rounded-md bg-slate-50 border border-border flex items-center justify-center mb-4 text-primary shadow-xs">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    {language === 'ar' ? service.descAr : service.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Features Section */}
      <section className="py-20 bg-slate-50/50 border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl tracking-tight">
              {language === 'ar' ? 'لماذا تختار بناء وإدارة؟' : 'Why Choose Benaa & Edara?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-border rounded-lg shadow-xs flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-border">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2 text-foreground">{language === 'ar' ? 'الثقة والأمان' : 'Trust & Security'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' ? 'نضمن لك معاملات عقارية آمنة وموثوقة، مع التزام تام بالشفافية في كل خطوة.' : 'We guarantee safe and reliable real estate transactions, with a total commitment to transparency.'}
              </p>
            </div>
            
            <div className="bg-white p-6 border border-border rounded-lg shadow-xs flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-border">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2 text-foreground">{language === 'ar' ? 'أفضل المواقع' : 'Prime Locations'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' ? 'نختار لك أفضل المواقع الاستراتيجية التي تضمن لك استثماراً ناجحاً ومستقبلاً واعداً.' : 'We curate the best strategic locations that guarantee a successful investment and a promising future.'}
              </p>
            </div>

            <div className="bg-white p-6 border border-border rounded-lg shadow-xs flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-border">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-2 text-foreground">{language === 'ar' ? 'إدارة متكاملة' : 'Integrated Management'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' ? 'إدارة أملاك احترافية تضمن لك راحة البال وتحقيق أعلى العوائد الاستثمارية.' : 'Professional property management for your peace of mind, ensuring maximum investment returns.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      {/* Social Media & Contact Section */}
      {/* Social Media & Contact Section */}
      {(social.email || social.instagramUrl || social.twitterUrl || social.facebookUrl || social.linkedinUrl || social.youtubeUrl || social.tiktokUrl || social.whatsappNumber) && (
        <section className="bg-primary text-white py-12 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              {language === 'ar' ? 'تواصل معنا' : 'Connect With Us'}
            </h2>
            <p className="text-slate-300 mb-8 text-xs">
              {language === 'ar' ? 'نحن هنا — تابعنا على وسائل التواصل الاجتماعي' : "We're here — follow us on social media"}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {social.whatsappNumber && (
                <a href={`https://wa.me/${social.whatsappNumber.replace(/\+/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba58] text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              )}
              {social.instagramUrl && (
                <a href={social.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs"
                  style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
              )}
              {social.twitterUrl && (
                <a href={social.twitterUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs border border-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X
                </a>
              )}
              {social.facebookUrl && (
                <a href={social.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#1565d8] text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              )}
              {social.linkedinUrl && (
                <a href={social.linkedinUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#0A66C2] hover:bg-[#0958a8] text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              )}
              {social.youtubeUrl && (
                <a href={social.youtubeUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#FF0000] hover:bg-[#cc0000] text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              )}
              {social.tiktokUrl && (
                <a href={social.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs border border-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                  TikTok
                </a>
              )}
              {social.email && (
                <a href={`mailto:${social.email}`}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md font-semibold transition-all shadow-xs text-xs border border-white/25 backdrop-blur-xs">
                  <Mail className="w-4 h-4" />
                  <span>{social.email}</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground border border-border rounded-lg p-8 md:p-12 text-center shadow-xs relative overflow-hidden">
            <Headphones className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
              {language === 'ar' ? 'هل تحتاج إلى مساعدة أو استشارة؟' : 'Need Help or Consultation?'}
            </h2>
            <p className="text-slate-300 text-sm mb-6 max-w-xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'فريقنا مستعد للإجابة على جميع استفساراتك وتقديم أفضل الحلول العقارية المناسبة لاحتياجاتك.' 
                : 'Our team is ready to answer all your inquiries and provide the best real estate solutions tailored to your needs.'}
            </p>
            <a
              href={`https://wa.me/${(social.whatsappNumber || '966500000000').replace(/\+/g,'')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary h-10 px-6 font-semibold text-xs flex items-center justify-center gap-1.5 mx-auto"
            >
              {language === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}