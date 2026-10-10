import { AdvancementItem, type AdvancementItemProps } from '../types/advancement';

/**
 * Builds bidirectional child links by matching parent mc_path with advancements.
 *
 * @param {AdvancementItem[]} items Flat array of parsed advancement items.
 * @returns {void}
 *
 * @example
 * linkAdvancementChildren(advancementList);
 */
function linkAdvancementChildren(items: AdvancementItem[]): void {
    const pathLookup = new Map<string, AdvancementItem>();

    // Index all advancements by their Minecraft resource path
    for (const item of items) {
        pathLookup.set(item.mc_path, item);
    }

    // Register each item in its parent's children array
    for (const item of items) {
        const parentPath = item.parent?.mc_path;
        if (parentPath) {
            const parentNode = pathLookup.get(parentPath);
            if (parentNode) {
                parentNode.children.push(item);
            }
        }
    }
}

/**
 * Loads advancement collection from the static public JSON file and constructs hierarchy.
 *
 * @returns {Promise<AdvancementItem[]>} Array of typed advancement items with populated children.
 * @throws {Error} Throws when the network request fails or data cannot be parsed.
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

    // Instantiate classes so setters (tab, tier) and parent wrappers are initialized
    const items = rawData.map((item) => new AdvancementItem(item));

    //  Link child references across the dataset
    linkAdvancementChildren(items);

    return items;
}