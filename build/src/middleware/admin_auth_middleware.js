import app from '@adonisjs/core/services/app';
/**
 * Auth middleware for the admin panel. Redirects unauthenticated users
 * to the admin login page instead of the main app login.
 */
export default class AdminAuthMiddleware {
    #config;
    get redirectTo() {
        const config = this.#config ?? app.config.get('admin');
        return `${config.path.replace(/\/$/, '')}/login`;
    }
    async handle(ctx, next, options = {}) {
        this.#config = app.config.get('admin');
        const guards = options.guards ?? [this.#config.guard];
        await ctx.auth.authenticateUsing(guards, { loginRoute: this.redirectTo });
        return next();
    }
}
