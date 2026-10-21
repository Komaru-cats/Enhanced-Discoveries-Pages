/**
 * Metadata configuration for a predefined BACAP tab or tier.
 */
export interface BacapCategoryConfig {
  readonly key: string;
  readonly displayName: string;
  readonly color: string;
}

/**
 * Predefined 16 BACAP advancement tabs with their display titles and hex colors.
 */
export const BACAP_TAB_CONFIGS: Readonly<Record<string, BacapCategoryConfig>> = {
  adventure: { key: 'adventure', displayName: 'Adventure', color: '#FFD966' },
  animal: { key: 'animal', displayName: 'Animals', color: '#6AA84F' },
  bacap: { key: 'bacap', displayName: 'B&C Advancements', color: '#F6B26B' },
  biomes: { key: 'biomes', displayName: 'Biomes', color: '#6AA84F' },
  building: { key: 'building', displayName: 'Building', color: '#E69138' },
  challenges: { key: 'challenges', displayName: 'Super Challenges', color: '#FF0003' },
  enchanting: { key: 'enchanting', displayName: 'Enchanting', color: '#5B2AFF' },
  end: { key: 'end', displayName: 'The End', color: '#FFF2CC' },
  farming: { key: 'farming', displayName: 'Farming', color: '#CCAC66' },
  mining: { key: 'mining', displayName: 'Mining', color: '#999999' },
  monsters: { key: 'monsters', displayName: 'Monsters', color: '#93AF90' },
  nether: { key: 'nether', displayName: 'Nether', color: '#E06666' },
  potion: { key: 'potion', displayName: 'Potions', color: '#FFD966' },
  redstone: { key: 'redstone', displayName: 'Redstone', color: '#CC0000' },
  statistics: { key: 'statistics', displayName: 'Statistics', color: '#E69138' },
  weaponry: { key: 'weaponry', displayName: 'Weaponry', color: '#9D7F56' },
};

/**
 * Predefined BACAP advancement tiers with alias support and associated hex colors.
 */
export const BACAP_TIER_CONFIGS: Readonly<Record<string, BacapCategoryConfig>> = {
  task: { key: 'task', displayName: 'Task', color: '#55FF55' },
  goal: { key: 'goal', displayName: 'Goal', color: '#75E1FF' },
  challenge: { key: 'challenge', displayName: 'Challenge', color: '#AA00AA' },
  super_challenge: { key: 'super_challenge', displayName: 'Super Challenge', color: '#FF2A2A' },
  superchallenge: { key: 'super_challenge', displayName: 'Super Challenge', color: '#FF2A2A' },
  root: { key: 'root', displayName: 'Root', color: '#CCCCCC' },
  milestone: { key: 'milestone', displayName: 'Milestone', color: '#FFFF55' },
  advancement_legend: { key: 'advancement_legend', displayName: 'Advancement Legend', color: '#FFAA00' },
  advancementlegend: { key: 'advancement_legend', displayName: 'Advancement Legend', color: '#FFAA00' },
  hidden: { key: 'hidden', displayName: 'Hidden', color: '#FF55FF' },
};

/**
 * Unique list of advancement tab display names derived from BACAP_TAB_CONFIGS for table filtering.
 */
export const TAB_FILTER_OPTIONS: readonly string[] = Array.from(
  new Set(Object.values(BACAP_TAB_CONFIGS).map((tab) => tab.displayName))
);

/**
 * Unique list of advancement tier display names derived from BACAP_TIER_CONFIGS for table filtering.
 */
export const TIER_FILTER_OPTIONS: readonly string[] = Array.from(
  new Set(Object.values(BACAP_TIER_CONFIGS).map((tier) => tier.displayName))
);
