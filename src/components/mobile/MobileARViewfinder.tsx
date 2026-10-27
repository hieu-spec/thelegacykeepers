// src/components/mobile/MobileARViewfinder.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, Volume2, BookOpen, ShieldCheck, Camera } from 'lucide-react';
import { HeritageLocationItem } from './MobileHeritageShell';

interface MobileARViewfinderProps {
  targetLocation: HeritageLocationItem;
  playerHeading: number;
  onTriggerStory: () => void;
  onPlayAudio: () => void;
}

export const MobileARViewfinder: React.FC<MobileARViewfinderProps> = ({
  targetLocation,
  playerHeading,
  onTriggerStory,
  onPlayAudio,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [compassHeading, setCompassHeading] = useState<number>(playerHeading);
  const [iosPermissionGranted, setIosPermissionGranted] = useState<boolean>(false);

  // Mở Camera WebRTC thực tế
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Xin quyền cảm biến La bàn cho iOS 13+ Safari
  const requestIosCompassPermission = async () => {
    const DeviceOrientation = (typeof window !== 'undefined' ? (window as any).DeviceOrientationEvent : undefined) as
      | { requestPermission?: () => Promise<'granted' | 'denied'> }
      | undefined;

    if (typeof DeviceOrientation?.requestPermission === 'function') {
      try {
        const res = await DeviceOrientation.requestPermission();
        if (res === 'granted') {
          setIosPermissionGranted(true);
          window.addEventListener('deviceorientation', (e: any) => {
            const webkitHeading = e.webkitCompassHeading;
            if (typeof webkitHeading === 'number') {
              setCompassHeading(Math.round(webkitHeading));
            } else if (e.alpha !== null) {
              setCompassHeading(Math.round((360 - e.alpha) % 360));
            }
          });
        }
      } catch {
        setIosPermissionGranted(false);
      }
    } else {
      setIosPermissionGranted(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#060A12] flex flex-col justify-between overflow-hidden">
      {/* Camera Feed hoặc Phông nền Thực địa Giả lập */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'opacity-85' : 'hidden'}`}
      />
      {!cameraActive && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#1F2F46_0%,#090F1A_100%)]" />
      )}

      {/* 1. THƯỚC ĐO PHƯƠNG VỊ LA BÀN NGANG (TACTICAL COMPASS TAPE) */}
      <div className="relative z-20 mx-4 mt-2 bg-[#070C15]/80 backdrop-blur-md border border-[#D4AF37]/40 rounded-xl p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#D4AF37] animate-spin" style={{ animationDuration: '12s' }} />
          <span className="text-xs font-mono font-bold text-[#D4AF37]">{compassHeading}° ĐB</span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-gray-300">
          <span>TÂY 270°</span>
          <span className="text-[#D4AF37] font-bold">▲ BẮC 0°</span>
          <span>ĐÔNG 90°</span>
        </div>

        {!iosPermissionGranted && (
          <button
            onClick={requestIosCompassPermission}
            className="px-2 py-1 rounded-lg bg-[#D4AF37] text-[#0B1320] text-[10px] font-bold flex items-center gap-1 active:scale-95 transition"
          >
            <ShieldCheck className="w-3 h-3" />
            Cảm biến iOS
          </button>
        )}
      </div>

      {/* 2. TÂM NGẮM TRỐNG ĐỒNG & HOLOGRAM BEACON 3D */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6">
        {/* Khung góc ống ngắm AR */}
        <div className="relative w-72 h-72 flex items-center justify-center">
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* Thẻ Hologram Di tích lơ lửng trong không gian AR */}
          <div className="w-full p-4 rounded-2xl bg-gradient-to-b from-[#0B1320]/90 via-[#16243B]/85 to-[#8B2626]/70 backdrop-blur-xl border border-[#D4AF37] shadow-[0_0_35px_rgba(212,175,55,0.45)] text-center animate-pulse">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold uppercase">
              <Sparkles className="w-3 h-3" /> Tín hiệu Di sản Đã Khóa
            </div>

            <h3 className="font-['Cinzel',serif] text-lg font-bold text-white mt-1.5">
              {targetLocation.name}
            </h3>
            <p className="text-xs text-[#D4AF37] font-medium">{targetLocation.era}</p>

            <div className="mt-2 py-1.5 px-3 rounded-lg bg-black/40 border border-white/10 inline-block">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Khoảng cách: {targetLocation.distanceMeters}m • Độ lệch: +4°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THANH TƯƠNG TÁC AR DƯỚI ĐÁY */}
      <div className="relative z-20 mx-4 mb-4 p-3 rounded-2xl bg-[#070C15]/90 backdrop-blur-xl border border-[#D4AF37]/40 flex items-center justify-between gap-2">
        <button
          onClick={onPlayAudio}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#8B2626] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#D4AF37]/50 active:scale-95 transition"
        >
          <Volume2 className="w-4 h-4 text-[#D4AF37]" />
          <span>Nghe Nhân Chứng</span>
        </button>

        <button
          onClick={onTriggerStory}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#D4AF37] text-[#0B1320] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95 transition"
        >
          <BookOpen className="w-4 h-4" />
          <span>Giải Mã Ký Ức</span>
        </button>
      </div>
    </div>
  );
};
