import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Phone, Mail, MessageSquare, Trash2, Calendar, Search, Loader2, User, Send, CheckCircle, HelpCircle, Archive, ArrowRight, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialog } from '../context/DialogContext';

interface CallbackNote {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

interface CallbackRequest {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  createdAt: string;
  status: string; // PENDING, REPLIED_WHATSAPP, STILL_GOING, CLOSED
  handledBy: string | null;
  notes: CallbackNote[];
}

export default function AdminCallbacks() {
  const { language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Note editor state
  const [noteText, setNoteText] = useState('');
  const [sendingNote, setSendingNote] = useState(false);

  // Current user info
  const currentUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (_) {
      return null;
    }
  })();

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const selectedRequest = requests.find(r => r.id === selectedId);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/callback-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: updated.status, handledBy: updated.handledBy } : r));
      } else {
        await showAlert(language === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status');
      }
    } catch (err) {
      await showAlert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    }
  };

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !noteText.trim()) return;

    setSendingNote(true);
    try {
      const res = await fetch(`/api/callback-requests/${selectedId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText })
      });

      if (res.ok) {
        const newNote = await res.json();
        // Update requests state by pushing the new note
        setRequests(prev => prev.map(r => {
          if (r.id === selectedId) {
            return {
              ...r,
              handledBy: currentUser?.name || 'Administrator',
              notes: [...(r.notes || []), newNote]
            };
          }
          return r;
        }));
        setNoteText('');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      } else {
        await showAlert(language === 'ar' ? 'فشل إرسال الرد' : 'Failed to send note');
      }
    } catch (err) {
      await showAlert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setSendingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this request?');
    if (!confirmed) {
      return;
    }
    try {
      const res = await fetch(`/api/callback-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
        if (selectedId === id) setSelectedId(null);
      } else {
        await showAlert(language === 'ar' ? 'فشل حذف الطلب' : 'Failed to delete request');
      }
    } catch (err) {
      await showAlert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    }
  };

  // Filter based on search & status filter tab
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone.includes(searchTerm) ||
      (req.email && req.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.message && req.message.toLowerCase().includes(searchTerm.toLowerCase()));

    if (statusFilter === 'ALL') return matchesSearch;
    return req.status === statusFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: language === 'ar' ? 'جديد/معلق' : 'New/Pending',
          class: 'bg-orange-50 text-orange-700 border-orange-200'
        };
      case 'REPLIED_WHATSAPP':
        return {
          label: language === 'ar' ? 'رد عبر الواتساب' : 'WhatsApp Replied',
          class: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'STILL_GOING':
        return {
          label: language === 'ar' ? 'مستمر' : 'In Progress',
          class: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'CLOSED':
        return {
          label: language === 'ar' ? 'مغلق' : 'Closed',
          class: 'bg-muted text-muted-foreground border-border'
        };
      default:
        return { label: status, class: 'bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {language === 'ar' ? 'مركز محادثات وطلبات العملاء' : 'Client Conversations & Callbacks'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'قم بإدارة طلبات التواصل والدردشة مع العملاء وتغيير حالات المتابعة' : 'Manage call requests, chat thread replies, and follow-up status'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، الجوال، أو الرسالة...' : 'Search by name, phone...'}
              className="block w-full bg-card border border-border rounded-lg py-2 ps-9 pe-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
          <span className="text-xs">{language === 'ar' ? 'جاري تحميل المحادثات...' : 'Loading conversations...'}</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-xs font-bold text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px] items-stretch">
          
          {/* LEFT COLUMN: List of Requests */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-xs">
            {/* Filters Tabs */}
            <div className="flex border-b border-border bg-muted/10 p-1 gap-1 flex-wrap shrink-0">
              {['ALL', 'PENDING', 'REPLIED_WHATSAPP', 'STILL_GOING', 'CLOSED'].map((sf) => (
                <button
                  key={sf}
                  onClick={() => setStatusFilter(sf)}
                  className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded-md transition-colors cursor-pointer ${
                    statusFilter === sf ? 'bg-primary text-primary-foreground font-bold shadow-xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {sf === 'ALL' ? (language === 'ar' ? 'الكل' : 'All') :
                   sf === 'PENDING' ? (language === 'ar' ? 'معلق' : 'Pending') :
                   sf === 'REPLIED_WHATSAPP' ? (language === 'ar' ? 'واتساب' : 'WhatsApp') :
                   sf === 'STILL_GOING' ? (language === 'ar' ? 'مستمر' : 'Active') :
                   (language === 'ar' ? 'مغلق' : 'Closed')}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[660px] divide-y divide-border">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs">
                  {language === 'ar' ? 'لا توجد طلبات تواصل تطابق التصفية' : 'No requests match filters'}
                </div>
              ) : (
                filteredRequests.map(req => {
                  const isSelected = req.id === selectedId;
                  const statusInfo = getStatusBadge(req.status);
                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedId(req.id)}
                      className={`p-4 cursor-pointer transition-colors flex flex-col gap-2 ${
                        isSelected ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-foreground truncate">{req.name}</span>
                        <span className={`px-2 py-0.5 border rounded text-[9px] font-bold shrink-0 ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-muted-foreground dir-ltr font-mono">{req.phone}</div>
                      {req.message && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                          {req.message}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                        <span>{formatDate(req.createdAt)}</span>
                        {req.handledBy && (
                          <span className="font-medium text-primary">
                            👤 {req.handledBy}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Conversation Thread Details */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl flex flex-col overflow-hidden shadow-xs">
            {selectedRequest ? (
              <div className="flex flex-col h-full min-h-[680px]">
                
                {/* 1. Header with Client Details & handledBy */}
                <div className="p-5 border-b border-border bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      {selectedRequest.name}
                      {selectedRequest.handledBy && (
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold">
                          {language === 'ar' ? 'تم التعامل بواسطة: ' : 'Handled by: '} {selectedRequest.handledBy}
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-4 mt-2 font-medium">
                      <a href={`tel:${selectedRequest.phone}`} className="hover:text-primary flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span dir="ltr">{selectedRequest.phone}</span>
                      </a>
                      {selectedRequest.email && (
                        <a href={`mailto:${selectedRequest.email}`} className="hover:text-primary flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{selectedRequest.email}</span>
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(selectedRequest.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(selectedRequest.id)}
                      className="w-9 h-9 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                      title={language === 'ar' ? 'حذف طلب التواصل' : 'Delete consultation'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Status Update Buttons */}
                <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center bg-muted/5 shrink-0 select-none">
                  <span className="text-xs font-bold text-muted-foreground">
                    {language === 'ar' ? 'تحديث حالة المتابعة:' : 'Update follow-up status:'}
                  </span>
                  
                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'REPLIED_WHATSAPP')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedRequest.status === 'REPLIED_WHATSAPP'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                        : 'border-border text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'لقد رددنا عبر الواتساب' : 'We Replied via WhatsApp'}
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'STILL_GOING')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedRequest.status === 'STILL_GOING'
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                        : 'border-border text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'المحادثة لا تزال مستمرة' : 'Conversation is Still Going'}
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'CLOSED')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedRequest.status === 'CLOSED'
                        ? 'bg-muted border-border text-muted-foreground font-bold'
                        : 'border-border text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    <Archive className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'المحادثة مغلقة ومؤرشفة' : 'Conversation is Closed'}
                  </button>
                </div>

                {/* 3. Thread of Messages (Bubbles) */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4 min-h-[380px] max-h-[480px] bg-muted/10">
                  {/* Bubble 1: Original inquiry message */}
                  <div className="flex items-start gap-2.5 max-w-[85%] select-text">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0 text-slate-700">
                      C
                    </div>
                    <div className="bg-card border border-border p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs space-y-1.5">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        <span>{selectedRequest.name}</span>
                        <span className="text-[9px] text-muted-foreground font-normal">({language === 'ar' ? 'الرسالة الأصلية' : 'Original message'})</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-justify">
                        {selectedRequest.message ? selectedRequest.message : (
                          <span className="italic text-muted-foreground/60">{language === 'ar' ? 'طلب معاودة اتصال مباشر' : 'Requested a direct callback'}</span>
                        )}
                      </p>
                      <div className="text-[9px] text-muted-foreground text-right">{formatDate(selectedRequest.createdAt)}</div>
                    </div>
                  </div>

                  {/* Bubbles for subsequent replies (CallbackNote) */}
                  {selectedRequest.notes && selectedRequest.notes.map((note) => (
                    <div key={note.id} className="flex items-start gap-2.5 max-w-[85%] mr-auto rtl:mr-0 rtl:ml-auto select-text flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0 text-primary">
                        {note.authorName.charAt(0)}
                      </div>
                      <div className="bg-primary/5 border border-primary/10 p-3.5 rounded-2xl rounded-tr-none shadow-xs text-xs space-y-1">
                        <div className="font-bold text-primary flex items-center gap-1.5">
                          <span>{note.authorName}</span>
                          <span className="text-[8px] bg-primary/10 text-primary px-1 rounded-sm">{language === 'ar' ? 'مسؤول' : 'Staff'}</span>
                        </div>
                        <div 
                          className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-justify text-xs" 
                          dangerouslySetInnerHTML={{ __html: note.text }}
                        />
                        <div className="text-[9px] text-muted-foreground text-right">{formatDate(note.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Rich Text Note Editor Area */}
                <form onSubmit={handleSendNote} className="p-4 border-t border-border bg-card flex flex-col gap-3 shrink-0">
                  <div className="space-y-1">
                    <label className="cn-label text-xs flex items-center gap-1">
                      <CornerDownLeft className="w-3.5 h-3.5 text-gray-400" />
                      <span>{language === 'ar' ? 'إضافة رد أو ملاحظة داخلية للمحادثة:' : 'Add a reply or internal note to thread:'}</span>
                    </label>
                    {/* Visual Rich Text Toolbar */}
                    <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border border-b-0 rounded-t-xl select-none flex-wrap">
                      <button
                        type="button"
                        onClick={() => document.execCommand('bold', false)}
                        className="p-1 px-2.5 hover:bg-muted text-foreground rounded text-xs font-bold transition cursor-pointer"
                        title={language === 'ar' ? 'عريض' : 'Bold'}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('italic', false)}
                        className="p-1 px-2.5 hover:bg-muted text-foreground rounded text-xs italic transition cursor-pointer"
                        title={language === 'ar' ? 'مائل' : 'Italic'}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('underline', false)}
                        className="p-1 px-2.5 hover:bg-muted text-foreground rounded text-xs underline transition cursor-pointer"
                        title={language === 'ar' ? 'تحته خط' : 'Underline'}
                      >
                        U
                      </button>
                      <span className="w-px h-4 bg-border mx-1" />
                      <button
                        type="button"
                        onClick={() => document.execCommand('insertUnorderedList', false)}
                        className="p-1 px-2 hover:bg-muted text-foreground rounded text-xs transition cursor-pointer"
                        title={language === 'ar' ? 'قائمة نقطية' : 'Bullet List'}
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('insertOrderedList', false)}
                        className="p-1 px-2 hover:bg-muted text-foreground rounded text-xs transition cursor-pointer"
                        title={language === 'ar' ? 'قائمة رقمية' : 'Numbered List'}
                      >
                        1. List
                      </button>
                      <span className="w-px h-4 bg-border mx-1" />
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt(language === 'ar' ? 'أدخل رابط URL:' : 'Enter URL:');
                          if (url) document.execCommand('createLink', false, url);
                        }}
                        className="p-1 px-2 hover:bg-muted text-foreground rounded text-xs transition cursor-pointer font-semibold"
                        title={language === 'ar' ? 'إضافة رابط' : 'Insert Link'}
                      >
                        Link
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('removeFormat', false)}
                        className="p-1 px-2 hover:bg-muted text-foreground rounded text-xs transition cursor-pointer text-red-500 font-semibold ltr:ml-auto rtl:mr-auto"
                        title={language === 'ar' ? 'مسح التنسيق' : 'Clear Formatting'}
                      >
                        Clear
                      </button>
                    </div>

                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={(e) => setNoteText(e.currentTarget.innerHTML)}
                      onBlur={(e) => setNoteText(e.currentTarget.innerHTML)}
                      className="cn-input min-h-[140px] max-h-[220px] h-auto overflow-y-auto bg-background text-foreground p-3 border border-border rounded-b-xl rounded-t-none focus:outline-none focus:ring-2 focus:ring-primary text-xs leading-relaxed rich-text-editor"
                      placeholder={language === 'ar' ? 'اكتب ردك أو ملخص تواصلك هنا...' : 'Write your response or internal notes...'}
                      style={{ direction: language === 'ar' ? 'rtl' : 'ltr', textAlign: 'right' }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] text-muted-foreground leading-relaxed">
                      💡 {language === 'ar' ? 'إضافة الرد ستنسب المحادثة تلقائياً لاسمك.' : 'Submitting note assigns this thread to your account.'}
                    </div>

                    <button
                      type="submit"
                      disabled={sendingNote || !noteText.trim()}
                      className="btn-primary flex items-center gap-1.5 h-9 px-6 text-xs font-bold rounded-lg shadow-sm"
                    >
                      {sendingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{language === 'ar' ? 'إرسال الرد' : 'Submit Reply'}</span>
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 py-20 text-muted-foreground text-center select-none">
                <MessageSquare className="w-16 h-16 opacity-30 mb-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">
                  {language === 'ar' ? 'لم يتم تحديد أي محادثة' : 'No conversation selected'}
                </h3>
                <p className="text-xs mt-1 max-w-xs">
                  {language === 'ar' ? 'اختر أحد طلبات التواصل من القائمة الجانبية لعرض تفاصيل المحادثة وإرسال الردود.' : 'Select a callback request from the sidebar list to view notes and status options.'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
