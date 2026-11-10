import { ref } from 'vue';
import type { AdvancementItem } from '../domain/advancement/models';
import { fetchDatasetVersions } from '../services/versionedDataService';
import { getAdvancementsByVersion } from '../services/advancementService';

const BACAPED_DATASET_KEY = 'bacaped_versions';

const advancements = ref<AdvancementItem[]>([]);
const availableVersions = ref<string[]>([]);
const currentVersion = ref<string>('');
const selectedAdvancement = ref<AdvancementItem | null>(null);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string | null>(null);

export function useAdvancements() {
  /**
   * Loads available versions (if not loaded yet) and fetches advancements
   * for the active or requested version.
   *
   * @param {boolean} [force=false] - If true, bypasses cache and re-fetches data.
   * @param {string} [preferredVersion] - Optional version string from URL query (?v=...).
   * @returns {Promise<void>}
   * @example
   * await fetchAdvancements(false, '2.9.4');
   */
  async function fetchAdvancements(
      force: boolean = false,
      preferredVersion?: string
  ): Promise<void> {
    try {
      isLoading.value = true;
      errorMessage.value = null;

      if (availableVersions.value.length === 0 || force) {
        availableVersions.value = await fetchDatasetVersions(BACAPED_DATASET_KEY, force);
      }

      const targetVersion =
          preferredVersion && availableVersions.value.includes(preferredVersion)
              ? preferredVersion
              : currentVersion.value && availableVersions.value.includes(currentVersion.value)
                  ? currentVersion.value
                  : availableVersions.value[0];

      if (!targetVersion) {
        throw new Error('No available versions found');
      }

      currentVersion.value = targetVersion;
      advancements.value = await getAdvancementsByVersion(targetVersion, force);

      // Sync opened drawer with the newly loaded version dataset
      if (selectedAdvancement.value) {
        const currentPath = selectedAdvancement.value.mc_path;
        selectedAdvancement.value =
            advancements.value.find((a) => a.mc_path === currentPath) ?? null;
      }
    } catch (err) {
      errorMessage.value =
          err instanceof Error ? err.message : 'Failed to load advancements';
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Switches the active version and reloads advancements.
   *
   * @param {string} version - Target SemVer version string.
   * @returns {Promise<void>}
   * @example
   * await changeVersion('3.0.0');
   */
  async function changeVersion(version: string): Promise<void> {
    if (version === currentVersion.value && advancements.value.length > 0) {
      return;
    }
    await fetchAdvancements(false, version);
  }

  /**
   * Selects an advancement for the detail drawer by object, mc_path, or clears selection.
   *
   * @param {AdvancementItem | string | null} target - AdvancementItem instance, mc_path string, or null.
   * @returns {void}
   * @example
   * selectAdvancement('blazeandcave:bacap/root');
   */
  function selectAdvancement(target: AdvancementItem | string | null): void {
    if (!target) {
      selectedAdvancement.value = null;
      return;
    }
    if (typeof target === 'string') {
      selectedAdvancement.value =
          advancements.value.find((a) => a.mc_path === target) ?? null;
      return;
    }
    selectedAdvancement.value = target;
  }

  return {
    advancements,
    availableVersions,
    currentVersion,
    selectedAdvancement,
    isLoading,
    errorMessage,
    fetchAdvancements,
    changeVersion,
    selectAdvancement,
  };
}