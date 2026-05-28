import React, { useEffect, useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { MapPin, Building2, Maximize, CalendarDays, Coins } from 'lucide-react';
import { Link } from 'react-router';
import { SrIcon } from '../components/SrIcon';

interface Property {
  id: string;
  titleAr: string;
  titleEn: string;
  type: string;
  propertyCategory: string;
  description: string;
  price: number;
  imageUrls: string; // JSON string
  aqarLink?: string;
  area: number;
  propertyAge?: number;
  vat?: number;
}

export default function Properties() {
  const { t, language } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  const getThumbnail = (imageUrlsStr: string) => {
    try {
      const parsed = JSON.parse(imageUrlsStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch(e) {
      // ignore
    }
    return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop";
  };

  const filteredProperties = properties.filter((p) => {
    if (typeFilter !== 'ALL' && p.type !== typeFilter) return false;
    if (categoryFilter !== 'ALL' && p.propertyCategory !== categoryFilter) return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!p.titleAr.toLowerCase().includes(term) && !p.titleEn.toLowerCase().includes(term)) {
        return false;
      }
    }

    if (minPrice && p.price < parseInt(minPrice)) return false;
    if (maxPrice && p.price > parseInt(maxPrice)) return false;

    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">{t('nav.properties')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'تصفح أحدث العقارات المتاحة للبيع أو الإيجار.'
              : 'Browse our latest properties available for sale or rent.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-500">
              {t('admin.propertiesEmpty')}
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث عن عقار...' : 'Search properties...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-shadow bg-gray-50"
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-shadow bg-gray-50"
                >
                  <option value="ALL">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                  <option value="SALE">{t('common.sale')}</option>
                  <option value="RENT">{t('common.rent')}</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-shadow bg-gray-50"
                >
                  <option value="ALL">{language === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
                  <option value="VILLA">{t('cat.VILLA')}</option>
                  <option value="APARTMENT">{t('cat.APARTMENT')}</option>
                  <option value="COMPOUND">{t('cat.COMPOUND')}</option>
                  <option value="TOWER">{t('cat.TOWER')}</option>
                  <option value="BUILDING">{t('cat.BUILDING')}</option>
                  <option value="MALL">{t('cat.MALL')}</option>
                  <option value="SHOP">{t('cat.SHOP')}</option>
                  <option value="OFFICE">{t('cat.OFFICE')}</option>
                  <option value="RESORT">{t('cat.RESORT')}</option>
                  <option value="HOTEL">{t('cat.HOTEL')}</option>
                  <option value="HOSPITAL">{t('cat.HOSPITAL')}</option>
                  <option value="WAREHOUSE">{t('cat.WAREHOUSE')}</option>
                  <option value="FARM">{t('cat.FARM')}</option>
                  <option value="LAND">{t('cat.LAND')}</option>
                </select>
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'السعر الأدنى' : 'Min Price'}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-shadow bg-gray-50"
                />
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'السعر الأعلى' : 'Max Price'}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-shadow bg-gray-50"
                />
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
                </p>
                <p className="text-gray-500 max-w-sm">
                  {language === 'ar' 
                    ? 'جرب تغيير خيارات التصفية أو البحث عن شيء آخر.' 
                    : 'Try adjusting your filters or search for something else.'}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('ALL');
                    setCategoryFilter('ALL');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="mt-8 px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                >
                  {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <Link to={`/properties/${property.id}`} key={property.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 group flex flex-col overflow-hidden hover:-translate-y-1 block">
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <img 
                    src={getThumbnail(property.imageUrls)} 
                    alt={language === 'ar' ? property.titleAr : property.titleEn} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop';
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
          </>
        )}
      </div>
    </div>
  );
}
