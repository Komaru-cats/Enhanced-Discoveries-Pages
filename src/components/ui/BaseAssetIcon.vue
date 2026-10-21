<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getAssetUrl } from '../../domain/minecraft/formatters';
import type { PlayerHeadData } from '../../domain/advancement/types';

const props = withDefaults(
  defineProps<{
    itemId: string;
    playerHeadData?: PlayerHeadData | null;
    alt?: string;
    fallbackText?: string;
    imgClass?: string;
    fallbackClass?: string;
  }>(),
  {
    alt: '',
    fallbackText: '',
    imgClass: '',
    fallbackClass: '',
  }
);

const hasError = ref(false);

const iconUrl = computed(() => getAssetUrl(props.itemId, props.playerHeadData));

const fallbackLetter = computed(() => {
  const source = props.fallbackText || props.alt || props.itemId;
  return source ? source.charAt(0).toUpperCase() : '?';
});

// Reset the error flag whenever the resolved icon URL changes
watch(iconUrl, () => {
  hasError.value = false;
});

/**
 * Marks the current icon URL as failed so the fallback letter is rendered.
 *
 * @returns {void}
 */
function handleError(): void {
  hasError.value = true;
}
</script>

<template>
  <img
    v-if="!hasError && itemId"
    :src="iconUrl"
    :alt="alt"
    :class="['base-asset-icon', imgClass]"
    loading="lazy"
    decoding="async"
    @error="handleError"
  />
  <span v-else :class="['base-asset-fallback', fallbackClass]">
    {{ fallbackLetter }}
  </span>
</template>

<style scoped>
.base-asset-icon {
  image-rendering: pixelated;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.base-asset-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text-secondary);
  user-select: none;
}
</style>
