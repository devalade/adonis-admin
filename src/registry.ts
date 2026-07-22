import type { ResourceConstructor } from './resource.js'
import type { AdminNavItem } from './types.js'

const registry = new Map<string, ResourceConstructor>()
const registrationOrder: ResourceConstructor[] = []

export function registerResource(resource: ResourceConstructor) {
  registry.set(resource.getSlug(), resource)
  registry.set(resource.getRouteName(), resource)

  if (!registrationOrder.includes(resource)) {
    registrationOrder.push(resource)
  }
}

export function registerResources(resources: ResourceConstructor[]) {
  for (const resource of resources) {
    registerResource(resource)
  }
}

export function getDefaultResource() {
  return registrationOrder[0]
}

export function resolveResource(slugOrRouteName: string) {
  const resource = registry.get(slugOrRouteName)

  if (!resource) {
    throw new Error(`Admin resource "${slugOrRouteName}" is not registered`)
  }

  return resource
}

export function getRegisteredResources() {
  return [...registrationOrder].sort((left, right) => left.getLabel().localeCompare(right.getLabel()))
}

export function buildAdminNav(): AdminNavItem[] {
  return getRegisteredResources().map((resource) => ({
    slug: resource.getSlug(),
    routeName: resource.getRouteName(),
    label: resource.getLabel(),
    icon: resource.icon,
  }))
}
