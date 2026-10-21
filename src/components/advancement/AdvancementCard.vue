<script setup lang="ts">
import type {
  AdvancementItem,
  ParentAdvancementItem,
} from '../../domain/advancement/models';
import BaseBadge from '../ui/BaseBadge.vue';
import AdvancementFrameIcon from './AdvancementFrameIcon.vue';

const props = withDefaults(
  defineProps<{
    item: AdvancementItem | ParentAdvancementItem;
    clickable?: boolean;
  }>(),
  {
    clickable: false,
  }
);

const emit = defineEmits<{
  (e: 'select'): void;
}>();

/**
 * Emits the select event when the card is interactive and clicked by the user.
 *
 * @returns {void}
 */
function handleClick(): void {
  if (props.clickable) {
    emit('select');
  }
}
</script>

<template>
  <div
    class="advancement-card glass-element"
    :class="{ 'is-clickable': clickable }"
    @click="handleClick"
  >
    <div class="card-header">
      <AdvancementFrameIcon
        :icon-id="item.icon_id || ''"
        :player-head-data="item.player_head_data"
        :frame="item.frame || 'task'"
        :title="item.title || ''"
        size="sm"
      />
      <div class="card-header-info">
        <h4>{{ item.title || item.mc_path }}</h4>
        <div class="card-badges">
          <BaseBadge
            v-if="item.tier"
            :label="item.tier.display_name"
            :color="item.tier.color"
            size="sm"
          />
        </div>
      </div>
    </div>

    <p v-if="item.description" class="card-description">
      {{ item.description }}
    </p>

    <div class="card-path">
      <span class="path-label">Path:</span>
      <code>{{ item.mc_path }}</code>
    </div>
  </div>
</template>

<style scoped>
.advancement-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  transition: all 0.2s ease;
}

.advancement-card.is-clickable {
  cursor: pointer;
}

.advancement-card.is-clickable:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateX(4px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.card-header-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.card-header-info h4 {
  font-family: 'Minecraft', monospace;
  font-size: 1.05rem;
  font-weight: 400;
  margin: 0;
  color: var(--text-primary);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.card-description {
  color: var(--text-primary);
  line-height: 1.5;
  font-size: 0.88rem;
  margin: 0;
  white-space: pre-wrap;
}

.card-path {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.path-label {
  color: var(--text-secondary);
  font-weight: 600;
}
</style>
