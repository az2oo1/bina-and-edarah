import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { ImagePlus, Video, Loader2, UploadCloud, Trash2 } from 'lucide-react';

interface ImagesSettingsTabProps {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  homeImages: { hero: string | null; promoVideo: string | null };
  setHomeImages: React.Dispatch<React.SetStateAction<{ hero: string | null; promoVideo: string | null }>>;
  imageSlotUploading: string | null;
  uploadProgress: number | null;
  handleSlotUpload: (e: React.ChangeEvent<HTMLInputElement>, slotKey: string, isVideo: boolean, onUpload: (b: string) => void) => Promise<void>;
}

export const ImagesSettingsTab: React.FC<ImagesSettingsTabProps> = ({
  logoUrl,
  setLogoUrl,
  homeImages,
  setHomeImages,
  imageSlotUploading,
  uploadProgress,
  handleSlotUpload,
}) => {
  const { language } = useLanguage();

  const imageSlots = [
    {
      key: 'logo' as const,
      labelAr: 'شعار الموقع (Logo)',
      labelEn: 'Site Logo',
      hintAr: 'يظهر في شريط التنقل والتذييل. يفضل PNG بخلفية شفافة.',
      hintEn: 'Appears in navbar & footer. PNG with transparent background preferred.',
      current: logoUrl,
      onUpload: (base64: string) => setLogoUrl(base64),
      onRemove: () => setLogoUrl(null),
    },
    {
      key: 'hero' as const,
      labelAr: 'صورة الخلفية الرئيسية (Hero)',
      labelEn: 'Hero Background Image',
      hintAr: 'الصورة الكبيرة خلف عنوان الصفحة الرئيسية.',
      hintEn: 'The large background image behind the main page title.',
      current: homeImages.hero,
      onUpload: (base64: string) => setHomeImages(p => ({ ...p, hero: base64 })),
      onRemove: () => setHomeImages(p => ({ ...p, hero: null })),
    },
    {
      key: 'promoVideo' as const,
      labelAr: 'فيديو العرض التعريفي في الصفحة الرئيسية',
      labelEn: 'Promotional Video for Home Page',
      hintAr: 'يمكنك رفع ملف فيديو (MP4) أو إدخال رابط فيديو مباشر في الحقل أدناه.',
      hintEn: 'You can upload a video file (MP4) or enter a direct video URL in the field below.',
      current: homeImages.promoVideo,
      isVideo: true,
      onUpload: (val: string) => setHomeImages(p => ({ ...p, promoVideo: val })),
      onRemove: () => setHomeImages(p => ({ ...p, promoVideo: null })),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-2 mb-4 inline-block">
          {language === 'ar' ? 'وسائط الصفحة الرئيسية والشعار' : 'Home Page Media & Logo'}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {language === 'ar'
            ? 'ارفع شعار الموقع، صورة الخلفية الرئيسية، وفيديو العرض التعريفي لتهيئة المظهر البصري للموقع.'
            : 'Upload the site logo, hero background image, and promo video to customize the homepage visual appearance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {imageSlots.map((slot) => {
          const isUploading = imageSlotUploading === slot.key;
          const isVideo = !!slot.isVideo;

          return (
            <div
              key={slot.key}
              className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    {isVideo ? <Video className="w-4 h-4" /> : <ImagePlus className="w-4 h-4" />}
                  </div>
                  <h4 className="font-bold text-xs text-foreground">
                    {language === 'ar' ? slot.labelAr : slot.labelEn}
                  </h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {language === 'ar' ? slot.hintAr : slot.hintEn}
                </p>
              </div>

              {/* Preview Box */}
              <div className="relative w-full h-40 bg-muted/30 border border-dashed border-border rounded-xl overflow-hidden flex items-center justify-center group">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-primary p-4 text-center">
                    <Loader2 className="w-7 h-7 animate-spin" />
                    <span className="text-xs font-bold">
                      {isVideo 
                        ? (uploadProgress !== null ? `${language === 'ar' ? 'جاري الرفع:' : 'Uploading:'} ${uploadProgress}%` : (language === 'ar' ? 'جاري المعالجة...' : 'Processing...')) 
                        : (language === 'ar' ? 'جاري التحميل...' : 'Uploading...')}
                    </span>
                  </div>
                ) : slot.current ? (
                  isVideo ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <video 
                        src={slot.current} 
                        className="w-full h-full object-cover opacity-80"
                        controls
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center p-2">
                      <img
                        src={slot.current}
                        alt={slot.labelEn}
                        className="max-w-full max-h-full object-contain drop-shadow-sm"
                      />
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                    {isVideo ? <Video className="w-8 h-8 opacity-40" /> : <ImagePlus className="w-8 h-8 opacity-40" />}
                    <span className="text-[11px] font-medium">
                      {language === 'ar' ? 'لا توجد وسائط مخصصة' : 'No custom media'}
                    </span>
                  </div>
                )}
              </div>

              {/* Inputs & Actions */}
              <div className="space-y-2">
                {isVideo && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground">
                      {language === 'ar' ? 'أو أدخل رابط فيديو مباشر (Direct URL):' : 'Or enter direct video URL:'}
                    </label>
                    <input
                      type="url"
                      value={slot.current || ''}
                      onChange={(e) => slot.onUpload(e.target.value)}
                      className="cn-input text-xs font-mono h-9 dir-ltr bg-background"
                      placeholder="https://domain.com/video.mp4"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept={isVideo ? 'video/mp4,video/webm,video/quicktime' : 'image/*'}
                      onChange={(e) => handleSlotUpload(e, slot.key, isVideo, slot.onUpload)}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className="w-full h-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95">
                      <UploadCloud className="w-4 h-4" />
                      <span>{language === 'ar' ? (isVideo ? 'رفع فيديو' : 'رفع صورة') : (isVideo ? 'Upload Video' : 'Upload Image')}</span>
                    </div>
                  </label>

                  {slot.current && (
                    <button
                      type="button"
                      onClick={slot.onRemove}
                      className="h-9 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
                      title={language === 'ar' ? 'حذف الوسائط' : 'Remove media'}
                      aria-label={language === 'ar' ? 'حذف الوسائط' : 'Remove media'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
