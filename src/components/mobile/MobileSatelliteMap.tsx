// src/components/mobile/MobileSatelliteMap.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Layers, LocateFixed, Navigation, Sparkles, Volume2, ScanEye, BookOpen, PlusCircle } from 'lucide-react';
import { calculateDistance, calculateBearing, formatDistance } from '@/utils/geo';

import confetti from 'canvas-confetti';

export type CompanionAvatarType = 'pikachu' | 'soldier' | 'scholar' | 'dragon' | 'bird';
export type MapLayerType = 'satellite' | 'night' | 'ancient';

export interface HeritageMapLocation {
  id: string;
  name: string;
  era: string;
  rarity: 'legendary' | 'rare' | 'uncommon';
  contentType: 'battlefield' | 'landmark' | 'witness';
  coordinates: { lat: number; lng: number };
  summary: string;
  /** Logo lớn hiển thị trên bản đồ (Admin có thể tải lên) */
  customLogoUrl?: string;
  defaultEmblemEmoji: string;
  witnessName?: string;
  witnessRole?: string;
  witnessTranscript?: string;
}

interface MobileSatelliteMapProps {
  locations: HeritageMapLocation[];
  selectedLocation: HeritageMapLocation;
  onSelectLocation: (loc: HeritageMapLocation) => void;
  userGps: { lat: number; lng: number };
  onUpdateUserGps: (coords: { lat: number; lng: number }, heading?: number) => void;
  isMoving: boolean;
  companionType: CompanionAvatarType;
  isAdmin: boolean;
  onOpenAdminLogoModal: (loc: HeritageMapLocation) => void;
  onOpenARNavigation: () => void;
  onOpenStory: () => void;
  onPlayWitnessAudio: (loc: HeritageMapLocation) => void;
}

const TILE_LAYERS: Record<MapLayerType, { name: string; url: string; filter?: string }> = {
  satellite: {
    name: 'Vệ Tinh Thực Địa',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  night: {
    name: 'Tác Chiến Đêm',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  },
  ancient: {
    name: 'Sa Bàn Cổ Sử',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    filter: 'sepia(55%) contrast(105%) brightness(85%)',
  },
};

const COMPANION_CONFIG: Record<CompanionAvatarType, { name: string; spriteUrl: string; auraColor: string }> = {
  pikachu: {
    name: 'Pikachu Thám Hiểm',
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
    auraColor: 'rgba(250, 204, 21, 0.75)',
  },
  soldier: {
    name: 'Chiến Sĩ Giải Phóng',
    spriteUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=VietnamHero&backgroundColor=b6e3f4',
    auraColor: 'rgba(16, 185, 129, 0.75)',
  },
  scholar: {
    name: 'Sứ Giả Đông Sơn',
    spriteUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=LegacyKeeper&backgroundColor=ffdfbf',
    auraColor: 'rgba(212, 175, 55, 0.75)',
  },
  dragon: {
    name: 'Rồng Con Lạc Việt',
    spriteUrl: 'https://api.dicebear.com/9.x/bottts/svg?seed=DragonVN&backgroundColor=ffd5dc',
    auraColor: 'rgba(239, 68, 68, 0.75)',
  },
  bird: {
    name: 'Chim Lạc Đông Sơn',
    spriteUrl: 'https://api.dicebear.com/9.x/icons/svg?seed=ChimLac&backgroundColor=fef08a',
    auraColor: 'rgba(245, 158, 11, 0.75)',
  },
};

export const MobileSatelliteMap: React.FC<MobileSatelliteMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  userGps,
  onUpdateUserGps,
  isMoving,
  companionType,
  isAdmin,
  onOpenAdminLogoModal,
  onOpenARNavigation,
  onOpenStory,
  onPlayWitnessAudio,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const playerMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  const locationMarkersRef = useRef<any[]>([]);

  const [mapStyle, setMapStyle] = useState<MapLayerType>('satellite');
  const [gpsTrackingActive, setGpsTrackingActive] = useState<boolean>(false);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);

  const distanceToTarget = calculateDistance(userGps, selectedLocation.coordinates);
  const bearingToTarget = Math.round(calculateBearing(userGps, selectedLocation.coordinates));

  // Hiệu ứng pháo hoa chúc mừng khi người chơi bước chân vào bán kính 50m
  const hasTriggeredArrivalRef = useRef<string | null>(null);
  useEffect(() => {
    if (distanceToTarget <= 50 && hasTriggeredArrivalRef.current !== selectedLocation.id) {
      hasTriggeredArrivalRef.current = selectedLocation.id;
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#8B2626', '#10B981', '#F59E0B'],
      });
    } else if (distanceToTarget > 60) {
      hasTriggeredArrivalRef.current = null;
    }
  }, [distanceToTarget, selectedLocation.id]);

  // 1. Nạp Leaflet CSS & JS an toàn trên Client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 2. Khởi tạo Bản đồ Vệ tinh Thực địa
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;

    const map = L.map(mapContainerRef.current, {
      center: [userGps.lat, userGps.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    tileLayerRef.current = L.tileLayer(TILE_LAYERS[mapStyle].url, {
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletLoaded]);

  // 3. Chuyển đổi lớp bản đồ (Vệ tinh / Đêm / Cổ sử)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_LAYERS[mapStyle].url);
    if (mapContainerRef.current) {
      const tilePane = mapContainerRef.current.querySelector('.leaflet-tile-pane') as HTMLElement;
      if (tilePane) {
        tilePane.style.filter = TILE_LAYERS[mapStyle].filter || 'none';
      }
    }
  }, [mapStyle]);

  // 4. Vẽ các LOGO ĐỊA DANH / ANH HÙNG KHỔNG LỒ CÓ ANIMATION trên Bản đồ
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    locationMarkersRef.current.forEach((m) => m.remove());
    locationMarkersRef.current = [];

    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocation.id;
      const borderColor = loc.rarity === 'legendary' ? '#D4AF37' : '#38BDF8';

      // Tạo HTML Marker To Đùng + Hiệu ứng xoay sáng + Logo Riêng của từng Địa danh
      const customHtml = `
        <div class="relative flex flex-col items-center justify-center group" style="width: 96px; height: 110px; transform: translate(-28px, -65px);">
          <!-- Vòng hào quang Trống Đồng xoay bên dưới -->
          <div class="absolute w-20 h-20 rounded-full animate-ping opacity-30" style="background: radial-gradient(circle, ${borderColor} 0%, transparent 70%);"></div>
          
          <!-- Khung Logo Địa danh Cỡ lớn (Nổi lên mặt bản đồ) -->
          <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-300 ${
            isSelected ? 'scale-125 ring-4 ring-[#D4AF37]' : 'hover:scale-110'
          }" style="background: linear-gradient(135deg, #0B1320 0%, #8B2626 100%); border: 2.5px solid ${borderColor}; animation: floatBookmark 3s ease-in-out infinite;">
            ${
              loc.customLogoUrl
                ? `<img src="${loc.customLogoUrl}" alt="${loc.name}" class="w-12 h-12 object-contain drop-shadow-lg" />`
                : `<span style="font-size: 30px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.6));">${loc.defaultEmblemEmoji}</span>`
            }
            <span class="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-[#D4AF37] text-[#0B1320] shadow">
              ${loc.rarity === 'legendary' ? '★ SSR' : 'SR'}
            </span>
          </div>

          <!-- Bảng tên Địa danh nổi bật -->
          <div class="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#070C15]/95 border border-[#D4AF37] text-white text-[10px] font-bold whitespace-nowrap shadow-lg">
            ${loc.name}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'custom-heritage-giant-marker',
        iconSize: [40, 40],
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => {
          onSelectLocation(loc);
          map.flyTo([loc.coordinates.lat, loc.coordinates.lng], 17, { duration: 1.2 });
        });

      locationMarkersRef.current.push(marker);
    });
  }, [leafletLoaded, locations, selectedLocation, onSelectLocation]);

  // 5. Vẽ Nhân vật Đồng hành (Pikachu / Chiến sĩ đang bước đi) + Đường dẫn Chỉ đường tới Đích
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const companion = COMPANION_CONFIG[companionType];

    const avatarHtml = `
      <div class="relative flex flex-col items-center justify-center" style="width: 72px; height: 72px; transform: translate(-22px, -36px);">
        <!-- Vòng sóng định vị dưới chân nhân vật -->
        <div class="absolute bottom-2 w-12 h-5 rounded-full animate-pulse" style="background: ${companion.auraColor}; filter: blur(4px);"></div>
        
        <!-- Nhân vật bước đi nhún nhảy khi di chuyển -->
        <div class="relative z-10 transition-transform ${isMoving ? 'animate-bounce' : ''}">
          <img src="${companion.spriteUrl}" alt="${companion.name}" class="w-14 h-14 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />
        </div>

        <span class="px-2 py-0.5 rounded-full bg-emerald-500 text-[#070C15] text-[9px] font-extrabold uppercase shadow">
          ${isMoving ? 'Đang bước đi...' : 'Vị trí của bạn'}
        </span>
      </div>
    `;

    const playerIcon = L.divIcon({
      html: avatarHtml,
      className: 'custom-player-walking-avatar',
      iconSize: [28, 28],
    });

    if (!playerMarkerRef.current) {
      playerMarkerRef.current = L.marker([userGps.lat, userGps.lng], {
        icon: playerIcon,
        zIndexOffset: 1000,
      }).addTo(map);
    } else {
      playerMarkerRef.current.setLatLng([userGps.lat, userGps.lng]);
      playerMarkerRef.current.setIcon(playerIcon);
    }

    // Vẽ đường dẫn chỉ hướng (Polyline nét đứt chuyển động) từ Người dùng -> Địa danh đang chọn
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }
    routeLineRef.current = L.polyline(
      [
        [userGps.lat, userGps.lng],
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
      ],
      {
        color: '#D4AF37',
        weight: 4,
        dashArray: '10, 10',
        opacity: 0.9,
      }
    ).addTo(map);
  }, [leafletLoaded, userGps, selectedLocation, isMoving, companionType]);

  // 6. Định vị GPS Thực tế chính xác của Điện thoại (navigator.geolocation.watchPosition)
  const toggleRealGpsTracking = () => {
    if (!('geolocation' in navigator)) {
      alert('Thiết bị của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setGpsTrackingActive(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        onUpdateUserGps(coords, pos.coords.heading || 0);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 17, { duration: 1.5 });
        }
      },
      (err) => {
        console.warn('Không lấy được GPS thực:', err.message);
        setGpsTrackingActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Keyframes cho hiệu ứng Logo Địa danh lơ lửng */}
      <style jsx global>{`
        @keyframes floatBookmark {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
      `}</style>

      {/* BẢN ĐỒ VỆ TINH THỰC TẾ LEAFLET FULL-SCREEN */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full bg-[#080E1A]" />

      {/* THANH CÔNG CỤ TRÊN BẢN ĐỒ: Đổi lớp Vệ tinh + Định vị GPS Thật + Chỉ dẫn Đường đi */}
      <div className="relative z-20 px-3 pt-2 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Chuyển đổi 3 lớp Bản đồ giống hệt trên PC */}
          <div className="flex items-center gap-1 bg-[#070C15]/90 p-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-md shadow-lg">
            {(['satellite', 'night', 'ancient'] as MapLayerType[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setMapStyle(mode)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  mapStyle === mode
                    ? 'bg-[#D4AF37] text-[#0B1320] shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {TILE_LAYERS[mode].name}
              </button>
            ))}
          </div>

          {/* Nút Bắt vị trí GPS Thực tế của Điện thoại */}
          <button
            onClick={toggleRealGpsTracking}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-lg transition-all ${
              gpsTrackingActive
                ? 'bg-emerald-500 text-[#070C15] border-white'
                : 'bg-[#070C15]/90 text-emerald-400 border-emerald-400/50'
            }`}
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>GPS Thật</span>
          </button>
        </div>

        {/* BẢNG CHỈ DẪN ĐƯỜNG ĐI TỚI ĐỊA DANH ĐANG CHỌN */}
        <div className="pointer-events-auto self-start px-3 py-1.5 rounded-2xl bg-[#070C15]/90 border border-[#D4AF37]/50 backdrop-blur-md flex items-center gap-2.5 shadow-xl">
          <Navigation
            className="w-4 h-4 text-[#D4AF37] shrink-0"
            style={{ transform: `rotate(${bearingToTarget}deg)` }}
          />
          <div className="text-[11px]">
            <span className="text-gray-300">Chỉ dẫn tới </span>
            <strong className="text-[#D4AF37]">{selectedLocation.name}</strong>
            <span className="ml-2 font-mono text-emerald-400 font-bold">
              {formatDistance(distanceToTarget)} • Hướng {bearingToTarget}°
            </span>
          </div>
        </div>
      </div>

      {/* PANEL ĐỊA DANH DƯỚI ĐÁY + NÚT ADMIN TẢI LÊN LOGO ĐỘNG */}
      <div className="relative z-20 mx-3 mb-2 p-3.5 rounded-3xl bg-gradient-to-b from-[#131F33]/95 to-[#0B1320]/98 backdrop-blur-xl border border-[#D4AF37]/50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          {/* Logo động cỡ lớn của địa danh */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B2626] to-[#0B1320] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-lg">
            {selectedLocation.customLogoUrl ? (
              <img
                src={selectedLocation.customLogoUrl}
                alt={selectedLocation.name}
                className="w-11 h-11 object-contain"
              />
            ) : (
              <span className="text-3xl">{selectedLocation.defaultEmblemEmoji}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                {selectedLocation.era}
              </span>
              {isAdmin && (
                <button
                  onClick={() => onOpenAdminLogoModal(selectedLocation)}
                  className="px-2 py-0.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  Đổi Logo Map (Admin)
                </button>
              )}
            </div>
            <h3 className="font-['Cinzel',serif] text-base font-bold text-white truncate">
              {selectedLocation.name}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-1">{selectedLocation.summary}</p>
          </div>
        </div>

        {/* 3 Nút Tương tác: Chỉ đường AR, Nghe TTS, Giải Mã */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={onOpenARNavigation}
            className="py-2.5 px-2 rounded-xl bg-[#D4AF37] text-[#0B1320] font-bold text-xs flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(212,175,55,0.45)] active:scale-95"
          >
            <ScanEye className="w-4 h-4" />
            <span>Chỉ Đường AR</span>
          </button>

          <button
            onClick={() => onPlayWitnessAudio(selectedLocation)}
            className="py-2.5 px-2 rounded-xl bg-[#8B2626] text-white font-bold text-xs flex items-center justify-center gap-1 border border-[#D4AF37]/50 active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Nghe TTS</span>
          </button>

          <button
            onClick={onOpenStory}
            className="py-2.5 px-2 rounded-xl bg-[#16243B] text-white font-bold text-xs flex items-center justify-center gap-1 border border-[#D4AF37]/40 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Thu Thập</span>
          </button>
        </div>
      </div>
    </div>
  );
};
