export const adminPanelDefaults = {
    path: '/admin',
    guard: 'web',
    registerModule: '#app_admin/register',
    userModelModule: '#models/user',
    resources: [],
    pagination: {
        defaultPerPage: 20,
        maxPerPage: 100,
    },
    bulkDestroy: {
        maxIds: 100,
    },
};
export function resolveAdminConfig(config) {
    if (!config.loginValidator) {
        throw new Error('admin.loginValidator is required in config/admin.ts');
    }
    return {
        ...adminPanelDefaults,
        ...config,
        loginValidator: config.loginValidator,
        pagination: {
            ...adminPanelDefaults.pagination,
            ...config.pagination,
        },
        bulkDestroy: {
            ...adminPanelDefaults.bulkDestroy,
            ...config.bulkDestroy,
        },
        resources: config.resources ?? adminPanelDefaults.resources,
    };
}
