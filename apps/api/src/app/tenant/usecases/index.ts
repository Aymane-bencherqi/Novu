import { GetTenant, UpdateTenant, CreateTenant } from '@novu/application-generic';
import { DeleteTenant } from './delete-tenant/delete-tenant.usecase';
import { GetTenants } from './get-tenants/get-tenants.usecase';
import { GetDeletedTenants } from './get-deleted-tenants/get-deleted-tenants.usecase';

export const USE_CASES = [CreateTenant, GetTenant, UpdateTenant, DeleteTenant, GetTenants, GetDeletedTenants];

export { DeleteTenant } from './delete-tenant/delete-tenant.usecase';
export { GetTenants } from './get-tenants/get-tenants.usecase';
export { GetDeletedTenants } from './get-deleted-tenants/get-deleted-tenants.usecase';
