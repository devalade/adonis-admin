import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import type { AdminPanelConfig } from '../panel.js'

/**
 * Auth middleware for the admin panel. Redirects unauthenticated users
 * to the admin login page instead of the main app login.
 */
export default class AdminAuthMiddleware {
  #config?: AdminPanelConfig

  get redirectTo() {
    const config = this.#config ?? (app.config.get('admin') as AdminPanelConfig)
    return `${config.path.replace(/\/$/, '')}/login`
  }

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    this.#config = app.config.get('admin') as AdminPanelConfig
    const guards = options.guards ?? [this.#config.guard as keyof Authenticators]

    await ctx.auth.authenticateUsing(guards, { loginRoute: this.redirectTo })
    return next()
  }
}
