<script setup lang="ts">
import type { TrophyReward } from '../../domain/reward/models';
import BaseAssetIcon from '../ui/BaseAssetIcon.vue';
import BaseBadge from '../ui/BaseBadge.vue';

defineProps<{
  trophy: TrophyReward;
}>();
</script>

<template>
  <div class="reward-card-base trophy-card-layout">
    <div class="trophy-header">
      <div class="reward-icon-wrapper trophy-size">
        <BaseAssetIcon
          :item-id="trophy.id"
          :player-head-data="trophy.player_head_data"
          :alt="trophy.displayName"
          :fallback-text="trophy.title"
          img-class="reward-icon trophy-shadow"
          fallback-class="reward-icon-fallback"
        />
      </div>

      <div class="trophy-titles">
        <span
          class="trophy-title"
          :style="{
            color: trophy.titleColor || 'var(--text-primary)',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
          }"
        >
          {{ trophy.title }}
        </span>
        <span class="trophy-subtitle">{{ trophy.displayName }}</span>
      </div>

      <BaseBadge
        v-if="trophy.count > 1"
        variant="count"
        :label="String(trophy.count)"
      />
    </div>

    <p v-if="trophy.description" class="trophy-description">
      {{ trophy.description }}
    </p>

    <div
      v-if="trophy.enchantments.length > 0 || trophy.unbreakable"
      class="badges-container"
    >
      <BaseBadge
        v-for="ench in trophy.enchantments"
        :key="ench.id"
        variant="enchantment"
        :label="ench.name"
        :level="ench.level"
      />

      <BaseBadge
        v-if="trophy.unbreakable"
        variant="unbreakable"
        label="Unbreakable"
      />
    </div>
  </div>
</template>

<style scoped>
.reward-card-base {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.reward-card-base:hover {
  background: rgba(255, 255, 255, 0.06);
}

.trophy-card-layout {
  padding: 1rem;
  gap: 0.85rem;
}

.trophy-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reward-icon-wrapper.trophy-size {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.reward-icon.trophy-shadow) {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
}

:deep(.reward-icon-fallback) {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1.1rem;
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
  color: var(--text-tertiary);
}

.trophy-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
  padding-left: 3.5rem;
  white-space: pre-wrap;
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
