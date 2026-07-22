import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { AdminNavItem } from '../types.js';
export default class AdminContextMiddleware {
    handle(ctx: HttpContext, next: NextFn): Promise<any>;
}
declare module '@adonisjs/core/http' {
    interface HttpContext {
        adminNav: AdminNavItem[];
    }
}
//# sourceMappingURL=admin_context_middleware.d.ts.map