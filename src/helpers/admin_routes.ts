export type AdminResourceRouteAction =
  | 'index'
  | 'create'
  | 'store'
  | 'show'
  | 'edit'
  | 'update'
  | 'destroy'
  | 'bulk_destroy'

export type AdminResourceRouteName = `admin.${string}.${AdminResourceRouteAction}`

export function adminResourceRoute(
  resourceRouteName: string,
  action: AdminResourceRouteAction
): AdminResourceRouteName {
  return `admin.${resourceRouteName}.${action}`
}
