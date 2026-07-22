import vine from '@vinejs/vine'
import type { SchemaTypes } from '@vinejs/vine/types'
import type { Field } from '../form/fields/index.js'
import type { AdminResourceValidator } from '../types/validators.js'

function fieldRule(field: Field) {
  switch (field.type) {
    case 'email':
      return vine.string().trim().email().maxLength(254)
    case 'boolean':
      return vine.boolean()
    case 'textarea':
    case 'text':
    case 'select':
    default:
      return vine.string().trim().maxLength(65535)
  }
}

export function buildValidatorFromFields(
  fields: Field[],
  _mode: 'create' | 'update'
): AdminResourceValidator {
  const schema: Record<string, SchemaTypes> = {}

  for (const field of fields) {
    const rule = fieldRule(field)

    if (field.required) {
      schema[field.name] = rule
      continue
    }

    schema[field.name] = rule.optional()
  }

  return vine.create(schema)
}
