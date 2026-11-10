const BASE_URL = import.meta.env.BASE_URL;

const versionsCache: Record<string, string[]> = {};
const datasetCache = new Map<string, unknown>();

/**
 * Compares two semantic version strings according to SemVer rules.
 *
 * @param v1 - First version string (e.g. "3.0.0" or "2.10.1")
 * @param v2 - Second version string (e.g. "2.9.4")
 * @returns Positive number if v1 > v2, negative if v1 < v2, 0 if equal
 *
 * @example
 * ['2.9.4', '3.0.0', '2.10.0'].sort((a, b) => compareSemver(b, a));
 * // Returns ['3.0.0', '2.10.0', '2.9.4']
 */
export function compareSemver(v1: string, v2: string): number {
    const parse = (v: string) =>
        v
            .replace(/^v/i, '')
            .split('.')
            .map((n) => parseInt(n, 10) || 0);

    const [maj1 = 0, min1 = 0, pat1 = 0] = parse(v1);
    const [maj2 = 0, min2 = 0, pat2 = 0] = parse(v2);

    if (maj1 !== maj2) return maj1 - maj2;
    if (min1 !== min2) return min1 - min2;
    return pat1 - pat2;
}

/**
 * Loads and sorts available versions for a specific dataset folder.
 * Versions are sorted in descending SemVer order (newest first).
 *
 * @param folderKey - Dataset key in versions.json and folder name in public/data/ (e.g. "bacaped_versions")
 * @param force - Whether to bypass the in-memory cache
 * @returns Promise resolving to a sorted array of version strings
 * @throws {Error} If versions.json cannot be fetched or folderKey is missing
 */
export async function fetchDatasetVersions(
    folderKey: string,
    force = false
): Promise<string[]> {
    if (!force && versionsCache[folderKey]) {
        return versionsCache[folderKey];
    }

    const response = await fetch(`${BASE_URL}data/versions.json`);
    if (!response.ok) {
        throw new Error(`Failed to fetch versions manifest (${response.status})`);
    }

    const manifest = (await response.json()) as Record<string, string[]>;
    const list = manifest[folderKey];

    if (!Array.isArray(list) || list.length === 0) {
        throw new Error(`No versions found for dataset "${folderKey}"`);
    }

    const sorted = [...list].sort((a, b) => compareSemver(b, a));
    versionsCache[folderKey] = sorted;
    return sorted;
}

/**
 * Fetches raw JSON data for a specific dataset folder and version with caching.
 *
 * @param folderKey - Folder name inside public/data/ (e.g. "bacaped_versions")
 * @param version - SemVer version string (e.g. "3.0.0")
 * @param force - Whether to bypass the in-memory cache
 * @returns Promise resolving to the parsed JSON data of type T
 * @throws {Error} If the HTTP request fails
 */
export async function fetchVersionedJson<T>(
    folderKey: string,
    version: string,
    force = false
): Promise<T> {
    const cacheKey = `${folderKey}:${version}`;
    if (!force && datasetCache.has(cacheKey)) {
        return datasetCache.get(cacheKey) as T;
    }

    const response = await fetch(`${BASE_URL}data/${folderKey}/${version}.json`);
    if (!response.ok) {
        throw new Error(
            `Failed to load ${folderKey}/${version}.json (${response.status})`
        );
    }

    const data = (await response.json()) as T;
    datasetCache.set(cacheKey, data);
    return data;
}