'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoricalStory, StoryStage, StoryFragment } from '@/types/story';
import { useApp } from '@/context/AppContext';
import { FragmentPiece } from './FragmentPiece';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Award,
  ChevronRight,
  BookOpen,
  Volume2,
} from 'lucide-react';

interface StoryBoardProps {
  story: HistoricalStory;
  onBack: () => void;
}

export const StoryBoard: React.FC<StoryBoardProps> = ({ story, onBack }) => {
  const { completeStoryStage, showToast, togglePlayAudio, locations } = useApp();

  const currentStageIndex = Math.min(story.currentStage - 1, story.stages.length - 1);
  const stage: StoryStage = story.stages[currentStageIndex];

  // State: placed fragments in slots [slot0, slot1, slot2]
  const [slots, setSlots] = useState<(StoryFragment | null)[]>([null, null, null]);
  const [selectedInventoryFragment, setSelectedInventoryFragment] = useState<StoryFragment | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [isErrorShake, setIsErrorShake] = useState<boolean>(false);

  // Reset slots when stage changes
  useEffect(() => {
    setSlots(new Array(stage.targetSlotCount).fill(null));
    setSelectedInventoryFragment(null);
    setIsVictoryModalOpen(false);
  }, [stage]);

  // Inventory fragments that are not yet placed
  const placedIds = slots.filter((s): s is StoryFragment => s !== null).map((s) => s.id);
  const availableFragments = (stage.fragments || []).filter((f) => !placedIds.includes(f.id));

  // Handle placing fragment into a slot
  const handleSlotClick = (index: number) => {
    if (selectedInventoryFragment) {
      const nextSlots = [...slots];
      nextSlots[index] = selectedInventoryFragment;
      setSlots(nextSlots);
      setSelectedInventoryFragment(null);
    } else if (slots[index]) {
      // Remove from slot back to inventory
      const nextSlots = [...slots];
      nextSlots[index] = null;
      setSlots(nextSlots);
    }
  };

  const handleFragmentClick = (fragment: StoryFragment) => {
    if (selectedInventoryFragment?.id === fragment.id) {
      setSelectedInventoryFragment(null);
      return;
    }

    // Auto-place into first empty slot if available
    const firstEmptyIndex = slots.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      const nextSlots = [...slots];
      nextSlots[firstEmptyIndex] = fragment;
      setSlots(nextSlots);
      setSelectedInventoryFragment(null);
    } else {
      setSelectedInventoryFragment(fragment);
    }
  };

  const handleResetSlots = () => {
    setSlots(new Array(stage.targetSlotCount).fill(null));
    setSelectedInventoryFragment(null);
  };

  const handleVerify = () => {
    setIsVerifying(true);

    const isFull = slots.every((s) => s !== null);
    if (!isFull) {
      showToast('Chưa đủ mảnh ghép!', 'Hãy lấp đầy các ô mốc thời gian trước khi kiểm tra.', 'cinnabar');
      setIsVerifying(false);
      return;
    }

    const currentSequence = slots.map((s) => s!.id);
    const isCorrect = (stage.correctSequence || []).every((id, idx) => id === currentSequence[idx]);

    if (isCorrect) {
      // Trigger confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF'],
      });

      completeStoryStage(story.id, stage.stageNumber);
      setIsVictoryModalOpen(true);
    } else {
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 600);
      showToast(
        'Thứ tự chưa chính xác!',
        'Hãy đọc kỹ gợi ý manh mối và suy ngẫm lại diễn tiến thời gian.',
        'cinnabar'
      );
    }

    setIsVerifying(false);
  };

  // Find linked location for quick witness audio
  const linkedLocation = locations.find((l) => l.id === story.locationId);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#0B1320] via-[#0E1726] to-[#111C2D] text-slate-100 select-none pb-20">
      {/* Top Header Bar */}
      <div className="pt-16 px-4 pb-2 z-10 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-amber-200/90 hover:text-white p-1 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách câu chuyện</span>
        </button>

        <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] font-heritage">
          Hồi {stage.stageNumber} / {story.totalStages}
        </span>
      </div>

      {/* Main Board Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Story Title & Clue Card */}
        <div className="p-3.5 rounded-2xl bg-[#111E33]/90 border border-[#D4AF37]/30 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
              {story.locationName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              +{stage.rewardExp} EXP
            </span>
          </div>

          <h3 className="text-sm font-bold text-amber-100 font-heritage tracking-wide">
            {stage.stageTitle}
          </h3>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {stage.synopsis}
          </p>

          {/* Clue Box */}
          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <p className="italic leading-snug">
              <strong className="text-[#D4AF37] not-italic">Manh mối: </strong>
              {stage.clue}
            </p>
          </div>
        </div>

        {/* Chronological Slots Area (Dòng thời gian phục dựng) */}
        <motion.div
          animate={isErrorShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-[#D4AF37] uppercase tracking-wider text-[10px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Dòng Thời Gian Phục Dựng (Trái qua phải / Trên xuống dưới)
            </span>
            <button
              onClick={handleResetSlots}
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Đặt lại
            </button>
          </div>

          <div className="space-y-2">
            {slots.map((placedFragment, idx) => (
              <div
                key={idx}
                onClick={() => handleSlotClick(idx)}
                className={`relative min-h-[78px] rounded-2xl border-2 transition-all p-2 flex items-center ${
                  placedFragment
                    ? 'border-[#D4AF37] bg-[#122238]/90 shadow-md cursor-pointer'
                    : selectedInventoryFragment
                    ? 'border-[#D4AF37]/70 border-dashed bg-[#D4AF37]/5 cursor-pointer animate-pulse'
                    : 'border-slate-800 border-dashed bg-slate-900/40 text-slate-500'
                }`}
              >
                {/* Slot Order Number Watermark */}
                <span className="absolute right-3 top-2 text-2xl font-black text-slate-800/40 select-none pointer-events-none font-heritage">
                  0{idx + 1}
                </span>

                {placedFragment ? (
                  <div className="w-full pr-8">
                    <FragmentPiece
                      fragment={placedFragment}
                      isPlaced
                      onClick={() => handleSlotClick(idx)}
                    />
                  </div>
                ) : (
                  <div className="w-full text-center py-2">
                    <p className="text-xs font-semibold text-slate-400">
                      Ô Mốc Thời Gian 0{idx + 1}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {selectedInventoryFragment
                        ? '👉 Chạm vào đây để đặt mảnh ghép'
                        : 'Chọn mảnh ghép bên dưới để lấp đầy'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fragment Inventory (Kho mảnh ghép chưa đặt) */}
        <div className="space-y-2 pt-1">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] px-1">
            Mảnh ghép khả dụng ({availableFragments.length})
          </span>

          {availableFragments.length === 0 ? (
            <div className="p-3 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              Tất cả mảnh ghép đã được xếp vào dòng thời gian. Nhấn nút kiểm tra!
            </div>
          ) : (
            <div className="space-y-2">
              {availableFragments.map((frag) => (
                <FragmentPiece
                  key={frag.id}
                  fragment={frag}
                  isSelected={selectedInventoryFragment?.id === frag.id}
                  onClick={() => handleFragmentClick(frag)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Verification Check Button */}
        <div className="pt-2">
          <button
            onClick={handleVerify}
            disabled={slots.some((s) => s === null) || isVerifying}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
              slots.every((s) => s !== null)
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 cursor-pointer'
                : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 fill-current" />
            Kiểm Tra Dòng Lịch Sử
          </button>
        </div>
      </div>

      {/* Victory Celebration Modal Overlay */}
      <AnimatePresence>
        {isVictoryModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#13253F] to-[#0B1524] border-2 border-[#D4AF37] rounded-3xl p-5 shadow-2xl text-center space-y-4 relative overflow-hidden"
            >
              {/* Gold Top Light Aura */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#D4AF37]/30 blur-2xl rounded-full" />

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-[#D4AF37]/40 ring-4 ring-[#FFE082]/30">
                <Award className="w-8 h-8 fill-slate-950" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  Phục Dựng Ký Ức Thành Công!
                </span>
                <h3 className="text-base font-extrabold text-amber-100 font-heritage tracking-wide mt-1">
                  {stage.stageTitle}
                </h3>
              </div>

              {/* Historical Lesson */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-[#D4AF37]/30 text-left space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#F59E0B] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Bài học Lịch sử
                </span>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  “{stage.historicalLesson}”
                </p>
              </div>

              {/* EXP & Badge Rewards */}
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-amber-300">
                  +{stage.rewardExp} EXP Danh Dự
                </div>
                {stage.rewardBadgeId && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300">
                    🏆 Mở Khóa Huy Hiệu
                  </div>
                )}
              </div>

              {/* Listen to Witness Story Button */}
              {linkedLocation && (
                <button
                  onClick={() => togglePlayAudio(linkedLocation.witnessStory)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-amber-200 font-medium flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Nghe Lời Kể Nhân Chứng của Di tích này
                </button>
              )}

              {/* Next Action Button */}
              <button
                onClick={() => {
                  setIsVictoryModalOpen(false);
                  if (story.currentStage < story.totalStages) {
                    // Stage progresses
                  } else {
                    onBack();
                  }
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2"
              >
                {story.currentStage < story.totalStages ? (
                  <>
                    <span>Tiếp tục Hồi tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>Trở về Danh mục Truyện</span>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
