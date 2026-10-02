import type {PlayerHeadData} from "../types/playerHeadData.ts";

/**
 * Resolves the public static URL for an advancement, reward item, or trophy icon.
 * Checks player head data first (priority: texture_hash -> uuid), then falls back to item icons.
 *
 * @param itemId Minecraft item identifier (e.g., "minecraft:diamond").
 * @param playerHeadData Optional head texture data.
 * @returns The resolved static URL path.
 */
export function getAssetUrl(
    itemId: string,
    playerHeadData?: PlayerHeadData | null
): string {
    const base = import.meta.env.BASE_URL;

    const headIdentifier = playerHeadData?.texture_hash || playerHeadData?.uuid;
    if (headIdentifier) {
        return `${base}heads/${headIdentifier}.png`;
    }

    const safeItemId = itemId.replace(/:/g, '_').replace(/\//g, '_');
    return `${base}items/${safeItemId}.png`;
}