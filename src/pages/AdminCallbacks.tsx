import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Phone, Mail, MessageSquare, Trash2, Calendar, Search, Loader2, User, Send, HelpCircle, Archive, ArrowRight, CornerDownLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialog } from '../context/DialogContext';
import DOMPurify from 'dompurify';

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
  
  // Separate editor refs for Message and Internal Note
  const editorRef = useRef<HTMLDivElement>(null);
  const internalNoteEditorRef = useRef<HTMLDivElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Input states for message (client reply) and internal note
  const [noteText, setNoteText] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  
  const [internalNoteText, setInternalNoteText] = useState('');
  const [sendingInternalNote, setSendingInternalNote] = useState(false);

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

  const normalizeIdentity = (value?: string | null) => (value || '').trim().toLowerCase();

  const isCustomerNote = (note: CallbackNote, request: CallbackRequest) => {
    const author = normalizeIdentity(note.authorName);
    if (!author) return false;

    const customerName = normalizeIdentity(request.name);
    const customerEmail = normalizeIdentity(request.email || '');

    if (customerEmail && (author === customerEmail || author.includes(customerEmail))) return true;
    if (customerName && author === customerName) return true;

    return false;
  };

  // Helper function to check if HTML content has any actual visible text
  const isHtmlEmpty = (html: string) => {
    if (!html) return true;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const text = doc.body.textContent || '';
    return !text.trim();
  };

  // Submit client-facing Message (Sends email notification)
  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || isHtmlEmpty(noteText)) return;

    setSendingNote(true);
    try {
      const res = await fetch(`/api/callback-requests/${selectedId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText })
      });

      if (res.ok) {
        const newNote = await res.json();
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
        await showAlert(language === 'ar' ? 'فشل إرسال الرسالة' : 'Failed to send message');
      }
    } catch (err) {
      await showAlert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setSendingNote(false);
    }
  };

  // Submit Internal Note (Prepends strong visual tag)
  const handleSendInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || isHtmlEmpty(internalNoteText)) return;

    setSendingInternalNote(true);
    const formattedText = `<strong>[ملاحظة داخلية]</strong><br/>${internalNoteText}`;
    try {
      const res = await fetch(`/api/callback-requests/${selectedId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formattedText })
      });

      if (res.ok) {
        const newNote = await res.json();
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
        setInternalNoteText('');
        if (internalNoteEditorRef.current) {
          internalNoteEditorRef.current.innerHTML = '';
        }
      } else {
        await showAlert(language === 'ar' ? 'فشل إضافة الملاحظة الداخلية' : 'Failed to add internal note');
      }
    } catch (err) {
      await showAlert(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error');
    } finally {
      setSendingInternalNote(false);
    }
  };

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
          class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
        };
      case 'REPLIED_WHATSAPP':
        return {
          label: language === 'ar' ? 'رد عبر الواتساب' : 'WhatsApp Replied',
          class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        };
      case 'STILL_GOING':
        return {
          label: language === 'ar' ? 'مستمر' : 'In Progress',
          class: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
        };
      case 'CLOSED':
        return {
          label: language === 'ar' ? 'مغلق' : 'Closed',
          class: 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20'
        };
      default:
        return { label: status, class: 'bg-slate-500/10 border border-slate-500/20' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-foreground font-sans">
            {language === 'ar' ? 'مركز محادثات وطلبات العملاء' : 'Client Conversations & Callbacks'}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {language === 'ar' ? 'قم بإدارة طلبات التواصل والدردشة مع العملاء وتغيير حالات المتابعة' : 'Manage call requests, chat thread replies, and follow-up status'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar with dynamic glow on focus */}
          <div className="relative w-full md:w-56 focus-within:scale-[1.01] transition-all duration-200">
            <div className="absolute inset-y-0 start-0 ps-2.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-3 w-3" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، الجوال، أو الرسالة...' : 'Search by name, phone...'}
              className="block w-full bg-card border border-border rounded-lg py-1 ps-8 pe-3 text-[10px] text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-primary/45 focus:border-primary shadow-xs h-7"
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
        /* 3-COLUMN CRM LAYOUT: Sidebar, Chat Thread, and inspector details sidebar. Pinned to a fixed height of h-[660px] */
        <div className="flex flex-col lg:flex-row gap-0 h-[660px] items-stretch bg-card rounded-xl border border-border shadow-xs overflow-hidden animate-fade-in">
          
          {/* COLUMN 1: List of Requests Sidebar (Fixed Width & Fixed Height) */}
          <div className="w-full lg:w-[240px] xl:w-[270px] shrink-0 flex flex-col overflow-hidden bg-muted/10 dark:bg-muted/5 border-border/50 ltr:border-r rtl:border-l h-full">
            {/* Sliding segment tabs selector */}
            <div className="p-1.5 border-b border-border bg-muted/15 shrink-0">
              <div className="flex bg-muted/30 p-0.5 rounded-lg relative overflow-hidden select-none gap-0.5">
                {['ALL', 'PENDING', 'REPLIED_WHATSAPP', 'STILL_GOING', 'CLOSED'].map((sf) => (
                  <button
                    key={sf}
                    onClick={() => setStatusFilter(sf)}
                    className={`relative flex-1 py-1 px-0.5 text-[8.5px] font-extrabold rounded-md transition-colors cursor-pointer focus:outline-none z-10 ${
                      statusFilter === sf ? 'text-primary-foreground font-extrabold' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {statusFilter === sf && (
                      <motion.div
                        layoutId="activeStatusIndicator"
                        className="absolute inset-0 bg-primary rounded-md -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    {sf === 'ALL' ? (language === 'ar' ? 'الكل' : 'All') :
                     sf === 'PENDING' ? (language === 'ar' ? 'معلق' : 'Pending') :
                     sf === 'REPLIED_WHATSAPP' ? (language === 'ar' ? 'واتساب' : 'WhatsApp') :
                     sf === 'STILL_GOING' ? (language === 'ar' ? 'مستمر' : 'Active') :
                     (language === 'ar' ? 'مغلق' : 'Closed')}
                  </button>
                ))}
              </div>
            </div>

            {/* List with compact padding, height, and font sizes (dense vertical layout) */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
              {filteredRequests.length === 0 ? (
                <div className="p-5 text-center text-muted-foreground text-[10px]">
                  {language === 'ar' ? 'لا توجد طلبات تواصل تطابق التصفية' : 'No requests match filters'}
                </div>
              ) : (
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {filteredRequests.map((req, idx) => {
                      const isSelected = req.id === selectedId;
                      const statusInfo = getStatusBadge(req.status);
                      return (
                        <motion.div
                          key={req.id}
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.98 }}
                          whileHover={{ backgroundColor: 'rgba(var(--color-muted), 0.15)' }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 420, damping: 33 }}
                          onClick={() => setSelectedId(req.id)}
                          className={`py-2.5 px-3 cursor-pointer flex flex-col gap-1 relative transition-all border-b border-border/30 ${
                            isSelected 
                              ? 'bg-primary/[0.04] dark:bg-primary/[0.08]' 
                              : 'hover:bg-muted/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className={`font-extrabold text-[10.5px] truncate transition-colors ${
                              isSelected ? 'text-primary' : 'text-foreground'
                            }`}>{req.name}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[7.5px] font-bold shrink-0 ${statusInfo.class}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="text-[8.5px] text-muted-foreground dir-ltr font-mono font-medium">{req.phone}</div>
                          {req.message && (
                            <p className="text-[9.5px] text-muted-foreground line-clamp-1 leading-relaxed">
                              {req.message}
                            </p>
                          )}
                          <div className="flex justify-between items-center text-[7.5px] text-muted-foreground font-medium mt-0.5">
                            <span>{formatDate(req.createdAt)}</span>
                            {req.handledBy && (
                              <span className="bg-muted px-1.5 py-0.2 rounded text-[7.5px] font-semibold text-muted-foreground flex items-center gap-0.5 border border-border/40 select-none">
                                👤 {req.handledBy}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Conversation Thread History (Fluid Flex-Grow width, fixed h-full layout with scrollbar) */}
          <div className="flex-grow flex flex-col overflow-hidden bg-card border-none h-full">
            {selectedRequest ? (
              <div className="flex flex-col h-full">
                
                {/* Clean Compact Header */}
                <div className="px-4 py-2.5 border-b border-border bg-card/85 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-20 h-11">
                  <h3 className="text-xs font-extrabold text-foreground flex items-center gap-2">
                    <span>{selectedRequest.name}</span>
                    {selectedRequest.status && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-bold shrink-0 ${getStatusBadge(selectedRequest.status).class}`}>
                        {getStatusBadge(selectedRequest.status).label}
                      </span>
                    )}
                  </h3>
                </div>

                {/* Viewport: flex-grow overflow-y-auto and h-0 ensures it occupies exactly the remaining vertical space inside h-full parent without expanding it */}
                <div className="flex-grow overflow-y-auto p-3.5 space-y-2 bg-muted/5 custom-scrollbar h-0">
                  <AnimatePresence initial={false}>
                    
                    {/* Original inquiry message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className="w-full flex justify-start select-text"
                    >
                      <div className="flex items-start gap-1.5 max-w-[70%]">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-[9px] shrink-0 text-slate-700 dark:text-slate-300 shadow-xs">
                          C
                        </div>
                        <div className="bg-card border border-border/80 py-1.5 px-2.5 rounded-xl shadow-xs text-[10.5px] space-y-0.5 ltr:rounded-tl-none ltr:rounded-tr-xl rtl:rounded-tr-none rtl:rounded-tl-xl w-fit">
                          <div className="font-extrabold text-foreground flex items-center gap-1 text-[10.5px]">
                            <span>{selectedRequest.name}</span>
                            <span className="text-[7.5px] text-muted-foreground font-normal">({language === 'ar' ? 'الرسالة الأصلية' : 'Original'})</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed text-justify text-[10.5px]">
                            {selectedRequest.message ? selectedRequest.message : (
                              <span className="italic text-muted-foreground/60">{language === 'ar' ? 'طلب معاودة اتصال مباشر' : 'Requested a direct callback'}</span>
                            )}
                          </p>
                          <div className="text-[7.5px] text-muted-foreground/70 text-right mt-0.5">{formatDate(selectedRequest.createdAt)}</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bubbles for subsequent replies */}
                    {selectedRequest.notes && selectedRequest.notes.map((note) => {
                      const customerNote = isCustomerNote(note, selectedRequest);
                      const isInternal = note.text.includes('[ملاحظة داخلية]') || note.text.includes('[Internal Note]');

                      return (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          className={`w-full flex ${customerNote ? 'justify-start' : 'justify-end'} select-text`}
                        >
                          <div
                            className={`flex items-start gap-1.5 max-w-[70%] ${customerNote ? '' : 'flex-row-reverse'}`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 shadow-xs ${
                                customerNote
                                  ? 'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                  : isInternal
                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'
                                    : 'bg-primary/10 border border-primary/20 text-primary'
                              }`}
                            >
                              {note.authorName.charAt(0)}
                            </div>
                            <div
                              className={`py-1.5 px-2.5 rounded-xl shadow-xs text-[10.5px] space-y-0.5 w-fit ${
                                customerNote
                                  ? 'bg-card border border-border/80 ltr:rounded-tl-none ltr:rounded-tr-xl rtl:rounded-tr-none rtl:rounded-tl-xl'
                                  : isInternal
                                    ? 'bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 ltr:rounded-tr-none ltr:rounded-tl-xl rtl:rounded-tl-none rtl:rounded-tr-xl'
                                    : 'bg-primary/5 dark:bg-primary/10 border border-primary/25 ltr:rounded-tr-none ltr:rounded-tl-xl rtl:rounded-tl-none rtl:rounded-tr-xl'
                              }`}
                            >
                              <div
                                className={`font-extrabold flex items-center gap-1.5 text-[10.5px] ${
                                  customerNote ? 'text-foreground' : isInternal ? 'text-amber-600 dark:text-amber-400' : 'text-primary'
                                }`}
                              >
                                <span>{note.authorName}</span>
                                <span
                                  className={`text-[7.5px] px-1.5 py-0.2 rounded-full font-bold ${
                                    customerNote
                                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/40'
                                      : isInternal
                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                        : 'bg-primary/10 text-primary border border-primary/20'
                                  }`}
                                >
                                  {customerNote
                                    ? (language === 'ar' ? 'عميل' : 'Customer')
                                    : isInternal
                                      ? (language === 'ar' ? 'ملاحظة' : 'Note')
                                      : (language === 'ar' ? 'مسؤول' : 'Staff')}
                                </span>
                              </div>
                              <div
                                className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-justify text-[10.5px] note-text-content"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.text) }}
                              />
                              <div className="text-[7.5px] text-muted-foreground/70 text-right mt-0.5">{formatDate(note.createdAt)}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Message Composer (at the bottom of Column 2 - Pinned to bottom, never pushes parent size) */}
                <form onSubmit={handleSendNote} className="p-3.5 border-t border-border bg-card shrink-0 select-none">
                  <div className="border border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 rounded-xl overflow-hidden bg-background transition-all shadow-xs flex flex-col">
                    
                    {/* Input Field (Top - min-h-[64px]) */}
                    <div 
                      ref={editorRef}
                      contentEditable
                      onInput={(e) => setNoteText(e.currentTarget.innerHTML)}
                      onBlur={(e) => setNoteText(e.currentTarget.innerHTML)}
                      className="min-h-[64px] max-h-[120px] h-auto overflow-y-auto bg-transparent text-foreground p-3 focus:outline-none text-[11px] leading-relaxed rich-text-editor"
                      placeholder={language === 'ar' ? 'اكتب ردك أو رسالتك للعميل هنا...' : 'Write message to client here...'}
                      style={{ direction: language === 'ar' ? 'rtl' : 'ltr', textAlign: language === 'ar' ? 'right' : 'left' }}
                    />

                    {/* Editor actions and formatting (Bottom strip) */}
                    <div className="flex items-center justify-between px-3 py-2 bg-muted/20 border-t border-border/50 gap-2 shrink-0">
                      
                      {/* Right side (first child in RTL goes to the right): Send button and notification badge */}
                      <div className="flex items-center gap-2">
                        {/* Styled Notification Status Badge */}
                        <div className="bg-muted dark:bg-muted/30 px-2 py-0.5 rounded-md text-[8.5px] text-muted-foreground flex items-center gap-1 font-semibold border border-border/50 select-none shrink-0">
                          <Mail className="w-2.5 h-2.5 text-gray-400" />
                          <span>{language === 'ar' ? 'إشعار بريد مفعل' : 'Mail notify active'}</span>
                        </div>
                        
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          type="submit"
                          disabled={sendingNote || isHtmlEmpty(noteText)}
                          className="bg-primary hover:opacity-95 text-primary-foreground flex items-center justify-center gap-1.5 h-8 px-4 text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                          {sendingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>{language === 'ar' ? 'إرسال' : 'Send'}</span>
                        </motion.button>
                      </div>

                      {/* Left side (second child in RTL goes to the left): formatting shortcuts */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => document.execCommand('bold', false)}
                          className="w-7 h-7 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md text-xs font-bold transition flex items-center justify-center cursor-pointer border border-transparent hover:border-border/30"
                          title={language === 'ar' ? 'عريض' : 'Bold'}
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('italic', false)}
                          className="w-7 h-7 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md text-xs italic font-serif transition flex items-center justify-center cursor-pointer border border-transparent hover:border-border/30"
                          title={language === 'ar' ? 'مائل' : 'Italic'}
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('underline', false)}
                          className="w-7 h-7 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md text-xs underline transition flex items-center justify-center cursor-pointer border border-transparent hover:border-border/30"
                          title={language === 'ar' ? 'تحته خط' : 'Underline'}
                        >
                          U
                        </button>
                        
                        <span className="w-px h-4 bg-border/60 mx-1 shrink-0" />
                        
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt(language === 'ar' ? 'أدخل رابط URL:' : 'Enter URL:');
                            if (url) document.execCommand('createLink', false, url);
                          }}
                          className="w-7 h-7 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition flex items-center justify-center cursor-pointer border border-transparent hover:border-border/30"
                          title={language === 'ar' ? 'إضافة رابط' : 'Insert Link'}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            document.execCommand('removeFormat', false);
                            if (editorRef.current) editorRef.current.focus();
                          }}
                          className="h-7 px-2 hover:bg-muted text-destructive hover:text-destructive-foreground hover:bg-destructive/10 rounded-md text-[10px] font-bold transition flex items-center justify-center cursor-pointer border border-transparent hover:border-border/30"
                          title={language === 'ar' ? 'مسح التنسيق' : 'Clear Formats'}
                        >
                          {language === 'ar' ? 'مسح' : 'Clear'}
                        </button>
                      </div>

                    </div>
                  </div>
                </form>

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 py-20 text-muted-foreground text-center select-none bg-muted/5 min-h-[660px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20 shadow-xs">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-xs text-foreground">
                    {language === 'ar' ? 'لم يتم تحديد أي محادثة' : 'No conversation selected'}
                  </h3>
                  <p className="text-[10px] mt-1 max-w-[200px] text-muted-foreground leading-relaxed">
                    {language === 'ar' ? 'اختر أحد طلبات التواصل من القائمة الجانبية لعرض تفاصيل المحادثة وإرسال الردود.' : 'Select a callback request from the sidebar list to view notes and status options.'}
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          {/* COLUMN 3: Details & Actions Inspector Sidebar (stacking client profile cards, status update buttons AND the note box) */}
          {selectedRequest && (
            <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 border-border/50 ltr:border-l rtl:border-r bg-muted/10 dark:bg-muted/5 p-4 flex flex-col gap-4 overflow-y-auto h-full custom-scrollbar">
              
              {/* Profile/Client Details Block */}
              <div>
                <h4 className="text-[10.5px] font-extrabold text-muted-foreground/80 uppercase tracking-wider mb-2 select-none">
                  {language === 'ar' ? 'تفاصيل العميل' : 'Client Profile'}
                </h4>
                <div className="bg-card rounded-lg border border-border/50 p-2.5 space-y-2 text-[10.5px]">
                  <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-1.5">
                    <span className="text-muted-foreground/80">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-bold text-foreground truncate max-w-[170px]">{selectedRequest.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-1.5">
                    <span className="text-muted-foreground/80">{language === 'ar' ? 'الجوال:' : 'Phone:'}</span>
                    <a href={`tel:${selectedRequest.phone}`} className="font-mono font-medium text-primary hover:underline" dir="ltr">{selectedRequest.phone}</a>
                  </div>
                  {selectedRequest.email && (
                    <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-1.5">
                      <span className="text-muted-foreground/80">{language === 'ar' ? 'البريد:' : 'Email:'}</span>
                      <a href={`mailto:${selectedRequest.email}`} className="font-medium text-primary hover:underline truncate max-w-[150px]">{selectedRequest.email}</a>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-1.5">
                    <span className="text-muted-foreground/80">{language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
                    <span className="text-muted-foreground/90 font-medium">{formatDate(selectedRequest.createdAt)}</span>
                  </div>
                  {selectedRequest.handledBy && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground/80">{language === 'ar' ? 'المسؤول:' : 'Assigned:'}</span>
                      <span className="font-semibold text-primary">👤 {selectedRequest.handledBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Block (vertical layout) */}
              <div className="space-y-2">
                <h4 className="text-[10.5px] font-extrabold text-muted-foreground/80 uppercase tracking-wider select-none">
                  {language === 'ar' ? 'تحديث حالة المتابعة' : 'Follow-up Status'}
                </h4>
                <div className="flex flex-col gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'REPLIED_WHATSAPP')}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      selectedRequest.status === 'REPLIED_WHATSAPP'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted/55 hover:text-foreground'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{language === 'ar' ? 'لقد رددنا عبر الواتساب' : 'WhatsApp Replied'}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'STILL_GOING')}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      selectedRequest.status === 'STILL_GOING'
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted/55 hover:text-foreground'
                    }`}
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{language === 'ar' ? 'المحادثة لا تزال مستمرة' : 'Still Active'}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'CLOSED')}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      selectedRequest.status === 'CLOSED'
                        ? 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted/55 hover:text-foreground'
                    }`}
                  >
                    <Archive className="w-3 h-3" />
                    <span>{language === 'ar' ? 'المحادثة مغلقة ومؤرشفة' : 'Close Conversation'}</span>
                  </motion.button>
                </div>
              </div>

              {/* REPLY / NOTE COMPOSER (The Internal Note Box added back to the side inspector column) */}
              <form onSubmit={handleSendInternalNote} className="space-y-2 flex flex-col mt-1">
                <h4 className="text-[10.5px] font-extrabold text-muted-foreground/80 uppercase tracking-wider select-none flex items-center gap-1">
                  <CornerDownLeft className="w-3 h-3 text-amber-500" />
                  <span>{language === 'ar' ? 'إضافة ملاحظة داخلية:' : 'Add Internal Note:'}</span>
                </h4>
                
                <div className="border border-border/80 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/15 rounded-lg overflow-hidden bg-background transition-all shadow-xs flex flex-col">
                  {/* Note textarea */}
                  <div 
                    ref={internalNoteEditorRef}
                    contentEditable
                    onInput={(e) => setInternalNoteText(e.currentTarget.innerHTML)}
                    onBlur={(e) => setInternalNoteText(e.currentTarget.innerHTML)}
                    className="min-h-[80px] max-h-[140px] h-auto overflow-y-auto bg-transparent text-foreground p-2.5 focus:outline-none text-[10.5px] leading-relaxed rich-text-editor"
                    placeholder={language === 'ar' ? 'اكتب ملاحظة داخلية للموظفين...' : 'Write internal note (staff only)...'}
                    style={{ direction: language === 'ar' ? 'rtl' : 'ltr', textAlign: language === 'ar' ? 'right' : 'left' }}
                  />

                  {/* Note toolbar strip */}
                  <div className="flex items-center justify-between px-2 py-1 bg-muted/20 border-t border-border/50 select-none gap-2 shrink-0">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => document.execCommand('bold', false)}
                        className="w-5.5 h-5.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md text-[9px] font-bold transition flex items-center justify-center cursor-pointer border border-transparent"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('italic', false)}
                        className="w-5.5 h-5.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md text-[9px] italic transition flex items-center justify-center cursor-pointer border border-transparent"
                        title="Italic"
                      >
                        I
                      </button>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={sendingInternalNote || isHtmlEmpty(internalNoteText)}
                      className="bg-amber-500 hover:opacity-95 text-white flex items-center justify-center gap-1 h-6 px-3 text-[9px] font-bold rounded shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {sendingInternalNote ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Send className="w-2.5 h-2.5" />}
                      <span>{language === 'ar' ? 'حفظ ملاحظة' : 'Save Note'}</span>
                    </motion.button>
                  </div>
                </div>
              </form>

              {/* Delete Request Button (Sticky bottom in inspector panel) */}
              <div className="pt-2 border-t border-border/40 mt-auto shrink-0">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(selectedRequest.id)}
                  className="w-full py-1.5 text-[9px] font-bold border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حذف طلب التواصل' : 'Delete Request'}</span>
                </motion.button>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
