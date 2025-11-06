import { BadRequestException, Injectable } from '@nestjs/common'
import { Create{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/create-{{module_folder_name}}.usecase'
import { GetTenantUseCase } from '@/tenants/application/usecases/get-tenant.usecase'
import { GetCompanyUseCase } from '@/companies/application/usecases/get-company.usecase'

export type Create{{module_name.pascalCase()}}Input = {
  {{#fields}}{{ name }}{{#isOptional}}?{{/isOptional}}: {{ tsType }};
  {{/fields}}
  companyId: string;
}

@Injectable()
export class Create{{module_name.pascalCase()}}Service {
  constructor(
    private readonly create{{module_name.pascalCase()}}UseCase: Create{{module_name.pascalCase()}}UseCase.UseCase,
    private readonly getTenantUseCase: GetTenantUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase.UseCase,
  ) {}

  async execute(input: Create{{module_name.pascalCase()}}Input) {
    const { companyId, ...rest } = input

    const company = await this.getCompanyUseCase.execute({ externalId: companyId })

    const tenant = await this.getTenantUseCase.execute({
      externalCompanyId: company.id,
    })

    if (!tenant) {
      throw new BadRequestException('Empresa (companyId) não encontrada')
    }

    const item = await this.create{{module_name.pascalCase()}}UseCase.execute({
      ...rest,
      tenant_id: tenant.id,
    })

    return item
  }
}
