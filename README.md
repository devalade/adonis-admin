# @devalade/adonis-admin

Filament-inspired admin panel for AdonisJS 7 + Inertia React.

## Install

```bash
npm install @devalade/adonis-admin
node ace configure:admin
```

For local development against this repo:

```bash
# in your Adonis app package.json
"@devalade/adonis-admin": "file:../adonis-admin"

pnpm install
cd ../adonis-admin && npm install && npm run build
```

`configure:admin` publishes:

- `config/admin.ts`
- `app/admin/register.ts`
- `start/admin.ts`
- `providers/admin_provider.ts`
- `inertia/admin/**` and `inertia/pages/admin/**`
- Patches `adonisrc.ts` (provider + `#start/admin` preload + package commands)
- Patches `start/kernel.ts` (named admin middleware aliases)

Register package commands in `adonisrc.ts`:

```ts
commands: [
  // ...
  () => import('@devalade/adonis-admin/commands'),
],
```

Use `--force` to overwrite existing stub files.

## Configure auth

Edit `config/admin.ts`:

```ts
import type { AdminPanelConfig } from '@devalade/adonis-admin/panel'
import { loginValidator } from '#validators/auth'

const adminConfig = {
  path: '/admin',
  guard: 'web',
  registerModule: '#app_admin/register',
  userModelModule: '#models/user',
  loginValidator,
  pagination: { defaultPerPage: 20, maxPerPage: 100 },
  bulkDestroy: { maxIds: 100 },
} satisfies AdminPanelConfig

export default adminConfig
```

## Register resources

```ts
// app/admin/register.ts
import { registerResources } from '@devalade/adonis-admin/registry'
import WaitlistSignupResource from '#app_admin/resources/waitlist_signup_resource'

export function registerAdminResources() {
  registerResources([WaitlistSignupResource])
}
```

Routes register in `start/admin.ts` via `bootAdminPanel()` — not in the provider boot hook.

## Generate a resource from a model

```bash
node ace make:admin-resource Customer
node ace make:admin-resource Customer --register
node ace make:admin-resource Customer --force
```

## Development

```bash
npm install
npm run typecheck
npm run build
```

## Public API

- `Resource`, table/form builders, `Action`, filters, fields
- `registerResources()`, `getDefaultResource()`, `bootAdminPanel()`, `AdminProvider`
- `configure:admin`, `make:admin-resource`

## Host responsibilities

- Resource classes in `app/admin/resources/`
- `config/admin.ts` (user model module + login validator)
- Inertia pages (published by `configure:admin`)

## Package responsibilities

- CRUD controller, session controller, middleware, routes
- Query service (search, sort, filters, pagination; SQLite-aware search)
- Resource registry and schema serialization
- Model introspection CLI
