import app from '@adonisjs/core/services/app';
/**
 * Guest middleware for the admin login page. Redirects authenticated
 * users to the admin dashboard.
 */
export default class AdminGuestMiddleware {
    get redirectTo() {
        const config = app.config.get('admin');
        return config.path;
    }
    async handle(ctx, next, options = {}) {
        const config = app.config.get('admin');
        const guards = options.guards ?? [config.guard];
        for (const guard of guards) {
            if (await ctx.auth.use(guard).check()) {
                ctx.session.reflash();
                return ctx.response.redirect(this.redirectTo, true);
            }
        }
        return next();
    }
}
