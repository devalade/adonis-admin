import string from '@adonisjs/core/helpers/string';
export function resourceSlugFromModelName(modelName) {
    return string.pluralize(string.dashCase(modelName));
}
export function resourceRouteNameFromSlug(slug) {
    return slug.replace(/-/g, '_');
}
export function humanizeResourceName(modelName) {
    return string.sentenceCase(string.noCase(modelName));
}
