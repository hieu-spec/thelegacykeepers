'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const isGold = toast.type === 'gold' || !toast.type;
  const isEmerald = toast.type === 'emerald';

  const borderColor = isGold
    ? 'border-[#D4AF37]/50'
    : isEmerald
    ? 'border-emerald-500/50'
    : 'border-[#8B2626]/50';

  const glowShadow = isGold
    ? 'shadow-[0_8px_30px_rgba(212,175,55,0.25)]'
    : isEmerald
    ? 'shadow-[0_8px_30px_rgba(16,185,129,0.25)]'
    : 'shadow-[0_8px_30px_rgba(139,38,38,0.25)]';

  const iconColor = isGold
    ? 'text-[#F59E0B]'
    : isEmerald
    ? 'text-emerald-400'
    : 'text-[#E53E3E]';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -40, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute top-16 left-4 right-4 z-50 pointer-events-auto"
      >
        <div
          className={`bg-[#0F1A2C]/95 backdrop-blur-xl border ${borderColor} ${glowShadow} rounded-2xl p-3.5 flex items-start gap-3 relative overflow-hidden`}
        >
          {/* Subtle gold line accent at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isGold ? 'bg-[#D4AF37]/15' : isEmerald ? 'bg-emerald-500/15' : 'bg-red-500/15'
            }`}
          >
            {isGold ? (
              <Sparkles className={`w-5 h-5 ${iconColor}`} />
            ) : isEmerald ? (
              <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${iconColor}`} />
            )}
          </div>

          <div className="flex-1 min-w-0 pr-5">
            <h4 className="text-xs font-bold text-amber-100 tracking-wide flex items-center gap-1.5 font-heritage">
              {toast.title}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">
              {toast.description}
            </p>
          </div>

          <button
            onClick={hideToast}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
