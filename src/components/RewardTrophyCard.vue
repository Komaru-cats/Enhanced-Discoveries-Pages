<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TrophyRewardItemProps } from '../types/trophyReward';
import { formatMinecraftId } from '../utils/minecraftUtils';
import { getAssetUrl } from '../utils/iconUtils';

const props = defineProps<{
  trophy: TrophyRewardItemProps;
}>();

const displayName = computed(() => formatMinecraftId(props.trophy.id));

// Resolves local static path (custom head texture hash/uuid takes precedence over item id)
const iconUrl = computed(() => getAssetUrl(props.trophy.id, props.trophy.player_head_data));

const hasImageError = ref(false);
const fallbackLetter = computed(() => {
  const nameToUse = props.trophy.title || displayName.value;
  return nameToUse.charAt(0).toUpperCase();
});

const enchantmentsList = computed(() => {
  if (!props.trophy.enchantments) return [];
  return Object.entries(props.trophy.enchantments).map(([key, level]) => ({
    name: formatMinecraftId(key),
    level
  }));
});
</script>

<template>
  <div class="reward-card-base trophy-card-layout">
    <div class="trophy-header">

      <div class="reward-icon-wrapper trophy-size">
        <img
            v-if="!hasImageError"
            :src="iconUrl"
            :alt="displayName"
            class="reward-icon trophy-shadow"
            loading="lazy"
            decoding="async"
            @error="hasImageError = true"
        />
        <div v-else class="reward-icon-fallback">
          {{ fallbackLetter }}
        </div>
      </div>

      <div class="trophy-titles">
        <span
            class="trophy-title"
            :style="{
            color: trophy.title_color || 'var(--text-primary)',
            textShadow: '0 4px 8px rgba(0,0,0,0.4)'
          }"
        >
          {{ trophy.title || displayName }}
        </span>
        <span class="trophy-subtitle">{{ displayName }}</span>
      </div>

      <span v-if="trophy.count > 1" class="reward-count-badge">{{ trophy.count }}</span>
    </div>

    <p v-if="trophy.description" class="trophy-description">
      {{ trophy.description }}
    </p>

    <div v-if="enchantmentsList.length > 0 || trophy.unbreakable" class="badges-container">
      <div v-for="ench in enchantmentsList" :key="ench.name" class="enchantment-badge">
        <span class="ench-name">{{ ench.name }}</span>
        <span class="ench-level">{{ ench.level }}</span>
      </div>

      <div v-if="trophy.unbreakable" class="unbreakable-badge">
        <span class="unbreakable-text">Unbreakable</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/global.css';
@import '../assets/rewards.css';

.trophy-card-layout {
  padding: 1rem;
  gap: 0.85rem;
}

.trophy-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.trophy-titles {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.15rem;
}

.trophy-title {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.trophy-subtitle {
  font-size: 0.8rem;
  color: var(--text-tertiary, #71717a);
}

.trophy-description {
  font-size: 0.9rem;
  color: var(--text-secondary, #a1a1aa);
  line-height: 1.5;
  margin: 0;
  padding-left: 3.5rem;
}

.badges-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding-left: 3.5rem;
  margin-top: 0.25rem;
}
</style>