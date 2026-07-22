import vine from '@vinejs/vine';
import '../types/augmentations.js';
import { getAdminConfig } from '../helpers/admin_config.js';
import { adminResourceRoute } from '../helpers/admin_routes.js';
import { buildValidatorFromFields } from '../helpers/build_validator.js';
import { queryResourceRows, serializeRecordForForm, } from '../services/resource_query.js';
const listQueryValidator = vine.create({
    page: vine.number().withoutDecimals().min(1).optional(),
    perPage: vine.number().withoutDecimals().min(1).max(100).optional(),
    search: vine.string().trim().maxLength(200).optional(),
    sort: vine.string().trim().maxLength(100).optional(),
    direction: vine.enum(['asc', 'desc']).optional(),
});
function bulkDestroyValidator(maxIds) {
    return vine.create({
        ids: vine.array(vine.number()).minLength(1).maxLength(maxIds),
    });
}
function getResourceFromContext(ctx) {
    return ctx.adminResource;
}
function readFilters(ResourceClass, query) {
    const filters = {};
    for (const filter of ResourceClass.getTable().getFilters()) {
        const value = query[filter.name];
        if (typeof value === 'string' && value.length > 0) {
            filters[filter.name] = value;
        }
    }
    return filters;
}
export default class AdminResourceController {
    async index(ctx) {
        const { request, inertia } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        if (!ResourceClass.canView(ctx)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        const payload = await request.validateUsing(listQueryValidator, {
            data: request.qs(),
        });
        const filters = readFilters(ResourceClass, request.qs());
        const config = getAdminConfig();
        const { rows, metadata } = await queryResourceRows(ResourceClass, ctx, {
            page: payload.page ?? 1,
            perPage: Math.min(payload.perPage ?? ResourceClass.perPage, config.pagination.maxPerPage),
            search: payload.search,
            sort: payload.sort,
            direction: payload.direction,
            filters,
        });
        const resource = ResourceClass.toSchema(ctx);
        await inertia.render('admin/resource/index', {
            resource,
            rows,
            metadata,
            filters,
            search: payload.search,
            sort: ResourceClass.getSortColumn(payload.sort),
            direction: ResourceClass.getSortDirection(payload.direction),
            adminNav: ctx.adminNav,
        });
    }
    async create(ctx) {
        const { inertia } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        if (!ResourceClass.canCreate(ctx)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        await inertia.render('admin/resource/form', {
            resource: ResourceClass.toSchema(ctx),
            mode: 'create',
            adminNav: ctx.adminNav,
        });
    }
    async store(ctx) {
        const { request, session, response } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        if (!ResourceClass.canCreate(ctx)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        const fields = ResourceClass.getForm().getFields();
        const validator = ResourceClass.validator ?? buildValidatorFromFields(fields, 'create');
        const payload = await request.validateUsing(validator, { meta: undefined });
        const record = await ResourceClass.model.create(payload);
        session.flash('success', `${ResourceClass.getSingularLabel()} created.`);
        response
            .redirect()
            .toRoute(adminResourceRoute(ResourceClass.getRouteName(), 'edit'), {
            id: record.$primaryKeyValue,
        });
    }
    async show(ctx) {
        const { params, inertia } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        const record = await ResourceClass.model.findOrFail(params.id);
        if (!ResourceClass.canView(ctx)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        await inertia.render('admin/resource/show', {
            resource: ResourceClass.toSchema(ctx),
            record: serializeRecordForForm(ResourceClass, record),
            adminNav: ctx.adminNav,
        });
    }
    async edit(ctx) {
        const { params, inertia } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        const record = await ResourceClass.model.findOrFail(params.id);
        if (!ResourceClass.canEdit(ctx, record)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        await inertia.render('admin/resource/form', {
            resource: ResourceClass.toSchema(ctx),
            record: serializeRecordForForm(ResourceClass, record),
            mode: 'edit',
            adminNav: ctx.adminNav,
        });
    }
    async update(ctx) {
        const { params, request, session, response } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        const record = await ResourceClass.model.findOrFail(params.id);
        if (!ResourceClass.canEdit(ctx, record)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        const fields = ResourceClass.getForm().getFields();
        const validator = ResourceClass.updateValidator ??
            ResourceClass.validator ??
            buildValidatorFromFields(fields, 'update');
        const payload = await request.validateUsing(validator, { meta: undefined });
        record.merge(payload);
        await record.save();
        session.flash('success', `${ResourceClass.getSingularLabel()} updated.`);
        response.redirect().back();
    }
    async destroy(ctx) {
        const { params, session, response } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        const record = await ResourceClass.model.findOrFail(params.id);
        if (!ResourceClass.canDelete(ctx, record)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        await record.delete();
        session.flash('success', `${ResourceClass.getSingularLabel()} deleted.`);
        response.redirect().toRoute(adminResourceRoute(ResourceClass.getRouteName(), 'index'));
    }
    async bulkDestroy(ctx) {
        const { request, session, response } = ctx;
        const ResourceClass = getResourceFromContext(ctx);
        const config = getAdminConfig();
        if (!ResourceClass.canView(ctx)) {
            ctx.response.abort('Forbidden', 403);
            return;
        }
        const payload = await request.validateUsing(bulkDestroyValidator(config.bulkDestroy.maxIds));
        const records = await ResourceClass.model.query().whereIn('id', payload.ids);
        let deletedCount = 0;
        for (const record of records) {
            if (!ResourceClass.canDelete(ctx, record)) {
                continue;
            }
            await record.delete();
            deletedCount++;
        }
        session.flash('success', `${deletedCount} record(s) deleted.`);
        response.redirect().toRoute(adminResourceRoute(ResourceClass.getRouteName(), 'index'));
    }
}
