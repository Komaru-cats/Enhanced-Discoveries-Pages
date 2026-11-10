import { AdvancementItem } from '../domain/advancement/models';
import type { AdvancementDto } from '../domain/advancement/types';
import { fetchVersionedJson } from './versionedDataService';

const DATASET_KEY = 'bacaped_versions';
const cachedAdvancementsByVersion = new Map<string, AdvancementItem[]>();

/**
 * Builds bidirectional parent-child links across the advancement graph by matching mc_path.
 *
 * @param {AdvancementItem[]} items - Flat array of parsed AdvancementItem instances.
 * @returns {void}
 * @example
 * linkAdvancementHierarchy(items);
 */
function linkAdvancementHierarchy(items: AdvancementItem[]): void {
  const pathLookup = new Map<string, AdvancementItem>();

  for (const item of items) {
    pathLookup.set(item.mc_path, item);
  }

  for (const item of items) {
    const parentPath = item.parent?.mc_path;
    if (!parentPath) continue;

    const parentNode = pathLookup.get(parentPath);
    if (parentNode) {
      parentNode.children.push(item);
      item.parentAdvancement = parentNode;
    }
  }
}

/**
 * Loads the advancement dataset for a specific version, constructs domain models,
 * links parent-child hierarchies, and caches the resulting graph per version.
 *
 * @param {string} version - Target SemVer version string (e.g. "3.0.0").
 * @param {boolean} [forceReload=false] - When true, bypasses the in-memory cache.
 * @returns {Promise<AdvancementItem[]>} Resolved list of AdvancementItem instances.
 * @throws {Error} Throws when the HTTP request fails or returns a non-2xx status code.
 * @example
 * const items = await getAdvancementsByVersion('3.0.0');
 */
export async function getAdvancementsByVersion(
    version: string,
    forceReload: boolean = false
): Promise<AdvancementItem[]> {
  if (!forceReload && cachedAdvancementsByVersion.has(version)) {
    return cachedAdvancementsByVersion.get(version)!;
  }

  const rawData = await fetchVersionedJson<AdvancementDto[]>(
      DATASET_KEY,
      version,
      forceReload
  );

  const items = rawData.map((dto) => new AdvancementItem(dto));
  linkAdvancementHierarchy(items);

  cachedAdvancementsByVersion.set(version, items);
  return items;
}