import app from '@adonisjs/core/services/app';
export function getAdminConfig() {
    return app.config.get('admin');
}
