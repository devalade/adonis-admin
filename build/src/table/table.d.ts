import type { Column } from './column.js';
import type { Filter } from './filters/index.js';
import type { Action } from './actions/index.js';
import type { SortDirection } from '../types.js';
export declare class Table {
    #private;
    columns(columns: Column[]): this;
    filters(filters: Filter[]): this;
    rowActions(actions: Action[]): this;
    bulkActions(actions: Action[]): this;
    defaultSort(column: string, direction?: SortDirection): this;
    getColumns(): Column[];
    getFilters(): Filter[];
    getRowActions(): Action[];
    getBulkActions(): Action[];
    getDefaultSort(): {
        column: string;
        direction: SortDirection;
    };
}
export declare function defineTable(callback: (table: Table) => Table): Table;
//# sourceMappingURL=table.d.ts.map