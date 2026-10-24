'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Volume2, Play, Pause, X, Radio } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const { activeAudioWitness, isPlayingAudio, togglePlayAudio, stopAudio } = useApp();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 98 ? 10 : prev + 1.2));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  if (!activeAudioWitness) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="absolute bottom-20 left-3 right-3 z-40"
      >
        <div className="bg-[#0C1524]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Progress bar line at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-3 mt-0.5">
            {/* Audio Icon with Pulsing Halo */}
            <button
              onClick={() => togglePlayAudio()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/30 shrink-0 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            {/* Info and Waveform */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#D4AF37]/20 text-[#F59E0B] border border-[#D4AF37]/30">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-red-400" />
                  Ký ức Nhân chứng
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeAudioWitness.duration}
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-50 truncate mt-0.5">
                {activeAudioWitness.title}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {activeAudioWitness.speakerName} · {activeAudioWitness.speakerRole}
              </p>
            </div>

            {/* Waveform visualizer bars */}
            <div className="flex items-center gap-0.5 h-5 px-1 shrink-0">
              {[40, 75, 55, 90, 60, 85, 45, 95, 30].map((h, i) => (
                <motion.span
                  key={i}
                  animate={
                    isPlayingAudio
                      ? {
                          height: [`${h * 0.2}%`, `${h}%`, `${h * 0.4}%`],
                        }
                      : { height: '20%' }
                  }
                  transition={{
                    duration: 0.8 + (i % 3) * 0.2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                  className="w-0.5 rounded-full bg-[#D4AF37]"
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={stopAudio}
              className="text-slate-400 hover:text-white p-1 ml-1"
              title="Đóng bản ghi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
