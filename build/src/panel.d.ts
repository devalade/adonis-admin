import type { VineValidator } from '@vinejs/vine';
import type { ResourceConstructor } from './resource.js';
export type AdminPanelConfig = {
    path: string;
    guard: string;
    registerModule: string;
    userModelModule: string;
    loginValidator: VineValidator<any, any>;
    resources: ResourceConstructor[];
    pagination: {
        defaultPerPage: number;
        maxPerPage: number;
    };
    bulkDestroy: {
        maxIds: number;
    };
};
export declare const adminPanelDefaults: AdminPanelConfig;
export declare function resolveAdminConfig(config: Partial<AdminPanelConfig>): AdminPanelConfig;
//# sourceMappingURL=panel.d.ts.map