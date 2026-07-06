import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Building2, PieChart, TrendingUp, Wallet, MapPin, Maximize, CalendarDays, Coins } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { SrIcon } from '../components/SrIcon';

interface Property {
  id: string;
  titleAr: string;
  titleEn: string;
  type: string;
  propertyCategory: string;
  price: number;
  area: number;
  imageUrls: string;
  userId?: string;
  propertyAge?: number;
  vat?: number;
}

export default function Dashboard() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<{id: string, username: string, name: string, role: string} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);

    // Fetch properties and filter user's properties
    fetch('/api/properties')
      .then(res => res.json())
      .then((data: Property[]) => {
        // If user is Admin, show all. If normal user, show only theirs
        const propertiesArray = Array.isArray(data) ? data : [];
        if (u.role === 'ADMIN') {
          setProperties(propertiesArray);
        } else {
          setProperties(propertiesArray.filter((p: any) => p.userId === u.id));
        }
      });
  }, [navigate]);

  if (!user) return null;

  const totalProperties = properties.length;
  const totalValue = properties.reduce((acc, p) => acc + (p.type === 'SALE' ? p.price : 0), 0);
  const totalRent = properties.reduce((acc, p) => acc + (p.type === 'RENT' ? p.price : 0), 0);

  const getThumbnail = (imageUrlsStr: string) => {
    try {
      const parsed = JSON.parse(imageUrlsStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch(e) {}
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop";
  };

  return (
    <div className="bg-background min-h-screen py-10 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-1">
          {language === 'ar' ? `مرحباً بك، ${user.name}` : `Welcome back, ${user.name}`}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mb-8">
          {language === 'ar' ? 'إليك نظرة عامة على عقاراتك وإحصائياتها.' : 'Here is an overview and analytics of your properties.'}
        </p>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="shadcn-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-accent text-primary flex items-center justify-center border border-border">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{language === 'ar' ? 'إجمالي العقارات' : 'Total Properties'}</p>
              <h3 className="text-lg font-bold text-foreground">{totalProperties}</h3>
            </div>
          </div>
          
          <div className="shadcn-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-accent text-primary flex items-center justify-center border border-border">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{language === 'ar' ? 'قيمة الأصول (للبيع)' : 'Total Asset Value (Sale)'}</p>
              <h3 className="text-lg font-bold text-foreground">{totalValue.toLocaleString()} <span className="text-xs">{t('common.currency')}</span></h3>
            </div>
          </div>

          <div className="shadcn-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-accent text-primary flex items-center justify-center border border-border">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{language === 'ar' ? 'العوائد الإيجارية' : 'Rental Yields'}</p>
              <h3 className="text-lg font-bold text-foreground">{totalRent.toLocaleString()} <span className="text-xs">{t('common.currency')}</span></h3>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">{t('nav.properties')}</h2>
        
        {properties.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-lg shadow-xs">
            <PieChart className="w-10 h-10 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">
              {language === 'ar' ? 'لا يوجد لديك عقارات حالياً.' : 'You have no properties at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map((property) => (
              <Link to={`/properties/${property.id}`} key={property.id} className="shadcn-card group overflow-hidden block flex flex-col hover:shadow-xs transition-shadow">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={getThumbnail(property.imageUrls)} 
                    alt={language === 'ar' ? property.titleAr : property.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-wrap gap-2">
                    <span className="bg-card/90 backdrop-blur-xs text-foreground px-2 py-0.5 rounded text-[10px] font-semibold border border-border">
                      {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                    </span>
                    <span className="bg-card/90 backdrop-blur-xs text-foreground px-2 py-0.5 rounded text-[10px] font-semibold border border-border">
                      {t(`cat.${property.propertyCategory || 'VILLA'}`)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                    {language === 'ar' ? property.titleAr : property.titleEn}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-1.5 mt-2 mb-4">
                    <div className="bg-background p-2 rounded border border-border flex flex-col items-center justify-center text-center">
                      <Maximize className="w-3.5 h-3.5 text-muted-foreground/60 mb-1" />
                      <span className="text-[10px] font-semibold text-foreground font-mono">{property.area || 0} {t('common.sqm')}</span>
                    </div>
                    <div className="bg-background p-2 rounded border border-border flex flex-col items-center justify-center text-center">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground/60 mb-1" />
                      <span className="text-[10px] font-semibold text-foreground line-clamp-1">{t(`cat.${property.propertyCategory || 'VILLA'}`)}</span>
                    </div>
                    <div className="bg-background p-2 rounded border border-border flex flex-col items-center justify-center text-center">
                      <CalendarDays className="w-3.5 h-3.5 text-muted-foreground/60 mb-1" />
                      <span className="text-[10px] font-semibold text-foreground">{property.propertyAge ? property.propertyAge : (language === 'ar' ? 'جديد' : 'New')}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-border flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">{t('common.price')}</p>
                      <p className="text-base font-bold text-foreground font-mono flex items-center gap-1">
                        {(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()} <SrIcon className="w-4 h-4 text-primary" />
                      </p>
                    </div>
                    {property.vat && property.vat > 0 ? (
                      <div className="text-right">
                         <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-semibold border border-primary/20">
                           <Coins className="w-3 h-3" /> {language === 'ar' ? 'شامل الضريبة' : 'VAT Included'}
                         </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
