import { Column } from '../column.js'

export class TextColumn extends Column {
  type = 'text' as const

  static make(name: string) {
    return new TextColumn(name)
  }
}

export class BadgeColumn extends Column {
  type = 'badge' as const

  static make(name: string) {
    return new BadgeColumn(name)
  }
}

export class DateColumn extends Column {
  type = 'date' as const

  static make(name: string) {
    return new DateColumn(name)
  }
}

export class BooleanColumn extends Column {
  type = 'boolean' as const

  static make(name: string) {
    return new BooleanColumn(name)
  }
}
