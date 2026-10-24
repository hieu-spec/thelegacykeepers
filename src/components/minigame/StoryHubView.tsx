'use client';

import React, { useState } from 'react';
import { useApp, GPS_PRESETS, GpsPreset } from '@/context/AppContext';
import { HistoricalStory } from '@/types/story';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  MapPin,
  Lock,
  Sparkles,
  ChevronRight,
  Navigation,
  Compass,
  Trophy,
  CheckCircle2,
  X,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface StoryHubViewProps {
  onSelectStory: (story: HistoricalStory) => void;
}

export const StoryHubView: React.FC<StoryHubViewProps> = ({ onSelectStory }) => {
  const { stories, locations, getLocationProximity, teleportToPreset } = useApp();

  // State for locked location modal alert
  const [lockedModalStory, setLockedModalStory] = useState<{
    story: HistoricalStory;
    distanceFormatted: string;
    targetLocationName: string;
    preset?: GpsPreset;
  } | null>(null);

  const handleStoryCardClick = (story: HistoricalStory, isUnlocked: boolean, distanceFormatted: string) => {
    if (isUnlocked) {
      onSelectStory(story);
    } else {
      // Find suitable teleport preset
      const linkedPreset = GPS_PRESETS.find(
        (p) => p.targetLocationId === story.locationId || p.label.toLowerCase().includes(story.locationName.toLowerCase())
      );
      setLockedModalStory({
        story,
        distanceFormatted,
        targetLocationName: story.locationName,
        preset: linkedPreset,
      });
    }
  };

  const handleTeleportFromModal = () => {
    if (lockedModalStory?.preset) {
      teleportToPreset(lockedModalStory.preset);
      setLockedModalStory(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#09111D] via-[#0D1828] to-[#111F33] text-slate-100 select-none pb-24">
      {/* Background Dong Son Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 overflow-hidden">
        <DongSonSun size={540} opacity={0.12} />
      </div>

      {/* Cloud Decoration */}
      <div className="absolute top-16 right-0 pointer-events-none opacity-30 animate-pulse">
        <AncientCloudMotif color="#D4AF37" opacity={0.35} />
      </div>

      {/* Header Bar */}
      <div className="pt-14 px-4 pb-3 z-10 border-b border-amber-900/30 bg-[#09111D]/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center text-slate-950 shadow-md shadow-[#D4AF37]/30 ring-1 ring-[#FFE082]/40">
              <Compass className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] font-heritage block">
                BƯỚC 1 · STORY HUB
              </span>
              <h1 className="text-base font-extrabold text-amber-100 font-heritage tracking-wide">
                Cốt Truyện Di Sản
              </h1>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-amber-950/40 border border-[#D4AF37]/30 text-[10px] text-amber-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Storyteller Engine</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
          Chọn cốt truyện lịch sử gắn với các địa danh xung quanh bạn để phục dựng ký ức qua từng màn thử thách.
        </p>
      </div>

      {/* Story List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 z-10">
        {stories.map((story) => {
          const linkedLoc = locations.find((l) => l.id === story.locationId);
          const proximity = linkedLoc ? getLocationProximity(linkedLoc) : null;
          // Unlocked if location inInteractionRadius OR story explicitly unlocked
          const isInRange = proximity ? proximity.inInteractionRadius : story.isUnlocked;
          const distanceText = proximity ? proximity.distanceFormatted : '2.4 km';
          const completedCount = story.stages.filter((st) => st.stageNumber < story.currentStage).length;
          const progressText = `Đã mở: ${story.currentStage}/${story.totalStages} màn`;

          if (isInRange) {
            // ==========================================
            // TRẠNG THÁI ĐÃ MỞ KHÓA (GPS-UNLOCKED / IN RANGE)
            // ==========================================
            return (
              <div
                key={story.id}
                className="relative rounded-2xl bg-gradient-to-br from-[#12233B]/95 via-[#0E1A2C]/95 to-[#0A1422]/95 border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.28)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(212,175,55,0.45)] group"
              >
                {/* Traditional Vietnamese Corner Engravings */}
                <HeritageCornerDecoration color="#D4AF37" size={18} />

                {/* Golden Glow Top Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FFE082] to-transparent animate-pulse" />

                <div className="p-4 space-y-3">
                  {/* Status Label (Green Badge: 📍 ĐÃ ĐẾN VỊ TRÍ - Đang trong bán kính) */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 flex items-center gap-1.5 shadow-sm shadow-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>📍 ĐÃ ĐẾN VỊ TRÍ - Đang trong bán kính</span>
                    </span>

                    <span className="text-[10px] font-mono font-bold text-amber-300/90 bg-[#D4AF37]/15 px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                      {story.period}
                    </span>
                  </div>

                  {/* Cover Image & Period */}
                  <div className="relative h-32 rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-inner">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1422] via-[#0A1422]/30 to-transparent" />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-[#FFE082] border border-[#D4AF37]/40 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        {story.locationName}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {progressText}
                      </span>
                    </div>
                  </div>

                  {/* Story Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-amber-100 font-heritage tracking-wide leading-snug">
                      {story.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {story.description}
                    </p>
                  </div>

                  {/* Progress Milestone Indicators */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Tiến trình:</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: story.totalStages }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              idx < story.currentStage - 1 || story.isCompleted
                                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                : idx === story.currentStage - 1
                                ? 'bg-[#D4AF37] ring-2 ring-[#FFE082]/60 animate-pulse'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-200/90 font-medium ml-1">
                        {story.isCompleted ? 'Đã hoàn thành' : `Màn ${story.currentStage}/${story.totalStages}`}
                      </span>
                    </div>

                    {/* Gold Button: TRUY CẬP CHI TIẾT -> */}
                    <button
                      onClick={() => handleStoryCardClick(story, true, distanceText)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 text-xs font-black shadow-md shadow-[#D4AF37]/30 flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all cursor-pointer font-heritage tracking-wider"
                    >
                      <span>TRUY CẬP CHI TIẾT</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          } else {
            // ==========================================
            // TRẠNG THÁI BỊ KHÓA (GPS-LOCKED / OUT OF RANGE)
            // ==========================================
            return (
              <div
                key={story.id}
                onClick={() => handleStoryCardClick(story, false, distanceText)}
                className="relative rounded-2xl bg-[#0B1422]/90 border border-slate-700/80 grayscale contrast-125 brightness-75 hover:brightness-90 transition-all duration-300 cursor-pointer overflow-hidden group shadow-lg"
              >
                {/* Center Red Pulsating Lock Banner Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-red-950/90 border-2 border-red-500 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse">
                    <Lock className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-red-300 uppercase tracking-wider font-heritage">
                      🔒 CHƯA ĐẾN VỊ TRÍ
                    </p>
                    <p className="text-[11px] font-bold text-amber-200">
                      (Khoảng cách: {distanceText})
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-300 bg-black/80 px-2.5 py-1 rounded-full border border-slate-700">
                    Chạm để xem gợi ý mở khóa & teleport
                  </span>
                </div>

                <div className="p-4 space-y-3 opacity-60">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      🔒 GPS Bị Khóa
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {story.period}
                    </span>
                  </div>

                  <div className="relative h-28 rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-300 font-heritage">
                      {story.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* MODAL NHẮC NHỞ KHI CHẠM THẺ BỊ KHÓA */}
      {lockedModalStory && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#13233A] via-[#0E1A2C] to-[#0A1320] border-2 border-red-500/70 p-5 shadow-[0_0_40px_rgba(239,68,68,0.35)] relative overflow-hidden space-y-4 text-center">
            {/* Red Light Horizon */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-500/25 blur-2xl rounded-full" />

            {/* Close Button */}
            <button
              onClick={() => setLockedModalStory(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Lock Icon */}
            <div className="w-14 h-14 rounded-full bg-red-950/80 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/40 ring-4 ring-red-500/20">
              <Lock className="w-7 h-7" />
            </div>

            {/* Title & Guidance */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-heritage">
                Chưa Đến Tọa Độ Di Tích
              </span>
              <h3 className="text-base font-bold text-amber-100 font-heritage">
                {lockedModalStory.targetLocationName}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed px-1">
                Hãy di chuyển đến gần địa danh này để mở khóa chuỗi thử thách!
              </p>
              <p className="text-[11px] text-amber-300/90 font-mono font-medium">
                Khoảng cách thực tế hiện tại: {lockedModalStory.distanceFormatted}
              </p>
            </div>

            {/* Shortcut Teleport Button for Testing */}
            <div className="pt-2 space-y-2">
              {lockedModalStory.preset ? (
                <button
                  onClick={handleTeleportFromModal}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 font-bold text-xs shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all font-heritage tracking-wide"
                >
                  <Navigation className="w-4 h-4 fill-slate-950" />
                  <span>Dịch chuyển giả lập đến đây (Test Mode)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    teleportToPreset(GPS_PRESETS[1]);
                    setLockedModalStory(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 font-bold text-xs shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all font-heritage tracking-wide"
                >
                  <Navigation className="w-4 h-4 fill-slate-950" />
                  <span>Dịch chuyển giả lập đến khu vực này</span>
                </button>
              )}

              <button
                onClick={() => setLockedModalStory(null)}
                className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-400 font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
