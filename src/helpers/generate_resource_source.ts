import type { IntrospectedColumn, IntrospectedModel } from './introspect_model.js'

function indent(lines: string[], spaces = 6) {
  const pad = ' '.repeat(spaces)
  return lines.map((line) => (line ? `${pad}${line}` : line)).join('\n')
}

function renderColumn(column: IntrospectedColumn) {
  const chain: string[] = [`${columnClass(column)}.make('${column.name}')`, `.setLabel('${column.label}')`]

  if (column.sortable) {
    chain.push('.setSortable()')
  }

  if (column.searchable) {
    chain.push('.setSearchable()')
  }

  return chain.join('')
}

function columnClass(column: IntrospectedColumn) {
  switch (column.kind) {
    case 'timestamp':
      return 'DateColumn'
    case 'boolean':
      return 'BooleanColumn'
    case 'enum':
      return 'BadgeColumn'
    default:
      return 'TextColumn'
  }
}

function renderField(column: IntrospectedColumn) {
  const chain: string[] = [`${fieldClass(column)}.make('${column.name}')`, `.setLabel('${column.label}')`]

  if (column.kind !== 'boolean' && column.kind !== 'enum') {
    chain.push('.setRequired()')
  }

  if (column.kind === 'email') {
    chain.push('.email()')
  }

  if (column.kind === 'enum') {
    if (column.valuesImport) {
      const options =
        column.valuesImport.shape === 'array'
          ? `[...${column.valuesImport.constant}]`
          : `Object.values(${column.valuesImport.constant}).map(String)`

      chain.push(`.setOptions(${options})`)
    } else {
      chain.push(`.setOptions([])`)
    }
  }

  return chain.join('')
}

function fieldClass(column: IntrospectedColumn) {
  switch (column.kind) {
    case 'email':
      return 'EmailField'
    case 'boolean':
      return 'BooleanField'
    case 'enum':
      return 'SelectField'
    case 'longText':
      return 'TextareaField'
    default:
      return 'TextField'
  }
}

function renderFilter(column: IntrospectedColumn) {
  if (column.kind === 'enum') {
    const options = column.valuesImport
      ? column.valuesImport.shape === 'array'
        ? `[...${column.valuesImport.constant}]`
        : `Object.values(${column.valuesImport.constant}).map(String)`
      : '[] /* TODO: add options */'

    return `SelectFilter.make('${column.name}').setLabel('${column.label}').setOptions(${options})`
  }

  if (column.kind === 'boolean') {
    return `SelectFilter.make('${column.name}').setLabel('${column.label}').setOptions(['true', 'false'])`
  }

  if (column.searchable) {
    return `TextFilter.make('${column.name}').setLabel('${column.label}')`
  }

  return null
}

function collectImports(model: IntrospectedModel) {
  const columnTypes = new Set<string>()
  const fieldTypes = new Set<string>()
  const filterTypes = new Set<string>()
  const valueImports = new Map<string, string>()

  for (const column of model.columns) {
    if (column.includeInTable) {
      columnTypes.add(columnClass(column))
    }

    if (column.includeInForm) {
      fieldTypes.add(fieldClass(column))
    }

    const filter = renderFilter(column)
    if (filter?.startsWith('SelectFilter')) {
      filterTypes.add('SelectFilter')
    }
    if (filter?.startsWith('TextFilter')) {
      filterTypes.add('TextFilter')
    }

    if (column.valuesImport) {
      valueImports.set(column.valuesImport.path, column.valuesImport.constant)
    }
  }

  const adminImports = [
    'Action',
    'defineForm',
    'defineTable',
    'Resource',
    ...Array.from(columnTypes).sort(),
    ...Array.from(fieldTypes).sort(),
    ...Array.from(filterTypes).sort(),
  ]

  return {
    adminImports: [...new Set(adminImports)],
    valueImports,
  }
}

function defaultSortColumn(model: IntrospectedModel) {
  const createdAt = model.columns.find((column) => column.name === 'createdAt')
  if (createdAt) {
    return 'createdAt'
  }

  const firstSortable = model.columns.find((column) => column.includeInTable && column.sortable)
  return firstSortable?.name ?? 'id'
}

export function generateResourceSource(model: IntrospectedModel) {
  const tableColumns = model.columns.filter((column) => column.includeInTable).map(renderColumn)
  const formFields = model.columns.filter((column) => column.includeInForm).map(renderField)
  const filters = model.columns.map(renderFilter).filter((filter): filter is string => filter !== null)
  const sortColumn = defaultSortColumn(model)
  const { adminImports, valueImports } = collectImports(model)

  const valueImportLines = [...valueImports.entries()]
    .flatMap(([path, constant]) => [`import { ${constant} } from '${path}'`])
    .join('\n')

  const filtersBlock =
    filters.length > 0
      ? `\n      .filters([\n${indent(filters.map((filter) => `${filter},`), 8)}\n      ])`
      : ''

  return `import ${model.modelName} from '#models/${model.modelImport}'
${valueImportLines ? `${valueImportLines}\n` : ''}import {
  ${adminImports.join(',\n  ')},
} from '@devalade/adonis-admin'

export default class ${model.resourceName} extends Resource {
  static model = ${model.modelName}
  static label = '${model.label}'
  static singularLabel = '${model.singularLabel}'
  static icon = '${model.icon}'

  static table(table: ReturnType<typeof defineTable>) {
    return table
      .columns([
${indent(tableColumns.map((column) => `${column},`), 8)}
      ])${filtersBlock}
      .rowActions([Action.view(), Action.edit(), Action.delete()])
      .bulkActions([Action.delete('bulk_delete').setLabel('Delete selected')])
      .defaultSort('${sortColumn}', 'desc')
  }

  static form(form: ReturnType<typeof defineForm>) {
    return form.fields([
${indent(formFields.length > 0 ? formFields.map((field) => `${field},`) : ['// No editable columns detected — add fields manually,'], 6)}
    ])
  }
}
`
}
