import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { MapPin, Phone, ExternalLink, ArrowLeft, ArrowRight, Maximize, CalendarDays, Coins, Zap, CheckCircle2, MessageCircle, Building2, Compass, Ruler, BedDouble, DoorOpen, Armchair, Bath, Layers, Users, Info } from 'lucide-react';
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
  commission: number;
  price: number;
  imageUrls: string; // JSON string
  aqarLink?: string;
  createdAt: string;
}

const getDetailIcon = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes('واجهة') || lowerKey.includes('facade')) return <Compass className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('شارع') || lowerKey.includes('street')) return <Ruler className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('غرف النوم') || lowerKey.includes('bedroom')) return <BedDouble className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('غرف') || lowerKey.includes('room')) return <DoorOpen className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('صالة') || lowerKey.includes('صالات') || lowerKey.includes('hall')) return <Armchair className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('مياه') || lowerKey.includes('حمام') || lowerKey.includes('bathroom') || lowerKey.includes('دورات')) return <Bath className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('دور') || lowerKey.includes('floor')) return <Layers className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('عمر') || lowerKey.includes('age')) return <CalendarDays className="w-5 h-5 text-gray-400" />;
  if (lowerKey.includes('فئة') || lowerKey.includes('category')) return <Users className="w-5 h-5 text-gray-400" />;
  return <Info className="w-5 h-5 text-gray-400" />;
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
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl">Property not found.</p>
        <Link to="/properties" className="text-yellow-600 mt-4 inline-block hover:underline">
          Return to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <Arrow className="w-5 h-5" />
          <span className="font-medium">{language === 'ar' ? 'العودة للعقارات' : 'Back to Properties'}</span>
        </Link>

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {property.type === 'SALE' ? t('common.sale') : t('common.rent')}
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {t(`cat.${property.propertyCategory}`)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            {language === 'ar' ? property.titleAr : property.titleEn}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Content & Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-96 sm:h-[500px] w-full bg-gray-200">
                <img 
                  src={images[activeImage]} 
                  alt={language === 'ar' ? property.titleAr : property.titleEn}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? 'border-yellow-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'وصف العقار' : 'Description'}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                  {property.description}
                </p>
              </div>

              {property.features && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('common.features')}</h2>
                  <div className="flex flex-wrap gap-3">
                    {property.features.split(',').map((feature, idx) => (
                      <span key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              
              {/* Price Details */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('common.totalCost')}</p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900 font-mono tracking-tighter">{(property.price + (property.vat || 0) + (property.type === 'RENT' ? (property.electricityCost || 0) : (property.commission || 0))).toLocaleString()}</span>
                  <SrIcon className="w-8 h-8 text-yellow-600 pb-1" />
                </div>
                {property.type === 'RENT' && property.paymentFrequency && (
                  <div className="flex gap-2 mb-6">
                    <p className="text-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 font-bold flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      {property.paymentFrequency === 'YEARLY' ? t('common.yearly') : t('common.monthly')}
                    </p>
                    {property.paymentsCount && (
                      <p className="text-gray-700 bg-gray-100 rounded-lg px-3 py-1.5 font-bold flex items-center gap-2">
                        <Coins className="w-4 h-4" />
                        {property.paymentsCount} {language === 'ar' ? (property.paymentsCount === 1 ? 'دفعة' : property.paymentsCount === 2 ? 'دفعتين' : 'دفعات') : 'Payments'}
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                  <p className="text-sm font-bold text-gray-500 mb-1">{language === 'ar' ? 'التفاصيل المالية' : 'Financial Breakdown'}</p>
                  
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">{t('common.basePrice')}</span>
                    <span className="text-gray-900 text-left flex items-center gap-1" dir="ltr">
                      {property.price.toLocaleString()} <SrIcon className="w-4 h-4 text-gray-400" />
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">{t('common.vat')}</span>
                    <span className="text-gray-900 text-left flex items-center gap-1" dir="ltr">
                      {property.vat > 0 ? <>{property.vat.toLocaleString()} <SrIcon className="w-4 h-4 text-gray-400" /></> : (language === 'ar' ? 'شامل' : 'Included')}
                    </span>
                  </div>
                  {property.type === 'RENT' && (
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-gray-500">{t('common.electricityCost')} {property.electricityFrequency === 'YEARLY' ? `(${t('common.yearly')})` : property.electricityFrequency === 'MONTHLY' ? `(${t('common.monthly')})` : ''}</span>
                      <span className="text-gray-900 text-left flex items-center gap-1" dir="ltr">
                        {property.electricityCost > 0 ? <>{property.electricityCost.toLocaleString()} <SrIcon className="w-4 h-4 text-gray-400" /></> : (language === 'ar' ? 'شامل' : 'Included')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-500">{t('common.commission')}</span>
                    <span className="text-gray-900 text-left flex items-center gap-1" dir="ltr">
                      {property.commission > 0 ? <>{property.commission.toLocaleString()} <SrIcon className="w-4 h-4 text-gray-400" /></> : (language === 'ar' ? 'غير محدد' : 'N/A')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${callingNumber.replace(/\+/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 px-4 rounded-xl font-bold text-[15px] hover:bg-gray-800 transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(17,24,39,0.1)] hover:shadow-[0_4px_14px_rgba(17,24,39,0.2)]"
                >
                  <Phone className="w-5 h-5" />
                  {t('common.call')}
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(
                    whatsappMessage
                      .replace('{title}', language === 'ar' ? property.titleAr : property.titleEn)
                      .replace('{link}', window.location.href)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold text-[15px] hover:bg-[#22bf5b] transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(37,211,102,0.2)] hover:shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  {t('common.whatsapp')}
                </a>
              </div>

              {(property.locationLink || property.aqarLink) && (
                <div className="flex flex-col gap-3 mt-3">
                  {property.locationLink && (
                    <a
                      href={property.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between group bg-white text-gray-700 border border-gray-200 py-3.5 px-5 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 active:scale-[0.98] shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <span className="font-bold text-[15px]">{t('common.location')}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 rtl:rotate-180 transition-colors" />
                    </a>
                  )}

                  {property.aqarLink && (
                    <a
                      href={property.aqarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between group bg-white text-gray-700 border border-gray-200 py-3.5 px-5 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all duration-200 active:scale-[0.98] shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img src="https://assets.aqar.fm/icons/v2/aqar-vertical-logo.svg" alt="Aqar" className="h-6 object-contain grayscale opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="font-bold text-[15px]">{t('common.viewAqar')}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 rtl:rotate-180 transition-colors" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'ar' ? 'المعلومات الأساسية' : 'Key Information'}</h3>
              {/* Specs */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">{t('admin.placeholder.category')}</p>
                  <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    {t(`cat.${property.propertyCategory}`)}
                  </p>
                </div>
                {property.area > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-1">{t('common.area')}</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Maximize className="w-5 h-5 text-gray-400" />
                      {property.area} {t('common.sqm')}
                    </p>
                  </div>
                )}
                {property.propertyAge > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-1">{t('common.propertyAge')}</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-gray-400" />
                      {property.propertyAge}
                    </p>
                  </div>
                )}
                {(property.locationText) && (
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-1">{t('common.locationText')}</p>
                    <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      {property.locationText}
                    </p>
                  </div>
                )}
                {/* Dynamically parsed details */}
                {property.details && (() => {
                  try {
                    const parsed = JSON.parse(property.details);
                    return parsed.map((item: any, idx: number) => (
                      <div key={idx}>
                        <p className="text-sm font-bold text-gray-500 mb-1">{item.key}</p>
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {getDetailIcon(item.key)}
                          {item.value}
                        </p>
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
