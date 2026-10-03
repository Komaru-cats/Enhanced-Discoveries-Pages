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
    type FilterFn
} from '@tanstack/vue-table';
import type { AdvancementItem } from '../types/advancement';
import AdvancementIcon from '../components/AdvancementIcon.vue';

export const tabOptions = [
    'Adventure', 'Animals', 'B&C Advancements', 'Biomes', 'Building',
    'Super Challenges', 'Enchanting', 'The End', 'Farming', 'Mining',
    'Monsters', 'Nether', 'Potions', 'Redstone', 'Statistics', 'Weaponry'
];

export const tierOptions = [
    'Task', 'Goal', 'Challenge', 'Super Challenge',
    'Root', 'Milestone', 'Advancement Legend', 'Hidden'
];

/**
 * Formats advancement rewards into a readable summary string for table cell rendering
 * by calculating the total quantity of items and trophies rather than array length.
 *
 * @param {AdvancementItem['rewards']} [rewards] The rewards payload associated with an advancement.
 * @returns {string} Comma-separated summary of the provided rewards.
 * @throws {Error} No exceptions are thrown by this function.
 * @example
 * const summary = formatRewardPreview({
 *   experience: 125,
 *   items: [{ id: "minecraft:bell", count: 16 }],
 *   trophies: [{ id: "minecraft:bell", count: 1, unbreakable: false }]
 * });
 * // Returns "+125 XP, 16 Items, 1 Trophy"
 */
function formatRewardPreview(rewards?: AdvancementItem['rewards']): string {
    if (!rewards) return 'None';

    const parts: string[] = [];

    if (rewards.experience) {
        parts.push(`+${rewards.experience} XP`);
    }

    if (rewards.items?.length) {
        const totalItems = rewards.items.reduce((sum, item) => sum + (item.count || 0), 0);
        if (totalItems > 0) {
            parts.push(totalItems === 1 ? '1 Item' : `${totalItems} Items`);
        }
    }

    if (rewards.trophies?.length) {
        const totalTrophies = rewards.trophies.reduce((sum, trophy) => sum + (trophy.count || 0), 0);
        if (totalTrophies > 0) {
            parts.push(totalTrophies === 1 ? '1 Trophy' : `${totalTrophies} Trophies`);
        }
    }

    return parts.length > 0 ? parts.join(', ') : 'None';
}

const selectedValuesFilter: FilterFn<any, AdvancementItem> = (
    row,
    columnId,
    filterValue
) => {
    const filters = filterValue as string[];
    if (!filters || filters.length === 0) return true;
    return filters.includes(row.getValue(columnId) as string);
};

const columns: ColumnDef<any, AdvancementItem>[] = [
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

/**
 * Initializes the TanStack table configuration for advancements.
 *
 * @param {Ref<AdvancementItem[]>} dataRef Reactive reference containing the advancement items.
 * @returns {object} The table instance and computed rows.
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
        get data() { return dataRef.value; },
        columns,
    });

    const rows = computed(() => table.getRowModel().rows);

    return { table, rows };
}