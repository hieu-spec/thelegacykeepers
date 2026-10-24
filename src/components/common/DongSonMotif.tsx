import React from 'react';

interface DongSonMotifProps {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}

export const DongSonSun: React.FC<DongSonMotifProps> = ({
  className = '',
  size = 280,
  opacity = 0.12,
  color = '#D4AF37',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      {/* Center 14-point Sun Star of Dong Son Drum */}
      <circle cx="100" cy="100" r="16" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.2" />
      <circle cx="100" cy="100" r="8" fill={color} fillOpacity="0.4" />
      
      {/* Sun rays */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i * 360) / 14;
        const rad = (angle * Math.PI) / 180;
        const x1 = (100 + 16 * Math.cos(rad)).toFixed(4);
        const y1 = (100 + 16 * Math.sin(rad)).toFixed(4);
        const x2 = (100 + 36 * Math.cos(rad)).toFixed(4);
        const y2 = (100 + 36 * Math.sin(rad)).toFixed(4);
        const tipAngle = ((angle + 360 / 28) * Math.PI) / 180;
        const xTip = (100 + 26 * Math.cos(tipAngle)).toFixed(4);
        const yTip = (100 + 26 * Math.sin(tipAngle)).toFixed(4);

        return (
          <path
            key={i}
            d={`M${x1} ${y1} L${x2} ${y2} L${xTip} ${yTip} Z`}
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="0.8"
            suppressHydrationWarning
          />
        );
      })}

      {/* Concentric rings with ancient Vietnamese geometric patterns */}
      <circle cx="100" cy="100" r="42" stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
      <circle cx="100" cy="100" r="46" stroke={color} strokeWidth="0.8" />
      <circle cx="100" cy="100" r="58" stroke={color} strokeWidth="1.5" />

      {/* Decorative dots circle */}
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i * 360) / 28;
        const rad = (angle * Math.PI) / 180;
        const cx = (100 + 52 * Math.cos(rad)).toFixed(4);
        const cy = (100 + 52 * Math.sin(rad)).toFixed(4);
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.2"
            fill={color}
            suppressHydrationWarning
          />
        );
      })}

      {/* Outer Lac Bird Ring (Chim Lạc bay ngược chiều kim đồng hồ) */}
      <circle cx="100" cy="100" r="76" stroke={color} strokeWidth="1.2" />
      <circle cx="100" cy="100" r="82" stroke={color} strokeWidth="0.6" strokeDasharray="4 3" />
      <circle cx="100" cy="100" r="95" stroke={color} strokeWidth="1.8" />

      {/* Lac Bird Silhouettes (4 Birds in flight) */}
      {[0, 90, 180, 270].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 100 100)`}>
          <path
            d="M100 24 C106 20 114 21 118 25 C113 28 108 29 104 29 C96 29 88 26 84 22 C90 23 96 24 100 24 Z"
            fill={color}
            fillOpacity="0.4"
          />
          <path
            d="M104 29 C110 32 118 31 122 28 C115 32 107 33 100 32 Z"
            fill={color}
            fillOpacity="0.3"
          />
        </g>
      ))}
    </svg>
  );
};

export const AncientCloudMotif: React.FC<{ className?: string; color?: string; opacity?: number }> = ({
  className = '',
  color = '#D4AF37',
  opacity = 0.2,
}) => {
  return (
    <svg
      width="90"
      height="35"
      viewBox="0 0 90 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <path
        d="M10 25 C5 25 2 21 4 17 C6 13 11 12 14 14 C17 8 26 7 30 12 C34 9 42 10 44 15 C48 13 54 14 56 18 C60 16 66 18 68 22 C70 20 74 20 76 22 C80 21 85 24 84 28 C83 31 79 33 75 33 L15 33 C10 33 8 28 10 25 Z"
        stroke={color}
        strokeWidth="1.2"
        fill={color}
        fillOpacity="0.1"
      />
      <path
        d="M20 28 C25 24 35 24 40 28"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
};
