'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HistoricalStory,
  StoryStage,
  StorytellerCard,
  StorytellerPanelState,
} from '@/types/story';
import { useApp } from '@/context/AppContext';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  Volume2,
  ChevronRight,
  HelpCircle,
  MapPin,
  Flame,
  Ship,
  Compass,
  Calendar,
  Hand,
  User,
  UserCheck,
  Building,
  Flag,
  Shield,
  ShieldAlert,
  Pickaxe,
  Box,
  Zap,
  Mic,
  Sun,
  FileText,
  Anchor,
  Globe,
  Lightbulb,
} from 'lucide-react';

interface StorytellerEngineProps {
  story: HistoricalStory;
  stage: StoryStage;
  onBack: () => void;
  onStageCompleted: () => void;
}

// Icon mapper for dynamic cards
const renderCardIcon = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Ship':
      return <Ship className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Hand':
      return <Hand className={className} />;
    case 'User':
      return <User className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'Flag':
      return <Flag className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Pickaxe':
      return <Pickaxe className={className} />;
    case 'Box':
      return <Box className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Anchor':
      return <Anchor className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Award':
      return <Award className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export const StorytellerEngine: React.FC<StorytellerEngineProps> = ({
  story,
  stage,
  onBack,
  onStageCompleted,
}) => {
  const { completeStoryStage, showToast, togglePlayAudio, locations } = useApp();

  // Panels state: Array of slots for each comic frame
  const [panels, setPanels] = useState<StorytellerPanelState[]>(() =>
    Array.from({ length: stage.targetSlotCount }, () => ({
      setting: null,
      characterOrItem: null,
    }))
  );

  // Active inventory tab: 'setting' or 'character_item'
  const [activeTab, setActiveTab] = useState<'setting' | 'character_item'>('setting');

  // Selected card for Tap-to-place interaction
  const [selectedCard, setSelectedCard] = useState<StorytellerCard | null>(null);

  // Dragging card state
  const [draggedCard, setDraggedCard] = useState<StorytellerCard | null>(null);

  // Modals & Overlays
  const [failureOverlay, setFailureOverlay] = useState<{
    isOpen: boolean;
    reason: string;
  }>({ isOpen: false, reason: '' });

  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  // Reset panels when stage changes
  useEffect(() => {
    setPanels(
      Array.from({ length: stage.targetSlotCount }, () => ({
        setting: null,
        characterOrItem: null,
      }))
    );
    setSelectedCard(null);
    setFailureOverlay({ isOpen: false, reason: '' });
    setIsVictoryModalOpen(false);
  }, [stage]);

  // Determine which cards are placed in panels
  const placedSettingIds = panels
    .map((p) => p.setting?.id)
    .filter((id): id is string => Boolean(id));

  const placedCharOrItemIds = panels
    .map((p) => p.characterOrItem?.id)
    .filter((id): id is string => Boolean(id));

  // Handle tap-to-place onto a specific panel slot
  const handlePanelSettingSlotClick = (panelIndex: number) => {
    if (selectedCard) {
      if (selectedCard.type === 'setting') {
        const nextPanels = [...panels];
        nextPanels[panelIndex] = {
          ...nextPanels[panelIndex],
          setting: selectedCard,
        };
        setPanels(nextPanels);
        setSelectedCard(null);
      } else {
        showToast(
          'Thẻ không phù hợp!',
          'Ô bối cảnh chỉ nhận thẻ Bối cảnh. Hãy chọn thẻ Bối cảnh từ khay.',
          'cinnabar'
        );
      }
    } else if (panels[panelIndex].setting) {
      // Remove setting from panel
      const nextPanels = [...panels];
      nextPanels[panelIndex] = {
        ...nextPanels[panelIndex],
        setting: null,
      };
      setPanels(nextPanels);
    }
  };

  const handlePanelCharSlotClick = (panelIndex: number) => {
    if (selectedCard) {
      if (selectedCard.type === 'character' || selectedCard.type === 'item') {
        const nextPanels = [...panels];
        nextPanels[panelIndex] = {
          ...nextPanels[panelIndex],
          characterOrItem: selectedCard,
        };
        setPanels(nextPanels);
        setSelectedCard(null);
      } else {
        showToast(
          'Thẻ không phù hợp!',
          'Ô nhân vật chỉ nhận thẻ Nhân vật hoặc Vật phẩm/Sự kiện.',
          'cinnabar'
        );
      }
    } else if (panels[panelIndex].characterOrItem) {
      // Remove char/item from panel
      const nextPanels = [...panels];
      nextPanels[panelIndex] = {
        ...nextPanels[panelIndex],
        characterOrItem: null,
      };
      setPanels(nextPanels);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (card: StorytellerCard) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSetting = (panelIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCard) return;
    if (draggedCard.type === 'setting') {
      const nextPanels = [...panels];
      nextPanels[panelIndex] = {
        ...nextPanels[panelIndex],
        setting: draggedCard,
      };
      setPanels(nextPanels);
    } else {
      showToast(
        'Sai loại thẻ!',
        'Kéo thẻ Bối cảnh vào ô nền của khung truyện.',
        'cinnabar'
      );
    }
    setDraggedCard(null);
  };

  const handleDropOnChar = (panelIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCard) return;
    if (draggedCard.type === 'character' || draggedCard.type === 'item') {
      const nextPanels = [...panels];
      nextPanels[panelIndex] = {
        ...nextPanels[panelIndex],
        characterOrItem: draggedCard,
      };
      setPanels(nextPanels);
    } else {
      showToast(
        'Sai loại thẻ!',
        'Kéo thẻ Nhân vật / Vật phẩm vào ô tương tác của khung truyện.',
        'cinnabar'
      );
    }
    setDraggedCard(null);
  };

  // Reset entire board to blank
  const handleResetBoard = () => {
    setPanels(
      Array.from({ length: stage.targetSlotCount }, () => ({
        setting: null,
        characterOrItem: null,
      }))
    );
    setSelectedCard(null);
    setFailureOverlay({ isOpen: false, reason: '' });
  };

  // Evaluate panel live reaction
  const getPanelReaction = (panelIndex: number, panelState: StorytellerPanelState) => {
    if (!panelState.setting && !panelState.characterOrItem) return null;

    const rule = stage.panelRules[panelIndex];
    if (!rule) return null;

    const isSettingCorrect = panelState.setting?.id === rule.requiredSettingId;
    const isCharCorrect =
      panelState.characterOrItem?.id === rule.requiredCharacterOrItemId;

    // Both correct: heroic / determined historical dialogue
    if (isSettingCorrect && isCharCorrect) {
      return {
        isMatch: true,
        reaction: rule.correctReaction,
      };
    }

    // Both placed but mismatch
    if (panelState.setting && panelState.characterOrItem) {
      return {
        isMatch: false,
        reaction: {
          characterName: panelState.characterOrItem.name,
          mood: 'confused' as const,
          dialogue: '❓ “Khoan đã! Bối cảnh này chưa đúng thời điểm hoặc sự kiện lịch sử!”',
          statusNote: 'Biểu cảm bối rối: Sự kiện và không gian chưa khớp nhau.',
        },
      };
    }

    return null;
  };

  // CHECK HISTORY (KIỂM TRA LỊCH SỬ)
  const handleVerifyHistory = () => {
    // 1. Check if all panels are filled
    const isCompletelyFilled = panels.every(
      (p) => p.setting !== null && p.characterOrItem !== null
    );

    if (!isCompletelyFilled) {
      showToast(
        'Chưa lấp đầy các khung truyện!',
        'Mỗi khung truyện cần đủ 1 Bối cảnh và 1 Nhân vật/Vật phẩm.',
        'cinnabar'
      );
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }

    // 2. Validate against stage panel rules
    let failReason = '';
    for (let i = 0; i < stage.panelRules.length; i++) {
      const rule = stage.panelRules[i];
      const panel = panels[i];

      if (panel.setting?.id !== rule.requiredSettingId) {
        failReason = rule.wrongExplanation;
        break;
      }
      if (panel.characterOrItem?.id !== rule.requiredCharacterOrItemId) {
        failReason = rule.wrongExplanation;
        break;
      }
    }

    if (failReason) {
      // FAILURE
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      setFailureOverlay({
        isOpen: true,
        reason: failReason,
      });
    } else {
      // SUCCESS!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F59E0B', '#10B981', '#FFFFFF'],
      });

      completeStoryStage(story.id, stage.stageNumber);
      setIsVictoryModalOpen(true);
    }
  };

  const linkedLocation = locations.find((l) => l.id === story.locationId);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#070D18] via-[#0B1526] to-[#0E1B30] text-slate-100 select-none pb-24">
      {/* Background Archival Photo with Blur and Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-full h-full object-cover filter blur-md scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D18]/90 via-[#0B1526]/85 to-[#0E1B30]" />
      </div>

      {/* Traditional Vietnamese Dong Son Motif in Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <DongSonSun size={520} opacity={0.15} />
      </div>

      {/* Traditional Ancient Cloud Motifs */}
      <div className="absolute top-14 left-2 pointer-events-none opacity-25 animate-pulse">
        <AncientCloudMotif color="#D4AF37" opacity={0.3} />
      </div>
      <div className="absolute top-28 right-2 pointer-events-none opacity-25 animate-pulse">
        <AncientCloudMotif color="#D4AF37" opacity={0.3} />
      </div>

      {/* TOP HEADER: NAVIGATION & TITLE */}
      <div className="pt-14 px-4 pb-2 z-20 border-b border-amber-900/40 bg-[#070D18]/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-amber-200/90 hover:text-white px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Màn chơi</span>
          </button>

          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest font-heritage">
            Hồi {stage.stageNumber} / {story.totalStages}
          </span>

          <button
            onClick={handleResetBoard}
            className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700 active:scale-95 transition-all"
            title="Xóa trắng bảng để xếp lại"
          >
            <RotateCcw className="w-3 h-3 text-amber-400" />
            <span>Đặt lại</span>
          </button>
        </div>

        {/* MISSION GOAL BANNER (TIÊU ĐỀ NHIỆM VỤ TRÊN CÙNG) */}
        <div className="mt-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-950/70 via-[#1C160F] to-amber-950/70 border border-[#D4AF37]/50 shadow-md space-y-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] font-heritage">
              Mục Tiêu Tái Hiện
            </span>
          </div>
          <p className="text-xs font-bold text-amber-100 font-heritage tracking-wide leading-snug">
            {stage.missionGoal}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-amber-300/80 italic pt-0.5">
            <HelpCircle className="w-3 h-3 text-[#D4AF37] shrink-0" />
            <span className="truncate">{stage.clue}</span>
          </div>
        </div>
      </div>

      {/* MAIN COMIC STRIP SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 z-10">
        {/* ========================================================= */}
        {/* COMIC STRIP PANELS (3-4 Ô KHUNG TRUYỆN TRỐNG ĐÁNH SỐ) */}
        {/* ========================================================= */}
        <motion.div
          animate={shakeError ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-300 px-1 font-heritage">
            <span className="text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Khung Truyện Ký Ức (Trái qua phải)
            </span>
            <span className="text-[10px] text-slate-400 font-sans">
              Chạm hoặc Kéo-thả thẻ bài
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {panels.map((panel, idx) => {
              const reaction = getPanelReaction(idx, panel);

              return (
                <div
                  key={idx}
                  className={`relative rounded-2xl border-2 transition-all overflow-hidden shadow-xl ${
                    reaction?.isMatch
                      ? 'border-[#D4AF37] bg-[#122238]/90 ring-1 ring-[#FFE082]/50'
                      : panel.setting && panel.characterOrItem
                      ? 'border-amber-500/70 bg-[#151D2A]/90'
                      : 'border-slate-700/80 bg-slate-900/60'
                  }`}
                >
                  {/* Traditional Corner Motif */}
                  <HeritageCornerDecoration color="#D4AF37" size={14} />

                  {/* Panel Number Badge */}
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-[#FFE082] text-[10px] font-black font-heritage border border-[#D4AF37]/50 shadow-md">
                      KHUNG 0{idx + 1}
                    </span>
                    {reaction?.isMatch && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 text-[9px] font-black shadow-sm flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Ăn Khớp
                      </span>
                    )}
                  </div>

                  {/* Dynamic Scene Backdrop Area (Setting Slot) */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSetting(idx, e)}
                    onClick={() => handlePanelSettingSlotClick(idx)}
                    className={`relative min-h-[92px] p-3 flex flex-col justify-end transition-all cursor-pointer ${
                      panel.setting
                        ? `bg-gradient-to-br ${
                            panel.setting.bgGradient || 'from-amber-950 via-[#1C160F] to-[#0A0D15]'
                          }`
                        : selectedCard?.type === 'setting'
                        ? 'border-2 border-dashed border-[#D4AF37]/70 bg-[#D4AF37]/10 animate-pulse'
                        : 'border border-dashed border-slate-700/60 bg-black/40 hover:bg-black/60'
                    }`}
                  >
                    {/* Setting Details */}
                    {panel.setting ? (
                      <div className="z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-black/60 border border-[#D4AF37]/50 flex items-center justify-center text-amber-300">
                            {renderCardIcon(panel.setting.iconName, 'w-3.5 h-3.5')}
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">
                              Bối Cảnh
                            </span>
                            <h4 className="text-xs font-bold text-amber-100 font-heritage">
                              {panel.setting.name}
                            </h4>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 underline">
                          (Chạm để đổi)
                        </span>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-400">
                        <p className="text-xs font-bold text-slate-300">
                          {selectedCard?.type === 'setting'
                            ? '👉 Chạm vào đây để đặt Bối Cảnh'
                            : '+ Đặt Bối Cảnh cho Khung 0' + (idx + 1)}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Kéo hoặc chạm thẻ từ Tab Bối cảnh
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Character & Reaction Area (Character / Item Slot) */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnChar(idx, e)}
                    onClick={() => handlePanelCharSlotClick(idx)}
                    className={`p-3 border-t border-slate-800/80 transition-all cursor-pointer ${
                      panel.characterOrItem
                        ? 'bg-[#0E1A2C]/90'
                        : selectedCard?.type === 'character' || selectedCard?.type === 'item'
                        ? 'border-2 border-dashed border-amber-400/70 bg-amber-400/10 animate-pulse'
                        : 'bg-black/20 hover:bg-black/40'
                    }`}
                  >
                    {panel.characterOrItem ? (
                      <div className="space-y-2">
                        {/* Character Tag and Name */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                              {renderCardIcon(panel.characterOrItem.iconName, 'w-3.5 h-3.5')}
                            </div>
                            <div>
                              <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider block">
                                {panel.characterOrItem.tag || 'Nhân vật / Sự kiện'}
                              </span>
                              <h4 className="text-xs font-bold text-amber-100 font-heritage">
                                {panel.characterOrItem.name}
                              </h4>
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-400 underline">
                            (Chạm để đổi)
                          </span>
                        </div>

                        {/* LIVE CHARACTER REACTION & SPEECH BUBBLE */}
                        {reaction && (
                          <div
                            className={`p-2.5 rounded-xl border text-xs leading-relaxed space-y-1 relative ${
                              reaction.isMatch
                                ? 'bg-amber-950/60 border-[#D4AF37]/50 text-amber-100 shadow-sm'
                                : 'bg-red-950/40 border-red-500/40 text-red-200'
                            }`}
                          >
                            {/* Dialogue Bubble */}
                            <p className="font-medium italic leading-snug">
                              {reaction.reaction.dialogue}
                            </p>
                            <p className="text-[10px] text-amber-300/80 font-normal border-t border-amber-500/20 pt-1">
                              {reaction.reaction.statusNote}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-2 text-slate-400">
                        <p className="text-xs font-semibold text-slate-300">
                          {selectedCard?.type === 'character' || selectedCard?.type === 'item'
                            ? '👉 Chạm vào đây để đặt Nhân vật / Vật phẩm'
                            : '+ Đặt Nhân vật hoặc Vật phẩm'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* KHAY THẺ BÀI (CARD INVENTORY - PHÍA DƯỚI) */}
        {/* ========================================================= */}
        <div className="space-y-2 pt-2">
          {/* Inventory Tab Switcher */}
          <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('setting');
                setSelectedCard(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-heritage ${
                activeTab === 'setting'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tab Bối Cảnh ({stage.availableSettings.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('character_item');
                setSelectedCard(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 font-heritage ${
                activeTab === 'character_item'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Nhân Vật & Sự Kiện ({stage.availableCharactersAndItems.length})</span>
            </button>
          </div>

          {/* Cards List Horizontal Scroll / Grid */}
          <div className="space-y-2">
            {activeTab === 'setting' ? (
              <div className="grid grid-cols-1 gap-2">
                {stage.availableSettings.map((card) => {
                  const isPlaced = placedSettingIds.includes(card.id);
                  const isSelected = selectedCard?.id === card.id;

                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card)}
                      onClick={() =>
                        setSelectedCard(isSelected ? null : card)
                      }
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                        isSelected
                          ? 'border-2 border-[#FFE082] bg-[#1B2F4C] shadow-[0_0_15px_rgba(255,224,130,0.5)] ring-2 ring-[#FFE082]'
                          : isPlaced
                          ? 'border-slate-800 bg-[#0B1422]/60 opacity-60'
                          : 'border-slate-700/80 bg-[#0E1A2C] hover:border-[#D4AF37]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                          {renderCardIcon(card.iconName, 'w-4 h-4')}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-amber-100 font-heritage">
                            {card.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {card.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px]">
                        {isPlaced ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-semibold">
                            Đã đặt
                          </span>
                        ) : isSelected ? (
                          <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-slate-950 font-bold animate-pulse">
                            Đã chọn
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">
                            Chạm để chọn
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {stage.availableCharactersAndItems.map((card) => {
                  const isPlaced = placedCharOrItemIds.includes(card.id);
                  const isSelected = selectedCard?.id === card.id;

                  return (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card)}
                      onClick={() =>
                        setSelectedCard(isSelected ? null : card)
                      }
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                        isSelected
                          ? 'border-2 border-amber-400 bg-[#1B2F4C] shadow-[0_0_15px_rgba(251,191,36,0.5)] ring-2 ring-amber-400'
                          : isPlaced
                          ? 'border-slate-800 bg-[#0B1422]/60 opacity-60'
                          : 'border-slate-700/80 bg-[#0E1A2C] hover:border-amber-400/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                          {renderCardIcon(card.iconName, 'w-4 h-4')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-amber-100 font-heritage">
                              {card.name}
                            </h4>
                            {card.tag && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-amber-300 border border-slate-700">
                                {card.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {card.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[10px]">
                        {isPlaced ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-semibold">
                            Đã đặt
                          </span>
                        ) : isSelected ? (
                          <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-slate-950 font-bold animate-pulse">
                            Đã chọn
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">
                            Chạm để chọn
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CHECK HISTORY BUTTON (KIỂM TRA LỊCH SỬ) */}
        {/* ========================================================= */}
        <div className="pt-2">
          <button
            onClick={handleVerifyHistory}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all cursor-pointer font-heritage tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4 fill-slate-950" />
            <span>KIỂM TRA LỊCH SỬ</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* OVERLAY THẤT BẠI: LỊCH SỬ CHƯA ĐƯỢC TÁI HIỆN CHÍNH XÁC */}
      {/* ========================================================= */}
      <AnimatePresence>
        {failureOverlay.isOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#2B1015] via-[#1C0D12] to-[#12070A] border-2 border-red-500/80 p-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] text-center space-y-4 relative overflow-hidden"
            >
              {/* Red glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-500/30 blur-2xl rounded-full" />

              {/* Error Icon */}
              <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/40 ring-4 ring-red-500/20">
                <XCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-heritage block">
                  Trật Tự Thời Gian Chưa Khớp
                </span>
                <h3 className="text-base font-extrabold text-red-100 font-heritage tracking-wide mt-1">
                  THẤT BẠI - Lịch sử chưa được tái hiện chính xác!
                </h3>
              </div>

              {/* Explanation of error */}
              <div className="p-3 rounded-2xl bg-black/60 border border-red-500/30 text-left space-y-1">
                <span className="text-[10px] font-bold text-red-300 uppercase flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-red-400" />
                  Gợi Ý Khắc Phục:
                </span>
                <p className="text-xs text-red-200 leading-relaxed">
                  {failureOverlay.reason}
                </p>
              </div>

              {/* Mandatory Reset Button: LÀM LẠI TỪ ĐẦU */}
              <div className="pt-2">
                <button
                  onClick={handleResetBoard}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 active:scale-95 transition-all font-heritage tracking-wider"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>LÀM LẠI TỪ ĐẦU</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* OVERLAY HOÀN THÀNH XUẤT SẮC (VICTORY MODAL) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isVictoryModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#13253F] via-[#0E1A2C] to-[#0A1320] border-2 border-[#D4AF37] rounded-3xl p-5 shadow-[0_0_50px_rgba(212,175,55,0.4)] text-center space-y-4 relative overflow-hidden"
            >
              <HeritageCornerDecoration color="#D4AF37" size={18} />

              {/* Gold Top Light Aura */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#D4AF37]/35 blur-2xl rounded-full" />

              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-[#D4AF37]/50 ring-4 ring-[#FFE082]/40">
                <Award className="w-8 h-8 fill-slate-950" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFE082] font-heritage block">
                  Phục Dựng Ký Ức Thành Công!
                </span>
                <h3 className="text-base font-extrabold text-amber-100 font-heritage tracking-wide mt-1">
                  HOÀN THÀNH XUẤT SẮC!
                </h3>
              </div>

              {/* Full Historical Story Recap */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-[#D4AF37]/40 text-left space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#F59E0B] flex items-center gap-1 font-heritage">
                  <BookOpen className="w-3.5 h-3.5" />
                  {stage.fullStoryRecap.headline}
                </span>

                {stage.fullStoryRecap.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="text-xs text-slate-200 leading-relaxed text-justify">
                    {para}
                  </p>
                ))}

                {stage.fullStoryRecap.quote && (
                  <div className="pt-2 border-t border-amber-500/20">
                    <p className="text-xs italic text-amber-200 font-serif">
                      {stage.fullStoryRecap.quote}
                    </p>
                    {stage.fullStoryRecap.author && (
                      <p className="text-[10px] text-slate-400 text-right mt-0.5">
                        — {stage.fullStoryRecap.author}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* EXP & Badge Rewards */}
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-amber-300">
                  +{stage.rewardExp} EXP Danh Dự
                </div>
                {stage.rewardBadgeName && (
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300">
                    🏆 {stage.rewardBadgeName}
                  </div>
                )}
              </div>

              {/* Audio Witness Button */}
              {linkedLocation && (
                <button
                  onClick={() => togglePlayAudio(linkedLocation.witnessStory)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-amber-200 font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Nghe Lời Kể Nhân Chứng Lịch Sử</span>
                </button>
              )}

              {/* Next Action Button */}
              <button
                onClick={() => {
                  setIsVictoryModalOpen(false);
                  onStageCompleted();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 font-black text-xs shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 font-heritage tracking-wider"
              >
                <span>TIẾP TỤC HÀNH TRÌNH</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
