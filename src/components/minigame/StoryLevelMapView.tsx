'use client';

import React from 'react';
import { HistoricalStory, StoryStage } from '@/types/story';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  ArrowLeft,
  Trophy,
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  MapPin,
  HelpCircle,
  Flag,
} from 'lucide-react';

interface StoryLevelMapViewProps {
  story: HistoricalStory;
  onBack: () => void;
  onSelectStage: (stage: StoryStage) => void;
}

export const StoryLevelMapView: React.FC<StoryLevelMapViewProps> = ({
  story,
  onBack,
  onSelectStage,
}) => {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#09111D] via-[#0E1A2C] to-[#122238] text-slate-100 select-none pb-24">
      {/* Ancient Dong Son Sun in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
        <DongSonSun size={500} opacity={0.15} />
      </div>

      {/* Decorative Cloud */}
      <div className="absolute top-16 right-0 pointer-events-none opacity-30 animate-pulse">
        <AncientCloudMotif color="#D4AF37" opacity={0.3} />
      </div>

      {/* TOP HEADER */}
      <div className="pt-14 px-4 pb-3 z-10 border-b border-amber-900/30 bg-[#09111D]/85 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-amber-200 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 active:scale-95 transition-all font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>Hub Cốt Truyện</span>
          </button>

          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest font-heritage">
            BƯỚC 2 · LEVEL MAP
          </span>
        </div>

        <div className="mt-3 space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>{story.locationName}</span>
          </div>
          <h1 className="text-base font-extrabold text-amber-100 font-heritage tracking-wide leading-snug">
            {story.title}
          </h1>
        </div>
      </div>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 z-10">
        {/* ========================================================= */}
        {/* 1. MINI-MAP ĐƯỜNG ĐI NỐI CÁC ĐIỂM MỐC (LEVEL MAP TRAIL) */}
        {/* ========================================================= */}
        <div className="p-4 rounded-2xl bg-[#0E1A2C]/90 border border-[#D4AF37]/40 shadow-xl space-y-3 relative overflow-hidden">
          {/* Subtle Top Gold Highlight */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFE082] to-transparent" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] font-heritage">
                Bản Đồ Hành Trình Ký Ức
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {story.stages.length} Điểm Mốc
            </span>
          </div>

          {/* Connected Milestones Trail Bar */}
          <div className="relative pt-2 pb-1 px-3">
            {/* Background Line */}
            <div className="absolute top-6 left-8 right-8 h-1 bg-slate-800 rounded-full" />
            
            {/* Active Progress Highlight Line */}
            <div
              className="absolute top-6 left-8 h-1 bg-gradient-to-r from-[#10B981] via-[#D4AF37] to-[#F59E0B] rounded-full transition-all duration-700"
              style={{
                width: `${
                  story.stages.length > 1
                    ? (Math.min(story.currentStage - 1, story.stages.length - 1) /
                        (story.stages.length - 1)) *
                      85
                    : 100
                }%`,
              }}
            />

            {/* Stage Milestone Nodes */}
            <div className="relative flex items-center justify-between z-10">
              {story.stages.map((stage, idx) => {
                const isCompleted = stage.stageNumber < story.currentStage || story.isCompleted;
                const isOpen = stage.stageNumber === story.currentStage && !story.isCompleted;
                const isLocked = stage.stageNumber > story.currentStage && !story.isCompleted;

                return (
                  <div key={stage.stageNumber} className="flex flex-col items-center group">
                    <button
                      onClick={() => !isLocked && onSelectStage(stage)}
                      disabled={isLocked}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-[0_0_12px_rgba(212,175,55,0.6)] ring-2 ring-amber-300 cursor-pointer hover:scale-110'
                          : isOpen
                          ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-slate-950 shadow-[0_0_18px_rgba(212,175,55,0.8)] ring-4 ring-[#FFE082]/50 animate-bounce cursor-pointer'
                          : 'bg-slate-900 border-2 border-slate-700 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? (
                        <Trophy className="w-4 h-4 fill-slate-950" />
                      ) : isOpen ? (
                        <Flag className="w-4 h-4 fill-slate-950 stroke-[2.5]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <span
                      className={`text-[10px] font-bold mt-1.5 font-heritage ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isOpen
                          ? 'text-[#FFE082]'
                          : 'text-slate-500'
                      }`}
                    >
                      Mốc 0{stage.stageNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DANH SÁCH CÁC MÀN CHƠI VỚI 3 TRẠNG THÁI RÕ RỆT */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-heritage flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              Chi Tiết Các Màn Chơi ({story.stages.length})
            </span>
          </div>

          {story.stages.map((stage) => {
            const isCompleted = stage.stageNumber < story.currentStage || story.isCompleted;
            const isOpen = stage.stageNumber === story.currentStage && !story.isCompleted;
            const isLocked = stage.stageNumber > story.currentStage && !story.isCompleted;

            if (isCompleted) {
              // ==========================================
              // TRẠNG THÁI 1: MÀN ĐÃ HOÀN THÀNH
              // ==========================================
              return (
                <div
                  key={stage.stageNumber}
                  className="p-4 rounded-2xl bg-[#0D1B2C]/90 border border-emerald-500/40 shadow-lg space-y-3 relative overflow-hidden group hover:border-emerald-400 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-md">
                        <Trophy className="w-4 h-4 fill-slate-950" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Màn 0{stage.stageNumber}
                        </span>
                        <h3 className="text-xs font-bold text-amber-100 font-heritage">
                          {stage.stageTitle}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>ĐÃ HOÀN THÀNH</span>
                    </span>
                  </div>

                  {/* Reward & Info */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-[11px] space-y-1">
                    <p className="text-slate-300 line-clamp-2">
                      {stage.synopsis}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[10px]">
                      <span className="text-emerald-300 font-medium">
                        ✓ Đã nhận: +{stage.rewardExp} EXP
                      </span>
                      {stage.rewardBadgeName && (
                        <span className="text-amber-300 font-medium flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" />
                          {stage.rewardBadgeName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Replay Button: CHƠI LẠI */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onSelectStage(stage)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-[#D4AF37]/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer font-heritage"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>CHƠI LẠI</span>
                    </button>
                  </div>
                </div>
              );
            } else if (isOpen) {
              // ==========================================
              // TRẠNG THÁI 2: MÀN ĐANG MỞ
              // ==========================================
              return (
                <div
                  key={stage.stageNumber}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#162740] via-[#102035] to-[#0A1626] border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)] space-y-3 relative overflow-hidden ring-2 ring-amber-400/40"
                >
                  <HeritageCornerDecoration color="#D4AF37" size={16} />

                  {/* Top Glowing Ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFE082] to-transparent animate-pulse" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F59E0B] text-slate-950 flex items-center justify-center shadow-md animate-pulse">
                        <Play className="w-4 h-4 fill-slate-950" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">
                          Màn 0{stage.stageNumber} · Thử Thách Hiện Tại
                        </span>
                        <h3 className="text-sm font-extrabold text-amber-100 font-heritage tracking-wide">
                          {stage.stageTitle}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#FFE082] border border-[#D4AF37]/60 flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span>ĐANG MỞ</span>
                    </span>
                  </div>

                  {/* Task Description */}
                  <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-xs text-slate-200 space-y-1.5">
                    <p className="font-semibold text-amber-200">
                      🎯 Nhiệm vụ: {stage.missionGoal}
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {stage.synopsis}
                    </p>
                    <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-200 flex items-start gap-1.5 mt-1">
                      <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{stage.clue}</span>
                    </div>
                  </div>

                  {/* Reward Preview */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] font-bold text-slate-400">Phần thưởng:</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-amber-300 text-[10px] font-bold border border-[#D4AF37]/40">
                        {stage.rewardBadgeName
                          ? `${stage.rewardBadgeName} + ${stage.rewardExp} EXP`
                          : `+${stage.rewardExp} EXP`}
                      </span>
                    </div>
                  </div>

                  {/* Big Play Button: BẮT ĐẦU CHƠI 🎮 */}
                  <button
                    onClick={() => onSelectStage(stage)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 font-black text-sm shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer font-heritage tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>BẮT ĐẦU CHƠI 🎮</span>
                  </button>
                </div>
              );
            } else {
              // ==========================================
              // TRẠNG THÁI 3: MÀN BỊ KHÓA
              // ==========================================
              return (
                <div
                  key={stage.stageNumber}
                  className="p-4 rounded-2xl bg-[#09111E]/80 border border-slate-800 opacity-60 grayscale space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Màn 0{stage.stageNumber}
                        </span>
                        <h3 className="text-xs font-bold text-slate-400 font-heritage">
                          {stage.stageTitle}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>BỊ KHÓA</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {stage.synopsis}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-amber-500/80 italic border-t border-slate-800/80">
                    <span>🔒 Hoàn thành Màn {stage.stageNumber - 1} để mở khóa</span>
                    <span className="text-slate-500">+{stage.rewardExp} EXP</span>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
