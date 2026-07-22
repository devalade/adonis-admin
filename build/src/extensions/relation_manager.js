/**
 * Future extension point for inline hasMany/belongsToMany CRUD on resource show pages.
 * Not implemented in v0 — kept as a typed stub for package consumers.
 */
export class RelationManager {
    static label = 'Related records';
    static relationship = '';
    static parentResource;
    static canView(_ctx, _parent) {
        return true;
    }
}
