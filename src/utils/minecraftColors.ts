/**
 * Standard Minecraft color palette mapped to HEX values.
 */
export const MINECRAFT_COLOR_MAP: Record<string, string> = {
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
 * Converts a Minecraft color name, code, or HEX string into a normalized HEX color.
 *
 * @param color - Raw color string (e.g., 'red', '§c', '&6', '#FFAA00').
 * @returns Normalized HEX color string (e.g., '#FF5555') or undefined if input is empty.
 *
 * @example
 * parseMinecraftColor('gold'); // '#FFAA00'
 */
export function parseMinecraftColor(color?: string): string | undefined {
    if (!color) return undefined;

    // Return as is if already a valid HEX color
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
        return color.toUpperCase();
    }

    return MINECRAFT_COLOR_MAP[color] ?? color;
}