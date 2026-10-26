'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Search,
  Layers,
  Compass,
  Navigation,
  Sparkles,
  Radio,
  MapPin,
  Eye,
  Crosshair,
  ChevronRight,
  ShieldCheck,
  LocateFixed,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { HistoricalLocation, LocationRarity, LocationContentType } from '@/types/location';

export type MapStyleMode = 'satellite' | 'tactical' | 'heritage';

export const MAP_STYLES: Record<
  MapStyleMode,
  {
    name: string;
    baseUrl: string;
    overlayUrl?: string;
    filter?: string;
  }
> = {
  satellite: {
    name: 'Vệ Tinh Thực Địa',
    // Ảnh vệ tinh độ phân giải cao từ Esri (Miễn phí 100%, không cần API key)
    baseUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // Lớp tên đường, ranh giới & địa danh từ Esri World Boundaries & Places (100% không watermark)
    overlayUrl:
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    filter: 'contrast(1.08) saturate(1.15) brightness(0.92)',
  },
  tactical: {
    name: 'Tác Chiến Đêm',
    // Endpoint CartoCDN chuẩn không yêu cầu API key, không watermark
    baseUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    filter: 'contrast(1.15) brightness(0.95)',
  },
  heritage: {
    name: 'Sa Bàn Cổ Sử',
    // Bản đồ địa hình Esri Topo với bộ lọc sa bàn cổ
    baseUrl:
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    filter: 'sepia(0.65) contrast(1.15) brightness(0.85) hue-rotate(-15deg)',
  },
};

export interface TacticalMapProps {
  locations?: HistoricalLocation[];
  onSelectLocation?: (location: HistoricalLocation) => void;
  selectedLocationId?: string;
  activeFilterType?: LocationContentType | 'all';
  activeRarity?: LocationRarity | 'all';
}

export function TacticalHeritageMap({
  locations: propLocations,
  onSelectLocation: propOnSelectLocation,
  selectedLocationId,
  activeFilterType,
  activeRarity,
}: TacticalMapProps = {}) {
  const {
    locations: contextLocations,
    userLocation,
    currentGps,
    setUserLocation,
    setGpsCoordinates,
    setSelectedLocation,
    startArNavigation,
  } = useApp();

  const locations = propLocations || contextLocations;
  const currentUserPos = userLocation || currentGps || { lat: 10.7769, lng: 106.6953 };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const baseLayerRef = useRef<any>(null);
  const overlayLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<MapStyleMode>('satellite');
  const [is3DTilt, setIs3DTilt] = useState<boolean>(false);
  const [activeLoc, setActiveLoc] = useState<HistoricalLocation | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({
    lat: 10.7769,
    lng: 106.6953,
  });

  // Lọc danh sách địa danh theo ô tìm kiếm và filters
  const filteredLocations = useMemo(() => {
    let list = locations;
    if (activeRarity && activeRarity !== 'all') {
      list = list.filter((loc) => loc.rarity === activeRarity);
    }
    if (activeFilterType && activeFilterType !== 'all') {
      list = list.filter((loc) => loc.contentType === activeFilterType);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.address?.toLowerCase().includes(q) ||
        loc.historicalSummary?.toLowerCase().includes(q)
    );
  }, [locations, searchQuery, activeRarity, activeFilterType]);

  // Khởi tạo Leaflet thông qua CDN để tránh lỗi SSR và đảm bảo chạy mượt trên Next.js 16
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const initLeaflet = async () => {
      // Nạp CSS Leaflet nếu chưa có
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Nạp JS Leaflet
      let L = (window as any).L;
      if (!L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
        L = (window as any).L;
      }

      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [currentUserPos.lat, currentUserPos.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Khởi tạo lớp bản đồ mặc định (Vệ tinh thực địa)
      const style = MAP_STYLES[mapMode];
      baseLayerRef.current = L.tileLayer(style.baseUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
      }).addTo(map);

      if (style.overlayUrl) {
        overlayLayerRef.current = L.tileLayer(style.overlayUrl, {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c', 'd'],
          opacity: 0.85,
        }).addTo(map);
      }

      markersLayerRef.current = L.layerGroup().addTo(map);

      // Cập nhật tọa độ con trỏ chuột theo thời gian thực
      map.on('mousemove', (e: any) => {
        setCursorCoords({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5)),
        });
      });

      renderMarkersAndRoutes();
    };

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Đổi chế độ nền bản đồ (Vệ tinh / Tác chiến đêm / Sa bàn cổ)
  useEffect(() => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    const style = MAP_STYLES[mapMode];

    if (baseLayerRef.current) map.removeLayer(baseLayerRef.current);
    if (overlayLayerRef.current) map.removeLayer(overlayLayerRef.current);

    baseLayerRef.current = L.tileLayer(style.baseUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c', 'd'],
    }).addTo(map);

    if (style.overlayUrl) {
      overlayLayerRef.current = L.tileLayer(style.overlayUrl, {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c', 'd'],
        opacity: 0.9,
      }).addTo(map);
    }
  }, [mapMode]);

  // Vẽ các chân ghim phát sáng và đường nối chiến dịch
  const renderMarkersAndRoutes = () => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const group = markersLayerRef.current;
    if (!L || !map || !group) return;

    group.clearLayers();

    // Vẽ đường nối đứt nét màu vàng kim giữa các di tích gần nhau
    const coordsList = filteredLocations.map((loc: any) => [
      loc.coordinates?.lat ?? loc.lat,
      loc.coordinates?.lng ?? loc.lng,
    ]);

    if (coordsList.length > 1) {
      routeLineRef.current = L.polyline(coordsList, {
        color: '#D4AF37',
        weight: 2,
        opacity: 0.45,
        dashArray: '6, 10',
      }).addTo(group);
    }

    // Vẽ từng chân ghim di tích thông minh (Anti-Overlap Beacons)
    filteredLocations.forEach((loc: any) => {
      const lat = loc.coordinates?.lat ?? loc.lat;
      const lng = loc.coordinates?.lng ?? loc.lng;
      if (!lat || !lng) return;

      const isLegendary = loc.rarity === 'legendary' || loc.rarity === 'event';
      const accentColor = isLegendary
        ? '#F59E0B' // Vàng Rồng Huyền Thoại
        : loc.rarity === 'rare'
        ? '#EF4444' // Đỏ Chu Sa Chiến Tích
        : '#10B981'; // Ngọc Lục Bảo Di Sản

      const customIcon = L.divIcon({
        className: 'custom-heritage-beacon',
        html: `
          <div class="beacon-wrapper group ${isLegendary ? 'is-legendary' : ''}">
            <!-- Vòng sóng radar lan tỏa -->
            <span class="pulse-ring" style="border-color: ${accentColor};"></span>
            <span class="pulse-ring delay" style="border-color: ${accentColor};"></span>
            
            <!-- Tâm điểm phát sáng -->
            <div class="beacon-core" style="background: ${accentColor}; box-shadow: 0 0 16px ${accentColor};">
              <div class="beacon-inner-dot"></div>
            </div>

            <!-- Nhãn tên thu gọn, tự động phóng to và nổi lên trên khi hover -->
            <div class="beacon-label">
              <span class="status-dot" style="background: ${accentColor}; box-shadow: 0 0 8px ${accentColor};"></span>
              <span class="label-text">${loc.name}</span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(group);

      marker.on('click', () => {
        setActiveLoc(loc);
        if (propOnSelectLocation) {
          propOnSelectLocation(loc);
        }
        if (setSelectedLocation) {
          setSelectedLocation(loc);
        }
        map.flyTo([lat, lng], 17, {
          animate: true,
          duration: 1.2,
        });
      });
    });
  };

  useEffect(() => {
    renderMarkersAndRoutes();
  }, [filteredLocations]);

  // Recenter map back to user location
  const handleRecenter = () => {
    if (mapInstanceRef.current && currentUserPos.lat && currentUserPos.lng) {
      mapInstanceRef.current.flyTo([currentUserPos.lat, currentUserPos.lng], 16, {
        animate: true,
        duration: 1.2,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#070C15] overflow-hidden select-none font-sans">
      {/* CSS nội tuyến cho hiệu ứng Beacon, Sóng Radar & Góc nghiêng 3D */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .leaflet-container {
          background: #070c15 !important;
          font-family: inherit;
        }
        .leaflet-tile-pane {
          filter: ${MAP_STYLES[mapMode].filter};
          transition: filter 0.5s ease;
        }
        .map-3d-tilt {
          transform: perspective(1400px) rotateX(28deg) scale(1.18);
          transform-origin: center 65%;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .map-flat {
          transform: none;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .beacon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          cursor: pointer;
        }
        .pulse-ring {
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          border: 2px solid #f59e0b;
          animation: radarPulse 2.4s infinite ease-out;
          pointer-events: none;
        }
        .pulse-ring.delay {
          animation-delay: 1.2s;
        }
        @keyframes radarPulse {
          0% {
            transform: scale(0.45);
            opacity: 0.95;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .beacon-core {
          position: relative;
          z-index: 10;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease;
        }
        .beacon-wrapper:hover .beacon-core {
          transform: scale(1.35);
        }
        .beacon-inner-dot {
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #ffffff;
        }
        .beacon-label {
          position: absolute;
          left: 26px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 9999px;
          background: rgba(11, 19, 32, 0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.65);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65),
            0 0 12px rgba(212, 175, 55, 0.2);
          white-space: nowrap;
          transition: all 0.25s ease;
          z-index: 20;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.95);
        }
        .beacon-wrapper:hover .beacon-label,
        .beacon-wrapper.is-legendary .beacon-label {
          opacity: 1;
          pointer-events: auto;
          background: rgba(20, 32, 54, 0.98);
          border-color: #fbbf24;
          transform: translateY(-3px) scale(1.06);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.85),
            0 0 18px rgba(251, 191, 36, 0.55);
          z-index: 9999 !important;
        }
        .leaflet-marker-icon:hover {
          z-index: 9999 !important;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 9999px;
        }
        .label-text {
          color: #f8fafc;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
      `,
        }}
      />

      {/* Khung chứa Bản đồ chính */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full ${is3DTilt ? 'map-3d-tilt' : 'map-flat'}`}
      />

      {/* Lớp phủ Hiệu ứng Viền Tác Chiến (Tactical Vignette & Lưới Tọa Độ Mờ) */}
      <div
        className="pointer-events-none absolute inset-0 z-[400]"
        style={{
          background:
            'radial-gradient(circle at center, transparent 55%, rgba(7, 12, 21, 0.75) 100%)',
        }}
      />

      {/* Thanh Tìm kiếm & Bộ chuyển đổi Chế độ Bản đồ (Góc trên) */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Ô tìm kiếm */}
        <div className="pointer-events-auto relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm di tích trên toàn quốc..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-[#0B1320]/90 backdrop-blur-md border border-amber-500/40 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-[0_0_20px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Cụm nút Chọn lớp bản đồ Vệ Tinh / Tác Chiến / 3D */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0B1320]/90 backdrop-blur-md p-1 rounded-full border border-amber-500/30 shadow-xl">
          {(['satellite', 'tactical', 'heritage'] as MapStyleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setMapMode(mode)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
                mapMode === mode
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{MAP_STYLES[mode].name}</span>
            </button>
          ))}

          <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

          <button
            onClick={() => setIs3DTilt(!is3DTilt)}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
              is3DTilt
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Bật/Tắt góc nghiêng sa bàn 3D"
          >
            <Compass className="w-3 h-3" />
            <span>3D Sa Bàn</span>
          </button>
        </div>
      </div>

      {/* Floating Center Map Button */}
      <div className="absolute right-4 bottom-16 z-[500] pointer-events-auto">
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl bg-[#0B1422]/90 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-xl backdrop-blur-md hover:border-amber-400 active:scale-95 transition-all"
          title="Đưa tâm bản đồ về vị trí người chơi"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>

      {/* HUD Trạng thái Radar & Tọa độ Thời gian thực (Góc dưới trái) */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] flex items-center gap-2.5 bg-[#0B1320]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/25 text-[11px] text-slate-300">
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <Radio className="w-3 h-3 animate-pulse" />
          VỆ TINH ĐÃ KẾT NỐI
        </span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-amber-300/90 text-[10px]">
          LAT: {cursorCoords.lat}° N — LNG: {cursorCoords.lng}° E
        </span>
        <span className="text-slate-600">|</span>
        <span>{filteredLocations.length} Điểm Di Sản</span>
      </div>

      {/* Thẻ Chi Tiết Thực Địa Nổi (Hiện ra khi click vào một di tích) */}
      {activeLoc && (
        <div className="absolute bottom-5 right-5 z-[500] w-96 max-w-[calc(100vw-40px)] rounded-3xl bg-[#0B1320]/95 backdrop-blur-xl border-2 border-amber-500/50 shadow-[0_15px_45px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {activeLoc.imageUrl && (
            <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
              <img
                src={activeLoc.imageUrl}
                alt={activeLoc.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-black/20 to-black/40" />
              <button
                onClick={() => setActiveLoc(null)}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          <div className="p-4 border-b border-amber-500/20 flex items-start justify-between gap-2 bg-gradient-to-r from-amber-500/10 to-transparent">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-1.5">
                <Sparkles className="w-3 h-3" />
                {activeLoc.rarity ? activeLoc.rarity.toUpperCase() : 'DI TÍCH QUỐC GIA'}
              </span>
              <h3 className="text-base font-bold text-white leading-snug">
                {activeLoc.name}
              </h3>
              {activeLoc.address && (
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400/70 shrink-0" />
                  <span className="truncate">{activeLoc.address}</span>
                </p>
              )}
            </div>
            {!activeLoc.imageUrl && (
              <button
                onClick={() => setActiveLoc(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/5"
              >
                ✕ Đóng
              </button>
            )}
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {activeLoc.historicalSummary ||
                (activeLoc as any).description ||
                'Địa danh lịch sử gắn liền với những ký ức hào hùng của dân tộc. Hãy dịch chuyển tới thực địa để mở khóa thước phim nhân chứng và giải mã câu chuyện.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  const lat = activeLoc.coordinates?.lat ?? (activeLoc as any).lat;
                  const lng = activeLoc.coordinates?.lng ?? (activeLoc as any).lng;
                  if (lat && lng) {
                    if (setUserLocation) setUserLocation({ lat, lng });
                    if (setGpsCoordinates) setGpsCoordinates({ lat, lng });
                  }
                  if (setSelectedLocation) {
                    setSelectedLocation(activeLoc);
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Dịch Chuyển & Khám Phá</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {startArNavigation && (
                <button
                  onClick={() => startArNavigation(activeLoc)}
                  className="py-2.5 px-3.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold hover:border-amber-400 hover:bg-amber-500/10 active:scale-95 transition flex items-center gap-1.5"
                  title="Dẫn đường AR"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>AR</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TacticalHeritageMap;
