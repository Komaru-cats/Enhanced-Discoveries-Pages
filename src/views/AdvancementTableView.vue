<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, h } from 'vue';
import { RouterLink } from 'vue-router';
import {
  useTable,
  tableFeatures,
  FlexRender,
  type ColumnDef,
  type FilterFn,
  type Column,
  columnFilteringFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_includesString,
} from '@tanstack/vue-table';
import type { AdvancementItem } from '../types/advancement';
import { loadAdvancements } from '../services/advancementService';
import AdvancementDetailDrawer from '../components/AdvancementDetailDrawer.vue';
import AdvancementIcon from '../components/AdvancementIcon.vue';

// Use shallowRef to preserve private fields
const advancements = shallowRef<AdvancementItem[]>([]);
const selectedAdvancement = shallowRef<AdvancementItem | null>(null);

/**
 * Loads the initial advancement list from the service layer upon component mount.
 * @returns {Promise<void>}
 */
async function initAdvancements(): Promise<void> {
  try {
    advancements.value = await loadAdvancements();
  } catch (error) {
    console.error('Error fetching advancement data:', error);
  }
}

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
});

/**
 * Updates the currently active advancement to display inside the details drawer.
 * @param {AdvancementItem} advancement The clicked advancement object.
 */
function handleRowClick(advancement: AdvancementItem): void {
  selectedAdvancement.value = advancement;
}

/**
 * Resets the active advancement selection, closing the drawer.
 */
function closeDetails(): void {
  selectedAdvancement.value = null;
}

const selectedValuesFilter: FilterFn<typeof features, AdvancementItem> = (
    row,
    columnId,
    filterValue
) => {
  const filters = filterValue as string[];
  if (!filters || filters.length === 0) return true;
  return filters.includes(row.getValue(columnId) as string);
};

const tabOptions = [
  'Adventure', 'Animals', 'B&C Advancements', 'Biomes', 'Building',
  'Super Challenges', 'Enchanting', 'The End', 'Farming', 'Mining',
  'Monsters', 'Nether', 'Potions', 'Redstone', 'Statistics', 'Weaponry'
];

const tierOptions = [
  'Task', 'Goal', 'Challenge', 'Super Challenge',
  'Root', 'Milestone', 'Advancement Legend', 'Hidden'
];

function toggleFilter(column: Column<typeof features, AdvancementItem>, value: string) {
  const currentFilterValue = (column.getFilterValue() as string[]) || [];
  const newFilterValue = currentFilterValue.includes(value)
      ? currentFilterValue.filter((v) => v !== value)
      : [...currentFilterValue, value];

  column.setFilterValue(newFilterValue.length > 0 ? newFilterValue : undefined);
}

/**
 * Formats advancement rewards into a readable summary string for table cell rendering.
 * @param {AdvancementItem['rewards']} [rewards] The rewards payload associated with an advancement.
 * @returns {string} Comma-separated summary of the provided rewards.
 */
function formatRewardPreview(rewards?: AdvancementItem['rewards']): string {
  if (!rewards) return 'None';

  const parts: string[] = [];
  if (rewards.experience) {
    parts.push(`+${rewards.experience} XP`);
  }
  if (rewards.items?.length) {
    parts.push(rewards.items.length === 1 ? '1 Item' : `${rewards.items.length} Items`);
  }
  if (rewards.trophies?.length) {
    parts.push(rewards.trophies.length === 1 ? '1 Trophy' : `${rewards.trophies.length} Trophies`);
  }

  return parts.length > 0 ? parts.join(', ') : 'None';
}

const columns: ColumnDef<typeof features, AdvancementItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) =>
        h('div', { class: 'table-title-cell' }, [
          h(AdvancementIcon, {
            iconId: row.original.icon_id,
            playerHeadData: row.original.player_head_data,
            frame: (row.original as any).frame || 'task',
            title: row.original.title,
            size: 'sm',
          }),
          h('span', { class: 'table-title-text' }, row.original.title),
        ]),
    filterFn: 'includesString',
  },
  {
    id: 'tab',
    header: 'Tab',
    accessorFn: (row) => row.tab.display_name,
    filterFn: selectedValuesFilter,
  },
  {
    id: 'tier',
    header: 'Tier',
    accessorFn: (row) => row.tier.display_name,
    filterFn: selectedValuesFilter,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    filterFn: 'includesString',
    cell: ({ row }) =>
        h(
            'span',
            {
              style: {
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              },
              title: row.original.description,
            },
            row.original.description
        ),
  },
  {
    id: 'rewards',
    header: 'Rewards',
    cell: ({ row }) => formatRewardPreview(row.original.rewards),
  },
];

const table = useTable({
  features,
  data: advancements,
  columns,
});

const rows = computed(() => table.getRowModel().rows);

/**
 * Handles closing all open filter dropdowns when clicking outside or pressing Escape.
 * @param {Event} event The DOM event (click or keydown).
 */
function closeDropdownsOnOutside(event: Event): void {
  if (event.type === 'keydown') {
    if ((event as KeyboardEvent).key !== 'Escape') return;
  } else if (event.type === 'click') {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.custom-dropdown')) {
      return;
    }
  }

  const openDropdowns = document.querySelectorAll('details.custom-dropdown[open]');
  openDropdowns.forEach((details) => details.removeAttribute('open'));
}

onMounted(() => {
  void initAdvancements();

  document.addEventListener('click', closeDropdownsOnOutside);
  document.addEventListener('keydown', closeDropdownsOnOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownsOnOutside);
  document.removeEventListener('keydown', closeDropdownsOnOutside);
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
      <div class="meta-info">Total advancements: <strong>{{ advancements.length }}</strong></div>
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

              <div v-if="header.column.getCanFilter() && (header.column.id === 'title' || header.column.id === 'description')" class="filter-wrapper">
                <input
                    type="text"
                    :value="header.column.getFilterValue() as string"
                    @input="header.column.setFilterValue(($event.target as HTMLInputElement).value)"
                    :placeholder="`Search...`"
                    class="filter-input"
                />
              </div>

              <div v-if="header.column.getCanFilter() && (header.column.id === 'tab' || header.column.id === 'tier')" class="filter-wrapper">
                <details class="custom-dropdown">
                  <summary class="dropdown-summary">
                    {{ (header.column.getFilterValue() as string[])?.length || 'All' }} selected
                  </summary>
                  <div class="dropdown-menu custom-scrollbar">
                    <label
                        v-for="option in (header.column.id === 'tab' ? tabOptions : tierOptions)"
                        :key="option"
                        class="dropdown-item"
                    >
                      <input
                          type="checkbox"
                          :checked="(header.column.getFilterValue() as string[])?.includes(option)"
                          @change="toggleFilter(header.column, option)"
                      />
                      <span class="option-text">{{ option }}</span>
                    </label>
                  </div>
                </details>
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
            :class="{
              'row-active': selectedAdvancement?.mc_path === row.original.mc_path,
            }"
            :style="{
              backgroundImage: `linear-gradient(to right, ${row.original.tier.color}50 0%, transparent 30%)`
            }"
            @click="handleRowClick(row.original)"
        >
          <td v-for="cell in row.getAllCells()" :key="cell.id">
            <FlexRender :cell="cell" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Slide-over Drawer -->
    <Transition name="slide">
      <AdvancementDetailDrawer
          v-if="selectedAdvancement"
          :advancement="selectedAdvancement"
          @close="closeDetails"
      />
    </Transition>
  </div>
</template>

<style scoped>
@import '../assets/global.css';
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