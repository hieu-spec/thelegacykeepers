// src/components/views/SettingsProfileView.tsx
"use client";

import React, { useState, useRef } from "react";

export interface CompanionItem {
  id: string;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  loreVi: string;
  loreEn: string;
  svg: React.ReactNode;
}

export interface AchievementBadge {
  id: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  svg: React.ReactNode;
}

export interface JourneyLogEntry {
  id: string;
  placeVi: string;
  placeEn: string;
  descVi: string;
  descEn: string;
  timeVi: string;
  timeEn: string;
  exp: string;
  dotColor: string;
}

export interface SettingsProfileViewProps {
  lang?: "vi" | "en";
  onBack?: () => void;
}

// Bộ 5 Linh vật Đồng hành thuần Việt (Đã xóa Pikachu & vẽ chuẩn Chim Lạc Đông Sơn)
const HERITAGE_COMPANIONS: CompanionItem[] = [
  {
    id: "chien-si",
    nameVi: "Chiến Sĩ",
    nameEn: "Liberation Soldier",
    subtitleVi: "Bộ đội Cụ Hồ",
    subtitleEn: "Uncle Ho's Soldier",
    loreVi: "Chiếc mũ cối xanh gắn ngôi sao vàng năm cánh đồng hành trên mọi nẻo đường chiến dịch.",
    loreEn: "The iconic green pith helmet with a golden star accompanying every historic campaign.",
    svg: (
      <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none">
        <path
          d="M10 33C10 20 18 14 28 14C38 14 46 20 46 33H10Z"
          fill="#3B5E3C"
          stroke="#2B2118"
          strokeWidth="2.2"
        />
        <path
          d="M5 33H51C48.5 36.8 40 38 28 38C16 38 7.5 36.8 5 33Z"
          fill="#284229"
          stroke="#2B2118"
          strokeWidth="2.2"
        />
        <circle cx="28" cy="24" r="5.5" fill="#8B1E1E" stroke="#E6C786" strokeWidth="1.4" />
        <polygon
          points="28,19.8 29.3,22.5 32.2,22.9 30,24.9 30.6,27.8 28,26.3 25.4,27.8 26,24.9 23.8,22.9 26.7,22.5"
          fill="#E6C786"
        />
      </svg>
    ),
  },
  {
    id: "su-gia",
    nameVi: "Sử Gia",
    nameEn: "Grand Historian",
    subtitleVi: "Học giả Lịch sử",
    subtitleEn: "Historical Scholar",
    loreVi: "Cuộn thư Đại Việt Sử Ký lưu giữ biên niên sử hàng ngàn năm văn hiến.",
    loreEn: "The ancient royal scroll preserving millennia of national chronicles.",
    svg: (
      <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none">
        <rect
          x="15"
          y="11"
          width="26"
          height="34"
          rx="2"
          fill="#F3DFB9"
          stroke="#5C4938"
          strokeWidth="2.2"
        />
        <rect x="11" y="9" width="34" height="4.5" rx="2.2" fill="#8B1E1E" stroke="#2B2118" strokeWidth="1.5" />
        <rect x="11" y="42.5" width="34" height="4.5" rx="2.2" fill="#8B1E1E" stroke="#2B2118" strokeWidth="1.5" />
        <line x1="20" y1="20" x2="36" y2="20" stroke="#8B1E1E" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="20" y1="26" x2="36" y2="26" stroke="#5C4938" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="32" x2="31" y2="32" stroke="#5C4938" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="34" r="3" fill="#8B1E1E" />
      </svg>
    ),
  },
  {
    id: "rong-con",
    nameVi: "Rồng Con",
    nameEn: "Lac Hong Dragon",
    subtitleVi: "Hậu duệ Lạc Hồng",
    subtitleEn: "Descendant of Lac Hong",
    loreVi: "Hình tượng Rồng thời Lý – Trần uốn lượn tượng trưng cho khí phách Thăng Long.",
    loreEn: "The sinuous Ly-Tran Dynasty dragon symbolizing the spirit of Thang Long.",
    svg: (
      <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none">
        <path
          d="M12 40C12 29 19 27 26 27C34 27 40 22 38 14C34 11 26 15 26 20"
          stroke="#B48327"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <circle cx="37" cy="15" r="5" fill="#8B1E1E" stroke="#E6C786" strokeWidth="1.5" />
        <circle cx="38" cy="14" r="1.5" fill="#FAF6EE" />
        <path d="M40 11L46 8M42 15L48 15" stroke="#B48327" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M10 42H46" stroke="#8B1E1E" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "chim-lac",
    nameVi: "Chim Lạc",
    nameEn: "Lac Bird",
    subtitleVi: "Biểu tượng Đông Sơn",
    subtitleEn: "Dong Son Totem",
    loreVi: "Họa tiết Chim Lạc khắc trên mặt trống đồng Ngọc Lũ, biểu tượng cội nguồn Văn Lang.",
    loreEn: "The sacred Lac Bird engraved on the Ngoc Lu bronze drum, emblem of Van Lang.",
    // Đồ họa Chim Lạc Đông Sơn mỏ dài, mào cao, sải cánh khắc họa tiết (thay thế hoàn toàn chim bồ câu trắng)
    svg: (
      <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none">
        <path
          d="M7 26L25 30L48 15L34 31L46 39L25 34L11 43L18 31L7 26Z"
          fill="#B48327"
          stroke="#8B1E1E"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M25 30L35 11L29 27" fill="#8B1E1E" />
        <path d="M36 18L49 14" stroke="#8B1E1E" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="37" cy="21" r="1.8" fill="#FAF6EE" />
      </svg>
    ),
  },
  {
    id: "kim-quy",
    nameVi: "Kim Quy",
    nameEn: "Golden Turtle",
    subtitleVi: "Thần Kim Quy Cổ Loa",
    subtitleEn: "Co Loa Guardian",
    loreVi: "Sứ giả Thanh Giang trao vuốt thần chế tạo nỏ Liên Châu bảo vệ thành Cổ Loa.",
    loreEn: "The sacred Golden Turtle who gifted his claw for the magic crossbow of Co Loa Citadel.",
    // Thay thế hoàn toàn Pikachu (icon tia sét) bằng Thần Kim Quy mai vàng khắc ấn Cổ Loa
    svg: (
      <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none">
        <path
          d="M13 35C13 22 20 16 29 16C38 16 45 22 45 35H13Z"
          fill="#B48327"
          stroke="#2B2118"
          strokeWidth="2.2"
        />
        <polygon
          points="21,25 29,20 37,25 34,33 24,33"
          fill="#E6C786"
          stroke="#8B1E1E"
          strokeWidth="1.8"
        />
        <circle cx="47" cy="30" r="4.2" fill="#5C4938" stroke="#2B2118" strokeWidth="1.8" />
        <circle cx="48" cy="29" r="1.2" fill="#FAF6EE" />
        <rect x="17" y="35" width="5" height="6" rx="1.5" fill="#5C4938" stroke="#2B2118" strokeWidth="1.5" />
        <rect x="36" y="35" width="5" height="6" rx="1.5" fill="#5C4938" stroke="#2B2118" strokeWidth="1.5" />
      </svg>
    ),
  },
];

// Bộ 3 Danh hiệu Đã Thu thập với Huy hiệu Ấn chương Cổ điển
const HERITAGE_BADGES: AchievementBadge[] = [
  {
    id: "dong-son",
    titleVi: "Sứ Giả Ký Ức Đông Sơn",
    titleEn: "Dong Son Memory Envoy",
    descVi: "Khởi đầu hành trình gìn giữ và khám phá di sản dân tộc",
    descEn: "Initiated the journey of preserving and exploring national heritage",
    svg: (
      <svg className="w-10 h-10" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="#B48327" stroke="#8B1E1E" strokeWidth="2.2" />
        <circle cx="22" cy="22" r="12" stroke="#FAF6EE" strokeWidth="1.5" strokeDasharray="3 2" />
        <polygon
          points="22,12 24.5,19.5 32,22 24.5,24.5 22,32 19.5,24.5 12,22 19.5,19.5"
          fill="#FAF6EE"
        />
      </svg>
    ),
  },
  {
    id: "thu-thoi-chien",
    titleVi: "Người Giữ Thư Thời Chiến",
    titleEn: "Wartime Letter Keeper",
    descVi: "Thu thập và lắng nghe các bức thư, kỷ vật rơi trên đường hành quân",
    descEn: "Collected and listened to wartime letters and relics along the march",
    svg: (
      <svg className="w-10 h-10" viewBox="0 0 44 44" fill="none">
        <rect x="7" y="11" width="30" height="22" rx="3" fill="#8B1E1E" stroke="#B48327" strokeWidth="2.2" />
        <path d="M8 13L22 24L36 13" stroke="#E6C786" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="22" cy="23" r="3" fill="#E6C786" />
      </svg>
    ),
  },
  {
    id: "nguoi-chau-tri-an",
    titleVi: "★ Người Cháu Tri Ân",
    titleEn: "★ Grateful Descendant",
    descVi: "Lắng nghe hồi ký và gửi lời tri ân tới các Cựu chiến binh",
    descEn: "Listened to memoirs and sent tributes to War Veterans",
    svg: (
      <svg className="w-10 h-10" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" fill="#2E5A44" stroke="#B48327" strokeWidth="2.2" />
        <polygon
          points="22,10 25.2,17.6 33.5,18.5 27.2,24 29.1,32 22,27.7 14.9,32 16.8,24 10.5,18.5 18.8,17.6"
          fill="#E6C786"
        />
      </svg>
    ),
  },
];

// Danh sách Nhật ký Hành trình Di sản (Đầy đủ các mốc để cuộn mượt trên Laptop)
const INITIAL_LOGS: JourneyLogEntry[] = [
  {
    id: "j-1",
    placeVi: "Bến Nhà Rồng",
    placeEn: "Dragon Wharf",
    descVi: "Khởi hành tìm kiếm kỷ vật & hoàn thành giải đố 1911",
    descEn: "Started relic search & completed the 1911 historical puzzle",
    timeVi: "Hôm nay",
    timeEn: "Today",
    exp: "+150 EXP",
    dotColor: "#8B1E1E",
  },
  {
    id: "j-2",
    placeVi: "Dinh Độc Lập",
    placeEn: "Independence Palace",
    descVi: "Nghe thuyết minh chiến dịch Hồ Chí Minh lịch sử",
    descEn: "Listened to the historic Ho Chi Minh Campaign narration",
    timeVi: "Hôm qua",
    timeEn: "Yesterday",
    exp: "+120 EXP",
    dotColor: "#2E5A44",
  },
  {
    id: "j-3",
    placeVi: "Hầm Biệt Động Sài Gòn",
    placeEn: "Saigon Commando Bunker",
    descVi: "Khám phá căn hầm bí mật chứa vũ khí nội đô năm 1968",
    descEn: "Explored the secret 1968 inner-city weapons vault",
    timeVi: "3 ngày trước",
    timeEn: "3 days ago",
    exp: "+180 EXP",
    dotColor: "#B48327",
  },
  {
    id: "j-4",
    placeVi: "Cụm Tình Báo Chiến Lược H.63",
    placeEn: "Strategic Intelligence Cluster H.63",
    descVi: "Lắng nghe hồi ký Đại tá Nguyễn Văn Tàu (Tư Cang) và gửi lời tri ân",
    descEn: "Listened to Colonel Tu Cang's memoir and sent gratitude tribute",
    timeVi: "5 ngày trước",
    timeEn: "5 days ago",
    exp: "+200 EXP",
    dotColor: "#5C4938",
  },
];

export default function SettingsProfileView({
  lang = "vi",
  onBack,
}: SettingsProfileViewProps = {}) {
  // State định danh Hồ sơ
  const [profileName, setProfileName] = useState<string>("Lê Toàn Hiếu");
  const [profileInitials, setProfileInitials] = useState<string>("TH");
  const [mottoVi, setMottoVi] = useState<string>(
    "Tự hào gìn giữ ký ức lịch sử hào hùng của dân tộc Việt Nam."
  );
  const [mottoEn, setMottoEn] = useState<string>(
    "Proudly preserving the heroic historical memories of Vietnam."
  );

  // State trang bị Linh vật & Danh hiệu
  const [selectedCompanionId, setSelectedCompanionId] = useState<string>("chien-si");
  const [equippedBadgeId, setEquippedBadgeId] = useState<string>("dong-son");

  // State Modal Sửa hồ sơ, Sửa châm ngôn, Đăng nhập/Đăng ký & Chia sẻ Thẻ Hộ Chiếu
  const [isEditingMotto, setIsEditingMotto] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | null>(null);
  const [showSharePassportModal, setShowSharePassportModal] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const equippedBadge =
    HERITAGE_BADGES.find((b) => b.id === equippedBadgeId) || HERITAGE_BADGES[0];
  const activeCompanion =
    HERITAGE_COMPANIONS.find((c) => c.id === selectedCompanionId) || HERITAGE_COMPANIONS[0];

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Hàm vẽ Thẻ Hộ Chiếu Di Sản lên HTML5 Canvas để tải ảnh PNG hoặc Chia sẻ
  const renderPassportToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Nền Giấy Dó cổ điển
    ctx.fillStyle = "#F4EFE6";
    ctx.fillRect(0, 0, 720, 420);

    // Khung viền kép Vàng Đồng & Đỏ Son
    ctx.strokeStyle = "#8B1E1E";
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 16, 688, 388);
    ctx.strokeStyle = "#B48327";
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, 668, 368);

    // Tiêu đề Hộ chiếu
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("THE LEGACY KEEPERS • HỘ CHIẾU NGƯỜI GÌN GIỮ DI SẢN", 48, 64);

    // Huy hiệu chữ viết tắt TH
    ctx.fillStyle = "#2B2118";
    ctx.fillRect(48, 86, 78, 78);
    ctx.strokeStyle = "#B48327";
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 86, 78, 78);
    ctx.fillStyle = "#E6C786";
    ctx.font = "bold 30px serif";
    ctx.fillText(profileInitials, 65, 136);

    // Tên & Danh hiệu đang đeo
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(
      (lang === "vi" ? equippedBadge.titleVi : equippedBadge.titleEn).toUpperCase(),
      144,
      106
    );
    ctx.fillStyle = "#2B2118";
    ctx.font = "bold 32px serif";
    ctx.fillText(profileName, 144, 142);
    ctx.fillStyle = "#2E5A44";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("✓ Đã xác thực Hộ chiếu Di sản • Cấp độ 4 (1.450 / 2.000 EXP)", 144, 166);

    // Châm ngôn cá nhân
    ctx.fillStyle = "#EAE0D0";
    ctx.fillRect(48, 192, 624, 72);
    ctx.fillStyle = "#5C4938";
    ctx.font = "italic 16px serif";
    const quoteText = `"${lang === "vi" ? mottoVi : mottoEn}"`;
    ctx.fillText(quoteText.slice(0, 72), 64, 234);

    // Thông số thống kê
    ctx.fillStyle = "#2B2118";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("🏛️ 6 Di tích đã mở", 48, 312);
    ctx.fillText("🏅 3 Danh hiệu", 260, 312);
    ctx.fillText(
      `🐾 Đồng hành: ${lang === "vi" ? activeCompanion.nameVi : activeCompanion.nameEn}`,
      440,
      312
    );

    // Ấn chương đóng dấu góc dưới
    ctx.fillStyle = "#8B1E1E";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("ẤN CHƯƠNG CHỨNG NHẬN DI SẢN VIỆT NAM • LEGACY KEEPERS", 48, 368);
  };

  const handleOpenShareModal = () => {
    setShowSharePassportModal(true);
    setTimeout(() => {
      renderPassportToCanvas();
    }, 80);
  };

  const handleDownloadPassportPng = () => {
    renderPassportToCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Ho-Chieu-Di-San-${profileInitials}.png`;
    link.href = dataUrl;
    link.click();
    triggerToast(
      lang === "vi"
        ? "Đã tải ảnh PNG Thẻ Hồ Sơ Di Sản về thiết bị!"
        : "Downloaded Heritage Passport PNG card!"
    );
  };

  const handleNativeShareOrCopy = async () => {
    const shareText = `${profileName} (${
      lang === "vi" ? equippedBadge.titleVi : equippedBadge.titleEn
    }) • Cấp độ 4 (1.450/2.000 EXP) trên The Legacy Keepers!`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Thẻ Hồ Sơ Di Sản - The Legacy Keepers",
          text: shareText,
          url: shareUrl,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
        triggerToast(
          lang === "vi"
            ? "Đã sao chép liên kết Thẻ Hồ Sơ Di Sản vào bộ nhớ tạm!"
            : "Copied Heritage Passport link to clipboard!"
        );
      }
    } catch {
      triggerToast(
        lang === "vi"
          ? "Đã sao chép thông tin Thẻ Hồ Sơ Di Sản!"
          : "Heritage Passport details copied!"
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-7 space-y-6 pb-20">
      {/* Thông báo nổi (Toast) */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-50 bg-[#2B2118] text-[#FAF6EE] border-2 border-[#B48327] px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2">
          <span>✨</span>
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Header Hồ sơ Cá nhân + Cụm nút Đăng nhập / Đăng ký / Sửa Hồ Sơ */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8AE7D] pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-2 rounded-xl bg-[#2B2118] text-[#FAF6EE] border border-[#B48327] text-xs font-semibold cursor-pointer shrink-0"
              title="Quay lại"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="font-heritage text-2xl lg:text-3xl font-bold text-[#2B2118]">
              {lang === "vi" ? "Hồ sơ Cá nhân" : "Personal Heritage Passport"}
            </h1>
            <p className="text-xs lg:text-sm text-[#5C4938]">
              {lang === "vi"
                ? "Quản lý định danh Người Gìn Giữ Di Sản, nhân vật đồng hành, danh hiệu và nhật ký hành trình"
                : "Manage your Legacy Keeper identity, map companions, titles, and journey chronicle"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAuthModalMode("login")}
            className="px-3.5 py-2 rounded-xl border border-[#8B1E1E] text-[#8B1E1E] hover:bg-[#8B1E1E]/10 text-xs font-bold transition cursor-pointer"
          >
            {lang === "vi" ? "Đăng nhập" : "Log In"}
          </button>
          <button
            onClick={() => setAuthModalMode("register")}
            className="px-3.5 py-2 rounded-xl bg-[#B48327] hover:bg-[#9E7B42] text-[#FAF6EE] text-xs font-bold shadow-sm transition cursor-pointer"
          >
            {lang === "vi" ? "Đăng ký" : "Register"}
          </button>
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="px-4 py-2 rounded-xl bg-[#2B2118] hover:bg-[#3D2F23] text-[#FAF6EE] border border-[#B48327] text-xs font-bold shadow-sm transition cursor-pointer"
          >
            ✎ {lang === "vi" ? "Sửa Hồ Sơ" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Bố cục 2 cột chuẩn trên Laptop & Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (5/12): Thẻ Định Danh + Nhật ký Hành trình Di sản (Có thanh cuộn mượt) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Thẻ Định Danh Người Gìn Giữ Di Sản */}
          <div className="heritage-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4 bg-[#EAE0D0]/75 border border-[#C8AE7D] p-4 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-[#2B2118] border-2 border-[#B48327] text-[#E6C786] flex items-center justify-center font-heritage font-bold text-xl shrink-0 shadow">
                {profileInitials}
              </div>
              <div className="min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8B1E1E] text-[#FAF6EE] text-[10px] font-bold tracking-wider uppercase">
                  {lang === "vi" ? equippedBadge.titleVi : equippedBadge.titleEn}
                </span>
                <h2 className="font-heritage text-xl font-bold text-[#2B2118] truncate mt-0.5">
                  {profileName}
                </h2>
                <p className="text-xs text-[#2E5A44] font-semibold">
                  ✓ {lang === "vi" ? "Đã xác thực Hộ chiếu Di sản" : "Verified Heritage Passport"}
                </p>
              </div>
            </div>

            {/* Ô Ghi chú & Châm ngôn Cá nhân (Bấm nút Sửa để chỉnh trực tiếp) */}
            <div className="bg-[#F4EFE6] border border-[#C8AE7D] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#5C4938] uppercase">
                <span>
                  ❝ {lang === "vi" ? "Ghi chú & Châm ngôn Cá nhân" : "Personal Motto & Note"}
                </span>
                <button
                  onClick={() => setIsEditingMotto(!isEditingMotto)}
                  className="underline text-[#8B1E1E] hover:text-[#2B2118] cursor-pointer"
                >
                  {isEditingMotto
                    ? lang === "vi"
                      ? "Lưu"
                      : "Save"
                    : lang === "vi"
                    ? "Sửa"
                    : "Edit"}
                </button>
              </div>

              {isEditingMotto ? (
                <textarea
                  rows={2}
                  value={lang === "vi" ? mottoVi : mottoEn}
                  onChange={(e) =>
                    lang === "vi" ? setMottoVi(e.target.value) : setMottoEn(e.target.value)
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF6EE] border border-[#B48327] text-xs text-[#2B2118]"
                />
              ) : (
                <p className="text-xs italic text-[#2B2118] leading-relaxed">
                  &ldquo;{lang === "vi" ? mottoVi : mottoEn}&rdquo;
                </p>
              )}
            </div>

            {/* Thanh Cấp độ & Kinh nghiệm EXP */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span>
                  {lang === "vi" ? "Cấp độ 4 • Học giả Trẻ" : "Level 4 • Young Scholar"}
                </span>
                <span className="text-[#8B1E1E]">1.450 / 2.000 EXP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#EAE0D0] overflow-hidden border border-[#C8AE7D]">
                <div className="h-full bg-gradient-to-r from-[#8B1E1E] to-[#B48327] w-[72.5%]" />
              </div>
            </div>

            {/* 3 Ô Thống kê */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-[#F4EFE6] border border-[#C8AE7D] rounded-xl py-2.5">
                <p className="font-heritage font-bold text-base text-[#8B1E1E]">6</p>
                <p className="text-[11px] text-[#5C4938]">
                  {lang === "vi" ? "Di tích đã mở" : "Sites Unlocked"}
                </p>
              </div>
              <div className="bg-[#F4EFE6] border border-[#C8AE7D] rounded-xl py-2.5">
                <p className="font-heritage font-bold text-base text-[#8B1E1E]">3</p>
                <p className="text-[11px] text-[#5C4938]">
                  {lang === "vi" ? "Danh hiệu" : "Titles"}
                </p>
              </div>
              <div className="bg-[#F4EFE6] border border-[#C8AE7D] rounded-xl py-2.5">
                <p className="font-heritage font-bold text-base text-[#8B1E1E]">5</p>
                <p className="text-[11px] text-[#5C4938]">
                  {lang === "vi" ? "Bạn đồng hành" : "Companions"}
                </p>
              </div>
            </div>

            {/* Nút Chia sẻ Thẻ Hồ Sơ Di Sản (Mở Modal xuất ảnh PNG & Chia sẻ liên kết) */}
            <button
              onClick={handleOpenShareModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] border border-[#E6C786] text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>
                {lang === "vi" ? "Chia sẻ Thẻ Hồ Sơ Di Sản" : "Share Heritage Passport Card"}
              </span>
            </button>
          </div>

          {/* Khung Nhật ký Hành trình Di sản: Đã cấp thanh cuộn độc lập max-h-[340px] trên Laptop */}
          <div className="heritage-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 border-b border-[#C8AE7D] pb-2.5">
              <h3 className="font-heritage font-bold text-base text-[#2B2118] flex items-center gap-2">
                <span>🕒</span>
                <span>
                  {lang === "vi" ? "Nhật ký Hành trình Di sản" : "Heritage Journey Log"}
                </span>
              </h3>
              <span className="text-[11px] font-semibold text-[#8B1E1E]">
                {lang === "vi" ? "Gần đây ↓" : "Recent ↓"}
              </span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1.5">
              {INITIAL_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] flex items-start justify-between gap-3 hover:border-[#8B1E1E] transition"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: log.dotColor }}
                    />
                    <div className="min-w-0">
                      <p className="font-heritage font-bold text-sm text-[#2B2118]">
                        {lang === "vi" ? log.placeVi : log.placeEn}
                      </p>
                      <p className="text-xs text-[#5C4938] mt-0.5 leading-relaxed">
                        {lang === "vi" ? log.descVi : log.descEn}
                      </p>
                      <p className="text-[11px] text-[#8B1E1E] font-semibold mt-1">
                        {lang === "vi" ? log.timeVi : log.timeEn}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#EAE0D0] border border-[#B48327] text-[11px] font-bold text-[#2B2118]">
                    {log.exp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (7/12): Nhân vật Đồng hành trên Bản đồ + Danh hiệu Đã Thu thập */}
        <div className="lg:col-span-7 space-y-6">
          {/* Khung Nhân vật Đồng hành trên Bản đồ (Đã thay Chim Bồ Câu -> Chim Lạc & Xóa Pikachu -> Kim Quy) */}
          <div className="heritage-card rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-heritage font-bold text-lg text-[#2B2118]">
                  🐾{" "}
                  {lang === "vi"
                    ? "Nhân vật Đồng hành trên Bản đồ"
                    : "Map Exploration Companions"}
                </h3>
                <p className="text-xs text-[#5C4938]">
                  {lang === "vi"
                    ? "Chọn linh vật xuất hiện cùng bạn khi di chuyển khám phá các di tích lịch sử"
                    : "Select the historical mascot accompanying you across heritage landmarks"}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EAE0D0] border border-[#B48327] text-xs font-bold text-[#2B2118]">
                {lang === "vi" ? "Đã mở khóa 5/5" : "Unlocked 5/5"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {HERITAGE_COMPANIONS.map((comp) => {
                const isSelected = comp.id === selectedCompanionId;
                return (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompanionId(comp.id);
                      triggerToast(
                        lang === "vi"
                          ? `Đã chọn "${comp.nameVi}" làm Nhân vật Đồng hành trên Bản đồ!`
                          : `Selected "${comp.nameEn}" as your Map Companion!`
                      );
                    }}
                    className={`relative p-3.5 rounded-2xl flex flex-col items-center text-center transition border cursor-pointer ${
                      isSelected
                        ? "bg-[#EAE0D0] border-2 border-[#2B2118] shadow-md"
                        : "bg-[#F4EFE6] border-[#C8AE7D] hover:bg-[#EAE0D0]/60"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2B2118] text-[#E6C786] text-[11px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-[#FAF6EE] border border-[#C8AE7D] flex items-center justify-center mb-2.5 shadow-inner">
                      {comp.svg}
                    </div>
                    <p className="font-heritage font-bold text-xs text-[#2B2118]">
                      {lang === "vi" ? comp.nameVi : comp.nameEn}
                    </p>
                    <p className="text-[10px] text-[#5C4938] mt-0.5 leading-tight">
                      {lang === "vi" ? comp.subtitleVi : comp.subtitleEn}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Mô tả ý nghĩa lịch sử của Nhân vật Đồng hành đang chọn */}
            <div className="p-3.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] flex items-center justify-between gap-3">
              <div className="text-xs text-[#2B2118]">
                <strong className="text-[#8B1E1E]">
                  {lang === "vi" ? activeCompanion.nameVi : activeCompanion.nameEn}:
                </strong>{" "}
                {lang === "vi" ? activeCompanion.loreVi : activeCompanion.loreEn}
              </div>
            </div>
          </div>

          {/* Khung Danh hiệu Đã Thu thập (3) */}
          <div className="heritage-card rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-heritage font-bold text-lg text-[#2B2118]">
                🏅 {lang === "vi" ? "Danh hiệu Đã Thu thập (3)" : "Collected Heritage Titles (3)"}
              </h3>
              <p className="text-xs text-[#5C4938]">
                {lang === "vi"
                  ? "Chạm vào một danh hiệu bất kỳ để trang bị lên thẻ Hồ sơ Cá nhân của bạn"
                  : "Click any title seal to equip it on your Personal Heritage Passport"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {HERITAGE_BADGES.map((badge) => {
                const isEquipped = badge.id === equippedBadgeId;
                return (
                  <div
                    key={badge.id}
                    onClick={() => {
                      setEquippedBadgeId(badge.id);
                      triggerToast(
                        lang === "vi"
                          ? `Đã trang bị danh hiệu "${badge.titleVi}"!`
                          : `Equipped title "${badge.titleEn}"!`
                      );
                    }}
                    className={`cursor-pointer rounded-2xl p-4 flex flex-col justify-between border transition ${
                      isEquipped
                        ? "bg-[#EAE0D0] border-2 border-[#2B2118] shadow-md"
                        : "bg-[#F4EFE6] border-[#C8AE7D] hover:bg-[#EAE0D0]/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-1.5 rounded-xl bg-[#FAF6EE] border border-[#C8AE7D] shadow-sm">
                          {badge.svg}
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isEquipped
                              ? "bg-[#2B2118] text-[#E6C786]"
                              : "bg-[#FAF6EE] text-[#5C4938] border border-[#C8AE7D]"
                          }`}
                        >
                          {isEquipped
                            ? lang === "vi"
                              ? "Đang đeo"
                              : "Equipped"
                            : lang === "vi"
                            ? "Trang bị"
                            : "Equip"}
                        </span>
                      </div>
                      <h4 className="font-heritage font-bold text-sm text-[#2B2118]">
                        {lang === "vi" ? badge.titleVi : badge.titleEn}
                      </h4>
                    </div>
                    <p className="text-xs text-[#5C4938] mt-3 leading-relaxed">
                      {lang === "vi" ? badge.descVi : badge.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Chia sẻ & Tải ảnh PNG Thẻ Hồ Sơ Di Sản */}
      {showSharePassportModal && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
          <div className="heritage-card rounded-2xl max-w-2xl w-full p-6 space-y-4 border-2 border-[#B48327]">
            <div className="flex items-center justify-between border-b border-[#C8AE7D] pb-3">
              <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
                🪪 {lang === "vi" ? "Thẻ Hộ Chiếu Di Sản Của Bạn" : "Your Heritage Passport Card"}
              </h3>
              <button
                onClick={() => setShowSharePassportModal(false)}
                className="text-sm font-bold text-[#5C4938] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-[#C8AE7D] bg-[#F4EFE6] flex justify-center">
              <canvas
                ref={canvasRef}
                width={720}
                height={420}
                className="w-full h-auto max-h-[300px] object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                onClick={handleNativeShareOrCopy}
                className="px-4 py-2.5 rounded-xl bg-[#EAE0D0] border border-[#B48327] text-[#2B2118] text-xs font-bold cursor-pointer"
              >
                🔗 {lang === "vi" ? "Sao chép liên kết / Chia sẻ nhanh" : "Copy Link / Quick Share"}
              </button>
              <button
                onClick={handleDownloadPassportPng}
                className="px-5 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] text-xs font-bold shadow cursor-pointer"
              >
                ⬇ {lang === "vi" ? "Tải ảnh PNG Thẻ Hộ Chiếu" : "Download Passport PNG"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Sửa Hồ Sơ Cá Nhân */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="heritage-card rounded-2xl max-w-md w-full p-6 space-y-4 border-2 border-[#B48327]">
            <div className="flex items-center justify-between border-b border-[#C8AE7D] pb-3">
              <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
                ✎ {lang === "vi" ? "Cập nhật Hồ sơ Cá nhân" : "Update Personal Profile"}
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-sm font-bold text-[#5C4938] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C4938] mb-1">
                  {lang === "vi" ? "Họ và tên hiển thị:" : "Display Name:"}
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C4938] mb-1">
                  {lang === "vi" ? "Ký hiệu Huy hiệu (2 ký tự):" : "Avatar Initials (2 chars):"}
                </label>
                <input
                  type="text"
                  maxLength={2}
                  value={profileInitials}
                  onChange={(e) => setProfileInitials(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5C4938] mb-1">
                  {lang === "vi" ? "Châm ngôn Cá nhân:" : "Personal Motto:"}
                </label>
                <textarea
                  rows={3}
                  value={lang === "vi" ? mottoVi : mottoEn}
                  onChange={(e) =>
                    lang === "vi" ? setMottoVi(e.target.value) : setMottoEn(e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="px-4 py-2 rounded-xl bg-[#EAE0D0] text-xs font-bold text-[#5C4938] cursor-pointer"
              >
                {lang === "vi" ? "Hủy" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  setShowEditProfileModal(false);
                  triggerToast(
                    lang === "vi"
                      ? "Đã lưu thay đổi Hồ sơ Cá nhân!"
                      : "Personal Profile updated!"
                  );
                }}
                className="px-5 py-2 rounded-xl bg-[#8B1E1E] text-[#FAF6EE] text-xs font-bold shadow cursor-pointer"
              >
                ✓ {lang === "vi" ? "Lưu Hồ Sơ" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Đăng nhập / Đăng ký */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="heritage-card rounded-2xl max-w-md w-full p-6 space-y-4 border-2 border-[#B48327]">
            <div className="flex items-center justify-between border-b border-[#C8AE7D] pb-3">
              <h3 className="font-heritage text-xl font-bold text-[#2B2118]">
                {authModalMode === "login"
                  ? lang === "vi"
                    ? "Đăng nhập Hộ chiếu Di sản"
                    : "Log In to Heritage Passport"
                  : lang === "vi"
                  ? "Đăng ký Người Gìn Giữ Di Sản"
                  : "Register Legacy Keeper Account"}
              </h3>
              <button
                onClick={() => setAuthModalMode(null)}
                className="text-sm font-bold text-[#5C4938] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {authModalMode === "register" && (
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Họ và tên Người Gìn Giữ Di Sản"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm"
                />
              )}
              <input
                type="email"
                placeholder="Email hoặc Mã định danh Hộ chiếu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm"
              />
              <input
                type="password"
                placeholder="Mật khẩu bảo mật"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-sm"
              />
            </div>

            <button
              onClick={() => {
                setAuthModalMode(null);
                triggerToast(
                  lang === "vi"
                    ? "Đã xác thực tài khoản Hộ chiếu Di sản thành công!"
                    : "Heritage Passport authenticated!"
                );
              }}
              className="w-full py-2.5 rounded-xl bg-[#8B1E1E] text-[#FAF6EE] font-bold text-sm shadow cursor-pointer"
            >
              {authModalMode === "login"
                ? lang === "vi"
                  ? "Xác nhận Đăng nhập"
                  : "Confirm Log In"
                : lang === "vi"
                ? "Khởi tạo Hộ chiếu"
                : "Create Passport"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { SettingsProfileView };
export function SavedHeritagesView() {
  return null;
}
