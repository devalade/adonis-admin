import type { AdminColumnSchema, AdminColumnType } from '../types.js';
export declare class Column {
    readonly name: string;
    label: string;
    type: AdminColumnType;
    sortable: boolean;
    searchable: boolean;
    protected formatFn?: (value: unknown, record: Record<string, unknown>) => string | boolean | null;
    constructor(name: string);
    static make(name: string): Column;
    setLabel(label: string): this;
    setSortable(sortable?: boolean): this;
    setSearchable(searchable?: boolean): this;
    format(callback: (value: unknown, record: Record<string, unknown>) => string | boolean | null): this;
    serialize(): AdminColumnSchema;
    formatValue(value: unknown, record: Record<string, unknown>): unknown;
}
//# sourceMappingURL=column.d.ts.map