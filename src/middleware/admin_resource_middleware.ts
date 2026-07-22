import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { resolveResource } from '../registry.js'
import type { ResourceConstructor } from '../resource.js'
import type { AdminPanelConfig } from '../panel.js'

function requestPathname(request: HttpContext['request']) {
  const raw = request.url().split('?')[0] ?? ''

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return new URL(raw).pathname
  }

  return raw
}

export default class AdminResourceMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const config = app.config.get('admin') as AdminPanelConfig
    const pathname = requestPathname(ctx.request)
    const prefix = config.path.replace(/\/$/, '')
    const relativePath = pathname.startsWith(prefix)
      ? pathname.slice(prefix.length).replace(/^\//, '')
      : ''
    const slug = relativePath.split('/')[0]

    if (!slug) {
      return ctx.response.abort('Admin resource not found', 404)
    }

    ctx.adminResource = resolveResource(slug)

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    adminResource: ResourceConstructor
  }
}
