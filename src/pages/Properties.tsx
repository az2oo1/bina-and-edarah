import React, { useEffect, useState, useRef } from 'react';
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
  availableUnitsCount?: number;
  minUnitPrice?: number;
  maxUnitPrice?: number;
}

const THUMBNAIL_FALLBACK = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop";

export default function Properties() {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const parentIdParam = searchParams.get('parentId');

  // Properties State
  const [properties, setProperties] = useState<Property[]>([]);
  const [mapProperties, setMapProperties] = useState<any[]>([]);
  const [parentProperty, setParentProperty] = useState<any>(null);
  
  // Pagination & Loading
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [leafletLoaded, setLeafletLoaded] = useState(!!(window as any).L);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showIndividualUnits, setShowIndividualUnits] = useState(false);

  // 1. Fetch parent property details separately if parentIdParam is active
  useEffect(() => {
    if (parentIdParam) {
      fetch(`/api/properties/${parentIdParam}`)
        .then(res => res.json())
        .then(data => setParentProperty(data))
        .catch(err => console.error("Error fetching parent property details:", err));
    } else {
      setParentProperty(null);
    }
  }, [parentIdParam]);

  // 2. Fetch all matching properties for map markers (lightweight fetch)
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('map', 'true');
    if (parentIdParam) params.set('parentId', parentIdParam);
    if (showIndividualUnits) params.set('showIndividualUnits', 'true');
    if (searchTerm) params.set('search', searchTerm);
    if (typeFilter !== 'ALL') params.set('type', typeFilter);
    if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`/api/properties?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setMapProperties(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching map properties:", err));
  }, [parentIdParam, showIndividualUnits, searchTerm, typeFilter, categoryFilter, minPrice, maxPrice]);

  // 3. Fetch paginated grid properties
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', '9');
    if (parentIdParam) params.set('parentId', parentIdParam);
    if (showIndividualUnits) params.set('showIndividualUnits', 'true');
    if (searchTerm) params.set('search', searchTerm);
    if (typeFilter !== 'ALL') params.set('type', typeFilter);
    if (categoryFilter !== 'ALL') params.set('category', categoryFilter);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    fetch(`/api/properties?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.properties)) {
          const mapped = data.properties.map((p: any) => {
            let thumbnail = THUMBNAIL_FALLBACK;
            try {
              const parsed = JSON.parse(p.imageUrls);
              if (Array.isArray(parsed) && parsed.length > 0) {
                thumbnail = parsed[0];
              }
            } catch (e) {}
            return { ...p, thumbnail };
          });
          setProperties(mapped);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.totalCount || 0);
        } else {
          setProperties([]);
          setTotalPages(1);
          setTotalCount(0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching paginated properties:", err);
        setLoading(false);
      });
  }, [currentPage, parentIdParam, showIndividualUnits, searchTerm, typeFilter, categoryFilter, minPrice, maxPrice]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [parentIdParam, showIndividualUnits, searchTerm, typeFilter, categoryFilter, minPrice, maxPrice]);

  useEffect(() => {
    setImageLoading((current) => {
      const nextState: Record<string, boolean> = {};
      properties.forEach((property) => {
        nextState[property.id] = current[property.id] ?? false;
      });
      return nextState;
    });
  }, [properties]);

  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const cssId = 'leaflet-css-dynamic';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    const jsId = 'leaflet-js-dynamic';
    if (!document.getElementById(jsId)) {
      const script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        setLeafletLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Leaflet script dynamically.");
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || mapProperties.length === 0) return;

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
    mapProperties.forEach((p) => {
      let lat = p.latitude;
      let lon = p.longitude;

      if (lat && lon) {
        const popupHtml = `
          <div style="text-align: ${language === 'ar' ? 'right' : 'left'}; font-family: var(--font-sans), sans-serif; direction: ${language === 'ar' ? 'rtl' : 'ltr'}; padding: 4px; width: 180px;">
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
  }, [mapProperties, language, leafletLoaded]);

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
          {parentProperty && (
            <div className="mb-4 inline-flex items-center">
              <Link 
                to={`/properties/${parentIdParam}`} 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:underline bg-[#2563eb]/10 border border-[#2563eb]/20 px-3.5 py-1.5 rounded-full transition-all shadow-sm"
              >
                {language === 'ar' ? '→ العودة لصفحة العقار الرئيسي' : '← Back to Parent Property'}
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

        {/* Filters */}
        <div className="bg-card p-5 rounded-lg shadow-xs border border-border mb-8 animate-in fade-in">
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
            <div className="flex items-center gap-3 mt-3 select-none animate-in fade-in duration-200">
              <button
                type="button"
                role="checkbox"
                aria-checked={showIndividualUnits}
                onClick={() => setShowIndividualUnits(!showIndividualUnits)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                  showIndividualUnits ? 'bg-primary' : 'bg-muted border border-border/80 dark:bg-zinc-800'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    showIndividualUnits 
                      ? (language === 'ar' ? '-translate-x-[18px]' : 'translate-x-[18px]') 
                      : (language === 'ar' ? '-translate-x-[2px]' : 'translate-x-[2px]')
                  }`}
                />
              </button>
              <span 
                onClick={() => setShowIndividualUnits(!showIndividualUnits)}
                className="text-xs text-muted-foreground font-semibold cursor-pointer hover:text-foreground transition-colors"
              >
                {language === 'ar' ? 'عرض الوحدات كإعلانات مستقلة' : 'Show units as individual listings'}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg shadow-xs border border-border flex flex-col items-center justify-center animate-in fade-in">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground/60" />
            </div>
            <p className="text-xl font-bold text-foreground mb-1">
              {language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
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
                setShowIndividualUnits(false);
              }}
              className="btn-primary text-xs"
            >
              {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
              {properties.map((property) => {
                const hasUnits = !!(property.availableUnitsCount && property.availableUnitsCount > 0);
                return (
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
                      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-20 flex flex-wrap gap-1.5">
                        <span className="bg-card/95 text-foreground px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs border border-border">
                          {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
                        </span>
                        <span className="bg-card/95 text-foreground px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs border border-border">
                          {t(`cat.${property.propertyCategory || 'VILLA'}`)}
                        </span>
                        {hasUnits && (
                          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold shadow-xs">
                            {language === 'ar' 
                              ? `${property.availableUnitsCount} وحدات`
                              : `${property.availableUnitsCount} Units`}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow text-foreground">
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
                          {hasUnits && property.minUnitPrice && property.maxUnitPrice ? (
                            <p className="text-lg font-bold text-primary flex items-center gap-1" dir="ltr">
                              <span className="font-mono tracking-tight">
                                {property.minUnitPrice === property.maxUnitPrice
                                  ? property.minUnitPrice.toLocaleString()
                                  : `${property.minUnitPrice.toLocaleString()} - ${property.maxUnitPrice.toLocaleString()}`}
                              </span>
                              <SrIcon className="w-5 h-5 text-primary flex-shrink-0" />
                            </p>
                          ) : property.price > 0 ? (
                            <p className="text-lg font-bold text-primary flex items-center gap-1" dir="ltr">
                              <span className="font-mono tracking-tight">
                                {(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()}
                              </span>
                              <SrIcon className="w-5 h-5 text-primary flex-shrink-0" />
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
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 select-none">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 border border-border hover:bg-muted bg-card rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                >
                  <span>{language === 'ar' ? 'السابق' : 'Previous'}</span>
                </button>
                
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 border border-border hover:bg-muted bg-card rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                >
                  <span>{language === 'ar' ? 'التالي' : 'Next'}</span>
                </button>
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

          <div className="bg-card p-2.5 border border-border rounded-xl shadow-xs overflow-hidden h-[400px] relative">
            {!leafletLoaded && (
              <div className="absolute inset-0 bg-muted/20 animate-pulse flex items-center justify-center text-xs font-semibold text-muted-foreground z-10">
                {language === 'ar' ? 'جاري تحميل الخريطة...' : 'Loading map...'}
              </div>
            )}
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
