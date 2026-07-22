import type { Field } from './fields/index.js'

export class Form {
  #fields: Field[] = []

  fields(fields: Field[]) {
    this.#fields = fields
    return this
  }

  getFields() {
    return this.#fields
  }
}

export function defineForm(callback: (form: Form) => Form) {
  return callback(new Form())
}
