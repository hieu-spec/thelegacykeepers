// src/components/pc/PCCommandCenter.tsx
"use client";

import React, { useState } from "react";
import MinimalHeritageMap from "@/components/map/MinimalHeritageMap";
import SettingsProfileView from "@/components/views/SettingsProfileView";
import VeteransView from "@/components/views/VeteransView";
import StorytellerEngine from "@/components/minigame/StorytellerEngine";
import AdminCmsView from "@/components/views/AdminCmsView";

export type ActiveTab = "map" | "saved" | "minigame" | "veterans" | "profile" | "admin";

export interface PCCommandCenterProps {
  onOpenMobileSimulator?: () => void;
  onSwitchToMobile?: () => void;
}

export default function PCCommandCenter({
  onOpenMobileSimulator: _onOpenMobileSimulator,
  onSwitchToMobile: _onSwitchToMobile,
}: PCCommandCenterProps = {}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("map");
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [selectedGameSiteId, setSelectedGameSiteId] = useState<"dinh-doc-lap" | "ben-nha-rong">(
    "ben-nha-rong"
  );
  const [showAppComingSoonToast, setShowAppComingSoonToast] = useState(false);

  const t = {
    vi: {
      map: "Bản đồ Di sản",
      saved: "Di tích Đã lưu",
      minigame: "Giải mã Lịch sử",
      veterans: "Nhân chứng sống",
      profile: "Hồ sơ Cá nhân",
      admin: "Quản trị Di sản",
      appComingSoon: "App Coming Soon",
      appToast: "Ứng dụng di động iOS & Android đang trong giai đoạn hoàn thiện cuối cùng!",
    },
    en: {
      map: "Heritage Map",
      saved: "Saved Relics",
      minigame: "Decode History",
      veterans: "Living Witnesses",
      profile: "Personal Passport",
      admin: "Heritage CMS",
      appComingSoon: "App Coming Soon",
      appToast: "Native iOS & Android mobile apps are coming soon!",
    },
  }[lang];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4EFE6] text-[#2B2118]">
      {/* Thanh Sidebar dọc bên trái chuẩn bố cục Laptop trong ảnh chụp */}
      <aside className="w-[72px] xl:w-60 flex flex-col justify-between bg-[#231A12] text-[#FAF6EE] border-r-2 border-[#B48327] py-4 px-2.5 shrink-0 z-30">
        <div className="space-y-6 flex flex-col items-center xl:items-stretch">
          {/* Huy hiệu LK trên đỉnh Sidebar */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-11 h-11 rounded-full bg-[#3D2F23] border-2 border-[#B48327] flex items-center justify-center font-heritage font-bold text-sm text-[#E6C786] shrink-0 shadow">
              LK
            </div>
            <div className="hidden xl:block min-w-0">
              <p className="font-heritage font-bold text-sm text-[#E6C786] truncate">
                THE LEGACY KEEPERS
              </p>
              <p className="text-[11px] text-[#C8AE7D] truncate">Người Gìn Giữ Di Sản</p>
            </div>
          </div>

          {/* 5 Nút điều hướng với SVG Icon đồng nhất */}
          <nav className="space-y-2 w-full">
            {[
              {
                id: "map",
                label: t.map,
                svg: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <polygon points="15.5,8.5 13.5,13.5 8.5,15.5 10.5,10.5" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                id: "saved",
                label: t.saved,
                svg: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" />
                  </svg>
                ),
              },
              {
                id: "minigame",
                label: t.minigame,
                svg: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 11h-1.5a2 2 0 0 1 0-4H19V5a2 2 0 0 0-2-2h-2v1.5a2 2 0 0 1-4 0V3H9a2 2 0 0 0-2 2v2h1.5a2 2 0 0 1 0 4H7v2a2 2 0 0 0 2 2h2v-1.5a2 2 0 0 1 4 0V15h2a2 2 0 0 0 2-2v-2z" />
                  </svg>
                ),
              },
              {
                id: "veterans",
                label: t.veterans,
                svg: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
                  </svg>
                ),
              },
              {
                id: "admin",
                label: t.admin,
                svg: (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                ),
              },
            ].map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  title={item.label}
                  className={`w-full flex items-center justify-center xl:justify-start gap-3 p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#FAF6EE] text-[#8B1E1E] border-2 border-[#B48327] shadow-md"
                      : "text-[#C8AE7D] hover:bg-[#3D2F23] hover:text-[#FAF6EE]"
                  }`}
                >
                  {item.svg}
                  <span className="hidden xl:inline truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Cụm đáy Sidebar: Chuyển ngôn ngữ VI/EN & Nút App Coming Soon */}
        <div className="space-y-2.5 pt-4 border-t border-[#4A3A2C] flex flex-col items-center xl:items-stretch">
          <div className="flex flex-col xl:flex-row items-center justify-between bg-[#18120C] p-1 rounded-xl border border-[#5C4938] gap-1">
            <span className="hidden xl:inline text-[11px] text-[#C8AE7D] pl-2">Ngôn ngữ</span>
            <div className="flex gap-1">
              <button
                onClick={() => setLang("vi")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  lang === "vi" ? "bg-[#B48327] text-[#18120C]" : "text-[#C8AE7D]"
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  lang === "en" ? "bg-[#B48327] text-[#18120C]" : "text-[#C8AE7D]"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Nút App Coming Soon (Thay cho icon điện thoại màu vàng ở góc dưới trái trong ảnh chụp) */}
          <button
            onClick={() => {
              setShowAppComingSoonToast(true);
              setTimeout(() => setShowAppComingSoonToast(false), 3500);
            }}
            title={t.appComingSoon}
            className="w-full flex items-center justify-center xl:justify-start gap-2.5 p-2.5 rounded-xl bg-[#3D2F23] hover:bg-[#4F3D2E] border border-[#B48327] text-[#E6C786] text-xs font-bold transition cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 text-[#E6C786]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="2" width="12" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span className="hidden xl:inline truncate">{t.appComingSoon}</span>
          </button>
        </div>
      </aside>

      {/* Vùng Nội Dung Chính: Tự động điều chỉnh cuộn cho các tab văn bản và full-screen cho tab Bản đồ */}
      <main className={`flex-1 h-full relative ${activeTab === "map" ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}>
        {showAppComingSoonToast && (
          <div className="fixed top-5 right-5 z-50 bg-[#2B2118] text-[#FAF6EE] border-2 border-[#B48327] px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2">
            <span>✨</span>
            <span>{t.appToast}</span>
          </div>
        )}

        {activeTab === "map" && (
          <div className="relative flex-1 w-full h-full overflow-hidden">
            <MinimalHeritageMap
              lang={lang}
              onOpenMinigame={(siteId) => {
                setSelectedGameSiteId(siteId === "ben-nha-rong" ? "ben-nha-rong" : "dinh-doc-lap");
                setActiveTab("minigame");
              }}
            />
          </div>
        )}

        {activeTab === "saved" && (
          <div className="w-full max-w-6xl mx-auto p-6 space-y-5">
            <div className="border-b border-[#C8AE7D] pb-4">
              <h1 className="font-heritage text-2xl lg:text-3xl font-bold text-[#2B2118]">
                📜 {lang === "vi" ? "Di Tích & Kỷ Vật Đã Lưu" : "Saved Heritage & Relics"}
              </h1>
              <p className="text-sm text-[#5C4938]">
                {lang === "vi"
                  ? "Truy cập nhanh các hồ sơ di tích và chương giải mã lịch sử bạn đã đánh dấu"
                  : "Quickly access your bookmarked heritage sites and interactive history chapters"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: "ben-nha-rong",
                  name: "Bến Nhà Rồng",
                  year: "1911",
                  desc: "Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước (05/06/1911).",
                  img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                },
                {
                  id: "dinh-doc-lap",
                  name: "Dinh Độc Lập",
                  year: "1975",
                  desc: "Di tích Quốc gia Đặc biệt ghi dấu thời khắc thống nhất đất nước trưa 30/04/1975.",
                  img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
                },
              ].map((card) => (
                <div key={card.id} className="heritage-card rounded-2xl overflow-hidden flex flex-col">
                  <img src={card.img} alt={card.name} className="h-44 w-full object-cover sepia-[0.2]" />
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="px-2.5 py-0.5 rounded bg-[#8B1E1E] text-[#FAF6EE] text-[10px] font-bold">
                        Năm {card.year}
                      </span>
                      <h3 className="font-heritage text-lg font-bold text-[#2B2118] mt-1">
                        {card.name}
                      </h3>
                      <p className="text-xs text-[#5C4938] mt-1">{card.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedGameSiteId(card.id as "ben-nha-rong" | "dinh-doc-lap");
                        setActiveTab("minigame");
                      }}
                      className="w-full py-2 rounded-xl bg-[#2B2118] hover:bg-[#8B1E1E] text-[#FAF6EE] text-xs font-bold transition cursor-pointer"
                    >
                      Giải mã Lịch sử ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "minigame" && (
          <StorytellerEngine initialChapter={selectedGameSiteId} lang={lang} />
        )}

        {activeTab === "veterans" && <VeteransView />}

        {activeTab === "profile" && <SettingsProfileView lang={lang} />}

        {activeTab === "admin" && <AdminCmsView />}
      </main>
    </div>
  );
}

export { PCCommandCenter };
