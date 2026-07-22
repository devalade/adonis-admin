import type { ApplicationService } from '@adonisjs/core/types';
import { type AdminPanelConfig } from './panel.js';
export default class AdminProvider {
    protected app: ApplicationService;
    constructor(app: ApplicationService);
    register(): void;
}
declare module '@adonisjs/core/types' {
    interface ContainerBindings {
        'admin.config': AdminPanelConfig;
    }
}
//# sourceMappingURL=provider.d.ts.map