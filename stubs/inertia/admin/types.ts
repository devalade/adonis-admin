import type {
  AdminActionSchema,
  AdminColumnSchema,
  AdminFieldSchema,
  AdminFilterSchema,
  AdminNavItem,
  AdminResourceSchema,
  AdminRow,
  SortDirection,
} from '@devalade/adonis-admin/types'

export type {
  AdminActionSchema,
  AdminColumnSchema,
  AdminFieldSchema,
  AdminFilterSchema,
  AdminNavItem,
  AdminResourceSchema,
  AdminRow,
  SortDirection,
}

export type AdminPaginatedRows = {
  data: AdminRow[]
  metadata: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
}

export type AdminPageProps = {
  resource: AdminResourceSchema
  adminNav: AdminNavItem[]
}

export type AdminIndexPageProps = AdminPageProps & {
  rows: AdminRow[]
  metadata: AdminPaginatedRows['metadata']
  filters: Record<string, string | undefined>
  search?: string
  sort?: string
  direction?: SortDirection
}

export type AdminFormPageProps = AdminPageProps & {
  record?: AdminRow
  mode: 'create' | 'edit'
}

export type AdminShowPageProps = AdminPageProps & {
  record: AdminRow
}
