/**
 * Represents a single predefined BACAP advancement tab.
 */
export class BacapTab {
    public readonly folder_name: string;
    public readonly display_name: string;
    public readonly color: string;

    /**
     * Initializes a new instance of BacapTab.
     *
     * @param folderName - Directory identifier in the data pack (e.g. 'adventure').
     * @param displayName - Human-readable name (e.g. 'Adventure').
     * @param color - Hex color code (e.g. '#FFD966').
     */
    constructor(folderName: string, displayName: string, color: string) {
        this.folder_name = folderName;
        this.display_name = displayName;
        this.color = color;
    }
}

/**
 * Predefined 16 BACAP advancement tabs.
 */
export const BACAP_TABS: Readonly<Record<string, BacapTab>> = {
    adventure: new BacapTab('adventure', 'Adventure', '#FFD966'),
    animal: new BacapTab('animal', 'Animals', '#6AA84F'),
    bacap: new BacapTab('bacap', 'B&C Advancements', '#F6B26B'),
    biomes: new BacapTab('biomes', 'Biomes', '#6AA84F'),
    building: new BacapTab('building', 'Building', '#E69138'),
    challenges: new BacapTab('challenges', 'Super Challenges', '#FF0003'),
    enchanting: new BacapTab('enchanting', 'Enchanting', '#5B2AFF'),
    end: new BacapTab('end', 'The End', '#FFF2CC'),
    farming: new BacapTab('farming', 'Farming', '#CCAC66'),
    mining: new BacapTab('mining', 'Mining', '#999999'),
    monsters: new BacapTab('monsters', 'Monsters', '#93AF90'),
    nether: new BacapTab('nether', 'Nether', '#E06666'),
    potion: new BacapTab('potion', 'Potions', '#FFD966'),
    redstone: new BacapTab('redstone', 'Redstone', '#CC0000'),
    statistics: new BacapTab('statistics', 'Statistics', '#E69138'),
    weaponry: new BacapTab('weaponry', 'Weaponry', '#9D7F56'),
};

/**
 * Parses a raw tab identifier or folder name into a predefined BacapTab instance.
 * If the tab is unrecognized, returns a fallback tab keeping the raw name.
 *
 * @param tabName - Raw tab folder name (e.g. 'adventure', 'biomes', 'challenges').
 * @returns Resolved BacapTab instance.
 *
 * @example
 * parseBacapTab('adventure'); // BacapTab { folder_name: 'adventure', display_name: 'Adventure', color: '#FFD966' }
 * parseBacapTab('custom_tab'); // BacapTab { folder_name: 'custom_tab', display_name: 'custom_tab', color: '#FFFFFF' }
 */
export function parseBacapTab(tabName?: string | null): BacapTab {
    if (!tabName) {
        return new BacapTab('unknown', 'Unknown', '#FFFFFF');
    }

    const key = tabName.trim().toLowerCase();
    return BACAP_TABS[key] ?? new BacapTab(key, tabName, '#FFFFFF');
}