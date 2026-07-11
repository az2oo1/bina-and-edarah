import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { MapPin, Building2, Maximize, CalendarDays, Coins } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
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
  vatExempt?: boolean;
  locationText?: string;
  locationLink?: string;
  parentId?: string | null;
  thumbnail?: string;
}

const THUMBNAIL_FALLBACK = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop";

export default function Properties() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const parentIdParam = searchParams.get('parentId');

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showIndividualUnits, setShowIndividualUnits] = useState(false);

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map(p => {
            let thumbnail = THUMBNAIL_FALLBACK;
            try {
              const parsed = JSON.parse(p.imageUrls);
              if (Array.isArray(parsed) && parsed.length > 0) {
                thumbnail = parsed[0];
              }
            } catch (e) {
              // ignore
            }
            return { ...p, thumbnail };
          });
          setProperties(mapped);
        } else {
          setProperties([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setImageLoading((current) => {
      const nextState: Record<string, boolean> = {};

      properties.forEach((property) => {
        nextState[property.id] = current[property.id] ?? false;
      });

      return nextState;
    });
  }, [properties]);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || properties.length === 0) return;

    if (mapRef.current) {
      // Remove all previous markers to redraw dynamically
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });
    } else {
      // Center at Riyadh
      mapRef.current = L.map('properties-map', {
        center: [24.7136, 46.6753],
        zoom: 11,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    const markers: any[] = [];
    properties.forEach((p) => {
      let lat = (p as any).latitude;
      let lon = (p as any).longitude;

      if (lat && lon) {
        const popupHtml = `
          <div style="text-align: ${language === 'ar' ? 'right' : 'left'}; font-family: sans-serif; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 4px; width: 180px;">
            <img src="${p.thumbnail}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
            <h4 style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #111;">${language === 'ar' ? p.titleAr : p.titleEn}</h4>
            <p style="margin: 0 0 6px 0; font-size: 10px; color: #666;">${p.locationText || ''}</p>
            <div style="font-weight: bold; font-size: 11px; color: #2C4A5E; margin-bottom: 6px;">${p.price.toLocaleString()} SAR</div>
            <a href="/properties/${p.id}" style="display: inline-block; background-color: #2C4A5E; color: white; padding: 4px 8px; border-radius: 4px; font-size: 9px; font-weight: bold; text-decoration: none; text-align: center; width: 100%;">
              ${language === 'ar' ? 'عرض التفاصيل ↗' : 'View Details ↗'}
            </a>
          </div>
        `;

        const marker = L.marker([lat, lon]).addTo(mapRef.current)
          .bindPopup(popupHtml);
        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      mapRef.current.fitBounds(group.getBounds().pad(0.15));
    }
  }, [properties, language]);

  const hasStandaloneProperties = useMemo(() => {
    return properties.some((property) => !property.parentId);
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (parentIdParam) {
        if (p.parentId !== parentIdParam) return false;
      } else {
        // Hide sub-properties by default unless filter is ON or viewing by parent
        if (p.parentId && !showIndividualUnits && hasStandaloneProperties) return false;
      }

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
  }, [properties, parentIdParam, showIndividualUnits, hasStandaloneProperties, typeFilter, categoryFilter, searchTerm, minPrice, maxPrice]);

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Premium Header Banner with Decorative Dots & Glows */}
      <div className="border-b border-border py-16 relative overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Soft blurred background color glows */}
          <div className="absolute -top-10 left-1/4 w-[400px] h-[400px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-indigo-400/8 dark:bg-indigo-500/8 rounded-full blur-[90px] pointer-events-none"></div>
          
          {/* Dots Grid Pattern (Subtle & Elegant 1px) */}
          <div className="absolute inset-0 text-slate-300/30 dark:text-slate-800/20" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {(() => {
            const parentProperty = parentIdParam ? properties.find(p => p.id === parentIdParam) : null;
            return (
              <>
                {parentProperty && (
                  <div className="mb-4 inline-flex items-center">
                    <Link 
                      to={`/properties/${parentIdParam}`} 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:underline bg-[#2563eb]/10 border border-[#2563eb]/20 px-3.5 py-1.5 rounded-full transition-all shadow-sm"
                    >
                      {language === 'ar' ? '← العودة لصفحة العقار الرئيسي' : '← Back to Parent Property'}
                    </Link>
                  </div>
                )}
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">
                  {parentProperty 
                    ? (language === 'ar' ? `الوحدات المتاحة في: ${parentProperty.titleAr}` : `Available Units in: ${parentProperty.titleEn}`)
                    : t('nav.properties')
                  }
                </h1>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {parentProperty 
                    ? (language === 'ar' ? 'استكشف جميع الشقق والوحدات المتوفرة في هذا العقار.' : 'Explore all apartments and units available in this property.')
                    : (language === 'ar' 
                        ? 'تصفح أحدث العقارات المتاحة للبيع أو الإيجار.'
                        : 'Browse our latest properties available for sale or rent.')
                  }
                </p>
              </>
            );
          })()}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg shadow-xs border border-border">
            <MapPin className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {t('admin.propertiesEmpty')}
            </p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-card p-5 rounded-lg shadow-xs border border-border mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'بحث عن عقار...' : 'Search properties...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full border border-input rounded-md px-3 py-1.5 text-sm"
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input-field w-full border border-input rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="ALL">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                  <option value="SALE">{t('common.sale')}</option>
                  <option value="RENT">{t('common.rent')}</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input-field w-full border border-input rounded-md px-3 py-1.5 text-sm"
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
                  <option value="ROOM">{t('cat.ROOM')}</option>
                </select>
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'السعر الأدنى' : 'Min Price'}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field w-full border border-input rounded-md px-3 py-1.5 text-sm"
                />
                <input
                  type="number"
                  placeholder={language === 'ar' ? 'السعر الأعلى' : 'Max Price'}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field w-full border border-input rounded-md px-3 py-1.5 text-sm"
                />
              </div>
              {!parentIdParam && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="show-individual-units"
                    checked={showIndividualUnits}
                    onChange={(e) => setShowIndividualUnits(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer rounded"
                  />
                  <label htmlFor="show-individual-units" className="text-xs text-muted-foreground font-medium cursor-pointer select-none">
                    {language === 'ar' ? 'عرض الوحدات كإعلانات مستقلة' : 'Show units as individual listings'}
                  </label>
                </div>
              )}
            </div>

            {filteredProperties.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-lg shadow-xs border border-border flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground/60" />
                </div>
                <p className="text-xl font-bold text-foreground mb-1">
                  {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
                </p>
                <p className="text-sm text-muted-foreground max-w-sm">
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
                  className="btn-primary mt-6 text-xs"
                >
                  {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <Link to={`/properties/${property.id}`} key={property.id} className="shadcn-card hover:shadow-md transition-all duration-200 group flex flex-col overflow-hidden hover:-translate-y-0.5 block">
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted transition-opacity duration-300 ${
                          imageLoading[property.id] ? 'opacity-0' : 'animate-pulse opacity-100'
                        }`}
                      />
                      <img 
                        src={property.thumbnail}
                        alt={language === 'ar' ? property.titleAr : property.titleEn} 
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImageLoading((current) => ({ ...current, [property.id]: true }))}
                        onError={(event) => {
                          const target = event.currentTarget;

                          if (target.dataset.fallbackApplied === 'true') {
                            setImageLoading((current) => ({ ...current, [property.id]: true }));
                            return;
                          }

                          target.dataset.fallbackApplied = 'true';
                          target.src = THUMBNAIL_FALLBACK;
                        }}
                        className={`relative z-10 w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-500 ${
                          imageLoading[property.id] ? 'opacity-100 blur-0 scale-100' : 'opacity-70 blur-md scale-105'
                        }`} 
                      />
                      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-wrap gap-1.5">
                        <span className="bg-card/95 text-foreground px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs border border-border">
                          {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                        </span>
                        <span className="bg-card/95 text-foreground px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs border border-border">
                          {t(`cat.${property.propertyCategory || 'VILLA'}`)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {language === 'ar' ? property.titleAr : property.titleEn}
                      </h3>
                      {property.locationText && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0" />
                          <span className="truncate">{property.locationText}</span>
                        </p>
                      )}
                      
                      <div className="grid grid-cols-3 gap-2 mt-3 mb-4">
                        <div className="bg-background p-2 rounded border border-border flex flex-col items-center justify-center text-center transition-colors">
                          <Maximize className="w-3.5 h-3.5 text-muted-foreground/80 mb-1" />
                          <span className="text-[10px] font-semibold text-foreground font-mono">{property.area || 0} {t('common.sqm')}</span>
                        </div>
                        <div className="bg-background p-2 rounded border border-border flex flex-col items-center justify-center text-center transition-colors">
                          <Building2 className="w-3.5 h-3.5 text-muted-foreground/80 mb-1" />
                          <span className="text-[10px] font-semibold text-foreground line-clamp-1">{t(`cat.${property.propertyCategory || 'VILLA'}`)}</span>
                        </div>
                        <div className="bg-background p-2 rounded border border-border flex flex-col items-center justify-center text-center transition-colors">
                          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground/80 mb-1" />
                          <span className="text-[10px] font-semibold text-foreground">{property.propertyAge ? property.propertyAge : (language === 'ar' ? 'جديد' : 'New')}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3.5 border-t border-border flex items-end justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{t('common.price')}</p>
                          {property.price > 0 ? (
                            <p className="text-lg font-bold text-primary font-mono tracking-tight flex items-center gap-0.5">
                              {(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()} <SrIcon className="w-5 h-5 text-primary" />
                            </p>
                          ) : (
                            <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                              {language === 'ar' ? 'عرض الوحدات' : 'Show Units'}
                            </p>
                          )}
                        </div>
                        {property.vatExempt ? (
                          <div className="text-right">
                             <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[9px] font-semibold">
                               <Coins className="w-3 h-3 text-amber-600" /> {language === 'ar' ? 'معفى من الضريبة' : 'VAT Exempt'}
                             </span>
                          </div>
                        ) : (property.vat && property.vat > 0 ? (
                          <div className="text-right">
                             <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded text-[9px] font-semibold border border-primary/20">
                               <Coins className="w-3 h-3" /> {language === 'ar' ? 'شامل الضريبة' : 'VAT Included'}
                             </span>
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* OpenStreetMap Section */}
        <div className="mt-16 border-t border-border pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {language === 'ar' ? 'خارطة مواقع العقارات' : 'Properties Location Map'}
            </h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'خارطة تفاعلية توضح التوزع الجغرافي لعقاراتنا المتاحة للبيع أو الإيجار في أرقى أحياء الرياض.' 
                : 'An interactive map demonstrating the spatial distribution of our premier properties available for sale or rent.'}
            </p>
          </div>

          <div className="bg-card p-2.5 border border-border rounded-xl shadow-xs overflow-hidden h-[400px]">
            <div 
              id="properties-map"
              style={{ border: 0, borderRadius: '8px', height: '100%', width: '100%', zIndex: 1 }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
