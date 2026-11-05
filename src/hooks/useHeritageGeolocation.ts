// src/hooks/useHeritageGeolocation.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface GeoCoordinates {
  lat: number;
  lng: number;
  speedKmh: number;
  isSimulated: boolean;
}

// Tọa độ chuẩn tại Bến Nhà Rồng (Quận 4, TP.HCM)
const DEFAULT_BEN_NHA_RONG_COORDS: GeoCoordinates = {
  lat: 10.7683,
  lng: 106.7068,
  speedKmh: 0,
  isSimulated: true,
};

// Công thức Haversine tính khoảng cách thực tế (mét) giữa 2 tọa độ
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Bán kính Trái Đất (mét)
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function useHeritageGeolocation() {
  const [coords, setCoords] = useState<GeoCoordinates>(DEFAULT_BEN_NHA_RONG_COORDS);
  const [speedWarning, setSpeedWarning] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const speedMs = pos.coords.speed || 0;
        const speedKmh = Math.round(speedMs * 3.6);
        setSpeedWarning(speedKmh > 35);

        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          speedKmh,
          isSimulated: false,
        });
      },
      () => {
        // Nếu Laptop không có chip GPS hoặc bị từ chối quyền, tự động dùng tọa độ Bến Nhà Rồng để không làm hỏng bản đồ
        setCoords(DEFAULT_BEN_NHA_RONG_COORDS);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Cho phép dịch chuyển tức thời tới một di tích khi test trên Laptop
  const teleportToSite = useCallback((lat: number, lng: number) => {
    setCoords({
      lat,
      lng,
      speedKmh: 0,
      isSimulated: true,
    });
  }, []);

  return {
    coords,
    speedWarning,
    teleportToSite,
    calculateDistanceMeters,
  };
}
