var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseCommand, flags } from '@adonisjs/core/ace';
import { stubsRoot } from '../stubs/root.js';
import { access, copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, join, relative } from 'node:path';
async function pathExists(path) {
    try {
        await access(path, fsConstants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
async function writeStub(stubPath, destination, force) {
    if (!force && (await pathExists(destination))) {
        return false;
    }
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(stubPath, destination);
    return true;
}
async function copyStubDirectory(stubDir, destinationDir, force) {
    const published = [];
    async function walk(currentStubDir, currentDestinationDir) {
        await mkdir(currentDestinationDir, { recursive: true });
        const entries = await readdir(currentStubDir, { withFileTypes: true });
        for (const entry of entries) {
            const stubPath = join(currentStubDir, entry.name);
            const destinationPath = join(currentDestinationDir, entry.name);
            if (entry.isDirectory()) {
                await walk(stubPath, destinationPath);
                continue;
            }
            if (await writeStub(stubPath, destinationPath, force)) {
                published.push(relative(destinationDir, destinationPath));
            }
        }
    }
    await walk(stubDir, destinationDir);
    return published;
}
async function patchAdonisRc(appRoot) {
    const adonisrcPath = join(appRoot, 'adonisrc.ts');
    let contents = await readFile(adonisrcPath, 'utf-8');
    let changed = false;
    if (!contents.includes('@devalade/adonis-admin/provider') && !contents.includes('#providers/admin_provider')) {
        contents = contents.replace(/providers:\s*\[/, "providers: [\n    () => import('#providers/admin_provider'),");
        changed = true;
    }
    if (!contents.includes('#start/admin')) {
        contents = contents.replace("() => import('#start/routes'),", "() => import('#start/routes'),\n    () => import('#start/admin'),");
        changed = true;
    }
    if (!contents.includes('@devalade/adonis-admin/commands')) {
        contents = contents.replace(/commands:\s*\[/, "commands: [\n    () => import('@devalade/adonis-admin/commands'),");
        changed = true;
    }
    if (changed) {
        await writeFile(adonisrcPath, contents, 'utf-8');
    }
    return changed;
}
async function patchKernel(appRoot) {
    const kernelPath = join(appRoot, 'start/kernel.ts');
    let contents = await readFile(kernelPath, 'utf-8');
    if (contents.includes('@devalade/adonis-admin/middleware/admin_auth_middleware')) {
        return false;
    }
    if (!contents.includes('adminAuth:')) {
        contents = contents.replace(/export const middleware = router\.named\(\{/, `export const middleware = router.named({
  adminContext: () => import('@devalade/adonis-admin/middleware/admin_context_middleware'),
  adminResource: () => import('@devalade/adonis-admin/middleware/admin_resource_middleware'),
  adminAuth: () => import('@devalade/adonis-admin/middleware/admin_auth_middleware'),
  adminGuest: () => import('@devalade/adonis-admin/middleware/admin_guest_middleware'),`);
    }
    await writeFile(kernelPath, contents, 'utf-8');
    return true;
}
export default class ConfigureAdmin extends BaseCommand {
    static commandName = 'configure:admin';
    static description = 'Publish admin panel stubs and wire the provider';
    async run() {
        const appRoot = this.app.appRoot.toString();
        const stubs = stubsRoot;
        const published = [];
        if (await writeStub(join(stubs, 'config/admin.stub'), join(appRoot, 'config/admin.ts'), this.force)) {
            published.push('config/admin.ts');
        }
        if (await writeStub(join(stubs, 'app/admin/register.stub'), join(appRoot, 'app/admin/register.ts'), this.force)) {
            published.push('app/admin/register.ts');
        }
        if (await writeStub(join(stubs, 'start/admin.stub'), join(appRoot, 'start/admin.ts'), this.force)) {
            published.push('start/admin.ts');
        }
        if (await writeStub(join(stubs, 'providers/admin_provider.stub'), join(appRoot, 'providers/admin_provider.ts'), this.force)) {
            published.push('providers/admin_provider.ts');
        }
        if (await patchAdonisRc(appRoot)) {
            published.push('adonisrc.ts provider');
        }
        if (await patchKernel(appRoot)) {
            published.push('start/kernel.ts middleware aliases');
        }
        const inertiaPublished = await copyStubDirectory(join(stubs, 'inertia/admin'), join(appRoot, 'inertia/admin'), this.force);
        published.push(...inertiaPublished.map((file) => `inertia/admin/${file}`));
        const pagesPublished = await copyStubDirectory(join(stubs, 'inertia/pages/admin'), join(appRoot, 'inertia/pages/admin'), this.force);
        published.push(...pagesPublished.map((file) => `inertia/pages/admin/${file}`));
        if (published.length === 0) {
            this.logger.info('Admin panel is already configured.');
            return;
        }
        this.logger.success(`Configured admin panel: ${published.length} file(s) published`);
        for (const file of published) {
            this.logger.info(`  - ${file}`);
        }
        this.logger.info('Next steps:');
        this.logger.info('  1. Edit config/admin.ts (user model module + login validator)');
        this.logger.info('  2. Register resources in app/admin/register.ts');
        this.logger.info('  3. node ace make:admin-resource YourModel --register');
    }
}
__decorate([
    flags.boolean({ description: 'Overwrite existing stub files' })
], ConfigureAdmin.prototype, "force", void 0);
