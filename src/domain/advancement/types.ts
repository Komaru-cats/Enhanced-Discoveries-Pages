import type { RewardDto } from '../reward/types';

/**
 * Custom player skull texture identifiers used to render 3D isometric heads.
 */
export interface PlayerHeadData {
  texture_hash?: string | null;
  uuid?: string | null;
}

/**
 * Raw parent advancement data structure received from JSON payload.
 */
export interface ParentAdvancementDto {
  mc_path: string;
  title?: string | null;
  description?: string | null;
  icon_id?: string | null;
  tier?: string | null;
  tab?: string | null;
  frame?: string | null;
  player_head_data?: PlayerHeadData | null;
}

/**
 * Raw advancement entry received from the public/data/bacaped.json payload.
 */
export interface AdvancementDto {
  title: string;
  description: string;
  icon_id: string;
  tier: string;
  tab: string;
  frame: string;
  mc_path: string;
  parent?: ParentAdvancementDto | null;
  rewards?: RewardDto;
  requirements?: Record<string, string>;
  alternative_descriptions?: Record<string, string>;
  player_head_data?: PlayerHeadData | null;
}
