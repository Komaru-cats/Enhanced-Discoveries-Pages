<script setup lang="ts">
import type { ItemReward } from '../../domain/reward/models';
import BaseAssetIcon from '../ui/BaseAssetIcon.vue';
import BaseBadge from '../ui/BaseBadge.vue';

defineProps<{
  item: ItemReward;
}>();
</script>

<template>
  <div class="reward-card-base item-card-layout">
    <div class="item-main-row">
      <div class="item-identity">
        <div class="reward-icon-wrapper">
          <BaseAssetIcon
            :item-id="item.id"
            :player-head-data="item.player_head_data"
            :alt="item.displayName"
            :fallback-text="item.displayName"
            img-class="reward-icon"
            fallback-class="reward-icon-fallback"
          />
        </div>
        <span class="item-name">{{ item.displayName }}</span>
      </div>
      <BaseBadge variant="count" :label="String(item.count)" />
    </div>

    <div v-if="item.custom_name" class="item-detail-row">
      <span class="text-muted">Name:</span>
      <span class="custom-name italic">"{{ item.custom_name }}"</span>
    </div>

    <div v-if="item.enchantments.length > 0" class="item-detail-row enchantments-container">
      <BaseBadge
        v-for="ench in item.enchantments"
        :key="ench.id"
        variant="enchantment"
        :label="ench.name"
        :level="ench.level"
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

.reward-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.reward-icon) {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
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

.enchantments-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: -0.25rem;
}

.custom-name {
  color: #fbbf24;
}
</style>
