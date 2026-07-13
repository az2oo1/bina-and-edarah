import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '../LanguageContext';
import { MapPin, Maximize2, Calendar, Star, CheckCircle, ChevronRight, ChevronLeft, Building2, Layers, Phone, Compass, Ruler, DoorOpen, Armchair, Bath } from 'lucide-react';
import { ImageViewer } from '../components/ImageViewer';


export default function ProjectDetails() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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
  const currentMedia = images[currentImageIndex];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-background min-h-screen pb-16 font-sans text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Breadcrumb & Navigation */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link to="/projects" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1.5 transition-colors">
            {language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
          </Link>
          <div className="text-xs text-muted-foreground font-mono font-medium">#{project.id.split('-')[0]}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-semibold">
              {project.tier === 'BIG' ? (language === 'ar' ? 'مشروع كبير' : 'Big Project') : project.tier === 'MID' ? (language === 'ar' ? 'مشروع متوسط' : 'Mid Project') : (language === 'ar' ? 'مشاريع أخرى' : 'Other Projects')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight mb-2">{language === 'ar' ? project.titleAr : project.titleEn}</h1>
          <div className="flex items-center text-muted-foreground gap-1.5 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground/80" />
            <span>{project.locationText || (language === 'ar' ? 'الرياض' : 'Riyadh')}</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-card rounded-lg p-2 border border-border shadow-xs mb-8">
          <div 
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'VIDEO' || target.closest('button')) {
                return;
              }
              setIsViewerOpen(true);
            }}
            className="relative h-80 sm:h-[500px] rounded overflow-hidden group bg-slate-100 cursor-pointer"
          >
            {currentMedia && (
              currentMedia.startsWith('data:video') || 
              currentMedia.endsWith('.mp4') || 
              currentMedia.endsWith('.mov') || 
              currentMedia.endsWith('.webm') || 
              currentMedia.endsWith('.avi')
            ) ? (
              <video 
                src={currentMedia} 
                controls 
                className="w-full h-full object-cover relative z-10" 
              />
            ) : (
              <img 
                src={currentMedia} 
                alt="Project" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            )}
            {/* Hover expand overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center pointer-events-none z-20">
              <div className="bg-black/75 backdrop-blur-xs text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transform translate-y-2 group-hover:translate-y-0 transition-all duration-250 shadow-xl border border-white/10">
                <Maximize2 className="w-4 h-4 text-primary" />
                <span>{language === 'ar' ? 'عرض الوسائط كاملة' : 'View Full Media'}</span>
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const isRtl = language === 'ar';
                    if (isRtl) {
                      nextImage();
                    } else {
                      prevImage();
                    }
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground p-2 rounded-md shadow-xs transition-all hover:scale-105 z-30 cursor-pointer border border-border flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  title={language === 'ar' ? 'السابق' : 'Previous'}
                  aria-label={language === 'ar' ? 'السابق' : 'Previous'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const isRtl = language === 'ar';
                    if (isRtl) {
                      prevImage();
                    } else {
                      nextImage();
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground p-2 rounded-md shadow-xs transition-all hover:scale-105 z-30 cursor-pointer border border-border flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  title={language === 'ar' ? 'التالي' : 'Next'}
                  aria-label={language === 'ar' ? 'التالي' : 'Next'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs"
                >
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${idx === currentImageIndex ? 'w-5 bg-card' : 'w-1.5 bg-card/50 hover:bg-card'}`}
                      aria-label={`${language === 'ar' ? 'صورة' : 'Image'} ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Specs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-background p-4 border border-border rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
                <Maximize2 className="w-5 h-5 text-primary mb-2" />
                <span className="text-muted-foreground text-xs mb-0.5">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                <span className="text-sm font-bold text-foreground">{project.area} م²</span>
              </div>
              <div className="bg-background p-4 border border-border rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
                <Building2 className="w-5 h-5 text-primary mb-2" />
                <span className="text-muted-foreground text-xs mb-0.5">{language === 'ar' ? 'النوع' : 'Type'}</span>
                <span className="text-sm font-bold text-foreground line-clamp-1">{t(`cat.${project.propertyCategory}`) || project.propertyCategory}</span>
              </div>
              <div className="bg-background p-4 border border-border rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
                <Calendar className="w-5 h-5 text-primary mb-2" />
                <span className="text-muted-foreground text-xs mb-0.5">{language === 'ar' ? 'عمر المشروع' : 'Age'}</span>
                <span className="text-sm font-bold text-foreground">{project.propertyAge > 0 ? `${project.propertyAge} ${language === 'ar' ? 'سنوات' : 'Years'}` : (language === 'ar' ? 'جديد' : 'New')}</span>
              </div>
              <div className="bg-background p-4 border border-border rounded-lg flex flex-col items-center justify-center text-center shadow-xs">
                <Layers className="w-5 h-5 text-primary mb-2" />
                <span className="text-muted-foreground text-xs mb-0.5">{language === 'ar' ? 'التصنيف' : 'Tier'}</span>
                <span className="text-sm font-bold text-foreground">{project.tier}</span>
              </div>
            </div>

            {/* Description */}
            <div className="shadcn-card p-6">
              <h2 className="text-base font-bold text-foreground tracking-tight mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                {language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Additional Details Grid */}
            {project.detailsList && project.detailsList.length > 0 && (
              <div className="shadcn-card p-6">
                <h2 className="text-base font-bold text-foreground tracking-tight mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  {language === 'ar' ? 'مواصفات إضافية' : 'Additional Specifications'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {project.detailsList.map((detail: any, idx: number) => {
                    const lowerKey = detail.key.toLowerCase();
                    let icon = <Layers className="w-4 h-4" />;
                    if (lowerKey.includes('واجهة') || lowerKey.includes('facade')) icon = <Compass className="w-4 h-4" />;
                    else if (lowerKey.includes('شارع') || lowerKey.includes('street')) icon = <Ruler className="w-4 h-4" />;
                    else if (lowerKey.includes('غرف') || lowerKey.includes('room')) icon = <DoorOpen className="w-4 h-4" />;
                    else if (lowerKey.includes('صالة') || lowerKey.includes('hall')) icon = <Armchair className="w-4 h-4" />;
                    else if (lowerKey.includes('حمام') || lowerKey.includes('bathroom')) icon = <Bath className="w-4 h-4" />;
                    else if (lowerKey.includes('ضمان') || lowerKey.includes('warrant')) icon = <CheckCircle className="w-4 h-4" />;
                    else if (lowerKey.includes('تاريخ') || lowerKey.includes('date') || lowerKey.includes('تسليم')) icon = <Calendar className="w-4 h-4" />;

                    return (
                      <div key={idx} className="flex items-center gap-3.5 p-3 rounded-lg bg-background border border-border transition-colors">
                        <div className="p-2 bg-card rounded border border-border text-primary shadow-xs">
                          {icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{detail.key}</p>
                          <p className="text-sm font-semibold text-foreground">{detail.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Features */}
            {project.featuresList && project.featuresList.length > 0 && (
              <div className="shadcn-card p-6">
                <h2 className="text-base font-bold text-foreground tracking-tight mb-4">{language === 'ar' ? 'المميزات والمرافق' : 'Features & Facilities'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                  {project.featuresList.map((feature: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-background border border-border p-3 rounded-md">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-xs font-semibold text-foreground">{feature.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Link */}
            {project.locationLink && (
              <div className="shadcn-card p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{language === 'ar' ? 'الموقع على الخريطة' : 'Location on Map'}</h3>
                  <p className="text-xs text-muted-foreground">{project.locationText}</p>
                </div>
                <a 
                  href={project.locationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <MapPin className="w-4 h-4" />
                  {language === 'ar' ? 'عرض في جوجل ماب' : 'View in Google Maps'}
                </a>
              </div>
            )}

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              <div className="shadcn-card p-6 relative overflow-hidden">
                <h3 className="text-lg font-bold text-foreground tracking-tight mb-1">{language === 'ar' ? 'مهتم بهذا المشروع؟' : 'Interested in this project?'}</h3>
                <p className="text-xs text-muted-foreground mb-6">{language === 'ar' ? 'تواصل معنا للحصول على مزيد من التفاصيل' : 'Contact us for more details'}</p>
                
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${(settings.callingNumber || '966500000000').replace(/\+/g, '')}`}
                    className="btn-primary w-full text-xs h-9 justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
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
                    className="w-full inline-flex items-center justify-center rounded-md text-xs font-medium bg-[#25D366] text-foreground hover:bg-[#22bf5b] h-9 px-4 py-2 shadow-xs transition-colors cursor-pointer gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <ImageViewer
        isOpen={isViewerOpen}
        items={images.map((url: string) => ({ type: 'image', url }))}
        initialIndex={currentImageIndex}
        onClose={() => setIsViewerOpen(false)}
        language={language}
      />
    </div>
  );
}
