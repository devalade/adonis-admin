declare module '@adonisjs/core/http' {
    interface HttpContext {
        auth: any;
    }
    interface Redirect {
        toRoute(route: string, params?: Record<string, unknown>): Redirect;
    }
}
declare module '@adonisjs/inertia/types' {
    interface InertiaPages {
        [key: string]: any;
    }
}
export {};
//# sourceMappingURL=adonis_types.d.ts.map