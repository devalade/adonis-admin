import type { JSONDataTypes } from '@adonisjs/core/types/transformers';
export type SortDirection = 'asc' | 'desc';
export type AdminColumnType = 'text' | 'badge' | 'date' | 'boolean';
export type AdminFieldType = 'text' | 'email' | 'select' | 'boolean' | 'textarea';
export type AdminFilterType = 'select' | 'text';
export type AdminActionType = 'view' | 'edit' | 'delete';
export type AdminOption = {
    label: string;
    value: string;
};
export type AdminColumnSchema = {
    name: string;
    label: string;
    type: AdminColumnType;
    sortable: boolean;
    searchable: boolean;
};
export type AdminFieldSchema = {
    name: string;
    label: string;
    type: AdminFieldType;
    required: boolean;
    placeholder?: string;
    helpText?: string;
    options?: AdminOption[];
    defaultValue?: string | boolean;
};
export type AdminFilterSchema = {
    name: string;
    label: string;
    type: AdminFilterType;
    options?: AdminOption[];
};
export type AdminActionSchema = {
    name: string;
    label: string;
    type: AdminActionType;
    destructive?: boolean;
};
export type AdminResourceSchema = {
    slug: string;
    routeName: string;
    label: string;
    singularLabel: string;
    icon: string;
    columns: AdminColumnSchema[];
    fields: AdminFieldSchema[];
    filters: AdminFilterSchema[];
    rowActions: AdminActionSchema[];
    bulkActions: AdminActionSchema[];
    defaultSort: {
        column: string;
        direction: SortDirection;
    };
    searchable: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
};
export type AdminNavItem = {
    slug: string;
    routeName: string;
    label: string;
    icon: string;
};
export type AdminPageProps = {
    adminNav: AdminNavItem[];
};
export type AdminRow = Record<string, string | number | boolean | null>;
export type AdminRecord = Record<string, JSONDataTypes>;
export type AdminListProps = {
    resource: AdminResourceSchema;
    rows: AdminRow[];
    metadata: {
        currentPage: number;
        lastPage: number;
        total: number;
        perPage: number;
    };
    filters: Record<string, string | undefined>;
    search?: string;
    sort?: string;
    direction?: SortDirection;
};
export type AdminFormProps = {
    resource: AdminResourceSchema;
    record?: AdminRecord;
    mode: 'create' | 'edit';
};
export type AdminShowProps = {
    resource: AdminResourceSchema;
    record: AdminRecord;
};
export type AdminLoginPageProps = Record<string, never>;
export type AdminIndexPageProps = AdminListProps & AdminPageProps;
export type AdminFormPageProps = AdminFormProps & AdminPageProps;
export type AdminShowPageProps = AdminShowProps & AdminPageProps;
//# sourceMappingURL=types.d.ts.map