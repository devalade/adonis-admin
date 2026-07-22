import type { Field } from './fields/index.js';
export declare class Form {
    #private;
    fields(fields: Field[]): this;
    getFields(): Field[];
}
export declare function defineForm(callback: (form: Form) => Form): Form;
//# sourceMappingURL=form.d.ts.map