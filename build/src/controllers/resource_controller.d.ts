import type { HttpContext } from '@adonisjs/core/http';
export default class AdminResourceController {
    index(ctx: HttpContext): Promise<string | import("@adonisjs/inertia/types").PageObject<any>>;
    create(ctx: HttpContext): Promise<string | import("@adonisjs/inertia/types").PageObject<any>>;
    store(ctx: HttpContext): Promise<import("@adonisjs/core/http").Redirect>;
    show(ctx: HttpContext): Promise<string | import("@adonisjs/inertia/types").PageObject<any>>;
    edit(ctx: HttpContext): Promise<string | import("@adonisjs/inertia/types").PageObject<any>>;
    update(ctx: HttpContext): Promise<void>;
    destroy(ctx: HttpContext): Promise<import("@adonisjs/core/http").Redirect>;
    bulkDestroy(ctx: HttpContext): Promise<import("@adonisjs/core/http").Redirect>;
}
//# sourceMappingURL=resource_controller.d.ts.map