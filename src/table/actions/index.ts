import type { AdminActionSchema, AdminActionType } from '../../types.js'

export class Action {
  readonly name: string
  label: string
  type: AdminActionType
  destructive = false

  constructor(name: string, type: AdminActionType, label?: string) {
    this.name = name
    this.type = type
    this.label = label ?? name
  }

  static view(name = 'view') {
    return new Action(name, 'view', 'View')
  }

  static edit(name = 'edit') {
    return new Action(name, 'edit', 'Edit')
  }

  static delete(name = 'delete') {
    return new Action(name, 'delete', 'Delete').setDestructive()
  }

  setLabel(label: string) {
    this.label = label
    return this
  }

  setDestructive(destructive = true) {
    this.destructive = destructive
    return this
  }

  serialize(): AdminActionSchema {
    return {
      name: this.name,
      label: this.label,
      type: this.type,
      destructive: this.destructive || undefined,
    }
  }
}
