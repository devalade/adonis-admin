import { getAdminConfig } from '../helpers/admin_config.js';
/**
 * Auth middleware for the admin panel. Redirects unauthenticated users
 * to the admin login page instead of the main app login.
 */
export default class AdminAuthMiddleware {
    get redirectTo() {
        const config = getAdminConfig();
        return `${config.path.replace(/\/$/, '')}/login`;
    }
    async handle(ctx, next, options = {}) {
        const config = getAdminConfig();
        const guards = options.guards ?? [config.guard];
        await ctx.auth.authenticateUsing(guards, { loginRoute: this.redirectTo });
        await next();
    }
}
