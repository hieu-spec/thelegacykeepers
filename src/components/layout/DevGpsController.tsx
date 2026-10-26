'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, GPS_PRESETS, GpsPreset } from '@/context/AppContext';
import { Navigation2, MapPin, ChevronDown, ChevronUp, Satellite, Footprints, ShieldCheck, Settings } from 'lucide-react';

export const DevGpsController: React.FC = () => {
  const {
    currentGps,
    currentGpsPreset,
    teleportToPreset,
    offsetGps,
    isGpsControllerOpen,
    setIsGpsControllerOpen,
  } = useApp();

  return (
    <div className="absolute top-2.5 left-3 right-3 z-40">
      {/* Floating Pill Header */}
      <div className="relative">
        <button
          onClick={() => setIsGpsControllerOpen(!isGpsControllerOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-[#0F1B2E]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-lg shadow-black/40 text-left hover:border-[#D4AF37] transition-all group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1">
                <Satellite className="w-2.5 h-2.5" />
                Giả Lập GPS (Teleport)
              </span>
              <p className="text-xs font-medium text-slate-200 truncate">
                {currentGpsPreset.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pl-2 shrink-0">
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
              GPS ±3m
            </span>
            {isGpsControllerOpen ? (
              <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#D4AF37]" />
            )}
          </div>
        </button>

        {/* Collapsible Dropdown Panel */}
        <AnimatePresence>
          {isGpsControllerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-3 bg-[#0B1422]/98 backdrop-blur-2xl border border-[#D4AF37]/50 rounded-2xl shadow-2xl shadow-black/80 text-slate-200"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-200">
                  <Navigation2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="font-semibold">Bộ điều khiển Vị trí Địa lý</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {currentGps.lat.toFixed(5)}, {currentGps.lng.toFixed(5)}
                </span>
              </div>

              {/* Preset Quick Selection List */}
              <div className="mt-2.5 space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {GPS_PRESETS.map((preset: GpsPreset) => {
                  const isActive = currentGpsPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        teleportToPreset(preset);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all border flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                      }`}
                    >
                      <MapPin
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isActive ? 'text-[#D4AF37]' : 'text-slate-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs font-semibold truncate ${
                              isActive ? 'text-amber-200' : 'text-slate-200'
                            }`}
                          >
                            {preset.label}
                          </p>
                          {isActive && (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                          {preset.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Fine-Tuning Step Controls */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-amber-300" />
                  Bước đi (±20m):
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => offsetGps(0.00018, 0)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs active:scale-95 transition-all text-amber-200"
                    title="Tiến lên hướng Bắc 20m"
                  >
                    +20m Bắc
                  </button>
                  <button
                    onClick={() => offsetGps(-0.00018, 0)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs active:scale-95 transition-all text-amber-200"
                    title="Lùi về hướng Nam 20m"
                  >
                    -20m Nam
                  </button>
                  <button
                    onClick={() => offsetGps(0, 0.00018)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs active:scale-95 transition-all text-amber-200"
                    title="Bước sang Đông 20m"
                  >
                    +20m Đông
                  </button>
                </div>
              </div>

              {/* CMS Admin Link Button */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                <Link
                  href="/admin/location-manager"
                  className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Mở CMS Quản Trị Pin Di Tích</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
