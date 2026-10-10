import { BacapTab, parseBacapTab } from './bacapTab';
import { BacapTier, parseBacapTier } from './bacapTier';
import type { PlayerHeadData } from './playerHeadData.ts';

export interface ParentAdvancementItemProps {
    mc_path: string;
    title?: string | null;
    description?: string | null;
    icon_id?: string | null;
    tier?: string | null;
    tab?: string | null;
    frame?: string | null;
    player_head_data?: PlayerHeadData | null;
}

export class ParentAdvancementItem {
    public mc_path: string;
    public title?: string | null;
    public description?: string | null;
    public frame?: string | null;
    public icon_id?: string | null;
    public player_head_data?: PlayerHeadData | null;

    private _tier?: BacapTier;
    private _tab?: BacapTab;

    /**
     * Initializes a new instance of ParentAdvancementItem and parses tier/tab values.
     *
     * @param props Raw parent advancement properties received from JSON payload.
     */
    constructor(props: ParentAdvancementItemProps) {
        this.mc_path = props.mc_path;
        this.title = props.title;
        this.description = props.description;
        this.frame = props.frame;
        this.icon_id = props.icon_id;
        this.player_head_data = props.player_head_data;

        this.tier = props.tier;
        this.tab = props.tab;
    }

    /**
     * Checks if parent advancement contains full metadata for visual card display.
     *
     * @returns True if title and icon are present, false if only path is provided.
     */
    public get hasDetails(): boolean {
        return Boolean(this.title && this.icon_id);
    }

    /**
     * Gets the resolved tier entity.
     *
     * @returns BacapTier instance containing technical_name, display_name, and color, or undefined if unset.
     */
    public get tier(): BacapTier | undefined {
        return this._tier;
    }

    /**
     * Sets the tier by resolving a raw string or assigning an existing BacapTier instance.
     *
     * @param value Raw tier string, existing BacapTier instance, or null/undefined to clear.
     */
    public set tier(value: string | BacapTier | null | undefined) {
        if (value == null) {
            this._tier = undefined;
            return;
        }

        this._tier = value instanceof BacapTier ? value : parseBacapTier(value);
    }

    /**
     * Gets the resolved tab entity.
     *
     * @returns BacapTab instance containing folder_name, display_name, and color, or undefined if unset.
     */
    public get tab(): BacapTab | undefined {
        return this._tab;
    }

    /**
     * Sets the tab by resolving a string folder name or directly assigning a BacapTab instance.
     *
     * @param value Raw tab folder name, existing BacapTab instance, or null/undefined to clear.
     */
    public set tab(value: string | BacapTab | null | undefined) {
        if (value == null) {
            this._tab = undefined;
            return;
        }

        this._tab = value instanceof BacapTab ? value : parseBacapTab(value);
    }
}