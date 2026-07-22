const registry = new Map();
const registrationOrder = [];
export function registerResource(resource) {
    registry.set(resource.getSlug(), resource);
    registry.set(resource.getRouteName(), resource);
    if (!registrationOrder.includes(resource)) {
        registrationOrder.push(resource);
    }
}
export function registerResources(resources) {
    for (const resource of resources) {
        registerResource(resource);
    }
}
export function getDefaultResource() {
    return registrationOrder[0];
}
export function resolveResource(slugOrRouteName) {
    const resource = registry.get(slugOrRouteName);
    if (!resource) {
        throw new Error(`Admin resource "${slugOrRouteName}" is not registered`);
    }
    return resource;
}
export function getRegisteredResources() {
    return [...registrationOrder].sort((left, right) => left.getLabel().localeCompare(right.getLabel()));
}
export function buildAdminNav() {
    return getRegisteredResources().map((resource) => ({
        slug: resource.getSlug(),
        routeName: resource.getRouteName(),
        label: resource.getLabel(),
        icon: resource.icon,
    }));
}
