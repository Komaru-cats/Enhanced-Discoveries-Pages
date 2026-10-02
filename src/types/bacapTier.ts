/**
 * Represents a predefined BACAP advancement tier containing technical identifiers and UI styling.
 */
export class BacapTier {
    public readonly technical_name: string;
    public readonly display_name: string;
    public readonly color: string;

    /**
     * Initializes a new instance of BacapTier.
     *
     * @param technicalName - Machine-readable identifier (e.g., 'super_challenge').
     * @param displayName - Human-readable title (e.g., 'Super Challenge').
     * @param color - Associated HEX color string (e.g., '#FF2A2A').
     */
    constructor(technicalName: string, displayName: string, color: string) {
        this.technical_name = technicalName;
        this.display_name = displayName;
        this.color = color;
    }
}

/**
 * Predefined BACAP advancement tiers with their respective colors and display names.
 */
export const BACAP_TIERS: Readonly<Record<string, BacapTier>> = {
    task: new BacapTier('task', 'Task', '#55FF55'),
    goal: new BacapTier('goal', 'Goal', '#75E1FF'),
    challenge: new BacapTier('challenge', 'Challenge', '#AA00AA'),
    super_challenge: new BacapTier('super_challenge', 'Super Challenge', '#FF2A2A'),
    superchallenge: new BacapTier('super_challenge', 'Super Challenge', '#FF2A2A'), // Alias support
    root: new BacapTier('root', 'Root', '#CCCCCC'),
    milestone: new BacapTier('milestone', 'Milestone', '#FFFF55'),
    advancement_legend: new BacapTier('advancement_legend', 'Advancement Legend', '#FFAA00'),
    advancementlegend: new BacapTier('advancement_legend', 'Advancement Legend', '#FFAA00'), // Alias support
    hidden: new BacapTier('hidden', 'Hidden', '#FF55FF'),
};

/**
 * Parses a raw tier string into a predefined BacapTier instance.
 * If the tier is unrecognized, returns a fallback instance preserving the input name.
 *
 * @param rawTier - Raw tier identifier from JSON (e.g., 'super_challenge', 'task').
 * @returns Resolved BacapTier instance.
 *
 * @example
 * parseBacapTier('super_challenge'); // BacapTier { technical_name: 'super_challenge', display_name: 'Super Challenge', color: '#FF2A2A' }
 * parseBacapTier('custom_tier');     // BacapTier { technical_name: 'custom_tier', display_name: 'custom_tier', color: '#FFFFFF' }
 */
export function parseBacapTier(rawTier?: string | null): BacapTier {
    if (!rawTier) {
        return new BacapTier('unknown', 'Unknown', '#FFFFFF');
    }

    const key = rawTier.trim().toLowerCase();
    return BACAP_TIERS[key] ?? new BacapTier(key, rawTier, '#FFFFFF');
}