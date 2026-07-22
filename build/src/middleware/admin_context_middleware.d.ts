import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
export default class AdminContextMiddleware {
    handle(ctx: HttpContext, next: NextFn): Promise<void>;
}
//# sourceMappingURL=admin_context_middleware.d.ts.map