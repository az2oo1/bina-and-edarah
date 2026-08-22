import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { 
  Lock, User, AlertTriangle, Loader2, ArrowLeft, ArrowRight, KeyRound, Smartphone, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialog } from '../context/DialogContext';
import RenterDashboard, { RenterUnit } from '../components/renter/RenterDashboard';

export default function Login() {
  const { language } = useLanguage();
  const { showAlert } = useDialog();
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

  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role === 'RENTER' && u.phone) {
          setMode('renter');
          fetch(`/api/renter/my-units?phone=${encodeURIComponent(u.phone)}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
              if (data && Array.isArray(data)) {
                setUnits(data);
                setPhoneNumber(u.phone);
              } else {
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('storage'));
              }
            })
            .catch(() => {
              localStorage.removeItem('user');
              window.dispatchEvent(new Event('storage'));
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
        if (user.token) {
          localStorage.setItem('token', user.token);
        }
        window.dispatchEvent(new Event('storage'));
        navigate(['ADMIN', 'MANAGER', 'AGENT'].includes(user.role) ? '/admin' : '/dashboard');
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
      if (data.fakeOtpDelivery) {
        await showAlert(language === 'ar' ? `لغرض التجربة، الرمز هو: ${data.fakeOtpDelivery}` : `For testing, OTP is: ${data.fakeOtpDelivery}`);
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
        headers: { 'Content-Type': 'application/json' },
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
      <RenterDashboard
        units={units}
        phoneNumber={phoneNumber}
        onLogout={handleLogoutUnit}
      />
    );
  }

  return (
    <div 
      className="min-h-[calc(100vh-48px-64px)] bg-background text-foreground flex flex-col justify-center items-center px-4 py-8 sm:py-12" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }} className="w-full max-w-lg space-y-6">
        
        {/* Top Header Controls: Back Button & Mode Switcher Tabs */}
        <motion.div layout className="flex items-center justify-between gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card hover:bg-muted border border-border/80 px-4 py-2 rounded-full shadow-xs active:scale-95"
          >
            {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5 text-primary" /> : <ArrowLeft className="w-3.5 h-3.5 text-primary" />}
            <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </Link>

          {/* Mode Switcher Segmented Control */}
          <div className="bg-card p-1 rounded-2xl flex items-center gap-1 border border-border shadow-xs">
            <button
              type="button"
              onClick={() => { setMode('renter'); setError(''); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'renter'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المستأجرين' : 'Renters'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('admin'); setError(''); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'admin'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الموظفين' : 'Staff'}</span>
            </button>
          </div>
        </motion.div>

        {/* Outer Card Container with Framer Motion layout animation for outer box expansion/collapse */}
        <motion.div 
          layout
          transition={{
            layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
          }}
          className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm overflow-hidden relative"
        >
          {/* Animated Header */}
          <motion.div layout="position" className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {mode === 'renter' 
                ? (language === 'ar' ? 'تسجيل دخول المستأجرين' : 'Renter Account Access')
                : (language === 'ar' ? 'بوابة دخول الإدارة والموظفين' : 'Staff Login')}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mode === 'renter'
                ? (language === 'ar' ? 'أدخل رقم جوالك المسجل لتصلك رسالة التحقق الفورية (OTP)' : 'Enter your registered phone number to receive your OTP.')
                : (language === 'ar' ? 'أدخل اسم المستخدم وكلمة المرور الخاصة بموظفي الشركة' : 'Enter your credentials to access management portal.')}
            </p>
          </motion.div>

          {error && (
            <motion.div 
              layout="position"
              className="bg-destructive/10 text-destructive p-3.5 rounded-2xl text-xs font-bold border border-destructive/20 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form container with mode="popLayout" for instant layout height recalculation and smooth box expansion/collapse */}
          <AnimatePresence mode="popLayout" initial={false}>
            {mode === 'renter' ? (
              <motion.div
                key="renter-wrapper"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <form onSubmit={hasOtpSent ? handleRenterLogin : handleRequestOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground block px-1">
                      {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                    </label>
                    <div className="relative flex items-center w-full" dir="ltr">
                      <div className="absolute inset-y-0 left-0 pl-3.5 pr-3 flex items-center pointer-events-none select-none border-r border-border/80 my-2 gap-2 z-10" dir="ltr">
                        <img src="/sa-flag.png" alt="Saudi Arabia" className="w-5.5 h-3.5 object-contain rounded-xs shadow-2xs" />
                        <span className="text-xs font-mono font-bold text-foreground" dir="ltr">+966</span>
                      </div>
                      <input 
                        type="tel"
                        required
                        disabled={hasOtpSent}
                        dir="ltr"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="05XXXXXXXX"
                        className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3.5 pl-[100px] pr-4 text-xs font-mono font-bold text-foreground outline-none transition-all disabled:opacity-60 shadow-xs"
                      />
                    </div>
                  </div>

                  {hasOtpSent && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-xs font-bold text-muted-foreground block">
                          {language === 'ar' ? 'رمز التحقق (OTP)' : 'Verification Code (OTP)'}
                        </label>
                        <button 
                          type="button" 
                          onClick={() => setHasOtpSent(false)} 
                          className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                        >
                          {language === 'ar' ? 'تعديل رقم الجوال' : 'Edit Phone'}
                        </button>
                      </div>
                      <input 
                        type="text"
                        required
                        dir="ltr"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="XXXX"
                        className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3.5 px-4 text-center font-mono text-xl tracking-widest font-black text-foreground outline-none transition-all shadow-xs"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground font-black py-3.5 rounded-2xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : hasOtpSent ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <Smartphone className="w-4 h-4" />
                    )}
                    <span>{hasOtpSent ? (language === 'ar' ? 'تحقق ودخول' : 'Verify & Access') : (language === 'ar' ? 'إرسال رمز التحقق' : 'Send Code')}</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="admin-wrapper"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <form onSubmit={handleAdminLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground block px-1">
                      {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3.5 ps-10 pe-4 text-xs font-bold text-foreground outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground block px-1">
                      {language === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3.5 ps-10 pe-4 text-xs font-bold text-foreground outline-none transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground font-black py-3.5 rounded-2xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50 mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>{language === 'ar' ? 'دخول موظفي الإدارة' : 'Staff Access Login'}</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer link with layout position */}
          <motion.div layout="position" className="pt-4 border-t border-border/80 text-center text-xs text-muted-foreground">
            <span>{language === 'ar' ? 'هل تحتاج لمساعدة؟' : 'Need help?'} </span>
            <Link to="/contact" className="font-bold text-primary hover:underline">
              {language === 'ar' ? 'التواصل مع خدمة العملاء' : 'Contact Support'}
            </Link>
          </motion.div>

        </motion.div>

      </motion.div>
    </div>
  );
}
