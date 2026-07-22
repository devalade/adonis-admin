import { Column } from '../column.js';
export declare class TextColumn extends Column {
    type: "text";
    static make(name: string): TextColumn;
}
export declare class BadgeColumn extends Column {
    type: "badge";
    static make(name: string): BadgeColumn;
}
export declare class DateColumn extends Column {
    type: "date";
    static make(name: string): DateColumn;
}
export declare class BooleanColumn extends Column {
    type: "boolean";
    static make(name: string): BooleanColumn;
}
//# sourceMappingURL=index.d.ts.map