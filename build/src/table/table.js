export class Table {
    #columns = [];
    #filters = [];
    #rowActions = [];
    #bulkActions = [];
    #defaultSort = {
        column: 'id',
        direction: 'desc',
    };
    columns(columns) {
        this.#columns = columns;
        return this;
    }
    filters(filters) {
        this.#filters = filters;
        return this;
    }
    rowActions(actions) {
        this.#rowActions = actions;
        return this;
    }
    bulkActions(actions) {
        this.#bulkActions = actions;
        return this;
    }
    defaultSort(column, direction = 'asc') {
        this.#defaultSort = { column, direction };
        return this;
    }
    getColumns() {
        return this.#columns;
    }
    getFilters() {
        return this.#filters;
    }
    getRowActions() {
        return this.#rowActions;
    }
    getBulkActions() {
        return this.#bulkActions;
    }
    getDefaultSort() {
        return this.#defaultSort;
    }
}
export function defineTable(callback) {
    return callback(new Table());
}
