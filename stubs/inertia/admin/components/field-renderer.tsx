import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import type { AdminFieldSchema } from '~/admin/types'

type FieldRendererProps = {
  field: AdminFieldSchema
  defaultValue?: unknown
  error?: string
}

export default function FieldRenderer({ field, defaultValue, error }: FieldRendererProps) {
  const value = defaultValue ?? field.defaultValue ?? ''

  switch (field.type) {
    case 'textarea':
      return (
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          <Textarea
            id={field.name}
            name={field.name}
            defaultValue={String(value ?? '')}
            placeholder={field.placeholder}
            aria-invalid={error ? true : undefined}
          />
          {field.helpText ? <FieldDescription>{field.helpText}</FieldDescription> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      )

    case 'select':
      return (
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          <select
            id={field.name}
            name={field.name}
            defaultValue={String(value ?? '')}
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            aria-invalid={error ? true : undefined}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {field.helpText ? <FieldDescription>{field.helpText}</FieldDescription> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      )

    case 'boolean':
      return (
        <Field orientation="horizontal" data-invalid={error ? true : undefined}>
          <Checkbox
            id={field.name}
            name={field.name}
            defaultChecked={Boolean(value)}
            value="1"
          />
          <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      )

    case 'email':
    case 'text':
    default:
      return (
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
          <Input
            id={field.name}
            name={field.name}
            type={field.type === 'email' ? 'email' : 'text'}
            defaultValue={String(value ?? '')}
            placeholder={field.placeholder}
            required={field.required}
            aria-invalid={error ? true : undefined}
          />
          {field.helpText ? <FieldDescription>{field.helpText}</FieldDescription> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </Field>
      )
  }
}

type AdminFormProps = {
  fields: AdminFieldSchema[]
  record?: Record<string, unknown>
  errors: Record<string, string | undefined>
  children: React.ReactNode
}

export function AdminFormFields({ fields, record, errors }: Omit<AdminFormProps, 'children'>) {
  return (
    <FieldGroup>
      {fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          defaultValue={record?.[field.name]}
          error={errors[field.name]}
        />
      ))}
    </FieldGroup>
  )
}
