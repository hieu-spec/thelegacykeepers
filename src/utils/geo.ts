// src/utils/geo.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_METERS = 6371e3; // 6,371 km

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

/**
 * Tính khoảng cách giữa 2 tọa độ GPS theo công thức Haversine (đơn vị: mét)
 * Hỗ trợ cả 2 dạng: calculateDistance(c1, c2) hoặc calculateDistance(lat1, lng1, lat2, lng2)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number;
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number;
export function calculateDistance(
  coord1OrLat1: Coordinates | number,
  coord2OrLng1: Coordinates | number,
  lat2?: number,
  lng2?: number
): number {
  let c1: Coordinates;
  let c2: Coordinates;
  if (typeof coord1OrLat1 === 'number' && typeof coord2OrLng1 === 'number') {
    c1 = { lat: coord1OrLat1, lng: coord2OrLng1 };
    c2 = { lat: lat2 ?? 0, lng: lng2 ?? 0 };
  } else {
    c1 = coord1OrLat1 as Coordinates;
    c2 = coord2OrLng1 as Coordinates;
  }

  const φ1 = toRadians(c1.lat);
  const φ2 = toRadians(c2.lat);
  const Δφ = toRadians(c2.lat - c1.lat);
  const Δλ = toRadians(c2.lng - c1.lng);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Alias cho calculateDistance (tương thích ngược với AppContext & MinimalHeritageMap)
 */
export const calculateDistanceMeters = calculateDistance;

/**
 * Tính khoảng cách theo đơn vị km
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  return calculateDistance(coord1, coord2) / 1000;
}

/**
 * Tính góc phương vị (Bearing) từ điểm A đến điểm B (0° - 360°, Bắc = 0°)
 */
export function calculateBearing(start: Coordinates, end: Coordinates): number {
  const φ1 = toRadians(start.lat);
  const φ2 = toRadians(end.lat);
  const Δλ = toRadians(end.lng - start.lng);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDegrees(θ) + 360) % 360;
}

/**
 * Tính độ lệch góc ngắn nhất (-180° đến +180°) giữa hướng người chơi và hướng mục tiêu
 */
export function calculateDeltaAngle(targetBearing: number, playerHeading: number): number {
  let delta = targetBearing - playerHeading;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

/**
 * Kiểm tra người dùng đã bước vào bán kính tương tác (Geofencing) hay chưa
 */
export function isWithinRadius(
  userCoord: Coordinates,
  targetCoord: Coordinates,
  radiusMeters: number = 100
): boolean {
  return calculateDistance(userCoord, targetCoord) <= radiusMeters;
}

/**
 * Định dạng hiển thị khoảng cách thân thiện (tiếng Việt)
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}
