import type { HttpContext } from '@adonisjs/core/http';
import type { LucidRow } from '@adonisjs/lucid/types/model';
import type { ResourceConstructor } from '../resource.js';
/**
 * Future extension point for inline hasMany/belongsToMany CRUD on resource show pages.
 * Not implemented in v0 — kept as a typed stub for package consumers.
 */
export declare abstract class RelationManager {
    static label: string;
    static relationship: string;
    static parentResource: ResourceConstructor | undefined;
    static canView(_ctx: HttpContext, _parent: LucidRow): boolean;
}
//# sourceMappingURL=relation_manager.d.ts.map