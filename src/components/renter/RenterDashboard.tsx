import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useLanguage } from '../../LanguageContext';
import { useDialog } from '../../context/DialogContext';
import { 
  Building2, Calendar, FileText, ChevronLeft, ChevronRight, 
  CreditCard, History, Landmark, CheckCircle2, UploadCloud, Loader2, Eye, 
  Wrench, Plus, X, Image as ImageIcon, Clock, XCircle, MessageSquare, Bed, Bath, 
  Maximize2, ShieldCheck, MapPin, Sparkles, Send, Check, CheckCheck, Filter, Star, DollarSign, LogOut, Phone
} from 'lucide-react';
import { getRentStatus } from '../../utils/rentStatus';

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

export interface RentHistory {
  id: string;
  dueDate: string;
  paidDate: string;
  amount: string;
  receiptUrl: string | null;
}

export interface RenterUnit {
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

export interface MaintenanceMessage {
  id: string;
  senderRole: 'RENTER' | 'ADMIN' | 'TECHNICIAN';
  senderName: string;
  message: string;
  attachments: string;
  isRead: boolean;
  createdAt: string;
}

export interface MaintenanceLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

export interface MaintenanceReport {
  id: string;
  requestCode?: string | null;
  description: string;
  category?: string;
  priority?: string;
  images: string;
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
  proofImages?: string;
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
  { id: 'CLEANING', nameAr: 'نظافة', nameEn: 'Cleaning', icon: '🧹' },
  { id: 'ELEVATOR', nameAr: 'مصاعد ومرافق', nameEn: 'Elevator & Facilities', icon: '🏢' },
  { id: 'GENERAL', nameAr: 'صيانة عامة', nameEn: 'General Repair', icon: '🔧' },
];

const MAINTENANCE_PRIORITIES = [
  { id: 'NORMAL', nameAr: 'عادي (خلال 24-48 ساعة)', nameEn: 'Normal (24-48 hrs)', badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  { id: 'URGENT', nameAr: 'هام (خلال 12 ساعة)', nameEn: 'Urgent (12 hrs)', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  { id: 'EMERGENCY', nameAr: 'طارئ جداً (فوري)', nameEn: 'Emergency (Immediate)', badgeClass: 'bg-red-500/10 text-red-600 border-red-200 animate-pulse' },
];

interface RenterDashboardProps {
  units: RenterUnit[];
  phoneNumber: string;
  onLogout: () => void;
}

export default function RenterDashboard({ units, phoneNumber, onLogout }: RenterDashboardProps) {
  const { language } = useLanguage();
  const { showAlert } = useDialog();

  // Active view tab: 'home' | 'apartment' | 'maintenance-new' | 'maintenance-list' | 'payments'
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

  // Uploading Receipt State
  const [uploadingReceiptFor, setUploadingReceiptFor] = useState<string | null>(null);

  const fetchMaintenanceReports = (phoneNum: string) => {
    if (!phoneNum) return;
    fetch(`/api/renter/maintenance-reports?phone=${encodeURIComponent(phoneNum)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setMaintenanceReportsList(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchMaintenanceReports(phoneNumber);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (units && units.length > 0 && !selectedUnitForReport) {
      setSelectedUnitForReport(units[0].id);
    }
  }, [units, selectedUnitForReport]);

  const handleSendRenterMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renterChatReport || (!renterChatMessage.trim() && renterChatAttachments.length === 0)) return;

    setSendingRenterMessage(true);
    try {
      const isGenericOrCategoryName = (name?: string | null) => {
        if (!name || !name.trim()) return true;
        const lower = name.trim().toLowerCase();
        return lower === 'المستأجر' || lower === 'renter' || lower === 'customer' || lower.includes('آفات') || lower.includes('سباكة') || lower.includes('كهرباء') || lower.includes('تكييف') || lower.includes('مصاعد') || lower.includes('نظافة');
      };

      const resolvedRenterName = [
        renterChatReport?.renter?.name,
        renterChatReport?.renterUnit?.renterName,
        (units && units.length > 0 ? units[0].renterName : null)
      ].find(n => n && !isGenericOrCategoryName(n)) || (language === 'ar' ? 'المستأجر' : 'Renter');

      const res = await fetch(`/api/maintenance-reports/${renterChatReport.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: 'RENTER',
          senderName: resolvedRenterName,
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

  // Real-time WebSocket connection & 3-second auto-poll sync in Renter Portal
  useEffect(() => {
    if (!renterChatReport) return;

    const reportId = renterChatReport.id;

    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    socket.emit('join_ticket', reportId);
    if (renterChatReport.requestCode) {
      socket.emit('join_ticket', renterChatReport.requestCode);
    }

    const pollFreshMessages = () => {
      fetch(`/api/maintenance-reports/${reportId}`)
        .then(res => res.ok ? res.json() : null)
        .then(fresh => {
          if (!fresh || !fresh.messages) return;
          setRenterChatReport(prev => {
            if (!prev || prev.id !== reportId) return prev;
            const existingIds = new Set((prev.messages || []).map(m => m.id));
            const hasNew = fresh.messages.some((m: any) => !existingIds.has(m.id));
            return hasNew ? fresh : prev;
          });

          setMaintenanceReportsList(prev =>
            prev.map(r => r.id === reportId ? fresh : r)
          );
        })
        .catch(() => {});
    };

    fetch(`/api/maintenance-reports/${reportId}/messages/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'RENTER' })
    }).catch(() => {});

    socket.on('new_message', (newMessage: any) => {
      if (!newMessage || (newMessage.reportId !== reportId && newMessage.reportId !== renterChatReport.requestCode)) return;

      setRenterChatReport((prev) => {
        if (!prev) return prev;
        const msgs = prev.messages || [];
        if (!msgs.some((m) => m.id === newMessage.id)) {
          return { ...prev, messages: [...msgs, newMessage] };
        }
        return prev;
      });

      setMaintenanceReportsList((prev) =>
        prev.map((r) => {
          if (r.id === reportId || r.id === renterChatReport.requestCode) {
            const msgs = r.messages || [];
            if (!msgs.some((m) => m.id === newMessage.id)) {
              return { ...r, messages: [...msgs, newMessage] };
            }
          }
          return r;
        })
      );
    });

    socket.on('messages_read', (data: { reportId: string }) => {
      if (data && (data.reportId === reportId || data.reportId === renterChatReport.requestCode)) {
        setRenterChatReport((prev) => {
          if (!prev) return prev;
          const msgs = (prev.messages || []).map((m) => ({ ...m, isRead: true }));
          return { ...prev, messages: msgs };
        });
        setMaintenanceReportsList((prev) =>
          prev.map((r) => {
            if (r.id === reportId || r.id === renterChatReport.requestCode) {
              const msgs = (r.messages || []).map((m) => ({ ...m, isRead: true }));
              return { ...r, messages: msgs };
            }
            return r;
          })
        );
      }
    });

    const pollInterval = setInterval(pollFreshMessages, 3000);

    return () => {
      clearInterval(pollInterval);
      socket.disconnect();
    };
  }, [renterChatReport?.id]);

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

  const handleUploadReceipt = async (historyId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      await showAlert(language === 'ar' ? 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت' : 'File size must be less than 5MB');
      return;
    }

    setUploadingReceiptFor(historyId);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const receiptUrl = await base64Promise;

      const res = await fetch(`/api/renter/upload-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId, receiptUrl })
      });

      if (res.ok) {
        await fetchMaintenanceReports(phoneNumber);
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

  const renderMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="property-tag-amber gap-1">
            <Clock className="w-3.5 h-3.5" />
            {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="property-tag gap-1">
            <Wrench className="w-3.5 h-3.5" />
            {language === 'ar' ? 'جاري المعالجة' : 'In Progress'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="property-tag-emerald gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === 'ar' ? 'مكتمل' : 'Completed'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="property-tag-rose gap-1">
            <XCircle className="w-3.5 h-3.5" />
            {language === 'ar' ? 'ملغى' : 'Cancelled'}
          </span>
        );
      default:
        return null;
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

          <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
            <button
              onClick={() => openMaintenanceModal('new')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'بلاغ صيانة جديد' : 'New Maintenance Report'}</span>
            </button>

            <button
              onClick={onLogout}
              className="bg-card hover:bg-muted text-muted-foreground border border-border text-xs font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-destructive" />
              <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TAB BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setRenterViewTab('home')}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-2 ${renterViewTab === 'home' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
          >
            <Building2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'لوحة التحكم والملخص' : 'Overview Dashboard'}</span>
          </button>

          <button
            onClick={() => setRenterViewTab('apartment')}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-2 ${renterViewTab === 'apartment' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
          >
            <Bed className="w-4 h-4" />
            <span>{language === 'ar' ? 'شقتي والعقد' : 'My Apartment & Lease'}</span>
          </button>

          <button
            onClick={() => openMaintenanceModal('list')}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-2 relative ${renterViewTab === 'maintenance-list' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
          >
            <Wrench className="w-4 h-4" />
            <span>{language === 'ar' ? 'بلاغات الصيانة' : 'Maintenance Tickets'}</span>
            {openReportsCount > 0 && (
              <span className="bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                {openReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setRenterViewTab('payments')}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-2 ${renterViewTab === 'payments' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground hover:bg-muted'}`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{language === 'ar' ? 'سجل السداد والمالية' : 'Payments & Ledger'}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD & UNITS GRID */}
        {renterViewTab === 'home' && (
          <div className="space-y-8">
            {units.map((unit) => {
              const photos = parsePhotos(unit.photos || unit.buildingPhotos);
              const activeIdx = activePhotoIndices[unit.id] || 0;
              const rentInfo = getRentStatus({ dueDate: unit.nextRentDue || unit.contractEndDate, amount: unit.rentAmount || undefined }, language);

              return (
                <div key={unit.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm space-y-0">
                  
                  {/* PROPERTY TITLE BAR */}
                  <div className="p-6 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-black text-foreground">{unit.propertyName}</h2>
                        <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-black px-3 py-1 rounded-full">
                          {language === 'ar' ? `وحدة رقم ${unit.unitNumber}` : `Unit #${unit.unitNumber}`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{language === 'ar' ? 'الرياض - حي الياسمين' : 'Riyadh - Al Yasmin District'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => openMaintenanceModal('new', unit.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Wrench className="w-4 h-4" />
                        <span>{language === 'ar' ? 'طلب صيانة لهذه الوحدة' : 'Request Maintenance'}</span>
                      </button>
                    </div>
                  </div>

                  {/* GALLERY & DETAILS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse border-b border-border">
                    
                    {/* GALLERY CAROUSEL */}
                    <div className="lg:col-span-6 p-6 space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-border group bg-black/5 shadow-inner">
                        <img 
                          src={photos[activeIdx]} 
                          alt="Apartment Main View" 
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" 
                        />
                        <button
                          onClick={() => setLightboxImage(photos[activeIdx])}
                          className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer hover:bg-black/80"
                          title={language === 'ar' ? 'تكبير الصورة' : 'Enlarge Photo'}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {photos.length > 1 && (
                        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                          {photos.map((img, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => setActivePhotoIndices(prev => ({ ...prev, [unit.id]: pIdx }))}
                              className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${activeIdx === pIdx ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-border opacity-70 hover:opacity-100'}`}
                            >
                              <img src={img} alt={`Thumb ${pIdx+1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SPECS & LEASE OVERVIEW */}
                    <div className="lg:col-span-6 p-6 space-y-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span>{language === 'ar' ? 'مواصفات وتفاصيل العقار:' : 'Property Specifications:'}</span>
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="bg-muted/30 border border-border/80 p-3 rounded-2xl space-y-1">
                            <span className="text-[11px] text-muted-foreground font-bold block">{language === 'ar' ? 'غرف النوم' : 'Bedrooms'}</span>
                            <p className="text-sm font-black text-foreground flex items-center gap-1.5">
                              <Bed className="w-4 h-4 text-primary" />
                              <span>{unit.bedrooms || 2} {language === 'ar' ? 'غرف' : 'Rooms'}</span>
                            </p>
                          </div>

                          <div className="bg-muted/30 border border-border/80 p-3 rounded-2xl space-y-1">
                            <span className="text-[11px] text-muted-foreground font-bold block">{language === 'ar' ? 'دورات المياه' : 'Bathrooms'}</span>
                            <p className="text-sm font-black text-foreground flex items-center gap-1.5">
                              <Bath className="w-4 h-4 text-primary" />
                              <span>{unit.bathrooms || 2} {language === 'ar' ? 'حمامات' : 'Baths'}</span>
                            </p>
                          </div>

                          <div className="bg-muted/30 border border-border/80 p-3 rounded-2xl space-y-1">
                            <span className="text-[11px] text-muted-foreground font-bold block">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                            <p className="text-sm font-black text-foreground flex items-center gap-1.5">
                              <Maximize2 className="w-4 h-4 text-primary" />
                              <span>{unit.area || 120} م²</span>
                            </p>
                          </div>
                        </div>

                        {/* RENT STATUS CARD */}
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-foreground">{language === 'ar' ? 'حالة القسط القادم:' : 'Next Rent Due Status:'}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${rentInfo.isPaid ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : rentInfo.isDue ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                              {rentInfo.statusText}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                            <span>{language === 'ar' ? 'تاريخ استحقاق الإيجار:' : 'Due Date:'}</span>
                            <span className="font-mono font-black text-foreground">
                              {unit.nextRentDue ? new Date(unit.nextRentDue).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : (language === 'ar' ? 'محدد بعقد إيجار' : 'Lease Agreed')}
                            </span>
                          </div>

                          {unit.rentAmount && (
                            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pt-1 border-t border-primary/10">
                              <span>{language === 'ar' ? 'قيمة الدفعة:' : 'Installment Amount:'}</span>
                              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                {unit.rentAmount.toLocaleString()} SAR
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: MY APARTMENT & LEASE DETAILS */}
        {renterViewTab === 'apartment' && (
          <div className="space-y-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-xl font-black text-foreground">{unit.propertyName} - وحدة {unit.unitNumber}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{language === 'ar' ? 'عقد إيجار موثق عبر منصة إيجار الإلكترونية' : 'Verified Lease Agreement via Ejar'}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'ar' ? 'عقد ساري المفعول' : 'Active Lease'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 bg-muted/20 p-5 rounded-2xl border border-border/80">
                    <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{language === 'ar' ? 'تواريخ العقد والاستحقاق:' : 'Lease Dates:'}</span>
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-border/60">
                        <span className="text-muted-foreground font-bold">{language === 'ar' ? 'تاريخ نهاية العقد:' : 'Contract End Date:'}</span>
                        <span className="font-mono font-black text-foreground">{new Date(unit.contractEndDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border/60">
                        <span className="text-muted-foreground font-bold">{language === 'ar' ? 'تاريخ الدفعة القادمة:' : 'Next Payment Due:'}</span>
                        <span className="font-mono font-black text-primary">{unit.nextRentDue ? new Date(unit.nextRentDue).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US') : '-'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground font-bold">{language === 'ar' ? 'قيمة الإيجار السنوي:' : 'Annual Rent Amount:'}</span>
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">{unit.rentAmount ? `${unit.rentAmount.toLocaleString()} SAR` : '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 bg-muted/20 p-5 rounded-2xl border border-border/80">
                    <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-primary" />
                      <span>{language === 'ar' ? 'معلومات التحويل والأنظمة:' : 'Transfer Details:'}</span>
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {unit.transferDetails || (language === 'ar' ? 'يتم السداد حصراً عبر الحساب البنكي الرسمي لشركة بناء وإدارة للعقارات الموضحة في عقد إيجار.' : 'Payments made officially to Benaa & Edara Real Estate accounts.')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PAYMENTS & FINANCIAL LEDGER */}
        {renterViewTab === 'payments' && (
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>{language === 'ar' ? 'سجل الدفعات والفواتير' : 'Payment Receipts & Ledger'}</span>
              </h2>
            </div>

            {units.map((unit) => (
              <div key={unit.id} className="space-y-4">
                <h3 className="text-sm font-black text-foreground">{unit.propertyName} (وحدة {unit.unitNumber})</h3>

                {(!unit.rentHistory || unit.rentHistory.length === 0) ? (
                  <p className="text-xs text-muted-foreground italic bg-muted/20 p-4 rounded-2xl border border-border">{language === 'ar' ? 'لا يوجد سجل دفعات سابق مسجل لهذه الوحدة.' : 'No payment history logged for this unit.'}</p>
                ) : (
                  <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-border">
                    <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground font-black border-b border-border">
                          <th className="p-3">{language === 'ar' ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                          <th className="p-3">{language === 'ar' ? 'تاريخ السداد' : 'Paid Date'}</th>
                          <th className="p-3">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                          <th className="p-3 text-center">{language === 'ar' ? 'إيصال السداد' : 'Receipt'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {unit.rentHistory.map((history) => (
                          <tr key={history.id} className="hover:bg-muted/20 transition-colors">
                            <td className="p-3 font-mono font-bold">{history.dueDate}</td>
                            <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{history.paidDate || (language === 'ar' ? 'تم السداد' : 'Paid')}</td>
                            <td className="p-3 font-mono font-black">{history.amount} SAR</td>
                            <td className="p-3 text-center">
                              {history.receiptUrl ? (
                                <button
                                  onClick={() => setLightboxImage(history.receiptUrl)}
                                  className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{language === 'ar' ? 'معاينة الإيصال' : 'View Receipt'}</span>
                                </button>
                              ) : (
                                <label className="px-3 py-1.5 bg-muted hover:bg-muted/80 border border-border rounded-xl text-xs font-bold cursor-pointer transition-colors inline-flex items-center gap-1">
                                  {uploadingReceiptFor === history.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5 text-primary" />}
                                  <span>{language === 'ar' ? 'رفع الإيصال' : 'Upload Receipt'}</span>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleUploadReceipt(history.id, e)}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MAINTENANCE REPORT MODAL */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 my-8">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground">{language === 'ar' ? 'مركز صيانة وبلاغات الأعطال' : 'Maintenance Portal'}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{language === 'ar' ? 'إرسال بلاغ جديد ومتابعة حالة المعالجة والتواصل المباشر' : 'Submit report and track maintenance status'}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Bar */}
            <div className="flex border-b border-border bg-muted/10 shrink-0">
              <button
                onClick={() => setMaintenanceActiveTab('new')}
                className={`flex-1 py-3 text-xs font-black border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${maintenanceActiveTab === 'new' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'ar' ? 'تقديم بلاغ جديد' : 'Submit New Report'}</span>
              </button>

              <button
                onClick={() => setMaintenanceActiveTab('list')}
                className={`flex-1 py-3 text-xs font-black border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${maintenanceActiveTab === 'list' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                <History className="w-4 h-4" />
                <span>{language === 'ar' ? 'بلاغاتي ومتابعة الردود' : 'My Requests & Status'}</span>
                {maintenanceReportsList.length > 0 && (
                  <span className="bg-primary/10 text-primary font-black text-[10px] px-2 py-0.5 rounded-full">
                    {maintenanceReportsList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* TAB 1: NEW REPORT FORM */}
              {maintenanceActiveTab === 'new' && (
                <form onSubmit={handleSubmitMaintenanceReport} className="space-y-6">
                  
                  {/* Select Unit */}
                  {units.length > 1 && (
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-2">{language === 'ar' ? 'اختر الوحدة السكنية' : 'Select Unit'}</label>
                      <select
                        value={selectedUnitForReport}
                        onChange={(e) => setSelectedUnitForReport(e.target.value)}
                        className="w-full bg-background border border-border rounded-2xl p-3 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        {units.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.propertyName} - {language === 'ar' ? `وحدة رقم ${u.unitNumber}` : `Unit #${u.unitNumber}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Category Selection Grid */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2">{language === 'ar' ? 'تصنيف العطل' : 'Category'}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {MAINTENANCE_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setMaintenanceCategory(cat.id)}
                          className={`p-3.5 rounded-2xl border text-xs font-bold text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex items-center gap-2.5 ${maintenanceCategory === cat.id ? 'bg-primary/10 border-primary text-primary shadow-2xs ring-1 ring-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted'}`}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Level */}
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-2">{language === 'ar' ? 'درجة الأولوية والأهمية' : 'Priority Level'}</label>
                    <div className="grid grid-cols-3 gap-3">
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
                          const catObj = MAINTENANCE_CATEGORIES.find(c => c.id === report.category) || MAINTENANCE_CATEGORIES[5];

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
          </div>
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
                            <div className={`flex items-center justify-end gap-1 text-[8.5px] font-mono pt-1 ${
                              isMe ? 'text-primary-foreground/75' : 'text-muted-foreground'
                            }`}>
                              <span>{new Date(msg.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                              {isMe && (
                                <span title={msg.isRead ? (language === 'ar' ? 'تمت القراءة' : 'Seen') : (language === 'ar' ? 'تم التسليم' : 'Delivered')}>
                                  {msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-sky-300 font-bold" /> : <Check className="w-3.5 h-3.5 opacity-70" />}
                                </span>
                              )}
                            </div>
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
                            <X className="w-3 3" />
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
  );
}
