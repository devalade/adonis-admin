import app from '@adonisjs/core/services/app';
import { formatColumnValue } from '../helpers/format_value.js';
function usesCaseInsensitiveSearch() {
    return app.config.get('db.connection') !== 'sqlite';
}
function applyColumnSearch(builder, columnName, term, caseInsensitive) {
    if (caseInsensitive) {
        builder.orWhereILike(columnName, term);
        return;
    }
    builder.orWhere(columnName, 'like', term);
}
export async function queryResourceRows(ResourceClass, ctx, input) {
    const table = ResourceClass.getTable();
    const columns = table.getColumns();
    const sortColumn = ResourceClass.getSortColumn(input.sort);
    const sortDirection = ResourceClass.getSortDirection(input.direction);
    let query = ResourceClass.model.query();
    query = ResourceClass.modifyIndexQuery(query, ctx);
    for (const filter of table.getFilters()) {
        const value = input.filters[filter.name];
        if (value !== undefined && value !== '') {
            query = query.where(filter.name, value);
        }
    }
    if (input.search) {
        const searchableColumns = columns.filter((column) => column.searchable);
        if (searchableColumns.length > 0) {
            const term = `%${input.search}%`;
            const caseInsensitive = usesCaseInsensitiveSearch();
            query = query.where((builder) => {
                for (const column of searchableColumns) {
                    applyColumnSearch(builder, column.name, term, caseInsensitive);
                }
            });
        }
    }
    query = query.orderBy(sortColumn, sortDirection);
    const paginator = await query.paginate(input.page, input.perPage);
    const rows = paginator.all().map((record) => serializeRow(ResourceClass, record));
    return {
        rows,
        metadata: {
            currentPage: paginator.currentPage,
            lastPage: paginator.lastPage,
            total: paginator.total,
            perPage: paginator.perPage,
        },
    };
}
export function serializeRow(ResourceClass, record) {
    const table = ResourceClass.getTable();
    const serialized = ResourceClass.serializeRecord(record);
    const row = { id: serialized.id };
    for (const column of table.getColumns()) {
        const rawValue = serialized[column.name];
        const formatted = column.formatValue(rawValue, serialized);
        row[column.name] = formatColumnValue(formatted, column.type);
    }
    return row;
}
export function serializeRecordForForm(ResourceClass, record) {
    return ResourceClass.serializeRecord(record);
}
