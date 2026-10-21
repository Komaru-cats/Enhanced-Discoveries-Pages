import type { PlayerHeadData } from '../advancement/types';

/**
 * Formats a raw Minecraft resource location into a human-readable Title Case name.
 *
 * @param {string} id - Minecraft resource identifier (e.g., "minecraft:diamond_sword").
 * @returns {string} Formatted display name (e.g., "Diamond Sword").
 * @example
 * formatMinecraftId('minecraft:enchanted_golden_apple'); // Returns 'Enchanted Golden Apple'
 */
export function formatMinecraftId(id: string): string {
  const cleanId = id.includes(':') ? (id.split(':')[1] ?? id) : id;
  return cleanId
    .split('_')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Resolves the public static URL for an advancement, reward item, or trophy icon.
 * Prioritizes custom player head data (texture_hash -> uuid) before falling back to item textures.
 *
 * @param {string} itemId - Minecraft item identifier (e.g., "minecraft:diamond").
 * @param {PlayerHeadData | null | undefined} [playerHeadData] - Optional custom player head texture data.
 * @returns {string} Resolved static URL path respecting Vite BASE_URL.
 * @example
 * getAssetUrl('minecraft:bell'); // Returns '/items/minecraft_bell.png'
 */
export function getAssetUrl(
  itemId: string,
  playerHeadData?: PlayerHeadData | null
): string {
  const base = import.meta.env.BASE_URL;

  const headIdentifier = playerHeadData?.texture_hash?.trim() || playerHeadData?.uuid?.trim();
  if (headIdentifier) {
    return `${base}heads/${headIdentifier}.png`;
  }

  const safeItemId = itemId.replace(/[:/]/g, '_');
  return `${base}items/${safeItemId}.png`;
}
