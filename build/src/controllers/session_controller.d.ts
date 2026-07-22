import type { HttpContext } from '@adonisjs/core/http';
import '../types/augmentations.js';
export default class AdminSessionController {
    #private;
    create({ inertia }: HttpContext): Promise<void>;
    store({ request, auth, response, session }: HttpContext): Promise<void>;
    destroy({ auth, response, session }: HttpContext): Promise<void>;
}
//# sourceMappingURL=session_controller.d.ts.map