'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { HistoricalLocation, LocationRarity, LocationContentType } from '@/types/location';
import { LocationPin } from './LocationPin';
import { RadarFilters } from './RadarFilters';
import { LocationCardModal } from './LocationCardModal';
import { LocationSearchModal } from './LocationSearchModal';
import { TacticalHeritageMap } from './TacticalHeritageMap';
import { GoldenDragonLogo } from '../common/GoldenDragonLogo';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import {
  Search,
  SlidersHorizontal,
  Compass,
  Map,
  Sparkles,
  Layers,
  Radio,
  MapPin,
  ChevronDown,
} from 'lucide-react';

export const RadarScanner: React.FC = () => {
  const {
    locations,
    selectedLocation,
    setSelectedLocation,
    getLocationProximity,
    currentGps,
  } = useApp();

  // Filters State
  const [selectedRarity, setSelectedRarity] = useState<LocationRarity | 'all'>('all');
  const [selectedContentType, setSelectedContentType] = useState<LocationContentType | 'all'>('all');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState<boolean>(true);
  const [mapMode, setMapMode] = useState<'tactical' | 'radar'>('tactical');

  // Filter locations by rarity and content type
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (selectedRarity !== 'all' && loc.rarity !== selectedRarity) {
        return false;
      }
      if (selectedContentType !== 'all' && loc.contentType !== selectedContentType) {
        return false;
      }
      const prox = getLocationProximity(loc);
      return prox.inDiscoveryRadius;
    });
  }, [locations, selectedRarity, selectedContentType, getLocationProximity]);

  const connectedCount = filteredLocations.filter(
    (loc) => getLocationProximity(loc).inInteractionRadius
  ).length;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#0B1320] via-[#0E1726] to-[#111C2D] text-slate-100 select-none pb-20">
      {/* 1. HEADER TRÊN CÙNG THEO YÊU CẦU: LOGO RỒNG VÀNG - TIÊU ĐỀ VÀNG KIM - SEARCH & FILTER */}
      <div className="pt-14 px-4 pb-2.5 z-30 bg-[#0B1320]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-lg shrink-0">
        <div className="flex items-center justify-between">
          {/* Logo Rồng Vàng bên trái */}
          <div className="flex items-center gap-2">
            <GoldenDragonLogo size={36} />
            <div className="hidden xs:block">
              <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block">
                Di Sản Lịch Sử
              </span>
            </div>
          </div>

          {/* Tiêu đề "THE LEGACY KEEPERS" màu vàng kim ở giữa */}
          <div className="text-center">
            <h1 className="text-sm sm:text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF176] via-[#D4AF37] to-[#F59E0B] font-heritage uppercase drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
              THE LEGACY KEEPERS
            </h1>
            <p className="text-[9px] text-amber-200/80 font-medium tracking-wide">
              Bản Đồ Radar Định Vị Di Sản
            </p>
          </div>

          {/* Nút Tìm kiếm (Search) và Bộ lọc (Filter) bên phải */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-[#D4AF37]/40 flex items-center justify-center text-amber-200 hover:text-white hover:border-[#D4AF37] transition-all shadow active:scale-95"
              aria-label="Tìm kiếm di tích"
              title="Tìm kiếm di tích lịch sử"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all shadow active:scale-95 ${
                isFilterBarOpen
                  ? 'bg-[#D4AF37] text-slate-950 border-[#FFE082]'
                  : 'bg-slate-900 text-amber-200 border-[#D4AF37]/40 hover:border-[#D4AF37]'
              }`}
              aria-label="Mở bộ lọc"
              title="Bộ lọc di tích và loại hình"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher: Sa bàn 2.5D vs Radar Quét Cổ Phong */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] text-emerald-400 font-bold">
              {connectedCount > 0
                ? `${connectedCount} Di tích đang kết nối`
                : `${filteredLocations.length} Địa danh hiển thị`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setMapMode('tactical')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                mapMode === 'tactical'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3 h-3" />
              <span>Sa Bàn 2.5D</span>
            </button>

            <button
              onClick={() => setMapMode('radar')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                mapMode === 'radar'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Radar 360°</span>
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE FILTER BAR (4 Rarity + 5 Content Types) */}
        {isFilterBarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pt-2 overflow-hidden"
          >
            <RadarFilters
              selectedRarity={selectedRarity}
              onSelectRarity={setSelectedRarity}
              selectedContentType={selectedContentType}
              onSelectContentType={setSelectedContentType}
            />
          </motion.div>
        )}
      </div>

      {/* 2. MAINBOARD MAP INTERACTIVE VIEWPORT */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {mapMode === 'tactical' ? (
          /* CHẾ ĐỘ 1: BẢN ĐỒ SA BÀN 2.5D (Sông Sài Gòn, các tuyến đường ánh vàng, Explorer avatar radar pulse) */
          <TacticalHeritageMap
            locations={filteredLocations}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            selectedLocationId={selectedLocation?.id}
            activeFilterType={selectedContentType}
            activeRarity={selectedRarity}
          />
        ) : (
          /* CHẾ ĐỘ 2: RADAR QUÉT 360 ĐỘ CỔ PHONG VỚI LA BÀN ĐÔNG TÂY NAM BẮC */
          <div className="flex-1 relative flex items-center justify-center px-4 my-auto min-h-[310px]">
            {/* Dong Son Motif in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
              <DongSonSun size={480} opacity={0.18} />
            </div>

            {/* Radar Disc */}
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.2)] flex items-center justify-center overflow-hidden bg-radial from-[#122238]/60 via-[#0B1524]/90 to-[#070D18]/95">
              {/* Compass Markers */}
              <span className="absolute top-2 text-[10px] font-bold text-[#D4AF37] font-heritage tracking-wider">
                BẮC
              </span>
              <span className="absolute bottom-2 text-[10px] font-bold text-slate-400 font-heritage tracking-wider">
                NAM
              </span>
              <span className="absolute right-2.5 text-[10px] font-bold text-slate-400 font-heritage tracking-wider">
                ĐÔNG
              </span>
              <span className="absolute left-2.5 text-[10px] font-bold text-slate-400 font-heritage tracking-wider">
                TÂY
              </span>

              {/* Concentric Distance Rings */}
              <div className="absolute inset-2 rounded-full border border-[#D4AF37]/20" />
              <div className="absolute inset-14 rounded-full border border-[#D4AF37]/25 border-dashed" />
              <div className="absolute inset-24 rounded-full border border-emerald-500/30 bg-emerald-500/[0.02]" />
              <div className="absolute inset-32 rounded-full border border-[#D4AF37]/40" />

              {/* Crosshair Lines */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/25 to-transparent" />

              {/* Sweeping Radar Beam */}
              <div
                className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg at 50% 50%, rgba(212, 175, 55, 0.45) 0deg, rgba(212, 175, 55, 0.15) 30deg, transparent 60deg, transparent 360deg)',
                }}
              />

              {/* Center User Explorer */}
              <div className="relative z-20 flex flex-col items-center">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white shadow-lg shadow-emerald-500/50" />
                </span>
              </div>

              {/* Pins on Radar */}
              {filteredLocations.map((loc) => {
                const prox = getLocationProximity(loc);
                return (
                  <LocationPin
                    key={loc.id}
                    location={loc}
                    proximity={prox}
                    radarRadiusPx={140}
                    maxRadarRangeKm={20}
                    isSelected={selectedLocation?.id === loc.id}
                    onSelect={(selected) => setSelectedLocation(selected)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM HORIZONTAL QUICK SELECT CAROUSEL */}
        <div className="absolute bottom-1 left-0 right-0 px-3 z-20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
              Di tích quanh bạn ({filteredLocations.length})
            </span>
            <span className="text-[10px] text-slate-400">Chạm thẻ để mở cửa sổ di sản</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {filteredLocations.map((loc) => {
              const prox = getLocationProximity(loc);
              const isSelected = selectedLocation?.id === loc.id;
              const isConnected = prox.inInteractionRadius;

              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`flex-shrink-0 w-44 text-left p-2.5 rounded-2xl border transition-all duration-200 backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#14233C]/95 border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.35)] ring-1 ring-[#D4AF37]'
                      : 'bg-[#0B1524]/90 border-slate-800 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        loc.rarity === 'legendary'
                          ? 'bg-[#D4AF37]/20 text-[#F59E0B] border border-[#D4AF37]/40'
                          : loc.rarity === 'event'
                          ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                          : loc.rarity === 'uncommon'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/40'
                          : 'bg-[#8C6239]/20 text-[#D9B38C] border border-[#8C6239]/40'
                      }`}
                    >
                      {loc.rarity}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        isConnected ? 'text-emerald-400 font-extrabold' : 'text-slate-400'
                      }`}
                    >
                      {prox.distanceFormatted}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-amber-100 truncate mt-1 font-heritage">
                    {loc.name}
                  </p>
                  <p className="text-[10px] text-slate-300 truncate mt-0.5">
                    {isConnected ? '⚡ Đủ điều kiện kết nối' : loc.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEARCH OVERLAY MODAL */}
      <LocationSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(loc) => setSelectedLocation(loc)}
      />

      {/* LOCATION DETAIL MODAL (CỬA SỔ POP-UP THÔNG TIN ĐỊA DANH) */}
      <LocationCardModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  );
};
