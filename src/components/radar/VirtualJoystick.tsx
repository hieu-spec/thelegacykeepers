'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Navigation, Compass } from 'lucide-react';

interface JoystickProps {
  onMove: (deltaX: number, deltaY: number, angleDegrees: number, intensity: number) => void;
  onStop: () => void;
  className?: string;
}

export const VirtualJoystick: React.FC<JoystickProps> = ({ onMove, onStop, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const maxRadius = 45; // Max distance knob can travel from center

  const animFrameRef = useRef<number | null>(null);
  const moveVectorRef = useRef({ dx: 0, dy: 0, angle: 0, intensity: 0 });

  // Continuous movement loop while dragging
  const updateLoop = useCallback(() => {
    if (isDragging && moveVectorRef.current.intensity > 0.05) {
      onMove(
        moveVectorRef.current.dx,
        moveVectorRef.current.dy,
        moveVectorRef.current.angle,
        moveVectorRef.current.intensity
      );
      animFrameRef.current = requestAnimationFrame(updateLoop);
    }
  }, [isDragging, onMove]);

  useEffect(() => {
    if (isDragging) {
      animFrameRef.current = requestAnimationFrame(updateLoop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      onStop();
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging, updateLoop, onStop]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    moveVectorRef.current = { dx: 0, dy: 0, angle: 0, intensity: 0 };
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rawDx = clientX - centerX;
    const rawDy = clientY - centerY;

    const distance = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
    const clampedDist = Math.min(distance, maxRadius);
    const intensity = Math.min(distance / maxRadius, 1);

    const angleRad = Math.atan2(rawDy, rawDx);
    const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;

    const x = Math.cos(angleRad) * clampedDist;
    const y = Math.sin(angleRad) * clampedDist;

    setKnobPos({ x, y });

    // Normalized directional components (-1 to 1)
    // In map coords: Y is North/South (up is North/positive lat, down is South/negative lat)
    // Screen coords: rawDy down is positive, so screen -rawDy is map North
    const normX = clampedDist > 0 ? (x / maxRadius) : 0;
    const normY = clampedDist > 0 ? (-y / maxRadius) : 0;

    // Map bearing: 0 is North (up), 90 is East (right), 180 is South (down), 270 is West (left)
    const mapBearing = (Math.atan2(normX, normY) * (180 / Math.PI) + 360) % 360;

    moveVectorRef.current = {
      dx: normX,
      dy: normY,
      angle: mapBearing,
      intensity,
    };
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`relative select-none touch-none ${className}`}
      style={{ width: maxRadius * 2 + 20, height: maxRadius * 2 + 20 }}
    >
      {/* Outer Glow & Housing */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className={`w-full h-full rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors relative ${
          isDragging
            ? 'bg-[#0B1422]/90 border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.45)]'
            : 'bg-[#0B1422]/70 border border-[#D4AF37]/40 shadow-lg shadow-black/60 hover:border-[#D4AF37]/80'
        } backdrop-blur-md`}
      >
        {/* Subtle Cardinal Direction Ticks */}
        <span className="absolute top-1 text-[9px] font-bold text-amber-300/60 pointer-events-none">B</span>
        <span className="absolute bottom-1 text-[9px] font-bold text-amber-300/40 pointer-events-none">N</span>
        <span className="absolute left-1.5 text-[9px] font-bold text-amber-300/40 pointer-events-none">T</span>
        <span className="absolute right-1.5 text-[9px] font-bold text-amber-300/40 pointer-events-none">Đ</span>

        {/* Center Crosshair / Radar Rings */}
        <div className="absolute inset-3 rounded-full border border-[#D4AF37]/15 pointer-events-none" />
        <div className="absolute inset-6 rounded-full border border-[#D4AF37]/20 pointer-events-none" />

        {/* Interactive Joystick Knob */}
        <motion.div
          animate={{ x: knobPos.x, y: knobPos.y }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md relative z-10 ${
            isDragging
              ? 'bg-gradient-to-br from-[#FFE082] via-[#D4AF37] to-[#B45309] text-slate-950 shadow-[0_0_15px_rgba(255,224,130,0.8)] scale-105'
              : 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] border border-[#D4AF37]/60 text-[#D4AF37]'
          }`}
        >
          {isDragging ? (
            <Navigation
              className="w-4 h-4 transition-transform duration-75"
              style={{ transform: `rotate(${moveVectorRef.current.angle}deg)` }}
            />
          ) : (
            <Gamepad2 className="w-4 h-4 opacity-75" />
          )}
        </motion.div>
      </div>
    </div>
  );
};
