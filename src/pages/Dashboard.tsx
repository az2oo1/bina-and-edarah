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
        if (u.role === 'ADMIN') {
          setProperties(data);
        } else {
          setProperties(data.filter(p => p.userId === u.id));
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
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          {language === 'ar' ? `مرحباً بك، ${user.name}` : `Welcome back, ${user.name}`}
        </h1>
        <p className="text-gray-500 text-lg mb-12">
          {language === 'ar' ? 'إليك نظرة عامة على عقاراتك وإحصائياتها.' : 'Here is an overview and analytics of your properties.'}
        </p>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">{language === 'ar' ? 'إجمالي العقارات' : 'Total Properties'}</p>
              <h3 className="text-3xl font-black text-gray-900">{totalProperties}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">{language === 'ar' ? 'قيمة الأصول (للبيع)' : 'Total Asset Value (Sale)'}</p>
              <h3 className="text-3xl font-black text-gray-900">{totalValue.toLocaleString()} <span className="text-sm">{t('common.currency')}</span></h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 font-medium mb-1">{language === 'ar' ? 'العوائد الإيجارية' : 'Rental Yields'}</p>
              <h3 className="text-3xl font-black text-gray-900">{totalRent.toLocaleString()} <span className="text-sm">{t('common.currency')}</span></h3>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('nav.properties')}</h2>
        
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-500">
              {language === 'ar' ? 'لا يوجد لديك عقارات حالياً.' : 'You have no properties at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Link to={`/properties/${property.id}`} key={property.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group flex flex-col overflow-hidden hover:-translate-y-1 block">
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img 
                    src={getThumbnail(property.imageUrls)} 
                    alt={language === 'ar' ? property.titleAr : property.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-wrap gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white/20">
                      {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white/20">
                      {t(`cat.${property.propertyCategory || 'VILLA'}`)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">
                    {language === 'ar' ? property.titleAr : property.titleEn}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center transition-colors group-hover:bg-yellow-50/30">
                      <Maximize className="w-4 h-4 text-gray-400 mb-1.5" />
                      <span className="text-[11px] font-bold text-gray-900 font-mono">{property.area || 0} {t('common.sqm')}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center transition-colors group-hover:bg-yellow-50/30">
                      <Building2 className="w-4 h-4 text-gray-400 mb-1.5" />
                      <span className="text-[11px] font-bold text-gray-900 line-clamp-1">{t(`cat.${property.propertyCategory || 'VILLA'}`)}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center transition-colors group-hover:bg-yellow-50/30">
                      <CalendarDays className="w-4 h-4 text-gray-400 mb-1.5" />
                      <span className="text-[11px] font-bold text-gray-900">{property.propertyAge ? property.propertyAge : (language === 'ar' ? 'جديد' : 'New')}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t('common.price')}</p>
                      <p className="text-2xl font-black text-gray-900 font-mono tracking-tighter flex items-center gap-1">
                        {(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()} <SrIcon className="w-6 h-6 text-yellow-600" />
                      </p>
                    </div>
                    {property.vat && property.vat > 0 ? (
                      <div className="text-right">
                         <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm border border-yellow-100">
                           <Coins className="w-3.5 h-3.5" /> {language === 'ar' ? 'شامل الضريبة' : 'VAT Included'}
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
