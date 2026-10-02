<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ItemRewardItem } from '../types/itemReward';
import { formatMinecraftId } from '../utils/minecraftUtils';
import { getAssetUrl } from '../utils/iconUtils';

const props = defineProps<{
  item: ItemRewardItem;
}>();

const displayName = computed(() => formatMinecraftId(props.item.id));

const iconUrl = computed(() => getAssetUrl(props.item.id, props.item.player_head_data));

const hasImageError = ref(false);
const fallbackLetter = computed(() => displayName.value.charAt(0).toUpperCase());

const enchantmentsList = computed(() => {
  if (!props.item.enchantments) return [];
  return Object.entries(props.item.enchantments).map(([key, level]) => ({
    name: formatMinecraftId(key),
    level
  }));
});
</script>

<template>
  <div class="reward-card-base item-card-layout">
    <div class="item-main-row">
      <div class="item-identity">

        <div class="reward-icon-wrapper">
          <img
              v-if="!hasImageError"
              :src="iconUrl"
              :alt="displayName"
              class="reward-icon"
              loading="lazy"
              decoding="async"
              @error="hasImageError = true"
          />
          <div v-else class="reward-icon-fallback">
            {{ fallbackLetter }}
          </div>
        </div>

        <span class="item-name">{{ displayName }}</span>
      </div>
      <span class="reward-count-badge">{{ item.count }}</span>
    </div>

    <div v-if="item.custom_name" class="item-detail-row">
      <span class="text-muted">Name:</span>
      <span class="custom-name italic">"{{ item.custom_name }}"</span>
    </div>

    <div v-if="enchantmentsList.length > 0" class="item-detail-row enchantments-container">
      <div v-for="ench in enchantmentsList" :key="ench.name" class="enchantment-badge">
        <span class="ench-name">{{ ench.name }}</span>
        <span class="ench-level">{{ ench.level }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/global.css';
@import '../assets/rewards.css';

.item-card-layout {
  padding: 0.75rem 1rem;
  gap: 0.75rem;
}

.item-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-identity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.item-detail-row {
  padding-left: 2.75rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.item-detail-row.enchantments-container {
  margin-top: -0.25rem;
}

.custom-name { color: #fbbf24; }
.text-muted { color: var(--text-tertiary, #71717a); }
.italic { font-style: italic; }
</style>