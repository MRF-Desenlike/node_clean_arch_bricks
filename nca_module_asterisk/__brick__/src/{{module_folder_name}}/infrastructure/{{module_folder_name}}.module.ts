import { Module } from '@nestjs/common'
import { {{module_name.pascalCase()}}Controller } from './{{module_folder_name}}.controller'
import { Create{{module_name.pascalCase()}}UseCase } from '../application/usecases/create-{{module_folder_name}}.usecase'
import { {{module_name.pascalCase()}}InMemoryRepository } from './database/in-memory/repositories/{{module_folder_name}}-in-memory.repository'
import { {{module_name.pascalCase()}}Repository } from '../domain/repositories/{{module_folder_name}}.repository'
import { Get{{module_name.pascalCase()}}UseCase } from '../application/usecases/get-{{module_folder_name}}.usecase'
import { List{{module_name.pascalCase()}}UseCase } from '../application/usecases/list-{{module_folder_name}}.usecase'
import { Update{{module_name.pascalCase()}}UseCase } from '../application/usecases/update-{{module_folder_name}}.usecase'
import { Delete{{module_name.pascalCase()}}UseCase } from '../application/usecases/delete-{{module_folder_name}}.usecase'
import { SoftDelete{{module_name.pascalCase()}}UseCase } from '../application/usecases/soft-delete-{{module_folder_name}}.usecase'
import { Restore{{module_name.pascalCase()}}UseCase } from '../application/usecases/restore-{{module_folder_name}}.usecase'
import { PrismaAsteriskService } from '@/shared/infrastructure/database/prismaAsterisk/prisma-asterisk.service'
import { {{module_name.pascalCase()}}PrismaRepository } from './database/prisma/repositories/{{module_folder_name}}-prisma.repository'
import { AuthModule } from '@/auth/infrastructure/auth.module'
import { TenantsModule } from '@/tenants/infrastructure/tenants.module'
import { CompaniesModule } from '@/companies/infrastructure/companies.module'
import { Create{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/create-{{module_folder_name}}.service'
import { List{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/list-{{module_folder_name}}.service'
import { Get{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/get-{{module_folder_name}}.service'
import { Update{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/update-{{module_folder_name}}.service'
import { Delete{{module_name.pascalCase()}}Service } from '@/shared/application/services/{{module_folder_name}}/delete-{{module_folder_name}}.service'

@Module({
  imports: [AuthModule, TenantsModule, CompaniesModule],
  controllers: [{{module_name.pascalCase()}}Controller],
  providers: [
    {
      provide: 'PrismaAsteriskService',
      useClass: PrismaAsteriskService,
    },
    {
      provide: '{{module_name.pascalCase()}}Repository',
      useFactory: (prismaAsteriskService: PrismaAsteriskService) => {
        return new {{module_name.pascalCase()}}PrismaRepository(prismaAsteriskService)
      },
      inject: ['PrismaAsteriskService'],
    },
    {
      provide: Create{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: (
        {{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository,
      ) => {
        return new Create{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    {
      provide: Get{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: ({{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) => {
        return new Get{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    {
      provide: List{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: ({{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) => {
        return new List{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    {
      provide: Update{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: ({{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) => {
        return new Update{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    {
      provide: Delete{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: ({{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) => {
        return new Delete{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    {
      provide: SoftDelete{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: ({{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) => {
        return new SoftDelete{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    {
      provide: Restore{{module_name.pascalCase()}}UseCase.UseCase,
      useFactory: ({{module_name.camelCase()}}Repository: {{module_name.pascalCase()}}Repository.Repository) => {
        return new Restore{{module_name.pascalCase()}}UseCase.UseCase({{module_name.camelCase()}}Repository)
      },
      inject: ['{{module_name.pascalCase()}}Repository'],
    },
    Create{{module_name.pascalCase()}}Service,
    List{{module_name.pascalCase()}}Service,
    Get{{module_name.pascalCase()}}Service,
    Update{{module_name.pascalCase()}}Service,
    Delete{{module_name.pascalCase()}}Service,
  ],
})
export class {{module_name.pascalCase()}}Module {}
