<script setup lang="ts">
import { ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';

const props = withDefaults(
  defineProps<{
    options: readonly string[];
    modelValue?: string[];
    placeholder?: string;
  }>(),
  {
    modelValue: () => [],
    placeholder: 'All',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[] | undefined): void;
}>();

const detailsRef = ref<HTMLDetailsElement | null>(null);

/**
 * Closes the native details dropdown element if it is currently open.
 *
 * @returns {void}
 */
function closeDropdown(): void {
  if (detailsRef.value?.hasAttribute('open')) {
    detailsRef.value.removeAttribute('open');
  }
}

useClickOutside(detailsRef, closeDropdown);

/**
 * Toggles a single option inside the multi-select array and emits the updated selection.
 *
 * @param {string} option - The option string to toggle.
 * @returns {void}
 */
function toggleOption(option: string): void {
  const current = props.modelValue ?? [];
  const next = current.includes(option)
    ? current.filter((item) => item !== option)
    : [...current, option];

  emit('update:modelValue', next.length > 0 ? next : undefined);
}
</script>

<template>
  <details ref="detailsRef" class="custom-dropdown">
    <summary class="dropdown-summary">
      {{ modelValue?.length || placeholder }} selected
    </summary>
    <div class="dropdown-menu custom-scrollbar">
      <label v-for="option in options" :key="option" class="dropdown-item">
        <input
          type="checkbox"
          :checked="modelValue?.includes(option)"
          @change="toggleOption(option)"
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

.dropdown-item input[type='checkbox'] {
  accent-color: var(--accent-color);
  cursor: pointer;
}
</style>
