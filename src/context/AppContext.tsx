// src/context/AppContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Coordinates, HistoricalLocation, WitnessStory } from "@/types/location";
import { HistoricalStory } from "@/types/story";
import { Badge } from "@/types/badge";
import { UserProfile } from "@/types/user";
import { AccountProfile, VeteranProfile, CustomLocationPin } from "@/types/system";
import { MOCK_LOCATIONS } from "@/data/locations";
import { MOCK_STORIES } from "@/data/stories";
import { MOCK_BADGES } from "@/data/badges";
import { INITIAL_USER_PROFILE } from "@/data/initialUser";
import { INITIAL_ACCOUNTS, INITIAL_VETERANS } from "@/data/accounts";
import { calculateDistanceMeters as geoCalc, formatDistance, calculateBearing } from "@/utils/geo";
import { useHeritageCms, CmsLocationItem, CmsVeteranItem } from "@/utils/heritageCmsStore";

export type LanguageCode = "vi" | "en";
export type AppTab = "minigame" | "radar" | "profile" | "map" | "saved" | "veterans" | "admin";
export type ProfileSubScreen = "overview" | "badges" | "diary" | "challenges" | "collection" | "discovered" | "settings" | "locations" | "main";

export interface JourneyLogItem {
  id: string;
  placeVi: string;
  placeEn: string;
  descVi: string;
  descEn: string;
  timeVi: string;
  timeEn: string;
  expReward: number;
  color: string;
}

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
  type?: "gold" | "cinnabar" | "emerald";
}

export interface GpsPreset {
  id: string;
  label: string;
  subtitle: string;
  coordinates: Coordinates;
  targetLocationId?: string;
  expectedState: "connected" | "discovered" | "out_of_range";
}

export const GPS_PRESETS: GpsPreset[] = [
  {
    id: "preset-ben-nha-rong-close",
    label: "Bến Nhà Rồng (Cách 20m)",
    subtitle: "Nằm trong phạm vi tương tác (≤ 35m) · Mở khóa Minigame & Nhân chứng",
    coordinates: { lat: 10.76828, lng: 106.70678 },
    targetLocationId: "ben-nha-rong",
    expectedState: "connected",
  },
  {
    id: "preset-dinh-doc-lap-close",
    label: "Dinh Độc Lập (Cách 40m)",
    subtitle: "Nằm trong phạm vi tương tác (≤ 75m) · Kích hoạt Xe tăng 390",
    coordinates: { lat: 10.77715, lng: 106.69547 },
    targetLocationId: "dinh-doc-lap",
    expectedState: "connected",
  },
  {
    id: "preset-ham-biet-dong-close",
    label: "Căn Hầm Biệt Động (Cách 50m)",
    subtitle: "Nằm trong phạm vi tương tác (≤ 60m) · Khám phá kho vũ khí ngầm",
    coordinates: { lat: 10.77918, lng: 106.68962 },
    targetLocationId: "ham-biet-dong-sai-gon",
    expectedState: "connected",
  },
];

export interface AppContextState {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  user: {
    name: string;
    initials: string;
    level: number;
    levelTitleVi: string;
    levelTitleEn: string;
    exp: number;
    maxExp: number;
    mottoVi: string;
    mottoEn: string;
    equippedBadgeId: string;
    equippedBadgeTitleVi: string;
    equippedBadgeTitleEn: string;
    selectedCompanionId: string;
    unlockedSitesCount: number;
    badgesCount: number;
    companionsCount: number;
    isAuthenticated: boolean;
  };
  locations: (CmsLocationItem & HistoricalLocation)[];
  veterans: (CmsVeteranItem & VeteranProfile)[];
  savedSiteIds: string[];
  journeyLogs: JourneyLogItem[];
  toggleSaveSite: (siteId: string) => void;
  equipBadge: (badgeId: string, titleVi: string, titleEn: string) => void;
  selectCompanion: (companionId: string) => void;
  addExpAndLog: (placeVi: string, placeEn: string, descVi: string, descEn: string, expGain: number) => void;
  loginUser: (name: string) => void;
  logoutUser: () => void;
}

export interface AppContextType extends AppContextState {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
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
  setLocations: React.Dispatch<React.SetStateAction<HistoricalLocation[]>>;
  addOrUpdateLocation: (location: HistoricalLocation | CmsLocationItem) => void;
  removeLocation: (id: string) => void;
  reloadLocationsFromApi: () => Promise<void>;
  selectedLocation: HistoricalLocation | null;
  setSelectedLocation: (loc: HistoricalLocation | null) => void;
  getLocationProximity: (location: HistoricalLocation) => LocationProximity;
  stories: HistoricalStory[];
  activePlayingStory: HistoricalStory | null;
  activeStageNumber: number | null;
  setActivePlayingStory: (story: HistoricalStory | null) => void;
  setActiveStageNumber: (stage: number | null) => void;
  completeStoryStage: (storyId: string, stageNumber: number) => void;
  badges: Badge[];
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  visitLocation: (locationId: string) => void;
  profileSubScreen: ProfileSubScreen;
  setProfileSubScreen: (screen: ProfileSubScreen) => void;
  activeAudioWitness: WitnessStory | null;
  isPlayingAudio: boolean;
  togglePlayAudio: (witness?: WitnessStory) => void;
  stopAudio: () => void;
  toast: ToastData | null;
  showToast: (title: string, description: string, type?: "gold" | "cinnabar" | "emerald") => void;
  hideToast: () => void;
  isArModeActive: boolean;
  arTargetLocation: HistoricalLocation | null;
  startArNavigation: (location: HistoricalLocation) => void;
  stopArNavigation: () => void;
  desktopViewMode: "dashboard" | "mobile_simulator";
  setDesktopViewMode: (mode: "dashboard" | "mobile_simulator") => void;
  isGpsControllerOpen: boolean;
  setIsGpsControllerOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  loginAsDemoUser: () => void;
  currentAccount: AccountProfile;
  setCurrentAccount: React.Dispatch<React.SetStateAction<AccountProfile>>;
  allAccounts: AccountProfile[];
  loginAsAccount: (account: AccountProfile) => void;
  setVeterans: React.Dispatch<React.SetStateAction<VeteranProfile[]>>;
  visitedVeteranIds: string[];
  visitVeteran: (veteranId: string, tributeMessage?: string) => void;
  onPlayVeteranAudio: (veteran: VeteranProfile) => void;
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
  completedCampaignIds: string[];
  completeCampaign: (campaignId: string) => void;
  saveCustomPin: (pin: CustomLocationPin) => void;
  deleteCustomPin: (id: string) => void;
  saveVeteranProfile: (vet: VeteranProfile) => void;
  language: string;
  setLanguage: (lang: string) => void;
  preferences: {
    dailyReminder: boolean;
    gpsGeofencing: boolean;
    heritageEvents: boolean;
    locationAccess: "always" | "while_using" | "never";
    publicProfile: boolean;
  };
  updatePreferences: (
    updates: Partial<{
      dailyReminder: boolean;
      gpsGeofencing: boolean;
      heritageEvents: boolean;
      locationAccess: "always" | "while_using" | "never";
      publicProfile: boolean;
    }>
  ) => void;
  selectedPresetId?: string;
  selectGpsPreset?: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_JOURNEY_LOGS: JourneyLogItem[] = [
  {
    id: "log-1",
    placeVi: "Bến Nhà Rồng",
    placeEn: "Dragon Wharf",
    descVi: "Khởi hành tìm kiếm kỷ vật & hoàn thành giải đố 1911",
    descEn: "Embarked on relic hunt & completed the 1911 chronicle puzzle",
    timeVi: "Hôm nay",
    timeEn: "Today",
    expReward: 150,
    color: "#8B1E1E",
  },
  {
    id: "log-2",
    placeVi: "Dinh Độc Lập",
    placeEn: "Independence Palace",
    descVi: "Nghe thuyết minh chiến dịch Hồ Chí Minh lịch sử",
    descEn: "Listened to the historic Ho Chi Minh Campaign audio guide",
    timeVi: "Hôm qua",
    timeEn: "Yesterday",
    expReward: 120,
    color: "#2E5A44",
  },
  {
    id: "log-3",
    placeVi: "Hầm Biệt Động Sài Gòn",
    placeEn: "Saigon Commando Bunker",
    descVi: "Khám phá căn hầm bí mật chứa vũ khí nội đô năm 1968",
    descEn: "Explored the secret 1968 inner-city weapons bunker",
    timeVi: "3 ngày trước",
    timeEn: "3 days ago",
    expReward: 180,
    color: "#B48327",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { data: cmsData, addOrUpdateLocation: cmsAddOrUpdate } = useHeritageCms();
  const [lang, setLang] = useState<LanguageCode>("vi");
  const [savedSiteIds, setSavedSiteIds] = useState<string[]>([
    "ben-nha-rong",
    "dinh-doc-lap",
    "ham-biet-dong",
  ]);
  const [journeyLogs, setJourneyLogs] = useState<JourneyLogItem[]>(INITIAL_JOURNEY_LOGS);

  const [user, setUser] = useState({
    name: "Lê Toàn Hiếu",
    initials: "TH",
    level: 4,
    levelTitleVi: "Học giả Trẻ",
    levelTitleEn: "Young Scholar",
    exp: 1450,
    maxExp: 2000,
    mottoVi: "Tự hào gìn giữ ký ức lịch sử hào hùng của dân tộc Việt Nam.",
    mottoEn: "Proudly preserving the heroic historical memories of Vietnam.",
    equippedBadgeId: "dong-son",
    equippedBadgeTitleVi: "SỨ GIẢ KÝ ỨC ĐÔNG SƠN",
    equippedBadgeTitleEn: "DONG SON MEMORY ENVOY",
    selectedCompanionId: "chien-si",
    unlockedSitesCount: 6,
    badgesCount: 3,
    companionsCount: 5,
    isAuthenticated: true,
  });

  // Legacy state
  const [currentTab, setCurrentTab] = useState<AppTab>("map");
  const [profileSubScreen, setProfileSubScreen] = useState<ProfileSubScreen>("overview");
  const [currentGps, setCurrentGps] = useState<Coordinates>({ lat: 10.76828, lng: 106.70678 });
  const [currentGpsPreset, setCurrentGpsPreset] = useState<GpsPreset>(GPS_PRESETS[0]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-ben-nha-rong-close");
  const [playerHeading, setPlayerHeading] = useState<number>(45);
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);
  const [desktopViewMode, setDesktopViewMode] = useState<"dashboard" | "mobile_simulator">("dashboard");
  const [isGpsControllerOpen, setIsGpsControllerOpen] = useState<boolean>(false);
  const [isArModeActive, setIsArModeActive] = useState<boolean>(false);
  const [arTargetLocation, setArTargetLocation] = useState<HistoricalLocation | null>(null);

  const [stories] = useState<HistoricalStory[]>(MOCK_STORIES);
  const [activePlayingStory, setActivePlayingStory] = useState<HistoricalStory | null>(null);
  const [activeStageNumber, setActiveStageNumber] = useState<number | null>(null);
  const [badges] = useState<Badge[]>(MOCK_BADGES);

  const [allAccounts, setAllAccounts] = useState<AccountProfile[]>(INITIAL_ACCOUNTS);
  const [currentAccount, setCurrentAccount] = useState<AccountProfile>(INITIAL_ACCOUNTS[0]);
  const [visitedVeteranIds, setVisitedVeteranIds] = useState<string[]>([]);
  const [completedCampaignIds, setCompletedCampaignIds] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("🇻🇳 Tiếng Việt");

  const [activeAudioWitness, setActiveAudioWitness] = useState<WitnessStory | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAudioOverride, setActiveAudioOverride] = useState<{
    title: string;
    speaker?: string;
    textScript: string;
    uploadedAudioUrl?: string;
  } | null>(null);

  const [toast, setToast] = useState<ToastData | null>(null);

  const [preferences, setPreferences] = useState<{
    dailyReminder: boolean;
    gpsGeofencing: boolean;
    heritageEvents: boolean;
    locationAccess: "always" | "while_using" | "never";
    publicProfile: boolean;
  }>({
    dailyReminder: true,
    gpsGeofencing: true,
    heritageEvents: true,
    locationAccess: "while_using",
    publicProfile: true,
  });

  const showToast = useCallback(
    (title: string, description: string, type: "gold" | "cinnabar" | "emerald" = "gold") => {
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

  // Khôi phục ngôn ngữ lưu trên trình duyệt
  useEffect(() => {
    try {
      const savedLang = window.localStorage.getItem("lk_lang") as LanguageCode | null;
      if (savedLang === "vi" || savedLang === "en") {
        setLang(savedLang);
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  const handleSetLang = (nextLang: LanguageCode) => {
    setLang(nextLang);
    try {
      window.localStorage.setItem("lk_lang", nextLang);
    } catch {
      // Bỏ qua
    }
  };

  const toggleSaveSite = (siteId: string) => {
    setSavedSiteIds((prev) =>
      prev.includes(siteId) ? prev.filter((id) => id !== siteId) : [...prev, siteId]
    );
  };

  const equipBadge = (badgeId: string, titleVi: string, titleEn: string) => {
    setUser((prev) => ({
      ...prev,
      equippedBadgeId: badgeId,
      equippedBadgeTitleVi: titleVi.toUpperCase(),
      equippedBadgeTitleEn: titleEn.toUpperCase(),
    }));
  };

  const selectCompanion = (companionId: string) => {
    setUser((prev) => ({ ...prev, selectedCompanionId: companionId }));
  };

  const addExpAndLog = (
    placeVi: string,
    placeEn: string,
    descVi: string,
    descEn: string,
    expGain: number
  ) => {
    setUser((prev) => {
      const nextExp = prev.exp + expGain;
      const leveledUp = nextExp >= prev.maxExp;
      return {
        ...prev,
        level: leveledUp ? prev.level + 1 : prev.level,
        exp: leveledUp ? nextExp - prev.maxExp : nextExp,
      };
    });

    const newLog: JourneyLogItem = {
      id: `log-${Date.now()}`,
      placeVi,
      placeEn,
      descVi,
      descEn,
      timeVi: "Vừa xong",
      timeEn: "Just now",
      expReward: expGain,
      color: "#8B1E1E",
    };
    setJourneyLogs((prev) => [newLog, ...prev]);
  };

  const loginUser = (name: string) => {
    const parts = name.trim().split(" ");
    const initials =
      parts.length >= 2
        ? `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    setUser((prev) => ({
      ...prev,
      name,
      initials,
      isAuthenticated: true,
    }));
    showToast(`Đã xác thực Hộ chiếu: ${name}`, "Chào mừng Người Gìn Giữ Di Sản trở lại!", "emerald");
  };

  const logoutUser = () => {
    setUser((prev) => ({ ...prev, isAuthenticated: false }));
    showToast("Đã đóng Sổ Hộ Chiếu", "Hẹn gặp lại bạn trong hành trình kế tiếp.", "gold");
  };

  // Đồng bộ Unified Locations
  const unifiedLocations: (CmsLocationItem & HistoricalLocation)[] = useMemo(() => {
    const cmsList = cmsData?.locations || [];
    return cmsList.map((loc) => {
      const mock = MOCK_LOCATIONS.find((m) => m.id === loc.id) || MOCK_LOCATIONS[0];
      return {
        ...mock,
        ...loc,
        id: loc.id,
        name: loc.nameVi || mock.name,
        nameVi: loc.nameVi || mock.name,
        nameEn: loc.nameEn || mock.subtitle,
        subtitle: loc.nameEn || mock.subtitle,
        year: loc.year || mock.yearEstablished || "1975",
        yearEstablished: loc.year || mock.yearEstablished || "1975",
        lat: loc.lat ?? mock.coordinates.lat,
        lng: loc.lng ?? mock.coordinates.lng,
        coordinates: { lat: loc.lat ?? mock.coordinates.lat, lng: loc.lng ?? mock.coordinates.lng },
        descriptionVi: loc.descriptionVi || mock.fullDescription,
        descriptionEn: loc.descriptionEn || mock.historicalSummary,
        historicalSummary: loc.descriptionEn || mock.historicalSummary,
        fullDescription: loc.descriptionVi || mock.fullDescription,
        imageUrl: loc.imageUrl || mock.imageUrl,
        buildingType: loc.buildingType || "nharong",
        rarity: mock.rarity || "uncommon",
        contentType: mock.contentType || "landmark",
        address: mock.address || "TP. Hồ Chí Minh",
        discoveryRadius: mock.discoveryRadius || 5.0,
        interactionRadius: mock.interactionRadius || 50,
        historicalPeriod: mock.historicalPeriod || "Thời kỳ Kháng chiến",
        witnessStory: mock.witnessStory,
        storyChallengeIds: mock.storyChallengeIds || [],
        rewardExp: mock.rewardExp || 200,
        tags: mock.tags || ["Di tích", "Lịch sử"],
        distanceMeters: loc.distanceMeters ?? 0,
      };
    });
  }, [cmsData?.locations]);

  // Đồng bộ Unified Veterans
  const unifiedVeterans: (CmsVeteranItem & any)[] = useMemo(() => {
    const cmsList = cmsData?.veterans || [];
    return cmsList.map((vet) => {
      const mock = INITIAL_VETERANS.find((m) => m.id === vet.id) || INITIAL_VETERANS[0];
      return {
        ...mock,
        ...vet,
        id: vet.id,
        name: vet.name,
        birthYear: Number(vet.birthYear) || 1928,
        rankVi: vet.rankVi,
        rankEn: vet.rankEn,
        unitVi: vet.unitVi,
        unitEn: vet.unitEn,
        role: vet.rankVi,
        unit: vet.unitVi,
        portraitUrl: vet.portraitUrl,
        avatarUrl: vet.portraitUrl,
        memoirVi: vet.memoirVi,
        memoirEn: vet.memoirEn,
        eventImages: vet.eventImages || [],
      };
    });
  }, [cmsData?.veterans]);

  const [selectedLocation, setSelectedLocation] = useState<HistoricalLocation | null>(null);

  const getLocationProximity = useCallback(
    (location: HistoricalLocation): LocationProximity => {
      const locLat = location.coordinates?.lat ?? 10.7683;
      const locLng = location.coordinates?.lng ?? 106.7068;
      const dist = geoCalc(currentGps.lat, currentGps.lng, locLat, locLng);
      const bearing = calculateBearing(currentGps, { lat: locLat, lng: locLng });
      const discoveryRadiusMeters = (location.discoveryRadius || 5.0) * 1000;
      const interactionRadiusMeters = location.interactionRadius || 50;

      return {
        distanceMeters: dist,
        distanceFormatted: formatDistance(dist),
        inDiscoveryRadius: dist <= discoveryRadiusMeters,
        inInteractionRadius: dist <= interactionRadiusMeters,
        bearing,
      };
    },
    [currentGps]
  );

  const teleportToPreset = useCallback((preset: GpsPreset) => {
    setCurrentGps(preset.coordinates);
    setCurrentGpsPreset(preset);
    setSelectedPresetId(preset.id);
  }, []);

  const offsetGps = useCallback((deltaLat: number, deltaLng: number) => {
    setCurrentGps((prev) => ({
      lat: prev.lat + deltaLat,
      lng: prev.lng + deltaLng,
    }));
  }, []);

  const setGpsCoordinates = useCallback((coords: Coordinates) => {
    setCurrentGps(coords);
  }, []);

  const addOrUpdateLocation = useCallback(
    (loc: HistoricalLocation | CmsLocationItem) => {
      if ("nameVi" in loc) {
        cmsAddOrUpdate(loc);
      } else {
        cmsAddOrUpdate({
          id: loc.id,
          nameVi: loc.name,
          nameEn: loc.subtitle || loc.name,
          year: loc.yearEstablished || "1975",
          lat: loc.coordinates.lat,
          lng: loc.coordinates.lng,
          distanceMeters: 0,
          descriptionVi: loc.fullDescription || loc.historicalSummary,
          descriptionEn: loc.historicalSummary,
          imageUrl: loc.imageUrl,
          buildingType: "dinhdoclap",
        });
      }
    },
    [cmsAddOrUpdate]
  );

  const removeLocation = useCallback((_id: string) => {}, []);

  const reloadLocationsFromApi = useCallback(async () => {}, []);

  const completeStoryStage = useCallback((_storyId: string, _stageNumber: number) => {}, []);

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const visitLocation = useCallback((_locationId: string) => {}, []);

  const togglePlayAudio = useCallback((witness?: WitnessStory) => {
    if (witness) {
      setActiveAudioWitness(witness);
      setIsPlayingAudio((prev) => !prev);
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
    setArTargetLocation(null);
  }, []);

  const loginAsDemoUser = useCallback(() => {
    loginUser("Lê Toàn Hiếu");
  }, []);

  const loginAsAccount = useCallback((account: AccountProfile) => {
    setCurrentAccount(account);
    loginUser(account.displayName);
  }, []);

  const visitVeteran = useCallback((_veteranId: string) => {}, []);

  const onPlayVeteranAudio = useCallback((_vet: VeteranProfile) => {}, []);

  const completeCampaign = useCallback((campaignId: string) => {
    setCompletedCampaignIds((prev) => [...prev, campaignId]);
  }, []);

  const saveCustomPin = useCallback((_pin: CustomLocationPin) => {}, []);
  const deleteCustomPin = useCallback((_id: string) => {}, []);
  const saveVeteranProfile = useCallback((_vet: VeteranProfile) => {}, []);

  const updatePreferences = useCallback((updates: Partial<typeof preferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        user,
        locations: unifiedLocations,
        veterans: unifiedVeterans,
        savedSiteIds,
        journeyLogs,
        toggleSaveSite,
        equipBadge,
        selectCompanion,
        addExpAndLog,
        loginUser,
        logoutUser,

        // Legacy bindings
        currentTab,
        setCurrentTab,
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
        setLocations: () => {},
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
        profileSubScreen,
        setProfileSubScreen,
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
        isAuthenticated: user.isAuthenticated,
        login: (email?: string) => loginUser(user.name || email || "Lê Toàn Hiếu"),
        logout: logoutUser,
        loginAsDemoUser,
        currentAccount,
        setCurrentAccount,
        allAccounts,
        loginAsAccount,
        setVeterans: () => {},
        visitedVeteranIds,
        visitVeteran,
        onPlayVeteranAudio,
        activeAudioOverride,
        setActiveAudioOverride,
        completedCampaignIds,
        completeCampaign,
        saveCustomPin,
        deleteCustomPin,
        saveVeteranProfile,
        language,
        setLanguage,
        preferences,
        updatePreferences,
        selectedPresetId,
        selectGpsPreset: (id: string) => {
          setSelectedPresetId(id);
          const found = GPS_PRESETS.find((p) => p.id === id);
          if (found) setCurrentGps(found.coordinates);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext phải được sử dụng bên trong AppProvider");
  }
  return context;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp phải được sử dụng bên trong AppProvider");
  }
  return context;
}
