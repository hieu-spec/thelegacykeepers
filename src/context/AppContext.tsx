'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Coordinates, HistoricalLocation, WitnessStory } from '@/types/location';
import { HistoricalStory } from '@/types/story';
import { Badge } from '@/types/badge';
import { UserProfile } from '@/types/user';
import { AccountProfile, VeteranProfile, CustomLocationPin } from '@/types/system';
import { MOCK_LOCATIONS } from '@/data/locations';
import { MOCK_STORIES } from '@/data/stories';
import { MOCK_BADGES } from '@/data/badges';
import { INITIAL_USER_PROFILE } from '@/data/initialUser';
import { INITIAL_ACCOUNTS, INITIAL_VETERANS, SYSTEM_TITLES } from '@/data/accounts';
import { calculateDistanceMeters, formatDistance, calculateBearing } from '@/utils/geo';
import { loadLocationsFromStorage, saveLocationsToStorage } from '@/utils/clientStorage';

export type AppTab = 'minigame' | 'radar' | 'profile';

export interface LocationProximity {
  distanceMeters: number;
  distanceFormatted: string;
  inDiscoveryRadius: boolean;
  inInteractionRadius: boolean;
  bearing: number;
}

export interface ToastData {
  title: string;
  description: string;
  type?: 'gold' | 'cinnabar' | 'emerald';
}

export interface GpsPreset {
  id: string;
  label: string;
  subtitle: string;
  coordinates: Coordinates;
  targetLocationId?: string;
  expectedState: 'connected' | 'discovered' | 'out_of_range';
}

export const GPS_PRESETS: GpsPreset[] = [
  {
    id: 'preset-ben-nha-rong-close',
    label: 'Bến Nhà Rồng (Cách 20m)',
    subtitle: 'Nằm trong phạm vi tương tác (≤ 35m) · Mở khóa Minigame & Nhân chứng',
    coordinates: { lat: 10.76828, lng: 106.70678 },
    targetLocationId: 'ben-nha-rong',
    expectedState: 'connected',
  },
  {
    id: 'preset-dinh-doc-lap-close',
    label: 'Dinh Độc Lập (Cách 40m)',
    subtitle: 'Nằm trong phạm vi tương tác (≤ 75m) · Kích hoạt Xe tăng 390',
    coordinates: { lat: 10.77715, lng: 106.69547 },
    targetLocationId: 'dinh-doc-lap',
    expectedState: 'connected',
  },
  {
    id: 'preset-ham-biet-dong-close',
    label: 'Căn Hầm Biệt Động (Cách 50m)',
    subtitle: 'Nằm trong phạm vi tương tác (≤ 60m) · Khám phá kho vũ khí ngầm',
    coordinates: { lat: 10.77918, lng: 106.68962 },
    targetLocationId: 'ham-biet-dong-sai-gon',
    expectedState: 'connected',
  },
  {
    id: 'preset-quan-1-distance',
    label: 'Bưu Điện Trung Tâm (Cách Bến Nhà Rồng 1.2km)',
    subtitle: 'Trong bán kính phát hiện nhưng NGOÀI phạm vi tương tác',
    coordinates: { lat: 10.77977, lng: 106.69996 },
    targetLocationId: 'buu-dien-trung-tam',
    expectedState: 'discovered',
  },
  {
    id: 'preset-cu-chi-distance',
    label: 'Địa Đạo Củ Chi (Cách trung tâm 35km)',
    subtitle: 'Vùng ngoại vi · Chỉ hiện các Pin Legendary & Event tầm xa',
    coordinates: { lat: 11.14345, lng: 106.46312 },
    targetLocationId: 'dia-dao-cu-chi',
    expectedState: 'connected',
  },
  {
    id: 'preset-hoang-thanh-thang-long',
    label: 'Hoàng Thành Thăng Long (Hà Nội)',
    subtitle: 'Hầm Chỉ Huy Tác Chiến T1 · 12 ngày đêm Điện Biên Phủ trên không',
    coordinates: { lat: 21.0341, lng: 105.8401 },
    targetLocationId: 'hoang-thanh-thang-long',
    expectedState: 'connected',
  },
  {
    id: 'preset-thanh-co-quang-tri',
    label: 'Thành Cổ Quảng Trị (Quảng Trị)',
    subtitle: 'Khúc tráng ca 81 ngày đêm mùa hè đỏ lửa 1972 & sông Thạch Hãn',
    coordinates: { lat: 16.7505, lng: 107.1897 },
    targetLocationId: 'thanh-co-quang-tri',
    expectedState: 'connected',
  },
  {
    id: 'preset-doi-a1-dien-bien-phu',
    label: 'Đồi A1 - Điện Biên Phủ (Điện Biên)',
    subtitle: 'Khối bộc phá 960kg & Chiến dịch lịch sử Điện Biên Phủ 1954',
    coordinates: { lat: 21.3856, lng: 103.0218 },
    targetLocationId: 'doi-a1-dien-bien-phu',
    expectedState: 'connected',
  },
];

interface AppContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;

  // GPS Simulation & Movement
  currentGps: Coordinates;
  userLocation: Coordinates;
  currentGpsPreset: GpsPreset;
  teleportToPreset: (preset: GpsPreset) => void;
  offsetGps: (deltaLat: number, deltaLng: number) => void;
  setGpsCoordinates: (coords: Coordinates) => void;
  setUserLocation: (coords: Coordinates) => void;
  playerHeading: number;
  setPlayerHeading: (heading: number) => void;
  isPlayerMoving: boolean;
  setIsPlayerMoving: (moving: boolean) => void;

  // Locations & Selection
  locations: HistoricalLocation[];
  setLocations: React.Dispatch<React.SetStateAction<HistoricalLocation[]>>;
  addOrUpdateLocation: (location: HistoricalLocation) => void;
  removeLocation: (id: string) => void;
  reloadLocationsFromApi: () => Promise<void>;
  selectedLocation: HistoricalLocation | null;
  setSelectedLocation: (loc: HistoricalLocation | null) => void;
  getLocationProximity: (location: HistoricalLocation) => LocationProximity;

  // Minigame Stories
  stories: HistoricalStory[];
  activePlayingStory: HistoricalStory | null;
  activeStageNumber: number | null;
  setActivePlayingStory: (story: HistoricalStory | null) => void;
  setActiveStageNumber: (stage: number | null) => void;
  completeStoryStage: (storyId: string, stageNumber: number) => void;

  // Badges & Profile
  badges: Badge[];
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  visitLocation: (locationId: string) => void;
  profileSubScreen: ProfileSubScreen;
  setProfileSubScreen: (screen: ProfileSubScreen) => void;

  // Audio Witness Player
  activeAudioWitness: WitnessStory | null;
  isPlayingAudio: boolean;
  togglePlayAudio: (witness?: WitnessStory) => void;
  stopAudio: () => void;

  // Toast System
  toast: ToastData | null;
  showToast: (title: string, description: string, type?: 'gold' | 'cinnabar' | 'emerald') => void;
  hideToast: () => void;

  // AR Navigation (Mobile Field Experience)
  isArModeActive: boolean;
  arTargetLocation: HistoricalLocation | null;
  startArNavigation: (location: HistoricalLocation) => void;
  stopArNavigation: () => void;

  // Desktop Responsive Layout Mode
  desktopViewMode: 'dashboard' | 'mobile_simulator';
  setDesktopViewMode: (mode: 'dashboard' | 'mobile_simulator') => void;

  // Dev GPS controller toggle
  isGpsControllerOpen: boolean;
  setIsGpsControllerOpen: (open: boolean) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  loginAsDemoUser: () => void;

  // RBAC & Accounts System (1 Admin + 5 Users)
  currentAccount: AccountProfile;
  setCurrentAccount: React.Dispatch<React.SetStateAction<AccountProfile>>;
  allAccounts: AccountProfile[];
  loginAsAccount: (account: AccountProfile) => void;

  // Veterans & Living Memory
  veterans: VeteranProfile[];
  setVeterans: React.Dispatch<React.SetStateAction<VeteranProfile[]>>;
  visitedVeteranIds: string[];
  visitVeteran: (veteranId: string, tributeMessage?: string) => void;
  onPlayVeteranAudio: (veteran: VeteranProfile) => void;

  // Audio Override / Direct Play
  activeAudioOverride: {
    title: string;
    speaker?: string;
    textScript: string;
    uploadedAudioUrl?: string;
  } | null;
  setActiveAudioOverride: (
    audio: {
      title: string;
      speaker?: string;
      textScript: string;
      uploadedAudioUrl?: string;
    } | null
  ) => void;

  // Campaigns
  completedCampaignIds: string[];
  completeCampaign: (campaignId: string) => void;

  // Admin Custom Pin Management
  saveCustomPin: (pin: CustomLocationPin) => void;
  deleteCustomPin: (id: string) => void;
  saveVeteranProfile: (vet: VeteranProfile) => void;

  // Settings & Customization
  language: string;
  setLanguage: (lang: string) => void;
  preferences: {
    dailyReminder: boolean;
    gpsGeofencing: boolean;
    heritageEvents: boolean;
    locationAccess: 'always' | 'while_using' | 'never';
    publicProfile: boolean;
  };
  updatePreferences: (
    updates: Partial<{
      dailyReminder: boolean;
      gpsGeofencing: boolean;
      heritageEvents: boolean;
      locationAccess: 'always' | 'while_using' | 'never';
      publicProfile: boolean;
    }>
  ) => void;
}

export type ProfileSubScreen = 'main' | 'locations' | 'challenges' | 'badges' | 'settings' | 'collection';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('radar');
  const [profileSubScreen, setProfileSubScreen] = useState<ProfileSubScreen>('main');
  const [currentGpsPreset, setCurrentGpsPreset] = useState<GpsPreset>(GPS_PRESETS[0]);
  const [currentGps, setCurrentGps] = useState<Coordinates>(GPS_PRESETS[0].coordinates);
  const [playerHeading, setPlayerHeading] = useState<number>(0);
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);
  const [locations, setLocations] = useState<HistoricalLocation[]>(MOCK_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState<HistoricalLocation | null>(null);
  const [stories, setStories] = useState<HistoricalStory[]>(MOCK_STORIES);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activePlayingStory, setActivePlayingStory] = useState<HistoricalStory | null>(null);
  const [activeStageNumber, setActiveStageNumber] = useState<number | null>(null);
  const [activeAudioWitness, setActiveAudioWitness] = useState<WitnessStory | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isGpsControllerOpen, setIsGpsControllerOpen] = useState<boolean>(false);
  const [isArModeActive, setIsArModeActive] = useState<boolean>(false);
  const [arTargetLocation, setArTargetLocation] = useState<HistoricalLocation | null>(null);
  const [desktopViewMode, setDesktopViewMode] = useState<'dashboard' | 'mobile_simulator'>('dashboard');

  // Authentication & RBAC Accounts (1 Admin + 5 Users)
  const [allAccounts, setAllAccounts] = useState<AccountProfile[]>(INITIAL_ACCOUNTS);
  const [currentAccount, setCurrentAccount] = useState<AccountProfile>(INITIAL_ACCOUNTS[0]);
  const [veterans, setVeterans] = useState<VeteranProfile[]>(INITIAL_VETERANS);
  const [activeAudioOverride, setActiveAudioOverride] = useState<{
    title: string;
    speaker?: string;
    textScript: string;
    uploadedAudioUrl?: string;
  } | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('🇻🇳 Tiếng Việt');
  const [preferences, setPreferences] = useState<{
    dailyReminder: boolean;
    gpsGeofencing: boolean;
    heritageEvents: boolean;
    locationAccess: 'always' | 'while_using' | 'never';
    publicProfile: boolean;
  }>({
    dailyReminder: true,
    gpsGeofencing: true,
    heritageEvents: true,
    locationAccess: 'while_using',
    publicProfile: true,
  });

  const updatePreferences = useCallback((updates: Partial<typeof preferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const showToast = useCallback(
    (title: string, description: string, type: 'gold' | 'cinnabar' | 'emerald' = 'gold') => {
      setToast({ title, description, type });
      setTimeout(() => {
        setToast((prev) => (prev?.title === title ? null : prev));
      }, 4200);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const loginAsAccount = useCallback(
    (account: AccountProfile) => {
      setCurrentAccount(account);
      setIsAuthenticated(true);
      setUserProfile((prev) => ({
        ...prev,
        name: account.displayName,
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        currentExp: account.exp,
        maxExp: account.maxExp,
        level: account.level,
      }));
      showToast(
        `Đã đăng nhập: ${account.displayName}`,
        `Vai trò: ${account.role === 'ADMIN' ? 'Tổng Chỉ Huy (ADMIN CMS)' : 'Nhà Gìn Giữ Di Sản'}`,
        account.role === 'ADMIN' ? 'gold' : 'emerald'
      );
    },
    [showToast]
  );

  const login = useCallback(
    (email?: string, password?: string) => {
      setIsAuthenticated(true);
      showToast('Đăng nhập thành công!', `Chào mừng trở lại, ${currentAccount.displayName}!`, 'emerald');
    },
    [currentAccount, showToast]
  );

  // Tự động tải và đồng bộ di tích bền vững với LocalStorage của trình duyệt
  useEffect(() => {
    const stored = loadLocationsFromStorage();
    if (stored && stored.length > 0) {
      setLocations(stored);
    }
  }, []);

  useEffect(() => {
    saveLocationsToStorage(locations);
  }, [locations]);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/auth', { method: 'DELETE' }).catch(() => {});
    }
    setIsAuthenticated(false);
    setProfileSubScreen('main');
    showToast('Đã đăng xuất', 'Bạn đã đăng xuất khỏi tài khoản thành công.', 'emerald');
  }, [showToast]);

  const loginAsDemoUser = useCallback(() => {
    loginAsAccount(INITIAL_ACCOUNTS[1]); // Lê Toàn Hiếu
  }, [loginAsAccount]);

  const visitVeteran = useCallback(
    (veteranId: string, tributeMessage?: string) => {
      setVeterans((prevVets) =>
        prevVets.map((v) => {
          if (v.id === veteranId) {
            const updatedTributes = tributeMessage
              ? [
                  {
                    user: currentAccount.displayName,
                    message: tributeMessage,
                    date: new Date().toLocaleDateString('vi-VN'),
                  },
                  ...v.tributes,
                ]
              : v.tributes;
            return {
              ...v,
              tributeCount: v.tributeCount + 1,
              tributes: updatedTributes,
            };
          }
          return v;
        })
      );

      setCurrentAccount((prev) => {
        const newVisited = prev.visitedVeteranIds.includes(veteranId)
          ? prev.visitedVeteranIds
          : [...prev.visitedVeteranIds, veteranId];
        const newExp = prev.exp + 300;
        const unlockedTitles = prev.unlockedTitleIds.includes('title_gratitude')
          ? prev.unlockedTitleIds
          : [...prev.unlockedTitleIds, 'title_gratitude'];
        return {
          ...prev,
          visitedVeteranIds: newVisited,
          exp: newExp,
          unlockedTitleIds: unlockedTitles,
        };
      });

      showToast(
        'Tri ân Cựu Chiến Binh thành công!',
        'Bạn nhận được +300 EXP và mở khóa danh hiệu: ★ Người Cháu Tri Ân',
        'emerald'
      );
    },
    [currentAccount.displayName, showToast]
  );

  const onPlayVeteranAudio = useCallback((veteran: VeteranProfile) => {
    setActiveAudioOverride({
      title: `Hồi ký ${veteran.fullName}`,
      speaker: veteran.rankAndRole,
      textScript: veteran.biography,
      uploadedAudioUrl: veteran.audioUrl,
    });
  }, []);

  const completeCampaign = useCallback(
    (campaignId: string) => {
      setCurrentAccount((prev) => {
        if (prev.completedCampaignIds.includes(campaignId)) return prev;
        return {
          ...prev,
          completedCampaignIds: [...prev.completedCampaignIds, campaignId],
          exp: prev.exp + 500,
        };
      });
      showToast('Chiến dịch hoàn tất!', 'Nhận +500 EXP và mộc vinh danh lịch sử!', 'gold');
    },
    [showToast]
  );

  const saveCustomPin = useCallback(
    (pin: CustomLocationPin) => {
      const mappedLocation: HistoricalLocation = {
        id: pin.id,
        name: pin.name,
        subtitle: pin.address,
        categoryTitle: pin.pinType,
        address: pin.address,
        coordinates: pin.coordinates,
        rarity: pin.rarity,
        contentType: pin.pinType === 'story' ? 'landmark' : pin.pinType,
        discoveryRadius: 5.0,
        interactionRadius: 50,
        historicalPeriod: 'Lịch sử Việt Nam',
        yearEstablished: '1975',
        imageUrl: pin.imageUrl || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        historicalSummary: pin.content,
        fullDescription: pin.content,
        audioUrl: pin.audioUrl,
        witnessStory: {
          id: `witness-${pin.id}`,
          title: pin.name,
          duration: '03:00',
          speakerName: 'Nhân chứng Lịch sử',
          speakerRole: pin.pinType,
          quote: pin.content.slice(0, 100),
          fullStory: pin.content,
          historicalSource: 'Tư liệu Quốc gia',
          audioUrl: pin.audioUrl,
        },
        storyChallengeIds: [pin.gameLink],
        rewardExp: pin.rarity === 'legendary' ? 500 : pin.rarity === 'rare' ? 300 : 150,
        tags: [pin.pinType, pin.rarity],
      };
      setLocations((prev) => {
        const idx = prev.findIndex((l) => l.id === mappedLocation.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = mappedLocation;
          return copy;
        }
        return [mappedLocation, ...prev];
      });
      showToast('Đã lưu Pin Di tích!', `Địa danh "${pin.name}" đã cập nhật lên Bản Đồ Tác Chiến.`, 'emerald');
    },
    [showToast]
  );

  const deleteCustomPin = useCallback(
    (id: string) => {
      setLocations((prev) => prev.filter((l) => l.id !== id));
      showToast('Đã xóa Pin!', `Địa danh đã được gỡ khỏi bản đồ.`, 'cinnabar');
    },
    [showToast]
  );

  const saveVeteranProfile = useCallback(
    (vet: VeteranProfile) => {
      setVeterans((prev) => {
        const idx = prev.findIndex((v) => v.id === vet.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = vet;
          return copy;
        }
        return [vet, ...prev];
      });
      showToast('Đã lưu hồ sơ Cựu chiến binh!', `Hồ sơ ${vet.fullName} đã được cập nhật thành công.`, 'emerald');
    },
    [showToast]
  );

  const teleportToPreset = useCallback(
    (preset: GpsPreset) => {
      setCurrentGpsPreset(preset);
      setCurrentGps(preset.coordinates);
      showToast('Đã dịch chuyển vị trí GPS!', `Bạn hiện đang ${preset.label}`, 'emerald');
    },
    [showToast]
  );

  const offsetGps = useCallback((deltaLat: number, deltaLng: number) => {
    setCurrentGps((prev) => {
      const next = { lat: prev.lat + deltaLat, lng: prev.lng + deltaLng };
      return next;
    });
  }, []);

  const setGpsCoordinates = useCallback((coords: Coordinates) => {
    setCurrentGps(coords);
  }, []);

  const getLocationProximity = useCallback(
    (location: HistoricalLocation): LocationProximity => {
      const distMeters = calculateDistanceMeters(currentGps, location.coordinates);
      const inDiscovery = distMeters <= location.discoveryRadius * 1000;
      const inInteraction = distMeters <= location.interactionRadius;
      const bearing = calculateBearing(currentGps, location.coordinates);

      return {
        distanceMeters: distMeters,
        distanceFormatted: formatDistance(distMeters),
        inDiscoveryRadius: inDiscovery,
        inInteractionRadius: inInteraction,
        bearing,
      };
    },
    [currentGps]
  );

  const addOrUpdateLocation = useCallback((location: HistoricalLocation) => {
    setLocations((prev) => {
      const idx = prev.findIndex((l) => l.id === location.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = location;
        return copy;
      }
      return [location, ...prev];
    });
  }, []);

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const reloadLocationsFromApi = useCallback(async () => {
    try {
      const res = await fetch('/api/locations');
      const data = await res.json();
      if (data.success && Array.isArray(data.locations)) {
        setLocations(data.locations);
      }
    } catch (e) {
      console.error('Không thể nạp lại địa danh từ API:', e);
    }
  }, []);

  const togglePlayAudio = useCallback((witness?: WitnessStory) => {
    if (witness) {
      setActiveAudioWitness(witness);
      setIsPlayingAudio(true);
    } else {
      setIsPlayingAudio((prev) => !prev);
    }
  }, []);

  const stopAudio = useCallback(() => {
    setIsPlayingAudio(false);
  }, []);

  const startArNavigation = useCallback((location: HistoricalLocation) => {
    setArTargetLocation(location);
    setIsArModeActive(true);
  }, []);

  const stopArNavigation = useCallback(() => {
    setIsArModeActive(false);
  }, []);

  const visitLocation = useCallback(
    (locationId: string) => {
      const loc = locations.find((l) => l.id === locationId);
      if (!loc) return;

      setUserProfile((prev) => {
        if (prev.visitedLocationIds.includes(locationId)) {
          return prev;
        }
        const updatedVisited = [...prev.visitedLocationIds, locationId];
        const updatedExp = prev.currentExp + loc.rewardExp;
        return {
          ...prev,
          visitedLocationIds: updatedVisited,
          currentExp: updatedExp,
          stats: {
            ...prev.stats,
            locationsDiscovered: updatedVisited.length,
          },
        };
      });

      showToast(
        `Đã khám phá ${loc.name}!`,
        `Nhận ngay +${loc.rewardExp} EXP danh dự của Nhà gìn giữ di sản.`,
        'gold'
      );
    },
    [locations, showToast]
  );

  const completeStoryStage = useCallback(
    (storyId: string, stageNumber: number) => {
      setStories((prevStories) =>
        prevStories.map((story) => {
          if (story.id !== storyId) return story;
          const isFinal = stageNumber >= story.totalStages;
          const nextStory = {
            ...story,
            currentStage: Math.max(story.currentStage, isFinal ? story.totalStages : stageNumber + 1),
            isCompleted: isFinal || story.isCompleted,
          };
          // Also update activePlayingStory if active
          setActivePlayingStory((active) => (active?.id === storyId ? nextStory : active));
          return nextStory;
        })
      );

      // Reward EXP and unlock badges
      const targetStory = stories.find((s) => s.id === storyId);
      const stage = targetStory?.stages.find((st) => st.stageNumber === stageNumber);
      const expReward = stage?.rewardExp || 200;

      setUserProfile((prev) => {
        const nextBadges = stage?.rewardBadgeId && !prev.unlockedBadgeIds.includes(stage.rewardBadgeId)
          ? [...prev.unlockedBadgeIds, stage.rewardBadgeId]
          : prev.unlockedBadgeIds;

        const nextExp = prev.currentExp + expReward;
        const nextLevel = Math.floor(nextExp / 1000) + 1;

        return {
          ...prev,
          currentExp: nextExp,
          level: Math.max(prev.level, nextLevel),
          titleLevel: `Historical Explorer · Cấp 0${Math.max(prev.level, nextLevel)}`,
          completedStoryIds: Array.from(new Set([...prev.completedStoryIds, storyId])),
          unlockedBadgeIds: nextBadges,
          stats: {
            ...prev.stats,
            fragmentsRestored: prev.stats.fragmentsRestored + 1,
            badgesEarned: nextBadges.length,
          },
        };
      });

      // Unlock badge if associated
      if (stage?.rewardBadgeId) {
        setBadges((prevBadges) =>
          prevBadges.map((badge) => {
            if (badge.id === stage.rewardBadgeId) {
              return { ...badge, isUnlocked: true, unlockedAt: 'Vừa mở khóa' };
            }
            return badge;
          })
        );
        const unlockedBadge = badges.find((b) => b.id === stage.rewardBadgeId);
        showToast(
          `🎉 Mở khóa Huy hiệu mới!`,
          `Chúc mừng bạn nhận được: "${unlockedBadge?.name || 'Huy hiệu Di sản'}"`,
          'gold'
        );
      } else {
        showToast(
          `Hoàn thành ${stage?.stageTitle || 'Thử thách'}!`,
          `Phục dựng ký ức thành công · Nhận +${expReward} EXP!`,
          'gold'
        );
      }
    },
    [stories, badges, showToast]
  );

  const updateUserProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setUserProfile((prev) => {
        const updated = {
          ...prev,
          ...updates,
          name: updates.displayName || updates.name || prev.name,
          displayName: updates.displayName || updates.name || prev.displayName,
        };
        return updated;
      });
      showToast('Đã lưu thông tin hồ sơ!', 'Thông tin cá nhân đã được cập nhật thành công.', 'emerald');
    },
    [showToast]
  );

  const value = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      profileSubScreen,
      setProfileSubScreen,
      currentGps,
      userLocation: currentGps,
      currentGpsPreset,
      teleportToPreset,
      offsetGps,
      setGpsCoordinates,
      setUserLocation: setGpsCoordinates,
      playerHeading,
      setPlayerHeading,
      isPlayerMoving,
      setIsPlayerMoving,
      locations,
      setLocations,
      addOrUpdateLocation,
      removeLocation,
      reloadLocationsFromApi,
      selectedLocation,
      setSelectedLocation,
      getLocationProximity,
      stories,
      activePlayingStory,
      activeStageNumber,
      setActivePlayingStory,
      setActiveStageNumber,
      completeStoryStage,
      badges,
      userProfile,
      updateUserProfile,
      visitLocation,
      activeAudioWitness,
      isPlayingAudio,
      togglePlayAudio,
      stopAudio,
      toast,
      showToast,
      hideToast,
      isArModeActive,
      arTargetLocation,
      startArNavigation,
      stopArNavigation,
      desktopViewMode,
      setDesktopViewMode,
      isGpsControllerOpen,
      setIsGpsControllerOpen,
      isAuthenticated,
      login,
      logout,
      loginAsDemoUser,
      currentAccount,
      setCurrentAccount,
      allAccounts,
      loginAsAccount,
      veterans,
      setVeterans,
      visitedVeteranIds: currentAccount.visitedVeteranIds,
      visitVeteran,
      onPlayVeteranAudio,
      activeAudioOverride,
      setActiveAudioOverride,
      completedCampaignIds: currentAccount.completedCampaignIds,
      completeCampaign,
      saveCustomPin,
      deleteCustomPin,
      saveVeteranProfile,
      language,
      setLanguage,
      preferences,
      updatePreferences,
    }),
    [
      currentTab,
      profileSubScreen,
      currentGps,
      currentGpsPreset,
      teleportToPreset,
      offsetGps,
      setGpsCoordinates,
      playerHeading,
      setPlayerHeading,
      isPlayerMoving,
      setIsPlayerMoving,
      locations,
      addOrUpdateLocation,
      removeLocation,
      reloadLocationsFromApi,
      selectedLocation,
      getLocationProximity,
      stories,
      activePlayingStory,
      activeStageNumber,
      completeStoryStage,
      badges,
      userProfile,
      updateUserProfile,
      visitLocation,
      activeAudioWitness,
      isPlayingAudio,
      togglePlayAudio,
      stopAudio,
      toast,
      showToast,
      hideToast,
      isArModeActive,
      arTargetLocation,
      startArNavigation,
      stopArNavigation,
      desktopViewMode,
      isGpsControllerOpen,
      isAuthenticated,
      login,
      logout,
      loginAsDemoUser,
      currentAccount,
      allAccounts,
      loginAsAccount,
      veterans,
      visitVeteran,
      onPlayVeteranAudio,
      activeAudioOverride,
      completeCampaign,
      saveCustomPin,
      deleteCustomPin,
      saveVeteranProfile,
      language,
      preferences,
      updatePreferences,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
