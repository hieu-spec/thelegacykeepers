'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoricalLocation } from '@/types/location';
import { useApp } from '@/context/AppContext';
import { Search, X, MapPin, Sparkles, Radio, ArrowRight } from 'lucide-react';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: HistoricalLocation) => void;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const { locations, getLocationProximity } = useApp();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return locations;
    const q = query.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.subtitle.toLowerCase().includes(q) ||
        loc.historicalPeriod.toLowerCase().includes(q) ||
        loc.witnessStory.speakerName.toLowerCase().includes(q) ||
        loc.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [locations, query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex flex-col bg-[#070D18]/95 backdrop-blur-xl pointer-events-auto p-4 select-none">
        {/* Search Header Bar */}
        <div className="flex items-center gap-2 pt-12 pb-3 border-b border-slate-800">
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-slate-900 border border-[#D4AF37]/50 shadow-inner">
            <Search className="w-4 h-4 text-[#D4AF37]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm di tích, nhân chứng, bảo tàng..."
              className="bg-transparent border-none outline-none text-xs text-amber-100 placeholder-slate-500 w-full"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Đóng
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto pt-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Kết quả tìm kiếm ({searchResults.length})</span>
            {query && <span className="text-[#D4AF37]">Từ khóa: &ldquo;{query}&rdquo;</span>}
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Không tìm thấy địa danh phù hợp với từ khóa &ldquo;{query}&rdquo;
            </div>
          ) : (
            searchResults.map((loc) => {
              const prox = getLocationProximity(loc);
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelect(loc);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-[#0E1A2C] border border-slate-800 hover:border-[#D4AF37] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-2">
                    <img
                      src={loc.imageUrl}
                      alt={loc.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#D4AF37]/20 text-[#F59E0B]">
                          {loc.rarity}
                        </span>
                        {loc.contentType === 'witness' && (
                          <span className="text-[9px] font-semibold text-red-400 flex items-center gap-0.5">
                            <Radio className="w-2.5 h-2.5" /> Nhân chứng
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-amber-100 font-heritage truncate mt-0.5">
                        {loc.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {loc.address}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <p
                        className={`text-[10px] font-bold ${
                          prox.inInteractionRadius ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        {prox.inInteractionRadius ? '⚡ Kết nối' : prox.distanceFormatted}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
