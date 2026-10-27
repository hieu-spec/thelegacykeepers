// src/types/storyteller.ts

export interface PlacedCard {
  id: string;
  type: 'setting' | 'character' | 'item';
  tags?: string[];
}

export interface FlexibleStagePanelRule {
  slotIndex: number;
  // Hỗ trợ kiểm tra theo ID cụ thể HOẶC theo tập hợp nhãn (tags) lịch sử
  acceptedSettingIds?: string[];
  acceptedSettingTags?: string[];
  requiredCharacterIds?: string[];
  requiredCharacterTags?: string[];
  resultingMood: 'heroic' | 'determined' | 'struggling' | 'happy' | 'confused';
  dialogueText: string;
}

export function validatePanelSlot(
  setting: PlacedCard | null,
  characters: PlacedCard[],
  rule: FlexibleStagePanelRule
): boolean {
  if (!setting) return false;

  const settingValid =
    (rule.acceptedSettingIds?.includes(setting.id) ?? false) ||
    (rule.acceptedSettingTags?.some((tag) => setting.tags?.includes(tag)) ?? false);

  if (!settingValid) return false;

  const charIdsValid =
    !rule.requiredCharacterIds?.length ||
    rule.requiredCharacterIds.every((reqId) => characters.some((c) => c.id === reqId));

  const charTagsValid =
    !rule.requiredCharacterTags?.length ||
    rule.requiredCharacterTags.every((reqTag) =>
      characters.some((c) => c.tags?.includes(reqTag))
    );

  return charIdsValid && charTagsValid;
}
