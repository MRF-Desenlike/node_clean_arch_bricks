import { BadRequestException, Injectable } from '@nestjs/common'
import { GetTenantUseCase } from '@/tenants/application/usecases/get-tenant.usecase'
import { GetCompanyUseCase } from '@/companies/application/usecases/get-company.usecase'
import { Update{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/update-{{module_folder_name}}.usecase'
import { Get{{module_name.pascalCase()}}UseCase } from '@/{{module_folder_name}}/application/usecases/get-{{module_folder_name}}.usecase'

export type Update{{module_name.pascalCase()}}Input = {
  id: number;
  companyId: string;
  {{#fields}}{{ name }}{{#isOptional}}?{{/isOptional}}: {{ tsType }};
  {{/fields}}
}

@Injectable()
export class Update{{module_name.pascalCase()}}Service {
  constructor(
    private readonly update{{module_name.pascalCase()}}UseCase: Update{{module_name.pascalCase()}}UseCase.UseCase,
    private readonly get{{module_name.pascalCase()}}UseCase: Get{{module_name.pascalCase()}}UseCase.UseCase,
    private readonly getTenantUseCase: GetTenantUseCase,
    private readonly getCompanyUseCase: GetCompanyUseCase.UseCase,
  ) {}

  async execute(input: Update{{module_name.pascalCase()}}Input) {
    const { id, companyId, ...rest } = input

    const company = await this.getCompanyUseCase.execute({ externalId: companyId })

    const tenant = await this.getTenantUseCase.execute({
      externalCompanyId: company.id,
    })

    if (!tenant) {
      throw new BadRequestException('Empresa (companyId) não encontrada')
    }

    const q = await this.get{{module_name.pascalCase()}}UseCase.execute({ id: input.id, tenant_id: tenant.id })

    const item = await this.update{{module_name.pascalCase()}}UseCase.execute({
      ...input,
      id: q.id as number,
      tenant_id: tenant.id,
    })

    return item
  }
}
