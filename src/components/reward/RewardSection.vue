<script setup lang="ts">
import type { Reward } from '../../domain/reward/models';
import RewardItemCard from './RewardItemCard.vue';
import RewardTrophyCard from './RewardTrophyCard.vue';

defineProps<{
  rewards?: Reward;
}>();
</script>

<template>
  <div v-if="rewards && rewards.hasAnyReward" class="reward-box glass-element">
    <div v-if="rewards.experience" class="reward-item">
      <span class="reward-label">Experience:</span>
      <span class="reward-value">+{{ rewards.experience }} XP</span>
    </div>

    <div v-if="rewards.items.length > 0" class="reward-item">
      <span class="reward-label">Items:</span>
      <div class="reward-cards-list items-gap">
        <RewardItemCard
          v-for="item in rewards.items"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>

    <div v-if="rewards.trophies.length > 0" class="reward-item">
      <span class="reward-label">Trophies:</span>
      <div class="reward-cards-list trophies-gap">
        <RewardTrophyCard
          v-for="trophy in rewards.trophies"
          :key="trophy.id"
          :trophy="trophy"
        />
      </div>
    </div>
  </div>
  <p v-else class="text-muted italic">No rewards specified.</p>
</template>

<style scoped>
.reward-box {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reward-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reward-label {
  font-size: 1rem;
  color: var(--text-secondary);
}

.reward-value {
  font-weight: 500;
}

.reward-cards-list {
  display: flex;
  flex-direction: column;
  margin-top: 0.25rem;
}

.items-gap {
  gap: 0.5rem;
}

.trophies-gap {
  gap: 0.75rem;
}
</style>
