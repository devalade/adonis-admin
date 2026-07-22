export class Form {
    #fields = [];
    fields(fields) {
        this.#fields = fields;
        return this;
    }
    getFields() {
        return this.#fields;
    }
}
export function defineForm(callback) {
    return callback(new Form());
}
