<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    color?: string;
    size?: 'sm' | 'md';
    variant?: 'pill' | 'enchantment' | 'unbreakable' | 'count';
    level?: number | string;
  }>(),
  {
    size: 'md',
    variant: 'pill',
  }
);

const pillStyle = computed(() => {
  if (props.variant !== 'pill' || !props.color) return undefined;
  return {
    color: props.color,
    borderColor: props.color,
    backgroundColor: `${props.color}1A`,
  };
});
</script>

<template>
  <span
    v-if="variant === 'enchantment'"
    class="enchantment-badge"
  >
    <span class="ench-name">{{ label }}</span>
    <span v-if="level !== undefined" class="ench-level">{{ level }}</span>
  </span>

  <span
    v-else-if="variant === 'unbreakable'"
    class="unbreakable-badge"
  >
    <span class="unbreakable-text">{{ label }}</span>
  </span>

  <span
    v-else-if="variant === 'count'"
    class="reward-count-badge"
  >
    {{ label }}
  </span>

  <span
    v-else
    :class="['badge', `badge-${size}`]"
    :style="pillStyle"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--accent-bg);
  border: 1px solid var(--glass-border);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-primary);
}

.badge-sm {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
}

.reward-count-badge {
  background-color: var(--glass-border);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid var(--glass-border);
}

.enchantment-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 4px;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  gap: 0.3rem;
}

.ench-name {
  color: #d8b4fe;
}

.ench-level {
  color: #ffffff;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.3);
  padding: 0 0.3rem;
  border-radius: 2px;
}

.unbreakable-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 4px;
  padding: 0.15rem 0.5rem;
}

.unbreakable-text {
  color: #fbbf24;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.7rem;
}
</style>
