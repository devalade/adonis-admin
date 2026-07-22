import type { AdminFilterSchema, AdminFilterType, AdminOption } from '../../types.js'

export class Filter {
  readonly name: string
  label: string
  type: AdminFilterType = 'select'
  options: AdminOption[] = []

  constructor(name: string) {
    this.name = name
    this.label = name
  }

  static make(name: string) {
    return new (this as typeof Filter)(name)
  }

  setLabel(label: string) {
    this.label = label
    return this
  }

  setOptions(options: AdminOption[] | readonly string[]) {
    this.options = options.map((option) =>
      typeof option === 'string' ? { label: option, value: option } : option
    )
    return this
  }

  serialize(): AdminFilterSchema {
    return {
      name: this.name,
      label: this.label,
      type: this.type,
      options: this.options.length > 0 ? this.options : undefined,
    }
  }
}

export class SelectFilter extends Filter {
  type = 'select' as const
}

export class TextFilter extends Filter {
  type = 'text' as const
}
