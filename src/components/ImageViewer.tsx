import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Video, MapPin, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ViewerItem = { type: 'image' | 'video' | 'map'; url?: string };

interface ImageViewerProps {
  isOpen: boolean;
  items: ViewerItem[];
  mapInfo?: { lat: number; lng: number; link?: string | null } | null;
  initialIndex: number;
  onClose: () => void;
  language: 'ar' | 'en';
}

export function ImageViewer({
  isOpen,
  items,
  mapInfo,
  initialIndex,
  onClose,
  language
}: ImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

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


  // Sync initialIndex when viewer opens
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        if (language === 'ar') handlePrev();
        else handleNext();
      }
      if (e.key === 'ArrowLeft') {
        if (language === 'ar') handleNext();
        else handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, language]);

  if (!isOpen) return null;

  const totalItems = items.length;
  const activeItem = items[activeIndex];
  const isMapActive = activeItem?.type === 'map';
  const isVideoActive = activeItem?.type === 'video';
  const activeUrl = activeItem?.url;
  const mapItemIndex = items.findIndex(item => item.type === 'map');
  const hasMapItem = mapItemIndex !== -1;

  const handleNext = () => {
    setIsZoomed(false);
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleThumbnailClick = (index: number) => {
    setIsZoomed(false);
    setActiveIndex(index);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl select-none" 
        dir="ltr"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 z-10 w-full bg-gradient-to-b from-black/60 to-transparent">
          <div className="text-white/90 font-mono text-sm font-semibold tracking-wider">
            {activeIndex + 1} / {totalItems}
          </div>
          
          <div className="flex items-center gap-3">
            {!isVideoActive && !isMapActive && (
              <button 
                onClick={() => setIsZoomed(!isZoomed)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                title={isZoomed ? (language === 'ar' ? 'ملائمة الشاشة' : 'Fit Screen') : (language === 'ar' ? 'ملء الشاشة' : 'Fill Screen')}
                aria-label={isZoomed ? (language === 'ar' ? 'ملائمة الشاشة' : 'Fit Screen') : (language === 'ar' ? 'ملء الشاشة' : 'Fill Screen')}
              >
                {isZoomed ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              title={language === 'ar' ? 'إغلاق' : 'Close'}
              aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-grow flex items-center justify-center p-4 min-h-0">
          {/* Navigation Controls */}
          {totalItems > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 p-3 sm:p-4 rounded-xl transition-all cursor-pointer backdrop-blur-md border border-white/10 z-10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                title={language === 'ar' ? 'السابق' : 'Previous'}
                aria-label={language === 'ar' ? 'السابق' : 'Previous'}
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 p-3 sm:p-4 rounded-xl transition-all cursor-pointer backdrop-blur-md border border-white/10 z-10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                title={language === 'ar' ? 'التالي' : 'Next'}
                aria-label={language === 'ar' ? 'التالي' : 'Next'}
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          {/* Active Image, Video or Map */}
          <div className="w-full h-full max-w-7xl max-h-[75vh] flex items-center justify-center overflow-hidden">
            {isMapActive && mapInfo ? (
              <div className="w-full h-full flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={mapInfo.link || `https://www.google.com/maps?q=${mapInfo.lat},${mapInfo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-white/10 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <iframe
                  src={`https://maps.google.com/maps?q=${mapInfo.lat},${mapInfo.lng}&z=15&output=embed`}
                  className="w-full flex-grow rounded-lg shadow-2xl border border-white/5"
                  title={language === 'ar' ? 'موقع العقار' : 'Property Location'}
                  loading="lazy"
                />
              </div>
            ) : isVideoActive ? (
              <video 
                src={activeUrl} 
                controls 
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl object-contain border border-white/5" 
              />
            ) : (
              <motion.img
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={activeUrl}
                alt={`Lightbox item ${activeIndex}`}
                className={`max-w-full max-h-full rounded-lg shadow-2xl transition-all duration-300 ${
                  isZoomed ? 'object-cover w-full h-full cursor-zoom-out' : 'object-contain cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            )}
          </div>
        </div>

        {/* Bottom Thumbnail Strip */}
        <div className="w-full bg-gradient-to-t from-black/90 to-black/30 py-4 px-6 z-10 flex flex-col items-center gap-3">
          {totalItems > 1 && (
            <div className="flex items-center max-w-full bg-black/40 rounded-xl border border-white/10 overflow-hidden">
              <div 
                ref={thumbnailContainerRef}
                onMouseDown={handleThumbnailMouseDown}
                onMouseLeave={handleThumbnailMouseLeave}
                onMouseUp={handleThumbnailMouseUp}
                onMouseMove={handleThumbnailMouseMove}
                className="flex-1 flex gap-2.5 overflow-x-auto px-4 py-2.5 custom-scrollbar select-none cursor-grab active:cursor-grabbing"
              >
                {items.map((item, idx) => {
                  if (item.type === 'map') return null;
                  const isItemVideo = item.type === 'video';
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (hasDraggedRef.current) return;
                        handleThumbnailClick(idx);
                      }}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                        activeIndex === idx ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-transparent opacity-50 hover:opacity-95'
                      }`}
                      aria-label={`${language === 'ar' ? 'عرض العنصر' : 'View item'} ${idx + 1}`}
                    >
                      {isItemVideo ? (
                        <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-1">
                          <Video className="w-5 h-5 text-primary" />
                          <span className="text-[9px] font-bold text-gray-300">{language === 'ar' ? 'فيديو' : 'Video'}</span>
                        </div>
                      ) : (
                        <img 
                          src={item.url} 
                          alt={`Thumbnail ${idx}`} 
                          className="w-full h-full object-cover" 
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {hasMapItem && (
                <div className="flex items-center flex-shrink-0 px-4 py-2.5 border-s border-white/15">
                  <button
                    onClick={() => handleThumbnailClick(mapItemIndex)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                      activeIndex === mapItemIndex ? 'border-primary scale-105 shadow-lg shadow-primary/20' : 'border-transparent opacity-50 hover:opacity-95'
                    }`}
                    aria-label={language === 'ar' ? 'عرض الخريطة' : 'View Map'}
                  >
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-1">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-[9px] font-bold text-gray-300">{language === 'ar' ? 'الخريطة' : 'Map'}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
