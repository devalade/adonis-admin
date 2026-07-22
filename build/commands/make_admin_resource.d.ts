import { BaseCommand } from '@adonisjs/core/ace';
export default class MakeAdminResource extends BaseCommand {
    static commandName: string;
    static description: string;
    model: string;
    register: boolean;
    force: boolean;
    run(): Promise<void>;
}
//# sourceMappingURL=make_admin_resource.d.ts.map