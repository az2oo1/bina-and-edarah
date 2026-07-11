import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, MapPin, ArrowRight, ArrowLeft, Building, KeySquare, Hammer, Headphones, Mail, Layers, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { SocialIconsRow } from '../components/SocialIcons';

const DEFAULT_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  promoVideo: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-buildings-in-a-city-43183-large.mp4',
  service1: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
  service2: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000',
  service3: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000',
  service4: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000',
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
  
  const [activeSection, setActiveSection] = useState('hero');
  const [projectsVisible, setProjectsVisible] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProjectsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = ['hero', 'solutions', 'video-tour', 'featured-projects', 'features', 'contact-cta'];
    const handleScroll = () => {
      // Detect if user has scrolled to the absolute bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection('contact-cta');
        return;
      }

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeaturedProjects(data.slice(0, 3));
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
      descAr: 'نبتكر مساحات استثنائية تجمع الفخامة بالعملية وبأعلى المعايير.',
      descEn: 'We innovate exceptional spaces combining luxury and practicality.',
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
      descAr: 'خيارات عقارية مميزة مع فريق يضمن سلاسة الصفقات وأمانها.',
      descEn: 'Premium real estate options with a team ensuring smooth transactions.',
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
      descAr: 'إدارة أملاك احترافية تضمن لك راحة البال وتحقيق أعلى العوائد.',
      descEn: 'Professional property management ensuring peace of mind and high returns.',
      bg: 'bg-green-50',
      border: 'border-green-100',
      color: 'text-green-600',
      image: images.service3,
    },
    {
      id: 'consulting',
      icon: <Building className="w-8 h-8" />,
      titleAr: 'استشارات عقارية',
      titleEn: 'Real Estate Consulting',
      descAr: 'استشارات عقارية دقيقة وموثوقة لمساعدتك في اتخاذ قراراتك.',
      descEn: 'Accurate real estate consulting to help you make informed decisions.',
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
          <section id="hero" className="relative w-full flex flex-col items-center justify-between bg-background text-foreground transition-colors duration-300 pt-16 sm:pt-24 pb-0">
            {/* Premium Theme-Adaptive Background with Decorative Dots & Glows */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              {/* Soft blurred background color glows */}
              <div className="absolute -top-10 left-1/4 w-[500px] h-[500px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
              <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-400/8 dark:bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none"></div>
              
              {/* Dots Grid Pattern (Subtle & Elegant) */}
              <div className="absolute inset-0 text-slate-300/30 dark:text-slate-800/20" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pt-8 pb-12 sm:pb-16 w-full animate-fade-in">
              <h1 className="flex flex-col items-center w-full">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-5 select-none">
                  {language === 'ar' ? 'تطوير • تسويق • إدارة أملاك' : 'DEVELOPMENT • LEASING • PROPERTY MANAGEMENT'}
                </span>
                <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight select-none">
                  {t('hero.title')}
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-lg font-medium leading-relaxed select-none mb-10 opacity-95 text-muted-foreground">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <button 
                  onClick={() => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 bg-[#2563eb] text-white hover:bg-[#1d4ed8] h-14 px-8 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] will-change-transform cursor-pointer"
                >
                  <span>{language === 'ar' ? 'مشاريعنا المتميزة' : 'Featured Projects'}</span>
                  <Arrow className="w-5 h-5 text-white" />
                </button>
                <Link to="/properties" className="inline-flex items-center justify-center gap-2 border border-border text-foreground hover:bg-muted h-14 px-8 rounded-lg text-sm font-bold shadow-md hover:shadow-lg backdrop-blur-md transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] will-change-transform cursor-pointer">
                  <span>{language === 'ar' ? 'عقارات للبيع أو الإيجار' : 'Properties to Buy or Rent'}</span>
                </Link>
              </div>
            </div>

            {/* Skyscrapers transparent divider image serving as a bottom frame */}
            <div className="w-full mt-auto relative z-30 select-none pointer-events-none">
              <img 
                src="/skyscrapers.png?v=2" 
                alt="Skyscrapers divider" 
                className="w-full h-auto object-contain object-bottom opacity-100 dark:opacity-85"
              />
            </div>
            
            {/* Smooth Scroll Down Button */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 select-none animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <button 
                onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-center text-slate-500 hover:text-slate-955 dark:text-white/60 dark:hover:text-white transition-colors cursor-pointer group"
              >
                <ChevronDown className="w-6 h-6 animate-bounce" />
              </button>
            </div>
          </section>
        );
      })()}

      {/* Combined "Who We Are" & "Real Estate Solutions" Section */}
      <section id="solutions" className="py-24 bg-background relative z-20 border-b border-border relative isolate overflow-hidden">
        {/* Decorative Grid Lines (Subtle & Elegant) */}
        <div className="absolute inset-0 text-slate-300/30 dark:text-slate-800/20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        <div aria-hidden="true" className="absolute top-0 right-0 -z-10 blur-3xl opacity-20 select-none pointer-events-none translate-x-1/3">
          <div 
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
            className="aspect-1155/678 w-[64rem] bg-gradient-to-tr from-sky-500/10 to-indigo-500/10"
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          {/* Header Info */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2 select-none">
              {language === 'ar' ? 'خدمات الشركة' : 'COMPANY SERVICES'}
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {language === 'ar' ? 'خدماتنا العقارية المتكاملة' : 'Our Integrated Real Estate Services'}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'نقدم في بناء وإدارة خدمات عقارية متكاملة تغطي التطوير والتسويق وإدارة الأملاك وفق أحدث الأساليب المهنية لضمان أفضل قيمة لأصحاب العقارات والمستأجرين.'
                : 'Benaa & Edara provides comprehensive real estate services covering development, marketing, and asset management under modern professional standards to ensure high value.'}
            </p>
            
            {/* The Two Page Navigation Buttons/Links Side-by-Side */}
            <div className="pt-4 flex flex-wrap gap-4 justify-center">
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center gap-1.5 bg-[#2563eb] text-white hover:bg-[#1d4ed8] px-5 py-2.5 rounded-lg text-xs font-bold shadow-md transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none"
              >
                <span>{language === 'ar' ? 'المزيد عن الشركة' : 'More About Us'}</span>
                <Arrow className="w-4 h-4 text-white" />
              </Link>
              <Link 
                to="/services" 
                className="inline-flex items-center justify-center gap-1.5 border border-border text-foreground hover:bg-muted/80 hover:border-foreground/30 px-5 py-2.5 rounded-lg text-xs font-bold shadow-md backdrop-blur-md transform-gpu transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer select-none"
              >
                <span>{language === 'ar' ? 'تصفح خدماتنا العقارية' : 'Browse Our Services'}</span>
                <Arrow className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={service.id} 
                  className={`flex flex-col bg-card border border-border rounded-xl p-6 hover:${isEven ? 'border-sky-500/20' : 'border-amber-500/20'} backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group`}
                >
                  <div className={`w-12 h-12 rounded-lg ${isEven ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'} flex items-center justify-center mb-4 shadow-md`}>
                    {service.icon}
                  </div>
                  <h3 className={`text-base font-bold text-foreground mb-2 group-hover:${isEven ? 'text-sky-400' : 'text-amber-600 dark:group-hover:text-amber-400'} transition-colors`}>
                    {language === 'ar' ? service.titleAr : service.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed text-justify mb-6">
                    {language === 'ar' ? service.descAr : service.descEn}
                  </p>
                  {/* Clean hover link */}
                  <Link to="/services" className={`mt-auto inline-flex items-center gap-1.5 text-xs font-bold ${isEven ? 'text-[#2563eb] group-hover:text-sky-400' : 'text-amber-700 dark:text-amber-400 group-hover:text-amber-600 dark:group-hover:text-amber-400'} transition-colors cursor-pointer select-none`}>
                    <span>{language === 'ar' ? 'اقرأ المزيد' : 'Learn More'}</span>
                    <Arrow className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Video Section */}
      <section id="video-tour" className="py-24 bg-card border-t border-b border-border relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text description */}
            <div className="space-y-6 text-right rtl:text-right ltr:text-left">
              <p className="text-xs font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest mb-2 select-none">
                {language === 'ar' ? 'عرض مرئي' : 'VIDEO PRESENTATION'}
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                {language === 'ar' ? 'نبذة عن مشاريعنا العقارية' : 'A Closer Look at Our Properties'}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed text-justify">
                {language === 'ar'
                  ? 'تعرف من خلال هذا العرض المرئي على مشاريع شركة بناء وإدارة العقارية، والتي تشمل مجمعات سكنية ومبانٍ تجارية مصممة ومدارة وفق أعلى المعايير الفنية والتشغيلية في مختلف مناطق الرياض.'
                  : 'Get an overview of Benaa & Edara Real Estate projects, featuring residential complexes and commercial buildings developed and managed to the highest technical and operational standards in Riyadh.'}
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
                key={images.promoVideo || 'default-video'}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              >
                <source src={images.promoVideo || DEFAULT_IMAGES.promoVideo} />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Creative Apple Editorial Layout */}
      <section id="featured-projects" className="py-28 bg-background border-t border-b border-border relative overflow-hidden isolate">
        {/* Decorative Grid (Subtle & Elegant) */}
        <div className="absolute inset-0 text-slate-300/30 dark:text-slate-800/20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div 
            className={`text-center mb-24 transition-all duration-1000 ease-out transform ${
              projectsVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2 select-none">
              {language === 'ar' ? 'مشاريع متميزة' : 'FEATURED PORTFOLIO'}
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {language === 'ar' ? 'نصنع فضاءات معمارية متميزة' : 'Architectural Landmarks'}
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              {language === 'ar' ? 'نستعرض هنا ثلاثة من أرقى مشاريعنا التطويرية التي تمثل نموذجاً للمعيشة والاستقرار الاستثماري.' : 'Showcasing three of our finest properties that represent our standards of architectural design and quality.'}
            </p>
          </div>

          {/* Staggered Alternating Rows Container */}
          <div ref={projectsRef} className="space-y-32">
            {featuredProjects.map((project, index) => {
              let imagesArr = [];
              try {
                imagesArr = JSON.parse(project.imageUrls || '[]');
              } catch(_) {}
              const image = imagesArr[0] || DEFAULT_IMAGES.service1;
              const isEven = index % 2 === 1;

              return (
                <div 
                  key={project.id}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 transition-all duration-1000 ease-out transform ${
                    projectsVisible 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-20 scale-[0.98]'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Column A: Large Premium Parallax Image */}
                  <Link 
                    to={`/projects/${project.id}`}
                    className={`w-full lg:w-3/5 aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border border-border/80 bg-muted shadow-lg hover:shadow-2xl hover:border-primary/25 transition-all duration-500 group relative block ${
                      isEven ? 'lg:order-2' : ''
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={language === 'ar' ? project.titleAr : project.titleEn} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  </Link>

                  {/* Column B: Spacious Editorial Content */}
                  <div className={`w-full lg:w-2/5 flex flex-col items-start text-right rtl:text-right ltr:text-left ${
                    isEven ? 'lg:order-1' : ''
                  }`}>
                    {/* Category */}
                    <span className="text-[10px] font-extrabold text-sky-500 dark:text-sky-400 uppercase tracking-widest mb-3">
                      {t(`cat.${project.propertyCategory}`)}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4 leading-tight select-none">
                      {language === 'ar' ? project.titleAr : project.titleEn}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify mb-6 max-w-lg">
                      {language === 'ar' ? project.descriptionAr : project.descriptionEn}
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-6 w-full border-t border-b border-border/60 py-4 mb-6">
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                        <span className="text-xs font-bold text-foreground font-mono">{project.area} {t('common.sqm')}</span>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{language === 'ar' ? 'عمر العقار' : 'Property Age'}</span>
                        <span className="text-xs font-bold text-foreground">{project.propertyAge > 0 ? `${project.propertyAge} ${language === 'ar' ? 'سنة' : 'years'}` : (language === 'ar' ? 'جديد' : 'New')}</span>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{language === 'ar' ? 'الموقع' : 'Location'}</span>
                        <span className="text-xs font-bold text-foreground truncate max-w-[100px]">{project.locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}</span>
                      </div>
                    </div>

                    {/* View Details Link */}
                    <Link 
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] dark:text-sky-400 dark:hover:text-sky-300 transition-colors cursor-pointer select-none group/link"
                    >
                      <span>{language === 'ar' ? 'تفاصيل المشروع كاملة' : 'View Full Details'}</span>
                      <Arrow className="w-4 h-4 transform group-hover/link:translate-x-1 sm:rtl:group-hover/link:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {featuredProjects.length > 0 && (
            <div className="mt-28 text-center">
              <Link 
                to="/projects" 
                className="btn-outline px-7 h-12 text-xs font-bold rounded-lg shadow-sm hover:bg-muted/40 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{language === 'ar' ? 'استكشف كافة مشاريعنا' : 'Explore Entire Portfolio'}</span>
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          )}

          {featuredProjects.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm font-medium border border-dashed border-border rounded-2xl">
              {language === 'ar' ? 'سيتم إضافة ألبوم المشاريع قريباً.' : 'Featured projects portfolio will be added soon.'}
            </div>
          )}
        </div>
      </section>

{/* Features Section */}
      <section id="features" className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest mb-2 select-none">
              {language === 'ar' ? 'المزايا التنافسية' : 'COMPETITIVE ADVANTAGES'}
            </p>
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
      <section id="contact-cta" className="relative isolate overflow-hidden bg-background py-20 border-t border-border flex flex-col items-center justify-center text-center gap-6">
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
            className="aspect-1155/678 w-[48rem] bg-gradient-to-tr from-sky-500/10 to-indigo-600/10"
          ></div>
        </div>
      </section>

      {/* Scrollspy Side Dot Indicator */}
      <div className="fixed top-1/2 -translate-y-1/2 z-40 ltr:right-6 rtl:left-6 hidden md:flex flex-col gap-3.5 items-center bg-card/70 border border-border/80 backdrop-blur-md rounded-full px-2 py-5 shadow-2xl">
        {[
          { id: 'hero', ar: 'الرئيسية', en: 'Home' },
          { id: 'solutions', ar: 'من نحن والحلول', en: 'About & Solutions' },
          { id: 'video-tour', ar: 'الفيديو التعريفي', en: 'Video Tour' },
          { id: 'featured-projects', ar: 'مشاريعنا', en: 'Our Projects' },
          { id: 'features', ar: 'ميزاتنا', en: 'Why Us' },
          { id: 'contact-cta', ar: 'تواصل معنا', en: 'Contact' }
        ].map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })}
              className="relative group flex items-center justify-center w-5 h-5 cursor-pointer select-none"
              aria-label={language === 'ar' ? sec.ar : sec.en}
            >
              {/* Dot element */}
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-amber-400 scale-125 ring-4 ring-amber-400/20' 
                    : 'bg-muted-foreground/35 group-hover:bg-muted-foreground/75 scale-100'
                }`}
              />
              
              {/* Hover Text Tooltip */}
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-8 rtl:left-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none select-none">
                <div className="bg-slate-900/95 text-white border border-white/10 text-[9px] font-bold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                  {language === 'ar' ? sec.ar : sec.en}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}