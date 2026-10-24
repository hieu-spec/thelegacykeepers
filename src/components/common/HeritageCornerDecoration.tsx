import React from 'react';

export interface CornerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'all';
  className?: string;
  size?: number;
  color?: string;
}

const SingleCornerSvg: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size: number;
  color: string;
  className?: string;
}> = ({ position, size, color, className = '' }) => {
  const rotation = {
    'top-left': 'rotate(0deg)',
    'top-right': 'rotate(90deg)',
    'bottom-right': 'rotate(180deg)',
    'bottom-left': 'rotate(270deg)',
  }[position];

  return (
    <div
      style={{ transform: rotation }}
      className={`pointer-events-none select-none ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Corner Frame Lines */}
        <path
          d="M4 36 L4 8 C4 5.79 5.79 4 8 4 L36 4"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 26 L8 10 C8 8.9 8.9 8 10 8 L26 8"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.8"
        />

        {/* Traditional Cloud & Dragon Scrollwork motif */}
        <path
          d="M12 16 C16 12 22 14 20 18 C18 22 14 20 16 16 Z"
          fill={color}
          fillOpacity="0.4"
          stroke={color}
          strokeWidth="0.8"
        />
        <path
          d="M16 12 C20 16 22 22 18 20 C14 18 12 14 16 12 Z"
          fill={color}
          fillOpacity="0.3"
          stroke={color}
          strokeWidth="0.8"
        />

        {/* Tiny Jewel dot in corner */}
        <circle cx="8" cy="8" r="2" fill={color} />
        <circle cx="20" cy="4" r="1.2" fill={color} />
        <circle cx="4" cy="20" r="1.2" fill={color} />
      </svg>
    </div>
  );
};

export const HeritageCornerDecoration: React.FC<CornerProps> = ({
  position = 'all',
  className = '',
  size = 32,
  color = '#D4AF37',
}) => {
  if (position === 'all') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div className="absolute top-1 left-1">
          <SingleCornerSvg position="top-left" size={size} color={color} />
        </div>
        <div className="absolute top-1 right-1">
          <SingleCornerSvg position="top-right" size={size} color={color} />
        </div>
        <div className="absolute bottom-1 right-1">
          <SingleCornerSvg position="bottom-right" size={size} color={color} />
        </div>
        <div className="absolute bottom-1 left-1">
          <SingleCornerSvg position="bottom-left" size={size} color={color} />
        </div>
      </div>
    );
  }

  return (
    <SingleCornerSvg
      position={position}
      size={size}
      color={color}
      className={className}
    />
  );
};
