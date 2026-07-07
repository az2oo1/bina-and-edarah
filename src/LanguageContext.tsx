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
    'hero.title': 'بناء وإدارة العقارية',
    'hero.subtitle': 'نحن نقدم أفضل الخدمات العقارية وتطوير وإدارة الأملاك برؤية احترافية.',
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
    'admin.placeholder.electricityCost': 'تكلفة الكهرباء',
    'admin.placeholder.electricityFrequency': 'دورية الكهرباء (شهري/سنوي)',
    'admin.placeholder.vat': 'ضريبة القيمة المضافة',
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
    'nav.projects': 'Projects We Developed',
    'nav.properties': 'Properties to Buy/Rent',
    'nav.admin': 'Admin Panel',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'hero.title': 'Benaa and Edara Real Estate',
    'hero.subtitle': 'We offer the best real estate services, development, and property management with a professional vision.',
    'common.sale': 'For Sale',
    'common.rent': 'For Rent',
    'common.price': 'Price',
    'common.basePrice': 'Base Price',
    'common.currency': 'SAR',
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
    'admin.placeholder.electricityCost': 'Electricity Cost',
    'admin.placeholder.electricityFrequency': 'Electricity Frequency (Monthly/Yearly)',
    'admin.placeholder.vat': 'VAT Amount',
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

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
