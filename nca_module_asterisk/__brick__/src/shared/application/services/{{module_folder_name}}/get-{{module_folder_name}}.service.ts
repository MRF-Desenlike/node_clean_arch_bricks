import { BadRequestException, Injectable } from '@nestjs/common'
import { GetTenantUseCase } from '@/tenants/application/usecases/get-tenant.usecase'
import { GetCompanyUseCase } from '@/companies/application/usecases/get-company.usecase'
import { Get{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/get-{{module_folder_name}}.usecase'

@Injectable()
export class Get{{module_name.pascalCase()}}Service {
  constructor(
    private readonly get{{module_name.pascalCase()}}UseCase: Get{{module_name.pascalCase()}}UseCase.UseCase,
    private readonly getTenantUseCase: GetTenantUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase.UseCase,
  ) {}

  async execute(input: Get{{module_name.pascalCase()}}UseCase.ServiceInput) {
    const { companyId, ...rest } = input

    if (!companyId) {
      throw new BadRequestException('Parâmetro companyId é obrigatório')
    }

    const company = await this.getCompanyUseCase.execute({ externalId: companyId as string })

    const tenant = await this.getTenantUseCase.execute({
      externalCompanyId: company.id,
    })

    const item = await this.get{{module_name.pascalCase()}}UseCase.execute({
      ...rest,
      tenant_id: tenant.id,
    })

    return item
  }
}
