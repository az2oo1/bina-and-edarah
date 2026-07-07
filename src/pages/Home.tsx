import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, MapPin, ArrowRight, ArrowLeft, BuildingIcon, KeySquare, Hammer, Headphones, Mail, Layers } from 'lucide-react';
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

  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProjects(data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

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
    <div className="flex flex-col w-full text-foreground bg-background font-sans animate-in fade-in duration-500">
      {/* Centered Premium Hero Section */}
      {(() => {
        const isDefaultHero = !images.hero || images.hero === DEFAULT_IMAGES.hero;
        return (
          <section className={`relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden ${isDefaultHero ? 'bg-background border-b border-border' : 'bg-slate-950'}`}>
            {isDefaultHero ? (
              /* Sleek, Premium Light Gradient Mesh for White Theme */
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-[#f8fafc] to-background">
                {/* Decorative soft blue/slate glows */}
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
                {/* Grid line decoration */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              </div>
            ) : (
              /* Custom background image uploaded by the user */
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-[1.03]"
                style={{ backgroundImage: `url("${images.hero}")` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950"></div>
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center py-20 animate-fade-in">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ${isDefaultHero ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-amber-500/25 border border-amber-500/50 text-amber-300'} backdrop-blur-md mb-6 uppercase tracking-wider shadow-sm`}>
                ✨ {language === 'ar' ? 'رؤية مستقبلية للمعيشة العقارية الفاخرة' : 'A Future Vision of Luxury Living'}
              </span>
              <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight select-none ${isDefaultHero ? 'text-foreground' : 'text-white'}`}>
                {t('hero.title')}
              </h1>
              <p className={`max-w-2xl mx-auto text-sm sm:text-lg font-medium leading-relaxed select-none mb-10 opacity-95 ${isDefaultHero ? 'text-muted-foreground' : 'text-slate-100'}`}>
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <Link to="/projects" className="inline-flex items-center justify-center gap-2 bg-[#2563eb] text-white hover:bg-[#1d4ed8] h-14 px-8 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] will-change-transform cursor-pointer">
                  <span>{language === 'ar' ? 'مشاريعنا' : 'Projects We Developed'}</span>
                  <Arrow className="w-5 h-5 text-white" />
                </Link>
                <Link to="/properties" className={`inline-flex items-center justify-center gap-2 border h-14 px-8 rounded-lg text-sm font-bold shadow-md hover:shadow-lg backdrop-blur-md transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] will-change-transform cursor-pointer ${isDefaultHero ? 'border-border text-foreground hover:bg-muted/50' : 'border-white/20 text-white hover:bg-white/5 hover:border-white/40'}`}>
                  <span>{language === 'ar' ? 'عقارات للبيع أو الإيجار' : 'Properties to Buy or Rent'}</span>
                </Link>
              </div>
            </div>
            
            {/* Subtle bottom fade */}
            <div className={`absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t ${isDefaultHero ? 'from-background' : 'from-slate-950'} to-transparent pointer-events-none`}></div>
          </section>
        );
      })()}

      {/* Giant Skyscraper Section (Immediately under the Hero) */}
      <section className="relative w-full bg-background pb-32 pt-12 overflow-hidden border-b border-border flex flex-col items-center justify-center">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
          




          {/* About Us stacked details (Centered Title + 3 Cards arranged horizontally below the skyscraper) */}
          <div className="w-full space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-bold tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/25 uppercase">
                {language === 'ar' ? 'من نحن' : 'Who We Are'}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-4 leading-tight">
                {language === 'ar' ? 'نبتكر آفاقاً جديدة للمعيشة والاستثمار' : 'Creating New Horizons for Living & Investing'}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-3 leading-relaxed">
                {language === 'ar' 
                  ? 'في بناء وإدارة، نجمع بين التخطيط الاستراتيجي، والتصميم المبتكر، والجودة المطلقة لتقديم حلول سكنية واستثمارية فريدة ترتقي بجودة الحياة.'
                  : 'At Benaa & Edara, we merge strategic planning, innovative design, and absolute quality to deliver exceptional residential and investment spaces.'}
              </p>
            </div>

            {/* 3 cards arranged in a 3-column grid below the building */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Vision Box */}
              <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group/card text-right rtl:text-right ltr:text-left">
                <div className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 group-hover/card:text-sky-400 transition-colors">
                    {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ar' 
                      ? 'أن نكون الخيار الأول والملهم في التطوير والإدارة العقارية المبتكرة في المملكة.' 
                      : 'To be the premier and inspiring choice for innovative real estate development and management in the Kingdom.'}
                  </p>
                </div>
              </div>

              {/* Mission Box */}
              <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-amber-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group/card text-right rtl:text-right ltr:text-left">
                <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 group-hover/card:text-amber-400 transition-colors">
                    {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ar' 
                      ? 'تقديم حلول عقارية متكاملة ومستدامة تلبي تطلعات عملائنا وترتقي بجودة الحياة اليومية.' 
                      : 'Providing integrated, sustainable real estate solutions that meet client expectations and enhance quality of life.'}
                  </p>
                </div>
              </div>

              {/* Values Box */}
              <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group/card text-right rtl:text-right ltr:text-left">
                <div className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-md">
                  <KeySquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-2 group-hover/card:text-sky-400 transition-colors">
                    {language === 'ar' ? 'قيمنا' : 'Our Values'}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ar' 
                      ? 'الالتزام التام بالشفافية والابتكار المستمر وبناء شراكات حقيقية طويلة الأمد.' 
                      : 'Total commitment to transparency, continuous innovation, and building long-term partnerships.'}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
      {/* Services Section */}
      <section className="py-24 bg-background relative z-20 border-b border-border relative isolate overflow-hidden">
        {/* Dynamic mesh glow effect for services */}
        <div aria-hidden="true" className="absolute top-0 right-0 -z-10 blur-3xl opacity-20 select-none pointer-events-none translate-x-1/3">
          <div 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
            className="aspect-1155/678 w-[64rem] bg-gradient-to-tr from-sky-50 to-slate-100/50"
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
             <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-bold tracking-wider text-sky-400 bg-sky-400/10 border border-sky-400/25 uppercase">
               {language === 'ar' ? 'ماذا نقدم' : 'Our Services'}
             </span>
             <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mt-4 leading-tight">
               {language === 'ar' ? 'خدمات عقارية متكاملة تلبي تطلعاتكم' : 'Comprehensive Real Estate Services'}
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={service.id} 
                  className={`flex flex-col bg-card border border-border rounded-xl p-8 hover:${isEven ? 'border-sky-500/20' : 'border-amber-500/20'} backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group`}
                >
                  <div className={`w-12 h-12 rounded-lg ${isEven ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'} flex items-center justify-center mb-6 shadow-md`}>
                    {service.icon}
                  </div>
                  <h3 className={`text-lg font-bold text-foreground mb-3 group-hover:${isEven ? 'text-sky-400' : 'text-amber-400'} transition-colors`}>
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed text-justify mb-6">
                    {language === 'ar' ? service.descAr : service.descEn}
                  </p>
                  {/* Clean hover link */}
                  <div className={`mt-auto flex items-center gap-1.5 text-xs font-semibold ${isEven ? 'text-[#2563eb] group-hover:text-sky-400' : 'text-[#f59e0b] group-hover:text-amber-400'} transition-colors cursor-pointer select-none`}>
                    <span>{language === 'ar' ? 'اقرأ المزيد' : 'Learn More'}</span>
                    <Arrow className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Video Section */}
      <section className="py-24 bg-card border-t border-b border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text description */}
            <div className="space-y-6 text-right rtl:text-right ltr:text-left">
              <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-bold tracking-wider text-sky-400 bg-sky-400/10 border border-sky-400/25 uppercase">
                {language === 'ar' ? 'عرض مرئي' : 'Video Tour'}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                {language === 'ar' ? 'رحلتك نحو مسكنك المثالي تبدأ من هنا' : 'Your Journey to the Perfect Home Starts Here'}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed text-justify">
                {language === 'ar'
                  ? 'شاهد العرض المرئي التعريفي لشركة بناء وإدارة العقارية، وتعرف على مشاريعنا الحديثة وتطويراتنا السكنية الفاخرة. نسعى دائماً لتقديم أعلى معايير الفخامة والتميز العقاري لعملائنا في مختلف أنحاء المملكة.'
                  : 'Watch the promotional video tour of Benaa & Edara Real Estate and explore our latest projects and premium residential developments. We always strive to deliver the highest standards of luxury and real estate excellence to our clients across the Kingdom.'}
              </p>
              <div className="pt-2">
                <Link to="/properties" className="inline-flex items-center justify-center gap-2 bg-[#2563eb] text-white hover:bg-[#1d4ed8] h-11 px-6 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer">
                  <span>{language === 'ar' ? 'تصفح العقارات المتاحة' : 'Browse Available Properties'}</span>
                  <Arrow className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>
            {/* Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-slate-900 group">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-buildings-in-a-city-43183-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Album Section */}
      <section className="py-24 bg-background border-t border-b border-border relative overflow-hidden relative isolate">
        {/* Dynamic mesh glow effect for projects */}
        <div aria-hidden="true" className="absolute top-0 left-0 -z-10 blur-3xl opacity-20 select-none pointer-events-none -translate-x-1/3">
          <div 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
            className="aspect-1155/678 w-[64rem] bg-gradient-to-tr from-slate-100 to-sky-100/50"
          ></div>
        </div>
        {/* Aesthetics lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {language === 'ar' ? 'ألبوم مشاريعنا المتميزة' : 'Featured Projects Album'}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              {language === 'ar' ? 'تصفح ألبوم صور المشاريع التي قمنا بتطويرها مؤخراً، انقر على أي مشروع للمزيد من التفاصيل.' : 'Browse the photo album of our recently developed projects, click on any project to view details.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => {
              let imagesArr = [];
              try {
                imagesArr = JSON.parse(project.imageUrls || '[]');
              } catch(_) {}
              const image = imagesArr[0] || DEFAULT_IMAGES.service1;

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="relative group h-80 rounded-xl overflow-hidden cursor-pointer shadow-md border border-border bg-card transition-all duration-500 hover:scale-[1.01] hover:border-sky-500/20"
                >
                  <img 
                    src={image} 
                    alt={language === 'ar' ? project.titleAr : project.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>
                  
                  {/* Info inside album item */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-foreground flex flex-col justify-end">
                    <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 border border-sky-500/30 text-sky-400 uppercase tracking-wider mb-2">
                        {t(`cat.${project.propertyCategory}`)}
                      </span>
                      <h3 className="text-lg font-bold text-foreground leading-tight">
                        {language === 'ar' ? project.titleAr : project.titleEn}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{project.locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')} • {project.area} {t('common.sqm')}</span>
                      </p>
                    </div>
                  </div>

                  {/* Absolute Top-Right Arrow button */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card/10 border border-white/10 flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <Arrow className="w-4 h-4 text-sky-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {featuredProjects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {language === 'ar' ? 'سيتم إضافة ألبوم المشاريع قريباً.' : 'Featured projects album will be added soon.'}
            </div>
          )}
        </div>

        {/* Modal display of selected project */}
        {selectedProject && (() => {
          let imagesArr = [];
          try {
            imagesArr = JSON.parse(selectedProject.imageUrls || '[]');
          } catch(_) {}
          const image = imagesArr[0] || DEFAULT_IMAGES.service1;
          
          return (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
              <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Banner */}
                <div className="relative h-72 w-full">
                  <img src={image} alt={selectedProject.titleAr} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/70 border border-white/10 text-foreground flex items-center justify-center hover:bg-background hover:border-white/20 transition-all cursor-pointer"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-foreground">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 border border-sky-500/30 text-sky-400 uppercase tracking-wider mb-2">
                      {t(`cat.${selectedProject.propertyCategory}`)}
                    </span>
                    <h3 className="text-2xl font-extrabold text-foreground">
                      {language === 'ar' ? selectedProject.titleAr : selectedProject.titleEn}
                    </h3>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed text-muted-foreground">
                  <div>
                    <h4 className="font-bold text-foreground text-base mb-2">{language === 'ar' ? 'حول المشروع' : 'About Project'}</h4>
                    <p className="text-muted-foreground text-justify">{selectedProject.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground mb-0.5">{language === 'ar' ? 'المساحة الإجمالية' : 'Total Area'}</span>
                      <p className="text-sm font-semibold text-foreground font-mono">{selectedProject.area} {t('common.sqm')}</p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground mb-0.5">{language === 'ar' ? 'عمر العقار' : 'Property Age'}</span>
                      <p className="text-sm font-semibold text-foreground">{selectedProject.propertyAge} {language === 'ar' ? 'سنة' : 'years'}</p>
                    </div>
                    {selectedProject.locationText && (
                      <div className="col-span-2 flex flex-col">
                        <span className="text-xs font-bold text-muted-foreground mb-0.5">{language === 'ar' ? 'الموقع الجغرافي' : 'Location'}</span>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-sky-400" />
                          <span>{selectedProject.locationText}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="bg-background px-6 py-4 border-t border-border flex justify-end gap-3">
                  <Link 
                    to={`/projects`}
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center justify-center bg-[#2563eb] text-foreground hover:bg-[#1d4ed8] h-9 px-4 rounded-md text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    {language === 'ar' ? 'عرض جميع المشاريع' : 'View All Projects'}
                  </Link>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="inline-flex items-center justify-center border border-border bg-card text-muted-foreground hover:bg-slate-800 h-9 px-4 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          );
        })() /* Close dialog conditional */}
      </section>

{/* Features Section */}
      <section className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex px-3 py-1 rounded-md text-[11px] font-bold tracking-wider text-sky-400 bg-sky-400/10 border border-sky-400/25 uppercase">
              {language === 'ar' ? 'ميزاتنا' : 'Why Choose Us'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mt-4 leading-tight">
              {language === 'ar' ? 'لماذا تختار بناء وإدارة؟' : 'Why Choose Benaa & Edara?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-xl p-8 hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-3 text-foreground">{language === 'ar' ? 'الثقة والأمان' : 'Trust & Security'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' ? 'نضمن لك معاملات عقارية آمنة وموثوقة، مع التزام تام بالشفافية في كل خطوة.' : 'We guarantee safe and reliable real estate transactions, with a total commitment to transparency.'}
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-8 hover:border-amber-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-3 text-foreground">{language === 'ar' ? 'أفضل المواقع' : 'Prime Locations'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' ? 'نختار لك أفضل المواقع الاستراتيجية التي تضمن لك استثماراً ناجحاً ومستقبلاً واعداً.' : 'We curate the best strategic locations that guarantee a successful investment and a promising future.'}
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold mb-3 text-foreground">{language === 'ar' ? 'إدارة متكاملة' : 'Integrated Management'}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' ? 'إدارة أملاك احترافية تضمن لك راحة البال وتحقيق أعلى العوائد الاستثمارية.' : 'Professional property management for your peace of mind, ensuring maximum investment returns.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA to Contact Form */}
      <section className="relative isolate overflow-hidden bg-background py-20 border-t border-border flex flex-col items-center justify-center text-center gap-6">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          {language === 'ar' ? 'هل تحتاج إلى مساعدة أو استشارة؟' : 'Need Help or Consultation?'}
        </h2>
        <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed px-6 text-center">
          {language === 'ar' 
            ? 'فريقنا المتخصص مستعد للإجابة على جميع استفساراتك وتقديم أفضل الاستشارات والحلول العقارية المبتكرة المناسبة لاحتياجاتك الاستثمارية والسكنية.'
            : 'Our dedicated team is ready to answer all your inquiries and provide the best innovative real estate advice and solutions tailored to your residential and investment needs.'}
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="rounded-lg bg-primary hover:opacity-90 text-primary-foreground px-6 py-3 text-xs font-bold shadow-md transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}</span>
            <Arrow className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Played-with mesh glow under the CTA button */}
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20 select-none pointer-events-none">
          <div 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
            className="aspect-1155/678 w-[48rem] bg-gradient-to-tr from-slate-100 to-indigo-50/50"
          ></div>
        </div>
      </section>
    </div>
  );
}