import { resolveAdminConfig } from './panel.js';
export default class AdminProvider {
    app;
    constructor(app) {
        this.app = app;
    }
    register() {
        this.app.container.singleton('admin.config', () => {
            return resolveAdminConfig(this.app.config.get('admin'));
        });
    }
}
