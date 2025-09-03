import { DatabaseModule } from '@/shared/infrastructure/database/database.module'
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'
import { {{module_name.pascalCase()}}PrismaRepository } from '@/{{module_folder_name}}/infrastructure/database/prisma/repositories/{{module_folder_name}}-prisma.repository'
import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '@/shared/domain/errors/not-found-error'
import { {{module_name.pascalCase()}}Entity } from '@/{{module_folder_name}}/domain/entities/{{module_folder_name}}.entity'
import { {{module_name.pascalCase()}}DataBuilder } from '@/{{module_folder_name}}/domain/testing/helpers/{{module_folder_name}}-data-builder'
import { List{{module_name.pascalCase()}}UseCase } from '../../list-{{module_folder_name}}.usecase'

describe('List{{module_name.pascalCase()}}UseCase integration tests', () => {
  const prismaService = new PrismaClient()
  let sut: List{{module_name.pascalCase()}}UseCase.UseCase
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
    sut = new List{{module_name.pascalCase()}}UseCase.UseCase(repository)
    await prismaService.{{module_name.camelCase()}}.deleteMany()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should return the items ordered by createdAt', async () => {
    const createdAt = new Date()
    const entities: {{module_name.pascalCase()}}Entity[] = []
    const arrange = Array(3).fill({{module_name.pascalCase()}}DataBuilder({}))
    arrange.forEach((element, index) => {
      entities.push(
        new {{module_name.pascalCase()}}Entity({
          ...element,
          email: `test${index}@mail.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }),
      )
    })
    await prismaService.{{module_name.camelCase()}}.createMany({
      data: entities.map(item => item.toJSON()),
    })

    const output = await sut.execute({})

    expect(output).toStrictEqual({
      items: entities.reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    })
  })

  it('should returns output using filter, sort and paginate', async () => {
    const createdAt = new Date()
    const entities: {{module_name.pascalCase()}}Entity[] = []
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt']
    arrange.forEach((element, index) => {
      entities.push(
        new {{module_name.pascalCase()}}Entity({
          ...{{module_name.pascalCase()}}DataBuilder({ name: element }),
          createdAt: new Date(createdAt.getTime() + index),
        }),
      )
    })

    await prismaService.{{module_name.camelCase()}}.createMany({
      data: entities.map(item => item.toJSON()),
    })

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    })

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    })

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    })
  })
})
