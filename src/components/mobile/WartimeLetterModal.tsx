// src/components/mobile/WartimeLetterModal.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, BookmarkCheck, Sparkles, X } from 'lucide-react';
import { WartimeArtifact } from '@/data/wartimeLoot';

interface WartimeLetterModalProps {
  artifact: WartimeArtifact | null;
  onClose: () => void;
  onReadAloud: (artifact: WartimeArtifact) => void;
}

export const WartimeLetterModal: React.FC<WartimeLetterModalProps> = ({
  artifact,
  onClose,
  onReadAloud,
}) => {
  if (!artifact) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 25 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        className="relative w-full max-w-sm rounded-3xl p-5 bg-gradient-to-b from-[#F5E6C8] via-[#EAD2A8] to-[#DEC08F] text-[#2C1A11] border-4 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.65)] overflow-hidden"
      >
        {/* Nhãn độ hiếm */}
        <div className="flex items-center justify-between border-b border-[#8B2626]/30 pb-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8B2626] text-[#F5E6C8] text-[10px] font-extrabold uppercase">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Kỷ Vật {artifact.rarity} • {artifact.year}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#2C1A11]/10 flex items-center justify-center text-[#2C1A11]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tiêu đề bức thư */}
        <div className="mt-3 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#8B2626] border-2 border-[#D4AF37] flex items-center justify-center text-3xl shadow-md shrink-0">
            {artifact.icon}
          </div>
          <div>
            <h3 className="font-['Cinzel',serif] text-base font-extrabold text-[#6E1414] leading-snug">
              {artifact.name}
            </h3>
            <p className="text-xs font-bold text-[#4A2E1B] mt-0.5">
              Người viết: {artifact.author}
            </p>
            <p className="text-[11px] italic text-[#6B442A]">{artifact.recipient}</p>
          </div>
        </div>

        {/* Nội dung bức thư trên nền giấy cổ */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-[#FFF9ED]/80 border border-[#8B2626]/25 shadow-inner max-h-52 overflow-y-auto">
          <p className="text-xs leading-relaxed font-serif italic text-[#2C1A11]">
            “{artifact.fullLetterContent}”
          </p>
        </div>

        {/* Nút Nghe Giọng Đọc Bức Thư & Cất vào Hành Trang */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={() => onReadAloud(artifact)}
            className="py-2.5 px-3 rounded-xl bg-[#8B2626] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Đọc Thư (TTS)</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-[#16243B] text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#D4AF37] shadow-md active:scale-95"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Cất Vào Túi Đồ</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
