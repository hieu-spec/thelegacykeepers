// src/components/mobile/MobileRadarTab.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ScanEye,
  Volume2,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Radio,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { HeritageLocationItem } from './MobileHeritageShell';

interface MobileRadarTabProps {
  locations: HeritageLocationItem[];
  selectedLocation: HeritageLocationItem;
  onSelectLocation: (loc: HeritageLocationItem) => void;
  currentGps: { lat: number; lng: number };
  playerHeading: number;
  onOpenAR: () => void;
  onOpenStory: () => void;
  onPlayAudio: (loc: HeritageLocationItem) => void;
}

type MapStyleMode = 'night' | 'satellite' | 'ancient';

export const MobileRadarTab: React.FC<MobileRadarTabProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  playerHeading,
  onOpenAR,
  onOpenStory,
  onPlayAudio,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'legendary' | 'battlefield' | 'witness'>('all');
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('night');
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const filteredLocations = locations.filter((loc) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'legendary') return loc.rarity === 'legendary';
    return loc.contentType === filterCategory;
  });

  const cycleMapStyle = () => {
    setMapStyle((prev) => (prev === 'night' ? 'satellite' : prev === 'satellite' ? 'ancient' : 'night'));
  };

  const mapStyleLabel = {
    night: 'Tác Chiến Đêm',
    satellite: 'Vệ Tinh Thực Địa',
    ancient: 'Sa Bàn Cổ Sử',
  }[mapStyle];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {/* NỀN SA BÀN TÁC CHIẾN & RADAR QUÉT SÓNG */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          mapStyle === 'night'
            ? 'bg-[radial-gradient(circle_at_center,#13233A_0%,#080E1A_100%)]'
            : mapStyle === 'satellite'
            ? 'bg-[radial-gradient(circle_at_center,#1A332E_0%,#0B1917_100%)]'
            : 'bg-[radial-gradient(circle_at_center,#3B2F20_0%,#1C150E_100%)]'
        }`}
      >
        {/* Lưới tọa độ chiến thuật */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Vòng tròn Radar Geofencing trung tâm */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-72 h-72 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-[#D4AF37]/25 border-dashed flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#D4AF37]/5 border border-emerald-400/40" />
            </div>

            {/* Tia quét Radar xoay 360 độ */}
            <div
              className="absolute inset-0 rounded-full animate-[spin_5s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 70%, rgba(212, 175, 55, 0.28) 100%)',
              }}
            />

            {/* Chấm người chơi ở tâm + Nón hướng nhìn */}
            <div
              className="relative z-20 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `rotate(${playerHeading}deg)` }}
            >
              <div className="absolute -top-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-emerald-400/30" />
              <div className="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_15px_#10B981]" />
            </div>
          </div>
        </div>

        {/* Các điểm Beacon Di tích trên Radar */}
        {filteredLocations.map((loc, index) => {
          const positions = [
            { top: '34%', left: '58%' },
            { top: '26%', left: '32%' },
            { top: '52%', left: '26%' },
            { top: '46%', left: '74%' },
          ];
          const pos = positions[index % positions.length];
          const isSelected = selectedLocation.id === loc.id;

          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc)}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none"
            >
              <span
                className={`absolute -inset-2 rounded-full animate-ping ${
                  loc.rarity === 'legendary' ? 'bg-[#D4AF37]/50' : 'bg-[#8B2626]/50'
                }`}
              />
              <div
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md transition-all ${
                  isSelected
                    ? 'bg-[#8B2626] text-white border-[#D4AF37] scale-110 shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                    : 'bg-[#0B1320]/90 text-[#F5F2EB] border-[#D4AF37]/50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[11px] font-bold whitespace-nowrap">{loc.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* THANH CHIP LỌC NGANG & NÚT ĐỔI LỚP BẢN ĐỒ (Gọn, dễ vuốt bằng ngón cái) */}
      <div className="relative z-20 px-4 pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'Tất cả Di sản' },
            { id: 'legendary', label: '★ Huyền Thoại' },
            { id: 'battlefield', label: '⚔ Chiến Trường' },
            { id: 'witness', label: '🎙 Nhân Chứng' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterCategory(chip.id as typeof filterCategory)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all ${
                filterCategory === chip.id
                  ? 'bg-[#D4AF37] text-[#0B1320] border-[#D4AF37] font-bold shadow'
                  : 'bg-[#0B1320]/75 text-gray-200 border-white/15'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <button
          onClick={cycleMapStyle}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0B1320]/85 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-semibold backdrop-blur-md shadow"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{mapStyleLabel}</span>
        </button>
      </div>

      {/* BOTTOM SHEET CHI TIẾT DI TÍCH (Trượt mượt, không che khuất tầm nhìn) */}
      <motion.div
        layout
        className="relative z-30 mx-3 mb-2 rounded-3xl bg-gradient-to-b from-[#131F33]/95 to-[#0B1320]/98 backdrop-blur-xl border border-[#D4AF37]/40 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Thanh nắm kéo (Drag Handle) */}
        <button
          onClick={() => setSheetExpanded((prev) => !prev)}
          className="w-full pt-2 pb-1 flex flex-col items-center justify-center cursor-pointer"
        >
          <span className="w-10 h-1 rounded-full bg-[#D4AF37]/50" />
        </button>

        <div className="px-4 pb-4 pt-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#8B2626] text-[#F5F2EB] border border-[#D4AF37]/50">
                  {selectedLocation.rarity === 'legendary' ? 'Di Sản Huyền Thoại' : 'Di Tích Quý Hiếm'}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  Cách {selectedLocation.distanceMeters}m
                </span>
              </div>

              <h2 className="font-['Cinzel',serif] text-base font-bold text-[#F5F2EB] mt-1">
                {selectedLocation.name}
              </h2>
              <p className="text-[11px] text-[#D4AF37] font-medium">{selectedLocation.era}</p>
            </div>

            <button
              onClick={() => setSheetExpanded((prev) => !prev)}
              className="p-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
            >
              {sheetExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Nội dung mở rộng khi kéo Bottom Sheet lên */}
          {sheetExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2.5 pt-2.5 border-t border-white/10 text-xs text-gray-300 leading-relaxed space-y-2"
            >
              <p>{selectedLocation.summary}</p>
              {selectedLocation.witnessName && (
                <div className="p-2.5 rounded-xl bg-[#070C15]/80 border border-[#D4AF37]/30">
                  <p className="text-[11px] font-bold text-[#D4AF37]">
                    🎙 Nhân chứng: {selectedLocation.witnessName}
                  </p>
                  <p className="text-[11px] italic text-gray-300 mt-0.5 line-clamp-2">
                    “{selectedLocation.witnessTranscript}”
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* 3 Nút Hành động Thực địa (Vừa vặn ngón cái) */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button
              onClick={onOpenAR}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#D4AF37] text-[#0B1320] font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95 transition-transform"
            >
              <ScanEye className="w-4 h-4" />
              <span>Quét AR</span>
            </button>

            <button
              onClick={() => onPlayAudio(selectedLocation)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#8B2626] text-white font-semibold text-xs border border-[#D4AF37]/40 active:scale-95 transition-transform"
            >
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Ký Ức</span>
            </button>

            <button
              onClick={onOpenStory}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#16243B] text-[#F5F2EB] font-semibold text-xs border border-[#D4AF37]/40 active:scale-95 transition-transform"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Giải Mã</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
