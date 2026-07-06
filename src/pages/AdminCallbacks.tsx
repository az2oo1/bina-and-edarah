import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Phone, Mail, MessageSquare, Trash2, Calendar, Search, Loader2 } from 'lucide-react';

interface CallbackRequest {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  createdAt: string;
}

export default function AdminCallbacks() {
  const { language } = useLanguage();
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/callback-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        setError(language === 'ar' ? 'فشل تحميل طلبات التواصل' : 'Failed to fetch callback requests');
      }
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this request?')) {
      return;
    }
    try {
      const res = await fetch(`/api/callback-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
      } else {
        alert(language === 'ar' ? 'فشل حذف الطلب' : 'Failed to delete request');
      }
    } catch (err) {
      alert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    }
  };

  // Filter requests based on search term
  const filteredRequests = requests.filter(req => 
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.phone.includes(searchTerm) ||
    (req.email && req.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (req.message && req.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {language === 'ar' ? 'طلبات التواصل والاستفسارات' : 'Callback & Consultation Requests'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'إدارة طلبات الاتصال الهاتفي ورسائل الدعم الواردة' : 'Manage direct calling requests and client messages'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto ltr:pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، الجوال، أو الرسالة...' : 'Search by name, phone, message...'}
            className={`block w-full bg-card border border-border rounded-lg py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
              language === 'ar' ? 'pr-9 pl-4' : 'pl-9 pr-4'
            }`}
          />
        </div>
      </div>

      {/* Requests table / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <span className="text-xs">{language === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading requests...'}</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/25 text-xs font-semibold text-center">
          {error}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <Mail className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
          <p className="text-sm font-semibold text-foreground">
            {language === 'ar' ? 'لا توجد طلبات تواصل حالياً' : 'No callback requests found'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'تظهر هنا الرسائل التي يرسلها العملاء من نموذج اتصل بنا' : 'Inquiries submitted through forms will appear here'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold">
                  <th className="px-6 py-4">{language === 'ar' ? 'العميل' : 'Client'}</th>
                  <th className="px-6 py-4">{language === 'ar' ? 'رقم الجوال' : 'Phone'}</th>
                  <th className="px-6 py-4">{language === 'ar' ? 'الرسالة / الاستفسار' : 'Message'}</th>
                  <th className="px-6 py-4">{language === 'ar' ? 'تاريخ الاستلام' : 'Received Date'}</th>
                  <th className="px-6 py-4 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div>{req.name}</div>
                      {req.email && (
                        <div className="text-[10px] text-muted-foreground font-normal mt-0.5 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 inline" />
                          <span>{req.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      <a href={`tel:${req.phone}`} className="hover:text-primary hover:underline flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span dir="ltr">{req.phone}</span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs md:max-w-sm truncate whitespace-normal">
                      {req.message ? req.message : (
                        <span className="italic text-muted-foreground/50">{language === 'ar' ? 'طلب معاودة اتصال' : 'Callback requested'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(req.createdAt)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Dial Link */}
                        <a 
                          href={`tel:${req.phone}`}
                          title={language === 'ar' ? 'اتصال مباشر' : 'Direct Call'}
                          className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        
                        {/* WhatsApp Link */}
                        <a 
                          href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={language === 'ar' ? 'دردشة واتساب' : 'WhatsApp Message'}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 flex items-center justify-center transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                        
                        {/* Delete Request */}
                        <button 
                          onClick={() => handleDelete(req.id)}
                          title={language === 'ar' ? 'حذف الطلب' : 'Delete Request'}
                          className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
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
        </div>
      )}
    </div>
  );
}
