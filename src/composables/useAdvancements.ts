import { onMounted, ref, shallowRef, type Ref, type ShallowRef } from 'vue';
import type { AdvancementItem } from '../domain/advancement/models';
import { loadAdvancements } from '../services/advancementService';

export interface UseAdvancementsReturn {
  advancements: ShallowRef<AdvancementItem[]>;
  selectedAdvancement: ShallowRef<AdvancementItem | null>;
  isLoading: Ref<boolean>;
  errorMessage: Ref<string | null>;
  fetchAdvancements: (forceReload?: boolean) => Promise<void>;
  selectAdvancement: (advancement: AdvancementItem | null) => void;
}

/**
 * Composable managing advancement data fetching, loading/error states, and active item selection.
 *
 * @returns {UseAdvancementsReturn} Reactive state and action handlers for advancements.
 * @example
 * const { advancements, isLoading, errorMessage, selectAdvancement } = useAdvancements();
 */
export function useAdvancements(): UseAdvancementsReturn {
  const advancements = shallowRef<AdvancementItem[]>([]);
  const selectedAdvancement = shallowRef<AdvancementItem | null>(null);
  const isLoading = ref<boolean>(true);
  const errorMessage = ref<string | null>(null);

  /**
   * Fetches advancements from the service layer and updates reactive status flags.
   *
   * @param {boolean} [forceReload=false] - Whether to bypass the service cache.
   * @returns {Promise<void>}
   */
  async function fetchAdvancements(forceReload = false): Promise<void> {
    isLoading.value = true;
    errorMessage.value = null;

    try {
      advancements.value = await loadAdvancements(forceReload);
    } catch (error) {
      console.error('Error fetching advancement data:', error);
      errorMessage.value =
        error instanceof Error ? error.message : 'Failed to load advancement data.';
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Sets or clears the currently active advancement for the detail drawer.
   *
   * @param {AdvancementItem | null} advancement - Target advancement or null to close.
   * @returns {void}
   */
  function selectAdvancement(advancement: AdvancementItem | null): void {
    selectedAdvancement.value = advancement;
  }

  onMounted(() => {
    void fetchAdvancements();
  });

  return {
    advancements,
    selectedAdvancement,
    isLoading,
    errorMessage,
    fetchAdvancements,
    selectAdvancement,
  };
}
