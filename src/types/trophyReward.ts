import { parseMinecraftColor } from "../utils/minecraftColors.ts";
import type {PlayerHeadData} from "./playerHeadData.ts";

export interface TrophyRewardItemProps {
    id: string;
    count: number;
    title?: string;
    description?: string;
    title_color?: string;
    enchantments?: Record<string, number>;
    unbreakable: boolean;
    player_head_data?: PlayerHeadData;
}

export class TrophyRewardItem {
    public id: string;
    public count: number;
    public title?: string;
    public description?: string;
    public enchantments?: Record<string, number>;
    public unbreakable: boolean;
    public player_head_data?: PlayerHeadData;

    private _titleColor?: string;

    /**
     * Initializes a new instance of TrophyRewardItem and normalizes the title color.
     *
     * @param {TrophyRewardItemProps} props Raw JSON data properties.
     * @returns {TrophyRewardItem} A new instance of the class.
     * @example
     * const trophy = new TrophyRewardItem({
     *   id: "minecraft:stone",
     *   count: 1,
     *   title_color: "dark_red",
     *   unbreakable: true
     * });
     */
    constructor(props: TrophyRewardItemProps) {
        this.id = props.id;
        this.count = props.count;
        this.title = props.title;
        this.description = props.description;
        this.enchantments = props.enchantments;
        this.unbreakable = props.unbreakable;
        this.player_head_data = props.player_head_data;

        this.titleColor = props.title_color;
    }

    /**
     * Gets the title color as a HEX string.
     *
     * @returns {string | undefined} Converted HEX color or undefined.
     */
    public get titleColor(): string | undefined {
        return this._titleColor;
    }

    /**
     * Sets the title color, converting Minecraft names/codes to HEX automatically.
     *
     * @param {string | undefined} value Minecraft color code or HEX string.
     */
    public set titleColor(value: string | undefined) {
        this._titleColor = parseMinecraftColor(value);
    }
}