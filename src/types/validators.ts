import type { VineValidator } from '@vinejs/vine'

/**
 * Dynamic Vine validators for admin resources. Schemas are built at runtime
 * from form field definitions or assigned per resource subclass.
 */
export type AdminResourceValidator = VineValidator<any, undefined>

export type AdminLoginValidator = VineValidator<any, undefined>
