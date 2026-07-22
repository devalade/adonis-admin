export type AdminRouteMiddleware = {
    adminAuth: () => any;
    adminGuest: () => any;
    adminContext: () => any;
    adminResource: () => any;
};
export declare function registerAdminRoutes(routeMiddleware: AdminRouteMiddleware): Promise<void>;
export declare function bootAdminPanel(registerResources: () => void, routeMiddleware: AdminRouteMiddleware): Promise<void>;
//# sourceMappingURL=register_routes.d.ts.map