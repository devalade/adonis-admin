import type { ResourceConstructor } from '../resource.js';
import type { AdminFormPageProps, AdminIndexPageProps, AdminLoginPageProps, AdminNavItem, AdminShowPageProps } from '../types.js';
declare module '@adonisjs/core/http' {
    interface HttpContext {
        adminNav: AdminNavItem[];
        adminResource: ResourceConstructor;
    }
    interface Redirect {
        toRoute(route: string, params?: Record<string, unknown>): Redirect;
    }
}
declare module '@adonisjs/inertia/types' {
    interface InertiaPages {
        'admin/login': AdminLoginPageProps;
        'admin/resource/index': AdminIndexPageProps;
        'admin/resource/form': AdminFormPageProps;
        'admin/resource/show': AdminShowPageProps;
    }
}
//# sourceMappingURL=augmentations.d.ts.map