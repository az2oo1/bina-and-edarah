import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.projects': 'مشاريعنا',
    'nav.properties': 'عقارات للبيع أو الإيجار',
    'nav.admin': 'لوحة الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.dashboard': 'لوحة التحكم',
    'nav.logout': 'تسجيل خروج',
    'about.backToHome': 'العودة للرئيسية',
    'about.label': 'عن الشركة',
    'about.title': 'التميز في التطوير العقاري وإدارة الأملاك',
    'about.intro': 'نعمل في شركة بناء وإدارة العقارية على تقديم خدمات عقارية متكاملة تشمل التطوير وإدارة الأملاك والاستشارات العقارية وفق أعلى معايير الجودة والمهنية لتلبية تطلعات عملائنا في المملكة.',
    'about.companyTitle': 'عن شركة بناء وإدارة العقارية',
    'about.story': 'تأسست شركة بناء وإدارة العقارية في قلب العاصمة الرياض لتكون شريكاً عقارياً موثوقاً وملبيًا لتطلعات التطوير العقاري الحديث في المملكة العربية السعودية. على مر السنوات، نجحنا في تطوير وإدارة باقة من أرقى المشاريع السكنية والتجارية التي تلبي تطلعات الباحثين عن الفخامة والعملية والاستقرار الاستثماري.',
    'about.services': 'نحن نوفر حلولاً عقارية متكاملة تشمل التطوير والتسويق، والتأجير والمبيعات، وإدارة الأملاك الاحترافية، والتقييم والاستشارات المدروسة. يقود أعمالنا فريق من الخبراء المحترفين والكوادر الوطنية المؤهلة لضمان جودة الأداء وتحقيق عوائد استثمارية مستهدفة لشركائنا وعملائنا.',
    'about.vision': 'رؤيتنا',
    'about.visionDescription': 'أن نكون الشريك العقاري المفضل في خدمات التطوير وإدارة الأملاك على مستوى المملكة.',
    'about.mission': 'رسالتنا',
    'about.missionDescription': 'تقديم خدمات عقارية موثوقة تلبي احتياجات عملائنا وتحافظ على القيمة الاستثمارية لأملاكهم.',
    'about.values': 'قيمنا',
    'about.valuesDescription': 'الالتزام التام بالمهنية والشفافية وبناء علاقات طويلة الأمد مع الملاك والمستأجرين.',
    'about.ctaTitle': 'هل لديك أي استفسار عقاري؟',
    'about.ctaDescription': 'يسعدنا دائماً تواصلك معنا والإجابة على متطلباتك العقارية بكافة تفاصيلها.',
    'about.contactUs': 'تواصل معنا الآن',
    'hero.title': 'بناء وإدارة العقارية',
    'hero.subtitle': 'شريكك الموثوق في التطوير العقاري، التسويق، وإدارة الأملاك بمدينة الرياض.',
    'common.sale': 'للبيع',
    'common.rent': 'للإيجار',
    'common.price': 'قيمة العقار',
    'common.basePrice': 'السعر الأساسي',
    'common.currency': 'ر.س',
    'common.yearly': 'سنوي',
    'common.monthly': 'شهري',
    'common.viewAqar': 'عرض في عقار',
    'common.whatsapp': 'واتساب',
    'common.call': 'اتصال',
    'common.location': 'قوقل ماب',
    'common.locationText': 'الحي / الموقع',
    'common.area': 'المساحة',
    'common.sqm': 'م²',
    'common.features': 'المميزات',
    'common.propertyAge': 'عمر العقار (سنوات)',
    'common.electricityCost': 'تكلفة الكهرباء',
    'common.commission': 'العمولة',
    'common.vat': 'ضريبة القيمة المضافة',
    'common.vatNotApplicable': 'غير مشمول',
    'common.totalCost': 'السعر الإجمالي',
    'cat.VILLA': 'فيلا',
    'cat.APARTMENT': 'شقة',
    'cat.LAND': 'أرض',
    'cat.OFFICE': 'مكتب',
    'cat.SHOP': 'معرض/محل',
    'cat.BUILDING': 'عمارة',
    'cat.WAREHOUSE': 'مستودع',
    'cat.COMPOUND': 'مجمع سكني',
    'cat.RESORT': 'منتجع',
    'cat.HOTEL': 'فندق',
    'cat.TOWER': 'برج',
    'cat.FARM': 'مزرعة / شاليه',
    'cat.HOSPITAL': 'مركز طبي / مستشفى',
    'cat.MALL': 'مول / مركز تسوق',
    'cat.ROOM': 'غرفة',
    'admin.title': 'لوحة الإدارة',
    'admin.settings': 'الإعدادات',
    'admin.addProperty': 'إضافة عقار',
    'admin.manageProperties': 'إدارة العقارات',
    'admin.propertiesList': 'قائمة العقارات',
    'admin.deleteProperty': 'حذف',
    'admin.deleteConfirm': 'هل أنت متأكد من حذف هذا العقار؟',
    'admin.placeholder.titleAr': 'العنوان (عربي)',
    'admin.placeholder.titleEn': 'العنوان (إنجليزي)',
    'admin.placeholder.desc': 'الوصف',
    'admin.placeholder.price': 'السعر',
    'admin.placeholder.category': 'نوع العقار',
    'admin.placeholder.paymentFrequency': 'دورية الدفع',
    'admin.placeholder.area': 'المساحة (م²)',
    'admin.placeholder.locationText': 'الحي / اسم الموقع',
    'admin.placeholder.locationLink': 'رابط الموقع (خرائط جوجل)',
    'admin.placeholder.features': 'المميزات (مفصولة بفاصلة)',
    'admin.placeholder.propertyAge': 'عمر العقار (أدخل 0 للجديد)',
    'admin.placeholder.age': 'عمر العقار (سنوات)',
    'admin.placeholder.electricityCost': 'تكلفة الكهرباء',
    'admin.placeholder.electricityFrequency': 'دورية الكهرباء (شهري/سنوي)',
    'admin.placeholder.vat': 'ضريبة القيمة المضافة',
    'admin.placeholder.vatNotApplicable': 'غير خاضع للضريبة ✓',
    'admin.placeholder.commission': 'نسبة أو مبلغ العمولة',
    'admin.placeholder.imageUrl': 'رابط الصورة',
    'admin.placeholder.images': 'صور العقار',
    'admin.placeholder.imagesDesc': 'يمكنك رفع صور متعددة',
    'admin.placeholder.aqarLink': 'رابط عقار',
    'admin.placeholder.whatsapp': 'رقم الواتساب',
    'admin.submit': 'حفظ',
    'admin.propertiesEmpty': 'لا توجد عقارات حالياً. قم بإضافة عقار جديد.',
  },
  en: {
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.properties': 'Properties',
    'nav.admin': 'Admin Panel',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'about.backToHome': 'Back to Home',
    'about.label': 'ABOUT US',
    'about.title': 'Excellence in Real Estate Development & Property Management',
    'about.intro': 'At Benaa & Edara Real Estate, we provide integrated property development, management, and consulting services according to the highest quality and professional standards to meet our clients\' goals in the Kingdom.',
    'about.companyTitle': 'About Benaa & Edara Real Estate',
    'about.story': 'Benaa & Edara Real Estate was established in the heart of Riyadh to be a trusted real estate partner, meeting the aspirations of modern real estate development in the Kingdom of Saudi Arabia. Over the years, we have successfully developed and managed a portfolio of premium residential and commercial projects that meet the aspirations of those seeking luxury, practicality, and investment stability.',
    'about.services': 'We offer integrated real estate solutions including development and marketing, sales and leasing, professional property management, and well-considered valuation and consulting. Our work is led by a team of professional experts and qualified national talent to ensure quality performance and achieve targeted investment returns for our partners and clients.',
    'about.vision': 'Our Vision',
    'about.visionDescription': 'To be the preferred real estate partner for development and property management services across the Kingdom.',
    'about.mission': 'Our Mission',
    'about.missionDescription': 'Providing reliable real estate services that meet our clients\' needs and preserve the investment value of their assets.',
    'about.values': 'Our Values',
    'about.valuesDescription': 'Total commitment to professionalism, transparency, and building long-term relationships with owners and tenants.',
    'about.ctaTitle': 'Have any real estate inquiry?',
    'about.ctaDescription': 'We are always glad to connect and assist you with your real estate needs and aspirations.',
    'about.contactUs': 'Contact Us Now',
    'hero.title': 'Benaa and Edara Real Estate',
    'hero.subtitle': 'Your trusted partner in property development, marketing, and asset management in Riyadh.',
    'common.sale': 'For Sale',
    'common.rent': 'For Rent',
    'common.price': 'Price',
    'common.basePrice': 'Base Price',
    'common.currency': 'SR',
    'common.yearly': 'Yearly',
    'common.monthly': 'Monthly',
    'common.viewAqar': 'View on Aqar',
    'common.whatsapp': 'WhatsApp',
    'common.call': 'Phone Call',
    'common.location': 'Google Maps',
    'common.locationText': 'Location / Neighborhood',
    'common.area': 'Area',
    'common.sqm': 'sqm',
    'common.features': 'Features',
    'common.propertyAge': 'Age (Years)',
    'common.electricityCost': 'Electricity Cost',
    'common.commission': 'Office Commission',
    'common.vat': 'VAT',
    'common.vatNotApplicable': 'Not Applicable',
    'common.totalCost': 'Total Cost',
    'cat.VILLA': 'Villa',
    'cat.APARTMENT': 'Apartment',
    'cat.LAND': 'Land',
    'cat.OFFICE': 'Office',
    'cat.SHOP': 'Shop',
    'cat.BUILDING': 'Building',
    'cat.WAREHOUSE': 'Warehouse',
    'cat.COMPOUND': 'Compound',
    'cat.RESORT': 'Resort',
    'cat.HOTEL': 'Hotel',
    'cat.TOWER': 'Tower',
    'cat.FARM': 'Farm / Chalet',
    'cat.HOSPITAL': 'Medical Center / Hospital',
    'cat.MALL': 'Mall / Shopping Center',
    'cat.ROOM': 'Room',
    'admin.title': 'Admin Dashboard',
    'admin.settings': 'Settings',
    'admin.addProperty': 'Add Property',
    'admin.manageProperties': 'Manage Properties',
    'admin.propertiesList': 'Properties List',
    'admin.deleteProperty': 'Delete',
    'admin.deleteConfirm': 'Are you sure you want to delete this property?',
    'admin.placeholder.titleAr': 'Title (Arabic)',
    'admin.placeholder.titleEn': 'Title (English)',
    'admin.placeholder.desc': 'Description',
    'admin.placeholder.price': 'Price',
    'admin.placeholder.category': 'Property Category',
    'admin.placeholder.paymentFrequency': 'Payment Frequency',
    'admin.placeholder.area': 'Area (sqm)',
    'admin.placeholder.locationText': 'Location / Neighborhood Name',
    'admin.placeholder.locationLink': 'Location Link (Google Maps)',
    'admin.placeholder.features': 'Features (comma separated)',
    'admin.placeholder.propertyAge': 'Property Age (0 for new)',
    'admin.placeholder.age': 'Property Age (Years)',
    'admin.placeholder.electricityCost': 'Electricity Cost',
    'admin.placeholder.electricityFrequency': 'Electricity Frequency (Monthly/Yearly)',
    'admin.placeholder.vat': 'VAT Amount',
    'admin.placeholder.vatNotApplicable': 'VAT Not Applicable ✓',
    'admin.placeholder.commission': 'Office Commission',
    'admin.placeholder.imageUrl': 'Image URL',
    'admin.placeholder.images': 'Property Images',
    'admin.placeholder.imagesDesc': 'Upload multiple images',
    'admin.placeholder.aqarLink': 'Aqar Link',
    'admin.placeholder.whatsapp': 'WhatsApp Number',
    'admin.submit': 'Save',
    'admin.propertiesEmpty': 'No properties found. Add a new property.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = React.useCallback(() => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const t = React.useCallback(
    (key: string) => {
      return translations[language][key] || key;
    },
    [language]
  );

  const value = React.useMemo(
    () => ({ language, toggleLanguage, t }),
    [language, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
