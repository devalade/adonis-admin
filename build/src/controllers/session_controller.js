import app from '@adonisjs/core/services/app';
export default class AdminSessionController {
    #config() {
        return app.config.get('admin');
    }
    async #userModel() {
        const config = this.#config();
        const module = await app.import(config.userModelModule);
        return module.default;
    }
    async create({ inertia }) {
        return inertia.render('admin/login', {});
    }
    async store({ request, auth, response, session }) {
        const config = this.#config();
        const UserModel = await this.#userModel();
        const { email, password } = await request.validateUsing(config.loginValidator);
        const user = await UserModel.verifyCredentials(email, password);
        await auth.use(config.guard).login(user);
        session.flash('success', 'Signed in to admin.');
        return response.redirect().toIntended(config.path);
    }
    async destroy({ auth, response, session }) {
        const config = this.#config();
        await auth.use(config.guard).logout();
        session.flash('success', 'Signed out of admin.');
        return response.redirect().toPath(`${config.path.replace(/\/$/, '')}/login`);
    }
}
