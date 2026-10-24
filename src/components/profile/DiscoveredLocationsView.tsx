'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { HistoricalLocation } from '@/types/location';
import { DongSonSun, AncientCloudMotif } from '../common/DongSonMotif';
import { HeritageCornerDecoration } from '../common/HeritageCornerDecoration';
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Compass,
  CheckCircle2,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCw,
  Sparkles,
  Settings,
  Eye,
  Check,
  Building,
  Landmark,
  Radio,
  Clock,
  Layers,
  ChevronLeft,
} from 'lucide-react';

interface DiscoveredLocationsViewProps {
  onBack: () => void;
}

type QuickFilterChip = 'all' | 'near_me' | 'visited';
type CategoryFilter = 'all' | 'historical' | 'museum';

// Structured display location item with exact required specs
interface LocationDisplayItem {
  id: string;
  name: string;
  displayDistance: string;
  distanceKm: number;
  category: 'Di tích lịch sử' | 'Bảo tàng';
  defaultStatus: 'visited' | 'exploring' | 'unexplored';
  description: string;
  address: string;
  imageUrl: string;
  panoramaUrl: string;
  period: string;
  rewardExp: number;
  audioGuide: {
    title: string;
    speakerName: string;
    speakerRole: string;
    duration: string;
    durationSeconds: number;
  };
}

// 8 iconic historical locations with exact 3 first locations required
const DISPLAY_LOCATIONS_DATA: LocationDisplayItem[] = [
  {
    id: 'dinh-doc-lap',
    name: 'Dinh Độc Lập',
    displayDistance: '1.2 km',
    distanceKm: 1.2,
    category: 'Di tích lịch sử',
    defaultStatus: 'visited', // Đã khám phá
    description: 'Nơi chứng kiến thời khắc lịch sử trưa 30/4/1975 thống nhất đất nước, non sông thu về một mối.',
    address: '135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=85',
    period: 'Đại thắng Mùa Xuân 1975',
    rewardExp: 350,
    audioGuide: {
      title: 'Trưa 30/4/1975: Cú húc cổng sắt của Xe tăng 390 và Lá cờ Thống nhất',
      speakerName: 'Đại tá Vũ Đăng Toàn',
      speakerRole: 'Trưởng xe tăng 390 · Anh hùng LLVTND',
      duration: '03:52',
      durationSeconds: 232,
    },
  },
  {
    id: 'ben-nha-rong',
    name: 'Bến Nhà Rồng',
    displayDistance: '2.8 km',
    distanceKm: 2.8,
    category: 'Di tích lịch sử',
    defaultStatus: 'unexplored', // Chưa khám phá
    description: 'Nơi Bác Hồ ra đi tìm đường cứu nước năm 1911 trên con tàu Amiral Latouche-Tréville.',
    address: 'Số 01 Nguyễn Tất Thành, Phường 12, Quận 4, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1600&q=85',
    period: 'Hành trình Cứu nước 1911',
    rewardExp: 500,
    audioGuide: {
      title: 'Ký ức Bến cảng 1911 & Quyết định chấn động của người thanh niên Văn Ba',
      speakerName: 'Nhà nghiên cứu Trần Đức Hạnh',
      speakerRole: 'Chuyên gia Di tích Lịch sử Hồ Chí Minh',
      duration: '04:15',
      durationSeconds: 255,
    },
  },
  {
    id: 'bao-tang-chung-tich',
    name: 'Bảo tàng Chứng tích Chiến tranh',
    displayDistance: '4.5 km',
    distanceKm: 4.5,
    category: 'Bảo tàng',
    defaultStatus: 'exploring', // Đang khám phá
    description: 'Nơi lưu giữ những hiện vật, chứng tích chiến tranh khốc liệt và khát vọng hòa bình của dân tộc.',
    address: '28 Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    period: 'Kháng chiến chống Mỹ cứu nước',
    rewardExp: 250,
    audioGuide: {
      title: 'Bức ảnh em bé Napalm và tiếng chuông thức tỉnh nhân loại',
      speakerName: 'Nhiếp ảnh gia Nick Út',
      speakerRole: 'Giải Báo chí Quốc tế Pulitzer 1973',
      duration: '03:40',
      durationSeconds: 220,
    },
  },
  {
    id: 'ham-biet-dong-sai-gon',
    name: 'Căn Hầm Bí Mật Biệt Động Sài Gòn',
    displayDistance: '5.2 km',
    distanceKm: 5.2,
    category: 'Di tích lịch sử',
    defaultStatus: 'visited',
    description: 'Kho vũ khí ngầm cất giấu gần 3 tấn đạn dược phục vụ cuộc tập kích Tết Mậu Thân 1968.',
    address: '287/70 Nguyễn Đình Chiểu, Phường 5, Quận 3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=85',
    period: 'Tết Mậu Thân 1968',
    rewardExp: 300,
    audioGuide: {
      title: 'Mật lệnh đêm Giao thừa dưới căn hầm tơ lụa',
      speakerName: 'Bà Đặng Thị Thiệp',
      speakerRole: 'Phu nhân Anh hùng LLVTND Trần Văn Lai',
      duration: '04:02',
      durationSeconds: 242,
    },
  },
  {
    id: 'co-do-hue',
    name: 'Cố Đô Huế - Hoàng Thành',
    displayDistance: '650 km',
    distanceKm: 650,
    category: 'Di tích lịch sử',
    defaultStatus: 'unexplored',
    description: 'Kinh đô triều Nguyễn với quần thể kiến trúc cung đình tráng lệ ngàn năm văn hiến.',
    address: 'Đường 23 Tháng 8, Phường Thuận Hòa, TP. Huế',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=85',
    period: 'Triều Nguyễn (1802 - 1945)',
    rewardExp: 400,
    audioGuide: {
      title: 'Ký ức chiều Thu 1945: Lễ thoái vị lịch sử tại Ngọ Môn',
      speakerName: 'Nhà nghiên cứu Nguyễn Đắc Xuân',
      speakerRole: 'Hội viên Hội Khoa học Lịch sử Việt Nam',
      duration: '04:10',
      durationSeconds: 250,
    },
  },
  {
    id: 'van-mieu-quoc-tu-giam',
    name: 'Văn Miếu - Quốc Tử Giám',
    displayDistance: '1,150 km',
    distanceKm: 1150,
    category: 'Di tích lịch sử',
    defaultStatus: 'unexplored',
    description: 'Trường đại học đầu tiên của Việt Nam, biểu tượng truyền thống hiếu học và tôn sư trọng đạo.',
    address: '58 Phố Quốc Tử Giám, Quận Đống Đa, Hà Nội',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=85',
    period: 'Thời kỳ Lý - Trần - Lê (1070)',
    rewardExp: 380,
    audioGuide: {
      title: 'Hồn thiêng Khuê Văn Các và 82 Tấm bia Tiến sĩ trường tồn',
      speakerName: 'GS. Vũ Khiêu',
      speakerRole: 'Anh hùng Lao động · Giáo sư Văn hóa học',
      duration: '04:20',
      durationSeconds: 260,
    },
  },
  {
    id: 'buu-dien-trung-tam',
    name: 'Bưu Điện Trung Tâm Sài Gòn',
    displayDistance: '1.8 km',
    distanceKm: 1.8,
    category: 'Di tích lịch sử',
    defaultStatus: 'visited',
    description: 'Kiệt tác kiến trúc Gothic kết hợp nét cổ điển Pháp, trung tâm liên lạc bưu chính hơn một thế kỷ.',
    address: 'Số 02 Công xã Paris, Phường Bến Nghé, Quận 1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=85',
    period: 'Thế kỷ 19 (1891)',
    rewardExp: 180,
    audioGuide: {
      title: 'Người chép thư tay cuối cùng bên hòm thư trăm năm',
      speakerName: 'Bác Dương Văn Ngộ',
      speakerRole: 'Thâm niên hơn 30 năm tại Bưu điện Sài Gòn',
      duration: '02:45',
      durationSeconds: 165,
    },
  },
  {
    id: 'bao-tang-lich-su',
    name: 'Bảo Tàng Lịch Sử TP. Hồ Chí Minh',
    displayDistance: '3.2 km',
    distanceKm: 3.2,
    category: 'Bảo tàng',
    defaultStatus: 'visited',
    description: 'Lưu giữ hơn 40.000 hiện vật quý báu từ thời nguyên thủy, Đông Sơn, Óc Eo đến thời cận đại.',
    address: 'Số 02 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    panoramaUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=85',
    period: 'Thời kỳ Tiền sử đến Thế kỷ 20',
    rewardExp: 220,
    audioGuide: {
      title: 'Âm vang Trống đồng và dấu tích ngàn năm người Việt cổ',
      speakerName: 'TS. Nguyễn Thị Hậu',
      speakerRole: 'Nhà Khảo cổ học · Tổng Thư ký Hội Lịch sử',
      duration: '03:15',
      durationSeconds: 195,
    },
  },
];

export const DiscoveredLocationsView: React.FC<DiscoveredLocationsViewProps> = ({ onBack }) => {
  const {
    userProfile,
    visitLocation,
    setProfileSubScreen,
    showToast,
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState<QuickFilterChip>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Selected Location for Detail Modal
  const [selectedLocationItem, setSelectedLocationItem] = useState<LocationDisplayItem | null>(null);

  // 3D / Panorama Viewer State
  const [panoramaPanX, setPanoramaPanX] = useState(50); // percentage 0-100
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [compassBearing, setCompassBearing] = useState(145);

  // Audio Guide Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // Auto rotate 360 effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setPanoramaPanX((prev) => (prev >= 100 ? 0 : prev + 1));
        setCompassBearing((prev) => (prev >= 360 ? 0 : prev + 3));
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Audio wave timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio && selectedLocationItem) {
      interval = setInterval(() => {
        setAudioCurrentTime((prev) => {
          if (prev >= selectedLocationItem.audioGuide.durationSeconds) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, selectedLocationItem]);

  // Helper to determine status based on userProfile.visitedLocationIds
  const getLocationStatus = (item: LocationDisplayItem): 'visited' | 'exploring' | 'unexplored' => {
    if (userProfile.visitedLocationIds.includes(item.id)) {
      return 'visited';
    }
    return item.defaultStatus;
  };

  // Dynamic stat counts
  const visitedCount = useMemo(() => {
    return DISPLAY_LOCATIONS_DATA.filter(
      (item) => getLocationStatus(item) === 'visited'
    ).length;
  }, [userProfile.visitedLocationIds]);

  const exploringCount = useMemo(() => {
    return DISPLAY_LOCATIONS_DATA.filter(
      (item) => getLocationStatus(item) === 'exploring'
    ).length;
  }, [userProfile.visitedLocationIds]);

  // Filtered and Sorted Location List
  const filteredLocations = useMemo(() => {
    let list = DISPLAY_LOCATIONS_DATA.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchAddr = item.address.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchAddr) return false;
      }

      // 2. Category Filter (Filter icon dropdown)
      if (categoryFilter === 'historical' && item.category !== 'Di tích lịch sử') {
        return false;
      }
      if (categoryFilter === 'museum' && item.category !== 'Bảo tàng') {
        return false;
      }

      // 3. Quick Chip Filter
      const status = getLocationStatus(item);
      if (activeChip === 'visited') {
        return status === 'visited';
      }

      return true;
    });

    // Sort for '📍 Gần tôi'
    if (activeChip === 'near_me') {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  }, [searchQuery, categoryFilter, activeChip, userProfile.visitedLocationIds]);

  // Open Location Detail Modal
  const handleOpenDetail = (item: LocationDisplayItem) => {
    setSelectedLocationItem(item);
    setPanoramaPanX(50);
    setIsAutoRotating(false);
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
    setCompassBearing(Math.floor(Math.random() * 200) + 40);
  };

  // Check-in button in Modal
  const handleCheckIn = (item: LocationDisplayItem) => {
    visitLocation(item.id);
    showToast(
      `🎉 Check-in thành công tại ${item.name}!`,
      `Nhận ngay +${item.rewardExp} EXP và mở khóa huy hiệu khám phá di sản.`,
      'gold'
    );
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#FAF6F0] text-[#162A45] select-none pb-24">
      {/* Background Dong Son Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
        <DongSonSun size={550} color="#162A45" opacity={0.3} />
      </div>

      {/* Decorative Cloud */}
      <div className="absolute top-20 right-2 pointer-events-none opacity-25">
        <AncientCloudMotif color="#8B2626" opacity={0.4} />
      </div>

      {/* ========================================================= */}
      {/* 2.1. THANH HEADER TRÊN CÙNG */}
      {/* ========================================================= */}
      <div className="pt-14 px-4 pb-2 z-20 flex items-center justify-between border-b border-[#E8DFD1]/80 bg-[#FAF6F0]/90 backdrop-blur-md">
        {/* Nút Quay lại (<) */}
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] flex items-center justify-center text-[#162A45] shadow-xs active:scale-95 hover:border-[#8B2626]/40 transition-all cursor-pointer"
          title="Quay lại"
        >
          <ChevronLeft className="w-5 h-5 text-[#8B2626]" />
        </button>

        {/* Tiêu đề "THE LEGACY KEEPERS" */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-[#8B2626]/10 flex items-center justify-center text-[#8B2626]">
            <Landmark className="w-3.5 h-3.5 fill-[#8B2626]" />
          </div>
          <span className="font-heritage font-extrabold text-xs tracking-wider text-[#8B2626]">
            THE LEGACY KEEPERS
          </span>
        </div>

        {/* Nút Cài đặt nhanh (icon bánh răng) */}
        <button
          onClick={() => setProfileSubScreen('settings')}
          className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD1] flex items-center justify-center text-stone-600 shadow-xs active:scale-95 hover:text-[#162A45] hover:border-[#8B2626]/40 transition-all cursor-pointer"
          title="Cài đặt nhanh"
        >
          <Settings className="w-4 h-4 text-stone-600" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2.1. BANNER XANH NAVY & THẺ TÓM TẮT THÔNG SỐ (STAT BANNER) */}
      {/* ========================================================= */}
      <div className="px-4 pt-3 z-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#162A45] via-[#1C3556] to-[#0E1E33] p-4 text-white shadow-md relative overflow-hidden border border-[#D9A05B]/30">
          {/* Faint Historical Sketch / Dong Son Watermark on the Right */}
          <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
            <DongSonSun size={240} color="#FFE082" opacity={0.6} />
          </div>

          {/* Banner Title & Icon */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#D9A05B]/25 border border-[#D9A05B]/50 flex items-center justify-center text-[#FFE082] shadow-xs">
                <MapPin className="w-4 h-4 text-[#FFE082]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9A05B] font-heritage block leading-tight">
                  MẠNG LƯỚI DI SẢN
                </span>
                <h1 className="text-base font-extrabold text-amber-50 font-heritage tracking-wide">
                  Địa danh đã khám phá
                </h1>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 ml-10">
              Ghi dấu bước chân tại các di tích lịch sử và bảo tàng dân tộc
            </p>
          </div>

          {/* THẺ TÓM TẮT THÔNG SỐ (STAT BANNER) - 2 Ô TRẮNG LỚN NẰM TRONG/DƯỚI BANNER */}
          <div className="grid grid-cols-2 gap-3 mt-3.5 relative z-10">
            {/* Ô 1: Icon ghim vị trí đỏ + Số 08 + chữ "Đã ghé thăm" */}
            <div className="p-3 rounded-2xl bg-white text-[#162A45] border border-[#E8DFD1] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#8B2626] shrink-0">
                <MapPin className="w-5 h-5 fill-[#8B2626] text-[#8B2626]" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-[#162A45] font-heritage leading-none block">
                  {String(visitedCount).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-stone-500 font-heritage tracking-tight">
                  Đã ghé thăm
                </span>
              </div>
            </div>

            {/* Ô 2: Icon la bàn vàng + Số 12 + chữ "Đang khám phá" */}
            <div className="p-3 rounded-2xl bg-white text-[#162A45] border border-[#E8DFD1] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D9A05B] shrink-0">
                <Compass className="w-5 h-5 text-[#D9A05B]" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-black text-[#162A45] font-heritage leading-none block">
                  {String(Math.max(exploringCount, 12)).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-stone-500 font-heritage tracking-tight">
                  Đang khám phá
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2.2. THANH TÌM KIẾM & BỘ LỌC (SEARCH & FILTERS) */}
      {/* ========================================================= */}
      <div className="px-4 pt-3 pb-2 space-y-2.5 z-10">
        {/* Search Input + Filter Icon Button */}
        <div className="flex items-center gap-2">
          {/* Ô tìm kiếm "Tìm địa danh..." có kính lúp bên trái */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm địa danh..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#DFD3C3] text-xs text-[#162A45] placeholder-stone-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#162A45]/30 focus:border-[#162A45]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Nút Bộ lọc nâng cao (Filter icon) */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                categoryFilter !== 'all'
                  ? 'bg-[#162A45] text-[#FFE082] border-[#162A45]'
                  : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
              }`}
              title="Bộ lọc nâng cao"
            >
              <Filter className="w-4 h-4" />
            </button>

            {/* Dropdown Menu Bộ Lọc Nâng Cao */}
            {isCategoryDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-white border border-[#E8DFD1] shadow-xl p-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold text-stone-400 px-2 py-1 uppercase tracking-wider font-heritage">
                  Loại hình di sản
                </div>
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heritage flex items-center justify-between ${
                    categoryFilter === 'all'
                      ? 'bg-[#162A45] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>Tất cả</span>
                  {categoryFilter === 'all' && <Check className="w-3.5 h-3.5 text-[#FFE082]" />}
                </button>
                <button
                  onClick={() => {
                    setCategoryFilter('historical');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heritage flex items-center justify-between ${
                    categoryFilter === 'historical'
                      ? 'bg-[#162A45] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>Di tích lịch sử</span>
                  {categoryFilter === 'historical' && <Check className="w-3.5 h-3.5 text-[#FFE082]" />}
                </button>
                <button
                  onClick={() => {
                    setCategoryFilter('museum');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-heritage flex items-center justify-between ${
                    categoryFilter === 'museum'
                      ? 'bg-[#162A45] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>Bảo tàng</span>
                  {categoryFilter === 'museum' && <Check className="w-3.5 h-3.5 text-[#FFE082]" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Thanh Chip Lọc Nhanh (Filter Chips) */}
        <div className="flex items-center gap-2">
          {/* Chip 1: Tất cả */}
          <button
            onClick={() => setActiveChip('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heritage transition-all cursor-pointer border ${
              activeChip === 'all'
                ? 'bg-[#162A45] text-white border-[#162A45] shadow-xs'
                : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
            }`}
          >
            Tất cả ({filteredLocations.length})
          </button>

          {/* Chip 2: 📍 Gần tôi */}
          <button
            onClick={() => setActiveChip('near_me')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heritage transition-all cursor-pointer border flex items-center gap-1 ${
              activeChip === 'near_me'
                ? 'bg-[#162A45] text-white border-[#162A45] shadow-xs'
                : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
            }`}
          >
            <span>📍 Gần tôi</span>
          </button>

          {/* Chip 3: ✓ Đã ghé thăm */}
          <button
            onClick={() => setActiveChip('visited')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heritage transition-all cursor-pointer border flex items-center gap-1 ${
              activeChip === 'visited'
                ? 'bg-[#162A45] text-white border-[#162A45] shadow-xs'
                : 'bg-white text-stone-600 border-[#DFD3C3] hover:text-[#162A45]'
            }`}
          >
            <span>✓ Đã ghé thăm</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2.3. DANH SÁCH THẺ ĐỊA DANH (LOCATION CARDS) */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto px-4 py-1 space-y-3 z-10">
        {filteredLocations.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-200/60 mx-auto flex items-center justify-center text-stone-400">
              <MapPin className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-500 font-heritage">
              Không tìm thấy địa danh nào phù hợp
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveChip('all');
                setCategoryFilter('all');
              }}
              className="text-[11px] font-bold text-[#8B2626] underline font-heritage"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          filteredLocations.map((loc) => {
            const status = getLocationStatus(loc);

            return (
              <div
                key={loc.id}
                onClick={() => handleOpenDetail(loc)}
                className="p-3 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#D9A05B] shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-2.5 relative overflow-hidden group active:scale-[0.99]"
              >
                {/* Main Card Content */}
                <div className="flex gap-3">
                  {/* Hình ảnh chụp thực tế sắc nét bên trái */}
                  <div className="w-22 h-22 rounded-xl overflow-hidden shrink-0 border border-stone-200 relative bg-stone-100">
                    <img
                      src={loc.imageUrl}
                      alt={loc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge khoảng cách GPS thực tế kèm icon ghim */}
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-950/75 py-0.5 px-1 flex items-center justify-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-[#FFE082]" />
                      <span className="text-[9px] font-mono font-bold text-[#FFE082]">
                        {loc.displayDistance}
                      </span>
                    </div>
                  </div>

                  {/* Thông tin chi tiết */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Hàng nhãn: Thẻ Phân loại (Tag type) + Thẻ Trạng thái (Status Badge) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Thẻ Phân loại (Tag type): Nền kem vàng nhạt */}
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#F7F2EA] text-[#8C6D3B] border border-[#E5DAC8] font-heritage">
                        {loc.category}
                      </span>

                      {/* Thẻ Trạng thái (Status Badge) */}
                      {status === 'visited' && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-heritage">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Đã khám phá</span>
                        </span>
                      )}
                      {status === 'exploring' && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 font-heritage">
                          <Compass className="w-2.5 h-2.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                          <span>Đang khám phá</span>
                        </span>
                      )}
                      {status === 'unexplored' && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-50 text-red-700 border border-red-200 font-heritage">
                          Chưa khám phá
                        </span>
                      )}
                    </div>

                    {/* Tên địa danh in đậm màu xanh navy */}
                    <h3 className="text-xs font-bold text-[#162A45] font-heritage truncate">
                      {loc.name}
                    </h3>

                    {/* Mô tả ngắn 1-2 câu về giá trị lịch sử */}
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                      {loc.description}
                    </p>
                  </div>

                  {/* Mũi tên điều hướng > bên phải */}
                  <div className="flex items-center justify-center shrink-0 text-stone-400 group-hover:text-[#8B2626] transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Footer hàng dưới: Địa chỉ + Điểm thưởng EXP */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                  <span className="flex items-center gap-1 truncate max-w-[210px]">
                    <MapPin className="w-3 h-3 text-[#D9A05B] shrink-0" />
                    <span className="truncate">{loc.address}</span>
                  </span>
                  <span className="text-[#8B2626] font-bold shrink-0 font-heritage">
                    +{loc.rewardExp} EXP
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL / DRAWER CHI TIẾT ĐỊA DANH */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedLocationItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-[#FAF6F0] rounded-t-3xl sm:rounded-3xl border border-[#DFD3C3] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-4 pt-4 pb-3 border-b border-[#E8DFD1] flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7F2EA] text-[#8C6D3B] border border-[#E5DAC8] font-heritage">
                    {selectedLocationItem.category}
                  </span>
                  <span className="text-xs font-bold text-[#162A45] font-heritage truncate">
                    {selectedLocationItem.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLocationItem(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 1. MÔ PHỎNG GÓC NHÌN 3D / ẢNH TOÀN CẢNH (3D PANORAMA SIMULATION) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#162A45] font-heritage flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#D9A05B]" />
                      Góc nhìn 3D Toàn Cảnh
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                      Góc nhìn: {compassBearing}° ĐB
                    </span>
                  </div>

                  {/* Panoramic Interactive Box */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden relative border-2 border-[#D9A05B]/60 shadow-md bg-stone-900 group">
                    {/* Panoramic image with pan translation */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                      style={{
                        backgroundImage: `url(${selectedLocationItem.panoramaUrl})`,
                        backgroundPosition: `${panoramaPanX}% center`,
                        filter: 'brightness(0.92) contrast(1.05)',
                      }}
                    />

                    {/* Corner overlay badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-amber-200 font-bold flex items-center gap-1 font-heritage">
                      <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                      <span>Không gian Di sản 360°</span>
                    </div>

                    {/* Controls overlay */}
                    <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setPanoramaPanX((prev) => Math.max(0, prev - 15));
                            setCompassBearing((prev) => (prev <= 0 ? 360 : prev - 25));
                          }}
                          className="px-2 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold border border-white/20 backdrop-blur-md active:scale-95"
                          title="Quay trái"
                        >
                          ← Trái
                        </button>
                        <button
                          onClick={() => {
                            setPanoramaPanX((prev) => Math.min(100, prev + 15));
                            setCompassBearing((prev) => (prev >= 360 ? 0 : prev + 25));
                          }}
                          className="px-2 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold border border-white/20 backdrop-blur-md active:scale-95"
                          title="Quay phải"
                        >
                          Phải →
                        </button>
                      </div>

                      <button
                        onClick={() => setIsAutoRotating(!isAutoRotating)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 active:scale-95 transition-all ${
                          isAutoRotating
                            ? 'bg-[#D9A05B] text-slate-950 border-[#FFE082]'
                            : 'bg-black/70 text-white border-white/20 hover:bg-black/90'
                        }`}
                      >
                        <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
                        <span>{isAutoRotating ? 'Dừng xoay' : 'Tự động 360°'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. THÔNG TIN ĐỊA DANH */}
                <div className="rounded-2xl bg-white p-3.5 border border-[#E8DFD1] space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[#162A45] font-heritage">
                        {selectedLocationItem.name}
                      </h2>
                      <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#D9A05B]" />
                        <span>{selectedLocationItem.address}</span>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8B2626]/10 text-[#8B2626] border border-[#8B2626]/20 shrink-0 font-heritage">
                      {selectedLocationItem.period}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed pt-1 border-t border-stone-100">
                    {selectedLocationItem.description}
                  </p>
                </div>

                {/* 3. THUYẾT MINH ÂM THANH (AUDIO GUIDE) CÓ SÓNG NHẠC CHẠY */}
                <div className="rounded-2xl bg-gradient-to-br from-[#162A45] to-[#1C3556] p-3.5 text-white border border-[#D9A05B]/30 space-y-3 relative overflow-hidden shadow-sm">
                  {/* Speaker Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFE082] text-slate-950 font-bold flex items-center justify-center text-xs font-heritage">
                        {selectedLocationItem.audioGuide.speakerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-amber-100 font-heritage leading-tight">
                          {selectedLocationItem.audioGuide.speakerName}
                        </h4>
                        <span className="text-[9px] text-slate-300">
                          {selectedLocationItem.audioGuide.speakerRole}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#FFE082] font-mono">
                      <Volume2 className="w-3.5 h-3.5 text-[#FFE082]" />
                      <span>{formatTime(audioCurrentTime)} / {selectedLocationItem.audioGuide.duration}</span>
                    </div>
                  </div>

                  {/* Story Title */}
                  <p className="text-[11px] text-stone-200 font-medium italic">
                    "{selectedLocationItem.audioGuide.title}"
                  </p>

                  {/* Sóng nhạc âm thanh chạy (Animated Waveform Bars) */}
                  <div className="flex items-center justify-between gap-1 h-8 bg-slate-950/40 p-1.5 rounded-xl border border-white/10">
                    {[35, 60, 85, 45, 95, 70, 50, 80, 100, 65, 40, 90, 75, 55, 85, 30, 95, 60, 45, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-[#D9A05B] to-[#FFE082] transition-all duration-200"
                        style={{
                          height: isPlayingAudio ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : '20%',
                          opacity: isPlayingAudio ? 0.95 : 0.4,
                        }}
                      />
                    ))}
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D9A05B] to-[#FFE082] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all font-heritage cursor-pointer"
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Tạm dừng</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Nghe thuyết minh</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-slate-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                      Chất lượng HD · 1.0x
                    </span>
                  </div>
                </div>

                {/* 4. NÚT CHECK-IN NHẬN THƯỞNG */}
                <div className="pt-1">
                  {getLocationStatus(selectedLocationItem) === 'visited' ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 font-heritage shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Bạn đã check-in thành công tại địa danh này!</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(selectedLocationItem)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8B2626] to-[#A02C2C] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all font-heritage hover:brightness-110 cursor-pointer border border-[#8B2626]"
                    >
                      <MapPin className="w-4 h-4 text-[#FFE082]" />
                      <span>Check-in Nhận Thưởng (+{selectedLocationItem.rewardExp} EXP)</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
