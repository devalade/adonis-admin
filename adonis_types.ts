/// <reference path="./node_modules/@adonisjs/core/build/providers/vinejs_provider.d.ts" />
/// <reference path="./node_modules/@adonisjs/inertia/build/src/inertia_middleware.d.ts" />
/// <reference path="./node_modules/@adonisjs/session/build/src/session_middleware.d.ts" />

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth: any
  }

  interface Redirect {
    toRoute(route: string, params?: Record<string, unknown>): Redirect
  }
}

declare module '@adonisjs/inertia/types' {
  interface InertiaPages {
    [key: string]: any
  }
}
