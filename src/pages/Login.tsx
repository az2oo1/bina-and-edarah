import React, { useState } from 'react';
import { useNavigate } from 'react-router';
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-gray-900">{language === 'ar' ? 'مرحباً،' : 'Hello,'} {units[0]?.renterName}</h1>
            <button 
              onClick={handleLogoutUnit}
              className="text-gray-500 font-bold hover:text-black transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm"
            >
              <ChevronLeft className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
              {language === 'ar' ? 'خروج' : 'Logout'}
            </button>
          </div>
          <p className="text-gray-600 font-medium mb-6">{language === 'ar' ? 'الوحدات المستأجرة الخاصة بك' : 'Your rented units'} ({units.length}):</p>
          
          <div className="space-y-6">
            {units.map((unit, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
                {unit.isTanfeeth && (
                   <div className="bg-red-500 text-white font-bold text-center px-4 py-3 flex items-center justify-center gap-2">
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
                        <h2 className="text-2xl font-black text-gray-900 mb-1">{unit.renterName}</h2>
                        <div className="text-gray-500 font-bold text-sm flex items-center gap-3">
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
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                      <FileText className="w-8 h-8 text-indigo-500" />
                      <div>
                        <span className="block text-gray-500 font-medium text-sm">{language === 'ar' ? 'تاريخ انتهاء العقد' : 'Contract End Date'}</span>
                        <span className="block text-lg font-bold text-gray-900" dir="ltr">{unit.contractEndDate || (language === 'ar' ? 'غير محدد' : 'Unknown')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                      <Banknote className="w-8 h-8 text-emerald-500" />
                      <div>
                        <span className="block text-gray-500 font-medium text-sm">{language === 'ar' ? 'قيمة الإيجار' : 'Rent Amount'}</span>
                        <span className="flex items-center gap-1 text-lg font-bold text-gray-900" dir="ltr">
                          {unit.rentAmount ? Math.floor(unit.rentAmount).toLocaleString() : '---'} <SrIcon className="w-4 h-4 text-emerald-500" />
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border-orange-200 border">
                      <Calendar className="w-8 h-8 text-orange-500" />
                      <div>
                        <span className="block text-gray-500 font-medium text-sm">{language === 'ar' ? 'موعد الإيجار القادم' : 'Next Rent Due'}</span>
                        {unit.nextRentDue ? (
                          <span className="block text-lg font-bold text-orange-600" dir="ltr">{unit.nextRentDue}</span>
                        ) : (
                          <span className="block text-lg font-bold text-green-600">{language === 'ar' ? 'لا يوجد متأخرات' : 'No arrears'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-900 border-b border-gray-100 pb-4">
                      <History className="w-5 h-5 text-gray-400" />
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
                             <div key={h.id || hIdx} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isPaid ? 'border-green-100 bg-green-50/30' : isLate ? 'border-orange-200 bg-orange-50/50' : isDue ? 'border-orange-200 bg-orange-50/50' : isScheduled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'}`}>
                               <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isPaid ? 'bg-green-100 text-green-600' : isScheduled ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                  {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                                </div>
                                <div className="space-y-1 mt-1">
                                  <p className="font-bold text-gray-900 m-0 leading-tight">
                                    {language === 'ar' ? `تاريخ الاستحقاق:` : `Due Date:`} <span dir="ltr" className="ml-1 text-gray-700">{h.dueDate}</span>
                                  </p>
                                  <div className="text-sm flex flex-col gap-0.5 text-gray-600 leading-tight">
                                    <div className="flex items-center gap-1 mt-1">
                                      <span>{language === 'ar' ? 'الحالة:' : 'Payment:'}</span>
                                      <span className={`font-bold ${isPaid ? 'text-green-600' : isScheduled ? 'text-blue-600' : 'text-orange-600'}`}>
                                        {statusText}
                                      </span>
                                    </div>
                                    {isPaid && actualPaidDate && (
                                      <div className="flex items-center gap-1">
                                          <span>{language === 'ar' ? 'تاريخ السداد:' : 'Paid Date:'}</span>
                                          <span className="font-bold text-gray-900">{actualPaidDate}</span>
                                      </div>
                                    )}
                                    {amountStr.trim() !== '' && statusText !== amountStr && actualPaidDate !== amountStr && (
                                      <div className="flex items-center gap-1">
                                        <span>{language === 'ar' ? 'المبلغ:' : 'Amount:'}</span>
                                        <span className="font-bold text-gray-900">{amountStr} {language === 'ar' ? 'ريال' : 'SAR'}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                {h.receiptUrl ? (
                                  <>
                                    <a href={h.receiptUrl} target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center text-sm bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-bold px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1">
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
                                  <label className="relative cursor-pointer w-full md:w-auto text-center px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm mt-2 md:mt-0">
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
                      <p className="text-gray-400 text-center py-6">{language === 'ar' ? 'لا يوجد سجلات' : 'No history'}</p>
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
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex justify-center w-12 h-12 bg-primary rounded-lg shadow-xs items-center text-white">
          {mode === 'renter' ? <Phone className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold text-foreground tracking-tight">
          {mode === 'renter' 
            ? (language === 'ar' ? 'بوابة المستأجرين' : 'Renter Portal')
            : (language === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Login')}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm mx-auto">
          {mode === 'renter'
            ? (language === 'ar' ? 'الرجاء إدخال رقم الجوال المسجل في العقد للمتابعة' : 'Please enter your registered phone number to continue')
            : (language === 'ar' ? 'سجل دخولك لإدارة العقارات والمشاريع' : 'Login to manage properties and projects')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs sm:rounded-lg sm:px-10 border border-border">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6 text-sm font-medium border border-destructive/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'renter' ? (
            <form className="space-y-4" onSubmit={hasOtpSent ? handleRenterLogin : handleRequestOtp}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Phone className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={hasOtpSent}
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`block w-full border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring outline-none transition-shadow ${language === 'ar' ? 'pr-9' : 'pl-9'} disabled:bg-muted disabled:text-muted-foreground`}
                    placeholder="0500000000"
                  />
                </div>
                {!hasOtpSent && (
                  <p className="text-xs mt-2 text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    {language === 'ar' ? 'سيتم إرسال رمز التحقق عبر الواتساب (WhatsApp)' : 'Verification code will be sent via WhatsApp'}
                  </p>
                )}
              </div>

              {hasOtpSent && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {language === 'ar' ? 'رمز التحقق (OTP)' : 'Verification Code (OTP)'}
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                      <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`block w-full border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring outline-none transition-shadow tracking-widest ${language === 'ar' ? 'pr-9' : 'pl-9'}`}
                      placeholder="----"
                      maxLength={4}
                    />
                  </div>
                  <button type="button" onClick={() => {setHasOtpSent(false); setOtp('');}} className="mt-2 text-xs text-primary hover:underline font-medium">
                    {language === 'ar' ? 'تعديل رقم الجوال' : 'Change Phone Number'}
                  </button>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center py-2 px-4 shadow-sm text-sm font-medium text-white transition-colors focus:outline-none"
              >
                {loading ? (language === 'ar' ? 'يرجى الانتظار...' : 'Please Wait...') : (
                  hasOtpSent ? (language === 'ar' ? 'تحقق ودخول' : 'Verify & Login') : (language === 'ar' ? 'إرسال الرمز' : 'Send Code')
                )}
              </button>
              
              <div className="mt-4 text-center text-sm border-t pt-4 border-border">
                 <button type="button" onClick={() => { setMode('admin'); setError(''); }} className="btn-ghost w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                   <Lock className="w-3.5 h-3.5" />
                   {language === 'ar' ? 'دخول موظفي الإدارة' : 'Admin Login'}
                 </button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleAdminLogin}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring outline-none transition-shadow ${language === 'ar' ? 'pr-9' : 'pl-9'}`}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring outline-none transition-shadow ${language === 'ar' ? 'pr-9' : 'pl-9'}`}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center py-2 px-4 shadow-sm text-sm font-medium text-white transition-colors focus:outline-none"
              >
                {loading ? (language === 'ar' ? 'جاري التحقق...' : 'Logging in...') : (language === 'ar' ? 'دخول' : 'Login')}
              </button>
              
              <div className="mt-4 text-center text-sm border-t pt-4 border-border">
                 <button type="button" onClick={() => { setMode('renter'); setError(''); }} className="btn-ghost w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-2">
                   <Phone className="w-3.5 h-3.5" />
                   {language === 'ar' ? 'العودة لبوابة المستأجرين' : 'Back to Renter Portal'}
                 </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
