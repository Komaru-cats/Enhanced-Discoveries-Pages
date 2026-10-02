/**
 * Result structure containing extracted asset identifiers.
 * @typedef {Object} ExtractedAssets
 * @property {Set<string>} heads - Set of player head UUIDs or texture hashes.
 * @property {Set<string>} items - Set of Minecraft item resource identifiers.
 */

/**
 * Recursively scans arbitrary JSON data to discover player heads and item IDs.
 *
 * @param {unknown} data - Parsed JSON object or array to traverse.
 * @returns {ExtractedAssets} Collections of discovered unique head identifiers and item IDs.
 * @example
 * const { heads, items } = extractAssets(data);
 */
export function extractAssets(data) {
    const heads = new Set();
    const items = new Set();

    function traverse(node) {
        if (!node || typeof node !== 'object') return;

        if (Array.isArray(node)) {
            for (const item of node) traverse(item);
            return;
        }

        const headData = node.player_head_data;
        let hasHead = false;

        if (headData && typeof headData === 'object') {
            const identifier = headData.texture_hash || headData.uuid;
            if (identifier) {
                heads.add(String(identifier));
                hasHead = true;
            }
        }

        if (!hasHead) {
            const rawId = node.icon_id || node.id;
            if (typeof rawId === 'string') {
                items.add(rawId);
            }
        }

        for (const [key, value] of Object.entries(node)) {
            if (key !== 'player_head_data') {
                traverse(value);
            }
        }
    }

    traverse(data);
    return { heads, items };
}