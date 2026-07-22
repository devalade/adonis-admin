import { getAdminConfig } from '../helpers/admin_config.js';
import { getDefaultResource, getRegisteredResources } from '../registry.js';
import AdminResourceController from '../controllers/resource_controller.js';
import AdminSessionController from '../controllers/session_controller.js';
function registerResourceRoutes(router, ResourceClass, adminPath, routeMiddleware) {
    const slug = ResourceClass.getSlug();
    const routeName = ResourceClass.getRouteName();
    router
        .group(() => {
        router.get('/', [AdminResourceController, 'index']).as(`admin.${routeName}.index`);
        router.get('/create', [AdminResourceController, 'create']).as(`admin.${routeName}.create`);
        router.post('/', [AdminResourceController, 'store']).as(`admin.${routeName}.store`);
        router
            .post('/bulk-destroy', [AdminResourceController, 'bulkDestroy'])
            .as(`admin.${routeName}.bulk_destroy`);
        router
            .get('/:id', [AdminResourceController, 'show'])
            .where('id', router.matchers.number())
            .as(`admin.${routeName}.show`);
        router
            .get('/:id/edit', [AdminResourceController, 'edit'])
            .where('id', router.matchers.number())
            .as(`admin.${routeName}.edit`);
        router
            .put('/:id', [AdminResourceController, 'update'])
            .where('id', router.matchers.number())
            .as(`admin.${routeName}.update`);
        router
            .delete('/:id', [AdminResourceController, 'destroy'])
            .where('id', router.matchers.number())
            .as(`admin.${routeName}.destroy`);
    })
        .prefix(`${adminPath}/${slug}`)
        .use([
        routeMiddleware.adminAuth(),
        routeMiddleware.adminContext(),
        routeMiddleware.adminResource(),
    ]);
}
export async function registerAdminRoutes(routeMiddleware) {
    const { default: router } = await import('@adonisjs/core/services/router');
    const config = getAdminConfig();
    const adminPath = config.path.replace(/\/$/, '');
    router
        .group(() => {
        router.get('/login', [AdminSessionController, 'create']).as('admin.session.create');
        router.post('/login', [AdminSessionController, 'store']).as('admin.session.store');
    })
        .prefix(adminPath)
        .use([routeMiddleware.adminGuest()]);
    router
        .post(`${adminPath}/logout`, [AdminSessionController, 'destroy'])
        .use([routeMiddleware.adminAuth()])
        .as('admin.session.destroy');
    for (const ResourceClass of getRegisteredResources()) {
        registerResourceRoutes(router, ResourceClass, adminPath, routeMiddleware);
    }
    router
        .get(adminPath, ({ response }) => {
        const firstResource = getDefaultResource();
        if (!firstResource) {
            return response.notFound('No admin resources registered');
        }
        return response.redirect().toPath(`${adminPath}/${firstResource.getSlug()}`);
    })
        .use([routeMiddleware.adminAuth(), routeMiddleware.adminContext()])
        .as('admin.dashboard');
}
export async function bootAdminPanel(registerResources, routeMiddleware) {
    registerResources();
    await registerAdminRoutes(routeMiddleware);
}
