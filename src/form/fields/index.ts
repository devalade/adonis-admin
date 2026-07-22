import type { AdminFieldSchema, AdminFieldType, AdminOption } from '../../types.js'

export class Field {
  readonly name: string
  label: string
  type: AdminFieldType = 'text'
  required = false
  placeholder?: string
  helpText?: string
  options: AdminOption[] = []
  defaultValue?: string | boolean

  constructor(name: string) {
    this.name = name
    this.label = name
  }

  static make(name: string) {
    return new (this as typeof Field)(name)
  }

  setLabel(label: string) {
    this.label = label
    return this
  }

  setRequired(required = true) {
    this.required = required
    return this
  }

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder
    return this
  }

  setHelpText(helpText: string) {
    this.helpText = helpText
    return this
  }

  setOptions(options: AdminOption[] | readonly string[]) {
    this.options = options.map((option) =>
      typeof option === 'string' ? { label: option, value: option } : option
    )
    return this
  }

  setDefault(defaultValue: string | boolean) {
    this.defaultValue = defaultValue
    return this
  }

  serialize(): AdminFieldSchema {
    return {
      name: this.name,
      label: this.label,
      type: this.type,
      required: this.required,
      placeholder: this.placeholder,
      helpText: this.helpText,
      options: this.options.length > 0 ? this.options : undefined,
      defaultValue: this.defaultValue,
    }
  }
}

export class TextField extends Field {
  type = 'text' as const

  static make(name: string) {
    return new TextField(name)
  }
}

export class EmailField extends Field {
  type = 'email' as const

  static make(name: string) {
    return new EmailField(name)
  }

  email() {
    return this.setRequired(true)
  }
}

export class TextareaField extends Field {
  type = 'textarea' as const

  static make(name: string) {
    return new TextareaField(name)
  }
}

export class SelectField extends Field {
  type = 'select' as const

  static make(name: string) {
    return new SelectField(name)
  }
}

export class BooleanField extends Field {
  type = 'boolean' as const

  static make(name: string) {
    return new BooleanField(name)
  }
}
