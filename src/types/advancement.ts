import type { RewardItem } from './reward';
import { BacapTab, parseBacapTab } from './bacapTab';
import { BacapTier, parseBacapTier } from './bacapTier';
import type {PlayerHeadData} from "./playerHeadData.ts";

export interface AdvancementItemProps {
    title: string;
    description: string;
    icon_id: string;
    tier: string;
    tab: string;
    frame: string;
    mc_path: string;
    parent: string;
    rewards?: RewardItem;
    requirements?: Record<string, string>;
    alternative_descriptions?: Record<string, string>;
    player_head_data?: PlayerHeadData;
}

export class AdvancementItem {
    public title: string;
    public description: string;
    public frame: string;
    public mc_path: string;
    public parent: string;
    public icon_id: string;
    public rewards?: RewardItem;
    public requirements?: Record<string, string>;
    public alternative_descriptions?: Record<string, string>;
    public player_head_data?: PlayerHeadData;

    private _tier!: BacapTier;
    private _tab!: BacapTab;

    /**
     * Initializes a new instance of AdvancementItem and parses tier/tab values.
     *
     * @param props - Raw advancement properties received from JSON payload.
     */
    constructor(props: AdvancementItemProps) {
        this.title = props.title;
        this.description = props.description;
        this.mc_path = props.mc_path;
        this.parent = props.parent;
        this.frame = props.frame;
        this.rewards = props.rewards;
        this.icon_id = props.icon_id;
        this.requirements = props.requirements;
        this.alternative_descriptions = props.alternative_descriptions;
        this.player_head_data = props.player_head_data;

        // Automatically parsed into objects via setters
        this.tier = props.tier;
        this.tab = props.tab;
    }

    /**
     * Gets the resolved tier entity.
     *
     * @returns BacapTier instance containing technical_name, display_name, and color.
     */
    public get tier(): BacapTier {
        return this._tier;
    }

    /**
     * Sets the tier by resolving a raw string or assigning an existing BacapTier instance.
     *
     * @param value - Raw tier string (e.g., 'super_challenge') or BacapTier object.
     */
    public set tier(value: string | BacapTier) {
        this._tier = value instanceof BacapTier ? value : parseBacapTier(value);
    }

    /**
     * Gets the resolved tab entity.
     *
     * @returns BacapTab instance containing folder_name, display_name, and color.
     */
    public get tab(): BacapTab {
        return this._tab;
    }

    /**
     * Sets the tab by resolving a string folder name or directly assigning a BacapTab instance.
     *
     * @param value - Raw tab folder name (e.g., 'adventure') or BacapTab object.
     */
    public set tab(value: string | BacapTab) {
        this._tab = value instanceof BacapTab ? value : parseBacapTab(value);
    }
}