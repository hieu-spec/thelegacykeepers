// src/components/layout/PCCommandCenter.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, BookmarkCheck, Users, Puzzle, User, ShieldCheck, Smartphone } from 'lucide-react';
import MinimalHeritageMap, { HeritagePinItem } from '@/components/radar/MinimalHeritageMap';
import SettingsProfileView, { SavedHeritagesView } from '@/components/profile/SettingsProfileView';
import StorytellerEngine from '@/components/minigame/StorytellerEngine';
import VeteransView from '@/components/veterans/VeteransView';

const DEFAULT_HERITAGE_PINS: HeritagePinItem[] = [
  {
    id: 'ben-nha-rong',
    name: 'Bến Nhà Rồng',
    era: '1911',
    rarity: 'legendary',
    latitude: 10.7683,
    longitude: 106.7068,
    discoveryRadius: 150,
    interactionRadius: 45,
    shortDescription: 'Nơi người thanh niên Nguyễn Tất Thành lên tàu Amiral Latouche-Tréville ngày 5/6/1911.',
  },
  {
    id: 'dinh-doc-lap',
    name: 'Dinh Độc Lập',
    era: '1975',
    rarity: 'legendary',
    latitude: 10.7769,
    longitude: 106.6953,
    discoveryRadius: 180,
    interactionRadius: 75,
    shortDescription: 'Chứng tích lịch sử thời khắc toàn thắng trưa ngày 30/4/1975 thống nhất đất nước.',
  },
  {
    id: 'ham-biet-dong',
    name: 'Hầm Biệt Động Sài Gòn',
    era: '1968',
    rarity: 'rare',
    latitude: 10.7721,
    longitude: 106.6882,
    discoveryRadius: 120,
    interactionRadius: 35,
    shortDescription: 'Căn hầm bí mật chứa hơn 2 tấn vũ khí ngay giữa lòng đô thị Sài Gòn.',
  },
];

type ActiveNavTab = 'map' | 'saved' | 'storyteller' | 'veterans' | 'profile';

export interface PCCommandCenterProps {
  onOpenMobileSimulator?: () => void;
}

export default function PCCommandCenter({ onOpenMobileSimulator }: PCCommandCenterProps = {}) {
  // Mặc định khởi tạo tại tab 'profile' để người dùng kiểm tra ngay trang Hồ sơ cá nhân
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('profile');

  const navItems: { id: ActiveNavTab; label: string; icon: React.ElementType }[] = [
    { id: 'map', label: 'Bản đồ Di sản', icon: Compass },
    { id: 'saved', label: 'Kho Di sản Đã lưu', icon: BookmarkCheck },
    { id: 'storyteller', label: 'Xếp truyện Lịch sử', icon: Puzzle },
    { id: 'veterans', label: 'Nhân chứng Sống', icon: Users },
    { id: 'profile', label: 'Hồ sơ Cá nhân', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#18181B] flex flex-col md:flex-row p-3 sm:p-5 gap-6 font-sans antialiased">
      
      {/* FLOATING DARK PILL SIDEBAR VỚI ĐỦ 5 PHÂN HỆ */}
      <aside className="hidden md:flex w-14 bg-[#18181B] text-white rounded-full py-6 flex-col items-center justify-between shadow-sm shrink-0 h-[calc(100vh-2.5rem)] sticky top-5">
        <div className="font-bold text-sm tracking-tighter w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center">
          LK
        </div>

        <nav className="flex flex-col gap-3.5 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className="relative p-3 rounded-full transition z-10 flex items-center justify-center"
              >
                {isActive && (
                  <motion.div
                    layoutId="pcSidebarActivePill"
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute inset-0 bg-[#EDE9FE] rounded-full -z-10"
                  />
                )}
                <Icon
                  size={18}
                  className={isActive ? 'text-[#18181B]' : 'text-zinc-400 hover:text-white transition'}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-3">
          {onOpenMobileSimulator && (
            <button
              onClick={onOpenMobileSimulator}
              title="Mở Khung giả lập iPhone 16 Pro"
              className="p-2.5 rounded-full text-amber-400 hover:text-amber-300 hover:bg-zinc-800 transition"
            >
              <Smartphone size={17} />
            </button>
          )}
          <div
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-emerald-400"
            title="Đã xác thực Hộ chiếu Di sản"
          >
            <ShieldCheck size={15} />
          </div>
        </div>
      </aside>

      {/* KHU VỰC HIỂN THỊ NỘI DUNG */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab === 'map' && (
              <MinimalHeritageMap
                locations={DEFAULT_HERITAGE_PINS}
                onSelectLocation={() => setActiveTab('storyteller')}
              />
            )}
            {activeTab === 'saved' && <SavedHeritagesView />}
            {activeTab === 'storyteller' && <StorytellerEngine />}
            {activeTab === 'veterans' && <VeteransView />}
            {activeTab === 'profile' && <SettingsProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOATING PILL DOCK CHO MÀN HÌNH NHỎ NẾU DÙNG PC COMMAND CENTER */}
      <nav className="md:hidden fixed bottom-4 left-3 right-3 z-40 bg-[#18181B] text-white p-1.5 rounded-full shadow-xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex-1 py-2 rounded-full flex items-center justify-center gap-1 text-xs font-medium transition z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="pcMobileNavPill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-[#EDE9FE] rounded-full -z-10"
                />
              )}
              <Icon size={15} className={isActive ? 'text-[#18181B]' : 'text-zinc-400'} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export { PCCommandCenter };
