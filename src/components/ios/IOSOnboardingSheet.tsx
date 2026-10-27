// src/components/ios/IOSOnboardingSheet.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Volume2, MapPin, Share, PlusSquare, Sparkles, ShieldCheck } from 'lucide-react';
import {
  isIOSDevice,
  isRunningStandaloneIOS,
  requestAllIOSPermissions,
  triggerIOSHaptic,
} from '@/utils/iosBridge';

export const IOSOnboardingSheet: React.FC<{
  onPermissionsReady: (status: { compass: boolean; gps: boolean }) => void;
}> = ({ onPermissionsReady }) => {
  const [visible, setVisible] = useState(false);
  const [showInstallTip, setShowInstallTip] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const alreadyActivated = sessionStorage.getItem('lk_ios_sensors_ready');
    if (!alreadyActivated) {
      setVisible(true);
    }
    if (isIOSDevice() && !isRunningStandaloneIOS()) {
      setShowInstallTip(true);
    }
  }, []);

  const handleActivateIOS = async () => {
    triggerIOSHaptic('heavy');
    const result = await requestAllIOSPermissions();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lk_ios_sensors_ready', 'true');
    }
    onPermissionsReady(result);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 80, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 80, scale: 0.96 }}
            className="w-full max-w-sm rounded-[32px] ios-frosted-glass border border-[#D4AF37]/50 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-4 pb-ios-safe"
          >
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto -mt-2 mb-2" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8B2626] flex items-center justify-center shadow-lg shrink-0">
                <Sparkles className="w-6 h-6 text-[#0B1320]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  Phiên bản Tối ưu iOS
                </span>
                <h3 className="font-['Cinzel',serif] text-base font-bold">
                  Kích Hoạt Cảm Biến Thực Địa
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Để trải nghiệm trọn vẹn trên iPhone, hệ thống cần kích hoạt các cảm biến di sản sau:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <Compass className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-bold text-white">La bàn Từ trường & Ống ngắm AR 360°</p>
                  <p className="text-[11px] text-gray-400">Xoay iPhone để tìm hướng di tích lịch sử</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Định vị Vệ tinh GPS & Pikachu Dẫn đường</p>
                  <p className="text-[11px] text-gray-400">Theo dõi bước chân thực tế của bạn trên bản đồ</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10">
                <Volume2 className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Thanh Âm Ký Ức (Giọng Đọc TTS iOS)</p>
                  <p className="text-[11px] text-gray-400">Tự động thuyết minh khi bước vào vùng di tích</p>
                </div>
              </div>
            </div>

            {/* Mẹo cài thành App Fullscreen trên iPhone nếu đang mở bằng Safari */}
            {showInstallTip && (
              <div className="p-3 rounded-2xl bg-[#16243B]/90 border border-[#D4AF37]/40 text-[11px] text-amber-100 space-y-1">
                <p className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                  <Share className="w-3.5 h-3.5" /> Mẹo cài App lên Màn hình chính iPhone:
                </p>
                <p className="text-gray-200 leading-normal">
                  Bấm nút <strong>Chia sẻ (Share)</strong> ở thanh dưới Safari, sau đó chọn{' '}
                  <strong className="inline-flex items-center gap-1 text-white">
                    <PlusSquare className="w-3 h-3 inline" /> Thêm vào MH chính (Add to Home Screen)
                  </strong>{' '}
                  để mở full màn hình như App Store!
                </p>
              </div>
            )}

            <button
              onClick={handleActivateIOS}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#0B1320] font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Bắt Đầu Hành Trình Trên iOS</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
