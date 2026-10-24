'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StoryFragment } from '@/types/story';
import {
  Hand,
  Ship,
  Compass,
  Flame,
  BookOpen,
  Globe,
  Scroll,
  Lightbulb,
  Star,
  Shield,
  Zap,
  Flag,
  Home,
  Pickaxe,
  Target,
  Users,
  Mic,
  Award,
  Sparkles,
} from 'lucide-react';

interface FragmentPieceProps {
  fragment: StoryFragment;
  isPlaced?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Hand,
  Ship,
  Compass,
  Flame,
  BookOpen,
  Globe,
  Scroll,
  Lightbulb,
  Star,
  Shield,
  Zap,
  Flag,
  Home,
  Pickaxe,
  Target,
  Users,
  Mic,
  Award,
};

export const FragmentPiece: React.FC<FragmentPieceProps> = ({
  fragment,
  isPlaced = false,
  isSelected = false,
  onClick,
  disabled = false,
}) => {
  const IconComponent = ICON_MAP[fragment.iconName] || Sparkles;

  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
        isSelected
          ? 'bg-[#182C4A] border-[#D4AF37] ring-2 ring-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
          : isPlaced
          ? 'bg-[#101D30] border-[#D4AF37]/50 shadow-md'
          : 'bg-[#0E1A2C]/90 border-slate-800/90 hover:border-[#D4AF37]/50 hover:bg-[#13233B]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Gold Top Accent Line on hover/selection */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      )}

      <div className="flex items-start gap-2.5">
        {/* Fragment Icon Box */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            isSelected
              ? 'bg-[#D4AF37] text-slate-950 border-[#FFE082]'
              : 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30'
          }`}
        >
          <IconComponent className="w-4 h-4 fill-current" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-[#F59E0B] tracking-wide uppercase px-1.5 py-0.2 bg-[#F59E0B]/10 rounded border border-[#F59E0B]/20">
              {fragment.tag}
            </span>
            {fragment.year && (
              <span className="text-[10px] font-mono text-slate-400">
                {fragment.year}
              </span>
            )}
          </div>

          <h5 className="text-xs font-bold text-amber-50 mt-1 line-clamp-1">
            {fragment.title}
          </h5>

          <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
            {fragment.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};
