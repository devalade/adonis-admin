import type { HttpContext } from '@adonisjs/core/http';
import type { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import { defineForm } from './form/form.js';
import { defineTable } from './table/table.js';
import type { AdminRecord, AdminResourceSchema, SortDirection } from './types.js';
import type { AdminResourceValidator } from './types/validators.js';
export type ResourceConstructor = typeof Resource;
export type ResourceIndexQuery = ModelQueryBuilderContract<LucidModel, LucidRow>;
export declare abstract class Resource {
    static model: LucidModel;
    static label?: string;
    static singularLabel?: string;
    static icon: string;
    static perPage: number;
    static validator?: AdminResourceValidator;
    static updateValidator?: AdminResourceValidator;
    static table(_table: ReturnType<typeof defineTable>): import("./table/table.js").Table;
    static form(_form: ReturnType<typeof defineForm>): import("./form/form.js").Form;
    static getSlug(): string;
    static getRouteName(): string;
    static getLabel(): string;
    static getSingularLabel(): string;
    static canView(_ctx: HttpContext): boolean;
    static canCreate(_ctx: HttpContext): boolean;
    static canEdit(_ctx: HttpContext, _record: LucidRow): boolean;
    static canDelete(_ctx: HttpContext, _record: LucidRow): boolean;
    static supportsEdit(_ctx: HttpContext): boolean;
    static supportsDelete(_ctx: HttpContext): boolean;
    static modifyIndexQuery(query: ResourceIndexQuery, _ctx: HttpContext): ResourceIndexQuery;
    static serializeRecord(record: LucidRow): AdminRecord;
    static toSchema(ctx: HttpContext): AdminResourceSchema;
    static getTable(): import("./table/table.js").Table;
    static getForm(): import("./form/form.js").Form;
    static getSortColumn(requested?: string): string;
    static getSortDirection(requested?: SortDirection): SortDirection;
}
//# sourceMappingURL=resource.d.ts.map