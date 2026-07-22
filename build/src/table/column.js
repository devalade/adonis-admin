export class Column {
    name;
    label;
    type = 'text';
    sortable = false;
    searchable = false;
    formatFn;
    constructor(name) {
        this.name = name;
        this.label = name;
    }
    static make(name) {
        return new this(name);
    }
    setLabel(label) {
        this.label = label;
        return this;
    }
    setSortable(sortable = true) {
        this.sortable = sortable;
        return this;
    }
    setSearchable(searchable = true) {
        this.searchable = searchable;
        return this;
    }
    format(callback) {
        this.formatFn = callback;
        return this;
    }
    serialize() {
        return {
            name: this.name,
            label: this.label,
            type: this.type,
            sortable: this.sortable,
            searchable: this.searchable,
        };
    }
    formatValue(value, record) {
        if (this.formatFn) {
            return this.formatFn(value, record);
        }
        return value;
    }
}
