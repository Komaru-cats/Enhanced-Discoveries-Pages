import type {ItemRewardItem} from "./itemReward.ts";
import type {TrophyRewardItem} from "./trophyReward.ts";

export interface RewardItem {
    experience?: number;
    items?: ItemRewardItem[];
    trophies?: TrophyRewardItem[];
}