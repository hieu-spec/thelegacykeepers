'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, BadgeCategory } from '@/types/badge';
import { useApp } from '@/context/AppContext';
import {
  Footprints,
  Landmark,
  Puzzle,
  ShieldAlert,
  Compass,
  MapPin,
  Flag,
  Crown,
  Lock,
  Sparkles,
  X,
  Calendar,
  CheckCircle,
} from 'lucide-react';

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  Landmark,
  Puzzle,
  ShieldAlert,
  Compass,
  MapPin,
  Flag,
  Crown,
};

export const BadgeCollection: React.FC = () => {
  const { badges } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>('conqueror');
  const [inspectedBadge, setInspectedBadge] = useState<Badge | null>(null);

  const filteredBadges = badges.filter((b) => b.category === selectedCategory);
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-4">
      {/* Category Tabs: "Người chinh phục lịch sử" & "Khám phá Việt Nam" */}
      <div className="flex rounded-2xl bg-[#EFE8DC] p-1 border border-[#DFD3C3]">
        <button
          onClick={() => setSelectedCategory('conqueror')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedCategory === 'conqueror'
              ? 'bg-[#162A45] text-white shadow-md'
              : 'text-[#5A4A3A] hover:text-[#162A45]'
          }`}
        >
          Người Chinh Phục
        </button>
        <button
          onClick={() => setSelectedCategory('explorer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            selectedCategory === 'explorer'
              ? 'bg-[#162A45] text-white shadow-md'
              : 'text-[#5A4A3A] hover:text-[#162A45]'
          }`}
        >
          Khám Phá Việt Nam
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredBadges.map((badge: Badge) => {
          const Icon = BADGE_ICONS[badge.iconName] || Crown;
          const isUnlocked = badge.isUnlocked;

          return (
            <motion.button
              key={badge.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setInspectedBadge(badge)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-[#D9A05B]/60 shadow-[0_4px_18px_rgba(217,160,91,0.15)] hover:border-[#D9A05B]'
                  : 'bg-[#F2ECE3]/80 border-[#E2D8CA] opacity-65 hover:opacity-85'
              }`}
            >
              {/* Badge Icon Medal */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#D9A05B] to-[#996515] text-white border-[#FFE082]'
                      : 'bg-stone-300 text-stone-500 border-stone-300'
                  }`}
                >
                  {isUnlocked ? (
                    <Icon className="w-5 h-5 fill-current" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    isUnlocked
                      ? 'bg-[#8B2626]/10 text-[#8B2626] border border-[#8B2626]/20'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {badge.rarity}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="mt-2.5">
                <h5
                  className={`text-xs font-bold leading-tight font-heritage ${
                    isUnlocked ? 'text-[#162A45]' : 'text-stone-600'
                  }`}
                >
                  {badge.name}
                </h5>
                <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                  {badge.titleBadge}
                </p>
              </div>

              {/* Unlock Date / Progress */}
              <div className="mt-2 pt-1.5 border-t border-[#F0E8DC] text-[9px] flex items-center justify-between">
                {isUnlocked ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Đã nhận
                  </span>
                ) : (
                  <span className="text-stone-500">
                    Tiến độ: {badge.progress}/{badge.maxProgress}
                  </span>
                )}
                <span className="text-[#D9A05B] font-bold">+{badge.bonusExp} EXP</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Inspected Badge Modal Detail */}
      <AnimatePresence>
        {inspectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-white border-2 border-[#D9A05B] rounded-3xl p-5 shadow-2xl text-center space-y-3.5 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setInspectedBadge(null)}
                className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1"
                aria-label="Đóng huy hiệu"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Large Gold Medal Preview */}
              <div
                className={`w-18 h-18 rounded-3xl mx-auto flex items-center justify-center border-2 shadow-xl ${
                  inspectedBadge.isUnlocked
                    ? 'bg-gradient-to-br from-[#D9A05B] via-[#C59B27] to-[#8B2626] text-white border-[#FFE082] ring-4 ring-[#D9A05B]/20'
                    : 'bg-stone-200 text-stone-400 border-stone-300'
                }`}
              >
                {inspectedBadge.isUnlocked ? (
                  React.createElement(BADGE_ICONS[inspectedBadge.iconName] || Crown, {
                    className: 'w-9 h-9 fill-current',
                  })
                ) : (
                  <Lock className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#8B2626] tracking-wider px-2 py-0.5 rounded-full bg-[#8B2626]/10">
                  {inspectedBadge.rarity} ·{' '}
                  {inspectedBadge.category === 'conqueror'
                    ? 'Người Chinh Phục'
                    : 'Khám Phá Việt Nam'}
                </span>
                <h3 className="text-base font-extrabold text-[#162A45] font-heritage tracking-wide mt-1.5">
                  {inspectedBadge.name}
                </h3>
                <p className="text-xs font-semibold text-[#D9A05B]">
                  {inspectedBadge.titleBadge}
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed px-2">
                {inspectedBadge.description}
              </p>

              {/* Unlock Requirement Info */}
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E7DFD5] text-[11px] text-left space-y-1">
                <span className="font-bold text-[#162A45] block">Cách mở khóa:</span>
                <p className="text-stone-600 text-[10px] leading-snug">
                  {inspectedBadge.howToUnlock}
                </p>
              </div>

              {/* Status and EXP */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                <span className="text-stone-500 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-[#D9A05B]" />
                  {inspectedBadge.isUnlocked
                    ? `Mở khóa: ${inspectedBadge.unlockedAt}`
                    : 'Chưa mở khóa'}
                </span>
                <span className="font-bold text-[#8B2626]">
                  +{inspectedBadge.bonusExp} EXP
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
