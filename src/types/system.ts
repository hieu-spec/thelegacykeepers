// src/types/system.ts

export type UserRole = 'ADMIN' | 'USER';

export interface UserTitle {
  id: string;
  name: string;
  description: string;
  conditionText: string;
  auraClass: string; // Tailwind gradient/glow class
  badgeColor: string;
}

export interface AccountProfile {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  displayName: string;
  level: number;
  exp: number;
  maxExp: number;
  avatarUrl: string;
  activeTitleId: string;
  unlockedTitleIds: string[];
  discoveredLocationIds: string[];
  visitedVeteranIds: string[];
  completedCampaignIds: string[];
}

export interface VeteranProfile {
  id: string;
  fullName: string;
  rankAndRole: string;      // VD: Đại tá - Trung đội trưởng Xe tăng 390
  birthYear: number;
  hometown: string;
  unit: string;             // Đơn vị chiến đấu
  era: string;              // Thời kỳ hoạt động
  avatarUrl: string;
  videoUrl?: string;        // Link video phỏng vấn (MP4 hoặc YouTube embed)
  audioUrl?: string;        // File ghi âm lời kể
  biography: string;        // Lịch sử hoạt động
  achievements: {
    year: string;
    title: string;
    description: string;
    linkedLocationId?: string; // Liên kết tới Pin trên bản đồ
  }[];
  medals: string[];
  visitAddress?: string;    // Địa chỉ thăm hỏi triên
  coordinates: { lat: number; lng: number };
  tributeCount: number;
  tributes: { user: string; message: string; date: string }[];
}

export interface CustomLocationPin {
  id: string;
  name: string;
  pinType: 'landmark' | 'battlefield' | 'witness' | 'culture' | 'story'; // Loại pin
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'event';        // Mức độ hiếm
  address: string;                                                       // Địa chỉ
  imageUrl: string;                                                      // Ảnh
  content: string;                                                       // Nội dung
  gameLink: string;                                                      // Link/ID tới game
  audioUrl?: string;                                                     // File voice tải lên
  coordinates: { lat: number; lng: number };
  rewardTitleId?: string;
}
