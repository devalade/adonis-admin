import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function registerResourceInPanel(
  appRoot: string,
  resourceName: string,
  fileName: string
): Promise<boolean> {
  const registerPath = join(appRoot, 'app/admin/register.ts')
  const importPath = `#app_admin/resources/${fileName.replace(/\.ts$/, '')}`
  let contents = await readFile(registerPath, 'utf-8')

  if (contents.includes(importPath)) {
    return false
  }

  const importLine = `import ${resourceName} from '${importPath}'`
  const registerMarker = 'export function registerAdminResources() {'
  const importAnchor = contents.indexOf(registerMarker)

  if (importAnchor === -1) {
    throw new Error('Could not find registerAdminResources() in app/admin/register.ts')
  }

  contents = `${contents.slice(0, importAnchor)}${importLine}\n${contents.slice(importAnchor)}`

  contents = contents.replace(
    /registerResources\(\[([\s\S]*?)\]\)/,
    (_match, resourcesBlock: string) => {
      const resources = resourcesBlock
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)

      resources.push(resourceName)

      return `registerResources([${resources.join(', ')}])`
    }
  )

  await writeFile(registerPath, contents, 'utf-8')

  return true
}
