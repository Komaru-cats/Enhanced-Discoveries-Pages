<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue';
import type {AdvancementItem} from '../types/advancement';
import AdvancementIcon from './AdvancementIcon.vue';
import RewardItemCard from './RewardItemCard.vue';
import RewardTrophyCard from './RewardTrophyCard.vue';

defineProps<{
  advancement: AdvancementItem;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/**
 * Emits the close event when the Escape key is detected.
 * @param {KeyboardEvent} event The keyboard event payload.
 */
function handleEscKey(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
});
</script>

<template>
  <aside class="detail-drawer glass-panel">
    <div class="drawer-header">
      <div class="drawer-title-group">
        <AdvancementIcon
            :icon-id="advancement.icon_id"
            :player-head-data="advancement.player_head_data"
            :frame="(advancement as any).frame || 'task'"
            :title="advancement.title"
            size="md"
        />
        <h3>{{ advancement.title }}</h3>
      </div>

      <button class="close-btn" @click="$emit('close')" aria-label="Close">&times;</button>
    </div>

    <div class="drawer-content custom-scrollbar">
      <!-- Description -->
      <div class="field-group">
        <label>Description</label>
        <p class="description-text">{{ advancement.description }} </p>
      </div>

      <!-- Actual Requirements -->
      <div v-if="advancement.requirements && Object.keys(advancement.requirements).length > 0" class="field-group">
        <label>Requirements</label>

        <div class="requirements-container">
          <template v-for="(criterion, name, index) in advancement.requirements" :key="name">
            <hr v-if="index > 0" class="micro-divider"/>
            <div v-if="name === 'default'" class="requirement-text">
              {{ criterion }}
            </div>
            <div v-else class="requirement-text">
              <span class="req-key">{{ name }} specific:</span>
              <span>{{ criterion }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Rewards -->
      <div class="field-group">
        <label>Rewards</label>
        <div v-if="advancement.rewards" class="reward-box glass-element">
          <div v-if="advancement.rewards.experience" class="reward-item">
            <span class="reward-label">Experience:</span>
            <span class="reward-value">+{{ advancement.rewards.experience }} XP</span>
          </div>

          <div v-if="advancement.rewards.items?.length" class="reward-item">
            <span class="reward-label">Items:</span>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem;">
              <RewardItemCard
                  v-for="item in advancement.rewards.items"
                  :key="item.id"
                  :item="item"
              />
            </div>
          </div>

          <div v-if="advancement.rewards.trophies?.length" class="reward-item">
            <span class="reward-label">Trophies:</span>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.25rem;">
              <RewardTrophyCard
                  v-for="trophy in advancement.rewards.trophies"
                  :key="trophy.id"
                  :trophy="trophy"
              />
            </div>
          </div>
        </div>
        <p v-else class="text-muted italic">No rewards specified.</p>
      </div>

      <!-- Tier -->
      <div class="field-group">
        <label>Tier</label>
        <div>
          <span
              class="badge"
              :style="{
              color: advancement.tier.color,
              borderColor: advancement.tier.color,
              backgroundColor: `${advancement.tier.color}1A`,
            }"
          >
            {{ advancement.tier.display_name }}
          </span>
        </div>
      </div>

      <!-- Tab -->
      <div class="field-group">
        <label>Tab</label>
        <div>
          <span
              class="badge"
              :style="{
              color: advancement.tab.color,
              borderColor: advancement.tab.color,
              backgroundColor: `${advancement.tab.color}1A`,
            }"
          >
            {{ advancement.tab.display_name }}
          </span>
        </div>
      </div>

      <!-- Path -->
      <div class="field-group">
        <label>Path</label>
        <code>{{ advancement.mc_path }}</code>
      </div>

      <!-- Parent -->
      <div class="field-group">
        <label>Parent</label>
        <code>{{ advancement.parent || 'None' }}</code>
      </div>
    </div>
  </aside>
</template>

<style scoped>
@import '../assets/rewards.css';
@import '../assets/utilities.css';
@import '../assets/global.css';

.detail-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 760px;
  max-width: 100%;
  height: 100%;
  box-shadow: var(--glass-shadow);
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--glass-border);
}

.drawer-title-group {
  display: flex;
  align-items: center;
  gap: 1.15rem;
}

.drawer-header h3 {
  font-family: 'Minecraft', monospace;
  font-size: 1.55rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  margin: 0;
  color: var(--text-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.close-btn {
  background: var(--accent-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--accent-active);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.drawer-content {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.field-group label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.description-text {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0;
  white-space: pre-wrap;
}

.requirements-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--glass-border);
  padding: 0.85rem 1rem;
  border-radius: 8px;
}

.micro-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 0.15rem 0;
  width: 100%;
}

.requirement-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.req-key {
  color: var(--text-secondary);
  font-weight: 600;
  margin-right: 0.25rem;
  text-transform: capitalize;
}
</style>