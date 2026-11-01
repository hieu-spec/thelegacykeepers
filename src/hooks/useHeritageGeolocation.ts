// src/hooks/useHeritageGeolocation.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DIORAMA_PRESETS } from '@/constants/minimalTheme';

export interface GeoCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  speedKmh?: number | null;
}

export function useHeritageGeolocation() {
  // Mặc định khởi tạo tại Bến Nhà Rồng nếu trình duyệt chưa cấp quyền GPS
  const [coords, setCoords] = useState<GeoCoordinates>({
    lat: 10.7683,
    lng: 106.7068,
  });
  const [mode, setMode] = useState<'REAL_GPS' | 'DIORAMA'>('REAL_GPS');
  const [gpsError, setGpsError] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && !('geolocation' in navigator)) {
      return 'Thiết bị không hỗ trợ định vị GPS.';
    }
    return null;
  });
  const [isSpeedWarning, setIsSpeedWarning] = useState(false);

  // Theo dõi GPS thật từ thiết bị (Không dùng bước đi giả lập)
  useEffect(() => {
    if (mode !== 'REAL_GPS') return;
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const speedMs = position.coords.speed; // m/s
        const speedKmh = speedMs !== null ? speedMs * 3.6 : 0;

        // Cảnh báo nếu di chuyển quá 35km/h để chống gian lận & đảm bảo an toàn
        setIsSpeedWarning(speedKmh > 35);
        setGpsError(null);

        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speedKmh,
        });
      },
      () => {
        setGpsError('Đang dùng vị trí mặc định (Chưa bật quyền vị trí GPS).');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [mode]);

  // Chuyển sang góc nhìn Tham quan Từ xa (Chỉ xem tư liệu & chơi thử, không tính Check-in thực địa)
  const flyToDioramaPreset = useCallback((presetId: string) => {
    const found = DIORAMA_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setMode('DIORAMA');
      setCoords({ lat: found.lat, lng: found.lng, accuracy: 0, speedKmh: 0 });
    }
  }, []);

  const switchToRealGps = useCallback(() => {
    setMode('REAL_GPS');
  }, []);

  return {
    coords,
    mode,
    gpsError,
    isSpeedWarning,
    flyToDioramaPreset,
    switchToRealGps,
  };
}
