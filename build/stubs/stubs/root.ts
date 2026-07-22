import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

export const stubsRoot = dirname(fileURLToPath(import.meta.url))
