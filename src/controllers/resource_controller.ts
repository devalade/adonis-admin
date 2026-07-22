import app from '@adonisjs/core/services/app'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { buildValidatorFromFields } from '../helpers/build_validator.js'
import type { AdminPanelConfig } from '../panel.js'
import type { ResourceConstructor } from '../resource.js'
import {
  queryResourceRows,
  serializeRecordForForm,
} from '../services/resource_query.js'

function adminConfig() {
  return app.config.get('admin') as AdminPanelConfig
}

const listQueryValidator = vine.create({
  page: vine.number().withoutDecimals().min(1).optional(),
  perPage: vine.number().withoutDecimals().min(1).max(100).optional(),
  search: vine.string().trim().maxLength(200).optional(),
  sort: vine.string().trim().maxLength(100).optional(),
  direction: vine.enum(['asc', 'desc']).optional(),
})

function bulkDestroyValidator(maxIds: number) {
  return vine.create({
    ids: vine.array(vine.number()).minLength(1).maxLength(maxIds),
  })
}

function getResourceFromContext(ctx: HttpContext) {
  return ctx.adminResource
}

function readFilters(ResourceClass: ResourceConstructor, query: Record<string, unknown>) {
  const filters: Record<string, string | undefined> = {}

  for (const filter of ResourceClass.getTable().getFilters()) {
    const value = query[filter.name]

    if (typeof value === 'string' && value.length > 0) {
      filters[filter.name] = value
    }
  }

  return filters
}

export default class AdminResourceController {
  async index(ctx: HttpContext) {
    const { request, inertia } = ctx
    const ResourceClass = getResourceFromContext(ctx)

    if (!ResourceClass.canView(ctx)) {
      return ctx.response.abort('Forbidden', 403)
    }

    const payload = await request.validateUsing(listQueryValidator, {
      data: request.qs(),
    })

    const filters = readFilters(ResourceClass, request.qs())
    const config = adminConfig()
    const { rows, metadata } = await queryResourceRows(ResourceClass, ctx, {
      page: payload.page ?? 1,
      perPage: Math.min(
        payload.perPage ?? ResourceClass.perPage,
        config.pagination.maxPerPage
      ),
      search: payload.search,
      sort: payload.sort,
      direction: payload.direction,
      filters,
    })

    const resource = ResourceClass.toSchema(ctx)

    return inertia.render('admin/resource/index' as any, {
      resource,
      rows,
      metadata,
      filters,
      search: payload.search,
      sort: ResourceClass.getSortColumn(payload.sort),
      direction: ResourceClass.getSortDirection(payload.direction),
      adminNav: ctx.adminNav,
    })
  }

  async create(ctx: HttpContext) {
    const { inertia } = ctx
    const ResourceClass = getResourceFromContext(ctx)

    if (!ResourceClass.canCreate(ctx)) {
      return ctx.response.abort('Forbidden', 403)
    }

    return inertia.render('admin/resource/form' as any, {
      resource: ResourceClass.toSchema(ctx),
      mode: 'create',
      adminNav: ctx.adminNav,
    })
  }

  async store(ctx: HttpContext) {
    const { request, session, response } = ctx
    const ResourceClass = getResourceFromContext(ctx)

    if (!ResourceClass.canCreate(ctx)) {
      return ctx.response.abort('Forbidden', 403)
    }

    const fields = ResourceClass.getForm().getFields()
    const validator = ResourceClass.validator ?? buildValidatorFromFields(fields, 'create')
    const payload = await request.validateUsing(validator)

    const record = await ResourceClass.model.create(payload)
    session.flash('success', `${ResourceClass.getSingularLabel()} created.`)

    return response
      .redirect()
      .toRoute(`admin.${ResourceClass.getRouteName()}.edit` as any, {
        id: record.$primaryKeyValue,
      })
  }

  async show(ctx: HttpContext) {
    const { params, inertia } = ctx
    const ResourceClass = getResourceFromContext(ctx)
    const record = await ResourceClass.model.findOrFail(params.id)

    if (!ResourceClass.canView(ctx)) {
      return ctx.response.abort('Forbidden', 403)
    }

    return inertia.render('admin/resource/show' as any, {
      resource: ResourceClass.toSchema(ctx),
      record: serializeRecordForForm(ResourceClass, record),
      adminNav: ctx.adminNav,
    })
  }

  async edit(ctx: HttpContext) {
    const { params, inertia } = ctx
    const ResourceClass = getResourceFromContext(ctx)
    const record = await ResourceClass.model.findOrFail(params.id)

    if (!ResourceClass.canEdit(ctx, record)) {
      return ctx.response.abort('Forbidden', 403)
    }

    return inertia.render('admin/resource/form' as any, {
      resource: ResourceClass.toSchema(ctx),
      record: serializeRecordForForm(ResourceClass, record),
      mode: 'edit',
      adminNav: ctx.adminNav,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, session, response } = ctx
    const ResourceClass = getResourceFromContext(ctx)
    const record = await ResourceClass.model.findOrFail(params.id)

    if (!ResourceClass.canEdit(ctx, record)) {
      return ctx.response.abort('Forbidden', 403)
    }

    const fields = ResourceClass.getForm().getFields()
    const validator =
      ResourceClass.updateValidator ??
      ResourceClass.validator ??
      buildValidatorFromFields(fields, 'update')
    const payload = await request.validateUsing(validator)

    record.merge(payload)
    await record.save()

    session.flash('success', `${ResourceClass.getSingularLabel()} updated.`)

    return response.redirect().back()
  }

  async destroy(ctx: HttpContext) {
    const { params, session, response } = ctx
    const ResourceClass = getResourceFromContext(ctx)
    const record = await ResourceClass.model.findOrFail(params.id)

    if (!ResourceClass.canDelete(ctx, record)) {
      return ctx.response.abort('Forbidden', 403)
    }

    await record.delete()

    session.flash('success', `${ResourceClass.getSingularLabel()} deleted.`)

    return response.redirect().toRoute(`admin.${ResourceClass.getRouteName()}.index` as any)
  }

  async bulkDestroy(ctx: HttpContext) {
    const { request, session, response } = ctx
    const ResourceClass = getResourceFromContext(ctx)
    const config = adminConfig()

    if (!ResourceClass.canView(ctx)) {
      return ctx.response.abort('Forbidden', 403)
    }

    const payload = await request.validateUsing(
      bulkDestroyValidator(config.bulkDestroy.maxIds)
    )
    const records = await ResourceClass.model.query().whereIn('id', payload.ids)

    let deletedCount = 0

    for (const record of records) {
      if (!ResourceClass.canDelete(ctx, record)) {
        continue
      }

      await record.delete()
      deletedCount++
    }

    session.flash('success', `${deletedCount} record(s) deleted.`)

    return response.redirect().toRoute(`admin.${ResourceClass.getRouteName()}.index` as any)
  }
}
