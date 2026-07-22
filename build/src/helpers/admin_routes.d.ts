export type AdminResourceRouteAction = 'index' | 'create' | 'store' | 'show' | 'edit' | 'update' | 'destroy' | 'bulk_destroy';
export type AdminResourceRouteName = `admin.${string}.${AdminResourceRouteAction}`;
export declare function adminResourceRoute(resourceRouteName: string, action: AdminResourceRouteAction): AdminResourceRouteName;
//# sourceMappingURL=admin_routes.d.ts.map