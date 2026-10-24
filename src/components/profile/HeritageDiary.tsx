'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, Volume2, Calendar, Radio, CheckCircle2, ChevronRight } from 'lucide-react';

export const HeritageDiary: React.FC = () => {
  const { locations, userProfile, togglePlayAudio, setSelectedLocation, setCurrentTab } =
    useApp();

  const visitedLocations = locations.filter((l) =>
    userProfile.visitedLocationIds.includes(l.id)
  );

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="flex items-center justify-between text-xs text-[#5A4A3A] px-1">
        <span className="font-bold text-[#8B2626] uppercase tracking-wider text-[10px]">
          Di tích đã in dấu chân ({visitedLocations.length})
        </span>
        <span className="text-[10px]">Đã xác thực tọa độ GPS</span>
      </div>

      {/* Visited Locations Cards */}
      <div className="space-y-2.5">
        {visitedLocations.map((loc) => (
          <div
            key={loc.id}
            className="p-3 rounded-2xl bg-white border border-[#EADBCE] shadow-sm hover:border-[#D9A05B] transition-all space-y-2"
          >
            <div className="flex items-start gap-3">
              <img
                src={loc.imageUrl}
                alt={loc.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#EADBCE]"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#D9A05B]/15 text-[#996515]">
                    {loc.rarity}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã Khám Phá
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#162A45] font-heritage truncate mt-0.5">
                  {loc.name}
                </h4>
                <p className="text-[10px] text-stone-500 line-clamp-1">
                  {loc.address}
                </p>

                <p className="text-[10px] text-stone-600 line-clamp-2 mt-1 leading-snug">
                  {loc.historicalSummary}
                </p>
              </div>
            </div>

            {/* Witness audio quick player bar */}
            <div className="p-2 rounded-xl bg-[#FAF6F0] border border-[#EADBCE] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Radio className="w-3.5 h-3.5 text-[#8B2626] shrink-0" />
                <span className="text-[10px] text-[#162A45] font-medium truncate">
                  {loc.witnessStory.title}
                </span>
              </div>

              <button
                onClick={() => togglePlayAudio(loc.witnessStory)}
                className="px-2.5 py-1 rounded-lg bg-[#8B2626] text-white text-[10px] font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 shrink-0"
              >
                <Volume2 className="w-3 h-3" />
                Nghe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
