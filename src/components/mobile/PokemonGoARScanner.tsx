// src/components/mobile/PokemonGoARScanner.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Navigation,
  Volume2,
  Footprints,
  Sparkles,
  CornerUpRight,
  ArrowUp,
  Gift,
  BookOpen,
} from 'lucide-react';
import { HeritageMapLocation } from './MobileSatelliteMap';
import { SpawnedLootItem } from '@/data/wartimeLoot';
import { calculateDistance, calculateBearing, calculateDeltaAngle } from '@/utils/geo';

interface PokemonGoARScannerProps {
  targetLocation: HeritageMapLocation;
  userGps: { lat: number; lng: number };
  playerHeading: number;
  spawnedLoots: SpawnedLootItem[];
  onStepForwardInAR: () => void;
  onCollectLoot: (loot: SpawnedLootItem) => void;
  onSpeakNavigation: (voiceText: string) => void;
  onOpenStoryPuzzle: () => void;
}

export const PokemonGoARScanner: React.FC<PokemonGoARScannerProps> = ({
  targetLocation,
  userGps,
  playerHeading,
  spawnedLoots,
  onStepForwardInAR,
  onCollectLoot,
  onSpeakNavigation,
  onOpenStoryPuzzle,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [lastSpokenDistanceBucket, setLastSpokenDistanceBucket] = useState<number | null>(null);

  const distanceMeters = Math.round(calculateDistance(userGps, targetLocation.coordinates));
  const bearing = Math.round(calculateBearing(userGps, targetLocation.coordinates));
  const deltaAngle = Math.round(calculateDeltaAngle(bearing, playerHeading));

  // Mở Camera thật trên điện thoại
  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then((stream) => {
          mediaStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraReady(true);
          }
        })
        .catch(() => setCameraReady(false));
    }
    return () => {
      mediaStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Tạo câu nhắc giọng nói kiểu Google Maps mỗi khi khoảng cách giảm qua từng cột mốc
  const buildVoiceInstruction = () => {
    if (distanceMeters <= 20) {
      return `Bạn đã đến ${targetLocation.name}. Hãy bấm Giải mã di tích hoặc thu thập kỷ vật xung quanh.`;
    }
    const directionHint =
      Math.abs(deltaAngle) <= 25
        ? 'Đi thẳng về phía trước'
        : deltaAngle > 0
        ? `Chếch sang phải ${Math.abs(deltaAngle)} độ`
        : `Chếch sang trái ${Math.abs(deltaAngle)} độ`;

    const lootHint =
      spawnedLoots.length > 0
        ? ` Chú ý: Phát hiện ${spawnedLoots[0].artifact.name} vừa rơi ngay trên đường!`
        : '';

    return `${directionHint}, còn ${distanceMeters} mét nữa sẽ tới ${targetLocation.name}.${lootHint}`;
  };

  // Tự động đọc Voice Google Maps khi người dùng bước qua mỗi mốc 25m
  useEffect(() => {
    const bucket = Math.floor(distanceMeters / 25);
    if (lastSpokenDistanceBucket === null || bucket !== lastSpokenDistanceBucket) {
      setLastSpokenDistanceBucket(bucket);
      onSpeakNavigation(buildVoiceInstruction());
    }
  }, [distanceMeters]);

  return (
    <div className="relative w-full h-full bg-[#050A14] flex flex-col justify-between overflow-hidden">
      {/* 1. CAMERA THỰC ĐỊA TRỰC TIẾP */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover ${
          cameraReady ? 'opacity-90' : 'hidden'
        }`}
      />
      {!cameraReady && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1B334B_0%,#060C17_100%)]" />
      )}

      {/* 2. BANNER GOOGLE MAPS AR VOICE NAVIGATION TRÊN ĐỈNH */}
      <div className="relative z-30 mx-3 mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#065F46]/95 to-[#047857]/95 backdrop-blur-xl border-2 border-emerald-300/70 shadow-2xl flex items-center justify-between gap-3">
        <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
          {Math.abs(deltaAngle) <= 25 ? (
            <ArrowUp className="w-6 h-6 text-white animate-bounce" />
          ) : (
            <CornerUpRight
              className="w-6 h-6 text-amber-300"
              style={{ transform: deltaAngle < 0 ? 'scaleX(-1)' : undefined }}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 block">
            🔊 Google Maps AR Voice • Cách {distanceMeters}m
          </span>
          <p className="text-xs font-bold text-white leading-snug">{buildVoiceInstruction()}</p>
        </div>

        <button
          onClick={() => onSpeakNavigation(buildVoiceInstruction())}
          className="px-2.5 py-2 rounded-xl bg-[#D4AF37] text-[#070C15] font-extrabold text-[10px] flex items-center gap-1 shrink-0 shadow"
        >
          <Volume2 className="w-4 h-4" />
          <span>Đọc lại</span>
        </button>
      </div>

      {/* 3. KHÔNG GIAN CAMERA AR: TRỤ ĐÍCH ĐẾN & CÁC "BỨC THƯ THỜI CHIẾN" RƠI TRƯỚC MẶT */}
      <div className="relative z-20 flex-1 w-full overflow-hidden">
        {/* Cột mốc Đích đến AR từ xa */}
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center transition-transform duration-300"
          style={{
            transform: `translateX(${Math.max(-110, Math.min(110, deltaAngle * 1.8))}px)`,
          }}
        >
          <div className="px-3.5 py-2 rounded-2xl bg-[#0B1320]/90 border-2 border-[#D4AF37] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.7)] flex items-center gap-2">
            <span className="text-2xl">{targetLocation.defaultEmblemEmoji}</span>
            <div>
              <p className="text-xs font-extrabold text-white">{targetLocation.name}</p>
              <p className="text-[10px] font-mono text-emerald-400 font-bold">
                Cách {distanceMeters}m • Hướng {bearing}°
              </p>
            </div>
          </div>
          <div className="w-0.5 h-10 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        </div>

        {/* CÁC VẬT PHẨM / BỨC THƯ THỜI CHIẾN RƠI LƠ LỬNG TRONG CAMERA AR (CHẠM ĐỂ BẮT!) */}
        <AnimatePresence>
          {spawnedLoots.map((loot) => (
            <motion.button
              key={loot.instanceId}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ y: { repeat: Infinity, duration: 2.2 } }}
              onClick={() => onCollectLoot(loot)}
              style={{
                left: `${loot.arScreenPos.x}%`,
                top: `${loot.arScreenPos.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#8B2626] via-amber-500 to-yellow-200 p-1 shadow-[0_0_35px_#FACC15]">
                <div className="w-full h-full rounded-full bg-[#0B1320]/90 flex items-center justify-center text-4xl">
                  {loot.artifact.icon}
                </div>
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-400 text-[#070C15] text-[9px] font-extrabold uppercase">
                  {loot.artifact.rarity}
                </span>
              </div>
              <div className="mt-1.5 px-3 py-1 rounded-full bg-[#070C15]/95 border border-amber-400 text-amber-200 text-[11px] font-extrabold shadow-xl">
                📜 {loot.artifact.name} (Chạm để nhặt!)
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* THẢM MŨI TÊN CHỈ ĐƯỜNG 3D DƯỚI MẶT ĐẤT (GOOGLE MAPS LIVE VIEW ARROWS) */}
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{
            perspective: '400px',
            transform: `translateX(-50%) rotateZ(${Math.max(-35, Math.min(35, deltaAngle))}deg)`,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-6 border-t-4 border-r-4 border-cyan-400 animate-pulse"
              style={{
                transform: 'rotateX(60deg) rotateZ(-45deg)',
                opacity: 1 - i * 0.25,
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. THANH ĐIỀU KHIỂN VỪA ĐI VỪA QUÉT AR DƯỚI ĐÁY */}
      <div className="relative z-30 mx-3 mb-3 p-3 rounded-3xl bg-[#070C15]/90 backdrop-blur-xl border border-[#D4AF37]/50 flex items-center justify-between gap-2">
        <button
          onClick={onStepForwardInAR}
          className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-[#070C15] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95"
        >
          <Footprints className="w-4 h-4" />
          <span>Bước Tới Trước (+Rớt Vật Phẩm)</span>
        </button>

        <button
          onClick={onOpenStoryPuzzle}
          className="py-3 px-3.5 rounded-2xl bg-[#8B2626] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[#D4AF37]/50 active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span>Giải Mã</span>
        </button>
      </div>
    </div>
  );
};
