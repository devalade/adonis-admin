import type { ResourceConstructor } from './resource.js';
import type { AdminNavItem } from './types.js';
export declare function registerResource(resource: ResourceConstructor): void;
export declare function registerResources(resources: ResourceConstructor[]): void;
export declare function getDefaultResource(): typeof import("./resource.js").Resource;
export declare function resolveResource(slugOrRouteName: string): typeof import("./resource.js").Resource;
export declare function getRegisteredResources(): typeof import("./resource.js").Resource[];
export declare function buildAdminNav(): AdminNavItem[];
//# sourceMappingURL=registry.d.ts.map