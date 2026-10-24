'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/types/badge';
import { MyLegacyCollectionView } from './MyLegacyCollectionView';
import { DiscoveredLocationsView } from './DiscoveredLocationsView';
import { HistoricalChallengesView } from './HistoricalChallengesView';
import { SettingsProfileView } from './SettingsProfileView';
import { AvatarPickerModal } from './AvatarPickerModal';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  Landmark,
  Settings,
  Edit3,
  MapPin,
  Sparkles,
  Puzzle,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  Lock,
  X,
  Check,
  Save,
  CheckCircle2,
  Compass,
  Zap,
  Volume2,
  ShieldAlert,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    badges,
    stories,
    profileSubScreen,
    setProfileSubScreen,
    setActivePlayingStory,
    setCurrentTab,
    showToast,
  } = useApp();

  // Modals & Sheets
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [inspectedPreviewBadge, setInspectedPreviewBadge] = useState<Badge | null>(null);
  const [isRecentModalOpen, setIsRecentModalOpen] = useState(false);
  const [isJoinedDateModalOpen, setIsJoinedDateModalOpen] = useState(false);

  // Inline Edit Mode
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [inlineName, setInlineName] = useState(userProfile.displayName || userProfile.name);
  const [inlineLocation, setInlineLocation] = useState(userProfile.location || 'TP. Hồ Chí Minh');
  const [inlineBio, setInlineBio] = useState(userProfile.bio || 'Mỗi di tích là một câu chuyện chưa kể.');

  // Sub-screens Navigation
  if (profileSubScreen === 'collection' || profileSubScreen === 'badges') {
    return <MyLegacyCollectionView onBack={() => setProfileSubScreen('main')} />;
  }

  if (profileSubScreen === 'locations') {
    return <DiscoveredLocationsView onBack={() => setProfileSubScreen('main')} />;
  }

  if (profileSubScreen === 'challenges') {
    return <HistoricalChallengesView onBack={() => setProfileSubScreen('main')} />;
  }

  if (profileSubScreen === 'settings') {
    return <SettingsProfileView onBack={() => setProfileSubScreen('main')} />;
  }

  // Preview Badges: 3 Unlocked + 1 Locked
  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const lockedBadges = badges.filter((b) => !b.isUnlocked);

  // Match the prompt preview: "Dấu chân đầu tiên", "Trái tim Sài Gòn", "Bậc thầy mảnh ghép", plus 1 locked ("Dấu chân Bác Hồ")
  const badgeDauChan = badges.find((b) => b.name.includes('Dấu Chân Đầu Tiên')) || unlockedBadges[0];
  const badgeTraiTim = badges.find((b) => b.name.includes('Trái Tim Sài Gòn') || b.name.includes('Người Tìm Di Tích')) || unlockedBadges[1];
  const badgeBacThay = badges.find((b) => b.name.includes('Bậc Thầy Mảnh Ghép') || b.name.includes('Nhà Thám Hiểm')) || unlockedBadges[2];
  const firstLockedBadge = badges.find((b) => b.name.includes('Dấu Chân Bác Hồ')) || lockedBadges[0];

  const previewBadges: Badge[] = [
    badgeDauChan || unlockedBadges[0],
    badgeTraiTim || unlockedBadges[1],
    badgeBacThay || unlockedBadges[2],
    firstLockedBadge,
  ].filter(Boolean);

  // Calculations
  const expPercentage = Math.min(
    Math.round((userProfile.currentExp / userProfile.nextLevelExp) * 100),
    100
  );
  const remainingExp = Math.max(userProfile.nextLevelExp - userProfile.currentExp, 0);

  // Handle Save Inline Edit
  const handleSaveInline = () => {
    updateUserProfile({
      name: inlineName.slice(0, 30),
      displayName: inlineName.slice(0, 30),
      location: inlineLocation.trim() || 'TP. Hồ Chí Minh',
      bio: inlineBio.slice(0, 150),
    });
    setIsInlineEditing(false);
  };

  const handleCancelInline = () => {
    setInlineName(userProfile.displayName || userProfile.name);
    setInlineLocation(userProfile.location || 'TP. Hồ Chí Minh');
    setInlineBio(userProfile.bio);
    setIsInlineEditing(false);
  };

  const handleSelectRecent = (storyId: string) => {
    const target = stories.find((s) => s.id === storyId) || stories[0];
    setActivePlayingStory(target);
    setCurrentTab('minigame');
    setIsRecentModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#FAF6F0] text-[#162A45] select-none pb-24">
      {/* Background Dong Son Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
        <DongSonSun size={550} color="#162A45" opacity={0.3} />
      </div>

      {/* Decorative Cloud */}
      <div className="absolute top-16 right-2 pointer-events-none opacity-30">
        <AncientCloudMotif color="#8B2626" opacity={0.35} />
      </div>

      {/* ========================================================= */}
      {/* TOP APP BAR */}
      {/* ========================================================= */}
      <div className="pt-14 px-4 pb-2 z-20 flex items-center justify-between border-b border-[#E8DFD1]/80 bg-[#FAF6F0]/90 backdrop-blur-md">
        {/* Logo ngôi đền đỏ + chữ "THE LEGACY KEEPERS" màu đỏ son */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#8B2626]/10 border border-[#8B2626]/30 flex items-center justify-center text-[#8B2626] shadow-xs">
            <Landmark className="w-4 h-4 fill-[#8B2626]" />
          </div>
          <span className="font-heritage font-extrabold text-sm tracking-wider text-[#8B2626]">
            THE LEGACY KEEPERS
          </span>
        </div>

        {/* Icon bánh răng Cài đặt bên phải */}
        <button
          onClick={() => setProfileSubScreen('settings')}
          className="p-2 rounded-xl text-stone-600 hover:text-[#162A45] hover:bg-stone-200/60 transition-colors cursor-pointer"
          title="Cài đặt tài khoản"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN BODY SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 z-10">
        {/* ========================================================= */}
        {/* 1.1. THẺ THÔNG TIN CÁ NHÂN (PROFILE HEADER CARD - NỀN XANH NAVY #162A45) */}
        {/* ========================================================= */}
        <div className="p-4 bg-[#162A45] text-white rounded-3xl shadow-xl relative overflow-hidden border border-[#D9A05B]/50 space-y-3">
          <HeritageCornerDecoration color="#D9A05B" size={16} />

          {/* Dong Son Faint Aura */}
          <div className="absolute -right-12 -top-12 opacity-15 pointer-events-none">
            <DongSonSun size={240} color="#FFE082" opacity={0.5} />
          </div>

          {/* Top Line of Card: Avatar, Name, Level, Edit Pen */}
          <div className="flex items-start gap-3.5 relative z-10">
            {/* Ảnh đại diện (Khung tròn vàng đồng) - Chạm để mở modal 3 lựa chọn */}
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative cursor-pointer shrink-0 group"
              title="Chạm để thay đổi ảnh đại diện (Thư viện / Chụp ảnh / Di sản)"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D9A05B] shadow-lg ring-4 ring-[#D9A05B]/30 group-hover:scale-105 transition-transform bg-slate-900">
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.displayName || userProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#8B2626] border border-[#FAF6F0] text-[9px] font-bold text-white shadow">
                Lv.0{userProfile.level || 5}
              </span>
            </div>

            {/* Profile Info or Inline Edit */}
            <div className="flex-1 min-w-0">
              {isInlineEditing ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      maxLength={30}
                      value={inlineName}
                      onChange={(e) => setInlineName(e.target.value)}
                      placeholder="Tên hiển thị (tối đa 30 ký tự)"
                      className="w-full px-2 py-1 rounded-lg bg-white/15 border border-[#D9A05B] text-xs font-bold text-white placeholder-slate-400 focus:outline-none"
                    />
                    <span className="text-[9px] text-[#FFE082] ml-1 shrink-0 font-mono">
                      {inlineName.length}/30
                    </span>
                  </div>

                  <input
                    type="text"
                    value={inlineLocation}
                    onChange={(e) => setInlineLocation(e.target.value)}
                    placeholder="Vị trí (VD: TP. Hồ Chí Minh)"
                    className="w-full px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 text-[11px] text-amber-200 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-amber-50 font-heritage tracking-wide truncate">
                      {userProfile.displayName || userProfile.name}
                    </h2>

                    {/* Nút Chỉnh sửa nhanh (Icon bút chì) */}
                    <button
                      onClick={() => setIsInlineEditing(true)}
                      className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFE082] transition-colors cursor-pointer shrink-0 ml-1"
                      title="Chỉnh sửa nhanh thông tin"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-white/60 font-mono">
                    {userProfile.username}
                  </p>

                  {/* Cấp độ & Danh hiệu - Bấm vào mở Pop-up Tiến trình EXP */}
                  <div className="pt-0.5 flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setIsLevelModalOpen(true)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/15 text-[10px] font-bold text-[#D9A05B] border border-[#D9A05B]/30 cursor-pointer active:scale-95 transition-all"
                      title="Xem chi tiết tiến trình cấp độ & EXP"
                    >
                      <Sparkles className="w-3 h-3 text-[#D9A05B]" />
                      <span>{userProfile.titleLevel}</span>
                    </button>

                    {/* Địa điểm */}
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-300">
                      <MapPin className="w-3 h-3 text-[#D9A05B]" />
                      <span>{userProfile.location || 'TP. Hồ Chí Minh'}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Khung Tiểu sử (Bio Box) */}
          <div className="pt-2 border-t border-white/15">
            {isInlineEditing ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] uppercase font-bold text-[#FFE082]">
                    Tiểu sử / Châm ngôn
                  </label>
                  <span className="text-[9px] text-[#FFE082] font-mono">
                    {inlineBio.length}/150
                  </span>
                </div>
                <textarea
                  maxLength={150}
                  rows={2}
                  value={inlineBio}
                  onChange={(e) => setInlineBio(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-white/15 border border-[#D9A05B] text-xs text-white placeholder-slate-400 focus:outline-none leading-relaxed"
                />

                {/* Inline Action Buttons: Lưu / Hủy */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={handleCancelInline}
                    className="px-3 py-1 rounded-lg bg-white/10 text-xs text-slate-300 hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveInline}
                    className="px-3 py-1 rounded-lg bg-[#D9A05B] text-slate-950 font-bold text-xs flex items-center gap-1 shadow font-heritage"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-200 italic leading-relaxed px-1">
                “{userProfile.bio}”
              </p>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1.2. KHỐI ĐIỀU HƯỚNG & THỐNG KÊ NHANH (3 NÚT CHỨC NĂNG CHÍNH) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Ô 1: ĐỊA DANH */}
          <button
            onClick={() => setProfileSubScreen('locations')}
            className="p-3 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#8B2626]/40 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4 fill-[#8B2626]" />
            </div>
            <span className="text-lg font-black text-[#162A45] font-heritage leading-none">
              {String(userProfile.visitedLocationIds.length || 8).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-stone-500 mt-1 font-heritage">
              Địa danh
            </span>
          </button>

          {/* Ô 2: THỬ THÁCH */}
          <button
            onClick={() => setProfileSubScreen('challenges')}
            className="p-3 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#8B2626]/40 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Puzzle className="w-4 h-4 fill-[#8B2626]" />
            </div>
            <span className="text-lg font-black text-[#162A45] font-heritage leading-none">
              {String(userProfile.stats.fragmentsRestored || 12).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-stone-500 mt-1 font-heritage">
              Thử thách
            </span>
          </button>

          {/* Ô 3: HUY HIỆU */}
          <button
            onClick={() => setProfileSubScreen('badges')}
            className="p-3 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#D9A05B]/60 shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer group active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-[#D9A05B] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4 fill-[#D9A05B]" />
            </div>
            <span className="text-lg font-black text-[#162A45] font-heritage leading-none">
              {String(userProfile.unlockedBadgeIds.length || 6).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-stone-500 mt-1 font-heritage">
              Huy hiệu
            </span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 1.3. KHỐI BỘ SƯU TẬP HUY HIỆU (BADGE COLLECTION PREVIEW) */}
        {/* ========================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#162A45] font-heritage">
              Bộ sưu tập huy hiệu
            </h3>
            {/* Nút "Xem tất cả →" màu đỏ son */}
            <button
              onClick={() => setProfileSubScreen('badges')}
              className="text-[11px] font-bold text-[#8B2626] hover:underline flex items-center gap-1 font-heritage cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid 4 ô xem trước: 3 Đã mở (#F5E6C8) + 1 Chưa mở (#E5E7EB) */}
          <div className="grid grid-cols-2 gap-2.5">
            {previewBadges.map((badge, idx) => {
              const isUnlocked = idx < 3 && badge.isUnlocked;

              return (
                <div
                  key={badge.id || idx}
                  onClick={() => setInspectedPreviewBadge(badge)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 shadow-xs ${
                    isUnlocked
                      ? 'bg-[#F5E6C8] border-[#D9A05B] hover:shadow-sm'
                      : 'bg-[#E5E7EB] border-stone-300 opacity-80'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[#8B2626] to-[#5C1414] text-[#FFE082]'
                        : 'bg-stone-300 text-stone-500'
                    }`}
                  >
                    {isUnlocked ? (
                      <Award className="w-4 h-4 fill-current" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-bold font-heritage truncate ${
                        isUnlocked ? 'text-[#162A45]' : 'text-stone-600'
                      }`}
                    >
                      {isUnlocked ? badge.name : 'Chưa mở khóa'}
                    </h4>
                    <span
                      className={`text-[9px] font-medium block truncate ${
                        isUnlocked ? 'text-[#7A5B36]' : 'text-stone-500'
                      }`}
                    >
                      {isUnlocked ? 'Đã nhận' : 'Khóa'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1.4. KHỐI HÀNH TRÌNH CỦA TÔI (MY JOURNEY SECTION) */}
        {/* ========================================================= */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#162A45] font-heritage">
            Hành Trình Của Tôi
          </h3>

          <div className="rounded-3xl bg-white border border-[#E8DFD1] divide-y divide-stone-100 shadow-xs overflow-hidden">
            {/* 1. NGÀY ĐẦU TIÊN KHÁM PHÁ */}
            <button
              onClick={() => setIsJoinedDateModalOpen(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#162A45] font-heritage">
                    Ngày đầu tiên khám phá
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    Ngày tham gia ứng dụng ({userProfile.joinedDate || '15/08/2025'})
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>

            {/* 2. HOẠT ĐỘNG GẦN ĐÂY */}
            <button
              onClick={() => setIsRecentModalOpen(true)}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#162A45] font-heritage">
                    Hoạt động gần đây
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    Tiếp tục hành trình đang dang dở
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>

            {/* 3. CÀI ĐẶT TÀI KHOẢN */}
            <button
              onClick={() => setProfileSubScreen('settings')}
              className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B2626]/10 text-[#8B2626] flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#162A45] font-heritage">
                    Cài đặt tài khoản
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    Thông tin, quyền riêng tư, thông báo
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* POPUP CHI TIẾT TIẾN TRÌNH CẤP ĐỘ & EXP */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isLevelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-4 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={16} />

              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D9A05B]" />
                  <h3 className="text-sm font-extrabold font-heritage">
                    Tiến Trình Cấp Độ
                  </h3>
                </div>
                <button
                  onClick={() => setIsLevelModalOpen(false)}
                  className="p-1 rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Level Badge Banner */}
              <div className="p-3.5 rounded-2xl bg-[#162A45] text-white text-center space-y-2 border border-[#D9A05B]/60">
                <span className="text-[10px] uppercase font-bold text-[#FFE082] tracking-widest font-heritage">
                  {userProfile.titleLevel}
                </span>
                <div className="text-xl font-black text-white font-heritage">
                  {userProfile.currentExp.toLocaleString()} / {userProfile.nextLevelExp.toLocaleString()} EXP
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-[#D9A05B]/40">
                  <div
                    className="h-full bg-gradient-to-r from-[#D9A05B] to-[#FFE082] rounded-full transition-all duration-500"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>

                <p className="text-[10px] text-amber-200">
                  Còn thiếu <strong className="text-white font-bold">{remainingExp} EXP</strong> để nâng lên Cấp 06 (Đại Sứ Di Sản)
                </p>
              </div>

              {/* Ways to earn EXP */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-[#8B2626] uppercase text-[10px] font-heritage">
                  Cách Kiếm Thêm EXP Di Sản:
                </h4>
                <div className="space-y-1.5 text-stone-700 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-[#DFD3C3] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8B2626]" />
                      Check-in GPS tại di tích lịch sử
                    </span>
                    <span className="font-bold text-[#8B2626]">+100 ~ 300 EXP</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#DFD3C3] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Puzzle className="w-3.5 h-3.5 text-[#8B2626]" />
                      Hoàn thành màn chơi Storyteller
                    </span>
                    <span className="font-bold text-[#8B2626]">+150 ~ 400 EXP</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#DFD3C3] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#8B2626]" />
                      Lắng nghe tư liệu nhân chứng lịch sử
                    </span>
                    <span className="font-bold text-[#8B2626]">+100 EXP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL XEM NHANH HUY HIỆU */}
      {/* ========================================================= */}
      <AnimatePresence>
        {inspectedPreviewBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative text-center space-y-3.5 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={16} />

              <button
                onClick={() => setInspectedPreviewBadge(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300"
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-md border ${
                  inspectedPreviewBadge.isUnlocked
                    ? 'bg-gradient-to-br from-[#8B2626] to-[#5C1414] text-[#FFE082] border-[#D9A05B]'
                    : 'bg-stone-300 text-stone-500 border-stone-400'
                }`}
              >
                {inspectedPreviewBadge.isUnlocked ? (
                  <Award className="w-7 h-7 fill-current" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>

              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#8B2626]/10 text-[#8B2626] uppercase">
                  {inspectedPreviewBadge.rarity}
                </span>
                <h3 className="text-sm font-extrabold text-[#162A45] font-heritage mt-1">
                  {inspectedPreviewBadge.name}
                </h3>
                <p className="text-[11px] font-semibold text-[#8B2626]">
                  {inspectedPreviewBadge.titleBadge}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DFD3C3] text-left text-xs text-stone-700 leading-relaxed">
                {inspectedPreviewBadge.description}
              </div>

              <div className="p-2.5 rounded-xl bg-[#F5E6C8] border border-[#D9A05B]/60 text-left text-[11px] space-y-0.5">
                <span className="font-bold text-[#162A45] block">
                  {inspectedPreviewBadge.isUnlocked ? 'Đã đạt điều kiện:' : 'Điều kiện mở khóa:'}
                </span>
                <p className="text-stone-800">
                  {inspectedPreviewBadge.howToUnlock}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs border-t border-stone-200">
                <span className="text-stone-500 text-[10px]">
                  {inspectedPreviewBadge.isUnlocked
                    ? `Ngày nhận: ${inspectedPreviewBadge.unlockedAt}`
                    : 'Chưa mở khóa'}
                </span>
                <span className="font-bold text-[#8B2626]">
                  +{inspectedPreviewBadge.bonusExp} EXP
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL HOẠT ĐỘNG GẦN ĐÂY (BOTTOM SHEET / MODAL) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isRecentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-full max-w-md rounded-t-3xl bg-[#FAF6F0] border-t-2 border-[#D9A05B] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#8B2626]" />
                  <h3 className="text-sm font-extrabold text-[#162A45] font-heritage">
                    Hoạt Động Gần Đây
                  </h3>
                </div>
                <button
                  onClick={() => setIsRecentModalOpen(false)}
                  className="p-1 rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* 1. Dinh Độc Lập */}
                <div className="p-3 rounded-2xl bg-white border border-[#DFD3C3] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#162A45] font-heritage">
                      Dinh Độc Lập
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                      Đang làm 60%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Khúc Khải Hoàn 1975: Cú Húc Cổng Sắt Lịch Sử trưa ngày 30/4/1975
                  </p>
                  <button
                    onClick={() => handleSelectRecent('story-dinh-doc-lap-1975')}
                    className="w-full py-1.5 rounded-xl bg-[#162A45] text-amber-200 text-xs font-bold flex items-center justify-center gap-1 font-heritage active:scale-95 transition-all"
                  >
                    <span>Tiếp tục trải nghiệm &gt;</span>
                  </button>
                </div>

                {/* 2. Bến Nhà Rồng */}
                <div className="p-3 rounded-2xl bg-white border border-[#DFD3C3] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#162A45] font-heritage">
                      Bến Nhà Rồng
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Đã xem thuyết minh &amp; Hồi 1
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Màn 2: Rời bến Nhà Rồng ngày 5/6/1911 trên con tàu Latouche-Tréville
                  </p>
                  <button
                    onClick={() => handleSelectRecent('story-ben-nha-rong-1')}
                    className="w-full py-1.5 rounded-xl bg-[#162A45] text-amber-200 text-xs font-bold flex items-center justify-center gap-1 font-heritage active:scale-95 transition-all"
                  >
                    <span>Tiếp tục trải nghiệm &gt;</span>
                  </button>
                </div>

                {/* 3. Căn Hầm Vũ Khí Bí Mật */}
                <div className="p-3 rounded-2xl bg-white border border-[#DFD3C3] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#162A45] font-heritage">
                      Căn Hầm Bí Mật Biệt Động
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                      Đã khám phá tọa độ GPS
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Hỏa tuyến trong lòng địch: Hầm vũ khí bí mật Tết Mậu Thân 1968
                  </p>
                  <button
                    onClick={() => handleSelectRecent('story-ham-biet-dong-1968')}
                    className="w-full py-1.5 rounded-xl bg-[#162A45] text-amber-200 text-xs font-bold flex items-center justify-center gap-1 font-heritage active:scale-95 transition-all"
                  >
                    <span>Tiếp tục trải nghiệm &gt;</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* POP-UP NGÀY ĐẦU TIÊN KHÁM PHÁ */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isJoinedDateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative text-center space-y-3 text-[#162A45]"
            >
              <HeritageCornerDecoration color="#D9A05B" size={16} />

              <div className="w-12 h-12 rounded-full bg-[#8B2626]/10 text-[#8B2626] mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#8B2626] tracking-wider font-heritage block">
                  Khởi Đầu Di Sản
                </span>
                <h3 className="text-sm font-extrabold text-[#162A45] font-heritage mt-1">
                  Hành Trình Khám Phá
                </h3>
              </div>

              <div className="p-3 rounded-2xl bg-[#F5E6C8] border border-[#D9A05B]/60 text-xs text-stone-800 space-y-1">
                <p className="font-bold text-[#8B2626]">
                  Bạn đã bắt đầu hành trình vào ngày 15/08/2025
                </p>
                <p className="text-[11px] text-[#7A5B36]">
                  (Đã đồng hành 435 ngày cùng Di sản Việt Nam)
                </p>
              </div>

              <p className="text-[11px] text-stone-600 italic">
                “435 ngày thắp sáng ngọn lửa gìn giữ và lan tỏa ký ức non sông.”
              </p>

              <button
                onClick={() => setIsJoinedDateModalOpen(false)}
                className="w-full py-2 rounded-xl bg-[#162A45] text-amber-200 font-bold text-xs font-heritage"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AVATAR PICKER MODAL (3 LỰA CHỌN) */}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        currentAvatarUrl={userProfile.avatarUrl}
        onSelectAvatar={(url) => {
          updateUserProfile({ avatarUrl: url });
          showToast('Đã đổi Avatar thành công!', 'Ảnh đại diện mới đã được cập nhật.', 'gold');
        }}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </div>
  );
};
