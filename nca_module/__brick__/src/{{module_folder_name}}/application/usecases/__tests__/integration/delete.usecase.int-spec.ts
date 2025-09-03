import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { {{module_name.pascalCase()}}PrismaRepository } from '@/{{module_folder_name}}/infrastructure/database/prisma/repositories/{{module_folder_name}}-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { Delete{{module_name.pascalCase()}}UseCase } from '../../delete-{{module_folder_name}}.usecase'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'

describe('DeleteUseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: Delete{{module_name.pascalCase()}}UseCase.UseCase
  let repository: {{module_name.pascalCase()}}PrismaRepository
  let module: TestingModule

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile()
    repository = new {{module_name.pascalCase()}}PrismaRepository(prismaService as any)
  })

  beforeEach(async () => {
    sut = new Delete{{module_name.pascalCase()}}UseCase.UseCase(repository)
    await prismaService.{{module_name.camelCase()}}.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('{{module_name.pascalCase()}}Model not found using ID fakeId'),
    )
  })

  it('should delete a item', async () => {
    const entity = new {{module_name.pascalCase()}}Entity({{module_name.pascalCase()}}DataBuilder({}))
    const new{{module_name.pascalCase()}} = await prismaService.{{module_name.camelCase()}}.create({
      data: entity.toJSON(),
    })
    await sut.execute({ id: entity._id })

    const output = await prismaService.{{module_name.camelCase()}}.findUnique({
      where: {
        id: entity._id,
      },
    })
    expect(output).toBeNull()
    const models = await prismaService.{{module_name.camelCase()}}.findMany()
    expect(models).toHaveLength(0)
  })
})
