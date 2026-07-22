import type { ApplicationService } from '@adonisjs/core/types'
import { resolveAdminConfig, type AdminPanelConfig } from './panel.js'

export default class AdminProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('admin.config', () => {
      return resolveAdminConfig(this.app.config.get('admin') as Partial<AdminPanelConfig>)
    })
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'admin.config': AdminPanelConfig
  }
}
