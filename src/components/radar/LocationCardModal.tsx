'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoricalLocation } from '@/types/location';
import { useApp } from '@/context/AppContext';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  X,
  MapPin,
  Sparkles,
  Volume2,
  Pause,
  Play,
  Puzzle,
  Award,
  Radio,
  BookOpen,
  Lock,
  ArrowRight,
  Eye,
  Camera,
  Navigation,
} from 'lucide-react';

interface LocationCardModalProps {
  location: HistoricalLocation | null;
  onClose: () => void;
}

export const LocationCardModal: React.FC<LocationCardModalProps> = ({ location, onClose }) => {
  const {
    getLocationProximity,
    setCurrentTab,
    setActivePlayingStory,
    stories,
    togglePlayAudio,
    isPlayingAudio,
    activeAudioWitness,
    currentGps,
    teleportToPreset,
    setProfileSubScreen,
    startArNavigation,
  } = useApp();

  const [isSepiaMode, setIsSepiaMode] = useState<boolean>(true);

  if (!location) return null;

  const proximity = getLocationProximity(location);
  const isAudioPlaying = activeAudioWitness?.id === location.witnessStory.id && isPlayingAudio;
  const isWithinInteraction = proximity.inInteractionRadius;

  // Shortcut 1: Start Minigame
  const handleStartMinigame = () => {
    if (!isWithinInteraction) return;
    const matchedStory = stories.find((s) => s.locationId === location.id) || stories[0];
    setActivePlayingStory(matchedStory);
    setCurrentTab('minigame');
    onClose();
  };

  // Shortcut 2: Navigate to Badge Portfolio
  const handleOpenBadges = () => {
    setProfileSubScreen('collection');
    setCurrentTab('profile');
    onClose();
  };

  // Quick Teleport to this location for instant testing
  const handleQuickTeleport = () => {
    teleportToPreset({
      id: `teleport-${location.id}`,
      label: `Đứng tại ${location.name} (Cách 20m)`,
      subtitle: `Tự động đưa GPS vào phạm vi tương tác (≤ ${location.interactionRadius}m)`,
      coordinates: {
        lat: location.coordinates.lat + 0.00015,
        lng: location.coordinates.lng,
      },
      targetLocationId: location.id,
      expectedState: 'connected',
    });
  };

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-auto">
        {/* Backdrop Overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container (Imperial Heritage Style) */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative max-h-[88vh] w-full bg-gradient-to-b from-[#0C1626] via-[#09121F] to-[#060C16] border-t-2 border-[#D4AF37] rounded-t-[36px] overflow-hidden flex flex-col shadow-[0_-15px_60px_rgba(0,0,0,0.9)]"
        >
          {/* HERITAGE CORNER DECORATIONS (Hoa văn Rồng / Mây Vàng Kim 4 Góc) */}
          <HeritageCornerDecoration position="top-left" size={42} className="absolute top-2 left-2 z-30" />
          <HeritageCornerDecoration position="top-right" size={42} className="absolute top-2 right-2 z-30" />
          <HeritageCornerDecoration position="bottom-left" size={36} className="absolute bottom-2 left-2 z-30 opacity-60" />
          <HeritageCornerDecoration position="bottom-right" size={36} className="absolute bottom-2 right-2 z-30 opacity-60" />

          {/* Top Gold Horizon Beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFE082] to-transparent" />

          {/* Drag Pill Handle */}
          <div className="w-full pt-3 pb-1 flex justify-center shrink-0">
            <div className="w-12 h-1 bg-slate-700/80 rounded-full" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-5 z-40 w-8 h-8 rounded-full bg-slate-900/80 border border-[#D4AF37]/50 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#D4AF37] transition-all shadow-md active:scale-95"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>

          {/* SCROLLABLE MODAL BODY */}
          <div className="flex-1 overflow-y-auto px-5 pt-1 pb-24 space-y-4">
            {/* 1. ARCHIVAL HISTORICAL PHOTOGRAPHY HEADER */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-xl group">
              <img
                src={location.imageUrl}
                alt={location.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isSepiaMode ? 'sepia-[0.35] contrast-[1.08]' : 'saturate-[1.15]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09121F] via-[#09121F]/35 to-transparent" />

              {/* Rarity & Content Type Badges */}
              <div className="absolute top-3 left-4 flex flex-wrap items-center gap-1.5 z-20">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md ${
                    location.rarity === 'legendary'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 border border-[#FFF176]'
                      : location.rarity === 'event'
                      ? 'bg-red-600 text-white border border-red-300'
                      : location.rarity === 'uncommon'
                      ? 'bg-emerald-600 text-white border border-emerald-300'
                      : 'bg-[#8C6239] text-amber-100 border border-[#D9B38C]'
                  }`}
                >
                  {location.rarity}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-amber-200 border border-amber-500/30">
                  {location.historicalPeriod}
                </span>
              </div>

              {/* Sepia / Vibrant Photo Filter Toggle Button */}
              <button
                onClick={() => setIsSepiaMode(!isSepiaMode)}
                className="absolute top-3 right-14 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 text-[9px] text-amber-200 flex items-center gap-1 hover:border-[#D4AF37] transition-all"
                title="Bật/Tắt hiệu ứng màu hoài cổ"
              >
                <Camera className="w-3 h-3 text-[#D4AF37]" />
                {isSepiaMode ? 'Ảnh Hoài Cổ' : 'Ảnh Rực Rỡ'}
              </button>

              {/* Title & Classification Banner in Header */}
              <div className="absolute bottom-3 left-4 right-4 z-20">
                <h2 className="text-xl sm:text-2xl font-black text-amber-100 font-heritage tracking-wide drop-shadow-md">
                  {location.name}
                </h2>
                <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-[#FFE082] mt-0.5 font-medium">
                  <span className="font-semibold text-white">Cách {proximity.distanceFormatted}</span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">{location.categoryTitle}</span>
                  {location.yearEstablished && (
                    <>
                      <span>•</span>
                      <span className="text-slate-300">Năm {location.yearEstablished}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* GPS INTERACTION STATUS PILL & TELEPORT SHORTCUT */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                isWithinInteraction
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isWithinInteraction ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs">
                    {isWithinInteraction
                      ? '⚡ Đã Kết Nối Thực Tế (Trong phạm vi di tích)'
                      : `Cách bạn: ${proximity.distanceFormatted}`}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.2">
                    {isWithinInteraction
                      ? `Bạn đang ở cự ly ${Math.round(proximity.distanceMeters)}m (Bán kính mở khóa ≤ ${location.interactionRadius}m)`
                      : `Cần di chuyển lại gần ≤ ${location.interactionRadius}m để mở khóa tương tác thực tế.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    startArNavigation(location);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95"
                  title="Mở Camera AR Thực Địa Dẫn Đường"
                >
                  <Navigation className="w-3 h-3" />
                  Dẫn Đường AR
                </button>

                {!isWithinInteraction && (
                  <button
                    onClick={handleQuickTeleport}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-[10px] font-bold text-amber-200 whitespace-nowrap transition-all flex items-center gap-1 active:scale-95"
                    title="Teleport nhanh để test mở khóa"
                  >
                    Teleport
                  </button>
                )}
              </div>
            </div>

            {/* 2. BODY CONTENT: HISTORICAL STORY SUMMARY */}
            <div className="p-3.5 rounded-2xl bg-[#0E1A2C]/90 border border-slate-800 space-y-2 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5 font-heritage">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                Tóm Tắt Câu Chuyện Lịch Sử
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed text-justify">
                {location.historicalSummary}
              </p>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{location.address}</span>
              </div>
            </div>

            {/* 3. TRỌNG TÂM: LỜI KỂ NHÂN CHỨNG LỊCH SỬ (LIVING HISTORY MEDIA PLAYER) */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12243D] via-[#0E1C30] to-[#091424] border border-[#D4AF37]/50 shadow-xl space-y-3 relative overflow-hidden">
              {/* Gold Top Light Horizon */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFE082] to-transparent" />

              {/* Living History Header Label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-200 uppercase tracking-wider font-heritage">
                    Lời Kể Nhân Chứng Lịch Sử (Living History)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                  {location.witnessStory.duration}
                </span>
              </div>

              {/* Memory Film Title (Tiêu đề thước phim ký ức) */}
              <p className="text-xs font-bold text-amber-100 font-heritage">
                {location.witnessStory.memoryFilmTitle || location.witnessStory.title}
              </p>

              {/* Speaker Portrait & Quote */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-slate-800/80">
                <div className="relative shrink-0">
                  <img
                    src={location.witnessStory.speakerAvatar || location.imageUrl}
                    alt={location.witnessStory.speakerName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-red-600 text-white border border-slate-900">
                    <Radio className="w-2.5 h-2.5" />
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-50">
                      {location.witnessStory.speakerName}
                    </p>
                  </div>
                  <p className="text-[10px] text-[#D9A05B] font-medium leading-tight">
                    {location.witnessStory.speakerRole}
                  </p>
                  <p className="text-[11px] italic text-slate-200 border-l-2 border-[#D4AF37] pl-2 mt-1 leading-snug">
                    {location.witnessStory.quote}
                  </p>
                </div>
              </div>

              {/* Interactive Audio Waveform Player Bar */}
              <div className="p-3 rounded-xl bg-[#091524] border border-[#D4AF37]/40 flex items-center gap-3">
                {/* Play / Pause Toggle Button */}
                <button
                  onClick={() => togglePlayAudio(location.witnessStory)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#F59E0B] to-[#996515] flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-transform shrink-0"
                >
                  {isAudioPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  )}
                </button>

                {/* Animated Waveform Visualizer */}
                <div className="flex-1 flex items-center justify-around h-6 px-1">
                  {[35, 75, 45, 95, 60, 85, 40, 100, 50, 90, 65, 80, 45, 70].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={
                        isAudioPlaying
                          ? { height: [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`] }
                          : { height: '15%' }
                      }
                      transition={{
                        duration: 0.7 + (i % 4) * 0.2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: i * 0.05,
                      }}
                      className={`w-0.5 rounded-full transition-colors ${
                        isAudioPlaying ? 'bg-[#FFE082]' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {isAudioPlaying ? 'Đang phát...' : location.witnessStory.duration}
                </span>
              </div>

              {/* Historical Source Attribution */}
              <p className="text-[10px] text-slate-400 italic text-right">
                Nguồn tư liệu: <span className="text-amber-200 font-semibold">{location.witnessStory.historicalSource}</span>
              </p>
            </div>
          </div>

          {/* 4. FOOTER SHORTCUT BUTTONS (2 NÚT LỐI TẮT THEO ĐÚNG BẢN THIẾT KẾ) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#09121F]/98 backdrop-blur-xl border-t border-[#D4AF37]/40 grid grid-cols-2 gap-3 z-40 shadow-2xl">
            {/* NÚT 1: THỬ THÁCH MẢNH GHÉP (Kiểm tra điều kiện khoảng cách) */}
            <button
              onClick={handleStartMinigame}
              disabled={!isWithinInteraction}
              className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 ${
                isWithinInteraction
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.7)] hover:brightness-110 active:scale-95 cursor-pointer ring-1 ring-[#FFF176]'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/80 cursor-not-allowed opacity-60'
              }`}
            >
              <Puzzle className="w-4 h-4 fill-current shrink-0" />
              <div className="text-left leading-tight">
                <span className="block font-heritage font-extrabold">🎮 THỬ THÁCH MẢNH GHÉP</span>
                {!isWithinInteraction && (
                  <span className="text-[9px] text-amber-400/90 font-medium block">
                    (Cần ở cự ly ≤ {location.interactionRadius}m)
                  </span>
                )}
              </div>
            </button>

            {/* NÚT 2: HUY HIỆU & DI SẢN (Chuyển sang Bộ sưu tập Huy hiệu) */}
            <button
              onClick={handleOpenBadges}
              className="py-3 px-3 rounded-2xl text-xs font-bold bg-[#162A45] hover:bg-[#1E375A] border border-[#D4AF37]/60 text-amber-200 shadow-lg shadow-black/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer group"
            >
              <Award className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform" />
              <div className="text-left leading-tight">
                <span className="block font-heritage font-extrabold text-amber-100">🏅 HUY HIỆU & DI SẢN</span>
                <span className="text-[9px] text-[#D9A05B] block">Bộ sưu tập danh dự</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
