<script setup lang="ts">
import { computed, ref } from 'vue';
import { getAssetUrl } from '../utils/iconUtils';
import type {PlayerHeadData} from "../types/playerHeadData.ts";

const props = withDefaults(
    defineProps<{
      iconId: string;
      playerHeadData?: PlayerHeadData | null;
      frame?: string;
      title?: string;
      size?: 'sm' | 'md';
    }>(),
    {
      frame: 'task',
      title: '',
      size: 'md',
    }
);

// Resolves local player head or item texture URL
const iconUrl = computed(() => getAssetUrl(props.iconId, props.playerHeadData));

// Resolves Minecraft advancement frame background texture
const frameUrl = computed(() => `${import.meta.env.BASE_URL}frames/${props.frame || 'task'}.png`);

const hasIconError = ref(false);
const fallbackLetter = computed(() => (props.title ? props.title.charAt(0).toUpperCase() : '?'));
</script>

<template>
  <div
      class="advancement-frame"
      :class="`size-${size}`"
      :style="{ backgroundImage: `url(${frameUrl})` }"
  >
    <img
        v-if="!hasIconError"
        :src="iconUrl"
        :alt="title"
        class="advancement-item-icon"
        loading="lazy"
        decoding="async"
        @error="hasIconError = true"
    />
    <span v-else class="advancement-fallback-letter">
      {{ fallbackLetter }}
    </span>
  </div>
</template>

<style scoped>
.advancement-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.advancement-item-icon {
  image-rendering: pixelated;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.advancement-fallback-letter {
  font-weight: 700;
  color: var(--text-secondary);
  user-select: none;
}

/* Medium size (Drawer header): 52x52 frame, 32x32 item */
.size-md {
  width: 52px;
  height: 52px;
}
.size-md .advancement-item-icon {
  width: 32px;
  height: 32px;
}
.size-md .advancement-fallback-letter {
  font-size: 1.2rem;
}

/* Small size (Table row): 36x36 frame, 22x22 item */
.size-sm {
  width: 36px;
  height: 36px;
}
.size-sm .advancement-item-icon {
  width: 22px;
  height: 22px;
}
.size-sm .advancement-fallback-letter {
  font-size: 0.85rem;
}
</style>