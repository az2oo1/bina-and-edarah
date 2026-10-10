import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, KeySquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function About() {
  const { language, t } = useLanguage();
  const Arrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-foreground font-sans relative overflow-hidden">
      {/* Premium dark gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-all cursor-pointer bg-card/60 backdrop-blur-xs hover:bg-muted border border-border/80 px-4 py-2 rounded-full shadow-xs active:scale-[0.97] select-none"
        >
          {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5 text-primary" /> : <ArrowLeft className="w-3.5 h-3.5 text-primary" />}
          <span>{t('about.backToHome')}</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 select-none">
            {t('about.label')}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {t('about.title')}
          </h1>
          <p className="max-w-3xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            {t('about.intro')}
          </p>
        </div>

        {/* Detailed Brand Story */}
        <div className="bg-card/40 border border-border/60 rounded-2xl p-8 sm:p-10 mb-16 backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
            {t('about.companyTitle')}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
            <p>
              {t('about.story')}
            </p>
            <p>
              {t('about.services')}
            </p>
          </div>
        </div>

        {/* The Core Values, Mission, Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Vision Card */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-sky-400 transition-colors">
                {t('about.vision')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('about.visionDescription')}
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-amber-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {t('about.mission')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('about.missionDescription')}
              </p>
            </div>
          </div>

          {/* Values Card */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-md">
              <KeySquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 group-hover:text-sky-400 transition-colors">
                {t('about.values')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('about.valuesDescription')}
              </p>
            </div>
          </div>

        </div>

        {/* Call to action */}
        <div className="bg-muted/20 border border-border rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {t('about.ctaTitle')}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            {t('about.ctaDescription')}
          </p>
          <Link 
            to="/contact" 
            className="btn-primary px-6 h-11 text-xs font-bold rounded-lg shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t('about.contactUs')}</span>
            <Arrow className="w-4 h-4 text-white" />
          </Link>
        </div>

      </div>
    </div>
  );
}
