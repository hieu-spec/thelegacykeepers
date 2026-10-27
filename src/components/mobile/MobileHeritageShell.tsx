// src/components/mobile/MobileHeritageShell.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  ScanEye,
  BookOpen,
  Flame,
  UserCheck,
  Navigation,
  Pause,
  Play,
  X,
  Shield,
  Sparkles,
  Monitor,
} from 'lucide-react';
import { HeritageMapLocation } from './MobileSatelliteMap';
import { PokemonGoHeritageMap } from './PokemonGoHeritageMap';
import { PokemonGoARScanner } from './PokemonGoARScanner';
import { WartimeLetterModal } from './WartimeLetterModal';
import { MobileStorytellerTab } from './MobileStorytellerTab';
import { MobileVeteransTab } from './MobileVeteransTab';
import { MobileProfileTab, UserProfileData } from './MobileProfileTab';
import { AdminLandmarkLogoModal } from '../admin/AdminLandmarkLogoModal';
import { IOSOnboardingSheet } from '../ios/IOSOnboardingSheet';
import { triggerIOSHaptic } from '@/utils/iosBridge';
import { useHeritageTTS } from '@/hooks/useHeritageTTS';
import { calculateDistance, calculateBearing } from '@/utils/geo';
import { SpawnedLootItem, WartimeArtifact, tryRollLootDrop } from '@/data/wartimeLoot';

export interface HeritageLocationItem extends HeritageMapLocation {
  distanceMeters: number;
}

const INITIAL_LOCATIONS: HeritageMapLocation[] = [
  {
    id: 'ben-nha-rong',
    name: 'Bến Nhà Rồng',
    era: '05/06/1911 • Khởi nguồn Hành trình Cứu nước',
    rarity: 'legendary',
    contentType: 'landmark',
    coordinates: { lat: 10.7683, lng: 106.7068 },
    defaultEmblemEmoji: '🐉',
    summary: 'Nơi người thanh niên Nguyễn Tất Thành lên tàu ra đi tìm đường cứu nước.',
    witnessName: 'Cụ Hoàng Văn Thụ (Nhân chứng Bến Cảng)',
    witnessRole: 'Công nhân bến tàu Sài Gòn xưa',
    witnessTranscript:
      'Ngày hôm ấy sóng sông Sài Gòn vỗ mạnh, ánh mắt người thanh niên trẻ nhìn về phía đất liền đầy kiên định trước lúc con tàu kéo còi rời bến.',
  },
  {
    id: 'dinh-doc-lap',
    name: 'Dinh Độc Lập',
    era: '30/04/1975 • Thời khắc Thống nhất',
    rarity: 'legendary',
    contentType: 'battlefield',
    coordinates: { lat: 10.7769, lng: 106.6953 },
    defaultEmblemEmoji: '🏛️',
    summary: 'Di tích quốc gia đặc biệt đánh dấu thời khắc xe tăng tiến vào trưa 30/4/1975.',
    witnessName: 'Đại tá Bùi Quang Thận',
    witnessRole: 'Đại đội trưởng Xe tăng 843',
    witnessTranscript:
      'Khi lá cờ Giải phóng tung bay trên nóc Dinh lúc 11 giờ 30 phút, cả dân tộc vỡ òa trong giọt nước mắt đoàn tụ Bắc Nam một nhà.',
  },
  {
    id: 'ham-biet-dong',
    name: 'Hầm Biệt Động Sài Gòn',
    era: '1968 • Mậu Thân Tuyệt Mật',
    rarity: 'rare',
    contentType: 'witness',
    coordinates: { lat: 10.7745, lng: 106.6881 },
    defaultEmblemEmoji: '⚔️',
    summary: 'Căn hầm bí mật chứa gần 3 tấn vũ khí nằm ngay giữa lòng đô thị.',
    witnessName: 'Anh hùng Trần Văn Lai (Năm Lai)',
    witnessRole: 'Chiến sĩ Biệt động Sài Gòn',
    witnessTranscript:
      'Từng viên gạch, từng giỏ đất được đào lên trong đêm tối suốt nhiều năm trời với niềm tin sắt đá vào ngày toàn thắng.',
  },
];

export const MobileHeritageShell: React.FC<{
  isSimulatorFrame?: boolean;
  onExitSimulator?: () => void;
}> = ({ isSimulatorFrame = false, onExitSimulator }) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'story' | 'ar' | 'veterans' | 'profile'>('radar');
  const [locations, setLocations] = useState<HeritageMapLocation[]>(INITIAL_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<HeritageMapLocation>(INITIAL_LOCATIONS[0]);
  const [userGps, setUserGps] = useState({ lat: 10.7675, lng: 106.7061 });
  const [playerHeading, setPlayerHeading] = useState(45);
  const [isMoving, setIsMoving] = useState(false);
  const [showSimJoystick, setShowSimJoystick] = useState(true);
  const [voiceNavEnabled, setVoiceNavEnabled] = useState(true);

  // Hệ thống Vật phẩm Thời chiến rớt trên đường (Pokémon GO Loot Drop)
  const [spawnedLoots, setSpawnedLoots] = useState<SpawnedLootItem[]>([]);
  const [openedArtifact, setOpenedArtifact] = useState<WartimeArtifact | null>(null);
  const [lootBannerAlert, setLootBannerAlert] = useState<string | null>(null);

  // Quyền Admin & Modal đổi Logo
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingLogoLoc, setEditingLogoLoc] = useState<HeritageMapLocation | null>(null);

  // Bộ phát Giọng nói TTS & Dẫn đường Google Maps
  const { activeTrack, isPlaying, speakTrack, togglePlayPause, closeTrack } = useHeritageTTS();

  const [profile, setProfile] = useState<UserProfileData>({
    displayName: 'Lê Toàn Hiếu',
    bioNote: 'Tự hào gìn giữ ký ức lịch sử hào hùng của dân tộc Việt Nam.',
    titleEquipped: 'Sứ Giả Ký Ức Đông Sơn',
    companion: 'pikachu',
    collectedLocationIds: ['ben-nha-rong'],
    unlockedTitles: [
      { id: 't1', name: 'Sứ Giả Ký Ức Đông Sơn', desc: 'Khởi đầu hành trình di sản', icon: '🥁', date: '2026' },
      { id: 't2', name: 'Người Giữ Thư Thời Chiến', desc: 'Thu thập kỷ vật rơi trên đường', icon: '✉️', date: '2026' },
    ],
    journeyLogs: [
      { id: 'j1', locationName: 'Bến Nhà Rồng', action: 'Khởi hành tìm kiếm kỷ vật', timestamp: 'Hôm nay' },
    ],
  });

  // Khởi tạo sẵn 1 Bức thư thời chiến gần vị trí xuất phát để người dùng thấy ngay
  useEffect(() => {
    const initialDrop = tryRollLootDrop(userGps, true);
    if (initialDrop) setSpawnedLoots([initialDrop]);
  }, []);

  const updateProfile = (next: UserProfileData) => {
    setProfile(next);
    localStorage.setItem('lk_mobile_profile_v3', JSON.stringify(next));
  };

  // Hàm xử lý bước đi (Tự động đọc chỉ dẫn Google Maps + Tính tỉ lệ rớt Bức thư thời chiến)
  const handleStepWalk = useCallback(
    (dLat: number, dLng: number, newHeading: number) => {
      setIsMoving(true);
      setPlayerHeading(newHeading);

      const nextGps = {
        lat: Number((userGps.lat + dLat).toFixed(6)),
        lng: Number((userGps.lng + dLng).toFixed(6)),
      };
      setUserGps(nextGps);

      // 1. Kiểm tra tỉ lệ rớt "Bức thư thời chiến" trên đường (38% mỗi bước đi)
      const dropped = tryRollLootDrop(nextGps, false);
      if (dropped) {
        setSpawnedLoots((prev) => [...prev.slice(-3), dropped]);
        setLootBannerAlert(`🎁 Vừa phát hiện "${dropped.artifact.name}" rơi gần bạn!`);
        setTimeout(() => setLootBannerAlert(null), 4000);
      }

      // 2. Nếu bật Voice Google Maps, đọc chỉ dẫn đường đi
      if (voiceNavEnabled) {
        const dist = Math.round(calculateDistance(nextGps, selectedLocation.coordinates));
        const bearing = Math.round(calculateBearing(nextGps, selectedLocation.coordinates));
        const lootVoice = dropped ? ` Phát hiện ${dropped.artifact.name} rơi phía trước!` : '';

        speakTrack({
          id: `nav_${Date.now()}`,
          title: `Chỉ dẫn tới ${selectedLocation.name}`,
          role: 'Google Maps Heritage Voice',
          transcript:
            dist <= 20
              ? `Bạn đã đến ${selectedLocation.name}!${lootVoice}`
              : `Tiến về hướng ${bearing} độ, còn ${dist} mét nữa tới ${selectedLocation.name}.${lootVoice}`,
        });
      }

      setTimeout(() => setIsMoving(false), 850);
    },
    [userGps, voiceNavEnabled, selectedLocation, speakTrack]
  );

  // Khi người chơi chạm nhặt Bức thư thời chiến trên Map hoặc trong AR Camera
  const handleCollectLoot = (loot: SpawnedLootItem) => {
    setSpawnedLoots((prev) => prev.filter((item) => item.instanceId !== loot.instanceId));
    setOpenedArtifact(loot.artifact);

    // Tự động đọc nội dung bức thư thời chiến bằng giọng TTS
    speakTrack({
      id: loot.artifact.id,
      title: loot.artifact.name,
      role: `${loot.artifact.author} (${loot.artifact.year})`,
      transcript: loot.artifact.fullLetterContent,
    });

    // Lưu vào Nhật ký Hành trình trong Hồ sơ cá nhân
    const nextProfile: UserProfileData = {
      ...profile,
      journeyLogs: [
        {
          id: `log_${Date.now()}`,
          locationName: loot.artifact.name,
          action: `Nhặt được kỷ vật ${loot.artifact.rarity} của ${loot.artifact.author}`,
          timestamp: 'Vừa xong',
        },
        ...profile.journeyLogs,
      ],
    };
    updateProfile(nextProfile);
  };

  const distanceMeters = Math.round(calculateDistance(userGps, selectedLocation.coordinates));

  const shellContent = (
    <div className="relative w-full h-full bg-[#0B1320] text-[#F5F2EB] flex flex-col overflow-hidden select-none">
      {/* 1. Mở khóa cảm biến và chỉ dẫn iOS Safe */}
      <IOSOnboardingSheet
        onPermissionsReady={({ compass, gps }) => {
          console.log('Cảm biến iOS đã sẵn sàng:', { compass, gps });
        }}
      />

      {/* HEADER TRẠNG THÁI (Né Dynamic Island & Notch trên iPhone) */}
      <header className="relative z-30 pt-ios-safe pb-2.5 px-4 ios-frosted-glass border-b border-[#D4AF37]/25 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('profile')}>
          <div className="w-8 h-8 rounded-full bg-[#8B2626] border border-[#D4AF37] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-[9px] text-[#D4AF37] font-bold uppercase">{profile.titleEquipped}</p>
            <h1 className="text-xs font-bold text-white">{profile.displayName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onExitSimulator && (
            <button
              onClick={onExitSimulator}
              className="px-2.5 py-1 rounded-full bg-[#1A263D] border border-cyan-500/40 text-cyan-300 text-[10px] font-bold flex items-center gap-1 hover:bg-cyan-900/40"
              title="Quay lại Trung tâm điều hành PC"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>PC</span>
            </button>
          )}

          <button
            onClick={() => setShowSimJoystick((p) => !p)}
            className="px-3 py-1 rounded-full bg-[#131F33] border border-cyan-400/50 text-cyan-300 text-[11px] font-bold flex items-center gap-1"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Bước Đi Thực Địa</span>
          </button>
        </div>
      </header>

      {/* THANH BƯỚC ĐI GIẢ LẬP (MỖI BƯỚC ĐI TỰ ĐỘNG CHỈ ĐƯỜNG VOICE & RỚT THƯ THỜI CHIẾN) */}
      {showSimJoystick && (
        <div className="relative z-30 px-3 py-1.5 bg-[#0F192A] border-b border-[#D4AF37]/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStepWalk(0.00025, 0.00025, 45)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500 text-[#070C15] text-[11px] font-extrabold shadow"
            >
              🏃 Đi Tới Đích
            </button>
            <button
              onClick={() => handleStepWalk(0.00025, 0, 0)}
              className="px-2 py-1 rounded bg-[#1B2A44] text-xs font-bold"
            >
              ▲ Bắc
            </button>
            <button
              onClick={() => handleStepWalk(-0.00025, 0, 180)}
              className="px-2 py-1 rounded bg-[#1B2A44] text-xs font-bold"
            >
              ▼ Nam
            </button>
            <button
              onClick={() => handleStepWalk(0, 0.00025, 90)}
              className="px-2 py-1 rounded bg-[#1B2A44] text-xs font-bold"
            >
              ► Đông
            </button>
          </div>

          <span className="text-[10px] text-amber-300 font-bold truncate">
            Kỷ vật rơi: {spawnedLoots.length}
          </span>
        </div>
      )}

      {/* THÔNG BÁO NỔI KHI RỚT BỨC THƯ THỜI CHIẾN */}
      {lootBannerAlert && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B2626] to-amber-600 text-white text-xs font-extrabold border-2 border-yellow-300 shadow-2xl animate-bounce whitespace-nowrap">
          {lootBannerAlert}
        </div>
      )}

      {/* NỘI DUNG CHÍNH */}
      <main className="relative flex-1 w-full overflow-hidden">
        {activeTab === 'radar' && (
          <PokemonGoHeritageMap
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            userGps={userGps}
            playerHeading={playerHeading}
            isMoving={isMoving}
            companionType={profile.companion}
            spawnedLoots={spawnedLoots}
            onCollectLoot={handleCollectLoot}
            onForceSpawnLoot={() => {
              const forced = tryRollLootDrop(userGps, true);
              if (forced) {
                setSpawnedLoots((prev) => [...prev, forced]);
                setLootBannerAlert(`✨ Đã dò thấy: ${forced.artifact.name}!`);
                setTimeout(() => setLootBannerAlert(null), 3500);
              }
            }}
            voiceNavEnabled={voiceNavEnabled}
            onToggleVoiceNav={() => setVoiceNavEnabled((v) => !v)}
            onOpenARMode={() => setActiveTab('ar')}
            isAdmin={isAdmin}
            onOpenAdminLogoModal={(loc) => setEditingLogoLoc(loc)}
          />
        )}

        {activeTab === 'ar' && (
          <PokemonGoARScanner
            targetLocation={selectedLocation}
            userGps={userGps}
            playerHeading={playerHeading}
            spawnedLoots={spawnedLoots}
            onStepForwardInAR={() => handleStepWalk(0.00022, 0.00022, 45)}
            onCollectLoot={handleCollectLoot}
            onSpeakNavigation={(voiceText) =>
              speakTrack({
                id: `ar_nav_${Date.now()}`,
                title: `AR Dẫn Đường • ${selectedLocation.name}`,
                role: 'Trợ Lý Giọng Nói Thực Địa',
                transcript: voiceText,
              })
            }
            onOpenStoryPuzzle={() => setActiveTab('story')}
          />
        )}

        {activeTab === 'story' && (
          <MobileStorytellerTab
            location={{ ...selectedLocation, distanceMeters }}
            onPlayWitnessAudio={() =>
              speakTrack({
                id: selectedLocation.id,
                title: selectedLocation.witnessName || selectedLocation.name,
                role: selectedLocation.witnessRole || 'Nhân chứng Lịch sử',
                transcript: selectedLocation.witnessTranscript || selectedLocation.summary,
              })
            }
          />
        )}

        {activeTab === 'veterans' && (
          <MobileVeteransTab
            onPlayWitness={(name, role, transcript) =>
              speakTrack({ id: name, title: name, role, transcript })
            }
          />
        )}

        {activeTab === 'profile' && (
          <MobileProfileTab
            profile={profile}
            onUpdateProfile={updateProfile}
            isAdmin={isAdmin}
            onToggleAdminAuth={(pass) => {
              if (pass === 'admin123' || pass === '123') {
                setIsAdmin(true);
                return true;
              }
              return false;
            }}
          />
        )}
      </main>

      {/* THANH PHÁT GIỌNG ĐỌC TTS / VOICE NAVIGATION */}
      {activeTrack && (
        <div className="relative z-40 mx-3 mb-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#152238] to-[#8B2626] border border-[#D4AF37] flex items-center justify-between gap-2 shadow-2xl">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-[#D4AF37] uppercase">
              🔊 {activeTrack.role}
            </p>
            <p className="text-xs font-bold text-white truncate">{activeTrack.title}</p>
            <p className="text-[11px] text-amber-100 truncate italic">“{activeTrack.transcript}”</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#0B1320] flex items-center justify-center cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={closeTrack}
              className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG ĐÁY KIỂU FLOATING IOS DOCK (Né thanh Home Indicator trên iPhone) */}
      <nav className="relative z-50 mx-3 mb-2 pb-ios-safe pt-2 px-3 rounded-[28px] ios-frosted-glass border border-[#D4AF37]/35 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-around">
        <button
          onClick={() => {
            triggerIOSHaptic('light');
            setActiveTab('radar');
          }}
          className={`flex flex-col items-center text-[10px] font-bold cursor-pointer transition-transform active:scale-90 ${
            activeTab === 'radar' ? 'text-cyan-400' : 'text-gray-400'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          Map Pokémon 3D
        </button>

        <button
          onClick={() => {
            triggerIOSHaptic('light');
            setActiveTab('story');
          }}
          className={`flex flex-col items-center text-[10px] font-bold cursor-pointer transition-transform active:scale-90 ${
            activeTab === 'story' ? 'text-[#D4AF37]' : 'text-gray-400'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          Giải Mã
        </button>

        <button
          onClick={() => {
            triggerIOSHaptic('medium');
            setActiveTab('ar');
          }}
          className="relative -top-4 w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B2626] via-[#D4AF37] to-cyan-400 text-[#070C15] border-2 border-white flex flex-col items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.8)] cursor-pointer active:scale-95 transition-transform"
        >
          <ScanEye className="w-6 h-6" />
          <span className="text-[8px] font-extrabold uppercase">AR Go</span>
        </button>

        <button
          onClick={() => {
            triggerIOSHaptic('light');
            setActiveTab('veterans');
          }}
          className={`flex flex-col items-center text-[10px] font-bold cursor-pointer transition-transform active:scale-90 ${
            activeTab === 'veterans' ? 'text-[#D4AF37]' : 'text-gray-400'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          Tri Ân
        </button>

        <button
          onClick={() => {
            triggerIOSHaptic('light');
            setActiveTab('profile');
          }}
          className={`flex flex-col items-center text-[10px] font-bold cursor-pointer transition-transform active:scale-90 ${
            activeTab === 'profile' ? 'text-[#D4AF37]' : 'text-gray-400'
          }`}
        >
          <UserCheck className="w-5 h-5 mb-0.5" />
          Hồ Sơ
        </button>
      </nav>

      {/* MODAL XEM BỨC THƯ THỜI CHIẾN VỪA NHẶT ĐƯỢC */}
      <WartimeLetterModal
        artifact={openedArtifact}
        onClose={() => setOpenedArtifact(null)}
        onReadAloud={(art) =>
          speakTrack({
            id: art.id,
            title: art.name,
            role: `${art.author} (${art.year})`,
            transcript: art.fullLetterContent,
          })
        }
      />

      {/* MODAL ADMIN ĐỔI LOGO */}
      <AdminLandmarkLogoModal
        location={editingLogoLoc}
        isAdmin={isAdmin}
        onClose={() => setEditingLogoLoc(null)}
        onSaveLogo={(locId, url) => {
          setLocations((prev) =>
            prev.map((l) => (l.id === locId ? { ...l, customLogoUrl: url } : l))
          );
        }}
      />
    </div>
  );

  if (isSimulatorFrame) {
    return (
      <div className="w-full min-h-screen bg-[#05080F] flex items-center justify-center p-4">
        <div className="relative w-[393px] h-[852px] rounded-[48px] p-3 bg-gradient-to-b from-[#2A3444] via-[#131A24] to-[#2A3444] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-[#D4AF37]/40">
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>
          <div className="w-full h-full rounded-[38px] overflow-hidden relative">
            {shellContent}
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full h-[100dvh] overflow-hidden">{shellContent}</div>;
};
