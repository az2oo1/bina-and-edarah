import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { 
  Lock, User, Phone, AlertTriangle, Loader2, ArrowLeft, ArrowRight, KeyRound, Smartphone, ShieldCheck
} from 'lucide-react';
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
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <div className="mb-6 flex justify-start select-none">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/60 backdrop-blur-xs hover:bg-muted border border-border/80 px-4 py-2 rounded-full shadow-xs active:scale-[0.97]"
          >
            {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5 text-primary" /> : <ArrowLeft className="w-3.5 h-3.5 text-primary" />}
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="bg-card border border-border rounded-3xl p-10 text-center space-y-4 shadow-lg">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-foreground">{language === 'ar' ? 'جاري التحقق والدخول...' : 'Syncing your account...'}</h2>
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'نقوم بالتحقق من بياناتك وتوصيلك بالنظام.' : 'Verifying credentials...'}</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl shadow-lg p-6 sm:p-8 space-y-6">
            
            <div>
              <h2 className="text-xl font-black text-foreground">
                {mode === 'renter' 
                  ? (language === 'ar' ? 'بوابة المستأجرين' : 'Renter Account Access')
                  : (language === 'ar' ? 'تسجيل دخول الإدارة' : 'Staff Account Access')}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === 'renter'
                  ? (language === 'ar' ? 'أدخل رقم جوالك المسجل لتصلك رسالة التحقق' : 'Enter your registered phone number to authenticate.')
                  : (language === 'ar' ? 'أدخل بيانات الاعتماد الخاصة بموظفي الشركة' : 'Update your credentials or re-authenticate.')}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-2xl text-xs font-semibold border border-destructive/20 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {mode === 'renter' ? (
              <form onSubmit={hasOtpSent ? handleRenterLogin : handleRequestOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground block px-1">
                    {language === 'ar' ? 'رقم الجوال' : 'Phone Number'}
                  </label>
                  <div className="relative flex items-center w-full" dir="ltr">
                    <div className="absolute inset-y-0 left-0 pl-3 pr-2.5 flex items-center pointer-events-none select-none border-r border-border/80 my-1.5 gap-2 z-10" dir="ltr">
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
                      className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3 pl-20 pr-4 text-xs font-mono font-bold text-foreground outline-none transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {hasOtpSent && (
                  <div className="space-y-1">
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
                      className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3 px-4 text-center font-mono text-lg tracking-widest font-black text-foreground outline-none transition-all"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-black py-3.5 rounded-2xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50"
                >
                  {hasOtpSent ? <ShieldCheck className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  <span>{hasOtpSent ? (language === 'ar' ? 'تحقق ودخول' : 'Verify & Login') : (language === 'ar' ? 'إرسال الرمز' : 'Send Code')}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground block px-1">
                    {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute top-3.5 left-3 text-muted-foreground" />
                    <input 
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-foreground outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground block px-1">
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute top-3.5 left-3 text-muted-foreground" />
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-background border border-border focus:ring-2 focus:ring-primary/20 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-foreground outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-black py-3.5 rounded-2xl shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{language === 'ar' ? 'دخول موظفي الإدارة' : 'Staff Access Login'}</span>
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-border text-center">
              {mode === 'renter' ? (
                <button 
                  type="button" 
                  onClick={() => { setMode('admin'); setError(''); }} 
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'بوابة دخول موظفي الشركة' : 'Switch to Staff & Admin Login'}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={() => { setMode('renter'); setError(''); }} 
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'العودة لبوابة المستأجرين' : 'Switch to Renter Login'}
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
