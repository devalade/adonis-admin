import vine from '@vinejs/vine';
function fieldRule(field) {
    switch (field.type) {
        case 'email':
            return vine.string().trim().email().maxLength(254);
        case 'boolean':
            return vine.boolean();
        case 'textarea':
        case 'text':
        case 'select':
        default:
            return vine.string().trim().maxLength(65535);
    }
}
export function buildValidatorFromFields(fields, _mode) {
    const schema = {};
    for (const field of fields) {
        const rule = fieldRule(field);
        if (field.required) {
            schema[field.name] = rule;
            continue;
        }
        schema[field.name] = rule.optional();
    }
    return vine.create(schema);
}
