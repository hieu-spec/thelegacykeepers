// src/components/map/MinimalHeritageMap.tsx
"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_LOCATIONS, HistoricalLocation } from "@/data/mockLocations";
import { loadLocationsFromIndexedDB } from "@/utils/heritageCmsStore";
import { useHeritageTTS } from "@/hooks/useHeritageTTS";

export type BasemapStyle = "editorial" | "voyager" | "satellite";

export const BASEMAPS: Record<
  BasemapStyle,
  { name: string; url: string; attribution: string; tileFilter: string }
> = {
  editorial: {
    name: "Giấy Kiến Trúc",
    // Dùng chung OpenStreetMap để có 100% chi tiết đường phố Việt Nam + Lọc màu giấy vẽ cổ điển
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    tileFilter: "sepia(0.7) contrast(0.92) brightness(1.03) saturate(0.55) hue-rotate(-8deg)",
  },
  voyager: {
    name: "Thực Địa Sắc Nét",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    tileFilter: "contrast(1.04) saturate(1.08)",
  },
  satellite: {
    name: "Không Ảnh Vệ Tinh",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
    tileFilter: "none",
  },
};

export interface MinimalHeritageMapProps {
  locations?: HistoricalLocation[];
  selectedLocationId?: string | null;
  onSelectLocation?: (loc: HistoricalLocation) => void;
  lang?: "vi" | "en";
  onOpenMinigame?: (siteId: string) => void;
  onDecodeHistory?: (siteId: string) => void;
  [key: string]: unknown;
}

export type HeritageSite = HistoricalLocation;
export type HeritageLandmark = HistoricalLocation;

export default function MinimalHeritageMap({
  locations: propLocations,
  selectedLocationId,
  onSelectLocation,
  lang = "vi",
  onOpenMinigame,
  onDecodeHistory,
}: MinimalHeritageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [internalLocations, setInternalLocations] = useState<HistoricalLocation[]>(MOCK_LOCATIONS);
  const [activeLoc, setActiveLoc] = useState<HistoricalLocation | null>(null);
  const [basemap, setBasemap] = useState<BasemapStyle>("voyager");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const { speak, stop, isSpeaking } = useHeritageTTS();

  // 1. Đồng bộ danh sách địa danh từ Props, IndexedDB và Server API
  useEffect(() => {
    if (propLocations && propLocations.length > 0) {
      setInternalLocations(propLocations);
      return;
    }
    let isMounted = true;
    async function syncData() {
      try {
        const localData = await loadLocationsFromIndexedDB();
        if (isMounted && localData && localData.length > 0) {
          setInternalLocations(localData as unknown as HistoricalLocation[]);
          return;
        }
      } catch (e) {
        console.warn("IndexedDB fallback to API/Mock:", e);
      }
      try {
        const res = await fetch("/api/locations");
        if (res.ok) {
          const data = await res.json();
          const list = data.locations || data.data;
          if (isMounted && Array.isArray(list) && list.length > 0) {
            setInternalLocations(list);
          }
        }
      } catch {
        // Giữ nguyên MOCK_LOCATIONS khi offline
      }
    }
    syncData();

    // Đọc danh sách di tích đã lưu
    try {
      const saved = JSON.parse(localStorage.getItem("lk_saved_locations") || "[]");
      if (Array.isArray(saved)) setSavedIds(saved);
    } catch {}

    return () => {
      isMounted = false;
    };
  }, [propLocations]);

  // 2. Khởi tạo Leaflet an toàn với React 19 Strict Mode + ResizeObserver
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Nếu instance cũ còn tồn tại (do React 19 Strict Mode), gỡ bỏ sạch trước khi tạo mới
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    const map = L.map(container, {
      center: [10.7769, 106.7009], // Trung tâm TP.HCM
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    const tile = L.tileLayer(BASEMAPS[basemap].url, {
      attribution: BASEMAPS[basemap].attribution,
      maxZoom: 19,
    }).addTo(map);

    const tilePane = map.getPane("tilePane");
    if (tilePane) tilePane.style.filter = BASEMAPS[basemap].tileFilter;

    const markersGroup = L.layerGroup().addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = tile;
    markersLayerRef.current = markersGroup;

    // Ép tính toán lại kích thước khung nhìn để không bị trắng bản đồ
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 3. Chuyển đổi lớp nền bản đồ (Basemap) & Áp màu Giấy Kiến Trúc riêng cho lớp gạch bản đồ
  useEffect(() => {
    const map = mapInstanceRef.current;
    const tileLayer = tileLayerRef.current;
    if (!map || !tileLayer) return;

    tileLayer.setUrl(BASEMAPS[basemap].url);

    // Chỉ áp bộ lọc màu lên lớp ảnh bản đồ (tilePane), giữ nguyên màu rực rỡ của Marker
    const tilePane = map.getPane("tilePane");
    if (tilePane) {
      tilePane.style.filter = BASEMAPS[basemap].tileFilter;
      tilePane.style.transition = "filter 0.3s ease";
    }
  }, [basemap]);

  // 4. Lọc địa danh theo từ khóa tìm kiếm
  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return internalLocations;
    return internalLocations.filter((l) => {
      const name = l.name?.toLowerCase() || "";
      const address = l.address?.toLowerCase() || "";
      const period = ((l as any).period || l.historicalPeriod || "").toLowerCase();
      return name.includes(q) || address.includes(q) || period.includes(q);
    });
  }, [internalLocations, searchQuery]);

  // 5. Vẽ hệ thống Marker Di sản lên bản đồ
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    filteredLocations.forEach((loc) => {
      const lat = Number(loc.coordinates?.lat ?? (loc as any).lat ?? (loc as any).latitude ?? 10.7769);
      const lng = Number(loc.coordinates?.lng ?? (loc as any).lng ?? (loc as any).longitude ?? 106.7009);
      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = activeLoc?.id === loc.id || selectedLocationId === loc.id;

      const customIcon = L.divIcon({
        className: "custom-heritage-marker",
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:38px;height:38px;">
            <span style="position:absolute;inset:0;border-radius:9999px;background:${
              isSelected ? "rgba(180,131,39,0.45)" : "rgba(139,30,30,0.3)"
            };animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <div style="position:relative;z-index:10;width:${isSelected ? "34px" : "28px"};height:${
          isSelected ? "34px" : "28px"
        };border-radius:9999px;background:${
          isSelected ? "#B48327" : "#8B1E1E"
        };border:2.5px solid #F4EFE6;box-shadow:0 4px 12px rgba(43,33,24,0.45);display:flex;align-items:center;justify-content:center;color:#F4EFE6;font-weight:700;font-size:12px;">
              ★
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      marker.on("click", () => {
        setActiveLoc(loc);
        onSelectLocation?.(loc);
        map.flyTo([lat, lng], 16, { duration: 0.8 });
      });

      marker.addTo(markersGroup);
    });
  }, [filteredLocations, activeLoc, selectedLocationId, onSelectLocation]);

  const toggleSaveLocation = (id: string) => {
    const next = savedIds.includes(id) ? savedIds.filter((i) => i !== id) : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem("lk_saved_locations", JSON.stringify(next));
    window.dispatchEvent(new Event("lk-saved-updated"));
  };

  const getLocPeriod = (l: HistoricalLocation) =>
    (l as any).period || l.historicalPeriod || (lang === "vi" ? "Di tích Lịch sử" : "Historical Relic");

  const getLocDesc = (l: HistoricalLocation) =>
    (l as any).description || l.historicalSummary || l.fullDescription || "";

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-1px)] flex-1 bg-[#F4EFE6] overflow-hidden select-none">
      {/* Khung chứa bản đồ Leaflet */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Thanh công cụ tìm kiếm & Chuyển chế độ Bản đồ nổi bên trên */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-[#F4EFE6]/95 backdrop-blur-md border border-[#B48327]/40 rounded-xl px-3.5 py-2 shadow-lg w-full max-w-md">
          <span className="text-[#8B1E1E] mr-2 font-bold">⌕</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "vi"
                ? `Tìm kiếm trong ${internalLocations.length} di tích lịch sử...`
                : `Search ${internalLocations.length} heritage sites...`
            }
            className="w-full bg-transparent text-[#2B2118] placeholder-[#2B2118]/50 text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#8B1E1E] font-semibold ml-2 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bộ chuyển đổi 3 chế độ bản đồ */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#2B2118]/90 backdrop-blur-md p-1 rounded-xl border border-[#B48327]/40 shadow-lg">
          {(Object.keys(BASEMAPS) as BasemapStyle[]).map((key) => (
            <button
              key={key}
              onClick={() => setBasemap(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                basemap === key
                  ? "bg-[#B48327] text-[#2B2118] font-bold shadow"
                  : "text-[#F4EFE6]/80 hover:text-white"
              }`}
            >
              {BASEMAPS[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Thẻ thông tin chi tiết khi bấm vào một Di tích */}
      {activeLoc && (
        <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[400] bg-[#F4EFE6] border-2 border-[#B48327] rounded-2xl shadow-2xl p-5 text-[#2B2118]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#8B1E1E]/10 text-[#8B1E1E] rounded-full mb-1">
                {getLocPeriod(activeLoc)}
              </span>
              <h3 className="text-lg font-bold leading-snug text-[#2B2118]">{activeLoc.name}</h3>
            </div>
            <button
              onClick={() => {
                stop();
                setActiveLoc(null);
              }}
              className="w-7 h-7 rounded-full bg-[#2B2118]/10 hover:bg-[#2B2118]/20 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {activeLoc.imageUrl && (
            <img
              src={activeLoc.imageUrl}
              alt={activeLoc.name}
              className="w-full h-40 object-cover rounded-xl my-3 border border-[#B48327]/30"
            />
          )}

          <p className="text-xs text-[#2B2118]/80 line-clamp-4 leading-relaxed mb-4">
            {getLocDesc(activeLoc)}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const desc = getLocDesc(activeLoc);
                if (isSpeaking) {
                  stop();
                } else {
                  speak(`${activeLoc.name}. ${desc}`, lang);
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-[#8B1E1E] hover:bg-[#6e1616] text-[#F4EFE6] text-xs font-semibold transition cursor-pointer"
            >
              {isSpeaking ? "⏹ Dừng thuyết minh" : "🔊 Nghe thuyết minh"}
            </button>
            <button
              onClick={() => toggleSaveLocation(activeLoc.id)}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                savedIds.includes(activeLoc.id)
                  ? "bg-[#B48327] text-[#2B2118] border-[#B48327]"
                  : "border-[#2B2118]/30 text-[#2B2118] hover:bg-[#2B2118]/5"
              }`}
            >
              {savedIds.includes(activeLoc.id) ? "★ Đã lưu" : "☆ Lưu di tích"}
            </button>

            {(onOpenMinigame || onDecodeHistory) && (
              <button
                onClick={() => {
                  if (onOpenMinigame) onOpenMinigame(activeLoc.id);
                  else if (onDecodeHistory) onDecodeHistory(activeLoc.id);
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#2B2118] hover:bg-[#3D2F23] text-[#E6C786] border border-[#B48327] text-xs font-semibold transition cursor-pointer"
              >
                Giải mã Kỷ vật ↗
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { MinimalHeritageMap };
