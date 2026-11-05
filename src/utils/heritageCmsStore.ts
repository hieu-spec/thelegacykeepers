// src/utils/heritageCmsStore.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export interface CmsLocationItem {
  id: string;
  nameVi: string;
  nameEn: string;
  year: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  descriptionVi: string;
  descriptionEn: string;
  imageUrl: string;
  buildingType: "nharong" | "dinhdoclap" | "ham" | "mieuba";
}

export interface CmsVeteranItem {
  id: string;
  name: string;
  birthYear: number;
  rankVi: string;
  rankEn: string;
  unitVi: string;
  unitEn: string;
  portraitUrl: string;
  memoirVi: string;
  memoirEn: string;
  eventImages: {
    id: string;
    url: string;
    captionVi: string;
    captionEn: string;
    year: string;
  }[];
}

export interface CmsUserProfile {
  fullName: string;
  initials: string;
  level: number;
  levelTitleVi: string;
  levelTitleEn: string;
  exp: number;
  maxExp: number;
  equippedBadgeVi: string;
  equippedCompanionId: string;
  mottoVi: string;
  unlockedSitesCount: number;
  badgesCount: number;
  companionsCount: number;
}

export interface HeritageCmsDatabase {
  locations: CmsLocationItem[];
  veterans: CmsVeteranItem[];
  userProfile: CmsUserProfile;
}

const DB_NAME = "LegacyKeepersHeritageDB";
const DB_VERSION = 1;
const STORE_NAME = "cms_state";
const STATE_KEY = "root_heritage_data_v19";

const DEFAULT_CMS_DATA: HeritageCmsDatabase = {
  userProfile: {
    fullName: "Lê Toàn Hiếu",
    initials: "TH",
    level: 4,
    levelTitleVi: "Học giả Trẻ",
    levelTitleEn: "Young Scholar",
    exp: 1450,
    maxExp: 2000,
    equippedBadgeVi: "SỨ GIẢ KÝ ỨC ĐÔNG SƠN",
    equippedCompanionId: "chien-si",
    mottoVi: "Tự hào gìn giữ ký ức lịch sử hào hùng của dân tộc Việt Nam.",
    unlockedSitesCount: 6,
    badgesCount: 3,
    companionsCount: 5,
  },
  locations: [
    {
      id: "ben-nha-rong",
      nameVi: "Bến Nhà Rồng",
      nameEn: "Dragon Wharf",
      year: "1911",
      lat: 10.7683,
      lng: 106.7068,
      distanceMeters: 0,
      descriptionVi: "Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước (05/06/1911).",
      descriptionEn: "Where young Nguyen Tat Thanh departed to seek national salvation (05/06/1911).",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      buildingType: "nharong",
    },
    {
      id: "dinh-doc-lap",
      nameVi: "Dinh Độc Lập",
      nameEn: "Independence Palace",
      year: "1975",
      lat: 10.7769,
      lng: 106.6953,
      distanceMeters: 1579,
      descriptionVi: "Di tích Quốc gia Đặc biệt ghi dấu thời khắc thống nhất đất nước trưa 30/04/1975.",
      descriptionEn: "Special National Monument marking Reunification Day at noon on April 30, 1975.",
      imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80",
      buildingType: "dinhdoclap",
    },
    {
      id: "ham-biet-dong",
      nameVi: "Hầm Biệt Động Sài Gòn",
      nameEn: "Saigon Commando Bunker",
      year: "1968",
      lat: 10.7721,
      lng: 106.6882,
      distanceMeters: 2075,
      descriptionVi: "Căn hầm bí mật cất giấu vũ khí của lực lượng Biệt động Sài Gòn năm Mậu Thân 1968.",
      descriptionEn: "Secret underground weapons vault of the Saigon Commandos during the 1968 Tet Offensive.",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
      buildingType: "ham",
    },
  ],
  veterans: [
    {
      id: "vet-1",
      name: "Đại tá Nguyễn Văn Tàu (Tư Cang)",
      birthYear: 1928,
      rankVi: "Anh hùng Lực lượng Vũ trang Nhân dân",
      rankEn: "Hero of the People's Armed Forces",
      unitVi: "Cụm trưởng Cụm Tình báo H.63",
      unitEn: "Commander of Intelligence Cluster H.63",
      portraitUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      memoirVi:
        "Khi nhìn lá cờ Giải phóng tung bay trên nóc Dinh Độc Lập trưa 30 tháng 4, nước mắt tôi trào ra nhớ về những đồng đội đã ngã xuống trước ngày toàn thắng.",
      memoirEn:
        "Seeing the Liberation banner flying atop the Independence Palace at noon on April 30 brought tears to my eyes for my fallen comrades.",
      eventImages: [
        {
          id: "ev-1",
          url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
          captionVi: "Hội ngộ đồng đội Cụm tình báo H.63 tại Dinh Độc Lập",
          captionEn: "H.63 Intelligence Cluster reunion at Independence Palace",
          year: "1975",
        },
      ],
    },
  ],
};

// Các hàm thao tác với IndexedDB (Hỗ trợ lưu trữ hàng trăm MB ảnh Base64)
function openHeritageDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readFromIndexedDb(): Promise<HeritageCmsDatabase | null> {
  try {
    const db = await openHeritageDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(STATE_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function writeToIndexedDb(data: HeritageCmsDatabase): Promise<void> {
  try {
    const db = await openHeritageDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(data, STATE_KEY);
      tx.oncomplete = () => {
        window.dispatchEvent(new CustomEvent("heritage-cms-updated"));
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Không thể ghi vào IndexedDB:", err);
  }
}

export function useHeritageCms() {
  const [data, setData] = useState<HeritageCmsDatabase>(DEFAULT_CMS_DATA);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    const stored = await readFromIndexedDb();
    if (stored) {
      setData(stored);
    } else {
      await writeToIndexedDb(DEFAULT_CMS_DATA);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadData();
    const handleSync = () => {
      readFromIndexedDb().then((stored) => {
        if (stored) setData(stored);
      });
    };
    window.addEventListener("heritage-cms-updated", handleSync);
    return () => window.removeEventListener("heritage-cms-updated", handleSync);
  }, [loadData]);

  const addOrUpdateLocation = async (loc: CmsLocationItem) => {
    const exists = data.locations.some((item) => item.id === loc.id);
    const updatedLocations = exists
      ? data.locations.map((item) => (item.id === loc.id ? loc : item))
      : [...data.locations, loc];
    const nextState = { ...data, locations: updatedLocations };
    setData(nextState);
    await writeToIndexedDb(nextState);
  };

  const addVeteranPhoto = async (
    veteranId: string,
    photo: { url: string; captionVi: string; captionEn: string; year: string },
    asPortrait = false
  ) => {
    const updatedVeterans = data.veterans.map((vet) => {
      if (vet.id !== veteranId) return vet;
      if (asPortrait) {
        return { ...vet, portraitUrl: photo.url };
      }
      return {
        ...vet,
        eventImages: [
          { id: `ev-${Date.now()}`, ...photo },
          ...vet.eventImages,
        ],
      };
    });
    const nextState = { ...data, veterans: updatedVeterans };
    setData(nextState);
    await writeToIndexedDb(nextState);
  };

  const resetToDefault = async () => {
    setData(DEFAULT_CMS_DATA);
    await writeToIndexedDb(DEFAULT_CMS_DATA);
  };

  return {
    data,
    isLoaded,
    addOrUpdateLocation,
    addVeteranPhoto,
    resetToDefault,
  };
}

export async function loadLocationsFromIndexedDB(): Promise<any[] | null> {
  try {
    const dbData = await readFromIndexedDb();
    if (!dbData || !dbData.locations || dbData.locations.length === 0) {
      return null;
    }
    return dbData.locations.map((loc) => ({
      ...loc,
      name: loc.nameVi || loc.id,
      period: loc.year ? `Năm ${loc.year}` : "Di tích Lịch sử",
      address: "",
      description: loc.descriptionVi || "",
    }));
  } catch {
    return null;
  }
}

