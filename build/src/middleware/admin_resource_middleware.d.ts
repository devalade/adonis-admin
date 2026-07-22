import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
export default class AdminResourceMiddleware {
    handle(ctx: HttpContext, next: NextFn): Promise<void>;
}
//# sourceMappingURL=admin_resource_middleware.d.ts.map