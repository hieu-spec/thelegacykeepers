'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, BadgeCategory } from '@/types/badge';
import { useApp } from '@/context/AppContext';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  ArrowLeft,
  Award,
  Lock,
  Sparkles,
  Calendar,
  CheckCircle2,
  X,
  Compass,
  Footprints,
  Landmark,
  Puzzle,
  Sun,
  Anchor,
  Volume2,
  ShieldAlert,
  Zap,
  Ship,
  Crown,
  MapPin,
  Flag,
  Shield,
  BookOpen,
  Building,
  Globe,
  Lightbulb,
  Flame,
  ChevronRight,
  Share2,
  LayoutGrid,
  Columns,
  Check,
} from 'lucide-react';

interface MyLegacyCollectionViewProps {
  onBack: () => void;
}

// Icon mapper for badges
const renderBadgeIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'Puzzle':
      return <Puzzle className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Anchor':
      return <Anchor className={className} />;
    case 'Volume2':
      return <Volume2 className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Ship':
      return <Ship className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'Flag':
      return <Flag className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Lightbulb':
      return <Lightbulb className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Lock':
      return <Lock className={className} />;
    case 'Award':
    default:
      return <Award className={className} />;
  }
};

type FilterCategoryChip = 'all' | 'conqueror' | 'explorer' | 'campaign' | 'heritage';

export const MyLegacyCollectionView: React.FC<MyLegacyCollectionViewProps> = ({ onBack }) => {
  const {
    badges,
    setProfileSubScreen,
    setCurrentTab,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<FilterCategoryChip>('all');
  const [inspectedBadge, setInspectedBadge] = useState<Badge | null>(null);
  const [gridColumns, setGridColumns] = useState<2 | 3>(2); // View toggle: 2 or 3 columns

  // Dynamic calculations from actual badges state
  const totalBadges = badges.length || 20;
  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const unlockedCount = unlockedBadges.length;
  const progressPercent = totalBadges > 0 ? Math.round((unlockedCount / totalBadges) * 100) : 30;

  // Filter badges based on category chip
  const filteredBadges = useMemo(() => {
    if (activeCategory === 'all') return badges;
    return badges.filter((badge) => badge.category === activeCategory);
  }, [badges, activeCategory]);

  // Social Share Handler
  const handleShareSocial = (platform: 'Facebook' | 'Zalo' | 'Instagram', badgeName: string) => {
    showToast(
      `🎉 Đã tạo thiệp chia sẻ thành công!`,
      `Đã tạo thiệp chia sẻ huy hiệu "${badgeName}" lên ${platform}!`,
      'emerald'
    );
  };

  // Navigate to Quest for Locked Badges
  const handleGoToQuest = (badge: Badge) => {
    setInspectedBadge(null);
    if (badge.category === 'conqueror') {
      setProfileSubScreen('challenges');
    } else {
      setProfileSubScreen('locations');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#FAF6F0] text-[#162A45] select-none pb-24">
      {/* Background Dong Son Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
        <DongSonSun size={550} color="#162A45" opacity={0.3} />
      </div>

      {/* Ancient Cloud */}
      <div className="absolute top-16 right-0 pointer-events-none opacity-20">
        <AncientCloudMotif color="#8B2626" opacity={0.35} />
      </div>

      {/* ========================================================= */}
      {/* 4.1. HEADER TRÊN CÙNG */}
      {/* ========================================================= */}
      <div className="pt-14 px-4 pb-3 z-20 border-b border-[#E8DFD1]/80 bg-[#FAF6F0]/90 backdrop-blur-md">
        {/* Hàng 1: Nút Quay lại (<) + Biểu tượng Huy chương vàng ở góc phải */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#162A45] hover:text-[#8B2626] px-2.5 py-1.5 rounded-xl bg-white border border-[#E8DFD1] active:scale-95 transition-all font-heritage font-bold shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B2626]" />
            <span>Hồ sơ cá nhân</span>
          </button>

          {/* Biểu tượng Huy chương vàng ở góc phải */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D9A05B] to-[#FFE082] text-slate-950 flex items-center justify-center shadow-md border border-[#D9A05B]/40">
            <Award className="w-5 h-5 fill-slate-950" />
          </div>
        </div>

        {/* Hàng 2: Tiêu đề lớn "My Legacy Collection" kèm phụ đề "Bộ sưu tập di sản của tôi" */}
        <div className="mt-3">
          <h1 className="text-lg font-black text-[#162A45] font-heritage tracking-wide leading-tight">
            My Legacy Collection
          </h1>
          <p className="text-xs text-[#8B2626] font-heritage font-bold mt-0.5">
            Bộ sưu tập di sản của tôi
          </p>
        </div>
      </div>

      {/* MAIN SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 z-10">
        {/* ========================================================= */}
        {/* 4.1. KHUNG TIẾN TRÌNH SƯU TẦM (COLLECTION PROGRESS - NỀN XANH NAVY #111E30) */}
        {/* ========================================================= */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#111E30] via-[#162A45] to-[#0A1422] text-white shadow-lg border border-[#D9A05B]/40 relative overflow-hidden space-y-2.5">
          {/* Faint corner watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
            <DongSonSun size={180} color="#FFE082" opacity={0.6} />
          </div>

          {/* Hàng trên: Chữ "COLLECTION PROGRESS" màu vàng đồng in hoa bên trái + Con số lớn màu trắng 6/20 ở góc phải */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black text-[#D9A05B] uppercase tracking-wider font-heritage flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFE082]" />
              COLLECTION PROGRESS
            </span>
            {/* Con số tổng quát lớn màu trắng ở góc phải: 6/20 */}
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {unlockedCount}/{totalBadges}
            </span>
          </div>

          {/* Giữa: Thanh phần trăm màu vàng kim (#D9A05B) đại diện cho tiến độ 30% */}
          <div className="w-full h-3 rounded-full bg-slate-950/80 overflow-hidden border border-[#D9A05B]/40 p-0.5 relative z-10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#D9A05B] via-[#E5B56F] to-[#FFE082] shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Hàng dưới: Dòng thông điệp động: "Bạn đã mở khóa 30% bộ sưu tập huy hiệu." */}
          <p className="text-xs text-amber-200/90 font-medium relative z-10">
            Bạn đã mở khóa <span className="text-[#FFE082] font-black text-sm">{progressPercent}%</span> bộ sưu tập huy hiệu.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 4.2. THANH LỌC DANH MỤC HUY HIỆU (CATEGORY CHIPS - VUỐT NGANG) */}
        {/* ========================================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-stone-500 font-heritage tracking-wider">
              Chủ đề huy hiệu
            </span>

            {/* Nút chuyển đổi giao diện 2 cột / 3 cột */}
            <div className="flex items-center gap-1 bg-[#EFE8DC] p-0.5 rounded-lg border border-[#DFD3C3]">
              <button
                onClick={() => setGridColumns(2)}
                className={`p-1 rounded text-[10px] font-heritage font-bold flex items-center gap-0.5 transition-all ${
                  gridColumns === 2 ? 'bg-[#162A45] text-white shadow-xs' : 'text-stone-600'
                }`}
                title="Lưới 2 cột"
              >
                <Columns className="w-3 h-3" />
                <span>2 Cột</span>
              </button>
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1 rounded text-[10px] font-heritage font-bold flex items-center gap-0.5 transition-all ${
                  gridColumns === 3 ? 'bg-[#162A45] text-white shadow-xs' : 'text-stone-600'
                }`}
                title="Lưới 3 cột"
              >
                <LayoutGrid className="w-3 h-3" />
                <span>3 Cột</span>
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none no-scrollbar">
            {/* 1. Tất cả */}
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heritage whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white border-[#8B2626] shadow-xs'
                  : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
              }`}
            >
              Tất cả ({totalBadges})
            </button>

            {/* 2. Người chinh phục lịch sử */}
            <button
              onClick={() => setActiveCategory('conqueror')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heritage whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                activeCategory === 'conqueror'
                  ? 'bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white border-[#8B2626] shadow-xs'
                  : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
              }`}
            >
              Người chinh phục lịch sử
            </button>

            {/* 3. Khám phá Việt Nam */}
            <button
              onClick={() => setActiveCategory('explorer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heritage whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                activeCategory === 'explorer'
                  ? 'bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white border-[#8B2626] shadow-xs'
                  : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
              }`}
            >
              Khám phá Việt Nam
            </button>

            {/* 4. Chiến dịch lịch sử */}
            <button
              onClick={() => setActiveCategory('campaign')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heritage whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                activeCategory === 'campaign'
                  ? 'bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white border-[#8B2626] shadow-xs'
                  : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
              }`}
            >
              Chiến dịch lịch sử
            </button>

            {/* 5. Di sản văn hóa */}
            <button
              onClick={() => setActiveCategory('heritage')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-heritage whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                activeCategory === 'heritage'
                  ? 'bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white border-[#8B2626] shadow-xs'
                  : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
              }`}
            >
              Di sản văn hóa
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4.3. LƯỚI HIỂN THỊ HUY HIỆU (BADGE GRID VIEW - 2 HOẶC 3 CỘT) */}
        {/* ========================================================= */}
        <div
          className={`grid gap-2.5 ${
            gridColumns === 3 ? 'grid-cols-3' : 'grid-cols-2'
          }`}
        >
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.isUnlocked;

            if (isUnlocked) {
              // ==========================================
              // A. TRẠNG THÁI "ĐÃ NHẬN" (UNLOCKED):
              // Nền kem vàng/mạ vàng sang trọng (#F3E3C3), viền vàng ấm
              // ==========================================
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInspectedBadge(badge)}
                  className={`rounded-2xl bg-[#F3E3C3] border-2 border-[#D9A05B] shadow-sm cursor-pointer relative overflow-hidden flex flex-col justify-between transition-all group ${
                    gridColumns === 3 ? 'p-2.5' : 'p-3'
                  }`}
                >
                  {/* Icon minh họa chi tiết màu nâu đồng/đỏ son sắc nét */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-xl bg-gradient-to-br from-[#8B2626] to-[#5C1414] text-[#FFE082] flex items-center justify-center shadow-sm border border-[#D9A05B] shrink-0 group-hover:scale-105 transition-transform ${
                        gridColumns === 3 ? 'w-8 h-8' : 'w-9 h-9'
                      }`}
                    >
                      {renderBadgeIcon(
                        badge.iconName,
                        gridColumns === 3 ? 'w-4 h-4 fill-current' : 'w-5 h-5 fill-current'
                      )}
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#8B2626]/10 text-[#8B2626] border border-[#8B2626]/20 uppercase font-heritage">
                      {badge.rarity === 'legendary' ? 'Huyền thoại' : badge.rarity === 'event' ? 'Sự kiện' : 'Di sản'}
                    </span>
                  </div>

                  {/* Tên huy hiệu: Chữ đen/nâu đậm in đậm */}
                  <div className="mt-2 space-y-0.5">
                    <h4
                      className={`font-black text-[#162A45] font-heritage leading-tight truncate ${
                        gridColumns === 3 ? 'text-[11px]' : 'text-xs'
                      }`}
                    >
                      {badge.name}
                    </h4>
                    <p className="text-[9px] text-[#7A5424] font-medium truncate">
                      {badge.titleBadge}
                    </p>
                  </div>

                  {/* Nhãn trạng thái: Dòng chữ "Đã nhận" màu nâu đồng bên dưới */}
                  <div className="mt-2 pt-1.5 border-t border-[#DFD0B2] flex items-center justify-between text-[10px]">
                    <span className="text-[#8C6228] font-bold flex items-center gap-1 font-heritage">
                      <Check className="w-3 h-3 text-[#8C6228]" />
                      Đã nhận
                    </span>
                    <span className="text-[#8B2626] font-bold font-mono text-[9px]">
                      +{badge.bonusExp}
                    </span>
                  </div>
                </motion.div>
              );
            } else {
              // ==========================================
              // B. TRẠNG THÁI "CHƯA MỞ KHÓA" (LOCKED):
              // Nền thẻ màu xám chìm (#EAE8E4), icon mờ màu xám kèm hình Ổ khóa nhỏ
              // ==========================================
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInspectedBadge(badge)}
                  className={`rounded-2xl bg-[#EAE8E4] border border-stone-300 shadow-xs cursor-pointer relative overflow-hidden flex flex-col justify-between transition-all opacity-85 hover:opacity-100 ${
                    gridColumns === 3 ? 'p-2.5' : 'p-3'
                  }`}
                >
                  {/* Icon mờ màu xám kèm hình Ổ khóa nhỏ */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`rounded-xl bg-stone-300/80 text-stone-500 flex items-center justify-center border border-stone-400/80 shrink-0 ${
                        gridColumns === 3 ? 'w-8 h-8' : 'w-9 h-9'
                      }`}
                    >
                      <Lock className={gridColumns === 3 ? 'w-4 h-4' : 'w-4 h-4'} />
                    </div>

                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-stone-300 text-stone-600 uppercase font-heritage">
                      Khóa
                    </span>
                  </div>

                  {/* Tên huy hiệu: Màu xám đậm */}
                  <div className="mt-2 space-y-0.5">
                    <h4
                      className={`font-bold text-[#5C5955] font-heritage leading-tight truncate ${
                        gridColumns === 3 ? 'text-[11px]' : 'text-xs'
                      }`}
                    >
                      {badge.name}
                    </h4>
                    <p className="text-[9px] text-stone-500 font-medium truncate">
                      {badge.titleBadge}
                    </p>
                  </div>

                  {/* Nhãn trạng thái: Dòng chữ "Chưa mở khóa" màu xám */}
                  <div className="mt-2 pt-1.5 border-t border-stone-300/80 flex items-center justify-between text-[10px]">
                    <span className="text-[#8C8882] font-semibold flex items-center gap-1 font-heritage">
                      <Lock className="w-2.5 h-2.5" />
                      Chưa mở khóa
                    </span>
                    <span className="text-stone-400 font-mono text-[9px]">
                      +{badge.bonusExp}
                    </span>
                  </div>
                </motion.div>
              );
            }
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4.4. MODAL POPUP CHI TIẾT 3D KHI CHẠM VÀO HUY HIỆU */}
      {/* ========================================================= */}
      <AnimatePresence>
        {inspectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#FAF6F0] to-[#F3ECE1] border-2 border-[#D9A05B] p-5 shadow-2xl text-center space-y-4 relative overflow-hidden text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={18} />

              {/* Close Button X */}
              <button
                onClick={() => setInspectedBadge(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-600 flex items-center justify-center transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 1. HÌNH PHÓNG TO 3D CỦA HUY HIỆU (HIỆU ỨNG XOAY NHẸ & ÁNH KIM) */}
              <div className="pt-2 perspective-[1000px]">
                <motion.div
                  animate={{
                    rotateY: inspectedBadge.isUnlocked ? [-6, 6, -6] : 0,
                    y: inspectedBadge.isUnlocked ? [-3, 3, -3] : 0,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: 'easeInOut',
                  }}
                  className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl border-2 relative overflow-hidden ${
                    inspectedBadge.isUnlocked
                      ? 'bg-gradient-to-br from-[#8B2626] via-[#A02C2C] to-[#5C1414] text-[#FFE082] border-[#D9A05B] ring-4 ring-[#D9A05B]/30'
                      : 'bg-stone-300 text-stone-500 border-stone-400'
                  }`}
                >
                  {/* Shimmer Light Reflection effect */}
                  {inspectedBadge.isUnlocked && (
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                      className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                    />
                  )}

                  {inspectedBadge.isUnlocked ? (
                    renderBadgeIcon(inspectedBadge.iconName, 'w-10 h-10 fill-current')
                  ) : (
                    <Lock className="w-9 h-9" />
                  )}
                </motion.div>
              </div>

              {/* 2. TÊN HUY HIỆU & DANH HIỆU PHỤ */}
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8B2626]/10 text-[#8B2626] border border-[#8B2626]/20 uppercase font-heritage">
                  {inspectedBadge.category === 'conqueror'
                    ? 'Người Chinh Phục Lịch Sử'
                    : inspectedBadge.category === 'explorer'
                    ? 'Khám Phá Việt Nam'
                    : inspectedBadge.category === 'campaign'
                    ? 'Chiến Dịch Lịch Sử'
                    : 'Di Sản Văn Hóa'}
                </span>

                <h3 className="text-base font-black text-[#162A45] font-heritage tracking-wide">
                  {inspectedBadge.name}
                </h3>
                <p className="text-xs font-bold text-[#8B2626] font-heritage">
                  {inspectedBadge.name} — Danh hiệu {inspectedBadge.titleBadge}
                </p>
              </div>

              {/* 3. MÔ TẢ Ý NGHĨA LỊCH SỬ CỦA HUY HIỆU */}
              <div className="p-3 rounded-2xl bg-white border border-[#E8DFD1] text-left space-y-1 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-[#8B2626] block font-heritage tracking-wider">
                  Ý Nghĩa Lịch Sử & Di Sản:
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {inspectedBadge.description}
                </p>
              </div>

              {/* 4. HIỂN THỊ THEO TRẠNG THÁI SỞ HỮU */}
              {inspectedBadge.isUnlocked ? (
                // ==========================================
                // NẾU ĐÃ NHẬN: NGÀY MỞ KHÓA + CỤM NÚT CHIA SẺ MXH
                // ==========================================
                <div className="space-y-3 pt-1">
                  {/* Ngày mở khóa */}
                  <div className="py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold font-heritage flex items-center justify-center gap-1.5 shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>🎉 Nhận ngày {inspectedBadge.unlockedAt || '18/10/2025'}</span>
                  </div>

                  {/* Cụm nút "Chia sẻ lên MXH" gồm 3 nút: Facebook, Zalo, Instagram */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-stone-500 font-heritage block tracking-wider">
                      Chia sẻ thành tích lên Mạng xã hội:
                    </span>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Nút Facebook */}
                      <button
                        onClick={() => handleShareSocial('Facebook', inspectedBadge.name)}
                        className="py-2 px-1 rounded-xl bg-[#1877F2] text-white text-[11px] font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 font-heritage cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Facebook</span>
                      </button>

                      {/* Nút Zalo */}
                      <button
                        onClick={() => handleShareSocial('Zalo', inspectedBadge.name)}
                        className="py-2 px-1 rounded-xl bg-[#0068FF] text-white text-[11px] font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 font-heritage cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Zalo</span>
                      </button>

                      {/* Nút Instagram */}
                      <button
                        onClick={() => handleShareSocial('Instagram', inspectedBadge.name)}
                        className="py-2 px-1 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white text-[11px] font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 font-heritage cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Instagram</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // ==========================================
                // NẾU CHƯA MỞ KHÓA: KHUNG ĐIỀU KIỆN + NÚT "ĐI ĐẾN NHIỆM VỤ >"
                // ==========================================
                <div className="space-y-3 pt-1">
                  {/* Khung điều kiện yêu cầu */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-2">
                    <span className="text-[10px] font-bold uppercase text-amber-900 block font-heritage flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Điều kiện mở khóa:
                    </span>
                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      {inspectedBadge.howToUnlock}
                    </p>

                    {/* Progress indicator */}
                    <div className="pt-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-800">
                        <span>Tiến độ thực hiện:</span>
                        <span>
                          {inspectedBadge.progress}/{inspectedBadge.maxProgress}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-amber-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#D9A05B]"
                          style={{
                            width: `${Math.round(
                              (inspectedBadge.progress / inspectedBadge.maxProgress) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nút "Đi đến nhiệm vụ >" */}
                  <button
                    onClick={() => handleGoToQuest(inspectedBadge)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all font-heritage hover:brightness-110 cursor-pointer border border-[#8B2626]"
                  >
                    <span>Đi đến nhiệm vụ</span>
                    <ChevronRight className="w-4 h-4 text-[#FFE082]" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
