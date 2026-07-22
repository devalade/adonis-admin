import { access } from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import { join } from 'node:path'
import string from '@adonisjs/core/helpers/string'
import type { LucidModel } from '@adonisjs/lucid/types/model'

type LucidColumnDefinition = {
  isPrimary?: boolean
  serializeAs?: string | null
  meta?: {
    autoCreate?: boolean
    autoUpdate?: boolean
    type?: string
  }
}

export type ColumnKind =
  | 'primaryKey'
  | 'timestamp'
  | 'email'
  | 'password'
  | 'foreignKey'
  | 'boolean'
  | 'enum'
  | 'longText'
  | 'text'
  | 'number'

export type ValuesImport = {
  path: string
  constant: string
  shape: 'array' | 'object'
}

export type IntrospectedColumn = {
  name: string
  label: string
  kind: ColumnKind
  sortable: boolean
  searchable: boolean
  includeInForm: boolean
  includeInTable: boolean
  valuesImport?: ValuesImport
}

export type IntrospectedModel = {
  modelName: string
  resourceName: string
  modelImport: string
  label: string
  singularLabel: string
  icon: string
  columns: IntrospectedColumn[]
}

const LONG_TEXT_NAMES = new Set([
  'content',
  'body',
  'description',
  'answer',
  'question',
  'tags',
  'payload',
  'rawPayload',
  'ownerResponseText',
  'customerQuestion',
  'notes',
  'message',
  'text',
])

const ENUM_COLUMN_NAMES = new Set([
  'locale',
  'status',
  'type',
  'role',
  'kind',
  'decision',
  'direction',
  'author',
  'source',
  'step',
])

const SKIP_FORM_NAMES = new Set(['id', 'createdAt', 'updatedAt'])

function modelValuesPrefix(modelName: string) {
  return string
    .snakeCase(modelName)
    .replace(/_signups?$/, '')
    .replace(/_sessions?$/, '')
}

async function resolveValuesImport(
  appRoot: string,
  modelName: string,
  columnName: string
): Promise<ValuesImport | undefined> {
  const prefix = modelValuesPrefix(modelName)
  const fileBase = `${prefix}_${columnName}`
  const filePath = join(appRoot, 'app/values', `${fileBase}.ts`)

  try {
    await access(filePath, fsConstants.F_OK)
  } catch {
    return undefined
  }

  const { readFile } = await import('node:fs/promises')
  const source = await readFile(filePath, 'utf-8')
  const pluralConstant = source.match(
    /export const ([A-Z0-9_]+)\s*=\s*\[[\s\S]*?\]\s*as const/
  )?.[1]

  if (pluralConstant) {
    return {
      path: `#values/${fileBase}`,
      constant: pluralConstant,
      shape: 'array',
    }
  }

  const objectConstant = source.match(/export const ([A-Z][A-Za-z0-9_]+)\s*=\s*\{/)?.[1]

  if (objectConstant) {
    return {
      path: `#values/${fileBase}`,
      constant: objectConstant,
      shape: 'object',
    }
  }

  return undefined
}

function classifyColumnKind(
  name: string,
  column: LucidColumnDefinition | undefined
): ColumnKind {
  if (column?.isPrimary) {
    return 'primaryKey'
  }

  if (column?.serializeAs === null || name === 'password') {
    return 'password'
  }

  if (column?.meta?.autoCreate || column?.meta?.autoUpdate || /(?:At|On)$/.test(name)) {
    return 'timestamp'
  }

  if (name === 'email' || name.endsWith('Email')) {
    return 'email'
  }

  if (name.endsWith('Id') && name !== 'id') {
    return 'foreignKey'
  }

  if (/^(is|has|can|enabled|active)[A-Z]/.test(name) || name === 'enabled') {
    return 'boolean'
  }

  if (ENUM_COLUMN_NAMES.has(name)) {
    return 'enum'
  }

  if (LONG_TEXT_NAMES.has(name)) {
    return 'longText'
  }

  if (['count', 'amount', 'price', 'total', 'score', 'tokens', 'latencyMs', 'reminderCount'].includes(name)) {
    return 'number'
  }

  return 'text'
}

function columnLabel(name: string) {
  return string.sentenceCase(string.noCase(name))
}

function iconForModel(modelName: string) {
  const normalized = modelName.toLowerCase()

  if (normalized.includes('waitlist') || normalized.includes('mail')) {
    return 'mail'
  }

  if (normalized.includes('user')) {
    return 'dashboard'
  }

  return 'file'
}

export async function introspectModel(
  Model: LucidModel,
  appRoot: string
): Promise<IntrospectedModel> {
  Model.boot()

  const modelName = Model.name
  const columns: IntrospectedColumn[] = []

  for (const name of (Model as LucidModel & { $columns: string[] }).$columns) {
    const definition = Model.$getColumn(name) as LucidColumnDefinition | undefined
    const kind = classifyColumnKind(name, definition)

    if (kind === 'password') {
      continue
    }

    const valuesImport =
      kind === 'enum' ? await resolveValuesImport(appRoot, modelName, name) : undefined

    const includeInTable = kind !== 'foreignKey'
    const includeInForm =
      !SKIP_FORM_NAMES.has(name) &&
      kind !== 'primaryKey' &&
      kind !== 'timestamp' &&
      kind !== 'foreignKey'

    columns.push({
      name,
      label: columnLabel(name),
      kind,
      sortable: kind === 'timestamp' || kind === 'text' || kind === 'email' || kind === 'number' || kind === 'primaryKey',
      searchable: kind === 'text' || kind === 'email' || kind === 'longText',
      includeInForm,
      includeInTable: kind === 'primaryKey' ? true : includeInTable,
      valuesImport,
    })
  }

  const pluralLabel = string.sentenceCase(string.noCase(modelName))
  const singularLabel = string.sentenceCase(string.noCase(modelName.replace(/s$/, '')))

  return {
    modelName,
    resourceName: `${modelName}Resource`,
    modelImport: string.snakeCase(modelName),
    label: pluralLabel,
    singularLabel,
    icon: iconForModel(modelName),
    columns,
  }
}
