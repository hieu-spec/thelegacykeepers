// src/components/mobile/MobileHeritageShell.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, BookmarkCheck, Puzzle, Users, User, Monitor } from 'lucide-react';
import MinimalHeritageMap, { HeritagePinItem } from '@/components/radar/MinimalHeritageMap';
import SettingsProfileView, { SavedHeritagesView } from '@/components/profile/SettingsProfileView';
import StorytellerEngine from '@/components/minigame/StorytellerEngine';
import VeteransView from '@/components/veterans/VeteransView';

// Giữ lại export HeritageLocationItem để tránh lỗi import trong các component khác
export interface HeritageLocationItem {
  id: string;
  name: string;
  era: string;
  rarity: 'legendary' | 'rare' | 'uncommon';
  coordinates: { lat: number; lng: number };
  distanceMeters: number;
  contentType?: 'battlefield' | 'landmark' | 'witness';
  summary?: string;
  defaultEmblemEmoji?: string;
  witnessName?: string;
  witnessRole?: string;
  witnessTranscript?: string;
}

const MOBILE_PINS: HeritagePinItem[] = [
  {
    id: 'ben-nha-rong',
    name: 'Bến Nhà Rồng',
    era: '1911',
    rarity: 'legendary',
    latitude: 10.7683,
    longitude: 106.7068,
    discoveryRadius: 150,
    interactionRadius: 45,
    shortDescription: 'Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước (05/06/1911).',
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
    shortDescription: 'Thời khắc lịch sử trưa ngày 30/4/1975 thống nhất đất nước.',
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
    shortDescription: 'Căn hầm bí mật chứa vũ khí giữa lòng đô thị Sài Gòn.',
  },
];

type MobileTab = 'map' | 'saved' | 'storyteller' | 'veterans' | 'profile';

export interface MobileHeritageShellProps {
  isSimulatorFrame?: boolean;
  onExitSimulator?: () => void;
  onSwitchToPC?: () => void;
}

export default function MobileHeritageShell({
  isSimulatorFrame,
  onExitSimulator,
  onSwitchToPC,
}: MobileHeritageShellProps = {}) {
  const [activeTab, setActiveTab] = useState<MobileTab>('profile');

  const handleSwitchToPC = onSwitchToPC || onExitSimulator;

  const tabs: { id: MobileTab; label: string; icon: React.ElementType }[] = [
    { id: 'map', label: 'Bản đồ', icon: Compass },
    { id: 'saved', label: 'Đã lưu', icon: BookmarkCheck },
    { id: 'storyteller', label: 'Giải mã', icon: Puzzle },
    { id: 'veterans', label: 'Tri ân', icon: Users },
    { id: 'profile', label: 'Hồ sơ', icon: User },
  ];

  return (
    <div className="w-full h-full min-h-screen bg-[#F4F5F7] text-[#18181B] flex flex-col justify-between font-sans antialiased overflow-x-hidden">
      
      {/* HEADER MOBILE */}
      <header className="pt-12 pb-3 px-4 bg-white/90 backdrop-blur-md border-b border-zinc-200/70 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#18181B] text-white font-bold text-xs flex items-center justify-center">
            LK
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Sứ Giả Ký Ức Đông Sơn
            </p>
            <h1 className="text-xs font-bold text-zinc-900">Lê Toàn Hiếu • Cấp 4</h1>
          </div>
        </div>

        {handleSwitchToPC && (
          <button
            onClick={handleSwitchToPC}
            className="px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-semibold flex items-center gap-1.5 transition"
          >
            <Monitor size={12} />
            <span>PC</span>
          </button>
        )}
      </header>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 p-3.5 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {activeTab === 'map' && (
              <MinimalHeritageMap
                locations={MOBILE_PINS}
                compactMobile={true}
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

      {/* THANH NAVIGATION 5 TAB DƯỚI ĐÁY */}
      <nav className="fixed bottom-4 left-3 right-3 z-40 bg-[#18181B] text-white p-1.5 rounded-full shadow-xl flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-2 rounded-full flex flex-col sm:flex-row items-center justify-center gap-1 text-xs font-medium transition z-10"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActivePill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-[#EDE9FE] rounded-full -z-10"
                />
              )}
              <Icon size={15} className={isActive ? 'text-[#18181B]' : 'text-zinc-400'} />
              <span className={`text-[10px] ${isActive ? 'text-[#18181B] font-semibold' : 'text-zinc-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export { MobileHeritageShell };
