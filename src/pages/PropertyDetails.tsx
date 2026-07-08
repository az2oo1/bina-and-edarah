import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { MapPin, Phone, ExternalLink, ArrowLeft, ArrowRight, Maximize, CalendarDays, Coins, Zap, CheckCircle2, MessageCircle, Building2, Compass, Ruler, BedDouble, DoorOpen, Armchair, Bath, Layers, Users, Info, ChefHat } from 'lucide-react';
import { SrIcon } from '../components/SrIcon';

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
  description: string;
  features: string | null;
  propertyAge: number;
  electricityCost: number;
  electricityFrequency: string | null;
  vat: number;
  vatExempt: boolean;
  commission: number;
  price: number;
  imageUrls: string; // JSON string
  aqarLink?: string;
  allowedPaymentPlans?: string;
  paymentsCount?: number | null;
  videoUrl?: string;
  createdAt: string;
}

const getDetailIcon = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('مطبخ') || lowerKey.includes('kitchen')) return <ChefHat className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('واجهة') || lowerKey.includes('facade')) return <Compass className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('شارع') || lowerKey.includes('street')) return <Ruler className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('غرف النوم') || lowerKey.includes('bedroom')) return <BedDouble className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('غرف') || lowerKey.includes('room')) return <DoorOpen className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('صالة') || lowerKey.includes('صالات') || lowerKey.includes('hall')) return <Armchair className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('مياه') || lowerKey.includes('حمام') || lowerKey.includes('bathroom') || lowerKey.includes('دورات')) return <Bath className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('دور') || lowerKey.includes('floor')) return <Layers className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('عمر') || lowerKey.includes('age')) return <CalendarDays className="w-5 h-5 text-muted-foreground" />;
  if (lowerKey.includes('فئة') || lowerKey.includes('category')) return <Users className="w-5 h-5 text-muted-foreground" />;
  return <Info className="w-5 h-5 text-muted-foreground" />;
};

export default function PropertyDetails() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const Arrow = language === 'ar' ? ArrowRight : ArrowLeft;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('966500000000');
  const [callingNumber, setCallingNumber] = useState('966500000000');
  const [whatsappMessage, setWhatsappMessage] = useState('مرحباً، أنا مهتم بهذا العقار: {title} - {link}');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<string>("1");

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
        try {
          const parsed = JSON.parse(data.imageUrls);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setImages(parsed);
          } else {
            setImages(['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop']);
          }
        } catch (e) {
          setImages(['https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop']);
        }
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

  return (
    <div className="bg-background min-h-screen py-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/properties" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <Arrow className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة للعقارات' : 'Back to Properties'}</span>
        </Link>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content & Gallery */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
             <div className="shadcn-card overflow-hidden">
              <div className="relative h-80 sm:h-[450px] w-full bg-slate-100">
                {property.videoUrl && activeImage === images.length ? (
                  <video src={property.videoUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src={images[activeImage]} 
                    alt={language === 'ar' ? property.titleAr : property.titleEn}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                )}
              </div>
              {(images.length > 1 || property.videoUrl) && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-border">
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all cursor-pointer ${activeImage === i ? 'border-primary opacity-100' : 'border-transparent opacity-65 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover rounded-[2px]" />
                    </button>
                  ))}
                  {property.videoUrl && (
                    <button 
                      onClick={() => setActiveImage(images.length)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all cursor-pointer bg-slate-950 text-white flex flex-col items-center justify-center gap-1 ${activeImage === images.length ? 'border-primary opacity-100' : 'border-transparent opacity-65 hover:opacity-100'}`}
                      title={language === 'ar' ? 'مشاهدة الفيديو' : 'Watch Video'}
                    >
                      <svg className="w-6 h-6 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-[8px] font-bold text-gray-400">{language === 'ar' ? 'فيديو' : 'Video'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Description & Features */}
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
          <div className="space-y-6">
            <div className="shadcn-card p-6">
              
              {/* Price Details */}
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">{t('common.totalCost')}</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-foreground font-mono tracking-tight">{(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()}</span>
                  <SrIcon className="w-6 h-6 text-primary pb-0.5" />
                </div>
                {property.type === 'RENT' && property.paymentFrequency && (
                  <div className="flex gap-1.5 mb-4">
                    <p className="text-xs text-primary bg-primary/10 border border-primary/20 rounded px-2.5 py-1 font-semibold flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-primary" />
                      {property.paymentFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                    </p>
                    {property.paymentsCount && (
                      <p className="text-xs text-primary bg-primary/10 border border-primary/20 rounded px-2.5 py-1 font-semibold flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-primary" />
                        {property.paymentsCount} {language === 'ar' ? (property.paymentsCount === 1 ? 'دفعة' : property.paymentsCount === 2 ? 'دفعتين' : 'دفعات') : 'Payments'}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2.5 p-4 bg-background rounded-lg border border-border">
                  <p className="text-xs font-bold text-muted-foreground mb-0.5">{language === 'ar' ? 'التفاصيل المالية' : 'Financial Breakdown'}</p>
                  
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-muted-foreground">{t('common.basePrice')}</span>
                    <span className="text-foreground text-left flex items-center gap-0.5" dir="ltr">
                      {property.price.toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-muted-foreground">{t('common.vat')}</span>
                    <span className="text-foreground text-left flex items-center gap-0.5" dir="ltr">
                      {property.vatExempt ? (language === 'ar' ? 'معفى' : 'Exempt') : (property.vat > 0 ? <>{property.vat.toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-muted-foreground/60" /></> : (language === 'ar' ? 'شامل' : 'Included'))}
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
                          <div key="elec" className="flex justify-between items-center text-xs font-medium border-t border-border/30 pt-1.5 mt-1.5">
                            <span className="text-muted-foreground">{language === 'ar' ? 'فاتورة الكهرباء' : 'Electricity Bill'}</span>
                            <span className="text-foreground text-left flex items-center gap-0.5" dir="ltr">
                              {parsed.electricityCost.toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                              <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
                                / {parsed.electricityFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                              </span>
                            </span>
                          </div>
                        );
                      }
                      if (parsed.water && parsed.waterCost > 0) {
                        rows.push(
                          <div key="water" className="flex justify-between items-center text-xs font-medium border-t border-border/30 pt-1.5 mt-1.5">
                            <span className="text-muted-foreground">{language === 'ar' ? 'فاتورة المياه' : 'Water Bill'}</span>
                            <span className="text-foreground text-left flex items-center gap-0.5" dir="ltr">
                              {parsed.waterCost.toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
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
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-muted-foreground">{language === 'ar' ? 'الفواتير الخدمية' : 'Utility Bills'}</span>
                            <span className="text-foreground text-left flex items-center gap-0.5" dir="ltr">
                              {property.electricityCost.toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
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
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-muted-foreground">{t('common.commission')}</span>
                    <span className="text-foreground text-left flex items-center gap-0.5" dir="ltr">
                      {property.commission > 0 ? <>{property.commission.toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-muted-foreground/60" /></> : (language === 'ar' ? 'غير محدد' : 'N/A')}
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
                            {Math.round((property.price + (property.vat || 0)) / planNum).toLocaleString()} <SrIcon className="w-3.5 h-3.5 text-primary" />
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`tel:${callingNumber.replace(/\+/g, '')}`}
                  className="btn-primary w-full text-xs h-9 justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  {t('common.call')}
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
                  className="w-full inline-flex items-center justify-center rounded-md text-xs font-medium bg-[#25D366] text-foreground hover:bg-[#22bf5b] h-9 px-4 py-2 shadow-xs transition-colors cursor-pointer gap-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  {t('common.whatsapp')}
                </a>
              </div>

              {(property.locationLink || property.aqarLink) && (
                <div className="flex flex-col gap-2 mt-2">
                  {property.locationLink && (
                    <a
                      href={property.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between border border-border rounded-md px-4 py-2 text-xs font-semibold hover:bg-background shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground/80" />
                        <span>{t('common.location')}</span>
                      </div>
                      <Arrow className="w-4 h-4 text-muted-foreground/60" />
                    </a>
                  )}

                  {property.aqarLink && (
                    <a
                      href={property.aqarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between border border-border rounded-md px-4 py-2 text-xs font-semibold hover:bg-background shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src="https://assets.aqar.fm/icons/v2/aqar-vertical-logo.svg" alt="Aqar" className="h-4 object-contain grayscale opacity-70" />
                        <span>{t('common.viewAqar')}</span>
                      </div>
                      <Arrow className="w-4 h-4 text-muted-foreground/60" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="shadcn-card p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
              </h3>
              
              {/* Specs Grid (Device Specs Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-center gap-3.5 p-3 rounded-lg bg-background border border-border transition-colors">
                  <div className="p-2 bg-card rounded border border-border text-primary shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{t('admin.placeholder.category')}</p>
                    <p className="text-sm font-semibold text-foreground">{t(`cat.${property.propertyCategory}`)}</p>
                  </div>
                </div>

                {property.area > 0 && (
                  <div className="flex items-center gap-3.5 p-3 rounded-lg bg-background border border-border transition-colors">
                    <div className="p-2 bg-card rounded border border-border text-primary shadow-xs">
                      <Maximize className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{t('common.area')}</p>
                      <p className="text-sm font-semibold text-foreground">{property.area} {t('common.sqm')}</p>
                    </div>
                  </div>
                )}

                {property.propertyAge > 0 && (
                  <div className="flex items-center gap-3.5 p-3 rounded-lg bg-background border border-border transition-colors">
                    <div className="p-2 bg-card rounded border border-border text-primary shadow-xs">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{t('common.propertyAge')}</p>
                      <p className="text-sm font-semibold text-foreground">{property.propertyAge} {language === 'ar' ? 'سنة' : 'Years'}</p>
                    </div>
                  </div>
                )}

                {property.locationText && (
                  <div className="flex items-center gap-3.5 p-3 rounded-lg bg-background border border-border transition-colors">
                    <div className="p-2 bg-card rounded border border-border text-primary shadow-xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{t('common.locationText')}</p>
                      <p className="text-sm font-semibold text-foreground">{property.locationText}</p>
                    </div>
                  </div>
                )}

                {/* Dynamically parsed details */}
                {property.details && (() => {
                  try {
                    const parsed = JSON.parse(property.details);
                    return parsed.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3.5 p-3 rounded-lg bg-background border border-border transition-colors">
                        <div className="p-2 bg-card rounded border border-border text-primary shadow-xs">
                          {getDetailIcon(item.key)}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{item.key}</p>
                          <p className="text-sm font-semibold text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ));
                  } catch (e) {
                    return null;
                  }
                })()}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
