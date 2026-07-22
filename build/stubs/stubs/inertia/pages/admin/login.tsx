import { Form } from '@adonisjs/inertia/react'
import AdminAuthLayout from '~/admin/layouts/auth'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { type InertiaProps } from '~/types'

export default function AdminLoginPage(_props: InertiaProps) {
  return (
    <AdminAuthLayout>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-editorial text-2xl font-medium tracking-tight text-zinc-50">
            Sign in
          </h1>
          <p className="mt-2 text-[15px] text-zinc-400">Enter your credentials to access the admin panel.</p>
        </div>

        <Form route="admin.session.store">
          {({ errors, processing }) => (
            <FieldGroup>
              <Field data-invalid={errors.email ? true : undefined}>
                <FieldLabel htmlFor="email" className="text-zinc-300">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  aria-invalid={errors.email ? true : undefined}
                  className="border-zinc-700 bg-zinc-900 text-zinc-50 placeholder:text-zinc-500"
                />
                {errors.email ? <FieldError>{errors.email}</FieldError> : null}
              </Field>

              <Field data-invalid={errors.password ? true : undefined}>
                <FieldLabel htmlFor="password" className="text-zinc-300">
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? true : undefined}
                  className="border-zinc-700 bg-zinc-900 text-zinc-50 placeholder:text-zinc-500"
                />
                {errors.password ? <FieldError>{errors.password}</FieldError> : null}
              </Field>

              <Field>
                <Button
                  type="submit"
                  size="xl"
                  className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
                  disabled={processing}
                >
                  {processing ? 'Signing in…' : 'Sign in to admin'}
                </Button>
              </Field>
            </FieldGroup>
          )}
        </Form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          <a href="/login" className="text-zinc-400 underline underline-offset-4 hover:text-zinc-200">
            Customer login
          </a>
        </p>
      </div>
    </AdminAuthLayout>
  )
}
