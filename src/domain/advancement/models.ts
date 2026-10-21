import { BACAP_TAB_CONFIGS, BACAP_TIER_CONFIGS } from './constants';
import type { AdvancementDto, ParentAdvancementDto, PlayerHeadData } from './types';
import { Reward } from '../reward/models';

/**
 * Represents a resolved BACAP advancement tab entity.
 */
export class BacapTab {
  public readonly folder_name: string;
  public readonly display_name: string;
  public readonly color: string;

  /**
   * Initializes a new instance of BacapTab.
   *
   * @param {string} folderName - Directory identifier in the datapack (e.g., 'adventure').
   * @param {string} displayName - Human-readable tab name (e.g., 'Adventure').
   * @param {string} color - Hex color string (e.g., '#FFD966').
   */
  constructor(folderName: string, displayName: string, color: string) {
    this.folder_name = folderName;
    this.display_name = displayName;
    this.color = color;
  }

  /**
   * Parses a raw tab folder name into a BacapTab domain model.
   *
   * @param {string | null | undefined} rawTab - Raw tab identifier from JSON.
   * @returns {BacapTab} Resolved BacapTab instance.
   * @example
   * const tab = BacapTab.parse('adventure');
   */
  public static parse(rawTab?: string | null): BacapTab {
    if (!rawTab) {
      return new BacapTab('unknown', 'Unknown', '#FFFFFF');
    }
    const key = rawTab.trim().toLowerCase();
    const config = BACAP_TAB_CONFIGS[key];
    return config
      ? new BacapTab(config.key, config.displayName, config.color)
      : new BacapTab(key, rawTab, '#FFFFFF');
  }
}

/**
 * Represents a resolved BACAP advancement tier entity.
 */
export class BacapTier {
  public readonly technical_name: string;
  public readonly display_name: string;
  public readonly color: string;

  /**
   * Initializes a new instance of BacapTier.
   *
   * @param {string} technicalName - Machine-readable tier key (e.g., 'super_challenge').
   * @param {string} displayName - Human-readable tier title (e.g., 'Super Challenge').
   * @param {string} color - Associated HEX color string (e.g., '#FF2A2A').
   */
  constructor(technicalName: string, displayName: string, color: string) {
    this.technical_name = technicalName;
    this.display_name = displayName;
    this.color = color;
  }

  /**
   * Parses a raw tier string into a BacapTier domain model.
   *
   * @param {string | null | undefined} rawTier - Raw tier identifier from JSON.
   * @returns {BacapTier} Resolved BacapTier instance.
   * @example
   * const tier = BacapTier.parse('super_challenge');
   */
  public static parse(rawTier?: string | null): BacapTier {
    if (!rawTier) {
      return new BacapTier('unknown', 'Unknown', '#FFFFFF');
    }
    const key = rawTier.trim().toLowerCase();
    const config = BACAP_TIER_CONFIGS[key];
    return config
      ? new BacapTier(config.key, config.displayName, config.color)
      : new BacapTier(key, rawTier, '#FFFFFF');
  }
}

/**
 * Represents parent advancement metadata attached to an advancement entry.
 */
export class ParentAdvancementItem {
  public readonly mc_path: string;
  public readonly title?: string | null;
  public readonly description?: string | null;
  public readonly frame: string;
  public readonly icon_id?: string | null;
  public readonly player_head_data?: PlayerHeadData | null;
  public readonly tier?: BacapTier;
  public readonly tab?: BacapTab;

  /**
   * Initializes a new instance of ParentAdvancementItem from raw DTO properties.
   *
   * @param {ParentAdvancementDto} dto - Raw parent advancement object from JSON.
   */
  constructor(dto: ParentAdvancementDto) {
    this.mc_path = dto.mc_path;
    this.title = dto.title;
    this.description = dto.description;
    this.frame = dto.frame || 'task';
    this.icon_id = dto.icon_id;
    this.player_head_data = dto.player_head_data;
    this.tier = dto.tier ? BacapTier.parse(dto.tier) : undefined;
    this.tab = dto.tab ? BacapTab.parse(dto.tab) : undefined;
  }

  /**
   * Checks whether this parent advancement has enough visual metadata to render as a card.
   *
   * @returns {boolean} True if both title and icon_id are available.
   */
  public get hasDetails(): boolean {
    return Boolean(this.title && this.icon_id);
  }
}

/**
 * Domain model representing a single advancement in Enhanced Discoveries.
 */
export class AdvancementItem {
  public readonly title: string;
  public readonly description: string;
  public readonly frame: string;
  public readonly mc_path: string;
  public readonly icon_id: string;
  public readonly parent: ParentAdvancementItem | null;
  public readonly rewards?: Reward;
  public readonly requirements?: Record<string, string>;
  public readonly alternative_descriptions?: Record<string, string>;
  public readonly player_head_data?: PlayerHeadData | null;
  public readonly tier: BacapTier;
  public readonly tab: BacapTab;

  /**
   * Direct child advancements that reference this advancement as their parent.
   */
  public children: AdvancementItem[] = [];

  /**
   * Full reference to the parent AdvancementItem if it is present in the dataset.
   */
  public parentAdvancement: AdvancementItem | null = null;

  /**
   * Initializes a new AdvancementItem domain model and normalizes nested entities.
   *
   * @param {AdvancementDto} dto - Raw advancement properties received from JSON payload.
   */
  constructor(dto: AdvancementDto) {
    this.title = dto.title;
    this.description = dto.description;
    this.frame = dto.frame || 'task';
    this.mc_path = dto.mc_path;
    this.icon_id = dto.icon_id;
    this.requirements = dto.requirements;
    this.alternative_descriptions = dto.alternative_descriptions;
    this.player_head_data = dto.player_head_data;

    this.parent = dto.parent ? new ParentAdvancementItem(dto.parent) : null;
    this.rewards = dto.rewards ? new Reward(dto.rewards) : undefined;
    this.tier = BacapTier.parse(dto.tier);
    this.tab = BacapTab.parse(dto.tab);
  }
}
