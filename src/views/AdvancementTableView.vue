<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import { RouterLink } from 'vue-router';
import { FlexRender } from '@tanstack/vue-table';
import type { AdvancementItem } from '../types/advancement';
import { loadAdvancements } from '../services/advancementService';
import { useAdvancementTable, tabOptions, tierOptions } from '../composables/useAdvancementTable';
import AdvancementDetailDrawer from '../components/AdvancementDetailDrawer.vue';
import TableFilterDropdown from '../components/TableFilterDropdown.vue';

const advancements = shallowRef<AdvancementItem[]>([]);
const selectedAdvancement = shallowRef<AdvancementItem | null>(null);

const { table, rows } = useAdvancementTable(advancements);

/**
 * Loads the initial advancement list from the service layer upon component mount.
 *
 * @returns {Promise<void>}
 */
async function initAdvancements(): Promise<void> {
  try {
    advancements.value = await loadAdvancements();
  } catch (error) {
    console.error('Error fetching advancement data:', error);
  }
}

/**
 * Updates the currently active advancement to display inside the details drawer.
 *
 * @param {AdvancementItem} advancement The clicked advancement object.
 * @returns {void}
 */
function handleRowClick(advancement: AdvancementItem): void {
  selectedAdvancement.value = advancement;
}

/**
 * Resets the active advancement selection, closing the drawer.
 *
 * @returns {void}
 */
function closeDetails(): void {
  selectedAdvancement.value = null;
}

onMounted(() => {
  void initAdvancements();
});
</script>

<template>
  <div class="fullscreen-page theme-modern-grey">
    <header class="table-navbar glass-panel">
      <div class="nav-left">
        <RouterLink to="/" class="back-link">
          <span class="icon">&larr;</span> Dashboard
        </RouterLink>
        <h2>Advancement Table</h2>
      </div>
      <div class="meta-info">
        <template v-if="rows.length !== advancements.length">
          Showing: <strong>{{ rows.length }}</strong> of {{ advancements.length }}
        </template>
        <template v-else>
          Total: <strong>{{ advancements.length }}</strong>
        </template>
      </div>
    </header>

    <div class="table-container custom-scrollbar">
      <table class="data-table">
        <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th v-for="header in headerGroup.headers" :key="header.id">
            <div class="header-content" v-if="!header.isPlaceholder">
              <div
                  class="header-title"
                  :class="{ 'is-sortable': header.column.getCanSort() }"
                  @click="header.column.getCanSort() ? header.column.toggleSorting() : null"
              >
                <FlexRender :header="header" :props="header.getContext()" />
                <span class="sort-icon" v-if="header.column.getCanSort()">
                    <span v-if="header.column.getIsSorted() === 'asc'" class="active">↑</span>
                    <span v-else-if="header.column.getIsSorted() === 'desc'" class="active">↓</span>
                    <span v-else class="inactive">↕</span>
                  </span>
              </div>

              <div v-if="header.column.getCanFilter() && ['title', 'description'].includes(header.column.id)" class="filter-wrapper">
                <input
                    type="text"
                    :value="header.column.getFilterValue() as string"
                    @input="header.column.setFilterValue(($event.target as HTMLInputElement).value)"
                    placeholder="Search..."
                    class="filter-input"
                />
              </div>

              <div v-if="header.column.getCanFilter() && ['tab', 'tier'].includes(header.column.id)" class="filter-wrapper">
                <TableFilterDropdown
                    :column="header.column"
                    :options="header.column.id === 'tab' ? tabOptions : tierOptions"
                />
              </div>
            </div>
          </th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="row in rows"
            :key="row.id"
            class="interactive-row"
            :class="{ 'row-active': selectedAdvancement?.mc_path === row.original.mc_path }"
            :style="{ backgroundImage: `linear-gradient(to right, ${row.original.tier.color}50 0%, transparent 30%)` }"
            @click="handleRowClick(row.original)"
        >
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <FlexRender :cell="cell" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Transition name="slide">
      <AdvancementDetailDrawer
          v-if="selectedAdvancement"
          :advancement="selectedAdvancement"
          @close="closeDetails"
          @select="selectedAdvancement = $event"
      />
    </Transition>
  </div>
</template>

<style scoped>
.theme-modern-grey {
  --bg-main: #121214;
  --bg-gradient: linear-gradient(135deg, #18181b 0%, #0f0f11 100%);
  --glass-bg: rgba(39, 39, 42, 0.45);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);

  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;

  --accent-color: #d4d4d8;
  --accent-bg: rgba(212, 212, 216, 0.1);
  --accent-active: rgba(212, 212, 216, 0.15);

  --code-bg: rgba(0, 0, 0, 0.3);
  --row-hover: rgba(255, 255, 255, 0.03);
  --row-active: rgba(255, 255, 255, 0.07);
}

:deep(.table-title-cell) {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  overflow: hidden;
}

:deep(.table-title-text) {
  font-family: 'Minecraft', monospace;
  font-size: 1.15rem;
  letter-spacing: 0.04em;
  font-weight: 400;
  line-height: 1;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  user-select: none;
}

.header-title.is-sortable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.header-title.is-sortable:hover {
  color: var(--text-primary);
}

.sort-icon {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}
.sort-icon .active { color: var(--accent-color); font-weight: bold; }
.sort-icon .inactive { opacity: 0.3; }

.filter-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text-primary);
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  outline: none;
  transition: border-color 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.filter-input:focus {
  border-color: rgba(255, 255, 255, 0.3);
}


* {
  box-sizing: border-box;
}

.fullscreen-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--bg-gradient);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
}

.table-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  border-bottom: 1px solid var(--glass-border);
  border-top: none;
  border-left: none;
  border-right: none;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-left h2 {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: -0.01em;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--text-primary);
}

.meta-info {
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: var(--accent-bg);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--glass-border);
}

.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 2.5rem 2.5rem 2.5rem;
}

.data-table {
  width: 100%;
  display: block;
  text-align: left;
  font-size: 0.95rem;
}

.data-table thead {
  display: block;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 5;
}

.data-table thead tr {
  display: flex;
  width: 100%;
}

.data-table th {
  flex: 1;
  min-width: 0;
  background: rgba(24, 24, 27, 0.85);
  backdrop-filter: blur(12px);
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--glass-border);
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.data-table tbody {
  display: block;
  width: 100%;
}

.interactive-row {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: stretch;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  border-radius: 6px;
  margin-top: 2px;
}

.interactive-row td {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

/* Width allocations for columns */
.data-table th:nth-child(1), .interactive-row td:nth-child(1) { flex: 1.5; }
.data-table th:nth-child(2), .interactive-row td:nth-child(2) { flex: 0.6; }
.data-table th:nth-child(3), .interactive-row td:nth-child(3) { flex: 0.6; }
.data-table th:nth-child(4), .interactive-row td:nth-child(4) { flex: 3; }
.data-table th:nth-child(5), .interactive-row td:nth-child(5) { flex: 1; }

.interactive-row:hover {
  background-color: var(--row-hover);
}

.interactive-row.row-active {
  background-color: var(--row-active);
  box-shadow: inset 3px 0 0 var(--accent-color);
}

/* Drawer slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>