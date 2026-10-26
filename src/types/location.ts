export type LocationRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'event';

export type LocationContentType = 'landmark' | 'story' | 'witness' | 'battlefield' | 'culture';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WitnessStory {
  id: string;
  title: string; // e.g. "Ký ức Bến cảng 1911"
  memoryFilmTitle?: string; // Tiêu đề thước phim ký ức: "Ngày tôi ra khơi và câu chuyện Bến cảng"
  duration: string; // e.g. "04:15"
  audioUrl?: string;
  speakerName: string;
  speakerRole: string; // e.g. "Cựu chiến binh", "Nhà nghiên cứu Lịch sử"
  speakerAvatar?: string; // Ảnh chân dung nhân chứng / cựu chiến binh
  quote: string; // Trích dẫn lời kể xúc động
  fullStory: string;
  historicalSource: string; // Nguồn tư liệu: "Bảo tàng Hồ Chí Minh", v.v.
  witnessName?: string;
  role?: string;
}

export interface HistoricalLocation {
  id: string;
  name: string;
  subtitle: string;
  categoryTitle: string; // e.g. "Di tích Quốc gia Đặc biệt", "Di tích Lịch sử Cấp Quốc gia"
  address: string;
  coordinates: Coordinates;
  rarity: LocationRarity;
  contentType: LocationContentType;
  discoveryRadius: number; // in km
  interactionRadius: number; // in meters
  historicalPeriod: string; // e.g. "Thời kỳ Kháng chiến chống Pháp (1911)"
  yearEstablished?: string;
  imageUrl: string;
  historicalSummary: string;
  fullDescription: string;
  witnessStory: WitnessStory;
  storyChallengeIds: string[]; // Associated minigame story IDs
  rewardExp: number;
  tags: string[];
  audioUrl?: string;
  region?: string;
  campaign?: string;
  description?: string;
  category?: string;
}

export type HeritageLocation = HistoricalLocation;
