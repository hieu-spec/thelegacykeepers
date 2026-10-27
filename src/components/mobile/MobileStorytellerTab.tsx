// src/components/mobile/MobileStorytellerTab.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, Award } from 'lucide-react';
import { HeritageLocationItem } from './MobileHeritageShell';

interface StoryCard {
  id: string;
  title: string;
  type: 'setting' | 'character';
  icon: string;
  mood: 'heroic' | 'determined' | 'struggling';
  dialogue: string;
}

const STORY_CARDS: StoryCard[] = [
  {
    id: 'card-harbor',
    title: 'Bến Cảng Sài Gòn 1911',
    type: 'setting',
    icon: '⚓',
    mood: 'determined',
    dialogue: 'Sương sớm phủ mờ mặt sông, con tàu buôn Pháp chuẩn bị nhổ neo rời bến...',
  },
  {
    id: 'card-patriot',
    title: 'Người Thanh Niên Văn Ba',
    type: 'character',
    icon: '🚢',
    mood: 'heroic',
    dialogue: '“Tôi muốn đi ra nước ngoài, xem nước Pháp và các nước khác làm như thế nào...”',
  },
  {
    id: 'card-victory',
    title: 'Xe Tăng 390 Tiến Vào Dinh',
    type: 'character',
    icon: '🚩',
    mood: 'heroic',
    dialogue: 'Cánh cổng sắt đổ sập, lá cờ Giải phóng tung bay giữa trời trưa tháng Tư lịch sử!',
  },
];

export const MobileStorytellerTab: React.FC<{
  location: HeritageLocationItem;
  onPlayWitnessAudio: () => void;
}> = ({ location, onPlayWitnessAudio }) => {
  const [slots, setSlots] = useState<(StoryCard | null)[]>([STORY_CARDS[0], null]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(1);

  const isCompleted = slots.every((s) => s !== null);

  const handleSelectCard = (card: StoryCard) => {
    setSlots((prev) => {
      const next = [...prev];
      next[activeSlotIndex] = card;
      return next;
    });
    const nextEmpty = slots.findIndex((s, i) => s === null && i !== activeSlotIndex);
    if (nextEmpty !== -1) setActiveSlotIndex(nextEmpty);
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-2 pb-24 flex flex-col justify-between space-y-3">
      {/* Tiêu đề Màn chơi */}
      <div className="flex items-center justify-between bg-[#121E31]/90 px-3.5 py-2.5 rounded-2xl border border-[#D4AF37]/30">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
            Giải Đố Kể Chuyện Lịch Sử
          </span>
          <h2 className="font-['Cinzel',serif] text-sm font-bold text-white">{location.name}</h2>
        </div>
        <button
          onClick={() => {
            setSlots([null, null]);
            setActiveSlotIndex(0);
          }}
          className="p-2 rounded-xl bg-white/5 text-gray-300 border border-white/10 active:scale-95 transition"
          title="Chơi lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 2 KHUNG TRUYỆN TRANH LỊCH SỬ (COMIC PANELS) */}
      <div className="grid grid-cols-1 gap-3 flex-1">
        {[0, 1].map((idx) => {
          const card = slots[idx];
          const isFocused = activeSlotIndex === idx;

          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveSlotIndex(idx)}
              className={`relative p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[125px] cursor-pointer ${
                card
                  ? 'bg-gradient-to-br from-[#182842] to-[#0D1626] border-[#D4AF37]'
                  : isFocused
                  ? 'bg-[#111C2D]/80 border-dashed border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'bg-[#0B1320]/60 border-dashed border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 text-[#D4AF37]">
                  Khung Ký Ức #{idx + 1}
                </span>
                {card && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B2626] text-white font-semibold uppercase">
                    Tâm trạng: {card.mood === 'heroic' ? 'Hào Hùng' : 'Kiên Định'}
                  </span>
                )}
              </div>

              {card ? (
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-2xl shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{card.title}</h4>
                    <p className="text-[11px] text-amber-100/90 italic mt-0.5">
                      {card.dialogue}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center py-4">
                  <p className="text-xs text-[#D4AF37] font-medium">
                    Chạm vào đây rồi chọn Thẻ Ký Ức bên dưới để lắp ghép
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* THÔNG BÁO HOÀN THÀNH MÀN CHƠI */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-2xl bg-gradient-to-r from-[#8B2626] via-[#A93226] to-[#D4AF37] text-white shadow-xl flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-200 shrink-0" />
            <div>
              <p className="text-xs font-bold">Đã Khôi Phục Dòng Thời Gian Lịch Sử!</p>
              <p className="text-[11px] text-amber-100">+150 Điểm Di Sản • Mở khóa Lời kể Nhân chứng</p>
            </div>
          </div>
          <button
            onClick={onPlayWitnessAudio}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-[#0B1320] text-[#D4AF37] text-xs font-bold flex items-center gap-1 active:scale-95 transition"
          >
            <Volume2 className="w-3.5 h-3.5" /> Nghe
          </button>
        </motion.div>
      )}

      {/* KHAY THẺ BÀI LỊCH SỬ TRƯỢT NGANG (Dễ bấm bằng ngón cái) */}
      <div className="pt-1">
        <p className="text-[11px] text-gray-300 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Chọn mảnh ghép lịch sử cho Khung #{activeSlotIndex + 1}:</span>
        </p>
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {STORY_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => handleSelectCard(card)}
              className="shrink-0 w-40 p-2.5 rounded-2xl bg-[#131F33] hover:bg-[#1B2C47] active:scale-95 border border-[#D4AF37]/40 text-left transition-all flex items-center gap-2.5"
            >
              <span className="text-2xl">{card.icon}</span>
              <div className="min-w-0">
                <span className="text-[9px] uppercase text-[#D4AF37] font-bold block">
                  {card.type === 'setting' ? 'Bối cảnh' : 'Nhân vật'}
                </span>
                <p className="text-xs font-bold text-white truncate">{card.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
