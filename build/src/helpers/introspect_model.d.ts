import type { LucidModel } from '@adonisjs/lucid/types/model';
export type ColumnKind = 'primaryKey' | 'timestamp' | 'email' | 'password' | 'foreignKey' | 'boolean' | 'enum' | 'longText' | 'text' | 'number';
export type ValuesImport = {
    path: string;
    constant: string;
    shape: 'array' | 'object';
};
export type IntrospectedColumn = {
    name: string;
    label: string;
    kind: ColumnKind;
    sortable: boolean;
    searchable: boolean;
    includeInForm: boolean;
    includeInTable: boolean;
    valuesImport?: ValuesImport;
};
export type IntrospectedModel = {
    modelName: string;
    resourceName: string;
    modelImport: string;
    label: string;
    singularLabel: string;
    icon: string;
    columns: IntrospectedColumn[];
};
export declare function introspectModel(Model: LucidModel, appRoot: string): Promise<IntrospectedModel>;
//# sourceMappingURL=introspect_model.d.ts.map