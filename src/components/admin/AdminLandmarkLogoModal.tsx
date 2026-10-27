// src/components/admin/AdminLandmarkLogoModal.tsx
'use client';

import React, { useState } from 'react';
import { Upload, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { HeritageMapLocation } from '../mobile/MobileSatelliteMap';

interface AdminLandmarkLogoModalProps {
  location: HeritageMapLocation | null;
  isAdmin: boolean;
  onClose: () => void;
  onSaveLogo: (locationId: string, newLogoDataUrl: string) => void;
}

export const AdminLandmarkLogoModal: React.FC<AdminLandmarkLogoModalProps> = ({
  location,
  isAdmin,
  onClose,
  onSaveLogo,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>(location?.customLogoUrl || '');

  if (!location) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-[#0B1320] border border-red-500 rounded-2xl p-5 max-w-sm w-full text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">Truy cập bị từ chối</h3>
          <p className="text-xs text-gray-300">
            Chỉ tài khoản Quản trị viên (Admin) mới được phép tải lên Logo Địa danh trên bản đồ.
          </p>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Đọc sang Base64 DataURL bền vững (Không dùng URL.createObjectURL để tránh mất ảnh khi F5)
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1320] border-2 border-[#D4AF37] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#D4AF37]">
              Quản Trị Hình Ảnh Bản Đồ (Admin Only)
            </span>
            <h3 className="font-['Cinzel',serif] text-base font-bold text-white">
              Logo Động: {location.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 text-gray-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Xem trước hiệu ứng Logo lớn trên Map */}
        <div className="py-5 rounded-2xl bg-[#131F33] border border-[#D4AF37]/30 flex flex-col items-center justify-center gap-2">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B1320] to-[#8B2626] border-2 border-[#D4AF37] flex items-center justify-center shadow-xl animate-bounce">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-16 h-16 object-contain" />
            ) : (
              <span className="text-4xl">{location.defaultEmblemEmoji}</span>
            )}
          </div>
          <span className="text-[11px] text-gray-300">Xem trước hiệu ứng nổi trên bản đồ vệ tinh</span>
        </div>

        <label className="w-full py-3 px-4 rounded-2xl bg-[#16243B] hover:bg-[#1E3150] border border-dashed border-[#D4AF37] flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-[#D4AF37]">
          <Upload className="w-4 h-4" />
          <span>Chọn file PNG / GIF / SVG từ thiết bị</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/10 text-gray-300 text-xs font-bold"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (previewUrl) onSaveLogo(location.id, previewUrl);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-[#D4AF37] text-[#0B1320] text-xs font-bold flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu Lên Bản Đồ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
