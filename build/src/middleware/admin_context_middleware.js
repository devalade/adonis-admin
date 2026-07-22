import { buildAdminNav } from '../registry.js';
export default class AdminContextMiddleware {
    async handle(ctx, next) {
        ctx.adminNav = buildAdminNav();
        await next();
    }
}
