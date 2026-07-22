import { Link } from '@adonisjs/inertia/react'
import AdminPanelLayout from '~/admin/layouts/panel'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { AdminShowPageProps } from '~/admin/types'
import { type InertiaProps } from '~/types'

type Props = InertiaProps<AdminShowPageProps>

export default function AdminResourceShowPage({ resource, record, adminNav }: Props) {
  return (
    <AdminPanelLayout adminNav={adminNav} activeSlug={resource.slug}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-editorial text-2xl font-medium tracking-tight">
              {resource.singularLabel} #{String(record.id)}
            </h1>
          </div>
          <Button render={<Link href={`/admin/${resource.slug}/${record.id}/edit`} />}>
            Edit
          </Button>
        </div>

        <dl className="divide-y divide-border rounded-xl border border-border bg-card">
          {resource.fields.map((field) => {
            const value = record[field.name]

            return (
              <div key={field.name} className="grid gap-1 px-4 py-4 sm:grid-cols-[180px_1fr]">
                <dt className="text-sm font-medium text-muted-foreground">{field.label}</dt>
                <dd className="text-sm text-foreground">
                  {field.type === 'boolean' ? (
                    <Badge variant="secondary">{value ? 'Yes' : 'No'}</Badge>
                  ) : (
                    String(value ?? '—')
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </AdminPanelLayout>
  )
}
