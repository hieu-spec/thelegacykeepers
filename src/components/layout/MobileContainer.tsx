'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { BottomNav } from './BottomNav';
import { DevGpsController } from './DevGpsController';
import { ToastNotification } from '../common/ToastNotification';
import { AudioPlayerBar } from '../common/AudioPlayerBar';
import { DongSonSun } from '../common/DongSonMotif';
import { Wifi, Battery, Sparkles } from 'lucide-react';

export const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTab, isAuthenticated, isArModeActive, setDesktopViewMode } = useApp();

  const isProfile = currentTab === 'profile' || !isAuthenticated;

  return (
    <div className="min-h-screen w-full bg-[#04070D] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden relative">
      {/* Desktop Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 hidden md:block overflow-hidden">
        <DongSonSun size={750} className="absolute -top-32 -left-32 animate-spin" opacity={0.15} />
        <DongSonSun size={650} className="absolute -bottom-32 -right-32 animate-spin" opacity={0.12} />
        <div className="absolute inset-0 bg-radial from-transparent via-[#04070D]/70 to-[#04070D]" />
      </div>

      {/* Desktop Brand Info & Switcher to PC Command Center */}
      <aside aria-label="Thông tin ứng dụng" className="hidden lg:flex flex-col fixed left-12 top-1/2 -translate-y-1/2 max-w-xs space-y-4 select-none z-30">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/30">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </span>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-[#D4AF37] font-heritage uppercase">
              The Legacy Keepers
            </h2>
            <p className="text-[11px] text-slate-400">Giả Lập Thực Địa Mobile & AR</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Đang hiển thị chế độ giả lập điện thoại. Bạn có thể chuyển sang giao diện Trạm Điều Hành PC (Command Center) toàn màn hình bất cứ lúc nào.
        </p>

        <button
          onClick={() => setDesktopViewMode('dashboard')}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <span>🖥️ Mở Trạm Điều Hành PC (Dashboard)</span>
        </button>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-[#D4AF37]/20 text-[11px] text-amber-200/90 space-y-1.5">
          <p className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
            ⚡ Mẹo Trải Nghiệm AR:
          </p>
          <p className="text-slate-300">
            Nhấn vào bất kỳ địa danh nào trên radar và bấm <span className="text-[#D4AF37] font-bold">"Dẫn Đường AR"</span> để kích hoạt camera và mũi tên 3D thực tế tăng cường!
          </p>
        </div>
      </aside>

      {/* Standard Mobile Viewport Frame */}
      <main
        className={`w-full max-w-md h-screen sm:h-[90vh] sm:max-h-[880px] sm:rounded-[40px] overflow-hidden relative shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-0 sm:border-4 transition-colors duration-500 flex flex-col ${
          isProfile
            ? 'bg-[#FAF6F0] sm:border-[#C4B5A5]/60'
            : 'bg-[#0B1320] sm:border-[#D4AF37]/30'
        }`}
      >
        {/* Mobile Phone Top Status Bar (Hidden in AR Mode to maximize view) */}
        {!isArModeActive && (
          <header
            className={`h-7 px-6 flex items-center justify-between text-[11px] font-semibold tracking-tight z-50 shrink-0 select-none transition-colors duration-300 ${
              isProfile ? 'text-stone-700 bg-[#FAF6F0]/80' : 'text-slate-300 bg-[#0B1320]/80'
            }`}
          >
            <span>09:41</span>
            {/* Subtle Phone Speaker Notch for realistic look */}
            <div className="w-16 h-3 bg-black/40 rounded-full flex items-center justify-center">
              <div className="w-8 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </header>
        )}

        {/* Dev GPS Controller Floating at top (Hidden in AR mode) */}
        {isAuthenticated && !isArModeActive && <DevGpsController />}

        {/* Interactive Toast Notifications */}
        <ToastNotification />

        {/* Main Scrollable Viewport Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </div>

        {/* Global Floating Audio Witness Player */}
        {isAuthenticated && <AudioPlayerBar />}

        {/* Bottom App Navigation Bar (Auto-hidden in AR Mode per blueprint) */}
        {isAuthenticated && !isArModeActive && <BottomNav />}
      </main>
    </div>
  );
};
