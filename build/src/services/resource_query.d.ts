import type { HttpContext } from '@adonisjs/core/http';
import type { LucidRow } from '@adonisjs/lucid/types/model';
import type { ResourceConstructor } from '../resource.js';
import type { AdminRow, SortDirection } from '../types.js';
export type ListQueryInput = {
    page: number;
    perPage: number;
    search?: string;
    sort?: string;
    direction?: SortDirection;
    filters: Record<string, string | undefined>;
};
export declare function queryResourceRows(ResourceClass: ResourceConstructor, ctx: HttpContext, input: ListQueryInput): Promise<{
    rows: AdminRow[];
    metadata: {
        currentPage: number;
        lastPage: number;
        total: number;
        perPage: number;
    };
}>;
export declare function serializeRow(ResourceClass: ResourceConstructor, record: LucidRow): AdminRow;
export declare function serializeRecordForForm(ResourceClass: ResourceConstructor, record: LucidRow): Record<string, unknown>;
//# sourceMappingURL=resource_query.d.ts.map