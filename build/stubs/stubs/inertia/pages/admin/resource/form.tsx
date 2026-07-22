import { Form } from '@adonisjs/inertia/react'
import AdminPanelLayout from '~/admin/layouts/panel'
import { Button } from '~/components/ui/button'
import { AdminFormFields } from '~/admin/components/field-renderer'
import type { AdminFormPageProps } from '~/admin/types'
import { type InertiaProps } from '~/types'

type Props = InertiaProps<AdminFormPageProps>

export default function AdminResourceFormPage({ resource, record, mode, adminNav }: Props) {
  const isEdit = mode === 'edit'
  const title = isEdit ? `Edit ${resource.singularLabel}` : `Create ${resource.singularLabel}`
  const action = isEdit ? `/admin/${resource.slug}/${record?.id}` : `/admin/${resource.slug}`
  const method = isEdit ? 'put' : 'post'

  return (
    <AdminPanelLayout adminNav={adminNav} activeSlug={resource.slug}>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-editorial text-2xl font-medium tracking-tight">{title}</h1>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <Form action={action} method={method}>
            {({ errors, processing }) => (
              <>
                <AdminFormFields fields={resource.fields} record={record} errors={errors} />
                <div className="mt-6 flex gap-2">
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
                  </Button>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </AdminPanelLayout>
  )
}
