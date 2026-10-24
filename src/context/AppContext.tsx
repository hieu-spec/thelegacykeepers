'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Coordinates, HistoricalLocation, WitnessStory } from '@/types/location';
import { HistoricalStory } from '@/types/story';
import { Badge } from '@/types/badge';
import { UserProfile } from '@/types/user';
import { MOCK_LOCATIONS } from '@/data/locations';
import { MOCK_STORIES } from '@/data/stories';
import { MOCK_BADGES } from '@/data/badges';
import { INITIAL_USER_PROFILE } from '@/data/initialUser';
import { calculateDistanceMeters, formatDistance, calculateBearing } from '@/utils/geo';

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
];

interface AppContextType {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;

  // GPS Simulation
  currentGps: Coordinates;
  currentGpsPreset: GpsPreset;
  teleportToPreset: (preset: GpsPreset) => void;
  offsetGps: (deltaLat: number, deltaLng: number) => void;

  // Locations & Selection
  locations: HistoricalLocation[];
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

  // Dev GPS controller toggle
  isGpsControllerOpen: boolean;
  setIsGpsControllerOpen: (open: boolean) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  loginAsDemoUser: () => void;

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
  const [locations] = useState<HistoricalLocation[]>(MOCK_LOCATIONS);
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

  // Authentication & Preferences
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

  const login = useCallback((email?: string, password?: string) => {
    setIsAuthenticated(true);
    showToast('Đăng nhập thành công!', `Chào mừng trở lại, ${userProfile.displayName || userProfile.name}!`, 'emerald');
  }, [userProfile, showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setProfileSubScreen('main');
    showToast('Đã đăng xuất', 'Bạn đã đăng xuất khỏi tài khoản thành công.', 'emerald');
  }, [showToast]);

  const loginAsDemoUser = useCallback(() => {
    setIsAuthenticated(true);
    showToast('Đăng nhập nhanh', 'Chào mừng Nhà Khám Phá trở lại với The Legacy Keepers!', 'gold');
  }, [showToast]);

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
      currentGpsPreset,
      teleportToPreset,
      offsetGps,
      locations,
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
      isGpsControllerOpen,
      setIsGpsControllerOpen,
      isAuthenticated,
      login,
      logout,
      loginAsDemoUser,
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
      locations,
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
      isGpsControllerOpen,
      isAuthenticated,
      login,
      logout,
      loginAsDemoUser,
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
