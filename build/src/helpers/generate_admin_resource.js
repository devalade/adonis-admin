import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import string from '@adonisjs/core/helpers/string';
import { generateResourceSource } from './generate_resource_source.js';
import { introspectModel } from './introspect_model.js';
import { registerResourceInPanel } from './register_resource.js';
async function loadModel(application, modelName) {
    const modelImport = string.snakeCase(modelName);
    try {
        const module = await application.import(`#models/${modelImport}`);
        return module.default;
    }
    catch {
        throw new Error(`Model "${modelName}" was not found at app/models/${modelImport}.ts`);
    }
}
async function registerResource(appRoot, resourceName, fileName) {
    return registerResourceInPanel(appRoot, resourceName, fileName);
}
export async function generateAdminResource(options) {
    const appRoot = fileURLToPath(options.application.appRoot);
    const Model = await loadModel(options.application, options.modelName);
    const introspected = await introspectModel(Model, appRoot);
    const resourceName = introspected.resourceName;
    const fileName = `${string.snakeCase(resourceName)}.ts`;
    const directory = join(appRoot, 'app/admin/resources');
    const destination = join(directory, fileName);
    try {
        await access(destination, fsConstants.F_OK);
        if (!options.force) {
            return {
                destination,
                registered: false,
                skipped: true,
            };
        }
    }
    catch {
        // File does not exist yet.
    }
    await mkdir(directory, { recursive: true });
    await writeFile(destination, generateResourceSource(introspected), 'utf-8');
    let registered = false;
    if (options.register) {
        registered = await registerResource(appRoot, resourceName, fileName);
    }
    return {
        destination,
        registered,
        skipped: false,
    };
}
