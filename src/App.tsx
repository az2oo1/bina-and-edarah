import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router';
import { Building2, Home as HomeIcon, MapPin, UserCircle, Globe, Lock, LogOut } from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { Logo } from './components/Logo';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<{username: string, role: string} | null>(null);

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
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 mr-8 sm:rtl:ml-8 sm:rtl:mr-0">
              <Logo className="h-14 w-14 text-white" />
              <span className="font-bold text-xl text-white tracking-wide hidden sm:block">{t('hero.title')}</span>
            </div>
            <div className="hidden sm:flex items-center gap-8 lg:gap-14">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-yellow-500 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/projects" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-yellow-500 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t('nav.projects')}
              </Link>
              <Link to="/properties" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-yellow-500 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t('nav.properties')}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-300 border border-gray-700 hover:text-white hover:border-white transition-all flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'RENTER' ? '/login' : '/dashboard'} 
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors flex items-center gap-2"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.role === 'ADMIN' ? t('nav.admin') : user.role === 'RENTER' ? (language === 'ar' ? 'البوابة' : 'Portal') : t('nav.dashboard')}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title={language === 'ar' ? 'تسجيل خروج' : 'Logout'}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors flex items-center gap-2"
              >
                <UserCircle className="w-5 h-5" />
                <span className="hidden sm:inline">{t('nav.login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="bg-black border-t border-gray-800 py-12 text-center text-gray-400">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <Logo className="h-10 w-10 text-white opacity-50" />
        <p>&copy; {new Date().getFullYear()} {language === 'ar' ? 'بناء وإدارة العقارية. جميع الحقوق محفوظة.' : 'Benaa and Edara Real Estate. All rights reserved.'}</p>
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

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <PageTracker />
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

// Temporary declarations for missing pages to avoid errors
// We will overwrite these next
