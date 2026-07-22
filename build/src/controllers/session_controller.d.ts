import type { HttpContext } from '@adonisjs/core/http';
export default class AdminSessionController {
    #private;
    create({ inertia }: HttpContext): Promise<string | import("@adonisjs/inertia/types").PageObject<any>>;
    store({ request, auth, response, session }: HttpContext): Promise<void>;
    destroy({ auth, response, session }: HttpContext): Promise<void>;
}
//# sourceMappingURL=session_controller.d.ts.map