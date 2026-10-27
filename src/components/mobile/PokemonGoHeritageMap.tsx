// src/components/mobile/PokemonGoHeritageMap.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  ScanEye,
  LocateFixed,
  Sparkles,
  CornerUpRight,
  ArrowUp,
  Gift,
  PlusCircle,
} from 'lucide-react';
import { calculateDistance, calculateBearing, calculateDeltaAngle, formatDistance } from '@/utils/geo';
import { HeritageMapLocation, CompanionAvatarType } from './MobileSatelliteMap';
import { SpawnedLootItem } from '@/data/wartimeLoot';

interface PokemonGoHeritageMapProps {
  locations: HeritageMapLocation[];
  selectedLocation: HeritageMapLocation;
  onSelectLocation: (loc: HeritageMapLocation) => void;
  userGps: { lat: number; lng: number };
  playerHeading: number;
  isMoving: boolean;
  companionType: CompanionAvatarType;
  spawnedLoots: SpawnedLootItem[];
  onCollectLoot: (loot: SpawnedLootItem) => void;
  onForceSpawnLoot: () => void;
  voiceNavEnabled: boolean;
  onToggleVoiceNav: () => void;
  onOpenARMode: () => void;
  isAdmin: boolean;
  onOpenAdminLogoModal: (loc: HeritageMapLocation) => void;
}

const COMPANION_SPRITES: Record<CompanionAvatarType, string> = {
  pikachu:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
  soldier:
    'https://api.dicebear.com/9.x/adventurer/svg?seed=VietnamHero&backgroundColor=b6e3f4',
  scholar:
    'https://api.dicebear.com/9.x/adventurer/svg?seed=LegacyKeeper&backgroundColor=ffdfbf',
  dragon:
    'https://api.dicebear.com/9.x/bottts/svg?seed=DragonVN&backgroundColor=ffd5dc',
  bird:
    'https://api.dicebear.com/9.x/icons/svg?seed=ChimLac&backgroundColor=fef08a',
};

export const PokemonGoHeritageMap: React.FC<PokemonGoHeritageMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  userGps,
  playerHeading,
  isMoving,
  companionType,
  spawnedLoots,
  onCollectLoot,
  onForceSpawnLoot,
  voiceNavEnabled,
  onToggleVoiceNav,
  onOpenARMode,
  isAdmin,
  onOpenAdminLogoModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const lootMarkersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null);

  const [leafletReady, setLeafletReady] = useState(false);
  const [mapMode, setMapMode] = useState<'pokemongo' | 'satellite'>('pokemongo');
  const tileLayerRef = useRef<any>(null);

  const distanceMeters = Math.round(calculateDistance(userGps, selectedLocation.coordinates));
  const bearing = Math.round(calculateBearing(userGps, selectedLocation.coordinates));
  const deltaAngle = Math.round(calculateDeltaAngle(bearing, playerHeading));

  // Xác định câu lệnh chỉ đường kiểu Google Maps
  const getTurnInstruction = () => {
    if (distanceMeters <= 20) return `Đã đến ${selectedLocation.name}! Hãy mở Ống ngắm AR.`;
    if (Math.abs(deltaAngle) <= 25) return `Đi thẳng ${distanceMeters}m về phía ${selectedLocation.name}`;
    if (deltaAngle > 25) return `Rẽ phải ${Math.abs(deltaAngle)}° rồi tiến thẳng ${distanceMeters}m`;
    return `Rẽ trái ${Math.abs(deltaAngle)}° rồi tiến thẳng ${distanceMeters}m`;
  };

  // 1. Nạp Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).L) {
      setLeafletReady(true);
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.body.appendChild(script);
  }, []);

  // 2. Khởi tạo Map ở tâm vị trí người chơi
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;

    const map = L.map(mapContainerRef.current, {
      center: [userGps.lat, userGps.lng],
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
    });

    tileLayerRef.current = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19 }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletReady]);

  // 3. Đổi sang lớp Vệ tinh hoặc lớp Đường phố Pokémon GO rực rỡ
  useEffect(() => {
    if (!tileLayerRef.current) return;
    if (mapMode === 'satellite') {
      tileLayerRef.current.setUrl(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      );
    } else {
      tileLayerRef.current.setUrl(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      );
    }
  }, [mapMode]);

  // 4. Luôn đưa tâm bản đồ đi theo bước chân người chơi + Vẽ đường dẫn vàng kim
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    map.panTo([userGps.lat, userGps.lng], { animate: true, duration: 0.5 });

    if (routeLineRef.current) routeLineRef.current.remove();
    routeLineRef.current = L.polyline(
      [
        [userGps.lat, userGps.lng],
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
      ],
      {
        color: '#00E5FF',
        weight: 6,
        dashArray: '12, 10',
        opacity: 0.9,
      }
    ).addTo(map);
  }, [leafletReady, userGps, selectedLocation]);

  // 5. Vẽ các Trụ Di Tích (PokéStop / Gym 3D đứng thẳng trên mặt bản đồ nghiêng)
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocation.id;
      const html = `
        <div class="pokestop-3d-stand flex flex-col items-center justify-center" style="width: 96px; height: 120px; transform: translate(-32px, -85px) rotateX(-55deg);">
          <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.85)] ${
            isSelected ? 'scale-125 ring-4 ring-cyan-400' : ''
          }" style="background: linear-gradient(135deg, #0B1320 0%, #8B2626 100%); border: 3px solid #D4AF37; animation: pokestopFloat 2.6s ease-in-out infinite;">
            ${
              loc.customLogoUrl
                ? `<img src="${loc.customLogoUrl}" class="w-12 h-12 object-contain" />`
                : `<span style="font-size: 32px;">${loc.defaultEmblemEmoji}</span>`
            }
          </div>
          <!-- Chân đế PokéStop tỏa sóng dưới mặt đường -->
          <div class="w-4 h-6 bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
          <div class="px-2.5 py-0.5 rounded-full bg-[#070C15]/95 border border-[#D4AF37] text-white text-[10px] font-extrabold whitespace-nowrap shadow-xl">
            ${loc.name}
          </div>
        </div>
      `;

      const icon = L.divIcon({ html, className: 'pokestop-heritage-icon', iconSize: [32, 32] });
      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon })
        .addTo(map)
        .on('click', () => onSelectLocation(loc));

      markersRef.current.push(marker);
    });
  }, [leafletReady, locations, selectedLocation, onSelectLocation]);

  // 6. Vẽ các Vật Phẩm "Bức Thư Thời Chiến" rớt trên mặt đường (Bấm vào để nhặt!)
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    lootMarkersRef.current.forEach((m) => m.remove());
    lootMarkersRef.current = [];

    spawnedLoots.forEach((loot) => {
      const html = `
        <div class="flex flex-col items-center justify-center cursor-pointer" style="width: 76px; height: 84px; transform: translate(-24px, -55px) rotateX(-55deg);">
          <div class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 border-2 border-white flex items-center justify-center shadow-[0_0_25px_#FACC15] animate-bounce">
            <span style="font-size: 24px;">${loot.artifact.icon}</span>
            <span class="absolute -top-1 -right-1 px-1 rounded-full bg-[#8B2626] text-white text-[8px] font-bold">MỚI!</span>
          </div>
          <span class="mt-1 px-2 py-0.5 rounded-full bg-amber-950/95 border border-amber-400 text-amber-200 text-[9px] font-bold whitespace-nowrap">
            Chạm để nhặt!
          </span>
        </div>
      `;

      const icon = L.divIcon({ html, className: 'loot-drop-icon', iconSize: [28, 28] });
      const marker = L.marker([loot.coordinates.lat, loot.coordinates.lng], {
        icon,
        zIndexOffset: 2000,
      })
        .addTo(map)
        .on('click', () => onCollectLoot(loot));

      lootMarkersRef.current.push(marker);
    });
  }, [leafletReady, spawnedLoots, onCollectLoot]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#06101E] flex flex-col justify-between">
      <style jsx global>{`
        @keyframes pokestopFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes radarPulseRing {
          0% { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        /* Hiệu ứng bão hòa màu rực rỡ kiểu Pokémon GO cho bản đồ đường phố */
        .pokemongo-road-theme .leaflet-tile-pane {
          filter: saturate(1.85) hue-rotate(-12deg) contrast(1.08);
        }
      `}</style>

      {/* 1. VÒM TRỜI CHÂN TRỜI POKÉMON GO (SKY DOME HORIZON) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-44 z-10 bg-gradient-to-b from-[#071B34] via-[#133B5C]/80 to-transparent" />

      {/* 2. MẶT PHẲNG BẢN ĐỒ NGHIÊNG 3D (PERSPECTIVE 58 ĐỘ) */}
      <div
        className={`absolute inset-0 z-0 flex items-center justify-center overflow-hidden ${
          mapMode === 'pokemongo' ? 'pokemongo-road-theme' : ''
        }`}
        style={{ perspective: '850px' }}
      >
        <div
          ref={mapContainerRef}
          className="w-[155%] h-[155%] -mt-16 transition-transform duration-500"
          style={{
            transform: 'rotateX(55deg)',
            transformOrigin: 'center 60%',
          }}
        />
      </div>

      {/* 3. NHÂN VẬT PIKACHU / CHIẾN SĨ ĐỨNG GIỮA MÀN HÌNH 3D + VÒNG SÓNG RADAR DƯỚI CHÂN */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-14">
        <div className="relative flex flex-col items-center justify-center">
          {/* Vòng tròn Radar Pokémon GO tỏa rộng dưới mặt đất */}
          <div
            className="absolute w-32 h-32 rounded-full border-2 border-cyan-400/70"
            style={{
              transform: 'rotateX(65deg)',
              animation: 'radarPulseRing 2.4s ease-out infinite',
            }}
          />
          <div
            className="w-24 h-10 rounded-full bg-cyan-400/20 border border-cyan-300/60"
            style={{ transform: 'rotateX(65deg)' }}
          />

          {/* Nhân vật bước đi nhún nhảy */}
          <div className={`relative -mt-14 transition-transform ${isMoving ? 'animate-bounce' : ''}`}>
            <img
              src={COMPANION_SPRITES[companionType] || COMPANION_SPRITES.pikachu}
              alt="Companion"
              className="w-16 h-16 object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.85)]"
            />
          </div>
        </div>
      </div>

      {/* 4. THANH CHỈ ĐƯỜNG GOOGLE MAPS (TURN-BY-TURN TOP BANNER) + LOA GIỌNG NÓI */}
      <div className="relative z-20 mx-3 mt-2 space-y-2">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-[#064E3B]/95 via-[#065F46]/95 to-[#047857]/95 backdrop-blur-xl border-2 border-emerald-400/60 shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/25">
            {Math.abs(deltaAngle) <= 25 ? (
              <ArrowUp className="w-6 h-6 text-white animate-pulse" />
            ) : (
              <CornerUpRight
                className="w-6 h-6 text-amber-300"
                style={{ transform: deltaAngle < 0 ? 'scaleX(-1)' : undefined }}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                Dẫn Đường Giọng Nói • Hướng {bearing}°
              </span>
            </div>
            <p className="text-xs font-extrabold text-white truncate">{getTurnInstruction()}</p>
          </div>

          {/* Nút Bật/Tắt Voice Hướng dẫn tự động kiểu Google Maps */}
          <button
            onClick={onToggleVoiceNav}
            className={`px-2.5 py-2 rounded-xl text-[10px] font-extrabold flex items-center gap-1 border transition-all shrink-0 ${
              voiceNavEnabled
                ? 'bg-[#D4AF37] text-[#0B1320] border-white shadow-md'
                : 'bg-black/40 text-gray-300 border-white/20'
            }`}
          >
            {voiceNavEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{voiceNavEnabled ? 'Voice BẬT' : 'Voice TẮT'}</span>
          </button>
        </div>

        {/* Hàng nút chuyển Chế độ Map Pokémon GO / Vệ tinh & Thử vận may rớt Thư Thời Chiến */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-[#070C15]/85 p-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-md">
            <button
              onClick={() => setMapMode('pokemongo')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                mapMode === 'pokemongo' ? 'bg-cyan-400 text-[#070C15]' : 'text-gray-300'
              }`}
            >
              🎮 Map 3D Pokémon
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                mapMode === 'satellite' ? 'bg-[#D4AF37] text-[#070C15]' : 'text-gray-300'
              }`}
            >
              🛰️ Vệ Tinh 3D
            </button>
          </div>

          <button
            onClick={onForceSpawnLoot}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-[#8B2626] text-white text-[10px] font-extrabold border border-amber-300 shadow-lg flex items-center gap-1 active:scale-95"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Dò Thư Thời Chiến ({spawnedLoots.length})</span>
          </button>
        </div>
      </div>

      {/* 5. DOCK ĐIỀU KHIỂN POKÉMON GO DƯỚI ĐÁY */}
      <div className="relative z-20 mx-3 mb-2 p-3 rounded-3xl bg-[#070C15]/92 backdrop-blur-xl border border-[#D4AF37]/50 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B2626] to-[#0B1320] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 text-2xl">
            {selectedLocation.customLogoUrl ? (
              <img src={selectedLocation.customLogoUrl} className="w-9 h-9 object-contain" />
            ) : (
              selectedLocation.defaultEmblemEmoji
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-cyan-400">
                Cách {formatDistance(distanceMeters)}
              </span>
              {isAdmin && (
                <button
                  onClick={() => onOpenAdminLogoModal(selectedLocation)}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]"
                >
                  + Logo Admin
                </button>
              )}
            </div>
            <h3 className="font-['Cinzel',serif] text-sm font-bold text-white truncate">
              {selectedLocation.name}
            </h3>
            <p className="text-[11px] text-amber-200/90 truncate">
              {spawnedLoots.length > 0
                ? `✨ Có ${spawnedLoots.length} Bức thư thời chiến đang rơi quanh bạn!`
                : 'Hãy bước đi hoặc bật AR để dò tìm kỷ vật thời chiến'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenARMode}
          className="shrink-0 px-4 py-3 rounded-2xl bg-gradient-to-tr from-cyan-400 via-[#D4AF37] to-amber-300 text-[#070C15] font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(34,211,238,0.6)] active:scale-95"
        >
          <ScanEye className="w-4 h-4" />
          <span>Vừa Đi Vừa Quét AR</span>
        </button>
      </div>
    </div>
  );
};
