import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { 
  Lock, User, Phone, AlertTriangle, Building2, Calendar, FileText, ChevronLeft, ChevronRight, 
  CreditCard, History, Banknote, Landmark, CheckCircle2, UploadCloud, Loader2, Eye, ArrowLeft, 
  ArrowRight, Wrench, Plus, X, Image as ImageIcon, Clock, XCircle, MessageSquare, Bed, Bath, 
  Maximize2, ShieldCheck, MapPin, Sparkles, Send, Check, Filter, Trash2, ExternalLink, CheckSquare
} from 'lucide-react';
import { SrIcon } from '../components/SrIcon';
import { useDialog } from '../context/DialogContext';
import { getRentStatus } from '../utils/rentStatus';

interface RentHistory {
  id: string;
  dueDate: string;
  paidDate: string;
  amount: string;
  receiptUrl: string | null;
}

interface RenterUnit {
  id: string;
  unitNumber: string;
  renterName: string;
  renterPhone?: string;
  contractEndDate: string;
  nextRentDue: string | null;
  rentAmount: number | null;
  isTanfeeth: boolean;
  propertyName: string;
  transferDetails: string | null;
  buildingPhotos?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floor?: string;
  features?: string;
  photos?: string;
  rentHistory: RentHistory[];
}

interface MaintenanceReport {
  id: string;
  description: string;
  category?: string;
  priority?: string;
  images: string; // JSON string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  adminResponse: string | null;
  createdAt: string;
  updatedAt?: string;
  renter?: {
    id: string;
    name: string;
    phone: string;
  };
  renterUnit?: {
    id: string;
    unitNumber: string;
    building?: {
      id: string;
      name: string;
    };
  };
}

const DEFAULT_APARTMENT_PHOTOS = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
];

const MAINTENANCE_CATEGORIES = [
  { id: 'PLUMBING', nameAr: 'سباكة ومياه', nameEn: 'Plumbing', icon: '🚿' },
  { id: 'ELECTRICAL', nameAr: 'كهرباء وإضاءة', nameEn: 'Electrical', icon: '⚡' },
  { id: 'HVAC', nameAr: 'تكييف وتبريد', nameEn: 'Air Conditioning', icon: '❄️' },
  { id: 'CARPENTRY', nameAr: 'أبواب ونجارة', nameEn: 'Carpentry', icon: '🚪' },
  { id: 'CLEANING', nameAr: 'نظافة ورش آفات', nameEn: 'Cleaning & Pest', icon: '🧹' },
  { id: 'ELEVATOR', nameAr: 'مصاعد ومرافق', nameEn: 'Elevator & Facilities', icon: '🏢' },
  { id: 'GENERAL', nameAr: 'صيانة عامة', nameEn: 'General Repair', icon: '🔧' },
];

const MAINTENANCE_PRIORITIES = [
  { id: 'NORMAL', nameAr: 'عادي (خلال 24-48 ساعة)', nameEn: 'Normal (24-48 hrs)', badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { id: 'URGENT', nameAr: 'هام (خلال 12 ساعة)', nameEn: 'Urgent (12 hrs)', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { id: 'EMERGENCY', nameAr: 'طارئ جداً (فوري)', nameEn: 'Emergency (Immediate)', badgeClass: 'bg-red-500/10 text-red-600 border-red-200 animate-pulse' },
];

export default function Login() {
  const { language } = useLanguage();
  const { showAlert } = useDialog();
  const navigate = useNavigate();
  
  // Modes
  const [mode, setMode] = useState<'renter' | 'admin'>('renter');

  // Admin states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Renter states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [hasOtpSent, setHasOtpSent] = useState(false);
  const [units, setUnits] = useState<RenterUnit[] | null>(null);

  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Renter Dashboard Active View Tab: 'apartment' | 'maintenance' | 'payments'
  const [renterViewTab, setRenterViewTab] = useState<'apartment' | 'maintenance' | 'payments'>('apartment');

  // Maintenance States
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceActiveTab, setMaintenanceActiveTab] = useState<'new' | 'list'>('new');
  const [selectedUnitForReport, setSelectedUnitForReport] = useState<string>('');
  const [maintenanceCategory, setMaintenanceCategory] = useState<string>('GENERAL');
  const [maintenancePriority, setMaintenancePriority] = useState<string>('NORMAL');
  const [maintenanceDesc, setMaintenanceDesc] = useState('');
  const [maintenanceImages, setMaintenanceImages] = useState<string[]>([]);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [maintenanceReportsList, setMaintenanceReportsList] = useState<MaintenanceReport[]>([]);
  const [reportStatusFilter, setReportStatusFilter] = useState<string>('ALL');

  // Photo gallery active index per unit
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  // Lightbox Image viewer modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchMaintenanceReports = (phoneNum: string) => {
    if (!phoneNum) return;
    fetch(`/api/renter/maintenance-reports?phone=${encodeURIComponent(phoneNum)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setMaintenanceReportsList(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role === 'RENTER' && u.phone) {
          setMode('renter');
          fetch('/api/renter/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: u.phone, otp: '0000' })
          })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && !data.error) {
              setUnits(data);
              setPhoneNumber(u.phone);
              fetchMaintenanceReports(u.phone);
            } else {
              localStorage.removeItem('user');
              window.dispatchEvent(new Event('storage'));
            }
          });
        }
      } catch (e) {}
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('storage'));
        navigate(['ADMIN', 'MANAGER', 'AGENT'].includes(user.role) ? '/admin' : '/dashboard');
      } else {
        setError(language === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ في النظام' : 'System error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/renter/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setHasOtpSent(true);
      if (data.fakeOtpDelivery) {
        await showAlert(language === 'ar' ? `لغرض التجربة، الرمز هو: ${data.fakeOtpDelivery}` : `For testing, OTP is: ${data.fakeOtpDelivery}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/renter/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || (language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Failed to login'));
      }

      setUnits(data);
      fetchMaintenanceReports(phoneNumber);
      localStorage.setItem('user', JSON.stringify({
        role: 'RENTER',
        phone: phoneNumber,
        name: data.length > 0 ? (data[0].renterName || 'Customer') : 'Customer'
      }));
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenanceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (maintenanceImages.length >= 4) {
      showAlert(language === 'ar' ? 'يمكنك رفع 4 صور كحد أقصى للبلاغ الواحد' : 'Maximum 4 images allowed per report');
      return;
    }

    const availableSlots = 4 - maintenanceImages.length;
    const selectedFiles = Array.from(files).slice(0, availableSlots);

    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          const res = ev.target.result;
          setMaintenanceImages(prev => prev.length < 4 ? [...prev, res] : prev);
        }
      };
      reader.readAsDataURL(file as File);
    });
    e.target.value = '';
  };

  const handleRemoveMaintenanceImage = (index: number) => {
    setMaintenanceImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmitMaintenanceReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceDesc.trim()) {
      await showAlert(language === 'ar' ? 'يرجى كتابة وصف البلاغ' : 'Please enter problem description');
      return;
    }
    const unitId = selectedUnitForReport || (units && units.length > 0 ? units[0].id : '');
    if (!unitId) {
      await showAlert(language === 'ar' ? 'يرجى اختيار الوحدة' : 'Please select a unit');
      return;
    }

    setSubmittingReport(true);
    try {
      const res = await fetch('/api/renter/maintenance-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          renterUnitId: unitId,
          description: maintenanceDesc,
          category: maintenanceCategory,
          priority: maintenancePriority,
          images: maintenanceImages
        })
      });

      if (res.ok) {
        setMaintenanceDesc('');
        setMaintenanceImages([]);
        fetchMaintenanceReports(phoneNumber);
        setMaintenanceActiveTab('list');
        await showAlert(language === 'ar' 
          ? 'تم تقديم بلاغ الصيانة بنجاح. يمكنك متابعة حالته والردود من هذه الصفحة.' 
          : 'Maintenance report submitted successfully. You can track status & replies here.');
      } else {
        const data = await res.json().catch(() => ({}));
        await showAlert(data.error || (language === 'ar' ? 'فشل تقديم البلاغ' : 'Failed to submit report'));
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setSubmittingReport(false);
    }
  };

  const [uploadingReceiptFor, setUploadingReceiptFor] = useState<string | null>(null);

  const handleUploadReceipt = async (historyId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingReceiptFor(historyId);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === 'string') resolve(e.target.result);
          else reject(new Error('Failed to convert to base64'));
        };
        reader.onerror = () => reject(new Error('File reading error'));
        reader.readAsDataURL(file as File);
      });

      const res = await fetch('/api/renter/upload-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId, receiptUrl: base64 })
      });

      if (res.ok) {
        const loginRes = await fetch('/api/renter/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber, otp })
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          setUnits(data);
        }
        await showAlert(language === 'ar' ? 'تم رفع الإيصال بنجاح. سيتم مراجعته.' : 'Receipt uploaded successfully. It will be reviewed.');
      } else {
        await showAlert(language === 'ar' ? 'حدث خطأ أثناء الرفع.' : 'Error uploading receipt.');
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'فشل الرفع' : 'Upload failed');
    } finally {
      setUploadingReceiptFor(null);
    }
  };

  const handleLogoutUnit = () => {
    fetch('/api/logout', { method: 'POST' }).catch(() => {});
    setUnits(null);
    setPhoneNumber('');
    setOtp('');
    setHasOtpSent(false);
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const parsePhotos = (jsonStr?: string): string[] => {
    if (!jsonStr) return DEFAULT_APARTMENT_PHOTOS;
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_APARTMENT_PHOTOS;
  };

  const parseReportImages = (jsonStr?: string): string[] => {
    if (!jsonStr) return [];
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  };

  const openMaintenanceModal = (tab: 'new' | 'list' = 'new', unitId?: string) => {
    if (unitId) setSelectedUnitForReport(unitId);
    else if (units && units.length > 0) setSelectedUnitForReport(units[0].id);
    setMaintenanceActiveTab(tab);
    setIsMaintenanceModalOpen(true);
  };

  // Status Badge Helper for Maintenance Reports
  const renderMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Wrench className="w-3.5 h-3.5" />
            {language === 'ar' ? 'جاري المعالجة' : 'In Progress'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === 'ar' ? 'مكتمل' : 'Completed'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {language === 'ar' ? 'ملغى' : 'Cancelled'}
          </span>
        );
      default:
        return null;
    }
  };

  if (units) {
    const renterName = units[0]?.renterName || (language === 'ar' ? 'المستأجر' : 'Renter');
    const openReportsCount = maintenanceReportsList.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* LIGHTBOX MODAL */}
        {lightboxImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={lightboxImage} 
              alt="Apartment view" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className="w-full max-w-5xl space-y-8">
          
          {/* HEADER BAR */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-blue-600 text-primary-foreground flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                {renterName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">{language === 'ar' ? 'أهلاً بك،' : 'Welcome,'} {renterName}</h1>
                  <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'حساب موثق' : 'Verified Renter'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{phoneNumber}</span>
                  <span className="text-border">|</span>
                  <span>{language === 'ar' ? `عدد الوحدات: ${units.length}` : `${units.length} Unit(s)`}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <button 
                type="button"
                onClick={() => openMaintenanceModal('new')}
                className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-blue-600 text-primary-foreground hover:opacity-95 transition-all shadow-md font-bold text-sm px-5 py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Wrench className="w-4.5 h-4.5" />
                <span>{language === 'ar' ? 'طلب صيانة جديد' : 'New Maintenance Request'}</span>
              </button>

              <button 
                onClick={handleLogoutUnit}
                className="bg-muted hover:bg-muted/80 text-foreground border border-border font-bold text-sm px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ChevronLeft className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                <span>{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            </div>
          </div>

          {/* BIG BUTTONS FOR QUICK ACCESS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Big Button 1: Submit Maintenance */}
            <button
              onClick={() => openMaintenanceModal('new')}
              className="bg-card border border-primary/20 hover:border-primary p-5 rounded-3xl shadow-sm hover:shadow-md transition-all text-right rtl:text-right ltr:text-left group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-blue-500" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <Plus className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100" />
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground mb-1">{language === 'ar' ? 'تقديم طلب صيانة' : 'Request Maintenance'}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ar' ? 'تقديم بلاغ صيانة جديد مرفق بالصور' : 'Submit issue report with attached photos'}
                </p>
              </div>
            </button>

            {/* Big Button 2: Maintenance Requests & Replies */}
            <button
              onClick={() => openMaintenanceModal('list')}
              className="bg-card border border-border hover:border-blue-500 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all text-right rtl:text-right ltr:text-left group cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                  <MessageSquare className="w-6 h-6" />
                  {openReportsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-card">
                      {openReportsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold bg-muted px-2.5 py-1 rounded-full text-foreground">
                  {maintenanceReportsList.length} {language === 'ar' ? 'طلب' : 'Requests'}
                </span>
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground mb-1">{language === 'ar' ? 'طلباتي والردود' : 'Requests & Replies'}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ar' ? 'متابعة حالة الطلبات وردود فريق الصيانة' : 'Check status & responses from tech team'}
                </p>
              </div>
            </button>

            {/* Big Button 3: Rent Payment History */}
            <button
              onClick={() => {
                setRenterViewTab('payments');
                document.getElementById('payments-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-card border border-border hover:border-emerald-500 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all text-right rtl:text-right ltr:text-left group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6" />
                </div>
                <History className="w-5 h-5 text-emerald-500 opacity-60 group-hover:opacity-100" />
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground mb-1">{language === 'ar' ? 'سجل الدفعات والإيصالات' : 'Payments & Receipts'}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ar' ? 'مواعيد الاستحقاق ورفع إيصالات السداد' : 'Due dates & receipt uploads'}
                </p>
              </div>
            </button>

            {/* Big Button 4: Apartment Specs & Details */}
            <button
              onClick={() => {
                setRenterViewTab('apartment');
                document.getElementById('apartment-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-card border border-border hover:border-purple-500 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all text-right rtl:text-right ltr:text-left group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <Sparkles className="w-5 h-5 text-purple-500 opacity-60 group-hover:opacity-100" />
              </div>
              <div>
                <h3 className="font-black text-lg text-foreground mb-1">{language === 'ar' ? 'مواصفات وصور الشقة' : 'Apartment Details'}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'ar' ? 'المساحة، الغرف، المزايا وصور العقار' : 'Area, rooms, amenities & photo gallery'}
                </p>
              </div>
            </button>

          </div>

          {/* MAIN NAVIGATION TAB CONTROLS */}
          <div className="flex border-b border-border gap-2 bg-card p-1.5 rounded-2xl border shadow-xs">
            <button
              onClick={() => setRenterViewTab('apartment')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${renterViewTab === 'apartment' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'شقتي والمواصفات' : 'My Apartment & Specs'}</span>
            </button>

            <button
              onClick={() => setRenterViewTab('maintenance')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${renterViewTab === 'maintenance' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Wrench className="w-4 h-4" />
              <span>{language === 'ar' ? 'مركز خدمات الصيانة' : 'Maintenance Center'}</span>
              {openReportsCount > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-black">
                  {openReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setRenterViewTab('payments')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${renterViewTab === 'payments' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{language === 'ar' ? 'سجل الدفعات' : 'Payment History'}</span>
            </button>
          </div>

          {/* SECTION 1: APARTMENT SHOWCASE & SPECIFICATIONS */}
          {(renterViewTab === 'apartment' || renterViewTab === 'payments') && (
            <div id="apartment-section" className="space-y-8">
              {units.map((unit, i) => {
                const photos = parsePhotos(unit.photos || unit.buildingPhotos);
                const currentPhotoIdx = activePhotoIndices[unit.id] || 0;
                const featuresList = (unit.features || 'مكيفات مجهزة, مطبخ راكب, موقف خاص, مصعد, إنتركوم ذكي').split(',').map(f => f.trim());

                return (
                  <div key={unit.id || i} className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden relative">
                    
                    {unit.isTanfeeth && (
                      <div className="bg-red-500 text-white font-bold text-center px-4 py-3 flex items-center justify-center gap-2 shadow-inner text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce" />
                        <span>{language === 'ar' ? 'تنبيه: يوجد مطالبة مالية نشطة ضد الوحدة. يرجى التواصل معنا فوراً لتسوية الوضع.' : 'Notice: Active financial claim against this unit. Please contact management immediately.'}</span>
                      </div>
                    )}

                    {/* APARTMENT HERO PHOTO GALLERY & SHOWCASE */}
                    <div className="relative group bg-zinc-900 overflow-hidden h-72 sm:h-96 md:h-[450px]">
                      <img 
                        src={photos[currentPhotoIdx] || DEFAULT_APARTMENT_PHOTOS[0]} 
                        alt={unit.propertyName}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      {/* Fullscreen Button */}
                      <button 
                        onClick={() => setLightboxImage(photos[currentPhotoIdx] || DEFAULT_APARTMENT_PHOTOS[0])}
                        className="absolute top-4 left-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
                        title={language === 'ar' ? 'تكبير الصورة' : 'Full Screen'}
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>

                      {/* Photo Navigation Controls */}
                      {photos.length > 1 && (
                        <>
                          <button
                            onClick={() => {
                              const nextIdx = (currentPhotoIdx - 1 + photos.length) % photos.length;
                              setActivePhotoIndices(prev => ({ ...prev, [unit.id]: nextIdx }));
                            }}
                            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => {
                              const nextIdx = (currentPhotoIdx + 1) % photos.length;
                              setActivePhotoIndices(prev => ({ ...prev, [unit.id]: nextIdx }));
                            }}
                            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black text-white p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      {/* Apartment Overlay Title */}
                      <div className="absolute bottom-6 right-6 left-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="bg-primary text-primary-foreground font-black text-xs px-3 py-1 rounded-full shadow-sm">
                              {language === 'ar' ? `وحدة رقم ${unit.unitNumber}` : `Unit #${unit.unitNumber}`}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full">
                              {unit.propertyName}
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-4xl font-black">{language === 'ar' ? 'شقتك السكنية' : 'Rented Apartment'}</h2>
                        </div>

                        {/* Photo Thumbnails Strip */}
                        {photos.length > 1 && (
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                            {photos.map((p, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => setActivePhotoIndices(prev => ({ ...prev, [unit.id]: pIdx }))}
                                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${currentPhotoIdx === pIdx ? 'border-primary scale-105 shadow-md' : 'border-white/40 opacity-70 hover:opacity-100'}`}
                              >
                                <img src={p} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                      
                      {/* SPECIFICATIONS GRID */}
                      <div>
                        <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span>{language === 'ar' ? 'المواصفات الفنية والتفاصيل' : 'Apartment Specifications'}</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                          
                          <div className="bg-muted/50 border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Bed className="w-6 h-6 text-primary mb-2" />
                            <span className="text-xs text-muted-foreground font-bold">{language === 'ar' ? 'غرف النوم' : 'Bedrooms'}</span>
                            <span className="text-lg font-black text-foreground mt-0.5">{unit.bedrooms || 2}</span>
                          </div>

                          <div className="bg-muted/50 border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Bath className="w-6 h-6 text-blue-500 mb-2" />
                            <span className="text-xs text-muted-foreground font-bold">{language === 'ar' ? 'دورات المياه' : 'Bathrooms'}</span>
                            <span className="text-lg font-black text-foreground mt-0.5">{unit.bathrooms || 2}</span>
                          </div>

                          <div className="bg-muted/50 border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Maximize2 className="w-6 h-6 text-emerald-500 mb-2" />
                            <span className="text-xs text-muted-foreground font-bold">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                            <span className="text-lg font-black text-foreground mt-0.5">{unit.area || 120} م²</span>
                          </div>

                          <div className="bg-muted/50 border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Building2 className="w-6 h-6 text-purple-500 mb-2" />
                            <span className="text-xs text-muted-foreground font-bold">{language === 'ar' ? 'الطابق' : 'Floor'}</span>
                            <span className="text-lg font-black text-foreground mt-0.5">{unit.floor || 'الاول'}</span>
                          </div>

                          <div className="bg-muted/50 border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Banknote className="w-6 h-6 text-emerald-600 mb-2" />
                            <span className="text-xs text-muted-foreground font-bold">{language === 'ar' ? 'قيمة الإيجار' : 'Rent'}</span>
                            <span className="text-base font-black text-foreground mt-0.5">
                              {unit.rentAmount ? Math.floor(unit.rentAmount).toLocaleString() : '---'} <span className="text-xs font-normal">ريال</span>
                            </span>
                          </div>

                          <div className="bg-muted/50 border border-border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                            <Calendar className="w-6 h-6 text-orange-500 mb-2" />
                            <span className="text-xs text-muted-foreground font-bold">{language === 'ar' ? 'انتهاء العقد' : 'Contract End'}</span>
                            <span className="text-xs font-black text-foreground mt-0.5" dir="ltr">{unit.contractEndDate || '---'}</span>
                          </div>

                        </div>
                      </div>

                      {/* FEATURES AND AMENITIES */}
                      <div>
                        <h4 className="text-sm font-bold text-muted-foreground mb-3">{language === 'ar' ? 'التجهيزات والخدمات المتاحة:' : 'Features & Amenities:'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {featuresList.map((feat, fIdx) => (
                            <span key={fIdx} className="bg-card border border-border text-foreground px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{feat}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* BANK TRANSFER DETAILS */}
                      {unit.transferDetails && (
                        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                          <Landmark className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                          <div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-1">{language === 'ar' ? 'تفاصيل الحساب والتحويل البنكي' : 'Bank Account Details'}</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">{unit.transferDetails}</p>
                          </div>
                        </div>
                      )}

                      {/* RENT PAYMENT HISTORY */}
                      <div id="payments-section" className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-black flex items-center gap-2 text-foreground">
                            <History className="w-6 h-6 text-primary" />
                            <span>{language === 'ar' ? 'سجل الدفعات والإيصالات' : 'Rent Payment History'}</span>
                          </h3>
                          <span className="text-xs text-muted-foreground font-bold">
                            {unit.rentHistory?.length || 0} {language === 'ar' ? 'دفعات مجهزة' : 'Payments'}
                          </span>
                        </div>

                        {unit.rentHistory && unit.rentHistory.length > 0 ? (
                          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                            {unit.rentHistory.map((h, hIdx) => {
                              const amountStr = typeof h.amount === 'string' ? h.amount : (h.amount?.toString() || '');
                              const {
                                isCourt,
                                isLate,
                                isPaid,
                                isScheduled,
                                isDue,
                                statusText,
                                actualPaidDate
                              } = getRentStatus(h, language);

                              return (
                                <div key={h.id || hIdx} className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${isPaid ? 'border-emerald-500/20 bg-emerald-500/5' : isCourt ? 'border-red-500/30 bg-red-500/5' : isLate ? 'border-orange-500/30 bg-orange-500/5' : isDue ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-card'}`}>
                                  <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-emerald-500/20 text-emerald-600' : isCourt ? 'bg-red-500/20 text-red-600' : 'bg-amber-500/20 text-amber-600'}`}>
                                      {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="font-bold text-foreground m-0">
                                        {language === 'ar' ? `تاريخ الاستحقاق:` : `Due Date:`} <span dir="ltr" className="ml-1 text-foreground font-black">{h.dueDate}</span>
                                      </p>
                                      <div className="text-xs flex items-center gap-3 text-muted-foreground flex-wrap">
                                        <span className={`font-black ${isPaid ? 'text-emerald-600' : isCourt ? 'text-red-600' : 'text-amber-600'}`}>
                                          {statusText}
                                        </span>
                                        {isPaid && actualPaidDate && (
                                          <span>• {language === 'ar' ? 'تاريخ السداد:' : 'Paid:'} {actualPaidDate}</span>
                                        )}
                                        {amountStr && (
                                          <span>• {language === 'ar' ? 'المبلغ:' : 'Amount:'} <strong className="text-foreground">{amountStr} ريال</strong></span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {h.receiptUrl ? (
                                      <>
                                        <a 
                                          href={h.receiptUrl} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          className="text-xs bg-muted hover:bg-muted/80 text-foreground font-bold px-4 py-2.5 rounded-xl border border-border transition-colors flex items-center gap-1.5"
                                        >
                                          <Eye className="w-4 h-4 text-primary" />
                                          {language === 'ar' ? 'عرض الإيصال' : 'Preview'}
                                        </a>
                                        <label className="relative cursor-pointer text-xs px-4 py-2.5 bg-card hover:bg-muted text-foreground font-bold rounded-xl border border-border transition-colors flex items-center gap-1.5 shadow-2xs">
                                          <input 
                                            type="file" 
                                            accept="image/*,application/pdf"
                                            onChange={(e) => handleUploadReceipt(h.id, e)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          />
                                          {uploadingReceiptFor === h.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                          {language === 'ar' ? 'إعادة رفع' : 'Reupload'}
                                        </label>
                                      </>
                                    ) : (
                                      <label className="relative cursor-pointer text-xs px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
                                        <input 
                                          type="file" 
                                          accept="image/*,application/pdf"
                                          onChange={(e) => handleUploadReceipt(h.id, e)}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {uploadingReceiptFor === h.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                        {language === 'ar' ? 'رفع إيصال التحويل' : 'Upload Receipt'}
                                      </label>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
                            <p className="text-sm font-bold">{language === 'ar' ? 'لا يوجد دفعات مسجلة حالياً' : 'No rent payment records found'}</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 2: MAINTENANCE CENTER HUB */}
          {(renterViewTab === 'maintenance' || isMaintenanceModalOpen) && (
            <div className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
                    <Wrench className="w-7 h-7 text-primary" />
                    <span>{language === 'ar' ? 'مركز خدمات الصيانة والردود' : 'Maintenance & Support Center'}</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'ar' ? 'تقديم بلاغات الأعطال الجديدة ومتابعة ردود وحالات فريق الصيانة بالإدارة' : 'Submit repair issues & read official maintenance team responses'}
                  </p>
                </div>

                {/* Sub Tab Toggle */}
                <div className="flex bg-muted p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setMaintenanceActiveTab('new')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${maintenanceActiveTab === 'new' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'}`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تقديم بلاغ جديد' : 'New Report'}</span>
                  </button>
                  <button
                    onClick={() => setMaintenanceActiveTab('list')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${maintenanceActiveTab === 'list' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground'}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{language === 'ar' ? `طلباتي والردود (${maintenanceReportsList.length})` : `My Requests (${maintenanceReportsList.length})`}</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: CREATE NEW MAINTENANCE ISSUE */}
              {maintenanceActiveTab === 'new' && (
                <form onSubmit={handleSubmitMaintenanceReport} className="space-y-6">
                  
                  {/* Select Unit if multiple */}
                  {units.length > 1 && (
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-2">{language === 'ar' ? 'اختر الوحدة المعنية' : 'Select Rented Unit'}</label>
                      <select
                        value={selectedUnitForReport}
                        onChange={(e) => setSelectedUnitForReport(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl p-3 text-sm font-bold text-foreground outline-none focus:ring-1 focus:ring-primary"
                      >
                        {units.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.propertyName} - {language === 'ar' ? `وحدة ${u.unitNumber}` : `Unit ${u.unitNumber}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Issue Category Chips */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2.5">{language === 'ar' ? 'تصنيف الصيانة المطلوبة' : 'Issue Category'}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                      {MAINTENANCE_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setMaintenanceCategory(cat.id)}
                          className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${maintenanceCategory === cat.id ? 'bg-primary text-primary-foreground border-primary shadow-sm font-black scale-105' : 'bg-background hover:bg-muted text-foreground border-border font-medium'}`}
                        >
                          <span className="text-2xl mb-1">{cat.icon}</span>
                          <span className="text-xs">{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Selector */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2.5">{language === 'ar' ? 'درجة الأهمية / الأولوية' : 'Priority Level'}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {MAINTENANCE_PRIORITIES.map(prio => (
                        <button
                          key={prio.id}
                          type="button"
                          onClick={() => setMaintenancePriority(prio.id)}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${maintenancePriority === prio.id ? 'bg-primary/10 border-primary text-primary shadow-2xs ring-1 ring-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}
                        >
                          {language === 'ar' ? prio.nameAr : prio.nameEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2">{language === 'ar' ? 'وصف تفصيلي للمشكلة أو العطل' : 'Problem Description'}</label>
                    <textarea
                      rows={4}
                      required
                      value={maintenanceDesc}
                      onChange={(e) => setMaintenanceDesc(e.target.value)}
                      placeholder={language === 'ar' ? 'يرجى كتابة تفاصيل المشكلة ومكان العطل في الشقة بدقة ليتم توجيه الفني المناسب...' : 'Describe the problem in detail to help our technicians...'}
                      className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Photos Upload Dropzone */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-muted-foreground">{language === 'ar' ? 'إرفاق صور العطل (حتى 4 صور)' : 'Attach Photos (up to 4)'}</label>
                      <span className="text-xs text-muted-foreground">{maintenanceImages.length}/4</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {maintenanceImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border group bg-black/5">
                          <img src={img} alt="Attachment" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveMaintenanceImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {maintenanceImages.length < 4 && (
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary bg-background hover:bg-muted/50 flex flex-col items-center justify-center p-4 cursor-pointer transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAddMaintenanceImage}
                            className="hidden"
                          />
                          <ImageIcon className="w-7 h-7 text-muted-foreground mb-1" />
                          <span className="text-xs font-bold text-primary">{language === 'ar' ? 'إضافة صورة' : 'Add Photo'}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submittingReport}
                      className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-base disabled:opacity-50"
                    >
                      {submittingReport ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{language === 'ar' ? 'جاري إرسال البلاغ...' : 'Submitting report...'}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>{language === 'ar' ? 'إرسال بلاغ الصيانة الآن' : 'Submit Maintenance Report'}</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

              {/* TAB 2: MY SUBMITTED REQUESTS & TEAM REPLIES */}
              {maintenanceActiveTab === 'list' && (
                <div className="space-y-6">
                  
                  {/* Status Filter Header */}
                  <div className="flex items-center justify-between flex-wrap gap-3 bg-muted/40 p-3 rounded-2xl border border-border">
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <Filter className="w-4 h-4" />
                      {language === 'ar' ? 'تصفية حسب الحالة:' : 'Filter status:'}
                    </span>

                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                      {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(st => (
                        <button
                          key={st}
                          onClick={() => setReportStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${reportStatusFilter === st ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                          {st === 'ALL' && (language === 'ar' ? 'الكل' : 'All')}
                          {st === 'PENDING' && (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                          {st === 'IN_PROGRESS' && (language === 'ar' ? 'جاري المعالجة' : 'In Progress')}
                          {st === 'COMPLETED' && (language === 'ar' ? 'مكتمل' : 'Completed')}
                          {st === 'CANCELLED' && (language === 'ar' ? 'ملغى' : 'Cancelled')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reports List */}
                  {maintenanceReportsList.length === 0 ? (
                    <div className="text-center py-16 bg-muted/20 border border-dashed rounded-3xl text-muted-foreground">
                      <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
                      <p className="text-base font-bold text-foreground">{language === 'ar' ? 'لا يوجد لديك بلاغات صيانة مسجلة حالياً' : 'No maintenance reports submitted yet'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{language === 'ar' ? 'يمكنك إنشاء بلاغ جديد بسهولة عند وجود أي عطل في الشقة' : 'You can create a new issue report anytime'}</p>
                      <button
                        onClick={() => setMaintenanceActiveTab('new')}
                        className="mt-4 bg-primary text-primary-foreground font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تقديم بلاغ جديد' : 'Submit New Report'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {maintenanceReportsList
                        .filter(r => reportStatusFilter === 'ALL' || r.status === reportStatusFilter)
                        .map(report => {
                          const imgs = parseReportImages(report.images);
                          const catObj = MAINTENANCE_CATEGORIES.find(c => c.id === report.category) || MAINTENANCE_CATEGORIES[6];

                          return (
                            <div key={report.id} className="bg-background border border-border rounded-3xl p-6 shadow-2xs space-y-4">
                              
                              {/* Report Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                    {catObj.icon}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-black text-sm text-foreground">{language === 'ar' ? catObj.nameAr : catObj.nameEn}</span>
                                      <span className="text-xs text-muted-foreground font-mono">#{report.id.substring(0, 8)}</span>
                                    </div>
                                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      {new Date(report.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {renderMaintenanceStatusBadge(report.status)}
                                </div>
                              </div>

                              {/* Report Description */}
                              <div>
                                <h4 className="text-xs font-bold text-muted-foreground mb-1">{language === 'ar' ? 'تفاصيل الوصف:' : 'Description:'}</h4>
                                <p className="text-sm font-medium text-foreground whitespace-pre-wrap leading-relaxed">{report.description}</p>
                              </div>

                              {/* Attached Photos */}
                              {imgs.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-bold text-muted-foreground mb-2">{language === 'ar' ? 'الصور المرفقة:' : 'Attached Photos:'}</h4>
                                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                    {imgs.map((img, iIdx) => (
                                      <button
                                        key={iIdx}
                                        onClick={() => setLightboxImage(img)}
                                        className="w-16 h-16 rounded-2xl overflow-hidden border border-border group relative shrink-0 cursor-pointer"
                                      >
                                        <img src={img} alt="Report attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* OFFICIAL MAINTENANCE TEAM REPLY */}
                              <div className="pt-2">
                                <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                                      <Wrench className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-bold text-xs text-blue-900 dark:text-blue-200">
                                      {language === 'ar' ? 'رد وملاحظات فريق صيانة بناء وإدارة' : 'Benaa & Edara Maintenance Team Reply'}
                                    </span>
                                  </div>

                                  {report.adminResponse ? (
                                    <p className="text-sm font-bold text-blue-950 dark:text-blue-100 whitespace-pre-wrap pl-9 rtl:pr-9 leading-relaxed">
                                      {report.adminResponse}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-blue-700 dark:text-blue-300 pl-9 rtl:pr-9 italic">
                                      {language === 'ar' 
                                        ? 'تم استلام بلاغكم بنجاح. يقوم فريق الإدارة بمراجعته والتنسيق مع الفني لتحديد موعد الزيارة.' 
                                        : 'Report received successfully. Our team is reviewing it to assign a technician.'}
                                    </p>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="mb-6 flex justify-start select-none">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/60 backdrop-blur-xs hover:bg-muted border border-border/80 px-4 py-2 rounded-full shadow-xs active:scale-[0.97]"
          >
            {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5 text-primary" /> : <ArrowLeft className="w-3.5 h-3.5 text-primary" />}
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>
        
        {loading ? (
          <div data-slot="card" data-size="default" className="cn-card group/card flex flex-col">
            <div data-slot="card-content" className="cn-card-content p-0">
              <div data-slot="empty" className="cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance p-8">
                <div data-slot="empty-header" className="cn-empty-header flex max-w-sm flex-col items-center">
                  <div data-slot="empty-icon" data-variant="icon" className="cn-empty-media flex shrink-0 items-center justify-center cn-empty-media-icon text-primary mb-4">
                    <Loader2 className="w-9 h-9 animate-spin" />
                  </div>
                  <div data-slot="empty-title" className="cn-empty-title cn-font-heading text-lg font-bold">
                    {language === 'ar' ? 'جاري التحقق والدخول...' : 'Syncing your account...'}
                  </div>
                  <div data-slot="empty-description" className="cn-empty-description text-muted-foreground text-xs mt-2 max-w-xs">
                    {language === 'ar' 
                      ? 'نقوم بالتحقق من بياناتك وتوصيلك بالنظام. يستغرق هذا بضع ثوانٍ.' 
                      : "We're verifying your credentials and establishing a secure connection. This takes a few seconds."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div data-slot="card" data-size="default" className="cn-card group/card flex flex-col shadow-lg border border-border rounded-3xl">
            
            <div data-slot="card-header" className="cn-card-header group/card-header grid auto-rows-min items-start p-6 pb-2">
              <div data-slot="card-title" className="cn-card-title cn-font-heading text-xl font-bold">
                {mode === 'renter' 
                  ? (language === 'ar' ? 'بوابة المستأجرين' : 'Renter Account Access')
                  : (language === 'ar' ? 'تسجيل دخول الإدارة' : 'Staff Account Access')}
              </div>
              <div data-slot="card-description" className="cn-card-description text-xs text-muted-foreground mt-1">
                {mode === 'renter'
                  ? (language === 'ar' ? 'أدخل رقم جوالك المسجل لتصلك رسالة التحقق' : 'Enter your registered phone number to authenticate.')
                  : (language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بموظفي الشركة' : 'Update your credentials or re-authenticate.')}
              </div>
            </div>

            {error && (
              <div className="px-6 mb-2">
                <div className="bg-destructive/10 text-destructive p-3 rounded-xl text-xs font-semibold border border-destructive/20 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div data-slot="card-content" className="cn-card-content p-6 pt-2">
              {mode === 'renter' ? (
                <form onSubmit={hasOtpSent ? handleRenterLogin : handleRequestOtp} className="space-y-4">
                  <div data-slot="field-group" className="cn-field-group space-y-4">
                    
                    <div role="group" data-slot="field" className="cn-field space-y-1.5">
                      <label data-slot="field-label" className="cn-label text-xs font-bold" htmlFor="phone-number">
                        {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                      </label>
                      <input 
                        id="phone-number" 
                        data-slot="input" 
                        type="tel"
                        required
                        disabled={hasOtpSent}
                        dir="ltr"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0500000000"
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono text-foreground focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
                      />
                      {!hasOtpSent && (
                        <p className="text-[10px] mt-1.5 text-muted-foreground flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          {language === 'ar' ? 'سيتم إرسال رمز التحقق عبر الواتساب (WhatsApp)' : 'Verification code will be sent via WhatsApp'}
                        </p>
                      )}
                    </div>

                    {hasOtpSent && (
                      <div role="group" data-slot="field" className="cn-field space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label data-slot="field-label" className="cn-label text-xs font-bold" htmlFor="otp-code">
                            {language === 'ar' ? 'رمز التحقق (OTP)' : 'Verification Code (OTP)'}
                          </label>
                          <button 
                            type="button" 
                            onClick={() => { setHasOtpSent(false); setOtp(''); }} 
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            {language === 'ar' ? 'تعديل الرقم' : 'Change Phone'}
                          </button>
                        </div>
                        <input 
                          id="otp-code" 
                          data-slot="input" 
                          type="text"
                          required
                          dir="ltr"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="----"
                          maxLength={4}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm tracking-widest text-center font-mono text-foreground focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    )}

                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      {hasOtpSent ? (language === 'ar' ? 'تحقق ودخول' : 'Verify & Login') : (language === 'ar' ? 'إرسال الرمز' : 'Send Code')}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div data-slot="field-group" className="cn-field-group space-y-4">
                    
                    <div role="group" data-slot="field" className="cn-field space-y-1.5">
                      <label data-slot="field-label" className="cn-label text-xs font-bold" htmlFor="username">
                        {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                      </label>
                      <input 
                        id="username" 
                        data-slot="input" 
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    <div role="group" data-slot="field" className="cn-field space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label data-slot="field-label" className="cn-label text-xs font-bold" htmlFor="password">
                          {language === 'ar' ? 'كلمة المرور' : 'Password'}
                        </label>
                      </div>
                      <input 
                        id="password" 
                        data-slot="input" 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      {language === 'ar' ? 'دخول موظفي الإدارة' : 'Staff Access Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div data-slot="card-footer" className="cn-card-footer p-6 pt-0 flex flex-col gap-4">
              {mode === 'renter' ? (
                <button 
                  type="button" 
                  onClick={() => { setMode('admin'); setError(''); }} 
                  className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-2.5 px-4 rounded-xl border border-border transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  {language === 'ar' ? 'بوابة دخول موظفي الشركة' : 'Switch to Staff & Admin Login'}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setMode('renter'); setError(''); }} 
                  className="w-full bg-muted hover:bg-muted/80 text-foreground font-bold py-2.5 px-4 rounded-xl border border-border transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  {language === 'ar' ? 'العودة لبوابة المستأجرين' : 'Switch to Renter Portal'}
                </button>
              )}

              <Link to="/contact" className="flex items-center w-full justify-between hover:bg-muted/50 transition-all duration-200 p-4 rounded-2xl border border-border cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="cn-item-content text-start">
                    <div className="cn-item-title text-xs font-bold text-foreground">
                      {language === 'ar' ? 'دعم المستأجرين' : 'Need Assistance?'}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {language === 'ar' ? 'تواصل مع الدعم الفني لإدارة العقار مباشرة' : 'Contact properties team for technical help'}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground hover:text-primary transition-colors">
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </div>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
