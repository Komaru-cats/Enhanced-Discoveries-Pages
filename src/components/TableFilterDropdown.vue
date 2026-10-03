<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Column } from '@tanstack/vue-table';
import type { AdvancementItem } from '../types/advancement';

const props = defineProps<{
  column: Column<any, AdvancementItem>;
  options: string[];
}>();

const detailsRef = ref<HTMLDetailsElement | null>(null);

/**
 * Toggles a filter option on the provided table column.
 *
 * @param {string} value The filter option to toggle.
 * @returns {void}
 */
function toggleFilter(value: string): void {
  const currentFilterValue = (props.column.getFilterValue() as string[]) || [];
  const newFilterValue = currentFilterValue.includes(value)
      ? currentFilterValue.filter((v) => v !== value)
      : [...currentFilterValue, value];

  props.column.setFilterValue(newFilterValue.length > 0 ? newFilterValue : undefined);
}

/**
 * Handles closing the dropdown when clicking outside or pressing Escape.
 *
 * @param {Event} event The DOM event (click or keydown).
 * @returns {void}
 */
function closeDropdownOnOutside(event: Event): void {
  if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') {
    return;
  }

  if (event.type === 'click') {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.custom-dropdown') === detailsRef.value) return;
  }

  if (detailsRef.value?.hasAttribute('open')) {
    detailsRef.value.removeAttribute('open');
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutside);
  document.addEventListener('keydown', closeDropdownOnOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutside);
  document.removeEventListener('keydown', closeDropdownOnOutside);
});
</script>

<template>
  <details ref="detailsRef" class="custom-dropdown">
    <summary class="dropdown-summary">
      {{ (column.getFilterValue() as string[])?.length || 'All' }} selected
    </summary>
    <div class="dropdown-menu custom-scrollbar">
      <label v-for="option in options" :key="option" class="dropdown-item">
        <input
            type="checkbox"
            :checked="(column.getFilterValue() as string[])?.includes(option)"
            @change="toggleFilter(option)"
        />
        <span class="option-text">{{ option }}</span>
      </label>
    </div>
  </details>
</template>

<style scoped>

.custom-dropdown {
  position: relative;
}

.dropdown-summary {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  color: var(--text-primary);
  list-style: none;
  user-select: none;
  transition: border-color 0.2s ease;
}

.dropdown-summary::-webkit-details-marker {
  display: none;
}

.custom-dropdown[open] .dropdown-summary {
  border-color: rgba(255, 255, 255, 0.3);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #18181b;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  padding: 0.5rem;
  min-width: 200px;
  max-height: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;
  text-transform: none;
  font-weight: 400;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-item input[type="checkbox"] {
  accent-color: var(--accent-color);
  cursor: pointer;
}
</style>