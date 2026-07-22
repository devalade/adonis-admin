import { getAdminConfig } from '../helpers/admin_config.js';
import { useAdminSessionGuard } from '../helpers/admin_auth.js';
/**
 * Guest middleware for the admin login page. Redirects authenticated
 * users to the admin dashboard.
 */
export default class AdminGuestMiddleware {
    get redirectTo() {
        return getAdminConfig().path;
    }
    async handle(ctx, next, options = {}) {
        const config = getAdminConfig();
        const guards = options.guards ?? [config.guard];
        for (const guard of guards) {
            if (await useAdminSessionGuard(ctx.auth, guard).check()) {
                ctx.session.reflash();
                ctx.response.redirect(this.redirectTo, true);
                return;
            }
        }
        await next();
    }
}
