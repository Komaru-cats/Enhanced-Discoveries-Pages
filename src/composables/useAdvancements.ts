import { ref, onMounted } from 'vue';
import type { AdvancementItem } from '../types/advancement';
import {loadAdvancements} from "../services/advancementService.ts";

/**
 * Composable providing reactive advancement data and loading states.
 *
 * @returns {{
 *   advancements: import('vue').Ref<AdvancementItem[]>,
 *   isLoading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string | null>,
 *   reload: () => Promise<void>
 * }} Reactive state and reload handler.
 * @throws {Error} Does not throw unhandled exceptions; errors are captured in the error ref.
 *
 * @example
 * const { advancements, isLoading, error } = useAdvancements();
 */
export function useAdvancements() {
    const advancements = ref<AdvancementItem[]>([]);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    /**
     * Triggers the data fetching workflow.
     *
     * @returns {Promise<void>}
     * @throws {Error} Does not throw; catches errors internally.
     */
    async function reload(): Promise<void> {
        isLoading.value = true;
        error.value = null;

        try {
            advancements.value = await loadAdvancements();
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error loading advancements';
        } finally {
            isLoading.value = false;
        }
    }

    onMounted(() => {
        void reload();
    });

    return {
        advancements,
        isLoading,
        error,
        reload,
    };
}