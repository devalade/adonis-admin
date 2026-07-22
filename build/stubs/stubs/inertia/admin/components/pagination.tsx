import { Link } from '@adonisjs/inertia/react'
import type { AdminResourceSchema, SortDirection } from '~/admin/types'

type AdminPaginationProps = {
  resource: AdminResourceSchema
  metadata: {
    currentPage: number
    lastPage: number
    total: number
    perPage: number
  }
  filters: Record<string, string | undefined>
  search?: string
  sort?: string
  direction?: SortDirection
}

function pageHref(
  resource: AdminResourceSchema,
  page: number,
  filters: Record<string, string | undefined>,
  search?: string,
  sort?: string,
  direction?: SortDirection
) {
  const params = new URLSearchParams()
  params.set('page', String(page))

  if (search) {
    params.set('search', search)
  }

  if (sort) {
    params.set('sort', sort)
  }

  if (direction) {
    params.set('direction', direction)
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      params.set(key, value)
    }
  }

  return `/admin/${resource.slug}?${params.toString()}`
}

export default function AdminPagination({
  resource,
  metadata,
  filters,
  search,
  sort,
  direction,
}: AdminPaginationProps) {
  if (metadata.lastPage <= 1) {
    return null
  }

  return (
    <nav className="flex items-center justify-between gap-4 pt-4 text-sm" aria-label="Pagination">
      {metadata.currentPage > 1 ? (
        <Link
          href={pageHref(resource, metadata.currentPage - 1, filters, search, sort, direction)}
        >
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="text-muted-foreground">
        Page {metadata.currentPage} of {metadata.lastPage} ({metadata.total} total)
      </span>
      {metadata.currentPage < metadata.lastPage ? (
        <Link href={pageHref(resource, metadata.currentPage + 1, filters, search, sort, direction)}>
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
