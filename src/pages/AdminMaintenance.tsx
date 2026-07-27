import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Wrench, Search, Filter, CheckCircle2, Clock, AlertTriangle, XCircle, Building2, Phone, User, Image, ChevronLeft, ChevronRight, MessageSquare, Trash2, Loader2, Check } from 'lucide-react';
import { useDialog } from '../context/DialogContext';

interface MaintenanceReport {
  id: string;
  description: string;
  images: string; // JSON string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  adminResponse: string | null;
  createdAt: string;
  renter: {
    id: string;
    name: string;
    phone: string;
  };
  renterUnit: {
    id: string;
    unitNumber: string;
    building?: {
      id: string;
      name: string;
    };
  };
}

export default function AdminMaintenance({ buildingIdFilter }: { buildingIdFilter?: string }) {
  const { language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();

  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected report modal
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);
  const [adminResponseInput, setAdminResponseInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/maintenance-reports';
      const params = new URLSearchParams();
      if (buildingIdFilter) params.append('buildingId', buildingIdFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [buildingIdFilter, statusFilter]);

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/maintenance-reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: adminResponseInput
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedReport(updated);
        fetchReports();
        await showAlert(language === 'ar' ? 'تم تحديث حالة البلاغ بنجاح' : 'Report status updated');
      } else {
        await showAlert(language === 'ar' ? 'فشل التحديث' : 'Update failed');
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ في النظام' : 'System error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    const confirmed = await showConfirm(
      language === 'ar' ? 'هل أنت تأكد من حذف هذا البلاغ؟' : 'Are you sure you want to delete this report?'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/maintenance-reports/${reportId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (selectedReport?.id === reportId) setSelectedReport(null);
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parseImages = (jsonStr: string): string[] => {
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const filteredReports = reports.filter(r => {
    const query = search.toLowerCase();
    const renterName = (r.renter?.name || '').toLowerCase();
    const renterPhone = (r.renter?.phone || '').toLowerCase();
    const unitNumber = (r.renterUnit?.unitNumber || '').toLowerCase();
    const buildingName = (r.renterUnit?.building?.name || '').toLowerCase();
    const description = (r.description || '').toLowerCase();

    return (
      renterName.includes(query) ||
      renterPhone.includes(query) ||
      unitNumber.includes(query) ||
      buildingName.includes(query) ||
      description.includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Wrench className="w-3.5 h-3.5" />
            {language === 'ar' ? 'جاري المعالجة' : 'In Progress'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === 'ar' ? 'مكتمل' : 'Completed'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            {language === 'ar' ? 'ملغى' : 'Cancelled'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-6 h-6 text-primary" />
            {language === 'ar' ? 'بلاغات تقارير الصيانة' : 'Maintenance Reports'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' 
              ? 'متابعة وإدارة البلاغات والطلبات المقدمة من المستأجرين مع الصور والوصف' 
              : 'Manage maintenance reports submitted by renters with photos and descriptions'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="flex items-center gap-2 border border-border rounded-xl px-3 bg-background focus-within:ring-1 focus-within:ring-primary w-full sm:w-64 h-9">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، رقم الوحدة، المبنى...' : 'Search name, unit, building...'}
              className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="ALL">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="PENDING">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
              <option value="IN_PROGRESS">{language === 'ar' ? 'جاري المعالجة' : 'In Progress'}</option>
              <option value="COMPLETED">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
              <option value="CANCELLED">{language === 'ar' ? 'ملغى' : 'Cancelled'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table / List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-card border border-border rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl text-muted-foreground">
          <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
          <p className="text-sm font-bold">{language === 'ar' ? 'لا يوجد بلاغات صيانة مسجلة' : 'No maintenance reports found'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-2xl bg-card shadow-xs">
          <table className="w-full ltr:text-left rtl:text-right border-collapse text-xs">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground text-[11px] font-bold border-b border-border uppercase tracking-wider">
                <th className="p-4">{language === 'ar' ? 'المستأجر والتواصل' : 'Renter'}</th>
                <th className="p-4">{language === 'ar' ? 'المبنى والوحدة' : 'Building & Unit'}</th>
                <th className="p-4">{language === 'ar' ? 'وصف البلاغ' : 'Description'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'الصور المرفقة' : 'Images'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                <th className="p-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {filteredReports.map((report) => {
                const imgs = parseImages(report.images);
                return (
                  <tr key={report.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{report.renter?.name || 'مستأجر'}</p>
                          <p className="text-[11px] text-muted-foreground font-mono" dir="ltr">{report.renter?.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-primary" />
                          {report.renterUnit?.building?.name || 'مبنى غير مسمى'}
                        </p>
                        <p className="text-xs text-muted-foreground font-bold">
                          {language === 'ar' ? `وحدة رقم: ${report.renterUnit?.unitNumber}` : `Unit #${report.renterUnit?.unitNumber}`}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 text-xs text-foreground/90 font-normal">
                        {report.description}
                      </p>
                    </td>

                    <td className="p-4 text-center">
                      {imgs.length > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg text-xs font-bold text-foreground">
                          <Image className="w-3.5 h-3.5 text-primary" />
                          <span>{imgs.length} {language === 'ar' ? 'صور' : 'photos'}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">{language === 'ar' ? 'بدون صور' : 'No photos'}</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {getStatusBadge(report.status)}
                    </td>

                    <td className="p-4 text-center text-muted-foreground font-mono text-[11px]">
                      {new Date(report.createdAt).toLocaleDateString('ar-EG')}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReport(report);
                            setAdminResponseInput(report.adminResponse || '');
                            setActiveImageIdx(0);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                        >
                          {language === 'ar' ? 'التفاصيل والمعالجة' : 'Details & Action'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                          title={language === 'ar' ? 'حذف البلاغ' : 'Delete Report'}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  {language === 'ar' ? 'تفاصيل بلاغ الصيانة' : 'Maintenance Report Details'}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedReport.renterUnit?.building?.name} - {language === 'ar' ? `وحدة رقم: ${selectedReport.renterUnit?.unitNumber}` : `Unit #${selectedReport.renterUnit?.unitNumber}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl bg-muted/50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Renter info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
              <div>
                <span className="block text-[11px] text-muted-foreground font-bold">{language === 'ar' ? 'المستأجر:' : 'Renter:'}</span>
                <span className="font-bold text-foreground text-sm">{selectedReport.renter?.name}</span>
              </div>
              <div>
                <span className="block text-[11px] text-muted-foreground font-bold">{language === 'ar' ? 'رقم الجوال:' : 'Phone:'}</span>
                <span className="font-mono font-bold text-foreground text-sm" dir="ltr">{selectedReport.renter?.phone}</span>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{language === 'ar' ? 'تفاصيل ووصف المشكلة' : 'Issue Description'}</h4>
              <div className="p-4 rounded-2xl bg-background border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedReport.description}
              </div>
            </div>

            {/* Image Gallery */}
            {parseImages(selectedReport.images).length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase">{language === 'ar' ? 'الصور المرفقة (1-4)' : 'Attached Photos'}</h4>
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-border flex items-center justify-center">
                    <img 
                      src={parseImages(selectedReport.images)[activeImageIdx]} 
                      alt="Report attachment"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  {parseImages(selectedReport.images).length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {parseImages(selectedReport.images).map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeImageIdx === idx ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Selector & Admin Notes */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">
                  {language === 'ar' ? 'تحديث حالة البلاغ' : 'Update Status'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedReport.id, st)}
                      disabled={updatingStatus}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        selectedReport.status === st
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-border bg-background hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {st === 'PENDING' && <Clock className="w-4 h-4 text-amber-500" />}
                      {st === 'IN_PROGRESS' && <Wrench className="w-4 h-4 text-blue-500" />}
                      {st === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {st === 'CANCELLED' && <XCircle className="w-4 h-4 text-red-500" />}
                      <span>
                        {st === 'PENDING' ? (language === 'ar' ? 'انتظار' : 'Pending')
                          : st === 'IN_PROGRESS' ? (language === 'ar' ? 'معالجة' : 'In Progress')
                          : st === 'COMPLETED' ? (language === 'ar' ? 'مكتمل' : 'Completed')
                          : (language === 'ar' ? 'ملغى' : 'Cancelled')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2">
                  {language === 'ar' ? 'ملاحظات وتوجيهات الإدارة' : 'Admin Response / Notes'}
                </label>
                <textarea
                  value={adminResponseInput}
                  onChange={(e) => setAdminResponseInput(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتب أي توجيهات أو رد للمستأجر حول البلاغ...' : 'Write response notes for the renter...'}
                  className="cn-input text-xs min-h-[80px] p-3 bg-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-muted cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReport.id, selectedReport.status)}
                  disabled={updatingStatus}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer"
                >
                  {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{language === 'ar' ? 'حفظ الرد' : 'Save Response'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
