import type {PlayerHeadData} from "./playerHeadData.ts";

export interface ItemRewardItem {
    id: string;
    count: number;
    enchantments?: Record<string, number>;
    custom_name?: string;
    player_head_data?: PlayerHeadData;
}