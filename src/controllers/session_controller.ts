import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import type { LucidModel } from '@adonisjs/lucid/types/model'
import type { AdminPanelConfig } from '../panel.js'

type AuthUserModel = LucidModel & {
  verifyCredentials: (uid: string, password: string) => Promise<unknown>
}

export default class AdminSessionController {
  #config(): AdminPanelConfig {
    return app.config.get('admin') as AdminPanelConfig
  }

  async #userModel(): Promise<AuthUserModel> {
    const config = this.#config()
    const module = await app.import(config.userModelModule)
    return module.default as AuthUserModel
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('admin/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const config = this.#config()
    const UserModel = await this.#userModel()
    const { email, password } = await request.validateUsing(config.loginValidator)
    const user = await UserModel.verifyCredentials(email, password)

    await auth.use(config.guard as 'web').login(user as never)
    session.flash('success', 'Signed in to admin.')

    return response.redirect().toIntended(config.path)
  }

  async destroy({ auth, response, session }: HttpContext) {
    const config = this.#config()

    await auth.use(config.guard as 'web').logout()
    session.flash('success', 'Signed out of admin.')

    return response.redirect().toPath(`${config.path.replace(/\/$/, '')}/login`)
  }
}
