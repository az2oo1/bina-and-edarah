import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { FileText, Search, Clock, Shield, RefreshCw, Loader2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface ActionLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  createdAt: string;
}

export default function AdminLogs() {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      } else {
        setError(language === 'ar' ? 'فشل تحميل سجل العمليات' : 'Failed to fetch action logs');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs based on search term
  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Translate Action Types
  const getActionLabel = (action: string) => {
    if (language !== 'ar') return action;
    const mapping: Record<string, string> = {
      'ADD_PROPERTY': 'إضافة عقار',
      'UPDATE_PROPERTY': 'تعديل عقار',
      'DELETE_PROPERTY': 'حذف عقار',
      'ADD_PROJECT': 'إضافة مشروع',
      'UPDATE_PROJECT': 'تعديل مشروع',
      'DELETE_PROJECT': 'حذف مشروع',
      'UPDATE_SETTINGS': 'تحديث الإعدادات',
      'ADD_BUILDING': 'إضافة مبنى',
      'UPDATE_BUILDING': 'تعديل مبنى',
      'DELETE_BUILDING': 'حذف مبنى',
      'DELETE_UNIT': 'حذف وحدة مستأجر',
      'UPLOAD_BUILDING_JSON': 'رفع ملف بيانات Renter',
      'REPLY_CALLBACK': 'إضافة رد / ملاحظة',
      'UPDATE_CALLBACK_STATUS': 'تعديل حالة التواصل',
      'DELETE_CALLBACK': 'حذف طلب تواصل',
      'ADD_PLATFORM_USER': 'إنشاء مستخدم نظام',
      'UPDATE_PLATFORM_USER': 'تعديل مستخدم نظام',
      'DELETE_PLATFORM_USER': 'حذف مستخدم نظام',
      'DOWNLOAD_BACKUP': 'تنزيل نسخة احتياطية',
      'RESTORE_BACKUP': 'استعادة نسخة احتياطية',
    };
    return mapping[action] || action;
  };

  const getActionBadgeColor = (action: string) => {
    if (action.startsWith('ADD')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.startsWith('UPDATE')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (action.startsWith('DELETE')) return 'bg-red-50 text-red-700 border-red-200';
    if (action.includes('RESTORE')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {language === 'ar' ? 'سجل عمليات النظام (Audit Logs)' : 'System Audit Logs'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ar' ? 'متابعة سجل العمليات وتعديلات الموظفين بالتفصيل' : 'Monitor all staff activities, edits, additions, and updates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto ltr:pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث بالموظف، الإجراء، أو التفاصيل...' : 'Search by staff, action, detail...'}
              className={`block w-full bg-card border border-border rounded-lg py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
                language === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'
              }`}
            />
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="w-9 h-9 border border-border rounded-lg flex items-center justify-center bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={language === 'ar' ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs font-bold text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <span className="text-xs">{language === 'ar' ? 'جاري تحميل سجل العمليات...' : 'Loading system logs...'}</span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <FileText className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-sm font-semibold text-foreground">
            {language === 'ar' ? 'لا توجد سجلات تقع تحت نطاق البحث' : 'No matching audit logs found'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold">
                  <th className="px-6 py-4">{language === 'ar' ? 'الموظف / المسؤول' : 'Staff / User'}</th>
                  <th className="px-6 py-4">{language === 'ar' ? 'نوع العملية' : 'Action Type'}</th>
                  <th className="px-6 py-4">{language === 'ar' ? 'تفاصيل العملية' : 'Details'}</th>
                  <th className="px-6 py-4">{language === 'ar' ? 'التوقيت' : 'Timestamp'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div>{log.userName}</div>
                      <div className="text-[10px] text-muted-foreground font-normal mt-0.5 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-primary inline" />
                        <span>
                          {log.userRole === 'ADMIN' ? (language === 'ar' ? 'مسؤول نظام' : 'System Admin') : log.userRole === 'MANAGER' ? (language === 'ar' ? 'مدير مكتب' : 'Manager') : (language === 'ar' ? 'موظف/وكيل' : 'Agent')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center border px-2 py-0.5 rounded text-[10px] font-semibold ${getActionBadgeColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium max-w-sm truncate whitespace-normal leading-relaxed text-justify">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(log.createdAt)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
