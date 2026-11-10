<script setup lang="ts">
import { ref } from 'vue';
import { useClickOutside } from '../../composables/useClickOutside';

const props = defineProps<{
  modelValue: string;
  versions: string[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const detailsRef = ref<HTMLDetailsElement | null>(null);

function closeDropdown(): void {
  if (detailsRef.value?.hasAttribute('open')) {
    detailsRef.value.removeAttribute('open');
  }
}

useClickOutside(detailsRef, closeDropdown);

function selectVersion(version: string): void {
  emit('update:modelValue', version);
  closeDropdown();
}
</script>

<template>
  <details
      v-if="versions.length > 0"
      ref="detailsRef"
      class="custom-dropdown"
      :class="{ 'is-disabled': disabled }"
  >
    <summary class="dropdown-summary">
      <span>v{{ modelValue }}</span>
      <svg class="chevron" width="20" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>

    <div class="dropdown-menu custom-scrollbar">
      <button
          v-for="ver in versions"
          :key="ver"
          type="button"
          class="dropdown-item"
          :class="{ 'is-selected': ver === modelValue }"
          @click="selectVersion(ver)"
      >
        v{{ ver }}
      </button>
    </div>
  </details>
</template>

<style scoped>
.custom-dropdown {
  position: relative;
  display: inline-block;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.dropdown-summary::-webkit-details-marker {
  display: none;
}

.chevron {
  opacity: 0.5;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.custom-dropdown[open] .chevron {
  transform: rotate(180deg);
  opacity: 0.8;
}

.custom-dropdown:not(.is-disabled) .dropdown-summary:hover,
.custom-dropdown[open] .dropdown-summary {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.04);
}

.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #18181b;
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  padding: 0.3rem;
  min-width: 82px;
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.dropdown-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 0.8rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease, color 0.15s ease;
  font-family: inherit;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.dropdown-item.is-selected {
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
}
</style>