import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import type { ResourceConstructor } from '../resource.js';
export default class AdminResourceMiddleware {
    handle(ctx: HttpContext, next: NextFn): Promise<any>;
}
declare module '@adonisjs/core/http' {
    interface HttpContext {
        adminResource: ResourceConstructor;
    }
}
//# sourceMappingURL=admin_resource_middleware.d.ts.map