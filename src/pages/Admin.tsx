import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { PlusCircle, Loader2, Trash2, Home, MapPin, Settings as SettingsIcon, ImagePlus, X, BarChart3, Eye, Info, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SrIcon } from '../components/SrIcon';

import AdminProjects from './AdminProjects';
import AdminBuildings from './AdminBuildings';
import AdminRenters from './AdminRenters';
import AdminReceipts from './AdminReceipts';

interface Property {
  id: string;
  titleAr: string;
  titleEn: string;
  type: string;
  price: number;
}

interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  tier: string;
}

interface AnalyticsData {
  totalViews: number;
  propertiesViews: { propertyId: string; _count: { propertyId: number } }[];
  pathsViews: { path: string; _count: { path: number } }[];
}

const PREDEFINED_DETAILS = [
  { keyAr: 'الواجهة', keyEn: 'Facade', example: 'شمالية' },
  { keyAr: 'عرض الشارع', keyEn: 'Street Width', example: '36م' },
  { keyAr: 'عدد الغرف', keyEn: 'Rooms', example: '5' },
  { keyAr: 'غرف النوم', keyEn: 'Bedrooms', example: '4' },
  { keyAr: 'الصالات', keyEn: 'Halls', example: '2' },
  { keyAr: 'دورات المياه', keyEn: 'Bathrooms', example: '3' },
  { keyAr: 'الدور', keyEn: 'Floor', example: '2' },
  { keyAr: 'الفئة', keyEn: 'Category', example: 'عوائل / عزاب' },
  { keyAr: 'عمر العقار', keyEn: 'Property Age', example: 'جديد / 5 سنوات' },
  { keyAr: 'مواقف سيارات', keyEn: 'Parking Spaces', example: '2' },
  { keyAr: 'مصاعد', keyEn: 'Elevators', example: '1' },
  { keyAr: 'عدد الوحدات', keyEn: 'Number of Units', example: '4' },
  { keyAr: 'مسطح البناء', keyEn: 'Built Area', example: '300 م²' },
  { keyAr: 'حالة العقار', keyEn: 'Condition', example: 'ممتازة / مجددة' },
  { keyAr: 'خزان غاز', keyEn: 'Gas Tank', example: 'مستقل / مشترك' },
  { keyAr: 'مؤثثة', keyEn: 'Furnished', example: 'نعم / لا' },
  { keyAr: 'مدخل خاص', keyEn: 'Private Entrance', example: 'نعم' },
  { keyAr: 'مطبخ راكب', keyEn: 'Kitchen Installed', example: 'نعم' },
  { keyAr: 'مسبح', keyEn: 'Pool', example: 'نعم / لا' },
  { keyAr: 'حديقة', keyEn: 'Garden', example: 'نعم / لا' },
  { keyAr: 'غرفة خادمة', keyEn: 'Maid Room', example: 'نعم / لا' },
  { keyAr: 'غرفة سائق', keyEn: 'Driver Room', example: 'نعم / لا' },
  { keyAr: 'ملحق خارجي', keyEn: 'Outdoor Annex', example: 'نعم / لا' },
  { keyAr: 'تكييف مركزي', keyEn: 'Central AC', example: 'نعم / لا' },
  { keyAr: 'مكيفات راكبة', keyEn: 'Installed ACs', example: 'نعم / لا' },
  { keyAr: 'مدخل سيارة', keyEn: 'Car Entrance', example: 'نعم / لا' },
  { keyAr: 'مستودع', keyEn: 'Storage', example: 'نعم / لا' },
  { keyAr: 'نظام ذكي', keyEn: 'Smart Home System', example: 'نعم / لا' },
  { keyAr: 'نادي رياضي', keyEn: 'Gym', example: 'نعم / مشترك / خاص' },
  { keyAr: 'كاميرات مراقبة', keyEn: 'Security Cameras', example: 'نعم / متوفرة' },
  { keyAr: 'أمن وحراسة', keyEn: 'Security', example: 'نعم / متوفر' },
  { keyAr: 'دخول ذكي', keyEn: 'Smart Access', example: 'نعم' },
];

const PREDEFINED_FEATURES = [
  { keyAr: 'قريب من المسجد', keyEn: 'Near Mosque' },
  { keyAr: 'قريب من السوبر ماركت والمول والمحلات', keyEn: 'Near Supermarket, Mall & Shops' },
  { keyAr: 'قريب من الخدمات والمدارس', keyEn: 'Near Services & Schools' },
  { keyAr: 'تتوفر جميع الخدمات الحيوية بجانب العقار', keyEn: 'All essential services available nearby' },
  { keyAr: 'مدخل ومخرج سهل وسريع للطرق الرئيسية', keyEn: 'Quick and easy access to highway / main roads' },
  { keyAr: 'موقع هادئ وراقٍ ومناسب جداً للعائلات', keyEn: 'Quiet, premium residential area - very family-friendly' },
];

export default function Admin() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'manage' | 'projects' | 'buildings' | 'renters' | 'analytics' | 'settings'>('manage');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Settings Form State
  const [activeSettingsSection, setActiveSettingsSection] = useState<'whatsapp' | 'otp' | 'account'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [callingNumber, setCallingNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('مرحباً، أنا مهتم بهذا العقار: {title} - {link}');
  const [otpWebhookUrl, setOtpWebhookUrl] = useState('');
  const [otpMessageTemplate, setOtpMessageTemplate] = useState('رمز التحقق الخاص بك هو: {otp}');
  const [otpWebhookPayload, setOtpWebhookPayload] = useState('{\n  "phone": "{phone}",\n  "otp": "{otp}",\n  "type": "template",\n  "message": "رمز التحقق الخاص بك هو: {otp}"\n}');
  const [savingSettings, setSavingSettings] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Property Form State
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    type: 'SALE',
    propertyCategory: 'VILLA',
    paymentFrequency: 'MONTHLY',
    area: '',
    locationLink: '',
    locationText: '',
    featuresList: [] as {id: string, value: string}[],
    propertyAge: '',
    electricityCost: '',
    electricityFrequency: 'YEARLY',
    vat: '',
    commission: '',
    description: '',
    price: '',
    imageUrls: [] as string[],
    aqarLink: '',
    detailsList: [] as {id: string, key: string, value: string}[],
    paymentsCount: ''
  });

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties');
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      if (data.callingNumber) setCallingNumber(data.callingNumber);
      if (data.whatsappMessage) setWhatsappMessage(data.whatsappMessage);
      if (data.otpWebhookUrl !== undefined) setOtpWebhookUrl(data.otpWebhookUrl || '');
      if (data.otpMessageTemplate) setOtpMessageTemplate(data.otpMessageTemplate);
      if (data.otpWebhookPayload) setOtpWebhookPayload(data.otpWebhookPayload);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchSettings();
    fetchAnalytics();
  }, []);

  // Handle File Upload -> Base64
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState<{type: 'error', text: string} | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageUploadMessage(null);
    setIsUploadingImages(true);

    let base64Images: string[] = [...formData.imageUrls];
    let hasError = false;

    // Process sequentially to avoid blocking UI too much
    for (const file of Array.from(files) as File[]) {
      if (file.size > 5 * 1024 * 1024) { // 5MB per image limit
        setImageUploadMessage({ type: 'error', text: language === 'ar' ? `الصورة ${file.name} تتجاوز الحجم المسموح (5MB)` : `Image ${file.name} exceeds 5MB limit`});
        hasError = true;
        continue;
      }
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result && typeof event.target.result === 'string') resolve(event.target.result);
            else reject(new Error('Failed to convert to base64'));
          };
          reader.onerror = () => reject(new Error('File reading error'));
          reader.readAsDataURL(file);
        });
        base64Images.push(base64);
      } catch (err) {
        console.error(err);
      }
    }
    
    setFormData(prev => ({ ...prev, imageUrls: base64Images }));
    setIsUploadingImages(false);
    
    // reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.imageUrls];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, imageUrls: newImages }));
  };

  const showSubmitMessage = (type: 'success' | 'error', text: string) => {
    setSubmitMessage({ type, text });
    setTimeout(() => setSubmitMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    if (isUploadingImages) {
      showSubmitMessage('error', language === 'ar' ? 'الرجاء الانتظار حتى يكتمل رفع الصور' : 'Please wait for images to finish uploading');
      return;
    }
    setLoading(true);

    const payload = {
      ...formData,
      features: formData.featuresList.map(f => f.value).filter(Boolean).join(','),
      imageUrls: JSON.stringify(formData.imageUrls),
      details: JSON.stringify(formData.detailsList.map(({key, value}) => ({key, value})))
    };

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing ? `/api/properties/${editingId}` : '/api/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showSubmitMessage('success', isEditing ? (language === 'ar' ? 'تم تحديث العقار بنجاح' : 'Property updated successfully!') : (language === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully!'));
        resetForm();
        fetchProperties();
        setTimeout(() => setShowAddForm(false), 2000);
      } else {
        showSubmitMessage('error', isEditing ? (language === 'ar' ? 'فشل تحديث العقار' : 'Failed to update property.') : (language === 'ar' ? 'فشل إضافة العقار' : 'Failed to add property.'));
      }
    } catch (err) {
      console.error(err);
      showSubmitMessage('error', language === 'ar' ? 'حدث خطأ في النظام' : 'Error saving property. Payload might be too large.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titleAr: '',
      titleEn: '',
      type: 'SALE',
      propertyCategory: 'VILLA',
      paymentFrequency: 'MONTHLY',
      area: '',
      locationLink: '',
      locationText: '',
      featuresList: [],
      propertyAge: '',
      electricityCost: '',
      electricityFrequency: 'YEARLY',
      vat: '',
      commission: '',
      description: '',
      price: '',
      imageUrls: [],
      aqarLink: '',
      detailsList: [],
      paymentsCount: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEditClick = async (property: Property) => {
    try {
      const res = await fetch(`/api/properties/${property.id}`);
      const propData = await res.json();
      
      let parsedImages = [];
      try {
        parsedImages = typeof propData.imageUrls === 'string' ? JSON.parse(propData.imageUrls) : (propData.imageUrls || []);
      } catch (e) {
        // ignore
      }

      let initialDetailsList: any[] = [];
      try {
        if (propData.details) {
          const arr = JSON.parse(propData.details);
          initialDetailsList = arr.map((item: any, idx: number) => ({ id: Math.random().toString(), key: item.key, value: item.value }));
        }
      } catch (e) {
        // ignore
      }

      const initialFeaturesList = (propData.features || '').split(',')
        .map((f: string) => f.trim())
        .filter(Boolean)
        .map((f: string) => ({ id: Math.random().toString(), value: f }));

      setFormData({
        titleAr: propData.titleAr || '',
        titleEn: propData.titleEn || '',
        type: propData.type || 'SALE',
        propertyCategory: propData.propertyCategory || 'VILLA',
        paymentFrequency: propData.paymentFrequency || 'MONTHLY',
        area: propData.area?.toString() || '',
        locationLink: propData.locationLink || '',
        locationText: propData.locationText || '',
        featuresList: initialFeaturesList,
        propertyAge: propData.propertyAge?.toString() || '',
        electricityCost: propData.electricityCost?.toString() || '',
        electricityFrequency: propData.electricityFrequency || 'YEARLY',
        vat: propData.vat?.toString() || '',
        commission: propData.commission?.toString() || '',
        description: propData.description || '',
        price: propData.price?.toString() || '',
        imageUrls: parsedImages,
        aqarLink: propData.aqarLink || '',
        detailsList: initialDetailsList,
        paymentsCount: propData.paymentsCount?.toString() || ''
      });
      setEditingId(property.id);
      setShowAddForm(true);
    } catch (error) {
      console.error('Error fetching property details for editing:', error);
      alert('Could not fetch property details.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      if (activeSettingsSection === 'account') {
        const stored = localStorage.getItem('user');
        if (stored) {
          const u = JSON.parse(stored);
          const res = await fetch('/api/admin/credentials', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminId: u.id, currentUsername: u.username, newUsername: adminUsername, newPassword: adminPassword }),
          });
          if (res.ok) {
            const data = await res.json();
            alert(language === 'ar' ? 'تم تحديث بيانات الحساب بنجاح! سيتم تسجيل خروجك للمتابعة بالبيانات الجديدة.' : 'Account credentials updated successfully! You will be logged out.');
            localStorage.removeItem('user');
            window.location.href = '/login';
          } else {
            const errData = await res.json();
            alert(language === 'ar' ? 'فشل التحديث: ' + errData.error : 'Update failed: ' + errData.error);
          }
        }
      } else {
        // Validate JSON payload before sending
        try {
          if (otpWebhookPayload.trim()) {
             JSON.parse(otpWebhookPayload);
          }
        } catch(parseErr) {
          alert(language === 'ar' ? 'الرجاء إدخال قالب JSON صحيح' : 'Please provide a valid JSON template format.');
          setSavingSettings(false);
          return;
        }
        
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ whatsappNumber, callingNumber, whatsappMessage, otpWebhookUrl, otpMessageTemplate, otpWebhookPayload }),
        });
        if (res.ok) {
          alert(language === 'ar' ? 'تم حفظ الإعدادات!' : 'Settings saved!');
        } else {
          alert(language === 'ar' ? 'فشل حفظ الإعدادات.' : 'Failed to save settings.');
        }
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'خطأ في النظام.' : 'System error.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties(properties.filter(p => p.id !== id));
      } else {
        alert('Failed to delete property.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting property.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('manage')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'manage' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t('admin.manageProperties')}
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'projects' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {language === 'ar' ? 'إدارة المشاريع' : 'Manage Projects'}
          </button>
          <button 
            onClick={() => setActiveTab('buildings')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'buildings' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {language === 'ar' ? 'إدارة المباني' : 'Buildings'}
          </button>
          <button 
            onClick={() => setActiveTab('renters')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'renters' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {language === 'ar' ? 'المستأجرين' : 'Renters'}
          </button>
          <button 
            onClick={() => setActiveTab('receipts')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'receipts' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {language === 'ar' ? 'الإيصالات' : 'Receipts'}
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {language === 'ar' ? 'الإحصائيات' : 'Analytics'}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`text-lg sm:text-xl font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-black text-white shadow-lg' 
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t('admin.settings')}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeTab === 'projects' && <AdminProjects />}
            {activeTab === 'buildings' && <AdminBuildings />}
            {activeTab === 'renters' && <AdminRenters />}
            {activeTab === 'receipts' && <AdminReceipts />}

            {activeTab === 'manage' && (
          <div className="min-h-[500px]">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{showAddForm ? (editingId ? (language === 'ar' ? 'تعديل العقار' : 'Edit Property') : t('admin.addProperty')) : t('admin.propertiesList')}</h2>
              </div>
              <button 
                onClick={() => {
                  if (showAddForm) {
                    resetForm();
                  } else {
                    resetForm();
                    setShowAddForm(true);
                  }
                }}
                className="bg-black text-white font-bold px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2"
              >
                {showAddForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                {showAddForm ? (language === 'ar' ? 'إلغاء' : 'Cancel') : t('admin.addProperty')}
              </button>
            </div>
            
            {!showAddForm ? (
              fetching ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t('admin.propertiesEmpty')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                        <th className="p-4 font-bold rounded-tr-xl">#</th>
                        <th className="p-4 font-bold">{language === 'ar' ? 'اسم العقار' : 'Title (Ar/En)'}</th>
                        <th className="p-4 font-bold">{language === 'ar' ? 'النوع' : 'Type'}</th>
                        <th className="p-4 font-bold">{t('admin.placeholder.price')}</th>
                        <th className="p-4 font-bold text-center rounded-tl-xl">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property, index) => (
                        <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-500">{index + 1}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{property.titleAr}</p>
                            <p className="text-sm text-gray-500 font-sans" dir="ltr">{property.titleEn}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              property.type === 'SALE' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                            }`}>
                              {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gray-900 flex items-center gap-1.5 justify-end">
                            {property.price.toLocaleString()} <SrIcon className="w-4 h-4 text-gray-600" />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(property)}
                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors inline-block"
                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(property.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                title={t('admin.deleteProperty')}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-12">
                {submitMessage && (
                  <div className={`p-4 rounded-xl font-bold border flex items-center gap-3 ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                     {submitMessage.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
                     {submitMessage.text}
                  </div>
                )}
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.titleAr')}</label>
                      <input required type="text" value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="مثال: فيلا فاخرة للبيع في الملقا" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.titleEn')}</label>
                      <input required type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="e.g. Luxury Villa in Al Malqa" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'ar' ? 'نوع العرض' : 'Type'}</label>
                      <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors">
                        <option value="SALE">{t('common.sale')}</option>
                        <option value="RENT">{t('common.rent')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.category')}</label>
                      <select value={formData.propertyCategory} onChange={(e) => setFormData({ ...formData, propertyCategory: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors">
                        <option value="VILLA">{t('cat.VILLA')}</option>
                        <option value="APARTMENT">{t('cat.APARTMENT')}</option>
                        <option value="COMPOUND">{t('cat.COMPOUND')}</option>
                        <option value="TOWER">{t('cat.TOWER')}</option>
                        <option value="BUILDING">{t('cat.BUILDING')}</option>
                        <option value="MALL">{t('cat.MALL')}</option>
                        <option value="SHOP">{t('cat.SHOP')}</option>
                        <option value="OFFICE">{t('cat.OFFICE')}</option>
                        <option value="RESORT">{t('cat.RESORT')}</option>
                        <option value="HOTEL">{t('cat.HOTEL')}</option>
                        <option value="HOSPITAL">{t('cat.HOSPITAL')}</option>
                        <option value="WAREHOUSE">{t('cat.WAREHOUSE')}</option>
                        <option value="FARM">{t('cat.FARM')}</option>
                        <option value="LAND">{t('cat.LAND')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.area')}</label>
                      <input required type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="150" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.propertyAge')}</label>
                      <input type="number" value={formData.propertyAge} onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="0" />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'الموقع الجغرافي' : 'Location & Links'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.locationText')} {language === 'ar' ? '(اختياري)' : '(Optional)'}</label>
                      <input type="text" value={formData.locationText} onChange={(e) => setFormData({ ...formData, locationText: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="Al Malqa, Riyadh..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.locationLink')} {language === 'ar' ? '(اختياري)' : '(Optional)'}</label>
                      <input type="url" value={formData.locationLink} onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="https://maps.google.com/..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.aqarLink')} {language === 'ar' ? '(اختياري)' : '(Optional)'}</label>
                      <input type="url" value={formData.aqarLink} onChange={(e) => setFormData({ ...formData, aqarLink: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors" placeholder="https://sa.aqar.fm/..." />
                    </div>
                  </div>
                </div>

                {/* Financial Costs Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'التكاليف المالية' : 'Financial Details'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={formData.type === 'RENT' ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.price')}</label>
                      <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                        <div className="flex bg-gray-50 items-center justify-center px-4 border-r border-gray-300 ltr:border-r rtl:border-l">
                          <span className="text-gray-500 font-bold">{t('common.currency')}</span>
                        </div>
                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0" placeholder="2500000" />
                        {formData.type === 'RENT' && (
                          <div className="flex border-l border-gray-300 ltr:border-l rtl:border-r">
                            <select value={formData.paymentFrequency} onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })} className="bg-gray-50 px-3 py-3 outline-none focus:ring-0 font-medium">
                              <option value="YEARLY">{t('common.yearly')}</option>
                              <option value="MONTHLY">{t('common.monthly')}</option>
                            </select>
                            <select value={formData.paymentsCount} onChange={(e) => setFormData({ ...formData, paymentsCount: e.target.value })} className="bg-gray-50 border-l border-gray-300 ltr:border-l rtl:border-r px-3 py-3 outline-none focus:ring-0 font-medium text-gray-500">
                              <option value="">{language === 'ar' ? 'عدد الدفعات...' : 'Payments...'}</option>
                              <option value="1">{language === 'ar' ? 'دفعة واحدة' : '1 Payment'}</option>
                              <option value="2">{language === 'ar' ? 'دفعتين' : '2 Payments'}</option>
                              <option value="3">{language === 'ar' ? '3 دفعات' : '3 Payments'}</option>
                              <option value="4">{language === 'ar' ? '4 دفعات' : '4 Payments'}</option>
                              <option value="12">{language === 'ar' ? 'شهري (12)' : 'Monthly (12)'}</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {formData.type === 'RENT' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.electricityCost')}</label>
                        <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                          <div className="flex bg-gray-50 items-center justify-center px-4 border-r border-gray-300 ltr:border-r rtl:border-l">
                            <span className="text-gray-500 font-bold">{t('common.currency')}</span>
                          </div>
                          <input type="number" value={formData.electricityCost} onChange={(e) => setFormData({ ...formData, electricityCost: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0" placeholder="0" />
                          <select value={formData.electricityFrequency} onChange={(e) => setFormData({ ...formData, electricityFrequency: e.target.value })} className="bg-gray-50 border-l border-gray-300 ltr:border-l rtl:border-r px-4 py-3 outline-none focus:ring-0 font-medium">
                            <option value="YEARLY">{t('common.yearly')}</option>
                            <option value="MONTHLY">{t('common.monthly')}</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.vat')}</label>
                      <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                        <div className="flex bg-gray-50 items-center justify-center px-4 border-r border-gray-300 ltr:border-r rtl:border-l">
                          <span className="text-gray-500 font-bold">{t('common.currency')}</span>
                        </div>
                        <input type="number" value={formData.vat} onChange={(e) => setFormData({ ...formData, vat: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0 bg-gray-50 hover:bg-white focus:bg-white" placeholder="0" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.commission')}</label>
                      <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500">
                        <div className="flex bg-gray-50 items-center justify-center px-4 border-r border-gray-300 ltr:border-r rtl:border-l">
                          <span className="text-gray-500 font-bold">{t('common.currency')}</span>
                        </div>
                        <input type="number" value={formData.commission} onChange={(e) => setFormData({ ...formData, commission: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0 bg-gray-50 hover:bg-white focus:bg-white" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'التفاصيل' : 'Details'}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PREDEFINED_DETAILS.map(pd => (
                      <button
                        key={pd.keyEn}
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            detailsList: [...formData.detailsList, { id: Math.random().toString(), key: language === 'ar' ? pd.keyAr : pd.keyEn, value: '' }] 
                          });
                        }}
                        className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-gray-50 flex items-center gap-1 transition shadow-sm"
                        title={pd.example}
                      >
                        <PlusCircle className="w-4 h-4 text-gray-400" />
                        {language === 'ar' ? pd.keyAr : pd.keyEn}
                      </button>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    {formData.detailsList.map((detail, idx) => (
                      <div key={detail.id} className="flex gap-2 items-center relative group">
                        <input
                          type="text"
                          value={detail.key}
                          onChange={(e) => {
                            const newList = [...formData.detailsList];
                            newList[idx].key = e.target.value;
                            setFormData({ ...formData, detailsList: newList });
                          }}
                          placeholder={language === 'ar' ? 'الميزة (مثال: الغرف)' : 'Key (e.g. Rooms)'}
                          className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        />
                        <input
                          type="text"
                          value={detail.value}
                          onChange={(e) => {
                            const newList = [...formData.detailsList];
                            newList[idx].value = e.target.value;
                            setFormData({ ...formData, detailsList: newList });
                          }}
                          placeholder={language === 'ar' ? 'القيمة (مثال: 5)' : 'Value (e.g. 5)'}
                          className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = formData.detailsList.filter((_, i) => i !== idx);
                            setFormData({ ...formData, detailsList: newList });
                          }}
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, detailsList: [...formData.detailsList, { id: Math.random().toString(), key: '', value: '' }] })}
                      className="text-yellow-600 font-bold flex items-center gap-2 hover:text-yellow-700 py-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      {language === 'ar' ? 'إضافة تفصيل جديد' : 'Add Detail'}
                    </button>
                  </div>
                </div>

                {/* Additional Features Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'المميزات الإضافية' : 'Additional Features'}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PREDEFINED_FEATURES.map(pf => (
                      <button
                        key={pf.keyEn}
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            featuresList: [...formData.featuresList, { id: Math.random().toString(), value: language === 'ar' ? pf.keyAr : pf.keyEn }] 
                          });
                        }}
                        className="bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-bold hover:bg-gray-50 flex items-center gap-1 transition shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4 text-gray-400" />
                        {language === 'ar' ? pf.keyAr : pf.keyEn}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {formData.featuresList.map((feature, idx) => (
                      <div key={feature.id} className="flex gap-2 items-center relative group">
                        <input
                          type="text"
                          value={feature.value}
                          onChange={(e) => {
                            const newList = [...formData.featuresList];
                            newList[idx].value = e.target.value;
                            setFormData({ ...formData, featuresList: newList });
                          }}
                          placeholder={language === 'ar' ? 'ميزة (مثال: مسبح)' : 'Feature (e.g. Pool)'}
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = formData.featuresList.filter((_, i) => i !== idx);
                            setFormData({ ...formData, featuresList: newList });
                          }}
                          className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featuresList: [...formData.featuresList, { id: Math.random().toString(), value: '' }] })}
                      className="text-yellow-600 font-bold flex items-center gap-2 hover:text-yellow-700 py-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      {language === 'ar' ? 'إضافة ميزة' : 'Add Feature'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'الوصف' : 'Description'}</h3>
                  <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors resize-none" placeholder={language === 'ar' ? 'أضف وصفاً مفصلاً للعقار...' : 'Add a detailed description...'} />
                </div>

                {/* Images Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">{language === 'ar' ? 'الصور' : 'Images'} (Max 50MB total)</h3>
                  
                  {imageUploadMessage && (
                    <div className="mb-4 p-4 rounded-xl font-bold border bg-red-50 text-red-700 border-red-200 flex items-center gap-3">
                       <X className="w-5 h-5 flex-shrink-0" />
                       {imageUploadMessage.text}
                    </div>
                  )}

                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isUploadingImages ? 'border-gray-200 bg-gray-100 cursor-not-allowed' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={isUploadingImages} />
                    <label htmlFor="image-upload" className={`flex flex-col items-center ${isUploadingImages ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      {isUploadingImages ? (
                        <Loader2 className="w-12 h-12 text-indigo-500 mb-4 animate-spin" />
                      ) : (
                        <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
                      )}
                      
                      <span className={`font-bold text-lg ${isUploadingImages ? 'text-gray-500' : 'text-gray-600'}`}>
                        {isUploadingImages ? (language === 'ar' ? 'جاري معالجة الصور...' : 'Processing Images...') : t('admin.placeholder.imagesDesc')}
                      </span>
                    </label>
                  </div>
                  
                  {formData.imageUrls.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {formData.imageUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <img src={url} alt="upload preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-bold py-4 px-4 rounded-xl hover:bg-gray-900 transition-all focus:ring-4 focus:ring-gray-300 flex justify-center items-center gap-2 text-lg shadow-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('admin.submit')}
                </button>
              </div>
            </form>
            )}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="min-h-[500px]">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{language === 'ar' ? 'تحليلات الموقع' : 'Site Analytics'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 mb-4 text-gray-500">
                  <Eye className="w-6 h-6" />
                  <h3 className="text-lg font-bold">{language === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}</h3>
                </div>
                <p className="text-4xl font-black text-gray-900">{analytics.totalViews}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'أكثر الصفحات زيارة' : 'Top Pages'}</h3>
                <div className="space-y-4">
                  {analytics.pathsViews.map((item, idx) => {
                    let displayPath = item.path;
                    if (displayPath === '/') displayPath = language === 'ar' ? 'الصفحة الرئيسية' : 'Home Page';
                    else if (displayPath === '/properties') displayPath = language === 'ar' ? 'تصفح العقارات' : 'Properties Page';
                    else if (displayPath === '/about') displayPath = language === 'ar' ? 'من نحن' : 'About Us';
                    else if (displayPath === '/contact') displayPath = language === 'ar' ? 'تواصل معنا' : 'Contact Us';
                    else if (displayPath === '/services') displayPath = language === 'ar' ? 'خدماتنا' : 'Services';
                    else if (displayPath.startsWith('/properties/')) {
                       displayPath = language === 'ar' ? 'صفحة عقار' : 'Property Record';
                    }

                    return (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group">
                      <span className="font-bold text-gray-800 text-sm truncate">{displayPath} <span className="text-gray-400 font-mono text-xs hidden sm:inline ml-2">({item.path})</span></span>
                      <span className="font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-lg text-sm flex-shrink-0 group-hover:bg-yellow-100 transition-colors">{item._count.path} {language === 'ar' ? 'م' : 'v'}</span>
                    </div>
                  )})}
                  {analytics.pathsViews.length === 0 && <p className="text-gray-500">{language === 'ar' ? 'لا توجد بيانات بعد.' : 'No data yet.'}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'أكثر العقارات زيارة' : 'Top Properties'}</h3>
                <div className="space-y-4">
                  {analytics.propertiesViews.map((item, idx) => {
                    const prop = properties.find(p => p.id === item.propertyId);
                    const title = prop ? (language === 'ar' ? prop.titleAr : prop.titleEn) : (language === 'ar' ? 'عقار تم حذفه' : 'Deleted Property');
                    return (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group">
                      <span className="font-bold text-gray-800 truncate pr-4">{title}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                        {item._count.propertyId} {language === 'ar' ? 'مشاهدة' : 'Views'}
                      </span>
                    </div>
                  )})}
                  {analytics.propertiesViews.length === 0 && <p className="text-gray-500">{language === 'ar' ? 'لا توجد بيانات بعد.' : 'No data yet.'}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="min-h-[500px] max-w-2xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 leading-none">{t('admin.settings')}</h2>
                <p className="text-gray-500 font-medium mt-2 leading-none">{language === 'ar' ? 'إدارة إعدادات الموقع والتواصل' : 'Manage site and contact settings'}</p>
              </div>
            </div>
            
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6 flex-wrap md:flex-nowrap">
              <button 
                onClick={() => setActiveSettingsSection('whatsapp')}
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeSettingsSection === 'whatsapp' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {language === 'ar' ? 'الواتساب' : 'WhatsApp'}
              </button>
              <button 
                onClick={() => setActiveSettingsSection('otp')}
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeSettingsSection === 'otp' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {language === 'ar' ? 'رمز تحقق المستأجرين' : 'Renter OTP'}
              </button>
              <button 
                onClick={() => setActiveSettingsSection('account')}
                className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeSettingsSection === 'account' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {language === 'ar' ? 'حساب الإدارة' : 'Admin Account'}
              </button>
            </div>
            
            <form onSubmit={handleSaveSettings} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              
              {activeSettingsSection === 'whatsapp' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 inline-block">{language === 'ar' ? 'إعدادات الواتساب' : 'WhatsApp Settings'}</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('admin.placeholder.whatsapp')}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center px-4 pointer-events-none text-gray-400">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </div>
                        <input
                          required
                          type="text"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl py-3 px-12 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-gray-900"
                          placeholder="966500000000"
                          dir="ltr"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-sm">
                        {language === 'ar' ? 'أدخل الرقم مع رمز الدولة بدون (+) أو (00). مثال: ' : 'Include country code without + or 00. Example: '}
                        <span className="font-mono text-xs bg-gray-100 px-1 rounded block mt-1 w-max">966500000000</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'ar' ? 'رقم الاتصال المباشر' : 'Direct Calling Number'}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center px-4 pointer-events-none text-gray-400">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <input
                          required
                          type="text"
                          value={callingNumber}
                          onChange={(e) => setCallingNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl py-3 px-12 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-gray-900"
                          placeholder="966500000000"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'ar' ? 'نص رسالة الواتساب الافتراضي' : 'Default WhatsApp Message'}</label>
                      <textarea
                        required
                        rows={3}
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none font-medium text-gray-800"
                        placeholder={language === 'ar' ? 'مرحباً، أنا مهتم بهذا العقار: {title} - {link}' : 'Hello, I am interested in this property: {title} - {link}'}
                      />
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="font-bold flex items-center gap-1.5 mb-1.5 text-gray-700">
                          <Info className="w-4 h-4" />
                          {language === 'ar' ? 'المتغيرات المدعومة:' : 'Supported Variables:'}
                        </p>
                        <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                          <li><span className="text-blue-600 bg-blue-50 px-1 rounded">{'{title}'}</span> - {language === 'ar' ? 'عنوان العقار' : 'Property Title'}</li>
                          <li><span className="text-blue-600 bg-blue-50 px-1 rounded">{'{link}'}</span> - {language === 'ar' ? 'رابط صفحة العقار' : 'Property Page Link'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === 'otp' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 inline-block">
                    {language === 'ar' ? 'إعدادات تسجيل المستأجرين (OTP Webhook)' : 'Renter Login Settings (OTP Webhook)'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                         {language === 'ar' ? 'رابط الويب هوك (Whatomate URL)' : 'Webhook URL (Whatomate)'}
                      </label>
                      <input
                        type="url"
                        value={otpWebhookUrl}
                        onChange={(e) => setOtpWebhookUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-medium text-gray-800 dir-ltr"
                        placeholder="https://hook.us2.make.com/..."
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {language === 'ar' ? 'اتركه فارغاً لتعطيل إرسال الرسائل عبر الويب هوك.' : 'Leave empty to disable sending webhooks.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {language === 'ar' ? 'قالب رسالة رمز التحقق' : 'OTP Message Template'}
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={otpMessageTemplate}
                        onChange={(e) => setOtpMessageTemplate(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all resize-none font-medium text-gray-800"
                        placeholder={language === 'ar' ? 'رمز التحقق الخاص بك هو: {otp}' : 'Your verification code is: {otp}'}
                      />
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="font-bold flex items-center gap-1.5 mb-1.5 text-gray-700">
                          <Info className="w-4 h-4" />
                          {language === 'ar' ? 'المتغيرات المدعومة:' : 'Supported Variables:'}
                        </p>
                        <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                          <li><span className="text-blue-600 bg-blue-50 px-1 rounded">{'{otp}'}</span> - {language === 'ar' ? 'رمز التحقق المكون من 4 أرقام' : 'The 4-digit verification code'}</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                         {language === 'ar' ? 'قالب JSON لإرسال الويب هوك (Whatomate JSON)' : 'Webhook JSON Payload Template'}
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={otpWebhookPayload}
                        onChange={(e) => setOtpWebhookPayload(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-xs dir-ltr bg-gray-50"
                        placeholder={'{\n  "phone": "{phone}",\n  "type": "template"\n}'}
                      />
                      <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="font-bold flex items-center gap-1.5 mb-1.5 text-gray-700">
                          <Info className="w-4 h-4" />
                          {language === 'ar' ? 'المتغيرات المدعومة في قالب JSON:' : 'Supported Variables in JSON:'}
                        </p>
                        <ul className="list-disc list-inside space-y-1 font-mono text-xs mb-2">
                          <li><span className="text-blue-600 bg-blue-50 px-1 rounded">{'{phone}'}</span> - {language === 'ar' ? 'رقم جوال المستأجر' : 'Renter phone number'}</li>
                          <li><span className="text-blue-600 bg-blue-50 px-1 rounded">{'{otp}'}</span> - {language === 'ar' ? 'رمز التحقق' : 'Verification code'}</li>
                        </ul>
                        <p className="text-xs">
                          {language === 'ar' 
                             ? 'يمكنك وضع صيغة JSON المطلوبة من Whatomate (مثلاً الرسائل القالبية WhatsApp Templates)، وسيتم استبدال المتغيرات قبل الإرسال.' 
                             : 'You can define the exact JSON payload expected by Whatomate (e.g. WhatsApp Templates) and variables will be replaced before sending.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === 'account' && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 inline-block">
                    {language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {language === 'ar' ? 'اسم المستخدم الجديد للإدارة' : 'New Admin Username'}
                      </label>
                      <input
                        type="text"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-gray-900"
                        placeholder="admin"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                      </label>
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-gray-900"
                        placeholder="********"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 pt-8">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-black text-white font-bold py-3.5 px-8 rounded-xl hover:bg-gray-800 transition-all active:scale-95 focus:ring-4 focus:ring-gray-300 flex items-center gap-2 text-base shadow-md disabled:bg-gray-400 disabled:active:scale-100"
                >
                  {savingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {t('admin.submit')}
                </button>
              </div>
            </form>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
