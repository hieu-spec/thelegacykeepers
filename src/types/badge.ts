import { LocationRarity } from './location';

export type BadgeCategory = 'conqueror' | 'explorer' | 'campaign' | 'heritage';

export interface Badge {
  id: string;
  name: string;
  titleBadge: string;
  category: BadgeCategory;
  rarity: LocationRarity;
  description: string;
  howToUnlock: string;
  iconName: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  bonusExp: number;
}
