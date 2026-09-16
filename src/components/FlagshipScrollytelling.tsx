import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import * as LucideIcons from 'lucide-react';
import { 
  MapPin, Maximize2, Calendar, Star, CheckCircle, ChevronRight, ChevronLeft, 
  Building2, Layers, Phone, ArrowDown, Sparkles, Award, 
  ExternalLink, Share2, Check, FileDown, Download, Compass
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ImageViewer } from './ImageViewer';
import { formatExternalLink } from '../utils/link';

interface FlagshipScrollytellingProps {
  project: {
    id: string;
    titleAr: string;
    titleEn: string;
    tier: string;
    propertyCategory: string;
    area: number | string;
    locationLink?: string;
    locationText?: string;
    description: string;
    propertyAge?: number | string;
    imageUrls?: string[];
    featuresList?: Array<{ id: string; value: string }>;
    detailsList?: Array<{ id: string; key: string; value: string; icon?: string }>;
    floorplanUrl?: string;
    brochureUrl?: string;
  };
  settings?: {
    whatsappNumber?: string;
    whatsappMessage?: string;
    callingNumber?: string;
    email?: string;
  };
}

export function FlagshipScrollytelling({ project, settings = {} }: FlagshipScrollytellingProps) {
  const { language, t } = useLanguage();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // Scroll Progress
  const { scrollYProgress, scrollY } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowFloatingBar(latest > 500);
    });
  }, [scrollY]);

  const images = project.imageUrls && project.imageUrls.length > 0 
    ? project.imageUrls 
    : ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070'];
  
  const heroMedia = images[0];
  const isHeroVideo = heroMedia && (
    heroMedia.startsWith('data:video') || 
    heroMedia.endsWith('.mp4') || 
    heroMedia.endsWith('.mov') || 
    heroMedia.endsWith('.webm') || 
    heroMedia.endsWith('.avi')
  );

  const title = language === 'ar' ? project.titleAr : project.titleEn;
  const whatsappNumber = (settings.whatsappNumber || '966500000000').replace(/\+/g, '');
  const callingNumber = (settings.callingNumber || '966500000000').replace(/\+/g, '');
  
  const defaultWhatsAppText = language === 'ar'
    ? `مرحباً، أود الاستفسار عن المشروع الريادي: ${title} - ${window.location.href}`
    : `Hello, I'm interested in the flagship project: ${title} - ${window.location.href}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    (settings.whatsappMessage || defaultWhatsAppText)
      .replace('{title}', title)
      .replace('{link}', window.location.href)
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openViewerAt = (index: number) => {
    setViewerInitialIndex(index);
    setIsViewerOpen(true);
  };

  const renderIcon = (iconName?: string) => {
    if (iconName && (LucideIcons as any)[iconName]) {
      const IconComp = (LucideIcons as any)[iconName];
      return <IconComp className="w-5 h-5 text-primary" />;
    }
    return <LucideIcons.Layers className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-sans relative selection:bg-primary selection:text-primary-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-12 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-primary to-amber-500 z-40 origin-left"
        style={{ 
          scaleX: scrollYProgress,
          transformOrigin: language === 'ar' ? 'right' : 'left'
        }}
      />

      {/* Sub-Navigation Bar */}
      <div className="relative z-20 bg-card/60 backdrop-blur-md border-b border-border/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/80 hover:bg-muted border border-border px-3.5 py-1.5 rounded-full shadow-xs active:scale-[0.97]"
            >
              {language === 'ar' ? <ChevronRight className="w-4 h-4 text-primary" /> : <ChevronLeft className="w-4 h-4 text-primary" />}
              <span>{language === 'ar' ? 'المشاريع' : 'Projects'}</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-semibold text-xs bg-primary/10 text-primary border border-primary/20">
              <span>{language === 'ar' ? 'مشروع ريادي' : 'Flagship Project'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.brochureUrl && (
              <a
                href={project.brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="h-9 px-3.5 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.97]"
                title={language === 'ar' ? 'تحميل البروشور' : 'Download Brochure'}
              >
                <FileDown className="w-4 h-4" />
                <span>{language === 'ar' ? 'البروشور' : 'Brochure'}</span>
              </a>
            )}

            <button
              onClick={handleCopyLink}
              className="h-9 px-3 rounded-full text-xs font-semibold border border-border bg-card/60 hover:bg-muted transition flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
              title={language === 'ar' ? 'نسخ الرابط' : 'Copy link'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'مشاركة' : 'Share')}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20b858] transition flex items-center gap-1.5 shadow-sm active:scale-[0.97]"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>{language === 'ar' ? 'استفسار واتساب' : 'Inquire'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 1. CINEMATIC HERO COVER */}
      <section className="relative min-h-[calc(100vh-3.5rem)] w-full flex items-center overflow-hidden select-none py-12 sm:py-16">
        {/* Parallax Media Background */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          {isHeroVideo ? (
            <video 
              src={heroMedia} 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover" 
            />
          ) : (
            <img 
              src={heroMedia} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          )}
          {/* Luxury Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-black/50" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{language === 'ar' ? 'مشروع ريادي' : 'Flagship Project'}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] drop-shadow-lg">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200 pt-1 font-medium">
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{project.locationText || (language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia')}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{t(`cat.${project.propertyCategory}`) || project.propertyCategory}</span>
              </div>

              {project.area && (
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span>{project.area} م²</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20b858] transition flex items-center gap-2 shadow-lg active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>{language === 'ar' ? 'استفسار واتساب' : 'Inquire via WhatsApp'}</span>
              </a>

              {project.brochureUrl && (
                <a
                  href={project.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="h-11 px-6 rounded-full text-xs font-bold bg-white/90 hover:bg-white text-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4 text-primary" />
                  <span>{language === 'ar' ? 'تحميل البروشور' : 'Download Brochure'}</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Prompt */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 text-xs font-semibold pointer-events-none"
        >
          <span>{language === 'ar' ? 'مرر لاكتشاف القصة' : 'Scroll to explore'}</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4 text-amber-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE CONCEPT & VISION NARRATIVE CHAPTER (SCROLLYTELLING STAGE) */}
      <section className="py-24 sm:py-32 relative bg-card/40 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Sticky Narrative Showcase Image */}
            <div className="lg:col-span-6 lg:sticky lg:top-28">
              <div className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-muted aspect-4/3 sm:aspect-16/10 group cursor-pointer" onClick={() => openViewerAt(0)}>
                <img 
                  src={images[0]} 
                  alt="Architecture vision" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-8">
                  <div className="text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">{language === 'ar' ? 'المفهوم المعماري' : 'Architectural Concept'}</span>
                    <h3 className="text-lg font-bold">{title}</h3>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'عرض مكبّر' : 'Expand'}</span>
                </div>
              </div>
            </div>

            {/* Narrative Storytelling Text */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  {language === 'ar' ? 'فلسفة المشروع ورؤيته' : 'Project Vision & Philosophy'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
                  {language === 'ar' ? 'تصميم يرتقي بنمط الحياة الحضرية' : 'Elevating Urban Living to New Heights'}
                </h2>
              </div>

              <div className="prose dark:prose-invert max-w-none text-muted-foreground text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                {project.description}
              </div>

              {/* Highlights Quote Box */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-sm font-semibold text-foreground italic relative z-10 leading-relaxed">
                  "{language === 'ar' 
                    ? 'صُمم هذا المشروع الريادي ليكون علامة فارقة تجسد أعلى معايير الجودة والاستدامة، مقدماً بيئة متكاملة تجمع بين الفخامة والعملية.'
                    : 'Crafted as a landmark defining superior quality and sustainability, providing an integrated environment of prestige and performance.'}"
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. KEY METRICS & DIMENSIONS BENTO */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              {language === 'ar' ? 'الأرقام والمقاييس الهندسية' : 'Key Metrics & Dimensions'}
            </span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {language === 'ar' ? 'مواصفات تليق بالمشاريع الريادية' : 'Built for Flagship Standards'}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs hover:border-primary/50 transition-all hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Maximize2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold mb-1">{language === 'ar' ? 'المساحة الإجمالية' : 'Total Area'}</span>
              <span className="text-2xl sm:text-3xl font-black text-foreground">{project.area || '—'} م²</span>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs hover:border-primary/50 transition-all hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold mb-1">{language === 'ar' ? 'نوع التصنيف المعماري' : 'Property Typology'}</span>
              <span className="text-2xl sm:text-3xl font-black text-foreground line-clamp-1">{t(`cat.${project.propertyCategory}`) || project.propertyCategory}</span>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs hover:border-primary/50 transition-all hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold mb-1">{language === 'ar' ? 'عمر المشروع والحالة' : 'Age & Status'}</span>
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {Number(project.propertyAge) > 0 
                  ? `${project.propertyAge} ${language === 'ar' ? 'سنوات' : 'Years'}` 
                  : (language === 'ar' ? 'جديد كلياً' : 'Brand New')}
              </span>
            </div>

            <div className="bg-card/70 border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xs hover:border-primary/50 transition-all hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold mb-1">{language === 'ar' ? 'الفئة المعتمدة' : 'Tier Classification'}</span>
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {language === 'ar' ? 'مشروع ريادي' : 'Flagship Tier'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLUEPRINT SPECIFICATIONS (KEY-VALUE WITH ICONS) */}
      {project.detailsList && project.detailsList.length > 0 && (
        <section className="py-20 sm:py-28 relative bg-muted/20 border-y border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'المواصفات التفصيلية والمعايير' : 'Architectural Specifications'}
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                {language === 'ar' ? 'المواصفات الفنية والهندسية' : 'Signature Technical Details'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {project.detailsList.map((detail, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all flex items-center gap-4 shadow-2xs group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {renderIcon(detail.icon)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-muted-foreground mb-0.5 truncate">{detail.key}</p>
                    <p className="text-base font-extrabold text-foreground truncate">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CURATED LIFESTYLE & AMENITIES (FEATURES) */}
      {project.featuresList && project.featuresList.length > 0 && (
        <section className="py-20 sm:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'أسلوب الحياة والخدمات' : 'Curated Amenities & Lifestyle'}
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                {language === 'ar' ? 'المميزات والمرافق المتكاملة' : 'Exclusive Facilities & Amenities'}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {project.featuresList.map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-card/60 border border-border/70 hover:border-primary/50 transition-all flex items-center gap-3 shadow-2xs group hover:bg-card"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. IMMERSIVE VISUAL GALLERY & MEDIA TOUR */}
      <section className="py-20 sm:py-28 relative bg-card/40 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                {language === 'ar' ? 'المعرض البصري الكامل' : 'Visual Tour & Media Gallery'}
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight mt-1">
                {language === 'ar' ? 'استكشف المشروع بصرياً' : 'Experience Every Detail'}
              </h2>
            </div>
            
            <button
              onClick={() => openViewerAt(0)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-card hover:bg-muted border border-border shadow-xs transition cursor-pointer self-start sm:self-auto"
            >
              <Maximize2 className="w-4 h-4 text-primary" />
              <span>{language === 'ar' ? `عرض كل الصور (${images.length})` : `View All Media (${images.length})`}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((url, idx) => {
              const isVideo = url && (
                url.startsWith('data:video') || 
                url.endsWith('.mp4') || 
                url.endsWith('.mov') || 
                url.endsWith('.webm') || 
                url.endsWith('.avi')
              );

              return (
                <div 
                  key={idx}
                  onClick={() => openViewerAt(idx)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-muted border border-border/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {isVideo ? (
                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <img 
                      src={url} 
                      alt={`Project photo ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy"
                    />
                  )}

                  {/* Play badge for videos */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-black/80 backdrop-blur-xs text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'ar' ? 'عرض مكبّر' : 'Expand'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. ARCHITECTURAL FLOORPLAN / MASTERPLAN */}
      {project.floorplanUrl && (
        <section className="py-20 sm:py-28 relative bg-card/40 border-t border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'المخطط العام والتقسيم المعماري' : 'Masterplan & Architectural Layout'}
                </span>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight mt-1">
                  {language === 'ar' ? 'مخطط المشروع' : 'Project Floorplan'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={project.floorplanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-card hover:bg-muted border border-border shadow-xs transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>{language === 'ar' ? 'تحميل المخطط' : 'Download Plan'}</span>
                </a>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-md group">
              <div className="p-4 sm:p-8 flex items-center justify-center bg-muted/20">
                {project.floorplanUrl.endsWith('.pdf') || project.floorplanUrl.startsWith('data:application/pdf') ? (
                  <iframe 
                    src={project.floorplanUrl} 
                    className="w-full h-[520px] rounded-2xl border border-border"
                    title={language === 'ar' ? 'مخطط المشروع' : 'Project Floorplan'}
                  />
                ) : (
                  <img
                    src={project.floorplanUrl}
                    alt={language === 'ar' ? 'مخطط المشروع' : 'Project Floorplan'}
                    className="max-h-[580px] w-auto object-contain rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. LOCATION & ACCESSIBILITY */}
      {project.locationLink && (
        <section className="py-20 sm:py-24 relative border-t border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-8 sm:p-12 bg-card border border-border/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {language === 'ar' ? 'الموقع الاستراتيجي' : 'Prime Location'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {project.locationText || (language === 'ar' ? 'موقع متميز وحيوي' : 'Prime Strategic Location')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === 'ar' 
                    ? 'يقع المشروع في منطقة استراتيجية متصلة بأهم المحاور والطرق الرئيسية والخدمات الحيوية.'
                    : 'Strategically located with instant access to major highway corridors, vibrant business centers, and premier lifestyle amenities.'}
                </p>
              </div>

              <a 
                href={formatExternalLink(project.locationLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary h-12 px-8 rounded-full text-sm font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all shrink-0"
              >
                <MapPin className="w-4 h-4" />
                <span>{language === 'ar' ? 'عرض الموقع على خرائط Google' : 'View on Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 8. VIP CONSULTATION & INQUIRY FOOTER CTA */}
      <section className="py-24 relative bg-gradient-to-b from-background to-muted/40 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner border border-primary/20">
            <Award className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              {language === 'ar' ? 'مهتم بحجز أو استثمار في هذا المشروع الريادي؟' : 'Interested in Securing this Flagship Property?'}
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'فريقنا المتخصص مستعد لتقديم استشارة عقارية مفصلة وعرض كافة الفرص المتاحة في هذا الصرح.'
                : 'Our dedicated advisory team is ready to provide private consultations and comprehensive opportunity details.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto h-12 px-8 rounded-full text-sm font-bold bg-[#25D366] text-white hover:bg-[#20b858] transition flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              <span>{language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Consultation'}</span>
            </a>

            <a
              href={`tel:${callingNumber}`}
              className="w-full sm:w-auto h-12 px-8 rounded-full text-sm font-bold bg-card border border-border hover:bg-muted text-foreground transition flex items-center justify-center gap-2 shadow-xs hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>{language === 'ar' ? 'اتصال مباشر' : 'Direct Call'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FLOATING DYNAMIC ISLAND ACTION BAR ON SCROLL */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card/95 dark:bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-full px-3.5 py-2 flex items-center justify-between gap-4 max-w-md w-[calc(100vw-2rem)] sm:w-auto select-none"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-1 pl-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 text-start">
                <p className="text-xs font-extrabold text-foreground truncate max-w-[130px] sm:max-w-[190px]">{title}</p>
                <span className="text-[10px] text-primary font-semibold block leading-tight">{language === 'ar' ? 'مشروع ريادي' : 'Flagship Project'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {project.brochureUrl && (
                <a
                  href={project.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="h-8.5 px-3 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  title={language === 'ar' ? 'تحميل البروشور' : 'Download Brochure'}
                >
                  <FileDown className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">{language === 'ar' ? 'البروشور' : 'Brochure'}</span>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8.5 px-3.5 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#20b858] text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                <span>{language === 'ar' ? 'استفسار' : 'Inquire'}</span>
              </a>
              <a
                href={`tel:${callingNumber}`}
                className="w-8.5 h-8.5 rounded-full bg-card hover:bg-muted border border-border flex items-center justify-center text-foreground hover:text-primary transition shadow-2xs active:scale-95"
                title={language === 'ar' ? 'اتصال' : 'Call'}
              >
                <Phone className="w-4 h-4 text-primary" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox ImageViewer */}
      <ImageViewer
        isOpen={isViewerOpen}
        items={images.map((url: string) => ({
          type: (url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm') || url.endsWith('.avi')) ? 'video' : 'image',
          url
        }))}
        initialIndex={viewerInitialIndex}
        onClose={() => setIsViewerOpen(false)}
        language={language as 'ar' | 'en'}
      />
    </div>
  );
}
