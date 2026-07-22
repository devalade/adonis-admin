import app from '@adonisjs/core/services/app'
import type { AdminPanelConfig } from '../panel.js'

export function getAdminConfig(): AdminPanelConfig {
  return app.config.get('admin') as AdminPanelConfig
}
