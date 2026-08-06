import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  MessageSquare, Trash2, Search, Loader2, User, Send, HelpCircle, 
  Archive, CornerDownLeft, UserCheck, CheckCheck, Paperclip, Edit3, 
  Save, X, Bell, Phone, ExternalLink, Check, Volume2, Circle, Video, Image as ImageIcon
} from 'lucide-react';
import { useDialog } from '../context/DialogContext';
import DOMPurify from 'dompurify';
import { compressImage } from '../lib/image';
import io from 'socket.io-client';

type ClientSocket = ReturnType<typeof io>;

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
  internalNote?: string | null;
  notes: CallbackNote[];
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Web Audio API synth sound chime
function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}

export default function AdminCallbacks() {
  const { language } = useLanguage();
  const { showAlert, showConfirm } = useDialog();

  // Callback Requests State
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [selectedCallbackId, setSelectedCallbackId] = useState<string | null>(null);

  const [claiming, setClaiming] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Notifications Banner Toast
  const [notificationToast, setNotificationToast] = useState<{
    id: string;
    title: string;
    body: string;
    timestamp: string;
  } | null>(null);

  // Editor refs
  const editorRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const selectedCallbackIdRef = useRef<string | null>(null);
  const socketRef = useRef<ClientSocket | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    selectedCallbackIdRef.current = selectedCallbackId;
  }, [selectedCallbackId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Callback reply state
  const [noteText, setNoteText] = useState('');
  const [callbackAttachments, setCallbackAttachments] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [sendingNote, setSendingNote] = useState(false);

  const handleAddCallbackAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files) as File[]) {
      try {
        if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setCallbackAttachments(prev => [...prev, { url: event.target!.result as string, type: 'video' }]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          const base64 = await compressImage(file);
          setCallbackAttachments(prev => [...prev, { url: base64, type: 'image' }]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    e.target.value = '';
  };

  // Dedicated Sidebar Internal Note States
  const [internalNoteText, setInternalNoteText] = useState('');
  const [isEditingInternalNote, setIsEditingInternalNote] = useState(false);
  const [savingInternalNote, setSavingInternalNote] = useState(false);

  // Current user info
  const currentUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (_) {
      return null;
    }
  })();

  const currentUserName = currentUser?.name || currentUser?.username || 'الموظف';

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/callback-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        if (data.length > 0 && !selectedCallbackIdRef.current) {
          setSelectedCallbackId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Setup Real-time Socket.IO connection & event listeners
  useEffect(() => {
    fetchRequests();

    const socket: ClientSocket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_admin');
      if (selectedCallbackIdRef.current) {
        socket.emit('join_callback', selectedCallbackIdRef.current);
      }
    });

    socket.on('new_callback_request', (newReq: CallbackRequest) => {
      playNotificationSound();

      setNotificationToast({
        id: newReq.id,
        title: language === 'ar' ? `طلب تواصل جديد: ${newReq.name}` : `New Contact Request: ${newReq.name}`,
        body: newReq.message || (language === 'ar' ? 'استفسار أو طلب معاينة جديد' : 'New viewing request'),
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      });

      setRequests(prev => {
        if (prev.some(r => r.id === newReq.id)) return prev;
        return [newReq, ...prev];
      });
    });

    socket.on('new_callback_note', (data: any) => {
      const reqId = data.callbackRequestId || data.requestId;
      if (!reqId) return;

      playNotificationSound();

      setRequests(prev => prev.map(r => {
        if (r.id === reqId) {
          const existingNotes = r.notes || [];
          if (existingNotes.some(n => n.id === data.id)) return r;
          return {
            ...r,
            notes: [...existingNotes, data],
            handledBy: data.authorName || r.handledBy
          };
        }
        return r;
      }));

      if (reqId !== selectedCallbackIdRef.current) {
        setNotificationToast({
          id: reqId,
          title: language === 'ar' ? `رسالة جديدة من ${data.authorName || 'عميل'}` : `New message from ${data.authorName || 'User'}`,
          body: (data.text || '').replace(/<[^>]*>/g, '').slice(0, 60),
          timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        });
      }
    });

    socket.on('callback_updated', (updated: CallbackRequest) => {
      setRequests(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    });

    socket.on('callback_deleted', (data: { id: string }) => {
      setRequests(prev => prev.filter(r => r.id !== data.id));
      if (selectedCallbackIdRef.current === data.id) {
        setSelectedCallbackId(null);
      }
    });

    socket.on('callback_user_typing', (data: { senderName: string }) => {
      setTypingUser(data.senderName);
    });

    socket.on('callback_user_stop_typing', () => {
      setTypingUser(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [language]);

  // Join callback room when selectedCallbackId changes
  useEffect(() => {
    if (selectedCallbackId && socketRef.current) {
      socketRef.current.emit('join_callback', selectedCallbackId);
    }
  }, [selectedCallbackId]);

  const selectedCallback = requests.find(r => r.id === selectedCallbackId);

  // Synchronize internal note text area when selected item changes
  useEffect(() => {
    setIsEditingInternalNote(false);
    setInternalNoteText(selectedCallback?.internalNote || '');
  }, [selectedCallbackId, selectedCallback?.internalNote]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCallback?.notes, typingUser]);

  const handleClaimCallback = async (id: string) => {
    setClaiming(true);
    try {
      const res = await fetch(`/api/callback-requests/${id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handledBy: currentUserName })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        await showAlert(language === 'ar' ? `تم الاستحواذ على المحادثة باسم: ${currentUserName}` : `Claimed by ${currentUserName}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  const handleUpdateCallbackStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/callback-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: updated.status, handledBy: updated.handledBy } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCallback = async (id: string) => {
    const confirmed = await showConfirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this request?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/callback-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
        if (selectedCallbackId === id) setSelectedCallbackId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isHtmlEmpty = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return !tmp.textContent?.trim();
  };

  const checkFormattingState = () => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
    } catch (_) {}
  };

  const handleToggleBold = () => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand('bold', false);
    checkFormattingState();
  };

  const handleToggleItalic = () => {
    if (editorRef.current) editorRef.current.focus();
    document.execCommand('italic', false);
    checkFormattingState();
  };

  const emitTyping = () => {
    if (!selectedCallbackId || !socketRef.current) return;
    socketRef.current.emit('callback_typing', { callbackId: selectedCallbackId, senderName: currentUserName });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('callback_stop_typing', { callbackId: selectedCallbackId });
    }, 2500);
  };

  const handleSendCallbackReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCallbackId) return;
    const content = editorRef.current ? editorRef.current.innerHTML.trim() : noteText.trim();
    if ((!content || isHtmlEmpty(content)) && callbackAttachments.length === 0) return;

    let htmlPayload = content;
    if (callbackAttachments.length > 0) {
      const mediaHtml = callbackAttachments.map(att => {
        if (att.type === 'video') {
          return `<div class="pt-1.5"><video src="${att.url}" controls class="w-full max-h-60 rounded-xl border border-border/60 object-cover my-1"></video></div>`;
        } else {
          return `<img src="${att.url}" class="w-20 h-20 rounded-lg object-cover border border-border/60 inline-block m-0.5" />`;
        }
      }).join('');
      htmlPayload = htmlPayload ? `${htmlPayload}<div class="flex flex-wrap gap-1 pt-1.5">${mediaHtml}</div>` : mediaHtml;
    }

    setSendingNote(true);
    try {
      const res = await fetch(`/api/callback-requests/${selectedCallbackId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: htmlPayload,
          authorName: currentUserName
        })
      });
      if (res.ok) {
        const newNote = await res.json();
        setRequests(prev => prev.map(r => r.id === selectedCallbackId ? { ...r, notes: [...(r.notes || []), newNote] } : r));
        setNoteText('');
        if (editorRef.current) editorRef.current.innerHTML = '';
        setCallbackAttachments([]);
        setIsBold(false);
        setIsItalic(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingNote(false);
    }
  };

  const handleSaveSidebarInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCallbackId) return;
    setSavingInternalNote(true);
    try {
      const res = await fetch(`/api/callback-requests/${selectedCallbackId}/internal-note`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNote: internalNoteText })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        setIsEditingInternalNote(false);
        await showAlert(language === 'ar' ? 'تم حفظ الملاحظة الداخلية للموظفين بنجاح' : 'Staff internal note saved');
      } else {
        await showAlert(language === 'ar' ? 'فشل حفظ الملاحظة' : 'Failed to save note');
      }
    } catch (err) {
      console.error(err);
      await showAlert(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving note');
    } finally {
      setSavingInternalNote(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(req => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = (
      req.name.toLowerCase().includes(query) ||
      req.phone.toLowerCase().includes(query) ||
      (req.message || '').toLowerCase().includes(query)
    );
    if (!matchesSearch) return false;
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 relative">
      
      {/* BENAA & EDARA IN-APP REALTIME TOAST NOTIFICATION BANNER */}
      {notificationToast && (
        <div 
          className="fixed top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 max-w-sm w-full bg-card text-foreground rounded-2xl p-4 shadow-2xl border border-primary/20 flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300 select-none cursor-pointer"
          onClick={() => {
            setSelectedCallbackId(notificationToast.id);
            setNotificationToast(null);
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 animate-bounce">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-foreground flex items-center gap-2">
                <span>{notificationToast.title}</span>
                <span className="text-[9px] font-mono text-muted-foreground font-normal">{notificationToast.timestamp}</span>
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 font-medium">{notificationToast.body}</p>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setNotificationToast(null); }}
            className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION TITLE HEADER BLOCK */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <span>{language === 'ar' ? 'مركز محادثات وتواصل العملاء' : 'Customer Messaging & Callbacks Hub'}</span>
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {language === 'ar' 
                ? 'إدارة محادثات العملاء وتراسل طاقم العمل بنفس الهوية البصرية المعتمدة لمنصة بناء وإدارة'
                : 'Customer chat and staff responses integrated with Benaa & Edara design system'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 border border-border rounded-full px-3.5 bg-muted/30 focus-within:bg-card focus-within:ring-1 focus-within:ring-primary w-full sm:w-64 h-9 transition-all">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، الجوال...' : 'Search name, phone...'}
              className="w-full bg-transparent border-0 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-0 p-0 text-[11px] text-foreground placeholder:text-muted-foreground font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3-COLUMN MESSAGING CHAT SYSTEM */}
      <div className="flex flex-col lg:flex-row gap-0 h-[700px] items-stretch bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        
        {/* COLUMN 1: Chat List Sidebar */}
        <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col overflow-hidden bg-muted/10 border-border/50 ltr:border-r rtl:border-l h-full">
          <div className="p-3 border-b border-border bg-card shrink-0 space-y-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="font-extrabold text-xs text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span>{language === 'ar' ? 'قائمة المحادثات' : 'Conversations'}</span>
              </span>
              <span className="property-tag font-mono">
                {filteredRequests.length}
              </span>
            </div>

            {/* Status Filter Pill Selector Chips */}
            <div className="flex bg-muted p-1 rounded-full border border-border/80 select-none gap-1 overflow-x-auto custom-scrollbar">
              {[
                { key: 'ALL', labelAr: 'الكل', labelEn: 'All' },
                { key: 'PENDING', labelAr: 'معلق', labelEn: 'Pending' },
                { key: 'STILL_GOING', labelAr: 'نشط', labelEn: 'Active' },
                { key: 'CLOSED', labelAr: 'مغلق', labelEn: 'Closed' },
              ].map((pill) => {
                const active = statusFilter === pill.key;
                const count = pill.key === 'ALL' 
                  ? requests.length 
                  : requests.filter(r => r.status === pill.key).length;
                return (
                  <button
                    key={pill.key}
                    type="button"
                    onClick={() => setStatusFilter(pill.key)}
                    className={`flex-1 py-1 px-2.5 text-[9.5px] font-extrabold rounded-full transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 whitespace-nowrap ${
                      active
                        ? 'bg-primary text-primary-foreground font-black shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                    }`}
                  >
                    <span>{language === 'ar' ? pill.labelAr : pill.labelEn}</span>
                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-mono ${
                      active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted/80 text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40 custom-scrollbar bg-card">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-2">
                <MessageSquare className="w-8 h-8 text-muted-foreground/40 stroke-1" />
                <span>{language === 'ar' ? 'لا توجد محادثات' : 'No conversations'}</span>
              </div>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = req.id === selectedCallbackId;
                const lastNote = req.notes && req.notes.length > 0 ? req.notes[req.notes.length - 1] : null;
                const lastText = lastNote 
                  ? (lastNote.text || '').replace(/<[^>]*>/g, '') 
                  : (req.message || (language === 'ar' ? 'طلب تواصل جديد' : 'New callback request'));
                
                const initials = req.name ? req.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'C';

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedCallbackId(req.id)}
                    className={`px-3.5 py-3 cursor-pointer flex items-center gap-3 transition-colors border-b border-border/30 ${
                      isSelected 
                        ? 'bg-primary/10 ltr:border-l-4 rtl:border-r-4 border-primary' 
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`font-extrabold text-xs truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {req.name}
                        </span>
                        <span className="text-[9.5px] font-mono text-muted-foreground shrink-0">
                          {formatDate(lastNote?.createdAt || req.createdAt)}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground truncate font-medium flex items-center gap-1">
                        {lastNote && lastNote.authorName !== req.name && (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500 shrink-0 inline" />
                        )}
                        <span className="truncate">{lastText}</span>
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className={
                          req.status === 'CLOSED' ? 'property-tag' :
                          req.status === 'STILL_GOING' ? 'property-tag-emerald' :
                          'property-tag-amber'
                        }>
                          {req.status === 'CLOSED' ? (language === 'ar' ? 'مغلق' : 'Closed') :
                           req.status === 'STILL_GOING' ? (language === 'ar' ? 'نشط' : 'Active') :
                           (language === 'ar' ? 'معلق' : 'Pending')}
                        </span>

                        {req.handledBy && (
                          <span className="text-[8px] font-semibold text-muted-foreground truncate">
                            {req.handledBy}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Chat Viewport & Messages Thread */}
        <div className="flex-grow flex flex-col overflow-hidden bg-card h-full">
          {selectedCallback ? (
            <div className="flex flex-col h-full">
              
              {/* Header Bar */}
              <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between shrink-0 h-16 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    {selectedCallback.name ? selectedCallback.name.slice(0, 2).toUpperCase() : 'C'}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                      <span>{selectedCallback.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground font-semibold" dir="ltr">
                        ({selectedCallback.phone})
                      </span>
                    </h3>
                    <p className="text-[10.5px] text-primary font-bold flex items-center gap-1 mt-0.5">
                      {typingUser ? (
                        <>
                          <Circle className="w-2 h-2 fill-primary text-primary animate-ping" />
                          <span>{language === 'ar' ? `${typingUser} يكتب الآن...` : `${typingUser} is typing...`}</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                          <span>{language === 'ar' ? 'متصل عبر نظام التراسل المباشر' : 'Online via Live Chat'}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedCallback.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                  </a>

                  <a
                    href={`tel:${selectedCallback.phone}`}
                    className="p-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl transition-all cursor-pointer"
                    title={language === 'ar' ? 'اتصال هاتف' : 'Call Phone'}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Messages Thread Viewport */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-muted/10 custom-scrollbar relative">
                
                {/* Initial Customer Inquiry Bubble Card (NO SENDER NAME) */}
                {selectedCallback.message && (
                  <div className="w-full flex justify-start mb-2">
                    <div className="py-2.5 px-3.5 rounded-2xl text-xs space-y-1 bg-card border border-border max-w-[85%] sm:max-w-[75%] shadow-2xs">
                      <div className="font-extrabold text-foreground flex items-center justify-between gap-4 pb-1 border-b border-border/40">
                        <span className="text-[9.5px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {language === 'ar' ? 'الطلب الأول' : 'Initial Request'}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap m-0 text-foreground leading-relaxed pt-1">{selectedCallback.message}</p>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-muted-foreground pt-1 font-mono">
                        <span>{formatDate(selectedCallback.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer & Staff Live Replies */}
                {selectedCallback.notes?.filter(n => !(n.text || '').includes('📌 [ملاحظة داخلية]:')).map((note: any) => {
                  const currentUserId = currentUser?.id || currentUser?.username || currentUserName;
                  const isCustomer = note.senderRole === 'CUSTOMER' || note.authorId === 'CUSTOMER';
                  
                  const isSentByMe = !isCustomer && (
                    (note.authorId && currentUserId && note.authorId === currentUserId) ||
                    (note.authorName && currentUserName && note.authorName.trim().toLowerCase() === currentUserName.trim().toLowerCase())
                  );

                  const isOtherAdmin = !isCustomer && !isSentByMe;

                  return (
                    <div key={note.id} className={`w-full flex ${isSentByMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}>
                      <div className={`py-2.5 px-3.5 rounded-2xl text-xs space-y-1 max-w-[85%] sm:max-w-[75%] shadow-2xs ${
                        isSentByMe 
                          ? 'bg-primary/10 border border-primary/25 text-foreground rounded-tr-xs rtl:rounded-tr-2xl rtl:rounded-tl-xs' 
                          : isOtherAdmin
                          ? 'bg-amber-500/10 border border-amber-500/25 text-foreground rounded-tl-xs rtl:rounded-tl-2xl rtl:rounded-tr-xs'
                          : 'bg-card border border-border text-foreground rounded-tl-xs rtl:rounded-tl-2xl rtl:rounded-tr-xs'
                      }`}>
                        {/* ONLY display author name header if message was sent by ANOTHER admin/colleague */}
                        {isOtherAdmin && (
                          <div className="font-extrabold text-[11px] text-amber-600 dark:text-amber-400 pb-0.5 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{note.authorName}</span>
                          </div>
                        )}

                        <div 
                          className="whitespace-pre-wrap m-0 leading-relaxed text-xs font-normal text-foreground"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.text || '') }}
                        />
                        <div className="flex items-center justify-end gap-1 text-[9px] text-muted-foreground font-mono pt-1">
                          <span>{note.createdAt ? new Date(note.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          {isSentByMe && <CheckCheck className="w-3.5 h-3.5 text-sky-500 font-bold" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {typingUser && (
                  <div className="w-full flex justify-start">
                    <div className="py-2 px-3 rounded-2xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2 shadow-2xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>{language === 'ar' ? `${typingUser} يكتب...` : `${typingUser} is typing...`}</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Input Composer (With Image & Video Attachment Support) */}
              <div className="p-3 border-t border-border bg-card space-y-2 shrink-0">
                {callbackAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-1">
                    {callbackAttachments.map((item, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-border overflow-hidden group shadow-2xs bg-black/5 flex items-center justify-center">
                        {item.type === 'video' ? (
                          <div className="flex flex-col items-center justify-center p-1 text-center">
                            <Video className="w-6 h-6 text-primary" />
                            <span className="text-[8px] font-bold text-muted-foreground">فيديو</span>
                          </div>
                        ) : (
                          <img src={item.url} alt="Attachment" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => setCallbackAttachments(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSendCallbackReply} className="flex items-center gap-2">
                  <label 
                    className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0" 
                    title={language === 'ar' ? 'إرفاق صور وفيديوهات' : 'Attach images or videos'}
                  >
                    <input type="file" accept="image/*,video/*" multiple onChange={handleAddCallbackAttachment} className="hidden" />
                    <Paperclip className="w-4 h-4" />
                  </label>

                  <div className="flex items-center gap-1 shrink-0 bg-muted/40 p-1 rounded-xl border border-border/60">
                    <button
                      type="button"
                      onClick={handleToggleBold}
                      className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                        isBold ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      title={language === 'ar' ? 'خط عريض' : 'Bold'}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleItalic}
                      className={`px-2.5 py-1 text-[11px] font-black italic rounded-lg transition-all cursor-pointer ${
                        isItalic ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      title={language === 'ar' ? 'خط مائل' : 'Italic'}
                    >
                      I
                    </button>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) => {
                      setNoteText(e.currentTarget.innerHTML);
                      checkFormattingState();
                      emitTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendCallbackReply(e);
                      }
                    }}
                    onKeyUp={checkFormattingState}
                    onMouseUp={checkFormattingState}
                    onFocus={checkFormattingState}
                    className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs outline-none min-h-[42px] max-h-[100px] overflow-y-auto focus:ring-1 focus:ring-primary text-foreground leading-normal font-normal"
                    data-placeholder={language === 'ar' ? 'اكتب رسالة في المحادثة المباشرة (Enter للإرسال)...' : 'Type message (Enter to send)...'}
                  />

                  <button
                    type="submit"
                    disabled={sendingNote || (isHtmlEmpty(noteText) && callbackAttachments.length === 0)}
                    className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0 h-10 shadow-xs"
                  >
                    {sendingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{language === 'ar' ? 'إرسال' : 'Send'}</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="w-8 h-8" />
              </div>
              <span className="font-bold text-foreground text-sm">{language === 'ar' ? 'اختر محادثة للبدء التراسل المباشر' : 'Select a conversation to start live chat'}</span>
            </div>
          )}
        </div>

        {/* COLUMN 3: Inspector Panel & Sidebar Internal Note Box */}
        {selectedCallback ? (
          <div className="w-full lg:w-[280px] xl:w-[310px] shrink-0 border-border/50 ltr:border-l rtl:border-r bg-muted/10 p-4 flex flex-col gap-4 overflow-y-auto h-full text-xs">
            <div>
              <h4 className="font-extrabold text-xs text-foreground mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'بيانات العميل والاستحواذ' : 'Customer Info'}</span>
              </h4>

              <div className="space-y-2 bg-card p-3 rounded-xl border border-border text-xs">
                <p><strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong> {selectedCallback.name}</p>
                <p>
                  <strong>{language === 'ar' ? 'الجوال:' : 'Phone:'}</strong>{' '}
                  <a href={`tel:${selectedCallback.phone}`} className="text-primary font-mono font-bold hover:underline" dir="ltr">
                    {selectedCallback.phone}
                  </a>
                </p>
                {selectedCallback.email && (
                  <p className="truncate">
                    <strong>{language === 'ar' ? 'البريد:' : 'Email:'}</strong> {selectedCallback.email}
                  </p>
                )}
              </div>
            </div>

            {/* Handled By Badge */}
            {selectedCallback.handledBy ? (
              <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold text-center text-xs flex items-center justify-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>{language === 'ar' ? `المسؤول الحالي: ${selectedCallback.handledBy}` : `Assigned to: ${selectedCallback.handledBy}`}</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={claiming}
                onClick={() => handleClaimCallback(selectedCallback.id)}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>{language === 'ar' ? 'الموافقة والاستحواذ على المحادثة' : 'Claim Conversation'}</span>
              </button>
            )}

            {/* Status Update Quick Buttons */}
            <div className="space-y-2">
              <h5 className="font-extrabold text-[10px] text-muted-foreground uppercase">{language === 'ar' ? 'تحديث حالة المحادثة' : 'Status Update'}</h5>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleUpdateCallbackStatus(selectedCallback.id, 'STILL_GOING')}
                  className="w-full py-2 px-3 bg-card hover:bg-muted border border-border rounded-xl text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'محادثة نشطة مستمرة' : 'Active Conversation'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateCallbackStatus(selectedCallback.id, 'CLOSED')}
                  className="w-full py-2 px-3 bg-card hover:bg-muted border border-border rounded-xl text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إغلاق المحادثة' : 'Close Conversation'}</span>
                </button>
              </div>
            </div>

            {/* DEDICATED SIDEBAR INTERNAL STAFF NOTE FIELD */}
            <div className="space-y-2 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
              <div className="flex items-center justify-between">
                <h5 className="font-extrabold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <CornerDownLeft className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'ملاحظة داخلية خاصة بالموظفين:' : 'Staff Internal Note:'}</span>
                </h5>
                {!isEditingInternalNote && (
                  <button
                    type="button"
                    onClick={() => setIsEditingInternalNote(true)}
                    className="text-xs font-bold text-amber-600 hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                  </button>
                )}
              </div>

              {isEditingInternalNote ? (
                <form onSubmit={handleSaveSidebarInternalNote} className="space-y-2">
                  <textarea
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب ملاحظة داخلية خاصة بالموظفين...' : 'Write internal note (staff only)...'}
                    className="w-full bg-background border border-amber-500/40 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500 min-h-[70px]"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingInternalNote(false)}
                      className="px-2.5 py-1 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={savingInternalNote}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      {savingInternalNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{language === 'ar' ? 'حفظ' : 'Save'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-2.5 bg-background rounded-lg border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedCallback.internalNote ? (
                    selectedCallback.internalNote
                  ) : (
                    <span className="text-muted-foreground italic text-xs">
                      {language === 'ar' ? 'لا توجد ملاحظة داخلية بعد. اضغط تعديل لإضافة ملاحظة.' : 'No internal note saved yet.'}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Delete Request */}
            <div className="pt-2 border-t border-border mt-auto">
              <button
                type="button"
                onClick={() => handleDeleteCallback(selectedCallback.id)}
                className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'حذف المحادثة' : 'Delete Conversation'}</span>
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
