export const adminPanelDefaults = {
    path: '/admin',
    guard: 'web',
    registerModule: '#app_admin/register',
    userModelModule: '#models/user',
    loginValidator: null,
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
    return {
        ...adminPanelDefaults,
        ...config,
        pagination: {
            ...adminPanelDefaults.pagination,
            ...config.pagination,
        },
        bulkDestroy: {
            ...adminPanelDefaults.bulkDestroy,
            ...config.bulkDestroy,
        },
    };
}
