import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Building2,
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  Clock,
  Car,
  Plane,
  ShoppingBag,
  Train,
  GraduationCap,
  HeartPulse,
  Trees,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { NearbyPlace, RouteData, fetchDrivingRoute, formatMinutes } from '../lib/mapRouting';

interface StyledArchitecturalMapProps {
  latitude: number;
  longitude: number;
  buildingName?: string;
  buildingLocationText?: string;
  locationLink?: string | null;
  nearbyPlaces?: NearbyPlace[];
  language?: 'ar' | 'en';
  height?: string | number;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  airport: '✈️',
  mall: '🛍️',
  metro: '🚇',
  school: '🎓',
  hospital: '🏥',
  park: '🌳',
  landmark: '🏛️',
  general: '📍'
};

export const StyledArchitecturalMap: React.FC<StyledArchitecturalMapProps> = ({
  latitude,
  longitude,
  buildingName,
  buildingLocationText,
  locationLink,
  nearbyPlaces = [],
  language = 'ar',
  height = '100%',
  className = '',
  interactive = true,
  showControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // States
  const [routes, setRoutes] = useState<Record<string, RouteData>>({});
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerWrapperRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch routes for all valid nearby places
  useEffect(() => {
    if (!latitude || !longitude || nearbyPlaces.length === 0) {
      setRoutes({});
      return;
    }

    let isMounted = true;
    setLoadingRoutes(true);

    const loadAllRoutes = async () => {
      const routeMap: Record<string, RouteData> = {};
      const promises = nearbyPlaces.map(async (place) => {
        if (!place.lat || !place.lng) return;
        try {
          const route = await fetchDrivingRoute(latitude, longitude, place.lat, place.lng);
          // If user provided custom duration, override durationMinutes
          if (place.durationMinutes && place.durationMinutes > 0) {
            route.durationMinutes = place.durationMinutes;
          }
          routeMap[place.id] = route;
        } catch (_) {}
      });

      await Promise.all(promises);
      if (isMounted) {
        setRoutes(routeMap);
        setLoadingRoutes(false);
      }
    };

    loadAllRoutes();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, nearbyPlaces]);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || !latitude || !longitude) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive
    });

    mapInstanceRef.current = map;

    // ESRI Dark Gray Canvas Base Layer with Retina support
    const baseTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

    const tileLayer = L.tileLayer(baseTileUrl, {
      maxZoom: 19,
      maxNativeZoom: 18,
      detectRetina: true,
      className: 'architectural-dark-tiles',
      updateWhenIdle: false,
      updateWhenZooming: true,
      keepBuffer: 8
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // High-clarity ESRI reference labels layer for street names with Retina support
    const refTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
    const labelsLayer = L.tileLayer(refTileUrl, {
      maxZoom: 19,
      maxNativeZoom: 18,
      detectRetina: true,
      opacity: 0.9,
      zIndex: 200
    }).addTo(map);
    (map as any)._labelsLayer = labelsLayer;

    // Create Layer Groups
    const routesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    routesLayerGroupRef.current = routesGroup;
    markersLayerGroupRef.current = markersGroup;

    // Multiple staggered invalidateSize timers to guarantee full rendering across grid and layout shifts
    const timer1 = setTimeout(() => map.invalidateSize(), 50);
    const timer2 = setTimeout(() => map.invalidateSize(), 200);
    const timer3 = setTimeout(() => map.invalidateSize(), 500);
    const timer4 = setTimeout(() => map.invalidateSize(), 1000);

    // Auto resize observer on map container
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, interactive]);

  // 4. Render Markers and Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routesGroup = routesLayerGroupRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !routesGroup || !markersGroup || !latitude || !longitude) return;

    routesGroup.clearLayers();
    markersGroup.clearLayers();

    // ==========================================
    // A. Building Marker (Origin)
    // ==========================================
    const buildingTitle = buildingName || (language === 'ar' ? 'العقار / المبنى' : 'Building');
    const buildingIconHtml = `
      <div class="relative flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -100%);">
        <!-- Radar Pulse Ring -->
        <span class="absolute -top-1 -bottom-1 -left-1 -right-1 rounded-full bg-[#0066FF]/40 animate-ping opacity-75"></span>
        <span class="absolute -top-3 -bottom-3 -left-3 -right-3 rounded-full bg-[#0066FF]/20 animate-pulse"></span>
        
        <!-- Main Marker Pin -->
        <div class="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0052cc] via-[#0066FF] to-[#38bdf8] p-0.5 shadow-xl shadow-[#0066FF]/40 flex items-center justify-center text-white border border-white/40 transform transition-transform duration-300 hover:scale-110">
          <svg class="w-6 h-6 drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
          </svg>
        </div>

        <!-- Building Label Pill -->
        <div class="mt-1.5 px-3 py-1 bg-[#18181b]/95 backdrop-blur-md border border-[#0066FF]/60 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
          <span class="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse"></span>
          <span class="text-xs font-black tracking-wide text-white drop-shadow">${buildingTitle}</span>
        </div>
      </div>
    `;

    const buildingIcon = L.divIcon({
      html: buildingIconHtml,
      className: 'building-pin-marker',
      iconSize: [0, 0]
    });

    const buildingMarker = L.marker([latitude, longitude], { icon: buildingIcon, zIndexOffset: 1000 });
    buildingMarker.addTo(markersGroup);

    // ==========================================
    // B. Landmark Markers, Routes & Minute Badges
    // ==========================================
    const allCoords: [number, number][] = [[latitude, longitude]];

    nearbyPlaces.forEach((place) => {
      if (!place.lat || !place.lng) return;
      allCoords.push([place.lat, place.lng]);

      const isSelected = activePlaceId === place.id;
      const placeName = language === 'ar' ? (place.nameAr || place.nameEn) : (place.nameEn || place.nameAr);
      const catIcon = CATEGORY_ICONS[place.category || 'general'] || '📍';
      const route = routes[place.id];
      const minutes = place.durationMinutes || route?.durationMinutes || 5;

      // 1. Landmark Marker Pin
      const landmarkIconHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group select-none" style="transform: translate(-50%, -100%);">
          <!-- Pin Pinpoint Core -->
          <div class="w-9 h-9 rounded-2xl ${
            isSelected
              ? 'bg-[#0066FF] ring-4 ring-[#0066FF]/40 scale-110 shadow-lg shadow-[#0066FF]/50 text-white'
              : 'bg-[#18181b]/95 border border-border hover:border-[#0066FF] shadow-lg shadow-black/80 hover:scale-105 text-white'
          } p-1.5 flex items-center justify-center transition-all duration-300 text-base">
            <span>${catIcon}</span>
          </div>

          <!-- Name Pill -->
          <div class="mt-1 px-2.5 py-0.5 ${
            isSelected
              ? 'bg-[#0066FF] text-white font-black border-[#0066FF] shadow-[#0066FF]/40'
              : 'bg-[#18181b]/90 text-white/90 font-bold border border-white/20 group-hover:border-[#0066FF] group-hover:text-white'
          } backdrop-blur-md rounded-full text-[11px] shadow-xl whitespace-nowrap transition-all duration-200">
            ${placeName}
          </div>
        </div>
      `;

      const landmarkIcon = L.divIcon({
        html: landmarkIconHtml,
        className: 'landmark-pin-marker',
        iconSize: [0, 0]
      });

      const landmarkMarker = L.marker([place.lat, place.lng], {
        icon: landmarkIcon,
        zIndexOffset: isSelected ? 900 : 500
      });

      landmarkMarker.on('click', () => {
        setActivePlaceId(isSelected ? null : place.id);
      });

      landmarkMarker.addTo(markersGroup);

      // 2. Draw Route Polylines
      if (route && route.coordinates && route.coordinates.length > 0) {
        const polyCoords = route.coordinates;

        // Outer Glow Polyline
        const glowLine = L.polyline(polyCoords, {
          color: isSelected ? '#0066FF' : '#38bdf8',
          weight: isSelected ? 8 : 5,
          opacity: isSelected ? 0.8 : 0.35,
          lineCap: 'round',
          lineJoin: 'round',
          className: isSelected ? 'route-glow-selected' : 'route-glow'
        });
        glowLine.addTo(routesGroup);

        // Inner Sharp Route Polyline with flow/dash pattern
        const coreLine = L.polyline(polyCoords, {
          color: isSelected ? '#ffffff' : '#0066FF',
          weight: isSelected ? 4 : 3,
          opacity: isSelected ? 1 : 0.9,
          dashArray: isSelected ? undefined : '6, 8',
          lineCap: 'round',
          lineJoin: 'round',
          className: 'cursor-pointer transition-all'
        });

        coreLine.on('click', () => {
          setActivePlaceId(isSelected ? null : place.id);
        });

        coreLine.addTo(routesGroup);

        // 3. Floating Travel Time Badge Above The Way
        const midpoint = route.midpoint;
        const timeBadgeText = formatMinutes(minutes, language === 'en' ? 'en' : 'ar');
        const distanceText = route.distanceKm ? `${route.distanceKm} ${language === 'ar' ? 'كم' : 'km'}` : '';

        const badgeHtml = `
          <div class="relative flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer select-none transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 ${
            isSelected
              ? 'bg-[#0066FF] text-white border-2 border-white shadow-xl shadow-[#0066FF]/50 scale-110 font-black'
              : 'bg-[#18181b]/95 text-blue-300 border border-[#0066FF]/60 hover:border-[#0066FF] hover:text-white shadow-lg shadow-black/80 hover:scale-105'
          } backdrop-blur-md">
            <span class="text-xs">🚗</span>
            <span class="text-[11px] font-bold tracking-tight">${timeBadgeText}</span>
            ${distanceText ? `<span class="text-[9px] opacity-75 border-s border-current/30 ps-1 font-mono">${distanceText}</span>` : ''}
          </div>
        `;

        const badgeIcon = L.divIcon({
          html: badgeHtml,
          className: 'travel-time-badge-marker',
          iconSize: [0, 0]
        });

        const badgeMarker = L.marker(midpoint, {
          icon: badgeIcon,
          zIndexOffset: isSelected ? 800 : 400
        });

        badgeMarker.on('click', () => {
          setActivePlaceId(isSelected ? null : place.id);
        });

        badgeMarker.addTo(routesGroup);
      }
    });

    // Auto-fit bounds if destinations exist and no active place is pinned
    if (!activePlaceId && allCoords.length > 1) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true });
    } else if (activePlaceId) {
      const activePlace = nearbyPlaces.find((p) => p.id === activePlaceId);
      if (activePlace && activePlace.lat && activePlace.lng) {
        const bounds = L.latLngBounds([[latitude, longitude], [activePlace.lat, activePlace.lng]]);
        map.fitBounds(bounds, { padding: [80, 80], maxZoom: 16, animate: true });
      }
    }
  }, [latitude, longitude, nearbyPlaces, routes, activePlaceId, buildingName, language]);

  // Recenter Map on Building
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !latitude || !longitude) return;
    setActivePlaceId(null);
    if (nearbyPlaces.length > 0) {
      const allCoords: [number, number][] = [[latitude, longitude], ...nearbyPlaces.map(p => [p.lat, p.lng] as [number, number])];
      mapInstanceRef.current.fitBounds(L.latLngBounds(allCoords), { padding: [60, 60], maxZoom: 16 });
    } else {
      mapInstanceRef.current.setView([latitude, longitude], 15, { animate: true });
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerWrapperRef.current) return;
    if (!isFullscreen) {
      if (containerWrapperRef.current.requestFullscreen) {
        containerWrapperRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerWrapperRef}
      className={`dark relative w-full min-h-[380px] rounded-2xl overflow-hidden bg-[#1c1c1c] border border-border/80 shadow-2xl select-none ${className}`}
      style={{ height }}
    >
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-0 outline-none bg-[#1c1c1c]" />

      {/* Map Control Bar & Overlays */}
      {showControls && (
        <>
          {/* Top Action Controls: Recenter, Google Maps, Fullscreen */}
          <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-end z-20 pointer-events-none gap-2">
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleRecenter}
                className="btn-secondary h-9 px-3.5 text-xs font-semibold gap-1.5 shadow-xs"
                title={language === 'ar' ? 'إعادة ضبط العرض' : 'Recenter map'}
              >
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">{language === 'ar' ? 'توسيط' : 'Recenter'}</span>
              </button>

              {locationLink && (
                <a
                  href={locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary h-9 px-3.5 text-xs font-semibold gap-1.5 shadow-xs"
                  title={language === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{language === 'ar' ? 'خرائط جوجل' : 'Google Maps'}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              )}

              <button
                type="button"
                onClick={toggleFullscreen}
                className="btn-secondary h-9 w-9 p-0 rounded-full flex items-center justify-center shadow-xs"
                title={isFullscreen ? (language === 'ar' ? 'تصغير' : 'Exit Fullscreen') : (language === 'ar' ? 'ملء الشاشة' : 'Fullscreen')}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Places Quick-Select Bar - styled with site theme pills */}
          {nearbyPlaces.length > 0 && (
            <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-20 pointer-events-none">
              <div className="pointer-events-auto bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-2.5 shadow-2xl flex items-center gap-2 overflow-x-auto custom-scrollbar">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-2 flex-shrink-0 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-primary" />
                  {language === 'ar' ? 'المعالم والمسارات:' : 'Landmarks:'}
                </span>

                {nearbyPlaces.map((place) => {
                  const isSelected = activePlaceId === place.id;
                  const placeName = language === 'ar' ? (place.nameAr || place.nameEn) : (place.nameEn || place.nameAr);
                  const catIcon = CATEGORY_ICONS[place.category || 'general'] || '📍';
                  const route = routes[place.id];
                  const minutes = place.durationMinutes || route?.durationMinutes || 5;

                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => setActivePlaceId(isSelected ? null : place.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
                        isSelected
                          ? 'btn-primary h-auto py-1.5 text-xs shadow-sm scale-102'
                          : 'btn-secondary h-auto py-1.5 text-xs'
                      }`}
                    >
                      <span>{catIcon}</span>
                      <span>{placeName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {formatMinutes(minutes, language === 'en' ? 'en' : 'ar')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading Routes Spinner Indicator */}
      {loadingRoutes && (
        <div className="absolute top-4 right-4 z-30 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/30 flex items-center gap-2 text-xs text-foreground shadow-xl pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>{language === 'ar' ? 'جارٍ رسم المسارات...' : 'Tracing routes...'}</span>
        </div>
      )}
    </div>
  );
};
