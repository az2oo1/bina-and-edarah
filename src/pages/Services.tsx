import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, ShieldCheck, MapPin, Hammer, KeySquare, Headphones, Layers, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function Services() {
  const { t, language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowRight : ArrowLeft;

  const fullServices = [
    {
      id: 'development',
      icon: <Hammer className="w-10 h-10" />,
      titleAr: 'تطوير وتسويق عقاري',
      titleEn: 'Real Estate Development & Marketing',
      descAr: 'نبتكر أساليب جديدة ومبتكرة في التطوير والتسويق العقاري لنوفر لعملائنا مساحات استثنائية تجمع بين الفخامة والعملية، مع ضمان تحقيق أعلى معايير الجودة والاستدامة والقيمة الاستثمارية المضافة.',
      descEn: 'We innovate new and creative methods in real estate development & marketing to provide exceptional spaces combining luxury and practicality, while ensuring the highest standards of quality, sustainability, and added investment value.',
      detailsAr: [
        'دراسات الجدوى وتحليل السوق العقاري بدقة.',
        'تخطيط وتصميم المشاريع السكنية والتجارية العصرية.',
        'إدارة عمليات الإنشاء والتشطيب بأعلى معايير الجودة.',
        'حملات تسويقية متكاملة ومستهدفة لسرعة البيع والـتأجير.',
        'إدارة قنوات البيع وخدمة العملاء المحترفة.'
      ],
      detailsEn: [
        'Detailed feasibility studies and precise market analysis.',
        'Planning and designing modern residential & commercial projects.',
        'Managing construction and finishing with the highest quality standards.',
        'Integrated, targeted marketing campaigns for rapid sales and leasing.',
        'Managing sales channels and professional customer service.'
      ],
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      border: 'border-blue-100/60 dark:border-blue-500/20',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'leasing',
      icon: <KeySquare className="w-10 h-10" />,
      titleAr: 'تأجير ومبيعات',
      titleEn: 'Leasing & Sales',
      descAr: 'نوفر باقة واسعة من العقارات المميزة في أرقى الأحياء السكنية والتجارية بمدينة الرياض، ونعمل من خلال فريق مبيعات محترف يمتلك معرفة عميقة بالسوق لضمان إتمام صفقاتك بكل سلاسة وأمان.',
      descEn: 'We provide a wide array of premium properties in Riyadh\'s finest residential and commercial neighborhoods, working through a professional sales team with deep market knowledge to ensure smooth and secure transactions.',
      detailsAr: [
        'عرض وتسويق العقارات المتاحة للبيع أو الإيجار.',
        'تنظيم ومعاينة العقارات مع العملاء المحتملين.',
        'صياغة العقود وتوثيقها عبر المنصات المعتمدة (مثل إيجار).',
        'مساعدة المشترين في الحصول على أفضل الحلول التمويلية.',
        'تقديم خيارات سكنية وتجارية متنوعة تلبي كافة الميزانيات.'
      ],
      detailsEn: [
        'Listing and marketing available properties for sale or rent.',
        'Organizing property tours and viewings with prospective clients.',
        'Drafting and documenting contracts through approved platforms (e.g. Ejar).',
        'Assisting buyers in acquiring the best financing solutions.',
        'Offering diverse residential & commercial options to fit all budgets.'
      ],
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      border: 'border-emerald-100/60 dark:border-emerald-500/20',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'management',
      icon: <Building2 className="w-10 h-10" />,
      titleAr: 'إدارة أملاك احترافية',
      titleEn: 'Property Management',
      descAr: 'إدارة أملاك احترافية ومتكاملة تضمن لك راحة البال وتحقيق أعلى العوائد الاستثمارية المستهدفة، من خلال المتابعة المستمرة والصيانة الدورية والعلاقات المستدامة والمنظمة مع المستأجرين.',
      descEn: 'Professional and integrated property management ensuring peace of mind and maximizing target investment returns through continuous follow-ups, regular maintenance, and sustainable tenant relationships.',
      detailsAr: [
        'تحصيل الإيجارات وإيداعها وتوريدها للملاك بدقة.',
        'المتابعة المستمرة مع المستأجرين وتلبية متطلباتهم القانونية.',
        'تنفيذ أعمال الصيانة الدورية والوقائية للحفاظ على قيمة العقار.',
        'إدارة وتشغيل الخدمات المشتركة (النظافة، الحراسة، المياه والكهرباء).',
        'إعداد تقارير دورية مالية وفنية مفصلة لأداء العقار.'
      ],
      detailsEn: [
        'Collecting rents, depositing, and transferring them to owners accurately.',
        'Continuous follow-ups with tenants and addressing legal requirements.',
        'Executing regular and preventative maintenance to preserve property value.',
        'Operating and managing shared utilities (cleaning, security, water, and power).',
        'Preparing detailed periodic financial and technical property performance reports.'
      ],
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      border: 'border-amber-100/60 dark:border-amber-500/20',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'consulting',
      icon: <Headphones className="w-10 h-10" />,
      titleAr: 'استشارات عقارية مدروسة',
      titleEn: 'Real Estate Consulting',
      descAr: 'نضع خبرتنا العميقة بالسوق العقاري بين يديك لتقديم استشارات دقيقة وموثوقة بناءً على أحدث التحليلات والتوجهات، لتمكينك من اتخاذ قرارات استثمارية سكنية وتجارية مدروسة ومربحة.',
      descEn: 'We put our deep real estate expertise at your service, providing accurate and reliable consultation based on current market trends to enable you to make calculated, profitable residential and commercial decisions.',
      detailsAr: [
        'تقييم الفرص الاستثمارية وتقدير العوائد المتوقعة.',
        'تحليل المخاطر وتجنب التعثر المالي في المشاريع.',
        'توجيه المستثمرين نحو أفضل مناطق النمو الجغرافي بالرياض.',
        'استشارات التمويل وهيكلة الاستحواذات العقارية.',
        'تحليل أفضل الاستخدامات للأراضي والعقارات القائمة.'
      ],
      detailsEn: [
        'Evaluating investment opportunities and estimating expected returns.',
        'Analyzing risks to prevent financial distress in projects.',
        'Guiding investors toward high-growth geographical zones in Riyadh.',
        'Advising on real estate financing and acquisition structures.',
        'Analyzing the highest and best use for land and existing assets.'
      ],
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      border: 'border-indigo-100/60 dark:border-indigo-500/20',
      color: 'text-indigo-600 dark:text-indigo-400',
    }
  ];

  return (
    <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 text-foreground font-sans relative overflow-hidden">
      {/* Dynamic light glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <Arrow className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 select-none">
            {language === 'ar' ? 'خدماتنا العقارية' : 'OUR SERVICES'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {language === 'ar' ? 'حلول عقارية متكاملة وموثوقة' : 'Comprehensive & Reliable Real Estate Services'}
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            {language === 'ar' 
              ? 'نهدف في شركة بناء وإدارة إلى مساعدة الملاك والمستأجرين في تحقيق أهدافهم العقارية والاستثمارية بأعلى معايير المهنية.' 
              : 'At Benaa & Edara, we aim to assist owners and tenants in achieving their real estate and investment goals with the highest professional standards.'}
          </p>
        </div>

        {/* Detailed Solutions Grid */}
        <div className="space-y-12">
          {fullServices.map((service, idx) => (
            <div 
              key={service.id} 
              className={`bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row gap-8 items-start transition-all hover:shadow-md`}
            >
              {/* Icon Container */}
              <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${service.bg} border ${service.border} ${service.color} flex items-center justify-center shadow-xs`}>
                {service.icon}
              </div>

              {/* Text Info */}
              <div className="flex-1 space-y-4 text-right rtl:text-right ltr:text-left">
                <h3 className="text-xl font-bold text-foreground">
                  {language === 'ar' ? service.titleAr : service.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                  {language === 'ar' ? service.descAr : service.descEn}
                </p>

                {/* Features List */}
                <div className="pt-4 border-t border-border/60">
                  <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">
                    {language === 'ar' ? 'تفاصيل الخدمة والحلول المقدمة:' : 'Service details and solutions:'}
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground list-disc list-inside font-semibold">
                    {(language === 'ar' ? service.detailsAr : service.detailsEn).map((detail, dIdx) => (
                      <li key={dIdx} className="leading-relaxed hover:text-foreground transition-colors">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 bg-muted/20 border border-border rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {language === 'ar' ? 'هل تود الاستفسار عن أحد الحلول؟' : 'Interested in one of our solutions?'}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            {language === 'ar' 
              ? 'مستشارونا العقاريون في أتم الاستعداد لتقديم التفاصيل والرد على أي تساؤلات تناسب تطلعاتك.' 
              : 'Our real estate consultants are ready to supply all details and answer any questions to fit your expectations.'}
          </p>
          <Link 
            to="/contact" 
            className="btn-primary px-6 h-11 text-xs font-bold rounded-lg shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'طلب استشارة عقارية' : 'Request Consultation'}</span>
            <Arrow className="w-4 h-4 text-white" />
          </Link>
        </div>

      </div>
    </div>
  );
}
