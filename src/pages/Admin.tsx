import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { PlusCircle, Loader2, Trash2, Home, MapPin, Settings as SettingsIcon, ImagePlus, X, BarChart3, Eye, Info, CheckCircle, Upload, Mail, ArrowLeft, ArrowRight, Pencil, MessageSquare, KeyRound, Database, RefreshCw, Plus, Building2, Check, DollarSign, FileText, Image, LayoutGrid, User, UserPlus, Search, Copy, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { SrIcon } from '../components/SrIcon';
import { useDialog } from '../context/DialogContext';

import AdminProjects from './AdminProjects';
import AdminCallbacks from './AdminCallbacks';
import AdminRenters from './AdminRenters';
import AdminMaintenance from './AdminMaintenance';
import AdminUsers from './AdminUsers';
import AdminLogs from './AdminLogs';
import { compressImage } from '../lib/image';
import { CustomSelect } from '../components/CustomSelect';

import { WhatsAppSettingsTab } from '../components/settings/WhatsAppSettingsTab';
import { EmailSettingsTab } from '../components/settings/EmailSettingsTab';
import { OtpSettingsTab } from '../components/settings/OtpSettingsTab';
import { ImagesSettingsTab } from '../components/settings/ImagesSettingsTab';
import { BackupSettingsTab } from '../components/settings/BackupSettingsTab';
import { TechHubSettingsTab } from '../components/settings/TechHubSettingsTab';

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
  maintenance: 'maintenance',
  analytics: 'analytics',
  settings: 'settings',
  callbacks: 'callbacks',
  users: 'users',
  logs: 'logs'
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ['properties', 'projects', 'buildings', 'renters', 'analytics', 'settings', 'callbacks', 'users', 'logs', 'maintenance'],
  MANAGER: ['properties', 'projects', 'buildings', 'renters', 'callbacks', 'analytics', 'maintenance'],
  AGENT: ['properties', 'projects', 'callbacks'],
  MAINTENANCE: ['maintenance', 'buildings', 'renters']
};

const POPULAR_ICONS = [
  'Home', 'Building2', 'Compass', 'Ruler', 'DoorOpen', 'Armchair', 'Bath', 
  'Calendar', 'CheckCircle', 'Layers', 'Wind', 'Wifi', 'Shield', 'MapPin', 
  'Car', 'Coins', 'Key', 'Tv', 'Flame', 'Droplet', 'Sun', 'Moon', 'Info', 
  'Sparkles', 'Users', 'Heart', 'Map', 'Trees', 'Warehouse'
];

function hasTabPermission(tab: string, role: string) {
  const perm = TAB_TO_PERMISSION[tab];
  if (!perm) return false;
  const userPerms = ROLE_PERMISSIONS[role] || [];
  return role === 'ADMIN' || userPerms.includes(perm);
}

const formatNumberWithCommas = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '';
  const str = String(val).replace(/,/g, '');
  if (str === '') return '';
  const parts = str.split('.');
  parts[0] = parts[0].replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (parts.length > 1) {
    parts[1] = parts[1].replace(/[^\d]/g, '');
    return parts[0] + '.' + parts[1];
  }
  return parts[0];
};

const sanitizeNumericInput = (val: string): string => {
  const clean = val.replace(/,/g, '').replace(/[^\d.]/g, '');
  const parts = clean.split('.');
  return parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
};

export default function Admin() {
  const { t, language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();

  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [fetching, setFetching] = useState(true);
  const { tab: routeTab, subtab: routeSubtab } = useParams<{ tab?: string; subtab?: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'manage' | 'projects' | 'buildings' | 'renters' | 'maintenance' | 'settings' | 'callbacks' | 'users' | 'logs'>('manage');
  const [userRole, setUserRole] = useState<string>('ADMIN');

  // Sync URL parameters to activeTab & activeSettingsSection
  useEffect(() => {
    if (!routeTab) {
      setActiveTab('manage');
      return;
    }
    const lower = routeTab.toLowerCase();
    if (lower === 'buildings' || lower === 'properties' || lower === 'manage') {
      setActiveTab('manage');
    } else if (lower === 'projects') {
      setActiveTab('projects');
    } else if (lower === 'renters' || lower === 'renter') {
      setActiveTab('renters');
    } else if (lower === 'maintenance' || lower === 'mentainens') {
      setActiveTab('maintenance');
    } else if (lower === 'messages' || lower === 'callbacks' || lower === 'requests') {
      setActiveTab('callbacks');
    } else if (lower === 'users') {
      setActiveTab('users');
    } else if (lower === 'analytics') {
      setActiveTab('analytics');
    } else if (lower === 'settings') {
      setActiveTab('settings');
      if (routeSubtab) {
        const sub = routeSubtab.toLowerCase();
        if (['whatsapp', 'email', 'otp', 'images', 'backup', 'techhub'].includes(sub)) {
          setActiveSettingsSection(sub as any);
        }
      }
    } else if (lower === 'logs') {
      setActiveTab('logs');
    }
  }, [routeTab, routeSubtab]);

  const handleTabChange = (tab: 'manage' | 'projects' | 'renters' | 'maintenance' | 'analytics' | 'callbacks' | 'users' | 'logs' | 'settings') => {
    setActiveTab(tab);
    if (tab === 'manage') navigate('/admin/buildings');
    else if (tab === 'callbacks') navigate('/admin/messages');
    else if (tab === 'settings') navigate(`/admin/settings/${activeSettingsSection}`);
    else navigate(`/admin/${tab}`);
  };

  const handleSettingsSectionChange = (section: string) => {
    setActiveSettingsSection(section as any);
    navigate(`/admin/settings/${section}`);
  };
  const [selectedParentProperty, setSelectedParentProperty] = useState<Property | null>(null);
  const [selectedParentTab, setSelectedParentTab] = useState<'units' | 'details'>('units');
  const [selectedParentUnits, setSelectedParentUnits] = useState<Property[]>([]);
  const [buildingDetailSubTab, setBuildingDetailSubTab] = useState<'units' | 'maintenance'>('units');
  const [loadingUnits, setLoadingUnits] = useState(false);

  const fetchUnitsForParent = async (parentId: string) => {
    setLoadingUnits(true);
    try {
      const res = await fetch(`/api/admin/properties?parentId=${parentId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => {
          const getUnitName = (item: any) => {
            let uName = '';
            try {
              const parsed = typeof item.details === 'string' ? JSON.parse(item.details || '[]') : item.details;
              if (Array.isArray(parsed)) {
                const match = parsed.find((d: any) => d.key === 'رقم الوحدة' || d.key === 'Unit Name' || d.key === 'unit number' || d.key === 'unit');
                if (match?.value) uName = String(match.value);
              }
            } catch (_) {}
            const title = (item.titleAr || item.titleEn || '').trim();
            const hasUnitInTitle = uName ? title.toLowerCase().includes(uName.toLowerCase()) : false;
            return (uName && !hasUnitInTitle ? `${uName} ${title}` : title).trim();
          };
          const keyA = getUnitName(a);
          const keyB = getUnitName(b);
          return keyA.localeCompare(keyB, undefined, { numeric: true, sensitivity: 'base' });
        });
        setSelectedParentUnits(sorted);
      } else {
        setSelectedParentUnits([]);
      }
    } catch (err) {
      console.error("Error fetching units:", err);
      setSelectedParentUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  };

  useEffect(() => {
    if (selectedParentProperty) {
      fetchUnitsForParent(selectedParentProperty.id);
    } else {
      setSelectedParentUnits([]);
    }
  }, [selectedParentProperty]);

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

  // Renter unit assignment state for Admin.tsx
  const [unitForRenterAssignment, setUnitForRenterAssignment] = useState<any | null>(null);
  const [renterAssignmentMode, setRenterAssignmentMode] = useState<'existing' | 'new'>('existing');
  const [availableRenterUsers, setAvailableRenterUsers] = useState<any[]>([]);
  const [selectedRenterUserId, setSelectedRenterUserId] = useState('');
  const [renterSearchQuery, setRenterSearchQuery] = useState('');
  const [newUnitRenterName, setNewUnitRenterName] = useState('');
  const [newUnitRenterPhone, setNewUnitRenterPhone] = useState('');
  const [isSavingRenterToUnit, setIsSavingRenterToUnit] = useState(false);

  const fetchRenterUsersList = async () => {
    try {
      const res = await fetch('/api/admin/renters-users');
      if (res.ok) {
        const data = await res.json();
        setAvailableRenterUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch renters list:", err);
    }
  };

  const handleOpenAssignRenterModal = (unit: any) => {
    setUnitForRenterAssignment(unit);
    setRenterAssignmentMode('existing');
    setSelectedRenterUserId(unit.renterId || '');
    setRenterSearchQuery('');
    setNewUnitRenterName('');
    setNewUnitRenterPhone('');
    fetchRenterUsersList();
  };

  const handleSaveRenterToUnit = async () => {
    if (!unitForRenterAssignment) return;
    setIsSavingRenterToUnit(true);
    try {
      let rId = '';
      let rName = '';
      let rPhone = '';

      if (renterAssignmentMode === 'existing') {
        const found = availableRenterUsers.find(r => r.id === selectedRenterUserId);
        if (!found) {
          await showAlert(language === 'ar' ? 'الرجاء اختيار مستأجر من القائمة' : 'Please select a renter from the list');
          setIsSavingRenterToUnit(false);
          return;
        }
        rId = found.id;
        rName = found.name;
        rPhone = found.phone;
      } else {
        if (!newUnitRenterName.trim() || !newUnitRenterPhone.trim()) {
          await showAlert(language === 'ar' ? 'الرجاء كتابة اسم المستأجر ورقم الجوال' : 'Please enter renter name and phone');
          setIsSavingRenterToUnit(false);
          return;
        }
        const createRes = await fetch('/api/admin/renters-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newUnitRenterName.trim(), phone: newUnitRenterPhone.trim() })
        });
        if (!createRes.ok) {
          const errData = await createRes.json();
          await showAlert(errData.error || (language === 'ar' ? 'فشل إضافة المستأجر' : 'Failed to create renter'));
          setIsSavingRenterToUnit(false);
          return;
        }
        const newRenterData = await createRes.json();
        rId = newRenterData.id;
        rName = newRenterData.name;
        rPhone = newRenterData.phone;
      }

      // Update unit Property record with renter fields
      const updateRes = await fetch(`/api/admin/properties/${unitForRenterAssignment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...unitForRenterAssignment,
          renterId: rId,
          renterName: rName,
          renterPhone: rPhone
        })
      });

      if (updateRes.ok) {
        // Also sync to RenterUnit system if matching building exists
        if (matchingBuilding && matchingBuilding.id) {
          try {
            const rUnitsRes = await fetch('/api/admin/renters');
            if (rUnitsRes.ok) {
              const rUnits = await rUnitsRes.json();
              const targetRUnit = rUnits.find((u: any) => u.buildingId === matchingBuilding.id && (u.unitNumber === unitForRenterAssignment.titleAr || u.unitNumber === unitForRenterAssignment.titleEn));
              if (targetRUnit) {
                await fetch(`/api/admin/units/${targetRUnit.id}/assign-renter`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ renterId: rId })
                });
              }
            }
          } catch (syncErr) {
            console.error("RenterUnit sync error:", syncErr);
          }
        }

        showSubmitMessage('success', language === 'ar' ? 'تم تعيين المستأجر للعقار بنجاح' : 'Renter assigned to property successfully');
        setUnitForRenterAssignment(null);
        fetchProperties();
        if (selectedParentProperty) {
          if (selectedParentProperty.id === unitForRenterAssignment.id) {
            setSelectedParentProperty({
              ...selectedParentProperty,
              renterId: rId,
              renterName: rName,
              renterPhone: rPhone
            });
          } else {
            fetchUnitsForParent(selectedParentProperty.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ أثناء حفظ المستأجر' : 'Error assigning renter');
    } finally {
      setIsSavingRenterToUnit(false);
    }
  };

  const handleUnassignRenterFromPropertyUnit = async (unit: any) => {
    const confirmed = await showConfirm(language === 'ar' ? 'هل أنت تأكد من إلغاء تعيين هذا المستأجر من العقار؟' : 'Are you sure you want to unassign this renter from the property?');
    if (!confirmed) return;
    try {
      const updateRes = await fetch(`/api/admin/properties/${unit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...unit,
          renterId: null,
          renterName: null,
          renterPhone: null
        })
      });
      if (updateRes.ok) {
        if (matchingBuilding && matchingBuilding.id) {
          try {
            const rUnitsRes = await fetch('/api/admin/renters');
            if (rUnitsRes.ok) {
              const rUnits = await rUnitsRes.json();
              const targetRUnit = rUnits.find((u: any) => u.buildingId === matchingBuilding.id && (u.unitNumber === unit.titleAr || u.unitNumber === unit.titleEn || u.unitNumber === 'كامل العقار'));
              if (targetRUnit) {
                await fetch(`/api/admin/units/${targetRUnit.id}/assign-renter`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ renterId: null })
                });
              }
            }
          } catch (syncErr) {
            console.error("RenterUnit unassign sync error:", syncErr);
          }
        }

        fetchProperties();
        if (selectedParentProperty) {
          if (selectedParentProperty.id === unit.id) {
            setSelectedParentProperty({
              ...selectedParentProperty,
              renterId: null,
              renterName: null,
              renterPhone: null
            });
          } else {
            fetchUnitsForParent(selectedParentProperty.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    if (activeTab === 'buildings' || activeTab === 'renters' || selectedParentProperty) {
      fetchAdminBuildings();
    }
  }, [activeTab, selectedParentProperty]);

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
  const [techhubEndpointUrl, setTechhubEndpointUrl] = useState('');
  const [techhubSandboxMode, setTechhubSandboxMode] = useState(true);
  const [, setSyncingTechHub] = useState(false);

  // Authentica Settings State
  const [authenticaEnabled, setAuthenticaEnabled] = useState(true);
  const [authenticaApiKey, setAuthenticaApiKey] = useState('$2y$10$qtRuMVdslBE8aQDUvWoiJuPYCRYt/mw95knxkg5d9WfnfYcZrKrSG');
  const [showAuthenticaApiKey, setShowAuthenticaApiKey] = useState(false);
  const [authenticaMethod, setAuthenticaMethod] = useState('sms');
  const [authenticaTemplateId, setAuthenticaTemplateId] = useState('');

  // VerifyKit Settings State
  const [verifyKitEnabled, setVerifyKitEnabled] = useState(true);
  const [verifyKitAppKey, setVerifyKitAppKey] = useState('AxaVaO8JfW2OMj');
  const [verifyKitDomain, setVerifyKitDomain] = useState('https://rbmc.sa');
  const [verifyKitDeeplink, setVerifyKitDeeplink] = useState('vfk300403://welcome');

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

  // Home Images & Logo State
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [homeImages, setHomeImages] = useState<{
    hero: string | null;
    promoVideo: string | null;
  }>({
    hero: null, promoVideo: null
  });
  const [imageSlotUploading, setImageSlotUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
  const [restoreProgress, setRestoreProgress] = useState<number | null>(null);
  const [, setRestoreMessage] = useState<{type:'success'|'error', text:string} | null>(null);

  const [currentStep, setCurrentStep] = useState(1);

  // Icon Picker States
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const [iconSearchQuery, setIconSearchQuery] = useState('');

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
    detailsList: [] as {id: string, key: string, value: string, icon?: string}[],
    paymentsCount: '',
    utilityBills: 'NONE',
    includeElectricity: false,
    electricityCostVal: '',
    electricityFrequencyVal: 'YEARLY',
    includeWater: false,
    waterCostVal: '',
    waterFrequencyVal: 'YEARLY',
    vatExempt: false,
    vatNotApplicable: false,
    allowedPaymentPlans: ["1", "2", "4"] as string[],
    videoUrl: '',
    attachments: [] as { name: string, url: string, size: number }[],
    parentId: '' as string | null,
    status: 'PUBLISHED',
    subProperties: [] as any[]
  });

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/admin/properties');
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

      // Load VerifyKit Settings
      if (data.verifyKitEnabled !== undefined) setVerifyKitEnabled(data.verifyKitEnabled);
      if (data.verifyKitAppKey !== undefined) setVerifyKitAppKey(data.verifyKitAppKey || 'AxaVaO8JfW2OMj');
      if (data.verifyKitDomain !== undefined) setVerifyKitDomain(data.verifyKitDomain || 'https://rbmc.sa');
      if (data.verifyKitDeeplink !== undefined) setVerifyKitDeeplink(data.verifyKitDeeplink || 'vfk300403://welcome');

      // Load Authentica Settings
      if (data.authenticaEnabled !== undefined) setAuthenticaEnabled(data.authenticaEnabled);
      if (data.authenticaApiKey !== undefined) setAuthenticaApiKey(data.authenticaApiKey || '$2y$10$qtRuMVdslBE8aQDUvWoiJuPYCRYt/mw95knxkg5d9WfnfYcZrKrSG');
      if (data.authenticaMethod !== undefined) setAuthenticaMethod(data.authenticaMethod || 'sms');
      if (data.authenticaTemplateId !== undefined) setAuthenticaTemplateId(data.authenticaTemplateId || '');
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
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadMessage, setImageUploadMessage] = useState<{type: 'error', text: string} | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setImageUploadMessage(null);
    setIsUploadingImages(true);
    setImageUploadProgress(0);

    const fileList = Array.from(files) as File[];
    let totalSize = 0;
    for (const file of fileList) {
      totalSize += file.size;
    }

    if (totalSize > 250 * 1024 * 1024) {
      setImageUploadMessage({ 
        type: 'error', 
        text: language === 'ar' ? 'إجمالي حجم الملفات المرفوعة يتجاوز الحد الأقصى (250MB)' : 'Total upload size of files exceeds limit (250MB)' 
      });
      setIsUploadingImages(false);
      setImageUploadProgress(null);
      e.target.value = '';
      return;
    }

    let base64Medias: string[] = [...formData.imageUrls];

    // Process sequentially
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        if (file.type.startsWith('image/')) {
          const base64 = await compressImage(file);
          base64Medias.push(base64);
        } else if (file.type.startsWith('video/')) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onprogress = (evt) => {
              if (evt.lengthComputable) {
                const filePct = evt.loaded / evt.total;
                const totalPct = Math.round(((i + filePct) / fileList.length) * 100);
                setImageUploadProgress(totalPct);
              }
            };
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
      setImageUploadProgress(Math.round(((i + 1) / fileList.length) * 100));
    }
    
    setFormData(prev => ({ ...prev, imageUrls: base64Medias }));
    setIsUploadingImages(false);
    setImageUploadProgress(null);
    
    // reset input
    e.target.value = '';
  };

  const [isUploadingDocs, setIsUploadingDocs] = useState(false);
  const [docUploadProgress, setDocUploadProgress] = useState<number | null>(null);
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingDocs(true);
    setDocUploadProgress(0);

    const fileList = Array.from(files) as File[];
    const docList = [...(formData.attachments || [])];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const filePct = evt.loaded / evt.total;
              const totalPct = Math.round(((i + filePct) / fileList.length) * 100);
              setDocUploadProgress(totalPct);
            }
          };
          reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
              resolve(event.target.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('File read error'));
          reader.readAsDataURL(file);
        });
        docList.push({
          name: file.name,
          url: base64,
          size: file.size
        });
      } catch (err) {
        console.error(err);
      }
      setDocUploadProgress(Math.round(((i + 1) / fileList.length) * 100));
    }

    setFormData(prev => ({ ...prev, attachments: docList }));
    setIsUploadingDocs(false);
    setDocUploadProgress(null);
    e.target.value = '';
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, idx) => idx !== index)
    }));
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

  const saveProperty = async (e: React.FormEvent | null, statusVal?: string) => {
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

    const finalDetailsList = [...formData.detailsList.map(({key, value, icon}) => ({key, value, icon}))];
    if (buildingFloors.length > 0) {
      const existingIdx = finalDetailsList.findIndex(d => d.key === 'أدوار المبنى' || d.key === 'Building Floors');
      const floorsKey = language === 'ar' ? 'أدوار المبنى' : 'Building Floors';
      const floorsValue = buildingFloors.join(',');
      if (existingIdx > -1) {
        finalDetailsList[existingIdx].value = floorsValue;
      } else {
        finalDetailsList.push({ key: floorsKey, value: floorsValue });
      }
    }

    const finalStatus = statusVal || formData.status || 'PUBLISHED';

    const payload = {
      ...formData,
      status: finalStatus,
      utilityBills: utilityPayload,
      electricityCost: (formData.includeElectricity ? (parseFloat(formData.electricityCostVal) || 0) : 0) + (formData.includeWater ? (parseFloat(formData.waterCostVal) || 0) : 0),
      electricityFrequency: formData.includeElectricity ? formData.electricityFrequencyVal : (formData.includeWater ? formData.waterFrequencyVal : null),
      features: formData.featuresList.map(f => f.value).filter(Boolean).join(','),
      imageUrls: JSON.stringify(formData.imageUrls),
      attachments: JSON.stringify(formData.attachments),
      details: JSON.stringify(finalDetailsList)
    };

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing ? `/api/admin/properties/${editingId}` : '/api/admin/properties';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showSubmitMessage('success', isEditing 
          ? (language === 'ar' ? 'تم تحديث العقار بنجاح' : 'Property updated successfully!') 
          : (finalStatus === 'HIDDEN'
              ? (language === 'ar' ? 'تم حفظ العقار كمخفي بنجاح!' : 'Property saved as hidden successfully!')
              : (language === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully!'))
        );
        resetForm();
        fetchProperties();
        if (formData.parentId) {
          fetchUnitsForParent(formData.parentId);
        }
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
    await saveProperty(e, formData.status);
  };

  const renderIcon = (iconName?: string, key?: string) => {
    let resolvedIcon = iconName;
    if (!resolvedIcon && key) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('واجهة') || lowerKey.includes('facade')) resolvedIcon = 'Compass';
      else if (lowerKey.includes('شارع') || lowerKey.includes('street')) resolvedIcon = 'Ruler';
      else if (lowerKey.includes('غرف') || lowerKey.includes('room')) resolvedIcon = 'DoorOpen';
      else if (lowerKey.includes('صالة') || lowerKey.includes('hall')) resolvedIcon = 'Armchair';
      else if (lowerKey.includes('حمام') || lowerKey.includes('bathroom') || lowerKey.includes('مياه')) resolvedIcon = 'Bath';
      else if (lowerKey.includes('ضمان') || lowerKey.includes('warrant')) resolvedIcon = 'CheckCircle';
      else if (lowerKey.includes('تاريخ') || lowerKey.includes('date') || lowerKey.includes('تسليم')) resolvedIcon = 'Calendar';
      else if (lowerKey.includes('دور') || lowerKey.includes('floor')) resolvedIcon = 'Layers';
      else if (lowerKey.includes('موقف') || lowerKey.includes('parking')) resolvedIcon = 'Car';
      else if (lowerKey.includes('مصعد') || lowerKey.includes('elevator')) resolvedIcon = 'ArrowUpCircle';
      else if (lowerKey.includes('وحد') || lowerKey.includes('unit')) resolvedIcon = 'Building2';
      else if (lowerKey.includes('مساح') || lowerKey.includes('area')) resolvedIcon = 'Maximize2';
      else if (lowerKey.includes('مطبخ') || lowerKey.includes('kitchen')) resolvedIcon = 'ChefHat';
    }

    const IconComponent = resolvedIcon ? (LucideIcons as any)[resolvedIcon] : null;
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 text-primary" />;
    }
    return <LucideIcons.Layers className="w-5 h-5 text-primary" />;
  };

  const updateDetailIcon = (id: string, iconName: string) => {
    setFormData(prev => ({
      ...prev,
      detailsList: prev.detailsList.map(d => d.id === id ? { ...d, icon: iconName } : d)
    }));
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
      vatNotApplicable: false,
      allowedPaymentPlans: ["1", "2", "4"],
      videoUrl: '',
      parentId: '',
      status: 'PUBLISHED',
      subProperties: [],
      attachments: []
    });
    setEditingId(null);
    setShowAddForm(false);
    setCurrentStep(1);
    setShowUnitForm(false);
    setEditingUnitIndex(null);
    setBuildingFloors([]);
    setNewFloorInput('');
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
    unitNameAr: '',
    unitNameEn: '',
    type: 'RENT',
    propertyCategory: 'APARTMENT',
    price: '',
    area: '',
    status: 'PUBLISHED',
    description: '',
    rooms: '',
    bathrooms: '',
    floor: '',
    imageUrls: '[]'
  });

  const [buildingFloors, setBuildingFloors] = useState<string[]>([]);
  const [newFloorInput, setNewFloorInput] = useState('');

  const parentFloors = (() => {
    const parent = selectedParentProperty || (formData.parentId ? properties.find(p => p.id === formData.parentId) : null);
    if (!parent) return [];
    try {
      const detailsList = typeof parent.details === 'string' ? JSON.parse(parent.details || '[]') : (parent.details || []);
      const match = detailsList.find((d: any) => d.key === 'أدوار المبنى' || d.key === 'Building Floors');
      return match ? match.value.split(',').map((f: any) => f.trim()).filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  })();

  const handleAddFloorToParent = async () => {
    if (!newFloorInput.trim() || !selectedParentProperty) return;
    const flr = newFloorInput.trim();
    let currentDetails = [];
    try {
      currentDetails = typeof selectedParentProperty.details === 'string' 
        ? JSON.parse(selectedParentProperty.details || '[]') 
        : (selectedParentProperty.details || []);
    } catch (_) {}
    
    let detailsList = Array.isArray(currentDetails) ? currentDetails : [];
    const existingIdx = detailsList.findIndex((d: any) => d.key === 'أدوار المبنى' || d.key === 'Building Floors');
    let floorsList: string[] = [];
    if (existingIdx > -1) {
      floorsList = detailsList[existingIdx].value.split(',').map((f: any) => f.trim()).filter(Boolean);
    }
    if (floorsList.includes(flr)) return;
    floorsList.push(flr);
    
    const floorsKey = language === 'ar' ? 'أدوار المبنى' : 'Building Floors';
    if (existingIdx > -1) {
      detailsList[existingIdx].value = floorsList.join(',');
    } else {
      detailsList.push({ key: floorsKey, value: floorsList.join(',') });
    }
    
    try {
      const res = await fetch(`/api/admin/properties/${selectedParentProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: JSON.stringify(detailsList) })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedParentProperty(prev => prev ? { ...prev, ...updated, details: JSON.stringify(detailsList) } : updated);
        setNewFloorInput('');
        fetchProperties();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFloorFromParent = async (index: number) => {
    if (!selectedParentProperty) return;
    let currentDetails = [];
    try {
      currentDetails = typeof selectedParentProperty.details === 'string' 
        ? JSON.parse(selectedParentProperty.details || '[]') 
        : (selectedParentProperty.details || []);
    } catch (_) {}
    
    let detailsList = Array.isArray(currentDetails) ? currentDetails : [];
    const existingIdx = detailsList.findIndex((d: any) => d.key === 'أدوار المبنى' || d.key === 'Building Floors');
    if (existingIdx === -1) return;
    
    let floorsList = detailsList[existingIdx].value.split(',').map((f: any) => f.trim()).filter(Boolean);
    floorsList = floorsList.filter((_, idx) => idx !== index);
    
    if (floorsList.length > 0) {
      detailsList[existingIdx].value = floorsList.join(',');
    } else {
      detailsList = detailsList.filter((_, idx) => idx !== existingIdx);
    }
    
    try {
      const res = await fetch(`/api/admin/properties/${selectedParentProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: JSON.stringify(detailsList) })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedParentProperty(prev => prev ? { ...prev, ...updated, details: JSON.stringify(detailsList) } : updated);
        fetchProperties();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewUnitClick = () => {
    setUnitFormData({
      id: '',
      titleAr: '',
      titleEn: '',
      unitNameAr: '',
      unitNameEn: '',
      type: 'RENT',
      propertyCategory: 'APARTMENT',
      price: '',
      area: '',
      status: 'PUBLISHED',
      description: '',
      rooms: '',
      bathrooms: '',
      floor: '',
      imageUrls: '[]'
    });
    setEditingUnitIndex(null);
    setShowUnitForm(true);
  };

  const handleEditUnit = (index: number) => {
    const unit = formData.subProperties[index];
    let rooms = '';
    let bathrooms = '';
    let floor = '';
    let unitNameAr = '';
    let unitNameEn = '';
    try {
      const parsed = JSON.parse(unit.details || '[]');
      rooms = parsed.find((d: any) => d.key.includes('غرف') || d.key.toLowerCase().includes('room'))?.value || '';
      bathrooms = parsed.find((d: any) => d.key.includes('مياه') || d.key.toLowerCase().includes('bathroom'))?.value || '';
      floor = parsed.find((d: any) => d.key.includes('دور') || d.key.toLowerCase().includes('floor'))?.value || '';
      unitNameAr = parsed.find((d: any) => d.key === 'رقم الوحدة' || d.key.includes('اسم الوحدة'))?.value || '';
      unitNameEn = parsed.find((d: any) => d.key === 'Unit Name' || d.key.toLowerCase().includes('unit name'))?.value || '';
    } catch (_) {}

    setUnitFormData({
      id: unit.id || '',
      titleAr: unit.titleAr || '',
      titleEn: unit.titleEn || '',
      unitNameAr,
      unitNameEn,
      type: unit.type || 'RENT',
      propertyCategory: unit.propertyCategory || 'APARTMENT',
      price: unit.price ? String(unit.price) : '',
      area: unit.area ? String(unit.area) : '',
      status: unit.status || 'PUBLISHED',
      description: unit.description || '',
      rooms,
      bathrooms,
      floor,
      imageUrls: unit.imageUrls || '[]'
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

  const getNextUnitNameWithSuffix = (baseStr: string, existingList: string[]): string => {
    if (!baseStr) baseStr = 'وحدة';
    const match = baseStr.match(/^(.*?)(?:_(\d+))?$/);
    const base = (match && match[1]) ? match[1] : baseStr;

    let maxSeq = 0;
    const escBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escBase}(?:_(\\d+))?$`);

    for (const item of existingList) {
      if (!item) continue;
      const m = item.match(regex);
      if (m) {
        const num = m[1] ? parseInt(m[1], 10) : (item === base ? 0 : 0);
        if (num > maxSeq) maxSeq = num;
      }
      const m2 = item.match(new RegExp(`^${escBase}_(\\d+)$`));
      if (m2 && m2[1]) {
        const num = parseInt(m2[1], 10);
        if (num > maxSeq) maxSeq = num;
      }
    }

    return `${base}_${maxSeq + 1}`;
  };

  const handleDuplicateSubProperty = (index: number) => {
    const targetUnit = formData.subProperties[index];
    if (!targetUnit) return;

    const existingTitlesAr = formData.subProperties.map(u => u.titleAr);
    const existingTitlesEn = formData.subProperties.map(u => u.titleEn);

    let unitNameAr = '';
    let unitNameEn = '';
    try {
      const parsed = JSON.parse(targetUnit.details || '[]');
      unitNameAr = parsed.find((d: any) => d.key === 'رقم الوحدة' || d.key.includes('اسم الوحدة'))?.value || '';
      unitNameEn = parsed.find((d: any) => d.key === 'Unit Name' || d.key.toLowerCase().includes('unit name'))?.value || '';
    } catch (_) {}

    const newTitleAr = getNextUnitNameWithSuffix(targetUnit.titleAr || unitNameAr || 'وحدة', existingTitlesAr);
    const newTitleEn = getNextUnitNameWithSuffix(targetUnit.titleEn || unitNameEn || 'Unit', existingTitlesEn);

    let updatedDetails = targetUnit.details;
    if (targetUnit.details) {
      try {
        const parsed = JSON.parse(targetUnit.details);
        if (Array.isArray(parsed)) {
          const nextDetails = parsed.map((d: any) => {
            if (d.key === 'رقم الوحدة') {
              const existingUnitNamesAr = formData.subProperties.map(u => {
                try { return JSON.parse(u.details || '[]').find((x: any) => x.key === 'رقم الوحدة')?.value; } catch(_) { return ''; }
              }).filter(Boolean);
              return { ...d, value: getNextUnitNameWithSuffix(d.value || 'وحدة', existingUnitNamesAr) };
            }
            if (d.key === 'Unit Name') {
              const existingUnitNamesEn = formData.subProperties.map(u => {
                try { return JSON.parse(u.details || '[]').find((x: any) => x.key === 'Unit Name')?.value; } catch(_) { return ''; }
              }).filter(Boolean);
              return { ...d, value: getNextUnitNameWithSuffix(d.value || 'Unit', existingUnitNamesEn) };
            }
            return d;
          });
          updatedDetails = JSON.stringify(nextDetails);
        }
      } catch (_) {}
    }

    const duplicatedUnit = {
      ...targetUnit,
      id: undefined,
      titleAr: newTitleAr,
      titleEn: newTitleEn,
      details: updatedDetails
    };

    setFormData(prev => ({
      ...prev,
      subProperties: [...(prev.subProperties || []), duplicatedUnit]
    }));
    showSubmitMessage('success', language === 'ar' ? 'تم تكرار الوحدة بنجاح' : 'Unit duplicated successfully');
  };

  const handleDuplicateParentUnit = async (unit: Property) => {
    try {
      const res = await fetch(`/api/admin/properties/${unit.id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1 })
      });
      if (res.ok) {
        showSubmitMessage('success', language === 'ar' ? 'تم تكرار الوحدة بنجاح' : 'Unit duplicated successfully');
        if (selectedParentProperty) {
          fetchUnitsForParent(selectedParentProperty.id);
        }
        fetchProperties();
      } else {
        const errData = await res.json();
        showSubmitMessage('error', errData.error || (language === 'ar' ? 'فشل تكرار الوحدة' : 'Failed to duplicate unit'));
      }
    } catch (err) {
      console.error(err);
      showSubmitMessage('error', language === 'ar' ? 'حدث خطأ أثناء تكرار الوحدة' : 'Error duplicating unit');
    }
  };

  const handleSaveUnit = async () => {
    const titleAr = unitFormData.titleAr || unitFormData.unitNameAr;
    const titleEn = unitFormData.titleEn || unitFormData.unitNameEn || titleAr;
    if (!unitFormData.unitNameAr) {
      await showAlert(language === 'ar' ? 'الرجاء إدخال اسم/رقم الوحدة بالعربية' : 'Please enter the unit name/number in Arabic.');
      return;
    }
    const detailsArray = [];
    if (unitFormData.rooms) detailsArray.push({ key: language === 'ar' ? 'عدد الغرف' : 'Rooms Count', value: unitFormData.rooms });
    if (unitFormData.bathrooms) detailsArray.push({ key: language === 'ar' ? 'دورات المياه' : 'Bathrooms', value: unitFormData.bathrooms });
    if (unitFormData.floor) detailsArray.push({ key: language === 'ar' ? 'الدور' : 'Floor', value: unitFormData.floor });
    if (unitFormData.unitNameAr) detailsArray.push({ key: 'رقم الوحدة', value: unitFormData.unitNameAr });
    if (unitFormData.unitNameEn) detailsArray.push({ key: 'Unit Name', value: unitFormData.unitNameEn });

    const newUnit = {
      id: unitFormData.id || undefined,
      titleAr: titleAr,
      titleEn: titleEn,
      type: unitFormData.type,
      propertyCategory: unitFormData.propertyCategory,
      price: Number(unitFormData.price) || 0,
      area: Number(unitFormData.area) || 0,
      status: unitFormData.status,
      description: unitFormData.description,
      details: JSON.stringify(detailsArray),
      imageUrls: unitFormData.imageUrls || '[]'
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

  const handleAddFloor = () => {
    if (!newFloorInput.trim()) return;
    const flr = newFloorInput.trim();
    if (!buildingFloors.includes(flr)) {
      setBuildingFloors(prev => [...prev, flr]);
    }
    setNewFloorInput('');
  };

  const handleRemoveFloor = (index: number) => {
    setBuildingFloors(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleEditClick = async (property: Property) => {
    try {
      const res = await fetch(`/api/admin/properties/${property.id}`);
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
          initialDetailsList = arr.map((item: any) => ({ id: Math.random().toString(), key: item.key, value: item.value, icon: item.icon || '' }));
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

      let initialFloors: string[] = [];
      try {
        if (propData.details) {
          const arr = typeof propData.details === 'string' ? JSON.parse(propData.details) : propData.details;
          const floorsDetail = arr.find((item: any) => item.key === 'أدوار المبنى' || item.key === 'Building Floors');
          if (floorsDetail) {
            initialFloors = floorsDetail.value.split(',').map((f: string) => f.trim()).filter(Boolean);
          }
        }
      } catch (e) {
        // ignore
      }
      setBuildingFloors(initialFloors);

      let parsedAttachments = [];
      try {
        if (propData.attachments) {
          parsedAttachments = typeof propData.attachments === 'string'
            ? JSON.parse(propData.attachments)
            : propData.attachments;
        }
      } catch (e) {
        // ignore
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
        vatExempt: propData.vatExempt || false,
        vatNotApplicable: propData.vatNotApplicable || false,
        allowedPaymentPlans: parsedPaymentPlans,
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
        videoUrl: propData.videoUrl || '',
        parentId: propData.parentId || '',
        status: propData.status || 'PUBLISHED',
        subProperties: propData.subProperties || [],
        attachments: parsedAttachments
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
        techhubSandboxMode,
        verifyKitEnabled,
        verifyKitAppKey,
        verifyKitDomain,
        verifyKitDeeplink,
        authenticaEnabled,
        authenticaApiKey,
        authenticaMethod,
        authenticaTemplateId
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
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties(properties.filter(p => p.id !== id));
        setSelectedParentUnits(prev => prev.filter(p => p.id !== id));
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
        
        {/* Navigation Tabs */}
        <div className="inline-flex items-center justify-start rounded-xl bg-card border border-border p-1 text-muted-foreground mb-8 overflow-x-auto select-none scrollbar-none gap-1 w-max max-w-full">
          {hasTabPermission('manage', userRole) && (
            <button 
              onClick={() => handleTabChange('manage')}
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
              onClick={() => handleTabChange('projects')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'إدارة المشاريع' : 'Manage Projects'}
            </button>
          )}
          {hasTabPermission('renters', userRole) && (
            <button 
              onClick={() => handleTabChange('renters')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'renters' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'المستأجرين' : 'Renters'}
            </button>
          )}

          {hasTabPermission('maintenance', userRole) && (
            <button 
              onClick={() => handleTabChange('maintenance')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'maintenance' 
                  ? 'bg-primary text-primary-foreground shadow-xs font-bold' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {language === 'ar' ? 'بلاغات الصيانة' : 'Maintenance Reports'}
            </button>
          )}
          {hasTabPermission('analytics', userRole) && (
            <button 
              onClick={() => handleTabChange('analytics')}
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
              onClick={() => handleTabChange('callbacks')}
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
              onClick={() => handleTabChange('users')}
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
              onClick={() => handleTabChange('logs')}
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
              onClick={() => handleTabChange('settings')}
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
            {activeTab === 'renters' && <AdminRenters />}
            {activeTab === 'maintenance' && <AdminMaintenance />}

            {activeTab === 'manage' && (
          <div className="min-h-[500px] space-y-6">
            {/* Standard Admin Header Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                    {showAddForm 
                      ? (editingId ? (language === 'ar' ? 'تعديل العقار' : 'Edit Property') : (selectedParentProperty ? (language === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Unit') : t('admin.addProperty'))) 
                      : (selectedParentProperty 
                          ? (language === 'ar' ? `إدارة وحدات: ${selectedParentProperty.titleAr}` : `Manage Units of: ${selectedParentProperty.titleEn}`)
                          : t('admin.propertiesList'))}
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {language === 'ar' ? 'إدارة المباني والعقارات، إضافة الوحدات وتحديد حالات الإيجار والمستأجرين' : 'Manage buildings and properties, add units, set rental statuses and renters'}
                  </p>
                </div>
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
                  className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs ${
                    showAddForm 
                      ? 'border border-border bg-card text-foreground hover:bg-muted' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {showAddForm ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                  <span>
                    {showAddForm 
                      ? (language === 'ar' ? 'إلغاء' : 'Cancel') 
                      : (selectedParentProperty ? (language === 'ar' ? 'إضافة وحدة' : 'Add Unit') : t('admin.addProperty'))}
                  </span>
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/60 backdrop-blur-xs hover:bg-muted border border-border/80 px-4 py-2 rounded-full shadow-xs active:scale-[0.97]"
                      >
                        {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5 text-primary" /> : <ArrowLeft className="w-3.5 h-3.5 text-primary" />}
                        <span>{language === 'ar' ? 'العودة لقائمة العقارات' : 'Back to Listings'}</span>
                      </button>
                      <div className="h-6 w-px bg-border"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-foreground">
                            {language === 'ar' ? selectedParentProperty.titleAr : selectedParentProperty.titleEn}
                          </h3>
                          {(selectedParentProperty.renterName || selectedParentProperty.status === 'RENTED' || (selectedParentUnits.length > 0 && selectedParentUnits.every(u => u.status === 'RENTED' || !!u.renterName))) ? (
                            <span className="property-tag-amber">
                              {language === 'ar' ? 'مؤجر' : 'Rented'}
                            </span>
                          ) : selectedParentProperty.status === 'SOLD' ? (
                            <span className="property-tag-rose">
                              {language === 'ar' ? 'مباع' : 'Sold'}
                            </span>
                          ) : selectedParentProperty.type === 'SALE' ? (
                            <span className="property-tag-indigo">
                              {language === 'ar' ? 'للبيع' : 'For Sale'}
                            </span>
                          ) : (
                            <span className="property-tag font-bold">
                              {language === 'ar' ? 'للإيجار' : 'For Rent'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                          {language === 'ar' 
                            ? `فئة العقار: ${t(`cat.${typeof selectedParentProperty?.propertyCategory === 'string' ? selectedParentProperty.propertyCategory : 'VILLA'}`)} • النوع: ${selectedParentProperty.type === 'SALE' ? 'للبيع' : 'للإيجار'}`
                            : `Category: ${t(`cat.${typeof selectedParentProperty?.propertyCategory === 'string' ? selectedParentProperty.propertyCategory : 'VILLA'}`)} • Type: ${selectedParentProperty.type === 'SALE' ? 'For Sale' : 'For Rent'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedParentProperty.renterName ? (
                        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg text-xs font-bold text-primary">
                          <span>{selectedParentProperty.renterName}</span>
                          <button
                            type="button"
                            onClick={() => handleUnassignRenterFromPropertyUnit(selectedParentProperty)}
                            className="text-red-400 hover:text-red-500 p-0.5 rounded transition-colors cursor-pointer"
                            title={language === 'ar' ? 'إلغاء تعيين المستأجر' : 'Unassign Renter'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenAssignRenterModal(selectedParentProperty)}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap h-9"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'تعيين مستأجر' : 'Assign Renter'}</span>
                        </button>
                      )}

                      <CustomSelect
                        value={selectedParentProperty.status || 'PUBLISHED'}
                        onChange={async (newStatus) => {
                          try {
                            const updateRes = await fetch(`/api/admin/properties/${selectedParentProperty.id}`, {
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
                        options={[
                          { value: 'PUBLISHED', label: language === 'ar' ? 'متاح (منشور)' : 'Available (Published)' },
                          ...(selectedParentProperty.type === 'SALE'
                            ? [{ value: 'SOLD', label: language === 'ar' ? 'مباع (مخفي من صفحة العرض)' : 'Sold (Hidden from Listings)' }]
                            : [{ value: 'RENTED', label: language === 'ar' ? 'مؤجر (مخفي من صفحة العرض)' : 'Rented (Hidden from Listings)' }])
                        ]}
                      />
                      <button
                        type="button"
                        onClick={() => handleDuplicateParentUnit(selectedParentProperty)}
                        className="p-2 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 rounded-lg border border-border bg-background cursor-pointer transition-all inline-flex items-center justify-center h-9 w-9"
                        title={language === 'ar' ? 'تكرار العقار' : 'Duplicate Property'}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
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
                              const res = await fetch(`/api/admin/properties/${selectedParentProperty.id}`, { method: 'DELETE' });
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

                  <div className="flex border-b border-border gap-2 select-none mb-4">
                    <button
                      type="button"
                      onClick={() => setBuildingDetailSubTab('units')}
                      className={`px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                        buildingDetailSubTab === 'units' ? 'border-b-2 border-primary text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {language === 'ar' ? 'وحدات العقار' : 'Property Units'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setBuildingDetailSubTab('maintenance')}
                      className={`px-4 py-2 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        buildingDetailSubTab === 'maintenance' ? 'border-b-2 border-primary text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تذاكر صيانة المبنى والوحدات' : 'Building Maintenance Requests'}</span>
                    </button>
                  </div>

                  {buildingDetailSubTab === 'maintenance' ? (
                    <div className="animate-in fade-in duration-300">
                      <AdminMaintenance buildingIdFilter={selectedParentProperty.id} />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Floors definitions editor */}
                      <div className="bg-card border border-border p-5 rounded-xl space-y-4 shadow-xs animate-in fade-in">
                        <div>
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-primary" />
                            <span>{language === 'ar' ? 'طوابق وأدوار المبنى' : 'Building Floors'}</span>
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {language === 'ar' 
                              ? 'قم بإضافة أدوار المبنى هنا أولاً لتتمكن من اختيارها عند إضافة أو تعديل وحدات هذا المبنى' 
                              : 'Add building floors here first to select them when adding or editing units of this building'}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFloorInput}
                            onChange={(e) => setNewFloorInput(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: الدور 1، الدور 2، الدور الأرضي' : 'e.g. Floor 1, Floor 2, Ground Floor'}
                            className="cn-input text-xs h-9 flex-1 bg-background"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFloorToParent();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddFloorToParent}
                            className="btn-primary text-xs h-9 px-4 gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            <span>{language === 'ar' ? 'إضافة دور' : 'Add Floor'}</span>
                          </button>
                        </div>

                        {parentFloors.length > 0 ? (
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {parentFloors.map((flr, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center gap-1 bg-muted border border-border/80 px-2.5 py-1 rounded-lg text-xs font-bold text-foreground select-none"
                              >
                                <span>{flr}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFloorFromParent(idx)}
                                  className="text-muted-foreground hover:text-red-500 rounded p-0.5 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted-foreground italic">
                            {language === 'ar' 
                              ? 'لم يتم إضافة أدوار بعد. يرجى إضافة الأدوار لتصنيف وحدات المبنى.' 
                              : 'No floors defined yet. Please add floors to classify the units.'}
                          </p>
                        )}
                      </div>

                      {loadingUnits ? (
                        <div className="flex justify-center items-center py-20 animate-in fade-in">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                      ) : selectedParentUnits.length === 0 ? (
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
                                <th className="p-3 font-bold">{language === 'ar' ? 'المستأجر' : 'Renter'}</th>
                                <th className="p-3 font-bold text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                <th className="p-3 font-bold text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60 text-foreground">
                              {selectedParentUnits.map((unit, index) => {
                                return (
                                  <tr key={unit.id} className="hover:bg-muted/30 transition-colors">
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
                                    <td className="p-3">
                                      {unit.renterName ? (
                                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                                          <User className="w-3.5 h-3.5" />
                                          <div className="text-right rtl:text-right ltr:text-left">
                                            <p className="leading-tight">{unit.renterName}</p>
                                            {unit.renterPhone && <p className="text-[9px] font-mono opacity-80 leading-none mt-0.5" dir="ltr">{unit.renterPhone}</p>}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleUnassignRenterFromPropertyUnit(unit)}
                                            className="text-red-400 hover:text-red-500 p-0.5 ml-1 rounded transition-colors cursor-pointer"
                                            title={language === 'ar' ? 'إلغاء تعيين المستأجر' : 'Unassign Renter'}
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenAssignRenterModal(unit)}
                                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                        >
                                          <UserPlus className="w-3.5 h-3.5" />
                                          <span>{language === 'ar' ? 'تعيين مستأجر' : 'Assign Renter'}</span>
                                        </button>
                                      )}
                                    </td>
                                    <td className="p-3 text-center">
                                      <select
                                        value={unit.status || 'PUBLISHED'}
                                        onChange={async (e) => {
                                          const newStatus = e.target.value;
                                          try {
                                            const updateRes = await fetch(`/api/admin/properties/${unit.id}`, {
                                              method: 'PUT',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ ...unit, status: newStatus })
                                            });
                                            if (updateRes.ok) {
                                              fetchUnitsForParent(selectedParentProperty.id);
                                            }
                                          } catch (err) {
                                            console.error("Failed to update unit status:", err);
                                          }
                                        }}
                                        className="bg-background border border-border text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-bold text-foreground"
                                      >
                                        <option value="PUBLISHED">{language === 'ar' ? 'متاح' : 'Available'}</option>
                                        {selectedParentProperty?.type === 'SALE' || unit.type === 'SALE'
                                          ? <option value="SOLD">{language === 'ar' ? 'مباع' : 'Sold'}</option>
                                          : <option value="RENTED">{language === 'ar' ? 'مؤجر' : 'Rented'}</option>
                                        }
                                      </select>
                                    </td>
                                    <td className="p-3 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button type="button" onClick={() => handleDuplicateParentUnit(unit)} className="p-1.5 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center" title={language === 'ar' ? 'تكرار الوحدة (_1, _2)' : 'Duplicate Unit (_1, _2)'}><Copy className="w-3.5 h-3.5" /></button>
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
                      )}
                    </div>
                  )}

                  {selectedParentTab === 'renters' && (
                    <div className="animate-in fade-in duration-300">
                      <AdminRenters />
                    </div>
                  )}

                  {selectedParentTab === 'details' && (
                    <div className="animate-in fade-in duration-300 p-6 bg-card border border-border rounded-2xl">
                      <h4 className="font-bold text-lg text-foreground mb-2">{selectedParentProperty?.titleAr}</h4>
                      <p className="text-xs text-muted-foreground">{selectedParentProperty?.description}</p>
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
                        <th className="p-4 font-bold">{language === 'ar' ? 'اسم العقار / المبنى' : 'Title (Ar/En)'}</th>
                        <th className="p-4 font-bold text-center">{language === 'ar' ? 'النوع والحالة' : 'Type & Status'}</th>
                        <th className="p-4 font-bold">{language === 'ar' ? 'الوحدات / السعر' : 'Units / Price'}</th>
                        <th className="p-4 font-bold text-center">{language === 'ar' ? 'المستأجر' : 'Renter'}</th>
                        <th className="p-4 font-bold text-center ltr:rounded-tr-xl rtl:rounded-tl-xl">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.filter(p => !p.parentId).map((property, index) => {
                        const isExpanded = !!expandedParents[property.id];
                        const subUnits = properties
                          .filter(p => p.parentId === property.id)
                          .sort((a, b) => {
                            const getUnitName = (item: any) => {
                              let uName = '';
                              try {
                                const parsed = typeof item.details === 'string' ? JSON.parse(item.details || '[]') : item.details;
                                if (Array.isArray(parsed)) {
                                  const match = parsed.find((d: any) => d.key === 'رقم الوحدة' || d.key === 'Unit Name' || d.key === 'unit number' || d.key === 'unit');
                                  if (match?.value) uName = String(match.value);
                                }
                              } catch (_) {}
                              const title = (item.titleAr || item.titleEn || '').trim();
                              const hasUnitInTitle = uName ? title.toLowerCase().includes(uName.toLowerCase()) : false;
                              return (uName && !hasUnitInTitle ? `${uName} ${title}` : title).trim();
                            };
                            const keyA = getUnitName(a);
                            const keyB = getUnitName(b);
                            return keyA.localeCompare(keyB, undefined, { numeric: true, sensitivity: 'base' });
                          });
                        const isPropertyRented = property.status === 'RENTED' || !!property.renterName || (subUnits.length > 0 && subUnits.every(u => u.status === 'RENTED' || !!u.renterName));
                        const isPropertySold = property.status === 'SOLD';

                        return (
                          <React.Fragment key={property.id}>
                            <tr className="border-b border-border hover:bg-muted/40 transition-colors">
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
                                </div>
                                <p className="text-[10px] text-muted-foreground font-sans mt-0.5" dir="ltr">{property.titleEn}</p>
                              </td>
                              <td className="p-4 text-center">
                                {isPropertyRented ? (
                                  <span className="property-tag-amber">
                                    {language === 'ar' ? 'مؤجر' : 'Rented'}
                                  </span>
                                ) : isPropertySold ? (
                                  <span className="property-tag-rose">
                                    {language === 'ar' ? 'مباع' : 'Sold'}
                                  </span>
                                ) : property.type === 'SALE' ? (
                                  <span className="property-tag-indigo">
                                    {language === 'ar' ? 'للبيع' : 'For Sale'}
                                  </span>
                                ) : (
                                  <span className="property-tag">
                                    {language === 'ar' ? 'للإيجار' : 'For Rent'}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 font-semibold text-xs text-foreground font-mono">
                                {subUnits.length > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedParentProperty(property)}
                                    className="inline-flex items-center gap-1.5 text-primary text-[11px] font-bold bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full hover:bg-primary/15 transition-all cursor-pointer font-sans"
                                  >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>
                                      {language === 'ar' ? `عرض وإدارة الوحدات (${subUnits.length})` : `Manage Units (${subUnits.length})`}
                                    </span>
                                  </button>
                                ) : property.price > 0 ? (
                                  <span className="font-semibold text-xs text-foreground font-mono inline-flex items-center gap-1">
                                    {property.price.toLocaleString()} <SrIcon className="w-4 h-4 text-muted-foreground" />
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedParentProperty(property)}
                                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-[11px] font-bold bg-muted/50 border border-border px-2.5 py-1 rounded-full hover:bg-primary/10 hover:border-primary/20 transition-all cursor-pointer font-sans"
                                  >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>
                                      {language === 'ar' ? 'عرض وإدارة الوحدات (0)' : 'Manage Units (0)'}
                                    </span>
                                  </button>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                {property.renterName ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <div className="text-right rtl:text-right ltr:text-left">
                                      <p className="leading-tight text-xs font-bold text-foreground">{property.renterName}</p>
                                      {property.renterPhone && <p className="text-[9px] font-mono opacity-80 leading-none mt-0.5" dir="ltr">{property.renterPhone}</p>}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleUnassignRenterFromPropertyUnit(property)}
                                      className="text-red-400 hover:text-red-500 p-0.5 ml-1 rounded transition-colors cursor-pointer"
                                      title={language === 'ar' ? 'إلغاء تعيين المستأجر' : 'Unassign Renter'}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAssignRenterModal(property)}
                                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                                  >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>{language === 'ar' ? 'تعيين مستأجر' : 'Assign Renter'}</span>
                                  </button>
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
                                    type="button"
                                    onClick={() => handleDuplicateParentUnit(property)}
                                    className="p-2 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                    title={language === 'ar' ? 'تكرار العقار' : 'Duplicate Property'}
                                  >
                                    <Copy className="w-4 h-4" />
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
                              <tr className="bg-muted/20">
                                <td colSpan={6} className="px-8 py-3">
                                  <div className="border border-border rounded-xl overflow-hidden shadow-xs bg-card/40">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="bg-muted/50 border-b border-border text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'اسم الوحدة' : 'Unit Title'}</th>
                                            <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'الفئة' : 'Category'}</th>
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'السعر' : 'Price'}</th>
                                          <th className="p-2.5 ltr:text-left rtl:text-right font-bold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                                          <th className="p-2.5 text-center font-bold">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border/65">
                                        {subUnits.map(unit => (
                                          <tr key={unit.id} className="hover:bg-muted/30 transition-colors">
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
                                                    const updateRes = await fetch(`/api/admin/properties/${unit.id}`, {
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
                                                 {property.type === 'SALE'
                                                   ? <option value="SOLD">{language === 'ar' ? 'مباع' : 'Sold'}</option>
                                                   : <option value="RENTED">{language === 'ar' ? 'مؤجر' : 'Rented'}</option>
                                                 }
                                                                                               </select>
                                            </td>
                                            <td className="p-2.5 text-center">
                                              <div className="flex items-center justify-center gap-1.5">
                                         <button
                                           type="button"
                                           onClick={() => handleDuplicateParentUnit(unit)}
                                           className="p-1.5 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center"
                                           title={language === 'ar' ? 'تكرار الوحدة (_1, _2)' : 'Duplicate Unit (_1, _2)'}
                                         >
                                           <Copy className="w-3.5 h-3.5" />
                                         </button>
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
                          <CustomSelect
                            value={formData.type}
                            onChange={(val) => setFormData({ ...formData, type: val })}
                            options={[
                              { value: 'SALE', label: t('common.sale') },
                              { value: 'RENT', label: t('common.rent') }
                            ]}
                          />
                        </div>

                        <div>
                          <label className="cn-label mb-2">{language === 'ar' ? 'حالة الظهور والإتاحة' : 'Listing Status'}</label>
                          <CustomSelect
                            value={formData.status || 'PUBLISHED'}
                            onChange={(val) => setFormData({ ...formData, status: val })}
                            options={[
                              { value: 'PUBLISHED', label: language === 'ar' ? 'متاح / منشور (يظهر للجميع)' : 'Available / Published (Public)' },
                              ...((formData.type === 'SALE' || !formData.parentId)
                                ? [{ value: 'SOLD', label: language === 'ar' ? 'مباع (يخفى تلقائياً من صفحة العرض)' : 'Sold (Auto-hidden from Sales)' }]
                                : [{ value: 'RENTED', label: language === 'ar' ? 'مؤجر (يخفى تلقائياً من صفحة العرض)' : 'Rented (Auto-hidden from Sales)' }])
                            ]}
                          />
                        </div>

                        <div>
                          <label className="cn-label mb-2">{t('admin.placeholder.category')}</label>
                          <CustomSelect
                            value={formData.propertyCategory}
                            onChange={(val) => setFormData({ ...formData, propertyCategory: val })}
                            options={[
                              { value: 'VILLA', label: t('cat.VILLA') },
                              { value: 'APARTMENT', label: t('cat.APARTMENT') },
                              { value: 'COMPOUND', label: t('cat.COMPOUND') },
                              { value: 'TOWER', label: t('cat.TOWER') },
                              { value: 'BUILDING', label: t('cat.BUILDING') },
                              { value: 'MALL', label: t('cat.MALL') },
                              { value: 'SHOP', label: t('cat.SHOP') },
                              { value: 'OFFICE', label: t('cat.OFFICE') },
                              { value: 'RESORT', label: t('cat.RESORT') },
                              { value: 'HOTEL', label: t('cat.HOTEL') },
                              { value: 'HOSPITAL', label: t('cat.HOSPITAL') },
                              { value: 'WAREHOUSE', label: t('cat.WAREHOUSE') },
                              { value: 'FARM', label: t('cat.FARM') },
                              { value: 'LAND', label: t('cat.LAND') },
                              { value: 'ROOM', label: t('cat.ROOM') }
                            ]}
                          />
                        </div>



                        <div>
                          <label className="cn-label mb-2">{t('admin.placeholder.area')}</label>
                          <input required type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} className="cn-input" placeholder="150" />
                        </div>

                        <div>
                          <label className="cn-label mb-2">{t('admin.placeholder.propertyAge')}</label>
                          <input type="number" value={formData.propertyAge} onChange={(e) => setFormData({ ...formData, propertyAge: e.target.value })} className="cn-input" placeholder="0" />
                        </div>

                        {formData.parentId && (
                          <>
                            <div className="md:col-span-2">
                              <label className="cn-label mb-2">{language === 'ar' ? 'رقم / اسم الوحدة الداخلي' : 'Internal Unit Name/Number'}</label>
                              <input
                                required
                                type="text"
                                value={formData.detailsList.find(d => d.key === 'رقم الوحدة' || d.key === 'Unit Name')?.value || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData(prev => {
                                    const newList = [...prev.detailsList];
                                    const idxAr = newList.findIndex(d => d.key === 'رقم الوحدة');
                                    const oldValAr = idxAr > -1 ? newList[idxAr].value : '';
                                    if (idxAr > -1) {
                                      newList[idxAr] = { ...newList[idxAr], value: val };
                                    } else {
                                      newList.push({ id: Math.random().toString(), key: 'رقم الوحدة', value: val });
                                    }

                                    const idxEn = newList.findIndex(d => d.key === 'Unit Name');
                                    if (idxEn > -1) {
                                      newList[idxEn] = { ...newList[idxEn], value: val };
                                    } else {
                                      newList.push({ id: Math.random().toString(), key: 'Unit Name', value: val });
                                    }

                                    const syncTitleAr = !prev.titleAr || prev.titleAr === oldValAr;
                                    const syncTitleEn = !prev.titleEn || prev.titleEn === oldValAr;
                                    return { 
                                      ...prev, 
                                      detailsList: newList,
                                      titleAr: syncTitleAr ? val : prev.titleAr,
                                      titleEn: syncTitleEn ? val : prev.titleEn
                                    };
                                  });
                                }}
                                className="cn-input"
                                placeholder={language === 'ar' ? 'مثال: شقة 101' : 'e.g. Apt 101'}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="cn-label mb-2">{language === 'ar' ? 'الدور' : 'Floor'}</label>
                              {parentFloors.length > 0 ? (
                                <select
                                  value={formData.detailsList.find(d => d.key === 'الدور' || d.key === 'Floor')?.value || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData(prev => {
                                      const newList = [...prev.detailsList];
                                      const keyName = language === 'ar' ? 'الدور' : 'Floor';
                                      const idx = newList.findIndex(d => d.key === 'الدور' || d.key === 'Floor');
                                      if (idx > -1) {
                                        newList[idx] = { ...newList[idx], value: val };
                                      } else {
                                        newList.push({ id: Math.random().toString(), key: keyName, value: val });
                                      }
                                      return { ...prev, detailsList: newList };
                                    });
                                  }}
                                  className="cn-input"
                                >
                                  <option value="">{language === 'ar' ? 'اختر الدور' : 'Select Floor'}</option>
                                  {parentFloors.map((flr) => (
                                    <option key={flr} value={flr}>{flr}</option>
                                  ))}
                                </select>
                              ) : (
                                <div className="text-xs text-muted-foreground p-3 border border-dashed border-border rounded-xl bg-muted/20">
                                  {language === 'ar' 
                                    ? 'لا توجد أدوار محددة في صفحة إدارة وحدات هذا المبنى. يرجى إضافة أدوار هناك أولاً لتتمكن من اختيارها.' 
                                    : 'No floors defined on this parent property\'s Manage Units page. Please add floors there first to select them.'}
                                </div>
                              )}
                            </div>
                          </>
                        )}
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
                            <input required type="text" inputMode="decimal" value={formatNumberWithCommas(formData.price)} onChange={(e) => setFormData({ ...formData, price: sanitizeNumericInput(e.target.value) })} className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground" placeholder="2,500,000" />
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
                                      type="text" 
                                      inputMode="decimal"
                                      value={formatNumberWithCommas(formData.electricityCostVal)} 
                                      onChange={(e) => setFormData({ ...formData, electricityCostVal: sanitizeNumericInput(e.target.value) })} 
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
                                      type="text" 
                                      inputMode="decimal"
                                      value={formatNumberWithCommas(formData.waterCostVal)} 
                                      onChange={(e) => setFormData({ ...formData, waterCostVal: sanitizeNumericInput(e.target.value) })} 
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
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setFormData({ 
                                  ...formData, 
                                  vatExempt: !formData.vatExempt,
                                  vatNotApplicable: false,
                                  vat: !formData.vatExempt ? '0' : formData.vat 
                                })}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${formData.vatExempt ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-muted text-muted-foreground border border-border hover:bg-gray-200'}`}
                              >
                                {formData.vatExempt ? (language === 'ar' ? 'معفى من الضريبة ✓' : 'VAT Exempt ✓') : (language === 'ar' ? 'معفى؟' : 'Exempt?')}
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ 
                                  ...formData, 
                                  vatNotApplicable: !formData.vatNotApplicable,
                                  vatExempt: false,
                                  vat: !formData.vatNotApplicable ? '0' : formData.vat 
                                })}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${formData.vatNotApplicable ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-muted text-muted-foreground border border-border hover:bg-gray-200'}`}
                              >
                                {formData.vatNotApplicable ? (language === 'ar' ? 'غير مشمول ✓' : 'Not Applicable ✓') : (language === 'ar' ? 'غير مشمول؟' : 'Not Applicable?')}
                              </button>
                            </div>
                          </div>
                          <div className="relative flex shadow-sm rounded-xl overflow-hidden border border-border bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                            <div className="flex bg-muted items-center justify-center px-4 border-r border-border ltr:border-r rtl:border-l">
                              <span className="text-muted-foreground font-bold">{t('common.currency')}</span>
                            </div>
                            <input 
                              type="text" 
                              inputMode="decimal"
                              disabled={formData.vatExempt || formData.vatNotApplicable}
                              value={(formData.vatExempt || formData.vatNotApplicable) ? '0' : formatNumberWithCommas(formData.vat)} 
                              onChange={(e) => setFormData({ ...formData, vat: sanitizeNumericInput(e.target.value) })} 
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
                            <input type="text" inputMode="decimal" value={formatNumberWithCommas(formData.commission)} onChange={(e) => setFormData({ ...formData, commission: sanitizeNumericInput(e.target.value) })} className="flex-1 w-full p-3 outline-none min-w-0 bg-transparent text-foreground" placeholder="0" />
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
                                  const key = language === 'ar' ? pd.keyAr : pd.keyEn;
                                  let defaultIcon = '';
                                  const lowerKey = key.toLowerCase();
                                  if (lowerKey.includes('واجهة') || lowerKey.includes('facade')) defaultIcon = 'Compass';
                                  else if (lowerKey.includes('شارع') || lowerKey.includes('street')) defaultIcon = 'Ruler';
                                  else if (lowerKey.includes('غرف') || lowerKey.includes('room')) defaultIcon = 'DoorOpen';
                                  else if (lowerKey.includes('صالة') || lowerKey.includes('hall')) defaultIcon = 'Armchair';
                                  else if (lowerKey.includes('حمام') || lowerKey.includes('bathroom') || lowerKey.includes('مياه')) defaultIcon = 'Bath';
                                  else if (lowerKey.includes('ضمان') || lowerKey.includes('warrant')) defaultIcon = 'CheckCircle';
                                  else if (lowerKey.includes('تاريخ') || lowerKey.includes('date') || lowerKey.includes('تسليم')) defaultIcon = 'Calendar';
                                  else if (lowerKey.includes('دور') || lowerKey.includes('floor')) defaultIcon = 'Layers';
                                  else if (lowerKey.includes('موقف') || lowerKey.includes('parking')) defaultIcon = 'Car';
                                  else if (lowerKey.includes('مصعد') || lowerKey.includes('elevator')) defaultIcon = 'ArrowUpCircle';
                                  else if (lowerKey.includes('وحد') || lowerKey.includes('unit')) defaultIcon = 'Building2';
                                  else if (lowerKey.includes('مساح') || lowerKey.includes('area')) defaultIcon = 'Maximize2';

                                  setFormData({ 
                                    ...formData, 
                                    detailsList: [...formData.detailsList, { id: Math.random().toString(), key, value: '', icon: defaultIcon }] 
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
                            <div className="flex gap-3 px-1 text-xs font-semibold text-muted-foreground w-full select-none">
                              <div className="w-10 shrink-0 text-center">{language === 'ar' ? 'رمز' : 'Icon'}</div>
                              <div className="flex-1">{language === 'ar' ? 'الخاصية / التفصيل' : 'Property / Detail'}</div>
                              <div className="flex-1">{language === 'ar' ? 'القيمة' : 'Value'}</div>
                              <div className="w-11 shrink-0"></div>
                            </div>
                          )}
                           {formData.detailsList
                            .filter(detail => detail.key !== 'الدور' && detail.key !== 'Floor' && detail.key !== 'رقم الوحدة' && detail.key !== 'Unit Name')
                            .map((detail) => {
                              const idx = formData.detailsList.findIndex(d => d.id === detail.id);
                              return (
                                <div key={detail.id} className="flex gap-3 items-center relative group w-full">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDetailId(detail.id);
                                      setIconSearchQuery('');
                                      setShowIconPicker(true);
                                    }}
                                    className="w-10 h-10 shrink-0 bg-background border border-border rounded-xl flex items-center justify-center text-primary hover:bg-muted transition cursor-pointer hover:border-primary/50 shadow-xs"
                                    title={language === 'ar' ? 'اختر أيقونة' : 'Choose Icon'}
                                  >
                                    {renderIcon(detail.icon, detail.key)}
                                  </button>
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
                                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition shrink-0 cursor-pointer"
                                  >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              );
                            })}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, detailsList: [...formData.detailsList, { id: Math.random().toString(), key: '', value: '', icon: '' }] })}
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
                            {isUploadingImages 
                              ? (language === 'ar' 
                                  ? `جاري رفع ومعالجة الصور... ${imageUploadProgress !== null ? `${imageUploadProgress}%` : ''}` 
                                  : `Uploading & Processing Media... ${imageUploadProgress !== null ? `${imageUploadProgress}%` : ''}`) 
                              : (language === 'ar' ? 'اسحب وأفلت الصور ومقاطع الفيديو هنا، أو اضغط للتصفح' : 'Drag & drop images and videos here, or click to browse')}
                          </span>
                        </label>
                      </div>
                      
                      {formData.imageUrls.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {formData.imageUrls.map((url, i) => {
                            const isVideo = url && (url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm') || url.endsWith('.avi'));
                            const isRtl = language === 'ar';
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
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => removeImage(i)}
                                      className="p-2 rounded-xl bg-red-500/80 hover:bg-red-600 text-white transition-all transform hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                                      title={language === 'ar' ? 'حذف' : 'Delete'}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
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

                      {/* Documents Upload Section */}
                      <div className="mt-10 border-t border-border pt-8">
                        <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span>{language === 'ar' ? 'الملفات والمرفقات (بروشور، مخططات، رخص)' : 'Documents & Attachments (Brochure, Plans, Licenses)'}</span>
                        </h4>
                        
                        <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isUploadingDocs ? 'border-border bg-muted cursor-not-allowed' : 'border-primary/30 bg-card hover:bg-muted'}`}>
                          <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleDocumentUpload} className="hidden" id="doc-upload" disabled={isUploadingDocs} />
                          <label htmlFor="doc-upload" className={`flex flex-col items-center ${isUploadingDocs ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            {isUploadingDocs ? (
                              <Loader2 className="w-10 h-10 text-indigo-500 mb-3 animate-spin" />
                            ) : (
                              <Upload className="w-10 h-10 text-gray-400 mb-3" />
                            )}
                            
                            <span className="font-bold text-sm text-muted-foreground">
                              {isUploadingDocs 
                                ? (language === 'ar' 
                                    ? `جاري رفع المستندات... ${docUploadProgress !== null ? `${docUploadProgress}%` : ''}` 
                                    : `Uploading Documents... ${docUploadProgress !== null ? `${docUploadProgress}%` : ''}`) 
                                : (language === 'ar' ? 'اضغط لرفع ملفات PDF أو مستندات العقار' : 'Click to upload PDF or property documents')}
                            </span>
                          </label>
                        </div>

                        {formData.attachments && formData.attachments.length > 0 && (
                          <div className="mt-4 space-y-2.5">
                            {formData.attachments.map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="text-right rtl:text-right ltr:text-left">
                                    <p className="text-xs font-bold text-foreground">
                                      {doc.name}
                                    </p>
                                    {doc.size && (
                                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                                        {(doc.size / (1024 * 1024)).toFixed(2)} MB
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(idx)}
                                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                  title={language === 'ar' ? 'حذف' : 'Delete'}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
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

                        {/* Building Floors Manager */}
                        <div className="bg-muted/35 border border-border p-4 rounded-xl space-y-4 mb-6">
                          <div>
                            <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                              <Building2 className="w-4 h-4 text-primary" />
                              <span>{language === 'ar' ? 'تحديد طوابق وأدوار المبنى' : 'Define Building Floors'}</span>
                            </h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {language === 'ar' 
                                ? 'أضف أدوار المبنى هنا أولاً لتتمكن من اختيارها عند إضافة أو تعديل الوحدات' 
                                : 'Add building floors here first to select them when adding or editing units'}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFloorInput}
                              onChange={(e) => setNewFloorInput(e.target.value)}
                              placeholder={language === 'ar' ? 'مثال: الدور 1، الدور 2، الدور الأرضي' : 'e.g. Floor 1, Floor 2, Ground Floor'}
                              className="cn-input text-xs h-9 flex-1 bg-background"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddFloor();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddFloor}
                              className="btn-primary text-xs h-9 px-4 gap-1.5"
                            >
                              <Plus className="w-4 h-4" />
                              <span>{language === 'ar' ? 'إضافة دور' : 'Add Floor'}</span>
                            </button>
                          </div>

                          {buildingFloors.length > 0 ? (
                            <div className="flex flex-wrap gap-2 pt-1.5">
                              {buildingFloors.map((flr, idx) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center gap-1 bg-card border border-border/80 px-2.5 py-1 rounded-lg text-xs font-bold text-foreground select-none"
                                >
                                  <span>{flr}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFloor(idx)}
                                    className="text-muted-foreground hover:text-red-500 rounded p-0.5 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-muted-foreground italic">
                              {language === 'ar' 
                                ? 'لم يتم إضافة أدوار بعد. الرجاء إضافة الأدوار لتصنيف شقق ووحدات المبنى.' 
                                : 'No floors defined yet. Please add floors to classify the units.'}
                            </p>
                          )}
                        </div>
                        
                        {/* Units list */}
                        <div className="space-y-4">
                          {formData.subProperties && formData.subProperties.length > 0 ? (
                            <div className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-card/30">
                              {[...formData.subProperties]
                                .sort((a, b) => {
                                  const getUnitName = (item: any) => {
                                    let uName = '';
                                    try {
                                      const parsed = typeof item.details === 'string' ? JSON.parse(item.details || '[]') : item.details;
                                      if (Array.isArray(parsed)) {
                                        const match = parsed.find((d: any) => d.key === 'رقم الوحدة' || d.key === 'Unit Name' || d.key === 'unit number' || d.key === 'unit');
                                        if (match?.value) uName = String(match.value);
                                      }
                                    } catch (_) {}
                                    const title = (item.titleAr || item.titleEn || '').trim();
                                    const hasUnitInTitle = uName ? title.toLowerCase().includes(uName.toLowerCase()) : false;
                                    return (uName && !hasUnitInTitle ? `${uName} ${title}` : title).trim();
                                  };
                                  const keyA = getUnitName(a);
                                  const keyB = getUnitName(b);
                                  return keyA.localeCompare(keyB, undefined, { numeric: true, sensitivity: 'base' });
                                })
                                .map((unit, index) => {
                                let unitName = '';
                                try {
                                  const parsed = JSON.parse(unit.details || '[]');
                                  const match = parsed.find((d: any) => d.key === 'رقم الوحدة' || d.key === 'Unit Name');
                                  unitName = match ? match.value : '';
                                } catch (_) {}
                                return (
                                  <div key={index} className="p-4 flex items-center justify-between text-xs hover:bg-muted/40 transition-colors">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-black text-foreground">{language === 'ar' ? unit.titleAr : unit.titleEn}</span>
                                        {unitName && unitName !== unit.titleAr && unitName !== unit.titleEn && (
                                          <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            {unitName}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex gap-2.5 text-muted-foreground mt-1.5 text-[11px] font-semibold">
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
                                      <button type="button" onClick={() => handleDuplicateSubProperty(index)} className="p-1.5 text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 rounded-lg border border-border bg-card/50 cursor-pointer transition-all inline-flex items-center justify-center" title={language === 'ar' ? 'تكرار الوحدة (_1, _2)' : 'Duplicate Unit (_1, _2)'}><Copy className="w-4 h-4" /></button>
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
                                );
                              })}
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
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'عنوان الإعلان للوحدة (عربي)' : 'Unit Title (Ar)'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.titleAr}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, titleAr: e.target.value })}
                                    placeholder={language === 'ar' ? 'مثال: شقة فاخرة للإيجار' : 'e.g. Luxury Apartment for Rent'}
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'عنوان الإعلان للوحدة (إنجليزي)' : 'Unit Title (En)'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.titleEn}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, titleEn: e.target.value })}
                                    placeholder={language === 'ar' ? 'مثال: Luxury Apartment for Rent' : 'e.g. Luxury Apartment for Rent'}
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>
                                
                                <div className="md:col-span-2">
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'رقم / اسم الوحدة الداخلي' : 'Unit Name/Number'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.unitNameAr}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setUnitFormData(prev => {
                                        const syncTitle = !prev.titleAr || prev.titleAr === prev.unitNameAr;
                                        const syncTitleEn = !prev.titleEn || prev.titleEn === prev.unitNameEn;
                                        return {
                                          ...prev,
                                          unitNameAr: val,
                                          unitNameEn: val,
                                          titleAr: syncTitle ? val : prev.titleAr,
                                          titleEn: syncTitleEn ? val : prev.titleEn
                                        };
                                      });
                                    }}
                                    placeholder={language === 'ar' ? 'مثال: شقة 101' : 'e.g. Apt 101'}
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>

                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'الفئة' : 'Category'}</label>
                                  <select
                                    value={unitFormData.propertyCategory}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, propertyCategory: e.target.value })}
                                    className="cn-input text-xs h-9 bg-background"
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
                                    className="cn-input text-xs h-9 bg-background"
                                  >
                                    <option value="RENT">{t('common.rent')}</option>
                                    <option value="SALE">{t('common.sale')}</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'السعر (ريال)' : 'Price (SAR)'}</label>
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    value={formatNumberWithCommas(unitFormData.price)}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, price: sanitizeNumericInput(e.target.value) })}
                                    placeholder="0"
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'المساحة (متر مربع)' : 'Area (Sqm)'}</label>
                                  <input
                                    type="number"
                                    value={unitFormData.area}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, area: e.target.value })}
                                    placeholder="0"
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'عدد الغرف' : 'Rooms Count'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.rooms}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, rooms: e.target.value })}
                                    placeholder="3"
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'دورات المياه' : 'Bathrooms Count'}</label>
                                  <input
                                    type="text"
                                    value={unitFormData.bathrooms}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, bathrooms: e.target.value })}
                                    placeholder="2"
                                    className="cn-input text-xs h-9 bg-background"
                                  />
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'الدور' : 'Floor'}</label>
                                  {buildingFloors.length > 0 ? (
                                    <select
                                      value={unitFormData.floor}
                                      onChange={(e) => setUnitFormData({ ...unitFormData, floor: e.target.value })}
                                      className="cn-input text-xs h-9 bg-background"
                                    >
                                      <option value="">{language === 'ar' ? 'اختر الدور' : 'Select Floor'}</option>
                                      {buildingFloors.map((flr) => (
                                        <option key={flr} value={flr}>{flr}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <select disabled className="cn-input text-xs h-9 opacity-60 bg-muted/20">
                                      <option>{language === 'ar' ? 'الرجاء إضافة أدوار أولاً أعلاه' : 'Please add floors first above'}</option>
                                    </select>
                                  )}
                                </div>
                                <div>
                                  <label className="cn-label mb-1.5">{language === 'ar' ? 'الحالة' : 'Status'}</label>
                                  <select
                                    value={unitFormData.status}
                                    onChange={(e) => setUnitFormData({ ...unitFormData, status: e.target.value })}
                                    className="cn-input text-xs h-9 bg-background"
                                  >
                                    <option value="PUBLISHED">{language === 'ar' ? 'متاح / منشور' : 'Available / Published'}</option>
                                    {selectedParentProperty?.type === 'SALE' || unitFormData.type === 'SALE'
                                      ? <option value="SOLD">{language === 'ar' ? 'مباع' : 'Sold'}</option>
                                      : <option value="RENTED">{language === 'ar' ? 'مؤجر' : 'Rented'}</option>
                                    }
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
                                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-lg transition-all cursor-pointer"
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
                    <div className="sticky bottom-0 left-0 right-0 z-30 bg-background border-t border-border py-4 mt-12 -mx-4 sm:-mx-6 lg:-mx-8 select-none">
                      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-3 flex-wrap">
                        {/* Cancel or Previous Button */}
                        {currentStep > 1 ? (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="btn-outline text-xs flex items-center gap-1.5"
                          >
                            {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                            {language === 'ar' ? 'السابق' : 'Previous'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="btn-outline text-xs flex items-center gap-1.5"
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
                            className="btn-primary text-xs flex items-center gap-1.5"
                          >
                            {language === 'ar' ? 'التالي' : 'Next'}
                            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={loading || isUploadingImages}
                            onClick={(e) => saveProperty(e, 'PUBLISHED')}
                            className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
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
                          <span className="font-semibold text-sm truncate text-foreground">{title}</span>
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
                    onClick={() => handleSettingsSectionChange(item.section)}
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
                      <WhatsAppSettingsTab
                        t={t}
                        whatsappNumber={whatsappNumber}
                        setWhatsappNumber={setWhatsappNumber}
                        callingNumber={callingNumber}
                        setCallingNumber={setCallingNumber}
                        whatsappMessage={whatsappMessage}
                        setWhatsappMessage={setWhatsappMessage}
                        socialEmail={socialEmail}
                        setSocialEmail={setSocialEmail}
                        instagramUrl={instagramUrl}
                        setInstagramUrl={setInstagramUrl}
                        twitterUrl={twitterUrl}
                        setTwitterUrl={setTwitterUrl}
                        facebookUrl={facebookUrl}
                        setFacebookUrl={setFacebookUrl}
                        linkedinUrl={linkedinUrl}
                        setLinkedinUrl={setLinkedinUrl}
                        youtubeUrl={youtubeUrl}
                        setYoutubeUrl={setYoutubeUrl}
                        tiktokUrl={tiktokUrl}
                        setTiktokUrl={setTiktokUrl}
                        snapchatUrl={snapchatUrl}
                        setSnapchatUrl={setSnapchatUrl}
                        addressAr={addressAr}
                        setAddressAr={setAddressAr}
                        addressEn={addressEn}
                        setAddressEn={setAddressEn}
                        addressMapLink={addressMapLink}
                        setAddressMapLink={setAddressMapLink}
                      />
                    )}

                    {activeSettingsSection === 'email' && (
                      <EmailSettingsTab
                        smtpHost={smtpHost}
                        setSmtpHost={setSmtpHost}
                        smtpPort={smtpPort}
                        setSmtpPort={setSmtpPort}
                        smtpFrom={smtpFrom}
                        setSmtpFrom={setSmtpFrom}
                        smtpUser={smtpUser}
                        setSmtpUser={setSmtpUser}
                        smtpPass={smtpPass}
                        setSmtpPass={setSmtpPass}
                        showSmtpPass={showSmtpPass}
                        setShowSmtpPass={setShowSmtpPass}
                        imapHost={imapHost}
                        setImapHost={setImapHost}
                        imapPort={imapPort}
                        setImapPort={setImapPort}
                      />
                    )}

                    {activeSettingsSection === 'otp' && (
                      <OtpSettingsTab
                        otpWebhookUrl={otpWebhookUrl}
                        setOtpWebhookUrl={setOtpWebhookUrl}
                        otpMessageTemplate={otpMessageTemplate}
                        setOtpMessageTemplate={setOtpMessageTemplate}
                        otpWebhookPayload={otpWebhookPayload}
                        setOtpWebhookPayload={setOtpWebhookPayload}
                        verifyKitEnabled={verifyKitEnabled}
                        setVerifyKitEnabled={setVerifyKitEnabled}
                        verifyKitAppKey={verifyKitAppKey}
                        setVerifyKitAppKey={setVerifyKitAppKey}
                        authenticaEnabled={authenticaEnabled}
                        setAuthenticaEnabled={setAuthenticaEnabled}
                        authenticaApiKey={authenticaApiKey}
                        setAuthenticaApiKey={setAuthenticaApiKey}
                        showAuthenticaApiKey={showAuthenticaApiKey}
                        setShowAuthenticaApiKey={setShowAuthenticaApiKey}
                        authenticaMethod={authenticaMethod}
                        setAuthenticaMethod={setAuthenticaMethod}
                        authenticaTemplateId={authenticaTemplateId}
                        setAuthenticaTemplateId={setAuthenticaTemplateId}
                      />
                    )}

                    {activeSettingsSection === 'images' && (
                      <ImagesSettingsTab
                        logoUrl={logoUrl}
                        setLogoUrl={setLogoUrl}
                        homeImages={homeImages}
                        setHomeImages={setHomeImages}
                        imageSlotUploading={imageSlotUploading}
                        uploadProgress={uploadProgress}
                        handleSlotUpload={async (e, slotKey, isVideo, onUpload) => {
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
                              await new Promise<void>((resolve, reject) => {
                                const xhr = new XMLHttpRequest();
                                xhr.open('POST', '/api/admin/upload-home-video');
                                xhr.upload.onprogress = (event) => {
                                  if (event.lengthComputable) {
                                    setUploadProgress(Math.round((event.loaded / event.total) * 100));
                                  }
                                };
                                xhr.onload = () => {
                                  if (xhr.status >= 200 && xhr.status < 300) {
                                    try {
                                      const data = JSON.parse(xhr.responseText);
                                      onUpload(data.url);
                                      resolve();
                                    } catch (err) {
                                      reject(new Error('Invalid response format'));
                                    }
                                  } else {
                                    try {
                                      const data = JSON.parse(xhr.responseText);
                                      reject(new Error(data.error || 'Upload failed'));
                                    } catch (_) {
                                      reject(new Error('Upload failed'));
                                    }
                                  }
                                };
                                xhr.onerror = () => reject(new Error('Network error during upload'));
                                xhr.send(fd);
                              });
                            } catch (uploadErr: any) {
                              console.error(uploadErr);
                              await showAlert(
                                language === 'ar'
                                  ? `فشل رفع الفيديو: ${uploadErr.message || ''}`
                                  : `Failed to upload video: ${uploadErr.message || ''}`
                              );
                            } finally {
                              setImageSlotUploading(null);
                              setUploadProgress(null);
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
                        }}
                      />
                    )}

                    {activeSettingsSection === 'backup' && (
                      <BackupSettingsTab
                        exportingDb={backupLoading}
                        handleExportDatabase={async () => {
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
                          } catch (e) {
                            await showAlert(language === 'ar' ? 'فشل تنزيل النسخة.' : 'Backup download failed.');
                          } finally { setBackupLoading(false); }
                        }}
                        restoringDb={restoreLoading}
                        restoreProgress={restoreProgress}
                        handleRestoreDatabase={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const confirmed = await showConfirm(language === 'ar' ? 'هل أنت متأكد؟ سيتم استبدال قاعدة البيانات الحالية.' : 'Are you sure? This will replace the current database.');
                          if (!confirmed) return;
                          setRestoreLoading(true);
                          setRestoreMessage(null);
                          setRestoreProgress(0);
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            await new Promise<void>((resolve, reject) => {
                              const xhr = new XMLHttpRequest();
                              xhr.open('POST', '/api/admin/restore');
                              xhr.upload.onprogress = (evt) => {
                                if (evt.lengthComputable) {
                                  setRestoreProgress(Math.round((evt.loaded / evt.total) * 100));
                                }
                              };
                              xhr.onload = () => {
                                if (xhr.status >= 200 && xhr.status < 300) {
                                  try {
                                    setRestoreMessage({ type: 'success', text: language === 'ar' ? 'تمت الاستعادة بنجاح. أعد تحميل الصفحة.' : 'Restore successful! Please reload the page.' });
                                    resolve();
                                  } catch (err) {
                                    reject(err);
                                  }
                                } else {
                                  try {
                                    const data = JSON.parse(xhr.responseText);
                                    setRestoreMessage({ type: 'error', text: data.error || 'Restore failed' });
                                    resolve();
                                  } catch (_) {
                                    setRestoreMessage({ type: 'error', text: 'Restore failed' });
                                    resolve();
                                  }
                                }
                              };
                              xhr.onerror = () => {
                                setRestoreMessage({ type: 'error', text: 'Network error' });
                                reject(new Error('Network error'));
                              };
                              xhr.send(fd);
                            });
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setRestoreLoading(false);
                            setRestoreProgress(null);
                            e.target.value = '';
                          }
                        }}
                      />
                    )}

                    {activeSettingsSection === 'techhub' && (
                      <TechHubSettingsTab
                        techHubApiKey={techhubApiKey}
                        setTechHubApiKey={setTechhubApiKey}
                        techHubEndpointUrl={techhubEndpointUrl || ''}
                        setTechHubEndpointUrl={(val) => setTechhubEndpointUrl?.(val)}
                        techHubSyncEnabled={techhubEnabled}
                      />
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

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh] admin-stagger-item animate-in fade-in zoom-in duration-200" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">
                {language === 'ar' ? 'اختر أيقونة' : 'Select Icon'}
              </h3>
              <button 
                type="button"
                onClick={() => setShowIconPicker(false)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-border">
              <input
                type="text"
                value={iconSearchQuery}
                onChange={(e) => setIconSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن أيقونة... (مثال: Bed, Bath, Home)' : 'Search icons... (e.g. Bed, Bath, Home)'}
                className="cn-input w-full"
                autoFocus
              />
            </div>

            {/* Icons Grid Container */}
            <div className="p-4 overflow-y-auto flex-1 space-y-6">
              {/* Popular Icons (only show if search query is empty) */}
              {!iconSearchQuery && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {language === 'ar' ? 'الأيقونات الشائعة' : 'Popular Icons'}
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {POPULAR_ICONS.map((iconName) => {
                      const IconComponent = (LucideIcons as any)[iconName];
                      if (!IconComponent) return null;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => {
                            if (activeDetailId) {
                              updateDetailIcon(activeDetailId, iconName);
                            }
                            setShowIconPicker(false);
                          }}
                          className="p-2.5 bg-background border border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-foreground hover:text-primary cursor-pointer group"
                          title={iconName}
                        >
                          <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition" />
                          <span className="text-[9px] truncate max-w-full text-muted-foreground group-hover:text-primary font-medium">{iconName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {iconSearchQuery && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
                  </h4>
                  {(() => {
                    const filtered = Object.keys(LucideIcons)
                      .filter(key => {
                        return /^[A-Z]/.test(key) && 
                          (typeof (LucideIcons as any)[key] === 'function' || typeof (LucideIcons as any)[key] === 'object') &&
                          key.toLowerCase().includes(iconSearchQuery.toLowerCase());
                      })
                      .slice(0, 48); // Limit to 48 icons to keep it fast

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                          {language === 'ar' ? 'لم يتم العثور على أيقونات مطابقة' : 'No matching icons found'}
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {filtered.map((iconName) => {
                          const IconComponent = (LucideIcons as any)[iconName];
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => {
                                if (activeDetailId) {
                                  updateDetailIcon(activeDetailId, iconName);
                                }
                                setShowIconPicker(false);
                              }}
                              className="p-2.5 bg-background border border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-foreground hover:text-primary cursor-pointer group"
                              title={iconName}
                            >
                              <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition" />
                              <span className="text-[9px] truncate max-w-full text-muted-foreground group-hover:text-primary font-medium">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Renter to Unit Modal */}
      {unitForRenterAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {language === 'ar' ? 'تعيين مستأجر للوحدة' : 'Assign Renter to Unit'}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {unitForRenterAssignment.titleAr || unitForRenterAssignment.titleEn}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnitForRenterAssignment(null)}
                className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Option Selector: Choose existing or Add new */}
              <div className="flex bg-muted p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setRenterAssignmentMode('existing')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    renterAssignmentMode === 'existing'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {language === 'ar' ? 'اختيار مستأجر حالي' : 'Select Existing Renter'}
                </button>
                <button
                  type="button"
                  onClick={() => setRenterAssignmentMode('new')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    renterAssignmentMode === 'new'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {language === 'ar' ? 'إضافة مستأجر جديد' : 'Create New Renter'}
                </button>
              </div>

              {renterAssignmentMode === 'existing' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border border-border rounded-xl px-3 bg-background focus-within:ring-1 focus-within:ring-primary h-9">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={renterSearchQuery}
                      onChange={(e) => setRenterSearchQuery(e.target.value)}
                      placeholder={language === 'ar' ? 'ابحث باسم المستأجر أو رقم الجوال...' : 'Search renter by name or phone...'}
                      className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-xs text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                    {(() => {
                      const filteredRenters = availableRenterUsers.filter(r => {
                        const q = renterSearchQuery.trim().toLowerCase();
                        if (!q) return true;
                        return (r.name && r.name.toLowerCase().includes(q)) || (r.phone && r.phone.includes(q));
                      });

                      if (filteredRenters.length === 0) {
                        return (
                          <div className="text-center py-6 text-xs text-muted-foreground">
                            {language === 'ar' ? 'لم يتم العثور على مستأجر مطابق' : 'No matching renters found'}
                          </div>
                        );
                      }

                      return filteredRenters.map(renter => {
                        const isSelected = selectedRenterUserId === renter.id;
                        return (
                          <div
                            key={renter.id}
                            onClick={() => setSelectedRenterUserId(renter.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                                : 'border-border/70 hover:border-primary/40 bg-card hover:bg-muted/40 text-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                              }`}>
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold">{renter.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono" dir="ltr">{renter.phone}</p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="cn-label mb-1">{language === 'ar' ? 'اسم المستأجر الكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      value={newUnitRenterName}
                      onChange={(e) => setNewUnitRenterName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: محمد أحمد علي' : 'e.g. John Doe'}
                      className="cn-input text-xs h-9 bg-background"
                    />
                  </div>
                  <div>
                    <label className="cn-label mb-1">{language === 'ar' ? 'رقم الجوال' : 'Phone Number'}</label>
                    <input
                      type="text"
                      value={newUnitRenterPhone}
                      onChange={(e) => setNewUnitRenterPhone(e.target.value)}
                      placeholder="0500000000"
                      className="cn-input text-xs h-9 bg-background"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setUnitForRenterAssignment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveRenterToUnit}
                disabled={isSavingRenterToUnit}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSavingRenterToUnit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{language === 'ar' ? 'حفظ وتعيين' : 'Save & Assign'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
