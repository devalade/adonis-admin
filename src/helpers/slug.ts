import string from '@adonisjs/core/helpers/string'

export function resourceSlugFromModelName(modelName: string) {
  return string.pluralize(string.dashCase(modelName))
}

export function resourceRouteNameFromSlug(slug: string) {
  return slug.replace(/-/g, '_')
}

export function humanizeResourceName(modelName: string) {
  return string.sentenceCase(string.noCase(modelName))
}
