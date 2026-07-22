import type { AdminFilterSchema, AdminFilterType, AdminOption } from '../../types.js';
export declare class Filter {
    readonly name: string;
    label: string;
    type: AdminFilterType;
    options: AdminOption[];
    constructor(name: string);
    static make(name: string): Filter;
    setLabel(label: string): this;
    setOptions(options: AdminOption[] | readonly string[]): this;
    serialize(): AdminFilterSchema;
}
export declare class SelectFilter extends Filter {
    type: "select";
}
export declare class TextFilter extends Filter {
    type: "text";
}
//# sourceMappingURL=index.d.ts.map