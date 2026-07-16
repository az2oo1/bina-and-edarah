import React, { useState, useEffect, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router';
import { Building2, Home as HomeIcon, MapPin, UserCircle, Globe, Lock, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DialogProvider } from './context/DialogContext';
import { Logo } from './components/Logo';
import { PrivacyConsent } from './components/PrivacyConsent';
import { faviconDataUri, LOGO_BRAND_COLOR } from './lib/logo';
import { SocialIconsRow, SocialLinks } from './components/SocialIcons';
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));

const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));

let settingsPromise: Promise<any> | null = null;
function getCachedSettings() {
  if (!settingsPromise) {
    settingsPromise = fetch('/api/settings')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch settings');
        return r.json();
      })
      .catch(err => {
        settingsPromise = null;
        throw err;
      });
  }
  return settingsPromise;
}

function useLogoUrl() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  useEffect(() => {
    getCachedSettings()
      .then(data => {
        if (data.logoUrl) setLogoUrl(data.logoUrl);
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
    getCachedSettings()
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

const NAV_CONTENT: Record<string, {
  columns: (lang: string, socialLinks: any) => Array<{
    title: string;
    links?: Array<{ to: string; label: string; external?: boolean }>;
    text?: string;
  }>;
  featured: (lang: string) => {
    title: string;
    cardTitle: string;
    desc: string;
    btn?: { to: string; label: string };
  };
}> = {
  home: {
    columns: (lang) => [
      {
        title: lang === 'ar' ? 'الشركة' : 'Company',
        links: [
          { to: '/', label: lang === 'ar' ? 'الصفحة الرئيسية' : 'Home Page' },
          { to: '/about', label: lang === 'ar' ? 'من نحن' : 'About Us' },
          { to: '/services', label: lang === 'ar' ? 'حلولنا العقارية' : 'Our Solutions' }
        ]
      },
      {
        title: lang === 'ar' ? 'الخدمات المميزة' : 'Key Services',
        links: [
          { to: '/projects', label: lang === 'ar' ? 'مشاريع تطوير حديثة' : 'Modern Developments' },
          { to: '/properties', label: lang === 'ar' ? 'إدارة الأملاك والتسويق' : 'Property Management' }
        ]
      },
      {
        title: lang === 'ar' ? 'معلومات عامة' : 'General Info',
        links: [
          { to: '/contact', label: lang === 'ar' ? 'مواعيد العمل وقنوات التواصل' : 'Working Hours & Contacts' }
        ]
      }
    ],
    featured: (lang) => ({
      title: lang === 'ar' ? 'نظرة سريعة' : 'Quick Glance',
      cardTitle: lang === 'ar' ? 'شركة بناء وإدارة العقارية' : 'Benaa & Edara Co.',
      desc: lang === 'ar'
        ? 'شريكك العقاري الموثوق للتطوير والتسويق وإدارة الأملاك بمدينة الرياض.'
        : 'Your trusted real estate partner for development, marketing, and asset management in Riyadh.'
    })
  },
  projects: {
    columns: (lang) => [
      {
        title: lang === 'ar' ? 'تصفح المشاريع' : 'Browse Projects',
        links: [
          { to: '/projects', label: lang === 'ar' ? 'جميع المشاريع' : 'All Projects' }
        ]
      },
      {
        title: lang === 'ar' ? 'فئات التطوير' : 'Development Types',
        links: [
          { to: '/projects?type=residential', label: lang === 'ar' ? 'مشاريع سكنية' : 'Residential Projects' },
          { to: '/projects?type=commercial', label: lang === 'ar' ? 'مشاريع تجارية' : 'Commercial Projects' }
        ]
      },
      {
        title: lang === 'ar' ? 'رؤيتنا في التطوير' : 'Our Philosophy',
        text: lang === 'ar'
          ? 'نلتزم بأعلى معايير الجودة والاستدامة في بناء وتطوير البيئات السكنية والتجارية العصرية.'
          : 'We are committed to the highest standards of quality and sustainability in designing modern environments.'
      }
    ],
    featured: (lang) => ({
      title: lang === 'ar' ? 'مشاريع مميزة' : 'Featured Developments',
      cardTitle: lang === 'ar' ? 'مشاريع البناء الحديثة' : 'Modern Developments',
      desc: lang === 'ar'
        ? 'تصفح أحدث المجمعات السكنية والتجارية التي قمنا بتطويرها مؤخراً.'
        : 'Explore our latest residential & commercial complexes developed with fine craftsmanship.'
    })
  },
  properties: {
    columns: (lang) => [
      {
        title: lang === 'ar' ? 'تصفح العقارات' : 'Browse Properties',
        links: [
          { to: '/properties', label: lang === 'ar' ? 'كل العقارات المتاحة' : 'All Listings' }
        ]
      },
      {
        title: lang === 'ar' ? 'حالة العقار' : 'Listing Status',
        links: [
          { to: '/properties?type=SALE', label: lang === 'ar' ? 'عقارات للبيع' : 'Properties for Sale' },
          { to: '/properties?type=RENT', label: lang === 'ar' ? 'عقارات للإيجار' : 'Properties for Rent' }
        ]
      },
      {
        title: lang === 'ar' ? 'الأنواع الأكثر طلباً' : 'Popular Types',
        links: [
          { to: '/properties?category=APARTMENT', label: lang === 'ar' ? 'شقق سكنية' : 'Apartments' },
          { to: '/properties?category=VILLA', label: lang === 'ar' ? 'فلل وقصور' : 'Villas' },
          { to: '/properties?category=OFFICE', label: lang === 'ar' ? 'مكاتب تجارية' : 'Offices' }
        ]
      }
    ],
    featured: (lang) => ({
      title: lang === 'ar' ? 'البحث الذكي' : 'Smart Search',
      cardTitle: lang === 'ar' ? 'جد عقارك المناسب' : 'Find Your Match',
      desc: lang === 'ar'
        ? 'استخدم الفلاتر المتقدمة في صفحة العقارات لتصفية المساحات والأسعار والموقع المناسب لك.'
        : 'Use filters on our properties page to quickly narrow down size, price, and neighborhood.'
    })
  },
  contact: {
    columns: (lang, socialLinks) => {
      const links: Array<{ to: string; label: string; external?: boolean }> = [
        { to: '/contact', label: lang === 'ar' ? 'نموذج الاتصال بنا' : 'Contact Form' }
      ];
      if (socialLinks.whatsappNumber) {
        links.push({
          to: `https://wa.me/${socialLinks.whatsappNumber}`,
          label: lang === 'ar' ? 'واتساب مباشر' : 'WhatsApp Chat',
          external: true
        });
      }
      return [
        {
          title: lang === 'ar' ? 'قنوات الاتصال المباشرة' : 'Direct Channels',
          links
        },
        {
          title: lang === 'ar' ? 'الدعم وخدمة العملاء' : 'Customer Support',
          text: lang === 'ar'
            ? 'يسعدنا خدمتك وتلبية استفساراتك على مدار الساعة عبر رقم الجوال الموحد أو البريد الإلكتروني.'
            : 'We are delighted to serve you and answer your inquiries around the clock via our unified phone number or email.'
        },
        {
          title: lang === 'ar' ? 'العنوان والموقع' : 'Headquarters',
          text: lang === 'ar'
            ? 'المملكة العربية السعودية، مدينة الرياض. تفضل بزيارة مكتبنا للاطلاع على المزيد من الفرص.'
            : 'Kingdom of Saudi Arabia, Riyadh City. Feel free to visit our headquarters to explore opportunities.'
        }
      ];
    },
    featured: (lang) => ({
      title: lang === 'ar' ? 'طلب معاينة أو تفاصيل' : 'Request Callback',
      cardTitle: lang === 'ar' ? 'تواصل فوري' : 'Instant Connect',
      desc: lang === 'ar'
        ? 'يمكنك تعبئة طلب اتصال وسيقوم أحد مستشارينا بالتواصل معك في أقرب وقت.'
        : 'Leave a callback request and one of our expert advisors will reach out to you shortly.'
    })
  }
};

function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<{username: string, role: string} | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const logoUrl = useLogoUrl();
  const socialLinks = useSocialSettings();

  const [activeDropdown, setActiveDropdown] = useState<'home' | 'projects' | 'properties' | 'contact' | null>(null);
  const openTimeoutRef = React.useRef<any>(null);
  const closeTimeoutRef = React.useRef<any>(null);

  const handleMouseEnter = (menu: 'home' | 'projects' | 'properties' | 'contact') => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);

    if (activeDropdown) {
      // If already open, switch immediately without delay
      setActiveDropdown(menu);
    } else {
      // If closed, open after a 220ms delay (Apple style hover intent)
      openTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(menu);
      }, 220);
    }
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    // Wait 200ms before closing
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleLogoOrControlsHover = () => {
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(null);
  };

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

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
    <nav 
      className="bg-background/80 border-b border-border/30 sticky top-0 z-50 backdrop-blur-md w-full"
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 relative z-50 bg-transparent">
        <div className="flex justify-between h-12 items-center">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center gap-2 mr-8 lg:mr-12 sm:rtl:ml-8 sm:rtl:mr-0 lg:rtl:ml-12 group"
              onMouseEnter={handleLogoOrControlsHover}
            >
              <Logo
                className={`h-6 w-6 flex-shrink-0 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                logoUrl={logoUrl}
              />
              <span className="font-bold text-xs text-foreground tracking-tight hidden md:block">{t('hero.title')}</span>
            </Link>
            <div className="hidden sm:flex items-center gap-5 lg:gap-8">
              {(['home', 'projects', 'properties', 'contact'] as const).map((menu) => (
                <div 
                  key={menu}
                  className="py-3"
                  onMouseEnter={() => handleMouseEnter(menu)}
                >
                  <Link 
                    to={menu === 'home' ? '/' : `/${menu}`} 
                    className={`inline-flex items-center gap-1 text-[11px] lg:text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeDropdown === menu ? 'text-primary scale-105' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {menu === 'contact' ? (language === 'ar' ? 'اتصل بنا' : 'Contact Us') : t(`nav.${menu}`)}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          <div 
            className="hidden sm:flex items-center gap-3"
            onMouseEnter={handleLogoOrControlsHover}
          >
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Globe className="h-3 w-3" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? (language === 'ar' ? 'الوضع المضيء' : 'Light Mode') : (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
            >
              {theme === 'dark' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to={user.role === 'RENTER' ? '/login' : '/admin'} 
                  className="px-3 py-1 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-full text-[11px] transition-all flex items-center gap-1 shadow-sm"
                >
                  <UserCircle className="w-3.5 h-3.5" />
                  <span>{user.role === 'RENTER' ? (language === 'ar' ? 'البوابة' : 'Portal') : t('nav.admin')}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title={language === 'ar' ? 'تسجيل خروج' : 'Logout'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-3 py-1 bg-foreground text-background hover:opacity-90 font-medium rounded-full text-[11px] transition-all flex items-center gap-1 shadow-sm"
              >
                <UserCircle className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </Link>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-1.5"
              aria-label={language === 'ar' ? 'القائمة الرئيسية' : 'Main menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Shared Dropdown Tray */}
      <div 
        className={`nav-dropdown-tray ${activeDropdown ? 'open' : ''}`}
        onMouseEnter={() => {
          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="nav-dropdown-wrapper">
          <div className="nav-dropdown-inner">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              {activeDropdown && (
                <div className="grid grid-cols-4 gap-10">
                  {/* Columns 1-3 */}
                  {NAV_CONTENT[activeDropdown].columns(language, socialLinks).map((col, idx) => (
                    <div key={idx} className="nav-dropdown-column">
                      <span className="nav-dropdown-title">{col.title}</span>
                      {col.links && (
                        <div className="nav-dropdown-links-group flex flex-col gap-2">
                          {col.links.map((link, lIdx) => (
                            link.external ? (
                              <a 
                                key={lIdx} 
                                href={link.to} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="nav-dropdown-link" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                {link.label}
                              </a>
                            ) : (
                              <Link 
                                key={lIdx} 
                                to={link.to} 
                                className="nav-dropdown-link" 
                                onClick={() => setActiveDropdown(null)}
                              >
                                {link.label}
                              </Link>
                            )
                          ))}
                        </div>
                      )}
                      {col.text && (
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          {col.text}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Column 4 (Featured) */}
                  <div className="nav-dropdown-column">
                    {(() => {
                      const feat = NAV_CONTENT[activeDropdown].featured(language);
                      return (
                        <>
                          <span className="nav-dropdown-title">{feat.title}</span>
                          <div className="nav-dropdown-featured flex flex-col gap-1 text-[11px] text-right rtl:text-right ltr:text-left select-none">
                            <div className="font-bold text-[12px] mb-1 text-foreground">
                              {feat.cardTitle}
                            </div>
                            <div className="text-muted-foreground leading-relaxed text-[11px] mb-2">
                              {feat.desc}
                            </div>
                            {feat.btn && (
                              <Link 
                                to={feat.btn.to} 
                                onClick={() => setActiveDropdown(null)} 
                                className="inline-flex text-[10px] font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full hover:opacity-90 transition-opacity w-fit"
                              >
                                {feat.btn.label}
                              </Link>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blurred Backdrop Overlay */}
      {createPortal(
        <div 
          className={`nav-overlay ${activeDropdown ? 'open' : ''}`}
          onClick={() => setActiveDropdown(null)}
        />,
        document.body
      )}

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
            to="/services" 
            onClick={() => setIsOpen(false)}
            className="block text-muted-foreground hover:text-foreground text-xs font-semibold py-1 border-b border-border/5"
          >
            {language === 'ar' ? 'حلول عقارية' : 'Solutions'}
          </Link>
          <Link 
            to="/about" 
            onClick={() => setIsOpen(false)}
            className="block text-muted-foreground hover:text-foreground text-xs font-semibold py-1 border-b border-border/5"
          >
            {language === 'ar' ? 'من نحن' : 'About Us'}
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
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:border-foreground transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span>{theme === 'dark' ? (language === 'ar' ? 'الوضع المضيء' : 'Light Mode') : (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}</span>
            </button>
            {user ? (
              <div className="flex flex-col gap-2">
                <Link 
                  to={user.role === 'RENTER' ? '/login' : '/admin'} 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>{user.role === 'RENTER' ? (language === 'ar' ? 'البوابة' : 'Portal') : t('nav.admin')}</span>
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
  const { theme } = useTheme();
  const logoUrl = useLogoUrl();
  const socialLinks = useSocialSettings();
  return (
    <footer className="bg-card border-t border-border py-4 text-muted-foreground text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Name */}
            <div className="flex items-center gap-2">
              <Logo
                className={`h-6 w-6 flex-shrink-0 ${theme === 'dark' ? 'text-white' : 'text-[#34505e]'}`}
                logoUrl={logoUrl}
              />
              <span className="font-bold text-foreground text-xs select-none">{language === 'ar' ? 'شركة بناء وإدارة العقارية' : 'Benaa & Edara'}</span>
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
      </div>
    </footer>
  );
}

import { useLocation } from 'react-router';

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Scroll window to top on route change
    window.scrollTo(0, 0);

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
  const { theme } = useTheme();

  // Tab icon: inline brand SVG (no server fetch). White in dark mode, brand
  // color in light mode so it stays visible on either background.
  useEffect(() => {
    const href = faviconDataUri(theme === 'dark' ? '#ffffff' : LOGO_BRAND_COLOR);
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;
  }, [theme]);

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-background font-sans text-foreground flex flex-col`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
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
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <PrivacyConsent />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DialogProvider>
          <BrowserRouter>
            <PageTracker />
            <AppContent />
          </BrowserRouter>
        </DialogProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Temporary declarations for missing pages to avoid errors
// We will overwrite these next
