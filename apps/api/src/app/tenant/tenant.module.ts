import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { CreateTenant, GetTenant, UpdateTenant, SoftDeleteTenant, RestoreTenant } from '@novu/application-generic';
import { DeleteTenant } from './usecases/delete-tenant/delete-tenant.usecase';
import { GetTenants } from './usecases/get-tenants/get-tenants.usecase';
import { featureFlagsService } from '@novu/application-generic/dist/custom-providers';
import { GetDeletedTenants } from './usecases/get-deleted-tenants/get-deleted-tenants.usecase';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TenantController],
  providers: [
    CreateTenant,
    GetTenant,
    UpdateTenant,
    DeleteTenant,
    GetTenants,
    featureFlagsService,
    GetDeletedTenants,
    SoftDeleteTenant,
    RestoreTenant,
  ],
  exports: [GetDeletedTenants],
})
export class TenantModule {}
