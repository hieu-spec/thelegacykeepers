// src/utils/clientStorage.ts
import { HistoricalLocation } from '@/types/location';
import { MOCK_LOCATIONS } from '@/data/locations';

const STORAGE_KEY = 'legacy_keepers_locations_v1';

export function loadLocationsFromStorage(): HistoricalLocation[] {
  if (typeof window === 'undefined') return MOCK_LOCATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return MOCK_LOCATIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as HistoricalLocation[];
    }
    return MOCK_LOCATIONS;
  } catch {
    return MOCK_LOCATIONS;
  }
}

export function saveLocationsToStorage(locations: HistoricalLocation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (err) {
    console.error('Không thể lưu vào LocalStorage:', err);
  }
}
