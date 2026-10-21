<script setup lang="ts">
import { computed } from 'vue';
import BaseAssetIcon from '../ui/BaseAssetIcon.vue';
import type { PlayerHeadData } from '../../domain/advancement/types';

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

const frameUrl = computed(
  () => `${import.meta.env.BASE_URL}frames/${props.frame || 'task'}.png`
);
</script>

<template>
  <div
    class="advancement-frame"
    :class="`size-${size}`"
    :style="{ backgroundImage: `url(${frameUrl})` }"
  >
    <BaseAssetIcon
      :item-id="iconId"
      :player-head-data="playerHeadData"
      :alt="title"
      :fallback-text="title"
      img-class="advancement-item-icon"
      fallback-class="advancement-fallback-letter"
    />
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

.size-md {
  width: 52px;
  height: 52px;
}

.size-md :deep(.advancement-item-icon) {
  width: 32px;
  height: 32px;
}

.size-md :deep(.advancement-fallback-letter) {
  font-size: 1.2rem;
}

.size-sm {
  width: 36px;
  height: 36px;
}

.size-sm :deep(.advancement-item-icon) {
  width: 22px;
  height: 22px;
}

.size-sm :deep(.advancement-fallback-letter) {
  font-size: 0.85rem;
}
</style>
