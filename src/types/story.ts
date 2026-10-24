export type CardType = 'setting' | 'character' | 'item';

export interface StorytellerCard {
  id: string;
  type: CardType;
  name: string;
  title: string;
  iconName: string;
  description: string;
  period?: string;
  avatar?: string;
  tag?: string;
  bgGradient?: string;
}

export interface PanelReaction {
  characterName: string;
  mood: 'heroic' | 'determined' | 'happy' | 'confused' | 'struggling';
  dialogue: string;
  statusNote: string;
}

export interface StagePanelRule {
  panelIndex: number;
  requiredSettingId: string;
  requiredCharacterOrItemId: string;
  hint: string;
  correctReaction: PanelReaction;
  wrongExplanation: string;
}

export interface StorytellerPanelState {
  setting: StorytellerCard | null;
  characterOrItem: StorytellerCard | null;
}

export interface FullStoryRecap {
  headline: string;
  paragraphs: string[];
  quote?: string;
  author?: string;
}

export interface StoryStage {
  stageNumber: number; // 1, 2, 3
  stageTitle: string;
  missionGoal: string; // E.g. "Hãy tái hiện hành trình Ra đi tìm đường cứu nước ngày 5/6/1911"
  synopsis: string;
  targetSlotCount: number; // 3 or 4
  clue: string;
  rewardExp: number;
  rewardBadgeId?: string;
  rewardBadgeName?: string;
  
  // Storyteller Cards
  availableSettings: StorytellerCard[];
  availableCharactersAndItems: StorytellerCard[];
  panelRules: StagePanelRule[];

  // Historical Narrative
  historicalLesson: string;
  fullStoryRecap: FullStoryRecap;

  // Legacy compatibility
  fragments?: StoryFragment[];
  correctSequence?: string[];
}

export interface StoryFragment {
  id: string;
  order: number;
  title: string;
  year?: string;
  description: string;
  iconName: string;
  tag: string;
}

export interface HistoricalStory {
  id: string;
  locationId: string;
  locationName: string;
  title: string;
  period: string;
  totalStages: number;
  currentStage: number; // 1, 2, 3
  isUnlocked: boolean;
  isCompleted: boolean;
  coverImage: string;
  description: string;
  stages: StoryStage[];
}
