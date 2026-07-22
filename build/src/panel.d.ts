import type { ResourceConstructor } from './resource.js';
import type { AdminLoginValidator } from './types/validators.js';
export type AdminPanelConfig = {
    path: string;
    guard: string;
    registerModule: string;
    userModelModule: string;
    loginValidator: AdminLoginValidator;
    resources: ResourceConstructor[];
    pagination: {
        defaultPerPage: number;
        maxPerPage: number;
    };
    bulkDestroy: {
        maxIds: number;
    };
};
export declare const adminPanelDefaults: Omit<AdminPanelConfig, 'loginValidator'>;
export declare function resolveAdminConfig(config: Partial<AdminPanelConfig>): AdminPanelConfig;
//# sourceMappingURL=panel.d.ts.map