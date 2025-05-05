import { Injectable } from '@nestjs/common';
import { TenantRepository } from '@novu/dal';
import { EnvironmentId } from '@novu/shared';

@Injectable()
export class GetDeletedTenants {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(environmentId: EnvironmentId) {
    return await this.tenantRepository.find({
      deleted: true,
      _environmentId: environmentId,
    });
  }
}
