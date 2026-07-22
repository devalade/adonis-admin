import type { VineValidator } from '@vinejs/vine'
import type { ResourceConstructor } from './resource.js'

export type AdminPanelConfig = {
  path: string
  guard: string
  registerModule: string
  userModelModule: string
  loginValidator: VineValidator<any, any>
  resources: ResourceConstructor[]
  pagination: {
    defaultPerPage: number
    maxPerPage: number
  }
  bulkDestroy: {
    maxIds: number
  }
}

export const adminPanelDefaults: AdminPanelConfig = {
  path: '/admin',
  guard: 'web',
  registerModule: '#app_admin/register',
  userModelModule: '#models/user',
  loginValidator: null as unknown as VineValidator<any, any>,
  resources: [],
  pagination: {
    defaultPerPage: 20,
    maxPerPage: 100,
  },
  bulkDestroy: {
    maxIds: 100,
  },
}

export function resolveAdminConfig(config: Partial<AdminPanelConfig>): AdminPanelConfig {
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
  }
}
