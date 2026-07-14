import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Loader2, MapPin, Maximize2, Calendar, Building2, ChevronRight, ChevronLeft, Sparkles, Ruler } from 'lucide-react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  tier: string;
  propertyCategory: string;
  area: number;
  details?: string;
  locationLink?: string;
  locationText?: string;
  description: string;
  features?: string;
  propertyAge: number;
  imageUrls: string; // JSON
}

export default function Projects() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBigIndex, setActiveBigIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const bigProjects = projects.filter(p => p.tier === 'BIG');
  const midProjects = projects.filter(p => p.tier === 'MID');
  const otherProjects = projects.filter(p => p.tier === 'OTHER');

  // Auto scroll featured carousel (BIG projects) every 7 seconds
  useEffect(() => {
    if (bigProjects.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveBigIndex((prev) => (prev + 1) % bigProjects.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [bigProjects.length]);

  const getFirstImage = (imageUrlsStr: string) => {
    try {
      const urls = JSON.parse(imageUrlsStr || '[]');
      return urls.length > 0 ? urls[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';
    } catch {
      return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop';
    }
  };

  const handleNextBig = () => {
    setDirection(1);
    setActiveBigIndex((prev) => (prev + 1) % bigProjects.length);
  };

  const handlePrevBig = () => {
    setDirection(-1);
    setActiveBigIndex((prev) => (prev - 1 + bigProjects.length) % bigProjects.length);
  };

  // Stagger entry configurations
  const listContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 120, 
        damping: 18 
      } 
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Premium Header Banner with Decorative Dots & Glows */}
      <div className="border-b border-border py-16 relative overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Soft blurred background color glows */}
          <div className="absolute -top-10 left-1/4 w-[400px] h-[400px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-indigo-400/8 dark:bg-indigo-500/8 rounded-full blur-[90px] pointer-events-none"></div>
          
          {/* Dots Grid Pattern (Subtle & Elegant 1px) */}
          <div className="absolute inset-0 text-slate-300/30 dark:text-slate-800/20" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-foreground"
          >
            {t('nav.projects')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
            className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {language === 'ar' 
              ? 'مجموعة من أبرز المشاريع التي قمنا بتطويرها وإدارتها لتشكل علامة فارقة في السوق العقاري.' 
              : 'A collection of the most prominent projects we have developed and managed to set a benchmark in the real estate market.'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm font-medium">
            {language === 'ar' ? 'لا توجد مشاريع مضافة حالياً' : 'No projects available currently'}
          </div>
        ) : (
          <div className="space-y-20">
            {/* TIER 1: BIG - FEATURED SPOTLIGHT CAROUSEL */}
            {bigProjects.length > 0 && (
              <section className="relative">
                <div className="flex items-center justify-between mb-6 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-amber-500/10 text-amber-500 rounded-lg">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground Cairo">
                      {language === 'ar' ? 'مشاريعنا الريادية' : 'Flagship Projects'}
                    </h2>
                  </div>
                  {bigProjects.length > 1 && (
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevBig}
                        className="p-1.5 rounded-lg border border-border bg-card/50 text-foreground hover:bg-accent transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextBig}
                        className="p-1.5 rounded-lg border border-border bg-card/50 text-foreground hover:bg-accent transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Main Carousel Wrapper */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card/30 backdrop-blur-md shadow-2xl p-4 sm:p-6 lg:p-8">
                  {/* Spotlight background lights */}
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                    {/* Carousel Left/Right Media Panel (7 cols) */}
                    <div className="lg:col-span-7 h-[260px] sm:h-[400px] rounded-2xl overflow-hidden relative shadow-lg group bg-muted border border-border/40">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={activeBigIndex}
                          custom={direction}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                          className="absolute inset-0 w-full h-full"
                        >
                          <img 
                            src={getFirstImage(bigProjects[activeBigIndex].imageUrls)} 
                            alt={language === 'ar' ? bigProjects[activeBigIndex].titleAr : bigProjects[activeBigIndex].titleEn}
                            className="w-full h-full object-cover select-none pointer-events-none"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Glassmorphic Project Title Card Overlay for Mobile */}
                      <div className="absolute bottom-4 left-4 right-4 bg-card/75 backdrop-blur-md border border-border/50 rounded-xl p-4 block lg:hidden shadow-lg">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 mb-1 block">
                          {language === 'ar' ? 'مشروع ريادي متميز' : 'Featured Masterpiece'}
                        </span>
                        <h3 className="text-lg font-bold text-foreground line-clamp-1 mb-1">
                          {language === 'ar' ? bigProjects[activeBigIndex].titleAr : bigProjects[activeBigIndex].titleEn}
                        </h3>
                        <p className="text-xs text-muted-foreground/90 font-medium line-clamp-1 mb-2">
                          {bigProjects[activeBigIndex].locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}
                        </p>
                        <Link 
                          to={`/projects/${bigProjects[activeBigIndex].id}`}
                          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline justify-end"
                        >
                          <span>{language === 'ar' ? 'استكشف المشروع' : 'Explore Project'}</span>
                          {language === 'ar' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </Link>
                      </div>
                    </div>

                    {/* Carousel Details Panel (5 cols) - Shown on Desktop */}
                    <div className="lg:col-span-5 h-full flex flex-col justify-between py-2 text-right rtl:text-right ltr:text-left hidden lg:flex">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={activeBigIndex}
                          custom={direction}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                          className="flex flex-col h-full"
                        >
                          <div className="mb-4">
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 mb-3">
                              <Sparkles className="w-3 h-3" />
                              {language === 'ar' ? 'مشروع ريادي' : 'Featured Project'}
                            </span>
                            <h3 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight Cairo mb-2">
                              {language === 'ar' ? bigProjects[activeBigIndex].titleAr : bigProjects[activeBigIndex].titleEn}
                            </h3>
                            <div className="flex items-center text-muted-foreground gap-1 text-xs mb-4">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                              <span>{bigProjects[activeBigIndex].locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}</span>
                            </div>
                          </div>

                          {/* Quick Specs Grid */}
                          <div className="grid grid-cols-3 gap-3 mb-5">
                            <div className="bg-background/80 border border-border/50 rounded-xl p-3 text-center flex flex-col items-center justify-center shadow-xs">
                              <Maximize2 className="w-4 h-4 text-primary mb-1.5" />
                              <span className="text-[9px] text-muted-foreground mb-0.5">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                              <span className="text-xs font-bold text-foreground">{bigProjects[activeBigIndex].area} م²</span>
                            </div>
                            <div className="bg-background/80 border border-border/50 rounded-xl p-3 text-center flex flex-col items-center justify-center shadow-xs">
                              <Building2 className="w-4 h-4 text-primary mb-1.5" />
                              <span className="text-[9px] text-muted-foreground mb-0.5">{language === 'ar' ? 'النوع' : 'Type'}</span>
                              <span className="text-xs font-bold text-foreground truncate max-w-full">
                                {t(`cat.${bigProjects[activeBigIndex].propertyCategory}`) || bigProjects[activeBigIndex].propertyCategory}
                              </span>
                            </div>
                            <div className="bg-background/80 border border-border/50 rounded-xl p-3 text-center flex flex-col items-center justify-center shadow-xs">
                              <Calendar className="w-4 h-4 text-primary mb-1.5" />
                              <span className="text-[9px] text-muted-foreground mb-0.5">{language === 'ar' ? 'العمر' : 'Age'}</span>
                              <span className="text-xs font-bold text-foreground">
                                {bigProjects[activeBigIndex].propertyAge > 0 
                                  ? `${bigProjects[activeBigIndex].propertyAge} ${language === 'ar' ? 'سنة' : 'Yrs'}`
                                  : (language === 'ar' ? 'جديد' : 'New')}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed text-muted-foreground mb-6 line-clamp-4 flex-grow">
                            {bigProjects[activeBigIndex].description}
                          </p>

                          <div className="mt-auto">
                            <Link 
                              to={`/projects/${bigProjects[activeBigIndex].id}`}
                            >
                              <motion.span
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full btn-primary text-xs font-bold gap-1.5 shadow-md flex items-center justify-center h-10 select-none"
                              >
                                {language === 'ar' ? 'عرض تفاصيل المشروع' : 'View Project Details'}
                                {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </motion.span>
                            </Link>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Carousel Pill Indicators at bottom */}
                  {bigProjects.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-4 lg:mt-6">
                      {bigProjects.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDirection(idx > activeBigIndex ? 1 : -1);
                            setActiveBigIndex(idx);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === activeBigIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/60'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* TIER 2: MID - EDITORIAL HORIZONTAL CARDS */}
            {midProjects.length > 0 && (
              <section className="space-y-6">
                <div className="border-b border-border/60 pb-3 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground Cairo">
                    {language === 'ar' ? 'مشاريع سكنية وتجارية مميزة' : 'Featured Residential & Commercial'}
                  </h2>
                </div>

                <motion.div 
                  variants={listContainerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="space-y-6"
                >
                  {midProjects.map((project, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <motion.div
                        key={project.id}
                        variants={listItemVariants}
                        className={`flex flex-col lg:flex-row ${
                          isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                        } rounded-2xl border border-border bg-card/40 backdrop-blur-xs overflow-hidden group hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative`}
                      >
                        {/* Image Panel (45% on desktop) */}
                        <div className="lg:w-[45%] h-[220px] sm:h-[280px] overflow-hidden bg-muted relative border-b lg:border-b-0 border-border/40">
                          <img 
                            src={getFirstImage(project.imageUrls)} 
                            alt={language === 'ar' ? project.titleAr : project.titleEn}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none"
                          />
                        </div>

                        {/* Content Panel (55% on desktop) */}
                        <div className="lg:w-[55%] p-6 sm:p-8 flex flex-col justify-between text-right rtl:text-right ltr:text-left">
                          <div>
                            <div className="flex items-center justify-between mb-3.5">
                              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/15">
                                {t(`cat.${project.propertyCategory}`) || project.propertyCategory}
                              </span>
                              <div className="flex items-center text-muted-foreground gap-1 text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                                <span>{project.locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors Cairo leading-snug">
                              {language === 'ar' ? project.titleAr : project.titleEn}
                            </h3>
                            
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/80">
                              <span className="flex items-center gap-1">
                                <Maximize2 className="w-3.5 h-3.5 text-muted-foreground/75" />
                                {project.area} م²
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-muted-foreground/75" />
                                {project.propertyAge > 0 
                                  ? `${project.propertyAge} ${language === 'ar' ? 'سنوات' : 'Years'}`
                                  : (language === 'ar' ? 'جديد' : 'New')}
                              </span>
                            </div>

                            <Link 
                              to={`/projects/${project.id}`}
                              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline select-none"
                            >
                              <span>{language === 'ar' ? 'عرض التفاصيل' : 'Details'}</span>
                              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </section>
            )}

            {/* TIER 3: OTHER - COMPACT GRID */}
            {otherProjects.length > 0 && (
              <section className="space-y-6">
                <div className="border-b border-border/60 pb-3 flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-muted-foreground/40 rounded-full"></div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground Cairo">
                    {language === 'ar' ? 'مشاريع إضافية' : 'More Projects'}
                  </h2>
                </div>

                <motion.div 
                  variants={listContainerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {otherProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={listItemVariants}
                      whileHover={{ y: -3 }}
                      className="shadcn-card bg-card/40 backdrop-blur-xs hover:bg-card/70 border border-border rounded-xl overflow-hidden group shadow-sm transition-all duration-300 flex flex-col h-full"
                    >
                      <Link to={`/projects/${project.id}`} className="flex flex-col h-full">
                        {/* Card Image */}
                        <div className="relative h-44 overflow-hidden bg-muted border-b border-border/30">
                          <img 
                            src={getFirstImage(project.imageUrls)} 
                            alt={language === 'ar' ? project.titleAr : project.titleEn}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 select-none"
                          />
                          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                            <span className="bg-background/95 backdrop-blur-md text-[9px] font-bold text-muted-foreground px-2 py-0.5 rounded border border-border shadow-sm">
                              {t(`cat.${project.propertyCategory}`) || project.propertyCategory}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 Cairo mb-1.5">
                              {language === 'ar' ? project.titleAr : project.titleEn}
                            </h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto text-[10px] text-muted-foreground font-semibold">
                            <span className="flex items-center gap-0.5">
                              <Maximize2 className="w-3 h-3 text-muted-foreground/60" />
                              {project.area} م²
                            </span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
                              <span className="truncate max-w-[90px]">{project.locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

