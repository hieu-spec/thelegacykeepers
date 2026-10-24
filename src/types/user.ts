export interface UserStats {
  locationsDiscovered: number;
  totalLocations: number;
  fragmentsRestored: number;
  totalFragments: number;
  badgesEarned: number;
  totalBadges: number;
  totalExploredKm: number;
  witnessStoriesListened: number;
}

export interface UserProfile {
  name: string;
  displayName?: string;
  username: string;
  avatarUrl: string;
  titleLevel: string; // "Historical Explorer · Cấp 05"
  level: number;
  currentExp: number;
  nextLevelExp: number;
  bio: string;
  location: string; // e.g. "TP. Hồ Chí Minh"
  joinedDate: string; // e.g. "15/10/2026"
  visitedLocationIds: string[];
  completedStoryIds: string[];
  unlockedBadgeIds: string[];
  savedWitnessIds: string[];
  stats: UserStats;
}
