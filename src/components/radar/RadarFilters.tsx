'use client';

import React from 'react';
import { LocationRarity, LocationContentType } from '@/types/location';
import {
  Sparkles,
  Flag,
  Flame,
  Landmark,
  SlidersHorizontal,
  BookOpen,
  Radio,
  Swords,
  Scroll,
} from 'lucide-react';

interface RadarFiltersProps {
  selectedRarity: LocationRarity | 'all';
  onSelectRarity: (rarity: LocationRarity | 'all') => void;
  selectedContentType: LocationContentType | 'all';
  onSelectContentType: (type: LocationContentType | 'all') => void;
}

export const RadarFilters: React.FC<RadarFiltersProps> = ({
  selectedRarity,
  onSelectRarity,
  selectedContentType,
  onSelectContentType,
}) => {
  // 4 Rarity options
  const rarityOptions: {
    id: LocationRarity | 'all';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    { id: 'all', label: 'Tất cả độ hiếm', icon: SlidersHorizontal, accentColor: 'border-slate-700' },
    { id: 'legendary', label: 'Huyền thoại', icon: Sparkles, accentColor: 'border-[#D4AF37] text-amber-300' },
    { id: 'event', label: 'Sự kiện', icon: Flag, accentColor: 'border-red-500 text-red-300' },
    { id: 'uncommon', label: 'Hiếm', icon: Flame, accentColor: 'border-emerald-500 text-emerald-300' },
    { id: 'common', label: 'Thường', icon: Landmark, accentColor: 'border-[#8C6239] text-[#D9B38C]' },
  ];

  // 5 Content Type options per Phase 2 requirements
  const contentTypeOptions: {
    id: LocationContentType | 'all';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isFocus?: boolean;
  }[] = [
    { id: 'all', label: 'Tất cả loại hình', icon: SlidersHorizontal },
    { id: 'landmark', label: '1. Địa danh & Di tích', icon: Landmark },
    { id: 'story', label: '2. Câu chuyện & Ký ức', icon: BookOpen },
    { id: 'witness', label: '3. Nhân chứng (Trọng tâm)', icon: Radio, isFocus: true },
    { id: 'battlefield', label: '4. Chiến dịch', icon: Swords },
    { id: 'culture', label: '5. Văn hóa', icon: Scroll },
  ];

  return (
    <div className="w-full space-y-2 select-none">
      {/* 5 Content Types Horizontal Filter (With Witness as primary focus) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {contentTypeOptions.map((opt) => {
          const isActive = selectedContentType === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectContentType(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-tight whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? opt.isFocus
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] text-slate-950 font-extrabold border-[#FFE082] shadow-[0_0_15px_rgba(212,175,55,0.6)] ring-1 ring-[#FFE082]'
                    : 'bg-[#162A45] text-amber-200 border-[#D4AF37] font-bold shadow-md'
                  : opt.isFocus
                  ? 'bg-[#0E1C30] text-[#D4AF37] border-[#D4AF37]/60 hover:bg-[#142845] font-semibold ring-1 ring-[#D4AF37]/30'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  opt.isFocus && !isActive ? 'text-red-400 animate-pulse' : ''
                }`}
              />
              <span>{opt.label}</span>
              {opt.isFocus && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Rarity Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {rarityOptions.map((opt) => {
          const isActive = selectedRarity === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectRarity(opt.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-tight whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-[#D4AF37] text-slate-950 font-bold border-[#FFE082] shadow-sm'
                  : `bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 ${opt.accentColor}`
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
