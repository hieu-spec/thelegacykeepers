'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { HistoricalLocation } from '@/types/location';
import { TacticalHeritageMap } from '@/components/radar/TacticalHeritageMap';
import { AudioPlayerBar } from '@/components/common/AudioPlayerBar';
import { GoldenDragonLogo } from '../common/GoldenDragonLogo';
import VeteransView from '@/components/veterans/VeteransView';
import CampaignsView, { HistoricalCampaign } from '@/components/campaigns/CampaignsView';
import AdminCmsView from '@/components/admin/AdminCmsView';
import { SYSTEM_TITLES } from '@/data/accounts';
import {
  Map,
  Settings,
  Award,
  Trophy,
  Sparkles,
  Smartphone,
  Flame,
  Medal,
  Users,
  LogOut,
  X,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

type PCTabKey = 'tactical_map' | 'veterans' | 'campaigns' | 'leaderboard' | 'admin_cms';

// Sample Leaderboard Data
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Lê Toàn Hiếu', badge: 'Sứ Giả Ký Ức Sài Gòn', level: 15, exp: 3450, locationsCount: 12, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Nguyễn Minh Quân', badge: 'Chiến Sĩ Biệt Động Thành', level: 12, exp: 2100, locationsCount: 9, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Trần Bảo Ngọc', badge: 'Người Cháu Tri Ân', level: 9, exp: 1450, locationsCount: 7, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Phạm Hoàng Nam', badge: 'Historical Explorer', level: 5, exp: 650, locationsCount: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Võ Thảo Vy', badge: 'Tân Binh Gìn Giữ Di Sản', level: 1, exp: 120, locationsCount: 1, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
];

export interface PCCommandCenterProps {
  onOpenMobileSimulator?: () => void;
}

export const PCCommandCenter: React.FC<PCCommandCenterProps> = ({ onOpenMobileSimulator }) => {
  const {
    locations,
    userProfile,
    setDesktopViewMode,
    showToast,
    currentAccount,
    allAccounts,
    loginAsAccount,
    logout,
    veterans,
    visitedVeteranIds,
    visitVeteran,
    onPlayVeteranAudio,
    activeAudioOverride,
    setActiveAudioOverride,
    completedCampaignIds,
    completeCampaign,
    saveCustomPin,
    deleteCustomPin,
    saveVeteranProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<PCTabKey>('tactical_map');
  const [selectedLocation, setSelectedLocation] = useState<HistoricalLocation | null>(locations[0] || null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const currentTitle = SYSTEM_TITLES.find((t) => t.id === currentAccount.activeTitleId);
  const isAdmin = currentAccount.role === 'ADMIN';

  return (
    <div className="min-h-screen w-full bg-[#070D18] text-slate-100 flex overflow-hidden select-none font-sans">
      {/* ========================================================
          KHU VỰC 1: SIDEBAR ĐIỀU HƯỚNG (BÊN TRÁI - 20% CHIỀU RỘNG)
          ======================================================== */}
      <aside className="w-80 bg-[#0B1422] border-r border-[#D4AF37]/30 flex flex-col justify-between p-4 z-40 shrink-0">
        <div className="space-y-5">
          {/* Logo Rồng Vàng & Title */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <GoldenDragonLogo size={36} />
            <div>
              <h1 className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFE082] via-[#D4AF37] to-[#F59E0B] uppercase">
                LEGACY KEEPERS
              </h1>
              <p className="text-[10px] text-amber-200/80 font-medium">
                Trạm Điều Hành Chiến Dịch Di Sản
              </p>
            </div>
          </div>

          {/* User Profile Mini Badge with Title & Aura Glow */}
          <div className="p-3.5 rounded-2xl bg-[#0F192A] border border-amber-500/30 flex items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentAccount.avatarUrl}
                alt={currentAccount.displayName}
                className={`w-11 h-11 rounded-full object-cover border-2 shrink-0 ${
                  isAdmin
                    ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                    : 'border-slate-500'
                }`}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">
                    {currentAccount.displayName}
                  </h4>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      isAdmin ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isAdmin ? 'ADMIN' : `CẤP ${String(currentAccount.level).padStart(2, '0')}`}
                  </span>
                </div>
                <p className={`text-[11px] font-semibold truncate mt-0.5 ${currentTitle?.auraClass || 'text-amber-400'}`}>
                  ★ {currentTitle?.name}
                </p>
                <span className="text-[10px] text-slate-400">
                  {currentAccount.exp.toLocaleString()} EXP / {currentAccount.maxExp.toLocaleString()} EXP
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAccountModalOpen(true)}
              title="Chuyển đổi 6 tài khoản hệ thống"
              className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition shrink-0"
            >
              <Users size={15} />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tactical_map')}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'tactical_map'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Bản Đồ Tổng (Tactical Map)</span>
            </button>

            <button
              onClick={() => setActiveTab('veterans')}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'veterans'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Medal className="w-4 h-4 text-pink-400" />
              <span>Hồ Sơ Cựu Chiến Binh</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Nhiệm Vụ Sự Kiện (Campaigns)</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Bảng Xếp Hạng (Leaderboard)</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin_cms')}
                className={`w-full px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                  activeTab === 'admin_cms'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-amber-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Quản Trị Di Sản (Admin CMS)</span>
              </button>
            )}
          </nav>
        </div>

        {/* BOTTOM SWITCHER: TOGGLE TO MOBILE SIMULATOR & LOGOUT */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              if (onOpenMobileSimulator) {
                onOpenMobileSimulator();
              } else {
                setDesktopViewMode('mobile_simulator');
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-[#D4AF37]/50 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 hover:border-[#D4AF37] hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-[#D4AF37]" />
            <span>Chuyển Sang Giả Lập Mobile AR</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-800/60 text-slate-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut size={13} />
            <span>Đăng Xuất Tài Khoản</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          KHU VỰC 2: NỘI DUNG CHÍNH (BÊN PHẢI - 80% CHIỀU RỘNG)
          ======================================================== */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#070D18]">
        {/* TAB 1: BẢN ĐỒ TỔNG CHIẾN DỊCH */}
        {activeTab === 'tactical_map' && (
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            <TacticalHeritageMap
              locations={locations}
              onSelectLocation={(loc) => setSelectedLocation(loc)}
              selectedLocationId={selectedLocation?.id}
            />
          </div>
        )}

        {/* TAB 2: HỒ SƠ CỰU CHIẾN BINH */}
        {activeTab === 'veterans' && (
          <div className="w-full h-full overflow-y-auto">
            <VeteransView
              veterans={veterans}
              visitedVeteranIds={visitedVeteranIds}
              currentUserName={currentAccount.displayName}
              onVisitVeteran={visitVeteran}
              onPlayVeteranAudio={onPlayVeteranAudio}
            />
          </div>
        )}

        {/* TAB 3: CHIẾN DỊCH LỊCH SỬ HÀO HÙNG */}
        {activeTab === 'campaigns' && (
          <div className="w-full h-full overflow-y-auto">
            <CampaignsView
              completedCampaignIds={completedCampaignIds}
              onStartCampaign={(camp: HistoricalCampaign) => {
                setActiveTab('tactical_map');
                showToast(`Bắt đầu chiến dịch: ${camp.title}`, 'Lắng nghe băng ghi âm và di chuyển đến tọa độ.', 'gold');
                setActiveAudioOverride({
                  title: camp.title,
                  speaker: camp.codeName,
                  textScript: `${camp.description}. ${camp.steps.step1Audio}`,
                });
              }}
            />
          </div>
        )}

        {/* TAB 4: BẢNG XẾP HẠNG */}
        {activeTab === 'leaderboard' && (
          <div className="p-8 max-w-4xl mx-auto w-full space-y-6 overflow-y-auto pb-36">
            <div className="text-center space-y-1">
              <Trophy className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE082] via-[#D4AF37] to-[#F59E0B]">
                BẢNG VINH DANH NHÀ GÌN GIỮ DI SẢN
              </h2>
              <p className="text-xs text-slate-400">
                Xếp hạng dựa trên điểm EXP thực địa, thử thách và danh hiệu đạt được
              </p>
            </div>

            <div className="space-y-2.5">
              {MOCK_LEADERBOARD.map((user) => (
                <div
                  key={user.rank}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                    user.rank === 1
                      ? 'bg-gradient-to-r from-[#20180B] to-[#121B2A] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'bg-[#0B1422] border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        user.rank === 1
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : user.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : user.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {user.rank}
                    </span>

                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                    />

                    <div>
                      <h4 className="text-xs font-bold text-white">{user.name}</h4>
                      <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#D4AF37]" />
                        {user.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-300">
                      {user.exp.toLocaleString()} EXP
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Cấp {user.level} · {user.locationsCount} Di tích
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: QUẢN TRỊ ADMIN CMS (CHỈ DÀNH CHO ADMIN) */}
        {activeTab === 'admin_cms' && isAdmin && (
          <div className="w-full h-full overflow-y-auto">
            <AdminCmsView
              locations={locations.map((l) => ({
                id: l.id,
                name: l.name,
                pinType: (l.contentType as any) || 'landmark',
                rarity: (l.rarity as any) || 'rare',
                address: l.address,
                imageUrl: l.imageUrl,
                content: l.historicalSummary || l.fullDescription || '',
                gameLink: l.storyChallengeIds?.[0] || 'story_ben_nha_rong',
                audioUrl: l.audioUrl,
                coordinates: l.coordinates,
                rewardTitleId: 'title_saigon_keeper',
              }))}
              veterans={veterans}
              onSaveLocation={saveCustomPin}
              onDeleteLocation={deleteCustomPin}
              onSaveVeteran={saveVeteranProfile}
            />
          </div>
        )}
      </main>

      {/* Global Audio Witness Player for PC Mission Control */}
      <AudioPlayerBar
        title={activeAudioOverride?.title}
        speaker={activeAudioOverride?.speaker}
        textScript={activeAudioOverride?.textScript}
        uploadedAudioUrl={activeAudioOverride?.uploadedAudioUrl}
        onClose={() => setActiveAudioOverride(null)}
      />

      {/* MODAL CHUYỂN NHANH 6 TÀI KHOẢN HỆ THỐNG */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1726] border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="text-amber-400" size={20} />
                <h3 className="text-base font-bold text-white">Chuyển Đổi 6 Tài Khoản Hệ Thống</h3>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-400 my-3">
              Nhấp vào một trong các tài khoản dưới đây để chuyển đổi quyền hạn ngay lập tức (1 Admin + 5 Người chơi):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pt-1">
              {allAccounts.map((acc) => {
                const titleObj = SYSTEM_TITLES.find((t) => t.id === acc.activeTitleId);
                const isAccAdmin = acc.role === 'ADMIN';
                const isCurrent = acc.id === currentAccount.id;

                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      loginAsAccount(acc);
                      setIsAccountModalOpen(false);
                      if (activeTab === 'admin_cms' && !isAccAdmin) {
                        setActiveTab('tactical_map');
                      }
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 group ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/40'
                        : isAccAdmin
                        ? 'bg-gradient-to-br from-red-950/40 via-[#131D31] to-amber-950/30 border-amber-500/50 hover:border-amber-400'
                        : 'bg-[#111B2E]/90 border-slate-800 hover:border-amber-500/50 hover:bg-[#152238]'
                    }`}
                  >
                    <img
                      src={acc.avatarUrl}
                      alt={acc.displayName}
                      className={`w-11 h-11 rounded-full object-cover border-2 shrink-0 ${
                        isAccAdmin ? 'border-amber-400' : 'border-slate-600'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 ${
                            isAccAdmin
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isAccAdmin ? <ShieldAlert size={10} /> : <UserCheck size={10} />}
                          {isAccAdmin ? 'ADMIN' : `CẤP ${String(acc.level).padStart(2, '0')}`}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">@{acc.username}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1 truncate">{acc.displayName}</h4>
                      <p className={`text-[11px] truncate mt-0.5 ${titleObj?.auraClass || 'text-amber-400'}`}>
                        ★ {titleObj?.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
