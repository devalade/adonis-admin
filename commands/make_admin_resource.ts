import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { generateAdminResource } from '../src/helpers/generate_admin_resource.js'

export default class MakeAdminResource extends BaseCommand {
  static commandName = 'make:admin-resource'
  static description = 'Generate an admin resource from a Lucid model'

  @args.string({ description: 'Model name (e.g. Customer or WaitlistSignup)' })
  declare model: string

  @flags.boolean({
    description: 'Register the resource in app/admin/register.ts',
  })
  declare register: boolean

  @flags.boolean({
    description: 'Overwrite an existing resource file',
    alias: 'f',
  })
  declare force: boolean

  async run() {
    const result = await generateAdminResource({
      application: this.app,
      modelName: this.model,
      force: this.force,
      register: this.register,
    })

    if (result.skipped) {
      this.logger.warning(`Resource already exists at ${result.destination}`)
      this.logger.info('Re-run with --force to overwrite it.')
      return
    }

    this.logger.success(`Created admin resource ${result.destination}`)

    if (this.register) {
      if (result.registered) {
        this.logger.success('Registered resource in app/admin/register.ts')
      } else {
        this.logger.info('Resource was already registered in app/admin/register.ts')
      }
    } else {
      this.logger.info('Add the resource to app/admin/register.ts to enable it in the panel.')
    }
  }
}
