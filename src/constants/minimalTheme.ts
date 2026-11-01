// src/constants/minimalTheme.ts
export const VIETNAM_GEO_BOUNDS: [[number, number], [number, number]] = [
  [4.0, 100.0],
  [24.5, 118.5],
];

// Sử dụng OpenStreetMap chính thống (KHÔNG BAO GIỜ BỊ LỖI "API KEY REQUIRED")
// Kết hợp class CSS lọc màu sang tông Minimal Light ở component bản đồ
export const SINGLE_MINIMAL_MAP_TILE = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
};

export const V18_PASTEL_RARITY: Record<
  string,
  {
    bgBox: string;
    accentBar: string;
    badgeBg: string;
    iconColor: string;
    pillBg: string;
    pillText: string;
    label: string;
  }
> = {
  legendary: {
    bgBox: 'bg-[#EDE9FE]',
    accentBar: 'bg-[#7C3AED]',
    badgeBg: 'bg-[#18181B]',
    iconColor: 'text-[#5B21B6]',
    pillBg: 'bg-white/80',
    pillText: 'text-[#5B21B6]',
    label: 'Di tích Quốc gia Đặc biệt',
  },
  rare: {
    bgBox: 'bg-[#FCE7F3]',
    accentBar: 'bg-[#DB2777]',
    badgeBg: 'bg-[#18181B]',
    iconColor: 'text-[#9D174D]',
    pillBg: 'bg-white/80',
    pillText: 'text-[#9D174D]',
    label: 'Di tích Lịch sử Cấp Quốc gia',
  },
  uncommon: {
    bgBox: 'bg-[#DCFCE7]',
    accentBar: 'bg-[#10B981]',
    badgeBg: 'bg-[#18181B]',
    iconColor: 'text-[#166534]',
    pillBg: 'bg-white/80',
    pillText: 'text-[#166534]',
    label: 'Chứng tích Chiến dịch',
  },
  common: {
    bgBox: 'bg-[#F1F5F9]',
    accentBar: 'bg-[#64748B]',
    badgeBg: 'bg-[#18181B]',
    iconColor: 'text-[#334155]',
    pillBg: 'bg-white/80',
    pillText: 'text-[#334155]',
    label: 'Địa danh Di sản',
  },
};

export const DIORAMA_PRESETS = [
  { id: 'ben-nha-rong', name: 'Bến Nhà Rồng (TP.HCM)', lat: 10.7683, lng: 106.7068, era: '1911' },
  { id: 'dinh-doc-lap', name: 'Dinh Độc Lập (TP.HCM)', lat: 10.7769, lng: 106.6953, era: '1975' },
  { id: 'ham-biet-dong', name: 'Hầm Biệt Động Sài Gòn', lat: 10.7721, lng: 106.6882, era: '1968' },
  { id: 'hoang-thanh', name: 'Hoàng Thành Thăng Long', lat: 21.0352, lng: 105.8403, era: '1010' },
  { id: 'thanh-co-quang-tri', name: 'Thành Cổ Quảng Trị', lat: 16.7504, lng: 107.1862, era: '1972' },
  { id: 'doi-a1', name: 'Đồi A1 Điện Biên Phủ', lat: 21.3861, lng: 103.0214, era: '1954' },
];
