import type { PlayerHeadData } from '../advancement/types';

/**
 * Normalized enchantment entry for UI rendering.
 */
export interface EnchantmentEntry {
  readonly id: string;
  readonly name: string;
  readonly level: number;
}

/**
 * Raw item reward DTO from JSON payload.
 */
export interface ItemRewardDto {
  id: string;
  count: number;
  enchantments?: Record<string, number>;
  custom_name?: string;
  player_head_data?: PlayerHeadData | null;
}

/**
 * Raw trophy reward DTO from JSON payload.
 */
export interface TrophyRewardDto {
  id: string;
  count: number;
  title?: string;
  description?: string;
  title_color?: string;
  enchantments?: Record<string, number>;
  unbreakable: boolean;
  player_head_data?: PlayerHeadData | null;
}

/**
 * Raw rewards container DTO from JSON payload.
 */
export interface RewardDto {
  experience?: number;
  items?: ItemRewardDto[];
  trophies?: TrophyRewardDto[];
}
