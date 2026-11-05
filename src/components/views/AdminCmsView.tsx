// src/components/views/AdminCmsView.tsx
"use client";

import React, { useState } from "react";
import { useHeritageCms, CmsLocationItem } from "@/utils/heritageCmsStore";

export default function AdminCmsView() {
  const { data, addOrUpdateLocation, addVeteranPhoto, resetToDefault } = useHeritageCms();
  const [activeSubTab, setActiveSubTab] = useState<"locations" | "veterans">("locations");
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // State biểu mẫu thêm/sửa Di tích
  const [locForm, setLocForm] = useState<CmsLocationItem>({
    id: "",
    nameVi: "",
    nameEn: "",
    year: "1975",
    lat: 10.7769,
    lng: 106.6953,
    distanceMeters: 500,
    descriptionVi: "",
    descriptionEn: "",
    imageUrl: "",
    buildingType: "dinhdoclap",
  });

  // State biểu mẫu chèn ảnh Nhân chứng sống
  const [selectedVetId, setSelectedVetId] = useState<string>(data.veterans[0]?.id || "vet-1");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photoCaptionVi, setPhotoCaptionVi] = useState<string>("");
  const [photoCaptionEn, setPhotoCaptionEn] = useState<string>("");
  const [photoYear, setPhotoYear] = useState<string>("1975");
  const [isPortraitUpload, setIsPortraitUpload] = useState<boolean>(false);

  const handleImageFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    onResult: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onResult(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locForm.nameVi.trim()) return;
    const finalId =
      locForm.id.trim() ||
      locForm.nameVi
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-");

    await addOrUpdateLocation({ ...locForm, id: finalId });
    setStatusBanner(`Đã lưu di tích "${locForm.nameVi}" vào IndexedDB thành công!`);
    setTimeout(() => setStatusBanner(null), 3500);
  };

  const handleSaveVeteranImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;
    await addVeteranPhoto(
      selectedVetId,
      {
        url: photoUrl,
        captionVi: photoCaptionVi || "Tư liệu lịch sử bổ sung qua CMS",
        captionEn: photoCaptionEn || "Historical archive added via CMS",
        year: photoYear || "1975",
      },
      isPortraitUpload
    );
    setPhotoUrl("");
    setPhotoCaptionVi("");
    setPhotoCaptionEn("");
    setStatusBanner("Đã cập nhật hình ảnh tư liệu Nhân chứng sống vào IndexedDB!");
    setTimeout(() => setStatusBanner(null), 3500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-7 space-y-6 pb-20">
      {/* Header Quản trị CMS */}
      <div className="heritage-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border-2 border-[#B48327]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B1E1E]">
            Hệ thống Lưu trữ IndexedDB • Dung lượng mở rộng
          </span>
          <h1 className="font-heritage text-2xl font-bold text-[#2B2118]">
            Quản Trị Kho Tư Liệu Di Sản (Heritage CMS)
          </h1>
          <p className="text-xs text-[#5C4938]">
            Quản lý đồng bộ dữ liệu Bản đồ, Di tích, Kỷ vật và Hình ảnh Nhân chứng sống
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSubTab("locations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              activeSubTab === "locations"
                ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#E6C786]"
                : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D]"
            }`}
          >
            🧭 Quản lý Di tích ({data.locations.length})
          </button>
          <button
            onClick={() => setActiveSubTab("veterans")}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              activeSubTab === "veterans"
                ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#E6C786]"
                : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D]"
            }`}
          >
            🎖️ Ảnh Nhân chứng sống ({data.veterans.length})
          </button>
          <button
            onClick={resetToDefault}
            className="px-3.5 py-2 rounded-xl bg-[#EAE0D0] hover:bg-[#C8AE7D] text-[#5C4938] text-xs font-bold"
          >
            ↺ Khôi phục gốc
          </button>
        </div>
      </div>

      {statusBanner && (
        <div className="p-3.5 rounded-xl bg-[#2E5A44] text-[#FAF6EE] text-xs font-bold text-center shadow">
          ✓ {statusBanner}
        </div>
      )}

      {/* Phân hệ 1: Quản lý Địa điểm & Di tích lịch sử */}
      {activeSubTab === "locations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleSaveLocation}
            className="lg:col-span-5 heritage-card rounded-2xl p-5 space-y-3.5"
          >
            <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
              + Thêm / Cập nhật Di tích trên Bản đồ
            </h3>

            <input
              type="text"
              required
              value={locForm.nameVi}
              onChange={(e) => setLocForm({ ...locForm, nameVi: e.target.value })}
              placeholder="Tên di tích (Tiếng Việt - VD: Bến Nhà Rồng)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
            />
            <input
              type="text"
              value={locForm.nameEn}
              onChange={(e) => setLocForm({ ...locForm, nameEn: e.target.value })}
              placeholder="Tên di tích (Tiếng Anh - VD: Dragon Wharf)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={locForm.year}
                onChange={(e) => setLocForm({ ...locForm, year: e.target.value })}
                placeholder="Mốc năm (1911)"
                className="px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
              />
              <input
                type="number"
                step="0.0001"
                value={locForm.lat}
                onChange={(e) => setLocForm({ ...locForm, lat: parseFloat(e.target.value) })}
                placeholder="Vĩ độ (Lat)"
                className="px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
              />
              <input
                type="number"
                step="0.0001"
                value={locForm.lng}
                onChange={(e) => setLocForm({ ...locForm, lng: parseFloat(e.target.value) })}
                placeholder="Kinh độ (Lng)"
                className="px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5C4938] mb-1">
                Biểu tượng công trình 2D trên bản đồ:
              </label>
              <select
                value={locForm.buildingType}
                onChange={(e) =>
                  setLocForm({
                    ...locForm,
                    buildingType: e.target.value as CmsLocationItem["buildingType"],
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
              >
                <option value="nharong">Kiến trúc Bến Nhà Rồng</option>
                <option value="dinhdoclap">Kiến trúc Dinh Độc Lập</option>
                <option value="ham">Kiến trúc Hầm Biệt Động</option>
                <option value="mieuba">Kiến trúc Miếu Cổ / Đền Đài</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={locForm.descriptionVi}
              onChange={(e) => setLocForm({ ...locForm, descriptionVi: e.target.value })}
              placeholder="Mô tả lịch sử tóm tắt (Tiếng Việt)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
            />

            <div>
              <label className="block text-[11px] font-bold text-[#5C4938] mb-1">
                Tải ảnh di tích từ máy (Lưu trực tiếp vào IndexedDB):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageFileSelect(e, (base64) =>
                    setLocForm({ ...locForm, imageUrl: base64 })
                  )
                }
                className="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#B48327] file:text-[#FAF6EE] file:font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] text-xs font-bold shadow"
            >
              ✓ Lưu Di Tích Vào Kho Dữ Liệu
            </button>
          </form>

          {/* Danh sách Di tích hiện có */}
          <div className="lg:col-span-7 space-y-3">
            {data.locations.map((loc) => (
              <div
                key={loc.id}
                className="heritage-card rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={loc.imageUrl}
                    alt={loc.nameVi}
                    className="w-16 h-16 rounded-xl object-cover border border-[#B48327] shrink-0 sepia-[0.2]"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8B1E1E] text-[#FAF6EE]">
                      Mốc {loc.year}
                    </span>
                    <h4 className="font-heritage font-bold text-base text-[#2B2118] truncate mt-0.5">
                      {loc.nameVi} ({loc.nameEn})
                    </h4>
                    <p className="text-xs text-[#5C4938] truncate">{loc.descriptionVi}</p>
                  </div>
                </div>
                <button
                  onClick={() => setLocForm(loc)}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-[#EAE0D0] border border-[#B48327] text-xs font-bold text-[#2B2118]"
                >
                  ✎ Sửa
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phân hệ 2: Chèn ảnh Chân dung & Sự kiện cho Nhân chứng sống */}
      {activeSubTab === "veterans" && (
        <form
          onSubmit={handleSaveVeteranImage}
          className="heritage-card rounded-2xl p-6 max-w-2xl mx-auto space-y-4"
        >
          <h3 className="font-heritage text-lg font-bold text-[#2B2118]">
            📷 Bổ sung Hình ảnh Tư liệu cho Nhân chứng sống
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#5C4938] mb-1">
              Chọn Cựu chiến binh / Nhân chứng lịch sử:
            </label>
            <select
              value={selectedVetId}
              onChange={(e) => setSelectedVetId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs font-bold"
            >
              {data.veterans.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.unitVi})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsPortraitUpload(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                !isPortraitUpload
                  ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#8B1E1E]"
                  : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D]"
              }`}
            >
              Chèn vào Album Ảnh Sự Kiện
            </button>
            <button
              type="button"
              onClick={() => setIsPortraitUpload(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                isPortraitUpload
                  ? "bg-[#8B1E1E] text-[#FAF6EE] border-[#8B1E1E]"
                  : "bg-[#F4EFE6] text-[#2B2118] border-[#C8AE7D]"
              }`}
            >
              Đặt làm Ảnh Chân Dung Chính
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C4938] mb-1">
              Tải tệp ảnh từ máy hoặc dán link ảnh:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageFileSelect(e, (base64) => setPhotoUrl(base64))}
              className="w-full text-xs mb-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#B48327] file:text-[#FAF6EE] file:font-bold"
            />
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Hoặc dán URL hình ảnh (https://...)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
            />
          </div>

          {!isPortraitUpload && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={photoYear}
                onChange={(e) => setPhotoYear(e.target.value)}
                placeholder="Năm sự kiện (1975)"
                className="px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
              />
              <input
                type="text"
                value={photoCaptionVi}
                onChange={(e) => setPhotoCaptionVi(e.target.value)}
                placeholder="Chú thích ảnh (Tiếng Việt)"
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#F4EFE6] border border-[#C8AE7D] text-xs"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#8B1E1E] hover:bg-[#6E1616] text-[#FAF6EE] text-xs font-bold shadow"
          >
            ✓ Lưu Hình Ảnh Vào Hồ Sơ Nhân Chứng
          </button>
        </form>
      )}
    </div>
  );
}

export { AdminCmsView };

