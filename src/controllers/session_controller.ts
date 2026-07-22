import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import type { LucidModel } from '@adonisjs/lucid/types/model'
import { getAdminConfig } from '../helpers/admin_config.js'
import { useAdminSessionGuard } from '../helpers/admin_auth.js'
import '../types/augmentations.js'

type AuthUserModel = LucidModel & {
  verifyCredentials: (uid: string, password: string) => Promise<InstanceType<LucidModel>>
}

export default class AdminSessionController {
  async #userModel(): Promise<AuthUserModel> {
    const config = getAdminConfig()
    const module = await app.import(config.userModelModule)
    return module.default as AuthUserModel
  }

  async create({ inertia }: HttpContext): Promise<void> {
    await inertia.render('admin/login', {})
  }

  async store({ request, auth, response, session }: HttpContext): Promise<void> {
    const config = getAdminConfig()
    const UserModel = await this.#userModel()
    const { email, password } = await request.validateUsing(config.loginValidator, {
      meta: undefined,
    })
    const user = await UserModel.verifyCredentials(email, password)

    await useAdminSessionGuard(auth, config.guard).login(user)
    session.flash('success', 'Signed in to admin.')

    response.redirect().toIntended(config.path)
  }

  async destroy({ auth, response, session }: HttpContext): Promise<void> {
    const config = getAdminConfig()

    await useAdminSessionGuard(auth, config.guard).logout()
    session.flash('success', 'Signed out of admin.')

    response.redirect().toPath(`${config.path.replace(/\/$/, '')}/login`)
  }
}
