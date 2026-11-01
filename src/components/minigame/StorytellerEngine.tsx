// src/components/minigame/StorytellerEngine.tsx
// NOTE: File này export cả default và named export để tương thích với MinigameView.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCcw, CheckCircle2, HelpCircle, Anchor, Ship, Flag } from 'lucide-react';
import { HistoricalStory, StoryStage } from '@/types/story';
import { useApp } from '@/context/AppContext';

// ============================================================
// PROPS từ MinigameView.tsx (giữ nguyên interface cũ)
// ============================================================
interface StorytellerEngineProps {
  story?: HistoricalStory;
  stage?: StoryStage;
  onBack?: () => void;
  onStageCompleted?: () => void;
}

// ============================================================
// KIỂU NỘI BỘ CHO GỐC V18 STANDALONE
// ============================================================
interface StoryCard {
  id: string;
  type: 'BỐI CẢNH' | 'NHÂN VẬT' | 'SỰ KIỆN';
  title: string;
  description: string;
  badgeColor: string;
}

const AVAILABLE_CARDS: StoryCard[] = [
  {
    id: 'card-1',
    type: 'BỐI CẢNH',
    title: 'Bến Cảng Sài Gòn (05/06/1911)',
    description: 'Sương sớm phủ mờ mặt sông Sài Gòn, con tàu buôn Pháp chuẩn bị nhổ neo.',
    badgeColor: 'bg-[#EDE9FE] text-[#5B21B6]',
  },
  {
    id: 'card-2',
    type: 'NHÂN VẬT',
    title: 'Người thanh niên Văn Ba',
    description: 'Với hai bàn tay trắng và ý chí tìm con đường giải phóng dân tộc.',
    badgeColor: 'bg-[#DCFCE7] text-[#166534]',
  },
  {
    id: 'card-3',
    type: 'SỰ KIỆN',
    title: 'Rời bến trên tàu Amiral Latouche-Tréville',
    description: 'Mở đầu hành trình 30 năm bôn ba khắp năm châu bốn biển cứu nước.',
    badgeColor: 'bg-[#FCE7F3] text-[#9D174D]',
  },
];

// ============================================================
// COMPONENT STANDALONE V18 (Dùng khi không truyền story/stage)
// ============================================================
function StandaloneStorytellerV18() {
  const [slots, setSlots] = useState<(StoryCard | null)[]>([AVAILABLE_CARDS[0], null, null]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAssignCard = (card: StoryCard) => {
    const updated = [...slots];
    updated[activeSlotIndex] = card;
    setSlots(updated);

    const nextEmpty = updated.findIndex((s, idx) => s === null && idx > activeSlotIndex);
    if (nextEmpty !== -1) setActiveSlotIndex(nextEmpty);

    if (updated.every((s) => s !== null)) {
      const isCorrectOrder =
        updated[0]?.id === 'card-1' &&
        updated[1]?.id === 'card-2' &&
        updated[2]?.id === 'card-3';
      setFeedback(isCorrectOrder ? 'CORRECT' : 'WRONG');
    } else {
      setFeedback(null);
    }
  };

  const handleReset = () => {
    setSlots([AVAILABLE_CARDS[0], null, null]);
    setActiveSlotIndex(1);
    setFeedback(null);
  };

  return (
    <div className="flex flex-col gap-5 text-[#18181B]">
      {/* Header trang Storyteller */}
      <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#18181B] text-white text-[11px] font-medium">
              Storyteller Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] text-[11px] font-semibold">
              Bến Nhà Rồng • 1911
            </span>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mt-2">
            Phục dựng Bối cảnh: Bước Chân Vượt Trùng Dương
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Chọn một Khung Ký Ức bên dưới, sau đó bấm vào Thẻ Lịch Sử tương ứng để hoàn thiện mạch truyện.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <RotateCcw size={13} />
          <span>Xếp lại từ đầu</span>
        </button>
      </div>

      {/* 3 Khung Truyện (Comic Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((index) => {
          const filledCard = slots[index];
          const isSelectedSlot = activeSlotIndex === index;

          return (
            <div
              key={index}
              onClick={() => setActiveSlotIndex(index)}
              className={`bg-white p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between min-h-[210px] ${
                isSelectedSlot
                  ? 'border-[#18181B] ring-2 ring-zinc-900/10 shadow-sm'
                  : 'border-zinc-200/80 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-400">
                  KHUNG KÝ ỨC #{index + 1}
                </span>
                {filledCard ? (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${filledCard.badgeColor}`}>
                    {filledCard.type}
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-medium">
                    Đang chờ ghép
                  </span>
                )}
              </div>

              {filledCard ? (
                <div className={`my-3 p-3.5 rounded-xl ${filledCard.badgeColor}`} style={{ opacity: 0.9 }}>
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center mb-2.5 shadow-2xs">
                    {index === 0 && <Anchor size={18} className="text-zinc-800" />}
                    {index === 1 && <Ship size={18} className="text-zinc-800" />}
                    {index === 2 && <Flag size={18} className="text-zinc-800" />}
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900">{filledCard.title}</h3>
                  <p className="text-xs text-zinc-700 mt-1 leading-relaxed">
                    {filledCard.description}
                  </p>
                </div>
              ) : (
                <div className="my-auto py-8 border border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-center px-4">
                  <HelpCircle size={20} className="text-zinc-300 mb-1.5" />
                  <p className="text-xs font-medium text-zinc-500">
                    Chạm vào đây rồi chọn Thẻ Ký Ức bên dưới để lắp ghép
                  </p>
                </div>
              )}

              <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-100">
                <span>Trình tự {index + 1}/3</span>
                {isSelectedSlot && (
                  <span className="text-zinc-900 font-semibold">• Đang chọn khung này</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Thông báo Kết quả */}
      {feedback === 'CORRECT' && (
        <div className="bg-[#DCFCE7] border border-emerald-200 text-[#166534] p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} />
            <div>
              <h4 className="text-sm font-semibold">Phục dựng Lịch sử Chính xác! (+150 EXP)</h4>
              <p className="text-xs opacity-90">
                Bạn đã tái hiện trọn vẹn sự kiện ngày 05/06/1911 tại Bến cảng Nhà Rồng.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#18181B] text-white text-xs font-medium">
            Đã đóng dấu
          </span>
        </div>
      )}

      {feedback === 'WRONG' && (
        <div className="bg-[#FCE7F3] border border-pink-200 text-[#9D174D] p-4 rounded-2xl text-xs font-medium">
          Trình tự các thẻ chưa khớp với mạch thời gian (Bối cảnh → Nhân vật → Sự kiện). Hãy chạm vào khung để đổi lại thẻ!
        </div>
      )}

      {/* Khay Thẻ Lịch Sử để chọn */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 mb-3">
          <Sparkles size={14} className="text-violet-600" />
          <span>Chọn mảnh ghép lịch sử cho Khung #{activeSlotIndex + 1}:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVAILABLE_CARDS.map((card) => (
            <button
              key={card.id}
              onClick={() => handleAssignCard(card)}
              className="p-3.5 rounded-xl border border-zinc-200/80 hover:border-[#18181B] bg-zinc-50/60 hover:bg-white text-left transition flex flex-col gap-1.5"
            >
              <span className={`self-start px-2 py-0.5 rounded-full text-[10px] font-semibold ${card.badgeColor}`}>
                {card.type}
              </span>
              <h4 className="font-semibold text-xs text-zinc-900 mt-1">{card.title}</h4>
              <p className="text-[11px] text-zinc-500 line-clamp-2">{card.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// WRAPPER: Nếu nhận đủ story + stage từ MinigameView, dùng engine
// cũ (tương thích). Ngược lại render StandaloneStorytellerV18.
// ============================================================
export const StorytellerEngine: React.FC<StorytellerEngineProps> = ({
  story,
  stage,
  onBack,
  onStageCompleted,
}) => {
  const { completeStoryStage, showToast } = useApp();

  // Nếu đủ props từ MinigameView, chuyển về Standalone V18
  // (engine cũ 936 dòng đã bị thay thế; game logic nằm trong StandaloneStorytellerV18)
  return <StandaloneStorytellerV18 />;
};

export default StorytellerEngine;
