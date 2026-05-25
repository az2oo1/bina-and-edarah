import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, MapPin, ArrowRight, ArrowLeft, BuildingIcon, KeySquare, Hammer, Headphones } from 'lucide-react';
import { Link } from 'react-router';

export default function Home() {
  const { t, language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

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
      image: "https://images.unsplash.com/photo-1541885088926-d68a98b04a8e?auto=format&fit=crop&w=800&q=80"
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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
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
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"
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
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-7xl mb-6">
            {t('hero.title')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200 sm:text-xl md:mt-6 md:text-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects" className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-yellow-600/20 hover:-translate-y-1">
              <span>{language === 'ar' ? 'مشاريع قمنا بتطويرها' : 'Projects We Developed'}</span>
              <Arrow className="w-5 h-5" />
            </Link>
            <Link to="/properties" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center text-lg hover:-translate-y-1">
              {language === 'ar' ? 'عقارات للبيع أو الإيجار' : 'Properties to Buy or Rent'}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
               {language === 'ar' ? 'خدماتنا' : 'Our Services'}
             </h2>
             <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 gap-12">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100 group transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]`}
              >
                {/* Image Side */}
                <div className="w-full lg:w-2/5 h-64 lg:h-auto relative overflow-hidden hidden sm:block">
                  <img 
                    src={service.image} 
                    alt={language === 'ar' ? service.titleAr : service.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${service.bg} ${service.color} ${service.border} border shadow-inner`}>
                    {service.icon}
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6 group-hover:text-yellow-600 transition-colors">
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-10 text-justify">
                    {language === 'ar' ? service.descAr : service.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {language === 'ar' ? 'لماذا تختار بناء وإدارة؟' : 'Why Choose Benaa & Edara?'}
            </h2>
            <div className="mt-4 w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{language === 'ar' ? 'الثقة والأمان' : 'Trust & Security'}</h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar' ? 'نضمن لك معاملات عقارية آمنة وموثوقة، مع التزام تام بالشفافية في كل خطوة.' : 'We guarantee safe and reliable real estate transactions, with a total commitment to transparency.'}
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{language === 'ar' ? 'أفضل المواقع' : 'Prime Locations'}</h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar' ? 'نختار لك أفضل المواقع الاستراتيجية التي تضمن لك استثماراً ناجحاً ومستقبلاً واعداً.' : 'We curate the best strategic locations that guarantee a successful investment and a promising future.'}
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{language === 'ar' ? 'إدارة متكاملة' : 'Integrated Management'}</h3>
              <p className="text-gray-600 leading-relaxed">
                {language === 'ar' ? 'إدارة أملاك احترافية تضمن لك راحة البال وتحقيق أعلى العوائد الاستثمارية.' : 'Professional property management for your peace of mind, ensuring maximum investment returns.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-500 rounded-3xl p-10 md:p-16 text-center transform hover:scale-[1.01] transition-transform duration-300 shadow-xl shadow-yellow-500/20">
            <Headphones className="w-16 h-16 text-black mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              {language === 'ar' ? 'هل تحتاج إلى مساعدة أو استشارة؟' : 'Need Help or Consultation?'}
            </h2>
            <p className="text-gray-900 font-medium text-lg mb-8 max-w-xl mx-auto">
              {language === 'ar' 
                ? 'فريقنا مستعد للإجابة على جميع استفساراتك وتقديم أفضل الحلول العقارية المناسبة لاحتياجاتك.' 
                : 'Our team is ready to answer all your inquiries and provide the best real estate solutions tailored to your needs.'}
            </p>
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg"
            >
              {language === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
              {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
