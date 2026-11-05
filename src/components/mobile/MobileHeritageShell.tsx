// src/components/mobile/MobileHeritageShell.tsx
"use client";

import React, { useState } from "react";
import MinimalHeritageMap from "@/components/map/MinimalHeritageMap";
import SettingsProfileView from "@/components/views/SettingsProfileView";
import VeteransView from "@/components/views/VeteransView";
import StorytellerEngine from "@/components/minigame/StorytellerEngine";

export type MobileTab = "map" | "saved" | "minigame" | "veterans" | "profile";

export interface HeritageLocationItem {
  id: string;
  name: string;
  era: string;
  rarity: "legendary" | "rare" | "uncommon";
  coordinates: { lat: number; lng: number };
  distanceMeters: number;
  contentType?: "battlefield" | "landmark" | "witness";
  summary?: string;
  defaultEmblemEmoji?: string;
  witnessName?: string;
  witnessRole?: string;
  witnessTranscript?: string;
}

export interface MobileHeritageShellProps {
  isSimulatorFrame?: boolean;
  onExitSimulator?: () => void;
  onSwitchToPC?: () => void;
}

interface SavedHeritageItem {
  id: "ben-nha-rong" | "dinh-doc-lap" | "ham-biet-dong";
  titleVi: string;
  titleEn: string;
  year: string;
  distance: string;
  categoryVi: string;
  categoryEn: string;
  relicNameVi: string;
  relicNameEn: string;
  imageUrl: string;
}

const SAVED_HERITAGE_ITEMS: SavedHeritageItem[] = [
  {
    id: "ben-nha-rong",
    titleVi: "Bến Nhà Rồng",
    titleEn: "Dragon Wharf",
    year: "1911",
    distance: "0m",
    categoryVi: "Di tích Lưu niệm Chủ tịch Hồ Chí Minh",
    categoryEn: "Ho Chi Minh Memorial Site",
    relicNameVi: "Sổ Lương Thủy Thủ Văn Ba & Mô hình tàu Amiral Latouche-Tréville",
    relicNameEn: "Seaman Roster 'Van Ba' & Amiral Latouche-Tréville Model",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dinh-doc-lap",
    titleVi: "Dinh Độc Lập",
    titleEn: "Independence Palace",
    year: "1975",
    distance: "1579m",
    categoryVi: "Di tích Quốc gia Đặc biệt",
    categoryEn: "Special National Monument",
    relicNameVi: "Biên đội Xe tăng 843 & 390 • Bản đồ Chiến dịch Hồ Chí Minh",
    relicNameEn: "Tanks 843 & 390 • Ho Chi Minh Campaign Tactical Map",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ham-biet-dong",
    titleVi: "Hầm Biệt Động Sài Gòn",
    titleEn: "Saigon Commando Bunker",
    year: "1968",
    distance: "2075m",
    categoryVi: "Di tích Lịch sử Văn hóa Quốc gia",
    categoryEn: "National Historical Cultural Relic",
    relicNameVi: "Hầm vũ khí bí mật & Điện đài liên lạc nội đô Mậu Thân 1968",
    relicNameEn: "Secret Weapons Vault & 1968 Tet Offensive Field Radio",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
];

export default function MobileHeritageShell({
  isSimulatorFrame: _isSimulatorFrame,
  onExitSimulator,
  onSwitchToPC,
}: MobileHeritageShellProps = {}) {
  const [activeTab, setActiveTab] = useState<MobileTab>("map");
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [showAppToast, setShowAppToast] = useState<boolean>(false);
  const [selectedGameChapter, setSelectedGameChapter] = useState<"dinh-doc-lap" | "ben-nha-rong">(
    "ben-nha-rong"
  );
  const [savedItems, setSavedItems] = useState<SavedHeritageItem[]>(SAVED_HERITAGE_ITEMS);

  const handleExit = onExitSimulator || onSwitchToPC;

  const t = {
    vi: {
      badgeTitle: "SỨ GIẢ KÝ ỨC ĐÔNG SƠN",
      userName: "Lê Toàn Hiếu • Cấp 4",
      map: "Bản đồ",
      saved: "Đã lưu",
      decode: "Giải mã",
      veterans: "Tri ân",
      profile: "Hồ sơ",
      appComingSoon: "App Coming Soon",
      appToast: "Ứng dụng di động iOS & Android đang hoàn thiện và sẽ sớm ra mắt!",
      savedHeader: "Kho Lưu Trữ Di Sản & Kỷ Vật",
      savedSub: "Các địa điểm lịch sử và hiện vật bạn đã đánh dấu trong hành trình",
      openDecode: "Giải mã Lịch sử ↗",
      viewOnMap: "Định vị Bản đồ",
      removeSaved: "Bỏ lưu",
    },
    en: {
      badgeTitle: "DONG SON MEMORY ENVOY",
      userName: "Le Toan Hieu • Lv. 4",
      map: "Map",
      saved: "Saved",
      decode: "Decode",
      veterans: "Tribute",
      profile: "Profile",
      appComingSoon: "App Coming Soon",
      appToast: "Native iOS & Android mobile apps are in final preparation!",
      savedHeader: "Saved Heritage & Relics Vault",
      savedSub: "Historical landmarks and artifacts bookmarked during your journey",
      openDecode: "Decode History ↗",
      viewOnMap: "Locate on Map",
      removeSaved: "Remove",
    },
  }[lang];

  const navItems: { id: MobileTab; label: string; svg: React.ReactNode }[] = [
    {
      id: "map",
      label: t.map,
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <polygon points="15.5,8.5 13.5,13.5 8.5,15.5 10.5,10.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      id: "saved",
      label: t.saved,
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />
        </svg>
      ),
    },
    {
      id: "minigame",
      label: t.decode,
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 11h-1.5a2 2 0 0 1 0-4H19V5a2 2 0 0 0-2-2h-2v1.5a2 2 0 0 1-4 0V3H9a2 2 0 0 0-2 2v2h1.5a2 2 0 0 1 0 4H7v2a2 2 0 0 0 2 2h2v-1.5a2 2 0 0 1 4 0V15h2a2 2 0 0 0 2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "veterans",
      label: t.veterans,
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="8" r="3.5" />
          <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M15 19c.4-2.3 2.2-4 4.5-4" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: t.profile,
      svg: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#F4EFE6] text-[#2B2118] overflow-hidden select-none">
      {/* Header Định danh Người Dùng (Giữ đúng bố cục thực tế trên điện thoại + Đổi sang màu Cổ điển) */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#FAF6EE] border-b border-[#C8AE7D] shrink-0 z-30 shadow-sm">
        <div
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 cursor-pointer min-w-0"
        >
          <div className="w-10 h-10 rounded-full bg-[#2B2118] border-2 border-[#B48327] text-[#E6C786] flex items-center justify-center font-heritage font-bold text-xs shrink-0 shadow">
            LK
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-wider uppercase text-[#8B1E1E] truncate">
              {t.badgeTitle}
            </p>
            <p className="font-heritage font-bold text-sm text-[#2B2118] truncate">
              {t.userName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Công tắc chuyển đổi ngôn ngữ VI / EN */}
          <div className="flex bg-[#EAE0D0] p-0.5 rounded-lg border border-[#C8AE7D]">
            <button
              onClick={() => setLang("vi")}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                lang === "vi" ? "bg-[#8B1E1E] text-[#FAF6EE]" : "text-[#5C4938]"
              }`}
            >
              VI
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                lang === "en" ? "bg-[#8B1E1E] text-[#FAF6EE]" : "text-[#5C4938]"
              }`}
            >
              EN
            </button>
          </div>

          {/* Nút App Coming Soon */}
          <button
            onClick={() => {
              setShowAppToast(true);
              setTimeout(() => setShowAppToast(false), 3200);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#2B2118] hover:bg-[#3D2F23] text-[#E6C786] border border-[#B48327] text-[10px] font-bold shadow-sm transition cursor-pointer"
          >
            {t.appComingSoon}
          </button>

          {/* Nút thoát giả lập về PC (nếu đang ở màn hình giả lập) */}
          {handleExit && (
            <button
              onClick={handleExit}
              className="px-2 py-1.5 rounded-lg bg-[#EAE0D0] hover:bg-[#C8AE7D] text-[#2B2118] text-[10px] font-bold transition cursor-pointer"
              title="Quay lại giao diện PC"
            >
              ✕ PC
            </button>
          )}
        </div>
      </header>

      {/* Thông báo nổi khi bấm App Coming Soon */}
      {showAppToast && (
        <div className="fixed top-16 inset-x-4 z-50 bg-[#2B2118] text-[#FAF6EE] border-2 border-[#B48327] px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium text-center">
          ✨ {t.appToast}
        </div>
      )}

      {/* Vùng Nội dung Chính */}
      <main className={`flex-1 ${activeTab === "map" ? "relative overflow-hidden flex flex-col" : "overflow-y-auto px-3 pt-3 pb-28"}`}>
        {activeTab === "map" && (
          <div className="relative flex-1 w-full h-full overflow-hidden">
            <MinimalHeritageMap
              lang={lang}
              onOpenMinigame={(siteId) => {
                setSelectedGameChapter(siteId === "ben-nha-rong" ? "ben-nha-rong" : "dinh-doc-lap");
                setActiveTab("minigame");
              }}
            />
          </div>
        )}

        {/* Tab Đã lưu (Hoàn thiện đầy đủ danh sách di tích & kỷ vật đã lưu) */}
        {activeTab === "saved" && (
          <div className="space-y-4 py-1">
            <div className="heritage-card rounded-2xl p-4">
              <h2 className="font-heritage text-xl font-bold text-[#2B2118]">
                📜 {t.savedHeader} ({savedItems.length})
              </h2>
              <p className="text-xs text-[#5C4938] mt-0.5">{t.savedSub}</p>
            </div>

            <div className="space-y-3">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="heritage-card rounded-2xl overflow-hidden border border-[#C8AE7D] flex flex-col"
                >
                  <div className="relative h-36 bg-[#2B2118]">
                    <img
                      src={item.imageUrl}
                      alt={item.titleVi}
                      className="w-full h-full object-cover sepia-[0.22]"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#2B2118]/90 text-[#E6C786] border border-[#B48327] text-[10px] font-bold">
                      Mốc {item.year} • Cách {item.distance}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#8B1E1E]">
                        {lang === "vi" ? item.categoryVi : item.categoryEn}
                      </span>
                      <h3 className="font-heritage text-base font-bold text-[#2B2118]">
                        {lang === "vi" ? item.titleVi : item.titleEn}
                      </h3>
                      <p className="text-xs text-[#5C4938] mt-1">
                        🏺 {lang === "vi" ? item.relicNameVi : item.relicNameEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#C8AE7D]/70">
                      <button
                        onClick={() => {
                          setSelectedGameChapter(
                            item.id === "ben-nha-rong" ? "ben-nha-rong" : "dinh-doc-lap"
                          );
                          setActiveTab("minigame");
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] text-xs font-bold text-center shadow-sm transition cursor-pointer"
                      >
                        {t.openDecode}
                      </button>
                      <button
                        onClick={() => setActiveTab("map")}
                        className="py-2 px-3 rounded-xl bg-[#EAE0D0] hover:bg-[#C8AE7D] border border-[#B48327] text-[#2B2118] text-xs font-bold transition cursor-pointer"
                      >
                        {t.viewOnMap}
                      </button>
                      <button
                        onClick={() =>
                          setSavedItems((prev) => prev.filter((x) => x.id !== item.id))
                        }
                        className="py-2 px-2.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE0D0] border border-[#C8AE7D] text-[#5C4938] text-xs transition cursor-pointer"
                        title={t.removeSaved}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "minigame" && (
          <StorytellerEngine initialChapter={selectedGameChapter} lang={lang} />
        )}

        {activeTab === "veterans" && <VeteransView />}

        {activeTab === "profile" && <SettingsProfileView lang={lang} />}
      </main>

      {/* Thanh Điều Hướng Nổi Dạng Viên Thuốc (Floating Pill Navigation Bar giống ảnh chụp Mobile) */}
      <div className="fixed bottom-3 inset-x-3 z-40 pointer-events-none flex justify-center">
        <nav className="pointer-events-auto w-full max-w-md bg-[#231A12]/95 backdrop-blur-md border-2 border-[#B48327] rounded-full p-1.5 shadow-2xl flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FAF6EE] text-[#8B1E1E] shadow-md border border-[#B48327]"
                    : "text-[#C8AE7D] hover:text-[#FAF6EE]"
                }`}
              >
                {item.svg}
                <span
                  className={`text-[10px] mt-0.5 leading-tight ${
                    isActive ? "font-bold text-[#2B2118]" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export { MobileHeritageShell };
