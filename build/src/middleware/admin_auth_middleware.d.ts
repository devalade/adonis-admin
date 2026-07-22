import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { Authenticators } from '@adonisjs/auth/types';
/**
 * Auth middleware for the admin panel. Redirects unauthenticated users
 * to the admin login page instead of the main app login.
 */
export default class AdminAuthMiddleware {
    #private;
    get redirectTo(): string;
    handle(ctx: HttpContext, next: NextFn, options?: {
        guards?: (keyof Authenticators)[];
    }): Promise<any>;
}
//# sourceMappingURL=admin_auth_middleware.d.ts.map