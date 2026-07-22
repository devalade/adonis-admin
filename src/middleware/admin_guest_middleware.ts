import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { getAdminConfig } from '../helpers/admin_config.js'
import { useAdminSessionGuard } from '../helpers/admin_auth.js'

type AdminGuard = keyof Authenticators

/**
 * Guest middleware for the admin login page. Redirects authenticated
 * users to the admin dashboard.
 */
export default class AdminGuestMiddleware {
  get redirectTo() {
    return getAdminConfig().path
  }

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: AdminGuard[] } = {}
  ): Promise<void> {
    const config = getAdminConfig()
    const guards = options.guards ?? [config.guard as AdminGuard]

    for (const guard of guards) {
      if (await useAdminSessionGuard(ctx.auth, guard).check()) {
        ctx.session.reflash()
        ctx.response.redirect(this.redirectTo, true)
        return
      }
    }

    await next()
  }
}
