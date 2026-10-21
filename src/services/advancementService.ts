import { AdvancementItem } from '../domain/advancement/models';
import type { AdvancementDto } from '../domain/advancement/types';

let cachedAdvancements: AdvancementItem[] | null = null;

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
 * Loads the advancement dataset from the static JSON file, constructs domain models,
 * links parent-child hierarchies, and caches the result in memory.
 *
 * @param {boolean} [forceReload=false] - When true, bypasses the in-memory cache.
 * @returns {Promise<AdvancementItem[]>} Resolved list of AdvancementItem instances.
 * @throws {Error} Throws when the HTTP request fails or returns a non-2xx status code.
 * @example
 * const items = await loadAdvancements();
 */
export async function loadAdvancements(forceReload = false): Promise<AdvancementItem[]> {
  if (cachedAdvancements && !forceReload) {
    return cachedAdvancements;
  }

  const dataUrl = `${import.meta.env.BASE_URL}data/bacaped.json`;
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error(`Failed to load ${dataUrl}: ${response.status} ${response.statusText}`);
  }

  const rawData: AdvancementDto[] = await response.json();
  const items = rawData.map((dto) => new AdvancementItem(dto));

  linkAdvancementHierarchy(items);
  cachedAdvancements = items;

  return items;
}
