// src/components/mobile/MobileVeteransTab.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Volume2, Heart, Send, Sparkles } from 'lucide-react';

interface MobileVeteransTabProps {
  onPlayWitness: (name: string, role: string, transcript: string) => void;
}

export const MobileVeteransTab: React.FC<MobileVeteransTabProps> = ({ onPlayWitness }) => {
  const [incenseCount, setIncenseCount] = useState(1428);
  const [hasLitIncense, setHasLitIncense] = useState(false);
  const [tributeMessage, setTributeMessage] = useState('');
  const [tributes, setTributes] = useState([
    { user: 'Nguyễn Minh Anh (Sinh viên ĐHQG)', text: 'Chúng cháu đời đời biết ơn sự hy sinh của thế hệ cha ông!' },
    { user: 'Trần Quốc Bảo (TP.HCM)', text: 'Kính chúc các bác Cựu chiến binh luôn mạnh khỏe, bình an.' },
  ]);

  const handleLightIncense = () => {
    if (!hasLitIncense) {
      setIncenseCount((c) => c + 1);
      setHasLitIncense(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 50, 120]);
      }
    }
  };

  const handleSendTribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tributeMessage.trim()) return;
    setTributes((prev) => [{ user: 'Người Gìn Giữ Di Sản', text: tributeMessage.trim() }, ...prev]);
    setTributeMessage('');
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 pt-2 pb-28 space-y-4">
      {/* ĐÀI TƯỞNG NIỆM & THẮP NÉN TÂM NHANG */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#2A1215] via-[#141C2B] to-[#0B1320] border border-[#D4AF37]/50 text-center shadow-2xl overflow-hidden">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
          Không Gian Ký Ức Sống & Tri Ân
        </span>
        <h2 className="font-['Cinzel',serif] text-lg font-bold text-white mt-1">
          Ngọn Lửa Tri Ân Ngàn Đời
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Đã có <strong className="text-[#D4AF37]">{incenseCount.toLocaleString('vi-VN')}</strong> nén tâm nhang được thắp lên từ thế hệ trẻ.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLightIncense}
          className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
            hasLitIncense
              ? 'bg-[#D4AF37] text-[#0B1320] shadow-[0_0_25px_rgba(212,175,55,0.8)]'
              : 'bg-gradient-to-r from-[#8B2626] to-[#D4AF37] text-white shadow-lg'
          }`}
        >
          <Flame className="w-4 h-4 animate-bounce" />
          <span>{hasLitIncense ? 'Đã Dâng Nén Tâm Nhang Thành Kính' : 'Thắp Nén Tâm Nhang Tri Ân'}</span>
        </motion.button>
      </div>

      {/* DANH SÁCH NHÂN CHỨNG SỐNG */}
      <div className="space-y-2.5">
        <h3 className="font-['Cinzel',serif] text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
          Lời Dặn Dò Từ Nhân Chứng Lịch Sử
        </h3>

        {[
          {
            name: 'Đại tá Nguyễn Văn Tàu (Tư Cang)',
            role: 'Cụm trưởng Tình báo H.63 Anh hùng',
            quote: 'Hòa bình hôm nay được đánh đổi bằng xương máu của biết bao đồng đội. Các cháu hãy sống, học tập xứng đáng với non sông.',
          },
          {
            name: 'Bác Nguyễn Hữu Chấp',
            role: 'Chiến sĩ Điện Biên Phủ - Đại đoàn 316',
            quote: 'Giữa chiến hào bom đạn, điều giữ chúng tôi đứng vững chính là tình yêu Tổ quốc và niềm tin ngày mai đất nước độc lập.',
          },
        ].map((vet, i) => (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-[#121E31]/90 border border-[#D4AF37]/30 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white">{vet.name}</h4>
                <span className="text-[11px] text-[#D4AF37]">{vet.role}</span>
              </div>
              <button
                onClick={() => onPlayWitness(vet.name, vet.role, vet.quote)}
                className="px-2.5 py-1.5 rounded-xl bg-[#8B2626] text-white text-[11px] font-semibold flex items-center gap-1 border border-[#D4AF37]/40 shrink-0 active:scale-95 transition"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                Nghe Giọng Đọc
              </button>
            </div>
            <p className="text-xs text-gray-300 italic leading-relaxed">“{vet.quote}”</p>
          </div>
        ))}
      </div>

      {/* GỬI LỜI TRI ÂN */}
      <form onSubmit={handleSendTribute} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tributeMessage}
            onChange={(e) => setTributeMessage(e.target.value)}
            placeholder="Viết lời tri ân gửi đến các Cựu chiến binh..."
            className="flex-1 bg-[#070C15] border border-[#D4AF37]/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-[#D4AF37] text-[#0B1320] font-bold active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          {tributes.map((t, idx) => (
            <div key={idx} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="font-bold text-[#D4AF37]">{t.user}: </span>
              <span className="text-gray-200">{t.text}</span>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};
