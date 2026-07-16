import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import * as LucideIcons from 'lucide-react';
import { MapPin, Phone, ExternalLink, ArrowLeft, ArrowRight, Maximize, CalendarDays, Coins, Zap, CheckCircle2, MessageCircle, Building2, Compass, Ruler, BedDouble, DoorOpen, Armchair, Bath, Layers, Users, Info, ChefHat, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Eye, Search, LayoutGrid, List, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import { SrIcon } from '../components/SrIcon';
import { ImageViewer } from '../components/ImageViewer';
import { formatExternalLink } from '../utils/link';

interface Property {
  id: string;
  titleAr: string;
  titleEn: string;
  type: string;
  propertyCategory: string;
  paymentFrequency: string | null;
  area: number;
  locationLink: string | null;
  locationText: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string;
  features: string | null;
  propertyAge: number;
  electricityCost: number;
  electricityFrequency: string | null;
  vat: number;
  vatExempt: boolean;
  vatNotApplicable: boolean;
  commission: number;
  price: number;
  imageUrls: string; // JSON string
  aqarLink?: string;
  allowedPaymentPlans?: string;
  paymentsCount?: number | null;
  videoUrl?: string;
  createdAt: string;
  parentId?: string | null;
  parent?: Property | null;
  subProperties?: Property[];
  details?: string;
  utilityBills?: string;
  status?: string;
  attachments?: string;
}

const getDetailIcon = (key: string) => {
  const lowerKey = key.toLowerCase();
  const iconClass = "w-4 h-4 sm:w-5 h-5";
  if (lowerKey.includes('مطبخ') || lowerKey.includes('kitchen')) return <ChefHat className={iconClass} />;
  if (lowerKey.includes('واجهة') || lowerKey.includes('facade')) return <Compass className={iconClass} />;
  if (lowerKey.includes('شارع') || lowerKey.includes('street')) return <Ruler className={iconClass} />;
  if (lowerKey.includes('غرف النوم') || lowerKey.includes('bedroom')) return <BedDouble className={iconClass} />;
  if (lowerKey.includes('غرف') || lowerKey.includes('room')) return <DoorOpen className={iconClass} />;
  if (lowerKey.includes('صالة') || lowerKey.includes('صالات') || lowerKey.includes('hall')) return <Armchair className={iconClass} />;
  if (lowerKey.includes('مياه') || lowerKey.includes('حمام') || lowerKey.includes('bathroom') || lowerKey.includes('دورات')) return <Bath className={iconClass} />;
  if (lowerKey.includes('دور') || lowerKey.includes('floor')) return <Layers className={iconClass} />;
  if (lowerKey.includes('عمر') || lowerKey.includes('age')) return <CalendarDays className={iconClass} />;
  if (lowerKey.includes('فئة') || lowerKey.includes('category')) return <Users className={iconClass} />;
  if (lowerKey.includes('موقف') || lowerKey.includes('parking')) return <Car className={iconClass} />;
  if (lowerKey.includes('مصعد') || lowerKey.includes('elevator')) return <ArrowUpCircle className={iconClass} />;
  if (lowerKey.includes('وحد') || lowerKey.includes('unit')) return <Building2 className={iconClass} />;
  if (lowerKey.includes('مساح') || lowerKey.includes('area')) return <Maximize className={iconClass} />;
  return <Info className={iconClass} />;
};

export default function PropertyDetails() {
  const { id } = useParams();
  const { t, language } = useLanguage();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('966500000000');
  const [callingNumber, setCallingNumber] = useState('966500000000');
  const [whatsappMessage, setWhatsappMessage] = useState('مرحباً، أنا مهتم بهذا العقار: {title} - {link}');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string>("1");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'units'>('details');

  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const handleThumbnailMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbnailContainerRef.current) return;
    isDownRef.current = true;
    startXRef.current = e.pageX - thumbnailContainerRef.current.offsetLeft;
    scrollLeftRef.current = thumbnailContainerRef.current.scrollLeft;
    hasDraggedRef.current = false;
  };

  const handleThumbnailMouseLeave = () => {
    isDownRef.current = false;
  };

  const handleThumbnailMouseUp = () => {
    isDownRef.current = false;
  };

  const handleThumbnailMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current || !thumbnailContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - thumbnailContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDraggedRef.current = true;
    }
    thumbnailContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  useEffect(() => {
    // Fetch Settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.callingNumber) setCallingNumber(data.callingNumber);
        if (data.whatsappMessage) setWhatsappMessage(data.whatsappMessage);
      })
      .catch(console.error);

    // Fetch Property
    setLoading(true);
    setViewMode('details');
    setActiveImage(0);
    setExpandedUnitId(null);
    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then((data: Property) => {
        setProperty(data);
        if (data.allowedPaymentPlans) {
          try {
            const parsed = JSON.parse(data.allowedPaymentPlans);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSelectedPlan(parsed[0]);
            }
          } catch (_) {}
        } else if (data.paymentsCount) {
          setSelectedPlan(String(data.paymentsCount));
        }
        let unitImages: string[] = [];
        try {
          const parsed = JSON.parse(data.imageUrls);
          if (Array.isArray(parsed) && parsed.length > 0) {
            unitImages = parsed;
          } else if (data.parent && data.parent.imageUrls) {
            const parentParsed = JSON.parse(data.parent.imageUrls);
            if (Array.isArray(parentParsed) && parentParsed.length > 0) {
              unitImages = parentParsed;
            }
          }
        } catch (_) {}

        if (unitImages.length === 0) {
          unitImages = ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'];
        }
        setImages(unitImages);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-xl">Property not found.</p>
        <Link to="/properties" className="text-yellow-600 mt-4 inline-block hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  const galleryItems: { type: 'image' | 'video' | 'map'; url?: string }[] = images.map(url => ({ type: 'image', url }));
  if (property.videoUrl && !images.includes(property.videoUrl)) {
    galleryItems.push({ type: 'video', url: property.videoUrl });
  }
  const hasMap = !!(property.latitude && property.longitude);
  if (hasMap) {
    galleryItems.push({ type: 'map' });
  }
  const mapIndex = hasMap ? galleryItems.length - 1 : -1;

  const goToIndex = (idx: number) => {
    setActiveImage(idx);
  };

  const visibleSubProperties = property.subProperties?.filter(unit => unit.status !== 'DRAFT') || [];

  if (viewMode === 'units') {
    return (
      <div className="bg-background min-h-screen py-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300 ease-out-expo">
          
          {/* Back Link */}
          <div className="mb-6 select-none">
            <button
              onClick={() => setViewMode('details')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/60 backdrop-blur-xs hover:bg-muted border border-border/80 px-4 py-2 rounded-full shadow-xs active:scale-[0.97]"
            >
              {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5 text-primary" /> : <ArrowLeft className="w-3.5 h-3.5 text-primary" />}
              <span>{language === 'ar' ? 'العودة لتفاصيل العقار' : 'Back to Property Details'}</span>
            </button>
          </div>

          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-primary animate-pulse" />
              <span>
                {language === 'ar' 
                  ? `الوحدات السكنية في: ${property.titleAr}` 
                  : `Residential Units in: ${property.titleEn}`}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium">
              {language === 'ar'
                ? `يحتوي هذا العقار على ${visibleSubProperties.length} وحدة سكنية مدرجة.`
                : `This property contains ${visibleSubProperties.length} listed units.`}
            </p>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSubProperties.map((unit, idx) => {
              const unitImages = (() => {
                try {
                  const p = JSON.parse(unit.imageUrls || '[]');
                  return Array.isArray(p) && p.length > 0 ? p : [];
                } catch (_) {
                  return [];
                }
              })();
              const parentImages = (() => {
                try {
                  const p = JSON.parse(property.imageUrls || '[]');
                  return Array.isArray(p) && p.length > 0 ? p : [];
                } catch (_) {
                  return [];
                }
              })();
              const cover = unitImages.length > 0 
                ? unitImages[0] 
                : (parentImages.length > 0 ? parentImages[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop');
              
              let unitDetails: Array<{key: string; value: string; icon?: string}> = [];
              try {
                unitDetails = JSON.parse(unit.details || '[]');
              } catch (_) {}

              const isAvailable = unit.status === 'PUBLISHED';
              const isSold = unit.status === 'SOLD';
              const isRented = unit.status === 'RENTED';

              return (
                <div
                  key={unit.id}
                  style={{ 
                    animationDelay: `${idx * 40}ms`,
                    transitionTimingFunction: 'var(--ease-out-expo)' 
                  }}
                  className="bg-card/45 backdrop-blur-xs border border-border/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col group/unit text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {/* Cover image */}
                  <div className="relative w-full h-44 bg-muted overflow-hidden">
                    <img 
                      src={cover} 
                      alt={unit.titleAr} 
                      className="w-full h-full object-cover group-hover/unit:scale-[1.04] transition-transform duration-500" 
                      style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                    />
                    <div className="absolute top-3 left-3 z-10 select-none">
                      <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-md ${
                        isAvailable ? 'bg-emerald-600/90 text-white' :
                        isSold ? 'bg-destructive/90 text-white' :
                        isRented ? 'bg-amber-600/90 text-white' :
                        'bg-slate-600/90 text-white'
                      }`}>
                        {isAvailable ? (language === 'ar' ? 'متاح' : 'Available') :
                         isSold ? (language === 'ar' ? 'مباع' : 'Sold') :
                         isRented ? (language === 'ar' ? 'مؤجر' : 'Rented') :
                         (language === 'ar' ? 'مخفي' : 'Hidden')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {(() => {
                        const unitName = unitDetails.find(d => d.key === 'رقم الوحدة' || d.key === 'Unit Name')?.value || '';
                        const filteredTags = unitDetails.filter(d => d.key !== 'رقم الوحدة' && d.key !== 'Unit Name');
                        return (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-sm font-extrabold text-foreground leading-snug group-hover/unit:text-primary transition-colors duration-250 line-clamp-1" style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}>
                                {unitName && unitName !== (language === 'ar' ? unit.titleAr : unit.titleEn) ? `${unitName} - ` : ''}{language === 'ar' ? unit.titleAr : unit.titleEn}
                              </h3>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 font-semibold">
                              <span>{t(`cat.${unit.propertyCategory}`)}</span>
                              <span>•</span>
                              <span>{unit.area} {t('common.sqm')}</span>
                            </div>

                            {/* Specifications tags */}
                            {filteredTags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3 select-none">
                                {filteredTags.slice(0, 3).map((detail, idx) => (
                                  <span 
                                    key={idx} 
                                    className="inline-flex items-center gap-1 bg-muted/40 hover:bg-muted/70 border border-border/30 px-2 py-0.5 rounded-lg text-[9.5px] font-bold text-muted-foreground transition-all duration-150"
                                  >
                                    {detail.icon && (LucideIcons as any)[detail.icon] ? (
                                      (() => {
                                        const IconComp = (LucideIcons as any)[detail.icon];
                                        return <IconComp className="w-3.5 h-3.5" />;
                                      })()
                                    ) : (
                                      getDetailIcon(detail.key)
                                    )}
                                    <span>{detail.value}</span>
                                  </span>
                                ))}
                                {filteredTags.length > 3 && (
                                  <span className="inline-flex items-center bg-muted/40 border border-border/30 px-2 py-0.5 rounded-lg text-[9.5px] font-bold text-muted-foreground">
                                    +{filteredTags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {unit.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-3 leading-relaxed font-normal">
                          {unit.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-3">
                      {unit.price > 0 ? (
                        <div>
                          <span className="text-sm font-black text-primary font-mono tracking-tight">{unit.price.toLocaleString()}</span>
                          <span className="text-[9px] text-muted-foreground ml-1 font-semibold">{t('common.currency')}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic font-medium">{language === 'ar' ? 'اتصل لمعرفة السعر' : 'Call for price'}</span>
                      )}

                      <Link
                        to={`/properties/${unit.id}`}
                        className="inline-flex items-center justify-center gap-1 bg-primary text-primary-foreground hover:bg-primary/95 active:scale-[0.97] text-xs font-extrabold h-8 px-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 select-none">
          <Link 
            to={property.parent ? `/properties/${property.parent.id}` : "/properties"} 
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {language === 'ar' ? <ArrowRight className="w-4 h-4 text-primary" /> : <ArrowLeft className="w-4 h-4 text-primary" />}
            <span>
              {property.parent 
                ? (language === 'ar' ? 'العودة للعقار الرئيسي' : 'Back to Main Property') 
                : (language === 'ar' ? 'العودة للعقارات' : 'Back to Properties')}
            </span>
          </Link>
          {property.parent && (
            <Link 
              to={`/properties/${property.parent.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2563eb] hover:underline bg-[#2563eb]/10 border border-[#2563eb]/20 px-3.5 py-1.5 rounded-full transition-all shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {language === 'ar' 
                  ? `جزء من: ${property.parent.titleAr}` 
                  : `Part of: ${property.parent.titleEn}`}
              </span>
            </Link>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-semibold">
              {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
            </span>
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-semibold">
              {t(`cat.${property.propertyCategory}`)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            {language === 'ar' ? property.titleAr : property.titleEn}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
          
          {/* Gallery */}
          <div className="order-1 lg:order-none lg:col-span-2">
            
            {/* Gallery */}
            <div className="shadcn-card overflow-hidden">
              <div 
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.tagName === 'VIDEO' || 
                    target.tagName === 'IFRAME' || 
                    target.closest('button') ||
                    target.closest('a')
                  ) {
                    return;
                  }
                  setIsViewerOpen(true);
                }}
                className="relative h-80 sm:h-[450px] w-full bg-muted group/gallery cursor-pointer overflow-hidden"
              >
                {(() => {
                  const active = galleryItems[activeImage];
                  if (!active) return null;

                  if (active.type === 'map') {
                    return (
                      <>
                        <iframe
                          src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                          className="w-full h-full border-0"
                          title={language === 'ar' ? 'موقع العقار' : 'Property Location'}
                          loading="lazy"
                        />
                        <div className="absolute top-4 inset-x-0 flex justify-center z-20 pointer-events-none">
                          <a
                            href={formatExternalLink(property.locationLink) || `https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-auto inline-flex items-center gap-1.5 bg-card/90 hover:bg-card text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-border transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span>{language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </>
                    );
                  }

                  if (active.type === 'video') {
                    return (
                      <video src={active.url} controls className="w-full h-full object-cover relative z-10" />
                    );
                  }

                  return (
                    <>
                      <img 
                        src={active.url} 
                        alt={language === 'ar' ? property.titleAr : property.titleEn}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      {/* Hover expand overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-250 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-black/75 backdrop-blur-xs text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transform translate-y-2 group-hover/gallery:translate-y-0 transition-all duration-250 shadow-xl border border-white/10">
                          <Maximize className="w-4 h-4 text-primary" />
                          <span>{language === 'ar' ? 'عرض الوسائط كاملة' : 'View Full Media'}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Slider Navigation Controls - open the picture viewer */}
                {galleryItems.length > 1 && (
                  <>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isRtl = language === 'ar';
                        goToIndex(isRtl ? (activeImage + 1) % galleryItems.length : (activeImage - 1 + galleryItems.length) % galleryItems.length);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/85 hover:bg-card text-foreground p-2 rounded-lg shadow-md transition-all hover:scale-105 z-30 cursor-pointer border border-border flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover/gallery:opacity-100"
                      title={language === 'ar' ? 'عرض الوسائط (السابق)' : 'View Media (Previous)'}
                      aria-label={language === 'ar' ? 'عرض الوسائط (السابق)' : 'View Media (Previous)'}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const isRtl = language === 'ar';
                        goToIndex(isRtl ? (activeImage - 1 + galleryItems.length) % galleryItems.length : (activeImage + 1) % galleryItems.length);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/85 hover:bg-card text-foreground p-2 rounded-lg shadow-md transition-all hover:scale-105 z-30 cursor-pointer border border-border flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover/gallery:opacity-100"
                      title={language === 'ar' ? 'عرض الوسائط (التالي)' : 'View Media (Next)'}
                      aria-label={language === 'ar' ? 'عرض الوسائط (التالي)' : 'View Media (Next)'}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              {galleryItems.length > 1 && (
                <div className="flex items-center border-t border-border bg-card">
                  <div 
                    ref={thumbnailContainerRef}
                    onMouseDown={handleThumbnailMouseDown}
                    onMouseLeave={handleThumbnailMouseLeave}
                    onMouseUp={handleThumbnailMouseUp}
                    onMouseMove={handleThumbnailMouseMove}
                    className="flex-1 flex items-center gap-2.5 p-3 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
                  >
                    {galleryItems.map((item, i) => {
                      if (item.type === 'map') return null;
                      return (
                        <button 
                          key={i} 
                          onClick={(e) => {
                            if (hasDraggedRef.current) {
                              e.preventDefault();
                              return;
                            }
                            setActiveImage(i);
                          }}
                          className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden relative ${activeImage === i ? 'ring-2 ring-primary ring-offset-1 scale-102 opacity-100' : 'opacity-65 hover:opacity-100 border border-border/50'}`}
                          aria-label={`${language === 'ar' ? 'عرض العنصر' : 'View item'} ${i + 1}`}
                        >
                          {item.type === 'video' ? (
                            <div className="w-full h-full bg-slate-950 text-white flex flex-col items-center justify-center gap-1 select-none">
                              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              <span className="text-[8px] font-bold text-gray-400">{language === 'ar' ? 'فيديو' : 'Video'}</span>
                            </div>
                          ) : (
                            <img 
                              src={item.url} 
                              alt={`Thumbnail ${i}`} 
                              className="w-full h-full object-cover" 
                              draggable="false"
                              onDragStart={(e) => e.preventDefault()}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {hasMap && (
                    <div className="flex items-center flex-shrink-0 p-3 border-s border-border">
                      <button
                        type="button"
                        onClick={() => setActiveImage(mapIndex)}
                        className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-1 bg-slate-950 text-white select-none ${
                          activeImage === mapIndex ? 'ring-2 ring-primary ring-offset-1 scale-102 opacity-100' : 'opacity-65 hover:opacity-100 border border-border/50'
                        }`}
                        aria-label={language === 'ar' ? 'عرض الخريطة' : 'View Map'}
                      >
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-[8px] font-bold text-gray-400">{language === 'ar' ? 'الخريطة' : 'Map'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="order-3 lg:order-none lg:col-span-2">
            <div className="shadcn-card p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
              </h3>
              
              {/* Specs Grid (Device Specs Style) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3.5">
                {(() => {
                  const specItems: React.ReactNode[] = [];

                  // 1. Category
                  specItems.push(
                    <div key="category" className="flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card hover:bg-muted/40 border border-border/80 transition-all duration-250 w-full h-full shadow-xs hover:shadow-sm select-none animate-in fade-in duration-200">
                      <div className="p-1.5 sm:p-2.5 bg-primary/10 text-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 sm:w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-start min-w-0">
                        <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/90 mb-0.5 truncate">{t('admin.placeholder.category')}</p>
                        <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">{t(`cat.${property.propertyCategory}`)}</p>
                      </div>
                    </div>
                  );

                  // 2. Area
                  if (property.area > 0) {
                    specItems.push(
                      <div key="area" className="flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card hover:bg-muted/40 border border-border/80 transition-all duration-250 w-full h-full shadow-xs hover:shadow-sm select-none animate-in fade-in duration-200">
                        <div className="p-1.5 sm:p-2.5 bg-primary/10 text-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Maximize className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-start min-w-0">
                          <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/90 mb-0.5 truncate">{t('common.area')}</p>
                          <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">{property.area} {t('common.sqm')}</p>
                        </div>
                      </div>
                    );
                  }

                  // 3. Property Age
                  if (property.propertyAge > 0) {
                    specItems.push(
                      <div key="age" className="flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card hover:bg-muted/40 border border-border/80 transition-all duration-250 w-full h-full shadow-xs hover:shadow-sm select-none animate-in fade-in duration-200">
                        <div className="p-1.5 sm:p-2.5 bg-primary/10 text-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <CalendarDays className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-start min-w-0">
                          <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/90 mb-0.5 truncate">{t('common.propertyAge')}</p>
                          <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">{property.propertyAge} {language === 'ar' ? 'سنة' : 'Years'}</p>
                        </div>
                      </div>
                    );
                  }

                  // 4. Location Text
                  if (property.locationText) {
                    specItems.push(
                      <div key="locationText" className="flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card hover:bg-muted/40 border border-border/80 transition-all duration-250 w-full h-full shadow-xs hover:shadow-sm select-none animate-in fade-in duration-200">
                        <div className="p-1.5 sm:p-2.5 bg-primary/10 text-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-start min-w-0">
                          <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/90 mb-0.5 truncate">{t('common.locationText')}</p>
                          <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">{property.locationText}</p>
                        </div>
                      </div>
                    );
                  }

                  // 5. Dynamically parsed details
                  if (property.details) {
                    try {
                      const parsed = JSON.parse(property.details);
                      if (Array.isArray(parsed)) {
                        // Filter out duplicate translations
                        const keysInList = parsed.map(item => item.key.toLowerCase());
                        const filtered = parsed.filter(item => {
                          const k = item.key.toLowerCase();
                          if (language === 'ar') {
                            if (k === 'unit name' && keysInList.includes('رقم الوحدة')) return false;
                            if (k === 'floor' && keysInList.includes('الدور')) return false;
                            if (k === 'facade' && keysInList.includes('الواجهة')) return false;
                            if (k === 'rooms' && keysInList.includes('عدد الغرف')) return false;
                            if (k === 'bedrooms' && keysInList.includes('غرف النوم')) return false;
                            if (k === 'bathrooms' && keysInList.includes('دورات المياه')) return false;
                            if (k === 'parking spaces' && keysInList.includes('مواقف سيارات')) return false;
                            if (k === 'built area' && keysInList.includes('مسطح البناء')) return false;
                            if (k === 'condition' && keysInList.includes('حالة العقار')) return false;
                            if (k === 'street width' && keysInList.includes('عرض الشارع')) return false;
                            if (k === 'elevators' && keysInList.includes('مصاعد')) return false;
                            if (k === 'number of units' && keysInList.includes('عدد الوحدات')) return false;
                          } else {
                            if (k === 'رقم الوحدة' && keysInList.includes('unit name')) return false;
                            if (k === 'الدور' && keysInList.includes('floor')) return false;
                            if (k === 'الواجهة' && keysInList.includes('facade')) return false;
                            if (k === 'عدد الغرف' && keysInList.includes('rooms')) return false;
                            if (k === 'غرف النوم' && keysInList.includes('bedrooms')) return false;
                            if (k === 'دورات المياه' && keysInList.includes('bathrooms')) return false;
                            if (k === 'مواقف سيارات' && keysInList.includes('parking spaces')) return false;
                            if (k === 'مسطح البناء' && keysInList.includes('built area')) return false;
                            if (k === 'حالة العقار' && keysInList.includes('condition')) return false;
                            if (k === 'عرض الشارع' && keysInList.includes('street width')) return false;
                            if (k === 'مصاعد' && keysInList.includes('elevators')) return false;
                            if (k === 'عدد الوحدات' && keysInList.includes('number of units')) return false;
                          }
                          return true;
                        });

                        filtered.forEach((item: any, idx: number) => {
                          const isFloorsKey = item.key === 'أدوار المبنى' || item.key === 'Building Floors';
                          const displayValue = isFloorsKey
                            ? (() => {
                                const count = item.value.split(',').map((f: any) => f.trim()).filter(Boolean).length;
                                return language === 'ar' ? `${count} طوابق` : `${count} Floors`;
                              })()
                            : item.value;
                          const displayKey = isFloorsKey
                            ? (language === 'ar' ? 'عدد الأدوار' : 'Number of Floors')
                            : item.key;

                          specItems.push(
                            <div key={`detail-${idx}`} className="flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-card hover:bg-muted/40 border border-border/80 transition-all duration-250 w-full h-full shadow-xs hover:shadow-sm select-none animate-in fade-in duration-200">
                              <div className="p-1.5 sm:p-2.5 bg-primary/10 text-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                {item.icon && (LucideIcons as any)[item.icon] ? (
                                  (() => {
                                    const IconComp = (LucideIcons as any)[item.icon];
                                    return <IconComp className="w-4 h-4 sm:w-5 h-5" />;
                                  })()
                                ) : (
                                  getDetailIcon(item.key)
                                )}
                              </div>
                              <div className="flex flex-col text-start min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/90 mb-0.5 truncate">{displayKey}</p>
                                <p className="text-xs sm:text-sm font-extrabold text-foreground truncate">{displayValue}</p>
                              </div>
                            </div>
                          );
                        });
                      }
                    } catch (_) {}
                  }

                  return specItems.map((item, idx) => (
                    <div key={idx}>
                      {item}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="order-4 lg:order-none lg:col-span-2">
            <div className="shadcn-card p-6">
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">{language === 'ar' ? 'وصف العقار' : 'Description'}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {property.features && (
                <div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">{t('common.features')}</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.split(',').map((feature, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 bg-background border border-border text-foreground px-2.5 py-1.5 rounded-md text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        {feature.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="order-2 lg:order-none lg:col-start-3 lg:row-start-1 lg:row-span-3 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="shadcn-card p-6">
              
              {property.parent && (
                <div className="mb-6 pb-6 border-b border-border animate-in fade-in">
                  <p className="text-[10px] font-bold text-muted-foreground mb-3.5 uppercase tracking-wider">
                    {language === 'ar' ? 'العقار الرئيسي' : 'MAIN PROPERTY'}
                  </p>
                  <Link
                    to={`/properties/${property.parent.id}`}
                    className="w-full text-right rtl:text-right ltr:text-left flex flex-col gap-3.5 p-4 bg-muted/30 border border-border/60 hover:bg-muted/65 rounded-xl transition-all duration-150 ease-out cursor-pointer group/parentLink active:scale-98 shadow-xs text-foreground block"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground group-hover/parentLink:text-primary transition-colors">
                            {language === 'ar' ? 'عرض تفاصيل المبنى' : 'View Building Details'}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 max-w-[170px]">
                            {language === 'ar' ? property.parent.titleAr : property.parent.titleEn}
                          </p>
                        </div>
                      </div>
                      {language === 'ar' ? (
                        <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover/parentLink:text-primary transition-colors group-hover/parentLink:-translate-x-0.5 transition-transform" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/parentLink:text-primary transition-colors group-hover/parentLink:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                  </Link>
                </div>
              )}
              
              {/* Available Residential Units or Price Details */}
              {visibleSubProperties.length > 0 ? (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-[10px] font-bold text-muted-foreground mb-3.5 uppercase tracking-wider">
                    {language === 'ar' ? 'الوحدات السكنية المتاحة' : 'AVAILABLE RESIDENTIAL UNITS'}
                  </p>
                  <button
                    onClick={() => setViewMode('units')}
                    className="w-full text-right rtl:text-right ltr:text-left flex flex-col gap-3.5 p-4 bg-muted/30 border border-border/60 hover:bg-muted/65 rounded-xl transition-all duration-150 ease-out cursor-pointer group/card active:scale-98 shadow-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground group-hover/card:text-primary transition-colors">
                            {language === 'ar' ? 'عرض الوحدات المدرجة' : 'View Listed Units'}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {(() => {
                               const counts: Record<string, number> = {};
                               visibleSubProperties.forEach(sub => {
                                 const cat = sub.propertyCategory;
                                 counts[cat] = (counts[cat] || 0) + 1;
                               });
                               const parts = Object.entries(counts).map(([cat, count]) => {
                                 const catLabel = t(`cat.${cat}`);
                                 return `${count} ${catLabel}`;
                               });
                               return parts.join(language === 'ar' ? ' و ' : ' and ');
                             })()}
                          </p>
                        </div>
                      </div>
                      {language === 'ar' ? <ArrowLeft className="w-4 h-4 text-primary group-hover/card:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 text-primary group-hover/card:translate-x-1 transition-transform" />}
                    </div>
    
                    {(() => {
                      const validPrices = visibleSubProperties
                        .map(p => p.price)
                        .filter(price => price > 0);
                      if (validPrices.length === 0) return null;
                      const minPrice = Math.min(...validPrices);
                      const maxPrice = Math.max(...validPrices);
    
                      return (
                        <div className="border-t border-border/80 pt-2.5 mt-2.5 w-full">
                          <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                            {language === 'ar' ? 'نطاق الأسعار' : 'PRICE RANGE'}
                          </p>
                          <div className="flex items-end gap-1 flex-wrap">
                            <span className="text-lg font-extrabold text-[#2563eb] font-mono tracking-tight">
                              {minPrice === maxPrice 
                                ? minPrice.toLocaleString() 
                                : `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`}
                            </span>
                            <span className="text-[10px] text-[#2563eb] font-bold pb-0.5">{t('common.currency')}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </button>
                </div>
              ) : (
                property.price > 0 ? (
                  <div className="mb-6 pb-6 border-b border-border">
                    <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">{t('common.totalCost')}</p>
                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="text-4xl font-extrabold text-foreground tracking-tight">{(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()}</span>
                      <span className="text-xs font-semibold text-muted-foreground">{t('common.currency')}</span>
                    </div>
                    {property.type === 'RENT' && property.paymentFrequency && (
                      <div className="flex gap-1.5 mb-5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 bg-muted/60 text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {property.paymentFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                        </span>
                        {property.paymentsCount && (
                          <span className="inline-flex items-center gap-1.5 bg-muted/60 text-muted-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            <Coins className="w-3.5 h-3.5" />
                            {property.paymentsCount} {language === 'ar' ? (property.paymentsCount === 1 ? 'دفعة' : property.paymentsCount === 2 ? 'دفعتين' : 'دفعات') : 'Payments'}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="space-y-3 pt-4 border-t border-border mt-4">
                      <p className="text-xs font-bold text-foreground mb-1.5">{language === 'ar' ? 'التفاصيل المالية' : 'Financial Breakdown'}</p>
                      
                      <div className="flex justify-between items-center text-xs font-medium py-0.5">
                        <span className="text-muted-foreground">{t('common.basePrice')}</span>
                        <span className="text-foreground font-semibold">
                          {property.price.toLocaleString()} {t('common.currency')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs font-medium py-0.5">
                        <span className="text-muted-foreground">{t('common.vat')}</span>
                        <span className="text-foreground font-semibold">
                          {property.vatNotApplicable ? t('common.vatNotApplicable') : (property.vatExempt ? (language === 'ar' ? 'معفى' : 'Exempt') : (property.vat > 0 ? <>{property.vat.toLocaleString()} {t('common.currency')}</> : (language === 'ar' ? 'شامل' : 'Included')))}
                        </span>
                      </div>
                      {property.type === 'RENT' && (() => {
                        try {
                          if (!property.utilityBills || property.utilityBills === 'NONE') {
                            throw new Error('No utility bills');
                          }
                          const parsed = JSON.parse(property.utilityBills);
                          const rows = [];
                          if (parsed.electricity && parsed.electricityCost > 0) {
                            rows.push(
                              <div key="elec" className="flex justify-between items-center text-xs font-medium py-0.5">
                                <span className="text-muted-foreground">{language === 'ar' ? 'فاتورة الكهرباء' : 'Electricity Bill'}</span>
                                <span className="text-foreground font-semibold">
                                  {parsed.electricityCost.toLocaleString()} {t('common.currency')}
                                  <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
                                    / {parsed.electricityFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                                  </span>
                                </span>
                              </div>
                            );
                          }
                          if (parsed.water && parsed.waterCost > 0) {
                            rows.push(
                              <div key="water" className="flex justify-between items-center text-xs font-medium py-0.5">
                                <span className="text-muted-foreground">{language === 'ar' ? 'فاتورة المياه' : 'Water Bill'}</span>
                                <span className="text-foreground font-semibold">
                                  {parsed.waterCost.toLocaleString()} {t('common.currency')}
                                  <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
                                    / {parsed.waterFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                                  </span>
                                </span>
                              </div>
                            );
                          }
                          return rows;
                        } catch (_) {
                          if (property.electricityCost > 0) {
                            return (
                              <div className="flex justify-between items-center text-xs font-medium py-0.5">
                                <span className="text-muted-foreground">{language === 'ar' ? 'الفواتير الخدمية' : 'Utility Bills'}</span>
                                <span className="text-foreground font-semibold">
                                  {property.electricityCost.toLocaleString()} {t('common.currency')}
                                  {property.electricityFrequency && (
                                    <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
                                      / {property.electricityFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                                    </span>
                                  )}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }
                      })()}
                      <div className="flex justify-between items-center text-xs font-medium py-0.5">
                        <span className="text-muted-foreground">{t('common.commission')}</span>
                        <span className="text-foreground font-semibold">
                          {property.commission > 0 ? <>{property.commission.toLocaleString()} {t('common.currency')}</> : (language === 'ar' ? 'غير محدد' : 'N/A')}
                        </span>
                      </div>
                      {property.type === 'RENT' && (() => {
                        const allowedPlans = (() => {
                          if (!property.allowedPaymentPlans) return [];
                          try {
                            const parsed = JSON.parse(property.allowedPaymentPlans);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                          } catch (_) {}
                          return [];
                        })();
    
                        if (allowedPlans.length === 0 && property.paymentsCount) {
                          allowedPlans.push(String(property.paymentsCount));
                        }
    
                        return allowedPlans.map((plan) => {
                          const planNum = Number(plan);
                          if (isNaN(planNum)) return null;
    
                          const label = plan === "1"
                            ? (language === 'ar' ? 'دفعة سنوية' : '1 Payment / Annual')
                            : plan === "2"
                            ? (language === 'ar' ? 'دفعتين' : '2 Payments')
                            : plan === "3"
                            ? (language === 'ar' ? '3 دفعات' : '3 Payments')
                            : plan === "4"
                            ? (language === 'ar' ? '4 دفعات' : '4 Payments')
                            : plan === "6"
                            ? (language === 'ar' ? '6 دفعات' : '6 Payments')
                            : (language === 'ar' ? '12 دفعة شهري' : '12 Payments / Monthly');
    
                          return (
                            <div key={plan} className="flex justify-between items-center text-xs font-bold border-t border-dashed border-border/80 pt-2.5 mt-2.5">
                              <span className="text-muted-foreground">
                                {language === 'ar' 
                                  ? `قيمة الدفعة الواحدة (${label}):` 
                                  : `Per Payment (${label}):`}
                              </span>
                              <span className="text-primary text-left flex items-center gap-0.5 font-extrabold" dir="ltr">
                                {Math.round((property.price + (property.vat || 0)) / planNum).toLocaleString()} {t('common.currency')}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                ) : null
              )}
    
              {/* Call and WhatsApp Premium Stacked Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`tel:${callingNumber.replace(/\+/g, '')}`}
                  className="btn-primary w-full text-xs h-10 justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  {language === 'ar' ? 'اتصال' : 'Call'}
                </a>
    
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${(() => {
                    const allowedPlans = (() => {
                      if (!property.allowedPaymentPlans) return [];
                      try {
                        const parsed = JSON.parse(property.allowedPaymentPlans);
                        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                      } catch (_) {}
                      return [];
                    })();
                    const plansJoined = allowedPlans.length > 0 
                      ? (language === 'ar' 
                          ? ` (${allowedPlans.join(' أو ')} دفعات)` 
                          : ` (${allowedPlans.join('/')} payments)`)
                      : '';
                    
                    return encodeURIComponent(
                      whatsappMessage
                        .replace('{title}', (language === 'ar' ? property.titleAr : property.titleEn) + plansJoined)
                        .replace('{link}', window.location.href)
                    );
                  })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center rounded-full text-xs font-semibold bg-[#25D366] text-white hover:bg-[#22bf5b] h-10 px-4 py-2 transition-all duration-150 ease-out active:scale-97 cursor-pointer gap-1.5"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.13.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                </a>
              </div>
    
              {(property.locationLink || property.aqarLink) && (
                <div className="flex flex-col gap-2 mt-3.5 border-t border-border/60 pt-3.5">
                  {property.locationLink && (
                    <a
                      href={formatExternalLink(property.locationLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between bg-muted/40 hover:bg-muted/70 text-foreground rounded-full px-4.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground/80" />
                        <span>{t('common.location')}</span>
                      </div>
                      {language === 'ar' ? (
                        <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                      )}
                    </a>
                  )}
    
                  {property.aqarLink && (
                    <a
                      href={formatExternalLink(property.aqarLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between bg-muted/40 hover:bg-muted/70 text-foreground rounded-full px-4.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <img src="https://assets.aqar.fm/icons/v2/aqar-vertical-logo.svg" alt="Aqar" className="h-4 object-contain grayscale opacity-70" />
                        <span>{t('common.viewAqar')}</span>
                      </div>
                      {language === 'ar' ? (
                        <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                      )}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Documents & Files Card */}
            {(() => {
              let attachmentsList: { name: string; url: string; size?: number }[] = [];
              try {
                if (property.attachments) {
                  attachmentsList = typeof property.attachments === 'string'
                    ? JSON.parse(property.attachments)
                    : property.attachments;
                }
              } catch (_) {}

              if (!Array.isArray(attachmentsList) || attachmentsList.length === 0) return null;

              return (
                <div className="shadcn-card p-6">
                  <h3 className="text-sm font-bold text-foreground mb-4 tracking-tight flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span>{language === 'ar' ? 'الملفات والمرفقات' : 'Documents & Attachments'}</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {attachmentsList.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-muted/30 transition-all duration-150 active:scale-98 group/file"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover/file:bg-red-500/20 transition-colors">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 6c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1h-1v2H9V9zm1 2h1v-1h-1v1zm6.5 2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1V9c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v4zm-1-1V9h-1v4h1zm-5.5.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5V12h-1v-.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5v2.5c0 .28.22.5.5.5s.5-.22.5-.5V13h1v.5c0 .28.22.5.5.5s.5-.22.5-.5V11c0-.28-.22-.5-.5-.5s-.5.22-.5.5v1.5z"/>
                            </svg>
                          </div>
                          <div className="text-right rtl:text-right ltr:text-left">
                            <p className="text-xs font-bold text-foreground group-hover/file:text-primary transition-colors line-clamp-1">
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                              {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(1)} MB` : ''} · PDF
                            </p>
                          </div>
                        </div>
                        {language === 'ar' ? (
                          <ArrowLeft className="w-4 h-4 text-muted-foreground/60 group-hover/file:-translate-x-1 transition-transform" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover/file:translate-x-1 transition-transform" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

          </div>
          
        </div>
      </div>
      <ImageViewer 
        isOpen={isViewerOpen}
        items={galleryItems}
        mapInfo={hasMap ? { lat: property.latitude!, lng: property.longitude!, link: formatExternalLink(property.locationLink) } : null}
        initialIndex={activeImage}
        onClose={() => setIsViewerOpen(false)}
        language={language}
      />
    </div>
  );
}
