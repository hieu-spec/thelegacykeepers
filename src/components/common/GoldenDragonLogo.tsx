import React from 'react';

interface GoldenDragonLogoProps {
  className?: string;
  size?: number;
}

export const GoldenDragonLogo: React.FC<GoldenDragonLogoProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] ${className}`}
    >
      <defs>
        <linearGradient id="dragonGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
        <linearGradient id="pearlRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#C0392B" />
        </linearGradient>
      </defs>

      {/* Outer Halo Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#dragonGoldGrad)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        opacity="0.7"
      />
      <circle cx="50" cy="50" r="41" stroke="url(#dragonGoldGrad)" strokeWidth="0.8" opacity="0.4" />

      {/* S-shaped Vietnamese Sinuous Dragon Body (Rồng Thời Lý - Thăng Long) */}
      <path
        d="M24 72 C22 58 35 46 45 48 C55 50 62 40 58 30 C55 22 46 22 42 28 C38 34 32 32 32 26 C32 18 42 12 54 14 C66 16 74 26 72 38 C70 52 56 58 50 62 C42 67 36 74 44 80 C52 86 64 82 72 74 C75 71 78 74 76 77 C66 87 50 90 38 84 C30 79 25 75 24 72 Z"
        fill="url(#dragonGoldGrad)"
      />

      {/* Dragon Head Details (Đầu Rồng ngẩng cao bờm lửa) */}
      <path
        d="M62 26 C68 22 74 24 78 28 C74 29 70 30 67 29 C65 33 62 34 58 30 Z"
        fill="url(#dragonGoldGrad)"
      />
      {/* Dragon Horn / Fin */}
      <path
        d="M72 22 C78 18 84 20 86 24 C80 25 76 24 72 22 Z"
        fill="url(#dragonGoldGrad)"
      />
      {/* Flaming Mane */}
      <path
        d="M66 35 C72 38 75 44 74 48 C70 44 68 40 66 35 Z"
        fill="url(#dragonGoldGrad)"
      />

      {/* Dragon Claws (Móng Rồng ngũ trảo) */}
      <path
        d="M48 54 L52 50 M50 55 L55 52 M46 56 L50 56"
        stroke="url(#dragonGoldGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Dragon Pearl (Viên Ngọc Rồng ngậm hào quang) */}
      <circle cx="82" cy="32" r="5.5" fill="url(#pearlRedGrad)" stroke="#FFF176" strokeWidth="1" />
      <circle cx="80.5" cy="30.5" r="1.5" fill="#FFFFFF" />
    </svg>
  );
};
