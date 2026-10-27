"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Compass,
  Navigation,
  Sparkles,
  ShieldAlert,
  Crosshair,
  MapPin,
  X,
  Target,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { calculateDistance, calculateBearing, calculateDeltaAngle, formatDistance } from "@/utils/geo";

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface DeviceOrientationEventConstructor {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export const useARCompass = (initialHeading: number = 0) => {
  const [heading, setHeading] = useState<number>(initialHeading);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const iosEvent = event as DeviceOrientationEventiOS;
    if (typeof iosEvent.webkitCompassHeading === 'number') {
      // iOS Safari trả về góc hướng Bắc thực tế
      setHeading(Math.round(iosEvent.webkitCompassHeading));
    } else if (event.alpha !== null) {
      // Android / Trình duyệt chuẩn
      setHeading(Math.round((360 - event.alpha) % 360));
    }
  }, []);

  const requestCompassPermission = useCallback(async () => {
    const DeviceOrientation = (typeof window !== 'undefined' ? (window as any).DeviceOrientationEvent : undefined) as
      | DeviceOrientationEventConstructor
      | undefined;

    if (DeviceOrientation && typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const response = await DeviceOrientation.requestPermission();
        setPermissionState(response);
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (error) {
        console.error('Lỗi xin quyền cảm biến la bàn iOS:', error);
        setPermissionState('denied');
      }
    } else {
      // Thiết bị không yêu cầu xin quyền kiểu iOS 13+
      setPermissionState('granted');
      if (typeof window !== 'undefined') {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }
  }, [handleOrientation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const DeviceOrientation = (window as any).DeviceOrientationEvent as DeviceOrientationEventConstructor | undefined;
    if (!DeviceOrientation || typeof DeviceOrientation.requestPermission !== 'function') {
      setPermissionState('granted');
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [handleOrientation]);

  return { heading, setHeading, permissionState, requestCompassPermission };
};

export interface ARNavigationProps {
  targetLocation?: any;
  onClose?: () => void;
  onOpenLocationDetail?: (loc: any) => void;
}

export function ARNavigationView({
  targetLocation: propTarget,
  onClose,
  onOpenLocationDetail,
}: ARNavigationProps = {}) {
  const {
    locations,
    userLocation,
    currentGps,
    setSelectedLocation,
    stopArNavigation,
    arTargetLocation,
  } = useApp();

  const activeTarget = propTarget || arTargetLocation;
  const activePosition = userLocation || currentGps || { lat: 10.7769, lng: 106.6953 };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Hook La bàn AR chuẩn đa nền tảng (iOS 13+ & Android)
  const { heading, setHeading, permissionState, requestCompassPermission } = useARCompass(0);

  // Bật / tắt luồng Camera thực tế (WebRTC getUserMedia)
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      return;
    }

    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Trình duyệt không hỗ trợ WebRTC Camera");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError(
        "Không thể mở Camera (Hãy cấp quyền trình duyệt hoặc sử dụng chế độ Giả lập Hologram)."
      );
      setCameraActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Tính toán danh sách các điểm di tích gần nhất kèm góc lệch so với tầm nhìn
  const nearbyBeacons = useMemo(() => {
    const uCoord = { lat: activePosition.lat, lng: activePosition.lng };

    return (locations || [])
      .map((loc: any) => {
        const lat = loc.coordinates?.lat ?? loc.lat;
        const lng = loc.coordinates?.lng ?? loc.lng;
        if (!lat || !lng) return null;

        const locCoord = { lat, lng };
        const distance = calculateDistance(uCoord, locCoord);
        const bearing = calculateBearing(uCoord, locCoord);
        const deltaAngle = calculateDeltaAngle(bearing, heading);

        const isTarget = activeTarget && activeTarget.id === loc.id;

        return {
          ...loc,
          distance: Math.round(distance),
          bearing: Math.round(bearing),
          deltaAngle,
          isTarget,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => {
        if (a.isTarget) return -1;
        if (b.isTarget) return 1;
        return a.distance - b.distance;
      })
      .slice(0, 7);
  }, [locations, activePosition, heading, activeTarget]);

  const handleSelectBeacon = (loc: any) => {
    if (onOpenLocationDetail) {
      onOpenLocationDetail(loc);
    } else if (setSelectedLocation) {
      setSelectedLocation(loc);
    }
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (onClose) {
      onClose();
    } else if (stopArNavigation) {
      stopArNavigation();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#070C15] overflow-hidden flex flex-col select-none font-sans">
      {/* KHUNG NGẮM AR THỰC ĐỊA (Tỷ lệ 65% trên) */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-[#0B1528] via-[#091220] to-[#070C15]">
        {/* Luồng Video Camera Thật */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            cameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Nền lưới Cyber-Heritage khi tắt Camera */}
        {!cameraActive && (
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 40%, rgba(212, 175, 55, 0.22), transparent 65%), linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 36px 36px, 36px 36px",
            }}
          />
        )}

        {/* HUD Góc Tác Chiến Viền Quanh (Corner Brackets) */}
        <div className="pointer-events-none absolute inset-4 border border-amber-500/20 rounded-3xl z-10">
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />
        </div>

        {/* Thanh Thước La Bàn Số (Top HUD Compass Tape) */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2">
          {/* Nút thoát AR */}
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-full bg-[#0B1320]/90 backdrop-blur-md border border-amber-500/40 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1 shadow-lg active:scale-95 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Thoát AR</span>
          </button>

          <div className="flex items-center gap-2 bg-[#0B1320]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-xs text-amber-300 font-mono">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>{heading}°</span>
          </div>

          {/* Thanh trượt xoay góc nhìn giả lập khi dùng trên PC */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0B1320]/80 px-2.5 py-1 rounded-full border border-slate-700">
            <span className="text-[10px] text-slate-400">Xoay:</span>
            <input
              type="range"
              min={0}
              max={359}
              value={heading}
              onChange={(e) => setHeading(Number(e.target.value))}
              className="w-24 accent-amber-400 cursor-pointer"
              title="Xoay góc nhìn la bàn AR"
            />
          </div>

          <button
            onClick={toggleCamera}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition border active:scale-95 ${
              cameraActive
                ? "bg-rose-500/90 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                : "bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:brightness-110"
            }`}
          >
            {cameraActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Tắt Camera</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Camera AR</span>
              </>
            )}
          </button>
        </div>

        {/* Nút yêu cầu cấp quyền cảm biến la bàn cho iOS nếu permissionState === 'prompt' */}
        {permissionState === 'prompt' && (
          <div className="absolute top-16 left-4 right-4 z-30 flex justify-center">
            <button
              onClick={requestCompassPermission}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs shadow-xl active:scale-95 transition flex items-center gap-2 border border-amber-300 animate-pulse"
            >
              <Compass className="w-4 h-4" />
              <span>Chạm để kích hoạt La Bàn Thực tế (iOS)</span>
            </button>
          </div>
        )}

        {/* Thông báo lỗi nếu thiết bị không có camera */}
        {cameraError && (
          <div className="absolute top-16 left-4 right-4 z-30 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-3 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xl">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Tâm ngắm quang học giữa màn hình */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-48 h-48 rounded-full border border-amber-400/20 flex items-center justify-center">
            <Crosshair className="w-7 h-7 text-amber-400/40" />
            <div className="absolute w-2 h-2 rounded-full bg-amber-400/60" />
            <div className="absolute -top-3 text-[9px] font-mono text-amber-300/60 uppercase tracking-widest">
              GÓC NGẮM QUANG HỌC
            </div>
          </div>
        </div>

        {/* CÁC THẺ HOLOGRAM DI TÍCH NỔI TRONG KHÔNG GIAN AR */}
        <div className="relative w-full h-full z-20 pointer-events-none">
          {nearbyBeacons.map((loc: any, idx) => {
            const clampedAngle = Math.max(-65, Math.min(65, loc.deltaAngle));
            const leftPercent = 50 + (clampedAngle / 65) * 40;
            const topPercent = 28 + (idx % 3) * 18;
            const isInSight = Math.abs(loc.deltaAngle) <= 55;
            const isHighlight = loc.isTarget || idx === 0;

            return (
              <div
                key={loc.id}
                onClick={() => handleSelectBeacon(loc)}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  opacity: isInSight ? 1 : 0.35,
                  transform: `translate(-50%, -50%) scale(${
                    isInSight ? (isHighlight ? 1.08 : 1) : 0.82
                  })`,
                }}
                className="pointer-events-auto absolute transition-all duration-200 cursor-pointer group"
              >
                <div
                  className={`px-3.5 py-2 rounded-2xl backdrop-blur-md border shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:scale-105 transition flex items-center gap-2.5 ${
                    isHighlight
                      ? "bg-[#0B1320]/95 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.6)] ring-2 ring-amber-400/30"
                      : "bg-[#0B1320]/85 border-amber-500/50 hover:border-amber-300"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      isHighlight
                        ? "bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 border-amber-300 shadow"
                        : "bg-amber-500/20 text-amber-300 border-amber-400/50"
                    }`}
                  >
                    {isHighlight ? (
                      <Target className="w-4 h-4 animate-spin-slow" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">
                        {formatDistance(loc.distance)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • Góc {loc.bearing}°
                      </span>
                      {loc.isTarget && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                          MỤC TIÊU
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-white whitespace-nowrap">
                      {loc.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DANH SÁCH RADAR TẦM GẦN (Tỷ lệ 35% dưới) */}
      <div className="bg-[#0B1320] border-t border-amber-500/30 p-3.5 sm:p-4 z-30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Mục Tiêu Trong Tầm Quét Quang Học ({nearbyBeacons.length})
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Xoay thiết bị hoặc kéo thanh la bàn để định vị
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
          {nearbyBeacons.map((loc: any) => (
            <button
              key={loc.id}
              onClick={() => handleSelectBeacon(loc)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${
                loc.isTarget
                  ? "bg-amber-500/15 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-white/5 hover:bg-amber-500/10 border-white/10 hover:border-amber-500/40"
              }`}
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-semibold text-white truncate">
                  {loc.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Hướng {loc.bearing}° •{" "}
                  {loc.distance <= (loc.interactionRadius || 120)
                    ? "✨ Đã vào vùng giải mã!"
                    : "Di chuyển lại gần"}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 shrink-0">
                {formatDistance(loc.distance)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ARNavigationView;
