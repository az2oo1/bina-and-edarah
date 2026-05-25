import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { MapPin, Maximize2, Calendar, Star, CheckCircle, ChevronRight, ChevronLeft, Building2, Layers, Phone } from 'lucide-react';


export default function ProjectDetails() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [settings, setSettings] = useState<any>({});

  const Arrow = language === 'ar' ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrls) data.imageUrls = JSON.parse(data.imageUrls);
          if (data.features) data.featuresList = JSON.parse(data.features);
          if (data.details) data.detailsList = JSON.parse(data.details);
          setProject(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          setSettings(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchProject();
    fetchSettings();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Project not found</div>;
  }

  const images = project.imageUrls && project.imageUrls.length > 0 ? project.imageUrls : ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070'];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/projects" className="text-gray-500 hover:text-black font-medium flex items-center gap-2 transition-colors">
            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
          </Link>
          <div className="text-sm text-gray-400 font-medium">#{project.id.split('-')[0]}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {project.tier === 'BIG' ? (language === 'ar' ? 'مشروع كبير' : 'Big Project') : project.tier === 'MID' ? (language === 'ar' ? 'مشروع متوسط' : 'Mid Project') : (language === 'ar' ? 'مشاريع أخرى' : 'Other Projects')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{language === 'ar' ? project.titleAr : project.titleEn}</h1>
          <div className="flex items-center text-gray-500 gap-2 text-lg">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>{project.locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-12">
          <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden group">
            <img 
              src={images[currentImageIndex]} 
              alt="Project" 
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-4 rounded-full shadow-xl transition-all hover:scale-110 z-10 backdrop-blur-sm">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-4 rounded-full shadow-xl transition-all hover:scale-110 z-10 backdrop-blur-sm">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-y-1/2 flex gap-3 z-10 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Specs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                <Maximize2 className="w-8 h-8 text-yellow-500 mb-3" />
                <span className="text-gray-500 text-sm mb-1">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                <span className="text-xl font-bold text-gray-900">{project.area} م²</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                <Building2 className="w-8 h-8 text-yellow-500 mb-3" />
                <span className="text-gray-500 text-sm mb-1">{language === 'ar' ? 'النوع' : 'Type'}</span>
                <span className="text-xl font-bold text-gray-900">{t(`cat.${project.propertyCategory}`) || project.propertyCategory}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                <Calendar className="w-8 h-8 text-yellow-500 mb-3" />
                <span className="text-gray-500 text-sm mb-1">{language === 'ar' ? 'عمر المشروع' : 'Age'}</span>
                <span className="text-xl font-bold text-gray-900">{project.propertyAge > 0 ? `${project.propertyAge} ${language === 'ar' ? 'سنوات' : 'Years'}` : (language === 'ar' ? 'جديد' : 'New')}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                <Layers className="w-8 h-8 text-yellow-500 mb-3" />
                <span className="text-gray-500 text-sm mb-1">{language === 'ar' ? 'التصنيف' : 'Tier'}</span>
                <span className="text-xl font-bold text-gray-900">{project.tier}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Star className="w-7 h-7 text-yellow-500" />
                {language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </h2>
              <p className="text-gray-600 text-lg leading-loose whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Additional Details Grid */}
            {project.detailsList && project.detailsList.length > 0 && (
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8">{language === 'ar' ? 'مواصفات إضافية' : 'Additional Specifications'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {project.detailsList.map((detail: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 md:[&:nth-last-child(-n+2)]:border-0">
                      <span className="text-gray-500 font-medium">{detail.key}</span>
                      <span className="font-bold text-gray-900">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {project.featuresList && project.featuresList.length > 0 && (
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-8">{language === 'ar' ? 'المميزات والمرافق' : 'Features & Facilities'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {project.featuresList.map((feature: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">{feature.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Link */}
            {project.locationLink && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{language === 'ar' ? 'الموقع على الخريطة' : 'Location on Map'}</h3>
                  <p className="text-gray-500">{project.locationText}</p>
                </div>
                <a 
                  href={project.locationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  {language === 'ar' ? 'عرض في جوجل ماب' : 'View in Google Maps'}
                </a>
              </div>
            )}

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">{language === 'ar' ? 'مهتم بهذا المشروع؟' : 'Interested in this project?'}</h3>
                <p className="text-gray-500 mb-8">{language === 'ar' ? 'تواصل معنا للحصول على مزيد من التفاصيل' : 'Contact us for more details'}</p>
                
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${(settings.callingNumber || '966500000000').replace(/\+/g, '')}`}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 px-4 rounded-xl font-bold text-[15px] hover:bg-gray-800 transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(17,24,39,0.1)] hover:shadow-[0_4px_14px_rgba(17,24,39,0.2)]"
                  >
                    <Phone className="w-5 h-5" />
                    {language === 'ar' ? 'اتصال' : 'Call'}
                  </a>

                  <a
                    href={`https://wa.me/${(settings.whatsappNumber || '966500000000').replace(/\+/g, '')}?text=${encodeURIComponent(
                      (settings.whatsappMessage || 'مرحباً، أنا مهتم بهذا المشروع: {title} - {link}')
                        .replace('{title}', language === 'ar' ? project.titleAr : project.titleEn)
                        .replace('{link}', window.location.href)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold text-[15px] hover:bg-[#22bf5b] transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(37,211,102,0.2)] hover:shadow-[0_4px_14px_rgba(37,211,102,0.3)]"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
