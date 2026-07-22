import type { ApplicationService } from '@adonisjs/core/types';
export type GenerateAdminResourceOptions = {
    application: ApplicationService;
    modelName: string;
    force?: boolean;
    register?: boolean;
};
export type GenerateAdminResourceResult = {
    destination: string;
    registered: boolean;
    skipped: boolean;
};
export declare function generateAdminResource(options: GenerateAdminResourceOptions): Promise<GenerateAdminResourceResult>;
//# sourceMappingURL=generate_admin_resource.d.ts.map