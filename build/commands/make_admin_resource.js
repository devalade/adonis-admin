var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, args, flags } from '@adonisjs/core/ace';
import { generateAdminResource } from '../src/helpers/generate_admin_resource.js';
export default class MakeAdminResource extends BaseCommand {
    static commandName = 'make:admin-resource';
    static description = 'Generate an admin resource from a Lucid model';
    async run() {
        const result = await generateAdminResource({
            application: this.app,
            modelName: this.model,
            force: this.force,
            register: this.register,
        });
        if (result.skipped) {
            this.logger.warning(`Resource already exists at ${result.destination}`);
            this.logger.info('Re-run with --force to overwrite it.');
            return;
        }
        this.logger.success(`Created admin resource ${result.destination}`);
        if (this.register) {
            if (result.registered) {
                this.logger.success('Registered resource in app/admin/register.ts');
            }
            else {
                this.logger.info('Resource was already registered in app/admin/register.ts');
            }
        }
        else {
            this.logger.info('Add the resource to app/admin/register.ts to enable it in the panel.');
        }
    }
}
__decorate([
    args.string({ description: 'Model name (e.g. Customer or WaitlistSignup)' })
], MakeAdminResource.prototype, "model", void 0);
__decorate([
    flags.boolean({
        description: 'Register the resource in app/admin/register.ts',
    })
], MakeAdminResource.prototype, "register", void 0);
__decorate([
    flags.boolean({
        description: 'Overwrite an existing resource file',
        alias: 'f',
    })
], MakeAdminResource.prototype, "force", void 0);
