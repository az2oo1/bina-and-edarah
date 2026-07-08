import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, KeySquare, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

export default function About() {
  const { language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-foreground font-sans relative overflow-hidden">
      {/* Premium dark gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors select-none">
          <Arrow className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ar' ? 'من نحن' : 'Who We Are'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ar' ? 'نبتكر آفاقاً جديدة للمعيشة والاستثمار' : 'Creating New Horizons for Living & Investing'}
          </h1>
          <p className="max-w-3xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            {language === 'ar' 
              ? 'في شركة بناء وإدارة العقارية، نؤمن بأن العقار ليس مجرد بناء، بل هو مساحة لصناعة المستقبل وفرصة استثمارية واعدة. نحن ندمج التخطيط الاستراتيجي مع الجودة العالية لنلبي كافة متطلبات عملائنا.'
              : 'At Benaa & Edara Real Estate, we believe that property is not just a structure, but a space to create the future and a promising investment opportunity. We merge strategic planning with high quality to meet all our clients\' needs.'}
          </p>
        </div>

        {/* Detailed Brand Story */}
        <div className="bg-card/40 border border-border/60 rounded-2xl p-8 sm:p-10 mb-16 backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            {language === 'ar' ? 'بناء وإدارة العقارية: قصة تميز' : 'Benaa & Edara Real Estate: A Story of Excellence'}
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
            <p>
              {language === 'ar'
                ? 'تأسست شركة بناء وإدارة العقارية في قلب العاصمة الرياض لتكون شريكاً عقارياً موثوقاً وملبيًا لتطلعات التطوير العقاري الحديث في المملكة العربية السعودية. على مر السنوات، نجحنا في تطوير وإدارة باقة من أرقى المشاريع السكنية والتجارية التي تلبي تطلعات الباحثين عن الفخامة والعملية والاستقرار الاستثماري.'
                : 'Benaa & Edara Real Estate was established in the heart of Riyadh to be a trusted real estate partner, meeting the aspirations of modern real estate development in the Kingdom of Saudi Arabia. Over the years, we have successfully developed and managed a portfolio of premium residential and commercial projects.'}
            </p>
            <p>
              {language === 'ar'
                ? 'نحن نوفر حلولاً عقارية متكاملة تشمل التطوير والتسويق، والتأجير والمبيعات، وإدارة الأملاك الاحترافية، والتقييم والاستشارات المدروسة. يقود أعمالنا فريق من الخبراء المحترفين والكوادر الوطنية المؤهلة لضمان جودة الأداء وتحقيق عوائد استثمارية مستهدفة لشركائنا وعملائنا.'
                : 'We offer integrated real estate solutions including development & marketing, sales & leasing, professional property management, and calculated consulting. Our work is driven by a team of professional experts to guarantee execution quality.'}
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
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' 
                  ? 'أن نكون الخيار الأول والملهم في التطوير والإدارة العقارية المبتكرة في المملكة.' 
                  : 'To be the premier and inspiring choice for innovative real estate development and management in the Kingdom.'}
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-amber-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' 
                  ? 'تقديم حلول عقارية متكاملة ومستدامة تلبي تطلعات عملائنا وترتقي بجودة الحياة اليومية.' 
                  : 'Providing integrated, sustainable real estate solutions that meet client expectations and enhance quality of life.'}
              </p>
            </div>
          </div>

          {/* Values Card */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border border-border hover:border-sky-500/20 backdrop-blur-lg hover:bg-card/[0.04] transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shadow-md">
              <KeySquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                {language === 'ar' ? 'قيمنا' : 'Our Values'}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {language === 'ar' 
                  ? 'الالترام التام بالشفافية والابتكار المستمر وبناء شراكات حقيقية طويلة الأمد.' 
                  : 'Total commitment to transparency, continuous innovation, and building long-term partnerships.'}
              </p>
            </div>
          </div>

        </div>

        {/* Call to action */}
        <div className="bg-muted/20 border border-border rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-2">
            {language === 'ar' ? 'هل لديك أي استفسار عقاري؟' : 'Have any real estate inquiry?'}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            {language === 'ar' 
              ? 'يسعدنا دائماً تواصلك معنا والإجابة على متطلباتك العقارية بكافة تفاصيلها.' 
              : 'We are always glad to connect and assist you with your real estate needs and aspirations.'}
          </p>
          <Link 
            to="/contact" 
            className="btn-primary px-6 h-11 text-xs font-bold rounded-lg shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}</span>
            <Arrow className="w-4 h-4 text-white" />
          </Link>
        </div>

      </div>
    </div>
  );
}
