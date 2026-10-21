import { h, computed, type Ref } from 'vue';
import {
  useTable,
  tableFeatures,
  createFilteredRowModel,
  createSortedRowModel,
  columnFilteringFeature,
  rowSortingFeature,
  filterFn_includesString,
  type ColumnDef,
  type FilterFn,
} from '@tanstack/vue-table';
import type { AdvancementItem } from '../domain/advancement/models';
import { formatRewardSummary } from '../domain/reward/models';
import AdvancementFrameIcon from '../components/advancement/AdvancementFrameIcon.vue';

/**
 * Custom multi-select filter function matching rows whose column value is inside the selected array.
 *
 * @param {any} row - TanStack table row instance.
 * @param {string} columnId - Target column identifier.
 * @param {unknown} filterValue - Array of active string filter values.
 * @returns {boolean} True if the row matches the active filter selection.
 */
const selectedValuesFilter: FilterFn<any, AdvancementItem> = (
  row,
  columnId,
  filterValue
) => {
  const filters = filterValue as string[] | undefined;
  if (!filters || filters.length === 0) return true;
  return filters.includes(row.getValue(columnId) as string);
};

const columns: ColumnDef<any, AdvancementItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) =>
      h('div', { class: 'table-title-cell' }, [
        h(AdvancementFrameIcon, {
          iconId: row.original.icon_id,
          playerHeadData: row.original.player_head_data,
          frame: row.original.frame,
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
    cell: ({ row }) => formatRewardSummary(row.original.rewards),
  },
];

/**
 * Initializes the TanStack table instance and reactive row model for advancements.
 *
 * @param {Ref<AdvancementItem[]>} dataRef - Reactive reference containing advancement items.
 * @returns {{ table: any, rows: ComputedRef<any[]> }} Configured table instance and computed rows.
 */
export function useAdvancementTable(dataRef: Ref<AdvancementItem[]>) {
  const features = tableFeatures({
    columnFilteringFeature,
    rowSortingFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
      includesString: filterFn_includesString,
    },
  });

  const table = useTable({
    features,
    get data() {
      return dataRef.value;
    },
    columns,
  });

  const rows = computed(() => table.getRowModel().rows);

  return { table, rows };
}
