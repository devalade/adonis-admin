import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { getAdminConfig } from '../helpers/admin_config.js'

type AdminGuard = keyof Authenticators

/**
 * Auth middleware for the admin panel. Redirects unauthenticated users
 * to the admin login page instead of the main app login.
 */
export default class AdminAuthMiddleware {
  get redirectTo() {
    const config = getAdminConfig()
    return `${config.path.replace(/\/$/, '')}/login`
  }

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: AdminGuard[]
    } = {}
  ): Promise<void> {
    const config = getAdminConfig()
    const guards = options.guards ?? [config.guard as AdminGuard]

    await ctx.auth.authenticateUsing(guards, { loginRoute: this.redirectTo })
    await next()
  }
}
