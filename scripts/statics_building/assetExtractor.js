/**
 * Result structure containing extracted asset identifiers.
 *
 * @typedef {Object} ExtractedAssets
 * @property {Set<string>} heads - Set of player head UUIDs or texture hashes.
 * @property {Set<string>} items - Set of Minecraft item resource identifiers.
 */

/**
 * Registers a single asset into the heads set (if head data is present) or the items set.
 *
 * @param {string | undefined | null} itemId - Minecraft item identifier (e.g., "minecraft:bell").
 * @param {{ texture_hash?: string | null, uuid?: string | null } | undefined | null} headData - Optional player head metadata.
 * @param {Set<string>} heads - Set accumulating unique head identifiers.
 * @param {Set<string>} items - Set accumulating unique item IDs.
 * @returns {void}
 */
function addAsset(itemId, headData, heads, items) {
    const headIdentifier = headData?.texture_hash?.trim() || headData?.uuid?.trim();
    if (headIdentifier) {
        heads.add(headIdentifier);
        return;
    }

    const cleanItemId = itemId?.trim();
    if (cleanItemId) {
        items.add(cleanItemId);
    }
}

/**
 * Scans the advancement dataset to discover unique player heads and item IDs
 * across advancements, parents, item rewards, and trophies.
 *
 * @param {Array<Record<string, any>>} data - Parsed JSON array of advancements from bacaped.json.
 * @returns {ExtractedAssets} Collections of discovered unique head identifiers and item IDs.
 * @throws {TypeError} Throws if the input data is not an array.
 * @example
 * const { heads, items } = extractAssets(rawData);
 */
export function extractAssets(data) {
    if (!Array.isArray(data)) {
        throw new TypeError('Expected bacaped.json root data to be an array.');
    }

    const heads = new Set();
    const items = new Set();

    for (const advancement of data) {
        if (!advancement || typeof advancement !== 'object') continue;

        addAsset(advancement.icon_id, advancement.player_head_data, heads, items);

        if (advancement.parent) {
            addAsset(advancement.parent.icon_id, advancement.parent.player_head_data, heads, items);
        }

        for (const item of advancement.rewards?.items ?? []) {
            addAsset(item.id, item.player_head_data, heads, items);
        }

        for (const trophy of advancement.rewards?.trophies ?? []) {
            addAsset(trophy.id, trophy.player_head_data, heads, items);
        }
    }

    return { heads, items };
}
