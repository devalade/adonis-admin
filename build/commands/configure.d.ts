import { BaseCommand } from '@adonisjs/core/ace';
export default class ConfigureAdmin extends BaseCommand {
    static commandName: string;
    static description: string;
    force: boolean;
    run(): Promise<void>;
}
//# sourceMappingURL=configure.d.ts.map