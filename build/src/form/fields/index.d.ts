import type { AdminFieldSchema, AdminFieldType, AdminOption } from '../../types.js';
export declare class Field {
    readonly name: string;
    label: string;
    type: AdminFieldType;
    required: boolean;
    placeholder?: string;
    helpText?: string;
    options: AdminOption[];
    defaultValue?: string | boolean;
    constructor(name: string);
    static make(name: string): Field;
    setLabel(label: string): this;
    setRequired(required?: boolean): this;
    setPlaceholder(placeholder: string): this;
    setHelpText(helpText: string): this;
    setOptions(options: AdminOption[] | readonly string[]): this;
    setDefault(defaultValue: string | boolean): this;
    serialize(): AdminFieldSchema;
}
export declare class TextField extends Field {
    type: "text";
    static make(name: string): TextField;
}
export declare class EmailField extends Field {
    type: "email";
    static make(name: string): EmailField;
    email(): this;
}
export declare class TextareaField extends Field {
    type: "textarea";
    static make(name: string): TextareaField;
}
export declare class SelectField extends Field {
    type: "select";
    static make(name: string): SelectField;
}
export declare class BooleanField extends Field {
    type: "boolean";
    static make(name: string): BooleanField;
}
//# sourceMappingURL=index.d.ts.map