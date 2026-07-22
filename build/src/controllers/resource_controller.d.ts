import type { HttpContext } from '@adonisjs/core/http';
import '../types/augmentations.js';
export default class AdminResourceController {
    index(ctx: HttpContext): Promise<void>;
    create(ctx: HttpContext): Promise<void>;
    store(ctx: HttpContext): Promise<void>;
    show(ctx: HttpContext): Promise<void>;
    edit(ctx: HttpContext): Promise<void>;
    update(ctx: HttpContext): Promise<void>;
    destroy(ctx: HttpContext): Promise<void>;
    bulkDestroy(ctx: HttpContext): Promise<void>;
}
//# sourceMappingURL=resource_controller.d.ts.map