export class Field {
    name;
    label;
    type = 'text';
    required = false;
    placeholder;
    helpText;
    options = [];
    defaultValue;
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
    setRequired(required = true) {
        this.required = required;
        return this;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    setHelpText(helpText) {
        this.helpText = helpText;
        return this;
    }
    setOptions(options) {
        this.options = options.map((option) => typeof option === 'string' ? { label: option, value: option } : option);
        return this;
    }
    setDefault(defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }
    serialize() {
        return {
            name: this.name,
            label: this.label,
            type: this.type,
            required: this.required,
            placeholder: this.placeholder,
            helpText: this.helpText,
            options: this.options.length > 0 ? this.options : undefined,
            defaultValue: this.defaultValue,
        };
    }
}
export class TextField extends Field {
    type = 'text';
    static make(name) {
        return new TextField(name);
    }
}
export class EmailField extends Field {
    type = 'email';
    static make(name) {
        return new EmailField(name);
    }
    email() {
        return this.setRequired(true);
    }
}
export class TextareaField extends Field {
    type = 'textarea';
    static make(name) {
        return new TextareaField(name);
    }
}
export class SelectField extends Field {
    type = 'select';
    static make(name) {
        return new SelectField(name);
    }
}
export class BooleanField extends Field {
    type = 'boolean';
    static make(name) {
        return new BooleanField(name);
    }
}
