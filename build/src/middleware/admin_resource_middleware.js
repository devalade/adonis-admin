import app from '@adonisjs/core/services/app';
import { resolveResource } from '../registry.js';
function requestPathname(request) {
    const raw = request.url().split('?')[0] ?? '';
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return new URL(raw).pathname;
    }
    return raw;
}
export default class AdminResourceMiddleware {
    async handle(ctx, next) {
        const config = app.config.get('admin');
        const pathname = requestPathname(ctx.request);
        const prefix = config.path.replace(/\/$/, '');
        const relativePath = pathname.startsWith(prefix)
            ? pathname.slice(prefix.length).replace(/^\//, '')
            : '';
        const slug = relativePath.split('/')[0];
        if (!slug) {
            return ctx.response.abort('Admin resource not found', 404);
        }
        ctx.adminResource = resolveResource(slug);
        return next();
    }
}
