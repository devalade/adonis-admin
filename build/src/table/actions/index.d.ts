import type { AdminActionSchema, AdminActionType } from '../../types.js';
export declare class Action {
    readonly name: string;
    label: string;
    type: AdminActionType;
    destructive: boolean;
    constructor(name: string, type: AdminActionType, label?: string);
    static view(name?: string): Action;
    static edit(name?: string): Action;
    static delete(name?: string): Action;
    setLabel(label: string): this;
    setDestructive(destructive?: boolean): this;
    serialize(): AdminActionSchema;
}
//# sourceMappingURL=index.d.ts.map