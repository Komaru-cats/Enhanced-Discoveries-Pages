/**
 * Standard Minecraft color palette mapped to HEX values.
 */
export const MINECRAFT_COLOR_MAP: Readonly<Record<string, string>> = {
  black: '#000000',
  dark_blue: '#0000AA',
  dark_green: '#00AA00',
  dark_aqua: '#00AAAA',
  dark_red: '#AA0000',
  dark_purple: '#AA00AA',
  gold: '#FFAA00',
  gray: '#AAAAAA',
  dark_gray: '#555555',
  blue: '#5555FF',
  green: '#55FF55',
  aqua: '#55FFFF',
  red: '#FF5555',
  light_purple: '#FF55FF',
  yellow: '#FFFF55',
  white: '#FFFFFF',
};

/**
 * Converts a Minecraft color name or HEX string into a normalized uppercase HEX color.
 *
 * @param {string | undefined | null} color - Raw color string (e.g., 'gold', '#FFAA00').
 * @returns {string | undefined} Normalized HEX color string or undefined if input is empty.
 * @example
 * parseMinecraftColor('gold'); // Returns '#FFAA00'
 */
export function parseMinecraftColor(color?: string | null): string | undefined {
  if (!color) return undefined;

  const trimmed = color.trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  const key = trimmed.toLowerCase();
  return MINECRAFT_COLOR_MAP[key] ?? trimmed;
}
