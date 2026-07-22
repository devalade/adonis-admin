import { getAdminConfig } from '../helpers/admin_config.js';
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
        const config = getAdminConfig();
        const pathname = requestPathname(ctx.request);
        const prefix = config.path.replace(/\/$/, '');
        const relativePath = pathname.startsWith(prefix)
            ? pathname.slice(prefix.length).replace(/^\//, '')
            : '';
        const slug = relativePath.split('/')[0];
        if (!slug) {
            ctx.response.abort('Admin resource not found', 404);
            return;
        }
        ctx.adminResource = resolveResource(slug);
        await next();
    }
}
