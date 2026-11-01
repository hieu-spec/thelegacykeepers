// src/components/radar/MinimalHeritageMap.tsx
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type * as LType from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, BookOpen, Compass, ArrowUpRight } from 'lucide-react';
import {
  VIETNAM_GEO_BOUNDS,
  SINGLE_MINIMAL_MAP_TILE,
  V18_PASTEL_RARITY,
} from '@/constants/minimalTheme';
import { calculateDistanceMeters } from '@/utils/geo';
import { useHeritageGeolocation } from '@/hooks/useHeritageGeolocation';

export interface HeritagePinItem {
  id: string;
  name: string;
  era: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  latitude: number;
  longitude: number;
  discoveryRadius: number;
  interactionRadius: number;
  shortDescription: string;
}

interface MinimalHeritageMapProps {
  locations: HeritagePinItem[];
  onSelectLocation: (loc: HeritagePinItem) => void;
  compactMobile?: boolean;
}

export default function MinimalHeritageMap({
  locations,
  onSelectLocation,
  compactMobile = false,
}: MinimalHeritageMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<typeof LType | null>(null);
  const mapInstanceRef = useRef<LType.Map | null>(null);
  const markersLayerRef = useRef<LType.LayerGroup | null>(null);

  const { coords, switchToRealGps } = useHeritageGeolocation();
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedPin, setSelectedPin] = useState<HeritagePinItem | null>(locations[0] || null);
  const [isDraggingMap, setIsDraggingMap] = useState(false);

  const enrichedLocations = useMemo(() => {
    return locations.map((loc) => {
      const distance = calculateDistanceMeters(
        coords.lat,
        coords.lng,
        loc.latitude,
        loc.longitude
      );
      return {
        ...loc,
        distance,
        isWithinDiscovery: distance <= (loc.discoveryRadius || 200),
        isWithinInteraction: distance <= (loc.interactionRadius || 60),
      };
    });
  }, [locations, coords.lat, coords.lng]);

  // 1. Nạp động thư viện Leaflet CHỈ TRÊN TRÌNH DUYỆT (Chặn đứng lỗi window is not defined)
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((LModule) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      const L = LModule.default || LModule;
      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 15,
        minZoom: 6,
        maxZoom: 18,
        maxBounds: VIETNAM_GEO_BOUNDS,
        maxBoundsViscosity: 0.95,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(SINGLE_MINIMAL_MAP_TILE.url, {
        noWrap: true,
        bounds: VIETNAM_GEO_BOUNDS,
        maxZoom: 18,
        className: 'minimal-grayscale-tiles',
      }).addTo(map);

      map.on('movestart', () => setIsDraggingMap(true));
      map.on('moveend', () => setIsDraggingMap(false));

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      setIsMapReady(true);

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Vẽ các Pin Di tích sau khi Leaflet đã khởi tạo xong trên Client
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!isMapReady || !L || !map || !layerGroup) return;

    layerGroup.clearLayers();

    // Chấm vị trí hiện tại của người dùng
    L.circleMarker([coords.lat, coords.lng], {
      radius: 8,
      fillColor: '#18181B',
      color: '#FFFFFF',
      weight: 3,
      fillOpacity: 1,
    }).addTo(layerGroup);

    enrichedLocations.forEach((loc) => {
      const isSelected = selectedPin?.id === loc.id;

      if (loc.isWithinDiscovery || isSelected) {
        L.circle([loc.latitude, loc.longitude], {
          radius: loc.interactionRadius || 60,
          color: '#18181B',
          weight: 1.2,
          dashArray: '4 4',
          fillColor: '#EDE9FE',
          fillOpacity: 0.3,
        }).addTo(layerGroup);
      }

      const pinHtml = `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid ${isSelected ? '#18181B' : '#E4E4E7'};
          background: ${isSelected ? '#18181B' : '#FFFFFF'};
          color: ${isSelected ? '#FFFFFF' : '#18181B'};
          transform: translate(-50%, -50%);
        ">
          <span style="width: 7px; height: 7px; border-radius: 9999px; background: ${
            loc.rarity === 'legendary' ? '#8B5CF6' : loc.rarity === 'rare' ? '#EC4899' : '#10B981'
          };"></span>
          <span>${loc.name}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: '',
        iconSize: [0, 0],
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });
      marker.on('click', () => {
        setSelectedPin(loc);
        map.flyTo([loc.latitude, loc.longitude], 16, { duration: 0.7 });
      });
      marker.addTo(layerGroup);
    });
  }, [isMapReady, enrichedLocations, coords.lat, coords.lng, selectedPin]);

  const handleFocusLocation = (loc: HeritagePinItem) => {
    setSelectedPin(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 16, { duration: 0.8 });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <style>{`
        .minimal-grayscale-tiles {
          filter: grayscale(88%) contrast(96%) brightness(103%);
        }
      `}</style>

      <div
        className={`relative w-full ${
          compactMobile ? 'h-[360px]' : 'h-[520px]'
        } rounded-3xl overflow-hidden border border-zinc-200/80 bg-[#E5E7EB] shadow-2xs`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Thanh trạng thái góc trên */}
        <div
          className={`absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2 transition-opacity duration-200 ${
            isDraggingMap ? 'opacity-25 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200/80 shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-900">
              Bản đồ Di sản Việt Nam
            </span>
          </div>

          <button
            onClick={() => {
              switchToRealGps();
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 0.7 });
              }
            }}
            className="px-3 py-1.5 rounded-full bg-[#18181B] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs hover:bg-zinc-800 transition"
          >
            <Navigation size={12} />
            <span>Vị trí của tôi</span>
          </button>
        </div>

        {/* Thẻ chi tiết Di tích đang chọn */}
        {selectedPin && (
          <div
            className={`absolute bottom-3.5 left-3.5 right-3.5 md:left-auto md:w-96 z-10 bg-white p-3.5 rounded-2xl border border-zinc-200/90 shadow-lg transition-opacity duration-200 ${
              isDraggingMap ? 'opacity-30' : 'opacity-100'
            }`}
          >
            <div
              className={`p-3 rounded-xl flex items-start justify-between gap-3 ${
                V18_PASTEL_RARITY[selectedPin.rarity]?.bgBox || 'bg-[#F1F5F9]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <MapPin size={17} className="text-[#18181B]" />
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#18181B] text-white text-[10px] font-medium mb-1">
                    Năm {selectedPin.era}
                  </span>
                  <h3 className="font-semibold text-sm text-zinc-900 leading-snug">
                    {selectedPin.name}
                  </h3>
                  <p className="text-[11px] text-zinc-600 line-clamp-2 mt-0.5">
                    {selectedPin.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2.5 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                Khoảng cách:{' '}
                <strong className="text-zinc-900">
                  {Math.round(
                    calculateDistanceMeters(
                      coords.lat,
                      coords.lng,
                      selectedPin.latitude,
                      selectedPin.longitude
                    )
                  )}
                  m
                </strong>
              </span>
              <button
                onClick={() => onSelectLocation(selectedPin)}
                className="px-3.5 py-1.5 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-zinc-800 transition flex items-center gap-1"
              >
                <BookOpen size={12} />
                <span>Giải mã Lịch sử</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Thanh chọn nhanh điểm di tích dưới bản đồ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {enrichedLocations.map((loc) => {
          const isCurrent = selectedPin?.id === loc.id;
          const theme = V18_PASTEL_RARITY[loc.rarity];
          return (
            <button
              key={loc.id}
              onClick={() => handleFocusLocation(loc)}
              className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                isCurrent
                  ? 'bg-white border-[#18181B] shadow-xs'
                  : 'bg-white/70 border-zinc-200/70 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl ${theme.bgBox} flex items-center justify-center shrink-0`}>
                  <Compass size={18} className={theme.iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 truncate">{loc.name}</p>
                  <p className="text-[11px] text-zinc-500">
                    Mốc {loc.era} • Cách {Math.round(loc.distance)}m
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 shrink-0">
                Xem
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { MinimalHeritageMap };
