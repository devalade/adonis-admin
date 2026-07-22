import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { buildAdminNav } from '../registry.js'

export default class AdminContextMiddleware {
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    ctx.adminNav = buildAdminNav()
    await next()
  }
}
