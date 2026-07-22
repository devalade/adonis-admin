import { Form, Link } from '@adonisjs/inertia/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import type { AdminResourceSchema, AdminRow, SortDirection } from '~/admin/types'

type AdminTableProps = {
  resource: AdminResourceSchema
  rows: AdminRow[]
  filters: Record<string, string | undefined>
  search?: string
  sort?: string
  direction?: SortDirection
  selectedIds: number[]
  onToggleRow: (id: number, checked: boolean) => void
  onToggleAll: (checked: boolean) => void
}

function sortHref(
  resource: AdminResourceSchema,
  column: string,
  nextDirection: SortDirection,
  filters: Record<string, string | undefined>,
  search?: string
) {
  const params = new URLSearchParams()
  params.set('sort', column)
  params.set('direction', nextDirection)

  if (search) {
    params.set('search', search)
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      params.set(key, value)
    }
  }

  return `/admin/${resource.slug}?${params.toString()}`
}

function SortLink({
  resource,
  column,
  label,
  sort,
  direction,
  filters,
  search,
}: {
  resource: AdminResourceSchema
  column: string
  label: string
  sort?: string
  direction?: SortDirection
  filters: Record<string, string | undefined>
  search?: string
}) {
  const nextDirection = sort === column && direction === 'asc' ? 'desc' : 'asc'

  return (
    <Link
      href={sortHref(resource, column, nextDirection, filters, search)}
      className="inline-flex items-center gap-1 font-medium hover:text-foreground"
    >
      {label}
      {sort === column ? (direction === 'asc' ? ' ↑' : ' ↓') : null}
    </Link>
  )
}

function CellValue({
  value,
  type,
}: {
  value: string | number | boolean | null | undefined
  type: AdminResourceSchema['columns'][number]['type']
}) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground">—</span>
  }

  if (type === 'badge') {
    return <Badge variant="secondary">{String(value)}</Badge>
  }

  if (type === 'boolean') {
    return <span>{value ? 'Yes' : 'No'}</span>
  }

  return <span>{String(value)}</span>
}

export default function AdminTable({
  resource,
  rows,
  filters,
  search,
  sort,
  direction,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: AdminTableProps) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(Number(row.id)))
  const basePath = `/admin/${resource.slug}`

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/40">
          <tr>
            {resource.bulkActions.length > 0 ? (
              <th className="px-3 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => onToggleAll(checked === true)}
                  aria-label="Select all rows"
                />
              </th>
            ) : null}
            {resource.columns.map((column) => (
              <th key={column.name} className="px-3 py-3 text-left font-medium text-muted-foreground">
                {column.sortable ? (
                  <SortLink
                    resource={resource}
                    column={column.name}
                    label={column.label}
                    sort={sort}
                    direction={direction}
                    filters={filters}
                    search={search}
                  />
                ) : (
                  column.label
                )}
              </th>
            ))}
            {resource.rowActions.length > 0 ? (
              <th className="px-3 py-3 text-right font-medium text-muted-foreground">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {rows.map((row) => (
            <tr key={String(row.id)} data-testid="admin-row">
              {resource.bulkActions.length > 0 ? (
                <td className="px-3 py-3">
                  <Checkbox
                    checked={selectedIds.includes(Number(row.id))}
                    onCheckedChange={(checked) => onToggleRow(Number(row.id), checked === true)}
                    aria-label={`Select row ${row.id}`}
                  />
                </td>
              ) : null}
              {resource.columns.map((column) => (
                <td key={column.name} className="px-3 py-3 align-middle">
                  <CellValue value={row[column.name]} type={column.type} />
                </td>
              ))}
              {resource.rowActions.length > 0 ? (
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    {resource.rowActions.map((action) => {
                      if (action.type === 'view') {
                        return (
                          <Button
                            key={action.name}
                            size="sm"
                            variant="ghost"
                            render={<Link href={`${basePath}/${row.id}`} />}
                          >
                            {action.label}
                          </Button>
                        )
                      }

                      if (action.type === 'edit') {
                        return (
                          <Button
                            key={action.name}
                            size="sm"
                            variant="ghost"
                            render={<Link href={`${basePath}/${row.id}/edit`} />}
                          >
                            {action.label}
                          </Button>
                        )
                      }

                      return (
                        <Form
                          key={action.name}
                          route={`admin.${resource.routeName}.destroy` as never}
                          routeParams={{ id: Number(row.id) } as never}
                        >
                          {({ processing }) => (
                            <Button
                              type="submit"
                              size="sm"
                              variant="destructive"
                              disabled={processing}
                            >
                              {action.label}
                            </Button>
                          )}
                        </Form>
                      )
                    })}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
