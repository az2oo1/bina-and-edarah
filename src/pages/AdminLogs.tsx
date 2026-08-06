import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { FileText, Search, Clock, Shield, RefreshCw, Loader2 } from 'lucide-react';

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
    if (action.startsWith('ADD')) return 'property-tag-emerald';
    if (action.startsWith('UPDATE')) return 'property-tag';
    if (action.startsWith('DELETE')) return 'property-tag-rose';
    if (action.includes('RESTORE')) return 'property-tag-amber';
    return 'property-tag';
  };

  return (
    <div className="space-y-6">
      
      {/* Standard Admin Header Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              {language === 'ar' ? 'سجل عمليات النظام' : 'System Audit Logs'}
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {language === 'ar' ? 'متابعة سجل العمليات وتعديلات الموظفين بالتفصيل' : 'Monitor all staff activities, edits, additions, and updates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="flex items-center gap-2 border border-border rounded-full px-3.5 bg-muted/30 focus-within:bg-card focus-within:ring-1 focus-within:ring-primary w-full md:w-64 h-9 transition-all">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث بالموظف، الإجراء، أو التفاصيل...' : 'Search by staff, action, detail...'}
              className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-[11px] text-foreground placeholder:text-muted-foreground font-medium"
            />
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="w-9 h-9 border border-border rounded-full flex items-center justify-center bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
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
        <div className="admin-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto overflow-y-hidden">
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
                {filteredLogs.map((log, idx) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-muted/10 transition-colors admin-stagger-item"
                    style={{ animationDelay: `${idx * 15}ms` }}
                  >
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
                      <span className={getActionBadgeColor(log.action)}>
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
