export class Filter {
    name;
    label;
    type = 'select';
    options = [];
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
    setOptions(options) {
        this.options = options.map((option) => typeof option === 'string' ? { label: option, value: option } : option);
        return this;
    }
    serialize() {
        return {
            name: this.name,
            label: this.label,
            type: this.type,
            options: this.options.length > 0 ? this.options : undefined,
        };
    }
}
export class SelectFilter extends Filter {
    type = 'select';
}
export class TextFilter extends Filter {
    type = 'text';
}
