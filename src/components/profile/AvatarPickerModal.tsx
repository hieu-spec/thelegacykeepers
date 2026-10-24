'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Sparkles,
  Upload,
  Camera,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';

export interface AvatarOption {
  id: string;
  name: string;
  role: string;
  url: string;
}

export const HERITAGE_AVATARS: AvatarOption[] = [
  {
    id: 'avatar-explorer-nam',
    name: 'Nhà Thám Hiểm Trẻ',
    role: 'Nhà Khám Phá Di Sản',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-historian',
    name: 'Học Giả Sử Học',
    role: 'Nhà Nghiên Cứu Cổ Điển',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-cu-chi-dukich',
    name: 'Chiến Sĩ Du Kích',
    role: 'Kỳ Quan Đất Thép',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-nu-si-saigon',
    name: 'Nữ Sĩ Sài Gòn',
    role: 'Ký Ức Đô Thị Cổ',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-thuy-thu-van-ba',
    name: 'Thanh Niên Yêu Nước',
    role: 'Hành Trình Bến Nhà Rồng',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'avatar-nha-khao-co',
    name: 'Nhà Khảo Cổ Đông Sơn',
    role: 'Ngọn Nguồn Văn Hiến',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
];

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
  onClose: () => void;
}

type TabMode = 'heritage' | 'upload' | 'camera';

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatarUrl,
  onSelectAvatar,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('heritage');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // 1. Handle File Upload from Library
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSelectAvatar(reader.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Handle Camera Simulation Shot
  const handleCapturePhoto = () => {
    // Generate a high quality stylized camera snapshot
    const cameraSnapshots = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    ];
    const picked = cameraSnapshots[Math.floor(Math.random() * cameraSnapshots.length)];
    setCapturedPreview(picked);
  };

  const handleConfirmCapture = () => {
    if (capturedPreview) {
      onSelectAvatar(capturedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-[#FAF6F0] border-2 border-[#D9A05B] p-5 shadow-2xl relative space-y-3.5 text-[#162A45]"
      >
        <HeritageCornerDecoration color="#D9A05B" size={16} />

        {/* Hidden File Input for Real Library Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DFD3C3] pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8B2626]" />
            <h3 className="text-sm font-extrabold text-[#162A45] font-heritage">
              Thay Đổi Ảnh Đại Diện
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-[#EFE8DC] p-1 border border-[#DFD3C3]">
          <button
            onClick={() => setActiveTab('heritage')}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all font-heritage flex items-center justify-center gap-1 ${
              activeTab === 'heritage'
                ? 'bg-[#162A45] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#162A45]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Di Sản</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              fileInputRef.current?.click();
            }}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all font-heritage flex items-center justify-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-[#162A45] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#162A45]'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Thư Viện</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('camera');
              setCapturedPreview(null);
            }}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all font-heritage flex items-center justify-center gap-1 ${
              activeTab === 'camera'
                ? 'bg-[#162A45] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#162A45]'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Chụp Ảnh</span>
          </button>
        </div>

        {/* TAB 1: HERITAGE AVATARS LIST */}
        {activeTab === 'heritage' && (
          <div className="space-y-2">
            <p className="text-[11px] text-stone-600 leading-snug">
              Chọn nhân vật đại diện cho tinh thần Nhà Gìn Giữ Ký Ức:
            </p>
            <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
              {HERITAGE_AVATARS.map((item) => {
                const isSelected = currentAvatarUrl === item.url;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectAvatar(item.url);
                      onClose();
                    }}
                    className={`p-2 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#162A45] text-amber-200 ring-2 ring-[#D9A05B] shadow-md'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D9A05B] shadow-sm mb-1">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#162A45]/50 flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#FFE082]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold font-heritage leading-tight truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-[8px] opacity-75 truncate w-full mt-0.5">
                      {item.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD FROM LIBRARY */}
        {activeTab === 'upload' && (
          <div className="py-6 px-4 text-center space-y-3 bg-white rounded-2xl border border-dashed border-[#D9A05B]/80">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 text-[#8B2626] mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#162A45] font-heritage">
                Tải ảnh từ thư viện thiết bị
              </h4>
              <p className="text-[10px] text-stone-500 mt-1">
                Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB)
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#162A45] text-amber-200 font-bold text-xs shadow-md font-heritage active:scale-95 transition-all cursor-pointer"
            >
              Chọn Tệp Ảnh
            </button>
          </div>
        )}

        {/* TAB 3: CAMERA SIMULATION */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            {capturedPreview ? (
              <div className="space-y-3 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-[#D9A05B] shadow-lg">
                  <img
                    src={capturedPreview}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-[#162A45] font-heritage">
                  Ảnh chân dung đã chụp thành công!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCapturedPreview(null)}
                    className="flex-1 py-2 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chụp Lại</span>
                  </button>
                  <button
                    onClick={handleConfirmCapture}
                    className="flex-1 py-2 rounded-xl bg-[#162A45] text-amber-200 font-bold text-xs flex items-center justify-center gap-1 shadow-md font-heritage"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Xác Nhận</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-black/90 rounded-2xl text-center space-y-3 text-white border border-stone-700">
                {/* Viewfinder frame */}
                <div className="w-36 h-36 rounded-full border-2 border-dashed border-[#FFE082] mx-auto flex items-center justify-center relative overflow-hidden bg-slate-900/80">
                  <Camera className="w-10 h-10 text-amber-300 animate-pulse" />
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500/40" />
                </div>
                <p className="text-[11px] text-amber-200">
                  Căn chỉnh khuôn mặt vào giữa khung tròn
                </p>
                <button
                  onClick={handleCapturePhoto}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D9A05B] to-[#FFE082] text-slate-950 font-black text-xs shadow-lg font-heritage active:scale-95 transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Camera className="w-4 h-4 fill-slate-950" />
                  <span>Bấm Chụp Ảnh</span>
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
