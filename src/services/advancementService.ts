import {AdvancementItem, type AdvancementItemProps} from '../types/advancement';

/**
 * Loads advancement collection from the static public JSON file.
 *
 * @returns {Promise<AdvancementItem[]>} Array of typed advancement items.
 * @throws {Error} Throws when the network request fails.
 *
 * @example
 * const items = await loadAdvancements();
 */
export async function loadAdvancements(): Promise<AdvancementItem[]> {
    const response = await fetch('/data/bacaped.json');

    if (!response.ok) {
        throw new Error(`Failed to load /data/bacaped.json: ${response.status} ${response.statusText}`);
    }

    const rawData: AdvancementItemProps[] = await response.json();

    // Instantiate classes so that setters (tab, tier) and private fields are initialized
    return rawData.map((item) => new AdvancementItem(item));
}