// src/context/GpsContext.tsx
'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Coordinates } from '@/utils/geo';

interface GpsContextValue {
  currentGps: Coordinates;
  playerHeading: number;
  setGps: (coords: Coordinates) => void;
  moveGpsByDelta: (dLat: number, dLng: number, heading?: number) => void;
  setHeading: (heading: number) => void;
}

const GpsContext = createContext<GpsContextValue | undefined>(undefined);

// Mặc định: Bến Nhà Rồng, TP.HCM
const DEFAULT_GPS: Coordinates = { lat: 10.76828, lng: 106.70678 };

export const GpsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGps, setCurrentGps] = useState<Coordinates>(DEFAULT_GPS);
  const [playerHeading, setPlayerHeading] = useState<number>(0);

  const setGps = useCallback((coords: Coordinates) => {
    setCurrentGps(coords);
  }, []);

  const moveGpsByDelta = useCallback((dLat: number, dLng: number, heading?: number) => {
    setCurrentGps((prev) => ({
      lat: Number((prev.lat + dLat).toFixed(6)),
      lng: Number((prev.lng + dLng).toFixed(6)),
    }));
    if (typeof heading === 'number') {
      setPlayerHeading(heading);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentGps,
      playerHeading,
      setGps,
      moveGpsByDelta,
      setHeading: setPlayerHeading,
    }),
    [currentGps, playerHeading, setGps, moveGpsByDelta]
  );

  return <GpsContext.Provider value={value}>{children}</GpsContext.Provider>;
};

export const useGps = (): GpsContextValue => {
  const context = useContext(GpsContext);
  if (!context) throw new Error('useGps phải được dùng bên trong GpsProvider');
  return context;
};
