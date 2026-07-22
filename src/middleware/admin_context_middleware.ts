import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { buildAdminNav } from '../registry.js'
import type { AdminNavItem } from '../types.js'

export default class AdminContextMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    ctx.adminNav = buildAdminNav()
    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    adminNav: AdminNavItem[]
  }
}
