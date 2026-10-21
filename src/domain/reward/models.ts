import { parseMinecraftColor } from '../minecraft/colors';
import { formatMinecraftId } from '../minecraft/formatters';
import type { PlayerHeadData } from '../advancement/types';
import type {
  EnchantmentEntry,
  ItemRewardDto,
  RewardDto,
  TrophyRewardDto,
} from './types';

/**
 * Converts a raw enchantment dictionary into an array of formatted EnchantmentEntry objects.
 *
 * @param {Record<string, number> | undefined} enchantments - Raw enchantment key-level map.
 * @returns {EnchantmentEntry[]} List of formatted enchantments.
 * @example
 * mapEnchantments({ 'minecraft:sharpness': 5 });
 * // Returns [{ id: 'minecraft:sharpness', name: 'Sharpness', level: 5 }]
 */
export function mapEnchantments(
  enchantments?: Record<string, number>
): EnchantmentEntry[] {
  if (!enchantments) return [];
  return Object.entries(enchantments).map(([id, level]) => ({
    id,
    name: formatMinecraftId(id),
    level,
  }));
}

/**
 * Domain model representing a standard item reward.
 */
export class ItemReward {
  public readonly id: string;
  public readonly displayName: string;
  public readonly count: number;
  public readonly custom_name?: string;
  public readonly enchantments: EnchantmentEntry[];
  public readonly player_head_data?: PlayerHeadData | null;

  /**
   * Initializes a new ItemReward instance from raw DTO data.
   *
   * @param {ItemRewardDto} dto - Raw item reward properties.
   */
  constructor(dto: ItemRewardDto) {
    this.id = dto.id;
    this.displayName = formatMinecraftId(dto.id);
    this.count = dto.count;
    this.custom_name = dto.custom_name;
    this.enchantments = mapEnchantments(dto.enchantments);
    this.player_head_data = dto.player_head_data;
  }
}

/**
 * Domain model representing a special trophy item reward.
 */
export class TrophyReward {
  public readonly id: string;
  public readonly displayName: string;
  public readonly count: number;
  public readonly title: string;
  public readonly description?: string;
  public readonly titleColor?: string;
  public readonly enchantments: EnchantmentEntry[];
  public readonly unbreakable: boolean;
  public readonly player_head_data?: PlayerHeadData | null;

  /**
   * Initializes a new TrophyReward instance and normalizes its title color to HEX.
   *
   * @param {TrophyRewardDto} dto - Raw trophy reward properties.
   */
  constructor(dto: TrophyRewardDto) {
    this.id = dto.id;
    this.displayName = formatMinecraftId(dto.id);
    this.count = dto.count;
    this.title = dto.title || this.displayName;
    this.description = dto.description;
    this.titleColor = parseMinecraftColor(dto.title_color);
    this.enchantments = mapEnchantments(dto.enchantments);
    this.unbreakable = dto.unbreakable;
    this.player_head_data = dto.player_head_data;
  }
}

/**
 * Domain model aggregating experience, item rewards, and trophies for an advancement.
 */
export class Reward {
  public readonly experience?: number;
  public readonly items: ItemReward[];
  public readonly trophies: TrophyReward[];

  /**
   * Initializes a new Reward container with instantiated ItemReward and TrophyReward models.
   *
   * @param {RewardDto} dto - Raw reward properties from JSON.
   */
  constructor(dto: RewardDto) {
    this.experience = dto.experience;
    this.items = (dto.items ?? []).map((item) => new ItemReward(item));
    this.trophies = (dto.trophies ?? []).map((trophy) => new TrophyReward(trophy));
  }

  /**
   * Checks whether the reward contains any experience, items, or trophies.
   *
   * @returns {boolean} True if at least one reward type is present.
   */
  public get hasAnyReward(): boolean {
    return Boolean(
      (this.experience && this.experience > 0) ||
        this.items.length > 0 ||
        this.trophies.length > 0
    );
  }
}

/**
 * Formats advancement rewards into a concise summary string for table cells.
 *
 * @param {Reward | undefined} rewards - Instantiated Reward model.
 * @returns {string} Comma-separated reward summary or 'None'.
 * @example
 * formatRewardSummary(reward); // Returns '+125 XP, 16 Items, 1 Trophy'
 */
export function formatRewardSummary(rewards?: Reward): string {
  if (!rewards) return 'None';

  const parts: string[] = [];

  if (rewards.experience) {
    parts.push(`+${rewards.experience} XP`);
  }

  if (rewards.items.length > 0) {
    const totalItems = rewards.items.reduce((sum, item) => sum + (item.count || 0), 0);
    if (totalItems > 0) {
      parts.push(totalItems === 1 ? '1 Item' : `${totalItems} Items`);
    }
  }

  if (rewards.trophies.length > 0) {
    const totalTrophies = rewards.trophies.reduce((sum, trophy) => sum + (trophy.count || 0), 0);
    if (totalTrophies > 0) {
      parts.push(totalTrophies === 1 ? '1 Trophy' : `${totalTrophies} Trophies`);
    }
  }

  return parts.length > 0 ? parts.join(', ') : 'None';
}
