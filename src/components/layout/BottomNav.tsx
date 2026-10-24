'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp, AppTab } from '@/context/AppContext';
import { Puzzle, Radar, User, Compass } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const isProfile = currentTab === 'profile';

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto">
      {/* Background bar container */}
      <div
        className={`relative px-6 pt-2 pb-5 border-t transition-colors duration-300 ${
          isProfile
            ? 'bg-[#FAF6F0]/95 backdrop-blur-lg border-[#EADBCE] shadow-[0_-10px_25px_rgba(139,38,38,0.06)]'
            : 'bg-[#0B1320]/95 backdrop-blur-xl border-[#D4AF37]/25 shadow-[0_-10px_30px_rgba(0,0,0,0.7)]'
        }`}
      >
        {/* Curved Top Accent Glow Line */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1.5px] ${
            isProfile
              ? 'bg-gradient-to-r from-transparent via-[#8B2626]/40 to-transparent'
              : 'bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent'
          }`}
        />

        <div className="flex items-center justify-around relative">
          {/* TAB 1: Minigame */}
          <button
            onClick={() => setCurrentTab('minigame')}
            className="flex flex-col items-center justify-center py-1 px-4 relative group"
            aria-label="Chuyển đến màn chơi Minigame"
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-200 ${
                currentTab === 'minigame'
                  ? isProfile
                    ? 'text-[#8B2626] bg-[#8B2626]/10 scale-110'
                    : 'text-[#D4AF37] bg-[#D4AF37]/15 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : isProfile
                  ? 'text-stone-500 group-hover:text-stone-800'
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <Puzzle className="w-5 h-5" />
            </div>
            <span
              className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                currentTab === 'minigame'
                  ? isProfile
                    ? 'text-[#8B2626] font-bold'
                    : 'text-amber-200 font-bold'
                  : isProfile
                  ? 'text-stone-500'
                  : 'text-slate-400'
              }`}
            >
              Mảnh Ghép
            </span>
            {currentTab === 'minigame' && (
              <motion.span
                layoutId="navIndicator"
                className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                  isProfile ? 'bg-[#8B2626]' : 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]'
                }`}
              />
            )}
          </button>

          {/* TAB 2: Radar (Central Glowing Elevated Button) */}
          <div className="relative -top-5 flex flex-col items-center">
            <button
              onClick={() => setCurrentTab('radar')}
              className="relative p-1 rounded-full group focus:outline-none"
              aria-label="Khai mở Radar Quét Di Tích"
            >
              {/* Outer Pulsing Glow Aura */}
              <div
                className={`absolute -inset-1 rounded-full opacity-75 blur-md transition-all ${
                  currentTab === 'radar'
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#FFE082] animate-pulse opacity-90'
                    : 'bg-[#D4AF37]/30 group-hover:opacity-75'
                }`}
              />

              {/* Raised Circle Button */}
              <div
                className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 group-active:scale-95 shadow-xl ${
                  currentTab === 'radar'
                    ? 'bg-gradient-to-b from-[#F59E0B] via-[#D4AF37] to-[#996515] text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.6)] ring-2 ring-[#FFE082]'
                    : isProfile
                    ? 'bg-[#162A45] text-[#D4AF37] border border-[#D4AF37]/40 shadow-lg'
                    : 'bg-[#111C2D] text-[#D4AF37] border-2 border-[#D4AF37]/50 shadow-lg'
                }`}
              >
                {/* Rotating scanner wave inside button */}
                {currentTab === 'radar' ? (
                  <Radar className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
                ) : (
                  <Compass className="w-7 h-7 group-hover:rotate-45 transition-transform duration-300" />
                )}
              </div>
            </button>
            <span
              className={`text-[11px] font-bold tracking-tight mt-0.5 ${
                currentTab === 'radar'
                  ? isProfile
                    ? 'text-[#8B2626]'
                    : 'text-[#D4AF37]'
                  : isProfile
                  ? 'text-stone-600'
                  : 'text-slate-300'
              }`}
            >
              Radar Di Sản
            </span>
          </div>

          {/* TAB 3: Hồ sơ (Profile) */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="flex flex-col items-center justify-center py-1 px-4 relative group"
            aria-label="Xem Hồ sơ và Kho Huy hiệu"
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-200 ${
                currentTab === 'profile'
                  ? isProfile
                    ? 'text-[#8B2626] bg-[#8B2626]/10 scale-110'
                    : 'text-[#D4AF37] bg-[#D4AF37]/15 scale-110 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : isProfile
                  ? 'text-stone-500 group-hover:text-stone-800'
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span
              className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                currentTab === 'profile'
                  ? isProfile
                    ? 'text-[#8B2626] font-bold'
                    : 'text-amber-200 font-bold'
                  : isProfile
                  ? 'text-stone-500'
                  : 'text-slate-400'
              }`}
            >
              Hồ Sơ
            </span>
            {currentTab === 'profile' && (
              <motion.span
                layoutId="navIndicator"
                className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                  isProfile ? 'bg-[#8B2626]' : 'bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]'
                }`}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
