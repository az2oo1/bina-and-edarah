import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { 
  Lock, User, Phone, AlertTriangle, Building2, Calendar, FileText, ChevronLeft, ChevronRight, 
  CreditCard, History, Landmark, CheckCircle2, UploadCloud, Loader2, Eye, ArrowLeft, 
  ArrowRight, Wrench, Plus, X, Image as ImageIcon, Clock, XCircle, MessageSquare, Bed, Bath, 
  Maximize2, ShieldCheck, MapPin, Sparkles, Send, Check, Filter, Star, DollarSign
} from 'lucide-react';
import { useDialog } from '../context/DialogContext';
import { getRentStatus } from '../utils/rentStatus';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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

interface MaintenanceMessage {
  id: string;
  senderRole: 'RENTER' | 'ADMIN' | 'TECHNICIAN';
  senderName: string;
  message: string;
  attachments: string; // JSON string
  isRead: boolean;
  createdAt: string;
}

interface MaintenanceLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

interface MaintenanceReport {
  id: string;
  requestCode?: string | null;
  description: string;
  category?: string;
  priority?: string;
  images: string; // JSON string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  adminResponse: string | null;
  technicianName?: string | null;
  technicianPhone?: string | null;
  scheduledDate?: string | null;
  completedAt?: string | null;
  estimatedCost?: number | null;
  actualCost?: number | null;
  costPayer?: string | null;
  paymentStatus?: string | null;
  invoiceNumber?: string | null;
  vendorName?: string | null;
  taxAmount?: number | null;
  taxRate?: number | null;
  costBreakdown?: string | null;
  receipts?: string | null;
  receiptUrl?: string | null;
  proofImages?: string; // JSON string
  rating?: number | null;
  feedback?: string | null;
  createdAt: string;
  updatedAt?: string;
  messages?: MaintenanceMessage[];
  logs?: MaintenanceLog[];
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

  // Renter Dashboard Active View Tab: 'home' | 'apartment' | 'maintenance-new' | 'maintenance-list' | 'payments'
  const [renterViewTab, setRenterViewTab] = useState<'home' | 'apartment' | 'maintenance-new' | 'maintenance-list' | 'payments'>('home');

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
  const [reportUnitFilter, setReportUnitFilter] = useState<string>('ALL');

  // Photo gallery active index per unit
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  // Lightbox Image viewer modal
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Renter Direct Chat Modal
  const [renterChatReport, setRenterChatReport] = useState<MaintenanceReport | null>(null);
  const [renterChatMessage, setRenterChatMessage] = useState('');
  const [renterChatAttachments, setRenterChatAttachments] = useState<string[]>([]);
  const [sendingRenterMessage, setSendingRenterMessage] = useState(false);

  // Rating & Feedback State
  const [ratingReportId, setRatingReportId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingFeedback, setRatingFeedback] = useState<string>('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const fetchMaintenanceReports = (phoneNum: string) => {
    if (!phoneNum) return;
    fetch(`/api/renter/maintenance-reports?phone=${encodeURIComponent(phoneNum)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setMaintenanceReportsList(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  const handleSendRenterMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renterChatReport || (!renterChatMessage.trim() && renterChatAttachments.length === 0)) return;

    setSendingRenterMessage(true);
    try {
      const renterName = (units && units.length > 0 ? units[0].renterName : 'المستأجر');
      const res = await fetch(`/api/maintenance-reports/${renterChatReport.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: 'RENTER',
          senderName: renterName,
          message: renterChatMessage,
          attachments: renterChatAttachments
        })
      });

      if (res.ok) {
        setRenterChatMessage('');
        setRenterChatAttachments([]);
        const repRes = await fetch(`/api/maintenance-reports/${renterChatReport.id}`);
        if (repRes.ok) {
          const updated = await repRes.json();
          setRenterChatReport(updated);
        }
        fetchMaintenanceReports(phoneNumber);
      } else {
        await showAlert(language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingRenterMessage(false);
    }
  };

  const handleSubmitRating = async (reportId: string) => {
    setSubmittingRating(true);
    try {
      const res = await fetch(`/api/renter/maintenance-reports/${reportId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: ratingValue,
          feedback: ratingFeedback
        })
      });

      if (res.ok) {
        await showAlert(language === 'ar' ? 'شكراً لتقييمكم لمستوى خدمة الصيانة!' : 'Thank you for rating our maintenance service!');
        setRatingReportId(null);
        setRatingFeedback('');
        fetchMaintenanceReports(phoneNumber);
      } else {
        await showAlert(language === 'ar' ? 'فشل إرسال التقييم' : 'Failed to submit rating');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  useEffect(() => {
    if (units && units.length > 0 && !selectedUnitForReport) {
      setSelectedUnitForReport(units[0].id);
    }
  }, [units, selectedUnitForReport]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'maintenance-new') {
      setRenterViewTab('maintenance');
      setIsMaintenanceModalOpen(true);
      setMaintenanceActiveTab('new');
    } else if (view === 'maintenance-list') {
      setRenterViewTab('maintenance');
      setIsMaintenanceModalOpen(true);
      setMaintenanceActiveTab('list');
    } else if (view === 'payments') {
      setRenterViewTab('payments');
    } else if (view === 'apartment') {
      setRenterViewTab('apartment');
    }
  }, []);

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
              if (Array.isArray(data) && data.length > 0) {
                setSelectedUnitForReport(data[0].id);
              }
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
        if (user.token) {
          localStorage.setItem('token', user.token);
        }
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
        const createdReport = await res.json().catch(() => ({}));
        setMaintenanceDesc('');
        setMaintenanceImages([]);
        fetchMaintenanceReports(phoneNumber);
        setMaintenanceActiveTab('list');
        const codeText = createdReport.requestCode ? ` (رمز الطلب: #${createdReport.requestCode})` : '';
        await showAlert(language === 'ar' 
          ? `تم تقديم بلاغ الصيانة بنجاح${codeText}. يمكنك متابعة حالته والردود من هذه الصفحة.` 
          : `Maintenance report submitted successfully${codeText ? ` (Request Code: #${createdReport.requestCode})` : ''}. You can track status & replies here.`);
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

          {/* BACK TO MAIN MENU BUTTON BAR (when inside a section) */}
          {renterViewTab !== 'home' && (
            <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  setRenterViewTab('home');
                  setIsMaintenanceModalOpen(false);
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{language === 'ar' ? 'العودة للقائمة الرئيسية (الأزرار)' : 'Back to Main Menu'}</span>
              </button>
              <span className="text-xs font-black text-muted-foreground px-2">
                {renterViewTab === 'maintenance-new' && (language === 'ar' ? 'تقديم طلب صيانة جديد' : 'New Maintenance Request')}
                {renterViewTab === 'maintenance-list' && (language === 'ar' ? 'طلبات الصيانة والردود' : 'Requests & Replies')}
                {renterViewTab === 'payments' && (language === 'ar' ? 'سجل الدفعات والإيصالات' : 'Rent Payments & Receipts')}
                {renterViewTab === 'apartment' && (language === 'ar' ? 'مواصفات وصور الشقة' : 'Apartment Specs & Details')}
              </span>
            </div>
          )}

          {/* HOME PAGE PROPERTY SHOWCASE (ABOVE THE BUTTONS) */}
          {(renterViewTab === 'home' || renterViewTab === 'apartment') && (
            <div id="apartment-section" className="space-y-8">
              {units.length === 0 ? (
                <div className="bg-card border-2 border-dashed border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
                  <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h2 className="text-2xl font-black text-foreground">
                      {language === 'ar' ? 'لم يتم ربط عقار بحسابك حتى الآن' : 'No Property Connected Yet'}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {language === 'ar' 
                        ? 'تم تسجيل دخولك بنجاح! لم يتم ربط وحدتك السكنية برقم جوالك في النظام حتى الآن. يرجى التواصل مع إدارة الأملاك لربط عقارك.'
                        : 'You are signed in successfully! Your housing unit has not been connected to your account yet. Please contact property management to connect your unit.'}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a 
                      href={`https://wa.me/966556467063?text=${encodeURIComponent(language === 'ar' ? `مرحباً، أود ربط وحدة سكنية بحسابي لرقم الجوال: ${phoneNumber}` : `Hello, I would like to link a unit to my account for phone: ${phoneNumber}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <WhatsAppIcon className="w-5 h-5 fill-current" />
                      <span>{language === 'ar' ? 'تواصل معنا عبر الواتساب لربط الوحدة' : 'Contact Support via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              ) : (
                units.map((unit, i) => {
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
                          className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                          title={language === 'ar' ? 'تكبير الصورة' : 'View Fullscreen'}
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>

                        {/* Prev / Next Controls */}
                        {photos.length > 1 && (
                          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                            <button
                              onClick={() => {
                                const nextIdx = (currentPhotoIdx - 1 + photos.length) % photos.length;
                                setActivePhotoIndices(prev => ({ ...prev, [unit.id]: nextIdx }));
                              }}
                              className="pointer-events-auto w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                            >
                              <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                            </button>
                            <button
                              onClick={() => {
                                const nextIdx = (currentPhotoIdx + 1) % photos.length;
                                setActivePhotoIndices(prev => ({ ...prev, [unit.id]: nextIdx }));
                              }}
                              className="pointer-events-auto w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                            >
                              <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                            </button>
                          </div>
                        )}

                        {/* Title & Info Banner */}
                        <div className="absolute bottom-6 inset-x-6 text-white space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-primary/90 text-primary-foreground text-xs font-black px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
                              {unit.buildingName || unit.propertyName}
                            </span>
                            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                              {language === 'ar' ? `وحدة رقم ${unit.unitNumber}` : `Unit #${unit.unitNumber}`}
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                            {unit.propertyName} - {unit.unitNumber}
                          </h2>
                          {unit.address && (
                            <p className="text-xs sm:text-sm text-white/90 font-medium flex items-center gap-1.5 drop-shadow-xs">
                              <MapPin className="w-4 h-4 text-primary shrink-0" />
                              <span>{unit.address}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* APARTMENT SPECIFICATIONS & FEATURES GRID */}
                      <div className="p-6 md:p-8 space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-muted/50 p-4 rounded-2xl border border-border flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Maximize2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground font-bold">{language === 'ar' ? 'المساحة الإجمالية' : 'Total Area'}</p>
                              <p className="text-sm font-black text-foreground">{unit.area ? `${unit.area} م²` : 'غير محدد'}</p>
                            </div>
                          </div>

                          <div className="bg-muted/50 p-4 rounded-2xl border border-border flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                              <Bed className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground font-bold">{language === 'ar' ? 'عدد الغرف' : 'Bedrooms'}</p>
                              <p className="text-sm font-black text-foreground">{unit.rooms ? `${unit.rooms} غرف` : 'غير محدد'}</p>
                            </div>
                          </div>

                          <div className="bg-muted/50 p-4 rounded-2xl border border-border flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                              <Bath className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground font-bold">{language === 'ar' ? 'دورات المياه' : 'Bathrooms'}</p>
                              <p className="text-sm font-black text-foreground">{unit.bathrooms ? `${unit.bathrooms} حمام` : 'غير محدد'}</p>
                            </div>
                          </div>

                          <div className="bg-muted/50 p-4 rounded-2xl border border-border flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[11px] text-muted-foreground font-bold">{language === 'ar' ? 'رقم الدور' : 'Floor'}</p>
                              <p className="text-sm font-black text-foreground">{unit.floor ? `الدور ${unit.floor}` : 'الفيلا / الأرضي'}</p>
                            </div>
                          </div>
                        </div>

                        {/* FEATURES BADGES */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>{language === 'ar' ? 'مزايا وتجهيزات العقار' : 'Amenities & Features'}</span>
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {featuresList.map((feat, fIdx) => (
                              <span key={fIdx} className="bg-card border border-border text-foreground px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{feat}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* BIG BUTTONS FOR QUICK ACCESS (rendered when in home view) */}
          {renterViewTab === 'home' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Big Button 1: Submit Maintenance */}
              <button
                onClick={() => {
                  setRenterViewTab('maintenance-new');
                  setMaintenanceActiveTab('new');
                  setIsMaintenanceModalOpen(true);
                }}
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
                onClick={() => {
                  setRenterViewTab('maintenance-list');
                  setMaintenanceActiveTab('list');
                  setIsMaintenanceModalOpen(true);
                }}
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
                onClick={() => setRenterViewTab('payments')}
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
                onClick={() => setRenterViewTab('apartment')}
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
          )}

          {/* RENT PAYMENT HISTORY SECTION */}
          {renterViewTab === 'payments' && (
            <div id="payments-section" className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8 space-y-6">
              {!units || units.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed">
                  <p className="text-sm font-bold">{language === 'ar' ? 'لم يتم ربط عقار بحسابك حتى الآن' : 'No Property Connected Yet'}</p>
                </div>
              ) : (
                units.map((unit, uIdx) => (
                  <div key={unit.id || uIdx} className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                      <div>
                        <h3 className="text-xl font-black flex items-center gap-2 text-foreground">
                          <CreditCard className="w-6 h-6 text-emerald-600" />
                          <span>{language === 'ar' ? `سجل الدفعات والإيصالات - ${unit.propertyName} (وحدة ${unit.unitNumber})` : `Payment History - ${unit.propertyName} (Unit ${unit.unitNumber})`}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {language === 'ar' ? 'متابعة مواعيد استحقاق الإيجارات ورفع إيصالات التحويل البنكي' : 'Track rent due dates and upload bank payment transfer receipts'}
                        </p>
                      </div>
                      <span className="text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold px-3 py-1 rounded-full w-fit">
                        {unit.rentHistory?.length || 0} {language === 'ar' ? 'دفعات مسجلة' : 'Payments Recorded'}
                      </span>
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

                    {/* RENT PAYMENT HISTORY CARDS */}
                    {unit.rentHistory && unit.rentHistory.length > 0 ? (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                        {unit.rentHistory.map((h, hIdx) => {
                          const amountStr = typeof h.amount === 'string' ? h.amount : (h.amount?.toString() || '');
                          const {
                            isCourt,
                            isLate,
                            isPaid,
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
                ))
              )}
            </div>
          )}

          {/* SECTION 2: MAINTENANCE CENTER HUB */}
          {(renterViewTab === 'maintenance-new' || renterViewTab === 'maintenance-list' || isMaintenanceModalOpen) && (
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
                  
                  {/* Select Rented Property / Unit */}
                  {units && units.length > 0 && (
                    <div className="bg-muted/40 border border-border rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span>{language === 'ar' ? 'اختر العقار / الوحدة السكنية المعنية بالبلاغ:' : 'Select Target Rented Property / Unit:'}</span>
                        </label>
                        <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">
                          {language === 'ar' ? `${units.length} وحدة مسجلة` : `${units.length} Unit(s)`}
                        </span>
                      </div>

                      {/* Interactive Unit Picker Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {units.map((u) => {
                          const activeUnitId = selectedUnitForReport || (units.length > 0 ? units[0].id : '');
                          const isSelected = activeUnitId === u.id;
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => setSelectedUnitForReport(u.id)}
                              className={`p-4 rounded-xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected 
                                  ? 'bg-card border-primary ring-2 ring-primary/30 shadow-md' 
                                  : 'bg-background hover:bg-card border-border text-muted-foreground'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-black text-sm ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                                    {u.propertyName}
                                  </span>
                                  <span className="bg-primary/10 text-primary font-bold text-xs px-2 py-0.5 rounded-md">
                                    {language === 'ar' ? `وحدة ${u.unitNumber}` : `Unit ${u.unitNumber}`}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                  <span>{language === 'ar' ? `الدور: ${u.floor || '1'}` : `Floor: ${u.floor || '1'}`}</span>
                                  <span>•</span>
                                  <span>{language === 'ar' ? `${u.area || 120} م²` : `${u.area || 120} m²`}</span>
                                </p>
                              </div>

                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                isSelected ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-muted/50'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
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
                  
                  {/* Status & Unit Filter Header */}
                  <div className="flex items-center justify-between flex-wrap gap-3 bg-muted/40 p-3.5 rounded-2xl border border-border">
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Status Filters */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Filter className="w-3.5 h-3.5" />
                          {language === 'ar' ? 'الحالة:' : 'Status:'}
                        </span>
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(st => (
                            <button
                              key={st}
                              onClick={() => setReportStatusFilter(st)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${reportStatusFilter === st ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted'}`}
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

                      {/* Unit Filter if multiple */}
                      {units && units.length > 1 && (
                        <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-r rtl:sm:border-r-0 rtl:sm:border-l border-border pt-2 sm:pt-0 pr-0 sm:pr-4 rtl:sm:pl-4">
                          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {language === 'ar' ? 'الوحدة:' : 'Unit:'}
                          </span>
                          <select
                            value={reportUnitFilter}
                            onChange={(e) => setReportUnitFilter(e.target.value)}
                            className="bg-card border border-border rounded-xl px-2.5 py-1 text-xs font-bold text-foreground outline-none cursor-pointer"
                          >
                            <option value="ALL">{language === 'ar' ? 'جميع الوحدات' : 'All Units'}</option>
                            {units.map(u => (
                              <option key={u.id} value={u.id}>
                                {u.propertyName} - {language === 'ar' ? `وحدة ${u.unitNumber}` : `Unit ${u.unitNumber}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
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
                        .filter(r => (reportStatusFilter === 'ALL' || r.status === reportStatusFilter) && (reportUnitFilter === 'ALL' || r.renterUnit?.id === reportUnitFilter))
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
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-black text-sm text-foreground">{language === 'ar' ? catObj.nameAr : catObj.nameEn}</span>
                                      {report.renterUnit && (
                                        <span className="bg-primary/10 border border-primary/20 text-primary font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                          <Building2 className="w-3 h-3" />
                                          <span>{report.renterUnit.building?.name || 'عقار'}</span>
                                          <span>•</span>
                                          <span>{language === 'ar' ? `وحدة ${report.renterUnit.unitNumber}` : `Unit ${report.renterUnit.unitNumber}`}</span>
                                        </span>
                                      )}
                                      <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                        #{report.requestCode || report.id.substring(0, 8)}
                                      </span>
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

                              {/* ASSIGNED TECHNICIAN & APPOINTMENT BLOCK */}
                              {report.technicianName && (
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                                      <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-black text-xs text-amber-950 dark:text-amber-100 flex items-center gap-1">
                                        <span>{language === 'ar' ? 'الفني المعين:' : 'Assigned Technician:'}</span>
                                        <span className="text-sm">{report.technicianName}</span>
                                      </p>
                                      {report.scheduledDate && (
                                        <p className="text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1 mt-0.5">
                                          <Clock className="w-3 h-3" />
                                          <span>{language === 'ar' ? 'موعد الزيارة:' : 'Visit:'} {new Date(report.scheduledDate).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {report.technicianPhone && (
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`https://wa.me/${report.technicianPhone.replace(/\D/g, '')}?text=${encodeURIComponent(language === 'ar' ? `مرحباً، أنا المستأجر بخصوص بلاغ الصيانة #${report.id.substring(0, 8)}` : `Hello, I am the tenant regarding maintenance report #${report.id.substring(0, 8)}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                                      >
                                        <WhatsAppIcon className="w-4 h-4 fill-current" />
                                        <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                                      </a>
                                      <a
                                        href={`tel:${report.technicianPhone}`}
                                        className="bg-card border border-border text-foreground hover:bg-muted text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                                      >
                                        <Phone className="w-3.5 h-3.5 text-primary" />
                                        <span>{language === 'ar' ? 'اتصال' : 'Call'}</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}

                               {/* COSTS & FINANCIAL STATEMENT BLOCK FOR TENANT */}
                               {(report.estimatedCost || report.actualCost || report.receiptUrl || report.expenses) && (
                                 <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                   <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-2">
                                     <div className="flex items-center gap-2">
                                       <DollarSign className="w-4 h-4 text-emerald-600" />
                                       <span className="font-extrabold text-xs text-foreground">
                                         {language === 'ar' ? 'كشف حساب وسندات مصاريف الصيانة:' : 'Maintenance Expenses & Receipts Ledger:'}
                                       </span>
                                     </div>

                                     {/* Overall Payer Responsibility Badge */}
                                     {report.costPayer === 'RENTER' ? (
                                       <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-extrabold rounded-xl">
                                         {language === 'ar' ? 'مستحقة على المستأجر' : 'Owed by Tenant'}
                                       </span>
                                     ) : (
                                       <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-extrabold rounded-xl">
                                         {language === 'ar' ? 'مغطاة بالكامل بواسطة المالك / إدارة الأملاك' : 'Fully Covered by Management'}
                                       </span>
                                     )}
                                   </div>

                                   <div className="flex items-center justify-between flex-wrap gap-3 text-xs">
                                     <div className="flex items-center gap-4 flex-wrap">
                                       {report.estimatedCost && (
                                         <div>
                                           <span className="text-muted-foreground font-bold">{language === 'ar' ? 'التكلفة التقديرية:' : 'Est. Cost:'}</span>
                                           <span className="font-black text-foreground ml-1">{report.estimatedCost} ريال</span>
                                         </div>
                                       )}
                                       {report.actualCost !== null && report.actualCost !== undefined && (
                                         <div>
                                           <span className="text-muted-foreground font-bold">{language === 'ar' ? 'إجمالي التكلفة الشاملة:' : 'Actual Gross Total:'}</span>
                                           <span className="font-black text-emerald-600 dark:text-emerald-400 ml-1 text-sm">{report.actualCost} ريال</span>
                                         </div>
                                       )}
                                     </div>
                                   </div>

                                   {/* Multi-Receipt Expenses List */}
                                   {(() => {
                                     let exps: any[] = [];
                                     try { exps = report.expenses ? JSON.parse(report.expenses) : []; } catch (_) {}
                                     if (Array.isArray(exps) && exps.length > 0) {
                                       return (
                                         <div className="pt-2 border-t border-border/50 space-y-2">
                                           <span className="text-[11px] font-bold text-muted-foreground">{language === 'ar' ? 'تفاصيل السندات والإيصالات المرفقة:' : 'Itemized Receipt Charges:'}</span>
                                           <div className="space-y-1.5">
                                             {exps.map((exp: any, eIdx: number) => (
                                               <div key={eIdx} className="flex justify-between items-center bg-background p-2.5 rounded-xl text-xs border border-border/50 flex-wrap gap-2">
                                                 <div className="flex items-center gap-2">
                                                   {exp.receiptUrl && (
                                                     <button
                                                       type="button"
                                                       onClick={() => setLightboxImage(exp.receiptUrl)}
                                                       className="w-9 h-9 rounded-lg overflow-hidden border border-border shrink-0 cursor-pointer"
                                                       title={language === 'ar' ? 'عرض صوة الإيصال' : 'View Receipt'}
                                                     >
                                                       <img src={exp.receiptUrl} alt="Receipt" className="w-full h-full object-cover" />
                                                     </button>
                                                   )}
                                                   <div>
                                                     <p className="font-extrabold text-foreground">{exp.title}</p>
                                                     <p className="text-[9.5px] text-muted-foreground">{exp.category} {exp.vendorName ? `• ${exp.vendorName}` : ''}</p>
                                                   </div>
                                                 </div>

                                                 <div className="flex items-center gap-2">
                                                   <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${
                                                     exp.costPayer === 'RENTER' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                                                   }`}>
                                                     {exp.costPayer === 'RENTER' ? 'المستأجر' : 'مغطاة من المالك'}
                                                   </span>
                                                   <span className="font-mono font-black text-primary text-xs">{Number(exp.totalAmount || 0).toFixed(2)} SAR</span>
                                                 </div>
                                               </div>
                                             ))}
                                           </div>
                                         </div>
                                       );
                                     }
                                     return null;
                                   })()}
                                 </div>
                               )}

                              {/* WORK COMPLETION PROOF PHOTOS */}
                              {parseReportImages(report.proofImages).length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{language === 'ar' ? 'صور إثبات إنجاز صيانة العطل:' : 'Work Completion Proof Photos:'}</span>
                                  </h4>
                                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                    {parseReportImages(report.proofImages).map((proofImg, pIdx) => (
                                      <button
                                        key={pIdx}
                                        onClick={() => setLightboxImage(proofImg)}
                                        className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/30 hover:scale-105 transition-transform shrink-0 cursor-pointer"
                                      >
                                        <img src={proofImg} alt="Completion Proof" className="w-full h-full object-cover" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* DIRECT CHAT & RATING ACTION BUTTONS */}
                              <div className="flex items-center justify-between pt-2 border-t border-border flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => setRenterChatReport(report)}
                                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{language === 'ar' ? 'محادثة مباشرة مع الفني والإدارة' : 'Direct Chat with Tech & Support'}</span>
                                  {(report.messages?.length || 0) > 0 && (
                                    <span className="bg-primary text-primary-foreground font-black text-[10px] px-2 py-0.5 rounded-full">
                                      {report.messages?.length}
                                    </span>
                                  )}
                                </button>

                                {report.status === 'COMPLETED' && (
                                  <div>
                                    {report.rating ? (
                                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-2xl text-xs font-bold">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span>{report.rating} / 5</span>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => { setRatingReportId(report.id); setRatingValue(5); setRatingFeedback(''); }}
                                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md"
                                      >
                                        <Star className="w-4 h-4" />
                                        <span>{language === 'ar' ? 'تقييم خدمة الصيانة' : 'Rate Service'}</span>
                                      </button>
                                    )}
                                  </div>
                                )}
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

          {/* RENTER RATING MODAL */}
          {ratingReportId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span>{language === 'ar' ? 'تقييم خدمة الصيانة' : 'Rate Maintenance Service'}</span>
                  </h3>
                  <button onClick={() => setRatingReportId(null)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'كيف كانت تجربتك مع الفني وإنجاز العمل؟' : 'How was your experience with the technician and repair quality?'}</p>
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingValue(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star className={`w-8 h-8 ${star <= ratingValue ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <textarea
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب انطباعك أو أي ملاحظات حول الخدمة...' : 'Write your feedback or notes...'}
                    className="w-full bg-background border border-border rounded-2xl p-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRatingReportId(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-muted cursor-pointer"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmitRating(ratingReportId)}
                    disabled={submittingRating}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {submittingRating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{language === 'ar' ? 'إرسال التقييم' : 'Submit Rating'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RENTER DIRECT CHAT MODAL */}
          {renterChatReport && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span>{language === 'ar' ? 'محادثة الصيانة المباشرة' : 'Maintenance Ticket Chat'}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      #{renterChatReport.requestCode || renterChatReport.id.substring(0, 8)} - {renterChatReport.renterUnit?.building?.name || 'عقار'} (وحدة {renterChatReport.renterUnit?.unitNumber})
                    </p>
                  </div>
                  <button onClick={() => setRenterChatReport(null)} className="p-2 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-background max-h-[420px]">
                  {(!renterChatReport.messages || renterChatReport.messages.length === 0) ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-primary" />
                      <p className="text-xs font-bold">{language === 'ar' ? 'لا يوجد رسائل سابقة. أرسل استفسارك للفني والإدارة.' : 'No messages yet. Send a message to team.'}</p>
                    </div>
                  ) : (
                    renterChatReport.messages.map((msg) => {
                      const isMe = msg.senderRole === 'RENTER';
                      const msgImgs = parseReportImages(msg.attachments);

                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-1 text-[11px] text-muted-foreground">
                            <span className="font-bold text-foreground">{msg.senderName}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              isMe ? 'bg-primary/10 text-primary' : msg.senderRole === 'TECHNICIAN' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'
                            }`}>
                              {isMe ? (language === 'ar' ? 'أنت' : 'You') : msg.senderRole === 'TECHNICIAN' ? (language === 'ar' ? 'الفني' : 'Tech') : (language === 'ar' ? 'الإدارة' : 'Admin')}
                            </span>
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className={`p-3.5 rounded-2xl max-w-md text-xs space-y-2 ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-tl-none' 
                              : 'bg-muted/70 text-foreground border border-border rounded-tr-none'
                          }`}>
                            <p className="whitespace-pre-wrap leading-relaxed m-0 font-medium">{msg.message}</p>
                            {msgImgs.length > 0 && (
                              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                                {msgImgs.map((attachment, aIdx) => (
                                  <button
                                    key={aIdx}
                                    type="button"
                                    onClick={() => setLightboxImage(attachment)}
                                    className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 shrink-0 cursor-pointer"
                                  >
                                    <img src={attachment} alt="" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSendRenterMessage} className="p-3 border-t border-border bg-card space-y-2">
                  {renterChatAttachments.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {renterChatAttachments.map((img, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setRenterChatAttachments(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="p-2 text-muted-foreground hover:text-primary rounded-xl hover:bg-muted cursor-pointer transition-colors shrink-0">
                      <input type="file" accept="image/*" multiple onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        Array.from(files).forEach(f => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (typeof ev.target?.result === 'string') {
                              setRenterChatAttachments(prev => [...prev, ev.target!.result as string]);
                            }
                          };
                          reader.readAsDataURL(f as File);
                        });
                        e.target.value = '';
                      }} className="hidden" />
                      <ImageIcon className="w-4 h-4" />
                    </label>

                    <input
                      type="text"
                      value={renterChatMessage}
                      onChange={(e) => setRenterChatMessage(e.target.value)}
                      placeholder={language === 'ar' ? 'اكتب تفاصيل الاستفسار أو التنسيق مع الفني...' : 'Type message to team...'}
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                    />

                    <button
                      type="submit"
                      disabled={sendingRenterMessage || (!renterChatMessage.trim() && renterChatAttachments.length === 0)}
                      className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {sendingRenterMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>{language === 'ar' ? 'إرسال' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              </div>
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
