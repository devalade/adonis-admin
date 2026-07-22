import type { HttpContext } from '@adonisjs/core/http'
import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type { VineValidator } from '@vinejs/vine'
import { defineForm } from './form/form.js'
import { defineTable } from './table/table.js'
import { Action } from './table/actions/index.js'
import {
  humanizeResourceName,
  resourceRouteNameFromSlug,
  resourceSlugFromModelName,
} from './helpers/slug.js'
import type { AdminResourceSchema, SortDirection } from './types.js'

export type ResourceConstructor = typeof Resource

export abstract class Resource {
  static model: LucidModel
  static label?: string
  static singularLabel?: string
  static icon = 'file'
  static perPage = 20
  static validator?: VineValidator<any, any>
  static updateValidator?: VineValidator<any, any>

  static table(_table: ReturnType<typeof defineTable>) {
    return defineTable((table) =>
      table
        .columns([])
        .filters([])
        .rowActions([Action.view(), Action.edit(), Action.delete()])
        .bulkActions([Action.delete('bulk_delete').setLabel('Delete selected')])
    )
  }

  static form(_form: ReturnType<typeof defineForm>) {
    return defineForm((form) => form.fields([]))
  }

  static getSlug() {
    return resourceSlugFromModelName(this.model.name)
  }

  static getRouteName() {
    return resourceRouteNameFromSlug(this.getSlug())
  }

  static getLabel() {
    return this.label ?? humanizeResourceName(this.model.name)
  }

  static getSingularLabel() {
    return this.singularLabel ?? humanizeResourceName(this.model.name.replace(/s$/, ''))
  }

  static canView(_ctx: HttpContext) {
    return true
  }

  static canCreate(_ctx: HttpContext) {
    return true
  }

  static canEdit(_ctx: HttpContext, _record: LucidRow) {
    return true
  }

  static canDelete(_ctx: HttpContext, _record: LucidRow) {
    return true
  }

  static modifyIndexQuery(query: any, _ctx: HttpContext) {
    return query
  }

  static serializeRecord(record: LucidRow) {
    return record.serialize() as Record<string, unknown>
  }

  static toSchema(ctx: HttpContext): AdminResourceSchema {
    const table = this.table(defineTable((builder) => builder))
    const form = this.form(defineForm((builder) => builder))
    const defaultSort = table.getDefaultSort()

    return {
      slug: this.getSlug(),
      routeName: this.getRouteName(),
      label: this.getLabel(),
      singularLabel: this.getSingularLabel(),
      icon: this.icon,
      columns: table.getColumns().map((column) => column.serialize()),
      fields: form.getFields().map((field) => field.serialize()),
      filters: table.getFilters().map((filter) => filter.serialize()),
      rowActions: table.getRowActions().map((action) => action.serialize()),
      bulkActions: table.getBulkActions().map((action) => action.serialize()),
      defaultSort,
      searchable: table.getColumns().some((column) => column.searchable),
      canCreate: this.canCreate(ctx),
      canEdit: true,
      canDelete: true,
      canView: this.canView(ctx),
    }
  }

  static getTable() {
    return this.table(defineTable((builder) => builder))
  }

  static getForm() {
    return this.form(defineForm((builder) => builder))
  }

  static getSortColumn(requested?: string) {
    const table = this.getTable()
    const columns = table.getColumns()
    const defaultSort = table.getDefaultSort()

    if (requested && columns.some((column) => column.name === requested && column.sortable)) {
      return requested
    }

    return defaultSort.column
  }

  static getSortDirection(requested?: SortDirection) {
    const table = this.getTable()
    const defaultSort = table.getDefaultSort()

    if (requested === 'asc' || requested === 'desc') {
      return requested
    }

    return defaultSort.direction
  }
}
