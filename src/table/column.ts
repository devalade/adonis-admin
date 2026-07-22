import type { AdminColumnSchema, AdminColumnType } from '../types.js'

export class Column {
  readonly name: string
  label: string
  type: AdminColumnType = 'text'
  sortable = false
  searchable = false
  protected formatFn?: (value: unknown, record: Record<string, unknown>) => string | boolean | null

  constructor(name: string) {
    this.name = name
    this.label = name
  }

  static make(name: string) {
    return new (this as typeof Column)(name)
  }

  setLabel(label: string) {
    this.label = label
    return this
  }

  setSortable(sortable = true) {
    this.sortable = sortable
    return this
  }

  setSearchable(searchable = true) {
    this.searchable = searchable
    return this
  }

  format(callback: (value: unknown, record: Record<string, unknown>) => string | boolean | null) {
    this.formatFn = callback
    return this
  }

  serialize(): AdminColumnSchema {
    return {
      name: this.name,
      label: this.label,
      type: this.type,
      sortable: this.sortable,
      searchable: this.searchable,
    }
  }

  formatValue(value: unknown, record: Record<string, unknown>) {
    if (this.formatFn) {
      return this.formatFn(value, record)
    }

    return value
  }
}
