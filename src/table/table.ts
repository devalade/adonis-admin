import type { Column } from './column.js'
import type { Filter } from './filters/index.js'
import type { Action } from './actions/index.js'
import type { SortDirection } from '../types.js'

export class Table {
  #columns: Column[] = []
  #filters: Filter[] = []
  #rowActions: Action[] = []
  #bulkActions: Action[] = []
  #defaultSort: { column: string; direction: SortDirection } = {
    column: 'id',
    direction: 'desc',
  }

  columns(columns: Column[]) {
    this.#columns = columns
    return this
  }

  filters(filters: Filter[]) {
    this.#filters = filters
    return this
  }

  rowActions(actions: Action[]) {
    this.#rowActions = actions
    return this
  }

  bulkActions(actions: Action[]) {
    this.#bulkActions = actions
    return this
  }

  defaultSort(column: string, direction: SortDirection = 'asc') {
    this.#defaultSort = { column, direction }
    return this
  }

  getColumns() {
    return this.#columns
  }

  getFilters() {
    return this.#filters
  }

  getRowActions() {
    return this.#rowActions
  }

  getBulkActions() {
    return this.#bulkActions
  }

  getDefaultSort() {
    return this.#defaultSort
  }
}

export function defineTable(callback: (table: Table) => Table) {
  return callback(new Table())
}
