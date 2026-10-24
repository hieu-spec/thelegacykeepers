'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { HistoricalLocation, LocationRarity, LocationContentType } from '@/types/location';
import {
  Compass,
  Plus,
  Minus,
  LocateFixed,
  Sparkles,
  Flame,
  Flag,
  Landmark,
  Radio,
  Swords,
  Scroll,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface TacticalMapProps {
  locations: HistoricalLocation[];
  onSelectLocation: (location: HistoricalLocation) => void;
  selectedLocationId?: string;
  activeFilterType: LocationContentType | 'all';
  activeRarity: LocationRarity | 'all';
}

// Center reference point for Saigon Map (Bến Nhà Rồng / Sông Sài Gòn)
const MAP_CENTER = {
  lat: 10.772,
  lng: 106.698,
};

// Map scale: pixels per degree of latitude/longitude
const LAT_SCALE = 24000;
const LNG_SCALE = 24000;

export const TacticalHeritageMap: React.FC<TacticalMapProps> = ({
  locations,
  onSelectLocation,
  selectedLocationId,
  activeFilterType,
  activeRarity,
}) => {
  const { currentGps, getLocationProximity } = useApp();

  // Pan & Zoom State
  const [zoom, setZoom] = useState<number>(1.1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = useState<number>(200);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMapWidth(Math.min(window.innerWidth / 2, 220));
    }
  }, []);

  // Convert GPS Coordinates to Canvas Map Coordinates
  const coordToMapPoint = useCallback(
    (lat: number, lng: number) => {
      // 0,0 is center of map
      const x = (lng - MAP_CENTER.lng) * LNG_SCALE * zoom + pan.x;
      // Invert Y for screen coordinates (North is up)
      const y = -(lat - MAP_CENTER.lat) * LAT_SCALE * zoom + pan.y;
      return { x, y };
    },
    [zoom, pan]
  );

  // Center on user GPS position on mount or when teleporting
  const centerOnUser = useCallback(() => {
    // Reset pan so currentGps is centered
    const targetX = -(currentGps.lng - MAP_CENTER.lng) * LNG_SCALE * zoom;
    const targetY = (currentGps.lat - MAP_CENTER.lat) * LAT_SCALE * zoom;
    setPan({ x: targetX, y: targetY });
  }, [currentGps, zoom]);

  useEffect(() => {
    centerOnUser();
  }, [currentGps.lat, currentGps.lng]);

  // Touch & Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 2.4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.65));

  // User position in map pixels
  const userMapPos = coordToMapPoint(currentGps.lat, currentGps.lng);

  return (
    <div
      ref={mapContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full relative overflow-hidden bg-[#070D18] cursor-grab active:cursor-grabbing select-none"
    >
      {/* MAP BACKGROUND CANVAS: Sông Sài Gòn & Tuyến Đường Lịch Sử */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* River Water Gradient */}
          <linearGradient id="saigonRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B2F4A" />
            <stop offset="50%" stopColor="#093C61" />
            <stop offset="100%" stopColor="#072439" />
          </linearGradient>

          {/* Golden Road Glow Filter */}
          <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.08" />
          </pattern>
        </defs>

        {/* Global Tactical Grid Layer */}
        <rect width="100%" height="100%" fill="url(#gridPattern)" />

        {/* Transformed Map Vector Elements */}
        <g transform={`translate(${mapWidth}, 240)`}>
          {/* SÔNG SÀI GÒN (Saigon River flowing curved through downtown and Bến Nhà Rồng) */}
          <path
            d={`M ${-280 * zoom + pan.x} ${-380 * zoom + pan.y} 
               C ${-120 * zoom + pan.x} ${-220 * zoom + pan.y}, 
                 ${140 * zoom + pan.x} ${-180 * zoom + pan.y}, 
                 ${180 * zoom + pan.x} ${-40 * zoom + pan.y} 
               C ${220 * zoom + pan.x} ${100 * zoom + pan.y}, 
                 ${120 * zoom + pan.x} ${220 * zoom + pan.y}, 
                 ${-50 * zoom + pan.x} ${320 * zoom + pan.y}
               C ${-140 * zoom + pan.x} ${380 * zoom + pan.y}, 
                 ${-80 * zoom + pan.x} ${460 * zoom + pan.y}, 
                 ${-40 * zoom + pan.x} ${560 * zoom + pan.y}`}
            fill="none"
            stroke="url(#saigonRiverGrad)"
            strokeWidth={48 * zoom}
            strokeLinecap="round"
          />

          {/* Sông Sài Gòn Luminous Core Wave Line */}
          <path
            d={`M ${-280 * zoom + pan.x} ${-380 * zoom + pan.y} 
               C ${-120 * zoom + pan.x} ${-220 * zoom + pan.y}, 
                 ${140 * zoom + pan.x} ${-180 * zoom + pan.y}, 
                 ${180 * zoom + pan.x} ${-40 * zoom + pan.y} 
               C ${220 * zoom + pan.x} ${100 * zoom + pan.y}, 
                 ${120 * zoom + pan.x} ${220 * zoom + pan.y}, 
                 ${-50 * zoom + pan.x} ${320 * zoom + pan.y}`}
            fill="none"
            stroke="#1976D2"
            strokeWidth={14 * zoom}
            strokeOpacity="0.4"
            strokeLinecap="round"
          />

          {/* Kênh Bến Nghé / Bến Vân Đồn (nhánh chảy qua Bến Nhà Rồng) */}
          <path
            d={`M ${120 * zoom + pan.x} ${220 * zoom + pan.y} 
               C ${-20 * zoom + pan.x} ${190 * zoom + pan.y}, 
                 ${-160 * zoom + pan.x} ${180 * zoom + pan.y}, 
                 ${-320 * zoom + pan.x} ${240 * zoom + pan.y}`}
            fill="none"
            stroke="#093C61"
            strokeWidth={20 * zoom}
            strokeLinecap="round"
          />

          {/* TUYẾN ĐƯỜNG LỊCH SỬ HUYẾT MẠCH (Golden Illuminated Historic Streets) */}
          {/* Đại lộ Lê Duẩn (từ Dinh Độc Lập hướng về Thảo Cầm Viên) */}
          <line
            x1={-45 * zoom + pan.x}
            y1={-140 * zoom + pan.y}
            x2={110 * zoom + pan.x}
            y2={-60 * zoom + pan.y}
            stroke="#D4AF37"
            strokeWidth={4 * zoom}
            strokeOpacity="0.85"
            filter="url(#roadGlow)"
          />
          {/* Đại lộ Nam Kỳ Khởi Nghĩa (cắt ngang Dinh Độc Lập) */}
          <line
            x1={-120 * zoom + pan.x}
            y1={-240 * zoom + pan.y}
            x2={30 * zoom + pan.x}
            y2={40 * zoom + pan.y}
            stroke="#F59E0B"
            strokeWidth={3 * zoom}
            strokeOpacity="0.75"
          />
          {/* Đường Nguyễn Huệ / Đồng Khởi (hướng ra sông Sài Gòn) */}
          <line
            x1={20 * zoom + pan.x}
            y1={-90 * zoom + pan.y}
            x2={140 * zoom + pan.x}
            y2={50 * zoom + pan.y}
            stroke="#FFE082"
            strokeWidth={3.5 * zoom}
            strokeOpacity="0.8"
          />
          {/* Đại lộ Tôn Đức Thắng (chạy dọc ven sông Sài Gòn) */}
          <path
            d={`M ${160 * zoom + pan.x} ${-80 * zoom + pan.y} 
               C ${190 * zoom + pan.x} ${40 * zoom + pan.y}, 
                 ${130 * zoom + pan.x} ${160 * zoom + pan.y}, 
                 ${60 * zoom + pan.x} ${230 * zoom + pan.y}`}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={3.5 * zoom}
            strokeOpacity="0.85"
          />
          {/* Trục Hàm Nghi - Bến Vân Đồn */}
          <line
            x1={-10 * zoom + pan.x}
            y1={10 * zoom + pan.y}
            x2={120 * zoom + pan.x}
            y2={130 * zoom + pan.y}
            stroke="#D4AF37"
            strokeWidth={2.5 * zoom}
            strokeOpacity="0.6"
          />

          {/* Sông Sài Gòn Water Text Label */}
          <text
            x={175 * zoom + pan.x}
            y={20 * zoom + pan.y}
            fill="#4FC3F7"
            fillOpacity="0.6"
            fontSize={10 * zoom}
            fontFamily="'Cinzel', serif"
            fontWeight="bold"
            letterSpacing="3"
            transform={`rotate(45, ${175 * zoom + pan.x}, ${20 * zoom + pan.y})`}
          >
            SÔNG SÀI GÒN
          </text>
        </g>
      </svg>

      {/* MAP INTERACTIVE CONTENT CONTAINER */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mapWidth}px, 240px)`,
        }}
      >
        {/* RADIUS RINGS AROUND EACH LOCATION (Bán kính phát hiện & tương tác) */}
        {locations.map((loc) => {
          const point = coordToMapPoint(loc.coordinates.lat, loc.coordinates.lng);
          const prox = getLocationProximity(loc);
          if (!prox.inDiscoveryRadius) return null;

          // Scale interaction radius (m) to pixels
          const interactionPx = Math.max(loc.interactionRadius * 0.45 * zoom, 18);
          // Scale discovery radius (km) to pixels
          const discoveryPx = Math.min(loc.discoveryRadius * 15 * zoom, 160);

          return (
            <div
              key={`radius-${loc.id}`}
              style={{
                left: point.x,
                top: point.y,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              {/* Outer Discovery Radius Circle */}
              <div
                style={{
                  width: discoveryPx * 2,
                  height: discoveryPx * 2,
                }}
                className={`rounded-full border border-dashed transition-all ${
                  loc.rarity === 'legendary'
                    ? 'border-[#D4AF37]/25 bg-[#D4AF37]/[0.02]'
                    : loc.rarity === 'event'
                    ? 'border-red-500/25 bg-red-500/[0.02]'
                    : loc.rarity === 'uncommon'
                    ? 'border-emerald-500/25 bg-emerald-500/[0.02]'
                    : 'border-amber-700/25'
                }`}
              />

              {/* Inner Interaction Radius Circle (Vòng kết nối) */}
              <div
                style={{
                  width: interactionPx * 2,
                  height: interactionPx * 2,
                }}
                className={`absolute inset-0 m-auto rounded-full border transition-all ${
                  prox.inInteractionRadius
                    ? 'border-emerald-400 bg-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse'
                    : 'border-[#D4AF37]/40 bg-[#D4AF37]/5'
                }`}
              />
            </div>
          );
        })}

        {/* CUSTOM PINS FOR ALL FILTERED LOCATIONS */}
        {locations.map((loc) => {
          const point = coordToMapPoint(loc.coordinates.lat, loc.coordinates.lng);
          const prox = getLocationProximity(loc);
          const isSelected = selectedLocationId === loc.id;
          const isConnected = prox.inInteractionRadius;

          // Rarity styling specifics per Phase 2 requirements:
          // Thường: Màu đồng nâu
          // Hiếm: Màu xanh ngọc lục bảo phát sáng (biểu tượng ngọn đuốc)
          // Huyền thoại: Mô hình/Icon 3D Vàng rực rỡ kèm Aura Pulse lan rộng
          // Sự kiện: Màu đỏ rực kèm cờ Tổ quốc
          const rarityStyles = {
            legendary: {
              pinBg: 'bg-gradient-to-br from-[#FFE082] via-[#D4AF37] to-[#996515]',
              pinBorder: 'border-2 border-[#FFF176]',
              shadow: 'shadow-[0_0_25px_rgba(212,175,55,0.9)]',
              textBadge: 'bg-[#D4AF37] text-slate-950',
              icon: Sparkles,
              hasAuraPulse: true,
            },
            event: {
              pinBg: 'bg-gradient-to-br from-[#FF6B6B] via-[#E53E3E] to-[#9B1C1C]',
              pinBorder: 'border-2 border-red-300',
              shadow: 'shadow-[0_0_22px_rgba(229,62,62,0.9)]',
              textBadge: 'bg-red-600 text-white',
              icon: Flag,
              hasAuraPulse: true,
            },
            uncommon: {
              pinBg: 'bg-gradient-to-br from-[#34D399] via-[#059669] to-[#065F46]',
              pinBorder: 'border-2 border-emerald-300',
              shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.8)]',
              textBadge: 'bg-emerald-600 text-white',
              icon: Flame, // Ngọn đuốc rực sáng
              hasAuraPulse: false,
            },
            common: {
              pinBg: 'bg-gradient-to-br from-[#C49A6C] via-[#8C6239] to-[#5C3D1E]',
              pinBorder: 'border-2 border-[#D9B38C]',
              shadow: 'shadow-[0_0_12px_rgba(140,98,57,0.6)]',
              textBadge: 'bg-[#8C6239] text-amber-100',
              icon: Landmark,
              hasAuraPulse: false,
            },
          }[loc.rarity];

          const IconComponent = rarityStyles.icon;

          return (
            <div
              key={loc.id}
              style={{
                left: point.x,
                top: point.y,
                zIndex: isSelected ? 40 : isConnected ? 35 : 20,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <button
                onClick={() => onSelectLocation(loc)}
                className="group relative flex flex-col items-center focus:outline-none cursor-pointer"
                aria-label={`Chi tiết di tích ${loc.name}`}
              >
                {/* Legendary / Event Aura Pulse Multi-Layer Animation */}
                {rarityStyles.hasAuraPulse && (
                  <>
                    <span className="absolute -inset-4 rounded-full border border-[#D4AF37] animate-ping opacity-75" />
                    <span className="absolute -inset-7 rounded-full bg-[#D4AF37]/15 blur-sm animate-pulse" />
                  </>
                )}

                {/* Connected Sonar Ripple when user is close */}
                {isConnected && (
                  <span className="absolute -inset-5 rounded-full border-2 border-emerald-400 animate-ping opacity-90" />
                )}

                {/* 3D Pin Head with Icon */}
                <motion.div
                  animate={
                    isSelected
                      ? { scale: [1.15, 1.3, 1.15], y: [-2, -6, -2] }
                      : { y: [0, -3, 0] }
                  }
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-2xl ${rarityStyles.pinBg} ${rarityStyles.pinBorder} ${rarityStyles.shadow} group-hover:scale-125 transition-transform duration-200`}
                >
                  <IconComponent className="w-5 h-5 text-slate-950 fill-current drop-shadow" />

                  {/* Connected Live Green Indicator */}
                  {isConnected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-bounce" />
                  )}
                </motion.div>

                {/* Pin Needle Base Point */}
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#D4AF37] -mt-0.5" />

                {/* Pin Label with Name and Real Distance */}
                <div className="mt-1 px-2 py-0.5 rounded-full bg-[#0B1524]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-lg text-center flex flex-col items-center max-w-[130px] group-hover:border-[#D4AF37]">
                  <p className="text-[10px] font-bold text-amber-100 truncate w-full font-heritage">
                    {loc.name}
                  </p>
                  <p
                    className={`text-[9px] font-semibold whitespace-nowrap ${
                      isConnected ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-slate-300'
                    }`}
                  >
                    {isConnected ? '⚡ Đủ điều kiện kết nối' : `Cách ${prox.distanceFormatted}`}
                  </p>
                </div>
              </button>
            </div>
          );
        })}

        {/* EXPLORER CHARACTER AT USER GPS CENTER */}
        <div
          style={{
            left: userMapPos.x,
            top: userMapPos.y,
            zIndex: 30,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {/* Radar Pulse Wave Rings (Sóng Radar lan tỏa liên tục) */}
          <div className="absolute -inset-10 rounded-full border border-[#D4AF37]/60 animate-sonar-pulse" />
          <div
            className="absolute -inset-16 rounded-full border border-[#D4AF37]/40 animate-sonar-pulse"
            style={{ animationDelay: '0.9s' }}
          />
          <div
            className="absolute -inset-24 rounded-full border border-[#D4AF37]/20 animate-sonar-pulse"
            style={{ animationDelay: '1.8s' }}
          />

          {/* Golden Radiant Compass Direction Needle */}
          <div className="absolute -inset-5 rounded-full border border-dashed border-[#D4AF37]/60 animate-spin" style={{ animationDuration: '24s' }} />

          {/* Explorer Avatar (Nhân vật Nhà Khám Phá đeo balo) */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-[#1E3A5F] via-[#102035] to-[#0A1424] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.7)] flex items-center justify-center">
            {/* Illustrated 2.5D Backpack Explorer Silhouette */}
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              {/* Explorer Hat */}
              <ellipse cx="20" cy="11" rx="9" ry="3" fill="#D4AF37" />
              <path d="M14 11 C14 7 26 7 26 11 Z" fill="#996515" />
              {/* Head */}
              <circle cx="20" cy="15" r="4" fill="#FFE082" />
              {/* Body Coat */}
              <path d="M13 20 L27 20 L25 32 L15 32 Z" fill="#1E3A5F" />
              {/* Backpack on shoulder */}
              <rect x="23" y="19" width="6" height="9" rx="2" fill="#D9A05B" stroke="#996515" strokeWidth="1" />
              {/* Legs */}
              <line x1="17" y1="32" x2="17" y2="38" stroke="#FFE082" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="23" y1="32" x2="23" y2="38" stroke="#FFE082" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            {/* Glowing Golden Center Aura */}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-slate-900" />
          </div>

          {/* User Tag */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#162A45]/95 border border-[#D4AF37]/60 shadow text-[9px] font-bold text-amber-200 whitespace-nowrap">
            Vị trí của bạn
          </div>
        </div>
      </div>

      {/* FLOATING MAP TACTICAL CONTROLS (Zoom +, Zoom -, Center User) */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={zoomIn}
          className="w-8 h-8 rounded-xl bg-[#0F1B2E]/90 border border-[#D4AF37]/50 text-amber-200 flex items-center justify-center hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-lg active:scale-95"
          title="Phóng to bản đồ"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 rounded-xl bg-[#0F1B2E]/90 border border-[#D4AF37]/50 text-amber-200 flex items-center justify-center hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-lg active:scale-95"
          title="Thu nhỏ bản đồ"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={centerOnUser}
          className="w-8 h-8 rounded-xl bg-[#162A45] border border-emerald-400 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-lg active:scale-95"
          title="Định vị tâm vị trí bạn"
        >
          <LocateFixed className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
