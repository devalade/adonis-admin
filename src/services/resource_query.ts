import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import type { LucidRow } from '@adonisjs/lucid/types/model'
import { formatColumnValue } from '../helpers/format_value.js'
import type { ResourceConstructor } from '../resource.js'
import type { AdminRow, SortDirection } from '../types.js'

export type ListQueryInput = {
  page: number
  perPage: number
  search?: string
  sort?: string
  direction?: SortDirection
  filters: Record<string, string | undefined>
}

function usesCaseInsensitiveSearch() {
  return app.config.get('db.connection') !== 'sqlite'
}

function applyColumnSearch(
  builder: any,
  columnName: string,
  term: string,
  caseInsensitive: boolean
) {
  if (caseInsensitive) {
    builder.orWhereILike(columnName, term)
    return
  }

  builder.orWhere(columnName, 'like', term)
}

export async function queryResourceRows(
  ResourceClass: ResourceConstructor,
  ctx: HttpContext,
  input: ListQueryInput
) {
  const table = ResourceClass.getTable()
  const columns = table.getColumns()
  const sortColumn = ResourceClass.getSortColumn(input.sort)
  const sortDirection = ResourceClass.getSortDirection(input.direction)

  let query = ResourceClass.model.query()
  query = ResourceClass.modifyIndexQuery(query, ctx)

  for (const filter of table.getFilters()) {
    const value = input.filters[filter.name]

    if (value !== undefined && value !== '') {
      query = query.where(filter.name, value)
    }
  }

  if (input.search) {
    const searchableColumns = columns.filter((column) => column.searchable)

    if (searchableColumns.length > 0) {
      const term = `%${input.search}%`
      const caseInsensitive = usesCaseInsensitiveSearch()

      query = query.where((builder: any) => {
        for (const column of searchableColumns) {
          applyColumnSearch(builder, column.name, term, caseInsensitive)
        }
      })
    }
  }

  query = query.orderBy(sortColumn, sortDirection)

  const paginator = await query.paginate(input.page, input.perPage)

  const rows: AdminRow[] = paginator.all().map((record: LucidRow) => serializeRow(ResourceClass, record))

  return {
    rows,
    metadata: {
      currentPage: paginator.currentPage,
      lastPage: paginator.lastPage,
      total: paginator.total,
      perPage: paginator.perPage,
    },
  }
}

export function serializeRow(ResourceClass: ResourceConstructor, record: LucidRow): AdminRow {
  const table = ResourceClass.getTable()
  const serialized = ResourceClass.serializeRecord(record)
  const row: AdminRow = { id: serialized.id as number }

  for (const column of table.getColumns()) {
    const rawValue = serialized[column.name]
    const formatted = column.formatValue(rawValue, serialized)
    row[column.name] = formatColumnValue(formatted, column.type) as string | boolean | null
  }

  return row
}

export function serializeRecordForForm(ResourceClass: ResourceConstructor, record: LucidRow) {
  return ResourceClass.serializeRecord(record)
}
