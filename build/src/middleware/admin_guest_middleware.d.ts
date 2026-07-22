import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { Authenticators } from '@adonisjs/auth/types';
/**
 * Guest middleware for the admin login page. Redirects authenticated
 * users to the admin dashboard.
 */
export default class AdminGuestMiddleware {
    get redirectTo(): string;
    handle(ctx: HttpContext, next: NextFn, options?: {
        guards?: (keyof Authenticators)[];
    }): Promise<any>;
}
//# sourceMappingURL=admin_guest_middleware.d.ts.map