import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { PlusCircle, Loader2, Trash2, Home, MapPin, Settings as SettingsIcon, ImagePlus, X, BarChart3, Eye, Info, CheckCircle, Download, Upload, LogOut, Mail, ArrowLeft, ArrowRight, Pencil, MessageSquare, KeyRound, Database, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SrIcon } from '../components/SrIcon';
import { IgIcon, XIcon, FbIcon, LiIcon, YtIcon, TkIcon, SnapIcon } from '../components/SocialIcons';
import { useDialog } from '../context/DialogContext';

import AdminProjects from './AdminProjects';
import AdminCallbacks from './AdminCallbacks';
import AdminBuildings from './AdminBuildings';
import AdminRenters from './AdminRenters';
import AdminReceipts from './AdminReceipts';
import AdminUsers from './AdminUsers';
import AdminLogs from './AdminLogs';
import { compressImage } from '../lib/image';

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
  { keyAr: 'المطبخ', keyEn: 'Kitchen', example: 'مفتوح / مغلق / راكب' },
  { keyAr: 'الدور', keyEn: 'Floor', example: '2' },
  { keyAr: 'الفئة', keyEn: 'Category', example: 'عوائل / عزاب' },
  { keyAr: 'مواقف سيارات', keyEn: 'Parking Spaces', example: '2' },
  { keyAr: 'مصاعد', keyEn: 'Elevators', example: '1' },
  { keyAr: 'عدد الوحدات', keyEn: 'Number of Units', example: '4' },
  { keyAr: 'مسطح البناء', keyEn: 'Built Area', example: '300 م²' },
  { keyAr: 'حالة العقار', keyEn: 'Condition', example: 'ممتازة / مجددة' },
];

const PREDEFINED_FEATURES = [
  { keyAr: 'نظام ذكي', keyEn: 'Smart Home System' },
  { keyAr: 'نادي رياضي', keyEn: 'Gym' },
  { keyAr: 'كاميرات مراقبة', keyEn: 'Security Cameras' },
  { keyAr: 'أمن وحراسة', keyEn: 'Security' },
  { keyAr: 'دخول ذكي', keyEn: 'Smart Access' },
  { keyAr: 'مستودع', keyEn: 'Storage' },
  { keyAr: 'مسبح', keyEn: 'Pool' },
  { keyAr: 'حديقة', keyEn: 'Garden' },
  { keyAr: 'مدخل خاص', keyEn: 'Private Entrance' },
  { keyAr: 'مطبخ راكب', keyEn: 'Kitchen Installed' },
  { keyAr: 'غرفة خادمة', keyEn: 'Maid Room' },
  { keyAr: 'غرفة سائق', keyEn: 'Driver Room' },
  { keyAr: 'ملحق خارجي', keyEn: 'Outdoor Annex' },
  { keyAr: 'تكييف مركزي', keyEn: 'Central AC' },
  { keyAr: 'مكيفات راكبة', keyEn: 'Installed ACs' },
  { keyAr: 'مدخل سيارة', keyEn: 'Car Entrance' },
  { keyAr: 'خزان غاز', keyEn: 'Gas Tank' },
  { keyAr: 'مؤثثة', keyEn: 'Furnished' },
  { keyAr: 'قريب من المسجد', keyEn: 'Near Mosque' },
  { keyAr: 'قريب من السوبر ماركت والمول والمحلات', keyEn: 'Near Supermarket, Mall & Shops' },
  { keyAr: 'قريب من الخدمات والمدارس', keyEn: 'Near Services & Schools' },
  { keyAr: 'تتوفر جميع الخدمات الحيوية بجانب العقار', keyEn: 'All essential services available nearby' },
  { keyAr: 'مدخل ومخرج سهل وسريع للطرق الرئيسية', keyEn: 'Quick and easy access to highway / main roads' },
  { keyAr: 'موقع هادئ وراقٍ ومناسب جداً للعائلات', keyEn: 'Quiet, premium residential area - very family-friendly' },
];

const TAB_TO_PERMISSION: Record<string, string> = {
  manage: 'properties',
  projects: 'projects',
  buildings: 'buildings',
  renters: 'renters',
  receipts: 'receipts',
  analytics: 'analytics',
  settings: 'settings',
  callbacks: 'callbacks',
  users: 'users',
  logs: 'logs'
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['properties', 'projects', 'buildings', 'renters', 'receipts', 'analytics', 'settings', 'callbacks', 'users', 'logs'],
  MANAGER: ['properties', 'projects', 'buildings', 'renters', 'receipts', 'callbacks', 'analytics'],
  AGENT: ['properties', 'projects', 'callbacks']
};

function hasTabPermission(tab: string, role: string) {
  const perm = TAB_TO_PERMISSION[tab];
  if (!perm) return false;
  const userPerms = ROLE_PERMISSIONS[role] || [];
  return role === 'ADMIN' || userPerms.includes(perm);
}

export default function Admin() {
  const { t, language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {}
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState<'manage' | 'projects' | 'buildings' | 'renters' | 'receipts' | 'analytics' | 'settings' | 'callbacks' | 'users' | 'logs'>('manage');
  const [userRole, setUserRole] = useState<string>('ADMIN');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      const roleVal = u.role || 'ADMIN';
      setUserRole(roleVal);
      
      const tabKeys: ('manage' | 'projects' | 'buildings' | 'renters' | 'receipts' | 'analytics' | 'settings' | 'callbacks' | 'users' | 'logs')[] = [
        'manage', 'projects', 'buildings', 'renters', 'receipts', 'analytics', 'settings', 'callbacks', 'users', 'logs'
      ];
      if (!hasTabPermission(activeTab, roleVal)) {
        const firstPermitted = tabKeys.find(tk => hasTabPermission(tk, roleVal));
        if (firstPermitted) {
          setActiveTab(firstPermitted);
        }
      }
    }
  }, [activeTab]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Settings Form State
  const [activeSettingsSection, setActiveSettingsSection] = useState<'whatsapp' | 'otp' | 'images' | 'social' | 'backup' | 'email' | 'analytics' | 'techhub'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [callingNumber, setCallingNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('مرحباً، أنا مهتم بهذا العقار: {title} - {link}');
  const [otpWebhookUrl, setOtpWebhookUrl] = useState('');
  const [otpMessageTemplate, setOtpMessageTemplate] = useState('رمز التحقق الخاص بك هو: {otp}');
  const [otpWebhookPayload, setOtpWebhookPayload] = useState('{\n  "phone": "{phone}",\n  "otp": "{otp}",\n  "type": "template",\n  "message": "رمز التحقق الخاص بك هو: {otp}"\n}');
  const [savingSettings, setSavingSettings] = useState(false);

  // TechHub Settings State
  const [techhubEnabled, setTechhubEnabled] = useState(false);
  const [techhubClientId, setTechhubClientId] = useState('');
  const [techhubClientSecret, setTechhubClientSecret] = useState('');
  const [techhubApiKey, setTechhubApiKey] = useState('');
  const [techhubSandboxMode, setTechhubSandboxMode] = useState(true);
  const [syncingTechHub, setSyncingTechHub] = useState(false);

  // SMTP Settings State
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');

  // Analytics Settings State
  const [analyticsScript, setAnalyticsScript] = useState('');
  const [analyticsDashboardUrl, setAnalyticsDashboardUrl] = useState('');
  const [analyticsSource, setAnalyticsSource] = useState<'external' | 'internal'>('external');

  // Home Images & Logo State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [homeImages, setHomeImages] = useState<{
    hero: string | null;
    promoVideo: string | null;
  }>({
    hero: null, promoVideo: null
  });
  const [imageSlotUploading, setImageSlotUploading] = useState<string | null>(null);

  // Social Media & Contact State
  const [socialEmail, setSocialEmail] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [snapchatUrl, setSnapchatUrl] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');

  // Address & Map State
  const [addressAr, setAddressAr] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressMapLink, setAddressMapLink] = useState('');

  // Backup / Restore State
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{type:'success'|'error', text:string} | null>(null);

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
    paymentsCount: '',
    utilityBills: 'NONE',
    includeElectricity: false,
    electricityCostVal: '',
    electricityFrequencyVal: 'YEARLY',
    includeWater: false,
    waterCostVal: '',
    waterFrequencyVal: 'YEARLY',
    vatExempt: false,
    allowedPaymentPlans: ["1", "2", "4"] as string[],
    videoUrl: ''
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
      if (data.logoUrl) setLogoUrl(data.logoUrl);
      if (data.homeImages) {
        try {
          const parsed = JSON.parse(data.homeImages);
          setHomeImages(prev => ({ ...prev, ...parsed }));
        } catch (_) {}
      }
      if (data.email !== undefined) setSocialEmail(data.email || '');
      if (data.instagramUrl !== undefined) setInstagramUrl(data.instagramUrl || '');
      if (data.twitterUrl !== undefined) setTwitterUrl(data.twitterUrl || '');
      if (data.facebookUrl !== undefined) setFacebookUrl(data.facebookUrl || '');
      if (data.linkedinUrl !== undefined) setLinkedinUrl(data.linkedinUrl || '');
      if (data.youtubeUrl !== undefined) setYoutubeUrl(data.youtubeUrl || '');
      if (data.tiktokUrl !== undefined) setTiktokUrl(data.tiktokUrl || '');
      if (data.snapchatUrl !== undefined) setSnapchatUrl(data.snapchatUrl || '');
      if (data.notificationEmail !== undefined) setNotificationEmail(data.notificationEmail || '');
      
      // Load SMTP Settings
      if (data.smtpHost !== undefined) setSmtpHost(data.smtpHost || '');
      if (data.smtpPort !== undefined) setSmtpPort(data.smtpPort?.toString() || '');
      if (data.smtpUser !== undefined) setSmtpUser(data.smtpUser || '');
      if (data.smtpPass !== undefined) setSmtpPass(data.smtpPass || '');
      if (data.smtpFrom !== undefined) setSmtpFrom(data.smtpFrom || '');
      
      // Load Analytics Settings
      if (data.analyticsScript !== undefined) setAnalyticsScript(data.analyticsScript || '');
      if (data.analyticsDashboardUrl !== undefined) setAnalyticsDashboardUrl(data.analyticsDashboardUrl || '');

      // Load Address Settings
      if (data.addressAr !== undefined) setAddressAr(data.addressAr || '');
      if (data.addressEn !== undefined) setAddressEn(data.addressEn || '');
      if (data.addressMapLink !== undefined) setAddressMapLink(data.addressMapLink || '');

      // Load TechHub Settings
      if (data.techhubEnabled !== undefined) setTechhubEnabled(data.techhubEnabled);
      if (data.techhubClientId !== undefined) setTechhubClientId(data.techhubClientId || '');
      if (data.techhubClientSecret !== undefined) setTechhubClientSecret(data.techhubClientSecret || '');
      if (data.techhubApiKey !== undefined) setTechhubApiKey(data.techhubApiKey || '');
      if (data.techhubSandboxMode !== undefined) setTechhubSandboxMode(data.techhubSandboxMode);
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
    // Intercept global fetch to catch 401 Unauthorized errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        localStorage.removeItem('user');
        originalFetch('/api/logout', { method: 'POST' }).catch(() => {});
        await showAlert(language === 'ar' 
          ? 'انتهت صلاحية الجلسة أو غير مصرح بالعملية. يرجى تسجيل الدخول مرة أخرى.' 
          : 'Session expired or unauthorized. Please login again.'
        );
        window.location.href = '/login';
      }
      return response;
    };

    fetchProperties();
    fetchSettings();
    fetchAnalytics();

    return () => {
      window.fetch = originalFetch;
    };
  }, [language]);

  // Handle File Upload -> Base64
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState<{type: 'error', text: string} | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageUploadMessage(null);
    setIsUploadingImages(true);

    let totalSize = 0;
    for (const file of Array.from(files) as File[]) {
      totalSize += file.size;
    }

    if (totalSize > 50 * 1024 * 1024) {
      setImageUploadMessage({ 
        type: 'error', 
        text: language === 'ar' ? 'إجمالي حجم الصور المرفوعة يتجاوز الحد الأقصى (50MB)' : 'Total upload size of images exceeds limit (50MB)' 
      });
      setIsUploadingImages(false);
      e.target.value = '';
      return;
    }

    let base64Images: string[] = [...formData.imageUrls];

    // Process sequentially to avoid blocking UI too much
    for (const file of Array.from(files) as File[]) {
      try {
        const base64 = await compressImage(file);
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

  const moveImage = (index: number, direction: 'prev' | 'next') => {
    const newUrls = [...formData.imageUrls];
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newUrls.length) {
      const temp = newUrls[index];
      newUrls[index] = newUrls[targetIndex];
      newUrls[targetIndex] = temp;
      setFormData({ ...formData, imageUrls: newUrls });
    }
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

    const utilityPayload = JSON.stringify({
      electricity: formData.includeElectricity,
      electricityCost: formData.includeElectricity ? (parseFloat(formData.electricityCostVal) || 0) : 0,
      electricityFrequency: formData.includeElectricity ? formData.electricityFrequencyVal : 'YEARLY',
      water: formData.includeWater,
      waterCost: formData.includeWater ? (parseFloat(formData.waterCostVal) || 0) : 0,
      waterFrequency: formData.includeWater ? formData.waterFrequencyVal : 'YEARLY'
    });

    const payload = {
      ...formData,
      utilityBills: utilityPayload,
      electricityCost: (formData.includeElectricity ? (parseFloat(formData.electricityCostVal) || 0) : 0) + (formData.includeWater ? (parseFloat(formData.waterCostVal) || 0) : 0),
      electricityFrequency: formData.includeElectricity ? formData.electricityFrequencyVal : (formData.includeWater ? formData.waterFrequencyVal : null),
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

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 45 * 1024 * 1024) {
      await showAlert(language === 'ar' ? 'حجم الفيديو يتجاوز الحد المسموح به (45 ميغابايت)' : 'Video size exceeds 45MB limit');
      return;
    }

    setIsUploadingVideo(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            resolve(event.target.result);
          } else {
            reject(new Error('Failed to read video file'));
          }
        };
        reader.onerror = () => reject(new Error('Video read error'));
        reader.readAsDataURL(file);
      });
      setFormData(prev => ({ ...prev, videoUrl: base64 }));
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'فشل معالجة ملف الفيديو' : 'Failed to process video file');
    } finally {
      setIsUploadingVideo(false);
      e.target.value = '';
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
      paymentsCount: '',
      utilityBills: 'NONE',
      includeElectricity: false,
      electricityCostVal: '',
      electricityFrequencyVal: 'YEARLY',
      includeWater: false,
      waterCostVal: '',
      waterFrequencyVal: 'YEARLY',
      vatExempt: false,
      allowedPaymentPlans: ["1", "2", "4"],
      videoUrl: ''
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

      let parsedUtility = {
        electricity: false,
        electricityCost: 0,
        electricityFrequency: 'YEARLY',
        water: false,
        waterCost: 0,
        waterFrequency: 'YEARLY'
      };
      try {
        if (propData.utilityBills) {
          const parsed = JSON.parse(propData.utilityBills);
          parsedUtility = {
            electricity: !!parsed.electricity,
            electricityCost: parsed.electricityCost || 0,
            electricityFrequency: parsed.electricityFrequency || 'YEARLY',
            water: !!parsed.water,
            waterCost: parsed.waterCost || 0,
            waterFrequency: parsed.waterFrequency || 'YEARLY'
          };
        }
      } catch (e) {
        if (propData.electricityCost > 0) {
          parsedUtility.electricity = true;
          parsedUtility.electricityCost = propData.electricityCost;
          parsedUtility.electricityFrequency = propData.electricityFrequency || 'YEARLY';
        }
      }
      
      let parsedPaymentPlans = ["1", "2", "4"];
      if (propData.allowedPaymentPlans) {
        try {
          parsedPaymentPlans = typeof propData.allowedPaymentPlans === 'string' 
            ? JSON.parse(propData.allowedPaymentPlans) 
            : propData.allowedPaymentPlans;
          if (!Array.isArray(parsedPaymentPlans)) {
            parsedPaymentPlans = [String(parsedPaymentPlans)];
          }
        } catch (_) {
          if (typeof propData.allowedPaymentPlans === 'string') {
            parsedPaymentPlans = propData.allowedPaymentPlans.split(',').map((s: string) => s.trim());
          }
        }
      } else if (propData.paymentsCount) {
        parsedPaymentPlans = [String(propData.paymentsCount)];
      }

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
        paymentsCount: propData.paymentsCount?.toString() || '',
        utilityBills: propData.utilityBills || 'NONE',
        includeElectricity: parsedUtility.electricity,
        electricityCostVal: parsedUtility.electricityCost ? parsedUtility.electricityCost.toString() : '',
        electricityFrequencyVal: parsedUtility.electricityFrequency,
        includeWater: parsedUtility.water,
        waterCostVal: parsedUtility.waterCost ? parsedUtility.waterCost.toString() : '',
        waterFrequencyVal: parsedUtility.waterFrequency,
        vatExempt: propData.vatExempt || false,
        allowedPaymentPlans: parsedPaymentPlans,
        videoUrl: propData.videoUrl || ''
      });
      setEditingId(property.id);
      setShowAddForm(true);
    } catch (error) {
      console.error('Error fetching property details for editing:', error);
      await showAlert(language === 'ar' ? 'حدث خطأ أثناء جلب تفاصيل العقار.' : 'Could not fetch property details.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        whatsappNumber,
        callingNumber,
        whatsappMessage,
        otpWebhookUrl,
        otpMessageTemplate,
        otpWebhookPayload,
        homeImages: JSON.stringify(homeImages),
        logoUrl,
        email: socialEmail,
        instagramUrl,
        twitterUrl,
        facebookUrl,
        linkedinUrl,
        youtubeUrl,
        tiktokUrl,
        snapchatUrl,
        notificationEmail,
        smtpHost,
        smtpPort: smtpPort ? Number(smtpPort) : null,
        smtpUser,
        smtpPass,
        smtpFrom,
        analyticsScript,
        analyticsDashboardUrl,
        addressAr,
        addressEn,
        addressMapLink,
        techhubEnabled,
        techhubClientId,
        techhubClientSecret,
        techhubApiKey,
        techhubSandboxMode
      };

      if (activeSettingsSection === 'social') {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await showAlert(language === 'ar' ? 'تم حفظ معلومات التواصل الاجتماعي بنجاح!' : 'Social media info saved!');
        } else {
          const errData = await res.json().catch(() => ({}));
          await showAlert(errData.error || (language === 'ar' ? 'فشل الحفظ.' : 'Save failed.'));
        }
      } else if (activeSettingsSection === 'images') {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await showAlert(language === 'ar' ? 'تم حفظ الصور بنجاح! أعد تحميل الصفحة الرئيسية لرؤية التغييرات.' : 'Images saved! Reload the home page to see changes.');
        } else {
          const errData = await res.json().catch(() => ({}));
          await showAlert(errData.error || (language === 'ar' ? 'فشل حفظ الصور.' : 'Failed to save images.'));
        }
      } else {
        // Validate JSON payload before sending if OTP
        if (activeSettingsSection === 'otp') {
          try {
            if (otpWebhookPayload.trim()) {
              JSON.parse(otpWebhookPayload);
            }
          } catch(parseErr) {
            await showAlert(language === 'ar' ? 'الرجاء إدخال قالب JSON صحيح' : 'Please provide a valid JSON template format.');
            setSavingSettings(false);
            return;
          }
        }
        
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await showAlert(language === 'ar' ? 'تم حفظ الإعدادات!' : 'Settings saved!');
        } else {
          const errData = await res.json().catch(() => ({}));
          await showAlert(errData.error || (language === 'ar' ? 'فشل حفظ الإعدادات.' : 'Failed to save settings.'));
        }
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'خطأ في النظام.' : 'System error.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTechHubSync = async () => {
    setSyncingTechHub(true);
    try {
      const res = await fetch('/api/admin/techhub/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        await showAlert(language === 'ar' 
          ? `تم المزامنة بنجاح! تم استيراد/مزامنة ${data.buildingsSynced} مبنى، ${data.unitsSynced} وحدة، ${data.rentersSynced} مستأجر.`
          : `Sync completed successfully! Processed ${data.buildingsSynced} buildings, ${data.unitsSynced} units, and ${data.rentersSynced} renters.`
        );
      } else {
        await showAlert(data.error || (language === 'ar' ? 'فشلت المزامنة.' : 'Sync failed.'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام أثناء المزامنة.' : 'System error during synchronization.');
    } finally {
      setSyncingTechHub(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t('admin.deleteConfirm'));
    if (!confirmed) return;
    
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties(properties.filter(p => p.id !== id));
      } else {
        await showAlert(language === 'ar' ? 'فشل حذف العقار.' : 'Failed to delete property.');
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'خطأ في حذف العقار.' : 'Error deleting property.');
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-4 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Logout */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-lg font-bold text-foreground">
              {language === 'ar' ? 'لوحة إدارة النظام' : 'Admin Control Panel'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="inline-flex w-full items-center justify-start rounded-xl bg-card border border-border p-1 text-muted-foreground mb-8 overflow-x-auto select-none scrollbar-none gap-1">
          {hasTabPermission('manage', userRole) && (
            <button 
              onClick={() => setActiveTab('manage')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'manage' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t('admin.manageProperties')}
            </button>
          )}
          {hasTabPermission('projects', userRole) && (
            <button 
              onClick={() => setActiveTab('projects')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'إدارة المشاريع' : 'Manage Projects'}
            </button>
          )}
          {hasTabPermission('buildings', userRole) && (
            <button 
              onClick={() => setActiveTab('buildings')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'buildings' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'إدارة المباني' : 'Buildings'}
            </button>
          )}
          {hasTabPermission('renters', userRole) && (
            <button 
              onClick={() => setActiveTab('renters')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'renters' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'المستأجرين' : 'Renters'}
            </button>
          )}
          {hasTabPermission('receipts', userRole) && (
            <button 
              onClick={() => setActiveTab('receipts')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'receipts' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'الإيصالات' : 'Receipts'}
            </button>
          )}
          {hasTabPermission('analytics', userRole) && (
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'الإحصائيات' : 'Analytics'}
            </button>
          )}
          {hasTabPermission('settings', userRole) && (
            <button 
              onClick={() => setActiveTab('settings')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t('admin.settings')}
            </button>
          )}
          {hasTabPermission('callbacks', userRole) && (
            <button 
              onClick={() => setActiveTab('callbacks')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'callbacks' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'طلبات التواصل' : 'Callbacks'}
            </button>
          )}
          {hasTabPermission('users', userRole) && (
            <button 
              onClick={() => setActiveTab('users')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'المستخدمين' : 'Users'}
            </button>
          )}
          {hasTabPermission('logs', userRole) && (
            <button 
              onClick={() => setActiveTab('logs')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'logs' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'السجلات' : 'Audit Logs'}
            </button>
          )}
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
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{showAddForm ? (editingId ? (language === 'ar' ? 'تعديل العقار' : 'Edit Property') : t('admin.addProperty')) : t('admin.propertiesList')}</h2>
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
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md shadow-xs bg-[#2563eb] text-white hover:bg-[#1d4ed8] cursor-pointer transition-colors"
              >
                {showAddForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                {showAddForm ? (language === 'ar' ? 'إلغاء' : 'Cancel') : t('admin.addProperty')}
              </button>
            </div>
            
            {!showAddForm ? (
              fetching ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t('admin.propertiesEmpty')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full ltr:text-left rtl:text-right border-collapse">
                    <thead>
                      <tr className="bg-card text-muted-foreground text-xs border-b border-border">
                        <th className="p-4 font-bold ltr:rounded-tl-xl rtl:rounded-tr-xl">#</th>
                        <th className="p-4 font-bold">{language === 'ar' ? 'اسم العقار' : 'Title (Ar/En)'}</th>
                        <th className="p-4 font-bold">{language === 'ar' ? 'النوع' : 'Type'}</th>
                        <th className="p-4 font-bold">{t('admin.placeholder.price')}</th>
                        <th className="p-4 font-bold text-center ltr:rounded-tr-xl rtl:rounded-tl-xl">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property, index) => (
                        <tr key={property.id} className="border-b border-border hover:bg-slate-50/40 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">{index + 1}</td>
                          <td className="p-4">
                            <p className="font-semibold text-xs text-foreground">{property.titleAr}</p>
                            <p className="text-[10px] text-muted-foreground font-sans mt-0.5" dir="ltr">{property.titleEn}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              property.type === 'SALE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-xs text-foreground font-mono flex items-center gap-1.5 justify-end">
                            {property.price.toLocaleString()} <SrIcon className="w-4 h-4 text-muted-foreground" />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(property)}
                                className="p-2 text-muted-foreground hover:text-sky-400 hover:border-sky-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                title={language === 'ar' ? 'تعديل' : 'Edit'}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(property.id)}
                                className="p-2 text-red-500 hover:text-red-400 hover:border-red-500/30 rounded-lg border border-border bg-card/50 hover:bg-red-950/20 cursor-pointer transition-all inline-flex items-center justify-center"
                                title={t('admin.deleteProperty')}
                              >
                                <Trash2 className="w-4 h-4" />
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
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.titleAr')}</label>
                      <input required type="text" value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} className="cn-input" placeholder="مثال: فيلا فاخرة للبيع في الملقا" />
                    </div>
                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.titleEn')}</label>
                      <input required type="text" value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="cn-input" placeholder="e.g. Luxury Villa in Al Malqa" />
                    </div>
                    
                    <div>
                      <label className="cn-label mb-2">{language === 'ar' ? 'نوع العرض' : 'Type'}</label>
                      <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="cn-input">
                        <option value="SALE">{t('common.sale')}</option>
                        <option value="RENT">{t('common.rent')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.category')}</label>
                      <select value={formData.propertyCategory} onChange={(e) => setFormData({ ...formData, propertyCategory: e.target.value })} className="cn-input">
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
                        <option value="ROOM">{t('cat.ROOM')}</option>
                      </select>
                    </div>

                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.area')}</label>
                      <input required type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="cn-input" placeholder="150" />
                    </div>

                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.propertyAge')}</label>
                      <input type="number" value={formData.propertyAge} onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })} className="cn-input" placeholder="0" />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'الموقع الجغرافي' : 'Location & Links'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="cn-label mb-2">{t('admin.placeholder.locationText')} {language === 'ar' ? '(اختياري)' : '(Optional)'}</label>
                      <input type="text" value={formData.locationText} onChange={(e) => setFormData({ ...formData, locationText: e.target.value })} className="cn-input" placeholder="Al Malqa, Riyadh..." />
                    </div>
                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.locationLink')} {language === 'ar' ? '(اختياري)' : '(Optional)'}</label>
                      <input type="url" value={formData.locationLink} onChange={(e) => setFormData({ ...formData, locationLink: e.target.value })} className="cn-input" placeholder="https://maps.google.com/..." />
                    </div>
                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.aqarLink')} {language === 'ar' ? '(اختياري)' : '(Optional)'}</label>
                      <input type="url" value={formData.aqarLink} onChange={(e) => setFormData({ ...formData, aqarLink: e.target.value })} className="cn-input" placeholder="https://sa.aqar.fm/..." />
                    </div>
                  </div>
                </div>

                {/* Financial Costs Section */}
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'التكاليف المالية' : 'Financial Details'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={formData.type === 'RENT' ? "md:col-span-2" : ""}>
                      <label className="cn-label mb-2">{t('admin.placeholder.price')}</label>
                      <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                        <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                          <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                        </div>
                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0" placeholder="2500000" />
                        {formData.type === 'RENT' && (
                          <div className="flex border-l border-border ltr:border-l rtl:border-r flex-shrink-0">
                            <select value={formData.paymentFrequency} onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })} className="bg-card w-36 px-4 py-1 outline-none focus:ring-0 font-medium border-none cursor-pointer">
                              <option value="YEARLY">{t('common.yearly')}</option>
                              <option value="MONTHLY">{t('common.monthly')}</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {formData.type === 'RENT' && (
                      <div className="md:col-span-2 space-y-2.5">
                        <label className="cn-label text-xs">
                          {language === 'ar' ? 'أقساط الدفع المقبولة' : 'Allowed Payment Installments'}
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                          {[
                            { value: "1", labelAr: "دفعة واحدة سنوية", labelEn: "1 Payment (Annual)" },
                            { value: "2", labelAr: "دفعتين (نصف سنوي)", labelEn: "2 Installments" },
                            { value: "3", labelAr: "3 دفعات", labelEn: "3 Installments" },
                            { value: "4", labelAr: "4 دفعات (ربع سنوي)", labelEn: "4 Installments" },
                            { value: "6", labelAr: "6 دفعات", labelEn: "6 Installments" },
                            { value: "12", labelAr: "12 دفعة شهري", labelEn: "12 Installments (Monthly)" }
                          ].map((opt) => {
                            const isSelected = formData.allowedPaymentPlans?.includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  let updated = formData.allowedPaymentPlans || [];
                                  if (updated.includes(opt.value)) {
                                    updated = updated.filter(v => v !== opt.value);
                                  } else {
                                    updated = [...updated, opt.value];
                                  }
                                  updated.sort((a, b) => Number(a) - Number(b));
                                  setFormData({ 
                                    ...formData, 
                                    allowedPaymentPlans: updated,
                                    paymentsCount: updated[0] || '1'
                                  });
                                }}
                                className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary/10 border-primary text-primary shadow-xs'
                                    : 'bg-card border-border text-muted-foreground hover:bg-muted/50'
                                }`}
                              >
                                {language === 'ar' ? opt.labelAr : opt.labelEn}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {formData.type === 'RENT' && (
                      <div className="md:col-span-2 space-y-4">
                        <label className="cn-label">{language === 'ar' ? 'الفواتير الخدمية' : 'Utility Bills'}</label>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, includeElectricity: !formData.includeElectricity })}
                            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              formData.includeElectricity 
                                ? 'bg-primary/10 border-primary text-primary shadow-xs' 
                                : 'bg-card border-border text-muted-foreground hover:bg-muted/50'
                            }`}
                          >
                            <span>⚡</span>
                            <span>{language === 'ar' ? 'فاتورة الكهرباء' : 'Electricity Bill'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, includeWater: !formData.includeWater })}
                            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              formData.includeWater 
                                ? 'bg-primary/10 border-primary text-primary shadow-xs' 
                                : 'bg-card border-border text-muted-foreground hover:bg-muted/50'
                            }`}
                          >
                            <span>💧</span>
                            <span>{language === 'ar' ? 'فاتورة المياه' : 'Water Bill'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.includeElectricity && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                              <label className="cn-label text-xs">
                                {language === 'ar' ? 'تكلفة الكهرباء:' : 'Electricity Cost:'}
                              </label>
                              <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                <div className="flex bg-muted items-center justify-center px-3 border-r border-border ltr:border-r rtl:border-l flex-shrink-0">
                                  <span className="text-muted-foreground font-bold text-xs">{t('common.currency')}</span>
                                </div>
                                <input 
                                  type="number" 
                                  value={formData.electricityCostVal} 
                                  onChange={(e) => setFormData({ ...formData, electricityCostVal: e.target.value })} 
                                  className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground" 
                                  placeholder="0" 
                                />
                                <div className="flex border-l border-border ltr:border-l rtl:border-r flex-shrink-0">
                                  <select 
                                    value={formData.electricityFrequencyVal} 
                                    onChange={(e) => setFormData({ ...formData, electricityFrequencyVal: e.target.value })} 
                                    className="bg-card w-28 px-3 py-1 outline-none focus:ring-0 font-medium border-none cursor-pointer text-foreground"
                                  >
                                    <option value="YEARLY">{t('common.yearly')}</option>
                                    <option value="MONTHLY">{t('common.monthly')}</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {formData.includeWater && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                              <label className="cn-label text-xs">
                                {language === 'ar' ? 'تكلفة المياه:' : 'Water Cost:'}
                              </label>
                              <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                                <div className="flex bg-muted items-center justify-center px-3 border-r border-border ltr:border-r rtl:border-l flex-shrink-0">
                                  <span className="text-muted-foreground font-bold text-xs">{t('common.currency')}</span>
                                </div>
                                <input 
                                  type="number" 
                                  value={formData.waterCostVal} 
                                  onChange={(e) => setFormData({ ...formData, waterCostVal: e.target.value })} 
                                  className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground" 
                                  placeholder="0" 
                                />
                                <div className="flex border-l border-border ltr:border-l rtl:border-r flex-shrink-0">
                                  <select 
                                    value={formData.waterFrequencyVal} 
                                    onChange={(e) => setFormData({ ...formData, waterFrequencyVal: e.target.value })} 
                                    className="bg-card w-28 px-3 py-1 outline-none focus:ring-0 font-medium border-none cursor-pointer text-foreground"
                                  >
                                    <option value="YEARLY">{t('common.yearly')}</option>
                                    <option value="MONTHLY">{t('common.monthly')}</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                     <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="cn-label">{t('admin.placeholder.vat')}</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            vatExempt: !formData.vatExempt,
                            vat: !formData.vatExempt ? '0' : formData.vat 
                          })}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${formData.vatExempt ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-muted text-muted-foreground border border-border hover:bg-gray-200'}`}
                        >
                          {formData.vatExempt ? (language === 'ar' ? 'معفى من الضريبة ✓' : 'VAT Exempt ✓') : (language === 'ar' ? 'معفى؟' : 'Exempt?')}
                        </button>
                      </div>
                      <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                        <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                          <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                        </div>
                        <input 
                          type="number" 
                          disabled={formData.vatExempt}
                          value={formData.vatExempt ? '0' : formData.vat} 
                          onChange={(e) => setFormData({ ...formData, vat: e.target.value })} 
                          className="cn-input disabled:opacity-50" 
                          placeholder="0" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.commission')}</label>
                      <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                        <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                          <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                        </div>
                        <input type="number" value={formData.commission} onChange={(e) => setFormData({ ...formData, commission: e.target.value })} className="cn-input" placeholder="0" />
                      </div>
                    </div>

                    {/* Allowed Payment Plans checkboxes removed */}

                  </div>
                </div>

                {/* Details & Features Section */}
                <div className="space-y-8">
                  {/* Additional Details (Key-Value) Card */}
                  <div className="bg-card/50 border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-2 mb-2">
                        <span className="bg-primary/10 text-primary w-5 h-5 rounded-lg inline-flex items-center justify-center text-xs font-bold">1</span>
                        {language === 'ar' ? 'التفاصيل الإضافية (خصائص بقيمة)' : 'Additional Details (Key & Value)'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' 
                          ? 'أدخل خصائص محددة بقيمة، مثل: (الواجهة: شمالية، عدد الصالات: 2، مسطح البناء: 300 م²). ملاحظة: عمر العقار موجود في البيانات الأساسية.'
                          : 'Enter specific key-value properties, e.g., (Facade: North, Halls: 2, Built Area: 300 m²). Note: Property Age is configured under Basic Information.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 py-2">
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
                          className="bg-background border border-border text-foreground px-2.5 py-1 rounded-full text-xs font-medium hover:bg-muted flex items-center gap-1 transition shadow-sm"
                          title={pd.example}
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          {language === 'ar' ? pd.keyAr : pd.keyEn}
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      {formData.detailsList.length > 0 && (
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 px-1 text-xs font-semibold text-muted-foreground">
                          <div>{language === 'ar' ? 'الخاصية / التفصيل' : 'Property / Detail'}</div>
                          <div>{language === 'ar' ? 'القيمة' : 'Value'}</div>
                          <div className="w-10"></div>
                        </div>
                      )}
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
                            placeholder={language === 'ar' ? 'الخاصية (مثال: الواجهة)' : 'Key (e.g. Facade)'}
                            className="flex-1 border border-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                          />
                          <input
                            type="text"
                            value={detail.value}
                            onChange={(e) => {
                              const newList = [...formData.detailsList];
                              newList[idx].value = e.target.value;
                              setFormData({ ...formData, detailsList: newList });
                            }}
                            placeholder={language === 'ar' ? 'القيمة (مثال: شمالية)' : 'Value (e.g. North)'}
                            className="flex-1 border border-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
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
                        className="text-primary font-bold flex items-center gap-2 hover:text-primary py-2 text-sm"
                      >
                        <PlusCircle className="w-4.5 h-4.5" />
                        {language === 'ar' ? 'إضافة تفصيل مخصص' : 'Add Custom Detail'}
                      </button>
                    </div>
                  </div>

                  {/* Additional Features (amenity tags) Card */}
                  <div className="bg-card/50 border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/60 pb-2 mb-2">
                        <span className="bg-primary/10 text-primary w-5 h-5 rounded-lg inline-flex items-center justify-center text-xs font-bold">2</span>
                        {language === 'ar' ? 'المميزات الإضافية (نصوص فردية)' : 'Additional Features (Single Tags)'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' 
                          ? 'أدخل مميزات فردية أو خدمات عامة للعقار، مثل: (مسبح، نادي رياضي، دخول ذكي، حديقة).' 
                          : 'Enter individual amenities or facilities, e.g., (Pool, Gym, Smart Access, Garden).'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 py-2">
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
                          className="bg-background border border-border text-foreground px-2.5 py-1 rounded-full text-xs font-medium hover:bg-muted flex items-center gap-1 transition shadow-sm"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          {language === 'ar' ? pf.keyAr : pf.keyEn}
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      {formData.featuresList.length > 0 && (
                        <div className="grid grid-cols-[1fr_auto] gap-2 px-1 text-xs font-semibold text-muted-foreground">
                          <div>{language === 'ar' ? 'اسم الميزة' : 'Feature Name'}</div>
                          <div className="w-10"></div>
                        </div>
                      )}
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
                            className="w-full border border-border bg-background rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
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
                        className="text-primary font-bold flex items-center gap-2 hover:text-primary py-2 text-sm"
                      >
                        <PlusCircle className="w-4.5 h-4.5" />
                        {language === 'ar' ? 'إضافة ميزة مخصصة' : 'Add Custom Feature'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'الوصف' : 'Description'}</h3>
                  <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="cn-input resize-none" placeholder={language === 'ar' ? 'أضف وصفاً مفصلاً للعقار...' : 'Add a detailed description...'} />
                </div>

                {/* Images Section */}
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'الصور' : 'Images'} (Max 50MB total)</h3>
                  
                  {imageUploadMessage && (
                    <div className="mb-4 p-4 rounded-xl font-bold border bg-red-50 text-red-700 border-red-200 flex items-center gap-3">
                       <X className="w-5 h-5 flex-shrink-0" />
                       {imageUploadMessage.text}
                    </div>
                  )}

                  <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isUploadingImages ? 'border-border bg-muted cursor-not-allowed' : 'border-border bg-card hover:bg-muted'}`}>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={isUploadingImages} />
                    <label htmlFor="image-upload" className={`flex flex-col items-center ${isUploadingImages ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      {isUploadingImages ? (
                        <Loader2 className="w-12 h-12 text-indigo-500 mb-4 animate-spin" />
                      ) : (
                        <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
                      )}
                      
                      <span className={`font-bold text-lg ${isUploadingImages ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {isUploadingImages ? (language === 'ar' ? 'جاري معالجة الصور...' : 'Processing Images...') : t('admin.placeholder.imagesDesc')}
                      </span>
                    </label>
                  </div>
                  
                  {formData.imageUrls.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {formData.imageUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border group/img">
                          <img src={url} alt="upload preview" className="w-full h-full object-cover" />
                          
                          {/* Main Image Badge */}
                          {i === 0 && (
                            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                              {language === 'ar' ? 'الرئيسية' : 'Main'}
                            </div>
                          )}

                          <button 
                            type="button" 
                            onClick={() => removeImage(i)} 
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md z-10 transition-colors cursor-pointer"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* Rearrange Arrows Overlay Bar */}
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-1.5 z-10 opacity-85 hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => moveImage(i, 'prev')}
                              className="p-1.5 bg-background/95 hover:bg-background text-foreground rounded-lg shadow-sm border border-border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title={language === 'ar' ? 'تحريك للخلف' : 'Move Left'}
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={i === formData.imageUrls.length - 1}
                              onClick={() => moveImage(i, 'next')}
                              className="p-1.5 bg-background/95 hover:bg-background text-foreground rounded-lg shadow-sm border border-border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              title={language === 'ar' ? 'تحريك للأمام' : 'Move Right'}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Video Tour Section */}
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">
                    {language === 'ar' ? 'العرض المرئي للعقار (فيديو)' : 'Property Video Tour'}
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="cn-label mb-2">{language === 'ar' ? 'رابط فيديو مباشر (URL)' : 'Direct Video URL'}</label>
                      <input 
                        type="text" 
                        value={formData.videoUrl && !formData.videoUrl.startsWith('data:video') ? formData.videoUrl : ''} 
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
                        className="cn-input text-xs" 
                        placeholder={language === 'ar' ? 'أو أدخل رابط فيديو مباشر (مثال: https://assets...mp4)' : 'Or enter a direct mp4 video URL (e.g. https://...mp4)'} 
                        dir="ltr"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {language === 'ar' ? 'أو رفع ملف فيديو (الحد الأقصى 45 ميغابايت):' : 'Or Upload a Video File (Max 45MB):'}
                      </span>
                      
                      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isUploadingVideo ? 'border-border bg-muted cursor-not-allowed' : 'border-border bg-card hover:bg-muted'}`}>
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="video-upload" disabled={isUploadingVideo} />
                        <label htmlFor="video-upload" className={`flex flex-col items-center ${isUploadingVideo ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          {isUploadingVideo ? (
                            <Loader2 className="w-12 h-12 text-indigo-500 mb-4 animate-spin" />
                          ) : (
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          )}
                          
                          <span className="font-bold text-sm text-muted-foreground">
                            {isUploadingVideo ? (language === 'ar' ? 'جاري معالجة الفيديو...' : 'Processing Video Tour...') : (language === 'ar' ? 'اختر ملف فيديو لرفعه' : 'Choose a video file to upload')}
                          </span>
                        </label>
                      </div>
                      
                      {formData.videoUrl && (
                        <div className="relative border border-border bg-muted rounded-xl p-4 flex flex-col gap-3">
                          <span className="text-[11px] font-bold text-emerald-600 block uppercase tracking-wider">
                            {language === 'ar' ? 'تم تجهيز عرض الفيديو بنجاح!' : 'Video tour ready!'}
                          </span>
                          <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-border bg-black">
                            <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, videoUrl: '' })}
                            className="w-max px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
                          >
                            {language === 'ar' ? 'إزالة الفيديو' : 'Remove Video'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-white font-bold py-4 px-4 rounded-xl transition-all flex justify-center items-center gap-2 text-base shadow-lg cursor-pointer"
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
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">{language === 'ar' ? 'تحليلات الموقع' : 'Site Analytics'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-card p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                  <Eye className="w-6 h-6" />
                  <h3 className="text-lg font-bold">{language === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}</h3>
                </div>
                <p className="text-4xl font-black text-foreground">{analytics.totalViews}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">{language === 'ar' ? 'أكثر الصفحات زيارة' : 'Top Pages'}</h3>
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
                    <div key={idx} className="flex justify-between items-center p-4 bg-card rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all group">
                      <span className="font-bold text-foreground text-sm truncate">{displayPath} <span className="text-gray-400 font-mono text-xs hidden sm:inline ml-2">({item.path})</span></span>
                      <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg text-sm flex-shrink-0 group-hover:bg-yellow-100 transition-colors">{item._count.path} {language === 'ar' ? 'م' : 'v'}</span>
                    </div>
                  )})}
                  {analytics.pathsViews.length === 0 && <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد بيانات بعد.' : 'No data yet.'}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">{language === 'ar' ? 'أكثر العقارات زيارة' : 'Top Properties'}</h3>
                <div className="space-y-4">
                  {analytics.propertiesViews.map((item, idx) => {
                    const prop = properties.find(p => p.id === item.propertyId);
                    const title = prop ? (language === 'ar' ? prop.titleAr : prop.titleEn) : (language === 'ar' ? 'عقار تم حذفه' : 'Deleted Property');
                    return (
                    <div key={idx} className="flex justify-between items-center p-4 bg-card rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all group">
                      <span className="font-bold text-foreground truncate pr-4">{title}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                        {item._count.propertyId} {language === 'ar' ? 'مشاهدة' : 'Views'}
                      </span>
                    </div>
                  )})}
                  {analytics.propertiesViews.length === 0 && <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد بيانات بعد.' : 'No data yet.'}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="min-h-[500px] w-full max-w-5xl">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-foreground leading-none">{t('admin.settings')}</h2>
                <p className="text-muted-foreground font-medium mt-2 leading-none">{language === 'ar' ? 'إدارة إعدادات الموقع والتواصل' : 'Manage site and contact settings'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {/* Settings Sidebar */}
              <div className="col-span-1 flex flex-col gap-1.5 bg-card border border-border p-2 rounded-xl">
                {[
                  { section: 'whatsapp', labelAr: 'التواصل والواتساب', labelEn: 'WhatsApp & Social', icon: <MessageSquare className="w-4 h-4" /> },
                  { section: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email Settings', icon: <Mail className="w-4 h-4" /> },
                  { section: 'otp', labelAr: 'رمز التحقق (OTP)', labelEn: 'OTP Verification', icon: <KeyRound className="w-4 h-4" /> },
                  { section: 'images', labelAr: 'صور الموقع', labelEn: 'Site Images', icon: <ImagePlus className="w-4 h-4" /> },
                  { section: 'analytics', labelAr: 'إحصائيات الموقع', labelEn: 'Site Analytics', icon: <BarChart3 className="w-4 h-4" /> },
                  { section: 'backup', labelAr: 'نسخة احتياطية', labelEn: 'Database Backup', icon: <Database className="w-4 h-4" /> },
                  { section: 'techhub', labelAr: 'ربط TechHub', labelEn: 'TechHub Sync', icon: <RefreshCw className="w-4 h-4" /> },
                ].map((item) => (
                  <button
                    key={item.section}
                    type="button"
                    onClick={() => setActiveSettingsSection(item.section as any)}
                    className={`flex items-center gap-3 w-full py-2.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeSettingsSection === item.section 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {item.icon}
                    <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                  </button>
                ))}
              </div>
              
              {/* Settings Form Content */}
              <form onSubmit={handleSaveSettings} className="col-span-1 md:col-span-3 space-y-6 bg-card border border-border p-6 rounded-xl">
              
              {activeSettingsSection === 'whatsapp' && (
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-4 inline-block">{language === 'ar' ? 'إعدادات الواتساب والتواصل والموقع' : 'WhatsApp, Social & Location Settings'}</h3>
                  
                  {/* WhatsApp Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="cn-label mb-2">{t('admin.placeholder.whatsapp')}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pe-2.5 pointer-events-none text-gray-400">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </div>
                        <input
                          required
                          type="text"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="cn-input font-mono !ps-12 pe-4 h-12 bg-background transition-all"
                          placeholder="966500000000"
                          dir="ltr"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
                        {language === 'ar' ? 'أدخل الرقم مع رمز الدولة بدون (+) أو (00). مثال: ' : 'Include country code without + or 00. Example: '}
                        <span className="font-mono text-xs bg-muted px-1 rounded block mt-1 w-max">966500000000</span>
                      </p>
                    </div>

                    <div>
                      <label className="cn-label mb-2">{language === 'ar' ? 'رقم الاتصال المباشر' : 'Direct Calling Number'}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pe-2.5 pointer-events-none text-gray-400">
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <input
                          required
                          type="text"
                          value={callingNumber}
                          onChange={(e) => setCallingNumber(e.target.value)}
                          className="cn-input font-mono !ps-12 pe-4 h-12 bg-background transition-all"
                          placeholder="966500000000"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="cn-label mb-2">{language === 'ar' ? 'نص رسالة الواتساب الافتراضي' : 'Default WhatsApp Message'}</label>
                      <textarea
                        required
                        rows={3}
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        className="cn-input resize-none min-h-[100px] font-medium"
                        placeholder={language === 'ar' ? 'مرحباً، أنا مهتم بهذا العقار: {title} - {link}' : 'Hello, I am interested in this property: {title} - {link}'}
                      />
                      <div className="mt-3 text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                        <p className="font-bold flex items-center gap-1.5 mb-1.5 text-muted-foreground">
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

                  {/* Social Media & Contact Section */}
                  <div className="border-t border-border pt-6 mt-6">
                    <h4 className="text-sm font-bold text-foreground mb-4">
                      {language === 'ar' ? 'وسائل التواصل الاجتماعي والبريد الإلكتروني' : 'Social Media & Email'}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">{language === 'ar' ? 'ستظهر الخانات المعبأة فقط على الصفحة الرئيسية.' : 'Only filled fields will appear on the home page.'}</p>
                    <div className="space-y-4">
                      {[
                        { label: language === 'ar' ? 'البريد الإلكتروني' : 'Email Address', value: socialEmail, setter: setSocialEmail, placeholder: 'info@benaa-edara.com', type: 'email', icon: <Mail className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'Instagram', value: instagramUrl, setter: setInstagramUrl, placeholder: 'https://instagram.com/benaandedara', type: 'url', icon: <IgIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'Twitter / X', value: twitterUrl, setter: setTwitterUrl, placeholder: 'https://x.com/benaandedara', type: 'url', icon: <XIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'Facebook', value: facebookUrl, setter: setFacebookUrl, placeholder: 'https://facebook.com/benaandedara', type: 'url', icon: <FbIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'LinkedIn', value: linkedinUrl, setter: setLinkedinUrl, placeholder: 'https://linkedin.com/company/benaandedara', type: 'url', icon: <LiIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'YouTube', value: youtubeUrl, setter: setYoutubeUrl, placeholder: 'https://youtube.com/@benaandedara', type: 'url', icon: <YtIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'TikTok', value: tiktokUrl, setter: setTiktokUrl, placeholder: 'https://tiktok.com/@benaandedara', type: 'url', icon: <TkIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                        { label: 'Snapchat', value: snapchatUrl, setter: setSnapchatUrl, placeholder: 'https://snapchat.com/add/benaandedara', type: 'url', icon: <SnapIcon className="w-4 h-4 text-muted-foreground inline-block align-middle mr-1.5 ml-1.5" /> },
                      ].map(field => (
                        <div key={field.label}>
                          <label className="block text-sm font-bold text-muted-foreground mb-1 flex items-center">
                            {field.icon} <span>{field.label}</span>
                          </label>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={e => field.setter(e.target.value)}
                            className="cn-input text-sm h-11 bg-background"
                            placeholder={field.placeholder}
                            dir="ltr"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Headquarters Location Section */}
                  <div className="border-t border-border pt-6 mt-6 space-y-4">
                    <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{language === 'ar' ? 'موقع المقر الرئيسي للمنشأة' : 'Headquarters Physical Location'}</span>
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-1">
                        {language === 'ar' ? 'العنوان (بالعربية)' : 'Address (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={addressAr}
                        onChange={e => setAddressAr(e.target.value)}
                        className="cn-input text-sm h-11 bg-background"
                        placeholder={language === 'ar' ? 'المملكة العربية السعودية، الرياض، طريق الملك عبد العزيز...' : 'Saudi Arabia, Riyadh, King Abdul Aziz Road...'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-1">
                        {language === 'ar' ? 'العنوان (بالإنجليزي)' : 'Address (English)'}
                      </label>
                      <input
                        type="text"
                        value={addressEn}
                        onChange={e => setAddressEn(e.target.value)}
                        className="cn-input text-sm h-11 bg-background"
                        placeholder="King Abdul Aziz Road, Al Yasmin district, Riyadh..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-muted-foreground mb-1">
                        {language === 'ar' ? 'رابط خريطة جوجل' : 'Google Maps Location Link'}
                      </label>
                      <input
                        type="text"
                        value={addressMapLink}
                        onChange={e => setAddressMapLink(e.target.value)}
                        className="cn-input text-sm h-11 bg-background"
                        placeholder="https://maps.google.com/?q=..."
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === 'email' && (
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-4 inline-block">{language === 'ar' ? 'إعدادات البريد الإلكتروني للطلبات' : 'Callback Notification Email Settings'}</h3>
                  <div className="space-y-6">


                    <div className="border-t border-border/60 pt-6 mt-6 space-y-4">
                      <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{language === 'ar' ? 'إعدادات خادم SMTP' : 'SMTP Server Settings'}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'خادم SMTP (Host)' : 'SMTP Host'}</label>
                          <input
                            type="text"
                            value={smtpHost}
                            onChange={(e) => setSmtpHost(e.target.value)}
                            className="cn-input font-mono text-xs bg-background"
                            placeholder="smtp.gmail.com"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'منفذ SMTP (Port)' : 'SMTP Port'}</label>
                          <input
                            type="number"
                            value={smtpPort}
                            onChange={(e) => setSmtpPort(e.target.value)}
                            className="cn-input font-mono text-xs bg-background"
                            placeholder="587"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'اسم المستخدم (User)' : 'SMTP Username'}</label>
                          <input
                            type="text"
                            value={smtpUser}
                            onChange={(e) => setSmtpUser(e.target.value)}
                            className="cn-input font-mono text-xs bg-background"
                            placeholder="user@example.com"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'كلمة المرور (Password)' : 'SMTP Password'}</label>
                          <input
                            type="password"
                            value={smtpPass}
                            onChange={(e) => setSmtpPass(e.target.value)}
                            className="cn-input font-mono text-xs bg-background"
                            placeholder="••••••••"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'بريد المرسل (From)' : 'Sender Email (From)'}</label>
                        <input
                          type="email"
                          value={smtpFrom}
                          onChange={(e) => setSmtpFrom(e.target.value)}
                          className="cn-input font-mono text-xs bg-background"
                          placeholder="no-reply@yourdomain.com"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === 'otp' && (
                <div>
                  <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-5 inline-block">
                    {language === 'ar' ? 'إعدادات تسجيل المستأجرين (OTP Webhook)' : 'Renter Login Settings (OTP Webhook)'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="cn-label mb-2">
                         {language === 'ar' ? 'رابط الويب هوك (Whatomate URL)' : 'Webhook URL (Whatomate)'}
                      </label>
                      <input
                        type="url"
                        value={otpWebhookUrl}
                        onChange={(e) => setOtpWebhookUrl(e.target.value)}
                        className="cn-input font-medium dir-ltr"
                        placeholder="https://hook.us2.make.com/..."
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {language === 'ar' ? 'اتركه فارغاً لتعطيل إرسال الرسائل عبر الويب هوك.' : 'Leave empty to disable sending webhooks.'}
                      </p>
                    </div>

                    <div>
                      <label className="cn-label mb-2">
                        {language === 'ar' ? 'قالب رسالة رمز التحقق' : 'OTP Message Template'}
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={otpMessageTemplate}
                        onChange={(e) => setOtpMessageTemplate(e.target.value)}
                        className="cn-input resize-none min-h-[100px] font-medium"
                        placeholder={language === 'ar' ? 'رمز التحقق الخاص بك هو: {otp}' : 'Your verification code is: {otp}'}
                      />
                      <div className="mt-3 text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                        <p className="font-bold flex items-center gap-1.5 mb-1.5 text-muted-foreground">
                          <Info className="w-4 h-4" />
                          {language === 'ar' ? 'المتغيرات المدعومة:' : 'Supported Variables:'}
                        </p>
                        <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                          <li><span className="text-blue-600 bg-blue-50 px-1 rounded">{'{otp}'}</span> - {language === 'ar' ? 'رمز التحقق المكون من 4 أرقام' : 'The 4-digit verification code'}</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <label className="cn-label mb-2">
                         {language === 'ar' ? 'قالب JSON لإرسال الويب هوك (Whatomate JSON)' : 'Webhook JSON Payload Template'}
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={otpWebhookPayload}
                        onChange={(e) => setOtpWebhookPayload(e.target.value)}
                        className="w-full border border-border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-xs dir-ltr bg-card"
                        placeholder={'{\n  "phone": "{phone}",\n  "type": "template"\n}'}
                      />
                      <div className="mt-3 text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                        <p className="font-bold flex items-center gap-1.5 mb-1.5 text-muted-foreground">
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

              {activeSettingsSection === 'images' && (() => {
                const imageSlots = [
                  {
                    key: 'logo' as const,
                    labelAr: 'شعار الموقع (Logo)',
                    labelEn: 'Site Logo',
                    hintAr: 'يظهر في شريط التنقل والتذييل. يفضل PNG بخلفية شفافة.',
                    hintEn: 'Appears in navbar & footer. PNG with transparent background preferred.',
                    current: logoUrl,
                    onUpload: (base64: string) => setLogoUrl(base64),
                    onRemove: () => setLogoUrl(null),
                  },
                  {
                    key: 'hero' as const,
                    labelAr: 'صورة الخلفية الرئيسية (Hero)',
                    labelEn: 'Hero Background Image',
                    hintAr: 'الصورة الكبيرة خلف عنوان الصفحة الرئيسية.',
                    hintEn: 'The large background image behind the main page title.',
                    current: homeImages.hero,
                    onUpload: (base64: string) => setHomeImages(p => ({ ...p, hero: base64 })),
                    onRemove: () => setHomeImages(p => ({ ...p, hero: null })),
                  },
                  {
                    key: 'promoVideo' as const,
                    labelAr: 'فيديو العرض التعريفي في الصفحة الرئيسية',
                    labelEn: 'Promotional Video for Home Page',
                    hintAr: 'يمكنك رفع ملف فيديو (MP4) أو إدخال رابط فيديو مباشر في الحقل أدناه.',
                    hintEn: 'You can upload a video file (MP4) or enter a direct video URL in the field below.',
                    current: homeImages.promoVideo,
                    isVideo: true,
                    onUpload: (val: string) => setHomeImages(p => ({ ...p, promoVideo: val })),
                    onRemove: () => setHomeImages(p => ({ ...p, promoVideo: null })),
                  },
                ];

                const handleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotKey: string, isVideo: boolean, onUpload: (b: string) => void) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 50 * 1024 * 1024) {
                    await showAlert(language === 'ar' ? 'حجم الملف يتجاوز 50MB' : 'File exceeds 50MB limit');
                    return;
                  }
                  setImageSlotUploading(slotKey);
                  let base64 = '';
                  if (isVideo) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onUpload(reader.result as string);
                      setImageSlotUploading(null);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                    return;
                  } else if (slotKey === 'hero') {
                    base64 = await compressImage(file, 2560, 1440, 0.92);
                  } else if (slotKey === 'logo') {
                    base64 = await compressImage(file, 512, 512, 0.95);
                  }
                  onUpload(base64);
                  setImageSlotUploading(null);
                  e.target.value = '';
                };

                return (
                  <div>
                    <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-4 inline-block">
                      {language === 'ar' ? 'وسائط الصفحة الرئيسية والشعار' : 'Home Page Media & Logo'}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {language === 'ar'
                        ? 'ارفع شعار الموقع، صورة الخلفية الرئيسية، وفيديو العرض التعريفي.'
                        : 'Upload site logo, hero background image, and homepage video.'}
                    </p>
                    <div className="space-y-6">
                      {imageSlots.map(slot => (
                        <div key={slot.key} className="border border-border rounded-2xl p-5 bg-muted/20 hover:bg-muted/40 transition-colors">
                          <p className="font-bold text-foreground text-sm mb-1">
                            {language === 'ar' ? slot.labelAr : slot.labelEn}
                          </p>
                          {(slot.hintAr || slot.hintEn) && (
                            <p className="text-xs text-muted-foreground mb-3">
                              {language === 'ar' ? slot.hintAr : slot.hintEn}
                            </p>
                          )}
                          <div className="flex items-center gap-4 flex-wrap mt-3">
                            {slot.current ? (
                              <div className="relative w-28 h-20 rounded-xl overflow-hidden border-2 border-primary bg-muted flex-shrink-0 flex items-center justify-center">
                                {slot.isVideo ? (
                                  <video src={slot.current} className="w-full h-full object-cover" muted />
                                ) : (
                                  <img src={slot.current} alt="preview" className="w-full h-full object-cover" />
                                )}
                                <button
                                  type="button"
                                  onClick={slot.onRemove}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow cursor-pointer"
                                  title={language === 'ar' ? (slot.isVideo ? 'حذف الفيديو' : 'حذف الصورة') : (slot.isVideo ? 'Remove video' : 'Remove image')}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-28 h-20 rounded-xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center flex-shrink-0">
                                <ImagePlus className="w-6 h-6 text-muted-foreground/60" />
                                <span className="text-xs text-muted-foreground/80 mt-1">{language === 'ar' ? 'افتراضية' : 'Default'}</span>
                              </div>
                            )}
                            <div>
                              <input
                                type="file"
                                accept={slot.isVideo ? "video/*" : "image/*"}
                                id={`img-slot-${slot.key}`}
                                className="hidden"
                                onChange={(e) => handleSlotUpload(e, slot.key, Boolean(slot.isVideo), slot.onUpload)}
                                disabled={imageSlotUploading === slot.key}
                              />
                              <label
                                htmlFor={`img-slot-${slot.key}`}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-bold cursor-pointer hover:bg-muted/40 transition-colors ${
                                  imageSlotUploading === slot.key ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {imageSlotUploading === slot.key ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <ImagePlus className="w-4 h-4 text-muted-foreground" />
                                )}
                                {slot.current
                                  ? (slot.isVideo ? (language === 'ar' ? 'تغيير الفيديو' : 'Change Video') : (language === 'ar' ? 'تغيير الصورة' : 'Change Image'))
                                  : (slot.isVideo ? (language === 'ar' ? 'رفع فيديو' : 'Upload Video') : (language === 'ar' ? 'رفع صورة' : 'Upload Image'))
                                }
                              </label>
                              <p className="text-[10px] text-muted-foreground mt-2">{language === 'ar' ? 'الحد الأقصى 50MB' : 'Max 50MB'}</p>
                            </div>
                            
                            {slot.isVideo && (
                              <div className="w-full mt-4 border-t border-border pt-4">
                                <label className="cn-label text-[11px] mb-1.5 font-bold text-foreground">
                                  {language === 'ar' ? 'أو أدخل رابط فيديو مباشر (MP4):' : 'Or enter a direct video URL (MP4):'}
                                </label>
                                <input
                                  type="text"
                                  value={slot.current && !slot.current.startsWith('data:') ? slot.current : ''}
                                  onChange={(e) => slot.onUpload(e.target.value)}
                                  placeholder="https://assets.mixkit.co/.../video.mp4"
                                  className="cn-input bg-background font-mono h-11 text-xs max-w-xl"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}



              {activeSettingsSection === 'backup' && (
                <div>
                  <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-6">
                    {language === 'ar' ? 'نسخة احتياطية واستعادة' : 'Backup & Restore'}
                  </h3>

                  {/* Download Backup */}
                  <div className="border border-border rounded-2xl p-6 bg-card mb-6">
                    <h4 className="font-bold text-foreground mb-1">{language === 'ar' ? 'تنزيل نسخة احتياطية' : 'Download Backup'}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar'
                        ? 'تحميل ملف ZIP يحتوي على قاعدة البيانات كاملة (مع جميع الصور) وملفات الصور كملفات حقيقية.'
                        : 'Downloads a ZIP containing the full database (with all images embedded) plus extracted image files for convenience.'}
                    </p>
                    <button
                      type="button"
                      disabled={backupLoading}
                      onClick={async () => {
                        setBackupLoading(true);
                        try {
                          const res = await fetch('/api/admin/backup');
                          if (!res.ok) throw new Error('Failed');
                          const blob = await res.blob();
                          const cd = res.headers.get('Content-Disposition') || '';
                          const match = cd.match(/filename="(.+?)"/);
                          const filename = match ? match[1] : 'backup.zip';
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = filename; a.click();
                          URL.revokeObjectURL(url);
                        } catch(e) {
                          await showAlert(language === 'ar' ? 'فشل تنزيل النسخة.' : 'Backup download failed.');
                        } finally { setBackupLoading(false); }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary text-white font-bold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {language === 'ar' ? 'تنزيل ZIP' : 'Download ZIP'}
                    </button>
                  </div>

                  {/* Restore */}
                  <div className="border border-red-100 rounded-2xl p-6 bg-red-50">
                    <h4 className="font-bold text-red-700 mb-1">{language === 'ar' ? 'استعادة نسخة احتياطية' : 'Restore from Backup'}</h4>
                    <p className="text-sm text-red-600 mb-4">
                      {language === 'ar'
                        ? 'تحذير: ستحل قاعدة البيانات الحالية. ارفع ملف ZIP أو .db من نسخة احتياطية سابقة.'
                        : 'Warning: This will replace the current database. Upload a .zip or .db file from a previous backup.'}
                    </p>
                    {restoreMessage && (
                      <div className={`mb-4 p-3 rounded-xl text-sm font-bold ${restoreMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-200 text-red-800'}`}>
                        {restoreMessage.text}
                      </div>
                    )}
                    <input
                      type="file"
                      id="restore-file-input"
                      accept=".zip,.db"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const confirmed = await showConfirm(language === 'ar' ? 'هل أنت متأكد؟ سيتم استبدال قاعدة البيانات الحالية.' : 'Are you sure? This will replace the current database.');
                        if (!confirmed) return;
                        setRestoreLoading(true);
                        setRestoreMessage(null);
                        try {
                          const fd = new FormData();
                          fd.append('file', file);
                          const res = await fetch('/api/admin/restore', { method: 'POST', body: fd });
                          const data = await res.json();
                          if (res.ok) {
                            setRestoreMessage({ type: 'success', text: language === 'ar' ? 'تمت الاستعادة بنجاح. أعد تحميل الصفحة.' : 'Restore successful! Please reload the page.' });
                          } else {
                            setRestoreMessage({ type: 'error', text: data.error || 'Restore failed' });
                          }
                        } catch(err) {
                          setRestoreMessage({ type: 'error', text: 'Network error' });
                        } finally {
                          setRestoreLoading(false);
                          e.target.value = '';
                        }
                      }}
                    />
                    <label
                      htmlFor="restore-file-input"
                      className={`inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer transition-colors ${restoreLoading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {restoreLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {language === 'ar' ? 'اختر ملف للاستعادة' : 'Choose File to Restore'}
                    </label>
                  </div>
                </div>
              )}

               {activeSettingsSection === 'analytics' && (
                <div>
                  <h3 className="text-lg font-bold text-foreground border-b border-border pb-3 mb-5 inline-block">
                    {language === 'ar' ? 'تحليلات الموقع المفتوحة المصدر' : 'Open-Source Site Analytics Settings'}
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="cn-label">{language === 'ar' ? 'رمز تتبع التحليلات (Plausible / Umami Script Code)' : 'Analytics Tracking Script HTML Code'}</label>
                      <textarea
                        rows={4}
                        value={analyticsScript}
                        onChange={(e) => setAnalyticsScript(e.target.value)}
                        className="w-full border border-border rounded-xl p-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-mono text-xs bg-background"
                        placeholder={'<script defer src="https://cloud.umami.is/script.js" data-website-id="..."></script>'}
                        dir="ltr"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {language === 'ar' 
                          ? 'الصق رمز التتبع (HTML script tag) المقدم من أداة التحليلات (مثل Umami أو Plausible) ليتم إدراجه تلقائياً في جميع صفحات الموقع.' 
                          : 'Paste the analytics tracking script tag (e.g. from Umami or Plausible) to automatically inject it on all website pages.'}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="cn-label">{language === 'ar' ? 'رابط لوحة التحليلات المدمجة (Dashboard Share/Embed URL)' : 'Dashboard Embed / Share URL'}</label>
                      <input
                        type="text"
                        value={analyticsDashboardUrl}
                        onChange={(e) => setAnalyticsDashboardUrl(e.target.value)}
                        className="cn-input font-mono pl-4 pr-4 h-12 bg-background"
                        placeholder="https://cloud.umami.is/share/..."
                        dir="ltr"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        {language === 'ar' 
                          ? 'رابط المشاركة العام للوحة التحكم لعرضه مباشرة داخل تبويب "تحليلات الموقع" في لوحة الإدارة.' 
                          : 'The public shareable dashboard URL to display directly inside the "Site Analytics" tab in the Admin panel.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === 'techhub' && (
                <div>
                  <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-4 inline-block">
                    {language === 'ar' ? 'إعدادات الربط الإلكتروني (TechHub)' : 'TechHub Integration Settings'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="techhubEnabled"
                        checked={techhubEnabled}
                        onChange={(e) => setTechhubEnabled(e.target.checked)}
                        className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                      />
                      <label htmlFor="techhubEnabled" className="text-xs font-bold text-foreground cursor-pointer select-none">
                        {language === 'ar' ? 'تفعيل الربط مع TechHub' : 'Enable TechHub Integration'}
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="techhubSandboxMode"
                        checked={techhubSandboxMode}
                        onChange={(e) => setTechhubSandboxMode(e.target.checked)}
                        className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                      />
                      <label htmlFor="techhubSandboxMode" className="text-xs font-bold text-foreground cursor-pointer select-none">
                        {language === 'ar' ? 'تفعيل وضع التجربة (Sandbox Mode)' : 'Enable Sandbox / Test Mode'}
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="cn-label">{language === 'ar' ? 'معرف العميل (Client ID)' : 'Client ID'}</label>
                      <input
                        type="text"
                        value={techhubClientId}
                        onChange={(e) => setTechhubClientId(e.target.value)}
                        className="cn-input bg-background font-mono h-12"
                        placeholder="e.g. client_abc123"
                        disabled={techhubSandboxMode}
                        required={techhubEnabled && !techhubSandboxMode}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="cn-label">{language === 'ar' ? 'الرمز السري للعميل (Client Secret)' : 'Client Secret'}</label>
                      <input
                        type="password"
                        value={techhubClientSecret}
                        onChange={(e) => setTechhubClientSecret(e.target.value)}
                        className="cn-input bg-background font-mono h-12"
                        placeholder="••••••••••••••••"
                        disabled={techhubSandboxMode}
                        required={techhubEnabled && !techhubSandboxMode}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="cn-label">{language === 'ar' ? 'مفتاح واجهة التطبيق (API Key)' : 'API Key'}</label>
                      <input
                        type="password"
                        value={techhubApiKey}
                        onChange={(e) => setTechhubApiKey(e.target.value)}
                        className="cn-input bg-background font-mono h-12"
                        placeholder="••••••••••••••••"
                        disabled={techhubSandboxMode}
                        required={techhubEnabled && !techhubSandboxMode}
                      />
                    </div>

                    {techhubEnabled && (
                      <div className="pt-4 border-t border-border mt-6 font-sans">
                        <h4 className="text-xs font-bold text-foreground mb-2">
                          {language === 'ar' ? 'مزامنة البيانات الفورية' : 'Instant Data Synchronization'}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mb-4">
                          {language === 'ar' 
                            ? 'جلب العقارات والمستأجرين (عقود إيجار) من TechHub ومزامنتهم مباشرة مع قاعدة بيانات التطبيق.' 
                            : 'Fetch properties and contract renters from TechHub and sync them with your database.'}
                        </p>
                        <button
                          type="button"
                          onClick={handleTechHubSync}
                          disabled={syncingTechHub}
                          className="btn-primary inline-flex items-center gap-1.5 h-10 px-4 text-xs font-semibold rounded-md shadow-xs bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 cursor-pointer"
                        >
                          {syncingTechHub ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {language === 'ar' ? 'ابدأ المزامنة الآن' : 'Start Sync Now'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border pt-8">
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
        </div>
      )}

        {activeTab === 'callbacks' && <AdminCallbacks />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'logs' && <AdminLogs />}
      </motion.div>
    </AnimatePresence>
      </div>
    </div>
  );
}
