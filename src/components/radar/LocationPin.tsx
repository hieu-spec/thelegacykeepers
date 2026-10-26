'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HistoricalLocation } from '@/types/location';
import { LocationProximity } from '@/context/AppContext';
import { Landmark, Compass, ShieldAlert, Sparkles, Flag } from 'lucide-react';

interface LocationPinProps {
  location: HistoricalLocation;
  proximity: LocationProximity;
  radarRadiusPx: number;
  maxRadarRangeKm: number;
  isSelected: boolean;
  onSelect: (location: HistoricalLocation) => void;
}

export const LocationPin: React.FC<LocationPinProps> = ({
  location,
  proximity,
  radarRadiusPx,
  maxRadarRangeKm,
  isSelected,
  onSelect,
}) => {
  // Map real distance in km to radar pixels (use a square-root or log scale so close pins are very clear)
  const distKm = proximity.distanceMeters / 1000;

  // If outside radar display range, clamp to outer rim with faded style
  const isOutOfView = distKm > maxRadarRangeKm;
  const normalizedDistance = Math.min(distKm / maxRadarRangeKm, 1);
  // Non-linear scale for better visibility: sqrt curve pushes close items outward slightly
  const rPx = Math.max(22, Math.pow(normalizedDistance, 0.6) * (radarRadiusPx - 26));

  // Bearing: 0 is North (top), 90 is East (right)
  const angleRad = ((proximity.bearing - 90) * Math.PI) / 180;
  const x = Math.cos(angleRad) * rPx;
  const y = Math.sin(angleRad) * rPx;

  // Colors & Icons by Rarity
  const rarityConfig = {
    legendary: {
      border: 'border-[#F59E0B]',
      bg: 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]',
      shadow: 'shadow-[0_0_18px_rgba(245,158,11,0.8)]',
      text: 'text-slate-950',
      badgeBg: 'bg-[#D4AF37]/20 border-[#D4AF37] text-amber-200',
      icon: Sparkles,
    },
    event: {
      border: 'border-[#EF4444]',
      bg: 'bg-gradient-to-br from-[#DC2626] to-[#991B1B]',
      shadow: 'shadow-[0_0_18px_rgba(239,68,68,0.8)]',
      text: 'text-white',
      badgeBg: 'bg-red-950/80 border-red-500 text-red-200',
      icon: Flag,
    },
    rare: {
      border: 'border-[#EF4444]',
      bg: 'bg-gradient-to-br from-[#DC2626] to-[#991B1B]',
      shadow: 'shadow-[0_0_18px_rgba(239,68,68,0.8)]',
      text: 'text-white',
      badgeBg: 'bg-red-950/80 border-red-500 text-red-200',
      icon: Flag,
    },
    uncommon: {
      border: 'border-[#38BDF8]',
      bg: 'bg-gradient-to-br from-[#0284C7] to-[#0369A1]',
      shadow: 'shadow-[0_0_15px_rgba(56,189,248,0.6)]',
      text: 'text-white',
      badgeBg: 'bg-sky-950/80 border-sky-400 text-sky-200',
      icon: ShieldAlert,
    },
    common: {
      border: 'border-[#10B981]',
      bg: 'bg-gradient-to-br from-[#059669] to-[#047857]',
      shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      text: 'text-white',
      badgeBg: 'bg-emerald-950/80 border-emerald-400 text-emerald-200',
      icon: Landmark,
    },
  }[location.rarity] || {
    border: 'border-[#10B981]',
    bg: 'bg-gradient-to-br from-[#059669] to-[#047857]',
    shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    text: 'text-white',
    badgeBg: 'bg-emerald-950/80 border-emerald-400 text-emerald-200',
    icon: Landmark,
  };

  const IconComponent = rarityConfig.icon;

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 30 : proximity.inInteractionRadius ? 25 : 15,
      }}
      className="transition-all duration-700 ease-out pointer-events-auto"
    >
      <button
        onClick={() => onSelect(location)}
        className="group relative flex flex-col items-center focus:outline-none"
        aria-label={`Xem di tích ${location.name}`}
      >
        {/* Pulsing Sonar Ring when in Interaction Radius */}
        {proximity.inInteractionRadius && (
          <span className="absolute -inset-3 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
        )}

        {/* Pin Halo Button */}
        <motion.div
          animate={{
            scale: isSelected ? [1.15, 1.25, 1.15] : [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 ${rarityConfig.border} ${rarityConfig.bg} ${rarityConfig.shadow} ${rarityConfig.text} transition-transform group-hover:scale-125 cursor-pointer`}
        >
          <IconComponent className="w-4 h-4 fill-current" />
          
          {/* Status Indicator Dot */}
          {proximity.inInteractionRadius && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" />
          )}
        </motion.div>

        {/* Floating Mini Badge with Name & Distance: Smart anti-overlap hover */}
        <div
          className={`mt-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-tight whitespace-nowrap shadow-md backdrop-blur-md transition-all duration-200 ${
            proximity.inInteractionRadius
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/50'
              : rarityConfig.badgeBg
          } ${
            isSelected || location.rarity === 'legendary' || proximity.inInteractionRadius
              ? 'opacity-100 scale-100 z-30'
              : 'opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:z-40'
          }`}
        >
          {proximity.inInteractionRadius ? `⚡ ${location.name}` : `${location.name} · ${proximity.distanceFormatted}`}
        </div>
      </button>
    </div>
  );
};
