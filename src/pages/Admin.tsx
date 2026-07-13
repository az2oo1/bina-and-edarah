import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { PlusCircle, Loader2, Trash2, Home, MapPin, Settings as SettingsIcon, ImagePlus, X, BarChart3, Eye, EyeOff, Info, CheckCircle, Download, Upload, LogOut, Mail, ArrowLeft, ArrowRight, Pencil, MessageSquare, KeyRound, Database, RefreshCw, Video, Plus, Building2, Check, DollarSign, FileText, Image, LayoutGrid } from 'lucide-react';
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
  parentId?: string | null;
  propertyCategory?: string;
  status?: string;
  attachments?: string;
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

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  VILLA: ['Facade', 'Street Width', 'Rooms', 'Bedrooms', 'Halls', 'Bathrooms', 'Kitchen', 'Parking Spaces', 'Condition', 'Built Area'],
  APARTMENT: ['Facade', 'Floor', 'Rooms', 'Bedrooms', 'Halls', 'Bathrooms', 'Kitchen', 'Parking Spaces', 'Condition', 'Built Area'],
  ROOM: ['Floor', 'Rooms', 'Bathrooms', 'Kitchen', 'Condition'],
  LAND: ['Facade', 'Street Width'],
  OFFICE: ['Facade', 'Street Width', 'Floor', 'Elevators', 'Parking Spaces', 'Condition', 'Built Area'],
  SHOP: ['Facade', 'Street Width', 'Elevators', 'Parking Spaces', 'Condition', 'Built Area'],
  BUILDING: ['Facade', 'Street Width', 'Number of Units', 'Elevators', 'Parking Spaces', 'Condition', 'Built Area'],
  COMPOUND: ['Facade', 'Number of Units', 'Elevators', 'Parking Spaces', 'Condition', 'Built Area'],
  TOWER: ['Facade', 'Number of Units', 'Elevators', 'Parking Spaces', 'Condition', 'Built Area'],
  MALL: ['Facade', 'Number of Units', 'Elevators', 'Parking Spaces', 'Condition', 'Built Area']
};

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
  const [activeTab, setActiveTab] = useState<'manage' | 'projects' | 'buildings' | 'renters' | 'receipts' | 'settings' | 'callbacks' | 'users' | 'logs'>('manage');
  const [userRole, setUserRole] = useState<string>('ADMIN');
  const [selectedParentProperty, setSelectedParentProperty] = useState<Property | null>(null);
  const [selectedParentTab, setSelectedParentTab] = useState<'units' | 'renters' | 'details'>('units');

  useEffect(() => {
    setSelectedParentProperty(null);
    setSelectedParentTab('units');
  }, [activeTab]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      const roleVal = u.role || 'ADMIN';
      setUserRole(roleVal);
      
      const tabKeys: ('manage' | 'projects' | 'buildings' | 'renters' | 'receipts' | 'analytics' | 'callbacks' | 'users' | 'logs' | 'settings')[] = [
        'manage', 'projects', 'buildings', 'renters', 'receipts', 'analytics', 'callbacks', 'users', 'logs', 'settings'
      ];
      if (!hasTabPermission(activeTab, roleVal)) {
        const firstPermitted = tabKeys.find(tk => hasTabPermission(tk, roleVal));
        if (firstPermitted) {
          setActiveTab(firstPermitted);
        }
      }
    }
  }, [activeTab]);

  const [adminBuildings, setAdminBuildings] = useState<any[]>([]);
  const [matchingBuilding, setMatchingBuilding] = useState<any | null>(null);

  const fetchAdminBuildings = async () => {
    try {
      const res = await fetch('/api/admin/buildings');
      if (res.ok) {
        const data = await res.json();
        setAdminBuildings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdminBuildings();
  }, [activeTab]);

  useEffect(() => {
    if (selectedParentProperty) {
      const match = adminBuildings.find((b: any) => b.name === selectedParentProperty.titleAr || b.name === selectedParentProperty.titleEn);
      if (match) {
        setMatchingBuilding(match);
      } else {
        // Automatically create building in DB so that Excel imports and renter history can work!
        (async () => {
          try {
            const res = await fetch('/api/admin/buildings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: selectedParentProperty.titleAr })
            });
            if (res.ok) {
              const newB = await res.json();
              setAdminBuildings(prev => [newB, ...prev]);
              setMatchingBuilding(newB);
            }
          } catch (err) {
            console.error(err);
          }
        })();
      }
    } else {
      setMatchingBuilding(null);
    }
  }, [selectedParentProperty, adminBuildings]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [refreshingAnalytics, setRefreshingAnalytics] = useState(false);

  // Settings Form State
  const [activeSettingsSection, setActiveSettingsSection] = useState<'whatsapp' | 'otp' | 'images' | 'social' | 'backup' | 'email' | 'analytics' | 'techhub'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [callingNumber, setCallingNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('مرحباً، أنا مهتم بهذا العقار: {title} - {link}');
  const [otpWebhookUrl, setOtpWebhookUrl] = useState('');
  const [otpMessageTemplate, setOtpMessageTemplate] = useState('رمز التحقق الخاص بك هو: {otp}');
  const [otpWebhookPayload, setOtpWebhookPayload] = useState('{\n  "phone": "{phone}",\n  "otp": "{otp}",\n  "type": "template",\n  "message": "رمز التحقق الخاص بك هو: {otp}"\n}');
  const [savingSettings, setSavingSettings] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);

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

  // IMAP Settings State
  const [imapHost, setImapHost] = useState('');
  const [imapPort, setImapPort] = useState('');

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

  const [currentStep, setCurrentStep] = useState(1);

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
    videoUrl: '',
    attachments: [] as { name: string, url: string, size: number }[],
    parentId: '' as string | null,
    status: 'PUBLISHED',
    subProperties: [] as any[]
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
      
      // Load IMAP Settings
      if (data.imapHost !== undefined) setImapHost(data.imapHost || '');
      if (data.imapPort !== undefined) setImapPort(data.imapPort?.toString() || '');
      
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
    setRefreshingAnalytics(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setRefreshingAnalytics(false);
      }, 600);
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

    if (totalSize > 250 * 1024 * 1024) {
      setImageUploadMessage({ 
        type: 'error', 
        text: language === 'ar' ? 'إجمالي حجم الملفات المرفوعة يتجاوز الحد الأقصى (250MB)' : 'Total upload size of files exceeds limit (250MB)' 
      });
      setIsUploadingImages(false);
      e.target.value = '';
      return;
    }

    let base64Medias: string[] = [...formData.imageUrls];

    // Process sequentially
    for (const file of Array.from(files) as File[]) {
      try {
        if (file.type.startsWith('image/')) {
          const base64 = await compressImage(file);
          base64Medias.push(base64);
        } else if (file.type.startsWith('video/')) {
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
          base64Medias.push(base64);
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    setFormData(prev => ({ ...prev, imageUrls: base64Medias }));
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

  const saveProperty = async (e: React.FormEvent | null, statusVal: 'PUBLISHED' | 'DRAFT') => {
    if (e) e.preventDefault();
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
      status: statusVal,
      utilityBills: utilityPayload,
      electricityCost: (formData.includeElectricity ? (parseFloat(formData.electricityCostVal) || 0) : 0) + (formData.includeWater ? (parseFloat(formData.waterCostVal) || 0) : 0),
      electricityFrequency: formData.includeElectricity ? formData.electricityFrequencyVal : (formData.includeWater ? formData.waterFrequencyVal : null),
      features: formData.featuresList.map(f => f.value).filter(Boolean).join(','),
      imageUrls: JSON.stringify(formData.imageUrls),
      attachments: JSON.stringify(formData.attachments),
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
        showSubmitMessage('success', isEditing 
          ? (language === 'ar' ? 'تم تحديث العقار بنجاح' : 'Property updated successfully!') 
          : (statusVal === 'DRAFT' 
              ? (language === 'ar' ? 'تم حفظ المسودة بنجاح!' : 'Draft saved successfully!')
              : (language === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully!'))
        );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProperty(e, formData.status as 'PUBLISHED' | 'DRAFT' || 'PUBLISHED');
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
      videoUrl: '',
      parentId: '',
      status: 'PUBLISHED',
      subProperties: []
    });
    setEditingId(null);
    setShowAddForm(false);
    setCurrentStep(1);
    setShowUnitForm(false);
    setEditingUnitIndex(null);
  };

  // Expanded parents table state
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  // SubProperties inline editing state
  const [editingUnitIndex, setEditingUnitIndex] = useState<number | null>(null);
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [unitFormData, setUnitFormData] = useState({
    id: '',
    titleAr: '',
    titleEn: '',
    type: 'RENT',
    propertyCategory: 'APARTMENT',
    price: '',
    area: '',
    status: 'PUBLISHED',
    description: '',
    rooms: '',
    bathrooms: '',
    floor: ''
  });

  const handleNewUnitClick = () => {
    setUnitFormData({
      id: '',
      titleAr: '',
      titleEn: '',
      type: 'RENT',
      propertyCategory: 'APARTMENT',
      price: '',
      area: '',
      status: 'PUBLISHED',
      description: '',
      rooms: '',
      bathrooms: '',
      floor: ''
    });
    setEditingUnitIndex(null);
    setShowUnitForm(true);
  };

  const handleEditUnit = (index: number) => {
    const unit = formData.subProperties[index];
    let rooms = '';
    let bathrooms = '';
    let floor = '';
    try {
      const parsed = JSON.parse(unit.details || '[]');
      rooms = parsed.find((d: any) => d.key.includes('غرف') || d.key.toLowerCase().includes('room'))?.value || '';
      bathrooms = parsed.find((d: any) => d.key.includes('مياه') || d.key.toLowerCase().includes('bathroom'))?.value || '';
      floor = parsed.find((d: any) => d.key.includes('دور') || d.key.toLowerCase().includes('floor'))?.value || '';
    } catch (_) {}

    setUnitFormData({
      id: unit.id || '',
      titleAr: unit.titleAr || '',
      titleEn: unit.titleEn || '',
      type: unit.type || 'RENT',
      propertyCategory: unit.propertyCategory || 'APARTMENT',
      price: unit.price ? String(unit.price) : '',
      area: unit.area ? String(unit.area) : '',
      status: unit.status || 'PUBLISHED',
      description: unit.description || '',
      rooms,
      bathrooms,
      floor
    });
    setEditingUnitIndex(index);
    setShowUnitForm(true);
  };

  const handleDeleteUnit = async (index: number) => {
    const confirmed = await showConfirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الوحدة؟' : 'Are you sure you want to delete this unit?');
    if (confirmed) {
      setFormData(prev => ({
        ...prev,
        subProperties: prev.subProperties.filter((_, idx) => idx !== index)
      }));
    }
  };

  const handleSaveUnit = async () => {
    if (!unitFormData.titleAr) {
      await showAlert(language === 'ar' ? 'الرجاء إدخال اسم الوحدة بالعربية' : 'Please enter the unit title in Arabic.');
      return;
    }
    const detailsArray = [];
    if (unitFormData.rooms) detailsArray.push({ key: language === 'ar' ? 'عدد الغرف' : 'Rooms Count', value: unitFormData.rooms });
    if (unitFormData.bathrooms) detailsArray.push({ key: language === 'ar' ? 'دورات المياه' : 'Bathrooms', value: unitFormData.bathrooms });
    if (unitFormData.floor) detailsArray.push({ key: language === 'ar' ? 'الدور' : 'Floor', value: unitFormData.floor });

    const newUnit = {
      id: unitFormData.id || undefined,
      titleAr: unitFormData.titleAr,
      titleEn: unitFormData.titleEn || unitFormData.titleAr,
      type: unitFormData.type,
      propertyCategory: unitFormData.propertyCategory,
      price: Number(unitFormData.price) || 0,
      area: Number(unitFormData.area) || 0,
      status: unitFormData.status,
      description: unitFormData.description,
      details: JSON.stringify(detailsArray),
      imageUrls: '[]'
    };

    setFormData(prev => {
      const currentList = [...(prev.subProperties || [])];
      if (editingUnitIndex !== null) {
        currentList[editingUnitIndex] = newUnit;
      } else {
        currentList.push(newUnit);
      }
      return { ...prev, subProperties: currentList };
    });
    setShowUnitForm(false);
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
        videoUrl: propData.videoUrl || '',
        parentId: propData.parentId || '',
        status: propData.status || 'PUBLISHED',
        subProperties: propData.subProperties || []
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
        imapHost,
        imapPort: imapPort ? Number(imapPort) : null,
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
      <div className={`${activeTab === 'callbacks' ? 'max-w-[1440px]' : 'max-w-6xl'} mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300`}>
        
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
        <div className="inline-flex items-center justify-start rounded-xl bg-card border border-border p-1 text-muted-foreground mb-8 overflow-x-auto select-none scrollbar-none gap-1 w-max max-w-full">
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
                <h2 className="text-2xl font-bold text-foreground">
                  {showAddForm 
                    ? (editingId ? (language === 'ar' ? 'تعديل العقار' : 'Edit Property') : (selectedParentProperty ? (language === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Unit') : t('admin.addProperty'))) 
                    : (selectedParentProperty 
                        ? (language === 'ar' ? `إدارة وحدات: ${selectedParentProperty.titleAr}` : `Manage Units of: ${selectedParentProperty.titleEn}`)
                        : t('admin.propertiesList'))}
                </h2>
              </div>
              {(!selectedParentProperty || selectedParentTab === 'units') && (
                <button 
                  onClick={() => {
                    if (showAddForm) {
                      resetForm();
                    } else {
                      resetForm();
                      if (selectedParentProperty) {
                        setFormData(prev => ({
                          ...prev,
                          parentId: selectedParentProperty.id,
                          type: selectedParentProperty.type,
                          propertyCategory: selectedParentProperty.propertyCategory === 'BUILDING' || selectedParentProperty.propertyCategory === 'COMPOUND' || selectedParentProperty.propertyCategory === 'TOWER' || selectedParentProperty.propertyCategory === 'MALL' ? 'APARTMENT' : selectedParentProperty.propertyCategory
                        }));
                      }
                      setShowAddForm(true);
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md shadow-xs bg-primary text-white hover:opacity-90 cursor-pointer transition-colors"
                >
                  {showAddForm ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  {showAddForm 
                    ? (language === 'ar' ? 'إلغاء' : 'Cancel') 
                    : (selectedParentProperty ? (language === 'ar' ? 'إضافة وحدة' : 'Add Unit') : t('admin.addProperty'))}
                </button>
              )}
            </div>
            
            {!showAddForm ? (
              fetching ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : selectedParentProperty ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-card border border-border p-4 rounded-xl flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedParentProperty(null)}
                        className="px-3 py-1.5 border border-border hover:bg-muted bg-background rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer text-foreground"
                      >
                        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        <span>{language === 'ar' ? 'العودة لقائمة العقارات' : 'Back to Listings'}</span>
                      </button>
                      <div className="h-6 w-px bg-border"></div>
                      <div>
                        <h3 className="text-sm font-extrabold text-foreground">
                          {language === 'ar' ? selectedParentProperty.titleAr : selectedParentProperty.titleEn}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {language === 'ar' 
                            ? `فئة العقار: ${t(`cat.${selectedParentProperty.propertyCategory}`)} • النوع: ${selectedParentProperty.type === 'SALE' ? 'للبيع' : 'للإيجار'}`
                            : `Category: ${t(`cat.${selectedParentProperty.propertyCategory}`)} • Type: ${selectedParentProperty.type === 'SALE' ? 'For Sale' : 'For Rent'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedParentProperty.status || 'PUBLISHED'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const updateRes = await fetch(`/api/properties/${selectedParentProperty.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ...selectedParentProperty, status: newStatus })
                            });
                            if (updateRes.ok) {
                              setSelectedParentProperty(prev => prev ? { ...prev, status: newStatus } : null);
                              fetchProperties();
                            }
                          } catch (err) {
                            console.error("Failed to update status:", err);
                          }
                        }}
                        className="bg-background border border-border text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-bold text-foreground h-9"
                      >
                        <option value="PUBLISHED">{language === 'ar' ? 'منشور' : 'Published'}</option>
                        <option value="DRAFT">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
                      </select>
                      <button
                        onClick={() => handleEditClick(selectedParentProperty)}
                        className="p-2 text-muted-foreground hover:text-sky-400 hover:border-sky-500/30 rounded-lg border border-border bg-background cursor-pointer transition-all inline-flex items-center justify-center h-9 w-9"
                        title={language === 'ar' ? 'تعديل العقار' : 'Edit Property'}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العقار بالكامل؟' : 'Are you sure you want to delete this property entirely?')) {
                            try {
                              const res = await fetch(`/api/properties/${selectedParentProperty.id}`, { method: 'DELETE' });
                              if (res.ok) {
                                setSelectedParentProperty(null);
                                fetchProperties();
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="p-2 text-red-500 hover:text-red-400 hover:border-red-500/30 rounded-lg border border-border bg-background hover:bg-red-950/20 cursor-pointer transition-all inline-flex items-center justify-center h-9 w-9"
                        title={t('admin.deleteProperty')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-property details tabs */}
                  <div className="flex border-b border-border gap-2 select-none">
                    <button
                      type="button"
                      onClick={() => setSelectedParentTab('units')}
                      className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                        selectedParentTab === 'units'
                          ? 'border-primary text-primary font-black'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {language === 'ar' ? 'الوحدات السكنية' : 'Units'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedParentTab('renters')}
                      className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                        selectedParentTab === 'renters'
                          ? 'border-primary text-primary font-black'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {language === 'ar' ? 'المستأجرين والعقود' : 'Renters & Contracts'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedParentTab('details')}
                      className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                        selectedParentTab === 'details'
                          ? 'border-primary text-primary font-black'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {language === 'ar' ? 'تفاصيل الحساب والصور' : 'Bank Transfer & Photos'}
                    </button>
                  </div>

                  {selectedParentTab === 'units' && (
                    properties.filter(p => p.parentId === selectedParentProperty.id).length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground bg-card/20 animate-in fade-in">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-45 text-primary" />
                        <p className="text-sm font-bold">{language === 'ar' ? 'لا يوجد وحدات سكنية مضافة لهذا العقار بعد.' : 'No units added for this listing yet.'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'ar' ? 'اضغط على زر "إضافة وحدة" بالأعلى للبدء.' : 'Click "Add Unit" button above to get started.'}
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto overflow-y-hidden border border-border rounded-xl bg-card/25 shadow-xs animate-in fade-in">
                        <table className="w-full ltr:text-left rtl:text-right border-collapse text-xs">
                          <thead>
                            <tr className="bg-card text-muted-foreground text-[11px] font-bold border-b border-border uppercase tracking-wider">
                              <th className="p-3 font-bold">#</th>
                              <th className="p-3 font-bold">{language === 'ar' ? 'اسم الوحدة' : 'Unit Title'}</th>
                              <th className="p-3 font-bold">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                              <th className="p-3 font-bold">{language === 'ar' ? 'السعر' : 'Price'}</th>
                              <th className="p-3 font-bold">{language === 'ar' ? 'المساحة' : 'Area'}</th>
                              <th className="p-3 font-bold text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                              <th className="p-3 font-bold text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60 text-foreground">
                            {properties.filter(p => p.parentId === selectedParentProperty.id).map((unit, index) => {
                              return (
                                <tr key={unit.id} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="p-3 text-muted-foreground">{index + 1}</td>
                                  <td className="p-3 font-semibold">
                                    <p>{unit.titleAr}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 font-sans font-normal" dir="ltr">{unit.titleEn}</p>
                                  </td>
                                  <td className="p-3 text-muted-foreground">{t(`cat.${unit.propertyCategory}`)}</td>
                                  <td className="p-3 font-semibold font-mono">
                                    {unit.price ? `${unit.price.toLocaleString()} SAR` : (language === 'ar' ? 'غير محدد' : 'N/A')}
                                  </td>
                                  <td className="p-3 font-mono text-muted-foreground">
                                    {unit.area} {t('common.sqm')}
                                  </td>
                                  <td className="p-3 text-center">
                                    <select
                                      value={unit.status || 'PUBLISHED'}
                                      onChange={async (e) => {
                                        const newStatus = e.target.value;
                                        try {
                                          const updateRes = await fetch(`/api/properties/${unit.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...unit, status: newStatus })
                                          });
                                          if (updateRes.ok) {
                                            fetchProperties();
                                          }
                                        } catch (err) {
                                          console.error("Failed to update unit status:", err);
                                        }
                                      }}
                                      className="bg-background border border-border text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-bold text-foreground"
                                    >
                                      <option value="PUBLISHED">{language === 'ar' ? 'متاح' : 'Available'}</option>
                                      <option value="SOLD">{language === 'ar' ? 'مباع' : 'Sold'}</option>
                                      <option value="RENTED">{language === 'ar' ? 'مؤجر' : 'Rented'}</option>
                                      <option value="DRAFT">{language === 'ar' ? 'مخفي (مسودة)' : 'Hidden (Draft)'}</option>
                                    </select>
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleEditClick(unit)}
                                        className="p-1.5 text-muted-foreground hover:text-sky-400 hover:border-sky-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDelete(unit.id)}
                                        className="p-1.5 text-red-500 hover:text-red-400 hover:border-red-500/30 rounded-lg border border-border bg-card/50 hover:bg-red-950/20 cursor-pointer transition-all inline-flex items-center justify-center"
                                        title={t('admin.deleteProperty')}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}

                  {selectedParentTab === 'renters' && (
                    <div className="animate-in fade-in duration-300">
                      <AdminBuildings selectedBuildingId={matchingBuilding?.id} inlineMode="renters" />
                    </div>
                  )}

                  {selectedParentTab === 'details' && (
                    <div className="animate-in fade-in duration-300">
                      <AdminBuildings selectedBuildingId={matchingBuilding?.id} inlineMode="details" />
                    </div>
                  )}
                </div>
              ) : properties.filter(p => !p.parentId).length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">{t('admin.propertiesEmpty')}</p>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-hidden">
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
                      {properties.filter(p => !p.parentId).map((property, index) => {
                        const isExpanded = !!expandedParents[property.id];
                        const subUnits = properties.filter(p => p.parentId === property.id);
                        return (
                          <React.Fragment key={property.id}>
                            <tr className="border-b border-border hover:bg-slate-50/40 transition-colors">
                              <td className="px-4 py-3 text-xs text-muted-foreground">{index + 1}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p 
                                    onClick={() => setSelectedParentProperty(property)} 
                                    className="font-semibold text-xs text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
                                    title={language === 'ar' ? 'عرض وإدارة الوحدات' : 'View & Manage Units'}
                                  >
                                    {property.titleAr}
                                  </p>
                                  {property.status === 'DRAFT' && (
                                    <span className="inline-flex bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                      {language === 'ar' ? 'مسودة' : 'Draft'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground font-sans mt-0.5" dir="ltr">{property.titleEn}</p>
                                {subUnits.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedParentProperty(property)}
                                    className="inline-flex items-center gap-1.5 text-primary text-[10px] font-bold mt-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary/15 transition-all cursor-pointer font-sans"
                                  >
                                    <Building2 className="w-3 h-3" />
                                    <span>
                                      {language === 'ar' ? `عرض وإدارة الوحدات (${subUnits.length})` : `Manage Units (${subUnits.length})`}
                                    </span>
                                  </button>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                  property.type === 'SALE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                  {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-xs text-foreground font-mono flex items-center gap-1.5 justify-start">
                                {property.price > 0 ? (
                                  <>
                                    {property.price.toLocaleString()} <SrIcon className="w-4 h-4 text-muted-foreground" />
                                  </>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground font-bold font-sans">
                                    {language === 'ar' ? 'عرض الوحدات' : 'Show Units'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setSelectedParentProperty(property)}
                                    className="p-2 text-muted-foreground hover:text-blue-500 hover:border-blue-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                    title={language === 'ar' ? 'عرض وإدارة الوحدات السكنية' : 'View & Manage Units'}
                                  >
                                    <Building2 className="w-4 h-4" />
                                  </button>
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
                            {isExpanded && subUnits.length > 0 && (
                              <tr className="bg-slate-50/20">
                                <td colSpan={5} className="px-8 py-3">
                                  <div className="border border-border rounded-xl overflow-hidden shadow-xs bg-card/40">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-slate-100/50 border-b border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'اسم الوحدة' : 'Unit Title'}</th>
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'السعر' : 'Price'}</th>
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                          <th className="p-2.5 text-center font-bold">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border/65">
                                        {subUnits.map(unit => (
                                          <tr key={unit.id} className="hover:bg-slate-100/30 transition-colors">
                                            <td className="p-2.5 font-medium text-foreground">{unit.titleAr}</td>
                                            <td className="p-2.5 text-muted-foreground">{t(`cat.${unit.propertyCategory}`)}</td>
                                            <td className="p-2.5 font-mono text-foreground font-semibold">
                                              {unit.price.toLocaleString()} SAR
                                            </td>
                                            <td className="p-2.5">
                                              <select
                                                value={unit.status || 'PUBLISHED'}
                                                onChange={async (e) => {
                                                  const newStatus = e.target.value;
                                                  try {
                                                    const updateRes = await fetch(`/api/properties/${unit.id}`, {
                                                      method: 'PUT',
                                                      headers: { 'Content-Type': 'application/json' },
                                                      body: JSON.stringify({ ...unit, status: newStatus })
                                                    });
                                                    if (updateRes.ok) {
                                                      fetchProperties();
                                                    }
                                                  } catch (err) {
                                                    console.error("Failed to update unit status:", err);
                                                  }
                                                }}
                                                className="bg-card border border-border text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold"
                                              >
                                                <option value="PUBLISHED">{language === 'ar' ? 'متاح' : 'Available'}</option>
                                                <option value="SOLD">{language === 'ar' ? 'مباع' : 'Sold'}</option>
                                                <option value="RENTED">{language === 'ar' ? 'مؤجر' : 'Rented'}</option>
                                                <option value="DRAFT">{language === 'ar' ? 'مخفي' : 'Hidden (Draft)'}</option>
                                              </select>
                                            </td>
                                            <td className="p-2.5 text-center">
                                              <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                  onClick={() => handleEditClick(unit)}
                                                  className="p-1.5 text-muted-foreground hover:text-sky-400 hover:border-sky-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                                  title={language === 'ar' ? 'تعديل' : 'Edit'}
                                                >
                                                  <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => handleDelete(unit.id)}
                                                  className="p-1.5 text-red-500 hover:text-red-400 hover:border-red-500/30 rounded-lg border border-border bg-card/50 hover:bg-red-950/20 cursor-pointer transition-all inline-flex items-center justify-center"
                                                  title={t('admin.deleteProperty')}
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {submitMessage && (
                  <div className={`p-4 rounded-xl font-bold border flex items-center gap-3 ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                     {submitMessage.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <X className="w-5 h-5 flex-shrink-0" />}
                     {submitMessage.text}
                  </div>
                )}

                                   {/* Step Indicator */}
                  {(() => {
                    const isBuildingCategory = !formData.parentId && (formData.propertyCategory === 'BUILDING' || formData.propertyCategory === 'COMPOUND' || formData.propertyCategory === 'TOWER' || formData.propertyCategory === 'MALL');
                    const totalSteps = isBuildingCategory ? 5 : 4;
                    const fillPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
                    return (
                      <div className="mb-12 max-w-xl mx-auto w-full select-none animate-in fade-in duration-300">
                        <div className="relative py-4">
                          {/* Progress Line Track */}
                          <div className="absolute top-1/2 -translate-y-1/2 left-6 right-6 h-0.5 bg-muted rounded-full z-0">
                            {/* Active filled line */}
                            <div 
                              className="h-full bg-primary transition-all duration-500 ease-out rounded-full shadow-xs"
                              style={{
                                width: `${fillPercentage}%`,
                                // In RTL (Arabic), progress bar fills from right to left
                                transformOrigin: language === 'ar' ? 'right' : 'left'
                              }}
                            />
                          </div>

                          {/* Step Circles Row */}
                          <div className="relative flex justify-between items-center z-10 w-full">
                            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
                              const isActive = currentStep === step;
                              const isCompleted = currentStep > step;
                              
                              // Select step icon dynamically
                              let StepIcon = Info;
                              if (step === 2) StepIcon = DollarSign;
                              if (step === 3) StepIcon = FileText;
                              if (step === 4) StepIcon = Image;
                              if (step === 5) StepIcon = LayoutGrid;

                              return (
                                <div key={step} className="flex flex-col items-center">
                                  <button
                                    key={step}
                                    type="button"
                                    onClick={() => {
                                      if (step < currentStep || formData.titleAr) {
                                        setCurrentStep(step);
                                      }
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-350 cursor-pointer border shadow-xs ${
                                      isActive 
                                        ? 'bg-primary border-primary text-white ring-4 ring-primary/20 scale-110 shadow-md shadow-primary/20' 
                                        : isCompleted 
                                        ? 'wizard-step-completed shadow-md shadow-emerald-600/10' 
                                        : 'bg-card border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : (
                                      <StepIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  {/* Step Label */}
                                  <span className={`text-[10px] font-bold mt-2.5 transition-colors duration-200 hidden xs:block ${
                                    isActive 
                                      ? 'text-primary' 
                                      : isCompleted 
                                      ? 'wizard-step-label-completed' 
                                      : 'text-muted-foreground'
                                  }`}>
                                    {step === 1 && (language === 'ar' ? 'الموقع' : 'Location')}
                                    {step === 2 && (language === 'ar' ? 'المالية' : 'Financials')}
                                    {step === 3 && (language === 'ar' ? 'الوصف' : 'Description')}
                                    {step === 4 && (language === 'ar' ? 'الوسائط' : 'Media')}
                                    {step === 5 && (language === 'ar' ? 'الوحدات' : 'Units')}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="text-center mt-3">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                            {language === 'ar' ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
                          </p>
                          <h3 className="text-lg font-bold text-foreground mt-0.5">
                            {currentStep === 1 && (language === 'ar' ? 'المعلومات الأساسية والموقع' : 'Basic Info & Location')}
                            {currentStep === 2 && (language === 'ar' ? 'التفاصيل المالية والخدمات' : 'Financials & Utilities')}
                            {currentStep === 3 && (language === 'ar' ? 'الوصف والتفاصيل الإضافية' : 'Description & Custom Details')}
                            {currentStep === 4 && (language === 'ar' ? 'الصور ومقاطع الفيديو' : 'Photos & Videos')}
                            {currentStep === 5 && (language === 'ar' ? 'إدارة الوحدات السكنية' : 'Manage Units')}
                          </h3>
                        </div>
                      </div>
                    );
                  })()}

                  
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {/* STEP 1: Basic & Location Info */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-in fade-in duration-350">
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
                  </div>
                )}

                {/* STEP 2: Financial Details & Utilities */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-in fade-in duration-350">
                    <div>
                      <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'التكاليف المالية والخدمات' : 'Financial Details & Utilities'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={formData.type === 'RENT' ? "md:col-span-2" : ""}>
                          <label className="cn-label mb-2">{t('admin.placeholder.price')}</label>
                          <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                            <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                              <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                            </div>
                            <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground" placeholder="2500000" />
                            {formData.type === 'RENT' && (
                              <div className="flex border-l border-border ltr:border-l rtl:border-r flex-shrink-0">
                                <select value={formData.paymentFrequency} onChange={(e) => setFormData({ ...formData, paymentFrequency: e.target.value })} className="bg-card w-36 px-4 py-1 outline-none focus:ring-0 font-medium border-none cursor-pointer text-foreground">
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
                          <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                            <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                              <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                            </div>
                            <input 
                              type="number" 
                              disabled={formData.vatExempt}
                              value={formData.vatExempt ? '0' : formData.vat} 
                              onChange={(e) => setFormData({ ...formData, vat: e.target.value })} 
                              className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground disabled:opacity-50" 
                              placeholder="0" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="cn-label mb-2">{t('admin.placeholder.commission')}</label>
                          <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                            <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                              <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                            </div>
                            <input type="number" value={formData.commission} onChange={(e) => setFormData({ ...formData, commission: e.target.value })} className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground" placeholder="0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: Description & Custom Details */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-in fade-in duration-350">
                    <div>
                      <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'الوصف' : 'Description'}</h3>
                      <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="cn-textarea resize-none" placeholder={language === 'ar' ? 'أضف وصفاً مفصلاً للعقار...' : 'Add a detailed description...'} />
                    </div>

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
                          {(() => {
                            const allowedKeys = CATEGORY_SUGGESTIONS[formData.propertyCategory] || PREDEFINED_DETAILS.map(pd => pd.keyEn);
                            return PREDEFINED_DETAILS.filter(pd => allowedKeys.includes(pd.keyEn)).map(pd => (
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
                            ));
                          })()}
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
                            className="text-primary font-bold flex items-center gap-2 hover:text-primary py-2 text-sm text-sky-500"
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
                            className="text-primary font-bold flex items-center gap-2 hover:text-primary py-2 text-sm text-sky-500"
                          >
                            <PlusCircle className="w-4.5 h-4.5" />
                            {language === 'ar' ? 'إضافة ميزة مخصصة' : 'Add Custom Feature'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Media & Uploads */}
                {currentStep === 4 && (
                  <div className="space-y-8 animate-in fade-in duration-350">
                    <div>
                      <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">{language === 'ar' ? 'الصور والفيديوهات' : 'Images & Videos'} (Max 250MB total)</h3>
                      
                      {imageUploadMessage && (
                        <div className="mb-4 p-4 rounded-xl font-bold border bg-red-50 text-red-700 border-red-200 flex items-center gap-3">
                           <X className="w-5 h-5 flex-shrink-0" />
                           {imageUploadMessage.text}
                        </div>
                      )}

                      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isUploadingImages ? 'border-border bg-muted cursor-not-allowed' : 'border-[#2563eb]/30 bg-card hover:bg-muted'}`}>
                        <input type="file" multiple accept="image/*,video/*" onChange={handleImageUpload} className="hidden" id="image-upload" disabled={isUploadingImages} />
                        <label htmlFor="image-upload" className={`flex flex-col items-center ${isUploadingImages ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          {isUploadingImages ? (
                            <Loader2 className="w-12 h-12 text-indigo-500 mb-4 animate-spin" />
                          ) : (
                            <ImagePlus className="w-12 h-12 text-gray-400 mb-4" />
                          )}
                          
                          <span className="font-bold text-lg text-muted-foreground">
                            {isUploadingImages ? (language === 'ar' ? 'جاري معالجة الملفات...' : 'Processing Media...') : (language === 'ar' ? 'اسحب وأفلت الصور ومقاطع الفيديو هنا، أو اضغط للتصفح' : 'Drag & drop images and videos here, or click to browse')}
                          </span>
                        </label>
                      </div>
                      
                      {formData.imageUrls.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {formData.imageUrls.map((url, i) => {
                            const isVideo = url && (url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm') || url.endsWith('.avi'));
                            const isRtl = language === 'ar';
                            const leftDisabled = isRtl ? (i === formData.imageUrls.length - 1) : (i === 0);
                            const rightDisabled = isRtl ? (i === 0) : (i === formData.imageUrls.length - 1);
                            return (
                              <div key={i} className="flex flex-col space-y-2">
                                <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden border border-border group shadow-sm hover:shadow-md transition-all duration-300">
                                  {isVideo ? (
                                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                                  ) : (
                                    <img src={url} alt="upload preview" className="w-full h-full object-cover" />
                                  )}
                                  
                                  {/* Main Image Badge */}
                                  {i === 0 && (
                                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                                      {language === 'ar' ? 'الرئيسية' : 'Main'}
                                    </div>
                                  )}
                                  
                                  {/* Play overlay for video */}
                                  {isVideo && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
                                      <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white">
                                        <svg className="w-4 h-4 ml-0.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Delete Glass button */}
                                  <button 
                                    type="button" 
                                    onClick={() => removeImage(i)} 
                                    className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md hover:bg-red-600 text-white rounded-full transition-all z-10 cursor-pointer shadow-sm opacity-100"
                                    title={language === 'ar' ? 'حذف' : 'Delete'}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                
                                 {/* Rearrange buttons under the image card */}
                                 <div className="flex items-center justify-between gap-1.5 px-0.5">
                                   <button
                                     type="button"
                                     disabled={i === 0}
                                     onClick={() => moveImage(i, 'prev')}
                                     className="flex-1 py-1.5 flex items-center justify-center bg-card border border-border text-foreground hover:bg-muted rounded-xl transition-all disabled:opacity-30 cursor-pointer shadow-xs active:scale-97"
                                     title={isRtl ? 'تحريك لليمين' : 'Move Left'}
                                   >
                                     {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                                   </button>
                                   <button
                                     type="button"
                                     disabled={i === formData.imageUrls.length - 1}
                                     onClick={() => moveImage(i, 'next')}
                                     className="flex-1 py-1.5 flex items-center justify-center bg-card border border-border text-foreground hover:bg-muted rounded-xl transition-all disabled:opacity-30 cursor-pointer shadow-xs active:scale-97"
                                     title={isRtl ? 'تحريك لليسار' : 'Move Right'}
                                   >
                                     {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                   </button>
                                 </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {(() => {
                  const isBuildingCategory = !formData.parentId && (formData.propertyCategory === 'BUILDING' || formData.propertyCategory === 'COMPOUND' || formData.propertyCategory === 'TOWER' || formData.propertyCategory === 'MALL');
                  if (currentStep !== 5 || !isBuildingCategory) return null;
                  return (
                    <div className="space-y-8 animate-in fade-in duration-350">
                      <div>
                        <h3 className="text-sm font-bold text-foreground border-b border-border pb-1.5 mb-6">
                          {language === 'ar' ? 'إدارة وحدات العقار (الشقق / المكاتب / المحلات)' : 'Manage Building Units (Apartments / Offices / Shops)'}
                        </h3>
                        
                        {/* Units list */}
                        <div className="space-y-4">
                          {formData.subProperties && formData.subProperties.length > 0 ? (
                            <div className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-card/30">
                              {formData.subProperties.map((unit, index) => (
                                <div key={index} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
                                  <div>
                                    <span className="font-bold text-foreground">{language === 'ar' ? unit.titleAr : unit.titleEn}</span>
                                    <div className="flex gap-2.5 text-muted-foreground mt-1 text-[11px] font-semibold">
                                      <span>{t(`cat.${unit.propertyCategory}`)}</span>
                                      <span>•</span>
                                      <span>{unit.price > 0 ? `${unit.price.toLocaleString()} SAR` : (language === 'ar' ? 'غير محدد' : 'N/A')}</span>
                                      <span>•</span>
                                      <span>{unit.area} {t('common.sqm')}</span>
                                      <span>•</span>
                                      <span className="text-primary font-bold uppercase">{unit.status}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditUnit(index)}
                                      className="p-1.5 text-muted-foreground hover:text-[#2563eb] hover:border-[#2563eb]/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteUnit(index)}
                                      className="p-1.5 text-red-500 hover:text-red-400 hover:border-red-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 border border-dashed border-border rounded-xl text-muted-foreground">
                              <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                              <p className="text-xs font-semibold">{language === 'ar' ? 'لا يوجد وحدات مضافة بعد' : 'No units added yet.'}</p>
                            </div>
                          )}

                          {!showUnitForm ? (
                            <button
                              type="button"
                              onClick={handleNewUnitClick}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold rounded-lg transition-all cursor-pointer border border-primary/20"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{language === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Unit'}</span>
                            </button>
                          ) : (
                            <div className="bg-card/50 p-6 rounded-2xl border border-border space-y-6">
                              <h4 className="text-xs font-bold text-foreground border-b border-border pb-1.5">
                                {editingUnitIndex !== null 
                                  ? (language === 'ar' ? 'تعديل وحدة' : 'Edit Unit')
                                  : (language === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Unit')}
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'اسم الوحدة بالعربية' : 'Unit Title (Ar)'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.titleAr}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, titleAr: e.target.value })}
                                    placeholder="مثال: شقة 101"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'اسم الوحدة بالإنجليزية' : 'Unit Title (En)'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.titleEn}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, titleEn: e.target.value })}
                                    placeholder="e.g. Apartment 101"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'الفئة' : 'Category'}</label>
                                  <select
                                    value={unitFormData.propertyCategory}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, propertyCategory: e.target.value })}
                                    className="cn-input text-xs h-9"
                                  >
                                    <option value="APARTMENT">{t('cat.APARTMENT')}</option>
                                    <option value="SHOP">{t('cat.SHOP')}</option>
                                    <option value="OFFICE">{t('cat.OFFICE')}</option>
                                    <option value="ROOM">{t('cat.ROOM')}</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'نوع المعاملة' : 'Type'}</label>
                                  <select
                                    value={unitFormData.type}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, type: e.target.value })}
                                    className="cn-input text-xs h-9"
                                  >
                                    <option value="RENT">{t('common.rent')}</option>
                                    <option value="SALE">{t('common.sale')}</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'السعر (ريال)' : 'Price (SAR)'}</label>
                                  <input
                                    type="number"
                                    value={unitFormData.price}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, price: e.target.value })}
                                    placeholder="0"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'المساحة (متر مربع)' : 'Area (Sqm)'}</label>
                                  <input
                                    type="number"
                                    value={unitFormData.area}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, area: e.target.value })}
                                    placeholder="0"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'عدد الغرف' : 'Rooms Count'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.rooms}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, rooms: e.target.value })}
                                    placeholder="3"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'دورات المياه' : 'Bathrooms Count'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.bathrooms}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, bathrooms: e.target.value })}
                                    placeholder="2"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'الدور' : 'Floor'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.floor}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, floor: e.target.value })}
                                    placeholder="1"
                                    className="cn-input text-xs h-9"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'الحالة' : 'Status'}</label>
                                  <select
                                    value={unitFormData.status}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, status: e.target.value })}
                                    className="cn-input text-xs h-9"
                                  >
                                    <option value="PUBLISHED">{language === 'ar' ? 'متاح / منشور' : 'Available / Published'}</option>
                                    <option value="SOLD">{language === 'ar' ? 'مباع' : 'Sold'}</option>
                                    <option value="RENTED">{language === 'ar' ? 'مؤجر' : 'Rented'}</option>
                                    <option value="DRAFT">{language === 'ar' ? 'مخفي' : 'Hidden (Draft)'}</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 pt-2 border-t border-border/60">
                                <button
                                  type="button"
                                  onClick={handleSaveUnit}
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                                >
                                  {language === 'ar' ? 'حفظ الوحدة' : 'Save Unit'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowUnitForm(false)}
                                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer"
                                >
                                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                
                  </motion.div>
                </AnimatePresence>
                {(() => {
                  const isBuildingCategory = !formData.parentId && (formData.propertyCategory === 'BUILDING' || formData.propertyCategory === 'COMPOUND' || formData.propertyCategory === 'TOWER' || formData.propertyCategory === 'MALL');
                  const totalSteps = isBuildingCategory ? 5 : 4;
                  return (
                    <div className="sticky bottom-0 left-0 right-0 z-30 bg-background border-t border-border py-4 mt-12 -mx-4 sm:-mx-6 lg:-mx-8 shadow-md select-none">
                      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-3 flex-wrap">
                        {/* Cancel or Previous Button */}
                        {currentStep > 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-5 py-2.5 border border-border text-foreground hover:bg-muted bg-card rounded-xl transition-all font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-97 shadow-xs"
                          >
                            {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                            {language === 'ar' ? 'السابق' : 'Previous'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-5 py-2.5 border border-border text-foreground hover:bg-muted bg-card rounded-xl transition-all font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-97 shadow-xs"
                          >
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                        )}

                        {/* Next or Publish Button */}
                        {currentStep < totalSteps ? (
                          <button
                            type="button"
                            onClick={async () => {
                              if (currentStep === 1) {
                                  if (!formData.titleAr) {
                                    await showAlert(language === 'ar' ? 'الرجاء إدخال عنوان العقار بالعربية' : 'Please enter the Arabic Title.');
                                    return;
                                  }
                              }
                              setCurrentStep(currentStep + 1);
                            }}
                            className="px-5 py-2.5 bg-primary hover:opacity-95 text-white rounded-xl transition-all font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm active:scale-97 border border-transparent"
                          >
                            {language === 'ar' ? 'التالي' : 'Next'}
                            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={loading || isUploadingImages}
                            onClick={(e) => saveProperty(e, 'PUBLISHED')}
                            className="px-6 py-2.5 bg-primary hover:opacity-95 text-white rounded-xl transition-all font-bold text-xs cursor-pointer inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-97 border border-transparent"
                          >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'نشر العقار' : 'Publish Property')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </form>
            )}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (() => {
          const computedTopPage = (() => {
            if (!analytics.pathsViews || analytics.pathsViews.length === 0) return null;
            const top = analytics.pathsViews[0];
            let name = top.path;
            if (name === '/') name = language === 'ar' ? 'الصفحة الرئيسية' : 'Home Page';
            else if (name === '/properties') name = language === 'ar' ? 'تصفح العقارات' : 'Properties Page';
            else if (name === '/about') name = language === 'ar' ? 'من نحن' : 'About Us';
            else if (name === '/contact') name = language === 'ar' ? 'تواصل معنا' : 'Contact Us';
            else if (name === '/services') name = language === 'ar' ? 'خدماتنا' : 'Services';
            else if (name.startsWith('/properties/')) name = language === 'ar' ? 'صفحة عقار' : 'Property Record';
            return { name, count: top._count.path };
          })();

          const computedTopProperty = (() => {
            if (!analytics.propertiesViews || analytics.propertiesViews.length === 0) return null;
            const top = analytics.propertiesViews[0];
            const prop = properties.find(p => p.id === top.propertyId);
            const name = prop ? (language === 'ar' ? prop.titleAr : prop.titleEn) : (language === 'ar' ? 'عقار تم حذفه' : 'Deleted Property');
            return { name, count: top._count.propertyId };
          })();

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="min-h-[500px] space-y-8 pb-12"
            >
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/30 shadow-xs">
                    <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{language === 'ar' ? 'تحليلات الموقع' : 'Site Analytics'}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{language === 'ar' ? 'رصد الزيارات، الصفحات النشطة، وأداء العقارات' : 'Monitor traffic, active pages, and property performance'}</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchAnalytics}
                  disabled={refreshingAnalytics}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card hover:bg-muted border border-border shadow-xs text-sm font-bold text-foreground cursor-pointer transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshingAnalytics ? 'animate-spin' : ''}`} />
                  <span>{language === 'ar' ? 'تحديث البيانات' : 'Refresh Data'}</span>
                </motion.button>
              </div>

              {/* Umami Banner */}
              {analyticsDashboardUrl && (
                <div className="bg-card dark:bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10 duration-500 pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {language === 'ar' ? 'رابط لوحة Umami المتقدمة' : 'Umami Advanced Analytics'}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {language === 'ar' 
                            ? 'استكشف إحصائيات تفصيلية حول الأجهزة، المتصفحات، المصادر الجغرافية، والمسارات المفصلة للزوار.' 
                            : 'Explore deep analytics about visitor devices, browsers, geographic sources, and detailed user paths.'}
                        </p>
                      </div>
                    </div>
                    
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={analyticsDashboardUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm shadow-xs transition-all text-center"
                    >
                      <span>{language === 'ar' ? 'فتح لوحة التحليلات' : 'Open Analytics Dashboard'}</span>
                    </motion.a>
                  </div>
                </div>
              )}

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Views Card */}
                <div className="bg-card dark:bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/60 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-muted-foreground">{language === 'ar' ? 'إجمالي المشاهدات' : 'Total Views'}</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-foreground tracking-tight">{analytics.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">{language === 'ar' ? 'إجمالي الزيارات لكافة الصفحات' : 'Total traffic registered across all paths'}</p>
                </div>

                {/* Top Page Card */}
                <div className="bg-card dark:bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/60 hover:border-emerald-500/20 dark:hover:border-emerald-400/20 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-muted-foreground">{language === 'ar' ? 'الصفحة الأكثر نشاطاً' : 'Most Active Page'}</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground truncate">{computedTopPage ? computedTopPage.name : '—'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {computedTopPage 
                      ? (language === 'ar' ? `حصدت ${computedTopPage.count} زيارة` : `Received ${computedTopPage.count} visits`)
                      : (language === 'ar' ? 'لا توجد بيانات' : 'No data available')}
                  </p>
                </div>

                {/* Top Property Card */}
                <div className="bg-card dark:bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/60 hover:border-amber-500/20 dark:hover:border-amber-400/20 hover:shadow-md transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-muted-foreground">{language === 'ar' ? 'العقار الأكثر زيارة' : 'Most Visited Property'}</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Home className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-foreground truncate">{computedTopProperty ? computedTopProperty.name : '—'}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {computedTopProperty 
                      ? (language === 'ar' ? `حصد ${computedTopProperty.count} مشاهدة` : `Received ${computedTopProperty.count} views`)
                      : (language === 'ar' ? 'لا توجد بيانات' : 'No data available')}
                  </p>
                </div>
              </div>

              {/* Lists Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Pages Column */}
                <div className="bg-card dark:bg-card/40 border border-border/60 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    {language === 'ar' ? 'أكثر الصفحات زيارة' : 'Top Pages'}
                  </h3>
                  
                  <div className="space-y-3">
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
                        <motion.a
                          href={item.path}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: idx * 0.04 }}
                          key={idx}
                          className="flex justify-between items-center p-4 bg-card hover:bg-muted/40 rounded-xl border border-border/40 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-200 group active:scale-[0.99] cursor-pointer"
                        >
                          <div className="flex items-center gap-3 truncate min-w-0 pr-4">
                            <span className="font-bold text-foreground text-sm truncate">{displayPath}</span>
                            <span className="text-muted-foreground/60 font-mono text-xs hidden sm:inline truncate">({item.path})</span>
                          </div>
                          <span className="font-bold text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full text-xs flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                            {item._count.path} {language === 'ar' ? 'زيارة' : 'visits'}
                          </span>
                        </motion.a>
                      );
                    })}
                    {analytics.pathsViews.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-6">{language === 'ar' ? 'لا توجد بيانات بعد.' : 'No data yet.'}</p>
                    )}
                  </div>
                </div>

                {/* Top Properties Column */}
                <div className="bg-card dark:bg-card/40 border border-border/60 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-xl font-bold text-foreground mb-6 tracking-tight flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                    {language === 'ar' ? 'أكثر العقارات زيارة' : 'Top Properties'}
                  </h3>
                  
                  <div className="space-y-3">
                    {analytics.propertiesViews.map((item, idx) => {
                      const prop = properties.find(p => p.id === item.propertyId);
                      const title = prop ? (language === 'ar' ? prop.titleAr : prop.titleEn) : (language === 'ar' ? 'عقار تم حذفه' : 'Deleted Property');
                      
                      return (
                        <motion.a
                          href={prop ? `/properties/${prop.id}` : '#'}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: idx * 0.04 }}
                          key={idx}
                          className={`flex justify-between items-center p-4 bg-card hover:bg-muted/40 rounded-xl border border-border/40 hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-200 group active:scale-[0.99] ${prop ? 'cursor-pointer' : 'pointer-events-none'}`}
                        >
                          <span className="font-bold text-foreground truncate pr-4 text-sm">{title}</span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 px-3 py-1 rounded-full text-xs flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950 transition-colors">
                            {item._count.propertyId} {language === 'ar' ? 'مشاهدة' : 'views'}
                          </span>
                        </motion.a>
                      );
                    })}
                    {analytics.propertiesViews.length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-6">{language === 'ar' ? 'لا توجد بيانات بعد.' : 'No data yet.'}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {activeTab === 'settings' && (
          <div className="min-h-[500px] w-full animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/80 group">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/5 text-primary border border-primary/20 rounded-2xl flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:-rotate-12">
                <SettingsIcon className="w-6 h-6 text-primary animate-[spin_20s_linear_infinite]" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground tracking-tight select-none leading-none">
                  {t('admin.settings')}
                </h2>
                <p className="text-muted-foreground font-medium text-xs mt-2 select-none leading-none">
                  {language === 'ar' ? 'إدارة إعدادات الموقع والتواصل' : 'Manage site and contact settings'}
                </p>
              </div>
            </div>
            
            {/* Horizontal Settings Tabs (Next to each other) */}
            <div className="flex flex-wrap gap-1.5 bg-card/65 backdrop-blur-md border border-border/80 p-2 rounded-2xl shadow-xs mb-6 max-w-full overflow-x-auto">
              {[
                { section: 'whatsapp', labelAr: 'التواصل والواتساب', labelEn: 'WhatsApp & Social', icon: <MessageSquare className="w-4 h-4" /> },
                { section: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email Settings', icon: <Mail className="w-4 h-4" /> },
                { section: 'otp', labelAr: 'رمز التحقق (OTP)', labelEn: 'OTP Verification', icon: <KeyRound className="w-4 h-4" /> },
                { section: 'images', labelAr: 'صور الموقع', labelEn: 'Site Images', icon: <ImagePlus className="w-4 h-4" /> },
                { section: 'backup', labelAr: 'نسخة احتياطية', labelEn: 'Database Backup', icon: <Database className="w-4 h-4" /> },
                { section: 'techhub', labelAr: 'ربط TechHub', labelEn: 'TechHub Sync', icon: <RefreshCw className="w-4 h-4" /> },
              ].map((item) => {
                const isActive = activeSettingsSection === item.section;
                return (
                  <button
                    key={item.section}
                    type="button"
                    onClick={() => setActiveSettingsSection(item.section as any)}
                    className={`relative flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer select-none active:scale-[0.97] duration-150 ${
                      isActive 
                        ? 'text-primary-foreground font-extrabold shadow-xs' 
                        : 'text-muted-foreground hover:bg-muted/45 hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsSectionBg"
                        className="absolute inset-0 bg-primary rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {item.icon}
                      <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Settings Form Content */}
            <form onSubmit={handleSaveSettings} className="w-full min-w-0 bg-card/40 backdrop-blur-md border border-border/80 p-6 rounded-2xl shadow-xs relative flex flex-col min-h-[450px] justify-between">
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSettingsSection}
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className="space-y-6 min-w-0"
                  >
                    {activeSettingsSection === 'whatsapp' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">{language === 'ar' ? 'إعدادات الواتساب والتواصل والموقع' : 'WhatsApp, Social & Location Settings'}</h3>
                        
                        {/* WhatsApp Fields Group (Side-by-Side) */}
                        <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{language === 'ar' ? 'أرقام التواصل والرسائل' : 'Contact Numbers & Templates'}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="cn-label">{t('admin.placeholder.whatsapp')}</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                                </div>
                                <input
                                  required
                                  type="text"
                                  value={whatsappNumber}
                                  onChange={(e) => setWhatsappNumber(e.target.value)}
                                  className="cn-input font-mono pl-12 pr-4 h-11 bg-background transition-all"
                                  placeholder="966500000000"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="cn-label">{language === 'ar' ? 'رقم الاتصال المباشر' : 'Direct Calling Number'}</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <input
                                  required
                                  type="text"
                                  value={callingNumber}
                                  onChange={(e) => setCallingNumber(e.target.value)}
                                  className="cn-input font-mono pl-12 pr-4 h-11 bg-background transition-all"
                                  placeholder="966500000000"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="cn-label">{language === 'ar' ? 'نص رسالة الواتساب الافتراضي' : 'Default WhatsApp Message'}</label>
                            <textarea
                              required
                              rows={3}
                              value={whatsappMessage}
                              onChange={(e) => setWhatsappMessage(e.target.value)}
                              className="cn-input resize-none min-h-[90px] font-medium"
                              placeholder={language === 'ar' ? 'مرحباً، أنا مهتم بهذا العقار: {title} - {link}' : 'Hello, I am interested in this property: {title} - {link}'}
                            />
                            <div className="mt-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/50">
                              <p className="font-bold flex items-center gap-1.5 mb-1.5 text-foreground">
                                <Info className="w-3.5 h-3.5 text-primary" />
                                {language === 'ar' ? 'المتغيرات المدعومة:' : 'Supported Variables:'}
                              </p>
                              <div className="flex gap-2 font-mono text-[10px]">
                                <span className="text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{'{title}'}</span>
                                <span className="text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">{'{link}'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Social Networks Group (Side-by-Side Grid) */}
                        <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                              {language === 'ar' ? 'وسائل التواصل الاجتماعي والبريد الإلكتروني' : 'Social Media & Email'}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-1">{language === 'ar' ? 'ستظهر الخانات المعبأة فقط على الصفحة الرئيسية.' : 'Only filled fields will appear on the home page.'}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              <div key={field.label} className="space-y-1.5">
                                <label className="block text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                  {field.icon} <span>{field.label}</span>
                                </label>
                                <input
                                  type={field.type}
                                  value={field.value}
                                  onChange={e => field.setter(e.target.value)}
                                  className="cn-input text-xs h-10 bg-background"
                                  placeholder={field.placeholder}
                                  dir="ltr"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Headquarters Location Group (Side-by-Side Address) */}
                        <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">{language === 'ar' ? 'مقر الشركة وعنوانها' : 'Company HQ & Address'}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-bold text-muted-foreground">
                                {language === 'ar' ? 'العنوان (بالعربية)' : 'Address (Arabic)'}
                              </label>
                              <input
                                type="text"
                                value={addressAr}
                                onChange={e => setAddressAr(e.target.value)}
                                className="cn-input text-xs h-10 bg-background"
                                placeholder={language === 'ar' ? 'المملكة العربية السعودية، الرياض، طريق الملك عبد العزيز...' : 'Saudi Arabia, Riyadh, King Abdul Aziz Road...'}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="block text-xs font-bold text-muted-foreground">
                                {language === 'ar' ? 'العنوان (بالإنجليزي)' : 'Address (English)'}
                              </label>
                              <input
                                type="text"
                                value={addressEn}
                                onChange={e => setAddressEn(e.target.value)}
                                className="cn-input text-xs h-10 bg-background"
                                placeholder="King Abdul Aziz Road, Al Yasmin district, Riyadh..."
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-muted-foreground">
                              {language === 'ar' ? 'رابط خريطة جوجل' : 'Google Maps Location Link'}
                            </label>
                            <input
                              type="text"
                              value={addressMapLink}
                              onChange={e => setAddressMapLink(e.target.value)}
                              className="cn-input text-xs h-10 bg-background"
                              placeholder="https://maps.google.com/?q=..."
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === 'email' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">{language === 'ar' ? 'إعدادات البريد الإلكتروني للطلبات' : 'Callback Notification Email Settings'}</h3>
                        
                        {/* SMTP Config Group (Side-by-Side columns) */}
                        <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
                          <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{language === 'ar' ? 'إعدادات خادم SMTP' : 'SMTP Server Settings'}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <div className="relative">
                                <input
                                  type={showSmtpPass ? 'text' : 'password'}
                                  value={smtpPass}
                                  onChange={(e) => setSmtpPass(e.target.value)}
                                  className="cn-input font-mono text-xs bg-background pe-10"
                                  placeholder="••••••••"
                                  dir="ltr"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowSmtpPass(!showSmtpPass)}
                                  className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                >
                                  {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* IMAP Config Group (Side-by-Side columns) */}
                        <div className="bg-muted/10 p-5 rounded-2xl space-y-4">
                          <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{language === 'ar' ? 'إعدادات خادم البريد الوارد IMAP (لاستلام الردود)' : 'IMAP Inbound Mail Settings (For replies)'}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'خادم IMAP (Host)' : 'IMAP Host'}</label>
                              <input
                                type="text"
                                value={imapHost}
                                onChange={(e) => setImapHost(e.target.value)}
                                className="cn-input font-mono text-xs bg-background"
                                placeholder="imap.gmail.com"
                                dir="ltr"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-700">{language === 'ar' ? 'منفذ IMAP (Port)' : 'IMAP Port'}</label>
                              <input
                                type="number"
                                value={imapPort}
                                onChange={(e) => setImapPort(e.target.value)}
                                className="cn-input font-mono text-xs bg-background"
                                placeholder="993"
                                dir="ltr"
                              />
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/55 leading-relaxed">
                            {language === 'ar' 
                              ? 'سيتم استخدام اسم المستخدم وكلمة المرور الخاصة بخادم SMTP تلقائياً لتسجيل الدخول إلى خادم IMAP.' 
                              : 'The SMTP Username and Password will be automatically used to authenticate with the IMAP server.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === 'otp' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
                          {language === 'ar' ? 'إعدادات تسجيل المستأجرين (OTP Webhook)' : 'Renter Login Settings (OTP Webhook)'}
                        </h3>
                        
                        {/* 2-Column Split: Webhook & template left, Code editor right */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-5 bg-muted/10 p-5 rounded-2xl flex flex-col justify-between">
                            <div className="space-y-4">
                              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{language === 'ar' ? 'إعدادات الويب هوك والقالب' : 'Webhook & Template Settings'}</h4>
                              
                              <div className="space-y-1.5">
                                <label className="cn-label">
                                   {language === 'ar' ? 'رابط الويب هوك (Whatomate URL)' : 'Webhook URL (Whatomate)'}
                                </label>
                                <input
                                  type="url"
                                  value={otpWebhookUrl}
                                  onChange={(e) => setOtpWebhookUrl(e.target.value)}
                                  className="cn-input font-medium h-11 dir-ltr"
                                  placeholder="https://hook.us2.make.com/..."
                                />
                                <p className="text-[10px] text-muted-foreground leading-none">
                                  {language === 'ar' ? 'اتركه فارغاً لتعطيل إرسال الرسائل عبر الويب هوك.' : 'Leave empty to disable sending webhooks.'}
                                </p>
                              </div>

                              <div className="space-y-1.5">
                                <label className="cn-label">
                                  {language === 'ar' ? 'قالب رسالة رمز التحقق' : 'OTP Message Template'}
                                </label>
                                <textarea
                                  required
                                  rows={3}
                                  value={otpMessageTemplate}
                                  onChange={(e) => setOtpMessageTemplate(e.target.value)}
                                  className="cn-input resize-none min-h-[90px] font-medium"
                                  placeholder={language === 'ar' ? 'رمز التحقق الخاص بك هو: {otp}' : 'Your verification code is: {otp}'}
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4 text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/55">
                              <p className="font-bold flex items-center gap-1.5 mb-1 text-foreground">
                                <Info className="w-3.5 h-3.5 text-primary" />
                                {language === 'ar' ? 'المتغيرات المدعومة في القالب:' : 'Supported Variables in Template:'}
                              </p>
                              <span className="font-mono text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 inline-block">{'{otp}'}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 bg-muted/10 p-5 rounded-2xl flex flex-col justify-between">
                            <div className="space-y-4">
                              <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">{language === 'ar' ? 'قالب حزمة البيانات (JSON Payload)' : 'JSON Webhook Payload'}</h4>
                              <textarea
                                required
                                rows={6}
                                value={otpWebhookPayload}
                                onChange={(e) => setOtpWebhookPayload(e.target.value)}
                                className="w-full border border-border/80 rounded-2xl p-4 transition-all font-mono text-xs dir-ltr bg-zinc-950 text-emerald-400 focus:ring-2 focus:ring-primary focus:border-primary shadow-inner min-h-[160px]"
                                placeholder={'{\n  "phone": "{phone}",\n  "type": "template"\n}'}
                              />
                            </div>
                            <div className="mt-4 text-xs text-muted-foreground bg-muted/30 p-3.5 rounded-2xl border border-border/60">
                              <p className="font-bold flex items-center gap-1.5 mb-2 text-foreground">
                                <Info className="w-4 h-4 text-primary" />
                                {language === 'ar' ? 'المتغيرات المدعومة في قالب JSON:' : 'Supported Variables in JSON:'}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-lg select-all cursor-pointer" title={language === 'ar' ? 'انقر للنسخ' : 'Click to copy'}>{'{phone}'}</span>
                                <span className="font-mono text-[10px] bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-lg select-all cursor-pointer" title={language === 'ar' ? 'انقر للنسخ' : 'Click to copy'}>{'{otp}'}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed">
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
                        const maxSize = isVideo ? 500 * 1024 * 1024 : 250 * 1024 * 1024;
                        if (file.size > maxSize) {
                          await showAlert(
                            language === 'ar'
                              ? `حجم الملف يتجاوز ${isVideo ? '500MB' : '250MB'}`
                              : `File exceeds ${isVideo ? '500MB' : '250MB'} limit`
                          );
                          return;
                        }
                        setImageSlotUploading(slotKey);
                        let base64 = '';
                        if (isVideo) {
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await fetch('/api/admin/upload-home-video', {
                              method: 'POST',
                              body: fd,
                            });
                            const data = await res.json().catch(() => ({}));
                            if (!res.ok) {
                              throw new Error(data.error || 'Failed to upload video');
                            }
                            onUpload(data.url);
                          } catch (uploadErr) {
                            console.error(uploadErr);
                            await showAlert(language === 'ar' ? 'فشل رفع الفيديو' : 'Failed to upload video');
                          } finally {
                            setImageSlotUploading(null);
                            e.target.value = '';
                          }
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
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
                              {language === 'ar' ? 'وسائط الصفحة الرئيسية والشعار' : 'Home Page Media & Logo'}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === 'ar'
                                ? 'ارفع شعار الموقع، صورة الخلفية الرئيسية، وفيديو العرض التعريفي لتهيئة المظهر البصري للموقع.'
                                : 'Upload site logo, hero background image, and homepage video to set up your visual branding.'}
                            </p>
                          </div>
                          
                          {/* 3-Column side-by-side Layout */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {imageSlots.map(slot => { return (
                              <div key={slot.key} className="rounded-2xl p-5 bg-muted/10 hover:bg-card/50 transition-all duration-300 shadow-xs flex flex-col justify-between h-full">
                                <div>
                                  <p className="font-bold text-foreground text-sm mb-1">
                                    {language === 'ar' ? slot.labelAr : slot.labelEn}
                                  </p>
                                  {(slot.hintAr || slot.hintEn) && (
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-4 min-h-[48px]">
                                      {language === 'ar' ? slot.hintAr : slot.hintEn}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-center gap-4 mt-2">
                                  {slot.current ? (
                                    <div className="relative w-full h-32 rounded-2xl overflow-hidden border-2 border-primary/85 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-[1.02] group/preview">
                                      {slot.isVideo ? (
                                        <video src={slot.current} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                                      ) : (
                                        <img src={slot.current} alt="preview" className="w-full h-full object-cover" />
                                      )}
                                      <button
                                        type="button"
                                        onClick={slot.onRemove}
                                        className="absolute top-1.5 end-1.5 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-all duration-200 cursor-pointer shadow-md backdrop-blur-xs"
                                        title={language === 'ar' ? (slot.isVideo ? 'حذف الفيديو' : 'حذف الصورة') : (slot.isVideo ? 'Remove video' : 'Remove image')}
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-full h-32 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 flex flex-col items-center justify-center">
                                      <ImagePlus className="w-8 h-8 text-muted-foreground/50" />
                                      <span className="text-xs text-muted-foreground/60 mt-1.5 font-bold">{language === 'ar' ? 'افتراضية' : 'Default'}</span>
                                    </div>
                                  )}
                                  <div className="w-full space-y-2 text-center">
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
                                      className={`inline-flex items-center justify-center gap-2 w-full py-2.5 border border-border/80 hover:border-primary/30 bg-card hover:bg-muted/40 text-foreground text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-97 select-none ${
                                        imageSlotUploading === slot.key ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                                      }`}
                                    >
                                      {imageSlotUploading === slot.key ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                      ) : (
                                        <ImagePlus className="w-4 h-4 text-muted-foreground" />
                                      )}
                                      {slot.current
                                        ? (slot.isVideo ? (language === 'ar' ? 'تغيير الفيديو' : 'Change Video') : (language === 'ar' ? 'تغيير الصورة' : 'Change Image'))
                                        : (slot.isVideo ? (language === 'ar' ? 'رفع فيديو' : 'Upload Video') : (language === 'ar' ? 'رفع صورة' : 'Upload Image'))
                                      }
                                    </label>
                                    <p className="text-[10px] text-muted-foreground leading-none">{language === 'ar' ? (slot.isVideo ? 'الحد الأقصى 500MB' : 'الحد الأقصى 250MB') : (slot.isVideo ? 'Max 500MB' : 'Max 250MB')}</p>
                                  </div>
                                </div>
                              </div>
                            ); })}
                          </div>
                        </div>
                      );
                    })()}

                    {activeSettingsSection === 'backup' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
                          {language === 'ar' ? 'نسخة احتياطية واستعادة' : 'Backup & Restore'}
                        </h3>

                        {/* 2-Column side-by-side Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Download Backup */}
                          <div className="rounded-2xl p-5 bg-muted/10 hover:bg-card/50 transition-all duration-300 shadow-xs flex flex-col justify-between gap-5">
                            <div className="space-y-1">
                              <h4 className="font-bold text-foreground text-sm">{language === 'ar' ? 'تنزيل نسخة احتياطية' : 'Download Backup'}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {language === 'ar'
                                  ? 'تحميل ملف ZIP يحتوي على قاعدة البيانات كاملة (مع جميع الصور) وملفات الصور كملفات حقيقية.'
                                  : 'Downloads a ZIP containing the full database (with all images embedded) plus extracted image files for convenience.'}
                              </p>
                            </div>
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
                              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all duration-150 disabled:opacity-50 active:scale-[0.97] cursor-pointer"
                            >
                              {backupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                              {language === 'ar' ? 'تنزيل ZIP' : 'Download ZIP'}
                            </button>
                          </div>

                          {/* Restore */}
                          <div className="rounded-2xl p-5 bg-red-50/40 dark:bg-red-950/10 backdrop-blur-md shadow-xs flex flex-col justify-between gap-5">
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-950/60 rounded-xl flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <div className="space-y-1 flex-1">
                                  <h4 className="font-bold text-red-700 dark:text-red-400 text-sm">{language === 'ar' ? 'استعادة نسخة احتياطية' : 'Restore from Backup'}</h4>
                                  <p className="text-xs text-red-600 dark:text-red-400/80 leading-relaxed">
                                    {language === 'ar'
                                      ? 'تحذير: سيتم مسح واستبدال قاعدة البيانات الحالية بالكامل. يرجى التأكد من رفع ملف ZIP صحيح تم تنزيله من نسخة احتياطية سابقة.'
                                      : 'Warning: This will overwrite and completely replace the current database. Make sure you upload a valid .zip file.'}
                                  </p>
                                </div>
                              </div>
                              
                              {restoreMessage && (
                                <div className={`p-3 rounded-xl text-xs font-bold ${restoreMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400'}`}>
                                  {restoreMessage.text}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <input
                                type="file"
                                id="restore-file-input"
                                accept=".zip"
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
                                className={`inline-flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs active:scale-[0.97] select-none ${restoreLoading ? 'opacity-50 pointer-events-none' : ''}`}
                              >
                                {restoreLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                {language === 'ar' ? 'اختر ملف للاستعادة' : 'Choose File to Restore'}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSettingsSection === 'techhub' && (
                      <div className="space-y-6">
                        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">{language === 'ar' ? 'إعدادات ربط ومزامنة TechHub API' : 'TechHub API Integration Settings'}</h3>
                        
                        <div className="bg-muted/10 p-5 rounded-2xl space-y-6">
                          {/* 2-Column side-by-side Status Toggles */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/60 hover:bg-muted/30 transition-colors rounded-2xl shadow-xs">
                              <div className="flex flex-col gap-1 pr-4">
                                <span className="text-sm font-bold text-foreground">
                                  {language === 'ar' ? 'تفعيل ربط TechHub' : 'Enable TechHub Integration'}
                                </span>
                                <span className="text-xs text-muted-foreground leading-none">
                                  {language === 'ar' ? 'تمكين استيراد ومزامنة البيانات.' : 'Enable API integration and data syncing.'}
                                </span>
                              </div>
                              <label className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer flex-shrink-0 select-none" dir="ltr">
                                <input
                                  type="checkbox"
                                  checked={techhubEnabled}
                                  onChange={() => setTechhubEnabled(!techhubEnabled)}
                                  className="sr-only"
                                />
                                <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                                  techhubEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-zinc-800'
                                }`} />
                                <span
                                  className={`absolute left-0 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
                                    techhubEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/60 hover:bg-muted/30 transition-colors rounded-2xl shadow-xs">
                              <div className="flex flex-col gap-1 pr-4">
                                <span className="text-sm font-bold text-foreground">
                                  {language === 'ar' ? 'تفعيل وضع التجربة (Sandbox Mode)' : 'Enable Sandbox / Test Mode'}
                                </span>
                                <span className="text-xs text-muted-foreground leading-none">
                                  {language === 'ar' 
                                    ? 'استخدام بيانات تجريبية وهمية دون استهلاك رصيد واجهة التطبيق.' 
                                    : 'Use simulated test data instead of hitting production.'}
                                </span>
                              </div>
                              <label className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer flex-shrink-0 select-none" dir="ltr">
                                <input
                                  type="checkbox"
                                  checked={techhubSandboxMode}
                                  onChange={() => setTechhubSandboxMode(!techhubSandboxMode)}
                                  className="sr-only"
                                />
                                <span className={`absolute inset-0 rounded-full transition-colors duration-200 ${
                                  techhubSandboxMode ? 'bg-primary' : 'bg-gray-200 dark:bg-zinc-800'
                                }`} />
                                <span
                                  className={`absolute left-0 h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
                                    techhubSandboxMode ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </label>
                          </div>
                        </div>

                          {/* Credentials inputs with smooth lock transition (3-Column side-by-side layout) */}
                          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-350 ${
                            techhubSandboxMode ? 'opacity-40 pointer-events-none filter blur-[0.4px]' : 'opacity-100'
                          }`}>
                            <div className="space-y-1.5">
                              <label className="cn-label">{language === 'ar' ? 'معرف العميل (Client ID)' : 'Client ID'}</label>
                              <input
                                type="text"
                                value={techhubClientId}
                                onChange={(e) => setTechhubClientId(e.target.value)}
                                className="cn-input bg-background font-mono h-11"
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
                                  className="cn-input bg-background font-mono h-11"
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
                                  className="cn-input bg-background font-mono h-11"
                                  placeholder="••••••••••••••••"
                                  disabled={techhubSandboxMode}
                                  required={techhubEnabled && !techhubSandboxMode}
                                />
                              </div>
                            </div>

                            {techhubEnabled && (
                              <div className="pt-5 border-t border-border mt-6 bg-muted/15 p-5 rounded-2xl border border-border/60">
                                <h4 className="text-xs font-bold text-foreground mb-1.5">
                                  {language === 'ar' ? 'مزامنة البيانات الفورية' : 'Instant Data Synchronization'}
                                </h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                                  {language === 'ar' 
                                    ? 'جلب العقارات والمستأجرين (عقود إيجار) من TechHub ومزامنتهم مباشرة مع قاعدة بيانات التطبيق.' 
                                    : 'Fetch properties and contract renters from TechHub and sync them with your database.'}
                                </p>
                                <button
                                  type="button"
                                  onClick={handleTechHubSync}
                                  disabled={syncingTechHub}
                                  className="inline-flex items-center gap-2 h-10 px-5 text-xs font-bold rounded-xl shadow-xs bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 cursor-pointer active:scale-[0.97] transition-all"
                                >
                                  {syncingTechHub ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                  {language === 'ar' ? 'ابدأ المزامنة الآن' : 'Start Sync Now'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

              <div className="pt-6 border-t border-border">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 bg-primary hover:opacity-95 text-white rounded-xl transition-all font-bold text-sm cursor-pointer inline-flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-97 border border-transparent"
                >
                  {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {t('admin.submit')}
                </button>
              </div>
            </form>
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
