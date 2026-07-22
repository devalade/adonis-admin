export function adminResourceRoute(resourceRouteName, action) {
    return `admin.${resourceRouteName}.${action}`;
}
