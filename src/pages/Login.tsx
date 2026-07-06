import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { Lock, User, Phone, AlertTriangle, Building2, Calendar, FileText, ChevronLeft, CreditCard, History, Banknote, Landmark, CheckCircle2, UploadCloud, Loader2, Eye } from 'lucide-react';
import { SrIcon } from '../components/SrIcon';

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
  contractEndDate: string;
  nextRentDue: string | null;
  rentAmount: number | null;
  isTanfeeth: boolean;
  propertyName: string;
  transferDetails: string | null;
  rentHistory: RentHistory[];
}

export default function Login() {
  const { language, t } = useLanguage();
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

  // Common
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role === 'RENTER' && u.phone) {
          setMode('renter');
          // auto fetch
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
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
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
      // In development show the fake delivery
      if (data.fakeOtpDelivery) {
        alert(language === 'ar' ? `لغرض التجربة، الرمز هو: ${data.fakeOtpDelivery}` : `For testing, OTP is: ${data.fakeOtpDelivery}`);
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: phoneNumber, otp })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || (language === 'ar' ? 'حدث خطأ أثناء تسجيل الدخول' : 'Failed to login'));
      }

      setUnits(data);
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
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/renter/upload-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId, receiptUrl: base64 })
      });

      if (res.ok) {
        // Refresh units
        const loginRes = await fetch('/api/renter/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneNumber, otp })
        });
        if (loginRes.ok) {
          const data = await loginRes.json();
          setUnits(data);
        }
        alert(language === 'ar' ? 'تم رفع الإيصال بنجاح. سيتم مراجعته.' : 'Receipt uploaded successfully. It will be reviewed.');
      } else {
        alert(language === 'ar' ? 'حدث خطأ أثناء الرفع.' : 'Error uploading receipt.');
      }
    } catch (err) {
      console.error(err);
      alert(language === 'ar' ? 'فشل الرفع' : 'Upload failed');
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

  if (units) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-foreground">{language === 'ar' ? 'مرحباً،' : 'Hello,'} {units[0]?.renterName}</h1>
            <button 
              onClick={handleLogoutUnit}
              className="text-muted-foreground font-bold hover:text-black transition-colors flex items-center gap-2 bg-card px-4 py-2 rounded-xl border shadow-sm"
            >
              <ChevronLeft className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
              {language === 'ar' ? 'خروج' : 'Logout'}
            </button>
          </div>
          <p className="text-muted-foreground font-medium mb-6">{language === 'ar' ? 'الوحدات المستأجرة الخاصة بك' : 'Your rented units'} ({units.length}):</p>
          
          <div className="space-y-6">
            {units.map((unit, i) => (
              <div key={i} className="bg-card rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
                {unit.isTanfeeth && (
                   <div className="bg-red-500 text-foreground font-bold text-center px-4 py-3 flex items-center justify-center gap-2">
                     <AlertTriangle className="w-6 h-6" />
                     {language === 'ar' ? 'يوجد مطالبة مالية أو محكمة نشطة ضدكم. يرجى التواصل معنا فوراً.' : 'There is an active financial claim. Please contact us.'}
                   </div>
                )}
                
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-foreground mb-1">{unit.renterName}</h2>
                        <div className="text-muted-foreground font-bold text-sm flex items-center gap-3">
                           <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {unit.propertyName}</span>
                           <span className="text-gray-300">|</span>
                           <span>{language === 'ar' ? 'وحدة رقم:' : 'Unit No:'} <span className="text-black">{unit.unitNumber}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {unit.transferDetails && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                      <Landmark className="w-8 h-8 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">{language === 'ar' ? 'بيانات التحويل البنكي' : 'Bank Transfer Details'}</h4>
                        <p className="text-blue-800 whitespace-pre-wrap">{unit.transferDetails}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background">
                      <FileText className="w-8 h-8 text-indigo-500" />
                      <div>
                        <span className="block text-muted-foreground font-medium text-sm">{language === 'ar' ? 'تاريخ انتهاء العقد' : 'Contract End Date'}</span>
                        <span className="block text-lg font-bold text-foreground" dir="ltr">{unit.contractEndDate || (language === 'ar' ? 'غير محدد' : 'Unknown')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background">
                      <Banknote className="w-8 h-8 text-emerald-500" />
                      <div>
                        <span className="block text-muted-foreground font-medium text-sm">{language === 'ar' ? 'قيمة الإيجار' : 'Rent Amount'}</span>
                        <span className="flex items-center gap-1 text-lg font-bold text-foreground" dir="ltr">
                          {unit.rentAmount ? Math.floor(unit.rentAmount).toLocaleString() : '---'} <SrIcon className="w-4 h-4 text-emerald-500" />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-background border-orange-200 border">
                      <Calendar className="w-8 h-8 text-orange-500" />
                      <div>
                        <span className="block text-muted-foreground font-medium text-sm">{language === 'ar' ? 'موعد الإيجار القادم' : 'Next Rent Due'}</span>
                        {unit.nextRentDue ? (
                          <span className="block text-lg font-bold text-orange-600" dir="ltr">{unit.nextRentDue}</span>
                        ) : (
                          <span className="block text-lg font-bold text-green-600">{language === 'ar' ? 'لا يوجد متأخرات' : 'No arrears'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground border-b border-gray-100 pb-4">
                      <History className="w-5 h-5 text-muted-foreground" />
                      {language === 'ar' ? 'سجل الدفعات' : 'Payment History'}
                    </h3>
                    
                    {unit.rentHistory && unit.rentHistory.length > 0 ? (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {unit.rentHistory.map((h, hIdx) => {
                           const paidDateStr = h.paidDate || '';
                           const amountStr = typeof h.amount === 'string' ? h.amount : (h.amount?.toString() || '');
                           const isLate = paidDateStr.includes('متاخرات') || amountStr.includes('متاخرات');
                           const isPaid = !!h.receiptUrl || (paidDateStr.trim() !== '' && !isLate) || amountStr.includes('مسدد') || (!isNaN(Number(amountStr)) && Number(amountStr) > 0 && !isLate);

                           let isUnpaidPassed = false;
                           let isFuture = false;
                           let actualPaidDate = '';
                           
                           const dueDateObj = new Date(h.dueDate);
                           if (!isNaN(dueDateObj.getTime())) {
                               const today = new Date();
                               today.setHours(0,0,0,0);
                               const d = new Date(dueDateObj);
                               d.setHours(0,0,0,0);
                               if (d > today) {
                                   isFuture = true;
                               } else {
                                   isUnpaidPassed = true;
                               }
                           }

                           let statusText = language === 'ar' ? 'غير مسدد' : 'Unpaid';
                           if (isLate) {
                               statusText = language === 'ar' ? 'متأخرات' : 'Late';
                               if (paidDateStr.includes('متاخرات')) statusText = paidDateStr;
                               else if (amountStr.includes('متاخرات')) statusText = amountStr;
                            } else if (isPaid) {
                               statusText = language === 'ar' ? 'مسدد' : 'Paid';
                               if (paidDateStr.trim()) actualPaidDate = paidDateStr;
                            } else if (isFuture) {
                               statusText = language === 'ar' ? 'مجدول' : 'Scheduled';
                              statusText = language === 'ar' ? 'مستحق الدفع' : 'Payment Due'; 
                           }
                           
                           const isScheduled = !isPaid && !isLate && isFuture;
                           const isDue = !isPaid && !isLate && isUnpaidPassed;

                           return (
                             <div key={h.id || hIdx} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isPaid ? 'border-green-100 bg-green-50/30' : isLate ? 'border-orange-200 bg-orange-50/50' : isDue ? 'border-orange-200 bg-orange-50/50' : isScheduled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-background'}`}>
                               <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-100 text-green-600' : isScheduled ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                  {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                                </div>
                                <div className="space-y-1 mt-1">
                                  <p className="font-bold text-foreground m-0 leading-tight">
                                    {language === 'ar' ? `تاريخ الاستحقاق:` : `Due Date:`} <span dir="ltr" className="ml-1 text-gray-700">{h.dueDate}</span>
                                  </p>
                                  <div className="text-sm flex flex-col gap-0.5 text-muted-foreground leading-tight">
                                    <div className="flex items-center gap-1 mt-1">
                                      <span>{language === 'ar' ? 'الحالة:' : 'Payment:'}</span>
                                      <span className={`font-bold ${isPaid ? 'text-green-600' : isScheduled ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {statusText}
                                      </span>
                                    </div>
                                    {isPaid && actualPaidDate && (
                                      <div className="flex items-center gap-1">
                                          <span>{language === 'ar' ? 'تاريخ السداد:' : 'Paid Date:'}</span>
                                          <span className="font-bold text-foreground">{actualPaidDate}</span>
                                      </div>
                                    )}
                                    {amountStr.trim() !== '' && statusText !== amountStr && actualPaidDate !== amountStr && (
                                      <div className="flex items-center gap-1">
                                        <span>{language === 'ar' ? 'المبلغ:' : 'Amount:'}</span>
                                        <span className="font-bold text-foreground">{amountStr} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                {h.receiptUrl ? (
                                  <>
                                    <a href={h.receiptUrl} target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center text-sm bg-card border border-gray-200 hover:bg-gray-100 text-gray-800 font-bold px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1">
                                      <Eye className="w-4 h-4" />
                                      {language === 'ar' ? 'عرض الإيصال' : 'Preview'}
                                    </a>
                                    <label className="relative cursor-pointer flex-1 md:flex-none text-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm">
                                      <input 
                                        type="file" 
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleUploadReceipt(h.id, e)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      />
                                      {uploadingReceiptFor === h.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <UploadCloud className="w-4 h-4" />
                                      )}
                                      {language === 'ar' ? 'إعادة رفع' : 'Reupload'}
                                    </label>
                                  </>
                                ) : !isPaid ? (
                                  <label className="relative cursor-pointer w-full md:w-auto text-center px-4 py-2 bg-black hover:bg-gray-800 text-foreground font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-2 md:mt-0">
                                     <input 
                                       type="file" 
                                       accept="image/*,application/pdf"
                                       onChange={(e) => handleUploadReceipt(h.id, e)}
                                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                     />
                                     {uploadingReceiptFor === h.id ? (
                                       <Loader2 className="w-4 h-4 animate-spin" />
                                     ) : (
                                       <UploadCloud className="w-4 h-4" />
                                     )}
                                     {language === 'ar' ? 'رفع الإيصال' : 'Upload Receipt'}
                                  </label>
                                ) : null}
                              </div>
                            </div>
                           );         <Loader2 className="w-4 h-4 animate-spin" />
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-6">{language === 'ar' ? 'لا يوجد سجلات' : 'No history'}</p>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {loading ? (
          /* Rhea Syncing/Loading state */
          <div data-slot="card" data-size="default" className="cn-card group/card flex flex-col">
            <div data-slot="card-content" className="cn-card-content p-0">
              <div data-slot="empty" className="cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance p-8">
                <div data-slot="empty-header" className="cn-empty-header flex max-w-sm flex-col items-center">
                  <div data-slot="empty-icon" data-variant="icon" className="cn-empty-media flex shrink-0 items-center justify-center cn-empty-media-icon text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-circle animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
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
          /* Rhea Access Card */
          <div data-slot="card" data-size="default" className="cn-card group/card flex flex-col">
            
            {/* Card Header */}
            <div data-slot="card-header" className="cn-card-header group/card-header grid auto-rows-min items-start">
              <div data-slot="card-title" className="cn-card-title cn-font-heading text-xl font-bold">
                {mode === 'renter' 
                  ? (language === 'ar' ? 'بوابة المستأجرين' : 'Renter Account Access')
                  : (language === 'ar' ? 'تسجيل دخول الإدارة' : 'Staff Account Access')}
              </div>
              <div data-slot="card-description" className="cn-card-description text-xs text-muted-foreground">
                {mode === 'renter'
                  ? (language === 'ar' ? 'أدخل رقم جوالك المسجل لتصلك رسالة التحقق' : 'Enter your registered phone number to authenticate.')
                  : (language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بموظفي الشركة' : 'Update your credentials or re-authenticate.')}
              </div>
            </div>

            {/* Error message inside the card if present */}
            {error && (
              <div className="px-6 mb-4">
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-xs font-semibold border border-destructive/20 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Card Content Form */}
            <div data-slot="card-content" className="cn-card-content">
              {mode === 'renter' ? (
                <form onSubmit={hasOtpSent ? handleRenterLogin : handleRequestOtp} className="space-y-4">
                  <div data-slot="field-group" className="cn-field-group">
                    
                    {/* Phone Number Field */}
                    <div role="group" data-slot="field" className="cn-field">
                      <label data-slot="field-label" className="cn-label" htmlFor="phone-number">
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
                        className="cn-input disabled:opacity-50"
                      />
                      {!hasOtpSent && (
                        <p className="text-[10px] mt-1.5 text-muted-foreground flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                          {language === 'ar' ? 'سيتم إرسال رمز التحقق عبر الواتساب (WhatsApp)' : 'Verification code will be sent via WhatsApp'}
                        </p>
                      )}
                    </div>

                    {/* OTP Field if sent */}
                    {hasOtpSent && (
                      <div role="group" data-slot="field" className="cn-field">
                        <div className="flex items-center justify-between">
                          <label data-slot="field-label" className="cn-label" htmlFor="otp-code">
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
                          className="cn-input tracking-widest text-center"
                        />
                      </div>
                    )}

                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="cn-button cn-button-variant-default w-full"
                    >
                      <Lock className="w-4 h-4" />
                      {hasOtpSent ? (language === 'ar' ? 'تحقق ودخول' : 'Verify & Login') : (language === 'ar' ? 'إرسال الرمز' : 'Send Code')}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div data-slot="field-group" className="cn-field-group">
                    
                    {/* Username Field */}
                    <div role="group" data-slot="field" className="cn-field">
                      <label data-slot="field-label" className="cn-label" htmlFor="username">
                        {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                      </label>
                      <input 
                        id="username" 
                        data-slot="input" 
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="cn-input"
                      />
                    </div>

                    {/* Password Field */}
                    <div role="group" data-slot="field" className="cn-field">
                      <div className="flex items-center justify-between">
                        <label data-slot="field-label" className="cn-label" htmlFor="password">
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
                        className="cn-input"
                      />
                    </div>

                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="cn-button cn-button-variant-default w-full"
                    >
                      <Lock className="w-4 h-4" />
                      {language === 'ar' ? 'دخول موظفي الإدارة' : 'Staff Access Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Card Footer containing Danger Zone / Switch Option */}
            <div data-slot="card-footer" className="cn-card-footer flex items-center flex-col gap-4">
              {mode === 'renter' ? (
                <button 
                  type="button" 
                  onClick={() => { setMode('admin'); setError(''); }} 
                  className="cn-button cn-button-variant-outline w-full"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  {language === 'ar' ? 'بوابة دخول موظفي الشركة' : 'Switch to Staff & Admin Login'}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setMode('renter'); setError(''); }} 
                  className="cn-button cn-button-variant-outline w-full"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  {language === 'ar' ? 'العودة لبوابة المستأجرين' : 'Switch to Renter Portal'}
                </button>
              )}

              {/* Danger Zone Banner */}
              <Link to="/contact" className="cn-item flex items-center w-full justify-between hover:bg-muted/50 hover:border-muted-foreground/30 transition-all duration-200 p-4 rounded-xl border border-border cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert text-destructive"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                  </div>
                  <div className="cn-item-content text-right rtl:text-right ltr:text-left">
                    <div className="cn-item-title text-xs font-bold text-foreground">
                      {language === 'ar' ? 'دعم المستأجرين' : 'Need Assistance?'}
                    </div>
                    <p className="cn-item-description text-[10px] text-muted-foreground">
                      {language === 'ar' ? 'تواصل مع الدعم الفني لإدارة العقار مباشرة' : 'Contact properties team for technical help'}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
