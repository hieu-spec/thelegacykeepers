// src/components/views/VeteransView.tsx
"use client";

import React, { useState } from "react";

export interface EventPhoto {
  id: string;
  url: string;
  captionVi: string;
  captionEn: string;
  year: string;
}

export interface VeteranProfile {
  id: string;
  name: string;
  birthYear: number;
  rankVi: string;
  rankEn: string;
  unitVi: string;
  unitEn: string;
  campaignVi: string;
  campaignEn: string;
  portraitUrl: string;
  medalsVi: string[];
  summaryVi: string;
  summaryEn: string;
  memoirVi: string;
  memoirEn: string;
  eventPhotos: EventPhoto[];
}

const INITIAL_VETERANS: VeteranProfile[] = [
  {
    id: "vet-1",
    name: "Đại tá Nguyễn Văn Tàu (Tư Cang)",
    birthYear: 1928,
    rankVi: "Anh hùng Lực lượng Vũ trang Nhân dân • Đại tá Tình báo",
    rankEn: "Hero of the People's Armed Forces • Intelligence Colonel",
    unitVi: "Cụm trưởng Cụm Tình báo Chiến lược H.63",
    unitEn: "Commander of Strategic Intelligence Cluster H.63",
    campaignVi: "Chiến dịch Tết Mậu Thân 1968 & Chiến dịch Hồ Chí Minh 1975",
    campaignEn: "1968 Tet Offensive & 1975 Ho Chi Minh Campaign",
    portraitUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    medalsVi: [
      "Danh hiệu Anh hùng LLVTND",
      "Huân chương Quân công hạng Nhất",
      "Huy hiệu 75 năm tuổi Đảng",
    ],
    summaryVi:
      "Người chỉ huy huyền thoại của Cụm tình báo H.63 hoạt động ngay giữa lòng Sài Gòn và căn cứ rừng Củ Chi suốt những năm tháng ác liệt nhất.",
    summaryEn:
      "Legendary commander of the H.63 Intelligence Cluster operating inside Saigon and the Cu Chi tunnels during the fiercest years of the war.",
    memoirVi:
      "Những ngày cuối tháng 4 năm 1975, tôi theo sát cánh quân tiến về Sài Gòn với tư cách Chính ủy Lữ đoàn Đặc công Biệt động 316. Khi nhìn lá cờ Giải phóng tung bay trên nóc Dinh Độc Lập trưa 30 tháng 4, nước mắt tôi trào ra nhớ về những đồng đội tình báo và giao liên đã ngã xuống chỉ vài giờ trước ngày toàn thắng. Hòa bình hôm nay được đánh đổi bằng cả tuổi xuân của một thế hệ không tiếc máu xương.",
    memoirEn:
      "In late April 1975, I advanced into Saigon as Political Commissar of the 316th Special Forces Commando Brigade. Seeing the Liberation banner flying atop the Independence Palace at noon on April 30 brought tears to my eyes as I remembered my fallen comrades who sacrificed their lives just hours before victory. Today's peace was bought with the youth of an entire generation.",
    eventPhotos: [
      {
        id: "ev-1",
        url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
        captionVi: "Ngày hội ngộ đồng đội Cụm tình báo H.63 tại Dinh Độc Lập",
        captionEn: "H.63 Intelligence Cluster reunion at Independence Palace",
        year: "1975",
      },
      {
        id: "ev-2",
        url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
        captionVi: "Tư liệu bản đồ tuyến giao liên mật từ Củ Chi vào nội đô Sài Gòn",
        captionEn: "Secret courier route map from Cu Chi into inner Saigon",
        year: "1968",
      },
    ],
  },
  {
    id: "vet-2",
    name: "Cựu chiến binh Vũ Đăng Toàn",
    birthYear: 1947,
    rankVi: "Đại tá • Nguyên Chính trị viên Đại đội 4 Thiết giáp",
    rankEn: "Colonel • Former Political Officer of Armored Company 4",
    unitVi: "Trưởng xe tăng 390 - Lữ đoàn Tăng thiết giáp 203 (Quân đoàn 2)",
    unitEn: "Commander of Tank 390 - 203rd Armored Brigade (2nd Corps)",
    campaignVi: "Mũi thọc sâu đánh chiếm Dinh Độc Lập trưa 30/04/1975",
    campaignEn: "Deep-thrust spearhead capturing Independence Palace on April 30, 1975",
    portraitUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    medalsVi: [
      "Huân chương Chiến công hạng Nhất",
      "Kỷ niệm chương Chiến dịch Hồ Chí Minh",
    ],
    summaryVi:
      "Người chỉ huy chiếc xe tăng 390 lịch sử húc tung cánh cổng chính Dinh Độc Lập lúc 10 giờ 45 phút sáng ngày 30/04/1975.",
    summaryEn:
      "Commander of historic Tank 390 that crashed through the main gate of the Independence Palace at 10:45 AM on April 30, 1975.",
    memoirVi:
      "Khi xe tăng 390 của chúng tôi lao đến trước Dinh Độc Lập, thấy xe 843 của anh Bùi Quang Thận đang kẹt ở cổng phụ bên trái, lái xe Nguyễn Văn Tập hỏi tôi: 'Chính trị viên ơi, làm thế nào?'. Tôi lập tức ra lệnh: 'Cứ tông thẳng vào cổng chính!'. Cánh cổng sắt đổ sập dưới bánh xích xe tăng cũng là lúc khép lại những năm tháng chia cắt đất nước.",
    memoirEn:
      "As our Tank 390 approached the Independence Palace and saw Bui Quang Than's Tank 843 halted at the side gate, driver Nguyen Van Tap asked me: 'Political Officer, what should we do?'. I immediately ordered: 'Ram straight through the main gate!'. As the iron gates collapsed beneath our treads, decades of national division came to an end.",
    eventPhotos: [
      {
        id: "ev-3",
        url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
        captionVi: "Kíp chiến đấu xe tăng 390 hội ngộ bên chiếc xe Bảo vật Quốc gia",
        captionEn: "Tank 390 crew reunion beside the National Treasure vehicle",
        year: "1975",
      },
      {
        id: "ev-4",
        url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
        captionVi: "Cổng chính Dinh Độc Lập trong buổi lễ kỷ niệm ngày thống nhất",
        captionEn: "Independence Palace main gate during Reunification Day",
        year: "1975",
      },
    ],
  },
];

export default function VeteransView() {
  const [veterans, setVeterans] = useState<VeteranProfile[]>(INITIAL_VETERANS);
  const [selectedVetId, setSelectedVetId] = useState<string>(INITIAL_VETERANS[0].id);
  const [ttsLang, setTtsLang] = useState<"vi" | "en">("vi");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // State cho khung chèn hình ảnh mới (Chân dung hoặc Ảnh sự kiện)
  const [showInsertImageModal, setShowInsertImageModal] = useState<boolean>(false);
  const [insertTarget, setInsertTarget] = useState<"portrait" | "event">("event");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newCaptionVi, setNewCaptionVi] = useState<string>("");
  const [newCaptionEn, setNewCaptionEn] = useState<string>("");
  const [newPhotoYear, setNewPhotoYear] = useState<string>("1975");

  const activeVet = veterans.find((v) => v.id === selectedVetId) || veterans[0];

  // Hàm đọc thuyết minh hồi ký song ngữ Tiếng Việt / Tiếng Anh
  const handleToggleNarrate = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = ttsLang === "vi" ? activeVet.memoirVi : activeVet.memoirEn;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = ttsLang === "vi" ? "vi-VN" : "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Xử lý chọn file ảnh trực tiếp từ máy tính/điện thoại
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Lưu hình ảnh vừa chèn vào hồ sơ Nhân chứng sống
  const handleConfirmInsertImage = () => {
    if (!newImageUrl.trim()) return;

    setVeterans((prev) =>
      prev.map((vet) => {
        if (vet.id !== activeVet.id) return vet;

        if (insertTarget === "portrait") {
          return { ...vet, portraitUrl: newImageUrl };
        }

        const addedPhoto: EventPhoto = {
          id: `ev-${Date.now()}`,
          url: newImageUrl,
          captionVi: newCaptionVi || "Tư liệu lịch sử do Người Gìn Giữ Di Sản đóng góp",
          captionEn: newCaptionEn || "Historical archive contributed by Legacy Keeper",
          year: newPhotoYear || "1975",
        };
        return { ...vet, eventPhotos: [addedPhoto, ...vet.eventPhotos] };
      })
    );

    setNewImageUrl("");
    setNewCaptionVi("");
    setNewCaptionEn("");
    setShowInsertImageModal(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-7 space-y-6 pb-20">
      {/* Header trang Nhân chứng sống */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8AE7D] pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B1E1E]">
            Ký Ức Sống Động • Tri Ân Thế Hệ Đi Trước
          </span>
          <h1 className="font-heritage text-2xl lg:text-3xl font-bold text-[#2B2118]">
            Nhân Chứng Sống & Hồi Ký Lịch Sử
          </h1>
          <p className="text-xs lg:text-sm text-[#5C4938]">
            Lắng nghe thuyết minh hồi ký song ngữ (Việt / Anh) và lưu giữ tư liệu hình ảnh các Cựu chiến binh
          </p>
        </div>

        {/* Nút mở khung Chèn Hình Ảnh Chân Dung & Sự Kiện */}
        <button
          onClick={() => {
            setInsertTarget("event");
            setShowInsertImageModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] border border-[#E6C786] text-xs font-bold shadow transition flex items-center gap-2 cursor-pointer"
        >
          <span>📷</span>
          <span>+ Chèn Hình Ảnh Nhân Chứng / Sự Kiện</span>
        </button>
      </div>

      {/* Thanh chọn Nhân chứng sống */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {veterans.map((vet) => {
          const isSelected = vet.id === activeVet.id;
          return (
            <div
              key={vet.id}
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
                setSelectedVetId(vet.id);
              }}
              className={`cursor-pointer rounded-2xl p-4 flex items-center gap-4 border transition ${
                isSelected
                  ? "bg-[#FAF6EE] border-2 border-[#8B1E1E] shadow-md"
                  : "bg-[#FAF6EE]/70 border-[#C8AE7D] hover:bg-[#FAF6EE]"
              }`}
            >
              <img
                src={vet.portraitUrl}
                alt={vet.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#B48327] sepia-[0.2] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAE0D0] text-[#8B1E1E]">
                  Sinh năm {vet.birthYear}
                </span>
                <h3 className="font-heritage font-bold text-base text-[#2B2118] truncate mt-0.5">
                  {vet.name}
                </h3>
                <p className="text-xs text-[#5C4938] truncate">
                  {ttsLang === "vi" ? vet.unitVi : vet.unitEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chi tiết Nhân chứng sống: Chân dung + Hồi ký Song ngữ + Album Ảnh Sự Kiện */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái: Khung Chân dung Nhân chứng & Nút đổi ảnh chân dung */}
        <div className="lg:col-span-4 heritage-card rounded-2xl p-5 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#B48327] bg-[#2B2118] aspect-[4/4]">
            <img
              src={activeVet.portraitUrl}
              alt={activeVet.name}
              className="w-full h-full object-cover sepia-[0.18]"
            />
            <button
              onClick={() => {
                setInsertTarget("portrait");
                setShowInsertImageModal(true);
              }}
              className="absolute bottom-3 right-3 bg-[#2B2118]/90 hover:bg-[#8B1E1E] text-[#FAF6EE] border border-[#E6C786] px-3 py-1.5 rounded-lg text-xs font-bold shadow transition cursor-pointer"
            >
              🖼️ Đổi ảnh chân dung
            </button>
          </div>

          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8B1E1E] text-[#FAF6EE] text-[10px] font-bold">
              {ttsLang === "vi" ? activeVet.rankVi : activeVet.rankEn}
            </span>
            <h2 className="font-heritage text-xl font-bold text-[#2B2118]">
              {activeVet.name}
            </h2>
            <p className="text-xs font-semibold text-[#2E5A44]">
              🎖️ {ttsLang === "vi" ? activeVet.unitVi : activeVet.unitEn}
            </p>
            <p className="text-xs text-[#5C4938]">
              📍 Chiến dịch: {ttsLang === "vi" ? activeVet.campaignVi : activeVet.campaignEn}
            </p>
          </div>

          <div className="pt-3 border-t border-[#C8AE7D] space-y-1.5">
            <p className="text-[11px] font-bold uppercase text-[#5C4938]">
              Huân chương & Danh hiệu cao quý:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeVet.medalsVi.map((medal, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#EAE0D0] border border-[#B48327] text-[11px] font-medium text-[#2B2118]"
                >
                  ★ {medal}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Thuyết minh Hồi ký Song ngữ (VI/EN) & Bộ ảnh Sự kiện Lịch sử */}
        <div className="lg:col-span-8 space-y-6">
          {/* Khung Hồi ký & Trình phát thuyết minh chọn ngôn ngữ Tiếng Việt / Tiếng Anh */}
          <div className="heritage-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C8AE7D] pb-4">
              <div>
                <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
                  📖 {ttsLang === "vi" ? "Hồi Ký & Lời Kể Nhân Chứng" : "Veteran Memoir & Testimony"}
                </h3>
                <p className="text-xs text-[#5C4938]">
                  {ttsLang === "vi" ? activeVet.summaryVi : activeVet.summaryEn}
                </p>
              </div>

              {/* Cụm chọn ngôn ngữ thuyết minh Tiếng Việt / Tiếng Anh + Nút phát Audio */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#EAE0D0] p-1 rounded-xl border border-[#C8AE7D]">
                  <button
                    onClick={() => {
                      if (isSpeaking) window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                      setTtsLang("vi");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      ttsLang === "vi"
                        ? "bg-[#8B1E1E] text-[#FAF6EE]"
                        : "text-[#5C4938]"
                    }`}
                  >
                    🇻🇳 Tiếng Việt
                  </button>
                  <button
                    onClick={() => {
                      if (isSpeaking) window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                      setTtsLang("en");
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      ttsLang === "en"
                        ? "bg-[#8B1E1E] text-[#FAF6EE]"
                        : "text-[#5C4938]"
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>

                <button
                  onClick={handleToggleNarrate}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border shadow transition flex items-center gap-2 cursor-pointer ${
                    isSpeaking
                      ? "bg-[#2E5A44] text-[#FAF6EE] border-[#E6C786]"
                      : "bg-[#2B2118] text-[#E6C786] border-[#B48327] hover:bg-[#3D2F23]"
                  }`}
                >
                  <span>{isSpeaking ? "⏹" : "🔊"}</span>
                  <span>
                    {isSpeaking
                      ? ttsLang === "vi"
                        ? "Dừng thuyết minh"
                        : "Stop Narration"
                      : ttsLang === "vi"
                      ? "Nghe thuyết minh (VI)"
                      : "Play Narration (EN)"}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] relative">
              <p className="font-heritage text-base lg:text-lg italic text-[#2B2118] leading-relaxed">
                &ldquo;{ttsLang === "vi" ? activeVet.memoirVi : activeVet.memoirEn}&rdquo;
              </p>
            </div>
          </div>

          {/* Khung Tư liệu Hình ảnh Sự kiện gắn với Nhân chứng (Có nút chèn thêm ảnh trực tiếp) */}
          <div className="heritage-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
                  🖼️{" "}
                  {ttsLang === "vi"
                    ? `Tư liệu Hình ảnh Sự kiện (${activeVet.eventPhotos.length})`
                    : `Historical Event Photo Archive (${activeVet.eventPhotos.length})`}
                </h3>
                <p className="text-xs text-[#5C4938]">
                  {ttsLang === "vi"
                    ? "Hình ảnh chiến dịch, đồng đội và các khoảnh khắc lịch sử gắn với nhân chứng"
                    : "Campaign photographs, comrades, and historic moments connected to the witness"}
                </p>
              </div>

              <button
                onClick={() => {
                  setInsertTarget("event");
                  setShowInsertImageModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EAE0D0] hover:bg-[#B48327] hover:text-[#FAF6EE] border border-[#B48327] text-xs font-bold text-[#2B2118] transition cursor-pointer"
              >
                + Chèn thêm ảnh sự kiện
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeVet.eventPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-xl overflow-hidden bg-[#F4EFE6] border border-[#C8AE7D] flex flex-col"
                >
                  <div className="relative h-48 bg-[#2B2118]">
                    <img
                      src={photo.url}
                      alt={photo.captionVi}
                      className="w-full h-full object-cover sepia-[0.2]"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#2B2118]/85 text-[#E6C786] text-[11px] font-bold px-2.5 py-0.5 rounded">
                      Năm {photo.year}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs font-semibold text-[#2B2118]">
                      {ttsLang === "vi" ? photo.captionVi : photo.captionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Chèn Hình Ảnh Chân Dung / Sự Kiện Trực Tiếp */}
      {showInsertImageModal && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
          <div className="heritage-card rounded-2xl max-w-lg w-full p-6 space-y-4 border-2 border-[#B48327]">
            <div className="flex items-center justify-between border-b border-[#C8AE7D] pb-3">
              <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
                📷 Chèn Hình Ảnh Tư Liệu cho {activeVet.name}
              </h3>
              <button
                onClick={() => setShowInsertImageModal(false)}
                className="text-sm font-bold text-[#5C4938] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setInsertTarget("event")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  insertTarget === "event"
                    ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#8B1E1E]"
                    : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D]"
                }`}
              >
                Ảnh Sự kiện Lịch sử
              </button>
              <button
                onClick={() => setInsertTarget("portrait")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  insertTarget === "portrait"
                    ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#8B1E1E]"
                    : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D]"
                }`}
              >
                Ảnh Chân dung Cựu Chiến binh
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5C4938] mb-1">
                  Cách 1: Tải tệp hình ảnh trực tiếp từ máy của bạn
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#B48327] file:text-[#FAF6EE] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4938] mb-1">
                  Cách 2: Hoặc dán đường dẫn URL hình ảnh
                </label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
                />
              </div>

              {newImageUrl && (
                <div className="h-36 rounded-xl overflow-hidden border border-[#B48327] bg-[#2B2118]">
                  <img
                    src={newImageUrl}
                    alt="Xem trước ảnh chèn"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {insertTarget === "event" && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newPhotoYear}
                      onChange={(e) => setNewPhotoYear(e.target.value)}
                      placeholder="Năm (VD: 1975)"
                      className="col-span-1 px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
                    />
                    <input
                      type="text"
                      value={newCaptionVi}
                      onChange={(e) => setNewCaptionVi(e.target.value)}
                      placeholder="Chú thích sự kiện (Tiếng Việt)"
                      className="col-span-2 px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    value={newCaptionEn}
                    onChange={(e) => setNewCaptionEn(e.target.value)}
                    placeholder="Event caption in English (Optional)"
                    className="w-full px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
                  />
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowInsertImageModal(false)}
                className="px-4 py-2 rounded-xl bg-[#EAE0D0] text-xs font-bold text-[#5C4938] cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmInsertImage}
                className="px-5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] text-xs font-bold shadow transition cursor-pointer"
              >
                ✓ Lưu & Chèn Hình Ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { VeteransView };
