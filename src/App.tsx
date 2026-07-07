import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router';
import { Building2, Home as HomeIcon, MapPin, UserCircle, Globe, Lock, LogOut, Menu, X } from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { Logo } from './components/Logo';
import { SocialIconsRow, SocialLinks } from './components/SocialIcons';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';

function useLogoUrl() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
          let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.logoUrl;
        }
      })
      .catch(() => {});
    const onStorage = () => {
      const cached = sessionStorage.getItem('logoUrl');
      if (cached) setLogoUrl(cached);
    };
    window.addEventListener('logoUpdated', onStorage);
    return () => window.removeEventListener('logoUpdated', onStorage);
  }, []);
  return logoUrl;
}

function useSocialSettings(): SocialLinks {
  const [links, setLinks] = useState<SocialLinks>({});
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setLinks({
        whatsappNumber: data.whatsappNumber,
        instagramUrl: data.instagramUrl,
        twitterUrl: data.twitterUrl,
        facebookUrl: data.facebookUrl,
        linkedinUrl: data.linkedinUrl,
        youtubeUrl: data.youtubeUrl,
        tiktokUrl: data.tiktokUrl,
        snapchatUrl: data.snapchatUrl,
        email: data.email,
      }))
      .catch(() => {});
  }, []);
  return links;
}

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<{username: string, role: string} | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const logoUrl = useLogoUrl();
  const socialLinks = useSocialSettings();

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    fetch('/api/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
    setIsOpen(false);
  };

  return (
    <nav className="bg-card/95 border-b border-border shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-6 sm:rtl:ml-6 sm:rtl:mr-0 group">
              <div className="bg-white rounded-lg p-1 shadow-md flex-shrink-0">
                <Logo className="h-8 w-8" logoUrl={logoUrl} />
              </div>
              <span className="font-bold text-base text-foreground tracking-wide hidden md:block">{t('hero.title')}</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6 lg:gap-10">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-amber-400 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/projects" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-amber-400 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.projects')}
              </Link>
              <Link to="/properties" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-amber-400 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {t('nav.properties')}
              </Link>
              <Link to="/contact" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-amber-400 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:border-foreground transition-all flex items-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'RENTER' ? '/login' : '/dashboard'} 
                  className="px-3.5 py-1.5 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>{user.role === 'ADMIN' ? t('nav.admin') : user.role === 'RENTER' ? (language === 'ar' ? 'البوابة' : 'Portal') : t('nav.dashboard')}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  title={language === 'ar' ? 'تسجيل خروج' : 'Logout'}
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md"
              >
                <UserCircle className="w-4 h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-1.5"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="sm:hidden bg-card border-t border-border px-4 py-4 space-y-3">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className="block text-muted-foreground hover:text-foreground text-xs font-semibold py-1 border-b border-border/5"
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/projects" 
            onClick={() => setIsOpen(false)}
            className="block text-muted-foreground hover:text-foreground text-xs font-semibold py-1 border-b border-border/5"
          >
            {t('nav.projects')}
          </Link>
          <Link 
            to="/properties" 
            onClick={() => setIsOpen(false)}
            className="block text-muted-foreground hover:text-foreground text-xs font-semibold py-1 border-b border-border/5"
          >
            {t('nav.properties')}
          </Link>
          <Link 
            to="/contact" 
            onClick={() => setIsOpen(false)}
            className="block text-muted-foreground hover:text-foreground text-xs font-semibold py-1 border-b border-border/5"
          >
            {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </Link>
          
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                toggleLanguage();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:border-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            {user ? (
              <div className="flex flex-col gap-2">
                <Link 
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'RENTER' ? '/login' : '/dashboard'} 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>{user.role === 'ADMIN' ? t('nav.admin') : user.role === 'RENTER' ? (language === 'ar' ? 'البوابة' : 'Portal') : t('nav.dashboard')}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <UserCircle className="w-4 h-4" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  const { language } = useLanguage();
  const logoUrl = useLogoUrl();
  const socialLinks = useSocialSettings();
  return (
    <footer className="bg-card border-t border-border py-4 text-muted-foreground text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Name */}
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <Logo className="h-6 w-6" logoUrl={logoUrl} />
            </div>
            <span className="font-bold text-foreground text-xs select-none">{language === 'ar' ? 'بناء وإدارة' : 'Benaa & Edara'}</span>
          </div>

          {/* Copyright in Center */}
          <div className="text-center md:text-center text-[10px] sm:text-xs">
            &copy; {new Date().getFullYear()} {language === 'ar' ? 'بناء وإدارة العقارية. جميع الحقوق محفوظة.' : 'Benaa and Edara Real Estate. All rights reserved.'}
          </div>

          {/* Social Icons on Right */}
          <div className="flex items-center">
            <SocialIconsRow links={socialLinks} size="sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useLocation } from 'react-router';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Only track viewing pages, not admin stuff. Or tracking all is fine.
    const path = location.pathname;
    let propertyId = null;
    if (path.startsWith('/properties/') && path !== '/properties/') {
      propertyId = path.split('/')[2];
    }

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, propertyId })
    }).catch(() => {});
  }, [location.pathname]);

  return null;
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const stored = localStorage.getItem('user');
  if (!stored) {
    return <Navigate to="/login" replace />;
  }
  try {
    const user = JSON.parse(stored);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  } catch (_) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const { language } = useLanguage();
  return (
    <div className="dark min-h-screen bg-background font-sans text-foreground flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGENT']}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'AGENT', 'USER']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <PageTracker />
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

// Temporary declarations for missing pages to avoid errors
// We will overwrite these next
