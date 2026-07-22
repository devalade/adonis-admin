import { Link } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { AdminFilterSchema, AdminResourceSchema } from '~/admin/types'

type AdminFilterBarProps = {
  resource: AdminResourceSchema
  filters: Record<string, string | undefined>
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
}

function currentQuery(
  filters: Record<string, string | undefined>,
  search?: string,
  sort?: string,
  direction?: 'asc' | 'desc'
) {
  const qs: Record<string, string> = {}

  if (search) {
    qs.search = search
  }

  if (sort) {
    qs.sort = sort
  }

  if (direction) {
    qs.direction = direction
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      qs[key] = value
    }
  }

  return qs
}

function indexHref(resource: AdminResourceSchema, qs: Record<string, string>) {
  return `/admin/${resource.slug}${Object.keys(qs).length > 0 ? `?${new URLSearchParams(qs).toString()}` : ''}`
}

function FilterControl({
  filter,
  value,
  resource,
  filters,
  search,
  sort,
  direction,
}: {
  filter: AdminFilterSchema
  value?: string
  resource: AdminResourceSchema
  filters: Record<string, string | undefined>
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
}) {
  const action = indexHref(resource, currentQuery(filters, search, sort, direction))

  if (filter.type === 'select' && filter.options) {
    return (
      <form method="get" action={action} className="flex flex-col gap-1.5">
        <Label htmlFor={`filter-${filter.name}`}>{filter.label}</Label>
        <select
          id={`filter-${filter.name}`}
          name={filter.name}
          defaultValue={value ?? ''}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          <option value="">All</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {search ? <input type="hidden" name="search" value={search} /> : null}
        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
        {direction ? <input type="hidden" name="direction" value={direction} /> : null}
        {Object.entries(filters).map(([key, filterValue]) =>
          key !== filter.name && filterValue ? (
            <input key={key} type="hidden" name={key} value={filterValue} />
          ) : null
        )}
      </form>
    )
  }

  return (
    <form method="get" action={action} className="flex flex-col gap-1.5">
      <Label htmlFor={`filter-${filter.name}`}>{filter.label}</Label>
      <Input id={`filter-${filter.name}`} name={filter.name} defaultValue={value ?? ''} />
      {search ? <input type="hidden" name="search" value={search} /> : null}
      {sort ? <input type="hidden" name="sort" value={sort} /> : null}
      {direction ? <input type="hidden" name="direction" value={direction} /> : null}
      {Object.entries(filters).map(([key, filterValue]) =>
        key !== filter.name && filterValue ? (
          <input key={key} type="hidden" name={key} value={filterValue} />
        ) : null
      )}
    </form>
  )
}

export default function AdminFilterBar({
  resource,
  filters,
  search,
  sort,
  direction,
}: AdminFilterBarProps) {
  const clearHref = indexHref(resource, currentQuery(filters, undefined, sort, direction))

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {resource.searchable ? (
        <form
          method="get"
          action={indexHref(resource, currentQuery(filters, undefined, sort, direction))}
          className="flex flex-col gap-2 sm:flex-row sm:items-end"
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="admin-search">Search</Label>
            <Input
              id="admin-search"
              name="search"
              defaultValue={search ?? ''}
              placeholder={`Search ${resource.label.toLowerCase()}…`}
            />
          </div>
          {sort ? <input type="hidden" name="sort" value={sort} /> : null}
          {direction ? <input type="hidden" name="direction" value={direction} /> : null}
          {Object.entries(filters).map(([key, value]) =>
            value ? <input key={key} type="hidden" name={key} value={value} /> : null
          )}
          <Button type="submit" variant="secondary">
            Search
          </Button>
          {search ? (
            <Button render={<Link href={clearHref} />} variant="ghost">
              Clear
            </Button>
          ) : null}
        </form>
      ) : null}

      {resource.filters.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resource.filters.map((filter) => (
            <FilterControl
              key={filter.name}
              filter={filter}
              value={filters[filter.name]}
              resource={resource}
              filters={filters}
              search={search}
              sort={sort}
              direction={direction}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
