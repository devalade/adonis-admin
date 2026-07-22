import type { HttpContext } from '@adonisjs/core/http'

/**
 * Session guard surface used by admin auth middleware. Host apps should
 * register a session guard that satisfies this contract via auth config.
 */
export type AdminSessionGuard = {
  login(user: unknown, remember?: boolean): Promise<void>
  logout(): Promise<void>
  check(): Promise<boolean>
}

export function useAdminSessionGuard(
  auth: HttpContext['auth'],
  guard: string
): AdminSessionGuard {
  return auth.use(guard as 'web') as unknown as AdminSessionGuard
}

declare module '@adonisjs/auth/types' {
  interface Authenticators {
    web: import('@adonisjs/auth/types').GuardFactory
  }
}
