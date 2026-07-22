import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import type { AdminPanelConfig } from '../panel.js'

/**
 * Guest middleware for the admin login page. Redirects authenticated
 * users to the admin dashboard.
 */
export default class AdminGuestMiddleware {
  get redirectTo() {
    const config = app.config.get('admin') as AdminPanelConfig
    return config.path
  }

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    const config = app.config.get('admin') as AdminPanelConfig
    const guards = options.guards ?? [config.guard as keyof Authenticators]

    for (const guard of guards) {
      if (await ctx.auth.use(guard).check()) {
        ctx.session.reflash()
        return ctx.response.redirect(this.redirectTo, true)
      }
    }

    return next()
  }
}
