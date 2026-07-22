import { useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import { Inbox, Plus } from 'lucide-react'
import AdminPanelLayout from '~/admin/layouts/panel'
import AdminFilterBar from '~/admin/components/filter-bar'
import AdminPagination from '~/admin/components/pagination'
import AdminTable from '~/admin/components/admin-table'
import { PageBody, PageFrame, PageToolbar } from '~/components/layout/page-frame'
import { Button } from '~/components/ui/button'
import { EmptyState } from '~/components/ui/empty-state'
import type { AdminIndexPageProps } from '~/admin/types'
import { type InertiaProps } from '~/types'

type Props = InertiaProps<AdminIndexPageProps>

export default function AdminResourceIndexPage({
  resource,
  rows,
  metadata,
  filters,
  search,
  sort,
  direction,
  adminNav,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const hasRows = rows.length > 0

  function toggleRow(id: number, checked: boolean) {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((value) => value !== id)
    )
  }

  function toggleAll(checked: boolean) {
    setSelectedIds(checked ? rows.map((row) => Number(row.id)) : [])
  }

  return (
    <AdminPanelLayout adminNav={adminNav} activeSlug={resource.slug}>
      <PageFrame fill>
        <PageToolbar
          title={resource.label}
          description={`Manage ${resource.label.toLowerCase()} records.`}
          actions={
            resource.canCreate ? (
              <Button render={<Link href={`/admin/${resource.slug}/create`} prefetch />}>
                <Plus className="size-4" aria-hidden="true" />
                Create
              </Button>
            ) : null
          }
        />

        <PageBody className="flex flex-col gap-5">
          <AdminFilterBar
            resource={resource}
            filters={filters}
            search={search}
            sort={sort}
            direction={direction}
          />

          {selectedIds.length > 0 && resource.bulkActions.length > 0 ? (
            <Form route={`admin.${resource.routeName}.bulk_destroy` as never}>
              {({ processing }) => (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
                  {selectedIds.map((id) => (
                    <input key={id} type="hidden" name="ids" value={id} />
                  ))}
                  <Button type="submit" variant="destructive" size="sm" disabled={processing}>
                    {processing ? 'Deleting…' : 'Delete selected'}
                  </Button>
                </div>
              )}
            </Form>
          ) : null}

          {hasRows ? (
            <AdminTable
              resource={resource}
              rows={rows}
              filters={filters}
              search={search}
              sort={sort}
              direction={direction}
              selectedIds={selectedIds}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
            />
          ) : (
            <EmptyState
              icon={<Inbox className="size-5" aria-hidden="true" />}
              title={`No ${resource.label.toLowerCase()} yet`}
              description="Create a record or adjust your filters."
              action={
                resource.canCreate ? (
                  <Button render={<Link href={`/admin/${resource.slug}/create`} />}>
                    Create {resource.singularLabel}
                  </Button>
                ) : undefined
              }
            />
          )}

          <AdminPagination
            resource={resource}
            metadata={metadata}
            filters={filters}
            search={search}
            sort={sort}
            direction={direction}
          />
        </PageBody>
      </PageFrame>
    </AdminPanelLayout>
  )
}
